# Documentación Empresarial XSafe ERP

**CLASIFICACIÓN:** CONFIDENCIAL  
**Código de Operación:** DOC-OPS-ALPHA-001  
**Versión:** 1.0.0  
**Fecha:** 2026-01-14  
**Estado:** EN DESARROLLO  

---

## Índice de Documentos

| ID | Documento | Descripción | Estado |
|----|-----------|-------------|--------|
| 01 | [Arquitectura del Sistema](./01-arquitectura-sistema.md) | Arquitectura completa con ADRs | ✅ |
| 02 | [Casos de Uso](./02-casos-de-uso.md) | Especificación detallada de casos de uso | ✅ |
| 03 | [Manual de Usuario](./03-manual-usuario-completo.md) | Guía operativa completa (~120 páginas) | ✅ |
| 04 | [Documentación Técnica](./04-documentacion-tecnica.md) | Para desarrolladores | ✅ |
| 05 | [Runbooks Operacionales](./05-runbooks-operacionales.md) | Procedimientos críticos | ✅ |
| 06 | [Matriz de Trazabilidad](./06-matriz-trazabilidad.md) | Trazabilidad código-documentación | ✅ |
| 07 | [Plan de Pruebas](./07-plan-pruebas.md) | Estrategia de testing | ✅ |
| 08 | [Documento de Seguridad](./08-documento-seguridad.md) | Controles y políticas | ✅ |
| 09 | [Glosario de Términos](./09-glosario-terminos.md) | Diccionario controlado | ✅ |

## Diagramas UML

Ubicación: [`/uml/`](./uml/)

| Diagrama | Archivo | Estado |
|----------|---------|--------|
| Contexto del Sistema | [01-diagrama-contexto.md](./uml/01-diagrama-contexto.md) | ✅ |
| Casos de Uso | [02-diagrama-casos-uso.md](./uml/02-diagrama-casos-uso.md) | ✅ |
| Clases | [03-diagrama-clases.md](./uml/03-diagrama-clases.md) | ✅ |
| Secuencia | [04-diagrama-secuencia.md](./uml/04-diagrama-secuencia.md) | ✅ |
| Componentes | [05-diagrama-componentes.md](./uml/05-diagrama-componentes.md) | ✅ |
| Despliegue | [06-diagrama-despliegue.md](./uml/06-diagrama-despliegue.md) | ✅ |
| Actividades | [07-diagrama-actividades.md](./uml/07-diagrama-actividades.md) | ✅ |
| Estados | [08-diagrama-estados.md](./uml/08-diagrama-estados.md) | ✅ |
| Entidad-Relación | [09-diagrama-er.md](./uml/09-diagrama-er.md) | ✅ |
| Paquetes | [10-diagrama-paquetes.md](./uml/10-diagrama-paquetes.md) | ✅ |

## Estructura del Proyecto Analizado

```
xsafe-erp/
├── apps/
│   ├── core-backend/       # API NestJS (11 módulos)
│   ├── ecommerce-frontend/ # Tienda Next.js
│   ├── erp-web/            # Panel Admin Next.js
│   ├── erp-desktop/        # App Escritorio Electron
│   ├── erp-mobile/         # App Móvil React Native
│   └── workshop-monitor/   # Monitor de Taller React
├── packages/
│   ├── ui-kit/             # Componentes UI compartidos
│   ├── shared-types/       # Tipos TypeScript
│   ├── business-logic/     # Lógica de negocio compartida
│   └── config/             # Configuraciones centralizadas
└── documentation/          # Esta documentación
```

## Módulos del Backend (Inventario)

| Módulo | Ruta | Funcionalidad |
|--------|------|---------------|
| **Auth** | `/modules/auth` | Autenticación JWT, RBAC, Guards |
| **Production** | `/modules/production` | Órdenes de producción, eventos |
| **Inventory** | `/modules/inventory` | Stock, movimientos, alertas |
| **Machines** | `/modules/machines` | Estado de maquinaria, OEE |
| **Quality** | `/modules/quality` | Control de calidad, inspecciones |
| **Alerts** | `/modules/alerts` | Sistema de notificaciones |
| **Analytics** | `/modules/analytics` | Reportes y métricas |
| **Health** | `/modules/health` | Healthchecks del sistema |
| **E-commerce** | `/modules/ecommerce` | Tienda, carrito, checkout |

### Submódulos E-commerce

| Submódulo | Funcionalidad |
|-----------|---------------|
| `cart` | Gestión del carrito de compras |
| `checkout` | Proceso de pago |
| `customers` | Gestión de clientes |
| `products` | Catálogo de productos |
| `reviews` | Reseñas y valoraciones |
| `store` | Configuración de tienda |

---

## Control de Versiones

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0.0 | 2026-01-14 | Sistema | Creación inicial |
| 1.0.1 | 2026-01-14 | Dev | Implementación Login Garage y UI Updates |

## Aprobaciones

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Arquitecto de Documentación | Pendiente | - | - |
| Arquitecto de Software | Pendiente | - | - |
| Ingeniero de Calidad | Pendiente | - | - |

---

*Generado bajo estándares ISO/IEC 27001:2022, NIST SP 800-53*
