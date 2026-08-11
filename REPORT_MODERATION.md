# ABUSE REPORT MODERATION SPECIFICATION

| Action Type | Target User / Room | Reason | Audit Log Record | Realtime Socket.IO Event |
| :--- | :--- | :--- | :--- | :--- |
| `KICK` | User #100004 (@Sara_Vip) | Harassment in Audio Room #9901 | `ABUSE_ACTION_EXECUTED` | `safety.action.created` |
| `TEMP_SUSPENSION` | User #100004 (@Sara_Vip) | Repeated Harassment Violation | `ABUSE_ACTION_EXECUTED` | `safety.action.created` |
| `ACCOUNT_BAN` | User #100005 (@SpamBot_99) | Automated Spam Bot Activity | `ABUSE_ACTION_EXECUTED` | `safety.action.created` |
| `LOCK_ROOM` | Room #9902 | Spam Flood Containment | `ABUSE_ACTION_EXECUTED` | `safety.action.created` |
