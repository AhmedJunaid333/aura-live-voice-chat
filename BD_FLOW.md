# BD FLOW SPECIFICATION

| BD Action Stage | Input Payload | Backend Handler | Database State Change | Realtime Event |
| :--- | :--- | :--- | :--- | :--- |
| **Invite Agency** | `{ agencyName, ownerId, region }` | `POST /api/v1/admin/agency/invite` | Creates `Agency` record (`PENDING`) | `agency.invited` |
| **Review Application** | `{ agencyId, status, note }` | `POST /api/v1/admin/agency/review` | Updates `Agency` status (`APPROVED`) | `agency.approved` |
| **Activate Agency** | `{ agencyId }` | `POST /api/v1/admin/agency/activate` | Updates `Agency` status (`ACTIVE`) | `agency.status.updated` |
