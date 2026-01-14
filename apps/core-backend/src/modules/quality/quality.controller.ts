import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QualityService } from './quality.service';
import { CreateInspectionDto, CompleteInspectionDto } from './dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../auth';
import { UserRole } from '@prisma/client';

@ApiTags('Quality')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quality')
export class QualityController {
    constructor(private readonly qualityService: QualityService) { }

    @Get('inspections')
    @ApiOperation({ summary: 'List all quality inspections' })
    async findAllInspections(@CurrentUser() user: { workshopId: string }) {
        return this.qualityService.findAllInspections(user.workshopId);
    }

    @Get('inspections/pending')
    @ApiOperation({ summary: 'Get pending inspections' })
    async getPendingInspections(@CurrentUser() user: { workshopId: string }) {
        return this.qualityService.getPendingInspections(user.workshopId);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get quality statistics' })
    async getQualityStats(@CurrentUser() user: { workshopId: string }) {
        return this.qualityService.getQualityStats(user.workshopId);
    }

    @Get('inspections/:id')
    @ApiOperation({ summary: 'Get inspection by ID' })
    async findInspectionById(
        @Param('id') id: string,
        @CurrentUser() user: { workshopId: string },
    ) {
        return this.qualityService.findInspectionById(id, user.workshopId);
    }

    @Post('inspections')
    @Roles(UserRole.QUALITY_INSPECTOR, UserRole.SUPERVISOR, UserRole.MANAGER, UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new inspection' })
    async createInspection(
        @CurrentUser() user: { userId: string; workshopId: string },
        @Body() createDto: CreateInspectionDto,
    ) {
        return this.qualityService.createInspection(user.userId, user.workshopId, createDto);
    }

    @Put('inspections/:id/complete')
    @Roles(UserRole.QUALITY_INSPECTOR, UserRole.SUPERVISOR, UserRole.MANAGER, UserRole.ADMIN)
    @ApiOperation({ summary: 'Complete an inspection' })
    async completeInspection(
        @Param('id') id: string,
        @CurrentUser() user: { workshopId: string },
        @Body() completeDto: CompleteInspectionDto,
    ) {
        return this.qualityService.completeInspection(id, user.workshopId, completeDto);
    }
}
