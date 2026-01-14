# 📝 Changelog

All notable changes to the **XSafe ERP** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-03-20

### 🚀 Launched
*   **Initial Release**: Full system launch including E-commerce Store, ERP Backend, and Mobile App.

### ✨ Added
*   **Mobile App**:
    *   Offline-first architecture with SQLite.
    *   Smart Sync Manager using Queue pattern.
    *   QR/Barcode Scanner integration.
    *   Production Dashboard with real-time charts.
*   **E-commerce**:
    *   3D customizable product viewer (Three.js).
    *   Dynamic "Industrial" visual theme.
    *   Responsive Footer with Olympia integration.
*   **Backend**:
    *   Microservices architecture with NestJS.
    *   RBAC Authentication module.
    *   PostgreSQL database with Prisma ORM.

### 🔧 Fixed
*   Resolved CORS issues with mobile emulator connection.
*   Fixed footer centering on ultra-wide monitors.
*   Optimized 3D model loading time by compression.

### 🔒 Security
*   Implemented strict CSP headers.
*   Added rate-limiting to all Auth endpoints.
*   Enabled audit logging for production actions.

---

## [0.9.0] - 2024-02-15 (Beta)
*   **Added**: Core inventory management module.
*   **Changed**: Migrated from TypeORM to Prisma for better type safety.
*   **Removed**: Legacy monolithic API endpoints.
