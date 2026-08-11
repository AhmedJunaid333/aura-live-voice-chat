# AUDIO ROOM MODERATION SPECIFICATION

| Action Type | Target User | Reason | Audit Log Record | Socket.IO Event |
| :--- | :--- | :--- | :--- | :--- |
| `KICK` | User #100003 (@Dimple) | Violation of Community Guidelines | `AUDIO_ROOM_MODERATED` | `room.moderation.action` |
| `BAN` | User #100004 (@Sara_Vip) | Repeated Misbehavior | `AUDIO_ROOM_MODERATED` | `room.moderation.action` |
| `MUTE` | User #100003 (@Dimple) | Audio Interference | `AUDIO_ROOM_MODERATED` | `room.moderation.action` |
| `LOCK_ROOM` | Room #9901 | Host Requested Privacy | `AUDIO_ROOM_MODERATED` | `room.moderation.action` |
