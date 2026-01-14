import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductionService } from './production.service';
import { CreateOrderDto, UpdateStageDto, AssignMachineDto } from './dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../auth';
import { UserRole } from '@prisma/client';

@ApiTags('Production')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('production')
export class ProductionController {
    constructor(private readonly productionService: ProductionService) { }

    @Post('orders')
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SUPERVISOR)
    @ApiOperation({ summary: 'Create a new production order' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    async createOrder(
        @CurrentUser() user: { workshopId: string },
        @Body() createOrderDto: CreateOrderDto,
    ) {
        return this.productionService.createOrder(user.workshopId, createOrderDto);
    }

    @Get('orders')
    @ApiOperation({ summary: 'List all production orders for the workshop' })
    @ApiResponse({ status: 200, description: 'List of orders' })
    async findAllOrders(@CurrentUser() user: { workshopId: string }) {
        return this.productionService.findAllOrders(user.workshopId);
    }

    @Get('orders/due-today')
    @ApiOperation({ summary: 'Get orders due today' })
    @ApiResponse({ status: 200, description: 'Orders due today' })
    async getOrdersDueToday(@CurrentUser() user: { workshopId: string }) {
        return this.productionService.getOrdersDueToday(user.workshopId);
    }

    @Get('orders/stats')
    @ApiOperation({ summary: 'Get workshop production statistics' })
    @ApiResponse({ status: 200, description: 'Production statistics' })
    async getWorkshopStats(@CurrentUser() user: { workshopId: string }) {
        return this.productionService.getWorkshopStats(user.workshopId);
    }

    @Get('orders/:id')
    @ApiOperation({ summary: 'Get order details by ID' })
    @ApiResponse({ status: 200, description: 'Order details' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    async findOrderById(
        @Param('id') id: string,
        @CurrentUser() user: { workshopId: string },
    ) {
        return this.productionService.findOrderById(id, user.workshopId);
    }

    @Post('orders/:id/start')
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SUPERVISOR)
    @ApiOperation({ summary: 'Start production for an order' })
    @ApiResponse({ status: 200, description: 'Production started' })
    @ApiResponse({ status: 400, description: 'Invalid order status' })
    async startProduction(
        @Param('id') id: string,
        @CurrentUser() user: { workshopId: string },
    ) {
        return this.productionService.startProduction(id, user.workshopId);
    }

    @Put('stages/:stageId')
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SUPERVISOR, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Update a production stage' })
    @ApiResponse({ status: 200, description: 'Stage updated' })
    async updateStage(
        @Param('stageId') stageId: string,
        @CurrentUser() user: { workshopId: string },
        @Body() updateStageDto: UpdateStageDto,
    ) {
        return this.productionService.updateStage(stageId, user.workshopId, updateStageDto);
    }

    @Post('stages/:stageId/assign-machine')
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SUPERVISOR)
    @ApiOperation({ summary: 'Assign a machine and operator to a stage' })
    @ApiResponse({ status: 200, description: 'Machine assigned' })
    async assignMachine(
        @Param('stageId') stageId: string,
        @CurrentUser() user: { workshopId: string },
        @Body() assignMachineDto: AssignMachineDto,
    ) {
        return this.productionService.assignMachine(stageId, user.workshopId, assignMachineDto);
    }
}
