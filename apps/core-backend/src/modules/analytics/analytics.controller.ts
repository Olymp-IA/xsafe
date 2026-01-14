import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../auth';
import { UserRole } from '@prisma/client';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get dashboard summary with key metrics' })
    async getDashboardSummary(@CurrentUser() user: { workshopId: string }) {
        return this.analyticsService.getDashboardSummary(user.workshopId);
    }

    @Get('oee')
    @ApiOperation({ summary: 'Get Overall Equipment Effectiveness (OEE)' })
    async getOEE(@CurrentUser() user: { workshopId: string }) {
        return this.analyticsService.getOEE(user.workshopId);
    }

    @Get('throughput')
    @ApiOperation({ summary: 'Get production throughput' })
    @ApiQuery({ name: 'period', enum: ['daily', 'weekly', 'monthly'], required: false })
    async getProductionThroughput(
        @CurrentUser() user: { workshopId: string },
        @Query('period') period: 'daily' | 'weekly' | 'monthly' = 'daily',
    ) {
        return this.analyticsService.getProductionThroughput(user.workshopId, period);
    }

    @Get('stage-times')
    @ApiOperation({ summary: 'Get average time per production stage' })
    async getAverageTimePerStage(@CurrentUser() user: { workshopId: string }) {
        return this.analyticsService.getAverageTimePerStage(user.workshopId);
    }

    @Get('machine-utilization')
    @ApiOperation({ summary: 'Get machine utilization statistics' })
    async getMachineUtilization(@CurrentUser() user: { workshopId: string }) {
        return this.analyticsService.getMachineUtilization(user.workshopId);
    }

    @Get('material-consumption')
    @ApiOperation({ summary: 'Get material consumption report' })
    async getMaterialConsumption(@CurrentUser() user: { workshopId: string }) {
        return this.analyticsService.getMaterialConsumption(user.workshopId);
    }

    @Get('defects')
    @ApiOperation({ summary: 'Get quality defect analysis' })
    async getDefectAnalysis(@CurrentUser() user: { workshopId: string }) {
        return this.analyticsService.getDefectAnalysis(user.workshopId);
    }

    @Get('financial')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Get financial summary (admin/manager only)' })
    async getFinancialSummary(@CurrentUser() user: { workshopId: string }) {
        return this.analyticsService.getFinancialSummary(user.workshopId);
    }
}
