# ADR-003: Multi-Provider Payment Abstraction Architecture

## Status
Accepted

## Context
Aura Live Voice Room requires multi-region payment processing support (Stripe, Google Play Billing, Apple IAP, Easypaisa, JazzCash).

## Decision
We implement the `IPaymentProvider` strategy interface:
- **Stripe / Apple / Google / Easypaisa / JazzCash Providers**: Each provider implements signature validation and idempotency handling.
- **Ledger Settlement**: Every successful payment order MUST emit an immutable `WalletLedgerEntry` record (`RECHARGE`).
