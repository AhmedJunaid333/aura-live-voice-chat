# ROOM WALLPAPER API SPECIFICATION

| Endpoint | Method | Purpose | Response Payload |
| :--- | :---: | :--- | :--- |
| `/api/v1/admin/wallpapers` | `GET` | Fetch active room wallpapers, assignments & revenue telemetry | `{ wallpapers, activeAssignments, totalRevenueDiamonds }` |
| `/api/v1/admin/wallpapers/create` | `POST` | Create & publish new room wallpaper | `{ success: true, wallpaperId, auditLogId }` |
| `/api/v1/admin/wallpapers/purchase` | `POST` | Atomic Diamond wallet purchase & ownership credit | `{ success: true, remainingDiamonds, auditLogId }` |
| `/api/v1/admin/wallpapers/assign` | `POST` | Assign wallpaper to Audio Lounge Room & emit Socket.IO | `{ success: true, roomNumericId, auditLogId }` |
| `/api/v1/admin/wallpapers/grant` | `POST` | Admin grant / revoke room wallpaper | `{ success: true, targetUserId, auditLogId }` |
