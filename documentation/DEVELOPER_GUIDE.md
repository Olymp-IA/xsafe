# 💻 Developer Guide

This guide ensures that all contributors follow the same standards and workflows when developing for XSafe ERP.

## 🛠️ Environment Setup

### 1. Prerequisites
*   Node.js v20.10.0 (LTS)
*   Docker Desktop / Engine 24+
*   VS Code (Recommended) with extensions:
    *   ESLint, Prettier, Tailwind CSS, Prisma
*   Make (Optional)

### 2. Installation
```bash
# Clone repo
git clone https://github.com/xsafe/xsafe-erp.git
cd xsafe-erp

# Install dependencies (from root)
npm install

# Setup env variables
cp .env.example .env
# Edit .env with local credentials
```

### 3. Running Locally
```bash
# Start all services (Backend + Frontend + DB)
docker-compose up -d

# Start Web Admin (ERP Dashboard)
cd apps/erp-web
npm run dev

# Start Desktop App (Electron)
cd apps/erp-desktop
npm run dev

# Start Mobile App (Metro Bundler)
cd apps/erp-mobile
npm run start
```

## 🏗️ Project Structure
We follow a Monorepo structure managed by npm workspaces / Nx.

```
xsafe-erp/
├── apps/               # Application source code
│   ├── backend-api/    # NestJS API
│   ├── ecommerce-frontend/ # Next.js Storefront
│   ├── erp-web/        # Next.js Admin Dashboard
│   ├── erp-desktop/    # Electron Desktop App
│   └── erp-mobile/     # React Native App
├── packages/           # Shared libraries
│   ├── ui/             # Design System components
│   └── database/       # Prisma schema & types
├── tools/              # Dev scripts & configs
└── docs/               # Documentation
```

## 📏 Coding Standards

### Linting & Formatting
We use **ESLint** and **Prettier**. Run before committing:
```bash
npm run lint
npm run format
```

### Commit Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):
*   `feat: add inventory scanner`
*   `fix(api): resolve CORS issue`
*   `docs: update readme`
*   `chore: bump dependencies`

### Git Workflow
1.  Create a branch from `main` (or `dev`): `git checkout -b feature/my-feature`.
2.  Commit changes.
3.  Push and create a Pull Request (PR).
4.  Wait for CI checks (Test, Lint, Build).
5.  Get approval from 1 reviewer.
6.  Squash & Merge.

## 🧪 Testing
*   **Unit Tests**: `npm run test` (Jest)
*   **E2E Tests**: `npm run test:e2e` (Cypress/Playwright)

**Goal**: Maintain >80% code coverage on core business logic.

## 🐛 Troubleshooting

**"Prisma Client not initialized"**
Run: `npx prisma generate` in the `backend-api` folder.

**"Docker port conflict"**
Ensure ports `3000`, `3001`, `5432` are free or update `.env`.
