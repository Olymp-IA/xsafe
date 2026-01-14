# Diagramas de Estados

**Documento ID:** UML-ST-001  
**Versión:** 1.0.0  
**Clasificación:** INTERNO  
**Fecha:** 2026-01-14  

---

## Descripción

Los diagramas de estados modelan el ciclo de vida de entidades clave del sistema, mostrando estados, transiciones y eventos que las disparan.

---

## ST-001: Ciclo de Vida de Orden de Producción

```mermaid
stateDiagram-v2
    [*] --> Scheduled: Crear Orden
    
    Scheduled --> InProgress: Iniciar Producción
    Scheduled --> Cancelled: Cancelar
    
    InProgress --> OnHold: Pausar (problema)
    InProgress --> Completed: Completar todas las etapas
    InProgress --> Cancelled: Cancelar
    
    OnHold --> InProgress: Reanudar
    OnHold --> Cancelled: Cancelar
    
    Completed --> [*]
    Cancelled --> [*]

    state Scheduled {
        [*] --> WaitingMaterials
        WaitingMaterials --> MaterialsReserved: Materiales disponibles
        MaterialsReserved --> [*]
    }
    
    state InProgress {
        [*] --> Stage1_Cutting
        Stage1_Cutting --> Stage2_Welding: Etapa completada
        Stage2_Welding --> Stage3_Painting: Etapa completada
        Stage3_Painting --> Stage4_Assembly: Etapa completada
        Stage4_Assembly --> FinalInspection: Etapa completada
        FinalInspection --> [*]: Inspección aprobada
    }
```

### Tabla de Transiciones

| Estado Origen | Estado Destino | Evento | Condición | Acción |
|---------------|----------------|--------|-----------|--------|
| - | Scheduled | createOrder() | Materiales > 80% | Reservar materiales |
| Scheduled | InProgress | startProduction() | Fecha = hoy | Notificar operarios |
| Scheduled | Cancelled | cancelOrder() | status != IN_PROGRESS | Liberar reservas |
| InProgress | OnHold | pauseOrder() | Problema reportado | Crear alerta |
| InProgress | Completed | completeStage() | Última etapa + QC OK | Actualizar inventario |
| OnHold | InProgress | resumeOrder() | Problema resuelto | - |
| OnHold | Cancelled | cancelOrder() | - | Liberar reservas |

---

## ST-002: Ciclo de Vida de Etapa de Producción

```mermaid
stateDiagram-v2
    [*] --> Pending: Crear etapa
    
    Pending --> InProgress: Operario inicia
    Pending --> Skipped: Omitir (opcional)
    
    InProgress --> Completed: Operario completa
    InProgress --> OnHold: Reportar problema
    
    OnHold --> InProgress: Reanudar
    
    Completed --> QualityCheck: Auto-transición
    
    QualityCheck --> Approved: Inspección OK
    QualityCheck --> Rework: Inspección fallida
    
    Rework --> InProgress: Reiniciar trabajo
    
    Approved --> [*]
    Skipped --> [*]
```

### Tabla de Transiciones

| Estado Origen | Estado Destino | Evento | Actor | Duración Máxima |
|---------------|----------------|--------|-------|-----------------|
| Pending | InProgress | startStage() | Operario | - |
| InProgress | Completed | completeStage() | Operario | 4 horas |
| InProgress | OnHold | reportIssue() | Operario | - |
| Completed | QualityCheck | - (auto) | Sistema | 30 minutos |
| QualityCheck | Approved | approveInspection() | Supervisor | - |
| QualityCheck | Rework | rejectInspection() | Supervisor | - |

---

## ST-003: Ciclo de Vida de Pedido E-commerce

```mermaid
stateDiagram-v2
    [*] --> Pending: Iniciar checkout
    
    Pending --> Paid: Pago confirmado
    Pending --> Cancelled: Timeout/Cancelar
    
    Paid --> Processing: Auto (stock confirmado)
    
    Processing --> Shipped: Enviar paquete
    Processing --> Cancelled: Reembolso
    
    Shipped --> InTransit: Carrier recoge
    
    InTransit --> Delivered: Confirmación entrega
    InTransit --> ReturnRequested: Cliente solicita devolución
    
    Delivered --> Completed: Auto (30 días)
    Delivered --> ReturnRequested: Cliente solicita devolución
    
    ReturnRequested --> ReturnReceived: Producto recibido
    ReturnReceived --> Refunded: Procesar reembolso
    
    Cancelled --> [*]
    Completed --> [*]
    Refunded --> [*]

    state Processing {
        [*] --> PreparingItems
        PreparingItems --> QualityCheck
        QualityCheck --> Packaging
        Packaging --> [*]
    }
```

### Tabla de Transiciones

| Estado Origen | Estado Destino | Evento | Tiempo Máximo |
|---------------|----------------|--------|---------------|
| Pending | Paid | stripeWebhook(payment_intent.succeeded) | 30 min |
| Pending | Cancelled | timeout / user_cancel | - |
| Paid | Processing | - (auto) | Inmediato |
| Processing | Shipped | shipOrder() | 3 días |
| Shipped | InTransit | carrierUpdate() | 1 día |
| InTransit | Delivered | carrierDelivered() | 7 días |
| Delivered | Completed | - (auto) | 30 días |

---

## ST-004: Ciclo de Vida de Máquina

```mermaid
stateDiagram-v2
    [*] --> Offline: Instalar máquina
    
    Offline --> Active: Encender
    
    Active --> Warning: Métricas anormales
    Active --> Error: Fallo detectado
    Active --> Maintenance: Mantenimiento programado
    Active --> Offline: Apagar
    
    Warning --> Active: Métricas normalizadas
    Warning --> Error: Fallo confirmado
    Warning --> Maintenance: Mantenimiento preventivo
    
    Error --> Maintenance: Iniciar reparación
    
    Maintenance --> Active: Reparación completada
    Maintenance --> Offline: Fuera de servicio
    
    Offline --> [*]: Desinstalar

    state Active {
        [*] --> Running
        Running --> Idle: Sin órdenes
        Idle --> Running: Orden asignada
    }
    
    state Warning {
        [*] --> TemperatureHigh
        [*] --> VibrationHigh
        [*] --> OEELow
    }
    
    state Error {
        [*] --> EmergencyStop
        [*] --> CommunicationLost
        [*] --> SensorFailure
    }
```

### Tabla de Transiciones

| Estado Origen | Estado Destino | Evento | Alerta |
|---------------|----------------|--------|--------|
| Active | Warning | metric.abnormal | Email + Push |
| Warning | Error | metric.critical | SMS + Email + Push |
| Active | Maintenance | maintenance.scheduled | Email |
| Error | Maintenance | maintenance.start | - |
| Maintenance | Active | maintenance.complete | Email |

---

## ST-005: Ciclo de Vida de Usuario

```mermaid
stateDiagram-v2
    [*] --> Invited: Admin crea usuario
    
    Invited --> Active: Primer login + cambio password
    Invited --> Expired: 24 horas sin activar
    
    Expired --> Invited: Admin reenvía invitación
    
    Active --> Blocked: 5 intentos fallidos
    Active --> Inactive: Admin desactiva
    Active --> Active: Login exitoso
    
    Blocked --> Active: Timeout (15 min) / Admin desbloquea
    
    Inactive --> Active: Admin reactiva
    Inactive --> Deleted: Admin elimina
    
    Blocked --> Inactive: Admin desactiva
    
    Deleted --> [*]
```

### Tabla de Transiciones

| Estado Origen | Estado Destino | Evento | Actor |
|---------------|----------------|--------|-------|
| - | Invited | createUser() | Admin |
| Invited | Active | firstLogin() + changePassword() | Usuario |
| Invited | Expired | - (auto 24h) | Sistema |
| Active | Blocked | failedLogin() × 5 | Sistema |
| Blocked | Active | - (auto 15min) | Sistema |
| Active | Inactive | deactivateUser() | Admin |
| Inactive | Deleted | deleteUser() | Admin |

---

## ST-006: Ciclo de Vida de Alerta

```mermaid
stateDiagram-v2
    [*] --> Created: Evento detectado
    
    Created --> Notified: Enviar notificaciones
    
    Notified --> Acknowledged: Usuario confirma recepción
    Notified --> Escalated: Timeout sin respuesta
    
    Escalated --> Notified: Notificar nivel superior
    
    Acknowledged --> InProgress: Iniciar resolución
    
    InProgress --> Resolved: Problema solucionado
    InProgress --> Escalated: Timeout en resolución
    
    Resolved --> Verified: Verificar solución
    
    Verified --> Closed: Solución confirmada
    Verified --> InProgress: Solución no efectiva
    
    Closed --> [*]
```

### SLA por Severidad

| Severidad | Tiempo para Acknowledge | Tiempo para Resolución |
|-----------|-------------------------|------------------------|
| Crítico | 15 minutos | 4 horas |
| Alto | 1 hora | 24 horas |
| Medio | 4 horas | 72 horas |
| Bajo | 24 horas | 1 semana |

---

## Trazabilidad

| Diagrama | Entidad | Modelo Prisma | Service |
|----------|---------|---------------|---------|
| ST-001 | ProductionOrder | `model ProductionOrder` | `ProductionService` |
| ST-002 | ProductionStage | `model ProductionStage` | `ProductionService` |
| ST-003 | Order | `model Order` | `OrdersService` |
| ST-004 | Machine | `model Machine` | `MachinesService` |
| ST-005 | User | `model User` | `AuthService` |
| ST-006 | Alert | `model Alert` | `AlertsService` |

---

*Notación: UML 2.5 - State Machine Diagram*
