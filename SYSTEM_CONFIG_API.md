# SYSTEM CONFIGURATION API SPECIFICATION

| Endpoint | Method | Purpose | Response Payload |
| :--- | :---: | :--- | :--- |
| `/api/v1/admin/system-config` | `GET` | Fetch system settings, telemetry & audit history | `{ configs, configHistory, totalConfigs }` |
| `/api/v1/admin/system-config/create` | `POST` | Create new system configuration key | `{ success: true, configId, key, auditLogId }` |
| `/api/v1/admin/system-config/update` | `POST` | Update configuration value & broadcast | `{ success: true, configKey, newValue, auditLogId }` |
| `/api/v1/admin/system-config/rollback` | `POST` | Rollback setting to specified version | `{ success: true, configKey, rollbackVersion, auditLogId }` |
