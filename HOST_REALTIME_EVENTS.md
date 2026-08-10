# HOST REALTIME EVENTS SPECIFICATION

| Socket.IO Event Name | Payload Data | Trigger Origin | Target Audience |
| :--- | :--- | :--- | :--- |
| `host.applied` | `{ userId, applicationDetails }` | Flutter Mobile | Admin & Agency Portals |
| `host.approved` | `{ userId, role: 'HOST' }` | Express Admin API | User Device & Host Center |
| `live.started` | `{ roomId, hostId, title, agoraToken }` | Express API | Global Room Lobby & Viewers |
| `gift.received` | `{ senderId, giftName, diamondValue }` | Express API | Broadcaster Stream & Room HUD |
| `account.status_updated` | `{ role: 'HOST', reason }` | Express API | Target User App Session |
