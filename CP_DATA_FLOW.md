# CP DATA FLOW SPECIFICATION

## 1. Request to Unpair Lifecycle Flow

```
User A (Initiates CP Request) ➔ Backend Validation ➔ Socket.IO Notification (`cp.requested`)
                                                               ↓
User B (Accepts Request) ➔ Database Status Update (`ACTIVE`) ➔ Intimacy Ledger Initialized
                                                               ↓
Intimacy XP Progression ➔ Gifting & Live Interactions ➔ Socket.IO Level Sync (`cp.intimacy.updated`)
                                                               ↓
Unpair Request ➔ Database Status Update (`ENDED`) ➔ Audit Log Recorded (`CP_ENDED`)
```
