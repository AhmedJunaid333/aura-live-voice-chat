# USER RBAC MATRIX

| Action Scope | End User | Safety Moderator | Country Head | Root / CEO |
| :--- | :---: | :---: | :---: | :---: |
| `users.view` | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** |
| `users.suspend` | DENY | **ASSIGNED** | **REGIONAL** | **GLOBAL** |
| `users.revoke_sessions` | DENY | DENY | **REGIONAL** | **GLOBAL** |
| `users.reset_password` | DENY | DENY | DENY | **GLOBAL** |
