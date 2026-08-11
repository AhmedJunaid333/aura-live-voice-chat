# GIFT ECONOMY FLOW SPECIFICATION

## 1. Live Gifting Economy Architecture

```
User (Live Room Session) Selects Gift (e.g. 🚀 Galaxy Rocket - 2,000 Diamonds)
             ↓
Backend Validates Sender Diamond Balance (>= 2,000 Diamonds)
             ↓
Atomic Prisma Database Transaction (`prisma.$transaction`):
   • Sender Diamonds Decremented (-2,000 Diamonds)
   • Receiver Host Coins Incremented (+1,400 Coins Earning)
             ↓
Double Wallet Transaction Ledger Created (`prisma.walletTransaction`)
             ↓
Immutable Audit Log Recorded (`prisma.auditLog`)
             ↓
Socket.IO Event Broadcast (`gift.sent`) ➔ Triggers SVGA / Lottie Overlay Animation in Live Room
```
