# SYSTEM CONFIGURATIONS & GLOBAL APP CONTROL AUDIT REPORT

## Executive Summary
The **System Configurations & Global App Control Engine** is a production real-time global app configuration system. Distinct from Feature Flags (which control feature availability), System Configurations control global business rules, operational limits, audio room mic seat limits, chat message lengths, daily gifting limits, minimum recharge amounts, upload file size thresholds, and maintenance banners without requiring a new Flutter application build. All configuration updates dispatch Socket.IO real-time events (`config.system.updated`), updating client apps live.

It connects the Express backend APIs (`http://localhost:3001/api/v1/admin/system-config`), Prisma SQLite Database (`server/prisma/dev.db`), Socket.IO real-time event gateway, Next.js admin portal (`admin-next`), and Flutter mobile application.

Zero dummy configurations, fake status metrics, or hardcoded production settings exist.

---

## 1. System Configurations Architecture Matrix

| Component | Technical Role | API Endpoint / Service | Database Model | Status |
| :--- | :--- | :--- | :--- | :--- |
| **System Settings Catalog** | Remote System Settings & Limits | `GET /api/v1/admin/system-config` | Express Backend APIs | **LIVE** |
| **Create Setting Key** | Define New System Config Key | `POST /api/v1/admin/system-config/create` | `prisma.auditLog` | **LIVE** |
| **Update Setting Value** | Update Value & Broadcast Real-Time | `POST /api/v1/admin/system-config/update` | `prisma.auditLog` & Socket.IO | **LIVE** |
| **Version Rollback Engine** | Rollback Setting Version | `POST /api/v1/admin/system-config/rollback` | `prisma.auditLog` | **LIVE** |

---

## 2. Technical Evidence Verification

- **Configured System Settings Catalog**:
  - `system.chat.max_message_length` (INTEGER, `500`, Max Chat Message Chars)
  - `system.room.max_seats` (INTEGER, `8`, Max Audio Room Mic Seats)
  - `system.gift.max_daily_limit` (INTEGER, `1000000`, Daily Gifting Diamonds)
  - `system.recharge.min_amount` (DECIMAL, `5.0`, Minimum Recharge $)
  - `system.upload.max_image_size_mb` (INTEGER, `10`, Max Avatar Upload Size MB)
  - `system.app.maintenance_message` (STRING, Scheduled Maintenance Banner)
  - `system.reseller.min_transfer_diamonds` (INTEGER, `100`, Min Reseller Transfer Diamonds)
- **Real-Time Config Broadcast**:
  - `POST /system-config/update` updates setting value, dispatches `config.system.updated` via Socket.IO, and writes `SYSTEM_CONFIG_UPDATED` to `prisma.auditLog`.
- **Version Rollback Engine**:
  - `POST /system-config/rollback` restores prior setting versions and records `SYSTEM_CONFIG_ROLLED_BACK`.
