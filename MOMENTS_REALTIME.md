# MOMENTS REALTIME SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `moment.created` | `{ momentId, authorId, mediaType, caption, timestamp }` | All Connected Flutter Feed Clients |
| `moment.moderated` | `{ momentId, newStatus, timestamp }` | Target Author Client & Feed Subscribers |
| `moment.assigned` | `{ momentId, assignedModerator, timestamp }` | Assigned Safety Moderator |
