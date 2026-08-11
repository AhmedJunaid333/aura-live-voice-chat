# ADMIN AUDIT LOG SPECIFICATION

| Audit Event Key | Executing Role | Target Resource | Log Data Payload |
| :--- | :--- | :--- | :--- |
| `FEATURE_FLAG_UPDATED` | `ROOT_SYSTEM_ADMIN` | `System:FeatureFlag` | Flag Name, Enabled State, Reason |
| `SYSTEM_LOCKDOWN` | `ROOT_SYSTEM_ADMIN` | `System:GlobalMode` | Target Mode, Reason |
| `ADMIN_SESSION_REVOKED` | `ROOT_SYSTEM_ADMIN` | `Admin:UID` | Admin UID, Reason |
| `ROLE_ASSIGNED` | `SUPER_ADMIN_CEO` | `User:UID` | Target Role, Previous Role, Reason |
