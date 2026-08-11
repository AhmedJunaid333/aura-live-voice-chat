# PORTAL INTEGRATION VERIFICATION

| Portal Type | Activation Trigger | In-App Mobile Visibility | Web Admin Management | Status Control Effect |
| :--- | :--- | :--- | :--- | :--- |
| **Reseller Portal** | `Reseller.status = ACTIVE` | Reseller Center tab unlocked | `Aura Sell Diamonds` | Deactivation locks Mobile Reseller tab |
| **Host Center** | `Host.status = ACTIVE` | Audio Room Hosting unlocked | `Host Center` | Suspension locks live room creation |
| **Agency Hub** | `Agency.status = ACTIVE` | Agency Management tab unlocked | `Agency Management` | Deactivation disables host onboarding |
| **BD Hub** | `User.role = BD` | BD Control Center unlocked | `Agency & BD Hub` | Role update revokes BD access |
