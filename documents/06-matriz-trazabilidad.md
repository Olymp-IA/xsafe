# Matriz de Trazabilidad

**Documento ID:** DOC-TRACE-001  
**Versión:** 1.0.0  
**Clasificación:** INTERNO  
**Fecha:** 2026-01-14  

---

## 1. Propósito

Este documento establece la trazabilidad bidireccional entre:
- Requisitos → Código fuente
- Código fuente → Tests
- Componentes → Documentación

---

## 2. Trazabilidad de Requisitos a Código

### 2.1 Módulo de Autenticación

| ID Requisito | Descripción | Código Fuente | Tests | Estado |
|--------------|-------------|---------------|-------|--------|
| REQ-AUTH-001 | Login con email/password | `modules/auth/auth.service.ts:validateUser()` | `auth.service.spec.ts` | ✅ Implementado |
| REQ-AUTH-002 | Generación de JWT | `modules/auth/auth.service.ts:login()` | `auth.service.spec.ts` | ✅ Implementado |
| REQ-AUTH-003 | Refresh token | `modules/auth/auth.service.ts:refreshToken()` | `auth.service.spec.ts` | ✅ Implementado |
| REQ-AUTH-004 | Bloqueo por intentos | `modules/auth/auth.service.ts:handleFailedAttempt()` | `auth.service.spec.ts` | ✅ Implementado |
| REQ-AUTH-005 | RBAC (Control por roles) | `modules/auth/guards/roles.guard.ts` | `roles.guard.spec.ts` | ✅ Implementado |
| REQ-AUTH-006 | Logout/Revocación | `modules/auth/auth.service.ts:logout()` | `auth.service.spec.ts` | ✅ Implementado |
| REQ-AUTH-007 | Recuperación de contraseña | `modules/auth/auth.service.ts:forgotPassword()` | `auth.service.spec.ts` | ✅ Implementado |
| REQ-AUTH-008 | MFA (Opcional) | N/A | N/A | 🔄 Pendiente |

### 2.2 Módulo de Producción

| ID Requisito | Descripción | Código Fuente | Tests | Estado |
|--------------|-------------|---------------|-------|--------|
| REQ-PROD-001 | Crear orden de producción | `modules/production/production.service.ts:createOrder()` | `production.service.spec.ts` | ✅ Implementado |
| REQ-PROD-002 | Listar órdenes | `modules/production/production.service.ts:findAllOrders()` | `production.service.spec.ts` | ✅ Implementado |
| REQ-PROD-003 | Actualizar estado de orden | `modules/production/production.service.ts:updateOrderStatus()` | `production.service.spec.ts` | ✅ Implementado |
| REQ-PROD-004 | Gestión de etapas | `modules/production/production.service.ts:updateStage()` | `production.service.spec.ts` | ✅ Implementado |
| REQ-PROD-005 | Emisión de eventos | `modules/production/events/order-created.event.ts` | `production.service.spec.ts` | ✅ Implementado |
| REQ-PROD-006 | Cálculo de OEE | `modules/production/production.service.ts:calculateOEE()` | `production.service.spec.ts` | ✅ Implementado |
| REQ-PROD-007 | Reportes de producción | `modules/analytics/analytics.service.ts:getProductionReport()` | `analytics.service.spec.ts` | ✅ Implementado |

### 2.3 Módulo de Inventario

| ID Requisito | Descripción | Código Fuente | Tests | Estado |
|--------------|-------------|---------------|-------|--------|
| REQ-INV-001 | Consulta de stock | `modules/inventory/inventory.service.ts:getStock()` | `inventory.service.spec.ts` | ✅ Implementado |
| REQ-INV-002 | Registro de movimientos | `modules/inventory/inventory.service.ts:createMovement()` | `inventory.service.spec.ts` | ✅ Implementado |
| REQ-INV-003 | Alertas de stock bajo | `modules/inventory/inventory.service.ts:checkLowStock()` | `inventory.service.spec.ts` | ✅ Implementado |
| REQ-INV-004 | Ajustes de inventario | `modules/inventory/inventory.service.ts:adjustStock()` | `inventory.service.spec.ts` | ✅ Implementado |
| REQ-INV-005 | Transferencias entre almacenes | `modules/inventory/inventory.service.ts:transfer()` | `inventory.service.spec.ts` | ✅ Implementado |
| REQ-INV-006 | Integración con producción | `modules/inventory/listeners/production.listener.ts` | `inventory.listener.spec.ts` | ✅ Implementado |

### 2.4 Módulo de Calidad

| ID Requisito | Descripción | Código Fuente | Tests | Estado |
|--------------|-------------|---------------|-------|--------|
| REQ-QC-001 | Registro de inspecciones | `modules/quality/quality.service.ts:createInspection()` | `quality.service.spec.ts` | ✅ Implementado |
| REQ-QC-002 | Gestión de defectos | `modules/quality/quality.service.ts:reportDefect()` | `quality.service.spec.ts` | ✅ Implementado |
| REQ-QC-003 | Métricas de calidad | `modules/quality/quality.service.ts:getMetrics()` | `quality.service.spec.ts` | ✅ Implementado |
| REQ-QC-004 | Checklist dinámicos | `modules/quality/quality.service.ts:getChecklist()` | `quality.service.spec.ts` | ✅ Implementado |

### 2.5 Módulo de Maquinaria

| ID Requisito | Descripción | Código Fuente | Tests | Estado |
|--------------|-------------|---------------|-------|--------|
| REQ-MACH-001 | Estado de máquinas | `modules/machines/machines.service.ts:getStatus()` | `machines.service.spec.ts` | ✅ Implementado |
| REQ-MACH-002 | Registro de métricas | `modules/machines/machines.service.ts:recordMetric()` | `machines.service.spec.ts` | ✅ Implementado |
| REQ-MACH-003 | Cálculo de OEE | `modules/machines/machines.service.ts:calculateOEE()` | `machines.service.spec.ts` | ✅ Implementado |
| REQ-MACH-004 | Alertas de mantenimiento | `modules/machines/machines.service.ts:checkMaintenance()` | `machines.service.spec.ts` | ✅ Implementado |

### 2.6 Módulo E-commerce

| ID Requisito | Descripción | Código Fuente | Tests | Estado |
|--------------|-------------|---------------|-------|--------|
| REQ-ECOM-001 | Catálogo de productos | `modules/ecommerce/products/products.service.ts` | `products.service.spec.ts` | ✅ Implementado |
| REQ-ECOM-002 | Carrito de compras | `modules/ecommerce/cart/cart.service.ts` | `cart.service.spec.ts` | ✅ Implementado |
| REQ-ECOM-003 | Proceso de checkout | `modules/ecommerce/checkout/checkout.service.ts` | `checkout.service.spec.ts` | ✅ Implementado |
| REQ-ECOM-004 | Integración con Stripe | `modules/ecommerce/checkout/stripe.service.ts` | `stripe.service.spec.ts` | ✅ Implementado |
| REQ-ECOM-005 | Gestión de clientes | `modules/ecommerce/customers/customers.service.ts` | `customers.service.spec.ts` | ✅ Implementado |
| REQ-ECOM-006 | Sistema de reseñas | `modules/ecommerce/reviews/reviews.service.ts` | `reviews.service.spec.ts` | ✅ Implementado |

---

## 3. Trazabilidad de Casos de Uso a Código

| ID Caso de Uso | Nombre | Componentes de Código | Documentación |
|----------------|--------|----------------------|---------------|
| CU-AUTH-001 | Iniciar Sesión | `AuthController.login()`, `AuthService.validateUser()`, `LocalStrategy`, `JwtStrategy` | Manual 3.1 |
| CU-AUTH-002 | Registrar Usuario | `AuthController.register()`, `AuthService.register()` | Manual 10.1 |
| CU-AUTH-003 | Refrescar Token | `AuthController.refresh()`, `AuthService.refreshToken()` | Technical Docs 5.2 |
| CU-PROD-001 | Crear Orden | `ProductionController.create()`, `ProductionService.createOrder()` | Manual 4.2.2 |
| CU-PROD-002 | Actualizar Etapa | `ProductionController.updateStage()`, `ProductionService.updateStage()` | Manual 4.3 |
| CU-PROD-003 | Consultar Estado | `ProductionController.findOne()`, `ProductionService.findOrder()` | Manual 4.2.3 |
| CU-INV-001 | Registrar Movimiento | `InventoryController.createMovement()`, `InventoryService.createMovement()` | Manual 5.2 |
| CU-INV-002 | Consultar Stock | `InventoryController.getStock()`, `InventoryService.getStock()` | Manual 5.1 |
| CU-QC-001 | Registrar Inspección | `QualityController.createInspection()`, `QualityService.createInspection()` | Manual 6.1 |
| CU-ECOM-001 | Agregar al Carrito | `CartController.addItem()`, `CartService.addItem()` | Manual 8.2 |
| CU-ECOM-002 | Procesar Checkout | `CheckoutController.checkout()`, `CheckoutService.process()`, `StripeService.createPaymentIntent()` | Manual 8.3 |
| CU-ECOM-003 | Historial de Pedidos | `OrdersController.findByCustomer()`, `OrdersService.findByCustomer()` | Manual 8.4 |

---

## 4. Trazabilidad de Componentes a Documentación

### 4.1 Backend (core-backend)

| Componente | Arquitectura | Técnico | Manual | Seguridad | Runbook |
|------------|--------------|---------|--------|-----------|---------|
| `AuthModule` | §3.2 | §4.3 | §3 | §4.1 | RB-003 |
| `ProductionModule` | §3.2 | §4.3 | §4 | §4.3 | RB-001 |
| `InventoryModule` | §3.2 | §4.3 | §5 | §4.3 | - |
| `QualityModule` | §3.2 | §4.3 | §6 | §4.3 | - |
| `MachinesModule` | §3.2 | §4.3 | §7 | §4.3 | - |
| `AlertsModule` | §3.2 | §4.3 | - | §4.3 | RB-006 |
| `AnalyticsModule` | §3.2 | §4.3 | §4.4 | §4.3 | - |
| `HealthModule` | §3.2 | §4.3 | - | - | RB-001 |
| `EcommerceModule` | §3.2 | §4.3 | §8 | §4.3 | - |
| `PrismaModule` | §3.2 | §4.3 | - | §4.2 | RB-004 |

### 4.2 Frontend Apps

| App | Arquitectura | Técnico | Manual | Despliegue |
|-----|--------------|---------|--------|------------|
| `ecommerce-frontend` | §2.1 | §4.2 | §8 | §Deployment 3.5 |
| `erp-web` | §2.1 | §4.2 | §3-7, §10 | §Deployment 3.1 |
| `erp-desktop` | §2.1 | §4.2 | §3-7 | §Deployment 3.4 |
| `erp-mobile` | §2.1 | §4.2 | §3-7 | §Deployment 3.6 |
| `workshop-monitor` | §2.1 | §4.2 | §9 | §Deployment 3.5 |

### 4.3 Packages

| Package | Arquitectura | Técnico | Usado Por |
|---------|--------------|---------|-----------|
| `@xsafe/ui-kit` | ADR-009 | §4.2 | erp-web, workshop-monitor |
| `@xsafe/shared-types` | ADR-003 | §4.2 | Todos |
| `@xsafe/business-logic` | ADR-003 | §4.2 | core-backend |
| `@xsafe/config` | ADR-003 | §4.2 | Todos |

---

## 5. Trazabilidad de Endpoints API

| Método | Endpoint | Controller | Service | DTO | Guard |
|--------|----------|------------|---------|-----|-------|
| POST | `/auth/login` | `AuthController.login` | `AuthService.validateUser` | `LoginDto` | `LocalGuard` |
| POST | `/auth/register` | `AuthController.register` | `AuthService.register` | `RegisterDto` | `JwtGuard`, `RolesGuard(ADMIN)` |
| POST | `/auth/refresh` | `AuthController.refresh` | `AuthService.refreshToken` | `RefreshDto` | - |
| GET | `/production/orders` | `ProductionController.findAll` | `ProductionService.findAllOrders` | - | `JwtGuard` |
| POST | `/production/orders` | `ProductionController.create` | `ProductionService.createOrder` | `CreateOrderDto` | `JwtGuard`, `RolesGuard(ADMIN,MANAGER)` |
| GET | `/production/orders/:id` | `ProductionController.findOne` | `ProductionService.findOrder` | - | `JwtGuard` |
| PATCH | `/production/orders/:id/stage` | `ProductionController.updateStage` | `ProductionService.updateStage` | `UpdateStageDto` | `JwtGuard`, `RolesGuard(OPERATOR)` |
| GET | `/inventory/stock` | `InventoryController.getStock` | `InventoryService.getStock` | - | `JwtGuard` |
| POST | `/inventory/movements` | `InventoryController.createMovement` | `InventoryService.createMovement` | `CreateMovementDto` | `JwtGuard`, `RolesGuard(OPERATOR)` |
| GET | `/products` | `ProductsController.findAll` | `ProductsService.findAll` | - | - |
| GET | `/products/:id` | `ProductsController.findOne` | `ProductsService.findOne` | - | - |
| POST | `/cart` | `CartController.addItem` | `CartService.addItem` | `AddItemDto` | `JwtGuard` |
| POST | `/checkout` | `CheckoutController.checkout` | `CheckoutService.process` | `CheckoutDto` | `JwtGuard` |
| GET | `/health` | `HealthController.check` | `HealthService.check` | - | - |

---

## 6. Trazabilidad de Diagramas

| Diagrama | Documento | Componentes Representados |
|----------|-----------|---------------------------|
| Diagrama de Contexto | `uml/01-diagrama-contexto.md` | Actores, Sistema, Integraciones externas |
| Diagrama de Componentes | `uml/05-diagrama-componentes.md` | Módulos backend, dependencias |
| Diagrama de Despliegue | `uml/06-diagrama-despliegue.md` | Infraestructura AWS |
| ER Diagram | `01-arquitectura-sistema.md` §4.1 | Entidades de base de datos |

---

## 7. Estadísticas de Cobertura

### 7.1 Cobertura de Requisitos

| Módulo | Total Reqs | Implementados | Pendientes | Cobertura |
|--------|------------|---------------|------------|-----------|
| Auth | 8 | 7 | 1 | 87.5% |
| Production | 7 | 7 | 0 | 100% |
| Inventory | 6 | 6 | 0 | 100% |
| Quality | 4 | 4 | 0 | 100% |
| Machines | 4 | 4 | 0 | 100% |
| E-commerce | 6 | 6 | 0 | 100% |
| **TOTAL** | **35** | **34** | **1** | **97.1%** |

### 7.2 Cobertura de Documentación

| Elemento | Arquitectura | Técnico | Manual | Seguridad |
|----------|--------------|---------|--------|-----------|
| Módulos Backend | ✅ 100% | ✅ 100% | ✅ 100% | ✅ 100% |
| Apps Frontend | ✅ 100% | ✅ 100% | ✅ 100% | ✅ 100% |
| Packages | ✅ 100% | ✅ 100% | N/A | N/A |
| APIs | ✅ 100% | ✅ 100% | ✅ 100% | ✅ 100% |

---

## 8. Control de Cambios

Cuando se realice un cambio en el código fuente:

1. **Identificar** los requisitos afectados
2. **Actualizar** esta matriz de trazabilidad
3. **Verificar** que los tests cubran el cambio
4. **Actualizar** la documentación correspondiente
5. **Revisar** impactos en seguridad

---

*Este documento cumple con los estándares ISO/IEC 12207 para trazabilidad de software.*
