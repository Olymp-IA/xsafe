# Diagramas de Secuencia

**Documento ID:** UML-SEQ-001  
**Versión:** 1.0.0  
**Clasificación:** INTERNO  
**Fecha:** 2026-01-14  

---

## Descripción

Los diagramas de secuencia muestran las interacciones entre objetos a lo largo del tiempo, representando el flujo de mensajes para escenarios específicos.

---

## SEC-001: Flujo de Autenticación (Login)

```mermaid
sequenceDiagram
    autonumber
    participant U as Usuario
    participant C as AuthController
    participant G as LocalGuard
    participant S as AuthService
    participant P as PrismaService
    participant J as JwtService
    participant R as Redis

    U->>C: POST /auth/login {email, password}
    C->>G: canActivate(context)
    G->>S: validateUser(email, password)
    S->>P: findUnique({where: {email}})
    P-->>S: User | null
    
    alt Usuario no encontrado
        S-->>G: throw UnauthorizedException
        G-->>C: false
        C-->>U: 401 Unauthorized
    end
    
    S->>S: bcrypt.compare(password, user.password)
    
    alt Password incorrecto
        S->>P: increment failedAttempts
        alt failedAttempts >= 5
            S->>P: update status = BLOCKED
            S-->>G: throw AccountBlockedException
        else
            S-->>G: throw UnauthorizedException
        end
        G-->>C: false
        C-->>U: 401 Unauthorized
    end
    
    S->>P: reset failedAttempts
    S-->>G: User (sin password)
    G-->>C: true (user en request)
    
    C->>S: login(user)
    S->>J: sign({sub: user.id, role: user.role})
    J-->>S: accessToken
    S->>J: sign({sub: user.id, type: 'refresh'})
    J-->>S: refreshToken
    S->>R: SET session:{userId} {tokens} EX 604800
    R-->>S: OK
    S-->>C: {accessToken, refreshToken, user}
    C-->>U: 200 OK {tokens, user}
```

---

## SEC-002: Flujo de Creación de Orden de Producción

```mermaid
sequenceDiagram
    autonumber
    participant U as Gerente
    participant C as ProductionController
    participant G as JwtGuard
    participant R as RolesGuard
    participant S as ProductionService
    participant I as InventoryService
    participant P as PrismaService
    participant E as EventEmitter

    U->>C: POST /production/orders {productId, quantity, date}
    C->>G: canActivate(context)
    G->>G: validateToken(bearer)
    G-->>C: true (user en request)
    
    C->>R: canActivate(context)
    R->>R: checkRole(user.role, [ADMIN, MANAGER])
    
    alt Rol no autorizado
        R-->>C: false
        C-->>U: 403 Forbidden
    end
    
    R-->>C: true
    C->>S: createOrder(dto)
    
    S->>I: checkMaterialsAvailability(productId, quantity)
    I->>P: findMany({where: {productId}})
    P-->>I: InventoryItem[]
    I->>I: calculateAvailable()
    
    alt Materiales insuficientes (< 80%)
        I-->>S: {available: false, missing: [...]}
        S-->>C: throw InsufficientMaterialsException
        C-->>U: 409 Conflict {missing materials}
    end
    
    I-->>S: {available: true}
    
    S->>P: productionOrder.create({data})
    P-->>S: ProductionOrder
    
    S->>S: generateStages(productId)
    S->>P: productionStage.createMany({data: stages})
    P-->>S: ProductionStage[]
    
    S->>I: reserveMaterials(productId, quantity)
    I->>P: update reservedQuantity
    P-->>I: OK
    I-->>S: OK
    
    S->>E: emit('production.order.created', {order})
    E-->>S: OK
    
    S-->>C: ProductionOrder (with stages)
    C-->>U: 201 Created {order}
```

---

## SEC-003: Flujo de Actualización de Etapa (Operario)

```mermaid
sequenceDiagram
    autonumber
    participant O as Operario
    participant C as ProductionController
    participant S as ProductionService
    participant P as PrismaService
    participant E as EventEmitter
    participant A as AlertsService
    participant W as WebSocket

    O->>C: PATCH /production/orders/:id/stage/:stageId {status: COMPLETED}
    
    Note over C: JwtGuard + RolesGuard validación
    
    C->>S: updateStage(orderId, stageId, dto)
    
    S->>P: productionStage.findUnique({where: {id: stageId}})
    P-->>S: ProductionStage
    
    alt Etapa no encontrada
        S-->>C: throw NotFoundException
        C-->>O: 404 Not Found
    end
    
    S->>S: validateStatusTransition(current, new)
    
    alt Transición inválida
        S-->>C: throw InvalidTransitionException
        C-->>O: 400 Bad Request
    end
    
    S->>P: productionStage.update({status, completedAt, operatorId})
    P-->>S: ProductionStage (updated)
    
    S->>S: checkNextStage(orderId)
    
    alt Hay siguiente etapa
        S->>P: productionStage.update(nextStage, {status: IN_PROGRESS})
        P-->>S: OK
        S->>E: emit('production.stage.started', {stage})
    end
    
    alt Era última etapa
        S->>P: productionOrder.update({status: COMPLETED, completedAt})
        P-->>S: ProductionOrder
        S->>E: emit('production.order.completed', {order})
    end
    
    S->>E: emit('production.stage.completed', {stage, order})
    E->>A: handleStageCompleted(event)
    A->>W: broadcast('production:update', {order, stage})
    W-->>W: Enviar a Monitor de Taller
    
    S-->>C: ProductionStage (updated)
    C-->>O: 200 OK {stage}
```

---

## SEC-004: Flujo de Checkout E-commerce

```mermaid
sequenceDiagram
    autonumber
    participant C as Cliente
    participant CH as CheckoutController
    participant CS as CheckoutService
    participant CA as CartService
    participant I as InventoryService
    participant ST as StripeService
    participant S as Stripe API
    participant O as OrdersService
    participant P as PrismaService
    participant E as EmailService

    C->>CH: POST /checkout {shippingAddress, paymentMethodId}
    
    Note over CH: JwtGuard validación
    
    CH->>CS: processCheckout(userId, dto)
    
    CS->>CA: getCart(userId)
    CA->>P: findMany({where: {userId}})
    P-->>CA: CartItem[]
    CA-->>CS: Cart {items, total}
    
    alt Carrito vacío
        CS-->>CH: throw EmptyCartException
        CH-->>C: 400 Bad Request
    end
    
    CS->>I: validateAndReserveStock(items)
    
    loop Para cada item
        I->>P: findFirst({where: {productId}})
        P-->>I: InventoryItem
        alt Stock insuficiente
            I-->>CS: throw InsufficientStockException
            CS-->>CH: 409 Conflict {item}
        end
        I->>P: update({reservedQuantity: +quantity})
        P-->>I: OK
    end
    
    I-->>CS: OK (stock reserved)
    
    CS->>ST: createPaymentIntent(amount, customerId)
    ST->>S: POST /payment_intents
    S-->>ST: PaymentIntent {id, client_secret}
    ST-->>CS: PaymentIntent
    
    CS->>ST: confirmPayment(intentId, paymentMethodId)
    ST->>S: POST /payment_intents/:id/confirm
    
    alt Pago rechazado
        S-->>ST: Error {code, message}
        ST-->>CS: throw PaymentFailedException
        CS->>I: releaseReservedStock(items)
        CS-->>CH: 402 Payment Required
        CH-->>C: 402 {error}
    end
    
    S-->>ST: PaymentIntent {status: succeeded}
    ST-->>CS: PaymentIntent (success)
    
    CS->>O: createOrder(userId, cart, paymentId)
    O->>P: order.create({data})
    P-->>O: Order
    O->>P: orderItem.createMany({data})
    P-->>O: OrderItem[]
    O-->>CS: Order (complete)
    
    CS->>I: consumeStock(items)
    I->>P: inventoryMovement.createMany({type: SALE})
    P-->>I: OK
    I->>P: update quantity -= sold
    P-->>I: OK
    I-->>CS: OK
    
    CS->>CA: clearCart(userId)
    CA->>P: deleteMany({where: {userId}})
    P-->>CA: OK
    CA-->>CS: OK
    
    CS->>E: sendOrderConfirmation(user, order)
    E-->>E: Queue email (async)
    E-->>CS: OK
    
    CS-->>CH: Order {id, status, total}
    CH-->>C: 201 Created {order}
```

---

## SEC-005: Flujo de Registro de Inspección de Calidad

```mermaid
sequenceDiagram
    autonumber
    participant S as Supervisor
    participant C as QualityController
    participant Q as QualityService
    participant P as PrismaService
    participant E as EventEmitter
    participant A as AlertsService

    S->>C: POST /quality/inspections {orderId, type, checklist, result}
    
    Note over C: JwtGuard + RolesGuard(SUPERVISOR)
    
    C->>Q: createInspection(userId, dto)
    
    Q->>P: productionOrder.findUnique({where: {id: orderId}})
    P-->>Q: ProductionOrder
    
    alt Orden no encontrada
        Q-->>C: throw NotFoundException
        C-->>S: 404 Not Found
    end
    
    Q->>P: inspection.create({data})
    P-->>Q: Inspection
    
    alt Resultado = FAILED
        Q->>P: defect.create({inspectionId, ...dto.defects})
        P-->>Q: Defect
        
        Q->>E: emit('quality.inspection.failed', {inspection})
        E->>A: handleInspectionFailed(event)
        A->>A: createAlert({type: QC_FAILURE, ...})
        A->>P: alert.create({data})
        P-->>A: Alert
        A->>A: notifyStakeholders()
    else Resultado = PASSED
        Q->>E: emit('quality.inspection.passed', {inspection})
    end
    
    Q-->>C: Inspection
    C-->>S: 201 Created {inspection}
```

---

## SEC-006: Flujo de Alerta de Stock Bajo

```mermaid
sequenceDiagram
    autonumber
    participant SYS as Sistema (Cron)
    participant I as InventoryService
    participant P as PrismaService
    participant A as AlertsService
    participant E as EmailService
    participant SMS as TwilioService
    participant W as WebSocket

    SYS->>I: checkLowStockLevels()
    
    I->>P: findMany({where: {quantity <= minStock}})
    P-->>I: InventoryItem[] (low stock)
    
    loop Para cada item con stock bajo
        I->>A: createStockAlert(item)
        
        A->>P: alert.create({type: LOW_STOCK, ...})
        P-->>A: Alert
        
        A->>P: findMany({where: {role: MANAGER}})
        P-->>A: User[] (managers)
        
        par Notificaciones paralelas
            A->>E: sendLowStockEmail(managers, item)
            E-->>E: Queue emails
        and
            A->>SMS: sendSMS(emergencyContact, message)
            SMS-->>SMS: Send SMS
        and
            A->>W: broadcast('inventory:lowStock', {item})
            W-->>W: Notify connected clients
        end
    end
    
    I-->>SYS: {alertsCreated: count}
```

---

## Trazabilidad

| Diagrama | Caso de Uso | Componentes |
|----------|-------------|-------------|
| SEC-001 | CU-AUTH-001 | AuthController, AuthService, JwtService |
| SEC-002 | CU-PROD-001 | ProductionController, ProductionService, InventoryService |
| SEC-003 | CU-PROD-002 | ProductionController, ProductionService, EventEmitter |
| SEC-004 | CU-ECOM-002 | CheckoutController, CheckoutService, StripeService |
| SEC-005 | CU-QC-001 | QualityController, QualityService, AlertsService |
| SEC-006 | - (Proceso automático) | InventoryService, AlertsService |

---

*Notación: UML 2.5 - Sequence Diagram*
