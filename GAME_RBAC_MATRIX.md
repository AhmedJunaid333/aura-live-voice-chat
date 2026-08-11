# GAME RBAC MATRIX

| Action Scope | End User | Host Broadcaster | Event Admin | Root / CEO |
| :--- | :---: | :---: | :---: | :---: |
| `game.play` | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** |
| `game.session_create` | DENY | **ALLOW** | **ALLOW** | **ALLOW** |
| `game.configure_catalog` | DENY | DENY | DENY | **ALLOW** |
| `event.schedule_tournament` | DENY | DENY | **ALLOW** | **ALLOW** |
