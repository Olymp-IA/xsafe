# ⚙️ XSafe Core Backend

NestJS microservices architecture serving as the central nervous system for the XSafe ERP platform.

## 🛠️ Tech Stack

*   **Framework**: NestJS
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Message Broker**: RabbitMQ (optional for dev)
*   **Cache**: Redis

## 🚀 Getting Started

### Prerequisites

*   Node.js v20.x
*   Docker (for DB/Redis)

### Installation

```bash
cd apps/core-backend
npm install
```

### Database Setup

Ensure your `.env` is configured (see `.env.example`).

```bash
# Start DB services
docker-compose up -d db redis

# Run migrations
npx prisma migrate dev
```

### Development

```bash
npm run start:dev
```

## 📦 Features

*   **AUTH Module**: JWT generation and validation.
*   **PRODUCTION Module**: Order state machine and scheduling.
*   **INVENTORY Module**: Stock management logic.
*   **SYNC API**: Endpoints for mobile/desktop offline synchronization.
