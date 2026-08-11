# EVENT CATALOG SPECIFICATION

| Domain Category | Socket.IO Event Name | Event Payload Data | Receiver Scope |
| :--- | :--- | :--- | :--- |
| **User & Presence** | `user.status.updated` | `{ userId, newStatus, timestamp }` | All Connected Mobile & Admin Clients |
| **User Sessions** | `user.sessions.revoked` | `{ userId, timestamp }` | Target User App Session & Admin Dashboard |
| **Diamond Reseller** | `reseller.diamonds.allocated` | `{ resellerId, amount, transactionId, timestamp }` | Reseller App Session & Admin Dashboard |
| **Anti-Fraud Security** | `security.alert.created` | `{ alertId, subjectId, riskLevel, timestamp }` | Admin Safety & Anti-Fraud Center |
| **Anti-Fraud Security** | `security.alert.resolved` | `{ alertId, status, timestamp }` | Admin Safety & Anti-Fraud Center |
| **Moments & Content** | `moment.created` | `{ momentId, authorId, mediaType, caption, timestamp }` | Mobile Feed Clients & Admin Portal |
| **Moments & Content** | `moment.moderated` | `{ momentId, newStatus, timestamp }` | Author App Session & Admin Portal |
| **System Configurations** | `config.system.updated` | `{ key, value, version, timestamp }` | Express Server Cache & Admin Portal |
| **Feature Flags** | `config.flag.updated` | `{ flagKey, isEnabled, timestamp }` | All Mobile & Admin Clients |
