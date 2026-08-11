# FRAUD DATABASE SPECIFICATION

| Table / Model | Primary Keys / Columns | Persistence Purpose |
| :--- | :--- | :--- |
| `FraudAlert` | `id`, `alertNumber`, `subjectType`, `subjectId`, `riskScore`, `riskLevel`, `status`, `assignedTo` | Fraud Security Alerts Master Catalog |
| `RiskAssessment` | `id`, `subjectType`, `subjectId`, `riskScore`, `riskLevel`, `signals`, `createdAt` | Calculated Subject Risk Scores |
