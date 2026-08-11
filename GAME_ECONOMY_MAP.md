# GAME ECONOMY MAP SPECIFICATION

| Currency Type | Usage Scope | Debit / Credit Mechanics | Source of Truth |
| :--- | :--- | :--- | :--- |
| **Diamonds (💎)** | Game Entry Cost & Victory Prizes | Atomic Balance Debit & Credit | SQLite DB `prisma.user.diamonds` |
| **Coins / Beans (🪙)** | Host Victory Earnings & Rewards | Atomic Balance Credit | SQLite DB `prisma.user.coins` |
