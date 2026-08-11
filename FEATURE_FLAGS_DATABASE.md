# FEATURE FLAGS DATABASE SPECIFICATION

| Table / Model | Primary Keys / Columns | Persistence Purpose |
| :--- | :--- | :--- |
| `FeatureFlag` | `id`, `key`, `name`, `category`, `type`, `currentValue`, `status`, `version` | Remote Feature Flags Master Catalog |
| `FeatureFlagHistory` | `id`, `flagKey`, `oldValue`, `newValue`, `version`, `changedBy`, `reason` | Immutable Configuration Audit Trail |
