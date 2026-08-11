# GAME SESSION SPECIFICATION

## 1. Live Room Game Session Lifecycle

```
Host User Creates Session in Live Room (`POST /games/session/create`)
             ↓
Socket.IO Event Broadcast (`game.started`) to Room Participants
             ↓
Authenticated Players Join Session
             ↓
Server Validates Player Eligibility & Entry Costs
             ↓
Server-Authoritative Gameplay Execution & Score Calculation (`POST /games/play`)
             ↓
Atomic Database Balance Update (Debit Entry Cost & Credit Victory Reward)
             ↓
Socket.IO Victory Broadcast (`game.finished`) & Wallet Credit (`diamond.credited`)
```
