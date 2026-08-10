# FAMILY XP ENGINE SPECIFICATION

## 1. Family Level Calculation Mechanics

```
Member Activity / Gifting / Live Streams / Mission Completion
             ↓
Backend XP Ledger Validation (Reference ID & Anti-Abuse Check)
             ↓
Family XP Added (`totalXP += XPAmount`)
             ↓
Family Level Transition Calculation: Level = Math.floor(totalXP / 5000) + 1
             ↓
Prisma Audit Log & Socket.IO Real-time Event (`family.level.updated`)
```
