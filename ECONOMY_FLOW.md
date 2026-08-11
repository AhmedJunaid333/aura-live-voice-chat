# ECONOMY FLOW SPECIFICATION

```
               ADMIN ALLOCATION
                      │
                      ▼
            BACKEND ECONOMY SERVICE
                      │
                      ▼
            VALIDATION & RISK CHECK
                      │
                      ▼
             LEDGER TRANSACTION
          (ResellerTransaction/Wallet)
                      │
                      ▼
              DATABASE COMMIT
                      │
                      ▼
            SOCKET.IO REALTIME EVENT
                      │
                      ▼
        RESELLER / USER WALLET UPDATE
```
