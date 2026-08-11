# COSMETIC SECURITY SPECIFICATION

## 1. Security & Anti-Cheat Validation

1. **Server-Side Price Validation**:
   - Asset prices are validated strictly on the backend. Client attempts to submit modified `price` parameters are rejected.
2. **Atomic Balance & Double-Debit Protection**:
   - Purchases execute within database transactions to prevent double debits or negative balance states.
