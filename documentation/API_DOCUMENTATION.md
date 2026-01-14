# 🔌 REST API Documentation

This document describes the REST API resources available in the XSafe ERP platform.

**Base URL**: `https://api.xsafe-erp.com/v1`
**Version**: `1.0.0`
**Spec Format**: OpenAPI 3.0

## Authentication
All API requests must include a Bearer Token in the header.

```http
Authorization: Bearer <your_jwt_token>
```

---

## 🏭 Production Endpoints

### 1. Get Production Orders
Retrieve a list of production orders with optional filtering.

*   **URL**: `/production/orders`
*   **Method**: `GET`
*   **Query Params**:
    *   `status` (optional): `PENDING`, `IN_PROGRESS`, `COMPLETED`
    *   `limit` (optional): `number` (default 20)
    *   `offset` (optional): `number` (default 0)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "ord_12345",
      "order_number": "ORD-001",
      "status": "IN_PROGRESS",
      "customer_name": "John Doe",
      "created_at": "2024-03-15T10:00:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1
  }
}
```

### 2. Create Order
Create a new production order.

*   **URL**: `/production/orders`
*   **Method**: `POST`
*   **Body**:
```json
{
  "customer_name": "Jane Smith",
  "motorcycle_model": "Yamaha R1",
  "product_type": "Crash Cage Pro",
  "priority": "HIGH",
  "due_date": "2024-04-01"
}
```

---

## 📦 Inventory Endpoints

### 1. Get Inventory Items
List all inventory stock levels.

*   **URL**: `/inventory`
*   **Method**: `GET`
*   **Query Params**:
    *   `low_stock`: `boolean` (true to filter items below min quantity)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "inv_987",
      "sku": "STEEL-PIPE-20MM",
      "name": "Steel Pipe 20mm",
      "quantity": 150.5,
      "unit": "m",
      "min_quantity": 200.0
    }
  ]
}
```

### 2. Record Movement
Record an inbound or outbound inventory movement.

*   **URL**: `/inventory/movements`
*   **Method**: `POST`
*   **Body**:
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

## 🔐 Auth Endpoints

### 1. Login
Authenticate a user and retrieve a JWT.

*   **URL**: `/auth/login`
*   **Method**: `POST`
*   **Body**:
```json
{
  "email": "admin@xsafe.com",
  "password": "secure_password"
}
```

**Response (200 OK):**
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

## Error Codes
| Code | Meaning | Description |
| :--- | :--- | :--- |
| `400` | Bad Request | Invalid input data |
| `401` | Unauthorized | Missing or invalid token |
| `403` | Forbidden | User lacks permissions |
| `404` | Not Found | Resource does not exist |
| `500` | Server Error | Internal system failure |
