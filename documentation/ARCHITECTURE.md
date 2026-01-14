# Arquitectura del Sistema

Este documento detalla la arquitectura técnica de la plataforma XSafe ERP, adhiriéndose al modelo C4 para la documentación de arquitectura de software.

## 1. Arquitectura de Alto Nivel (Contexto)

La plataforma XSafe está compuesta por 5 dominios de negocio principales interactuando dentro de un sistema distribuido.

```mermaid
graph TB
    User((Usuario/Cliente))
    Admin((Admin/Gerente))
    Operator((Operario))
    
    subgraph "Ecosistema XSafe"
        Store[Tienda E-commerce\n(Next.js)]
        WebAdmin[Panel Web\n(Next.js)]
        ERP_API[API Core ERP\n(NestJS)]
        Mobile[App Móvil\n(React Native)]
        Desktop[App Escritorio\n(Electron)]
        DB[(PostgreSQL)]
        Redis[(Redis Caché)]
    end
    
    User --> Store
    Admin --> WebAdmin
    Operator --> Mobile
    Operator --> Desktop
    
    Store --> ERP_API
    WebAdmin --> ERP_API
    Mobile --> ERP_API
    Desktop --> ERP_API
    
    ERP_API --> DB
    ERP_API --> Redis
```

## 2. Diseño de Componentes

### Frontend (E-commerce)
*   **Framework**: Next.js (App Router)
*   **Renderizado**: Server-Side Rendering (SSR) para SEO, Client-Side Rendering (CSR) para elementos 3D interactivos.
*   **Estilos**: Tailwind CSS + Módulos CSS para aislamiento de componentes.
*   **Rendimiento**: Optimización de imágenes, importaciones dinámicas para activos 3D pesados.

### Administración Web (ERP)
*   **Framework**: Next.js 14 App Router.
*   **Autenticación**: NextAuth con RBAC (Roles Admin/Gerente).
*   **Funcionalidades**: Actualizaciones en tiempo real con Socket.io, visualización con Recharts, validación de formularios con Zod.

### App Móvil (Operario)
*   **Offline-First**: Utiliza SQLite para almacenamiento local y sincroniza con el backend cuando hay conexión.
*   **Motor de Sincronización**: `SyncManager` personalizado implementando un patrón de sincronización basado en colas.
*   **Arquitectura**: Modular (Funcionalidades separadas por dominio: Producción, Inventario, Auth).

### App de Escritorio (Estación de Trabajo)
*   **Framework**: Electron con renderizador React + Vite.
*   **Persistencia**: Base de datos SQLite local vía TypeORM.
*   **IPC**: Comunicación segura Principal-Renderizador para capacidades nativas (Sistema de Archivos, Hardware).

### Backend (Microservicios)
*   **Framework**: NestJS con arquitectura modular estricta.
*   **Comunicación**: API REST para llamadas de sincronización, Emisor de Eventos para tareas internas asíncronas.
*   **Capa de Datos**: Prisma ORM con seguridad de tipos estricta.

## 3. Flujo de Datos y Sincronización

### Estrategia de Sincronización Offline (Móvil)
1.  **Escritura Local**: Las acciones del usuario (ej. actualizar estado de orden) se escriben inmediatamente en `SQLite` y una `SyncQueue`.
2.  **Detección**: `NetInfo` detecta la disponibilidad de la red.
3.  **Procesar Cola**: `SyncManager` itera a través de la cola (`Order:Update`, `Inventory:Move`) y envía solicitudes a la API.
4.  **Resolución de Conflictos**: Política "Servidor Gana" para conflictos de marca de tiempo, con opción de anulación manual para operarios.

## 4. Patrones de Diseño Clave
*   **Patrón Repositorio**: Abstracción de la lógica de acceso a datos en el backend.
*   **Patrón Observador**: Utilizado en el controlador de escena 3D para actualizaciones de estado.
*   **Patrón Comando**: Encapsulación de operaciones en la cola de sincronización móvil.

## 5. Estructura de Directorios

```
xSafe-ERP/
├── apps/
│   ├── backend-api/        # Lógica Core
│   ├── ecommerce-frontend/ # Tienda Next.js
│   ├── erp-web/            # Panel Admin Next.js
│   ├── erp-desktop/        # App Escritorio Electron
│   └── erp-mobile/         # App Móvil React Native
├── packages/               # Librerías Compartidas
│   ├── ui-kit/
│   └── types/
└── documentation/          # Documentación Corporativa
```
