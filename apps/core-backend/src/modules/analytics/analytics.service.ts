import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma';
import { ProductionStatus, StageStatus, MachineStatus, QualityStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Get Overall Equipment Effectiveness (OEE)
     * OEE = Availability × Performance × Quality
     */
    async getOEE(workshopId: string) {
        const machines = await this.prisma.machine.findMany({ where: { workshopId } });
        const totalMachines = machines.length;
        const availableMachines = machines.filter(m => m.status === MachineStatus.AVAILABLE).length;

        const availability = totalMachines > 0 ? (availableMachines / totalMachines) * 100 : 0;

        // Performance: Completed orders / Total orders (excluding cancelled)
        const [completed, total] = await Promise.all([
            this.prisma.productionOrder.count({
                where: { workshopId, status: ProductionStatus.COMPLETED },
            }),
            this.prisma.productionOrder.count({
                where: { workshopId, status: { not: ProductionStatus.CANCELLED } },
            }),
        ]);
        const performance = total > 0 ? (completed / total) * 100 : 0;

        // Quality: Passed inspections / Total inspections
        const [passed, totalInspections] = await Promise.all([
            this.prisma.qualityCheck.count({
                where: { passed: true, stage: { order: { workshopId } } },
            }),
            this.prisma.qualityCheck.count({
                where: { stage: { order: { workshopId } } },
            }),
        ]);
        const quality = totalInspections > 0 ? (passed / totalInspections) * 100 : 0;

        const oee = (availability * performance * quality) / 10000;

        return {
            oee: oee.toFixed(1),
            availability: availability.toFixed(1),
            performance: performance.toFixed(1),
            quality: quality.toFixed(1),
        };
    }

    /**
     * Get production throughput by time period
     */
    async getProductionThroughput(workshopId: string, period: 'daily' | 'weekly' | 'monthly' = 'daily') {
        const now = new Date();
        let startDate: Date;

        switch (period) {
            case 'daily':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'weekly':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'monthly':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
        }

        const completed = await this.prisma.productionOrder.count({
            where: {
                workshopId,
                status: ProductionStatus.COMPLETED,
                completedAt: { gte: startDate },
            },
        });

        const inProgress = await this.prisma.productionOrder.count({
            where: {
                workshopId,
                status: { notIn: [ProductionStatus.COMPLETED, ProductionStatus.CANCELLED] },
                createdAt: { gte: startDate },
            },
        });

        return { period, completed, inProgress, startDate };
    }

    /**
     * Get average time per production stage
     */
    async getAverageTimePerStage(workshopId: string) {
        const stages = await this.prisma.productionStage.findMany({
            where: {
                order: { workshopId },
                status: StageStatus.COMPLETED,
                actualHours: { not: null },
            },
            select: {
                stageType: true,
                estimatedHours: true,
                actualHours: true,
            },
        });

        const stageStats = stages.reduce((acc, stage) => {
            if (!acc[stage.stageType]) {
                acc[stage.stageType] = { totalActual: 0, totalEstimated: 0, count: 0 };
            }
            acc[stage.stageType].totalActual += stage.actualHours || 0;
            acc[stage.stageType].totalEstimated += stage.estimatedHours;
            acc[stage.stageType].count += 1;
            return acc;
        }, {} as Record<string, { totalActual: number; totalEstimated: number; count: number }>);

        return Object.entries(stageStats).map(([stageType, stats]) => ({
            stageType,
            avgActualHours: (stats.totalActual / stats.count).toFixed(2),
            avgEstimatedHours: (stats.totalEstimated / stats.count).toFixed(2),
            efficiency: ((stats.totalEstimated / stats.totalActual) * 100).toFixed(1),
            sampleSize: stats.count,
        }));
    }

    /**
     * Get machine utilization stats
     */
    async getMachineUtilization(workshopId: string) {
        const machines = await this.prisma.machine.findMany({
            where: { workshopId },
            include: {
                productionStages: {
                    where: { status: StageStatus.COMPLETED },
                    select: { actualHours: true },
                },
            },
        });

        return machines.map(machine => {
            const totalHours = machine.productionStages.reduce((sum, s) => sum + (s.actualHours || 0), 0);
            return {
                machineId: machine.id,
                name: machine.name,
                type: machine.type,
                status: machine.status,
                totalHoursUsed: totalHours.toFixed(2),
                jobsCompleted: machine.productionStages.length,
            };
        });
    }

    /**
     * Get material consumption report
     */
    async getMaterialConsumption(workshopId: string) {
        const materials = await this.prisma.material.findMany({
            where: { workshopId },
            orderBy: { quantity: 'asc' },
        });

        const lowStock = materials.filter(m => m.minStock && m.quantity <= m.minStock);
        const criticalStock = materials.filter(m => m.minStock && m.quantity <= m.minStock * 0.5);

        return {
            totalMaterials: materials.length,
            lowStockCount: lowStock.length,
            criticalStockCount: criticalStock.length,
            lowStockItems: lowStock.slice(0, 10),
            criticalItems: criticalStock.slice(0, 5),
        };
    }

    /**
     * Get quality defect analysis
     */
    async getDefectAnalysis(workshopId: string) {
        const inspections = await this.prisma.qualityCheck.findMany({
            where: { stage: { order: { workshopId } } },
            include: { stage: true },
        });

        const total = inspections.length;
        const passed = inspections.filter(i => i.passed === true).length;
        const failed = inspections.filter(i => i.passed === false).length;
        const pending = inspections.filter(i => i.passed === null).length;

        const byStatus = inspections.reduce((acc, i) => {
            acc[i.status] = (acc[i.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            total,
            passed,
            failed,
            pending,
            passRate: total > 0 ? ((passed / total) * 100).toFixed(1) : '0',
            byStatus,
        };
    }

    /**
     * Get financial summary (cost per product)
     */
    async getFinancialSummary(workshopId: string) {
        const orders = await this.prisma.productionOrder.findMany({
            where: { workshopId, status: ProductionStatus.COMPLETED },
            include: {
                items: { include: { product: true } },
                stages: { select: { actualHours: true, estimatedHours: true } },
            },
        });

        const hourlyRate = 50; // Default hourly rate - could be configurable

        const analysis = orders.map(order => {
            const revenue = order.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
            const laborHours = order.stages.reduce((sum, s) => sum + (s.actualHours || s.estimatedHours), 0);
            const laborCost = laborHours * hourlyRate;

            return {
                orderId: order.id,
                orderNumber: order.orderNumber,
                revenue,
                laborCost,
                margin: revenue - laborCost,
                marginPercent: revenue > 0 ? (((revenue - laborCost) / revenue) * 100).toFixed(1) : '0',
            };
        });

        const totals = {
            totalRevenue: analysis.reduce((sum, a) => sum + a.revenue, 0),
            totalLaborCost: analysis.reduce((sum, a) => sum + a.laborCost, 0),
            totalMargin: analysis.reduce((sum, a) => sum + a.margin, 0),
            avgMarginPercent: analysis.length > 0
                ? (analysis.reduce((sum, a) => sum + parseFloat(a.marginPercent), 0) / analysis.length).toFixed(1)
                : '0',
        };

        return { orders: analysis.slice(0, 20), totals };
    }

    /**
     * Get dashboard summary with all key metrics
     */
    async getDashboardSummary(workshopId: string) {
        const [oee, throughput, materials, defects] = await Promise.all([
            this.getOEE(workshopId),
            this.getProductionThroughput(workshopId, 'daily'),
            this.getMaterialConsumption(workshopId),
            this.getDefectAnalysis(workshopId),
        ]);

        return {
            oee,
            production: throughput,
            inventory: {
                lowStock: materials.lowStockCount,
                critical: materials.criticalStockCount,
            },
            quality: {
                passRate: defects.passRate,
                pending: defects.pending,
            },
        };
    }
}
