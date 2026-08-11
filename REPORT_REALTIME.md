# ABUSE REPORT REALTIME SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `safety.report.created` | `{ reportId, targetType, category, severity, timestamp }` | Admin Reports Center |
| `safety.report.assigned` | `{ reportId, assignedTo, timestamp }` | Assigned Safety Moderator |
| `safety.action.created` | `{ targetUserId, actionType, reason, timestamp }` | Client App & Audio Room Services |
