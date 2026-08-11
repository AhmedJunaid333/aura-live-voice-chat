# ROOM WALLPAPER ECONOMY SPECIFICATION

| Currency Type | Usage Scope | Debit / Credit Mechanics | Source of Truth |
| :--- | :--- | :--- | :--- |
| **Diamonds (💎)** | Purchase Room Wallpapers & Themes | Atomic Balance Debit & Ledger Record | SQLite DB `prisma.user.diamonds` |
| **Coins / Beans (🪙)** | Host Earnings & Secondary Unlocks | Atomic Balance Debit & Ledger Record | SQLite DB `prisma.user.coins` |
