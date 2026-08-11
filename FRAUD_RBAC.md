# FRAUD RBAC MATRIX

| Action Scope | End User | Safety Moderator | Country Head | Root / CEO |
| :--- | :---: | :---: | :---: | :---: |
| `fraud.view` | DENY | **ALLOW** | **ALLOW** | **ALLOW** |
| `fraud.assign` | DENY | **ALLOW** | **ALLOW** | **ALLOW** |
| `fraud.investigate` | DENY | **ASSIGNED** | **REGIONAL** | **GLOBAL** |
| `fraud.resolve` | DENY | **ASSIGNED** | **REGIONAL** | **GLOBAL** |
