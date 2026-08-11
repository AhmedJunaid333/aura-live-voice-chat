# ABUSE REPORT API SPECIFICATION

| Endpoint | Method | Purpose | Response Payload |
| :--- | :---: | :--- | :--- |
| `/api/v1/admin/abuse-reports` | `GET` | Fetch user & room abuse reports, queue & history | `{ abuseReports, moderationHistory, userAbuseReports }` |
| `/api/v1/admin/abuse-reports/create` | `POST` | Submit new User or Room Abuse Report | `{ success: true, reportId, targetType, category }` |
| `/api/v1/admin/abuse-reports/assign` | `POST` | Assign report case to safety moderator | `{ success: true, reportId, assignedTo, auditLogId }` |
| `/api/v1/admin/abuse-reports/moderate` | `POST` | Execute Kick, Ban, Mute, or Lock Room action | `{ success: true, actionType, auditLogId }` |
