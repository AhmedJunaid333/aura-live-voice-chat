# LUCKY RNG SECURITY SPECIFICATION

## 1. Cryptographically Secure Lucky Engine Rules

1. **Server-Side Generation**:
   - Lucky draw reward multipliers (2x, 5x, 10x, 50x, 100x, 500x Jackpot) are calculated strictly on the backend Express server using cryptographically secure random number generators.
2. **Client Bypass Prevention**:
   - Flutter client requests containing `luckyResult` or `rewardAmount` parameters are IGNORED and overwritten by server-side RNG calculation.
3. **Atomic Balance Reward Credit**:
   - Entry cost is deducted and reward diamonds credited atomically in `prisma.user` within a single database transaction.
