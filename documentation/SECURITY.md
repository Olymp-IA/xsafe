# Política de Seguridad

Este documento describe los protocolos y configuraciones de seguridad para la plataforma XSafe ERP.

## Autenticación y Autorización
*   **JWT (JSON Web Tokens)**: Usado para gestión de sesiones sin estado.
*   **NextAuth.js**: Gestiona la autenticación en las aplicaciones Web.
*   **RBAC (Control de Acceso Basado en Roles)**:
    *   `ADMIN`: Acceso completo al sistema.
    *   `MANAGER`: Acceso de lectura/escritura a recursos de negocio, sin configuración del sistema.
    *   `OPERATOR`: Acceso limitado a tareas de producción.
    *   `GUEST`: Solo lectura pública (Tienda).

## Seguridad de Datos
*   **Encriptación en Tránsito**: Todo el tráfico HTTP es forzado a través de TLS 1.3.
*   **Encriptación en Reposo**: Las bases de datos de producción (RDS) están encriptadas con claves KMS gestionadas.
*   **Datos Sensibles**: Las contraseñas se hashmean usando `bcrypt`. La información de pago es tokenizada por Stripe; no se almacenan PANs.

## Cumplimiento
*   **GDPR**: Derecho al olvido y endpoints de exportación de datos implementados.
*   **ISO 27001**: Controles de acceso y auditoría de logs activados.

## Reporte de Vulnerabilidades
Por favor, no divulgue vulnerabilidades públicamente. Envíe un correo a `security@xsafe-erp.com`. Intentamos responder en un plazo de 24 horas.
