# CP INTIMACY ENGINE SPECIFICATION

## 1. Intimacy Calculation Mechanics

```
User Interactions / Gifting Event (Viewer Coins Deduction)
             ↓
Backend Validation (Verify Active CP Relationship & Idempotency)
             ↓
Intimacy XP Added to Couple Pair Ledger (`intimacyPoints += points`)
             ↓
CP Level Progression Calculation: CP Level = Math.floor(intimacyPoints / 2000) + 1
             ↓
Prisma Audit Log & Socket.IO Real-time Event (`cp.intimacy.updated`)
```
