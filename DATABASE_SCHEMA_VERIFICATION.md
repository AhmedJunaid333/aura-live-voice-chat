# DATABASE SCHEMA VERIFICATION SPECIFICATION

## 1. Relational Integrity & Key Constraints

| Model Table | Primary Key | Foreign Keys / References | Indexes & Constraints | Referential Action |
| :--- | :--- | :--- | :--- | :---: |
| **`User`** | `id` (Int) | `role`, `status`, `userLevel` | UNIQUE (`username`), INDEX (`role`, `status`) | Primary Identity |
| **`UserSession`** | `id` (Int) | `userId` -> `User.id` | INDEX (`userId`), INDEX (`token`) | CASCADE |
| **`Reseller`** | `id` (Int) | `userId` -> `User.id` | UNIQUE (`userId`), INDEX (`status`) | CASCADE |
| **`ResellerTransaction`** | `id` (Int) | `resellerId` -> `Reseller.id`, `targetUserId` -> `User.id` | UNIQUE (`transactionId`), UNIQUE (`idempotencyKey`), INDEX (`resellerId`, `createdAt`) | RESTRICT |
| **`FraudAlert`** | `id` (Int) | `subjectId` -> `User.id` | INDEX (`subjectId`), INDEX (`riskLevel`, `status`) | CASCADE |
| **`Moment`** | `id` (Int) | `authorId` -> `User.id` | INDEX (`authorId`, `createdAt`), INDEX (`status`) | CASCADE |
| **`AuditLog`** | `id` (Int) | `actorId` -> `User.id` | INDEX (`actorId`, `createdAt`), INDEX (`action`) | RESTRICT |
