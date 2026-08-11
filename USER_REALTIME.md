# USER REALTIME SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `user.status.updated` | `{ userId, newStatus, timestamp }` | All App Connected Clients & Admin Dashboard |
| `user.sessions.revoked` | `{ userId, timestamp }` | Target User App Session & Admin Dashboard |
