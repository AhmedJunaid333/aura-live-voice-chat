# AURA LIVE — PRODUCTION BLOCKERS AUDIT

## Executive Summary
This report documents the architectural blockers and production configuration requirements for **Aura Live Voice Chat**.

---

## 1. Database Architecture Blocker & PostgreSQL Migration Plan

### ⚠️ Blocker 1: Local SQLite `dev.db` Database
- **Current State**: The Express backend server (`server/src/index.ts`) is utilizing Prisma SQLite (`server/prisma/dev.db`) for local single-instance development and rapid verification.
- **Why It Is a Blocker for Large-Scale Production**:
  - SQLite lacks concurrent write scalability, horizontal connection pooling, multi-region replication, and native transaction locking required for a high-concurrency live streaming platform (thousands of concurrent audio rooms & real-time diamond transfers).
- **Required Production Change**: Migration to **PostgreSQL v16+**.

### 🛠️ PostgreSQL Production Migration Plan:
1. **Prisma Provider Update** in `server/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. **Environment Variable Configuration** in `server/.env`:
   ```env
   DATABASE_URL="postgresql://auralive_admin:SecurePassword123!@postgres.auralive.internal:5432/auralive_prod_db?schema=public&connection_limit=50&pool_timeout=10"
   ```
3. **Migration Commands**:
   - `npx prisma migrate dev --name init_postgresql_schema`
   - `npx prisma db seed`

---

## 2. External Service Credential Blockers (P0 Production Configurations)

| External Integration | Required Production Credential | Required Environment Variable | Fallback Behavior |
| :--- | :--- | :--- | :--- |
| **Agora RTC Realtime Audio/Video** | Agora App ID & Primary Certificate | `AGORA_APP_ID`, `AGORA_APP_CERTIFICATE` | WebRTC local loopback |
| **Firebase Cloud Messaging (FCM)** | Firebase Service Account Key | `FIREBASE_SERVICE_ACCOUNT_JSON` | Socket.IO WebSockets broadcast |
| **Google OAuth Authentication** | Google Web & Android Client IDs | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Standard Username/Password auth |
| **AWS S3 / Cloudflare R2 Media** | S3 Access Key & Secret Key | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Local static media storage |
