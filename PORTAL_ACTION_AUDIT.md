# AURA LIVE — PORTAL ACTION FRAMEWORK AUDIT REPORT

## Executive Summary
This document provides a comprehensive audit of all modules, screens, entities, and context-aware action frameworks across the Aura Live Admin Portal, Express Backend Server, and PostgreSQL (`server/prisma/dev.db`) database.

---

## 1. Context-Aware Module & Entity Action Inventory

| Module Name | Managed Entity | Context-Aware Allowed Actions | Risk Level | Backend Endpoint | Realtime Event | Audit Log |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| **👥 User Directory** | `User` | `View`, `Search`, `Filter`, `Suspend`, `Ban`, `Restore`, `Reset Password`, `Revoke Session` | **HIGH** | `GET/POST /api/v1/admin/users/*` | `user.status.updated` | `USER_STATUS_UPDATED` |
| **💳 Diamond Reseller** | `Reseller` | `View`, `Approve`, `Activate`, `Deactivate`, `Allocate Diamonds`, `Review Transfers` | **CRITICAL** | `GET/POST /api/v1/admin/reseller/*` | `reseller.status.updated` | `RESELLER_ALLOCATION` |
| **🛡️ Anti-Fraud & Risk** | `FraudAlert` | `View`, `Investigate`, `Assign Analyst`, `Resolve Case`, `Mark False Positive` | **HIGH** | `GET/POST /api/v1/admin/anti-fraud/*` | `security.alert.created` | `FRAUD_ALERT_RESOLVED` |
| **📸 Moments Feed** | `Moment` | `View`, `Moderate`, `Approve`, `Restrict`, `Remove`, `Assign Moderator` | **MEDIUM** | `GET/POST /api/v1/admin/moments/*` | `moment.moderated` | `MOMENT_MODERATED` |
| **⚙️ System Config** | `SystemConfig` | `View`, `Create Setting`, `Update Value`, `Rollback Key` | **HIGH** | `GET/POST /api/v1/admin/system-config/*` | `config.system.updated` | `CONFIG_KEY_UPDATED` |
| **🚩 Feature Flags** | `FeatureFlag` | `View`, `Create Flag`, `Toggle State`, `Rollback State` | **HIGH** | `GET/POST /api/v1/admin/feature-flags/*` | `config.flag.updated` | `FLAG_TOGGLED` |
| **🎙️ Audio Rooms** | `AudioRoom` | `View`, `Monitor Seats`, `Lock Room`, `Kick Host`, `Close Room` | **HIGH** | `GET/POST /api/v1/admin/rooms/*` | `room.status.updated` | `ROOM_MODERATED` |
| **🚩 Abuse Reports** | `AbuseReport` | `View`, `Assign Moderator`, `Triage`, `Sanction User`, `Close Case` | **HIGH** | `GET/POST /api/v1/admin/abuse-reports/*` | `report.status.updated` | `REPORT_RESOLVED` |

---

## 2. Action Safety Guidelines
1. **Financial Operations**: Balance modifications are disallowed directly; all diamond/coin allocations must execute through `ResellerLedgerService` or `WalletLedgerService` with immutable ledger entries.
2. **Credential Isolation**: Zero password viewing or token retrieval endpoints exist.
3. **Context-Aware Scoping**: Actions are scoped strictly to the entity context (e.g., moments cannot be banned; users cannot be approved as moments).
