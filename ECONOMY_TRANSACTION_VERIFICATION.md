# ECONOMY TRANSACTION VERIFICATION

## 1. Idempotency & Safety Protocol

1. **Client Request**: Client submits transfer request with `transactionId` UUID and amount.
2. **Server Validation**: Backend verifies sender balance, recipient account status (`ACTIVE`), and transfer velocity caps.
3. **Database Transaction**: Atomic `$transaction` debits sender, credits receiver, creates `ResellerTransaction` ledger record, and logs to `prisma.auditLog`.
4. **Realtime Broadcast**: Socket.IO emits `reseller.diamonds.allocated` event after successful DB commit.
5. **Client Refresh**: Recipient Flutter app updates wallet balance; Admin Economy Monitor displays new ledger line item.
