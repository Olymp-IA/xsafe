# xSafe ERP

## Description
xSafe ERP is a comprehensive Enterprise Resource Planning system built with NestJS, React, and Prisma. This monorepo contains the core backend API, a real-time workshop monitor, and an administrative dashboard.

## Project Structure

- `apps/core-backend`: The main NestJS API service.
- `apps/workshop-monitor`: Real-time application for workshop monitoring (React).
- `apps/admin-dashboard`: Administrative control panel (React).
- `packages/shared-types`: Shared TypeScript interfaces.
- `packages/business-logic`: Shared business logic and rules.
- `packages/ui-kit`: Shared React component library.
- `packages/config`: Shared configuration utilities.

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start infrastructure**:
    ```bash
    docker-compose up -d
    ```

3.  **Run Core Backend**:
    ```bash
    npm run start:dev core-backend
    ```

## Technology Stack

- **Backend**: NestJS, Prisma, PostgreSQL, Redis, Socket.io
- **Frontend**: React (Vite/Next.js ready setup)
- **Infrastructure**: Docker, RabbitMQ, MinIO

## License
[MIT](LICENSE)
