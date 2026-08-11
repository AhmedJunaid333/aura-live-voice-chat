# SYSTEM CONFIGURATION FLUTTER SPECIFICATION

## 1. Flutter Client Integration (`SystemConfigService`)

1. **Typed Access & Fallbacks**:
   - `SystemConfigService` provides typed getters (`systemConfig.getInt('system.room.max_seats')`, `systemConfig.getString('system.app.name')`) with graceful fallback defaults.
2. **Real-Time Subscription**:
   - Subscribes to Socket.IO `config.system.updated` broadcasts and dynamically updates app operational limits without requiring app restarts.
