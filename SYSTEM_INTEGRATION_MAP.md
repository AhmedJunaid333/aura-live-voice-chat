# SYSTEM INTEGRATION MAP

```
                    AURA LIVE FLUTTER APP
                           │
                           │ HTTPS / WebSockets
                           ▼
                    EXPRESS BACKEND API
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        AUTH SYSTEM    ECONOMY/LEDGER  REALTIME GATEWAY
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                 PRISMA SQLITE (dev.db)
                           │
                           ▼
                    ADMIN PORTAL (Next.js)
```
