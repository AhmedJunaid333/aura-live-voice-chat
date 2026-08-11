# BANNER API SPECIFICATION

| Endpoint | Method | Purpose | Response Payload |
| :--- | :---: | :--- | :--- |
| `/api/v1/admin/banners` | `GET` | Fetch active promotional banners & media assets | `{ banners, mediaAssets, totalImpressions }` |
| `/api/v1/admin/banners/create` | `POST` | Create & publish new promotional banner | `{ success: true, bannerId, auditLogId }` |
| `/api/v1/admin/banners/toggle` | `POST` | Pause or activate banner campaign | `{ success: true, bannerId, status }` |
| `/api/v1/admin/banners/track-click` | `POST` | Record banner impression & click event | `{ success: true, message }` |
