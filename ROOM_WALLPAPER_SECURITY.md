# ROOM WALLPAPER SECURITY SPECIFICATION

## 1. Security & Room Control Protection

1. **Server-Side Host Authorization**:
   - Only authorized room hosts or admins can assign wallpapers to audio lounge rooms. Unauthorized assignment requests are rejected with `HTTP 403 Forbidden`.
2. **Atomic Balance & Double-Debit Protection**:
   - Wallpaper purchases execute within database transactions to prevent double debits.
