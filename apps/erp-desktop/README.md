# 🖥️ XSafe ERP Desktop

Electron-based desktop application for XSafe factory workstations. Built with reliable offline-first architecture to ensure continuous operation even without internet connectivity.

## 🛠️ Tech Stack

*   **Core**: Electron 25
*   **Renderer**: React 18 + Vite
*   **Language**: TypeScript
*   **Database**: SQLite (via TypeORM)
*   **Styling**: Tailwind CSS

## 🚀 Getting Started

### Prerequisites

*   Node.js v20.x
*   npm 9.x+

### Installation

```bash
cd apps/erp-desktop
npm install
```

### Development

Run the app in development mode with HMR:

```bash
npm run dev
```

### Build

Create production artifacts (Installer/Executable):

```bash
npm run dist
```
*   Output will be in `dist/`.

## 📦 Features

*   **Offline-First**: Local database synchronization.
*   **Hardware Access**: Native file system integration.
*   **Auto-Update**: Built-in updater mechanism.
*   **Secure IPC**: Context-isolated communication between Main and Renderer processes.
