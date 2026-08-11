# API INTEGRATION MAP

| Domain Category | Method | Endpoint Path | Database Query / Operation |
| :--- | :---: | :--- | :--- |
| **User Directory** | `GET` | `/api/v1/admin/users` | `prisma.user.findMany()` |
| **User Directory** | `POST` | `/api/v1/admin/users/update-status` | `prisma.user.update()` & `prisma.auditLog.create()` |
| **User Directory** | `POST` | `/api/v1/admin/users/revoke-sessions` | `prisma.userSession.updateMany()` & `prisma.auditLog.create()` |
| **Diamond Reseller** | `GET` | `/api/v1/admin/reseller` | `prisma.reseller.findMany()` |
| **Diamond Reseller** | `POST` | `/api/v1/admin/reseller/allocate` | `prisma.resellerTransaction.create()` & `prisma.auditLog.create()` |
| **Anti-Fraud** | `GET` | `/api/v1/admin/anti-fraud` | `prisma.fraudAlert.findMany()` |
| **Anti-Fraud** | `POST` | `/api/v1/admin/anti-fraud/alert/resolve` | `prisma.fraudAlert.update()` & `prisma.auditLog.create()` |
| **Moments Feed** | `GET` | `/api/v1/admin/moments` | `prisma.moment.findMany()` |
| **Moments Feed** | `POST` | `/api/v1/admin/moments/moderate` | `prisma.moment.update()` & `prisma.auditLog.create()` |
| **System Config** | `GET` | `/api/v1/admin/system-config` | `prisma.systemConfig.findMany()` |
| **Feature Flags** | `GET` | `/api/v1/admin/feature-flags` | `prisma.featureFlag.findMany()` |
