# MOMENTS MODERATION SPECIFICATION

| Moderation Action | Previous State | Target State | Realtime Event Emitted |
| :--- | :--- | :--- | :--- |
| **Approve Content** | `UNDER_REVIEW` / `RESTRICTED` | `PUBLISHED` | `moment.moderated` |
| **Restrict Content** | `PUBLISHED` | `RESTRICTED` | `moment.moderated` |
| **Remove Content** | `PUBLISHED` / `RESTRICTED` | `REMOVED` | `moment.moderated` |
