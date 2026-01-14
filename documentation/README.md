# XSafe ERP & Plataforma de E-commerce

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

## Resumen Ejecutivo

**XSafe ERP** es una plataforma de nivel empresarial diseñada para revolucionar la fabricación y venta de sistemas de protección para motocicletas. Este repositorio integra un ecosistema diverso de alto rendimiento:

*   **Tienda E-commerce**: Plataforma para el consumidor final basada en Next.js con visualización de productos en 3D.
*   **ERP Core**: Arquitectura de microservicios NestJS para la gestión de producción, inventario y logística.
*   **App Móvil Operarios**: Aplicación React Native offline-first para la gestión en planta.
*   **Panel de Analítica**: Inteligencia de negocios y reportes en tiempo real.

Construido con un enfoque en **escalabilidad**, **seguridad** y **confiabilidad**, XSafe ERP sigue estrictos estándares de cumplimiento ISO y utiliza tecnologías modernas nativas de la nube.

---

## Stack Tecnológico

### Ecosistema Frontend
*   **Tienda Web**: Next.js 14, React 18, Tailwind CSS, Framer Motion
*   **Administración Web**: Next.js 14 App Router, NextAuth, Recharts (ERP Dashboard)
*   **Motor 3D**: Three.js, React Three Fiber, Drei
*   **Gestión de Estado**: Zustand, React Query
*   **Móvil**: React Native 0.72, TypeScript, SQLite (Modo Offline)
*   **Escritorio**: Electron 25, React, SQLite (Offline-First)
*   **Monitor (Taller)**: React + Vite, Recharts, Socket.io (Visualización Planta)

### Servicios Backend
*   **API Gateway**: NestJS, Fastify
*   **Base de Datos**: PostgreSQL (Prisma ORM), Redis (Caching)
*   **Mensajería**: RabbitMQ / Kafka (Event Driven)
*   **Autenticación**: JWT, OAuth2, Control de Acceso Basado en Roles (RBAC)

### Infraestructura y DevOps
*   **Contenedores**: Docker, Docker Compose
*   **Integración Continua**: GitHub Actions
*   **Monitoreo**: Prometheus, Grafana, Sentry

---

## Guía de Inicio Rápido

### Requisitos Previos
*   Node.js v20.x o superior
*   Docker y Docker Compose
*   PostgreSQL 15+
*   Android Studio / Xcode (para desarrollo móvil)

### Configuración Unificada
Proporcionamos un script unificado para iniciar todo el entorno:

```bash
# Clonar el repositorio
git clone https://github.com/Olymp-IA/xsafe.git
cd xsafe

# Instalar dependencias (Monorepo)
npm install

# Iniciar entorno de desarrollo (Servicios Docker + Apps)
npm run dev:all
```

Alternativamente, puede iniciar servicios específicos:

```bash
# Frontend (Tienda)
npm run dev:ecommerce

# Administración Web (ERP)
npm run dev:web

# Solo Backend
npm run dev:backend

# Móvil Android
npm run android

# App de Escritorio
npm run dev:desktop
```

---

## Índice de Documentación

Para información detallada, por favor consulte nuestra suite de documentación completa ubicada en `/documentation`:

*   [**Visión General de Arquitectura**](./ARCHITECTURE.md): Diseño del sistema, patrones y diagramas C4.
*   [**Referencia API**](./API_DOCUMENTATION.md): Especificaciones OpenAPI/Swagger y guía de endpoints.
*   [**Manual de Usuario**](./USER_MANUAL.md): Guías para usuarios de la Tienda y el ERP.
*   [**Guía del Desarrollador**](./DEVELOPER_GUIDE.md): Pautas de contribución y configuración.
*   [**Política de Seguridad**](./SECURITY.md): Modelos de autenticación y cumplimiento.
*   [**Guía de Despliegue**](./DEPLOYMENT_GUIDE.md): Estrategias de lanzamiento a producción.

---

## Soporte y Licencia


---
*Powered by OLYMP-IA Enterprise Solutions*
