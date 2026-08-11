# ACTION DATABASE MAP

| Action Key | Target Table / Model | Primary State Change | Audit Table Target |
| :--- | :--- | :--- | :--- |
| `users.update_status` | `User` | Updates `status` field (`ACTIVE`/`SUSPENDED`/`BANNED`) | `prisma.auditLog` |
| `reseller.allocate_diamonds` | `Reseller` / `User` | Updates `diamonds` & creates `ResellerTransaction` record | `prisma.auditLog` |
| `anti_fraud.resolve_case` | `FraudAlert` | Updates `status` field (`RESOLVED`/`FALSE_POSITIVE`) | `prisma.auditLog` |
| `moments.moderate_post` | `Moment` | Updates `status` field (`PUBLISHED`/`RESTRICTED`/`REMOVED`) | `prisma.auditLog` |
| `system_config.update` | `SystemConfig` | Updates `configValue` & increments `version` | `prisma.auditLog` |
| `feature_flags.toggle` | `FeatureFlag` | Toggles `isEnabled` boolean state | `prisma.auditLog` |
