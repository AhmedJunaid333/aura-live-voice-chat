# HOST PERMISSION MATRIX

| Permission Scope | Broadcaster Host | BD Manager | Agency Manager | Admin | CEO |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `live.broadcast` | **ALLOW** | DENY | DENY | DENY | DENY |
| `live.manage_seats` | **OWN_ROOM** | DENY | DENY | **ALLOW** | **ALLOW** |
| `host.view_earnings` | **OWN_DATA** | DENY | **ASSIGNED** | **ALLOW** | **ALLOW** |
| `host.apply` | **ALLOW** | DENY | DENY | DENY | DENY |
| `host.verify` | DENY | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** |
