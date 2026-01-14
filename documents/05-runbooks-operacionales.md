# Runbooks Operacionales

**Documento ID:** DOC-RUN-001  
**Versión:** 1.0.0  
**Clasificación:** CONFIDENCIAL  
**Fecha:** 2026-01-14  

---

## Índice de Runbooks

| ID | Nombre | Frecuencia | Riesgo |
|----|--------|------------|--------|
| RB-001 | Despliegue a Producción | On-demand | ALTO |
| RB-002 | Rollback de Emergencia | Emergencia | CRÍTICO |
| RB-003 | Rotación de Secretos | Mensual | MEDIO |
| RB-004 | Backup y Restauración de BD | Diario/On-demand | ALTO |
| RB-005 | Escalado de Infraestructura | On-demand | MEDIO |
| RB-006 | Respuesta a Incidente de Seguridad | Emergencia | CRÍTICO |

---

## RB-001: Despliegue a Producción

### Metadata

| Campo | Valor |
|-------|-------|
| **ID** | RB-001 |
| **Versión** | 1.0 |
| **Clasificación** | CONFIDENCIAL |
| **Duración Estimada** | 30-45 minutos |
| **Nivel de Riesgo** | ALTO |
| **Frecuencia** | 2-4 veces por semana |
| **Última Ejecución** | [Fecha] |

### Propósito

Desplegar una nueva versión del sistema a producción de manera controlada y verificable.

### Cuándo Ejecutar

- Nuevo release aprobado (tag `v*.*.*`)
- Hotfix crítico aprobado
- Después de QA en staging

### Pre-requisitos

- [ ] Release branch mergeado a `main`
- [ ] Todos los tests pasando en CI
- [ ] QA sign-off en staging
- [ ] Changelog actualizado
- [ ] Notificación a stakeholders enviada
- [ ] Ventana de mantenimiento comunicada (si aplica)

### Procedimiento

#### Paso 1: Verificar Estado Actual

```bash
# Verificar versión actual en producción
aws ecs describe-services \
  --cluster xsafe-prod \
  --services xsafe-api \
  --query 'services[0].taskDefinition'

# Verificar healthcheck
curl -s https://api.xsafe.com/health | jq .
```

**Verificación:** Respuesta `{"status": "ok", "version": "X.X.X"}`  
**Tiempo estimado:** 2 minutos  
**Si falla:** Verificar conectividad, reportar a DevOps

---

#### Paso 2: Crear Tag de Release

```bash
# En repositorio local actualizado
git checkout main
git pull origin main
git tag -a v1.2.3 -m "Release v1.2.3: [descripción breve]"
git push origin v1.2.3
```

**Verificación:** Tag visible en GitHub  
**Tiempo estimado:** 3 minutos  
**Si falla:** Verificar permisos de push

---

#### Paso 3: Monitorear Pipeline de CI/CD

```bash
# Ver estado del workflow
gh run watch
```

**Verificación:** Todos los jobs en verde  
**Tiempo estimado:** 15-20 minutos  
**Si falla:** Ver logs del job, cancelar si es necesario

---

#### Paso 4: Verificar Despliegue

```bash
# Verificar que la nueva versión está activa
for i in {1..10}; do
  curl -s https://api.xsafe.com/health | jq -r .version
  sleep 5
done

# Verificar logs
aws logs tail /ecs/xsafe-api --follow --since 5m
```

**Verificación:** Versión nueva reportada, sin errores críticos  
**Tiempo estimado:** 5 minutos  
**Si falla:** Ejecutar RB-002 (Rollback)

---

#### Paso 5: Smoke Tests

```bash
# Ejecutar suite de smoke tests
npm run test:smoke:prod

# Verificaciones manuales:
# - [ ] Login funciona
# - [ ] Dashboard carga
# - [ ] Tienda accesible
```

**Verificación:** Todos los tests pasan  
**Tiempo estimado:** 5 minutos  
**Si falla:** Evaluar severidad, considerar rollback

---

#### Paso 6: Notificar Finalización

```bash
# Enviar notificación a Slack
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-type: application/json' \
  --data '{"text":"✅ Deploy v1.2.3 completado exitosamente"}'
```

**Verificación:** Mensaje recibido en canal  
**Tiempo estimado:** 1 minuto

---

### Rollback

Si cualquier paso falla con impacto en producción, ejecutar **RB-002**.

### Contactos

| Rol | Nombre | Contacto |
|-----|--------|----------|
| DevOps Lead | [Pendiente] | devops@xsafe.com |
| Tech Lead | [Pendiente] | tech@xsafe.com |

---

## RB-002: Rollback de Emergencia

### Metadata

| Campo | Valor |
|-------|-------|
| **ID** | RB-002 |
| **Versión** | 1.0 |
| **Clasificación** | CONFIDENCIAL |
| **Duración Estimada** | 5-10 minutos |
| **Nivel de Riesgo** | CRÍTICO |
| **Frecuencia** | Emergencia |

### Propósito

Revertir rápidamente a la última versión estable cuando un deploy causa problemas críticos.

### Cuándo Ejecutar

- Error 5xx en > 1% de requests
- Funcionalidad crítica rota
- Performance degradada severamente
- Vulnerabilidad de seguridad descubierta

### Procedimiento

#### Paso 1: Identificar Versión Anterior

```bash
# Listar últimas task definitions
aws ecs list-task-definitions \
  --family-prefix xsafe-api \
  --sort DESC \
  --max-items 5

# Identificar la penúltima (esa es la estable)
PREVIOUS_TASK_DEF="arn:aws:ecs:us-east-1:xxx:task-definition/xsafe-api:42"
```

**Tiempo estimado:** 1 minuto

---

#### Paso 2: Ejecutar Rollback

```bash
# Actualizar servicio con task definition anterior
aws ecs update-service \
  --cluster xsafe-prod \
  --service xsafe-api \
  --task-definition $PREVIOUS_TASK_DEF \
  --force-new-deployment
```

**Verificación:** Deployment started  
**Tiempo estimado:** 1 minuto

---

#### Paso 3: Monitorear Rollback

```bash
# Esperar a que las tareas nuevas estén healthy
aws ecs wait services-stable \
  --cluster xsafe-prod \
  --services xsafe-api

echo "Rollback completado"
```

**Tiempo estimado:** 2-5 minutos

---

#### Paso 4: Verificar Estabilidad

```bash
# Healthcheck
curl -s https://api.xsafe.com/health | jq .

# Verificar métricas en CloudWatch
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name HTTPCode_Target_5XX_Count \
  --start-time $(date -u -d '10 minutes ago' +%Y-%m-%dT%H:%M:%SZ) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) \
  --period 60 \
  --statistics Sum
```

**Verificación:** 5xx = 0 o cercano a 0  
**Tiempo estimado:** 2 minutos

---

#### Paso 5: Comunicar y Documentar

```bash
# Notificar rollback
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-type: application/json' \
  --data '{"text":"🔴 ROLLBACK ejecutado. Producción en versión X.X.X"}'
```

- [ ] Crear incident ticket
- [ ] Agendar post-mortem
- [ ] Documentar causa raíz

---

## RB-004: Backup y Restauración de BD

### Metadata

| Campo | Valor |
|-------|-------|
| **ID** | RB-004 |
| **Versión** | 1.0 |
| **Clasificación** | CONFIDENCIAL |
| **Duración Estimada** | Variable (5min - 2h según tamaño) |
| **Nivel de Riesgo** | ALTO |
| **Frecuencia** | Backup: Automático diario. Restore: On-demand |

### Backup Manual (si es necesario)

```bash
# Crear snapshot manual de RDS
aws rds create-db-snapshot \
  --db-instance-identifier xsafe-prod-db \
  --db-snapshot-identifier xsafe-manual-$(date +%Y%m%d-%H%M)

# Verificar estado
aws rds describe-db-snapshots \
  --db-snapshot-identifier xsafe-manual-YYYYMMDD-HHMM
```

### Restauración desde Snapshot

#### Paso 1: Identificar Snapshot

```bash
# Listar snapshots disponibles
aws rds describe-db-snapshots \
  --db-instance-identifier xsafe-prod-db \
  --query 'DBSnapshots[*].[DBSnapshotIdentifier,SnapshotCreateTime,Status]' \
  --output table
```

---

#### Paso 2: Restaurar a Nueva Instancia

```bash
# Restaurar (NUNCA sobrescribir producción directamente)
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier xsafe-restored-$(date +%Y%m%d) \
  --db-snapshot-identifier [SNAPSHOT_ID] \
  --db-instance-class db.r5.large \
  --vpc-security-group-ids sg-xxxxx
```

**Tiempo estimado:** 15-60 minutos según tamaño

---

#### Paso 3: Verificar Datos

```bash
# Conectar a la instancia restaurada
psql -h xsafe-restored-YYYYMMDD.xxxxx.us-east-1.rds.amazonaws.com \
  -U admin -d xsafe

# Verificar conteos
SELECT 'users', count(*) FROM "User"
UNION ALL
SELECT 'orders', count(*) FROM "Order"
UNION ALL
SELECT 'products', count(*) FROM "Product";
```

---

#### Paso 4: Swap de Producción (si es recovery real)

```bash
# Renombrar instancia actual
aws rds modify-db-instance \
  --db-instance-identifier xsafe-prod-db \
  --new-db-instance-identifier xsafe-prod-db-old \
  --apply-immediately

# Esperar a que el rename complete
aws rds wait db-instance-available \
  --db-instance-identifier xsafe-prod-db-old

# Renombrar restaurada a producción
aws rds modify-db-instance \
  --db-instance-identifier xsafe-restored-YYYYMMDD \
  --new-db-instance-identifier xsafe-prod-db \
  --apply-immediately
```

**ADVERTENCIA:** Este paso causa downtime. Coordinar ventana de mantenimiento.

---

## RB-006: Respuesta a Incidente de Seguridad

### Metadata

| Campo | Valor |
|-------|-------|
| **ID** | RB-006 |
| **Versión** | 1.0 |
| **Clasificación** | CONFIDENCIAL |
| **Duración Estimada** | Variable |
| **Nivel de Riesgo** | CRÍTICO |
| **Frecuencia** | Emergencia |

### Procedimiento

#### Fase 1: Contención (0-15 minutos)

```bash
# 1. Si es brecha de credenciales, revocar tokens
aws secretsmanager rotate-secret \
  --secret-id xsafe/jwt-secret

# 2. Si es ataque activo, bloquear IP en WAF
aws wafv2 update-ip-set \
  --name blocked-ips \
  --scope REGIONAL \
  --id xxx \
  --addresses $ATTACKER_IP/32 \
  --lock-token xxx

# 3. Si es compromiso de cuenta, deshabilitar usuario
psql -c "UPDATE \"User\" SET status='BLOCKED' WHERE id='xxx'"
```

---

#### Fase 2: Erradicación (15 min - 2 horas)

- Identificar vector de ataque
- Parchear vulnerabilidad
- Forzar rotación de credenciales afectadas
- Limpiar malware/backdoors si aplica

---

#### Fase 3: Recuperación (Variable)

- Restaurar desde backup limpio si es necesario
- Monitoreo intensivo 24-48 horas
- Validar integridad de datos

---

#### Fase 4: Post-Incidente

- [ ] Informe de incidente en 24h
- [ ] Post-mortem en 72h
- [ ] Actualizar runbooks si es necesario
- [ ] Notificar a reguladores si aplica (GDPR: 72h)

---

## Historial de Ejecución

| Fecha | Runbook | Ejecutor | Resultado | Observaciones |
|-------|---------|----------|-----------|---------------|
| [Fecha] | RB-001 | [Nombre] | Exitoso | v1.2.3 |
| [Fecha] | RB-002 | [Nombre] | Exitoso | Rollback a v1.2.2 |

---

*Este documento sigue las mejores prácticas de Google SRE y ITIL Service Operation.*
