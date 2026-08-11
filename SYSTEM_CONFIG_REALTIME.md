# SYSTEM CONFIGURATION REALTIME SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `config.system.updated` | `{ configKey, newValue, timestamp }` | All App & Web Connected Clients |
| `config.system.rolledback` | `{ configKey, rolledBackToVersion, timestamp }` | All Connected Clients & Admin Monitor |
