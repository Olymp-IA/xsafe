# Guía del Desarrollador

Esta guía asegura que todos los colaboradores sigan los mismos estándares y flujos de trabajo al desarrollar para XSafe ERP.

## Configuración del Entorno

### 1. Requisitos Previos
*   Node.js v20.10.0 (LTS)
*   Docker Desktop / Engine 24+
*   VS Code (Recomendado) con extensiones:
    *   ESLint, Prettier, Tailwind CSS, Prisma
*   Make (Opcional)

### 2. Instalación
```bash
# Clonar repo
git clone https://github.com/Olymp-IA/xsafe.git
cd xsafe

# Instalar dependencias (desde la raíz)
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales locales
```

### 3. Ejecutar Localmente
```bash
# Iniciar todos los servicios (Backend + Frontend + DB)
docker-compose up -d

# Iniciar Administración Web (Panel ERP)
cd apps/erp-web
npm run dev

# Iniciar App de Escritorio (Electron)
cd apps/erp-desktop
npm run dev

# Iniciar App Móvil (Metro Bundler)
cd apps/erp-mobile
npm run start

# Iniciar Monitor de Taller
cd apps/workshop-monitor
npm run dev

```

## Estructura del Proyecto
Seguimos una estructura Monorepo gestionada por npm workspaces / Nx.

```
xsafe-erp/
├── apps/               # Código fuente de las aplicaciones
│   ├── core-backend/   # API NestJS
│   ├── ecommerce-frontend/ # Tienda Next.js
│   ├── erp-web/        # Panel Admin Next.js
│   ├── erp-desktop/    # App Escritorio Electron
│   ├── erp-mobile/     # App Móvil React Native
│   └── workshop-monitor/ # Monitor de Taller React
├── packages/           # Librerías compartidas
│   ├── ui-kit/         # Componentes UI (React + Tailwind)
│   └── types/          # Tipos compartidos
├── tools/              # Scripts de desarrollo y configuraciones
└── documentation/      # Documentación

```

## Estándares de Código

### Linting y Formato
Usamos **ESLint** y **Prettier**. Ejecutar antes de hacer commit:
```bash
npm run lint
npm run format
```

### Convención de Commits
Seguir [Conventional Commits](https://www.conventionalcommits.org/):
*   `feat: add inventory scanner`
*   `fix(api): resolve CORS issue`
*   `docs: update readme`
*   `chore: bump dependencies`

### Flujo de Trabajo Git
1.  Crear una rama desde `main` (o `dev`): `git checkout -b feature/mi-funcionalidad`.
2.  Hacer commit de los cambios.
3.  Hacer Push y crear un Pull Request (PR).
4.  Esperar a las comprobaciones de CI (Test, Lint, Build).
5.  Obtener aprobación de 1 revisor.
6.  Squash y Merge.

## Pruebas
*   **Pruebas Unitarias**: `npm run test` (Jest)
*   **Pruebas E2E**: `npm run test:e2e` (Cypress/Playwright)

**Meta**: Mantener >80% de cobertura de código en la lógica de negocio principal.

## Solución de Problemas

**"Prisma Client not initialized"**
Ejecutar: `npx prisma generate` en la carpeta `backend-api`.

**"Docker port conflict"**
Asegurar que los puertos `3000`, `3001`, `5432` estén libres o actualizar `.env`.
