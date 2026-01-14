import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';
import { EcomProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { CheckoutModule } from './checkout/checkout.module';
import { EcomCustomersModule } from './customers/customers.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
    imports: [
        StoreModule,
        EcomProductsModule,
        CartModule,
        CheckoutModule,
        EcomCustomersModule,
        ReviewsModule,
    ],
    exports: [
        StoreModule,
        EcomProductsModule,
        CartModule,
        CheckoutModule,
        EcomCustomersModule,
        ReviewsModule,
    ],
})
export class EcommerceModule { }
