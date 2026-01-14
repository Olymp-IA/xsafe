# Documentación API REST

Este documento describe los recursos de la API REST disponibles en la plataforma XSafe ERP.

**URL Base**: `https://api.xsafe-erp.com/v1`
**Versión**: `1.0.0`
**Formato de Especificación**: OpenAPI 3.0

## Autenticación
Todas las solicitudes a la API deben incluir un Token Bearer en el encabezado.

```http
Authorization: Bearer <tu_token_jwt>
```

---

## Endpoints de Producción

### 1. Obtener Órdenes de Producción
Recupera una lista de órdenes de producción con filtrado opcional.

*   **URL**: `/production/orders`
*   **Método**: `GET`
*   **Parámetros de Consulta**:
    *   `status` (opcional): `PENDING`, `IN_PROGRESS`, `COMPLETED`
    *   `limit` (opcional): `number` (predeterminado 20)
    *   `offset` (opcional): `number` (predeterminado 0)

**Respuesta (200 OK):**
```json
{
  "data": [
    {
      "id": "ord_12345",
      "order_number": "ORD-001",
      "status": "IN_PROGRESS",
      "customer_name": "Juan Perez",
      "created_at": "2024-03-15T10:00:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1
  }
}
```

### 2. Crear Orden
Crea una nueva orden de producción.

*   **URL**: `/production/orders`
*   **Método**: `POST`
*   **Cuerpo**:
```json
{
  "customer_name": "Maria Lopez",
  "motorcycle_model": "Yamaha R1",
  "product_type": "Crash Cage Pro",
  "priority": "HIGH",
  "due_date": "2024-04-01"
}
```

---

## Endpoints de Inventario

### 1. Obtener Items de Inventario
Lista todos los niveles de stock del inventario.

*   **URL**: `/inventory`
*   **Método**: `GET`
*   **Parámetros de Consulta**:
    *   `low_stock`: `boolean` (true para filtrar items bajo cantidad mínima)

**Respuesta (200 OK):**
```json
{
  "data": [
    {
      "id": "inv_987",
      "sku": "TUBO-ACERO-20MM",
      "name": "Tubo de Acero 20mm",
      "quantity": 150.5,
      "unit": "m",
      "min_quantity": 200.0
    }
  ]
}
```

### 2. Registrar Movimiento
Registra un movimiento de entrada o salida de inventario.

*   **URL**: `/inventory/movements`
*   **Método**: `POST`
*   **Cuerpo**:
```json
{
  "item_id": "inv_987",
  "type": "OUTBOUND",
  "quantity": 50.0,
  "reason": "PRODUCTION_USE",
  "reference_id": "ord_12345"
}
```

---

## Endpoints de Autenticación

### 1. Iniciar Sesión
Autentica a un usuario y recupera un JWT.

*   **URL**: `/auth/login`
*   **Método**: `POST`
*   **Cuerpo**:
```json
{
  "email": "admin@xsafe.com",
  "password": "password_seguro"
}
```

**Respuesta (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1Ni...",
  "expires_in": 3600,
  "user": {
    "id": "usr_1",
    "role": "ADMIN"
  }
}
```

---

## Códigos de Error
| Código | Significado | Descripción |
| :--- | :--- | :--- |
| `400` | Petición Incorrecta | Datos de entrada inválidos |
| `401` | No Autorizado | Token faltante o inválido |
| `403` | Prohibido | El usuario carece de permisos |
| `404` | No Encontrado | El recurso no existe |
| `500` | Error del Servidor | Fallo interno del sistema |
