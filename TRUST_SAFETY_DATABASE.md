# TRUST & SAFETY DATABASE SPECIFICATION

| Table / Model | Primary Keys / Columns | Persistence Purpose |
| :--- | :--- | :--- |
| `SafetyReport` | `id`, `reportNumber`, `reporterUserId`, `reportedUserId`, `category`, `severity`, `status` | Safety Violation Reports Queue |
| `SafetyEnforcement` | `id`, `targetUserId`, `actionType`, `reason`, `issuedBy`, `status`, `expiresAt` | Active User Sanctions & Bans |
| `SafetyAppeal` | `id`, `appealNumber`, `userId`, `enforcementId`, `reason`, `status`, `decision` | Enforcement Appeal Submissions |
