# Estrategia de Pruebas

Este documento describe la metodología de pruebas para asegurar la confiabilidad y calidad de la plataforma XSafe ERP.

## Pirámide de Pruebas

Nos adherimos a la pirámide de pruebas estándar:

1.  **Pruebas Unitarias (70%)**: Pruebas rápidas y aisladas para funciones y clases individuales.
2.  **Pruebas de Integración (20%)**: Prueba de la interacción entre módulos (ej. API + Base de Datos).
3.  **Pruebas E2E (10%)**: Prueba completa del sistema simulando el comportamiento del usuario.

## Herramientas y Frameworks

| Tipo | Herramienta | Alcance |
| :--- | :--- | :--- |
| **Unitaria/Integración** | Jest | Backend, Librerías Lógicas, Proceso Principal Escritorio |
| **Componente** | React Testing Library | Frontend (Web/Escritorio), Componentes Móviles |
| **E2E (Web)** | Cypress | Flujos críticos de usuario (Pago, Login, Dashboard) |
| **E2E (Móvil)** | Detox | Flujos React Native |
| **E2E (Escritorio)**| Playwright | Verificación app Electron |
| **Carga** | k6 | Pruebas de Rendimiento y Estrés |

## Plan de Pruebas

### Backend (NestJS)
*   **Controladores**: Verificar validación de entrada y forma de respuesta.
*   **Servicios**: Verificar lógica de negocio y casos borde.
*   **Guardias**: Verificar autenticación y permisos de roles.

### Frontend (Next.js - Tienda y Admin)
*   **Snapshots**: Verificar consistencia de renderizado UI.
*   **Interacciones**: Verificar clics en botones, envíos de formularios y actualizaciones de estado.
*   **Accesibilidad**: Verificar cumplimiento A11y (etiquetas ARIA, contraste).

### App Móvil (React Native)
*   **Sincronización Offline**: Verificar persistencia de datos y cola de sincronización.
*   **Hardware**: Verificar mocks de integración de Cámara/Escáner.

### App de Escritorio (Electron)
*   **IPC**: Verificar comunicación confiable entre procesos Principal y Renderizador.
*   **Características Nativas**: Verificar acceso al Sistema de Archivos y disparadores de Auto-actualización.

## Puertas de Calidad CI/CD
El pipeline de construcción fallará si:
*   La tasa de aprobación de pruebas unitarias es < 100%.
*   La cobertura de código cae por debajo del 80%.
*   Las pruebas de humo críticas E2E fallan.

## Objetivos de Cobertura
*   **Lógica de Negocio**: 90%+
*   **Utilidades/Helpers**: 100%
*   **Componentes UI**: 70%

## Escribiendo Pruebas
Ejemplo de Prueba Unitaria (Jest):
```typescript
describe('OrderService', () => {
  it('debería calcular el precio total correctamente', () => {
    const order = { items: [{ price: 10, qty: 2 }] };
    expect(calculateTotal(order)).toBe(20);
  });
});
```
