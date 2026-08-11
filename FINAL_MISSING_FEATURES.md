# FINAL MISSING FEATURES & PRODUCTION READINESS SPECIFICATION

## Executive Summary
This document outlines the remaining non-code dependencies, database migrations, and external service requirements for full high-concurrency production launch.

---

## 1. Codebase vs Operational Readiness Gap Analysis

| Operational Area | Codebase Status | Launch Prerequisite | Priority | Target Environment |
| :--- | :---: | :--- | :---: | :--- |
| **Database Engine** | `SQLite dev.db` | Migrate Prisma schema to **PostgreSQL v16+** | **P0** | AWS RDS / DigitalOcean Managed Postgres |
| **Realtime Audio/Video** | WebRTC Fallback | Add **Agora App ID & Certificate** to `.env` | **P0** | Agora.io Cloud Portal |
| **Push Notifications** | Socket.IO Fallback | Add **Firebase Service Account JSON** to `.env` | **P1** | Firebase Console |
| **OAuth Authentication** | Pass/User Auth | Add **Google Client IDs** to `.env` | **P2** | Google Cloud Console |
| **Cloud Media CDN** | Local Storage | Add **AWS S3 / Cloudflare R2 Credentials** | **P2** | S3 / Cloudflare R2 |
