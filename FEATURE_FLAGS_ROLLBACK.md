# FEATURE FLAGS ROLLBACK SPECIFICATION

| Flag Key | Target Version | Restored Value | Audit Action | Socket.IO Event |
| :--- | :---: | :---: | :--- | :--- |
| `features.gifting.enabled` | Version 4 | `true` | `FEATURE_FLAG_ROLLED_BACK` | `config.feature.updated` |
