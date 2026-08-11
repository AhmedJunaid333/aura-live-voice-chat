# AUDIO ROOM RBAC MATRIX

| Action Scope | End User | Host Broadcaster | Country Head | Root / CEO |
| :--- | :---: | :---: | :---: | :---: |
| `rooms.view` | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** |
| `rooms.join` | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** |
| `rooms.seat_take` | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** |
| `rooms.moderate` | DENY | **OWNED ROOM** | **REGIONAL** | **GLOBAL** |
| `rooms.create` | DENY | **ALLOW** | **ALLOW** | **ALLOW** |
