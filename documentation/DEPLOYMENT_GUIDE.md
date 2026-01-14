# Guía de Despliegue

Este documento describe la infraestructura y los procedimientos para desplegar XSafe ERP en entornos de producción.

## Visión General de Infraestructura
Nuestra infraestructura de producción está alojada en AWS (Amazon Web Services) utilizando una arquitectura de microservicios en contenedores.

*   **Computación**: AWS ECS (Fargate) para contenedores Docker.
*   **Base de Datos**: AWS RDS (PostgreSQL).
*   **Caché**: AWS ElastiCache (Redis).
*   **Almacenamiento**: AWS S3 (Imágenes, Activos 3D).
*   **CDN**: CloudFront.
*   **Dominio**: Route53.

## Pipeline CI/CD
Utilizamos GitHub Actions para integración y entrega continua.

### Flujo de Trabajo
1.  **Push a `main`**: Dispara `ci.yml`.
2.  **Test**: Ejecuta pruebas Unitarias y de Integración.
3.  **Build**: Construye imágenes Docker para API y Frontend.
4.  **Push Registry**: Sube imágenes a AWS ECR.
5.  **Deploy**: Actualiza la definición del Servicio ECS para usar las nuevas etiquetas de imagen.

## Procedimientos de Despliegue

### Staging
Despliegue automático en cada fusión a la rama `develop`.
URL: `https://staging.xsafe-erp.com`

### Administración Web (Panel ERP)
Despliegue automático en cada fusión a la rama `main`.
URL: `https://erp.xsafe.com`

### Producción
Se requiere activación manual vía GitHub Releases (Tag `v*.*.*`).
URL: `https://xsafe-erp.com`

**Pasos:**
1.  Ir a GitHub Releases.
2.  Crear un nuevo borrador de release (ej. `v1.2.0`).
3.  Publicar release.
4.  GitHub Actions desplegará a Prod.

### App de Escritorio (Distribución)
La app Electron se compila y publica en AWS S3 / GitHub Releases.

### Monitor de Taller (Manual)
Dado que corre en Smart TVs, a menudo se despliega via USB o servidor local.

**Comando de Compilación:**
```bash
cd apps/workshop-monitor
npm run build
```
Generará una carpeta `dist` estática que puede alojarse en cualquier servidor web simple (nginx, Apache) o servicio de hosting estático (Vercel, Netlify).


**Comando de Compilación:**
```bash
cd apps/erp-desktop
npm run dist
```
*   **Windows**: Genera `.exe` (instalador NSIS).
*   **Mac**: Genera `.dmg` (requiere notarización).
*   **Linux**: Genera `.AppImage` y `.deb`.

**Auto-Actualización:**
La app busca actualizaciones al inicio utilizando `electron-updater` apuntando al bucket de releases.

## Configuración de Producción
Las variables sensibles se gestionan mediante AWS Secrets Manager.

**Variables Requeridas**:
*   `DATABASE_URL`
*   `JWT_SECRET`
*   `REDIS_URL`
*   `STRIPE_API_KEY`
*   `S3_BUCKET_NAME`

## Estrategia de Rollback
En caso de fallo crítico:
1.  Identificar la última etiqueta de imagen estable (ej. `v1.1.9`).
2.  Ejecutar el flujo de trabajo manual "Rollback" en GitHub Actions.
3.  Ingresar la etiqueta objetivo.
4.  El sistema revierte en 2-5 minutos.

## Monitoreo y Alertas
*   **Rendimiento**: Datadog APM.
*   **Logs**: AWS CloudWatch.
*   **Tiempo de Actividad**: PagerDuty configurado para endpoints `/health`.
