# USER API SPECIFICATION

| Endpoint | Method | Purpose | Response Payload |
| :--- | :---: | :--- | :--- |
| `/api/v1/admin/users` | `GET` | Fetch registered users, search/filter & online presence | `{ users, totalRegisteredUsers, onlineUsers }` |
| `/api/v1/admin/users/update-status` | `POST` | Update account status (Active, Suspend, Ban) | `{ success: true, userId, newStatus, auditLogId }` |
| `/api/v1/admin/users/revoke-sessions` | `POST` | Revoke active user sessions and JWT tokens | `{ success: true, userId, auditLogId }` |
| `/api/v1/admin/users/force-password-reset` | `POST` | Set forced password reset requirement flag | `{ success: true, userId, auditLogId }` |
