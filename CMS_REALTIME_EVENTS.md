# CMS REALTIME EVENTS SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `cms.published` | `{ title, summary, contentType, publishedAt }` | All App & Web Connected Clients |
| `system.broadcast` | `{ title, message, broadcastType, priority, timestamp }` | All App & Web Connected Clients |
| `system.maintenance` | `{ maintenanceActive, message, timestamp }` | All App & Web Connected Clients |
