# AUDIO ROOM ARCHITECTURE SPECIFICATION

```
             FLUTTER APP
                  ↓
           AUDIO ROOM UI
                  ↓
      ┌───────────┴───────────┐
      ↓                       ↓
   RTC ENGINE            ROOM API
      ↓                       ↓
AUDIO CONNECTION        DATABASE
      ↓                       ↓
      └───────────┬───────────┘
                  ↓
           ROOM SERVICE
                  ↓
         REALTIME EVENT BUS
                  ↓
          WEBSOCKET GATEWAY
                  ↓
      ┌───────────┴───────────┐
      ↓                       ↓
 FLUTTER USERS          ADMIN MONITOR
      ↓                       ↓
 LIVE ROOM STATE         LIVE ROOM STATE
```
