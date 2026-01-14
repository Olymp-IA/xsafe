import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/prisma';
import { AuthModule } from './modules/auth';
import { ProductionModule } from './modules/production';
import { InventoryModule } from './modules/inventory';
import { QualityModule } from './modules/quality';
import { MachinesModule } from './modules/machines';
import { AnalyticsModule } from './modules/analytics';
import { AlertsModule } from './modules/alerts';
import { HealthModule } from './modules/health';
import { EcommerceModule } from './modules/ecommerce';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        // ERP Modules
        AuthModule,
        ProductionModule,
        InventoryModule,
        QualityModule,
        MachinesModule,
        AnalyticsModule,
        AlertsModule,
        HealthModule,
        // Ecommerce Modules
        EcommerceModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
