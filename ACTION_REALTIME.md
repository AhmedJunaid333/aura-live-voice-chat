# ACTION REALTIME SPECIFICATION

| Action Triggered | Socket.IO Event Name | Target Realtime Subscribers |
| :--- | :--- | :--- |
| `users.update_status` | `user.status.updated` | Admin Portal & Target User Session |
| `users.revoke_sessions` | `user.sessions.revoked` | Target User App Session |
| `anti_fraud.resolve_case` | `security.alert.resolved` | Safety & Anti-Fraud Center |
| `moments.moderate_post` | `moment.moderated` | Flutter Public Feed Subscribers |
| `system_config.update` | `config.system.updated` | Admin Portal & Express Config Cache |
| `feature_flags.toggle` | `config.flag.updated` | All Mobile & Admin Clients |
