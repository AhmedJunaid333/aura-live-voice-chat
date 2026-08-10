# CP REALTIME EVENTS SPECIFICATION

| Socket.IO Event Name | Payload Data | Trigger Origin | Target Audience |
| :--- | :--- | :--- | :--- |
| `cp.requested` | `{ senderUID, senderUsername, message }` | Express API | Target Receiver Device |
| `cp.activated` | `{ cpLevel, intimacyPoints, cpRingName }` | Express API | Both Partner App Sessions |
| `cp.intimacy.updated` | `{ cpId, addedPoints, totalIntimacy, cpLevel }` | Express API | Both Partner App Sessions |
| `cp.ended` | `{ cpId, reason }` | Express API | Both Partner App Sessions |
