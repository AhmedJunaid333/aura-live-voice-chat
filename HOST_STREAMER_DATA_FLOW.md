# HOST STREAMER DATA FLOW DOCUMENTATION

## 1. Live Streaming & Earnings Flow Architecture

```
Broadcaster Host (Flutter Mobile App)
             ↓
Backend Validation (`POST /api/v1/rooms/create`)
             ↓
Agora RTC Channel Token Issued & Room Created (`prisma.liveRoom`)
             ↓
Real-time Socket.IO Broadcast (`room.created`)
             ↓
Viewers Join Stream & Send Virtual Gifts (`POST /api/v1/gifts/send`)
             ↓
Database Transaction (Coins Deducted from Viewer, Diamonds Credited to Host)
             ↓
Host Center Wallet & Target Live Hours Updated (`prisma.user`)
             ↓
Admin & CEO Portals Real-time Synchronization
```
