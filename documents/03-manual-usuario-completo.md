# Manual de Usuario Completo

**Documento ID:** DOC-USR-001  
**Versión:** 1.0.0  
**Clasificación:** INTERNO  
**Fecha:** 2026-01-14  
**Páginas Equivalentes:** ~120  

---

# SECCIÓN 1: PRELIMINARES

## 1.1 Información del Documento

| Campo | Valor |
|-------|-------|
| Título | Manual de Usuario XSafe ERP |
| Versión | 1.0.0 |
| Clasificación | INTERNO |
| Autor | Equipo de Documentación |
| Fecha de Creación | 2026-01-14 |
| Última Actualización | 2026-01-14 |

### Control de Versiones

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0.0 | 2026-01-14 | Sistema | Versión inicial |

### Distribución

Este documento está destinado a:
- Usuarios finales del sistema (Operarios, Gerentes, Supervisores)
- Personal de soporte técnico
- Administradores del sistema

---

## 1.2 Convenciones Tipográficas

| Convención | Significado | Ejemplo |
|------------|-------------|---------|
| **Negrita** | Elementos de interfaz, botones | Haga clic en **Guardar** |
| `Código` | Comandos, URLs, código | Acceda a `https://erp.xsafe.com` |
| *Cursiva* | Términos técnicos, énfasis | El *OEE* mide la eficiencia |
| ⚠️ | Advertencia importante | ⚠️ Esta acción no puede deshacerse |
| ✅ | Acción exitosa | ✅ Orden creada correctamente |
| ❌ | Error o prohibición | ❌ Acceso denegado |
| 💡 | Consejo o sugerencia | 💡 Use atajos de teclado para mayor rapidez |

### Símbolos de Navegación

| Símbolo | Significado |
|---------|-------------|
| ➔ | Navegación secuencial |
| → | Flujo de acción |
| ⌨️ | Atajo de teclado |

---

## 1.3 Tabla de Contenidos

1. **SECCIÓN 1: PRELIMINARES**
   - 1.1 Información del Documento
   - 1.2 Convenciones Tipográficas
   - 1.3 Tabla de Contenidos

2. **SECCIÓN 2: INICIO RÁPIDO**
   - 2.1 Requisitos del Sistema
   - 2.2 Acceso al Sistema
   - 2.3 Primer Inicio de Sesión
   - 2.4 Tour de la Interfaz

3. **SECCIÓN 3: MÓDULO DE AUTENTICACIÓN**
   - 3.1 Iniciar Sesión
   - 3.2 Recuperar Contraseña
   - 3.3 Cerrar Sesión
   - 3.4 Gestión de Perfil

4. **SECCIÓN 4: MÓDULO DE PRODUCCIÓN**
   - 4.1 Dashboard de Producción
   - 4.2 Órdenes de Producción
   - 4.3 Etapas de Fabricación
   - 4.4 Reportes de Producción

5. **SECCIÓN 5: MÓDULO DE INVENTARIO**
   - 5.1 Consulta de Stock
   - 5.2 Movimientos de Inventario
   - 5.3 Alertas de Stock
   - 5.4 Reportes de Inventario

6. **SECCIÓN 6: MÓDULO DE CALIDAD**
   - 6.1 Inspecciones
   - 6.2 Registro de Defectos
   - 6.3 Métricas de Calidad

7. **SECCIÓN 7: MÓDULO DE MAQUINARIA**
   - 7.1 Estado de Máquinas
   - 7.2 Métricas OEE
   - 7.3 Alertas de Mantenimiento

8. **SECCIÓN 8: MÓDULO E-COMMERCE (CLIENTES)**
   - 8.1 Navegación del Catálogo
   - 8.2 Carrito de Compras
   - 8.3 Proceso de Checkout
   - 8.4 Historial de Pedidos

9. **SECCIÓN 9: MONITOR DE TALLER**
   - 9.1 Visualización de KPIs
   - 9.2 Estado de Maquinaria
   - 9.3 Alertas en Tiempo Real

10. **SECCIÓN 10: ADMINISTRACIÓN**
    - 10.1 Gestión de Usuarios
    - 10.2 Configuración del Sistema
    - 10.3 Logs de Auditoría

11. **SECCIÓN 11: RESOLUCIÓN DE PROBLEMAS**
    - 11.1 Problemas Comunes
    - 11.2 Mensajes de Error
    - 11.3 Contacto de Soporte

12. **ANEXOS**
    - A. Atajos de Teclado
    - B. Glosario Rápido
    - C. Preguntas Frecuentes

---

# SECCIÓN 2: INICIO RÁPIDO

## 2.1 Requisitos del Sistema

### Para Panel Web (Gerentes/Supervisores)

| Requisito | Especificación |
|-----------|----------------|
| Navegador | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Resolución | Mínimo 1366x768, Recomendado 1920x1080 |
| Conexión | Internet estable (mínimo 5 Mbps) |
| JavaScript | Habilitado |
| Cookies | Habilitadas |

### Para App Móvil (Operarios)

| Requisito | Android | iOS |
|-----------|---------|-----|
| Versión OS | Android 10+ | iOS 14+ |
| RAM | 4GB mínimo | 4GB mínimo |
| Almacenamiento | 200MB libres | 200MB libres |
| Conectividad | WiFi o datos móviles | WiFi o datos móviles |

### Para App de Escritorio (Estaciones de Trabajo)

| Requisito | Windows | macOS | Linux |
|-----------|---------|-------|-------|
| Versión OS | Windows 10+ | macOS 11+ | Ubuntu 20.04+ |
| RAM | 8GB | 8GB | 8GB |
| Disco | 500MB | 500MB | 500MB |
| CPU | Intel i5 / AMD Ryzen 5 | Apple M1 / Intel i5 | Intel i5 / AMD Ryzen 5 |

---

## 2.2 Acceso al Sistema

### URLs de Acceso

| Aplicación | URL | Usuarios |
|------------|-----|----------|
| Panel Administrativo | `https://erp.xsafe.com` | Gerentes, Supervisores |
| Tienda Online | `https://tienda.xsafe.com` | Clientes |
| API (Desarrollo) | `https://api.xsafe.com` | Desarrolladores |

### Descarga de Aplicaciones

| Plataforma | Enlace |
|------------|--------|
| Android | Google Play Store → "XSafe ERP" |
| iOS | App Store → "XSafe ERP" |
| Windows | `https://releases.xsafe.com/desktop/windows` |
| macOS | `https://releases.xsafe.com/desktop/mac` |

---

## 2.3 Primer Inicio de Sesión

### Paso 1: Acceder a la URL

Abra su navegador y navegue a `https://erp.xsafe.com`

### Paso 2: Ingresar Credenciales

1. En el campo **Email**, ingrese su correo corporativo
2. En el campo **Contraseña**, ingrese la contraseña temporal proporcionada
3. Haga clic en **Iniciar Sesión**

```
┌─────────────────────────────────────┐
│         XSafe ERP Login             │
├─────────────────────────────────────┤
│                                     │
│  Email:     [________________]      │
│                                     │
│  Contraseña: [________________]     │
│                                     │
│  [✓] Recordarme                     │
│                                     │
│       [ Iniciar Sesión ]            │
│                                     │
│  ¿Olvidó su contraseña?             │
│                                     │
└─────────────────────────────────────┘
```

### Paso 3: Cambiar Contraseña Temporal

En su primer acceso, el sistema le solicitará cambiar su contraseña:

1. Ingrese la contraseña temporal actual
2. Ingrese su nueva contraseña (mínimo 8 caracteres, incluir mayúsculas, minúsculas y números)
3. Confirme la nueva contraseña
4. Haga clic en **Actualizar Contraseña**

⚠️ **Importante:** La contraseña temporal expira en 24 horas. Si no la cambia a tiempo, contacte a su administrador.

### Paso 4: Configurar Perfil (Opcional)

1. Haga clic en su avatar en la esquina superior derecha
2. Seleccione **Mi Perfil**
3. Complete o actualice:
   - Nombre completo
   - Teléfono de contacto
   - Foto de perfil (opcional)
4. Haga clic en **Guardar Cambios**

---

## 2.4 Tour de la Interfaz

### Estructura General del Panel

```
┌─────────────────────────────────────────────────────────────────┐
│ [≡] XSafe ERP            [🔔 3] [👤 Juan Pérez ▼]              │ ← HEADER
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ Dashboard│                                                      │
│          │                    ÁREA DE                           │
│ Producción                    CONTENIDO                         │
│          │                    PRINCIPAL                         │
│ Inventario                                                      │
│          │                                                      │
│ Calidad  │                                                      │
│          │                                                      │
│ Máquinas │                                                      │
│          │                                                      │
│ Reportes │                                                      │
│          │                                                      │
├──────────┴──────────────────────────────────────────────────────┤
│ © 2026 XSafe ERP v1.2.3 | Soporte: soporte@xsafe.com           │ ← FOOTER
└─────────────────────────────────────────────────────────────────┘
     ↑                              ↑
  SIDEBAR                    CONTENT AREA
```

### Elementos del Header

| Elemento | Función |
|----------|---------|
| [≡] Menú hamburguesa | Colapsar/expandir sidebar |
| Logo XSafe | Volver al dashboard principal |
| [🔔] Notificaciones | Ver alertas y mensajes del sistema |
| [👤] Perfil | Acceder a configuración, perfil, cerrar sesión |

### Elementos del Sidebar

| Sección | Descripción | Roles con Acceso |
|---------|-------------|------------------|
| Dashboard | Vista general, KPIs principales | Todos |
| Producción | Órdenes, etapas, programación | Admin, Manager, Operator |
| Inventario | Stock, movimientos, alertas | Admin, Manager, Operator |
| Calidad | Inspecciones, defectos, métricas | Admin, Manager, Supervisor |
| Máquinas | Estado OEE, mantenimiento | Admin, Manager |
| Reportes | Analíticas, exportaciones | Admin, Manager |
| Configuración | Usuarios, sistema (solo Admin) | Admin |

---

# SECCIÓN 3: MÓDULO DE AUTENTICACIÓN

## 3.1 Iniciar Sesión

### Procedimiento Estándar

1. Navegue a `https://erp.xsafe.com`
2. Ingrese su **email** corporativo
3. Ingrese su **contraseña**
4. (Opcional) Marque **Recordarme** para sesiones de 7 días
5. Haga clic en **Iniciar Sesión**

### Iniciar Sesión con Sesión Activa

Si ya tiene una sesión activa en otro dispositivo:

- La sesión anterior se mantendrá por seguridad
- Puede tener hasta 3 sesiones simultáneas
- Las sesiones inactivas por 15 minutos se cierran automáticamente

### Bloqueo por Intentos Fallidos

| Intentos | Consecuencia |
|----------|--------------|
| 1-4 | Mensaje de error, puede reintentar |
| 5 | Cuenta bloqueada por 15 minutos |
| 10 | Cuenta bloqueada, requiere reset por administrador |

⚠️ Si su cuenta está bloqueada, espere el tiempo indicado o contacte a su administrador.

---

## 3.2 Recuperar Contraseña

### Procedimiento

1. En la pantalla de login, haga clic en **¿Olvidó su contraseña?**
2. Ingrese su email corporativo
3. Haga clic en **Enviar Instrucciones**
4. Revise su bandeja de entrada (y spam)
5. Haga clic en el enlace del email (válido por 1 hora)
6. Ingrese y confirme su nueva contraseña
7. Haga clic en **Restablecer Contraseña**

✅ Recibirá confirmación y será redirigido al login.

💡 **Consejo:** Si no recibe el email en 5 minutos, verifique su carpeta de spam o contacte a IT.

---

## 3.3 Cerrar Sesión

### Desde el Panel Web

1. Haga clic en su **avatar** en la esquina superior derecha
2. Seleccione **Cerrar Sesión**
3. Confirme la acción si se le solicita

### Desde la App Móvil

1. Toque el ícono de **Menú** (☰)
2. Deslice hasta el final
3. Toque **Cerrar Sesión**
4. Confirme

⚠️ **Importante:** Siempre cierre sesión al usar equipos compartidos.

---

## 3.4 Gestión de Perfil

### Acceso

**Panel Web:** Avatar ➔ Mi Perfil  
**App Móvil:** Menú ➔ Mi Perfil

### Información Editable

| Campo | Editable | Notas |
|-------|----------|-------|
| Nombre completo | ✅ | Visible en el sistema |
| Email | ❌ | Contacte a Admin para cambios |
| Teléfono | ✅ | Para notificaciones SMS |
| Foto de perfil | ✅ | JPG/PNG, máx. 2MB |
| Idioma | ✅ | Español, Inglés |
| Zona horaria | ✅ | Afecta fechas mostradas |

### Cambiar Contraseña

1. En Mi Perfil, haga clic en **Cambiar Contraseña**
2. Ingrese su contraseña actual
3. Ingrese la nueva contraseña
4. Confirme la nueva contraseña
5. Haga clic en **Actualizar**

**Requisitos de contraseña:**
- Mínimo 8 caracteres
- Al menos 1 mayúscula
- Al menos 1 minúscula
- Al menos 1 número
- No puede ser igual a las últimas 5 contraseñas

---

# SECCIÓN 4: MÓDULO DE PRODUCCIÓN

## 4.1 Dashboard de Producción

### Descripción

El Dashboard de Producción ofrece una vista general del estado de la planta en tiempo real.

### Acceso

**Panel Web:** Sidebar ➔ Producción ➔ Dashboard  
**App Móvil:** Tab Producción ➔ Resumen

### Componentes del Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard de Producción                           [↻ Actualizar]│
├───────────────┬───────────────┬───────────────┬─────────────────┤
│  OEE Global   │  Órdenes Hoy  │ Tasa Rechazo  │ Alertas Activas │
│     87%       │     24/30     │     1.2%      │       3         │
│    ↑ 2%       │   80% completado │  ✅ OK     │    ⚠️          │
├───────────────┴───────────────┴───────────────┴─────────────────┤
│                                                                 │
│  [Gráfico de Producción por Hora]                              │
│  ████████████████████░░░░                                       │
│  08:00  10:00  12:00  14:00  16:00  18:00                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Órdenes en Progreso                                             │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│ OP-2026-0142 │ Defensa DX5  │ SOLDADURA    │ 75% ████████░░   │
│ OP-2026-0143 │ Defensa LX3  │ PINTURA      │ 50% █████░░░░░   │
│ OP-2026-0144 │ Protector MT │ CORTE        │ 25% ███░░░░░░░   │
└──────────────┴──────────────┴──────────────┴───────────────────┘
```

### Métricas Explicadas

| Métrica | Descripción | Rango Óptimo |
|---------|-------------|--------------|
| **OEE Global** | Eficiencia general de equipos | > 85% |
| **Órdenes Hoy** | Órdenes completadas vs programadas | > 80% |
| **Tasa Rechazo** | Porcentaje de piezas defectuosas | < 2% |
| **Alertas Activas** | Notificaciones pendientes | 0 |

### Acciones Disponibles

| Acción | Cómo | Descripción |
|--------|------|-------------|
| Actualizar datos | Clic en [↻ Actualizar] | Refresca métricas en tiempo real |
| Ver detalles de orden | Clic en fila de orden | Abre detalle de la orden |
| Filtrar por fecha | Selector de fecha superior | Cambia período visualizado |
| Exportar reporte | Botón [📥 Exportar] | Genera PDF/Excel |

---

## 4.2 Órdenes de Producción

### 4.2.1 Listar Órdenes

**Acceso:** Sidebar ➔ Producción ➔ Órdenes

```
┌─────────────────────────────────────────────────────────────────┐
│ Órdenes de Producción                      [+ Nueva Orden]      │
├─────────────────────────────────────────────────────────────────┤
│ Filtros: [Estado ▼] [Fecha ▼] [Prioridad ▼] [🔍 Buscar...]      │
├──────────────┬──────────────┬──────────┬──────────┬─────────────┤
│ # Orden      │ Producto     │ Estado   │ Prioridad│ Fecha Prog. │
├──────────────┼──────────────┼──────────┼──────────┼─────────────┤
│ OP-2026-0142 │ Defensa DX5  │ 🟢 Prog. │ 🔴 Alta  │ 15/01/2026  │
│ OP-2026-0143 │ Defensa LX3  │ 🟡 Espera│ 🟡 Media │ 16/01/2026  │
│ OP-2026-0144 │ Protector MT │ 🔵 Nueva │ 🟢 Baja  │ 17/01/2026  │
└──────────────┴──────────────┴──────────┴──────────┴─────────────┘
│ Mostrando 1-10 de 142 órdenes           [< 1 2 3 ... 15 >]      │
└─────────────────────────────────────────────────────────────────┘
```

### Estados de Orden

| Estado | Ícono | Descripción | Acciones Permitidas |
|--------|-------|-------------|---------------------|
| Programada | 🔵 | Orden creada, esperando inicio | Editar, Cancelar, Iniciar |
| En Progreso | 🟢 | Fabricación activa | Ver detalles, Pausar |
| En Espera | 🟡 | Pausada por problema | Reanudar, Cancelar |
| Completada | ✅ | Finalizada exitosamente | Ver detalles, Archivar |
| Cancelada | ❌ | Orden cancelada | Ver historial |

### 4.2.2 Crear Nueva Orden

**Roles:** Admin, Manager

1. Haga clic en **[+ Nueva Orden]**
2. Complete el formulario:

| Campo | Descripción | Obligatorio |
|-------|-------------|-------------|
| Producto | Seleccione del catálogo | ✅ |
| Cantidad | Unidades a producir | ✅ |
| Fecha Programada | Fecha de inicio (mínimo mañana) | ✅ |
| Prioridad | Alta, Media, Baja | ✅ |
| Notas | Instrucciones especiales | ❌ |
| Orden de Cliente | Vincular pedido (si aplica) | ❌ |

3. Haga clic en **Crear Orden**
4. El sistema verificará disponibilidad de materiales
5. Si hay materiales insuficientes, verá una alerta con opciones

⚠️ **Validaciones automáticas:**
- Capacidad de planta para la fecha
- Stock de materias primas (mínimo 80%)
- No hay conflictos de programación

### 4.2.3 Ver Detalle de Orden

Haga clic en cualquier orden para ver:

```
┌─────────────────────────────────────────────────────────────────┐
│ Orden OP-2026-0142                           [Editar] [Cancelar]│
├─────────────────────────────────────────────────────────────────┤
│ Producto: Defensa DX5 Premium                                   │
│ Cantidad: 50 unidades                                           │
│ Estado: 🟢 En Progreso                                          │
│ Prioridad: 🔴 Alta                                              │
│ Fecha Programada: 15/01/2026                                    │
│ Creada por: Juan Pérez                                          │
├─────────────────────────────────────────────────────────────────┤
│ PROGRESO DE ETAPAS                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ CORTE ────→ ✅ SOLDADURA ────→ 🔄 PINTURA ────→ ⬜ ENSAMBLE  │
│  Completado     Completado       En Progreso      Pendiente     │
│  08:00-09:30    09:45-11:15      11:30-...                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ HISTORIAL DE EVENTOS                                            │
├──────────────────────┬──────────────────────────────────────────┤
│ 14/01/2026 08:00    │ Orden creada por Juan Pérez              │
│ 15/01/2026 08:00    │ Etapa CORTE iniciada por Carlos Rojas    │
│ 15/01/2026 09:30    │ Etapa CORTE completada                   │
│ 15/01/2026 09:45    │ Etapa SOLDADURA iniciada                 │
│ 15/01/2026 11:15    │ Etapa SOLDADURA completada               │
│ 15/01/2026 11:30    │ Etapa PINTURA iniciada                   │
└──────────────────────┴──────────────────────────────────────────┘
```

---

## 4.3 Etapas de Fabricación

### 4.3.1 Actualizar Etapa (Operarios)

**Acceso App Móvil:** Tab Producción ➔ Mis Tareas

1. Localice la tarea asignada a usted
2. Toque para abrir detalles
3. Revise las instrucciones específicas
4. Cuando inicie el trabajo, toque **Iniciar Etapa**
5. El cronómetro comienza automáticamente
6. Al finalizar, toque **Completar Etapa**
7. Ingrese observaciones si es necesario
8. Confirme la acción

⚠️ **Importante:** No cierre la app durante el trabajo. El progreso se guarda localmente.

### 4.3.2 Reportar Problema en Etapa

Si encuentra un problema durante la fabricación:

1. Toque **Reportar Problema**
2. Seleccione el tipo:
   - Material defectuoso
   - Falla de maquinaria
   - Falta de material
   - Error en especificaciones
   - Otro
3. Tome foto(s) si es posible
4. Agregue descripción
5. Toque **Enviar Reporte**

El sistema notificará automáticamente al supervisor y pondrá la etapa en espera.

---

## 4.4 Reportes de Producción

### Reportes Disponibles

| Reporte | Descripción | Periodicidad |
|---------|-------------|--------------|
| Producción Diaria | Órdenes del día, métricas | Diario |
| Eficiencia Semanal | OEE por máquina y operario | Semanal |
| Análisis de Rechazos | Causas y tendencias | Semanal |
| Cumplimiento de Programación | Real vs Planificado | Mensual |

### Generar Reporte

1. Navegue a Producción ➔ Reportes
2. Seleccione el tipo de reporte
3. Configure el período (fechas)
4. Seleccione formato: PDF o Excel
5. Haga clic en **Generar**
6. Descargue o envíe por email

---

# SECCIÓN 5: MÓDULO DE INVENTARIO

## 5.1 Consulta de Stock

### Acceso

**Panel Web:** Sidebar ➔ Inventario ➔ Stock  
**App Móvil:** Tab Inventario ➔ Consultar

### Vista de Stock

```
┌─────────────────────────────────────────────────────────────────┐
│ Inventario de Stock                              [+ Movimiento] │
├─────────────────────────────────────────────────────────────────┤
│ [🔍 Buscar producto...] [Categoría ▼] [Estado ▼] [Almacén ▼]   │
├──────────────┬──────────┬──────────┬──────────┬─────────────────┤
│ SKU          │ Producto │ Stock    │ Mínimo   │ Estado          │
├──────────────┼──────────┼──────────┼──────────┼─────────────────┤
│ MP-ACERO-01  │ Lámina 2mm │ 150    │ 50       │ ✅ OK           │
│ MP-PINTURA-R │ Pintura Roja│ 25    │ 30       │ ⚠️ Bajo        │
│ MP-TORNILLO  │ Tornillo M8│ 0      │ 100      │ ❌ Agotado     │
│ PT-DEF-DX5   │ Defensa DX5│ 12     │ 10       │ ✅ OK           │
└──────────────┴──────────┴──────────┴──────────┴─────────────────┘
```

### Estados de Stock

| Estado | Ícono | Condición | Acción Sugerida |
|--------|-------|-----------|-----------------|
| OK | ✅ | Stock > Mínimo × 1.5 | Ninguna |
| Bajo | ⚠️ | Mínimo < Stock ≤ Mínimo × 1.5 | Programar reorden |
| Crítico | 🔴 | 0 < Stock ≤ Mínimo | Reordenar urgente |
| Agotado | ❌ | Stock = 0 | Reordenar inmediato |

---

## 5.2 Movimientos de Inventario

### Tipos de Movimiento

| Tipo | Descripción | Roles Autorizados |
|------|-------------|-------------------|
| **Entrada** | Recepción de materiales | Admin, Manager, Operator |
| **Salida** | Consumo en producción | Sistema (automático) |
| **Ajuste** | Corrección por inventario físico | Admin, Manager |
| **Transferencia** | Entre almacenes | Admin, Manager, Operator |

### Registrar Entrada de Material

1. Haga clic en **[+ Movimiento]**
2. Seleccione tipo: **Entrada**
3. Escanee o ingrese el SKU del producto
4. Ingrese la cantidad recibida
5. Ingrese número de factura/guía (opcional)
6. Agregue notas si es necesario
7. Haga clic en **Registrar**

✅ El stock se actualiza inmediatamente.

### Registrar Ajuste de Inventario

⚠️ Los ajustes requieren justificación y quedan registrados en auditoría.

1. Busque el producto a ajustar
2. Haga clic en **Ajustar**
3. Ingrese el stock real (conteo físico)
4. El sistema calcula la diferencia
5. Seleccione motivo del ajuste:
   - Inventario físico
   - Corrección de error
   - Pérdida/daño
   - Otro (especificar)
6. Ingrese justificación detallada
7. Haga clic en **Confirmar Ajuste**

---

## 5.3 Alertas de Stock

### Configuración de Alertas

Cada producto tiene un **stock mínimo** configurado. Cuando el stock cae por debajo, se disparan alertas automáticas.

### Recepción de Alertas

| Canal | Destinatario | Tipo de Alerta |
|-------|--------------|----------------|
| Email | Gerente de Compras | Stock Crítico, Agotado |
| Push (App) | Operarios de Almacén | Stock Bajo |
| Dashboard | Todos | Indicador visual |
| SMS | Gerente (si está configurado) | Agotado |

### Gestionar Alertas

1. Navegue a Inventario ➔ Alertas
2. Vea lista de alertas activas
3. Para cada alerta puede:
   - **Generar Orden de Compra** (si tiene permisos)
   - **Marcar como Vista** (acknowledge)
   - **Posponer** (recordar en X tiempo)

---

# SECCIÓN 6: MÓDULO DE CALIDAD

## 6.1 Inspecciones

### Tipos de Inspección

| Tipo | Momento | Responsable |
|------|---------|-------------|
| **Recepción** | Al recibir materiales | Supervisor |
| **En Proceso** | Durante fabricación | Operario/Supervisor |
| **Final** | Producto terminado | Supervisor |

### Registrar Inspección

1. Navegue a Calidad ➔ Nueva Inspección
2. Seleccione la orden de producción
3. Seleccione el tipo de inspección
4. Complete el checklist según el producto:

```
┌─────────────────────────────────────────────────────────────────┐
│ Inspección de Calidad - OP-2026-0142                            │
├─────────────────────────────────────────────────────────────────┤
│ Producto: Defensa DX5 Premium                                   │
│ Etapa: Pintura                                                  │
│ Inspector: María González                                       │
├─────────────────────────────────────────────────────────────────┤
│ CHECKLIST DE CALIDAD                                            │
├─────────────────────────────────────────────────────────────────┤
│ ☑ Acabado superficial sin rayas                                │
│ ☑ Color uniforme sin manchas                                   │
│ ☐ Espesor de pintura en rango (medición requerida)             │
│ ☑ Sin burbujas ni descascaramiento                             │
│ ☐ Adherencia OK (prueba de cuadrícula)                         │
├─────────────────────────────────────────────────────────────────┤
│ Mediciones:                                                     │
│ Espesor capa 1: [___] μm (Rango: 40-60)                        │
│ Espesor capa 2: [___] μm (Rango: 40-60)                        │
├─────────────────────────────────────────────────────────────────┤
│ Resultado: [Aprobado ▼]                                         │
│ Observaciones: [________________________________]               │
│                                                                 │
│                    [Guardar Inspección]                         │
└─────────────────────────────────────────────────────────────────┘
```

4. Marque cada ítem del checklist
5. Ingrese mediciones cuando se requieran
6. Seleccione resultado: **Aprobado** o **Rechazado**
7. Si rechaza, complete el formulario de defecto
8. Haga clic en **Guardar Inspección**

---

## 6.2 Registro de Defectos

Cuando una inspección resulta en rechazo:

### Información Requerida

| Campo | Descripción |
|-------|-------------|
| Tipo de Defecto | Categoría predefinida |
| Severidad | Crítico, Mayor, Menor |
| Cantidad Afectada | Unidades defectuosas |
| Causa Raíz | Análisis inicial |
| Evidencia | Fotos del defecto |
| Acción Correctiva | Próximos pasos |

### Flujo de Defecto

```
Detectado → Registrado → Analizado → Corregido → Verificado → Cerrado
```

---

## 6.3 Métricas de Calidad

### KPIs Disponibles

| Métrica | Fórmula | Objetivo |
|---------|---------|----------|
| Tasa de Rechazo | (Rechazados / Total) × 100 | < 2% |
| First Pass Yield | (Aprobados 1era vez / Total) × 100 | > 95% |
| Defectos por Unidad | Total Defectos / Unidades | < 0.1 |
| MTTR (Calidad) | Tiempo promedio resolución defecto | < 24h |

---

# SECCIÓN 7: MÓDULO DE MAQUINARIA

## 7.1 Estado de Máquinas

### Vista de Estado

```
┌─────────────────────────────────────────────────────────────────┐
│ Estado de Maquinaria                             [Ver Historial]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ 🟢 ACTIVA   │  │ 🟡 ADVERTENCIA│ │ 🔴 ERROR   │             │
│  │ CNC Cutter  │  │ Welding Bot │  │ Paint Booth │             │
│  │ A1          │  │ B2          │  │ C1          │             │
│  │ OEE: 92%    │  │ OEE: 78%    │  │ OEE: 0%     │             │
│  │ Temp: 45°C  │  │ Temp: 82°C  │  │ OFFLINE     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Estados de Máquina

| Estado | Significado | Acción |
|--------|-------------|--------|
| 🟢 **Activa** | Operando normalmente | Ninguna |
| 🟡 **Advertencia** | Parámetros fuera de rango óptimo | Revisar pronto |
| 🔴 **Error** | Falla detectada o detenida | Acción inmediata |
| ⚫ **Offline** | Sin conexión/datos | Verificar conectividad |

---

## 7.2 Métricas OEE

### Componentes del OEE

```
OEE = Disponibilidad × Rendimiento × Calidad

Donde:
- Disponibilidad = Tiempo Operativo / Tiempo Planificado
- Rendimiento = Producción Real / Producción Teórica
- Calidad = Unidades Buenas / Total Producido
```

### Interpretación

| OEE | Clasificación | Acción |
|-----|---------------|--------|
| > 85% | Clase Mundial | Mantener |
| 65-85% | Típico | Mejorar |
| < 65% | Bajo rendimiento | Analizar causas |

---

## 7.3 Alertas de Mantenimiento

### Tipos de Alerta

| Tipo | Trigger | Prioridad |
|------|---------|-----------|
| **Preventivo** | Horas de uso alcanzadas | Media |
| **Predictivo** | Anomalía en métricas | Alta |
| **Correctivo** | Falla detectada | Crítica |

---

# SECCIÓN 8: MÓDULO E-COMMERCE (CLIENTES)

## 8.1 Navegación del Catálogo

### Página Principal

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔍 Buscar productos...                     [🛒 Carrito (3)]    │
├─────────────────────────────────────────────────────────────────┤
│ CATEGORÍAS: [Defensas] [Protectores] [Accesorios] [Ofertas]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ [Imagen 3D] │  │ [Imagen 3D] │  │ [Imagen 3D] │             │
│  │             │  │             │  │             │             │
│  │ Defensa DX5 │  │ Defensa LX3 │  │ Protector MT│             │
│  │ $89.990     │  │ $75.990     │  │ $45.990     │             │
│  │ ★★★★☆ (42) │  │ ★★★★★ (128)│  │ ★★★★☆ (67) │             │
│  │[Agregar 🛒] │  │[Agregar 🛒] │  │[Agregar 🛒] │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Visor 3D de Producto

1. Haga clic en cualquier producto
2. Use el visor 3D interactivo:
   - **Rotar:** Arrastre con el mouse
   - **Zoom:** Rueda del mouse o pellizco
   - **Colores:** Haga clic en las opciones de color
3. Vea especificaciones técnicas
4. Lea reseñas de otros clientes

---

## 8.2 Carrito de Compras

### Agregar al Carrito

1. En la página del producto, seleccione:
   - Color/Acabado
   - Cantidad
2. Haga clic en **Agregar al Carrito**
3. Verá confirmación con opciones:
   - **Seguir Comprando**
   - **Ir al Carrito**

### Gestionar Carrito

```
┌─────────────────────────────────────────────────────────────────┐
│ Mi Carrito (3 productos)                                        │
├─────────────────────────────────────────────────────────────────┤
│ Producto              │ Cantidad │ Precio    │ Subtotal         │
├───────────────────────┼──────────┼───────────┼──────────────────┤
│ Defensa DX5 (Negro)   │ [1] [-][+]│ $89.990  │ $89.990          │
│ Defensa LX3 (Rojo)    │ [2] [-][+]│ $75.990  │ $151.980         │
│ Kit Instalación       │ [1] [-][+]│ $15.990  │ $15.990          │
├───────────────────────┴──────────┴───────────┼──────────────────┤
│                                   Subtotal   │ $257.960         │
│                                   Envío      │ $9.990           │
│                                   IVA (19%)  │ Incluido         │
│                                   ──────────────────────────────│
│                                   TOTAL      │ $267.950         │
├─────────────────────────────────────────────┴──────────────────┤
│ [Vaciar Carrito]                    [Proceder al Checkout →]   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8.3 Proceso de Checkout

### Paso 1: Información de Envío

1. Ingrese o seleccione dirección de envío
2. Seleccione método de envío:
   - Estándar (3-5 días) - $9.990
   - Express (1-2 días) - $15.990
   - Retiro en tienda - Gratis

### Paso 2: Método de Pago

Opciones disponibles:
- Tarjeta de crédito/débito (Visa, Mastercard, Amex)
- PayPal
- Transferencia bancaria (procesamiento manual)

### Paso 3: Confirmación

1. Revise el resumen del pedido
2. Acepte términos y condiciones
3. Haga clic en **Confirmar Compra**
4. Recibirá confirmación por email

✅ Número de orden: OC-2026-XXXX

---

## 8.4 Historial de Pedidos

### Ver Mis Pedidos

1. Inicie sesión en su cuenta
2. Navegue a **Mi Cuenta** ➔ **Mis Pedidos**

### Estados de Pedido

| Estado | Significado |
|--------|-------------|
| 🔵 Pendiente | Esperando confirmación de pago |
| ✅ Pagado | Pago confirmado, preparando |
| 📦 Enviado | En camino (con tracking) |
| ✅ Entregado | Recibido por el cliente |
| ❌ Cancelado | Pedido cancelado |

---

# SECCIÓN 9: MONITOR DE TALLER

## 9.1 Propósito

La aplicación Monitor de Taller está diseñada para ejecutarse en pantallas grandes (TVs) ubicadas en el piso de producción, proporcionando visibilidad en tiempo real de los KPIs críticos.

## 9.2 Visualización de KPIs

```
┌─────────────────────────────────────────────────────────────────┐
│ XSafe Factory Monitor                              14:35:42     │
│ Línea de Producción: Defensas Moto                🟢 EN LINEA  │
├───────────────┬───────────────┬───────────────┬─────────────────┤
│   OEE GLOBAL  │   PRODUCCIÓN  │ TASA RECHAZO  │ OBJETIVO DÍA   │
│     87%       │   142 / 180   │     0.8%      │   ████████░░   │
│    ↑ 2%       │    79%        │   ✅ OK       │     79%        │
├───────────────┴───────────────┴───────────────┴─────────────────┤
│ [GRÁFICO DE BARRAS - RENDIMIENTO POR HORA]                      │
├─────────────────────────────────────────────────────────────────┤
│ ESTADO DE MAQUINARIA                                            │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│ │ 🟢 CNC A1  │ │ 🟡 Weld B2 │ │ 🟢 Paint C1│ │ 🔴 Assy D1 │    │
│ │ 65°C | 92% │ │ 82°C | 78% │ │ 45°C | 88% │ │ DETENIDA   │    │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│ ⚠️ ALERTA: Assembly Line D1 detenida - Fallo sensor proximidad │
│    Reportado hace 12 minutos                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

# SECCIÓN 10: ADMINISTRACIÓN

## 10.1 Gestión de Usuarios

**Acceso:** Solo rol ADMIN

### Crear Usuario

1. Navegue a Configuración ➔ Usuarios ➔ Nuevo Usuario
2. Complete:
   - Email corporativo
   - Nombre completo
   - Rol (Admin, Manager, Operator, Supervisor)
   - Departamento
3. Haga clic en **Crear Usuario**
4. El sistema enviará email con credenciales temporales

### Desactivar Usuario

1. Busque el usuario en la lista
2. Haga clic en el menú de acciones (⋮)
3. Seleccione **Desactivar**
4. Confirme la acción

⚠️ Los usuarios desactivados no pueden iniciar sesión pero sus datos se preservan.

---

## 10.2 Configuración del Sistema

### Parámetros Configurables

| Parámetro | Descripción | Valor por Defecto |
|-----------|-------------|-------------------|
| Sesión Timeout | Tiempo de inactividad para cierre | 15 minutos |
| Intentos de Login | Máximo antes de bloqueo | 5 intentos |
| Tiempo de Bloqueo | Duración del bloqueo | 15 minutos |
| Zona Horaria | Para fechas y horarios | America/Santiago |
| Moneda | Para precios | CLP |

---

## 10.3 Logs de Auditoría

### Eventos Registrados

- Inicios de sesión (exitosos y fallidos)
- Creación/modificación de registros
- Cambios de configuración
- Exportaciones de datos
- Accesos a información sensible

### Consultar Logs

1. Navegue a Configuración ➔ Auditoría
2. Use filtros: fecha, usuario, tipo de evento
3. Los logs no pueden ser modificados ni eliminados

---

# SECCIÓN 11: RESOLUCIÓN DE PROBLEMAS

## 11.1 Problemas Comunes

### No puedo iniciar sesión

| Síntoma | Causa Probable | Solución |
|---------|----------------|----------|
| "Credenciales inválidas" | Contraseña incorrecta | Verificar CAPS LOCK, reintentar |
| "Cuenta bloqueada" | Demasiados intentos | Esperar 15 min o contactar Admin |
| Página no carga | Problema de red | Verificar conexión, limpiar caché |
| "Sesión expirada" | Inactividad | Iniciar sesión nuevamente |

### La app móvil no sincroniza

1. Verificar conexión a internet
2. Forzar sincronización: Menú ➔ Configuración ➔ Sincronizar Ahora
3. Si persiste, cerrar sesión y volver a iniciar

### El dashboard no muestra datos actualizados

1. Hacer clic en botón Actualizar (↻)
2. Verificar que el filtro de fecha es correcto
3. Limpiar caché del navegador (Ctrl+Shift+R)

---

## 11.2 Mensajes de Error

| Código | Mensaje | Significado | Acción |
|--------|---------|-------------|--------|
| 401 | No autorizado | Sesión expirada o sin permisos | Iniciar sesión |
| 403 | Acceso denegado | Su rol no tiene acceso | Contactar Admin |
| 404 | No encontrado | Recurso no existe | Verificar URL |
| 500 | Error interno | Problema del servidor | Reintentar, reportar si persiste |
| 503 | Servicio no disponible | Mantenimiento | Esperar e intentar más tarde |

---

## 11.3 Contacto de Soporte

### Canales de Soporte

| Canal | Horario | Tiempo de Respuesta |
|-------|---------|---------------------|
| Email: soporte@xsafe.com | 24/7 | < 4 horas |
| Teléfono: +56 2 2XXX XXXX | Lun-Vie 9-18h | Inmediato |
| Chat en sistema | Lun-Vie 9-18h | < 5 minutos |

### Al Reportar un Problema

Incluya:
1. Su nombre y email
2. Descripción detallada del problema
3. Pasos para reproducirlo
4. Capturas de pantalla si es posible
5. Navegador/dispositivo que usa

---

# ANEXOS

## Anexo A: Atajos de Teclado

| Atajo | Acción | Disponible en |
|-------|--------|---------------|
| `Ctrl + K` | Búsqueda rápida | Panel Web |
| `Ctrl + N` | Nueva orden | Producción |
| `Ctrl + S` | Guardar | Todos los formularios |
| `Esc` | Cerrar modal | Panel Web |
| `F5` | Actualizar datos | Dashboard |

## Anexo B: Glosario Rápido

Ver documento completo: `/documents/09-glosario-terminos.md`

## Anexo C: Preguntas Frecuentes

### ¿Puedo usar el sistema desde mi celular personal?
Sí, la app móvil está disponible para Android e iOS. Requiere autorización de su administrador.

### ¿Qué pasa si la conexión se pierde mientras trabajo?
Las apps móvil y desktop guardan datos localmente. Se sincronizarán automáticamente cuando se restablezca la conexión.

### ¿Cómo solicito un nuevo rol o permisos?
Contacte a su supervisor inmediato o al administrador del sistema.

### ¿Cada cuánto se actualizan los datos del dashboard?
El dashboard se actualiza automáticamente cada 30 segundos. Puede forzar actualización con el botón ↻.

---

*Fin del Manual de Usuario*  
*Versión 1.0.0 - Enero 2026*  
*© XSafe ERP - Todos los derechos reservados*
