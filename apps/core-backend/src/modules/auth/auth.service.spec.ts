import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../shared/prisma';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn(),
}));

describe('AuthService', () => {
    let service: AuthService;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        workshop: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        $transaction: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mockToken'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);

        // Reset mocks
        jest.clearAllMocks();
    });

    describe('register', () => {
        const registerDto = {
            workshopName: 'Test Workshop',
            taxId: '12-34567890-0',
            adminEmail: 'admin@test.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'Password123!',
            address: '123 Test St',
            phone: '+54 11 1234-5678',
        };

        it('should register a new workshop and admin user', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockPrismaService.workshop.findUnique.mockResolvedValue(null);
            mockPrismaService.$transaction.mockImplementation(async (callback) => {
                return callback({
                    workshop: {
                        create: jest.fn().mockResolvedValue({ id: 'workshop1', name: 'Test Workshop' }),
                    },
                    user: {
                        create: jest.fn().mockResolvedValue({
                            id: 'user1',
                            email: 'admin@test.com',
                            role: 'ADMIN',
                            workshopId: 'workshop1',
                        }),
                    },
                });
            });

            const result = await service.register(registerDto);

            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
            expect(result.message).toBe('Workshop registered successfully');
        });

        it('should throw ConflictException if email already exists', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existing' });

            await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
        });

        it('should throw ConflictException if taxId already exists', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            mockPrismaService.workshop.findUnique.mockResolvedValue({ id: 'existing' });

            await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('login', () => {
        const loginDto = {
            email: 'user@test.com',
            password: 'Password123!',
        };

        const mockUser = {
            id: 'user1',
            email: 'user@test.com',
            password: 'hashedPassword',
            firstName: 'John',
            lastName: 'Doe',
            role: 'ADMIN',
            workshopId: 'workshop1',
            workshop: { id: 'workshop1', name: 'Test Workshop' },
        };

        it('should login successfully with valid credentials', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.login(loginDto);

            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
            expect(result.user.email).toBe(loginDto.email);
        });

        it('should throw UnauthorizedException if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password is invalid', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('changePassword', () => {
        const changePasswordDto = {
            currentPassword: 'OldPassword123!',
            newPassword: 'NewPassword456!',
        };

        const mockUser = {
            id: 'user1',
            password: 'hashedOldPassword',
        };

        it('should change password successfully', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            mockPrismaService.user.update.mockResolvedValue({ ...mockUser, password: 'hashedNewPassword' });

            const result = await service.changePassword('user1', changePasswordDto);

            expect(result.message).toBe('Password changed successfully');
        });

        it('should throw NotFoundException if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.changePassword('user1', changePasswordDto)).rejects.toThrow(NotFoundException);
        });

        it('should throw UnauthorizedException if current password is incorrect', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.changePassword('user1', changePasswordDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('getProfile', () => {
        const mockUser = {
            id: 'user1',
            email: 'user@test.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'ADMIN',
            workshop: { id: 'workshop1', name: 'Test Workshop' },
        };

        it('should return user profile', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.getProfile('user1');

            expect(result.email).toBe('user@test.com');
            expect(result.firstName).toBe('John');
        });

        it('should throw NotFoundException if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.getProfile('user1')).rejects.toThrow(NotFoundException);
        });
    });
});
