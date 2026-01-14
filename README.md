# 🏭 XSafe ERP

Sistema ERP para fabricación de defensas de motocicletas.

## 🚀 Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Iniciar servicios Docker (PostgreSQL, Redis)
docker-compose up -d

# 4. Generar cliente Prisma
cd apps/core-backend && npx prisma generate && cd ../..

# 5. Ejecutar migraciones
cd apps/core-backend && npx prisma migrate dev --name init && cd ../..

# 6. Poblar datos de prueba
npx prisma db seed

# 7. Iniciar servidor
npm run start:dev
```

**API Docs:** http://localhost:3000/api

## 📦 Módulos

| Módulo | Descripción | Endpoints |
|--------|-------------|-----------|
| **Auth** | Autenticación JWT | `/auth/*` |
| **Production** | Órdenes y etapas | `/production/*` |
| **Inventory** | Materiales y stock | `/inventory/*` |
| **Quality** | Inspecciones | `/quality/*` |
| **Machines** | CNC y equipos | `/machines/*` |
| **Analytics** | KPIs y reportes | `/analytics/*` |
| **Alerts** | Notificaciones | `/alerts/*` |
| **Health** | Estado del servicio | `/health/*` |

## 🧪 Tests

```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
npm run test:cov    # Coverage
```

## 🐳 Docker

```bash
# Desarrollo
docker-compose up -d

# Producción
docker-compose -f docker-compose.prod.yml up -d
```

## 📄 License

MIT
