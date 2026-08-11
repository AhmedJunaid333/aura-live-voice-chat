# FLUTTER INTEGRATION MAP

| Flutter Feature / Screen | Backend Endpoint | Realtime Event | Single Source State Effect |
| :--- | :--- | :--- | :--- |
| **Profile Screen** | `GET /api/v1/users/:id` | `user.status.updated` | Live profile data & active badges |
| **Reseller Portal** | `GET /api/v1/reseller/wallet` | `reseller.diamonds.allocated` | Live diamond inventory & transfer form |
| **Moments Stream** | `GET /api/v1/moments/feed` | `moment.created`, `moment.moderated` | Live moments feed & instant post removal |
| **Audio Rooms** | `GET /api/v1/rooms/active` | `room.status.updated` | Live mic seat allocation & room status |
