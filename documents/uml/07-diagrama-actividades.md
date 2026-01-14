# Diagramas de Actividades

**Documento ID:** UML-ACT-001  
**Versión:** 1.0.0  
**Clasificación:** INTERNO  
**Fecha:** 2026-01-14  

---

## Descripción

Los diagramas de actividades modelan flujos de trabajo y procesos de negocio, mostrando actividades, decisiones y flujos paralelos.

---

## ACT-001: Proceso de Orden de Producción

```mermaid
flowchart TD
    Start([Inicio]) --> CreateOrder[Crear Orden de Producción]
    CreateOrder --> CheckMaterials{¿Materiales<br>disponibles?}
    
    CheckMaterials -->|No| AlertPurchasing[Alertar a Compras]
    AlertPurchasing --> WaitMaterials[Esperar Materiales]
    WaitMaterials --> CheckMaterials
    
    CheckMaterials -->|Sí| ReserveMaterials[Reservar Materiales]
    ReserveMaterials --> ScheduleProduction[Programar Producción]
    ScheduleProduction --> NotifyOperators[Notificar Operarios]
    
    NotifyOperators --> StartProduction[Iniciar Producción]
    
    StartProduction --> Stage1[Etapa: Corte]
    Stage1 --> QC1{¿Pasa QC?}
    QC1 -->|No| Rework1[Retrabajo/Rechazo]
    Rework1 --> Stage1
    QC1 -->|Sí| Stage2[Etapa: Soldadura]
    
    Stage2 --> QC2{¿Pasa QC?}
    QC2 -->|No| Rework2[Retrabajo/Rechazo]
    Rework2 --> Stage2
    QC2 -->|Sí| Stage3[Etapa: Pintura]
    
    Stage3 --> QC3{¿Pasa QC?}
    QC3 -->|No| Rework3[Retrabajo/Rechazo]
    Rework3 --> Stage3
    QC3 -->|Sí| Stage4[Etapa: Ensamble]
    
    Stage4 --> FinalQC{¿Inspección<br>Final OK?}
    FinalQC -->|No| FinalRework[Retrabajo Final]
    FinalRework --> Stage4
    
    FinalQC -->|Sí| UpdateInventory[Actualizar Inventario]
    UpdateInventory --> CompleteOrder[Completar Orden]
    CompleteOrder --> NotifyCompletion[Notificar Gerencia]
    NotifyCompletion --> End([Fin])
```

---

## ACT-002: Proceso de Checkout E-commerce

```mermaid
flowchart TD
    Start([Cliente en Carrito]) --> CheckCart{¿Carrito<br>tiene productos?}
    
    CheckCart -->|No| RedirectStore[Redirigir a Tienda]
    RedirectStore --> End1([Fin])
    
    CheckCart -->|Sí| ValidateStock[Validar Stock]
    ValidateStock --> StockOK{¿Stock<br>disponible?}
    
    StockOK -->|No| ShowStockError[Mostrar Error de Stock]
    ShowStockError --> UpdateCart[Actualizar Carrito]
    UpdateCart --> ValidateStock
    
    StockOK -->|Sí| ReserveTemp[Reservar Stock Temporal]
    ReserveTemp --> InputShipping[Ingresar Dirección Envío]
    InputShipping --> CalculateShipping[Calcular Costo Envío]
    CalculateShipping --> ShowTotal[Mostrar Total]
    
    ShowTotal --> SelectPayment[Seleccionar Método de Pago]
    SelectPayment --> InputPayment[Ingresar Datos de Pago]
    InputPayment --> ProcessPayment[Procesar Pago con Stripe]
    
    ProcessPayment --> PaymentResult{¿Pago<br>exitoso?}
    
    PaymentResult -->|No| ShowPaymentError[Mostrar Error de Pago]
    ShowPaymentError --> ReleaseStock[Liberar Stock Reservado]
    ReleaseStock --> SelectPayment
    
    PaymentResult -->|Sí| CreateOrder[Crear Orden]
    CreateOrder --> ConsumeStock[Consumir Stock]
    ConsumeStock --> ClearCart[Vaciar Carrito]
    ClearCart --> SendConfirmation[Enviar Email Confirmación]
    
    SendConfirmation --> fork1(( ))
    fork1 --> CreateProductionOrder[Crear Orden Producción]
    fork1 --> ShowSuccess[Mostrar Página Éxito]
    CreateProductionOrder --> join1(( ))
    ShowSuccess --> join1
    
    join1 --> End2([Fin - Orden Completada])
```

---

## ACT-003: Proceso de Inspección de Calidad

```mermaid
flowchart TD
    Start([Iniciar Inspección]) --> SelectOrder[Seleccionar Orden/Etapa]
    SelectOrder --> LoadChecklist[Cargar Checklist según Producto]
    
    LoadChecklist --> PerformChecks[Realizar Verificaciones]
    
    subgraph Checklist["Checklist de Inspección"]
        PerformChecks --> Item1[Verificar Dimensiones]
        Item1 --> Item2[Verificar Acabado]
        Item2 --> Item3[Verificar Funcionalidad]
        Item3 --> Item4[Tomar Mediciones]
        Item4 --> Item5[Verificar Documentación]
    end
    
    Item5 --> AllPass{¿Todos los<br>ítems OK?}
    
    AllPass -->|Sí| MarkPassed[Marcar como APROBADO]
    MarkPassed --> UpdateStage[Actualizar Etapa]
    UpdateStage --> End1([Continuar Producción])
    
    AllPass -->|No| IdentifyDefects[Identificar Defectos]
    IdentifyDefects --> ClassifyDefect{Clasificar<br>Severidad}
    
    ClassifyDefect -->|Crítico| StopProduction[Detener Producción]
    StopProduction --> NotifyManagement[Notificar Gerencia]
    
    ClassifyDefect -->|Mayor| DocumentDefect[Documentar Defecto]
    DocumentDefect --> AssessRework{¿Es<br>reparable?}
    
    ClassifyDefect -->|Menor| DocumentMinor[Documentar y Continuar]
    DocumentMinor --> UpdateStage
    
    AssessRework -->|Sí| SendToRework[Enviar a Retrabajo]
    SendToRework --> WaitRework[Esperar Retrabajo]
    WaitRework --> PerformChecks
    
    AssessRework -->|No| MarkRejected[Marcar como RECHAZADO]
    MarkRejected --> UpdateScrap[Actualizar Merma]
    UpdateScrap --> NotifyManagement
    
    NotifyManagement --> CreateIncident[Crear Ticket de Incidente]
    CreateIncident --> RootCauseAnalysis[Análisis de Causa Raíz]
    RootCauseAnalysis --> ImplementCorrectiveActions[Implementar Acciones Correctivas]
    ImplementCorrectiveActions --> End2([Fin])
```

---

## ACT-004: Proceso de Gestión de Inventario (Entrada de Materiales)

```mermaid
flowchart TD
    Start([Recepción de Materiales]) --> VerifyDocuments[Verificar Documentos<br>Factura/Guía]
    
    VerifyDocuments --> DocsOK{¿Documentos<br>correctos?}
    DocsOK -->|No| ContactSupplier[Contactar Proveedor]
    ContactSupplier --> ResolveIssue[Resolver Discrepancia]
    ResolveIssue --> VerifyDocuments
    
    DocsOK -->|Sí| ReceivingInspection[Inspección de Recepción]
    
    ReceivingInspection --> fork1(( ))
    fork1 --> CheckQuantity[Verificar Cantidad]
    fork1 --> CheckQuality[Verificar Calidad]
    fork1 --> CheckPackaging[Verificar Embalaje]
    
    CheckQuantity --> join1(( ))
    CheckQuality --> join1
    CheckPackaging --> join1
    
    join1 --> AllOK{¿Todo<br>conforme?}
    
    AllOK -->|No| PartialAcceptance{¿Aceptar<br>parcial?}
    PartialAcceptance -->|No| RejectShipment[Rechazar Envío]
    RejectShipment --> ReturnToSupplier[Devolver a Proveedor]
    ReturnToSupplier --> DocumentReturn[Documentar Devolución]
    DocumentReturn --> End1([Fin - Rechazado])
    
    PartialAcceptance -->|Sí| AcceptPartial[Aceptar Parcial]
    AcceptPartial --> DocumentDiscrepancy[Documentar Discrepancia]
    DocumentDiscrepancy --> RegisterMovement
    
    AllOK -->|Sí| RegisterMovement[Registrar Movimiento de Entrada]
    RegisterMovement --> UpdateStock[Actualizar Stock en Sistema]
    UpdateStock --> AssignLocation[Asignar Ubicación en Almacén]
    AssignLocation --> PrintLabels[Imprimir Etiquetas]
    PrintLabels --> StoreProducts[Almacenar Productos]
    
    StoreProducts --> CheckAlerts{¿Había alerta<br>de stock bajo?}
    CheckAlerts -->|Sí| CloseAlert[Cerrar Alerta de Stock]
    CheckAlerts -->|No| End2
    CloseAlert --> End2([Fin - Entrada Completada])
```

---

## ACT-005: Proceso de Alerta y Respuesta

```mermaid
flowchart TD
    Start([Evento Detectado]) --> ClassifyEvent{Tipo de<br>Evento}
    
    ClassifyEvent -->|Stock Bajo| StockAlert[Crear Alerta de Stock]
    ClassifyEvent -->|Falla Máquina| MachineAlert[Crear Alerta de Máquina]
    ClassifyEvent -->|QC Fallido| QCAlert[Crear Alerta de Calidad]
    ClassifyEvent -->|Seguridad| SecurityAlert[Crear Alerta de Seguridad]
    
    StockAlert --> DetermineSeverity1{Severidad}
    MachineAlert --> DetermineSeverity2{Severidad}
    QCAlert --> DetermineSeverity3{Severidad}
    SecurityAlert --> NotifyImmediate[Notificación Inmediata]
    
    DetermineSeverity1 -->|Crítico| NotifyImmediate
    DetermineSeverity1 -->|Alto| NotifyUrgent[Notificación Urgente]
    DetermineSeverity1 -->|Normal| NotifyRoutine[Notificación Rutinaria]
    
    DetermineSeverity2 -->|Crítico| NotifyImmediate
    DetermineSeverity2 -->|Alto| NotifyUrgent
    DetermineSeverity2 -->|Normal| NotifyRoutine
    
    DetermineSeverity3 -->|Crítico| NotifyImmediate
    DetermineSeverity3 -->|Alto| NotifyUrgent
    DetermineSeverity3 -->|Normal| NotifyRoutine
    
    NotifyImmediate --> fork1(( ))
    fork1 --> SendSMS[Enviar SMS]
    fork1 --> SendEmail1[Enviar Email]
    fork1 --> PushNotif1[Push Notification]
    fork1 --> UpdateDashboard1[Actualizar Dashboard]
    SendSMS --> join1(( ))
    SendEmail1 --> join1
    PushNotif1 --> join1
    UpdateDashboard1 --> join1
    
    NotifyUrgent --> fork2(( ))
    fork2 --> SendEmail2[Enviar Email]
    fork2 --> PushNotif2[Push Notification]
    fork2 --> UpdateDashboard2[Actualizar Dashboard]
    SendEmail2 --> join2(( ))
    PushNotif2 --> join2
    UpdateDashboard2 --> join2
    
    NotifyRoutine --> SendEmail3[Enviar Email]
    SendEmail3 --> UpdateDashboard3[Actualizar Dashboard]
    
    join1 --> WaitResponse[Esperar Respuesta]
    join2 --> WaitResponse
    UpdateDashboard3 --> WaitResponse
    
    WaitResponse --> ResponseReceived{¿Respuesta<br>recibida?}
    
    ResponseReceived -->|No después de SLA| Escalate[Escalar Alerta]
    Escalate --> NotifyImmediate
    
    ResponseReceived -->|Sí| TakeAction[Tomar Acción Correctiva]
    TakeAction --> ResolveIssue[Resolver Problema]
    ResolveIssue --> VerifyResolution{¿Problema<br>resuelto?}
    
    VerifyResolution -->|No| TakeAction
    VerifyResolution -->|Sí| CloseAlert[Cerrar Alerta]
    CloseAlert --> DocumentResolution[Documentar Resolución]
    DocumentResolution --> End([Fin])
```

---

## Trazabilidad

| Diagrama | Proceso de Negocio | Módulos Involucrados |
|----------|-------------------|----------------------|
| ACT-001 | Fabricación de productos | Production, Inventory, Quality |
| ACT-002 | Venta online | E-commerce, Inventory, Production |
| ACT-003 | Control de calidad | Quality, Production, Alerts |
| ACT-004 | Recepción de materiales | Inventory, Alerts |
| ACT-005 | Gestión de alertas | Alerts, todos los módulos |

---

*Notación: UML 2.5 - Activity Diagram*
