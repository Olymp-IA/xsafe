# Diagrama de Clases

**Documento ID:** UML-CLS-001  
**Versión:** 1.0.0  
**Clasificación:** INTERNO  
**Fecha:** 2026-01-14  

---

## Descripción

El diagrama de clases muestra la estructura estática del sistema, incluyendo entidades, sus atributos, métodos y relaciones.

---

## Diagrama de Clases: Dominio Principal

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String password
        +String name
        +UserRole role
        +UserStatus status
        +DateTime createdAt
        +DateTime updatedAt
        --
        +validatePassword(plain: String) Boolean
        +hasRole(role: UserRole) Boolean
    }
    
    class Session {
        +String id
        +String userId
        +String token
        +String refreshToken
        +DateTime expiresAt
        +String deviceInfo
        +String ipAddress
        --
        +isExpired() Boolean
        +refresh() Session
    }
    
    class Product {
        +String id
        +String name
        +String description
        +String sku
        +Decimal price
        +String category
        +String[] images
        +String model3D
        +Boolean active
        --
        +isAvailable() Boolean
        +getMainImage() String
    }
    
    class Order {
        +String id
        +String customerId
        +OrderStatus status
        +Decimal subtotal
        +Decimal shipping
        +Decimal tax
        +Decimal total
        +Address shippingAddress
        +DateTime createdAt
        --
        +calculateTotal() Decimal
        +canCancel() Boolean
    }
    
    class OrderItem {
        +String id
        +String orderId
        +String productId
        +Int quantity
        +Decimal unitPrice
        +Decimal total
        --
        +calculateTotal() Decimal
    }
    
    class ProductionOrder {
        +String id
        +String orderId
        +String productId
        +Int quantity
        +ProductionStatus status
        +ProductionPriority priority
        +DateTime scheduledDate
        +DateTime startedAt
        +DateTime completedAt
        --
        +canStart() Boolean
        +calculateProgress() Decimal
    }
    
    class ProductionStage {
        +String id
        +String productionOrderId
        +String name
        +StageStatus status
        +Int sequence
        +DateTime startedAt
        +DateTime completedAt
        +String operatorId
        +String notes
        --
        +getDuration() Duration
        +isActive() Boolean
    }
    
    class InventoryItem {
        +String id
        +String productId
        +String warehouseId
        +Int quantity
        +Int reservedQuantity
        +Int minStock
        +Int maxStock
        --
        +getAvailable() Int
        +needsReorder() Boolean
    }
    
    class InventoryMovement {
        +String id
        +String inventoryItemId
        +MovementType type
        +Int quantity
        +String reference
        +String userId
        +String notes
        +DateTime createdAt
        --
        +isEntry() Boolean
        +isExit() Boolean
    }
    
    class Machine {
        +String id
        +String name
        +String serialNumber
        +MachineStatus status
        +String location
        +DateTime lastMaintenance
        +DateTime nextMaintenance
        --
        +isOperational() Boolean
        +needsMaintenance() Boolean
    }
    
    class MachineMetric {
        +String id
        +String machineId
        +Float oee
        +Float availability
        +Float performance
        +Float quality
        +Float temperature
        +DateTime timestamp
        --
        +isNormal() Boolean
    }
    
    class Inspection {
        +String id
        +String productionOrderId
        +String inspectorId
        +InspectionType type
        +InspectionResult result
        +String[] checklistItems
        +String notes
        +DateTime createdAt
        --
        +isPassed() Boolean
    }
    
    class Defect {
        +String id
        +String inspectionId
        +DefectType type
        +DefectSeverity severity
        +Int quantity
        +String description
        +String[] images
        +String rootCause
        +DefectStatus status
        --
        +isCritical() Boolean
    }
    
    %% Relationships
    User "1" --> "*" Session : has
    User "1" --> "*" Order : places
    User "1" --> "*" ProductionStage : operates
    User "1" --> "*" Inspection : performs
    
    Order "1" --> "*" OrderItem : contains
    Order "1" --> "0..1" ProductionOrder : generates
    
    OrderItem "*" --> "1" Product : references
    
    Product "1" --> "*" InventoryItem : stocked
    
    ProductionOrder "1" --> "*" ProductionStage : has
    ProductionOrder "*" --> "1" Product : produces
    
    InventoryItem "1" --> "*" InventoryMovement : tracks
    
    Machine "1" --> "*" MachineMetric : generates
    
    ProductionOrder "1" --> "*" Inspection : inspected
    Inspection "1" --> "*" Defect : identifies
```

---

## Diagrama de Clases: Módulo de Autenticación

```mermaid
classDiagram
    class AuthService {
        -PrismaService prisma
        -JwtService jwtService
        -EventEmitter2 eventEmitter
        --
        +validateUser(email, password) User
        +login(user) TokenPair
        +register(dto) User
        +refreshToken(token) TokenPair
        +logout(userId) void
        +forgotPassword(email) void
        +resetPassword(token, password) void
    }
    
    class AuthController {
        -AuthService authService
        --
        +login(dto) TokenResponse
        +register(dto) UserResponse
        +refresh(dto) TokenResponse
        +logout() void
        +forgotPassword(dto) void
        +resetPassword(dto) void
    }
    
    class JwtAuthGuard {
        -JwtStrategy strategy
        --
        +canActivate(context) Boolean
    }
    
    class RolesGuard {
        -Reflector reflector
        --
        +canActivate(context) Boolean
    }
    
    class JwtStrategy {
        -ConfigService config
        --
        +validate(payload) User
    }
    
    class LocalStrategy {
        -AuthService authService
        --
        +validate(email, password) User
    }
    
    class LoginDto {
        +String email
        +String password
    }
    
    class RegisterDto {
        +String email
        +String password
        +String name
        +UserRole role
    }
    
    class TokenResponse {
        +String accessToken
        +String refreshToken
        +User user
    }
    
    AuthController --> AuthService : uses
    AuthService --> JwtService : uses
    JwtAuthGuard --> JwtStrategy : uses
    AuthController ..> LoginDto : receives
    AuthController ..> RegisterDto : receives
    AuthController ..> TokenResponse : returns
```

---

## Diagrama de Clases: Módulo de Producción

```mermaid
classDiagram
    class ProductionService {
        -PrismaService prisma
        -InventoryService inventory
        -AlertsService alerts
        -EventEmitter2 eventEmitter
        --
        +createOrder(dto) ProductionOrder
        +findAllOrders(filters) ProductionOrder[]
        +findOrder(id) ProductionOrder
        +updateOrderStatus(id, status) ProductionOrder
        +updateStage(orderId, stageId, dto) ProductionStage
        +calculateOEE(orderId) OEEMetrics
        +cancelOrder(id) ProductionOrder
    }
    
    class ProductionController {
        -ProductionService service
        --
        +create(dto) ProductionOrder
        +findAll(query) ProductionOrder[]
        +findOne(id) ProductionOrder
        +updateStatus(id, dto) ProductionOrder
        +updateStage(id, stageId, dto) ProductionStage
        +cancel(id) ProductionOrder
    }
    
    class CreateOrderDto {
        +String productId
        +Int quantity
        +Date scheduledDate
        +ProductionPriority priority
        +String? notes
        +String? orderId
    }
    
    class UpdateStageDto {
        +StageStatus status
        +String? notes
    }
    
    class OrderCreatedEvent {
        +ProductionOrder order
        +DateTime timestamp
    }
    
    class StageCompletedEvent {
        +ProductionStage stage
        +ProductionOrder order
        +DateTime timestamp
    }
    
    ProductionController --> ProductionService : uses
    ProductionService --> PrismaService : uses
    ProductionService --> InventoryService : uses
    ProductionService --> AlertsService : uses
    ProductionController ..> CreateOrderDto : receives
    ProductionController ..> UpdateStageDto : receives
    ProductionService ..> OrderCreatedEvent : emits
    ProductionService ..> StageCompletedEvent : emits
```

---

## Enumeraciones

```mermaid
classDiagram
    class UserRole {
        <<enumeration>>
        ADMIN
        MANAGER
        OPERATOR
        SUPERVISOR
        CUSTOMER
    }
    
    class UserStatus {
        <<enumeration>>
        ACTIVE
        INACTIVE
        BLOCKED
    }
    
    class OrderStatus {
        <<enumeration>>
        PENDING
        PAID
        PROCESSING
        SHIPPED
        DELIVERED
        CANCELLED
    }
    
    class ProductionStatus {
        <<enumeration>>
        SCHEDULED
        IN_PROGRESS
        ON_HOLD
        COMPLETED
        CANCELLED
    }
    
    class ProductionPriority {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
        URGENT
    }
    
    class StageStatus {
        <<enumeration>>
        PENDING
        IN_PROGRESS
        COMPLETED
        SKIPPED
    }
    
    class MachineStatus {
        <<enumeration>>
        ACTIVE
        WARNING
        ERROR
        OFFLINE
        MAINTENANCE
    }
    
    class MovementType {
        <<enumeration>>
        ENTRY
        EXIT
        ADJUSTMENT
        TRANSFER_IN
        TRANSFER_OUT
        PRODUCTION_CONSUME
    }
    
    class InspectionType {
        <<enumeration>>
        RECEIVING
        IN_PROCESS
        FINAL
    }
    
    class InspectionResult {
        <<enumeration>>
        PASSED
        FAILED
        CONDITIONAL
    }
    
    class DefectSeverity {
        <<enumeration>>
        CRITICAL
        MAJOR
        MINOR
    }
```

---

## Clases de Infraestructura

```mermaid
classDiagram
    class PrismaService {
        +PrismaClient $extends
        --
        +onModuleInit() void
        +onModuleDestroy() void
    }
    
    class ConfigService {
        --
        +get~T~(key: String) T
        +getOrThrow~T~(key: String) T
    }
    
    class EventEmitter2 {
        --
        +emit(event: String, payload: Any) Boolean
        +on(event: String, handler: Function) void
        +once(event: String, handler: Function) void
    }
    
    class CacheManager {
        --
        +get~T~(key: String) T
        +set(key: String, value: Any, ttl?: Number) void
        +del(key: String) void
    }
```

---

## Trazabilidad

| Clase | Archivo | Schema Prisma |
|-------|---------|---------------|
| `User` | `shared/prisma/schema.prisma` | `model User` |
| `Product` | `shared/prisma/schema.prisma` | `model Product` |
| `Order` | `shared/prisma/schema.prisma` | `model Order` |
| `ProductionOrder` | `shared/prisma/schema.prisma` | `model ProductionOrder` |
| `AuthService` | `modules/auth/auth.service.ts` | - |
| `ProductionService` | `modules/production/production.service.ts` | - |

---

*Notación: UML 2.5 - Class Diagram*
