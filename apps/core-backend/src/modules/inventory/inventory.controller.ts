import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateMaterialDto, UpdateMaterialDto, AdjustStockDto } from './dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../auth';
import { UserRole } from '@prisma/client';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Get('materials')
    @ApiOperation({ summary: 'List all materials' })
    @ApiResponse({ status: 200, description: 'List of materials' })
    async findAllMaterials(@CurrentUser() user: { workshopId: string }) {
        return this.inventoryService.findAllMaterials(user.workshopId);
    }

    @Post('materials')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Create a new material' })
    @ApiResponse({ status: 201, description: 'Material created' })
    async createMaterial(
        @CurrentUser() user: { workshopId: string },
        @Body() createDto: CreateMaterialDto,
    ) {
        return this.inventoryService.createMaterial(user.workshopId, createDto);
    }

    @Get('materials/low-stock')
    @ApiOperation({ summary: 'Get materials with low stock' })
    @ApiResponse({ status: 200, description: 'Low stock materials' })
    async getLowStockMaterials(@CurrentUser() user: { workshopId: string }) {
        return this.inventoryService.getLowStockMaterials(user.workshopId);
    }

    @Get('materials/consumption-report')
    @ApiOperation({ summary: 'Get material consumption report' })
    @ApiResponse({ status: 200, description: 'Consumption report' })
    async getConsumptionReport(@CurrentUser() user: { workshopId: string }) {
        return this.inventoryService.getConsumptionReport(user.workshopId);
    }

    @Get('materials/:id')
    @ApiOperation({ summary: 'Get material by ID' })
    @ApiResponse({ status: 200, description: 'Material details' })
    @ApiResponse({ status: 404, description: 'Material not found' })
    async findMaterialById(
        @Param('id') id: string,
        @CurrentUser() user: { workshopId: string },
    ) {
        return this.inventoryService.findMaterialById(id, user.workshopId);
    }

    @Put('materials/:id')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @ApiOperation({ summary: 'Update material' })
    @ApiResponse({ status: 200, description: 'Material updated' })
    async updateMaterial(
        @Param('id') id: string,
        @CurrentUser() user: { workshopId: string },
        @Body() updateDto: UpdateMaterialDto,
    ) {
        return this.inventoryService.updateMaterial(id, user.workshopId, updateDto);
    }

    @Delete('materials/:id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete material' })
    @ApiResponse({ status: 200, description: 'Material deleted' })
    async deleteMaterial(
        @Param('id') id: string,
        @CurrentUser() user: { workshopId: string },
    ) {
        return this.inventoryService.deleteMaterial(id, user.workshopId);
    }

    @Post('materials/:id/adjust')
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.SUPERVISOR)
    @ApiOperation({ summary: 'Adjust material stock' })
    @ApiResponse({ status: 200, description: 'Stock adjusted' })
    async adjustStock(
        @Param('id') id: string,
        @CurrentUser() user: { workshopId: string },
        @Body() adjustDto: AdjustStockDto,
    ) {
        return this.inventoryService.adjustStock(id, user.workshopId, adjustDto);
    }
}
