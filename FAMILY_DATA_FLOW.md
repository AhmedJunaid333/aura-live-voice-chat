# FAMILY DATA FLOW SPECIFICATION

## 1. Guild Creation to Member Moderation Lifecycle

```
User (Creates Family) ➔ Express Backend Validation ➔ Unique Family Code Issued (e.g. ROYAL88)
                                                               ↓
Database Record (`prisma.user` / Guild Roster) ➔ Socket.IO Notification (`family.created`)
                                                               ↓
Members Join / Assign Roles (`OWNER`, `CO_OWNER`, `OFFICER`, `MEMBER`) ➔ Socket.IO Level Sync
                                                               ↓
Member Expulsion / Moderation ➔ Audit Log Recorded (`FAMILY_MEMBER_REMOVED`)
```
