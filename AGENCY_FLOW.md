# AGENCY FLOW SPECIFICATION

| Agency Action Stage | Input Payload | Backend Handler | Database State Change | Realtime Event |
| :--- | :--- | :--- | :--- | :--- |
| **Invite Host** | `{ userId, agencyId, commissionRate }` | `POST /api/v1/admin/hosts/invite` | Creates `Host` record (`PENDING`) | `host.invited` |
| **Approve Host** | `{ hostId }` | `POST /api/v1/admin/hosts/approve` | Updates `Host` status (`APPROVED`) | `host.approved` |
| **Activate Host** | `{ hostId }` | `POST /api/v1/admin/hosts/activate` | Updates `User.role` to `HOST` & status `ACTIVE` | `host.status.updated` |
