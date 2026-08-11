# DATABASE RELATIONSHIP MAP

| Primary Entity | Foreign Keys / Relationships | Enforced Referential Integrity |
| :--- | :--- | :--- |
| `User` (`id`) | `UserSession.userId`, `Reseller.userId`, `Moment.authorId`, `AuditLog.actorId` | CASCADE / RESTRICT |
| `Reseller` (`id`) | `ResellerTransaction.resellerId` | CASCADE |
| `Moment` (`id`) | `MomentComment.momentId` | CASCADE |
