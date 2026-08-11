# USER DATABASE SPECIFICATION

| Table / Model | Primary Keys / Columns | Persistence Purpose |
| :--- | :--- | :--- |
| `User` | `id`, `username`, `displayName`, `email`, `role`, `userLevel`, `coins`, `diamonds`, `isBanned` | Registered Users Master Catalog |
| `UserSession` | `id`, `userId`, `platform`, `deviceType`, `createdAt`, `revokedAt` | Active Authentication Sessions |
