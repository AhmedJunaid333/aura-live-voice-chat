# MOMENTS ARCHITECTURE SPECIFICATION

```
                    REAL USER
                        ↓
                 CREATE MOMENT
                        ↓
                  MEDIA STORAGE
                        ↓
                     BACKEND
                        ↓
                   POSTGRESQL
                        ↓
                SAFETY / MODERATION
                        ↓
              ┌─────────┴─────────┐
              ↓                   ↓
        FOLLOWING FEED       EXPLORE FEED
              ↓                   ↓
              └─────────┬─────────┘
                        ↓
                    REAL USERS
                        ↓
             ┌──────────┼──────────┐
             ↓          ↓          ↓
           LIKE       COMMENT     REPORT
             ↓          ↓          ↓
             └──────────┼──────────┘
                        ↓
                  MODERATION QUEUE
                        ↓
                  ADMIN / SAFETY
                        ↓
                  REALTIME UPDATE
                        ↓
                  FLUTTER FEED
```
