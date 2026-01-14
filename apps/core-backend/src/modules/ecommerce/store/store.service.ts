import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma';

@Injectable()
export class StoreService {
    constructor(private readonly prisma: PrismaService) { }

    async getStoreByWorkshop(workshopId: string) {
        const store = await this.prisma.ecommerceStore.findUnique({
            where: { workshopId },
            include: {
                shippingMethods: { where: { isActive: true }, orderBy: { basePrice: 'asc' } },
                paymentMethods: { where: { isActive: true } },
            },
        });

        if (!store) {
            throw new NotFoundException('Store not found');
        }

        return store;
    }

    async getStoreByUrl(storeUrl: string) {
        const store = await this.prisma.ecommerceStore.findUnique({
            where: { storeUrl },
            include: {
                shippingMethods: { where: { isActive: true } },
                paymentMethods: { where: { isActive: true } },
                workshop: { select: { name: true, email: true, phone: true } },
            },
        });

        if (!store) {
            throw new NotFoundException('Store not found');
        }

        return store;
    }

    async createOrUpdateStore(workshopId: string, data: any) {
        return this.prisma.ecommerceStore.upsert({
            where: { workshopId },
            update: data,
            create: {
                workshopId,
                storeName: data.storeName || `Tienda-${workshopId}`,
                storeUrl: data.storeUrl || `tienda-${workshopId}`,
                ...data,
            },
        });
    }

    async updateStoreStatus(workshopId: string, status: 'DRAFT' | 'ACTIVE' | 'MAINTENANCE' | 'SUSPENDED') {
        return this.prisma.ecommerceStore.update({
            where: { workshopId },
            data: { status },
        });
    }
}
