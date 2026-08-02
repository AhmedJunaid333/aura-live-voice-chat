# CHANGELOG - Aura Live Voice Room

All notable changes to **Aura Live Voice Room** (`New-Live-App`) will be documented in this file.

---

## [v1.0.0-RC1] - 2026-07-30
### Added
- **Release Engineering**: Android ProGuard obfuscation rules (`proguard-rules.pro`), Apple iOS Export Options (`ExportOptions.plist`), Release builds configuration.
- **Production Infrastructure & CI/CD**: Production Helm values (`helm-values-prod.yaml`), GitHub Actions Blue/Green deployment workflow (`production-deploy.yml`).
- **Security Hardening**: Automated JWT key rotation service (`JwtRotationService`).
- **Real Device QA & Benchmarks**: Mobile performance benchmark test suite (`performance_benchmark.dart`).
- **Store Readiness & Legal Docs**: Privacy Policy (`privacy_policy.md`), Terms of Service (`terms_of_service.md`), and Community Guidelines (`community_guidelines.md`).
- **Operations & Disaster Recovery Runbooks**: Incident Response Runbook (`incident-runbook.md`) and Disaster Recovery Runbook (`dr-runbook.md`).

## [v0.7.0] - 2026-07-30
### Added
- **Multi-Provider Payments**: Integrated Stripe, Google Play Billing, Apple IAP, Easypaisa, and JazzCash.
- **PK Battle Engine**: 1v1 and Team PK battles, dynamic dual-room score tracking, winner rewards, and punishment triggers.
- **Family & Guild System**: Family creation, role permissions (`OWNER`, `ADMIN`, `MEMBER`), family level XP progression, and treasury.
- **Daily Engagement & Lucky Wheel**: Check-in streak rewards, Lucky Wheel spin box, and daily missions.
- **Creator & Reseller Portal**: Reseller coin stock management and bulk coin transfer.
- **Global Leaderboards**: Redis Sorted Sets leaderboard ranking (Daily, Weekly, Monthly, Global, Country).
- **Architecture Decision Records**: Added `ADR-001` through `ADR-007`.

## [v0.6.5] - 2026-07-30
### Added
- **Production Readiness Certification Gate**: Staging Ingress TLS, 5% Canary rollout strategy, k6/Locust load testing scripts, Trivy container security scanner, OWASP ZAP config, Disaster Recovery PITR restore validation, Prometheus alert rules, and Chaos Engineering failover test.

## [v0.6.0] - 2026-07-30
### Added
- **Production Scale & Infrastructure**: Multi-stage Dockerfile, Kubernetes manifests, Horizontal Pod Autoscaler HPA, 6-node Redis Cluster StatefulSet, Multi-Region RTC Edge Routing (`asia-south`, `me-central`, `eu-west`, `us-east`), and Background Worker Processing queues.

## [v0.5.0] - 2026-07-30
### Added
- **AI Intelligence & Trust & Safety**: Modular AI Provider package (`@aura/ai-engine`), AI Recommendation Service, Weighted Room Ranking formula, Speech-to-Text Voice Moderation pipeline, Hybrid Anti-Fraud Risk Scoring engine, and Multi-Language Speech Translation.

## [v0.4.0] - 2026-07-30
### Added
- **Enterprise Admin & RBAC**: 6 Admin Roles (`SUPER_ADMIN`, `COUNTRY_MANAGER`, etc.), permission matrix, country-scope isolation, mandatory `admin_activity_logs`, Creator Withdrawal engine, and Flutter Admin Mobile App.

## [v0.3.0] - 2026-07-30
### Added
- **Virtual Economy & Gifts**: Double-entry ledger wallet service, currency separation (Coins vs Diamonds), Recharge Orders, Multi-category Gifts, VIP Tiers 1-7, Gamification XP rules, Agency Commission split, and Flutter Economy UI.

## [v0.2.0] - 2026-07-30
### Added
- **Live Room & Real-Time Engine**: Pluggable RTC Provider abstraction (`AgoraRTCProvider`), dynamic token generation endpoint, WebSocket Gateway, Redis Pub/Sub, 9-Seat state machine with distributed locks, and Flutter Live Room screen.

## [v0.1.0] - 2026-07-30
### Added
- Monorepo scaffold (`New-Live-App/`), PostgreSQL Prisma database schema, NestJS API Auth controllers, GoRouter Flutter Mobile app, and Next.js Admin dashboard base.
