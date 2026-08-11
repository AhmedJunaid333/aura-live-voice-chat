# ENTRANCE REALTIME EVENTS SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `user.entrance` | `{ numericUserId, username, roomId, effectId, assetType, timestamp }` | Connected Live Room Participants |
| `cosmetic.catalog_updated` | `{ name, assetType, price, timestamp }` | All App & Web Connected Clients |
