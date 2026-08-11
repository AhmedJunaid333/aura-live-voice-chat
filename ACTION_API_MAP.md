# ACTION API MAP

| Action Key | HTTP Method | Express Endpoint Path | Target Controller / Router |
| :--- | :---: | :--- | :--- |
| `users.update_status` | `POST` | `/api/v1/admin/users/update-status` | `adminRouter` (`server/src/routes/admin.routes.ts`) |
| `users.revoke_sessions` | `POST` | `/api/v1/admin/users/revoke-sessions` | `adminRouter` (`server/src/routes/admin.routes.ts`) |
| `users.force_password_reset` | `POST` | `/api/v1/admin/users/force-password-reset` | `adminRouter` (`server/src/routes/admin.routes.ts`) |
| `reseller.allocate_diamonds` | `POST` | `/api/v1/admin/reseller/allocate` | `adminRouter` (`server/src/routes/admin.routes.ts`) |
| `anti_fraud.resolve_case` | `POST` | `/api/v1/admin/anti-fraud/alert/resolve` | `adminRouter` (`server/src/routes/admin.routes.ts`) |
| `moments.moderate_post` | `POST` | `/api/v1/admin/moments/moderate` | `adminRouter` (`server/src/routes/admin.routes.ts`) |
| `system_config.rollback` | `POST` | `/api/v1/admin/system-config/rollback` | `adminRouter` (`server/src/routes/admin.routes.ts`) |
| `feature_flags.toggle` | `POST` | `/api/v1/admin/feature-flags/toggle` | `adminRouter` (`server/src/routes/admin.routes.ts`) |
