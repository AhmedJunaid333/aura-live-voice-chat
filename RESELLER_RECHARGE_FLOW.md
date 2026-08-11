# RESELLER RECHARGE FLOW SPECIFICATION

## 1. Wholesale Reseller Distribution Architecture

```
Company / Platform Treasury
             ↓
Authorized Master Reseller Wallet (`@Ahmed Khokhar` - 500,000 Diamonds)
             ↓
Wholesale Diamond Transfer to Sub-Reseller / End User
             ↓
Atomic Database Debit/Credit & Ledger Entry
             ↓
Socket.IO Event Broadcast (`wallet.credited`)
```
