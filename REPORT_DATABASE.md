# ABUSE REPORT DATABASE SPECIFICATION

| Table / Model | Primary Keys / Columns | Persistence Purpose |
| :--- | :--- | :--- |
| `SafetyReport` | `id`, `reportNumber`, `targetType`, `reporterUserId`, `reportedUserId`, `category`, `status` | User & Room Abuse Reports Queue |
| `SafetyEvidence` | `id`, `reportId`, `evidenceUrl`, `storageKey`, `createdAt` | Evidence File Media Metadata |
| `ModerationAction` | `id`, `moderatorId`, `targetUserId`, `actionType`, `reason`, `createdAt` | Immutable Moderation Action Trail |
