# Diagrama de Casos de Uso

**Documento ID:** UML-UC-001  
**Versión:** 1.0.0  
**Clasificación:** INTERNO  
**Fecha:** 2026-01-14  

---

## Descripción

Los diagramas de casos de uso muestran las interacciones entre actores y el sistema, representando las funcionalidades desde la perspectiva del usuario.

---

## Diagrama General del Sistema

```mermaid
graph TB
    subgraph "Actores"
        Admin(("👔 Administrador"))
        Manager(("📊 Gerente"))
        Operator(("👷 Operario"))
        Supervisor(("📋 Supervisor"))
        Customer(("🛒 Cliente"))
    end
    
    subgraph "Sistema XSafe ERP"
        subgraph "Autenticación"
            UC_Login["CU-001<br>Iniciar Sesión"]
            UC_Logout["CU-002<br>Cerrar Sesión"]
            UC_Recovery["CU-003<br>Recuperar Contraseña"]
            UC_Profile["CU-004<br>Gestionar Perfil"]
        end
        
        subgraph "Gestión de Usuarios"
            UC_CreateUser["CU-010<br>Crear Usuario"]
            UC_EditUser["CU-011<br>Editar Usuario"]
            UC_BlockUser["CU-012<br>Bloquear Usuario"]
            UC_Roles["CU-013<br>Asignar Roles"]
        end
        
        subgraph "Producción"
            UC_CreateOrder["CU-020<br>Crear Orden Producción"]
            UC_ViewOrders["CU-021<br>Consultar Órdenes"]
            UC_UpdateStage["CU-022<br>Actualizar Etapa"]
            UC_ReportIssue["CU-023<br>Reportar Problema"]
            UC_ProdMetrics["CU-024<br>Ver Métricas"]
        end
        
        subgraph "Inventario"
            UC_ViewStock["CU-030<br>Consultar Stock"]
            UC_Movement["CU-031<br>Registrar Movimiento"]
            UC_Adjust["CU-032<br>Ajustar Inventario"]
            UC_Transfer["CU-033<br>Transferir Stock"]
            UC_Alerts["CU-034<br>Gestionar Alertas"]
        end
        
        subgraph "Calidad"
            UC_Inspect["CU-040<br>Registrar Inspección"]
            UC_Defect["CU-041<br>Reportar Defecto"]
            UC_QCMetrics["CU-042<br>Ver Métricas QC"]
        end
        
        subgraph "Maquinaria"
            UC_MachStatus["CU-050<br>Ver Estado Máquinas"]
            UC_OEE["CU-051<br>Consultar OEE"]
            UC_Maintenance["CU-052<br>Solicitar Mantenimiento"]
        end
        
        subgraph "E-commerce"
            UC_Browse["CU-060<br>Navegar Catálogo"]
            UC_Cart["CU-061<br>Gestionar Carrito"]
            UC_Checkout["CU-062<br>Procesar Checkout"]
            UC_OrderHist["CU-063<br>Ver Historial"]
            UC_Review["CU-064<br>Escribir Reseña"]
        end
        
        subgraph "Reportes"
            UC_Reports["CU-070<br>Generar Reportes"]
            UC_Export["CU-071<br>Exportar Datos"]
            UC_Dashboard["CU-072<br>Ver Dashboard"]
        end
    end
    
    %% Relaciones Admin
    Admin --> UC_Login
    Admin --> UC_CreateUser
    Admin --> UC_EditUser
    Admin --> UC_BlockUser
    Admin --> UC_Roles
    Admin --> UC_Reports
    
    %% Relaciones Manager
    Manager --> UC_Login
    Manager --> UC_CreateOrder
    Manager --> UC_ViewOrders
    Manager --> UC_ProdMetrics
    Manager --> UC_ViewStock
    Manager --> UC_Adjust
    Manager --> UC_OEE
    Manager --> UC_Reports
    Manager --> UC_Dashboard
    
    %% Relaciones Operator
    Operator --> UC_Login
    Operator --> UC_ViewOrders
    Operator --> UC_UpdateStage
    Operator --> UC_ReportIssue
    Operator --> UC_ViewStock
    Operator --> UC_Movement
    
    %% Relaciones Supervisor
    Supervisor --> UC_Login
    Supervisor --> UC_Inspect
    Supervisor --> UC_Defect
    Supervisor --> UC_QCMetrics
    Supervisor --> UC_MachStatus
    
    %% Relaciones Customer
    Customer --> UC_Login
    Customer --> UC_Browse
    Customer --> UC_Cart
    Customer --> UC_Checkout
    Customer --> UC_OrderHist
    Customer --> UC_Review
```

---

## Diagrama de Casos de Uso: Módulo de Autenticación

```mermaid
graph LR
    subgraph "Actores"
        User(("Usuario"))
        Admin(("Admin"))
        System(("Sistema"))
    end
    
    subgraph "Módulo de Autenticación"
        Login["CU-001<br>Iniciar Sesión"]
        Logout["CU-002<br>Cerrar Sesión"]
        Recovery["CU-003<br>Recuperar Contraseña"]
        Profile["CU-004<br>Gestionar Perfil"]
        ChangePass["CU-005<br>Cambiar Contraseña"]
        MFA["CU-006<br>Configurar MFA"]
        
        ValidateCredentials["«include»<br>Validar Credenciales"]
        GenerateToken["«include»<br>Generar Token"]
        SendEmail["«include»<br>Enviar Email"]
        LockAccount["«extend»<br>Bloquear Cuenta"]
    end
    
    User --> Login
    User --> Logout
    User --> Recovery
    User --> Profile
    User --> ChangePass
    User --> MFA
    
    Admin --> Login
    
    Login --> ValidateCredentials
    Login --> GenerateToken
    Login -.-> LockAccount
    
    Recovery --> SendEmail
    ChangePass --> ValidateCredentials
```

---

## Diagrama de Casos de Uso: Módulo de Producción

```mermaid
graph LR
    subgraph "Actores"
        Manager(("Gerente"))
        Operator(("Operario"))
    end
    
    subgraph "Módulo de Producción"
        CreateOrder["CU-020<br>Crear Orden"]
        ViewOrders["CU-021<br>Consultar Órdenes"]
        EditOrder["CU-022<br>Editar Orden"]
        CancelOrder["CU-023<br>Cancelar Orden"]
        UpdateStage["CU-024<br>Actualizar Etapa"]
        StartStage["CU-025<br>Iniciar Etapa"]
        CompleteStage["CU-026<br>Completar Etapa"]
        ReportIssue["CU-027<br>Reportar Problema"]
        ViewMetrics["CU-028<br>Ver Métricas"]
        
        CheckMaterials["«include»<br>Verificar Materiales"]
        NotifyOperators["«include»<br>Notificar Operarios"]
        EmitEvent["«include»<br>Emitir Evento"]
    end
    
    Manager --> CreateOrder
    Manager --> ViewOrders
    Manager --> EditOrder
    Manager --> CancelOrder
    Manager --> ViewMetrics
    
    Operator --> ViewOrders
    Operator --> UpdateStage
    Operator --> StartStage
    Operator --> CompleteStage
    Operator --> ReportIssue
    
    CreateOrder --> CheckMaterials
    CreateOrder --> NotifyOperators
    UpdateStage --> EmitEvent
    CompleteStage --> EmitEvent
```

---

## Diagrama de Casos de Uso: Módulo E-commerce

```mermaid
graph LR
    subgraph "Actores"
        Guest(("Visitante"))
        Customer(("Cliente"))
        Stripe(("Stripe API"))
    end
    
    subgraph "Módulo E-commerce"
        Browse["CU-060<br>Navegar Catálogo"]
        Search["CU-061<br>Buscar Productos"]
        ViewProduct["CU-062<br>Ver Producto"]
        View3D["CU-063<br>Visualizar 3D"]
        AddCart["CU-064<br>Agregar al Carrito"]
        ViewCart["CU-065<br>Ver Carrito"]
        UpdateCart["CU-066<br>Modificar Carrito"]
        Checkout["CU-067<br>Procesar Checkout"]
        Payment["CU-068<br>Realizar Pago"]
        OrderHistory["CU-069<br>Ver Historial"]
        WriteReview["CU-070<br>Escribir Reseña"]
        
        ValidateStock["«include»<br>Validar Stock"]
        ProcessPayment["«include»<br>Procesar Pago"]
        SendConfirmation["«include»<br>Enviar Confirmación"]
    end
    
    Guest --> Browse
    Guest --> Search
    Guest --> ViewProduct
    Guest --> View3D
    
    Customer --> Browse
    Customer --> Search
    Customer --> ViewProduct
    Customer --> View3D
    Customer --> AddCart
    Customer --> ViewCart
    Customer --> UpdateCart
    Customer --> Checkout
    Customer --> OrderHistory
    Customer --> WriteReview
    
    AddCart --> ValidateStock
    Checkout --> Payment
    Payment --> ProcessPayment
    ProcessPayment --> Stripe
    Checkout --> SendConfirmation
```

---

## Matriz de Casos de Uso por Actor

| Caso de Uso | Admin | Manager | Operator | Supervisor | Customer | Guest |
|-------------|-------|---------|----------|------------|----------|-------|
| Iniciar Sesión | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Gestionar Usuarios | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Crear Orden Producción | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Actualizar Etapa | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Registrar Inspección | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Consultar Stock | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Navegar Catálogo | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Procesar Checkout | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Ver Dashboard | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Generar Reportes | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Trazabilidad

| Caso de Uso | Requisito | Código Fuente | Manual Usuario |
|-------------|-----------|---------------|----------------|
| CU-001 Iniciar Sesión | REQ-AUTH-001 | `auth.service.ts:login()` | Sección 3.1 |
| CU-020 Crear Orden | REQ-PROD-001 | `production.service.ts:createOrder()` | Sección 4.2.2 |
| CU-067 Procesar Checkout | REQ-ECOM-003 | `checkout.service.ts:process()` | Sección 8.3 |

---

*Notación: UML 2.5 - Use Case Diagram*
