# TRUST & SAFETY API SPECIFICATION

| Endpoint | Method | Purpose | Response Payload |
| :--- | :---: | :--- | :--- |
| `/api/v1/admin/trust-safety` | `GET` | Fetch open reports queue, active bans & appeals | `{ safetyReports, activeEnforcements, pendingAppeals }` |
| `/api/v1/admin/trust-safety/report/create` | `POST` | Submit new safety violation report | `{ success: true, reportId, category, severity }` |
| `/api/v1/admin/trust-safety/moderate` | `POST` | Execute warning, mute, suspension, or ban action | `{ success: true, targetUserId, actionType, auditLogId }` |
| `/api/v1/admin/trust-safety/appeal/resolve` | `POST` | Approve or deny submitted ban appeal | `{ success: true, appealId, decision, auditLogId }` |
