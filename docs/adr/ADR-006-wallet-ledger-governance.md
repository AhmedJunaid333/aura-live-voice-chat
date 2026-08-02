# ADR-006: Wallet Ledger Governance & Financial Integrity

## Status
Accepted

## Context
Financial integrity requires zero unauthorized coin/diamond mutations and idempotency key protection.

## Decision
Direct `balance = balance - price` queries are strictly forbidden across all modules. All coin debits and diamond credits MUST create immutable `WalletLedgerEntry` records.
