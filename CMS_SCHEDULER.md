# CMS SCHEDULER SPECIFICATION

## 1. Scheduled Broadcast & Expiration Rules

1. **Server-Side Expiration**:
   - CMS announcements and broadcasts feature `expiresAt` timestamps. Expired content is filtered on the backend Express server.
2. **Scheduled Start Timers**:
   - Content scheduled for future start times (`scheduledAt`) transitions to `PUBLISHED` status via server-side cron timers.
