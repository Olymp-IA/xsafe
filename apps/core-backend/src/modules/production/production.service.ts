import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma';
import { CreateOrderDto, UpdateStageDto, AssignMachineDto } from './dto';
import { ProductionStatus, ProductionStageType, StageStatus, PriorityLevel } from '@prisma/client';

@Injectable()
export class ProductionService {
    constructor(private readonly prisma: PrismaService) { }

    // Production stages in order
    private readonly stageFlow: ProductionStageType[] = [
        ProductionStageType.CUTTING,
        ProductionStageType.BENDING,
        ProductionStageType.WELDING,
        ProductionStageType.GRINDING,
        ProductionStageType.POLISHING,
        ProductionStageType.PAINTING,
        ProductionStageType.ASSEMBLY,
        ProductionStageType.PACKAGING,
    ];

    // Estimated hours per stage type
    private readonly estimatedHours: Record<ProductionStageType, number> = {
        [ProductionStageType.CUTTING]: 1.5,
        [ProductionStageType.BENDING]: 2.0,
        [ProductionStageType.WELDING]: 3.0,
        [ProductionStageType.GRINDING]: 1.0,
        [ProductionStageType.POLISHING]: 1.5,
        [ProductionStageType.PAINTING]: 2.5,
        [ProductionStageType.ANODIZING]: 3.0,
        [ProductionStageType.ASSEMBLY]: 1.0,
        [ProductionStageType.PACKAGING]: 0.5,
    };

    async createOrder(workshopId: string, createOrderDto: CreateOrderDto) {
        // Validate customer belongs to workshop
        const customer = await this.prisma.customer.findFirst({
            where: { id: createOrderDto.customerId, workshopId },
        });

        if (!customer) {
            throw new NotFoundException('Customer not found in this workshop');
        }

        // Validate all products exist in workshop
        const productIds = createOrderDto.items.map(item => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds }, workshopId },
        });

        if (products.length !== productIds.length) {
            throw new BadRequestException('One or more products not found in this workshop');
        }

        // Generate order number
        const orderNumber = await this.generateOrderNumber(workshopId);

        // Create order with items and stages
        const order = await this.prisma.$transaction(async (tx) => {
            // Create the order
            const newOrder = await tx.productionOrder.create({
                data: {
                    orderNumber,
                    customerId: createOrderDto.customerId,
                    workshopId,
                    dueDate: new Date(createOrderDto.dueDate),
                    priority: createOrderDto.priority || PriorityLevel.MEDIUM,
                    notes: createOrderDto.notes,
                    status: ProductionStatus.DESIGN_APPROVAL,
                    items: {
                        create: createOrderDto.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                    },
                },
                include: {
                    items: { include: { product: true } },
                    customer: true,
                },
            });

            // Create production stages
            for (const stageType of this.stageFlow) {
                await tx.productionStage.create({
                    data: {
                        orderId: newOrder.id,
                        stageType,
                        status: StageStatus.PENDING,
                        estimatedHours: this.estimatedHours[stageType],
                    },
                });
            }

            return newOrder;
        });

        return order;
    }

    async findAllOrders(workshopId: string) {
        return this.prisma.productionOrder.findMany({
            where: { workshopId },
            include: {
                items: { include: { product: true } },
                customer: true,
                stages: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOrderById(orderId: string, workshopId: string) {
        const order = await this.prisma.productionOrder.findFirst({
            where: { id: orderId, workshopId },
            include: {
                items: { include: { product: true } },
                customer: true,
                stages: {
                    include: { machine: true, qualityCheck: true },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async startProduction(orderId: string, workshopId: string) {
        const order = await this.findOrderById(orderId, workshopId);

        if (order.status !== ProductionStatus.DESIGN_APPROVAL) {
            throw new BadRequestException('Order must be in DESIGN_APPROVAL status to start production');
        }

        // Start the first stage
        const firstStage = order.stages[0];

        await this.prisma.$transaction([
            this.prisma.productionOrder.update({
                where: { id: orderId },
                data: {
                    status: ProductionStatus.CUTTING,
                    startedAt: new Date(),
                },
            }),
            this.prisma.productionStage.update({
                where: { id: firstStage.id },
                data: {
                    status: StageStatus.IN_PROGRESS,
                    startedAt: new Date(),
                },
            }),
        ]);

        return { message: 'Production started', orderId };
    }

    async updateStage(stageId: string, workshopId: string, updateStageDto: UpdateStageDto) {
        // Verify stage belongs to workshop
        const stage = await this.prisma.productionStage.findFirst({
            where: { id: stageId },
            include: { order: true },
        });

        if (!stage || stage.order.workshopId !== workshopId) {
            throw new NotFoundException('Stage not found');
        }

        const updatedStage = await this.prisma.productionStage.update({
            where: { id: stageId },
            data: {
                status: updateStageDto.status,
                actualHours: updateStageDto.actualHours,
                completedAt: updateStageDto.status === StageStatus.COMPLETED ? new Date() : undefined,
            },
        });

        // If stage completed, move order to next stage
        if (updateStageDto.status === StageStatus.COMPLETED) {
            await this.advanceOrderToNextStage(stage.orderId);
        }

        return updatedStage;
    }

    async assignMachine(stageId: string, workshopId: string, assignDto: AssignMachineDto) {
        // Verify stage belongs to workshop
        const stage = await this.prisma.productionStage.findFirst({
            where: { id: stageId },
            include: { order: true },
        });

        if (!stage || stage.order.workshopId !== workshopId) {
            throw new NotFoundException('Stage not found');
        }

        // Verify machine belongs to workshop
        const machine = await this.prisma.machine.findFirst({
            where: { id: assignDto.machineId, workshopId },
        });

        if (!machine) {
            throw new NotFoundException('Machine not found in this workshop');
        }

        return this.prisma.productionStage.update({
            where: { id: stageId },
            data: {
                machineId: assignDto.machineId,
                assignedTo: assignDto.operatorId,
            },
            include: { machine: true },
        });
    }

    async getOrdersDueToday(workshopId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return this.prisma.productionOrder.findMany({
            where: {
                workshopId,
                dueDate: {
                    gte: today,
                    lt: tomorrow,
                },
                status: {
                    notIn: [ProductionStatus.COMPLETED, ProductionStatus.CANCELLED],
                },
            },
            include: {
                customer: true,
                items: { include: { product: true } },
            },
        });
    }

    async getWorkshopStats(workshopId: string) {
        const [totalOrders, inProgress, completed, cancelled] = await Promise.all([
            this.prisma.productionOrder.count({ where: { workshopId } }),
            this.prisma.productionOrder.count({
                where: {
                    workshopId,
                    status: { notIn: [ProductionStatus.COMPLETED, ProductionStatus.CANCELLED] },
                },
            }),
            this.prisma.productionOrder.count({
                where: { workshopId, status: ProductionStatus.COMPLETED },
            }),
            this.prisma.productionOrder.count({
                where: { workshopId, status: ProductionStatus.CANCELLED },
            }),
        ]);

        return {
            totalOrders,
            inProgress,
            completed,
            cancelled,
            completionRate: totalOrders > 0 ? ((completed / totalOrders) * 100).toFixed(1) : 0,
        };
    }

    private async advanceOrderToNextStage(orderId: string) {
        const stages = await this.prisma.productionStage.findMany({
            where: { orderId },
            orderBy: { createdAt: 'asc' },
        });

        const currentStageIndex = stages.findIndex(s => s.status === StageStatus.COMPLETED);
        const nextStage = stages[currentStageIndex + 1];

        if (nextStage) {
            // Start next stage
            await this.prisma.productionStage.update({
                where: { id: nextStage.id },
                data: {
                    status: StageStatus.IN_PROGRESS,
                    startedAt: new Date(),
                },
            });

            // Update order status based on stage type
            const statusMap: Partial<Record<ProductionStageType, ProductionStatus>> = {
                [ProductionStageType.CUTTING]: ProductionStatus.CUTTING,
                [ProductionStageType.BENDING]: ProductionStatus.BENDING,
                [ProductionStageType.WELDING]: ProductionStatus.WELDING,
                [ProductionStageType.GRINDING]: ProductionStatus.GRINDING,
                [ProductionStageType.POLISHING]: ProductionStatus.POLISHING,
                [ProductionStageType.PAINTING]: ProductionStatus.FINISHING,
                [ProductionStageType.PACKAGING]: ProductionStatus.PACKAGING,
            };

            const newStatus = statusMap[nextStage.stageType];
            if (newStatus) {
                await this.prisma.productionOrder.update({
                    where: { id: orderId },
                    data: { status: newStatus },
                });
            }
        } else {
            // All stages completed
            await this.prisma.productionOrder.update({
                where: { id: orderId },
                data: {
                    status: ProductionStatus.COMPLETED,
                    completedAt: new Date(),
                },
            });
        }
    }

    private async generateOrderNumber(workshopId: string): Promise<string> {
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const month = (today.getMonth() + 1).toString().padStart(2, '0');

        const count = await this.prisma.productionOrder.count({
            where: {
                workshopId,
                createdAt: {
                    gte: new Date(today.getFullYear(), today.getMonth(), 1),
                },
            },
        });

        return `ORD-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;
    }
}
