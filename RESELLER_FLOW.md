# RESELLER FLOW SPECIFICATION

| Reseller Stage | Trigger Action | Backend Validation | Database Effect | Realtime Broadcast |
| :--- | :--- | :--- | :--- | :--- |
| **Application** | User submits Reseller form | Check identity & mobile verification | `Reseller` record created (`PENDING`) | `reseller.applied` |
| **Approval** | Admin approves application | RBAC check (`SUPER_ADMIN_CEO`) | `Reseller.status` -> `APPROVED` | `reseller.approved` |
| **Activation** | Admin activates reseller | Assign reseller credentials | `Reseller.status` -> `ACTIVE` | `reseller.status.updated` |
| **Allocation** | Company allocates diamonds | Validate reseller credit limit | `ResellerTransaction` ledger entry | `reseller.diamonds.allocated` |
