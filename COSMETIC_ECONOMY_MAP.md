# COSMETIC ECONOMY MAP SPECIFICATION

| Currency Type | Usage Scope | Debit / Credit Mechanics | Source of Truth |
| :--- | :--- | :--- | :--- |
| **Diamonds (💎)** | Purchase Avatar Frames & Entrance Effects | Atomic Balance Debit & Ledger Record | SQLite DB `prisma.user.diamonds` |
| **Coins / Beans (🪙)** | Secondary Unlock Currency | Atomic Balance Debit & Ledger Record | SQLite DB `prisma.user.coins` |
