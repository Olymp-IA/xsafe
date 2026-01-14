import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { CartService } from './cart.service';

@ApiTags('Ecommerce - Cart')
@Controller('ecommerce/cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @ApiOperation({ summary: 'Get or create cart' })
    @ApiHeader({ name: 'x-session-id', required: false })
    async getCart(
        @Query('customerId') customerId?: string,
        @Headers('x-session-id') sessionId?: string,
    ) {
        return this.cartService.getOrCreateCart(customerId, sessionId);
    }

    @Post(':cartId/items')
    @ApiOperation({ summary: 'Add item to cart' })
    async addItem(
        @Param('cartId') cartId: string,
        @Body() body: { variantId: string; quantity: number; customization?: any },
    ) {
        return this.cartService.addToCart(cartId, body.variantId, body.quantity, body.customization);
    }

    @Put('items/:itemId')
    @ApiOperation({ summary: 'Update cart item quantity' })
    async updateItem(
        @Param('itemId') itemId: string,
        @Body() body: { quantity: number },
    ) {
        return this.cartService.updateCartItem(itemId, body.quantity);
    }

    @Delete('items/:itemId')
    @ApiOperation({ summary: 'Remove item from cart' })
    async removeItem(@Param('itemId') itemId: string) {
        return this.cartService.removeFromCart(itemId);
    }

    @Delete(':cartId')
    @ApiOperation({ summary: 'Clear cart' })
    async clearCart(@Param('cartId') cartId: string) {
        return this.cartService.clearCart(cartId);
    }

    @Post(':cartId/coupon')
    @ApiOperation({ summary: 'Apply coupon to cart' })
    async applyCoupon(
        @Param('cartId') cartId: string,
        @Body() body: { code: string },
    ) {
        return this.cartService.applyCoupon(cartId, body.code);
    }

    @Post(':cartId/calculate')
    @ApiOperation({ summary: 'Calculate cart totals' })
    async calculateTotals(@Param('cartId') cartId: string) {
        return this.cartService.calculateTotals(cartId);
    }
}
