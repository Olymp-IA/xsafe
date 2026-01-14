import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma';
import { CreateInspectionDto, CompleteInspectionDto } from './dto';
import { QualityStatus, StageStatus } from '@prisma/client';

@Injectable()
export class QualityService {
    constructor(private readonly prisma: PrismaService) { }

    async createInspection(inspectorId: string, workshopId: string, createDto: CreateInspectionDto) {
        // Verify stage belongs to workshop
        const stage = await this.prisma.productionStage.findFirst({
            where: { id: createDto.stageId },
            include: { order: true, qualityCheck: true },
        });

        if (!stage || stage.order.workshopId !== workshopId) {
            throw new NotFoundException('Stage not found');
        }

        if (stage.qualityCheck) {
            throw new BadRequestException('Quality check already exists for this stage');
        }

        return this.prisma.qualityCheck.create({
            data: {
                stageId: createDto.stageId,
                inspectorId,
                status: QualityStatus.IN_PROGRESS,
                notes: createDto.notes,
                measurements: createDto.measurements,
                photos: createDto.photos || [],
            },
            include: { stage: true, inspector: true },
        });
    }

    async completeInspection(inspectionId: string, workshopId: string, completeDto: CompleteInspectionDto) {
        const inspection = await this.prisma.qualityCheck.findFirst({
            where: { id: inspectionId },
            include: { stage: { include: { order: true } } },
        });

        if (!inspection || inspection.stage.order.workshopId !== workshopId) {
            throw new NotFoundException('Inspection not found');
        }

        // Update inspection
        const updated = await this.prisma.qualityCheck.update({
            where: { id: inspectionId },
            data: {
                status: completeDto.status,
                passed: completeDto.passed,
                notes: completeDto.notes,
            },
            include: { stage: true, inspector: true },
        });

        // If passed, mark stage as completed
        if (completeDto.passed) {
            await this.prisma.productionStage.update({
                where: { id: inspection.stageId },
                data: {
                    status: StageStatus.COMPLETED,
                    completedAt: new Date(),
                },
            });
        } else if (completeDto.status === QualityStatus.REWORK_REQUIRED) {
            await this.prisma.productionStage.update({
                where: { id: inspection.stageId },
                data: { status: StageStatus.BLOCKED },
            });
        }

        return updated;
    }

    async findAllInspections(workshopId: string) {
        return this.prisma.qualityCheck.findMany({
            where: { stage: { order: { workshopId } } },
            include: {
                stage: { include: { order: { include: { customer: true } } } },
                inspector: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findInspectionById(id: string, workshopId: string) {
        const inspection = await this.prisma.qualityCheck.findFirst({
            where: { id, stage: { order: { workshopId } } },
            include: {
                stage: { include: { order: { include: { customer: true } } } },
                inspector: true,
            },
        });

        if (!inspection) {
            throw new NotFoundException('Inspection not found');
        }

        return inspection;
    }

    async getPendingInspections(workshopId: string) {
        return this.prisma.qualityCheck.findMany({
            where: {
                status: { in: [QualityStatus.PENDING, QualityStatus.IN_PROGRESS] },
                stage: { order: { workshopId } },
            },
            include: {
                stage: { include: { order: true } },
                inspector: true,
            },
        });
    }

    async getQualityStats(workshopId: string) {
        const [total, passed, failed, rework] = await Promise.all([
            this.prisma.qualityCheck.count({ where: { stage: { order: { workshopId } } } }),
            this.prisma.qualityCheck.count({ where: { passed: true, stage: { order: { workshopId } } } }),
            this.prisma.qualityCheck.count({ where: { passed: false, stage: { order: { workshopId } } } }),
            this.prisma.qualityCheck.count({
                where: { status: QualityStatus.REWORK_REQUIRED, stage: { order: { workshopId } } },
            }),
        ]);

        return {
            total,
            passed,
            failed,
            rework,
            firstPassYield: total > 0 ? ((passed / total) * 100).toFixed(1) : 0,
        };
    }
}
