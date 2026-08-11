# AURA DIAMOND RESELLER FLOW SPECIFICATION

## 1. Wholesale to User Delivery Lifecycle

```
Company Treasury / Platform Top-up
             ↓
Master Reseller Inventory (`@Ahmed Khokhar` - 500,000 Diamonds)
             ↓
Reseller Executes Sale to Customer UID (e.g. UID 100002 `@Ayesha_Singer`)
             ↓
Backend Validates Reseller Inventory Balance (>= Requested Quantity)
             ↓
Atomic Prisma DB Transaction (`prisma.$transaction`):
   • Reseller Diamonds Decremented (-5,000)
   • Customer Diamonds Incremented (+5,000)
             ↓
Double-Entry Wallet Transaction Ledger Created (`prisma.walletTransaction`)
             ↓
Immutable Audit Log Recorded (`prisma.auditLog`)
             ↓
Socket.IO Real-Time Notifications Dispatched (`wallet.credited` & `diamond.credited`)
```
