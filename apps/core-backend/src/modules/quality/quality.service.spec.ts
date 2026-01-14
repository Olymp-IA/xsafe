import { Test, TestingModule } from '@nestjs/testing';
import { QualityService } from './quality.service';
import { PrismaService } from '../../shared/prisma';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { QualityStatus, StageStatus } from '@prisma/client';

describe('QualityService', () => {
    let service: QualityService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        productionStage: {
            findFirst: jest.fn(),
            update: jest.fn(),
        },
        qualityCheck: {
            create: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QualityService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<QualityService>(QualityService);
        prismaService = module.get<PrismaService>(PrismaService);

        jest.clearAllMocks();
    });

    describe('createInspection', () => {
        const inspectorId = 'inspector1';
        const workshopId = 'workshop1';
        const createDto = {
            stageId: 'stage1',
            measurements: { welds: 12, dimensions: [] },
            notes: 'Test inspection',
        };

        it('should create a new inspection', async () => {
            const mockStage = {
                id: 'stage1',
                order: { workshopId: 'workshop1' },
                qualityCheck: null,
            };
            const mockInspection = { id: 'insp1', status: QualityStatus.IN_PROGRESS };

            mockPrismaService.productionStage.findFirst.mockResolvedValue(mockStage);
            mockPrismaService.qualityCheck.create.mockResolvedValue(mockInspection);

            const result = await service.createInspection(inspectorId, workshopId, createDto);

            expect(result).toEqual(mockInspection);
        });

        it('should throw NotFoundException if stage not found', async () => {
            mockPrismaService.productionStage.findFirst.mockResolvedValue(null);

            await expect(service.createInspection(inspectorId, workshopId, createDto)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if inspection already exists', async () => {
            const mockStage = {
                id: 'stage1',
                order: { workshopId: 'workshop1' },
                qualityCheck: { id: 'existing' },
            };
            mockPrismaService.productionStage.findFirst.mockResolvedValue(mockStage);

            await expect(service.createInspection(inspectorId, workshopId, createDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('completeInspection', () => {
        const workshopId = 'workshop1';

        it('should mark stage as completed when passed', async () => {
            const mockInspection = {
                id: 'insp1',
                stageId: 'stage1',
                stage: { order: { workshopId: 'workshop1' } },
            };

            mockPrismaService.qualityCheck.findFirst.mockResolvedValue(mockInspection);
            mockPrismaService.qualityCheck.update.mockResolvedValue({ ...mockInspection, passed: true });
            mockPrismaService.productionStage.update.mockResolvedValue({});

            const result = await service.completeInspection('insp1', workshopId, {
                status: QualityStatus.PASSED,
                passed: true,
            });

            expect(mockPrismaService.productionStage.update).toHaveBeenCalledWith({
                where: { id: 'stage1' },
                data: { status: StageStatus.COMPLETED, completedAt: expect.any(Date) },
            });
        });

        it('should mark stage as blocked when rework required', async () => {
            const mockInspection = {
                id: 'insp1',
                stageId: 'stage1',
                stage: { order: { workshopId: 'workshop1' } },
            };

            mockPrismaService.qualityCheck.findFirst.mockResolvedValue(mockInspection);
            mockPrismaService.qualityCheck.update.mockResolvedValue({ ...mockInspection, passed: false });
            mockPrismaService.productionStage.update.mockResolvedValue({});

            await service.completeInspection('insp1', workshopId, {
                status: QualityStatus.REWORK_REQUIRED,
                passed: false,
            });

            expect(mockPrismaService.productionStage.update).toHaveBeenCalledWith({
                where: { id: 'stage1' },
                data: { status: StageStatus.BLOCKED },
            });
        });
    });

    describe('getQualityStats', () => {
        it('should return quality statistics', async () => {
            mockPrismaService.qualityCheck.count
                .mockResolvedValueOnce(100)  // total
                .mockResolvedValueOnce(85)   // passed
                .mockResolvedValueOnce(10)   // failed
                .mockResolvedValueOnce(5);   // rework

            const result = await service.getQualityStats('workshop1');

            expect(result.total).toBe(100);
            expect(result.passed).toBe(85);
            expect(result.failed).toBe(10);
            expect(result.rework).toBe(5);
            expect(result.firstPassYield).toBe('85.0');
        });
    });
});
