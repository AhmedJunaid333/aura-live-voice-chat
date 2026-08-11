# GIFT ANIMATION ENGINE SPECIFICATION

| Animation Asset Type | Render Engine | Preload / Caching | Fallback Asset |
| :--- | :--- | :--- | :--- |
| **SVGA Overlay** | SVGAPlayer Flutter / Web Canvas | Preloaded on room join | Static PNG |
| **Lottie Animation** | Lottie Flutter Player | Pre-cached in asset cache | Static PNG |
| **GIF Asset** | Native Image Render | Cached in memory | Static PNG |
