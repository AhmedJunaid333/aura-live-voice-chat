# NOTIFICATION FLOW SPECIFICATION

| Notification Type | Trigger Event | Real-Time Transport | Audience Scope |
| :--- | :--- | :--- | :--- |
| **System Broadcast** | Admin Dispatch | Socket.IO `system.broadcast` | `ALL_USERS` / Targeted Segment |
| **CMS Announcement** | Admin Publish | Socket.IO `cms.published` | `ALL_USERS` |
| **Maintenance Alert** | Admin Toggle | Socket.IO `system.maintenance` | `ALL_USERS` |
