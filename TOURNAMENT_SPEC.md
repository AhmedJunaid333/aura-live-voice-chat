# TOURNAMENT SPECIFICATION

## 1. Tournament Bracket & Reward Settlement Flow

```
Admin Schedules Tournament in Events Studio (`POST /events/create`)
             ↓
Authenticated Players Register & Backend Validates Entry Cost
             ↓
Automated Matchmaking & Session Rounds (`game.started`)
             ↓
Server-Authoritative Score Calculation & Winner Advancement
             ↓
Final Championship Match Settlement & Prize Pool Disbursement (`prisma.$transaction`)
             ↓
Immutable Audit Log Recorded (`prisma.auditLog`)
```
