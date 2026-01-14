import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    async getOrCreateCart(customerId?: string, sessionId?: string) {
        if (!customerId && !sessionId) {
            throw new BadRequestException('Either customerId or sessionId is required');
        }

        let cart = await this.prisma.cart.findFirst({
            where: customerId ? { customerId } : { sessionId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: { product: { select: { name: true, slug: true } } },
                        },
                    },
                },
                coupon: true,
            },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: customerId ? { customerId } : { sessionId },
                include: {
                    items: {
                        include: {
                            variant: {
                                include: { product: { select: { name: true, slug: true } } },
                            },
                        },
                    },
                    coupon: true,
                },
            });
        }

        return cart;
    }

    async addToCart(cartId: string, variantId: string, quantity: number, customization?: any) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
        });

        if (!variant || !variant.isAvailable) {
            throw new NotFoundException('Product variant not available');
        }

        if (variant.stock < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        // Check if item already in cart
        const existingItem = await this.prisma.cartItem.findFirst({
            where: { cartId, variantId },
        });

        if (existingItem) {
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
                include: { variant: true },
            });
        }

        return this.prisma.cartItem.create({
            data: {
                cartId,
                variantId,
                quantity,
                price: variant.price,
                customization,
            },
            include: { variant: true },
        });
    }

    async updateCartItem(itemId: string, quantity: number) {
        if (quantity <= 0) {
            return this.removeFromCart(itemId);
        }

        const item = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { variant: true },
        });

        if (!item) {
            throw new NotFoundException('Cart item not found');
        }

        if (item.variant.stock < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: { variant: true },
        });
    }

    async removeFromCart(itemId: string) {
        return this.prisma.cartItem.delete({ where: { id: itemId } });
    }

    async clearCart(cartId: string) {
        return this.prisma.cartItem.deleteMany({ where: { cartId } });
    }

    async applyCoupon(cartId: string, couponCode: string) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code: couponCode },
        });

        if (!coupon || !coupon.isActive) {
            throw new BadRequestException('Invalid coupon code');
        }

        const now = new Date();
        if (coupon.validFrom && coupon.validFrom > now) {
            throw new BadRequestException('Coupon not yet valid');
        }
        if (coupon.validUntil && coupon.validUntil < now) {
            throw new BadRequestException('Coupon expired');
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw new BadRequestException('Coupon usage limit reached');
        }

        return this.prisma.cart.update({
            where: { id: cartId },
            data: { couponCode },
            include: { items: { include: { variant: true } }, coupon: true },
        });
    }

    async calculateTotals(cartId: string, taxRate = 0.21) {
        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId },
            include: { items: { include: { variant: true } }, coupon: true },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        let subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let discountAmount = 0;

        if (cart.coupon) {
            if (cart.coupon.discountType === 'PERCENTAGE') {
                discountAmount = subtotal * (cart.coupon.discountValue / 100);
            } else if (cart.coupon.discountType === 'FIXED_AMOUNT') {
                discountAmount = cart.coupon.discountValue;
            }
            if (cart.coupon.maximumDiscount) {
                discountAmount = Math.min(discountAmount, cart.coupon.maximumDiscount);
            }
        }

        const taxAmount = (subtotal - discountAmount) * taxRate;
        const total = subtotal - discountAmount + taxAmount;

        return this.prisma.cart.update({
            where: { id: cartId },
            data: { subtotal, discountAmount, taxAmount, total },
            include: { items: { include: { variant: true } }, coupon: true },
        });
    }
}
