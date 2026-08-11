# BANNER SECURITY SPECIFICATION

## 1. Security & CTA Validation

1. **Safe Internal CTA Route Enforcement**:
   - All CTA target actions (`OPEN_GIFT_STORE`, `OPEN_RECHARGE`, `OPEN_RESELLER`, `OPEN_GAME`, `OPEN_ROOM`) are validated against internal route schemas to prevent malicious open redirects.
2. **Media Upload Validation**:
   - Uploaded media MIME types and CDN file sizes are validated server-side.
