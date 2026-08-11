# RECHARGE PAYMENT FLOW SPECIFICATION

## 1. End-to-End Payment Lifecycle

```
User (Flutter App / Web)
             ↓
Select Package (e.g. 500 PKR -> 5,500 Diamonds) & Payment Gateway (Stripe/JazzCash)
             ↓
Create Recharge Order (`ORD-xxxx`, Status: PENDING)
             ↓
User Completes External Gateway Payment
             ↓
Payment Provider Dispatches Server-Side Webhook (`POST /recharge/webhook`)
             ↓
Backend Validates Webhook Signature & Idempotency Key
             ↓
Atomic Database Update (`prisma.user.diamonds += 6000`)
             ↓
Immutable Wallet Transaction Ledger (`prisma.walletTransaction`)
             ↓
Audit Log Recorded (`prisma.auditLog`)
             ↓
Socket.IO Event Dispatched (`wallet.credited` & `diamond.credited`)
```
