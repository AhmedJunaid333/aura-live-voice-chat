# ALL PORTALS ACCESS & PERMISSION MATRIX

## 1. Centralized Role System Definitions

| Role Identifier | Role Category | Hierarchy Level | System Description |
| :--- | :--- | :--- | :--- |
| **SUPER_ADMIN_CEO** | Executive | Root (Level 0) | Full global platform master control & infrastructure telemetry |
| **SUPER_ADMIN** | Executive | Level 1 | System configuration, admin management & user control |
| **ADMIN** | Management | Level 2 | Operational platform management, user moderation & KYC |
| **MODERATOR** | Operations | Level 3 | Real-time chat & live audio room content moderation |
| **FINANCE_ADMIN** | Finance | Level 2 | Wallet ledger, diamond reserves & cashout withdrawal approvals |
| **OPERATIONS_ADMIN**| Operations | Level 2 | Broadcaster host management & BD agency target tracking |
| **COUNTRY_HEAD** | Regional | Level 2 | Regional territory management (PK, UAE, IN) & local analytics |
| **BD_LEADER** | Business Dev | Level 3 | BD agent team management & streamer host onboarding |
| **AGENCY_MANAGER** | Agency | Level 3 | BD agency management, signed hosts & commission splits |
| **MASTER_RESELLER** | Reseller | Level 3 | Master reseller diamond allocation & sub-reseller management |
| **DIAMOND_RESELLER** | Reseller | Level 4 | Wholesale diamond inventory & P2P user transfers |
| **COIN_SELLER** | Finance | Level 4 | Local payment gateway processing & seller withdrawal claims |
| **HOST** | Broadcaster | Level 5 | Verified streaming host, live audio room & gift earnings |
| **SUPPORT** | Customer Care| Level 4 | User lookup, ticket handling & complaint resolution |
| **ANALYST** | Business Intel| Level 4 | Read-only analytics, retention metrics & churn reports |
| **USER** | End User | Level 6 | Mobile app user (Audio rooms, gifts, CP, moments, games) |

---

## 2. Portal Access Matrix

| Portal / Module Scope | CEO | Super Admin | Admin | Finance | Operations | Reseller | Agency | Host | User |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **🌐 CEO Global Portal** | **FULL** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **👥 User Directory & Dossier** | **FULL** | **FULL** | **READ/EDIT** | ✗ | **READ** | ✗ | ✗ | ✗ | ✗ |
| **💰 Wallet & Currency Engine** | **FULL** | **FULL** | **READ** | **FULL** | ✗ | ✗ | ✗ | ✗ | ✗ |
| **💳 Aura Sell Diamonds** | **FULL** | **FULL** | **READ** | **MANAGE** | ✗ | **OWN DATA**| ✗ | ✗ | ✗ |
| **🏛️ Agency Management** | **FULL** | **FULL** | **MANAGE** | ✗ | **MANAGE** | ✗ | **OWN DATA**| ✗ | ✗ |
| **🎙️ Broadcaster Host Center** | **FULL** | **FULL** | **MANAGE** | ✗ | **MANAGE** | ✗ | **OWN HOSTS**| **OWN DATA**| ✗ |
| **💸 Cashout Withdrawals** | **FULL** | **FULL** | **READ** | **APPROVE** | ✗ | ✗ | ✗ | ✗ | ✗ |
| **🛡️ Trust & Safety System** | **FULL** | **FULL** | **MANAGE** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **⚙️ System Config & RBAC** | **FULL** | **FULL** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

---

## 3. Strict Resource Ownership Policy

- **Reseller Ownership Isolation**:
  `Reseller A` is restricted strictly to Reseller A's diamond wallet and transactions. Reseller A cannot inspect or transfer Reseller B's diamonds.
- **Agency Ownership Isolation**:
  `Agency Manager A` can only view streamer hosts signed under Agency A.
- **Host Ownership Isolation**:
  `Broadcaster Host` can only view their own live hours telemetry and cashout requests.
- **Backend Guard Validation**:
  Every API endpoint enforces `verifyResourceOwnership(req, res, next, resourceUserId)` prior to database query execution.
