# BANNER TARGETING SPECIFICATION

| Target Audience | Description | Filter Resolution |
| :--- | :--- | :--- |
| `ALL_USERS` | Visible to all mobile app users | Global Display |
| `HOSTS` | Broadcaster Host Accounts only | Filtered by `role = HOST` |
| `RESELLERS` | Diamond Reseller & Master Reseller Accounts | Filtered by `role = DIAMOND_RESELLER` |
| `VIP_LEVEL` | Users with VIP Level 1+ | Filtered by `vipLevel >= 1` |
