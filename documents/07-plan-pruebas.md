# Plan de Pruebas

**Documento ID:** DOC-TEST-001  
**Versión:** 1.0.0  
**Clasificación:** INTERNO  
**Fecha:** 2026-01-14  

---

## 1. Introducción

### 1.1 Propósito

Este documento define la estrategia, alcance, recursos y planificación de las actividades de pruebas para el sistema XSafe ERP.

### 1.2 Alcance

| Incluido | Excluido |
|----------|----------|
| Backend API (NestJS) | Infraestructura AWS (probada separadamente) |
| Frontend Web (Next.js) | Integraciones de terceros reales |
| App Desktop (Electron) | Tests de carga a gran escala |
| App Mobile (React Native) | Pruebas de penetración (tercero) |
| Workshop Monitor (React) | |

### 1.3 Referencias

| Documento | Ubicación |
|-----------|-----------|
| Requisitos | `/documents/02-casos-de-uso.md` |
| Arquitectura | `/documents/01-arquitectura-sistema.md` |
| Seguridad | `/documents/08-documento-seguridad.md` |

---

## 2. Estrategia de Pruebas

### 2.1 Pirámide de Testing

```
                    ╱╲
                   ╱  ╲
                  ╱ E2E╲          (5-10%)
                 ╱──────╲
                ╱        ╲
               ╱Integration╲       (20-30%)
              ╱────────────╲
             ╱              ╲
            ╱      Unit      ╲     (60-70%)
           ╱──────────────────╲
```

### 2.2 Tipos de Pruebas

| Tipo | Descripción | Herramienta | Cobertura Objetivo |
|------|-------------|-------------|-------------------|
| **Unit** | Funciones/métodos aislados | Jest | > 80% |
| **Integration** | Interacción entre componentes | Jest + Supertest | Endpoints críticos |
| **E2E** | Flujos completos de usuario | Playwright | Flujos principales |
| **Performance** | Carga y rendimiento | k6 | Baseline establecido |
| **Security** | Vulnerabilidades | OWASP ZAP | Sin críticos/altos |
| **Accessibility** | WCAG compliance | axe-core | AA compliance |

---

## 3. Niveles de Pruebas

### 3.1 Pruebas Unitarias

#### 3.1.1 Backend (NestJS)

**Ubicación:** `apps/core-backend/src/**/*.spec.ts`

**Convenciones:**
```typescript
describe('AuthService', () => {
  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      // Arrange
      // Act
      // Assert
    });
    
    it('should throw UnauthorizedException when password is wrong', async () => {
      // ...
    });
  });
});
```

**Cobertura por Módulo:**

| Módulo | Archivos | Cobertura Actual | Objetivo |
|--------|----------|------------------|----------|
| `auth` | 12 | 92% | > 80% |
| `production` | 8 | 85% | > 80% |
| `inventory` | 6 | 88% | > 80% |
| `quality` | 5 | 82% | > 80% |
| `machines` | 4 | 79% | > 80% |
| `ecommerce` | 15 | 81% | > 80% |

**Comandos:**
```bash
# Ejecutar todos los tests
npm run test

# Con cobertura
npm run test:cov

# Watch mode
npm run test:watch

# Un archivo específico
npm run test -- auth.service.spec.ts
```

#### 3.1.2 Frontend (React)

**Ubicación:** `apps/*/src/**/*.test.tsx`

**Herramientas:**
- Jest
- React Testing Library
- MSW (Mock Service Worker)

**Ejemplo:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('should display error on invalid email', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.submit(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.findByText(/email inválido/i)).toBeInTheDocument();
  });
});
```

### 3.2 Pruebas de Integración

#### 3.2.1 API Integration Tests

**Ubicación:** `apps/core-backend/test/*.e2e-spec.ts`

**Configuración:**
- Base de datos de test (PostgreSQL)
- Seeds de datos específicos
- Limpieza entre tests

**Ejemplo:**
```typescript
describe('ProductionController (Integration)', () => {
  let app: INestApplication;
  let authToken: string;
  
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
    
    // Obtener token de auth
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'Test123!' });
    authToken = response.body.accessToken;
  });

  it('POST /production/orders should create order', async () => {
    const response = await request(app.getHttpServer())
      .post('/production/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        productId: 'prod-1',
        quantity: 10,
        scheduledDate: '2026-01-20',
        priority: 'HIGH',
      })
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toBe('SCHEDULED');
  });

  afterAll(async () => {
    await app.close();
  });
});
```

**Comandos:**
```bash
# Ejecutar tests de integración
npm run test:e2e
```

### 3.3 Pruebas End-to-End

#### 3.3.1 Playwright Tests

**Ubicación:** `tests/e2e/`

**Flujos a probar:**

| ID | Flujo | Criticidad | Automatizado |
|----|-------|------------|--------------|
| E2E-001 | Login exitoso | Crítico | ✅ |
| E2E-002 | Login fallido (bloqueo) | Alto | ✅ |
| E2E-003 | Crear orden de producción | Crítico | ✅ |
| E2E-004 | Checkout completo | Crítico | ✅ |
| E2E-005 | Consultar inventario | Medio | ✅ |
| E2E-006 | Registrar inspección QC | Medio | ✅ |
| E2E-007 | Dashboard carga correctamente | Alto | ✅ |

**Ejemplo:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('https://erp.xsafe.com/login');
    
    await page.fill('[data-testid="email-input"]', 'admin@xsafe.com');
    await page.fill('[data-testid="password-input"]', 'SecurePass123!');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should block account after 5 failed attempts', async ({ page }) => {
    await page.goto('https://erp.xsafe.com/login');
    
    for (let i = 0; i < 5; i++) {
      await page.fill('[data-testid="email-input"]', 'admin@xsafe.com');
      await page.fill('[data-testid="password-input"]', 'WrongPassword');
      await page.click('[data-testid="login-button"]');
    }
    
    await expect(page.locator('.error-message')).toContainText('Cuenta bloqueada');
  });
});
```

**Comandos:**
```bash
# Ejecutar tests E2E
npx playwright test

# Con UI mode
npx playwright test --ui

# Generar reporte HTML
npx playwright show-report
```

### 3.4 Pruebas de Performance

#### 3.4.1 k6 Load Tests

**Ubicación:** `tests/performance/`

**Escenarios:**

| Escenario | VUs | Duración | Objetivo |
|-----------|-----|----------|----------|
| Smoke | 1 | 1m | Verificar funcionalidad |
| Load | 50 | 10m | P95 < 200ms |
| Stress | 200 | 5m | Sin errores 5xx |
| Spike | 1-500-1 | 5m | Recuperación rápida |

**Script ejemplo:**
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },  // Ramp up
    { duration: '5m', target: 50 },  // Stay
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://api.xsafe.com/products');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 200,
  });
  sleep(1);
}
```

**Comandos:**
```bash
# Ejecutar test de carga
k6 run tests/performance/load-test.js

# Con salida a Grafana Cloud
k6 run --out cloud tests/performance/load-test.js
```

### 3.5 Pruebas de Seguridad

#### 3.5.1 Automatizadas (SAST/DAST)

| Herramienta | Tipo | Frecuencia | Integración |
|-------------|------|------------|-------------|
| npm audit | SAST | Por commit | GitHub Actions |
| Snyk | SAST | Diario | GitHub Integration |
| OWASP ZAP | DAST | Semanal | Scheduled Job |
| GitLeaks | Secrets | Por commit | Pre-commit hook |

#### 3.5.2 Checklist Manual

- [ ] SQL Injection en todos los inputs
- [ ] XSS en campos de texto
- [ ] CSRF en formularios
- [ ] Broken Authentication
- [ ] Sensitive Data Exposure
- [ ] Security Misconfiguration
- [ ] IDOR en recursos

---

## 4. Entornos de Pruebas

### 4.1 Matriz de Entornos

| Entorno | URL | Base de Datos | Propósito |
|---------|-----|---------------|-----------|
| Local | localhost:3000 | PostgreSQL local | Desarrollo |
| Test | - | PostgreSQL testcontainers | Tests automatizados |
| Staging | staging.xsafe.com | RDS Staging | QA manual, E2E |
| Production | xsafe.com | RDS Production | Smoke tests post-deploy |

### 4.2 Datos de Prueba

**Usuarios de Test:**

| Email | Password | Rol | Propósito |
|-------|----------|-----|-----------|
| `admin.test@xsafe.com` | `Test123!Admin` | ADMIN | Tests de administración |
| `manager.test@xsafe.com` | `Test123!Mgr` | MANAGER | Tests de producción |
| `operator.test@xsafe.com` | `Test123!Op` | OPERATOR | Tests de operaciones |
| `customer.test@xsafe.com` | `Test123!Cust` | CUSTOMER | Tests de e-commerce |

⚠️ Estos usuarios solo existen en entornos de desarrollo y staging.

---

## 5. Criterios de Aceptación

### 5.1 Criterios de Entrada

| Criterio | Verificado Por |
|----------|----------------|
| Código compila sin errores | CI Build |
| Todos los unit tests pasan | CI Jest |
| Linting pasa | CI ESLint |
| Sin vulnerabilidades críticas | npm audit |

### 5.2 Criterios de Salida

| Nivel | Criterio | Umbral |
|-------|----------|--------|
| Unit | Cobertura de código | ≥ 80% |
| Integration | Endpoints críticos probados | 100% |
| E2E | Flujos principales pasan | 100% |
| Performance | P95 response time | < 200ms |
| Security | Vulnerabilidades críticas/altas | 0 |

### 5.3 Criterios para Bloqueo de Release

❌ **No se puede hacer release si:**
- Cobertura de código < 80%
- Algún test E2E crítico falla
- Existen vulnerabilidades de seguridad críticas
- P95 > 500ms en tests de carga

---

## 6. Defectos

### 6.1 Clasificación de Severidad

| Severidad | Descripción | SLA Resolución | Ejemplo |
|-----------|-------------|----------------|---------|
| **Crítico** | Sistema inutilizable | 4 horas | Login no funciona |
| **Alto** | Funcionalidad principal afectada | 24 horas | No se puede crear orden |
| **Medio** | Funcionalidad secundaria afectada | 72 horas | Reporte no exporta |
| **Bajo** | Cosmético o mejora | Siguiente sprint | Typo en interfaz |

### 6.2 Flujo de Defectos

```
Nuevo → Asignado → En Progreso → Resuelto → Verificado → Cerrado
                       ↓
                   Rechazado
                       ↓
                   Reabierto
```

### 6.3 Template de Reporte

```markdown
## Título del Defecto

**Severidad:** [Crítico/Alto/Medio/Bajo]
**Módulo:** [Auth/Production/etc.]
**Entorno:** [Local/Staging/Prod]
**Reportado por:** [Nombre]
**Fecha:** [YYYY-MM-DD]

### Descripción
[Descripción clara del problema]

### Pasos para Reproducir
1. Paso 1
2. Paso 2
3. Paso 3

### Resultado Esperado
[Qué debería pasar]

### Resultado Actual
[Qué está pasando]

### Evidencia
[Screenshots, logs, videos]

### Información Adicional
- Navegador/Dispositivo:
- Versión de la app:
- Datos de prueba usados:
```

---

## 7. Roles y Responsabilidades

| Rol | Responsabilidades |
|-----|-------------------|
| **QA Lead** | Estrategia de testing, coordinación, reportes |
| **QA Engineer** | Diseño y ejecución de tests, automatización |
| **Developer** | Unit tests, fix de defectos |
| **DevOps** | Entornos de testing, CI/CD |
| **Product Owner** | UAT, criterios de aceptación |

---

## 8. Cronograma de Actividades

### 8.1 Por Sprint

| Día | Actividad |
|-----|-----------|
| Día 1-2 | Definición de tests para nuevas features |
| Día 3-7 | Desarrollo con TDD |
| Día 8-9 | Tests de integración |
| Día 10 | Test de regresión, E2E |

### 8.2 Por Release

| Etapa | Duración | Actividades |
|-------|----------|-------------|
| Feature Freeze | T-5 días | Congelar código, focus en fixes |
| Regression Testing | T-4 a T-2 | Suite completa de regresión |
| Performance Testing | T-3 | Tests de carga en staging |
| Security Scan | T-2 | DAST en staging |
| UAT | T-2 a T-1 | Validación por PO |
| Go/No-Go | T-1 | Decisión de release |

---

## 9. Métricas y Reportes

### 9.1 Métricas de Calidad

| Métrica | Fórmula | Objetivo |
|---------|---------|----------|
| Defect Density | Defectos / KLOC | < 5 |
| Test Coverage | Líneas cubiertas / Total | ≥ 80% |
| Defect Escape Rate | Defectos prod / Total defectos | < 10% |
| Test Automation Rate | Tests automáticos / Total tests | ≥ 70% |
| MTTR (Defectos) | Tiempo promedio resolución | < 24h (Críticos) |

### 9.2 Reportes

| Reporte | Frecuencia | Audiencia |
|---------|------------|-----------|
| Test Execution Summary | Diario | Dev Team |
| Coverage Report | Por PR | Dev Team |
| Sprint Testing Report | Por sprint | Stakeholders |
| Release Quality Report | Por release | Management |

---

## 10. Herramientas

| Categoría | Herramienta | Propósito |
|-----------|-------------|-----------|
| Unit Testing | Jest | Tests unitarios |
| E2E Testing | Playwright | Tests end-to-end |
| API Testing | Supertest | Tests de integración |
| Load Testing | k6 | Tests de rendimiento |
| Security Testing | OWASP ZAP | Tests de seguridad |
| Coverage | Istanbul/nyc | Cobertura de código |
| CI/CD | GitHub Actions | Automatización |
| Bug Tracking | GitHub Issues | Gestión de defectos |

---

*Este documento cumple con los estándares IEEE 829 para documentación de pruebas de software.*
