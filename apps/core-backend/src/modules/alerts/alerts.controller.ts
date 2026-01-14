import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard, CurrentUser } from '../auth';

@ApiTags('Alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
    constructor(private readonly alertsService: AlertsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all active alerts' })
    async getActiveAlerts(@CurrentUser() user: { workshopId: string }) {
        return this.alertsService.getActiveAlerts(user.workshopId);
    }

    @Get('summary')
    @ApiOperation({ summary: 'Get alert summary counts' })
    async getAlertSummary(@CurrentUser() user: { workshopId: string }) {
        return this.alertsService.getAlertSummary(user.workshopId);
    }

    @Get('low-stock')
    @ApiOperation({ summary: 'Get low stock alerts' })
    async getLowStockAlerts(@CurrentUser() user: { workshopId: string }) {
        return this.alertsService.checkLowStockAlerts(user.workshopId);
    }

    @Get('deadlines')
    @ApiOperation({ summary: 'Get deadline alerts' })
    async getDeadlineAlerts(@CurrentUser() user: { workshopId: string }) {
        return this.alertsService.checkDeadlineAlerts(user.workshopId);
    }

    @Get('machines')
    @ApiOperation({ summary: 'Get machine alerts' })
    async getMachineAlerts(@CurrentUser() user: { workshopId: string }) {
        return this.alertsService.checkMachineAlerts(user.workshopId);
    }

    @Get('quality')
    @ApiOperation({ summary: 'Get quality alerts' })
    async getQualityAlerts(@CurrentUser() user: { workshopId: string }) {
        return this.alertsService.checkQualityAlerts(user.workshopId);
    }
}
