# Aura Live Voice Room

A production-grade, high-concurrency Live Audio Broadcast and Voice Room Platform built with modern micro-architecture.

## 🏗️ Tech Stack

- **Backend API**: Node.js, NestJS (Fastify Adapter), TypeScript Strict Mode, Redis, WebSockets.
- **Database & ORM**: PostgreSQL, Prisma ORM.
- **Mobile Application**: Flutter 3.x, Riverpod (State Management), Clean Architecture, GoRouter.
- **Admin Panel**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Real-Time Communication (RTC)**: Pluggable RTC Engine (Agora, LiveKit, WebRTC abstraction).

## ⚡ Sprint 2 Real-Time System Architecture

```
Aura Live Voice Room

          Mobile App (Flutter Clean Arch)
                      |
                      |
                API Gateway
                      |
     -----------------------------------
     |                |                |
 WebSocket Gateway   REST API      RTC Token Service
     |                |                |
 Redis Pub/Sub   PostgreSQL        Agora / LiveKit Server
     | (Room State)   | (Ledger)
```

### Key Technical Specs:
1. **RTC Provider Layer (`packages/rtc-engine`)**: Backend-only dynamic token generation (Agora, LiveKit, WebRTC). Mobile app never contains direct RTC vendor keys.
2. **WebSocket Gateway (`apps/api/src/modules/realtime`)**: Broadcasts real-time events (`ROOM_*`, `SEAT_*`, `MIC_*`, `GIFT_SENT`, `CHAT_MESSAGE`, `LEVEL_UP`).
3. **Seat State Engine**: 9-Seat state machine (`EMPTY` ➔ `REQUESTED` ➔ `APPROVED` ➔ `LIVE_SPEAKER` ➔ `MUTED`) with Redis distributed locks.
4. **Double-Entry Wallet Ledger (`packages/wallet`)**: Immutable transaction logs (`WalletLedgerEntry`) enforcing strict currency separation (`COIN` vs `DIAMOND`) and `Idempotency-Key` anti-fraud protection.
5. **VIP Membership Engine (`apps/api/src/modules/economy/vip.service.ts`)**: VIP Tiers 1-7 with custom avatar frames, entry animation effects, and dynamic gift discount calculations.
6. **Enterprise Admin & RBAC (`apps/api/src/modules/admin/rbac.service.ts`)**: 6 Admin Roles (`SUPER_ADMIN`, `COUNTRY_MANAGER`, `OPERATIONS_MANAGER`, `FINANCE_MANAGER`, `MODERATOR`, `SUPPORT_AGENT`) with permission matrix, country-scope isolation, and mandatory `admin_activity_logs`.
7. **Modular AI Engine (`packages/ai-engine`)**: Pluggable AI provider layer (`OpenAI`, `LocalAI`, `Mock`) supporting speech-to-text, toxicity analysis, and real-time multi-language translation.
8. **Cloud Infrastructure & Kubernetes (`infrastructure/k8s`)**: Multi-stage Docker builds, Kubernetes HPA auto-scaling (5-50 pods), 6-node Redis Cluster StatefulSets, and Prometheus observability metrics exporter.
9. **Production Readiness Certification Gate (`infrastructure/`)**: Staging Ingress TLS (`k8s-staging-ingress.yaml`), 5% Canary rollout with auto-rollback, k6 WebSocket load testing script, Python Locust API load testing script, Trivy container security scanner, OWASP ZAP audit config, Disaster Recovery PITR restore verification (RTO <= 30m, RPO <= 5m), Prometheus alert rules, and Chaos Engineering failover test.

```
New-Live-App/
├── apps/
│   ├── mobile/         # Flutter Mobile Application
│   ├── admin/          # Next.js 15 Admin Dashboard
│   └── api/            # NestJS Backend API & Gateway
├── packages/
│   ├── database/       # Shared Prisma client & DB utilities
│   ├── auth/           # Shared Authentication & JWT utilities
│   ├── rtc-engine/     # Pluggable RTC provider layer (Agora/LiveKit/WebRTC)
│   ├── wallet/         # Shared Wallet & Virtual Economy logic
│   ├── payments/       # Shared Payment Gateway interfaces
│   ├── notifications/  # Push & In-app notifications engine
│   └── shared-types/   # Shared DTOs, interfaces & WebSocket event contracts
├── prisma/             # PostgreSQL database schema & migrations
├── docs/               # System documentation & architectural design
└── infrastructure/     # Docker, Redis, and Deployment configs
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20.x
- Flutter >= 3.22.x
- PostgreSQL >= 16
- Redis >= 7.x

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate --schema=prisma/schema.prisma

# Run Database Migrations
npx prisma migrate dev --schema=prisma/schema.prisma
```
