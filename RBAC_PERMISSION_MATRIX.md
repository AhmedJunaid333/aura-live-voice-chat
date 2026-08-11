# RBAC PERMISSION MATRIX

| Module Scope | Action Key | Required Role Permission | Allowed Roles |
| :--- | :--- | :--- | :--- |
| **User Directory** | `users.update_status` | `users.update_status` | `SUPER_ADMIN_CEO`, `COUNTRY_HEAD` |
| **User Directory** | `users.revoke_sessions` | `users.revoke_sessions` | `SUPER_ADMIN_CEO`, `COUNTRY_HEAD` |
| **Diamond Reseller** | `reseller.allocate` | `reseller.allocate` | `SUPER_ADMIN_CEO` |
| **Anti-Fraud** | `anti_fraud.resolve_case` | `anti_fraud.resolve_case` | `SUPER_ADMIN_CEO`, `SAFETY_MODERATOR` |
| **Moments Feed** | `moments.moderate_post` | `moments.moderate_post` | `SUPER_ADMIN_CEO`, `SAFETY_MODERATOR` |
| **System Config** | `system_config.rollback` | `system_config.rollback` | `SUPER_ADMIN_CEO` |
| **Feature Flags** | `feature_flags.toggle` | `feature_flags.toggle` | `SUPER_ADMIN_CEO` |
