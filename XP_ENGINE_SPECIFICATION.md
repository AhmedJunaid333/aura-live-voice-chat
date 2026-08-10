# XP ENGINE SPECIFICATION

## 1. XP Source & Calculation Formula

```
XP Event (Live Stream / Gift Sent / Daily Login)
             ↓
Backend XP Ledger Validation (Reference ID & Anti-Abuse Check)
             ↓
XP Added to User Profile (`totalXP += XPAmount`)
             ↓
Server Level Calculation: Level = Math.floor(totalXP / 1000) + 1
             ↓
Prisma Database Transaction (`prisma.user.update`)
             ↓
Audit Log Entry & Socket.IO Event (`level.updated`)
```
