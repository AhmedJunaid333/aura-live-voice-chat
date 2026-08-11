# COUNTRY HEAD PERMISSION MATRIX

| Scope / Action | Assigned Territory | Unassigned Territory | Global Master Portal |
| :--- | :---: | :---: | :---: |
| `country.view_analytics` | **ALLOW** | DENY (HTTP 403) | **ALLOW (CEO/Root)** |
| `agency.approve_local` | **ALLOW** | DENY (HTTP 403) | **ALLOW (CEO/Root)** |
| `announcement.broadcast_local` | **ALLOW** | DENY (HTTP 403) | **ALLOW (CEO/Root)** |
| `system.global_lockdown` | DENY | DENY | **ALLOW (Root Only)** |
| `role.promote_root` | DENY | DENY | **ALLOW (Root Only)** |
