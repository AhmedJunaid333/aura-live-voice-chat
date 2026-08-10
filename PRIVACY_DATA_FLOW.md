# PRIVACY DATA FLOW DOCUMENTATION

## 1. User Data Ingestion & Storage Architecture

```
Flutter Mobile User / Web App
             ↓
Backend JWT Authentication (`authenticateToken`)
             ↓
Express Route Processing (`/api/v1/...`)
             ↓
Prisma ORM Database Layer (`dev.db`)
             ↓
Data Classification Engine:
  - PERSONAL: Username, Email, Phone, Country, Gender, Bio
  - FINANCIAL: Coins Balance, Diamonds Balance, Wallet Transactions
  - SECURITY: Password Hash (Bcrypt), Audit Logs, Active Sessions
  - PUBLIC: Level, VIP Tier, Avatar, Live Room Status
```

---

## 2. Privacy Request Processing Flows

1. **Data Access & Export (GDPR Art 15)**:
   User / Admin Request ➔ Verification ➔ Sanitized Data Assembly ➔ Audit Log Record (`USER_DATA_EXPORTED`) ➔ Secure Delivery.
2. **Account Deletion & Anonymization (GDPR Art 17)**:
   User / Admin Request ➔ Verification ➔ Financial Records Retention Check ➔ Anonymization of Personal Identifiers ➔ Audit Log Record (`USER_DATA_DELETED`).
