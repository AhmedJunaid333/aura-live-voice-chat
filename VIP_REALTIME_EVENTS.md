# VIP REALTIME EVENTS SPECIFICATION

| Socket.IO Event Name | Payload Data | Trigger Origin | Target Audience |
| :--- | :--- | :--- | :--- |
| `vip.activated` | `{ userId, vipTier, expiryDate }` | Express Admin API | User Device & Profile HUD |
| `vip.expiring` | `{ userId, daysRemaining: 3 }` | Express Cron Daemon | User Mobile Notification |
| `level.updated` | `{ userId, level, xpAdded }` | Express API / XP Engine | User Device & Room Chat |
