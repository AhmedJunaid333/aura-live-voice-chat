# SYSTEM CONFIGURATION DATABASE SPECIFICATION

| Table / Model | Primary Keys / Columns | Persistence Purpose |
| :--- | :--- | :--- |
| `SystemConfig` | `id`, `key`, `name`, `category`, `type`, `value`, `version`, `isCritical` | System Settings & Limits Master Catalog |
| `SystemConfigHistory` | `id`, `configKey`, `oldValue`, `newValue`, `version`, `changedBy`, `reason` | Immutable Configuration Audit Trail |
