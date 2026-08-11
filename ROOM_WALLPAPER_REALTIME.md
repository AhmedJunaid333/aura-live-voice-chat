# ROOM WALLPAPER REALTIME SPECIFICATION

| Socket.IO Event Name | Payload Data | Target Audience |
| :--- | :--- | :--- |
| `room.wallpaper.updated` | `{ roomId, wallpaperId, wallpaperName, updatedAt }` | Connected Audio Lounge Room Participants |
| `room.wallpaper_catalog_updated` | `{ name, wallpaperType, price, timestamp }` | All App & Web Connected Clients |
