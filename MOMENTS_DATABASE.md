# MOMENTS DATABASE SPECIFICATION

| Table / Model | Primary Keys / Columns | Persistence Purpose |
| :--- | :--- | :--- |
| `Moment` | `id`, `authorId`, `mediaType`, `mediaUrl`, `caption`, `visibility`, `status`, `likesCount`, `commentsCount` | User Moments Master Catalog |
| `MomentComment` | `id`, `momentId`, `userId`, `text`, `createdAt` | Moment Comments Registry |
| `MomentReaction` | `id`, `momentId`, `userId`, `type`, `createdAt` | Likes & Reactions Registry |
