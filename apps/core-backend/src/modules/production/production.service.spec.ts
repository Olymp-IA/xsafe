import { Test, TestingModule } from '@nestjs/testing';
import { ProductionService } from './production.service';
import { PrismaService } from '../../shared/prisma';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductionStatus, StageStatus, PriorityLevel, ProductionStageType } from '@prisma/client';

describe('ProductionService', () => {
    let service: ProductionService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        customer: {
            findFirst: jest.fn(),
        },
        product: {
            findMany: jest.fn(),
        },
        productionOrder: {
            create: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
        },
        productionStage: {
            create: jest.fn(),
            findMany: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
        },
        machine: {
            findFirst: jest.fn(),
        },
        $transaction: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductionService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<ProductionService>(ProductionService);
        prismaService = module.get<PrismaService>(PrismaService);

        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        const workshopId = 'workshop1';
        const createOrderDto = {
            customerId: 'customer1',
            items: [{ productId: 'product1', quantity: 2 }],
            dueDate: '2024-12-31T23:59:59Z',
            priority: PriorityLevel.MEDIUM,
        };

        it('should create a new production order', async () => {
            const mockOrder = {
                id: 'order1',
                orderNumber: 'ORD-2401-0001',
                status: ProductionStatus.DESIGN_APPROVAL,
                items: [],
                customer: { id: 'customer1', name: 'Test Customer' },
            };

            mockPrismaService.customer.findFirst.mockResolvedValue({ id: 'customer1' });
            mockPrismaService.product.findMany.mockResolvedValue([{ id: 'product1' }]);
            mockPrismaService.$transaction.mockResolvedValue(mockOrder);

            const result = await service.createOrder(workshopId, createOrderDto);

            expect(result).toEqual(mockOrder);
            expect(mockPrismaService.customer.findFirst).toHaveBeenCalledWith({
                where: { id: 'customer1', workshopId },
            });
        });

        it('should throw NotFoundException if customer not found', async () => {
            mockPrismaService.customer.findFirst.mockResolvedValue(null);

            await expect(service.createOrder(workshopId, createOrderDto)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if product not found', async () => {
            mockPrismaService.customer.findFirst.mockResolvedValue({ id: 'customer1' });
            mockPrismaService.product.findMany.mockResolvedValue([]);

            await expect(service.createOrder(workshopId, createOrderDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAllOrders', () => {
        it('should return all orders for workshop', async () => {
            const mockOrders = [
                { id: 'order1', orderNumber: 'ORD-001' },
                { id: 'order2', orderNumber: 'ORD-002' },
            ];
            mockPrismaService.productionOrder.findMany.mockResolvedValue(mockOrders);

            const result = await service.findAllOrders('workshop1');

            expect(result).toEqual(mockOrders);
            expect(mockPrismaService.productionOrder.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { workshopId: 'workshop1' } }),
            );
        });
    });

    describe('findOrderById', () => {
        it('should return order by id', async () => {
            const mockOrder = { id: 'order1', orderNumber: 'ORD-001', stages: [] };
            mockPrismaService.productionOrder.findFirst.mockResolvedValue(mockOrder);

            const result = await service.findOrderById('order1', 'workshop1');

            expect(result).toEqual(mockOrder);
        });

        it('should throw NotFoundException if order not found', async () => {
            mockPrismaService.productionOrder.findFirst.mockResolvedValue(null);

            await expect(service.findOrderById('order1', 'workshop1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('startProduction', () => {
        it('should start production for an order in DESIGN_APPROVAL status', async () => {
            const mockOrder = {
                id: 'order1',
                status: ProductionStatus.DESIGN_APPROVAL,
                stages: [{ id: 'stage1', stageType: ProductionStageType.CUTTING }],
            };
            mockPrismaService.productionOrder.findFirst.mockResolvedValue(mockOrder);
            mockPrismaService.$transaction.mockResolvedValue([{}, {}]);

            const result = await service.startProduction('order1', 'workshop1');

            expect(result.message).toBe('Production started');
        });

        it('should throw BadRequestException if order not in DESIGN_APPROVAL', async () => {
            const mockOrder = {
                id: 'order1',
                status: ProductionStatus.CUTTING,
                stages: [],
            };
            mockPrismaService.productionOrder.findFirst.mockResolvedValue(mockOrder);

            await expect(service.startProduction('order1', 'workshop1')).rejects.toThrow(BadRequestException);
        });
    });

    describe('getWorkshopStats', () => {
        it('should return workshop statistics', async () => {
            mockPrismaService.productionOrder.count
                .mockResolvedValueOnce(100)  // total
                .mockResolvedValueOnce(20)   // inProgress
                .mockResolvedValueOnce(75)   // completed
                .mockResolvedValueOnce(5);   // cancelled

            const result = await service.getWorkshopStats('workshop1');

            expect(result.totalOrders).toBe(100);
            expect(result.inProgress).toBe(20);
            expect(result.completed).toBe(75);
            expect(result.cancelled).toBe(5);
            expect(result.completionRate).toBe('75.0');
        });
    });
});
