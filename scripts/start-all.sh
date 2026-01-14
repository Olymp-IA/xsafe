#!/bin/bash

# Kill any processes running on the target ports
fuser -k 3000/tcp 2>/dev/null
fuser -k 3001/tcp 2>/dev/null
fuser -k 3002/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null

echo "Starting XSafe ERP..."

# Start Core Backend
echo "Starting Core Backend on port 3000..."
(npm run start:dev > logs/core-backend.log 2>&1) &
BACKEND_PID=$!
echo "Core Backend PID: $BACKEND_PID"

# Start ERP Web
echo "Starting ERP Web on port 3001..."
(cd apps/erp-web && API_URL=http://localhost:3000 npm run dev -- -p 3001 > ../../logs/erp-web.log 2>&1) &
ERP_WEB_PID=$!
echo "ERP Web PID: $ERP_WEB_PID"

# Start Workshop Monitor
echo "Starting Workshop Monitor on port 3002..."
(cd apps/workshop-monitor && npm run dev > ../../logs/workshop-monitor.log 2>&1) &
WORKSHOP_PID=$!
echo "Workshop Monitor PID: $WORKSHOP_PID"

# Start Ecommerce Frontend
echo "Starting Ecommerce Frontend on port 5173..."
(cd apps/ecommerce-frontend && npm run dev > ../../logs/ecommerce-frontend.log 2>&1) &
ECOMMERCE_PID=$!
echo "Ecommerce Frontend PID: $ECOMMERCE_PID"

echo "All services started!"
echo "Logs available in logs/*.log"
