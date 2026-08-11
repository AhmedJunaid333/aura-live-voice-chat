# ROOM REPORT FLOW SPECIFICATION

```
Flutter Audio Room
       ↓
Room Menu Report Button
       ↓
Select Abuse Category (ILLEGAL_CONTENT, SPAM, HARASSMENT)
       ↓
Description & Room Snapshot Evidence
       ↓
Backend Validation
       ↓
Database Persistence (prisma.auditLog)
       ↓
Reports Center Queue (REP-7002)
       ↓
Moderator Action (Kick Host / Lock Room / Socket.IO Sync)
```
