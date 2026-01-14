# 🏗️ System Architecture

This document details the technical architecture of the XSafe ERP platform, adhering to the C4 model for software architecture documentation.

## 1. High-Level Architecture (Context)

The XSafe platform is composed of 5 main business domains interacting within a distributed system.

```mermaid
graph TB
    User((User/Customer))
    Admin((Admin/Manager))
    Operator((Operator))
    
    subgraph "XSafe Ecosystem"
        Store[E-commerce Store\n(Next.js)]
        WebAdmin[Web Dashboard\n(Next.js)]
        ERP_API[ERP Core API\n(NestJS)]
        Mobile[Mobile App\n(React Native)]
        Desktop[Desktop App\n(Electron)]
        DB[(PostgreSQL)]
        Redis[(Redis Cache)]
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

## 2. Component Design

### Frontend (E-commerce)
*   **Framework**: Next.js (App Router)
*   **Rendering**: Server-Side Rendering (SSR) for SEO, Client-Side Rendering (CSR) for interactive 3D elements.
*   **Styling**: Tailwind CSS + CSS Modules for component isolation.
*   **Performance**: Image optimization, dynamic imports for heavy 3D assets.

### Web Admin (ERP)
*   **Framework**: Next.js 14 App Router.
*   **Auth**: NextAuth with RBAC (Admin/Manager roles).
*   **Features**: Real-time Socket.io updates, Recharts visualization, Zod form validation.

### Mobile App (Operator)
*   **Offline-First**: Uses SQLite for local storage and synchronizes with the backend when online.
*   **Sync Engine**: Custom `SyncManager` implementing a "Queue-based" synchronization pattern.
*   **Architecture**: Modular (Features separated by domain: Production, Inventory, Auth).

### Desktop App (Workstation)
*   **Framework**: Electron with React + Vite renderer.
*   **Persistence**: Local SQLite database via TypeORM.
*   **IPC**: Secure Main-Renderer communication for native capabilities (File System, Hardware).

### Backend (Microservices)
*   **Framework**: NestJS with strict modular architecture.
*   **Communication**: REST API for sync calls, Event Emitter for async internal tasks.
*   **Data Layer**: Prisma ORM with strict type safety.

## 3. Data Flow & Synchronization

### Offline Sync Strategy (Mobile)
1.  **Local Write**: User actions (e.g., updating order status) are written immediately to `SQLite` and a `SyncQueue`.
2.  **Detection**: `NetInfo` detects network availability.
3.  **Process Queue**: `SyncManager` iterates through the queue (`Order:Update`, `Inventory:Move`) and sends requests to the API.
4.  **Conflict Resolution**: "Server Wins" policy for timestamp conflicts, with manual override option for operators.

## 4. Key Design Patterns
*   **Repository Pattern**: Abstracting database access logic in the backend.
*   **Observer Pattern**: Used in the 3D scene controller for state updates.
*   **Command Pattern**: Encapsulating operations in the mobile sync queue.

## 5. Directory Structure

```
xSafe-ERP/
├── apps/
│   ├── backend-api/        # Core Logic
│   ├── ecommerce-frontend/ # Next.js Store
│   └── erp-mobile/         # React Native App
├── packages/               # Shared Libraries
│   ├── ui-kit/
│   └── types/
└── documentation/          # Corporate Docs
```
