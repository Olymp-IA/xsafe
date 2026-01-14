# 📱 XSafe ERP Mobile

React Native application for shop floor operators. Focuses on speed, scanning capabilities, and offline robustness.

## 🛠️ Tech Stack

*   **Framework**: React Native 0.72
*   **Language**: TypeScript
*   **Local DB**: SQLite
*   **State**: Zustand + React Query

## 🚀 Getting Started

### Prerequisites

*   Node.js v20.x
*   Android Studio / Xcode
*   Java JDK 17

### Installation

```bash
cd apps/erp-mobile
npm install
```

### Development

Start the Metro bundler:

```bash
npm start
```

Run on Android (make sure emulator is running or device connected):
```bash
npm run android
```

Run on iOS (Mac only):
```bash
npm run ios
```

## 📦 Features

*   **Scan**: QR/Barcode scanning for inventory and order tracking.
*   **Offline Queue**: Operations are queued and synced when online.
*   **Production Steps**: Guides operators through manufacturing stages.
