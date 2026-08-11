# RESELLER TRANSACTION FLOW SPECIFICATION

## 1. Reseller to Customer Atomic Transfer Architecture

```
Reseller Portal / Mobile App Transfer Form
             ↓
Backend Authorization & Inventory Check (`prisma.user.diamonds >= quantity`)
             ↓
Atomic Database Transaction (`prisma.$transaction`):
   • Reseller Wallet Debit
   • Customer Wallet Credit
             ↓
Double Ledger Records Created (`prisma.walletTransaction`)
             ↓
Audit Log Recorded (`prisma.auditLog`)
             ↓
Real-Time Socket.IO Notification (`wallet.credited`)
```
