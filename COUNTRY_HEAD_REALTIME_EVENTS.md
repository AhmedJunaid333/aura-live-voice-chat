# COUNTRY HEAD REALTIME EVENTS SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `announcement.created` | `{ title, message, countryCode, timestamp }` | Territory App Users |
| `agency.status_updated` | `{ agencyName, status, message }` | Agency Owner Account |
| `account.status_updated` | `{ assignedCountry, message }` | Appointed Country Head |
