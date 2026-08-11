# SYSTEM CONFIGURATION ROLLBACK SPECIFICATION

| Config Key | Target Version | Restored Value | Audit Action | Socket.IO Event |
| :--- | :---: | :---: | :--- | :--- |
| `system.room.max_seats` | Version 1 | `10` | `SYSTEM_CONFIG_ROLLED_BACK` | `config.system.rolledback` |
