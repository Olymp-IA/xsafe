# Documentación Técnica para Desarrolladores

**Documento ID:** DOC-TECH-001  
**Versión:** 1.0.0  
**Clasificación:** INTERNO  
**Fecha:** 2026-01-14  

---

## 1. Stack Tecnológico Completo

### 1.1 Backend (core-backend)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 20.10.0 LTS | Runtime |
| **NestJS** | 10.x | Framework principal |
| **TypeScript** | 5.3.x | Lenguaje |
| **Prisma** | 5.x | ORM |
| **PostgreSQL** | 15.x | Base de datos |
| **Redis** | 7.x | Caché y sesiones |
| **Swagger** | 7.x | Documentación API |
| **Passport** | 0.6.x | Autenticación |
| **bcrypt** | 5.x | Hashing passwords |
| **class-validator** | 0.14.x | Validación DTOs |

### 1.2 Frontend Web (erp-web, ecommerce-frontend)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 14.x | Framework React SSR |
| **React** | 18.x | UI Library |
| **TypeScript** | 5.3.x | Lenguaje |
| **Tailwind CSS** | 3.4.x | Estilos |
| **Zustand** | 4.x | Estado global |
| **React Query** | 5.x | Data fetching |
| **Recharts** | 2.x | Gráficos |
| **Socket.io Client** | 4.x | Tiempo real |

### 1.3 Móvil (erp-mobile)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React Native** | 0.72.x | Framework móvil |
| **TypeScript** | 5.x | Lenguaje |
| **SQLite** | - | Base de datos local |
| **React Navigation** | 6.x | Navegación |

### 1.4 Desktop (erp-desktop)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Electron** | 25.x | Framework desktop |
| **React** | 18.x | UI (Renderer) |
| **Vite** | 5.x | Build tool |
| **SQLite** | - | Base de datos local |
| **TypeORM** | 0.3.x | ORM local |

### 1.5 Monitor (workshop-monitor)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.x | UI |
| **Vite** | 5.x | Build tool |
| **Recharts** | 2.x | Visualización |
| **Socket.io Client** | 4.x | Tiempo real |
| **Tailwind CSS** | 3.4.x | Estilos |

---

## 2. Estructura del Proyecto

```
xsafe-erp/
├── apps/
│   ├── core-backend/           # API NestJS
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Esquema de base de datos
│   │   ├── src/
│   │   │   ├── config/         # Configuración de entorno
│   │   │   ├── modules/        # Módulos de negocio
│   │   │   │   ├── auth/       # Autenticación y autorización
│   │   │   │   ├── production/ # Gestión de producción
│   │   │   │   ├── inventory/  # Control de inventario
│   │   │   │   ├── quality/    # Control de calidad
│   │   │   │   ├── machines/   # Monitoreo maquinaria
│   │   │   │   ├── analytics/  # Reportes y métricas
│   │   │   │   ├── alerts/     # Sistema de alertas
│   │   │   │   ├── health/     # Healthchecks
│   │   │   │   └── ecommerce/  # Módulos de tienda
│   │   │   │       ├── store/
│   │   │   │       ├── products/
│   │   │   │       ├── cart/
│   │   │   │       ├── checkout/
│   │   │   │       ├── customers/
│   │   │   │       └── reviews/
│   │   │   ├── shared/         # Utilidades compartidas
│   │   │   │   └── prisma/     # PrismaService
│   │   │   ├── app.module.ts   # Módulo raíz
│   │   │   └── main.ts         # Entry point
│   │   ├── test/               # Tests E2E
│   │   └── package.json
│   │
│   ├── ecommerce-frontend/     # Tienda online (Next.js)
│   ├── erp-web/                # Panel administrativo (Next.js)
│   ├── erp-desktop/            # App escritorio (Electron)
│   ├── erp-mobile/             # App móvil (React Native)
│   └── workshop-monitor/       # Monitor de taller (React+Vite)
│
├── packages/
│   ├── ui-kit/                 # Componentes UI compartidos
│   │   ├── src/
│   │   │   ├── components/     # Button, Card, Badge, etc.
│   │   │   ├── theme.ts        # Design tokens
│   │   │   └── index.ts        # Exports
│   │   └── package.json
│   ├── shared-types/           # Tipos TypeScript compartidos
│   ├── business-logic/         # Lógica de negocio reutilizable
│   └── config/                 # Configuraciones centralizadas
│
├── documents/                  # Esta documentación
├── documentation/              # Documentación legacy
├── .github/
│   └── workflows/              # GitHub Actions CI/CD
├── docker-compose.yml          # Desarrollo local
└── package.json                # Workspace root
```

---

## 3. Configuración del Entorno de Desarrollo

### 3.1 Requisitos Previos

```bash
# Versiones requeridas
node --version    # v20.10.0+
npm --version     # v10.2.0+
docker --version  # v24.0.0+
```

### 3.2 Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/Olymp-IA/xsafe.git
cd xsafe

# 2. Instalar dependencias (workspace)
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con valores locales

# 4. Iniciar servicios de infraestructura
docker-compose up -d postgres redis

# 5. Ejecutar migraciones
cd apps/core-backend
npx prisma migrate dev

# 6. Generar cliente Prisma
npx prisma generate

# 7. Seed de datos iniciales
npx prisma db seed
```

### 3.3 Ejecución Local

```bash
# Backend API (puerto 3000)
cd apps/core-backend
npm run start:dev

# Panel Admin Web (puerto 3001)
cd apps/erp-web
npm run dev

# Tienda E-commerce (puerto 3002)
cd apps/ecommerce-frontend
npm run dev

# App Desktop
cd apps/erp-desktop
npm run dev

# Monitor de Taller (puerto 3003)
cd apps/workshop-monitor
npm run dev
```

---

## 4. Estructura de un Módulo NestJS

### 4.1 Patrón Estándar

```
modules/[nombre]/
├── [nombre].module.ts      # Definición del módulo
├── [nombre].controller.ts  # Endpoints REST
├── [nombre].service.ts     # Lógica de negocio
├── dto/
│   ├── create-[nombre].dto.ts
│   └── update-[nombre].dto.ts
├── entities/               # (si no usa Prisma)
│   └── [nombre].entity.ts
├── guards/                 # Guards específicos
├── decorators/             # Decoradores personalizados
├── events/                 # Event handlers
└── [nombre].service.spec.ts # Tests unitarios
```

### 4.2 Ejemplo: ProductionModule

```typescript
// production.module.ts
import { Module } from '@nestjs/common';
import { ProductionController } from './production.controller';
import { ProductionService } from './production.service';
import { PrismaModule } from '../../shared/prisma';
import { AlertsModule } from '../alerts';

@Module({
  imports: [PrismaModule, AlertsModule],
  controllers: [ProductionController],
  providers: [ProductionService],
  exports: [ProductionService],
})
export class ProductionModule {}
```

```typescript
// production.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProductionService } from './production.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('production')
@ApiBearerAuth()
@Controller('production')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Post('orders')
  @Roles('ADMIN', 'MANAGER')
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.productionService.createOrder(dto);
  }

  @Get('orders')
  @Roles('ADMIN', 'MANAGER', 'OPERATOR')
  async findAllOrders() {
    return this.productionService.findAllOrders();
  }

  @Get('orders/:id')
  async findOrder(@Param('id') id: string) {
    return this.productionService.findOrder(id);
  }
}
```

```typescript
// production.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './events/order-created.event';

@Injectable()
export class ProductionService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const order = await this.prisma.productionOrder.create({
      data: {
        productId: dto.productId,
        quantity: dto.quantity,
        scheduledDate: dto.scheduledDate,
        priority: dto.priority,
        status: 'SCHEDULED',
      },
    });

    // Emit event for other modules to react
    this.eventEmitter.emit(
      'production.order.created',
      new OrderCreatedEvent(order),
    );

    return order;
  }

  async findAllOrders() {
    return this.prisma.productionOrder.findMany({
      include: { stages: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOrder(id: string) {
    const order = await this.prisma.productionOrder.findUnique({
      where: { id },
      include: { stages: true, product: true },
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return order;
  }
}
```

---

## 5. Documentación de APIs

### 5.1 Acceso a Swagger

```
Desarrollo: http://localhost:3000/api
Staging:    https://api.staging.xsafe.com/api
Producción: https://api.xsafe.com/api
```

### 5.2 Autenticación

```bash
# Obtener token
POST /auth/login
Content-Type: application/json

{
  "email": "admin@xsafe.com",
  "password": "SecurePassword123"
}

# Respuesta
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@xsafe.com",
    "role": "ADMIN"
  }
}

# Usar token en requests
GET /production/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 5.3 Endpoints Principales

| Método | Endpoint | Descripción | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/auth/login` | Iniciar sesión | No | - |
| POST | `/auth/register` | Registrar usuario | Sí | ADMIN |
| GET | `/production/orders` | Listar órdenes | Sí | ALL |
| POST | `/production/orders` | Crear orden | Sí | ADMIN, MANAGER |
| PATCH | `/production/orders/:id/stage` | Actualizar etapa | Sí | OPERATOR |
| GET | `/inventory/items` | Listar inventario | Sí | ALL |
| POST | `/inventory/movements` | Registrar movimiento | Sí | OPERATOR |
| GET | `/products` | Listar productos | No | - |
| GET | `/products/:id` | Detalle producto | No | - |
| POST | `/cart` | Agregar al carrito | Sí | CUSTOMER |
| POST | `/checkout` | Procesar compra | Sí | CUSTOMER |
| GET | `/health` | Healthcheck | No | - |

---

## 6. Testing

### 6.1 Estrategia de Testing

| Tipo | Herramienta | Cobertura Objetivo |
|------|-------------|-------------------|
| Unit | Jest | > 80% |
| Integration | Supertest | Endpoints críticos |
| E2E | Playwright | Flujos principales |

### 6.2 Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test:cov

# Tests E2E
npm run test:e2e

# Watch mode
npm run test:watch
```

### 6.3 Ejemplo de Test

```typescript
// production.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ProductionService } from './production.service';
import { PrismaService } from '../../shared/prisma';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('ProductionService', () => {
  let service: ProductionService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductionService,
        {
          provide: PrismaService,
          useValue: {
            productionOrder: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ProductionService>(ProductionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create an order', async () => {
    const mockOrder = { id: '1', status: 'SCHEDULED' };
    jest.spyOn(prisma.productionOrder, 'create').mockResolvedValue(mockOrder);

    const result = await service.createOrder({
      productId: 'prod-1',
      quantity: 10,
      scheduledDate: new Date(),
      priority: 'HIGH',
    });

    expect(result).toEqual(mockOrder);
    expect(prisma.productionOrder.create).toHaveBeenCalled();
  });
});
```

---

## 7. Convenciones de Código

### 7.1 Nombrado

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivos | kebab-case | `create-order.dto.ts` |
| Clases | PascalCase | `ProductionService` |
| Métodos | camelCase | `createOrder()` |
| Variables | camelCase | `orderItems` |
| Constantes | SCREAMING_SNAKE | `MAX_RETRIES` |
| Interfaces | PascalCase + I prefix | `IOrderPayload` |
| Tipos | PascalCase | `OrderStatus` |

### 7.2 Estructura de Commits

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[footer opcional]
```

**Tipos permitidos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (sin cambio de código)
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento

**Ejemplos:**
```
feat(production): add order priority field
fix(auth): resolve token refresh race condition
docs(api): update swagger descriptions
```

### 7.3 Pull Request Checklist

- [ ] Código sigue convenciones de estilo
- [ ] Tests escritos y pasando
- [ ] Documentación actualizada si aplica
- [ ] Swagger actualizado si hay cambios de API
- [ ] No hay console.log() o código de debug
- [ ] Migraciones de BD incluidas si hay cambios de schema

---

## 8. Troubleshooting

### 8.1 Errores Comunes

**"Prisma Client not initialized"**
```bash
cd apps/core-backend
npx prisma generate
```

**"Cannot find module '@xsafe/ui-kit'"**
```bash
npm run build --workspace=@xsafe/ui-kit
```

**"Port 3000 already in use"**
```bash
# Encontrar proceso
lsof -i :3000
# Matar proceso
kill -9 <PID>
```

**"Redis connection refused"**
```bash
docker-compose up -d redis
```

### 8.2 Logs y Debugging

```bash
# Ver logs de Docker
docker-compose logs -f postgres

# Debug de NestJS
DEBUG=* npm run start:dev

# Prisma query logging
DATABASE_URL="postgresql://...?log=query"
```

---

*Este documento se actualiza con cada release. Última revisión: 2026-01-14*
