# PAYMENT WEBHOOK SECURITY SPECIFICATION

## 1. Webhook Signature & Idempotency Rules

1. **HMAC Signature Verification**:
   - Incoming payment webhooks are verified using server-side environment secrets. Unsigned or invalid webhooks return `HTTP 400 Bad Request`.
2. **Idempotency Protection**:
   - Each payment event includes a unique `idempotencyKey` or `providerTxnId`. Duplicate webhook deliveries are ignored, preventing double-crediting.
3. **Server-Side Final Authority**:
   - Flutter client flags like `paymentSuccess = true` are NEVER trusted alone. Credit occurs strictly via backend webhook handler.
