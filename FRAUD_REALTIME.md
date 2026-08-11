# FRAUD REALTIME SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `security.alert.created` | `{ alertId, subjectType, subjectId, riskLevel, reason, timestamp }` | Admin Anti-Fraud Center |
| `security.alert.assigned` | `{ alertId, assignedTo, timestamp }` | Assigned Security Analyst |
| `security.alert.resolved` | `{ alertId, status, timestamp }` | Admin Dashboard & Trust & Safety |
