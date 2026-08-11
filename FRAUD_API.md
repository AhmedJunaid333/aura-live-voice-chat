# FRAUD API SPECIFICATION

| Endpoint | Method | Purpose | Response Payload |
| :--- | :---: | :--- | :--- |
| `/api/v1/admin/anti-fraud` | `GET` | Fetch active fraud alerts, risk scores & telemetry | `{ alerts, fraudRules, totalAlerts, criticalAlerts }` |
| `/api/v1/admin/anti-fraud/alert/create` | `POST` | Trigger new fraud security alert | `{ success: true, alertId, riskLevel, auditLogId }` |
| `/api/v1/admin/anti-fraud/alert/assign` | `POST` | Assign security alert case to analyst | `{ success: true, alertId, assignedTo, auditLogId }` |
| `/api/v1/admin/anti-fraud/alert/resolve` | `POST` | Resolve alert or mark false positive | `{ success: true, alertId, status, auditLogId }` |
