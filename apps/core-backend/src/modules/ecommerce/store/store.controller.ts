import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../auth';
import { UserRole } from '@prisma/client';

@ApiTags('Ecommerce - Store')
@Controller('ecommerce/store')
export class StoreController {
    constructor(private readonly storeService: StoreService) { }

    @Get('public/:storeUrl')
    @ApiOperation({ summary: 'Get public store info by URL' })
    async getPublicStore(@Param('storeUrl') storeUrl: string) {
        return this.storeService.getStoreByUrl(storeUrl);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get store for current workshop' })
    async getStore(@CurrentUser() user: { workshopId: string }) {
        return this.storeService.getStoreByWorkshop(user.workshopId);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create or update store' })
    async createOrUpdateStore(
        @CurrentUser() user: { workshopId: string },
        @Body() data: any,
    ) {
        return this.storeService.createOrUpdateStore(user.workshopId, data);
    }

    @Put('status/:status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update store status' })
    async updateStatus(
        @CurrentUser() user: { workshopId: string },
        @Param('status') status: 'DRAFT' | 'ACTIVE' | 'MAINTENANCE' | 'SUSPENDED',
    ) {
        return this.storeService.updateStoreStatus(user.workshopId, status);
    }
}
