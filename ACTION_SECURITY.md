# ACTION SECURITY SPECIFICATION

## 1. Action Execution Protections

1. **Backend Validation**:
   - Actions are validated server-side. Client-side attempts to bypass permission checks or perform unauthorized actions yield HTTP 403 Forbidden.
2. **Idempotency & Double-Click Defense**:
   - High-risk actions (diamond allocations, status updates) check transaction state to prevent duplicate executions.
