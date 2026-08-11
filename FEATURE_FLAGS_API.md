# FEATURE FLAGS API SPECIFICATION

| Endpoint | Method | Purpose | Response Payload |
| :--- | :---: | :--- | :--- |
| `/api/v1/admin/feature-flags` | `GET` | Fetch active feature flags, telemetry & audit history | `{ flags, flagHistory, totalFlags, enabledFlags }` |
| `/api/v1/admin/feature-flags/create` | `POST` | Create new remote feature flag | `{ success: true, flagId, key, auditLogId }` |
| `/api/v1/admin/feature-flags/toggle` | `POST` | Toggle flag status (ON / OFF) | `{ success: true, flagKey, newValue, auditLogId }` |
| `/api/v1/admin/feature-flags/rollback` | `POST` | Rollback flag to specified version | `{ success: true, flagKey, rollbackVersion, auditLogId }` |
