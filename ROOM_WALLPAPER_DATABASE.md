# ROOM WALLPAPER DATABASE SPECIFICATION

| Table / Model | Primary Keys / Columns | Persistence Purpose |
| :--- | :--- | :--- |
| `RoomWallpaper` | `id`, `name`, `slug`, `wallpaperType`, `price`, `status` | Room Wallpapers Master Catalog |
| `UserRoomWallpaper` | `id`, `userId`, `wallpaperId`, `status`, `acquiredAt` | User Wallpaper Ownership Inventory |
| `RoomWallpaperAssignment` | `id`, `roomId`, `wallpaperId`, `assignedBy`, `assignedAt` | Active Audio Room Theme Assignment |
