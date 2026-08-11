# FEATURE FLAGS RBAC MATRIX

| Action Scope | End User | Safety Moderator | Country Head | Root / CEO |
| :--- | :---: | :---: | :---: | :---: |
| `flags.view` | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** |
| `flags.toggle` | DENY | DENY | **REGIONAL** | **GLOBAL** |
| `flags.create` | DENY | DENY | DENY | **ALLOW** |
| `flags.rollback` | DENY | DENY | DENY | **ALLOW** |
