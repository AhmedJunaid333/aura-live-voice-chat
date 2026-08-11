# TRUST & SAFETY ARCHITECTURE SPECIFICATION

```
             FLUTTER APP
                  ↓
     ┌────────────┼────────────┐
     ↓            ↓            ↓
  PROFILE       CHAT       AUDIO ROOM
     ↓            ↓            ↓
  REPORT       REPORT       REPORT
     └────────────┼────────────┘
                  ↓
            SAFETY API
                  ↓
         TRUST & SAFETY DB
                  ↓
         MODERATION QUEUE
                  ↓
        ┌─────────┴─────────┐
        ↓                   ↓
    MODERATOR             ADMIN
        ↓                   ↓
  DECISION/ACTION       OVERSIGHT
        └─────────┬─────────┘
                  ↓
             ENFORCEMENT
                  ↓
        ┌─────────┼─────────┐
        ↓         ↓         ↓
      CHAT      ROOM      ACCOUNT
        ↓         ↓         ↓
        └─────────┼─────────┘
                  ↓
               REALTIME
                  ↓
             FLUTTER USER
```
