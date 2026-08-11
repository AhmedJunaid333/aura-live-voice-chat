# DATABASE INTEGRATION MAP

| Model Name | Primary Keys | Foreign Keys / References | Single Source Role |
| :--- | :--- | :--- | :--- |
| `User` | `id` | `role`, `userLevel`, `isBanned` | Registered Users Master Catalog |
| `Reseller` | `id` | `userId` (`User.id`) | Official Reseller Network Catalog |
| `ResellerTransaction` | `id` | `resellerId` (`Reseller.id`), `targetUserId` | Financial Allocation Ledger |
| `FraudAlert` | `id` | `subjectId` (`User.id`) | Anti-Fraud Security Alerts Catalog |
| `Moment` | `id` | `authorId` (`User.id`) | User Moments Stream Feed Catalog |
| `SystemConfig` | `id` | `key` | System Configurations Master Table |
| `FeatureFlag` | `id` | `flagKey` | Remote Toggle Feature Flags Catalog |
| `AuditLog` | `id` | `actorId` (`User.id`) | Immutable Audit Trail Ledger |
