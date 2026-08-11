# END TO END QA REPORT

| Ecosystem Integration Test | Input Event | Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| **User Directory Status Control** | Admin updates user status to `SUSPENDED` | Status updated in DB, audit logged & `user.status.updated` emitted | **PASSED** |
| **Reseller Diamond Allocation** | Admin allocates 500,000 diamonds | Ledger entry created, DB committed & `reseller.diamonds.allocated` emitted | **PASSED** |
| **Anti-Fraud Alert Resolution** | Analyst resolves fraud alert | Alert status updated, audit logged & `security.alert.resolved` emitted | **PASSED** |
| **Moments Content Moderation** | Moderator restricts spam post | Post restricted in DB, audit logged & `moment.moderated` emitted | **PASSED** |
| **Feature Flags Remote Toggle** | Admin toggles remote flag | Flag state updated in DB, audit logged & `config.flag.updated` emitted | **PASSED** |
