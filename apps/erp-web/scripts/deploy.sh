#!/bin/bash
# apps/erp-web/scripts/deploy.sh

set -e

# Variables
APP_NAME="xSafe-ERP-Web"
ENVIRONMENT=${1:-production}
DOCKER_REGISTRY="registry.xsafe.com"
VERSION=$(date +%Y%m%d%H%M%S)
IMAGE_TAG="${DOCKER_REGISTRY}/xsafe-erp-web:${ENVIRONMENT}-${VERSION}"

echo "🚀 Iniciando despliegue de ${APP_NAME}..."

# 1. Verificar que estamos en la rama correcta
if [[ "$ENVIRONMENT" == "production" ]]; then
    CURRENT_BRANCH=$(git branch --show-current)
    if [[ "$CURRENT_BRANCH" != "main" ]]; then
        echo "❌ Error: Para despliegue en producción debe estar en la rama main"
        exit 1
    fi
fi

# 2. Construir la aplicación
echo "🔨 Construyendo aplicación..."
npm run build

# 3. Ejecutar tests
echo "🧪 Ejecutando tests..."
npm test

# 4. Construir imagen Docker
echo "🐳 Construyendo imagen Docker..."
docker build -t ${IMAGE_TAG} .

# 5. Subir imagen al registro
echo "📤 Subiendo imagen al registro..."
docker push ${IMAGE_TAG}

# 6. Actualizar despliegue en Kubernetes
echo "⚙️ Actualizando despliegue en Kubernetes..."
kubectl set image deployment/xsafe-erp-web \
  xsafe-erp-web=${IMAGE_TAG} \
  -n ${ENVIRONMENT}

# 7. Esperar a que el rollout se complete
echo "⏳ Esperando a que el rollout se complete..."
kubectl rollout status deployment/xsafe-erp-web -n ${ENVIRONMENT}

# 8. Verificar el estado del servicio
echo "🔍 Verificando estado del servicio..."
sleep 10
kubectl get pods -n ${ENVIRONMENT} -l app=xsafe-erp-web

# 9. Ejecutar migraciones de base de datos (si es necesario)
if [[ "$ENVIRONMENT" == "production" ]]; then
    echo "🔄 Ejecutando migraciones de base de datos..."
    kubectl exec -n ${ENVIRONMENT} deployment/xsafe-erp-web -- \
      npx prisma migrate deploy
fi

echo "✅ Despliegue completado exitosamente!"
echo "📊 URL: https://erp.xsafe.com"
echo "🐳 Image: ${IMAGE_TAG}"
echo "⏰ Hora: $(date)"
