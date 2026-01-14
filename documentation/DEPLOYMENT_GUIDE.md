# 🚀 Deployment Guide

This document outlines the infrastructure and procedures for deploying XSafe ERP to production environments.

## 🌍 Infrastructure Overview
Our production infrastructure is hosted on AWS (Amazon Web Services) utilizing a containerized microservices architecture.

*   **Compute**: AWS ECS (Fargate) for Docker containers.
*   **Database**: AWS RDS (PostgreSQL).
*   **Cache**: AWS ElastiCache (Redis).
*   **Storage**: AWS S3 (Images, 3D Assets).
*   **CDN**: CloudFront.
*   **Domain**: Route53.

## ⚙️ CI/CD Pipeline
We use GitHub Actions for continuous integration and delivery.

### Workflow
1.  **Push to `main`**: Triggers `ci.yml`.
2.  **Test**: Runs Unit & Integration tests.
3.  **Build**: Builds Docker images for API and Frontend.
4.  **Push Registry**: Pushes images to AWS ECR.
5.  **Deploy**: Updates ECS Service definition to use new image tags.

## 🛳️ Deployment Procedures

### Staging
Automatic deployment on every merge to `develop` branch.
URL: `https://staging.xsafe-erp.com`

### Web Admin (ERP Dashboard)
Automatic deployment on every merge to `main` branch.
URL: `https://erp.xsafe.com`

### Production
Manual trigger required via GitHub Releases (Tag `v*.*.*`).
URL: `https://xsafe-erp.com`

**Steps:**
1.  Go to GitHub Releases.
2.  Draft a new release (e.g., `v1.2.0`).
3.  Publish release.
4.  GitHub Actions will deploy to Prod.

### Desktop App (Distribution)
The Electron app is built and published to AWS S3 / GitHub Releases.

**Build Command:**
```bash
cd apps/erp-desktop
npm run dist
```
*   **Windows**: Generates `.exe` (NSIS installer).
*   **Mac**: Generates `.dmg` (requires notarization).
*   **Linux**: Generates `.AppImage` and `.deb`.

**Auto-Update:**
The app checks for updates on startup using `electron-updater` pointing to the release bucket.

## 🔧 Production Configuration
Sensitive variables are managed via AWS Secrets Manager.

**Required Vars**:
*   `DATABASE_URL`
*   `JWT_SECRET`
*   `REDIS_URL`
*   `STRIPE_API_KEY`
*   `S3_BUCKET_NAME`

## 🔄 Rollback Strategy
In case of a critical failure:
1.  Identify the last stable image tag (e.g., `v1.1.9`).
2.  Run the manual "Rollback" workflow in GitHub Actions.
3.  Input the target tag.
4.  System reverts within 2-5 minutes.

## 📊 Monitoring & Alerts
*   **Performance**: Datadog APM.
*   **Logs**: AWS CloudWatch.
*   **Uptime**: PagerDuty configured for `/health` endpoints.
