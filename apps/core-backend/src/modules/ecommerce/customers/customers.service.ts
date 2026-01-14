import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
    constructor(private readonly prisma: PrismaService) { }

    async register(workshopId: string, data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }) {
        const existing = await this.prisma.ecommerceCustomer.findFirst({
            where: { workshopId, email: data.email },
        });

        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        return this.prisma.ecommerceCustomer.create({
            data: {
                workshopId,
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
            },
        });
    }

    async login(workshopId: string, email: string, password: string) {
        const customer = await this.prisma.ecommerceCustomer.findFirst({
            where: { workshopId, email },
        });

        if (!customer || !customer.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValid = await bcrypt.compare(password, customer.password);
        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            id: customer.id,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
        };
    }

    async getProfile(customerId: string) {
        const customer = await this.prisma.ecommerceCustomer.findUnique({
            where: { id: customerId },
            include: {
                addresses: true,
                orders: { take: 5, orderBy: { createdAt: 'desc' } },
            },
        });

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        return customer;
    }

    async updateProfile(customerId: string, data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        newsletter?: boolean;
        marketing?: boolean;
    }) {
        return this.prisma.ecommerceCustomer.update({
            where: { id: customerId },
            data,
        });
    }

    async getOrders(customerId: string) {
        return this.prisma.ecommerceOrder.findMany({
            where: { customerId },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async addAddress(customerId: string, address: any) {
        return this.prisma.address.create({
            data: { customerId, ...address },
        });
    }
}
