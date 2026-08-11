# MASTER SYSTEM CONFIGURATION SPECIFICATION

## 1. Configurable Platform Flags & Modes

| Feature Flag Key | Default State | System Scope | Server Enforcement |
| :--- | :---: | :--- | :--- |
| `LIVE_STREAMING` | `ENABLED` | Agora RTC Audio Rooms & Broadcasters | API Route Guard |
| `GIFTS_ECONOMY` | `ENABLED` | Virtual Gift Transfer & Diamond Credits | Transaction Guard |
| `RESELLER_RECHARGE` | `ENABLED` | Reseller Wholesale Diamonds Inventory | Reseller API Guard |
| `CP_RELATIONSHIPS` | `ENABLED` | Couple Pairs & Intimacy Points | CP Route Guard |
| `FAMILY_GUILDS` | `ENABLED` | Guild Roster & Monthly Missions | Family Route Guard |
| `VIP_NOBILITY` | `ENABLED` | VIP Tiers & Entitlement Badges | Profile Guard |
