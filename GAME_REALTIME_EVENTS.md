# GAME REALTIME EVENTS SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `game.started` | `{ sessionId, gameSlug, roomNumericId, host, maxPlayers, timestamp }` | Live Room Participants |
| `game.finished` | `{ winner, gameSlug, score, rewardDiamonds, timestamp }` | Live Room Participants |
| `diamond.credited` | `{ totalDiamonds, rewardDiamonds, message }` | Player Account Session |
