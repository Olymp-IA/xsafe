# Diagrama de Paquetes

**Documento ID:** UML-PKG-001  
**Versión:** 1.0.0  
**Clasificación:** INTERNO  
**Fecha:** 2026-01-14  

---

## Descripción

El diagrama de paquetes muestra la organización del sistema en módulos de alto nivel y sus dependencias.

---

## Diagrama de Paquetes del Monorepo

```mermaid
graph TB
    subgraph "xsafe-erp (Monorepo)"
        subgraph "apps/"
            subgraph "core-backend"
                Auth["auth/"]
                Production["production/"]
                Inventory["inventory/"]
                Quality["quality/"]
                Machines["machines/"]
                Analytics["analytics/"]
                Alerts["alerts/"]
                Health["health/"]
                Ecommerce["ecommerce/"]
                SharedBackend["shared/"]
            end
            
            subgraph "ecommerce-frontend"
                EcomComponents["components/"]
                EcomPages["app/"]
                EcomHooks["hooks/"]
                EcomServices["services/"]
            end
            
            subgraph "erp-web"
                WebComponents["components/"]
                WebPages["app/"]
                WebHooks["hooks/"]
                WebServices["services/"]
            end
            
            subgraph "erp-desktop"
                DesktopMain["main/"]
                DesktopRenderer["renderer/"]
                DesktopPreload["preload/"]
            end
            
            subgraph "erp-mobile"
                MobileScreens["screens/"]
                MobileComponents["components/"]
                MobileServices["services/"]
            end
            
            subgraph "workshop-monitor"
                MonitorComponents["components/"]
                MonitorHooks["hooks/"]
            end
        end
        
        subgraph "packages/"
            UIKit["@xsafe/ui-kit"]
            SharedTypes["@xsafe/shared-types"]
            BusinessLogic["@xsafe/business-logic"]
            Config["@xsafe/config"]
        end
    end
    
    %% Dependencias de apps a packages
    EcomComponents --> UIKit
    WebComponents --> UIKit
    MonitorComponents --> UIKit
    
    Ecommerce --> SharedTypes
    Production --> SharedTypes
    EcomServices --> SharedTypes
    WebServices --> SharedTypes
    
    Production --> BusinessLogic
    Inventory --> BusinessLogic
    
    Auth --> Config
    EcomPages --> Config
    WebPages --> Config
```

---

## Diagrama de Paquetes: Backend

```mermaid
graph TB
    subgraph "core-backend/src"
        AppModule["app.module.ts"]
        
        subgraph "modules/"
            subgraph "auth/"
                AuthModule["auth.module"]
                AuthController["auth.controller"]
                AuthService["auth.service"]
                AuthGuards["guards/"]
                AuthStrategies["strategies/"]
                AuthDecorators["decorators/"]
                AuthDto["dto/"]
            end
            
            subgraph "production/"
                ProdModule["production.module"]
                ProdController["production.controller"]
                ProdService["production.service"]
                ProdEvents["events/"]
                ProdDto["dto/"]
            end
            
            subgraph "inventory/"
                InvModule["inventory.module"]
                InvController["inventory.controller"]
                InvService["inventory.service"]
                InvListeners["listeners/"]
                InvDto["dto/"]
            end
            
            subgraph "quality/"
                QCModule["quality.module"]
                QCController["quality.controller"]
                QCService["quality.service"]
                QCDto["dto/"]
            end
            
            subgraph "machines/"
                MachModule["machines.module"]
                MachController["machines.controller"]
                MachService["machines.service"]
                MachDto["dto/"]
            end
            
            subgraph "ecommerce/"
                EcomModule["ecommerce.module"]
                
                subgraph "products/"
                    ProductsService["products.service"]
                end
                
                subgraph "cart/"
                    CartService["cart.service"]
                end
                
                subgraph "checkout/"
                    CheckoutService["checkout.service"]
                    StripeService["stripe.service"]
                end
                
                subgraph "customers/"
                    CustomersService["customers.service"]
                end
                
                subgraph "reviews/"
                    ReviewsService["reviews.service"]
                end
            end
            
            subgraph "alerts/"
                AlertsModule["alerts.module"]
                AlertsService["alerts.service"]
            end
            
            subgraph "analytics/"
                AnalyticsModule["analytics.module"]
                AnalyticsService["analytics.service"]
            end
        end
        
        subgraph "shared/"
            PrismaModule["prisma/"]
            Interceptors["interceptors/"]
            Filters["filters/"]
            Pipes["pipes/"]
        end
        
        subgraph "config/"
            DatabaseConfig["database.config"]
            JwtConfig["jwt.config"]
            AppConfig["app.config"]
        end
    end
    
    %% Dependencies
    AppModule --> AuthModule
    AppModule --> ProdModule
    AppModule --> InvModule
    AppModule --> QCModule
    AppModule --> MachModule
    AppModule --> EcomModule
    AppModule --> AlertsModule
    AppModule --> AnalyticsModule
    AppModule --> PrismaModule
    
    ProdModule --> AlertsModule
    ProdModule --> PrismaModule
    
    InvModule --> AlertsModule
    InvModule --> PrismaModule
    
    EcomModule --> AuthModule
    EcomModule --> PrismaModule
    
    CheckoutService --> StripeService
    
    MachModule --> AnalyticsModule
```

---

## Diagrama de Paquetes: Shared Packages

```mermaid
graph TB
    subgraph "@xsafe/ui-kit"
        UIComponents["components/"]
        UITheme["theme.ts"]
        UIIndex["index.ts"]
        
        subgraph "components/"
            Button["Button.tsx"]
            Card["Card.tsx"]
            Badge["Badge.tsx"]
            StatusIndicator["StatusIndicator.tsx"]
            Input["Input.tsx"]
            Modal["Modal.tsx"]
            Table["Table.tsx"]
        end
    end
    
    subgraph "@xsafe/shared-types"
        TypesUser["user.types.ts"]
        TypesProduct["product.types.ts"]
        TypesOrder["order.types.ts"]
        TypesProduction["production.types.ts"]
        TypesInventory["inventory.types.ts"]
        TypesApi["api.types.ts"]
    end
    
    subgraph "@xsafe/business-logic"
        BLValidators["validators/"]
        BLCalculators["calculators/"]
        BLTransformers["transformers/"]
        
        subgraph "calculators/"
            OEECalc["oee.calculator.ts"]
            PricingCalc["pricing.calculator.ts"]
            InventoryCalc["inventory.calculator.ts"]
        end
    end
    
    subgraph "@xsafe/config"
        ConfigEnv["env.config.ts"]
        ConfigApi["api.config.ts"]
        ConfigTheme["theme.config.ts"]
    end
    
    %% Dependencies between packages
    UIComponents --> TypesProduct
    UIComponents --> ConfigTheme
    BLValidators --> TypesUser
    BLCalculators --> TypesProduction
```

---

## Matriz de Dependencias

| Paquete | Depende De | Dependido Por |
|---------|------------|---------------|
| `@xsafe/ui-kit` | `@xsafe/shared-types`, `@xsafe/config` | erp-web, ecommerce-frontend, workshop-monitor |
| `@xsafe/shared-types` | - | Todos |
| `@xsafe/business-logic` | `@xsafe/shared-types` | core-backend |
| `@xsafe/config` | - | Todos |
| `auth` | `shared/prisma`, `config` | `ecommerce` |
| `production` | `shared/prisma`, `alerts` | `analytics` |
| `inventory` | `shared/prisma`, `alerts` | `production` |
| `ecommerce` | `auth`, `shared/prisma` | - |
| `alerts` | `shared/prisma` | `production`, `inventory`, `machines` |

---

## Capas Arquitectónicas

```mermaid
graph TB
    subgraph "Capa de Presentación"
        Web["erp-web<br>(Next.js)"]
        Ecom["ecommerce-frontend<br>(Next.js)"]
        Mobile["erp-mobile<br>(React Native)"]
        Desktop["erp-desktop<br>(Electron)"]
        Monitor["workshop-monitor<br>(React)"]
    end
    
    subgraph "Capa de API"
        API["core-backend<br>(NestJS)"]
    end
    
    subgraph "Capa de Negocio"
        Services["Services"]
        Events["Event Handlers"]
        Guards["Guards"]
    end
    
    subgraph "Capa de Datos"
        Prisma["Prisma ORM"]
        DB[("PostgreSQL")]
        Cache[("Redis")]
    end
    
    subgraph "Capa de Infraestructura"
        AWS["AWS Services"]
        Stripe["Stripe API"]
        Email["SendGrid"]
    end
    
    Web --> API
    Ecom --> API
    Mobile --> API
    Desktop --> API
    Monitor --> API
    
    API --> Services
    Services --> Events
    Services --> Guards
    
    Services --> Prisma
    Services --> Cache
    Prisma --> DB
    
    Services --> Stripe
    Services --> Email
    API --> AWS
```

---

## Trazabilidad

| Paquete | Ubicación | package.json |
|---------|-----------|--------------|
| @xsafe/ui-kit | `packages/ui-kit/` | `@xsafe/ui-kit` |
| @xsafe/shared-types | `packages/shared-types/` | `@xsafe/shared-types` |
| @xsafe/business-logic | `packages/business-logic/` | `@xsafe/business-logic` |
| @xsafe/config | `packages/config/` | `@xsafe/config` |
| core-backend | `apps/core-backend/` | `@xsafe/core-backend` |

---

*Notación: UML 2.5 - Package Diagram*
