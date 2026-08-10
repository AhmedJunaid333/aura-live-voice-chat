# ADMIN PANEL ↔ REAL USERS COMPLETE LIVE CONNECTION AUDIT

**Audit Date**: 2026-08-10  
**Architecture**: Express TypeScript Backend (`server/`) + Prisma SQLite Database (`server/prisma/dev.db`) + Socket.IO Realtime Gateway + React Web Admin Panel (`src/`) + Flutter Mobile App (`New-Live-App/apps/mobile/`)

---

## 1. Single Database — Single Source of Truth
- **Flutter App** and **Web Admin Panel** read and write through the **exact same Express backend API and Prisma SQLite database**.
- No separate Admin-only user database or local storage fallback.
- **Database Models**: `User`, `WalletTransaction`, `Session`, `Follow`, `ProfileVisit`, `LiveRoom`, `Message`, `MessageReport`, `ResellerAccount`, `ResellerApplication`, `WithdrawalRequest`, `AuditLog`.

---

## 2. Real User Registration & Login → Admin Real-Time
- When a user registers (`POST /api/v1/auth/register`) or logs in (`POST /api/v1/auth/login`) in Flutter or Web:
  - User record is persisted in SQLite `User` table.
  - Presence status is updated (`status = ACTIVE`).
  - Socket.IO emits `user.registered` / `user.login` / `user.online` events.
  - User immediately appears in Admin Panel User Directory (`GET /api/v1/admin/users`).

---

## 3. Real Admin User List & Dossier
- **Endpoint**: `GET /api/v1/admin/users?query=...&status=...&role=...`
  - Real-time search by username, email, phone, or numeric ID.
  - Status filters (`ALL`, `ACTIVE`, `SUSPENDED`, `BANNED`).
  - Role filters (`ALL`, `USER`, `ADMIN`, `RESELLER`).
- **Endpoint**: `GET /api/v1/admin/users/:id`
  - Full User Dossier returning live database stats: profile, wallet balance (`coins`, `diamonds`), `followersCount`, `followingCount`, `fansCount`, `visitorsCount`, reseller status, and recent transactions.

---

## 4. Real Admin Actions → App Synchronization
- **Suspend / Ban Action**: `PUT /api/v1/admin/users/:id/status`
  - Updates `User.status` in database.
  - Writes immutable entry to `AuditLog` table.
  - Emits real-time `account.status_updated` Socket.IO event to target device.
- **Role Assignment**: `PUT /api/v1/admin/role`
  - Updates `User.role` in database and writes audit log.
- **Manual Wallet Credit/Debit**: `POST /api/v1/admin/users/:id/credit`
  - Adjusts `coins` or `diamonds` atomically in SQLite.
  - Creates a `WalletTransaction` ledger record (`ADMIN_CREDIT` / `ADMIN_DEBIT`).
  - Emits `wallet.updated` Socket.IO event to live user device.
- **Wallet Freeze/Unfreeze**: `PUT /api/v1/admin/users/:id/freeze-wallet`
  - Updates `User.walletFrozen` flag.

---

## 5. Real Live & Moderation Synchronization
- **Live Room Monitor**: `GET /api/v1/admin/dashboard` returns real count of active rooms (`status = LIVE`).
- **Chat Moderation**: `GET /api/v1/chat/reports` & `PATCH /api/v1/chat/reports/:id/resolve` handle UGC user reports created from Flutter `DirectChatScreen`.

---

## 6. Audit & Verification Summary
- **Backend TypeScript Compilation (`npx tsc --noEmit`)**: 0 ERRORS.
- **Vite Web Admin Build (`npm run build`)**: 0 ERRORS.
- **Flutter App Analyzer (`flutter analyze --no-pub`)**: 0 ERRORS.
- **Compiled Debug APK**: Updated at [`d:\Auralive\app-debug.apk`](file:///d:/Auralive/app-debug.apk).
