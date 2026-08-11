# REALTIME EVENT CATALOG SPECIFICATION

| Domain Category | Event Name | Payload Structure | Destination Subscribers |
| :--- | :--- | :--- | :--- |
| **User Directory** | `user.status.updated` | `{ userId, newStatus, timestamp }` | Mobile App & Admin Portal |
| **User Directory** | `user.sessions.revoked` | `{ userId, timestamp }` | Target User Session |
| **Diamond Reseller** | `reseller.diamonds.allocated` | `{ resellerId, amount, transactionId, timestamp }` | Reseller App Session & Admin Portal |
| **Anti-Fraud Security** | `security.alert.created` | `{ alertId, subjectId, riskLevel, timestamp }` | Admin Safety Center |
| **Anti-Fraud Security** | `security.alert.resolved` | `{ alertId, status, timestamp }` | Admin Safety Center |
| **Moments Feed** | `moment.created` | `{ momentId, authorId, mediaType, caption, timestamp }` | Mobile Feed Clients & Admin Portal |
| **Moments Feed** | `moment.moderated` | `{ momentId, newStatus, timestamp }` | Author App Session & Admin Portal |
| **System Config** | `config.system.updated` | `{ key, value, version, timestamp }` | Express Server Cache & Admin Portal |
| **Feature Flags** | `config.flag.updated` | `{ flagKey, isEnabled, timestamp }` | All Mobile & Admin Clients |
