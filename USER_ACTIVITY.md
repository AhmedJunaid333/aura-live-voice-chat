# USER ACTIVITY SPECIFICATION

| Activity Category | Monitored Event | Audit Record |
| :--- | :--- | :--- |
| **Authentication** | Login, Logout, Session Revocation | `USER_SESSIONS_REVOKED` |
| **Status Changes** | Suspend, Ban, Restore Account | `USER_STATUS_UPDATED` |
| **Security Flags** | Force Password Reset Requirement | `USER_PASSWORD_RESET_FORCED` |
