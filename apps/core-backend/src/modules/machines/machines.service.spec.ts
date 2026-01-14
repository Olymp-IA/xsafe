import { Test, TestingModule } from '@nestjs/testing';
import { MachinesService } from './machines.service';
import { PrismaService } from '../../shared/prisma';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { MachineType, MachineStatus } from '@prisma/client';

describe('MachinesService', () => {
    let service: MachinesService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        machine: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MachinesService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<MachinesService>(MachinesService);
        prismaService = module.get<PrismaService>(PrismaService);

        jest.clearAllMocks();
    });

    describe('createMachine', () => {
        const workshopId = 'workshop1';
        const createDto = {
            code: 'MCH-001',
            name: 'Test Laser Cutter',
            type: MachineType.LASER_CUTTER,
            brand: 'TestBrand',
            model: 'Model X',
            capacity: '10mm steel',
        };

        it('should create a new machine', async () => {
            const mockMachine = { id: 'mach1', ...createDto, status: MachineStatus.AVAILABLE };
            mockPrismaService.machine.findUnique.mockResolvedValue(null);
            mockPrismaService.machine.create.mockResolvedValue(mockMachine);

            const result = await service.createMachine(workshopId, createDto);

            expect(result).toEqual(mockMachine);
        });

        it('should throw ConflictException if code already exists', async () => {
            mockPrismaService.machine.findUnique.mockResolvedValue({ id: 'existing' });

            await expect(service.createMachine(workshopId, createDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findAllMachines', () => {
        it('should return all machines for workshop', async () => {
            const mockMachines = [
                { id: 'mach1', name: 'Machine 1' },
                { id: 'mach2', name: 'Machine 2' },
            ];
            mockPrismaService.machine.findMany.mockResolvedValue(mockMachines);

            const result = await service.findAllMachines('workshop1');

            expect(result).toEqual(mockMachines);
        });
    });

    describe('findMachineById', () => {
        it('should return machine by id', async () => {
            const mockMachine = { id: 'mach1', name: 'Test Machine' };
            mockPrismaService.machine.findFirst.mockResolvedValue(mockMachine);

            const result = await service.findMachineById('mach1', 'workshop1');

            expect(result).toEqual(mockMachine);
        });

        it('should throw NotFoundException if machine not found', async () => {
            mockPrismaService.machine.findFirst.mockResolvedValue(null);

            await expect(service.findMachineById('mach1', 'workshop1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateStatus', () => {
        it('should update machine status', async () => {
            mockPrismaService.machine.findFirst.mockResolvedValue({ id: 'mach1' });
            mockPrismaService.machine.update.mockResolvedValue({ id: 'mach1', status: MachineStatus.MAINTENANCE });

            const result = await service.updateStatus('mach1', 'workshop1', {
                status: MachineStatus.MAINTENANCE,
            });

            expect(result.status).toBe(MachineStatus.MAINTENANCE);
        });

        it('should set lastMaintenance when status is MAINTENANCE', async () => {
            mockPrismaService.machine.findFirst.mockResolvedValue({ id: 'mach1' });
            mockPrismaService.machine.update.mockResolvedValue({});

            await service.updateStatus('mach1', 'workshop1', { status: MachineStatus.MAINTENANCE });

            expect(mockPrismaService.machine.update).toHaveBeenCalledWith({
                where: { id: 'mach1' },
                data: expect.objectContaining({ lastMaintenance: expect.any(Date) }),
            });
        });
    });

    describe('getAvailableMachines', () => {
        it('should return only available machines', async () => {
            const mockMachines = [
                { id: 'mach1', status: MachineStatus.AVAILABLE },
            ];
            mockPrismaService.machine.findMany.mockResolvedValue(mockMachines);

            const result = await service.getAvailableMachines('workshop1');

            expect(mockPrismaService.machine.findMany).toHaveBeenCalledWith({
                where: { workshopId: 'workshop1', status: MachineStatus.AVAILABLE },
            });
        });
    });

    describe('getMachineStats', () => {
        it('should return machine statistics', async () => {
            const mockMachines = [
                { id: 'mach1', status: MachineStatus.AVAILABLE },
                { id: 'mach2', status: MachineStatus.AVAILABLE },
                { id: 'mach3', status: MachineStatus.IN_USE },
                { id: 'mach4', status: MachineStatus.MAINTENANCE },
                { id: 'mach5', status: MachineStatus.BROKEN },
            ];
            mockPrismaService.machine.findMany.mockResolvedValue(mockMachines);

            const result = await service.getMachineStats('workshop1');

            expect(result.total).toBe(5);
            expect(result.available).toBe(2);
            expect(result.inUse).toBe(1);
            expect(result.maintenance).toBe(1);
            expect(result.broken).toBe(1);
        });
    });
});
