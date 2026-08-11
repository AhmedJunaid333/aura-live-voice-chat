# TRUST & SAFETY REALTIME SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `safety.report.created` | `{ reportId, category, severity, timestamp }` | Admin & Moderator Dashboards |
| `safety.action.created` | `{ targetUserId, actionType, reason, timestamp }` | Affected Client App & Room Services |
| `safety.appeal.resolved` | `{ appealId, decision, timestamp }` | Appellant User App & Safety Dashboard |
