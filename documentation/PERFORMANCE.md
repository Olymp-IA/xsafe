# Optimización de Rendimiento

Directrices y configuraciones para asegurar que XSafe ERP funcione con alta eficiencia.

## Frontend (Next.js)
*   **Imágenes**: Usar siempre el componente `next/image` y formatos WebP.
*   **Code Splitting**: Utilizar importaciones dinámicas para componentes pesados (ej. visor 3D).
*   **Caché**: Configurar `stale-while-revalidate` en encabezados HTTP.

## Backend (NestJS)
*   **Compresión**: Gzip habilitado globalmente.
*   **Base de Datos**:
    *   Índices en columnas frecuentemente consultadas (`order_id`, `status`).
    *   Uso de transacciones de solo lectura donde sea posible.
*   **Caching**: Redis para caché de respuestas API frecuentes (TTL 60s).

## Base de Datos
*   Pool de conexiones configurado para manejar picos de carga.
*   Consultas lentas (>100ms) se registran automáticamente para revisión.

## Métricas Objetivo
*   **Tiempo de Carga (LCP)**: < 2.5s
*   **Latencia API**: < 200ms
*   **Tiempo Interactivo (TTI)**: < 3.5s
