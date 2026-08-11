# AUDIO ROOM RTC SPECIFICATION

## 1. Agora RTC Voice Stream Engine

1. **Secure Token Generation**:
   - Agora RTC Channel tokens (`AGORA_TOKEN_SHA256_xxx`) are generated strictly server-side for each room numeric ID (e.g. `AGORA-CH-9901`).
2. **Low-Latency Audio Routing**:
   - RTC channels handle up to 8 active mic seats per room with sub-200ms voice latency.
