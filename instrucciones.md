# 🚀 **Prompts para Desarrollo de XSafe ERP en Antigravity IDE**

Aquí tienes la secuencia completa de prompts detallados para desarrollar XSafe ERP paso a paso:

---

## 📋 **PROMPT 1: CONFIGURACIÓN INICIAL DEL PROYECTO**

```
Crea un proyecto NestJS llamado "xsafe-erp" con la siguiente configuración:

1. ESTRUCTURA DE CARPETAS:
```
xsafe-erp/
├── apps/
│   ├── core-backend/          # API principal
│   │   ├── src/
│   │   │   ├── modules/       # Módulos de negocio
│   │   │   ├── shared/        # Utils, decorators, guards
│   │   │   ├── config/        # Configuración
│   │   │   └── main.ts
│   │   ├── prisma/            # Schema y migraciones
│   │   └── test/
│   ├── workshop-monitor/      # Aplicación en tiempo real
│   └── admin-dashboard/       # Panel de control
├── packages/
│   ├── shared-types/          # Interfaces TypeScript
│   ├── business-logic/        # Reglas de negocio
│   ├── ui-kit/                # Componentes React
│   └── config/                # Configuraciones compartidas
├── docker/
├── scripts/
└── documentation/
```

2. DEPENDENCIAS INICIALES (package.json):
- NestJS v10
- Prisma ORM con PostgreSQL
- Redis para cache
- Socket.io para monitoreo en tiempo real
- JWT para autenticación
- Swagger para documentación
- Jest para testing

3. CONFIGURACIÓN DOCKER (docker-compose.yml):
- PostgreSQL 15
- Redis 7
- MinIO para almacenamiento de archivos
- RabbitMQ para colas de mensajes
- pgAdmin para gestión de DB

4. GIT INITIAL:
- .gitignore configurado para Node.js/NestJS
- README.md con descripción del proyecto
- LICENSE MIT

Genera todos los archivos de configuración iniciales con valores por defecto seguros.
```

---

## 🏗️ **PROMPT 2: CONFIGURACIÓN DE BASE DE DATOS Y PRISMA**

```
Configura Prisma ORM para XSafe ERP con el siguiente schema de base de datos:

1. SCHEMA PRINCIPAL (prisma/schema.prisma):
```prisma
// Modelos principales para fabricación de defensas de motos
model Workshop {
  id          String   @id @default(cuid())
  name        String
  taxId       String   @unique
  address     String
  phone       String
  email       String   @unique
  status      WorkshopStatus @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  users       User[]
  orders      Order[]
  materials   Material[]
  machines    Machine[]
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String
  firstName   String
  lastName    String
  role        UserRole @default(OPERATOR)
  workshopId  String
  workshop    Workshop @relation(fields: [workshopId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// NUEVOS MODELOS ESPECÍFICOS PARA FABRICACIÓN DE DEFENSAS
model MotorcycleModel {
  id          String   @id @default(cuid())
  brand       String   // Honda, Yamaha, BMW, etc.
  model       String   // CBR600RR, R1, S1000RR, etc.
  year        Int
  engineCC    Int
  type        MotorcycleType // Sport, Touring, Adventure, Cruiser
  
  // Compatibilidad con productos
  compatibleProducts Product[]
  
  createdAt   DateTime @default(now())
}

model Material {
  id          String    @id @default(cuid())
  code        String    @unique
  name        String
  type        MaterialType // Acero_4130, Aluminio_6061, Policarbonato, etc.
  thickness   Float     // en mm
  width       Float     // en mm
  length      Float     // en mm
  quantity    Float     // en metros/kilogramos
  unit        MaterialUnit
  
  supplierId  String?
  supplier    Supplier? @relation(fields: [supplierId], references: [id])
  workshopId  String
  workshop    Workshop  @relation(fields: [workshopId], references: [id])
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id          String    @id @default(cuid())
  sku         String    @unique
  name        String    // "Defensa Honda CB500X", "Slider Yamaha MT-07"
  description String?
  category    ProductCategory // DEFENSE, CRASH_BAR, SLIDER, LUGGAGE_RACK
  price       Float
  
  // Especificaciones técnicas
  materialType    MaterialType
  weight          Float     // en kg
  dimensions      Json      // {length, width, height}
  finishType      FinishType // PINTADO, ANODIZADO, PULIDO
  
  // Compatibilidad
  compatibleModels MotorcycleModel[]
  
  workshopId  String
  workshop    Workshop @relation(fields: [workshopId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ProductionOrder {
  id          String          @id @default(cuid())
  orderNumber String          @unique
  customerId  String
  customer    Customer        @relation(fields: [customerId], references: [id])
  
  items       OrderItem[]
  
  // Proceso de fabricación
  status      ProductionStatus @default(DESIGN_APPROVAL)
  priority    PriorityLevel    @default(MEDIUM)
  
  // Fechas
  dueDate     DateTime
  startedAt   DateTime?
  completedAt DateTime?
  
  // Metadatos
  notes       String?
  workshopId  String
  workshop    Workshop @relation(fields: [workshopId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ProductionStage {
  id          String    @id @default(cuid())
  orderId     String
  order       ProductionOrder @relation(fields: [orderId], references: [id])
  
  stageType   ProductionStageType // CORTE, DOBLADO, SOLDADURA, PULIDO, PINTURA
  status      StageStatus @default(PENDING)
  
  assignedTo  String?   // User ID
  machineId   String?   // Machine ID
  startedAt   DateTime?
  completedAt DateTime?
  
  // Control de calidad
  qualityCheck   QualityCheck?
  
  // Tiempos estimados vs reales
  estimatedHours Float
  actualHours    Float?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Machine {
  id          String      @id @default(cuid())
  code        String      @unique
  name        String      // "Corte láser", "Dobladora CNC", "Máquina de soldar TIG"
  type        MachineType
  status      MachineStatus @default(AVAILABLE)
  
  // Especificaciones
  brand       String
  model       String
  capacity    String      // "10mm acero", "1500W"
  
  // Mantenimiento
  lastMaintenance DateTime?
  nextMaintenance DateTime?
  
  workshopId  String
  workshop    Workshop @relation(fields: [workshopId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model QualityCheck {
  id          String    @id @default(cuid())
  stageId     String    @unique
  stage       ProductionStage @relation(fields: [stageId], references: [id])
  
  inspectorId String
  inspector   User      @relation(fields: [inspectorId], references: [id])
  
  status      QualityStatus @default(PENDING)
  notes       String?
  
  // Checklist específico para defensas
  measurements Json      // {welds: number, dimensions: [...], finish: string}
  photos      String[]  // URLs de fotos
  
  passed      Boolean?
  createdAt   DateTime @default(now())
}

// ENUMS necesarios
enum WorkshopStatus { ACTIVE, INACTIVE, SUSPENDED }
enum UserRole { ADMIN, MANAGER, SUPERVISOR, OPERATOR, QUALITY_INSPECTOR }
enum MaterialType { ACERO_4130, ACERO_1020, ALUMINIO_6061, ALUMINIO_7075, POLICARBONATO, ACERO_INOXIDABLE }
enum MaterialUnit { METER, KILOGRAM, SHEET, UNIT }
enum ProductCategory { DEFENSE, CRASH_BAR, SLIDER, ENGINE_GUARD, LUGGAGE_RACK, WINDSCREEN, SIDE_CASE }
enum MotorcycleType { SPORT, TOURING, ADVENTURE, CRUISER, SCOOTER, DIRT }
enum ProductionStatus { 
  DESIGN_APPROVAL 
  MATERIAL_PREPARATION 
  CUTTING 
  BENDING 
  WELDING 
  GRINDING 
  POLISHING 
  FINISHING 
  QUALITY_CHECK 
  PACKAGING 
  READY_FOR_SHIPPING 
  COMPLETED 
  CANCELLED 
}
enum ProductionStageType { CUTTING, BENDING, WELDING, GRINDING, POLISHING, PAINTING, ANODIZING, ASSEMBLY, PACKAGING }
enum StageStatus { PENDING, IN_PROGRESS, COMPLETED, BLOCKED }
enum MachineType { LASER_CUTTER, CNC_BENDER, TIG_WELDER, MIG_WELDER, GRINDER, POLISHER, PAINT_BOOTH, ASSEMBLY_TABLE }
enum MachineStatus { AVAILABLE, IN_USE, MAINTENANCE, BROKEN }
enum QualityStatus { PENDING, IN_PROGRESS, PASSED, FAILED, REWORK_REQUIRED }
enum PriorityLevel { LOW, MEDIUM, HIGH, URGENT }
enum FinishType { PAINTED, ANODIZED, POLISHED, POWDER_COATED, RAW }
```

2. GENERAR MIGRACIÓN INICIAL:
```bash
npx prisma migrate dev --name init
```

3. CREAR SEED DATA para desarrollo:
- 1 workshop de ejemplo
- 3 usuarios con diferentes roles
- 10 modelos de motocicletas comunes
- 5 tipos de materiales básicos
- 3 máquinas típicas de taller

4. CONFIGURAR PRISMA CLIENT en el módulo principal de NestJS.
```

---

## 🛠️ **PROMPT 3: MÓDULO DE AUTENTICACIÓN Y AUTORIZACIÓN**

```
Crea un módulo de autenticación completo para XSafe ERP:

1. ESTRUCTURA DEL MÓDULO AUTH:
```
src/modules/auth/
├── auth.module.ts
├── auth.service.ts
├── auth.controller.ts
├── dto/
│   ├── login.dto.ts
│   ├── register.dto.ts
│   └── change-password.dto.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── roles.guard.ts
│   └── workshop.guard.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
└── interfaces/
    └── jwt-payload.interface.ts
```

2. IMPLEMENTAR FEATURES:
- Registro de talleres (Workshop) con usuario admin
- Login con email/password
- JWT tokens con refresh
- Roles por taller (Admin, Manager, Operator, Inspector)
- Protección por taller (cada usuario solo ve su taller)
- Cambio de contraseña
- Reset de contraseña por email

3. DTOs DE EJEMPLO:
```typescript
// register.dto.ts
export class RegisterWorkshopDto {
  @IsString()
  @MinLength(3)
  workshopName: string;
  
  @IsString()
  taxId: string;
  
  @IsEmail()
  adminEmail: string;
  
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
  password: string;
  
  @IsString()
  address: string;
  
  @IsPhoneNumber()
  phone: string;
}

// login.dto.ts  
export class LoginDto {
  @IsEmail()
  email: string;
  
  @IsString()
  password: string;
}
```

4. ENDPOINTS:
- POST /auth/register (registro workshop + admin)
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- POST /auth/change-password
- POST /auth/forgot-password
- POST /auth/reset-password

5. INTEGRAR CON MAILER para envío de emails de confirmación y reset.

6. CONFIGURAR JWT con secret seguro y expiration times.
```

---

## 🏭 **PROMPT 4: MÓDULO DE PRODUCCIÓN Y ORDENES**

```
Crea el módulo de producción específico para fabricación de defensas:

1. ESTRUCTURA:
```
src/modules/production/
├── production.module.ts
├── production.service.ts
├── production.controller.ts
├── dto/
│   ├── create-order.dto.ts
│   ├── update-stage.dto.ts
│   ├── assign-machine.dto.ts
│   └── production-report.dto.ts
├── entities/
│   └── production.entity.ts
├── repositories/
│   └── production.repository.ts
├── events/
│   ├── order-created.event.ts
│   ├── stage-completed.event.ts
│   └── production.handler.ts
└── queues/
    └── production.queue.ts
```

2. FLUJO DE TRABAJO COMPLETO:
```typescript
// Estado de una orden de defensas
Proceso: 
1. Recepción pedido → 2. Aprobación diseño → 3. Preparación material → 
4. Corte láser → 5. Doblado CNC → 6. Soldadura TIG → 
7. Desbarbado/pulido → 8. Acabado (pintura/anodizado) → 
9. Control calidad → 10. Embalaje → 11. Envío
```

3. ENDPOINTS PRINCIPALES:
```
POST    /production/orders          # Crear nueva orden
GET     /production/orders          # Listar todas las órdenes
GET     /production/orders/:id      # Ver detalle orden
PUT     /production/orders/:id      # Actualizar orden
POST    /production/orders/:id/start # Iniciar producción
POST    /production/orders/:id/stages/:stageId/complete # Completar etapa
GET     /production/orders/workshop/:workshopId/stats # Estadísticas
GET     /production/orders/due-today # Órdenes vencen hoy
```

4. LÓGICA DE NEGOCIO ESPECÍFICA:
- Cálculo automático de tiempo estimado basado en:
  * Tipo de defensa (simple/compleja)
  * Material (acero/aluminio)
  * Acabado requerido
- Asignación automática de máquina disponible
- Notificaciones cuando etapa se retrasa
- Cálculo de eficiencia por operario
- Consumo automático de materiales

5. INTEGRAR CON SOCKET.IO para actualizaciones en tiempo real:
- Notificar a dashboard cuando orden cambia de estado
- Alertas cuando máquina necesita mantenimiento
- Actualización en tiempo real de progreso

6. GENERAR REPORTES:
- Producción diaria/semanal/mensual
- Tiempos promedio por etapa
- Eficiencia de operarios
- Uso de máquinas
- Defectos de calidad recurrentes
```

---

## 🔧 **PROMPT 5: MÓDULO DE INVENTARIO Y MATERIALES**

```
Crea un sistema de inventario inteligente para materiales de fabricación:

1. ESTRUCTURA:
```
src/modules/inventory/
├── inventory.module.ts
├── inventory.service.ts
├── inventory.controller.ts
├── dto/
│   ├── material-request.dto.ts
│   ├── adjust-stock.dto.ts
│   └── low-stock-alert.dto.ts
├── entities/
│   ├── material.entity.ts
│   └── stock-movement.entity.ts
├── repositories/
│   ├── material.repository.ts
│   └── stock.repository.ts
└── alerts/
    └── stock-alert.service.ts
```

2. CARACTERÍSTICAS:
- Gestión de múltiples tipos de materiales:
  * Tubos de acero (redondos, cuadrados) en metros
  * Planchas de aluminio en hojas
  * Policarbonato en planchas
  * Tornillería en unidades
  * Materiales de acabado (pintura, anodizado)

- Control de stock mínimo/máximo por material
- Alertas automáticas cuando stock bajo
- Sugerencias de compra basadas en producción planificada
- Trazabilidad de lotes
- Cálculo de costo por producto

3. ENDPOINTS:
```
GET     /inventory/materials        # Listar materiales
POST    /inventory/materials        # Crear nuevo material
GET     /inventory/materials/:id    # Ver material
PUT     /inventory/materials/:id    # Actualizar material
DELETE  /inventory/materials/:id    # Eliminar material
POST    /inventory/materials/:id/adjust # Ajustar stock
GET     /inventory/materials/low-stock # Materiales con stock bajo
GET     /inventory/materials/consumption-report # Reporte consumo
POST    /inventory/materials/request # Solicitar material a producción
```

4. INTEGRACIÓN CON PRODUCCIÓN:
- Consumo automático al iniciar etapa de producción
- Bloqueo de órdenes si no hay material suficiente
- Cálculo de scrap/desperdicio por orden
- Sugerencia de material alternativo

5. PROVEEDORES:
- Gestión de proveedores de materiales
- Histórico de precios
- Tiempos de entrega
- Calificación de proveedores
```

---

## 📱 **PROMPT 6: PANEL DE CONTROL EN TIEMPO REAL**

```
Crea una aplicación React para monitoreo en tiempo real del taller:

1. ESTRUCTURA DE CARPETA:
```
apps/workshop-monitor/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── ProductionOverview.tsx
│   │   │   ├── MachineStatus.tsx
│   │   │   ├── OrderQueue.tsx
│   │   │   └── AlertsPanel.tsx
│   │   ├── production/
│   │   │   ├── OrderCard.tsx
│   │   │   ├── StageProgress.tsx
│   │   │   └── TimelineView.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── WorkshopSelector.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Production.tsx
│   │   ├── Machines.tsx
│   │   └── Quality.tsx
│   ├── hooks/
│   │   ├── useWebSocket.ts
│   │   └── useProduction.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── websocket.ts
│   └── styles/
```

2. VISTAS PRINCIPALES:

A. **DASHBOARD PRINCIPAL**:
- Resumen producción del día (órdenes completadas/en progreso)
- Estado de máquinas (color-coded por disponibilidad)
- Alertas urgentes (stock bajo, retrasos, fallas calidad)
- Métricas clave (OEE, eficiencia, scrap rate)

B. **VISTA DE PRODUCCIÓN**:
- Timeline visual de todas las órdenes en progreso
- Tarjetas de orden con progreso por etapa
- Detalle al hacer click (materiales, operario, máquina)
- Botones de acción rápida (marcar como completado, reportar problema)

C. **MONITOR DE MÁQUINAS**:
- Grid de todas las máquinas con estado en tiempo real
- Detalle de máquina (órden en proceso, tiempo restante)
- Histórico de uso
- Programación de mantenimiento

D. **CONTROL DE CALIDAD**:
- Checklist para inspección de defensas
- Subida de fotos de defectos
- Aprobación/rechazo con comentarios
- Reporte de defectos recurrentes

3. TECNOLOGÍAS:
- React 18 con TypeScript
- Tailwind CSS para estilos
- Socket.io Client para tiempo real
- Recharts para gráficos
- React Query para gestión de estado del servidor

4. INTEGRACIÓN CON BACKEND:
- WebSocket para actualizaciones en tiempo real
- API REST para datos maestros
- Autenticación JWT
- Filtrado por taller

5. FEATURES ESPECIALES:
- Notificaciones push para eventos importantes
- Modo oscuro/claro
- Responsive design para tablets en taller
- Impresión de etiquetas para órdenes
- Códigos QR para tracking de órdenes
```

---

## 🔐 **PROMPT 7: MÓDULO DE CALIDAD Y CERTIFICACIONES**

```
Crea un sistema de control de calidad específico para defensas de motos:

1. ESTRUCTURA:
```
src/modules/quality/
├── quality.module.ts
├── quality.service.ts
├── quality.controller.ts
├── dto/
│   ├── inspection.dto.ts
│   ├── defect-report.dto.ts
│   └── certificate.dto.ts
├── entities/
│   ├── inspection.entity.ts
│   ├── defect.entity.ts
│   └── certificate.entity.ts
├── checklists/
│   ├── welding-checklist.ts
│   ├── finish-checklist.ts
│   └── safety-checklist.ts
└── reports/
    └── quality-report.service.ts
```

2. CHECKLISTS ESPECÍFICOS PARA DEFENSAS:

A. **INSPECCIÓN DE SOLDADURA**:
- Penetración completa
- Uniformidad del cordón
- Ausencia de porosidad
- Limpieza entre pasadas
- Distorsión aceptable

B. **INSPECCIÓN DE ACABADO**:
- Uniformidad de pintura/anodizado
- Ausencia de rayones
- Protección contra corrosión
- Calidad de pulido

C. **PRUEBAS DE RESISTENCIA**:
- Test de carga (simulación de caída)
- Inspección visual post-test
- Verificación de anclajes
- Comprobación de ajuste al chasis

3. CERTIFICACIONES:
- Generación de certificado por lote
- Trazabilidad de materiales (certificado de origen)
- Registro de pruebas realizadas
- Cumplimiento de normas (DOT, ECE, etc.)

4. SISTEMA DE DEFECTOS:
- Categorización de defectos (crítico, mayor, menor)
- Análisis de causa raíz
- Planes de acción correctiva
- Seguimiento de defectos recurrentes

5. REPORTES ESTADÍSTICOS:
- Tasa de defectos por tipo
- Eficiencia de inspectores
- Costo de calidad
- Tendencia de mejora
```

---

## 🤖 **PROMPT 8: INTEGRACIÓN CON MÁQUINAS CNC**

```
Crea módulo para integración con máquinas CNC del taller:

1. ESTRUCTURA:
```
src/modules/cnc-integration/
├── cnc-integration.module.ts
├── cnc-integration.service.ts
├── drivers/
│   ├── laser-cutter.driver.ts
│   ├── cnc-bender.driver.ts
│   └── generic-gcode.driver.ts
├── parsers/
│   ├── dxf.parser.ts
│   └── gcode.parser.ts
├── jobs/
│   ├── cutting-job.ts
│   ├── bending-job.ts
│   └── job-queue.service.ts
└── monitoring/
    └── machine-monitor.service.ts
```

2. CARACTERÍSTICAS:

A. **IMPORTACIÓN DE DISEÑOS**:
- Importar archivos DXF (AutoCAD)
- Convertir a G-code automáticamente
- Optimización de rutas de corte
- Cálculo de tiempo estimado

B. **COMUNICACIÓN CON MÁQUINAS**:
- Protocolos soportados: Modbus TCP, OPC UA, MQTT
- Monitoreo en tiempo real de estado
- Envío remoto de programas
- Recepción de alarmas

C. **GESTIÓN DE PROGRAMAS CNC**:
- Biblioteca de programas comunes
- Versión de programas
- Asociación programa → material → máquina
- Historial de uso

D. **ANÁLISIS DE EFICIENCIA**:
- Tiempo real vs estimado
- Uso de herramientas
- Desgaste de consumibles
- Sugerencias de optimización

3. ENDPOINTS:
```
POST    /cnc/upload-design      # Subir diseño DXF
POST    /cnc/generate-program   # Generar G-code
POST    /cnc/send-to-machine    # Enviar a máquina
GET     /cnc/machine-status/:id # Estado máquina
POST    /cnc/start-job          # Iniciar trabajo
POST    /cnc/pause-job          # Pausar trabajo
GET     /cnc/job-progress/:id   # Progreso trabajo
```

4. INTEGRACIÓN CON PRODUCCIÓN:
- Automatización completa: Orden → Diseño → G-code → Máquina
- Registro automático de inicio/fin en producción
- Actualización de stock de materiales
- Notificaciones de completado
```

---

## 📊 **PROMPT 9: ANALYTICS Y REPORTES**

```
Crea módulo de analytics para toma de decisiones:

1. ESTRUCTURA:
```
src/modules/analytics/
├── analytics.module.ts
├── analytics.service.ts
├── analytics.controller.ts
├── metrics/
│   ├── oee-calculator.ts
│   ├── efficiency-calculator.ts
│   └── cost-calculator.ts
├── reports/
│   ├── daily-production.report.ts
│   ├── machine-utilization.report.ts
│   └── financial.report.ts
├── dashboards/
│   ├── production-dashboard.ts
│   ├── financial-dashboard.ts
│   └── quality-dashboard.ts
└── exports/
    └── excel-exporter.service.ts
```

2. MÉTRICAS CLAVE (KPIs):

A. **PRODUCCIÓN**:
- OEE (Overall Equipment Effectiveness)
- Takt Time vs Cycle Time
- Throughput diario/semanal/mensual
- Tiempo promedio por etapa
- Tasa de scrap/desperdicio

B. **CALIDAD**:
- First Pass Yield
- Tasa de defectos por tipo
- Costo de calidad
- Eficiencia de inspección

C. **FINANCIERAS**:
- Costo por producto
- Margen por producto
- Utilización de materiales
- ROI por máquina

D. **MANTENIMIENTO**:
- MTBF (Mean Time Between Failures)
- MTTR (Mean Time To Repair)
- Cumplimiento de mantenimiento preventivo

3. REPORTES AUTOMÁTICOS:
- Reporte diario de producción (8:00 AM)
- Alertas de métricas fuera de rango
- Comparativa semana actual vs anterior
- Forecast de producción basado en histórico

4. DASHBOARDS INTERACTIVOS:
- Gráficos actualizables en tiempo real
- Filtros por fecha, producto, máquina
- Drill-down a detalle
- Exportación a PDF/Excel

5. PREDICTIVO:
- Predicción de fecha de entrega
- Detección temprana de problemas
- Sugerencias de optimización
- Alertas predictivas de mantenimiento
```

---

## 🚨 **PROMPT 10: SISTEMA DE ALERTAS Y NOTIFICACIONES**

```
Crea un sistema de alertas inteligente:

1. ESTRUCTURA:
```
src/modules/alerts/
├── alerts.module.ts
├── alerts.service.ts
├── triggers/
│   ├── stock-trigger.ts
│   ├── production-trigger.ts
│   ├── quality-trigger.ts
│   └── machine-trigger.ts
├── channels/
│   ├── email.channel.ts
│   ├── sms.channel.ts
│   ├── push.channel.ts
│   └── dashboard.channel.ts
├── templates/
│   ├── alert-templates.ts
│   └── notification-templates.ts
└── escalation/
    └── escalation.service.ts
```

2. TIPOS DE ALERTAS:

A. **CRÍTICAS (Rojo - Acción inmediata)**:
- Máquina detenida más de 30 minutos
- Defecto crítico de calidad
- Stock de material crítico a 0
- Orden urgente atrasada

B. **ADVERTENCIAS (Amarillo - Monitorear)**:
- Stock bajo (debajo de mínimo)
- Etapa de producción atrasada
- Máquina cerca de mantenimiento
- Defecto recurrente detectado

C. **INFORMATIVAS (Verde - Solo informar)**:
- Orden completada
- Mantenimiento programado
- Pedido de material recibido
- Nueva orden ingresada

3. CANALES DE NOTIFICACIÓN:
- Email a responsables
- SMS para alertas críticas
- Notificaciones push en dashboard
- Mensajes en Slack/Teams
- Alertas sonoras en taller

4. ESCALACIÓN AUTOMÁTICA:
```
Nivel 1: Operario → 15 minutos sin acción
Nivel 2: Supervisor → 30 minutos sin acción  
Nivel 3: Gerente → 1 hora sin acción
Nivel 4: Dueño → 2 horas sin acción
```

5. CONFIGURACIÓN POR USUARIO:
- Preferencias de notificación
- Horarios de silencio
- Alertas suscritas
- Umbrales personalizados

6. HISTORIAL Y SEGUIMIENTO:
- Todas las alertas registradas
- Tiempo de respuesta
- Acciones tomadas
- Análisis de falsas alarmas
```

---

## 📦 **PROMPT 11: DEPLOYMENT Y DEVOPS**

```
Configura el despliegue completo de XSafe ERP:

1. DOCKER MULTI-STAGE:
```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/main"]

# Frontend Dockerfile  
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY apps/workshop-monitor/package*.json ./
RUN npm ci
COPY apps/workshop-monitor/ .
RUN npm run build

FROM nginx:alpine AS frontend
COPY --from=frontend-builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

2. DOCKER-COMPOSE PARA PRODUCCIÓN:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: xsafe_prod
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - xsafe-network

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - xsafe-network

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/xsafe_prod
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    networks:
      - xsafe-network
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - xsafe-network
    restart: unless-stopped

  nginx-proxy:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx/production.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    networks:
      - xsafe-network

volumes:
  postgres_data:
  redis_data:

networks:
  xsafe-network:
    driver: bridge
```

3. CI/CD CON GITHUB ACTIONS:
```yaml
name: XSafe CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  docker-build:
    needs: [test, security-scan]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: |
          docker build -t xsafe-backend:latest -f Dockerfile.backend .
          docker build -t xsafe-frontend:latest -f Dockerfile.frontend .

  deploy-staging:
    needs: [docker-build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to Staging
        run: |
          # Comandos de despliegue a staging
          echo "Deploying to staging..."

  deploy-production:
    needs: [deploy-staging]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Production
        run: |
          # Comandos de despliegue a producción
          echo "Deploying to production..."
```

4. MONITOREO EN PRODUCCIÓN:
- Prometheus + Grafana para métricas
- Sentry para errores
- Log aggregation con ELK Stack
- Uptime monitoring

5. BACKUP AUTOMÁTICO:
- Backup diario de base de datos
- Retention policy de 30 días
- Backup en cloud (AWS S3/Google Cloud)
- Script de restauración
```

---

## 📚 **PROMPT 12: DOCUMENTACIÓN Y ONBOARDING**

```
Crea la documentación completa del proyecto:

1. DOCUMENTACIÓN TÉCNICA:
```
documentation/
├── api/
│   ├── endpoints.md          # Todos los endpoints
│   ├── authentication.md     # Guía de autenticación
│   └── webhooks.md          # Webhooks disponibles
├── development/
│   ├── setup.md             # Configuración entorno dev
│   ├── architecture.md      # Arquitectura del sistema
│   ├── database.md         # Modelo de datos
│   └── deployment.md       # Guía de despliegue
├── user-guides/
│   ├── workshop-admin.md    # Guía administrador taller
│   ├── production-operator.md # Guía operario producción
│   ├── quality-inspector.md # Guía inspector calidad
│   └── customer-portal.md   # Guía portal cliente
├── api-reference/
│   └── swagger/            # Documentación Swagger automática
└── diagrams/
    ├── architecture.diagram.xml
    ├── database.diagram.xml
    └── workflow.diagram.xml
```

2. GUÍA DE INSTALACIÓN PASO A PASO:
```markdown
# Instalación de XSafe ERP

## Requisitos previos
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (opcional)

## Pasos de instalación

1. **Clonar repositorio**
```bash
git clone https://github.com/tu-org/xsafe-erp.git
cd xsafe-erp
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus valores
```

3. **Instalar dependencias**
```bash
npm install
```

4. **Configurar base de datos**
```bash
npx prisma migrate dev
npx prisma db seed
```

5. **Iniciar servidor de desarrollo**
```bash
# Backend
npm run start:dev

# Frontend
cd apps/workshop-monitor
npm run dev
```

6. **Acceder a la aplicación**
- Backend API: http://localhost:3000
- Frontend: http://localhost:3001
- API Docs: http://localhost:3000/api/docs
```

3. GUÍAS DE USO POR ROL:

**PARA EL ADMIN DEL TALLER:**
- Cómo registrar tu taller
- Cómo crear usuarios y roles
- Cómo configurar materiales y productos
- Cómo ver reportes financieros

**PARA EL OPERARIO DE PRODUCCIÓN:**
- Cómo ver mis órdenes asignadas
- Cómo marcar etapa como completada
- Cómo reportar problemas
- Cómo ver instrucciones de fabricación

**PARA EL INSPECTOR DE CALIDAD:**
- Cómo realizar inspección
- Cómo tomar fotos de defectos
- Cómo generar certificados
- Cómo ver estadísticas de calidad

4. VIDEOS TUTORIALES:
- Video 1: Registro e instalación (5 min)
- Video 2: Primera orden de producción (10 min)
- Video 3: Control de calidad (8 min)
- Video 4: Reportes y analytics (7 min)

5. FAQ Y SOLUCIÓN DE PROBLEMAS:
- Problemas comunes de instalación
- Error messages y soluciones
- Optimización de performance
- Migración de datos
```

---

## 🎯 **INSTRUCCIONES FINALES PARA ANTIGRAVITY IDE**

```
IMPLEMENTACIÓN EN ESTE ORDEN:

1. EJECUTAR PROMPT 1 primero (Configuración inicial)
2. EJECUTAR PROMPT 2 segundo (Base de datos)
3. CONTINUAR en orden secuencial del 3 al 12
4. DESPUÉS de cada prompt, verificar que:
   - El código compila sin errores
   - Los tests pasan
   - La base de datos se migra correctamente
   - Los endpoints funcionan en Postman

5. AL FINALIZAR todos los prompts, ejecutar:
   ```bash
   # Test completo del sistema
   npm run test:e2e
   
   # Build de producción
   npm run build:all
   
   # Levantar con docker-compose
   docker-compose up -d
   
   # Verificar salud del sistema
   curl http://localhost:3000/api/health
   ```

6. ENTREGABLES FINALES:
   - Sistema completamente funcional
   - Documentación técnica completa
   - Scripts de despliegue
   - Datos de prueba incluidos
   - Dashboard operacional funcionando

NOTA: Ajustar según feedback del usuario durante el desarrollo. Si hay errores, detener y solicitar clarificación antes de continuar.
```

---

## 📝 **NOTAS PARA EL DESARROLLADOR**

1. **Prioridad de desarrollo**: Comenzar por el backend (API) y luego el frontend
2. **Enfoque en MVP**: Primero funcionalidades core, luego features avanzadas
3. **Testing continuo**: Escribir tests junto con el código
4. **Seguridad primero**: Validar todos los inputs, sanitizar outputs
5. **Performance**: Optimizar consultas a base de datos desde el inicio
6. **Escalabilidad**: Diseñar para múltiples talleres desde el día 1

**¿Listo para comenzar?** Ejecuta el **PROMPT 1** en Antigravity IDE y comienza la construcción de XSafe ERP.