import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../shared/prisma';
import { RegisterWorkshopDto, LoginDto, ChangePasswordDto } from './dto';
import { JwtPayload } from './interfaces';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterWorkshopDto) {
        // Check if email already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.adminEmail },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Check if workshop taxId already exists
        const existingWorkshop = await this.prisma.workshop.findUnique({
            where: { taxId: registerDto.taxId },
        });

        if (existingWorkshop) {
            throw new ConflictException('Workshop with this tax ID already exists');
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

        // Create workshop and admin user in a transaction
        const result = await this.prisma.$transaction(async (tx) => {
            const workshop = await tx.workshop.create({
                data: {
                    name: registerDto.workshopName,
                    taxId: registerDto.taxId,
                    address: registerDto.address,
                    phone: registerDto.phone,
                    email: registerDto.adminEmail,
                },
            });

            const user = await tx.user.create({
                data: {
                    email: registerDto.adminEmail,
                    password: hashedPassword,
                    firstName: registerDto.firstName,
                    lastName: registerDto.lastName,
                    role: UserRole.ADMIN,
                    workshopId: workshop.id,
                },
            });

            return { workshop, user };
        });

        // Generate tokens
        const tokens = await this.generateTokens(result.user);

        return {
            message: 'Workshop registered successfully',
            workshop: {
                id: result.workshop.id,
                name: result.workshop.name,
            },
            user: {
                id: result.user.id,
                email: result.user.email,
                role: result.user.role,
            },
            ...tokens,
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
            include: { workshop: true },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                workshop: {
                    id: user.workshop.id,
                    name: user.workshop.name,
                },
            },
            ...tokens,
        };
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isCurrentPasswordValid = await bcrypt.compare(
            changePasswordDto.currentPassword,
            user.password,
        );

        if (!isCurrentPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, saltRounds);

        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        return { message: 'Password changed successfully' };
    }

    async refreshToken(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const tokens = await this.generateTokens(user);
        return tokens;
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { workshop: true },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            workshop: {
                id: user.workshop.id,
                name: user.workshop.name,
            },
        };
    }

    private async generateTokens(user: { id: string; email: string; role: UserRole; workshopId: string }) {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            workshopId: user.workshopId,
        };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        return {
            accessToken,
            refreshToken,
        };
    }
}
