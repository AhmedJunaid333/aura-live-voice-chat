# MOMENTS API SPECIFICATION

| Endpoint | Method | Purpose | Response Payload |
| :--- | :---: | :--- | :--- |
| `/api/v1/admin/moments` | `GET` | Fetch moments catalog, explore ranking & engagement | `{ moments, totalMoments, totalLikes, totalViews }` |
| `/api/v1/admin/moments/moderate` | `POST` | Moderate moment (Approve, Restrict, Remove) | `{ success: true, momentId, newStatus, auditLogId }` |
| `/api/v1/admin/moments/assign` | `POST` | Assign moment moderation case to analyst | `{ success: true, momentId, assignedModerator, auditLogId }` |
| `/api/v1/admin/moments/create` | `POST` | Create new moment post via API | `{ success: true, momentId, authorId, auditLogId }` |
