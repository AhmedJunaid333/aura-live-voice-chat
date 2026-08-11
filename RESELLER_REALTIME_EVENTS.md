# RESELLER REALTIME EVENTS SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `wallet.credited` | `{ diamondsCredited, newBalance, message }` | Target Customer Account |
| `diamond.credited` | `{ totalDiamonds }` | Target Customer Device Session |
| `account.status_updated` | `{ role, message }` | Appointed Reseller Account |
