import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma';
import { ProductionStatus, MachineStatus, QualityStatus } from '@prisma/client';

export interface Alert {
    id: string;
    type: 'LOW_STOCK' | 'DEADLINE' | 'MACHINE_DOWN' | 'QUALITY_ISSUE' | 'ORDER_DELAY';
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    title: string;
    message: string;
    entityId?: string;
    entityType?: string;
    createdAt: Date;
}

@Injectable()
export class AlertsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Get all active alerts for a workshop
     */
    async getActiveAlerts(workshopId: string): Promise<Alert[]> {
        const alerts: Alert[] = [];

        // Check low stock materials
        const lowStockAlerts = await this.checkLowStockAlerts(workshopId);
        alerts.push(...lowStockAlerts);

        // Check upcoming deadlines
        const deadlineAlerts = await this.checkDeadlineAlerts(workshopId);
        alerts.push(...deadlineAlerts);

        // Check machine issues
        const machineAlerts = await this.checkMachineAlerts(workshopId);
        alerts.push(...machineAlerts);

        // Check quality issues
        const qualityAlerts = await this.checkQualityAlerts(workshopId);
        alerts.push(...qualityAlerts);

        // Sort by severity
        const severityOrder = { CRITICAL: 0, WARNING: 1, INFO: 2 };
        return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    }

    /**
     * Check for low stock materials
     */
    async checkLowStockAlerts(workshopId: string): Promise<Alert[]> {
        const materials = await this.prisma.material.findMany({
            where: { workshopId },
        });

        const alerts: Alert[] = [];

        for (const material of materials) {
            if (material.minStock && material.quantity <= material.minStock) {
                const isCritical = material.quantity <= (material.minStock * 0.5);
                alerts.push({
                    id: `stock-${material.id}`,
                    type: 'LOW_STOCK',
                    severity: isCritical ? 'CRITICAL' : 'WARNING',
                    title: isCritical ? 'Stock Crítico' : 'Stock Bajo',
                    message: `${material.name} tiene ${material.quantity} ${material.unit}s (mínimo: ${material.minStock})`,
                    entityId: material.id,
                    entityType: 'Material',
                    createdAt: new Date(),
                });
            }
        }

        return alerts;
    }

    /**
     * Check for upcoming or overdue deadlines
     */
    async checkDeadlineAlerts(workshopId: string): Promise<Alert[]> {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const orders = await this.prisma.productionOrder.findMany({
            where: {
                workshopId,
                status: { notIn: [ProductionStatus.COMPLETED, ProductionStatus.CANCELLED] },
                dueDate: { lte: tomorrow },
            },
            include: { customer: true },
        });

        const alerts: Alert[] = [];

        for (const order of orders) {
            const isOverdue = order.dueDate < now;
            alerts.push({
                id: `deadline-${order.id}`,
                type: isOverdue ? 'ORDER_DELAY' : 'DEADLINE',
                severity: isOverdue ? 'CRITICAL' : 'WARNING',
                title: isOverdue ? 'Orden Atrasada' : 'Fecha Límite Cercana',
                message: `${order.orderNumber} - ${order.customer.name} - Vence: ${order.dueDate.toLocaleDateString()}`,
                entityId: order.id,
                entityType: 'ProductionOrder',
                createdAt: new Date(),
            });
        }

        return alerts;
    }

    /**
     * Check for machine issues
     */
    async checkMachineAlerts(workshopId: string): Promise<Alert[]> {
        const machines = await this.prisma.machine.findMany({
            where: {
                workshopId,
                status: { in: [MachineStatus.BROKEN, MachineStatus.MAINTENANCE] },
            },
        });

        const alerts: Alert[] = [];

        for (const machine of machines) {
            alerts.push({
                id: `machine-${machine.id}`,
                type: 'MACHINE_DOWN',
                severity: machine.status === MachineStatus.BROKEN ? 'CRITICAL' : 'INFO',
                title: machine.status === MachineStatus.BROKEN ? 'Máquina Averiada' : 'Máquina en Mantenimiento',
                message: `${machine.name} (${machine.code}) está fuera de servicio`,
                entityId: machine.id,
                entityType: 'Machine',
                createdAt: new Date(),
            });
        }

        return alerts;
    }

    /**
     * Check for quality issues requiring attention
     */
    async checkQualityAlerts(workshopId: string): Promise<Alert[]> {
        const failedInspections = await this.prisma.qualityCheck.findMany({
            where: {
                status: { in: [QualityStatus.FAILED, QualityStatus.REWORK_REQUIRED] },
                stage: { order: { workshopId } },
            },
            include: { stage: { include: { order: true } } },
        });

        const alerts: Alert[] = [];

        for (const inspection of failedInspections) {
            alerts.push({
                id: `quality-${inspection.id}`,
                type: 'QUALITY_ISSUE',
                severity: 'WARNING',
                title: 'Problema de Calidad',
                message: `Orden ${inspection.stage.order.orderNumber} - ${inspection.stage.stageType} requiere atención`,
                entityId: inspection.id,
                entityType: 'QualityCheck',
                createdAt: new Date(),
            });
        }

        return alerts;
    }

    /**
     * Get alert summary counts
     */
    async getAlertSummary(workshopId: string) {
        const alerts = await this.getActiveAlerts(workshopId);

        return {
            total: alerts.length,
            critical: alerts.filter(a => a.severity === 'CRITICAL').length,
            warning: alerts.filter(a => a.severity === 'WARNING').length,
            info: alerts.filter(a => a.severity === 'INFO').length,
            byType: {
                lowStock: alerts.filter(a => a.type === 'LOW_STOCK').length,
                deadline: alerts.filter(a => a.type === 'DEADLINE').length,
                machineDown: alerts.filter(a => a.type === 'MACHINE_DOWN').length,
                qualityIssue: alerts.filter(a => a.type === 'QUALITY_ISSUE').length,
                orderDelay: alerts.filter(a => a.type === 'ORDER_DELAY').length,
            },
        };
    }
}
