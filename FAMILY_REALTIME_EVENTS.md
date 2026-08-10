# FAMILY REALTIME EVENTS SPECIFICATION

| Socket.IO Event Name | Payload Data | Trigger Origin | Target Audience |
| :--- | :--- | :--- | :--- |
| `family.created` | `{ familyCode, familyName, message }` | Express API | Owner App Session & Lobby |
| `family.member.joined` | `{ familyId, familyRole, message }` | Express API | User Device & Guild Members |
| `family.level.updated` | `{ familyId, xpAdded, totalXP, level }` | Express API | All Guild Members |
| `family.member.removed` | `{ familyId, reason }` | Express API | Expelled Member & Guild Lobby |
