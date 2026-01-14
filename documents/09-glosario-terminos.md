# Glosario de Términos

**Documento ID:** DOC-GLOS-001  
**Versión:** 1.0.0  
**Clasificación:** INTERNO  
**Fecha:** 2026-01-14  

---

## Términos de Negocio

| Término | Definición | Contexto de Uso |
|---------|------------|-----------------|
| **BOM** | Bill of Materials. Lista de materias primas y componentes necesarios para fabricar un producto. | Producción |
| **Defensa** | Producto de protección para motocicletas fabricado por XSafe. | Catálogo, Producción |
| **Etapa de Producción** | Fase individual del proceso de fabricación (corte, soldadura, pintura, ensamble). | Producción |
| **OEE** | Overall Equipment Effectiveness. Métrica de eficiencia operativa (0-100%). | Maquinaria, Analytics |
| **Orden de Producción** | Documento que autoriza la fabricación de productos específicos. | Producción |
| **SKU** | Stock Keeping Unit. Código único de identificación de producto. | Inventario, E-commerce |
| **Stock Mínimo** | Cantidad mínima de inventario antes de disparar alerta de reorden. | Inventario |

---

## Términos Técnicos

| Término | Definición | Tecnología Relacionada |
|---------|------------|------------------------|
| **ADR** | Architecture Decision Record. Documento que registra una decisión arquitectónica y su justificación. | Documentación |
| **API** | Application Programming Interface. Conjunto de endpoints para comunicación entre sistemas. | Backend |
| **CORS** | Cross-Origin Resource Sharing. Mecanismo de seguridad para requests cross-domain. | Backend |
| **CRUD** | Create, Read, Update, Delete. Operaciones básicas de datos. | Backend |
| **DTO** | Data Transfer Object. Objeto para transferir datos entre capas. | NestJS |
| **Guard** | Componente NestJS que controla acceso a endpoints. | NestJS, Auth |
| **JWT** | JSON Web Token. Token de autenticación firmado digitalmente. | Auth |
| **ORM** | Object-Relational Mapping. Abstracción para acceso a base de datos. | Prisma |
| **RBAC** | Role-Based Access Control. Control de acceso basado en roles. | Auth |
| **SSR** | Server-Side Rendering. Renderizado de páginas en el servidor. | Next.js |
| **Webhook** | Callback HTTP para notificaciones asíncronas. | Stripe, GitHub |

---

## Roles del Sistema

| Rol | Código | Permisos | Descripción |
|-----|--------|----------|-------------|
| **Administrador** | `ADMIN` | Full access | Gestión completa del sistema |
| **Gerente** | `MANAGER` | Production, Inventory, Analytics | Supervisión de operaciones |
| **Operario** | `OPERATOR` | Production (update), Inventory (move) | Ejecución de tareas en planta |
| **Supervisor** | `SUPERVISOR` | Quality (CRUD) | Control de calidad |
| **Cliente** | `CUSTOMER` | E-commerce | Compras en tienda online |

---

## Estados de Entidades

### Estados de Orden de Producción

| Estado | Código | Descripción | Transiciones Permitidas |
|--------|--------|-------------|-------------------------|
| Programada | `SCHEDULED` | Orden creada, pendiente de inicio | IN_PROGRESS, CANCELLED |
| En Progreso | `IN_PROGRESS` | Fabricación activa | ON_HOLD, COMPLETED, CANCELLED |
| En Espera | `ON_HOLD` | Pausada por problema | IN_PROGRESS, CANCELLED |
| Completada | `COMPLETED` | Fabricación terminada | - (Final) |
| Cancelada | `CANCELLED` | Orden cancelada | - (Final) |

### Estados de Pedido E-commerce

| Estado | Código | Descripción |
|--------|--------|-------------|
| Pendiente | `PENDING` | Esperando pago |
| Pagado | `PAID` | Pago confirmado |
| Procesando | `PROCESSING` | En preparación |
| Enviado | `SHIPPED` | En tránsito |
| Entregado | `DELIVERED` | Entregado al cliente |
| Cancelado | `CANCELLED` | Cancelado |

### Estados de Máquina

| Estado | Código | Indicador Visual |
|--------|--------|------------------|
| Activa | `ACTIVE` | 🟢 Verde |
| Advertencia | `WARNING` | 🟡 Amarillo |
| Error | `ERROR` | 🔴 Rojo |
| Offline | `OFFLINE` | ⚫ Gris |

---

## Acrónimos

| Acrónimo | Significado Completo |
|----------|----------------------|
| ALB | Application Load Balancer |
| AWS | Amazon Web Services |
| CI/CD | Continuous Integration / Continuous Deployment |
| CSP | Content Security Policy |
| DDoS | Distributed Denial of Service |
| ECS | Elastic Container Service |
| ERD | Entity-Relationship Diagram |
| GDPR | General Data Protection Regulation |
| HSTS | HTTP Strict Transport Security |
| IPC | Inter-Process Communication |
| KPI | Key Performance Indicator |
| MFA | Multi-Factor Authentication |
| MVP | Minimum Viable Product |
| P95 | 95th Percentile |
| QC | Quality Control |
| RDS | Relational Database Service |
| RPO | Recovery Point Objective |
| RTO | Recovery Time Objective |
| SLA | Service Level Agreement |
| TLS | Transport Layer Security |
| UML | Unified Modeling Language |
| VPC | Virtual Private Cloud |
| WAF | Web Application Firewall |
| WCAG | Web Content Accessibility Guidelines |
| XSS | Cross-Site Scripting |

---

## Métricas y KPIs

| Métrica | Fórmula / Definición | Unidad | Objetivo |
|---------|----------------------|--------|----------|
| **OEE** | Disponibilidad × Rendimiento × Calidad | % | > 85% |
| **MTBF** | Tiempo promedio entre fallos | Horas | > 500h |
| **MTTR** | Tiempo promedio de reparación | Minutos | < 30min |
| **Tasa de Rechazo** | (Piezas rechazadas / Total) × 100 | % | < 2% |
| **Throughput** | Unidades producidas por hora | u/h | Variable |
| **Lead Time** | Tiempo desde pedido hasta entrega | Días | < 10d |
| **Uptime** | (Tiempo disponible / Total) × 100 | % | > 99.9% |

---

## Convenciones de Nombrado

### Código

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivo TS | kebab-case | `create-order.dto.ts` |
| Clase | PascalCase | `ProductionService` |
| Método | camelCase | `createOrder()` |
| Variable | camelCase | `orderStatus` |
| Constante | SCREAMING_SNAKE | `MAX_RETRY_ATTEMPTS` |
| Tabla BD | PascalCase | `ProductionOrder` |
| Campo BD | camelCase | `scheduledDate` |

### Documentación

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| ID de Documento | DOC-[TIPO]-NNN | DOC-ARCH-001 |
| ID de Caso de Uso | CU-[MÓDULO]-NNN | CU-PROD-001 |
| ID de Runbook | RB-NNN | RB-001 |
| ID de Regla de Negocio | RN-[MÓDULO]-NNN | RN-AUTH-001 |
| ID de Requisito | REQ-[TIPO]-NNN | REQ-FUNC-001 |

---

*Este glosario se mantiene actualizado con cada release del sistema.*
