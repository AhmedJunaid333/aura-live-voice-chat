# GIFT RBAC MATRIX

| Action Scope | End User | Host Broadcaster | Finance Admin | Root / CEO |
| :--- | :---: | :---: | :---: | :---: |
| `gift.send` | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** |
| `gift.lucky_play` | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** |
| `gift.configure_catalog` | DENY | DENY | DENY | **ALLOW** |
| `gift.view_analytics` | DENY | **OWN** | **ALL** | **ALL** |
