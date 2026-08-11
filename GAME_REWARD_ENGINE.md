# GAME REWARD ENGINE SPECIFICATION

## 1. Server-Authoritative Reward Calculation

1. **Calculated Victory Multipliers**:
   - Random win multipliers (2x to 6x) and score points (2,000 to 10,000) are generated strictly on the backend Express server.
2. **Client Bypass Rejection**:
   - Flutter client requests attempting to submit `score = 999999` or `rewardAmount` are REJECTED and overwritten by server-side game engine calculations.
3. **Atomic Wallet Credit**:
   - Net profit (`rewardDiamonds - entryCost`) is updated atomically in `prisma.user` within a single database transaction.
