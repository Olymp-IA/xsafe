import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';

@ApiTags('Ecommerce - Checkout')
@Controller('ecommerce/checkout')
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) { }

    @Post(':cartId')
    @ApiOperation({ summary: 'Create order from cart' })
    async createOrder(
        @Param('cartId') cartId: string,
        @Body() checkoutData: {
            shippingAddress: any;
            billingAddress?: any;
            shippingMethod: string;
            paymentMethod: string;
            customerNote?: string;
        },
    ) {
        return this.checkoutService.createOrder(cartId, checkoutData);
    }

    @Get('order/:orderNumber')
    @ApiOperation({ summary: 'Get order by number' })
    async getOrder(@Param('orderNumber') orderNumber: string) {
        return this.checkoutService.getOrderByNumber(orderNumber);
    }

    @Put('order/:orderId/status')
    @ApiOperation({ summary: 'Update order status' })
    async updateStatus(
        @Param('orderId') orderId: string,
        @Body() body: { status: string },
    ) {
        return this.checkoutService.updateOrderStatus(orderId, body.status);
    }
}
