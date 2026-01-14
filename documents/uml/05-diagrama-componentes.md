# Diagrama de Componentes

**Documento ID:** UML-CMP-001  
**Versión:** 1.0.0  
**Clasificación:** INTERNO  
**Fecha:** 2026-01-14  

---

## Descripción

El Diagrama de Componentes muestra la estructura interna del backend, las dependencias entre módulos, y los puntos de integración.

## Diagrama Principal - Backend API

```mermaid
graph TB
    subgraph "apps/core-backend"
        subgraph "Capa de Entrada"
            Main["main.ts<br>Bootstrap"]
            Swagger["SwaggerModule<br>Documentación API"]
        end
        
        Main --> AppModule
        
        subgraph "AppModule"
            direction TB
            
            subgraph "Módulos de Infraestructura"
                ConfigMod["ConfigModule<br>Variables de Entorno"]
                PrismaMod["PrismaModule<br>ORM Database"]
            end
            
            subgraph "Módulos de Negocio ERP"
                AuthMod["AuthModule"]
                ProductionMod["ProductionModule"]
                InventoryMod["InventoryModule"]
                QualityMod["QualityModule"]
                MachinesMod["MachinesModule"]
                AnalyticsMod["AnalyticsModule"]
                AlertsMod["AlertsModule"]
                HealthMod["HealthModule"]
            end
            
            subgraph "Módulos E-commerce"
                EcommMod["EcommerceModule"]
            end
        end
    end
    
    %% Dependencias
    AuthMod --> PrismaMod
    ProductionMod --> PrismaMod
    ProductionMod --> AlertsMod
    InventoryMod --> PrismaMod
    InventoryMod --> AlertsMod
    QualityMod --> PrismaMod
    MachinesMod --> PrismaMod
    MachinesMod --> AnalyticsMod
    AnalyticsMod --> PrismaMod
    AlertsMod --> PrismaMod
    EcommMod --> PrismaMod
    EcommMod --> AuthMod
    
    %% Swagger
    AppModule --> Swagger
```

## Diagrama Detallado - AuthModule

```mermaid
graph TB
    subgraph "modules/auth"
        Controller["AuthController<br>━━━━━━━━━━<br>POST /auth/login<br>POST /auth/register<br>POST /auth/refresh"]
        
        Service["AuthService<br>━━━━━━━━━━<br>validateUser()<br>login()<br>register()<br>refreshToken()"]
        
        subgraph "Guards"
            JwtGuard["JwtAuthGuard"]
            RolesGuard["RolesGuard"]
        end
        
        subgraph "Strategies"
            JwtStrategy["JwtStrategy<br>validate()"]
            LocalStrategy["LocalStrategy<br>validate()"]
        end
        
        subgraph "Decorators"
            RolesDec["@Roles()"]
            CurrentUser["@CurrentUser()"]
        end
        
        subgraph "DTOs"
            LoginDto["LoginDto"]
            RegisterDto["RegisterDto"]
        end
    end
    
    Controller --> Service
    Controller --> LoginDto
    Controller --> RegisterDto
    JwtGuard --> JwtStrategy
    RolesGuard --> RolesDec
    Service --> PrismaService["PrismaService"]
```

## Diagrama Detallado - ProductionModule

```mermaid
graph TB
    subgraph "modules/production"
        ProdController["ProductionController<br>━━━━━━━━━━<br>GET /production/orders<br>POST /production/orders<br>PATCH /production/orders/:id/stage"]
        
        ProdService["ProductionService<br>━━━━━━━━━━<br>findAllOrders()<br>createOrder()<br>updateStage()<br>calculateOEE()"]
        
        subgraph "Events"
            OrderCreated["OrderCreatedEvent"]
            StageCompleted["StageCompletedEvent"]
        end
        
        subgraph "DTOs"
            CreateOrderDto["CreateOrderDto"]
            UpdateStageDto["UpdateStageDto"]
        end
        
        EventEmitter["EventEmitter2"]
    end
    
    ProdController --> ProdService
    ProdController --> CreateOrderDto
    ProdController --> UpdateStageDto
    ProdService --> EventEmitter
    EventEmitter --> OrderCreated
    EventEmitter --> StageCompleted
    ProdService --> PrismaService["PrismaService"]
```

## Diagrama Detallado - EcommerceModule

```mermaid
graph TB
    subgraph "modules/ecommerce"
        EcommModule["EcommerceModule<br>(Aggregator)"]
        
        subgraph "Submódulos"
            StoreModule["StoreModule<br>Configuración tienda"]
            ProductsModule["ProductsModule<br>Catálogo"]
            CartModule["CartModule<br>Carrito"]
            CheckoutModule["CheckoutModule<br>Proceso de pago"]
            CustomersModule["CustomersModule<br>Clientes"]
            ReviewsModule["ReviewsModule<br>Valoraciones"]
        end
        
        EcommModule --> StoreModule
        EcommModule --> ProductsModule
        EcommModule --> CartModule
        EcommModule --> CheckoutModule
        EcommModule --> CustomersModule
        EcommModule --> ReviewsModule
        
        %% Dependencias internas
        CartModule --> ProductsModule
        CheckoutModule --> CartModule
        CheckoutModule --> CustomersModule
        ReviewsModule --> ProductsModule
        ReviewsModule --> CustomersModule
    end
```

## Matriz de Dependencias

| Módulo | Depende De | Dependido Por |
|--------|------------|---------------|
| `ConfigModule` | - | Todos |
| `PrismaModule` | `ConfigModule` | Todos los de negocio |
| `AuthModule` | `PrismaModule` | `EcommerceModule` |
| `ProductionModule` | `PrismaModule`, `AlertsModule` | `AnalyticsModule` |
| `InventoryModule` | `PrismaModule`, `AlertsModule` | `ProductionModule` |
| `AlertsModule` | `PrismaModule` | `Production`, `Inventory`, `Machines` |
| `EcommerceModule` | `AuthModule`, `PrismaModule` | - |

## Interfaces Expuestas (APIs)

| Módulo | Base Path | Endpoints | Auth Required |
|--------|-----------|-----------|---------------|
| Auth | `/auth` | 4 | Parcial |
| Production | `/production` | 8 | Sí (RBAC) |
| Inventory | `/inventory` | 6 | Sí (RBAC) |
| Quality | `/quality` | 5 | Sí (RBAC) |
| Machines | `/machines` | 4 | Sí (RBAC) |
| Analytics | `/analytics` | 3 | Sí (ADMIN) |
| Health | `/health` | 2 | No |
| Store | `/store` | 3 | Parcial |
| Products | `/products` | 5 | Parcial |
| Cart | `/cart` | 4 | Sí |
| Checkout | `/checkout` | 2 | Sí |

---

## Trazabilidad

| Componente | Ubicación |
|------------|-----------|
| AppModule | `apps/core-backend/src/app.module.ts:14-35` |
| AuthModule | `apps/core-backend/src/modules/auth/auth.module.ts` |
| ProductionModule | `apps/core-backend/src/modules/production/production.module.ts` |
| EcommerceModule | `apps/core-backend/src/modules/ecommerce/ecommerce.module.ts` |

---

*Notación: UML 2.5 - Component Diagram*
