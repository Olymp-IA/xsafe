import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CustomersService } from './customers.service';

@ApiTags('Ecommerce - Customers')
@Controller('ecommerce/customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Post(':workshopId/register')
    @ApiOperation({ summary: 'Register new customer' })
    async register(
        @Param('workshopId') workshopId: string,
        @Body() data: { email: string; password: string; firstName: string; lastName: string; phone?: string },
    ) {
        return this.customersService.register(workshopId, data);
    }

    @Post(':workshopId/login')
    @ApiOperation({ summary: 'Customer login' })
    async login(
        @Param('workshopId') workshopId: string,
        @Body() data: { email: string; password: string },
    ) {
        return this.customersService.login(workshopId, data.email, data.password);
    }

    @Get(':customerId/profile')
    @ApiOperation({ summary: 'Get customer profile' })
    async getProfile(@Param('customerId') customerId: string) {
        return this.customersService.getProfile(customerId);
    }

    @Put(':customerId/profile')
    @ApiOperation({ summary: 'Update customer profile' })
    async updateProfile(@Param('customerId') customerId: string, @Body() data: any) {
        return this.customersService.updateProfile(customerId, data);
    }

    @Get(':customerId/orders')
    @ApiOperation({ summary: 'Get customer orders' })
    async getOrders(@Param('customerId') customerId: string) {
        return this.customersService.getOrders(customerId);
    }

    @Post(':customerId/addresses')
    @ApiOperation({ summary: 'Add customer address' })
    async addAddress(@Param('customerId') customerId: string, @Body() address: any) {
        return this.customersService.addAddress(customerId, address);
    }
}
