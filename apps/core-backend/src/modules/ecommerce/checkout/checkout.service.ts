import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma';
import { CartService } from '../cart/cart.service';

@Injectable()
export class CheckoutService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cartService: CartService,
    ) { }

    async createOrder(cartId: string, checkoutData: {
        shippingAddress: any;
        billingAddress?: any;
        shippingMethod: string;
        paymentMethod: string;
        customerNote?: string;
    }) {
        const cart = await this.cartService.calculateTotals(cartId);

        if (!cart.items.length) {
            throw new BadRequestException('Cart is empty');
        }

        // Create addresses
        const shippingAddress = await this.prisma.address.create({
            data: {
                ...checkoutData.shippingAddress,
                type: 'SHIPPING',
                customerId: cart.customerId,
            },
        });

        const billingAddress = checkoutData.billingAddress
            ? await this.prisma.address.create({
                data: {
                    ...checkoutData.billingAddress,
                    type: 'BILLING',
                    customerId: cart.customerId,
                },
            })
            : shippingAddress;

        // Generate order number
        const orderNumber = `ECOM-${Date.now().toString(36).toUpperCase()}`;

        // Get workshop from first variant
        const firstVariant = await this.prisma.productVariant.findUnique({
            where: { id: cart.items[0].variantId },
            include: { product: true },
        });

        if (!firstVariant) {
            throw new BadRequestException('Product not found');
        }

        // Create order
        const order = await this.prisma.ecommerceOrder.create({
            data: {
                orderNumber,
                workshopId: firstVariant.product.workshopId,
                customerId: cart.customerId,
                customerEmail: cart.customer?.email || cart.guestEmail || '',
                customerFirstName: checkoutData.shippingAddress.firstName,
                customerLastName: checkoutData.shippingAddress.lastName,
                customerPhone: checkoutData.shippingAddress.phone,
                shippingAddressId: shippingAddress.id,
                billingAddressId: billingAddress.id,
                shippingMethod: checkoutData.shippingMethod,
                shippingAmount: cart.shippingAmount,
                paymentMethod: checkoutData.paymentMethod,
                subtotal: cart.subtotal,
                taxAmount: cart.taxAmount,
                discountAmount: cart.discountAmount,
                total: cart.total,
                couponCode: cart.couponCode,
                customerNote: checkoutData.customerNote,
                items: {
                    create: cart.items.map((item) => ({
                        variantId: item.variantId,
                        productName: item.variant.product?.name || item.variant.name,
                        variantName: item.variant.name,
                        sku: item.variant.sku,
                        quantity: item.quantity,
                        price: item.price,
                        attributes: item.variant.attributes,
                        customization: item.customization,
                    })),
                },
            },
            include: {
                items: true,
                shippingAddress: true,
                billingAddress: true,
            },
        });

        // Update stock
        for (const item of cart.items) {
            await this.prisma.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } },
            });
        }

        // Update coupon usage
        if (cart.couponCode) {
            await this.prisma.coupon.update({
                where: { code: cart.couponCode },
                data: { usedCount: { increment: 1 } },
            });
        }

        // Update customer metrics
        if (cart.customerId) {
            await this.prisma.ecommerceCustomer.update({
                where: { id: cart.customerId },
                data: {
                    totalOrders: { increment: 1 },
                    totalSpent: { increment: cart.total },
                },
            });
        }

        // Clear cart
        await this.cartService.clearCart(cartId);

        return order;
    }

    async getOrderByNumber(orderNumber: string) {
        return this.prisma.ecommerceOrder.findUnique({
            where: { orderNumber },
            include: {
                items: true,
                shippingAddress: true,
                billingAddress: true,
                customer: true,
            },
        });
    }

    async updateOrderStatus(orderId: string, status: string) {
        const updateData: any = { status };

        switch (status) {
            case 'PAID':
                updateData.paidAt = new Date();
                updateData.paymentStatus = 'PAID';
                break;
            case 'SHIPPED':
                updateData.shippedAt = new Date();
                break;
            case 'DELIVERED':
                updateData.deliveredAt = new Date();
                break;
            case 'CANCELLED':
                updateData.cancelledAt = new Date();
                break;
        }

        return this.prisma.ecommerceOrder.update({
            where: { id: orderId },
            data: updateData,
        });
    }
}
