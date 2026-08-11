# AUDIO ROOM REALTIME SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `room.state.updated` | `{ roomId, title, status, timestamp }` | Connected Audio Room Participants |
| `room.seat.updated` | `{ roomId, seatNo, actionType, targetUserId, timestamp }` | Connected Audio Room Participants |
| `room.moderation.action` | `{ roomId, actionType, targetUserId, reason, timestamp }` | Connected Audio Room Participants & Admin Monitor |
