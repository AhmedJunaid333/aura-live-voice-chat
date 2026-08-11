# RECHARGE RBAC MATRIX

| Action Scope | End User | Reseller | Finance Admin | Root / CEO |
| :--- | :---: | :---: | :---: | :---: |
| `recharge.create_order` | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** |
| `recharge.view_history` | **OWN** | **OWN** | **ALL** | **ALL** |
| `recharge.verify_manual` | DENY | DENY | **ALLOW** | **ALLOW** |
| `recharge.configure_packages` | DENY | DENY | DENY | **ALLOW** |
