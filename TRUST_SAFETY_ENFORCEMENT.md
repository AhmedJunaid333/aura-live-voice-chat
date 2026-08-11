# TRUST & SAFETY ENFORCEMENT SPECIFICATION

| Enforcement Scope | Enforcement Target | Action Effect | Realtime Broadcast |
| :--- | :--- | :--- | :--- |
| **Temporary Suspension** | User Account | 24-Hour Room & Chat Lockout | `safety.action.created` |
| **Permanent Account Ban** | User Account | Permanent Account Deactivation | `safety.action.created` |
| **Chat Mute** | User Account | Restricted Voice/Text Messages | `safety.action.created` |
