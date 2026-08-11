# HOST FLOW SPECIFICATION

## 1. Host Lifecycle States

| Host Status | Flutter App Capabilities | Admin Control Options |
| :--- | :--- | :--- |
| `PENDING` | Standard User features; Live Room hosting locked | Review / Approve / Reject |
| `APPROVED` | Host onboarding unlocked; Room creation available | Activate / Suspend |
| `ACTIVE` | Full Audio Room hosting, mic seat control & gift monetization | Suspend / Lock Room / Kick |
| `SUSPENDED` | Room hosting disabled; gifts blocked | Restore / Ban |
