# ACTION RBAC SPECIFICATION

## 1. Role Scope & Territory Hierarchy

- **SUPER_ADMIN_CEO**: Global access to all administrative actions, diamond allocations, system rollbacks, and password resets.
- **COUNTRY_HEAD**: Territory-restricted administrative actions. Actions on entities outside authorized country code return HTTP 403 Forbidden.
- **SAFETY_MODERATOR**: Restricted to abuse reports triage, content moderation (`moments.moderate`), and fraud case investigation (`fraud.resolve`).
