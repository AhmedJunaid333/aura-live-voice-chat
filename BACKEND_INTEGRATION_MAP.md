# BACKEND INTEGRATION MAP

| Backend Module | Route Handler File | Database Schema | Realtime Gateway | Single Source Role |
| :--- | :--- | :--- | :--- | :---: |
| **User Directory** | `server/src/routes/admin.routes.ts` | `User`, `UserSession` | Socket.IO Server | Authoritative Identity |
| **Reseller Hub** | `server/src/routes/admin.routes.ts` | `Reseller`, `ResellerTransaction` | Socket.IO Server | Authoritative Wallet Ledger |
| **Anti-Fraud** | `server/src/routes/admin.routes.ts` | `FraudAlert`, `RiskAssessment` | Socket.IO Server | Authoritative Security Risk |
| **Moments Feed** | `server/src/routes/admin.routes.ts` | `Moment`, `MomentComment` | Socket.IO Server | Authoritative Stream Feed |
