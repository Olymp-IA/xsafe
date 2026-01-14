import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../../shared/prisma';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { MaterialType, MaterialUnit } from '@prisma/client';
import { AdjustmentType } from './dto';

describe('InventoryService', () => {
    let service: InventoryService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        material: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InventoryService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<InventoryService>(InventoryService);
        prismaService = module.get<PrismaService>(PrismaService);

        jest.clearAllMocks();
    });

    describe('createMaterial', () => {
        const workshopId = 'workshop1';
        const createDto = {
            code: 'MAT-001',
            name: 'Test Material',
            type: MaterialType.ACERO_4130,
            thickness: 2,
            width: 25,
            length: 6000,
            quantity: 100,
            unit: MaterialUnit.METER,
        };

        it('should create a new material', async () => {
            const mockMaterial = { id: 'mat1', ...createDto };
            mockPrismaService.material.findUnique.mockResolvedValue(null);
            mockPrismaService.material.create.mockResolvedValue(mockMaterial);

            const result = await service.createMaterial(workshopId, createDto);

            expect(result).toEqual(mockMaterial);
        });

        it('should throw ConflictException if code already exists', async () => {
            mockPrismaService.material.findUnique.mockResolvedValue({ id: 'existing' });

            await expect(service.createMaterial(workshopId, createDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findAllMaterials', () => {
        it('should return all materials for workshop', async () => {
            const mockMaterials = [
                { id: 'mat1', name: 'Material 1' },
                { id: 'mat2', name: 'Material 2' },
            ];
            mockPrismaService.material.findMany.mockResolvedValue(mockMaterials);

            const result = await service.findAllMaterials('workshop1');

            expect(result).toEqual(mockMaterials);
        });
    });

    describe('findMaterialById', () => {
        it('should return material by id', async () => {
            const mockMaterial = { id: 'mat1', name: 'Test Material' };
            mockPrismaService.material.findFirst.mockResolvedValue(mockMaterial);

            const result = await service.findMaterialById('mat1', 'workshop1');

            expect(result).toEqual(mockMaterial);
        });

        it('should throw NotFoundException if material not found', async () => {
            mockPrismaService.material.findFirst.mockResolvedValue(null);

            await expect(service.findMaterialById('mat1', 'workshop1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('adjustStock', () => {
        const mockMaterial = { id: 'mat1', quantity: 50 };

        it('should add to stock', async () => {
            mockPrismaService.material.findFirst.mockResolvedValue(mockMaterial);
            mockPrismaService.material.update.mockResolvedValue({ ...mockMaterial, quantity: 60 });

            const result = await service.adjustStock('mat1', 'workshop1', {
                type: AdjustmentType.ADD,
                amount: 10,
            });

            expect(mockPrismaService.material.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: { quantity: 60 } }),
            );
        });

        it('should subtract from stock', async () => {
            mockPrismaService.material.findFirst.mockResolvedValue(mockMaterial);
            mockPrismaService.material.update.mockResolvedValue({ ...mockMaterial, quantity: 40 });

            const result = await service.adjustStock('mat1', 'workshop1', {
                type: AdjustmentType.SUBTRACT,
                amount: 10,
            });

            expect(mockPrismaService.material.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: { quantity: 40 } }),
            );
        });

        it('should set stock to specific value', async () => {
            mockPrismaService.material.findFirst.mockResolvedValue(mockMaterial);
            mockPrismaService.material.update.mockResolvedValue({ ...mockMaterial, quantity: 100 });

            const result = await service.adjustStock('mat1', 'workshop1', {
                type: AdjustmentType.SET,
                amount: 100,
            });

            expect(mockPrismaService.material.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: { quantity: 100 } }),
            );
        });

        it('should not go below zero when subtracting', async () => {
            mockPrismaService.material.findFirst.mockResolvedValue({ ...mockMaterial, quantity: 5 });
            mockPrismaService.material.update.mockResolvedValue({ ...mockMaterial, quantity: 0 });

            await service.adjustStock('mat1', 'workshop1', {
                type: AdjustmentType.SUBTRACT,
                amount: 10,
            });

            expect(mockPrismaService.material.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: { quantity: 0 } }),
            );
        });
    });

    describe('getLowStockMaterials', () => {
        it('should return materials below minimum stock', async () => {
            const mockMaterials = [
                { id: 'mat1', quantity: 5, minStock: 10 },
                { id: 'mat2', quantity: 50, minStock: 20 },
                { id: 'mat3', quantity: 15, minStock: 15 },
            ];
            mockPrismaService.material.findMany.mockResolvedValue(mockMaterials);

            const result = await service.getLowStockMaterials('workshop1');

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('mat1');
            expect(result[1].id).toBe('mat3');
        });
    });

    describe('consumeMaterial', () => {
        it('should consume material successfully', async () => {
            mockPrismaService.material.findFirst.mockResolvedValue({ id: 'mat1', quantity: 50 });
            mockPrismaService.material.update.mockResolvedValue({ id: 'mat1', quantity: 40 });

            const result = await service.consumeMaterial('mat1', 'workshop1', 10);

            expect(mockPrismaService.material.update).toHaveBeenCalledWith(
                expect.objectContaining({ data: { quantity: 40 } }),
            );
        });

        it('should throw ConflictException if insufficient stock', async () => {
            mockPrismaService.material.findFirst.mockResolvedValue({ id: 'mat1', quantity: 5 });

            await expect(service.consumeMaterial('mat1', 'workshop1', 10)).rejects.toThrow(ConflictException);
        });
    });
});
