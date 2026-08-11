# EMERGENCY CONTROL SPECIFICATION

## 1. Emergency Lockdown & Maintenance States

1. **`NORMAL` Operational Mode**:
   - Platform routes and APIs are 100% accessible to authorized users.
2. **`MAINTENANCE` Mode**:
   - Web application and mobile app display scheduled maintenance banner; non-admin API routes return HTTP 503.
3. **`EMERGENCY_LOCKDOWN` Mode**:
   - Immediate platform freeze. All non-root sessions invalidated; wallet transfers and live streams frozen server-side.
