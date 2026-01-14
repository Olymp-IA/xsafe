# 🔒 Security Policy

XSafe ERP places the highest priority on data security and user privacy. This document details our security model and compliance standards.

## 🛡️ Security Model

### Authentication & Authorization
*   **Identity API**: Centralized auth service using OAuth2 and OpenID Connect.
*   **JWT**: Stateless session management with short-lived access tokens (15m) and secure refresh tokens (7d).
*   **RBAC**: Role-Based Access Control enforcing granular permissions (e.g., `READ_INVENTORY`, `WRITE_PRODUCTION`).

### Data Protection
*   **Encryption at Rest**: AES-256 encryption for database volumes and S3 buckets.
*   **Encryption in Transit**: TLS 1.3 enforced for all API traffic.
*   **Sensitive Data**: PII (Personally Identifiable Information) and passwords are hashed using Argon2id.

## ✅ Compliance

### OWASP Top 10
We actively mitigate standard web vulnerabilities:
*   **Injection**: Strictly using ORMs (Prisma) to prevent SQLi.
*   **XSS**: React automatically escapes content; Content Security Policy (CSP) headers enabled.
*   **CSRF**: SameSite cookie policies enforced.

### GDPR (General Data Protection Regulation)
*   **Right to Erase**: Automated endpoints to anonymize user data upon request.
*   **Data Portability**: Users can export their data in JSON format.
*   **Consent**: Strict opt-in for marketing communications.

## 🚨 Incident Response
In the event of a security breach:
1.  **Identify**: Security Team confirms the breach.
2.  **Contain**: Isolate affected systems (potentially pausing traffic).
3.  **Eradicate**: Patch vulnerability and remove malicious artifacts.
4.  **Recover**: Restore from clean backups.
5.  **Notify**: Inform affected users within 72 hours (as per GDPR).

## 🐛 Vulnerability Reporting
Please report potential security issues to `security@xsafe.com`. We offer a bug bounty program for critical disclosures.
