import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma';
import { CreateMaterialDto, UpdateMaterialDto, AdjustStockDto, AdjustmentType } from './dto';

@Injectable()
export class InventoryService {
    constructor(private readonly prisma: PrismaService) { }

    async createMaterial(workshopId: string, createDto: CreateMaterialDto) {
        // Check for duplicate code
        const existing = await this.prisma.material.findUnique({
            where: { code: createDto.code },
        });

        if (existing) {
            throw new ConflictException('Material with this code already exists');
        }

        return this.prisma.material.create({
            data: {
                ...createDto,
                workshopId,
            },
            include: { supplier: true },
        });
    }

    async findAllMaterials(workshopId: string) {
        return this.prisma.material.findMany({
            where: { workshopId },
            include: { supplier: true },
            orderBy: { name: 'asc' },
        });
    }

    async findMaterialById(id: string, workshopId: string) {
        const material = await this.prisma.material.findFirst({
            where: { id, workshopId },
            include: { supplier: true },
        });

        if (!material) {
            throw new NotFoundException('Material not found');
        }

        return material;
    }

    async updateMaterial(id: string, workshopId: string, updateDto: UpdateMaterialDto) {
        await this.findMaterialById(id, workshopId);

        return this.prisma.material.update({
            where: { id },
            data: updateDto,
            include: { supplier: true },
        });
    }

    async deleteMaterial(id: string, workshopId: string) {
        await this.findMaterialById(id, workshopId);

        await this.prisma.material.delete({
            where: { id },
        });

        return { message: 'Material deleted successfully' };
    }

    async adjustStock(id: string, workshopId: string, adjustDto: AdjustStockDto) {
        const material = await this.findMaterialById(id, workshopId);

        let newQuantity: number;

        switch (adjustDto.type) {
            case AdjustmentType.ADD:
                newQuantity = material.quantity + adjustDto.amount;
                break;
            case AdjustmentType.SUBTRACT:
                newQuantity = Math.max(0, material.quantity - adjustDto.amount);
                break;
            case AdjustmentType.SET:
                newQuantity = adjustDto.amount;
                break;
        }

        return this.prisma.material.update({
            where: { id },
            data: { quantity: newQuantity },
            include: { supplier: true },
        });
    }

    async getLowStockMaterials(workshopId: string) {
        const materials = await this.prisma.material.findMany({
            where: { workshopId },
            include: { supplier: true },
        });

        return materials.filter(m => m.minStock && m.quantity <= m.minStock);
    }

    async getConsumptionReport(workshopId: string) {
        // This would be more sophisticated with stock movement tracking
        // For now, return materials sorted by quantity (lowest first)
        const materials = await this.prisma.material.findMany({
            where: { workshopId },
            orderBy: { quantity: 'asc' },
            take: 10,
        });

        return {
            lowStock: materials.filter(m => m.minStock && m.quantity <= m.minStock).length,
            totalMaterials: await this.prisma.material.count({ where: { workshopId } }),
            criticalItems: materials.slice(0, 5),
        };
    }

    async consumeMaterial(materialId: string, workshopId: string, amount: number) {
        const material = await this.findMaterialById(materialId, workshopId);

        if (material.quantity < amount) {
            throw new ConflictException(`Insufficient stock. Available: ${material.quantity}`);
        }

        return this.prisma.material.update({
            where: { id: materialId },
            data: { quantity: material.quantity - amount },
        });
    }
}
