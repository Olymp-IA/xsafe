# 🛡️ XSafe ERP & E-commerce Platform

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)

## 📖 Executive Overview

**XSafe ERP** is a state-of-the-art, enterprise-grade platform designed to revolutionize the manufacturing and sales of advanced motorcycle protection systems. This monorepo integrates a high-performance diverse ecosystem:

*   **🛒 E-commerce Storefront**: Next.js-based consumer facing platform with 3D product visualization.
*   **🏭 ERP Core**: NestJS microservices architecture for managing production, inventory, and logistics.
*   **📱 Mobile Operator App**: Offline-first React Native application for shop floor management.
*   **📊 Analytics Dashboard**: Real-time business intelligence and reporting.

Built with a focus on **scalability**, **security**, and **reliability**, XSafe ERP follows strict ISO compliance standards and utilizes modern cloud-native technologies.

---

## 🏗️ Tech Stack

### Frontend Ecosystem
*   **Web Store**: Next.js 14, React 18, Tailwind CSS, Framer Motion
*   **Web Admin**: Next.js 14 App Router, NextAuth, Recharts (ERP Dashboard)
*   **3D Engine**: Three.js, React Three Fiber, Drei
*   **State Management**: Zustand, React Query
*   **Mobile**: React Native 0.72, TypeScript, SQLite (Offline Mode)
*   **Desktop**: Electron 25, React, SQLite (Offline-First)

### Backend Services
*   **API Gateway**: NestJS, Fastify
*   **Database**: PostgreSQL (Prisma ORM), Redis (Caching)
*   **Message Broker**: RabbitMQ / Kafka (Event Driven)
*   **Auth**: JWT, OAuth2, Role-Based Access Control (RBAC)

### DevOps & Infrastructure
*   **Containerization**: Docker, Docker Compose
*   **CI/CD**: GitHub Actions
*   **Monitoring**: Prometheus, Grafana, Sentry

---

## 🚀 Quick Start

### Prerequisites
*   Node.js v20.x or higher
*   Docker & Docker Compose
*   PostgreSQL 15+
*   Android Studio / Xcode (for mobile development)

### One-Command Setup
We provide a unified script to bootstrap the entire environment:

```bash
# Clone the repository
git clone https://github.com/xsafe/xsafe-erp.git
cd xsafe-erp

# Install dependencies (Monorepo)
npm install

# Start development environment (Docker services + Apps)
npm run dev:all
```

Alternatively, run specific services:

```bash
# Frontend (Store)
npm run dev:ecommerce

# Web Admin (ERP)
npm run dev:web

# Backend only
npm run dev:backend

# Mobile Android
npm run android

# Desktop App
npm run dev:desktop
```

---

## 📚 Documentation Index

For detailed information, please refer to our comprehensive documentation suite located in `/documentation`:

*   [**Architecture Overview**](./documentation/ARCHITECTURE.md): System design, patterns, and C4 diagrams.
*   [**API Reference**](./documentation/API_DOCUMENTATION.md): OpenAPI/Swagger specs and endpoint guide.
*   [**User Manual**](./documentation/USER_MANUAL.md): End-user guides for Shop and ERP.
*   [**Developer Guide**](./documentation/DEVELOPER_GUIDE.md): Contribution guidelines and setup.
*   [**Security Policy**](./documentation/SECURITY.md): Auth models and compliance.
*   [**Deployment Guide**](./documentation/DEPLOYMENT_GUIDE.md): Production rollout strategies.

---

## 📞 Support & License

**License**: MIT
**Support**: contact@xsafe.com
**Emergency**: +1 800 XSAFE 99 (24/7 Production Support)

---
*Powered by OLYMP-IA Enterprise Solutions*
