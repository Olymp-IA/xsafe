# Diagrama Entidad-Relación

**Documento ID:** UML-ER-001  
**Versión:** 1.0.0  
**Clasificación:** INTERNO  
**Fecha:** 2026-01-14  

---

## Descripción

El diagrama Entidad-Relación muestra la estructura de la base de datos, las entidades principales, sus atributos y las relaciones entre ellas.

---

## Diagrama ER Completo

```mermaid
erDiagram
    User ||--o{ Session : "has"
    User ||--o{ Order : "places"
    User ||--o{ ProductionStage : "operates"
    User ||--o{ Inspection : "performs"
    User ||--o{ InventoryMovement : "records"
    User ||--o{ Review : "writes"
    User ||--o{ Cart : "owns"
    
    User {
        uuid id PK
        varchar email UK
        varchar password
        varchar name
        enum role
        enum status
        int failedAttempts
        timestamp blockedUntil
        timestamp createdAt
        timestamp updatedAt
    }
    
    Session {
        uuid id PK
        uuid userId FK
        varchar token UK
        varchar refreshToken UK
        varchar deviceInfo
        varchar ipAddress
        timestamp expiresAt
        timestamp createdAt
    }
    
    Product ||--o{ OrderItem : "ordered_in"
    Product ||--o{ InventoryItem : "stocked_as"
    Product ||--o{ ProductionOrder : "produced_by"
    Product ||--o{ Review : "reviewed"
    Product ||--o{ CartItem : "added_to"
    
    Product {
        uuid id PK
        varchar name
        text description
        varchar sku UK
        decimal price
        varchar category
        jsonb images
        varchar model3D
        boolean active
        timestamp createdAt
        timestamp updatedAt
    }
    
    Order ||--|{ OrderItem : "contains"
    Order ||--o| ProductionOrder : "generates"
    Order }o--|| User : "placed_by"
    
    Order {
        uuid id PK
        uuid customerId FK
        enum status
        decimal subtotal
        decimal shipping
        decimal tax
        decimal total
        jsonb shippingAddress
        varchar trackingNumber
        timestamp createdAt
        timestamp updatedAt
    }
    
    OrderItem {
        uuid id PK
        uuid orderId FK
        uuid productId FK
        int quantity
        decimal unitPrice
        decimal total
    }
    
    ProductionOrder ||--|{ ProductionStage : "has"
    ProductionOrder ||--o{ Inspection : "inspected_by"
    ProductionOrder }o--|| Product : "produces"
    ProductionOrder }o--o| Order : "fulfills"
    
    ProductionOrder {
        uuid id PK
        uuid productId FK
        uuid orderId FK
        int quantity
        enum status
        enum priority
        date scheduledDate
        timestamp startedAt
        timestamp completedAt
        timestamp createdAt
    }
    
    ProductionStage }o--|| User : "operated_by"
    
    ProductionStage {
        uuid id PK
        uuid productionOrderId FK
        uuid operatorId FK
        varchar name
        int sequence
        enum status
        text notes
        timestamp startedAt
        timestamp completedAt
    }
    
    InventoryItem ||--o{ InventoryMovement : "tracks"
    InventoryItem }o--|| Product : "stocks"
    InventoryItem }o--|| Warehouse : "located_in"
    
    InventoryItem {
        uuid id PK
        uuid productId FK
        uuid warehouseId FK
        int quantity
        int reservedQuantity
        int minStock
        int maxStock
        timestamp lastUpdated
    }
    
    Warehouse {
        uuid id PK
        varchar name
        varchar location
        boolean active
    }
    
    InventoryMovement }o--|| User : "recorded_by"
    
    InventoryMovement {
        uuid id PK
        uuid inventoryItemId FK
        uuid userId FK
        enum type
        int quantity
        varchar reference
        text notes
        timestamp createdAt
    }
    
    Machine ||--o{ MachineMetric : "generates"
    Machine ||--o{ MaintenanceLog : "maintained_by"
    
    Machine {
        uuid id PK
        varchar name
        varchar serialNumber UK
        enum status
        varchar location
        date lastMaintenance
        date nextMaintenance
        jsonb specs
        timestamp createdAt
    }
    
    MachineMetric {
        uuid id PK
        uuid machineId FK
        float oee
        float availability
        float performance
        float quality
        float temperature
        float vibration
        timestamp timestamp
    }
    
    MaintenanceLog {
        uuid id PK
        uuid machineId FK
        uuid technicianId FK
        enum type
        text description
        text actions
        float cost
        timestamp scheduledAt
        timestamp completedAt
    }
    
    Inspection ||--o{ Defect : "identifies"
    Inspection }o--|| ProductionOrder : "inspects"
    Inspection }o--|| User : "performed_by"
    
    Inspection {
        uuid id PK
        uuid productionOrderId FK
        uuid inspectorId FK
        enum type
        enum result
        jsonb checklistItems
        text notes
        timestamp createdAt
    }
    
    Defect {
        uuid id PK
        uuid inspectionId FK
        enum type
        enum severity
        int quantity
        text description
        jsonb images
        text rootCause
        text correctiveAction
        enum status
        timestamp createdAt
        timestamp resolvedAt
    }
    
    Cart ||--|{ CartItem : "contains"
    Cart }o--|| User : "owned_by"
    
    Cart {
        uuid id PK
        uuid userId FK UK
        timestamp updatedAt
    }
    
    CartItem }o--|| Product : "references"
    
    CartItem {
        uuid id PK
        uuid cartId FK
        uuid productId FK
        int quantity
        timestamp addedAt
    }
    
    Review }o--|| Product : "reviews"
    Review }o--|| User : "written_by"
    
    Review {
        uuid id PK
        uuid productId FK
        uuid userId FK
        int rating
        varchar title
        text content
        boolean verified
        timestamp createdAt
    }
    
    Alert }o--o| User : "assigned_to"
    
    Alert {
        uuid id PK
        uuid assignedToId FK
        enum type
        enum severity
        enum status
        varchar title
        text description
        jsonb metadata
        timestamp createdAt
        timestamp acknowledgedAt
        timestamp resolvedAt
    }
```

---

## Diccionario de Datos

### Entidad: User

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK, NOT NULL | Identificador único |
| email | VARCHAR(255) | UK, NOT NULL | Email de acceso |
| password | VARCHAR(255) | NOT NULL | Hash bcrypt de contraseña |
| name | VARCHAR(255) | NOT NULL | Nombre completo |
| role | ENUM | NOT NULL | ADMIN, MANAGER, OPERATOR, SUPERVISOR, CUSTOMER |
| status | ENUM | NOT NULL, DEFAULT ACTIVE | ACTIVE, INACTIVE, BLOCKED |
| failedAttempts | INT | DEFAULT 0 | Intentos de login fallidos |
| blockedUntil | TIMESTAMP | NULL | Fecha hasta la que está bloqueado |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW | Fecha de creación |
| updatedAt | TIMESTAMP | NOT NULL | Última actualización |

### Entidad: Product

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK, NOT NULL | Identificador único |
| name | VARCHAR(255) | NOT NULL | Nombre del producto |
| description | TEXT | NULL | Descripción detallada |
| sku | VARCHAR(50) | UK, NOT NULL | Código de inventario |
| price | DECIMAL(10,2) | NOT NULL | Precio unitario |
| category | VARCHAR(100) | NOT NULL | Categoría del producto |
| images | JSONB | NULL | Array de URLs de imágenes |
| model3D | VARCHAR(255) | NULL | URL del modelo 3D |
| active | BOOLEAN | DEFAULT TRUE | Si está activo para venta |
| createdAt | TIMESTAMP | NOT NULL | Fecha de creación |
| updatedAt | TIMESTAMP | NOT NULL | Última actualización |

### Entidad: Order

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK, NOT NULL | Identificador único |
| customerId | UUID | FK(User), NOT NULL | Cliente que realizó el pedido |
| status | ENUM | NOT NULL | PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED |
| subtotal | DECIMAL(10,2) | NOT NULL | Subtotal sin impuestos |
| shipping | DECIMAL(10,2) | NOT NULL | Costo de envío |
| tax | DECIMAL(10,2) | NOT NULL | Impuestos |
| total | DECIMAL(10,2) | NOT NULL | Total del pedido |
| shippingAddress | JSONB | NOT NULL | Dirección de envío |
| trackingNumber | VARCHAR(100) | NULL | Número de seguimiento |
| createdAt | TIMESTAMP | NOT NULL | Fecha de creación |
| updatedAt | TIMESTAMP | NOT NULL | Última actualización |

### Entidad: ProductionOrder

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK, NOT NULL | Identificador único |
| productId | UUID | FK(Product), NOT NULL | Producto a fabricar |
| orderId | UUID | FK(Order), NULL | Pedido relacionado |
| quantity | INT | NOT NULL | Cantidad a producir |
| status | ENUM | NOT NULL | SCHEDULED, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED |
| priority | ENUM | NOT NULL | LOW, MEDIUM, HIGH, URGENT |
| scheduledDate | DATE | NOT NULL | Fecha programada |
| startedAt | TIMESTAMP | NULL | Inicio real |
| completedAt | TIMESTAMP | NULL | Finalización real |
| createdAt | TIMESTAMP | NOT NULL | Fecha de creación |

### Entidad: InventoryItem

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK, NOT NULL | Identificador único |
| productId | UUID | FK(Product), NOT NULL | Producto |
| warehouseId | UUID | FK(Warehouse), NOT NULL | Almacén |
| quantity | INT | NOT NULL, DEFAULT 0 | Cantidad disponible |
| reservedQuantity | INT | NOT NULL, DEFAULT 0 | Cantidad reservada |
| minStock | INT | NOT NULL | Stock mínimo para alerta |
| maxStock | INT | NOT NULL | Stock máximo |
| lastUpdated | TIMESTAMP | NOT NULL | Última actualización |

### Entidad: Machine

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK, NOT NULL | Identificador único |
| name | VARCHAR(255) | NOT NULL | Nombre de la máquina |
| serialNumber | VARCHAR(100) | UK, NOT NULL | Número de serie |
| status | ENUM | NOT NULL | ACTIVE, WARNING, ERROR, OFFLINE, MAINTENANCE |
| location | VARCHAR(255) | NOT NULL | Ubicación en planta |
| lastMaintenance | DATE | NULL | Último mantenimiento |
| nextMaintenance | DATE | NULL | Próximo mantenimiento |
| specs | JSONB | NULL | Especificaciones técnicas |
| createdAt | TIMESTAMP | NOT NULL | Fecha de instalación |

---

## Índices

| Tabla | Índice | Columnas | Tipo |
|-------|--------|----------|------|
| User | idx_user_email | email | UNIQUE |
| User | idx_user_role | role | B-TREE |
| Product | idx_product_sku | sku | UNIQUE |
| Product | idx_product_category | category | B-TREE |
| Order | idx_order_customer | customerId | B-TREE |
| Order | idx_order_status | status | B-TREE |
| Order | idx_order_created | createdAt | B-TREE |
| ProductionOrder | idx_po_status | status | B-TREE |
| ProductionOrder | idx_po_scheduled | scheduledDate | B-TREE |
| InventoryItem | idx_inv_product_warehouse | productId, warehouseId | UNIQUE |
| MachineMetric | idx_metric_machine_time | machineId, timestamp | B-TREE |

---

## Relaciones y Cardinalidades

| Relación | Cardinalidad | Descripción |
|----------|--------------|-------------|
| User → Order | 1:N | Un usuario puede tener muchos pedidos |
| User → Cart | 1:1 | Un usuario tiene un carrito |
| Order → OrderItem | 1:N | Un pedido tiene muchos items |
| Order → ProductionOrder | 1:0..1 | Un pedido puede generar una orden de producción |
| ProductionOrder → ProductionStage | 1:N | Una orden tiene múltiples etapas |
| ProductionOrder → Inspection | 1:N | Una orden puede tener múltiples inspecciones |
| Product → InventoryItem | 1:N | Un producto puede estar en múltiples almacenes |
| InventoryItem → InventoryMovement | 1:N | Un item tiene historial de movimientos |
| Machine → MachineMetric | 1:N | Una máquina genera muchas métricas |
| Inspection → Defect | 1:N | Una inspección puede identificar múltiples defectos |

---

## Trazabilidad

| Entidad | Schema Prisma | Service |
|---------|---------------|---------|
| User | `model User` | AuthService |
| Product | `model Product` | ProductsService |
| Order | `model Order` | OrdersService |
| ProductionOrder | `model ProductionOrder` | ProductionService |
| InventoryItem | `model InventoryItem` | InventoryService |
| Machine | `model Machine` | MachinesService |
| Inspection | `model Inspection` | QualityService |

---

*Notación: Crow's Foot ER Diagram*
