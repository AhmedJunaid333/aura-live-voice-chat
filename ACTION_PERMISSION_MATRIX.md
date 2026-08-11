# ACTION PERMISSION MATRIX

| Module | Entity | Context Action | Required Permission | Allowed Roles | Confirmation Required | Audit Required |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **User Directory** | `User` | `users.suspend` | `users.suspend` | `SUPER_ADMIN_CEO`, `COUNTRY_HEAD` | **YES** | **YES** |
| **User Directory** | `User` | `users.revoke_sessions` | `users.revoke_sessions` | `SUPER_ADMIN_CEO`, `COUNTRY_HEAD` | **YES** | **YES** |
| **Reseller Hub** | `Reseller` | `reseller.allocate` | `reseller.allocate` | `SUPER_ADMIN_CEO` | **YES** | **YES** |
| **Anti-Fraud** | `FraudAlert` | `fraud.resolve` | `fraud.resolve` | `SUPER_ADMIN_CEO`, `SAFETY_MODERATOR` | **YES** | **YES** |
| **Moments Feed** | `Moment` | `moments.moderate` | `moments.moderate` | `SUPER_ADMIN_CEO`, `SAFETY_MODERATOR` | **YES** | **YES** |
| **System Config** | `Config` | `config.rollback` | `config.rollback` | `SUPER_ADMIN_CEO` | **YES** | **YES** |
| **Feature Flags** | `Flag` | `flags.toggle` | `flags.toggle` | `SUPER_ADMIN_CEO` | **YES** | **YES** |
