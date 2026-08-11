# FEATURE FLAGS REALTIME SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `config.feature.updated` | `{ flagKey, newValue, timestamp }` | All App & Web Connected Clients |
| `config.maintenance.toggled` | `{ enabled, message, timestamp }` | All Connected Clients & Admin Monitor |
