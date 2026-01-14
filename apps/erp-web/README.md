# 🌐 XSafe ERP Web Admin

Next.js-based administration dashboard for XSafe management. Provides real-time insights, user management, and global production oversight.

## 🛠️ Tech Stack

*   **Framework**: Next.js 14 (App Router)
*   **Auth**: NextAuth.js (v5)
*   **UI**: Tailwind CSS + Shadcn/UI
*   **Charts**: Recharts
*   **Communication**: Socket.io Client

## 🚀 Getting Started

### Prerequisites

*   Node.js v20.x
*   Backend API running (for full functionality)

### Installation

```bash
cd apps/erp-web
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Docker Build

```bash
docker build -t xsafe-erp-web .
```

## 📦 Features

*   **Dashboard**: Real-time KPI visualization.
*   **Production Orders**: Create and manage orders.
*   **Inventory**: Global stock view.
*   **RBAC**: Role-based access control (Admin, Manager, Operator).
