# USER DIRECTORY ARCHITECTURE SPECIFICATION

```
                    FLUTTER APP
                         ↓
                AUTHENTICATION API
                         ↓
                    USER SERVICE
                         ↓
                    POSTGRESQL
                         ↓
              ┌──────────┼──────────┐
              ↓          ↓          ↓
          PROFILE     SESSION    PRESENCE
              ↓          ↓          ↓
              └──────────┼──────────┘
                         ↓
                  REAL USER RECORD
                         ↓
              ┌──────────┼──────────┐
              ↓          ↓          ↓
          ADMIN       SECURITY    ECONOMY
         PORTAL        CENTER      /LEDGER
              ↓          ↓          ↓
              └──────────┼──────────┘
                         ↓
                     REALTIME
                         ↓
                  ADMIN DASHBOARD
```
