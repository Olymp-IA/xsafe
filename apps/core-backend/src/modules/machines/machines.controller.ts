import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MachinesService } from './machines.service';
import { CreateMachineDto, UpdateMachineStatusDto } from './dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../auth';
import { UserRole } from '@prisma/client';

@ApiTags('Machines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('machines')
export class MachinesController {
    constructor(private readonly machinesService: MachinesService) { }

    @Get()
    @ApiOperation({ summary: 'List all machines' })
    async findAll(@CurrentUser() user: { workshopId: string }) {
        return this.machinesService.findAllMachines(user.workshopId);
    }

    @Get('available')
    @ApiOperation({ summary: 'Get available machines' })
    async getAvailable(@CurrentUser() user: { workshopId: string }) {
        return this.machinesService.getAvailableMachines(user.workshopId);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get machine statistics' })
    async getStats(@CurrentUser() user: { workshopId: string }) {
        return this.machinesService.getMachineStats(user.workshopId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get machine by ID' })
    async findById(@Param('id') id: string, @CurrentUser() user: { workshopId: string }) {
        return this.machinesService.findMachineById(id, user.workshopId);
    }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Create a new machine' })
    async create(@CurrentUser() user: { workshopId: string }, @Body() createDto: CreateMachineDto) {
        return this.machinesService.createMachine(user.workshopId, createDto);
    }

    @Put(':id/status')
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SUPERVISOR)
    @ApiOperation({ summary: 'Update machine status' })
    async updateStatus(
        @Param('id') id: string,
        @CurrentUser() user: { workshopId: string },
        @Body() updateDto: UpdateMachineStatusDto,
    ) {
        return this.machinesService.updateStatus(id, user.workshopId, updateDto);
    }
}
