# ADMIN PORTAL ADJUSTMENTS MAP

| Portal Module | Target Sub-Component | Auto-Placed Navigation Parent | Real Backend Connection |
| :--- | :--- | :--- | :---: |
| **User Directory** | `UserDirectoryModule` | `User Directory` | `GET/POST /api/v1/admin/users/*` |
| **Reseller Hub** | `ResellerPortalModule` | `Aura Sell Diamonds` | `GET/POST /api/v1/admin/reseller/*` |
| **Anti-Fraud** | `AntiFraudModule` | `Anti-Fraud & Risk` | `GET/POST /api/v1/admin/anti-fraud/*` |
| **Moments Feed** | `MomentsFeedModule` | `Moments & Explore` | `GET/POST /api/v1/admin/moments/*` |
| **System Config** | `SettingsModule` | `System Configuration` | `GET/POST /api/v1/admin/system-config/*` |
| **Feature Flags** | `FeatureFlagsModule` | `Feature Flags` | `GET/POST /api/v1/admin/feature-flags/*` |
