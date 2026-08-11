# DIAMOND LEDGER VERIFICATION SPECIFICATION

## Executive Summary
This document specifies the immutable financial ledger structure and transaction verification for all diamond allocations, peer-to-peer transfers, and wallet updates in **Aura Live Voice Chat**.

---

## 1. Immutable Ledger Schema Protocol

Every diamond movement MUST record an immutable ledger entry (`ResellerTransaction` / `WalletTransaction`) before balance updates or realtime events:

```
                  CLIENT TRANSFER REQUEST
                             │
                             ▼
                 EXPRESS BACKEND VALIDATION
                             │
                             ▼
             POSTGRESQL ATOMIC $TRANSACTION
          ┌──────────────────┴──────────────────┐
          │ 1. Verify Idempotency Key (Unique)  │
          │ 2. Lock Reseller Row (SELECT FOR UPDATE)
          │ 3. Check Balance >= Amount          │
          │ 4. Create ResellerTransaction Ledger│
          │ 5. Decrement Reseller Stock         │
          │ 6. Increment Recipient Wallet       │
          │ 7. Write AuditLog Record            │
          └──────────────────┬──────────────────┘
                             │
                      COMMIT SUCCESS
                             │
                             ▼
                SOCKET.IO REALTIME EVENT
```

### Mandatory Ledger Fields:
- **`transactionId`**: Unique string identifier (e.g. `TX-7001`).
- **`idempotencyKey`**: Unique client request key (UUID v4) preventing duplicate execution.
- **`resellerId`**: Sender Reseller identifier.
- **`targetUserId`**: Receiver User ID (`UID 100001` - `999999`).
- **`amount`**: Diamond quantity transferred.
- **`type`**: Transaction classification (`COMPANY_ALLOCATION`, `P2P_TRANSFER`, `SUB_ALLOCATION`).
- **`status`**: Transaction status (`COMPLETED`, `FAILED`, `ROLLED_BACK`).
- **`createdAt`**: Immutable UTC timestamp.
