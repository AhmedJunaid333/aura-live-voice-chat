# AUDIO ROOM API SPECIFICATION

| Endpoint | Method | Purpose | Response Payload |
| :--- | :---: | :--- | :--- |
| `/api/v1/admin/audio-rooms` | `GET` | Fetch active audio rooms, seats grid & telemetry | `{ activeRooms, seatsGrid, recentGifts, recentComments }` |
| `/api/v1/admin/audio-rooms/create` | `POST` | Create & initialize new audio lounge room | `{ success: true, roomNumericId, rtcChannel, auditLogId }` |
| `/api/v1/admin/audio-rooms/rtc-token` | `POST` | Generate Agora RTC Channel Token | `{ success: true, channelName, token, expiresAt }` |
| `/api/v1/admin/audio-rooms/seat-action` | `POST` | Mute, lock, or release mic seat | `{ success: true, message }` |
| `/api/v1/admin/audio-rooms/moderate` | `POST` | Execute Kick, Ban, Mute, or Lock Room action | `{ success: true, actionType, auditLogId }` |
