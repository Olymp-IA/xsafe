import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma';
import { CreateMachineDto, UpdateMachineStatusDto } from './dto';
import { MachineStatus } from '@prisma/client';

@Injectable()
export class MachinesService {
    constructor(private readonly prisma: PrismaService) { }

    async createMachine(workshopId: string, createDto: CreateMachineDto) {
        const existing = await this.prisma.machine.findUnique({
            where: { code: createDto.code },
        });

        if (existing) {
            throw new ConflictException('Machine with this code already exists');
        }

        return this.prisma.machine.create({
            data: {
                ...createDto,
                workshopId,
                status: createDto.status || MachineStatus.AVAILABLE,
            },
        });
    }

    async findAllMachines(workshopId: string) {
        return this.prisma.machine.findMany({
            where: { workshopId },
            orderBy: { name: 'asc' },
        });
    }

    async findMachineById(id: string, workshopId: string) {
        const machine = await this.prisma.machine.findFirst({
            where: { id, workshopId },
        });

        if (!machine) {
            throw new NotFoundException('Machine not found');
        }

        return machine;
    }

    async updateStatus(id: string, workshopId: string, updateDto: UpdateMachineStatusDto) {
        await this.findMachineById(id, workshopId);

        return this.prisma.machine.update({
            where: { id },
            data: {
                status: updateDto.status,
                lastMaintenance: updateDto.status === MachineStatus.MAINTENANCE ? new Date() : undefined,
                nextMaintenance: updateDto.nextMaintenance ? new Date(updateDto.nextMaintenance) : undefined,
            },
        });
    }

    async getAvailableMachines(workshopId: string) {
        return this.prisma.machine.findMany({
            where: { workshopId, status: MachineStatus.AVAILABLE },
        });
    }

    async getMachineStats(workshopId: string) {
        const machines = await this.prisma.machine.findMany({ where: { workshopId } });

        const statusCounts = machines.reduce((acc, m) => {
            acc[m.status] = (acc[m.status] || 0) + 1;
            return acc;
        }, {} as Record<MachineStatus, number>);

        return {
            total: machines.length,
            available: statusCounts[MachineStatus.AVAILABLE] || 0,
            inUse: statusCounts[MachineStatus.IN_USE] || 0,
            maintenance: statusCounts[MachineStatus.MAINTENANCE] || 0,
            broken: statusCounts[MachineStatus.BROKEN] || 0,
        };
    }
}
