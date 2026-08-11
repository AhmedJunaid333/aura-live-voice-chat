# CMS AUDIENCE TARGETING SPECIFICATION

| Target Segment | Description | Filter Resolution |
| :--- | :--- | :--- |
| `ALL_USERS` | Broadcast to all active platform users | Global Socket.IO Broadcast |
| `HOSTS` | Broadcaster Host Accounts only | Filtered by `role = HOST` |
| `RESELLERS` | Diamond Reseller & Master Reseller Accounts | Filtered by `role = DIAMOND_RESELLER` |
| `VIP_LEVEL` | Users with VIP Level 1+ | Filtered by `vipLevel >= 1` |
