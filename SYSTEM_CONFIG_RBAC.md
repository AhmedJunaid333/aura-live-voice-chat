# SYSTEM CONFIGURATION RBAC MATRIX

| Action Scope | End User | Safety Moderator | Country Head | Root / CEO |
| :--- | :---: | :---: | :---: | :---: |
| `system_config.view` | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** |
| `system_config.edit` | DENY | DENY | **REGIONAL** | **GLOBAL** |
| `system_config.create` | DENY | DENY | DENY | **ALLOW** |
| `system_config.rollback` | DENY | DENY | DENY | **ALLOW** |
