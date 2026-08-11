# ADMIN PORTAL ACCESS MATRIX

| Platform Portal Module | Root Admin | CEO | Super Admin | Finance | Operations | Reseller | Host |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Master Control Plane** | **ALLOW** | **ALLOW** | DENY | DENY | DENY | DENY | DENY |
| **CEO Command Studio** | **ALLOW** | **ALLOW** | DENY | DENY | DENY | DENY | DENY |
| **User Directory & KYC** | **ALLOW** | **ALLOW** | **ALLOW** | DENY | **ALLOW** | DENY | DENY |
| **Wallet & Finance Hub** | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** | DENY | DENY | DENY |
| **Security & RBAC Roles** | **ALLOW** | **ALLOW** | **ALLOW** | DENY | DENY | DENY | DENY |
| **Host Ecosystem Center** | **ALLOW** | **ALLOW** | **ALLOW** | DENY | **ALLOW** | DENY | **OWN** |
