# ROLE-BASED ACCESS CONTROL (RBAC) PERMISSION MATRIX

## 1. Centralized Role Definitions

| Role Identifier | Role Level | Scope Description | Default Portal Access |
| :--- | :---: | :--- | :--- |
| **SUPER_ADMIN_CEO** | Level 0 | Root master access across all platform modules & infrastructure | CEO Global Portal |
| **SUPER_ADMIN** | Level 1 | Enterprise admin control, role management & audit logs | Next.js Admin Portal |
| **ADMIN** | Level 2 | User management, profile editing, KYC moderation & reports | Next.js Admin Portal |
| **MODERATOR** | Level 3 | Real-time chat & live audio room content moderation | Admin Moderation |
| **FINANCE_ADMIN** | Level 2 | Wallet balance adjustments, cashouts & diamond reserves | Finance Hub |
| **OPERATIONS_ADMIN**| Level 2 | Broadcaster host quotas & BD agency performance | Host & BD Hub |
| **COUNTRY_HEAD** | Level 2 | Regional territory analytics (PK, UAE, IN) | Country Head Portal |
| **BD_LEADER** | Level 3 | BD agent team management & streamer onboarding | BD Portal |
| **AGENCY_MANAGER** | Level 3 | Agency streamer host management & commission splits | Agency Portal |
| **MASTER_RESELLER** | Level 3 | Master reseller inventory & sub-reseller management | Reseller Portal |
| **DIAMOND_RESELLER** | Level 4 | Wholesale diamond inventory & P2P user transfers | Aura Sell Diamonds |
| **COIN_SELLER** | Level 4 | Local payment gateway processing & seller payouts | Recharge Hub |
| **HOST** | Level 5 | Verified streamer broadcaster, live hours & gift earnings | Broadcaster Host Portal |
| **SUPPORT** | Level 4 | User lookup, ticket handling & complaint resolution | Reports & Tickets |
| **ANALYST** | Level 4 | Read-only business intelligence & retention analytics | Intelligence Hub |
| **USER** | Level 6 | Mobile app user (Audio rooms, gifts, CP, moments, games) | Flutter Mobile App |

---

## 2. Granular Permission Scopes Matrix

| Permission Scope | CEO | Super Admin | Admin | Finance | Operations | Reseller | Agency | Host | User |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `portal.ceo.access` | **ALLOW** | DENY | DENY | DENY | DENY | DENY | DENY | DENY | DENY |
| `users.view` | **ALLOW** | **ALLOW** | **ALLOW** | DENY | **ALLOW** | DENY | DENY | DENY | DENY |
| `users.edit` | **ALLOW** | **ALLOW** | **ALLOW** | DENY | DENY | DENY | DENY | DENY | DENY |
| `users.suspend` | **ALLOW** | **ALLOW** | **ALLOW** | DENY | DENY | DENY | DENY | DENY | DENY |
| `wallet.manage` | **ALLOW** | **ALLOW** | DENY | **ALLOW** | DENY | DENY | DENY | DENY | DENY |
| `diamonds.transfer` | **ALLOW** | **ALLOW** | DENY | **ALLOW** | DENY | **OWN** | DENY | DENY | DENY |
| `withdrawals.approve`| **ALLOW** | **ALLOW** | DENY | **ALLOW** | DENY | DENY | DENY | DENY | DENY |
| `roles.assign` | **ALLOW** | **ALLOW** | DENY | DENY | DENY | DENY | DENY | DENY | DENY |
