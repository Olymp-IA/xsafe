# Guía de Mantenimiento

Procedimientos para mantener la salud y el rendimiento de la plataforma XSafe ERP.

## Tareas Diarias
*   Verificar los paneles de control de fallos en Sentry.
*   Revisar las alertas de uso de CPU/Memoria en AWS CloudWatch.

## Tareas Semanales
*   **Rotación de Logs**: Archivar logs antiguos a S3 Glacier.
*   **Actualizaciones de Seguridad**: Aplicar parches de seguridad del sistema operativo y dependencias npm críticas (`npm audit`).

## Tareas Mensuales
*   **Optimización de Base de Datos**: Ejecutar `VACUUM ANALYZE` en PostgreSQL.
*   **Auditoría de Accesos**: Revisar lista de usuarios con permisos de admin.

## Procedimientos de Backup
*   **Base de Datos**: Snapshots automáticos diarios de RDS (retención de 30 días).
*   **Código**: Repositorio GitHub distribuido.

En caso de corrupción de datos, referirse al documento de Plan de Recuperación de Desastres.
