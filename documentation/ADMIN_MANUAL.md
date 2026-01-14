# 👮 Admin Manual

This guide is for System Administrators responsible for managing the XSafe ERP platform configuration, users, and security.

## 👤 User Management

### Creating Users
1.  Log in to the **Admin Console** at `https://admin.xsafe-erp.com`.
2.  Navigate to **Users > Add New**.
3.  Enter details:
    *   **Email**: Corporate email required.
    *   **Role**:
        *   `OPERATOR`: Production floor access (Mobile App).
        *   `MANAGER`: Dashboard and Reports access.
        *   `ADMIN`: Full system access.
4.  User will receive an invite email to set their password.

### Revoking Access
1.  Find the user in the **Users** list.
2.  Click **"Deactivate"**.
3.  *Note*: This immediately revokes API access and logs out all active sessions.

## ⚙️ System Configuration

### Feature Flags
We use feature flags to safely roll out new capabilities.
*   `ENABLE_3D_CUSTOMIZER`: Toggle the 3D viewer on the store.
*   `MAINTENANCE_MODE`: Enable to block all non-admin traffic.

### Inventory Rules
Configure strictness of inventory checks:
*   **Strict Mode**: Prevents production if stock is insufficient.
*   **Soft Mode**: Allows negative stock with a warning (useful for high-speed manufacturing).

## 🛡️ Audit Logs
All sensitive actions are logged.
To view logs:
1.  Go to **Settings > Audit Logs**.
2.  Filter by `User`, `Action`, or `Date`.
3.  Export logs to CSV for compliance reviews.

## ⚠️ Troubleshooting

**"Sync Conflict" Errors**
If the mobile app reports sync issues:
1.  Check the **Sync Queue** properties in the Admin Console.
2.  Identify the conflicting Record ID.
3.  Choose **"Force Server Version"** or **"Accept Client Version"**.

**Database Locks**
If the system feels slow:
1.  Check **DB Monitor**.
2.  Kill any long-running transactions > 60s.
