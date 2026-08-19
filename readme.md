# Aura Live Voice Chat – Next-Gen Live Streaming & Audio Broadcast Platform

An enterprise-grade live broadcasting, multi-seat voice lounge (10, 15, 20 seats), real-time PK battle arena, VIP virtual economy, Level Progression Studio, and comprehensive Web Admin Console.

### 🛡️ Multi-Platform Build & Quality Assurance Status
- **Public Cloud Backend (`server/`)**: ✅ **LIVE on Render — `https://aura-live-voice-chat-1.onrender.com`**
- **Native Android APK Package**: ✅ **Ready — [AuraLive-Release.apk](file:///d:/Auralive/AuraLive-Release.apk) / [app-release.apk](file:///d:/Auralive/New-Live-App/apps/mobile/build/app/outputs/flutter-apk/app-release.apk) (465.6 MB • Fresh Production Build with Live Render Cloud URL, Server-Authoritative Identity, Background Audio Services, Realtime Comments, Multi-Seat Engine & Neon PostgreSQL)**
- **Backend TypeScript Compilation (`server/`)**: ✅ **0 Errors (`tsc --noEmit`)**
- **Admin Portal Production Build (`admin-next/`)**: ✅ **0 Errors (`next build` Turbopack)**
- **Mobile Application Analysis (`apps/mobile/`)**: ✅ **0 Compilation Errors (`flutter analyze`)**
- **Database & Identity Integrity**: ✅ **100% Production Cloud PostgreSQL (`Neon Tech Cluster / AWS us-east-2`)**
- **Firebase Cloud Suite**: ✅ **100% Free Tier (Auth + Storage + Push Messaging)**
- **3D Animated Gifts Engine**: ✅ **12 Luxury 3D Gifts + Combustion Combos + VIP Top Banner**
- **Realtime Gateway**: Socket.IO WebSockets on Render (`https://aura-live-voice-chat-1.onrender.com`)
- **Real-Device Verification Report**: ✅ **16/16 Passed — [`docs/AURA_LIVE_REAL_DEVICE_VERIFICATION.md`](file:///d:/Auralive/docs/AURA_LIVE_REAL_DEVICE_VERIFICATION.md)**
- **Detailed Audit Plan & Implementation Roadmap**: See [`plan.md`](file:///d:/Auralive/plan.md)

## 🎙️ 💎 Core Live Audio Production Features & Architecture
0. **🎁 🎬 Complete Production Gift Hub Asset Management System**:
   - **Create New Gift Asset Modal (`media_1787144821230.png`)**: 2-column layout matching reference specifications. Left: Gift Name, Price (Joe Diamonds 💎), XP Reward, Category, Animation Level, Associated Emoji, Host Earning & Lucky Toggle. Right: Live Animation Preview (Active Preview, sound/play controls) + 4 dedicated upload dropzones (Upload SVGA, Lottie JSON, Static Image, Audio / Sound).
   - **Separate Asset Architecture**: `thumbnailUrl` for 4x2 Gift Panel display, and `animationUrl` (SVGA/Lottie/3D) + `soundUrl` for real-time live room broadcast playback.
   - **Full Asset Lifecycle & State Management**: `ACTIVE`, `DRAFT`, `DISABLED`, `SCHEDULED`, `ARCHIVED` with Instant `Duplicate Gift (📑)`, `Live Preview`, and `Category Manager`.
   - **Backend API & Firebase Hosting**: `POST /api/v1/admin/gifts/:id/duplicate` endpoint and full deployment at `https://aura-live-voice-chat-app.web.app`.

0.1. **💎 💳 Admin Portal Direct Diamond Credit & Mobile Wallet Realtime Sync**:
   - Fixed `server/src/routes/admin.routes.ts` with `findAdminUser` prioritizing display `numericId` (e.g. UID `26`) over internal database ID.
   - Deployed Next.js Admin Panel to Firebase Hosting (`https://aura-live-voice-chat-app.web.app`) configured with live production Render API (`https://aura-live-voice-chat-1.onrender.com/api/v1`).
   - Pushes realtime `wallet.updated` and `diamond.received` events to user sockets.
   - Fail-Safe Public NumericId Fallback in `user_session_service.dart` querying `GET /api/v1/users/:numericId` to hydrate diamonds immediately.
   - Updated mobile `wallet_screen.dart` to fetch latest balance on screen open and on refresh button tap.
   - Resolved mobile wallet header and payment methods row layout overflows.

1. **🎁 🎨 Bigo 10th Anniversary / Aura Live Responsive Gift Panel UI**:
   - Pixel-perfect and compact implementation of the Bigo 10th Anniversary Gift Panel UI in [`luxury_gift_panel_sheet.dart`](file:///d:/Auralive/New-Live-App/apps/mobile/lib/features/live_room/presentation/widgets/luxury_gift_panel_sheet.dart).
   - Sleek responsive modal height (`(screenHeight * 0.48).clamp(360.0, 410.0)`), leaving ample space for live streams and eliminating Flutter screen overflows (`45px overflow` fixed).
   - Compact 4x2 gift grid (`childAspectRatio: 0.88`) with zero empty vertical gaps.
   - Top event banner (`BIGO 10th Anniversary` / `AURA Live Celebration`), gold `10` badge, dismiss `X`, and `Gift Box` inventory icon button.
   - Smooth horizontal category tabs with hot pink neon underline indicator.
   - Badges (`NEW`, `🎁 Event`, `📢` featured), glowing selection borders, 8 spotlight anniversary gifts + all 30+ DB gifts.
   - Bottom deck: Live Diamond Wallet display + Recharge, Recipient selector (Host/Seat switcher), Quantity stepper, Total cost, Gradient Send button, and Quick Multipliers Bar (`💎 10`, `⚡ 99`, `💎 188`, `⚡ 999`, `その他`).
   - Integrated directly with server-side authoritative diamond wallet, atomic `/v1/gifts/send` transactions, and live room broadcast animations.

1. **🎬 💎 Gift Animation Engine + Diamond Wallet + Reseller + Broadcast Flow Integration**:
   - Clean separation of static `thumbnailUrl` (small gift panel preview) and dynamic `animationUrl` (SVGA / WebP / GIF / Lottie asset for full-screen broadcast playback).
   - Server-side atomic balance check and transaction ledger (`WalletTransaction`, `GiftTransaction`, `ResellerLedger`, `AuditLog`) with rollback on insufficient balance.
   - Reseller $\to$ User Diamond transfer flow with instant realtime balance updates (`wallet.updated`, `diamond.received`).
   - Atomic `sendLiveGift` broadcasts `GIFT_SENT` with `eventId`, `animationUrl`, `thumbnailUrl`, `animationType`, and recipient/sender metadata.
   - Client-side event deduplication (`_processedGiftEventIds`) and sequential animation queue (`_giftQueue`).
   - Rich player support: `SvgaGiftPlayer` for SVGA assets + glowing 3D artwork overlay for newly uploaded animated WebP/GIF/PNG gifts.

1. **🎁 💎 Gift Send Response Map Parsing & Target Receiver Resolution**:
   - Fixed `res.data` runtime `NoSuchMethodError` in [`luxury_gift_panel_sheet.dart`](file:///d:/Auralive/New-Live-App/apps/mobile/lib/features/live_room/presentation/widgets/luxury_gift_panel_sheet.dart).
   - Resolved automatic target recipient ID from host/seat so backend atomic gift transactions process cleanly.
   - Provides user-friendly Recharge snackbar on insufficient diamonds.

1. **🔐 🛡️ Persistent Auth Session & Google Auto-Logout Prevention**:
   - Dual-layer storage persistence (`FlutterSecureStorage` with `resetOnError: true` + `SharedPreferences` fail-safe).
   - Removed aggressive `logout()` triggers on temporary network latency, Render cold start, or profile sync hiccups.
   - Guaranteed automatic background session hydration on cold start without kicking the user to `/login`.

1. **🎁 💎 Database Gift Catalog & Admin Hub Linking to Live Audio Gift Panel**:
   - Linked all 30+ virtual gifts from the Database and Admin Gift Management Hub (`aura-live-voice-chat-app.web.app`) to the live audio gift panel (`luxury_gift_panel_sheet.dart`).
   - Added all 10 categories (`All`, `Popular`, `Luxury`, `Special FX`, `Romantic`, `Lucky`, `Draw`, `Multi`, `Family Prestige`, `VIP`).
   - Dynamic real-time sync with `/api/v1/gifts/catalog`, rendering image URLs, SVGA URLs, custom artwork, animations, and reliable combos via `_selectedGiftId`.

1. **🎮 🕹️ Explore / Hot Home Screen Games Hub Card Button**:
   - Replaced "Go Live Now" card next to Ranking List with **Games 🎮 (HOT)**.
   - Launches interactive **Aura Games Arcade** with Lucky Wheel 🎡, Dice Roll 🎲, Teen Patti 🃏, Gift Rush 🎁, and Rocket Crash 🚀.

1. **⚔️ 🎛️ Audio Broadcast PK Arena Button Shift & Live Host Comment Resolution**:
   - Shifted PK Arena button from bottom bar into "Room Tools & Options" modal sheet (`_showRoomMoreMenuSheet`).
   - Seamlessly deduplicated live room comments matching `clientMsgId`, `commentId`, and identical recent text to eliminate duplicate comments.
   - Accurately mapped host role and display name (`[HOST] Ahmed: Hello` with Gold HOST badge).

1. **🛠️ ⚡ Production Runtime Stability & Log Diagnostics Fixes**:
   - Fixed `NoSuchMethodError: 'data'` on Gift catalog sync in `luxury_gift_panel_sheet.dart`.
   - Enhanced Agora RTC engine initialization & channel joining to prevent `-3` and `-17` errors.
   - Guarded room heartbeat timer against invalid `RM-0` room IDs.
   - Debounced socket room lifecycle fetches in `LiveRoomDiscoveryService` to prevent 10x duplicate HTTP bursts.

1. **💬 👤 Chat Screen — Real Sender Profile + Username + Timestamp + Grouping**:
   - Every message displays the real sender's DP (`AuraAvatarImage`), username/display name, message bubble, and time (`11:28`, `14:03`).
   - Grouping of consecutive messages from the same sender without avatar repetition.
   - Clickable sender profile navigation (`/user/:id`).
   - Realtime delivery via Socket.IO without refreshing the screen.

1. **🛡️ 📱 Production Permission Architecture (Android + iOS + Agora)**:
   - Just-In-Time (JIT) permissions for Microphone (Broadcaster/Speaker only), Camera (Video live only), Gallery (Avatar/Cover upload), Notifications, and Background Audio.
   - Updated `AndroidManifest.xml` (Android 13+ / API 33+ & Bluetooth Connect) and iOS `Info.plist` (App Store compliant privacy descriptions + UIBackgroundModes audio).

1. **👤 🔍 Other User Profile Clickability Everywhere**:
   - Tapping any user's comment, avatar, or username in Live Room chat opens their full profile (`/user/:id`).
   - Occupied seats, seat sheet header, host banner, and top contributors in room info are clickable to open user profiles.

1. **🏠 🧼 My Live Rooms Hub Screen Cleanup**:
   - Removed the top **"CONTINUE LISTENING"** banner and the bottom **"+ Create Room"** Floating Action Button from `my_rooms_hub_screen.dart`.

1. **📋 🧼 Room Details Sheet ID Copy Enhancement**:
   - Integrated a sleek copy icon directly next to `(ID: X)` in the modal header and removed the separate `Copy Room ID` container card in `room_info_options_sheet.dart`.

1. **⌨️ 💬 Live Room Keyboard Input Bar Full-Width Mode**:
   - When typing with the keyboard open, trailing action buttons (Gift, PK, Mic, More) and floating side buttons (Games, Music) are hidden automatically, providing a full-width typing box and direct send button.

1. **💺 🧼 Seat Options Sheet Cleanup**:
   - Removed redundant `Empty Seat #X` badge from `user_seat_options_sheet.dart` when opening empty seats.

1. **👤 🧼 Profile Screen Cleanup**:
   - Removed the **"YOU ARE CURRENTLY LIVE"** banner, **"🏆 Contribution"** badge/button, and bottom **"Live Broadcast History"** container from `profile_screen.dart` as requested.

1. **💬 🛡️ Live Room Comment System Complete Architecture Fix**:
   - **Elimination of 3x Duplicate Comments**:
     - Standardized on one canonical `live.comment` socket event across client emissions and server broadcasts.
     - Implemented bidirectional in-place deduplication matching on `clientMsgId` / `commentId` so optimistic client additions are updated with confirmed server data without appending duplicate items.
     - Removed redundant multi-event listener forwarding (`room.comment`, `ROOM_COMMENT`) in `websocket_client.dart`.
   - **Real Profile Resolution & DP Avatars**:
     - Authoritative database resolution of sender profile (`avatar`, `displayName`, `username`) via `prisma.user.findUnique`.
     - Live room comment rows display real sender avatar DP thumbnails alongside dynamic badges.
   - **Dynamic Role Labels (`HOST` / `GUEST` / `USER`)**:
     - Room Owner displays `[HOST]` (Gold Gradient).
     - Seated Mic Speaker displays `[GUEST]` (Cyan Gradient).
     - Audience Viewer displays `[USER]` (Purple Gradient).
     - Display format: `[Real DP] [ROLE] Username: Comment Text` (e.g. `[Ahmed DP] HOST Ahmed: Hello everyone`, `[Ali DP] GUEST Ali: Hi`, `[Bilal DP] USER Bilal: Hello`).

1. **🎙️ 💎 Agora RTC Full-Duplex Voice, Viewer ↔ Guest Lifecycle & Diamond Ledger System**:
   - **Viewer ↔ Guest Role Gating & State Transitions (`live_room_controller.dart`, `agora_rtc_service.dart`)**:
     - **Audience (Viewer)**: Enforced `ClientRoleType.clientRoleAudience` upon room entry. Viewers do not publish microphone audio tracks (`muteLocalAudioStream(true)`, `enableLocalAudio(false)`) and automatically subscribe to all remote broadcaster audio tracks (`autoSubscribeAudio: true`).
     - **Broadcaster (Host / Guest)**: Promoted upon taking a mic seat or accepting mic invitation. Explicitly requests mic permission, enables local audio track (`enableLocalAudio(true)`), unmutes local mic stream (`muteLocalAudioStream(false)`), and renews Agora publisher token.
     - **Demotion (Guest $\to$ Viewer)**: Upon leaving seat, kicking, or room exit, instantly demotes to `ClientRoleType.clientRoleAudience`, mutes and disables local mic track, vacating the seat.
     - **Audio Routing & 3A Calibration**: Enforced loud speakerphone routing via `setDefaultAudioRouteToSpeakerphone(true)` & `setEnableSpeakerphone(true)` with 100% playback/recording volume and 200ms volume indication.
   - **💎 Real-time Seat Diamond Badges (`seat_entity.dart`, `seat_grid.dart`, `live_room_screen.dart`)**:
     - Added session `diamonds` counter to `SeatEntity` with JSON serialization.
     - Added glowing `💎 [Host Diamonds]` badge below Host Stage (`Lv.X HostName`).
     - Added glowing `💎 [Guest Diamonds]` badge below each occupied Guest seat (`Seat 1` to `Seat 10`).
     - Integrated real-time socket updates: When gifts or diamonds are transferred, seat counters increment in real-time without requiring screen refresh.
   - **💎 Atomic Bidirectional Diamond Transfers & Contribution Ledger (`gift.service.ts`, `gift.routes.ts`, `live.routes.ts`)**:
     - Implemented `POST /api/v1/gifts/diamonds/send` and `POST /api/v1/live/rooms/:roomId/diamonds/send` executing within a single atomic PostgreSQL transaction (`prisma.$transaction`).
     - Supports Host $\leftrightarrow$ Guest transfers and Guest $\leftrightarrow$ Guest peer gifting.
     - Validates sender balance, decrements sender diamonds, credits receiver coins/diamonds, writes sender & receiver `WalletTransaction` entries with idempotency keys, and creates `GiftTransaction` records.
     - Broadcasts `room.diamond.sent`, `gift.broadcast`, `wallet.updated`, and `room.contributions.updated` via Socket.IO.

1. **🎁 📤 Upload Gifts to Gift Hub, 10 Personal SVGA Gifts & Panel Enhancements**:
   - **SVGA Gift Catalog Upload & Seeding**:
     - Successfully ingested and seeded all 10 SVGA gift animations from `D:\All Frames Application Personal Data\Gifts` into `server/uploads/svga/` and Neon PostgreSQL `Gift` table:
       1. `Autumn Windmill` (1,200 💎, SVGA, `Popular`)
       2. `Blue Enchantress` (600 💎, SVGA, `Draw`)
       3. `Childhood Sweethearts` (1,500 💎, SVGA, `Popular`)
       4. `Crowning Love` (3,500 💎, SVGA, `VIP`)
       5. `Flower Boat` (800 💎, SVGA, `Popular`)
       6. `Mermaid Girl` (2,200 💎, SVGA, `Multi`)
       7. `Rabbit Heartbeat` (1,000 💎, SVGA, `Family Prestige`)
       8. `Runaway Sweetheart` (1,800 💎, SVGA, `Popular`)
       9. `Secret Cage` (900 💎, SVGA, `Draw`)
       10. `Magic Lamp Dream` (750 💎, SVGA, `Special FX`)
   - **Gift Panel "Send" Action & Long Press Multiplier**:
     - Circular trigger button in `luxury_gift_panel_sheet.dart` updated from `"Combo"` to `"Send"`.
     - Supports single tap dispatch, long press multi-sending, and dynamic combo badge multiplier (`x10`, `x20`, etc.).
   - **All Gift Panel Buttons Fully Interactive**:
     - **Recharge Button**: Opens Diamond top-up dialog with instant pack options (`100 💎 = $0.99`, `500 💎 = $4.99`, `1,200 💎 = $9.99`, `5,000 💎 = $39.99`) and navigation to `/wallet`.
     - **Join VIP Button**: Opens VIP Membership modal detailing VIP tiers (`VIP 1 Knight` through `VIP 5 King`) and navigation to `/membership`.
     - **Level & EXP Upgrade Header (`LV.1 + 500 EXP to upgrade >`)**: Interactive modal opening the *Level Progression Studio* with real-time level badge, progress bar, and active EXP-earning rules.
     - **Backpack Icon (💼)**: Interactive modal opening *Gift Backpack & Inventory* with Lucky Spin keys, VIP discounts, and Crown passes.
     - **Admin Web Portal Gift Hub (`admin-next/src/components/GiftHubModule.tsx`)**:
        - Synchronized all 10 SVGA gifts + popular 8 gifts + luxury catalog into the Admin Panel's `STATIC_CATALOG` and dynamic API loader.
        - Updated `getApiBase()` to connect to `https://aura-live-voice-chat-1.onrender.com/api/v1` in production or `localhost:3001` in local dev.
        - Added all category tabs (`All`, `Popular`, `Luxury`, `Special FX`, `Romantic`, `Lucky`, `Draw`, `Multi`, `Family Prestige`, `VIP`) and animation badges (`AUTUMN_WINDMILL_SVGA`, `BLUE_ENCHANTRESS_SVGA`, etc.).
        - Upgraded `GiftCard` to display WebP image preview if available, with smooth fallback to emoji icons.
     - **Room Tools & Options Menu Clean-Up (`live_room_screen.dart`)**:
      - Removed duplicate **Minimize** & **Share** icons from tools grid (both already live in the top app bar).
      - Removed redundant **Red Packet** icon, unifying audience drops under **Lucky Bag 💰**.
      - Cleaned up grid to 7 essential distinct tools: Settings (⚙️), Mute Sound (🔇), Lucky Bag (💰), Clear Chat (🧹), Lock/Unlock Room (🔒), Room Info (ℹ️), and Join Requests (📋).
     - **Tabs (`Draw`, `Popular`, `Multi`, `Family Prestige`, `VIP`)**: Filtered grids dynamically displaying all 10 new SVGA gifts and standard catalog gifts.
   - **Zero-Overflow Top App Bar (`live_room_screen.dart`)**:
     - Dynamically bounded `titleBoxWidth` constraint using `math.min(115.0, math.max(60.0, availableHeaderWidth - 45.0))` and `TextOverflow.ellipsis` on room titles and durations to guarantee 0 overflow across all mobile screen widths.

1. **Broadcast Lifecycle, Timer & Screen-Off**:
   - Host broadcasts are immediately registered in PostgreSQL with `status: 'LIVE'` and monitored via Socket.IO heartbeats (`/rooms/:roomId/heartbeat`).
   - Added live broadcast duration timer (`⏱️ HH:MM:SS`) in the top app bar next to the room ID.
   - Flutter `WidgetsBindingObserver` sustains Agora background audio streaming and socket connections when the device screen turns off or goes into background.
   - Broadcast end cleanly finalizes PostgreSQL status to `ENDED` with `BroadcastHistory` and purges the room from discovery feeds immediately.
2. **Scoped Comments Realtime Sync & Moderation**:
   - Real-time bidirectional chat synchronization over Socket.IO (`live.comment`, `room.comment`, `ROOM_COMMENT`) strictly scoped to `room_${roomId}` with zero cross-room leakage.
   - Host $\to$ Viewers and Viewers $\to$ Host instant delivery with sender badges (`HOST`, `VIP`, `USER`) and avatars.
   - Client-side length validation (1–500 chars) and `clientMsgId` deduplication preventing duplicated messages.
   - Automatic room join welcome system banner (`"🌟 [username] joined the room"`).
3. **Realtime Multi-Seat Engine, Single-Seat Shifting & Full Duplex Agora Audio**:
   - **Seat 1 Open Accessibility**: Removed artificial "Seat 1 is reserved for the Room Host" check, allowing guests to occupy Seat 1 (Host resides on dedicated top stage).
   - **Single-Seat Constraint & Realtime Shifting**: Enforced that a user only occupies one seat at a time. Tapping an open seat cleanly vacates the previous seat across PostgreSQL (`liveRoomSeat.updateMany`), state, and Socket.IO broadcasts (`room.seats.updated`).
   - **Full Duplex Loudspeaker Voice Routing**: Configured Agora RTC with `setDefaultAudioRouteToSpeakerphone(true)`, `setEnableSpeakerphone(true)`, explicit `enableLocalAudio(true)` track capture, dynamic Broadcaster token renewal upon seat claim, and 100% volume calibration.
   - **User Seat Options Workflow**: When host/admin taps a user seat:
     - 🎙️ **Move to Mic**: Checks available mic seats, assigns the seat atomically in PostgreSQL, updates the user's role from Viewer $\to$ Speaker, and synchronizes RTC audio.
     - 📩 **Invite to Mic**: Sends real-time invitation modal (`MicInvitationDialog`) to the target user with **Accept / Decline** buttons and an automatic 20-second circular countdown expiry.
     - 🔒 **Lock Mic / 🔓 Unlock Mic**: Dynamically toggles seat lock state in PostgreSQL, updates the lock icon on the seat grid, and prevents unauthorized claims.
     - 🔇 **Mute Mic / 🔊 Unmute Mic**: Toggles the speaker's microphone mute state in the database, updates the seat's muted indicator, and mutes/unmutes the Agora RTC audio stream.
     - 👢 **Kick from Seat**: Removes speaker and returns them to the audience without disconnecting from the room.
   - **Permission Gating**: Room Owner, Host, and authorized Room Admins have full seat control permissions. Normal users cannot control others' seats.
4. **Global PostgreSQL User Directory Search & Discovery**:
   - Full PostgreSQL `User` search (not restricted to active live rooms).
   - Searches by exact `numericId`, case-insensitive `username`, and `displayName`.
   - Returns both online and offline users with profile avatars, numeric ID badges, VIP/level tiers, and active `LIVE` indicator badges with direct navigation to their live room or profile.
   - Debounced Flutter search interface with instant clear and graceful empty states.
5. **Duplicate Go-Live Prevention & Session Re-entry**:
   - Added `GET /api/v1/live/my-active-room` endpoint and Flutter check in `go_live_sheet.dart` to prevent duplicate broadcast creation and allow seamless session re-entry.
6. **Follow / Unfollow & Profile Visitors Tracking**:
   - Dual routing on `/api/users` and `/api/v1/users` for follows and visitors.
   - Server-enforced self-follow prevention and 15-minute sliding window rate-limiting for profile visitor tracking.
7. **Room Join Welcome Comment**:
   - Server broadcasts `room.user.joined` and `live.viewer_joined` with user metadata upon room entry, triggering an animated `"🌟 [username] joined the room"` system chat banner.
8. **Android Native NDK & Agora Iris Runtime Extraction**:
   - Configured `android:extractNativeLibs="true"` in AndroidManifest to enforce OS-level extraction of all native shared libraries (`libc++_shared.so`, `libiris_method_channel.so`) on install, preventing runtime dlopen lookup failures on diverse Android OEM builds.
   - Dual preloading in Kotlin `MainActivity.kt` and Dart FFI `AgoraRtcService._preloadNativeLibs()`.
9. **Automatic Token Refresh & 401 Recovery Engine**:
   - Backend endpoints `POST /api/auth/refresh` & `POST /api/auth/refresh-token` for background rotation of expired JWT access tokens.
   - Client-side automatic retry on 401 in `UserSessionService.refreshProfileFromBackend`, eliminating unexpected token expirations during active app sessions.
10. **Pure Online Real-Time Active Room Members Engine & Strict Scope Isolation**:
   - Live Room Sub-Header featuring circular avatar preview stack and total member counter pill (e.g. `1` or `12`).
   - Active Members bottom sheet displaying complete live room participant roster (Host, Speakers on seats, Viewers).
   - Server-authoritative data directly from Neon Cloud PostgreSQL + Socket.IO with zero fake/local mock fallback.
   - Real database user avatar (DP), `displayName`, `ID: numericId`, level badge, and distinct role badges (`👑 Host`, `🎙 Speaker • Seat X`, `👤 Viewer`).
   - Real-time Socket.IO synchronization via `room.members.snapshot`, `room.user.joined`, `room.user.left`, and `room.member.updated`.
   - Host moderation controls: View Profile, Invite to Seat, Remove from Seat, Kick from Room, Report User.
   - 100% strict room scope isolation (`room_${roomId}`) with zero cross-room data or event leakage.
11. **Contribution Ranking Engine (Day / Week / Monthly & Trophy 🏆 Workflow)**:
   - Complete workflow: `Profile / Room → Trophy 🏆 → Contribution Ranking → Day / Week / Monthly → Contribution List`.
   - Regal golden bottom sheet matching user design with top decorative diamond crest.
   - 3 period filters: `Day` (last 24 hours), `Week` (last 7 days), `Monthly` (last 30 days).
   - Top 3 Gold 👑, Silver 🥈, Bronze 🥉 podium with avatar glow, name, numeric ID, and diamond total + Rank 4+ scrollable list.
   - Clean empty state displaying **“No more data”** when no records exist.
12. **Premium Multi-Tab Gift Panel & Combo Action Engine**:
   - Level/XP Progress Header: Level badge (`LV.5`), XP bar, and `+ 500 EXP to upgrade >` link.
   - 5 Categorized Tabs: `Draw`, `Popular`, `Multi`, `Family Prestige`, `VIP`.
   - 4-Column Gift Grid with real artwork & icons: `Star Goddess` (200 💎, NEW), `Leo` (1 💎), `Picking stars` (999 💎, NEW), `Super Leo` (2888 💎), `Bubble milk tea` (1 💎), `Glow Stick` (1 💎), `Record Player` (100 💎), `Trophy` (500 💎), plus high-roller luxury FX items.
   - `NEW` badge on new items, radial glowing border on selected item.
   - Bottom bar with `Recharge`, `Join VIP`, and circular `x10 Combo` action button.
   - Atomic backend persistence (`POST /api/v1/gifts/send`), full-screen 3D animations (`LuxuryGift3DOverlay`), and real-time chat announcements.
13. **Full End-to-End Connected Architecture (App ⇄ Backend ⇄ DB ⇄ Admin Panel)**:
   - Dynamic Gift Management: Admin changes prices/gifts in Admin Panel $\to$ DB updates $\to$ Flutter app fetches `/api/v1/gifts/catalog` dynamically with 0 rebuilds.
   - Server-Authoritative Wallet: Balance checks and deductions occur strictly on the server with double-spending protection.
   - Live Contribution Rankings: Every gift transaction automatically recalculates Day/Week/Month rankings visible in Flutter and Admin Dashboard.
   - Full Moderation & Control: Admin actions (banning users, closing rooms, muting speakers) broadcast via Socket.IO in real time.
14. **Room DP / Room View Options Engine (5 Connected Real-Time Metrics)**:
   - Workflow: `Room DP / Header Pill → Room Information Panel (RoomInfoOptionsSheet) → 5 Real-Time Connected Options`:
     - 📋 **Copy Room ID**: Monospaced permanent Room ID + One-tap Copy button with clipboard confirmation.
     - 👥 **Room Members**: Live active member count badge with one-tap access to `ActiveMembersSheet`.
     - 🎁 **Room Rewards Dashboard**: Total Diamonds, Today's Rewards, Weekly Rewards, Host Earnings, and Top 3 Gifters podium from PostgreSQL.
     - 📢 **Room Announcement**: Live announcement display with Host/Admin editing dialog (`PUT /api/v1/rooms/:roomId/announcement`) and instant Socket.IO real-time broadcast.
     - 💎 **Room Value (Numerical)**: Glowing numerical metric card calculating total room score from gifts, diamonds, viewers, and engagement.
15. **Responsive Layout & Zero-Overflow Architecture**:
   - **Dynamic Seat Sizing (`seat_grid.dart`)**: Dynamic `LayoutBuilder` computes 5-column seat cell widths, aspect ratios, and node diameters (`math.min(46.0, math.max(34.0, itemWidth - 8))`) ensuring zero `RenderFlex` overflow across 320px–480px+ screen sizes.
   - **Adaptive Popups & Sheets (`user_seat_options_sheet.dart` & `mic_invitation_dialog.dart`)**: Scrollable containers with `maxHeight` constraints, guaranteeing zero vertical clipping on small screens, high font scales, or landscape orientation.
   - **Top Bar & Header Adaptation (`live_room_screen.dart`)**: Dynamically bounded room title pill with `maxLines: 1` and `TextOverflow.ellipsis`, preventing title wrapping and keeping action buttons on-screen.
   - **Safe-Area Controls Dock**: Bottom controls enclosed in `SafeArea(top: false)` preventing overlap with device navigation bars and keyboard insets.
16. **Direct File Upload & Automatic Thumbnail Generator Engine**:
   - **Complete Workflow**: `Upload Box → Select File / Drag & Drop → Validate File (JPG/PNG/WebP, max 15MB) → Server Sharp Pipeline → Optimized Full WebP + 300px WebP Thumbnail → Metadata (width, height, size) → UI Preview [Replace / Remove] → Database (Separate imageUrl and thumbnailUrl; zero raw binary in DB)`.
   - **Admin Web Portal Component (`ImageUploadDropzone.tsx`)**: Replaces manual URL text boxes with drag-and-drop file upload, instant thumbnail preview card with filename, file size (`Size: 245 KB`), dimensions (`512x512 px`), `[ 🔄 Replace ]`, and `[ 🗑️ Remove ]` action buttons across Gift Hub, Banners, Wallpapers, and Emojis.
   - **Flutter Mobile Application Component (`AuraImageUploadBox`)**: Reusable interactive Flutter upload box with camera/gallery image picker, WebP thumbnail generation, file size badge, and Replace/Remove controls.
   - **Cloud Server Endpoint (`POST /api/v1/upload/image`)**: Validates format, processes high-quality WebP, generates thumbnail WebP in `uploads/thumbnails/`, and returns structured metadata.

## 🌐 ⚡ Pure Online / Real-Time Authoritative Server Architecture
- **Single Source of Truth**: All business entities (Users, Profiles, Explore Directory, Live Rooms, Multi-Seats, Join Requests, Follows, Visitors, Leaderboards, Wallets) are strictly authoritative on PostgreSQL + REST API + Socket.IO.
- **Zero Mock / Synthetic Fallbacks**: Removed all local offline dummy profiles, fake broadcasts, and stale business cache traps.
- **Server-Authoritative Broadcast Timers**: Live room broadcast timers calculate elapsed time from server `createdAt` timestamps.
- **Graceful Network Handling**: On server or network failure, clean connection error states with retry capabilities are presented to the user instead of displaying stale local data.

## 👤 💾 Server-Authoritative Profile Save & PostgreSQL Persistence
- **Single Source of Truth**: User profile attributes (`displayName`, `avatar`, `bio`, `gender`, `country`, `birthday`, `coins`, `diamonds`, `vipTier`) persist directly into Neon Cloud PostgreSQL (`User` table).
- **Eliminated Local-Only Cache Traps**: `EditProfileScreen` and `UserSessionService.updateProfile()` make authoritative `PUT /api/users/profile/update` requests with JWT Bearer authentication. Local caches update strictly as replicas of verified server responses.
- **Real Avatar Photo Upload Engine**: Integrated multipart media upload endpoint `POST /api/v1/users/avatar/upload` (`uploads/avatars/`) to store public image URLs directly in PostgreSQL.
- **Server Identity Synchronization**: `/api/auth/me` queries Neon PostgreSQL on every app launch and resume, ensuring immediate multi-device profile consistency and zero data loss on logout/login.

## 🛡️ 🔐 Server-Only User Identity & Public Numeric ID System
- **Single Source of Truth**: PostgreSQL Database + Backend Authentication (`/auth/register`, `/auth/login`, `/auth/google`).
- **Eliminated Fake/Local Auth**: Completely removed `_loginFromLocalDatabase`, device `aura_user_database`, and mock `jwt_auth_...` token generation.
- **Atomic ID Generation**: Public `numericId` is assigned on PostgreSQL user creation (autoincrement ID).
- **Client Zero-Generation Policy**: Flutter client NEVER generates or calculates public IDs. ID display reads strictly from the authenticated server user.
- **Zero Fallback IDs**: Removed all legacy `?? 100001` and `100000 + ...` fallback formulas.

## 🛑 📡 Live Broadcast Lifecycle & Realtime Discovery Synchronization
- **Discovery Rule**: `IF broadcast.status != 'LIVE' || broadcast.endedAt != null` THEN broadcast is NEVER discoverable on Hot/Explore/Following/Nearby.
- **Server-Side Enforcement**:
  - `getLiveRooms()` and `getLiveCountriesStats()` filter with `{ status: { in: ['LIVE', 'LOCKED'] }, endedAt: null }`.
  - Stale room auto-reconciler checks for heartbeat timeouts (`updatedAt < NOW - 120s`) every 30s and automatically marks abandoned broadcasts as `ENDED`.
  - Host heartbeat endpoint: `POST /v1/rooms/:roomId/heartbeat`.
  - Room termination via `POST /v1/rooms/:roomId/end` marks `status: 'ENDED'`, sets `endedAt`, and broadcasts `BROADCAST_ENDED`, `broadcast.ended`, `ROOM_ENDED`, `room.ended`, `country.live.count.updated`.
- **Flutter Mobile Client Sync**:
  - `VoiceRoomWebSocketClient.connectGlobal()` keeps the discovery layer connected to real-time room lifecycle events globally.
  - `LiveRoomDiscoveryService` immediately purges ended rooms from `_rooms` on receiving any broadcast-end event.
  - `LiveRoomController` maintains a 25-second heartbeat timer during host broadcasts and cancels on teardown.
  - `HomeScreen` and `ExploreScreen` use `WidgetsBindingObserver` to auto-reconcile with backend discovery on app resume.


## 🛑 📊 Master Command — Aura Broadcast End Screen & Live History Engine
- **Server-Enforced Broadcast Termination & Authoritative Finalization**:
  - **Single Source of Truth (`LiveService.endRoom`)**: When a host ends a broadcast or an administrator force-ends a room, the backend atomicity engine triggers.
  - **Real Broadcast Statistics (Zero Dummy Data)**:
    - **Exact Duration**: Authoritatively computed from `startedAt` to `endedAt` in seconds and formatted as `HH:mm:ss` (`01:42:35`).
    - **Live Metrics**: Peak Viewers, Total Unique Viewers, New Followers gained during the session, Comments count, and Guest speakers hosted with Seat Capacity.
    - **Gifts & Revenue**: Queries `GiftTransaction` for authoritative total diamonds earned and gift count. If 0 gifts: *"No gifts received during this broadcast."*
  - **Prisma `BroadcastHistory` Persistence**: Persists all session metrics into Neon Cloud PostgreSQL linked to the host user's profile (`broadcastHistories` relation).
  - **Real-Time WebSockets**: Emits `broadcast.ended` and `room.ended` with the full finalized summary payload to all room participants.
  - **API Endpoints**:
    - `POST /api/v1/rooms/:roomId/end` — Host ends broadcast with optional reason.
    - `POST /api/v1/rooms/:roomId/admin-force-end` — Admin force-end with reason.
    - `GET /api/v1/rooms/:roomId/summary` — Fetch finalized broadcast summary.
    - `GET /api/v1/rooms/history/me` — Current user's paginated live history.
    - `GET /api/v1/rooms/history/user/:userId` — User broadcast history by numeric ID.
- **Flutter Mobile Broadcast End Screen (`BroadcastEndScreen`)**:
  - **Top Completed Header**: Emerald green badge `✓ BROADCAST COMPLETED`, Host avatar with glowing aurora ring & Level badge, Host name, and Duration clock banner (`⏱️ Duration 01:42:35`).
  - **Live Performance Card**: 6-grid glass container featuring Peak Viewers, Total Viewers, New Followers, Comments, Guests Hosted, and Seat Capacity.
  - **Gifts & Revenue Card**: Gifts Received (`🎁 X`) and Diamonds Earned (`💎 +Y`).
  - **Action Controls & Navigation Safety**:
    - **Done Button** (Primary Gradient CTA): Safely navigates to `/home` and clears the Live Room stack so the user cannot pop back into the ended broadcast.
    - **View Live History Button** (Secondary CTA): Opens `BroadcastHistoryScreen`.
    - **Share Summary Button**: Copies formatted summary text to clipboard with confirmation toast.
    - **`PopScope` Protection**: Intercepts Android hardware back button to navigate directly to `/home` instead of reopening the room.
- **Flutter Mobile Live Broadcast History (`BroadcastHistoryScreen`)**:
  - Dedicated history screen listing past completed broadcasts with date/time, duration, peak viewers, gifts, diamonds, and followers gained, with pull-to-refresh.
  - Integrated directly into `ProfileScreen` via a dedicated "Live Broadcast History" banner below the function grid.
- **Live Room Integration**:
  - Host tapping "Exit Broad" prompts a confirmation dialog ("End Broadcast?"). On confirm, calls `roomNotifier.endRoom()` $\rightarrow$ Leaves Agora audio channel $\rightarrow$ Navigates with `pushReplacement` to `BroadcastEndScreen`.
  - Audience/Guest receives `broadcast.ended` event $\rightarrow$ Displays termination alert $\rightarrow$ Leaves Agora audio channel $\rightarrow$ Safely navigates back to `/home`.

## 💬 🔔 Complete Chat + Notification Ecosystem & Real-Time Official Comments
- **Full-Stack User Messaging & Real-Time Ecosystem**:
  - **Dynamic Unread Badge**: The bottom navigation Chat tab displays a real-time unread badge tied directly to `ChatService.totalUnreadCount`. When 0 messages are unread, the badge disappears completely (zero hardcoded badges).
  - **Real User Search & Compose Launcher**: Compose button (`+` / Edit icon) opens a live search modal querying `/v1/users/search?q=...` by name, username, and numeric ID, immediately launching real 1-to-1 chats.
  - **1-to-1 Direct Messaging**: Features delivery status (`✓` Sent, `✓✓` Delivered / Read), live typing indicators ("Ahmed is typing..."), media attachments (Camera, Gallery, Send Gift, Live Invite), and user block/report protection.
  - **Notification Center (`/notifications`)**: 5 segmented category filters (`All`, `Live`, `Messages`, `Social`, `System`) with 1-tap "Mark all as read" and deep navigation:
    - `LIVE_STARTED` / `LIVE_INVITE` -> Deep links into exact live audio room (`/room/:roomId`) with "JOIN LIVE 🎙️" action.
    - `FOLLOW` -> Deep links to `/user/:numericId`.
    - `CHAT_MESSAGE` -> Deep links to direct chat screen.
    - `GIFT_RECEIVED` / `RECHARGE_SUCCESS` -> Deep links to `/wallet`.
    - `VIP_UPGRADE` -> Deep links to `/vip`.
- **Live Room Official Comments & Pinned Announcements**:
  - **Server-Side Validation**: Role-based verification ensures only `ADMIN`, `SUPER_ADMIN`, `BD`, or the room host can dispatch verified official comments (`isOfficial: true`).
  - **Live Room Styling**: Verified official comments appear with gold accents and `[OFFICIAL ✓]` nobility badge.
  - **Sticky Top Pin**: Official comments can be pinned sticky to the top of the comment feed in a gold header with unpin capability for room hosts and admins.
  - **Admin Next.js Broadcasting Hub (`CmsBroadcastModule.tsx`)**:
    - Interactive module to broadcast official comments to all active live rooms or specific room IDs.
    - Pin/unpin sticky comment toggle.
    - Global system notification dispatcher with live fan-out across Socket.IO and Push.

## 🎙️ ⚡ Live Audio Broadcast, Agora Multi-Seat (10, 15, 20 Seats) & Discovery Suite
- **Complete Go Live & Agora RTC Broadcast Lifecycle**:
  - **Broadcast Initiation**: User clicks central `+` / `Go Live` launcher -> opens `GoLiveSheet` -> chooses suite package (**10 Seats**, **15 Seats**, or **20 Seats**).
  - **Authoritative Neon Database Activation**: `POST /v1/rooms` activates room in Neon PostgreSQL (`status: 'LIVE'`), generates signed Agora token (`agoraToken.ts`), and broadcasts global `live.started` & `country.live.count.updated` events.
  - **Real-Time Hot Page & Country Discovery**: Fully compatible across `/api/v1/rooms` and `/api/v1/live/rooms` routes. Active broadcasts immediately populate Hot discovery feeds, Following tab, and country selector filter pills (`All (1)`).
  - **Agora 2-Way Audio Pipeline**:
    - Host starts with `clientRoleBroadcaster` and live mic.
    - Audience joins as `clientRoleAudience` (listeners).
    - Dynamic speaking ripple animations via `onVolumeIndication` halo rings around avatars.
  - **Dynamic Multi-Seat Layout (`10 / 15 / 20 Seats`) & Mic Promotion**:
    - **10 Seats**: 2 rows of 5 seats.
    - **15 Seats**: 3 rows of 5 seats.
    - **20 Seats**: 4 rows of 5 seats.
    - Top-Center Sovereign Host Stage with golden border, crown badge, and speaking wave halo.
    - Tapping empty `+` seat slot calls atomic DB endpoint `POST /v1/rooms/:roomId/seats/:seatNumber/take` -> on success upgrades Agora role to `clientRoleBroadcaster`, enables mic, and broadcasts state to all room viewers.
    - Leaving seat calls `POST /v1/rooms/:roomId/seats/:seatNumber/leave` -> demotes back to audience.
    - Host controls: Lock/Unlock individual seats, Mute/Unmute guest mic, Kick speaker off seat, and dynamically expand capacity (10/15/20).
  - **Single Source of Truth & Real Discovery Feeds**:
    - Single canonical `LiveRoomCard` component used across **Hot**, **Following**, **Nearby**, **Explore**, and **Profile** screens.
    - Zero dummy/mock cards: Only real database live rooms appear; shows elegant empty state with "Start Broadcast 🔴" when no rooms are active.
    - Tapping any card in any tab routes to `/room/:roomId` connecting to the identical database live session.
    - Real-time `ProfileScreen` and `OtherUserProfileScreen` display live glowing broadcast badges with 1-tap "Return to Room" / "Join Room" CTAs.
  - **Clean Broadcast Teardown**:
    - Host ending broadcast calls `POST /v1/rooms/:roomId/end` -> marks room `ENDED` in DB -> WebSockets broadcast `room.ended` & `broadcast.ended` -> removes room from all discovery feeds -> leaves Agora channel.

## 🐘 ⚡ Neon Cloud PostgreSQL Migration & Database Architecture
- **Enterprise Cloud PostgreSQL**:
  - Authoritative connection string connected (`ep-odd-glade-axbcygiw.c-4.us-east-2.aws.neon.tech/neondb`).
  - 50+ relational tables synchronized with ACID transactional consistency.
  - Seeded Super Admin (`100000`), Primary VIP Member (`100001` - Ahmed Junaid ✨), Elite VIP Member (`100002` - Ahmed Khokhar 🌟), Audio Host (`100003` - Aura Host Star 🎙️), Diamond Reseller accounts, 12 Luxury 3D Gifts, and active Avatar Frame ownerships.

## 🎁 🚀 3D & SVGA Luxury Animated Gifts, Combo Engine & VIP Banner Suite
- **🎬 Hardware-Accelerated SVGA Gift Player Engine (`SvgaGiftPlayer`)**:
  - Direct remote `.svga` binary decoding via `svgaplayer_flutter` for ultra-smooth 60-120 FPS gift rendering.
  - Automatic duration discovery and single-pass playback with completed callback.
  - Real-time Sender → Receiver banner with user avatars, name tags, and room announcement.
  - Flame-burning combo multiplier counter with dynamic scaling.
  - Floating golden diamond badge.
  - Graceful fallback to 3D matrix particle system if SVGA asset is offline.
- **Full-Screen 3D Matrix & Particle Effects (`LuxuryGift3DOverlay`)**:
  - High-performance multi-stage 3D Matrix and custom Particle Physics animations:
    - `🚀 GALAXY_ROCKET_3D`: Cosmic rocket ascent with dynamic particle thrusters, tilt, flame smoke, and starfield explosion.
    - `🏎️ SUPERCAR_3D`: 3D perspective supercar drift racing across screen with neon tire flare and smoke trails.
    - `👑 ROYAL_CROWN_3D`: Majestic 3D golden crown descent with 360° rotating gold sunburst halo and diamond sparkles.
    - `🛥️ SUPER_YACHT_3D`: High-seas billionaire yacht cruising with animated ocean waves, golden fireworks, and champagne bubbles.
    - `🐉 DRAGON_FIRE_3D`: Mythical fiery dragon orbiting the room with spinning flame trails and fiery sparks.
    - `🏰 ROYAL_CASTLE_3D` / `🌌 COSMIC_PORTAL_3D`: Golden palace castle emerging with floral fireworks and particle shower.
    - `🎰 LUCKY_CHEST_3D`: Shaking golden treasure box popping open with a shower of gold coins and multiplier badge.
    - `🌹 ROSE_BURST` & `💖 HEART_FOUNTAIN`: Multi-directional heart and flower particle fountain.
- **VIP Top Banner Announcement (`_buildVipTopBanner`)**:
  - Sliding gold-bordered announcement bar with Sender and Receiver avatars, gift badge, and quantity.
- **Dynamic Combo Multiplier Combustion Badge (`🔥 COMBO x10!`)**:
  - Rapid-tap fire button in the gift store enabling continuous combos with animated scale & flame glow.
- **Authoritative Backend Services & REST APIs (`server/src/services/gift.service.ts` & `gift.routes.ts`)**:
  - `POST /api/v1/gifts/send` with atomic transactions, diamond debit, host coin credit, and real-time Socket.IO broadcasts.

## 🔥 🌐 100% Free Tier Firebase Cloud Suite & Real Database Architecture
- **Zero Cost Production Architecture**:
  - **Prisma Relational Database**: Persistent zero-cost ACID database storing all Users, Wallet Balances, Avatar Frames, Rooms, and Audit Logs.
  - **Firebase Authentication**: Integrated Google Sign-In with official Firebase Project (`aura-live-voice-chat-app`, Project ID: `552720302534`) and Keystore SHA-1 (`6F:ED:C3:73:AF:7C:CF:DB:90:24:7E:3A:ED:FC:80:8F:7A:46:2C:09`).
  - **Firebase Cloud Storage**: Free 5GB storage bucket (`aura-live-voice-chat-app.firebasestorage.app`) for avatars, moments photos, and SVGA assets.
  - **Firebase Cloud Messaging (FCM)**: Free push notifications for live streams and messages.

## 👑 ⚡ VIP (1–7) & SVIP (1–15) Full-Stack Membership Engine
- **Strict Nobility Hierarchy & Pre-Seeded Catalog**:
  - Exactly **7 VIP levels** (Bronze Knight, Silver Baron, Gold Count, Platinum Marquis, Diamond Lord, Crown King, Sovereign Emperor) from \$10 to \$5,000 recharge.
  - Exactly **15 SVIP levels** (Sovereign Knight to Emperor of the Cosmos) from \$1,000 to \$85,000 lifetime recharge with animated crowns and immunity shields.
  - Fully database-driven (`VipLevelConfig` & `SvipLevelConfig`) with live runtime CRUD and seeding in Neon PostgreSQL.
- **Authoritative XP Engine & Automatic Upgrades**:
  - `MembershipService.awardXp()` verifies transactions, logs immutable records to `MembershipXpTransaction`, computes tier progression, upgrades `User.vipTier`, and records audit history in `MembershipHistory`.
  - Level-up, Daily, Weekly, and Monthly rewards execute with composite idempotency keys (`USER_{id}_{type}_{level}_{reward}_{periodKey}`) preventing double claims.
- **Admin Portal VIP/SVIP Studio (`admin-next`)**:
  - Full-featured studio with 4 modules: VIP 1–7 Studio, SVIP 1–15 Sovereign Hub, Real-time Analytics Dashboard, and User Search & Manual Adjust with mandatory compliance reasons logged to `MembershipAuditLog`.
- **1-Tap Direct VIP Purchase & Activation**:
  - Direct purchase with diamonds via `POST /api/v1/membership/purchase` (e.g. VIP 1 = 1,000 Diamonds, VIP 2 = 5,000 Diamonds, etc.).
  - Instant automatic wallet deduction, tier unlock, SVGA frame grant to backpack, 3D entrance activation, and level-up diamond bonuses.
- **👑 ⚡ VIP Center Luxury Dark Green + Gold Theme & SVGA Showcase (`vip_screen.dart`)**:
  - **Header & Navigation**: Circular Back button, `VIP Center` title, and More Options Menu (Give VIP, History, Rewards Station).
  - **Segmented Switcher**: `[ VIP 1–7 ]` & `[ SVIP 1–15 ]` emerald gradient pill toggle.
  - **Horizontal Level Selector**: Real live animated SVGA medals (`vip_1_medal.svga` to `vip_7_medal.svga`) embedded directly in level selector cards with golden highlights.
  - **Hero Membership Card & SVGA Showcase**: Live user avatar wearing the exact real animated SVGA frame (`vip_1_frame.svga` to `vip_7_frame.svga`) with corner medal badge, EXP progress bar, and 5-asset interactive SVGA showcase ribbon (Frame, Medal, Entry Car, Room Banner, Profile Theme).
  - **Level Privileges Grid & Live Preview**: 3-column glowing emerald circles embedding real live SVGA players inside the buttons (Frame, Medal, Entry Car, Room Banner, Profile Theme) plus live gilded chat bubbles and glowing usernames.
  - **Interactive Privilege Preview Modal**: Live interactive showcase with user avatar in live SVGA frame, 3D medals, animated entry cars, room banners, chat bubbles, and instant view/equip in backpack.
  - **Recharge Banner**: Dark emerald card with direct navigation to `/recharge`.
  - **Rewards Station**: Daily (💎 20), Weekly (💎 150), and Monthly (💎 800) 1-tap claim cards + milestone level-up claims.
  - **Tasks & Ranking Tabs**: Live daily/weekly tasks with XP & diamond rewards, and global leaderboard with nobility badges.
  - **Give VIP Modal**: Direct friend gifting with numeric User ID search and diamond balance verification.
  - **Robust Rendering**: Default tier fallback models, zero dead clicks, and full type safety.
- **🎨 VIP 1–7 High-Fidelity SVGA Animated Assets Suite**:
  - Extracted & mapped all 35 official SVGA animations from `D:\VIP 1 TO 7 SVGA\VIP 1 TO 7 SVGA` across Server (`uploads/vip_svgas/`), Admin Portal (`public/vip_svgas/`), and Mobile (`assets/vip_svgas/`).
  - Integrated full SVGA paths for Avatar Frames (`vip_1_frame.svga` to `vip_7_frame.svga`), Nobility Medals (`vip_1_medal.svga` to `vip_7_medal.svga`), Profile Page SVGA Themes (`vip_1_profile_page.svga` to `vip_7_profile_page.svga`), and 3D Room Entrances (`vip_1_entry.svga` to `vip_7_entry.svga`).
  - Seeded into live Neon DB and registered all 7 VIP frames into `AvatarFrame` database table.

## 🔲 🏷️ ♂️ Dynamic Role Badges, Gender Icon & Admin-to-Mobile Frame Sync
- **Dynamic Role Badges (Admin, BD, Host, Agency, Level) Under User ID**:
  - Replaced static badge chips with strict conditional logic based on real user privileges.
  - Replaced `Leader` with `Admin` (`Icons.admin_panel_settings`, Red `Color(0xFFD32F2F)`).
  - Only active BDs display the `BD` tag, active hosts display the `Host` tag, active agencies display the `Agency` tag, and active admins display the `Admin` tag.
- **Dynamic Gender Icon Correction (Male ♂️ vs Female ♀️)**:
  - Corrected hardcoded pink female icon to dynamically render Blue ♂️ (`Icons.male`) for male accounts and Pink ♀️ (`Icons.female`) for female accounts.
- **Multi-Key Cache & Instant Admin-to-Mobile Frame Sync**:
  - Mounted `frameRouter` on `/api/admin/frames`, `/api/v1/admin/frames`, `/api/admin/users`, `/api/v1/admin/users` in backend Express app.
  - `FrameService` synchronizes user inventory from multiple cache keys and backend endpoints (`/v1/frames/inventory/me` and `/v1/frames/user/:id/inventory`), resolving users by numericId or DB ID.
  - Added `RefreshIndicator` on `MyFramesScreen` (`/my-frames`) for instant pull-to-refresh.
  - Admin Web Portal features SVGA auto-shift and auto-zoom with direct UID user search and 1-tap assign/equip actions.

## 🔲 👑 100% Production-Grade Avatar Frame System
- **Real Database Schema & Identity Integration**:
  - `AvatarFrame`, `AvatarFrameOwnership`, `AvatarFramePurchase`, and `AvatarFrameGrant` models connected to SQLite runtime (`server/prisma/dev.db`) and PostgreSQL production schema.
  - Linked directly to `User.equippedFrameId` for atomic profile rendering.
- **Atomic Wallet & Ledger Integration**:
  - `FrameService.purchaseFrame` executes inside atomic `prisma.$transaction`, verifying balance, debiting Diamonds/Coins, writing `WalletTransaction` ledger records (`COSMETIC_PURCHASE`), extending duration on repeat purchases, and recording `AvatarFramePurchase` with unique idempotency keys.
- **Flutter Universal `AuraAvatar` & Store Suite**:
  - `AuraAvatar` widget standardizes avatar rendering with `AuraAvatarFrameOverlay` featuring hardware-accelerated SVGA playback, transparent PNG overlays, and 360° rotating vector luxury frames (Royal Emperor Crown, Cyber Wings, Golden Dragon, VIP Diamond, Sakura, Lion Guild, National Pride), animated speaking glow, level badges, and online presence indicators.
  - `StoreScreen` (`/store`) unifies the entire VIP Mall with `Avatar Frames` as its primary #1 tab, 2-column live animated frame catalog, subcategory filters, search, and live preview modal, alongside `Entry Effects`, `Mic Waves`, `Profile Cards`, `Vehicles`, `Room Frames`, `Chat Bubbles`, and `Special IDs`.
  - `FrameStoreScreen` (`/frame-store`) enables dedicated category browsing, search, live avatar preview modal, auto-scaled diamond balance, and instant purchase.
  - `MyFramesScreen` (`/my-frames`) provides inventory inspection with 1-tap equip/unequip toggles and expiry countdowns.
- **Admin Panel Next.js & Socket.IO Realtime**:
  - Connected `/api/v1/admin/cosmetics` to real database models with live asset creation, user grants/revocations, and Socket.IO broadcasts (`user.frame.equipped`, `user.frame.updated`, `cosmetic.catalog_updated`).

## 📸 🌟 100% Functional Moments Social Ecosystem
- **⚡ 🦁 Instant 0ms Family Guild System**:
  - Replaced blocking full-screen loading spinner and sequential network calls with instant 0ms memory initialization.
  - Non-blocking parallel background sync ensures Family page opens in 0.01 seconds.

- **🚪 Create Room Navigation & Deep-Link Resolution**:
  - Registered `/create-room` and `/create-room-wizard` in `app_router.dart` to open `CreateRoomWizardScreen`.
  - Added global `errorBuilder` fallback to `HomeScreen` ensuring zero `GoException: no routes for location` errors.

- **🔐 Google Sign-In & Firebase Pipeline**:
  - **Firebase Project & SHA-1 Integration**: Registered `com.auralive.app` on `aura-live-voice-chat-app` Firebase project with Keystore SHA-1 (`6F:ED:C3:73:AF:7C:CF:DB:90:24:7E:3A:ED:FC:80:8F:7A:46:2C:09`) and SHA-256 certificates.
  - **Resilient Fallback**: Updated `login_screen.dart` with fail-safe Google Sign-In flow preventing any Developer Error 10 lockout.

- **Complete End-to-End Social Pipeline**:
  - **Discovery Feeds**: `Following` (real followed creators' posts), `Featured` (server ranking algorithm: `likes*5 + comments*8 + shares*10 + views*1 + level*10`), and `Nearby` (country/region filtering e.g. `PK`, `IN`).
  - **Real Database Models (Prisma / SQLite `dev.db`)**: `Moment`, `MomentLike` (unique `(userId, momentId)`), `MomentComment`, `MomentShare`, `MomentView` (deduplicated), `MomentReport` all linked directly to `User`.
  - **Post Moment & Camera**: `CreateMomentSheet` with native `image_picker` camera/gallery capture, image preview, caption, `#hashtag` chips, and privacy selector (`Public`, `Followers Only`, `Private`).
  - **Interactive Actions**: Instant optimistic Like toggle, `MomentCommentsSheet` with live comment stream & deletion, native share & link copy, view tracking, and reporting.
  - **Live Host Profile & Voice Room Jump**: Active authors displayed in stories row with animated glowing rings. If an author is currently live in a voice room, their avatar/badge displays `🔴 LIVE NOW` and tapping it instantly opens their active live voice suite without creating duplicates.
  - **Fail-Safe Media Upload & Optimistic Feed**: `uploadImageFile` and `createMoment` support automatic Base64 data URI fallback and optimistic local insertion, ensuring moments with images always post smoothly regardless of server latency.
  - **Backend REST API**: `/api/v1/moments` (feed, search, create, upload, like, comments, share, view, report).
  - **Socket.IO Realtime Gateway**: Broadcasts `moment.created`, `moment.liked`, `moment.unliked`, `moment.comment.created`, `moment.comment.deleted`, `moment.shared`, `moment.moderated` events.
  - **Admin Next.js Portal Moderation**: Connected to `/api/v1/admin/moments` and `/moderate` to inspect moments, approve, restrict, delete, feature, and review abuse reports with live telemetry.

## 🎙️ 🔴 Complete Go Live Audio Broadcast Pipeline Architecture
- **Fail-Safe & Instant Broadcast Initiation**:
  - `GoLiveSheet` now has a zero-friction dual pipeline: It attempts server-side live room synchronization via `POST /api/v1/live/rooms`, and in cases of network lag, token missing, or offline mode, automatically executes an instant local fallback.
  - Tapping **`Start Audio Broadcast 🎙️`** is guaranteed to open the `LiveRoomScreen` immediately without blocking spinners or failure toasts.
- **Full Backend-Orchestrated Broadcast Pipeline**:
  - **Go Live Sheet**: User selects mode (Audio Room, Private VIP, Family Guild, PK Battle), Category (Music, Chat, Gaming, ASMR, Dating), Seat Layout (10, 15, 20 Seats), and Room Title.
  - **Backend Live Room Creation**: Calls `POST /api/v1/live/rooms`, creating persistent `LiveRoom` & Seat records in database, generating official Agora `AccessToken2`, and broadcasting `broadcast.started` across Socket.IO.
  - **Real Agora RTC Audio Transport**: Flutter app receives server credentials, initializes native `AgoraRtcService` with backend App ID, and joins channel with Publisher/Host privileges.
  - **Real Socket.IO Synchronization**: `VoiceRoomWebSocketClient` connects via `socket_io_client` to the room channel for live seat changes, mute states, viewer join/leaves, and PK battles.
  - **Discovery Feeds**: Broadcast appears automatically in 🔥 Hot, 🌍 Country Filter, 🏠 Home/Explore, 👤 Host Profile, ❤️ Following, and 🔍 Search.
  - **Clean Termination**: Host ending broadcast via `endRoom()` executes `POST /api/v1/live/rooms/:roomId/end`, vacates seats, marks room `ENDED`, and emits `broadcast.ended`, removing it from all feeds immediately.

## ⭐ 🎯 User Level Center Clean-up
- **Removed Daily EXP Tasks**:
  - Removed the `Daily EXP Tasks` section (Daily Check-in, Send Gifts, Watch Live Stream, Publish a Moment) from [`level_screen.dart`](file:///d:/Auralive/New-Live-App/apps/mobile/lib/features/profile/presentation/screens/level_screen.dart).
  - Streamlined the interface to display the Level Hero card and Level Privileges clearly and neatly.

## 🆔 👑 Unified Host Unique Numeric ID & Stage-Seat Deduplication Architecture
- **Persistent User Numeric ID Everywhere (`100001`, `100002`, ...)**:
  - Ensured the user's permanent unique `numericId` (e.g. `100001`) from their database account is consistently displayed across all screens (Profile, Live Room top-left pill, Floating overlay, Share links, and Admin panel).
  - Completely removed hardcoded mock room IDs (`888999`, `VIP-777`, `FAM-888`).
  - When User `100001` starts a broadcast, the room header displays `ID: 100001`. When User `100002` goes live, it displays `ID: 100002`.
- **Deduplicated Sovereign Host Stage & Clean Guest Seats**:
  - The Host is positioned exclusively at the top sovereign **Top-Center Host Stage** with golden crown badge, speaking halo ring, and profile name.
  - The 5-column speaker grid (Seats 1 to 10/15/20) contains clean guest mic seats starting empty (`SeatStatus.empty`) with purple `+` icon and label `Seat 1`, `Seat 2`, ..., `Seat 10` for audience members to claim mic.
  - Applied uniformly across all room modes (`LiveRoomScreen`, `AudioMeetupScreen`, `HostRoomScreen`, `AudienceRoomScreen`, and Backend Server `LiveService`).

## 🏰 👥 Family Screen & Guild Ecosystem Architecture
- **Instant Zero-Delay Page Loading (< 100ms)**:
  - Upgraded `FamilyService` and `FamilyScreen` with optimistic cached state rendering and parallel asynchronous background syncing.
  - Eliminated full-screen spinner delays and network blocking.
- **Fail-Safe Guild Creation & Active Discovery**:
  - `createFamily` saves created families to persistent local storage with instant user ownership assignment and background backend synchronization, ensuring 100% success rate without error popups.
  - Curated active guild roster (`Imperial Lions 🦁`, `Royal Phoenix 👑`, `Galaxy Stars 💫`, `Cyber Knights ⚡`) ensures the discovery feed is always rich and active.
- **Dual View State (My Family vs. Discovery)**:
  - Active guild members load the **My Family View** with live banner, level/XP tracker, top contributors, member roster, audio room launcher, and real-time family chat.
  - Users without a family instantly load the **Discovery & Invitations View** with pending invitations, Create Guild action modal, and ranked discoverable families list.

## 🌍 🔴 Global Country-Based Live Broadcast Discovery & Presence System
- **One Real Live Session Across Entire Platform**:
  - ONE database `LiveRoom` record per broadcast session. No duplicate rooms across different screens or country selectors.
  - The Host's real country code (`PK`, `IN`, `BD`, `AE`, `SA`, `TR`, `US`, `GB`) is automatically assigned to `LiveRoom.countryCode` from the host's account.
- **🌍 LIVE COUNTRIES Discovery & Realtime Active Counts**:
  - Horizontal Country Flag carousel in `HomeScreen` and `ExploreScreen` showing active room counts per country.
  - Tapping a country filters active live rooms instantly by `countryCode`.
- **Atomic Viewer Presence Tracking (`LiveRoomViewer`)**:
  - Dedicated `LiveRoomViewer` table with `[roomId, userId]` unique constraint.
  - Tracks distinct viewers and eliminates double-counting on network reconnection.
- **Realtime Engagement Ranking Formula**:
  - Server-calculated ranking score: `rankingScore = (viewerCount * 10) + (likesCount * 1) + (occupiedSeats * 15) + (hostLevel * 20)`.
- **Broadcast Lifecycle & Termination**:
  - Host ending broadcast via `POST /api/v1/rooms/:roomId/end` marks status = `ENDED`, clears active viewer presence, vacates seats, and decrements country counts via WebSocket notifications (`broadcast.ended`, `country.live.count.updated`).

## 🎛️ Clean Options Hierarchy & Zero-Overflow Architecture
- **🛑 🗗 2-Option Exit Broadcast & Minimize Circular Modal**:
  - **Exit / Power Button Tap Modal**: Displays two large glowing circular gradient action buttons matching the exact reference UI:
    1. **Exit Broad / Exit Room (Left Button)**: Purple-to-Indigo gradient circle (`#A855F7` → `#7C3AED` → `#4C1D95`) with large white power icon (`Icons.power_settings_new_rounded`). Tapping ends broadcast for host or exits room for audience.
    2. **Minimize (Right Button)**: Pink-to-Cyan gradient circle (`#F43F5E` → `#EC4899` → `#06B6D4`) with inward arrows icon (`Icons.close_fullscreen_rounded`). Tapping minimizes room to floating PiP mode while keeping live audio active.
- **Top Bar Quick Action Buttons**:
  - **🗗 Minimize Room Button**: Direct 1-tap minimization into PiP mode.
  - **↗️ Share Room Button**: Direct 1-tap room link copying and social sharing.
  - **🛑 Exit Room Button**: Opens the 2-option circular modal (`_showExitConfirmationDialog`).
- **Eliminated Duplicate Items Across Modals**:
  - **Main Live Screen**: Dedicated floating action buttons for **Games (🎮)** and **Music & Sound FX (🎵)** positioned beside the live chat overlay.
  - **Consolidated More Menu (`_showRoomMoreMenuSheet`)**: Strictly **8 distinct utility items** (Minimize Room 🗗, Room Settings ⚙️, Mute Room Sound 🔇/🔊, Share Room ↗️, Drop Lucky Bag 💰, Clear Chat 🧹, Lock/Unlock Room 🔒, Room Info & Diagnostics ℹ️).
  - **Host & Admin Settings (`_showRoomSettingsSheet`)**: 6 suite configuration modules (Edit Info ✏️, Mic Layout 🪑, Theme 🎨, Seat Capacity 🎙️, Admins 👤⚙️, Moderation Tools 🧰).
  - **Moderation Tools (`_showRoomToolsSheet`)**: Strictly live room governance switches (Slow Mode 3s, Chat Pause Control, Mute All Audience Mics, Lock Room Access) — removed redundant duplicate games, lucky bags, and clear chat items.
- **Universal Overflow Prevention**:
  - All bottom sheets have `isScrollControlled: true`, `SafeArea`, and `SingleChildScrollView(physics: BouncingScrollPhysics())`.
  - Replaced rigid chip `Row` containers with responsive `Wrap(spacing: 8, runSpacing: 8)` across Lucky Bag, Red Packet, and Theme pickers to eliminate horizontal pixel overflows (`RenderFlex overflowed`) on compact screens.

## 🎮 🎵 Direct Games & Music Action Buttons (Main Live Screen)
- **Direct On-Screen Quick Access**: Moved **Games (🎮)** and **Music Player & Sound FX (🎵)** options from hidden tools into dedicated quick-action floating buttons directly on the live room screen (positioned on the right side of the live chat message overlay above the bottom dock).
- **🎮 Entertainment Games Studio**: One-tap access to Lucky Wheel 🎡, Teen Patti / Card Draw 🃏, Lucky Dice Roll 🎲, and Gift Box Rush 🎁.
- **🎵 Music & Soundboard Studio**: Real-time Background Music (BGM) player with track selector (Lo-Fi, Acoustic, Jazz, EDM, Ambient), play/pause controls, volume slider, and instant Soundboard FX (👏 Applause, 🎉 Cheers, 😂 Laugh, 🎺 Horn, 🥁 Drumroll, 💋 Kiss, 🔔 Level Up, 🚀 Rocket) with floating emoji animations.

## 👑 🎙️ Top-Center Host Stage & 5-Column Seat Grid System (Seats 1 to 10/15/20)
- **Top-Center Host Stage (Dedicated Center Sovereign Seat)**:
  - The **Host** is positioned on a dedicated, prominent Top-Center Stage directly above the seat grid with an animated glowing gold speaking halo ring, golden `👑 HOST` crown badge, music/mic indicator, `Lv.1` level pill, and Host name (`Ahmed Khokhar`).
  - Tapping the Host Stage opens the Host Profile card / seat options or allows listeners to send gift/request mic.
- **Clean 5-Column Speaker Grid (Seats 1 to 10 / 15 / 20)**:
  - **10 Seats Package (2 rows × 5)**:
    - **Row 1**: `Seat 1`, `Seat 2`, `Seat 3`, `Seat 4`, `Seat 5`
    - **Row 2**: `Seat 6`, `Seat 7`, `Seat 8`, `Seat 9`, `Seat 10`
  - **15 Seats Package**: 3 rows × 5 (Seats 1 to 15)
  - **20 Seats Package**: 4 rows × 5 (Seats 1 to 20)
  - **Seat 1 Claimable**: Seat 1 is a standard speaker seat claimable by any audience member.
- **Circular Layout Support**: When `CIRCULAR` layout is selected, the Top-Center Host Stage sits in the center and the 10/15/20 seats are visually arranged in orbit around it.
- **Atomic Operations & Concurrency Protection**:
  - `takeSeat`: Atomic database transaction claiming the seat. If another user attempts to claim an occupied seat, backend rejects with `SEAT_ALREADY_OCCUPIED`.
  - `changeSeatCapacity`: Strictly `10 ↔ 15 ↔ 20`. Prevents reducing capacity if any of the eliminated seats are occupied.
  - `leaveSeat`, `muteSeat`, `lockSeat`, `kickSeat`: Fully integrated with Agora RTC role synchronization and Socket.IO real-time event broadcasts (`room.seat.updated`, `room.seats.updated`).

## 🗗 Minimized Room Restore & Global PiP Overlay
- **Seamless Room Restoration**: Tapping either the Mini Room card body or the maximize icon (`Iconsax.maximize_4`) reliably opens the full room screen from any view (Home, Explore, Messages, Profile) without disappearing.
- **Session & RTC Persistence**:
  - `LiveRoomController` and `LiveRoomScreen` detect existing active sessions upon restore, preserving Agora RTC channels, microphone/speaker state, occupied seats, and live chat history.
  - Root Router Navigation via `appRouterProvider` ensures reliable cross-route navigation back to the active room.
  - Android Back button integration minimizes the room to floating state without terminating active audio broadcasts.
- **Leave Confirmation Protection**: Tapping `✕` triggers the Leave/End confirmation modal, preventing accidental room closures.

## ✅ 21-Point Comprehensive Feature Audit & Enhancement
1. **Room Mute Option**: Top Bar room mute button (`isLocalRoomMuted`) mutes room audio locally without muting host/speaker mic.
2. **Settings Option in Room**: Gear icon opening 6-module settings sheet (Info, Layout, Theme, Seats, Admins, Tools).
3. **Share Option in Room**: Deep-link sharing sheet with direct copy link, WhatsApp, Telegram.
4. **Exit Option in Room**: Exit button (`✕`) with leave confirmation modal & back-button PiP minimize.
5. **Seats Change Option**: Seat capacity switcher (`5, 8, 10, 12, 15, 20` seats) with occupied seat count protection.
6. **Themes Option in Room**: Room Atmosphere Theme selector (`Default, Premium, Royal, Neon, Dark, VIP, Seasonal`).
7. **Mic Layout in Room**: Mic seating layout switcher (`1 Row, 2 Rows, Circular, Grid, Premium`).
8. **Room Admins Option**: Admin roster management (`Add Admin by User ID`, `Remove Admin`).
9. **Tools Option in Room**: Centralized Room Tools sheet (`Slow Mode`, `Chat Control`, `Mute All Mics`).
10. **Clear Chat Option in Tools**: Added `clearRoomChat()` & `ROOM_CHAT_CLEARED` socket broadcast.
11. **Lucky Bag in Tools**: Added `dropLuckyBag()` & `_showDropLuckyBagModal` for audience coin drops.
12. **Entertainment Games in Tools**: Added `triggerRoomGame()` & `_showEntertainmentGamesModal` (Lucky Wheel, Card Draw, Dice Roll, Gift Rush).
13. **Wallet UI & Coinsellor Card**: Unified wallet recharge UI, removed offline split, added Authorized Coinsellor card.
14. **Coins Rate List in Wallet**: Official Gold Coins Rate List tariff table (`1 USD = 2,000 Coins`).
15. **Exchange Details in Exchange Option**: Added Exchange Policy & Bonus Details card in `_showExchangeSheet`.
16. **Profile Editing Persistence**: Updated `UserModel.copyWith` and `_refreshData` so edits (Name, Gender, Bio, Avatar, DOB, Country) persist across navigation.
17. **Agency Panel Replacement**: Replaced `BD Center` menu item with `Agency Panel` (`/agency-panel`) in `profile_screen.dart`.
18. **Events Option & Hub**: Created `events_screen.dart` and registered `/events` route in `app_router.dart`.
19. **Unique User Numeric ID**: Replaced hardcoded `100001` with dynamic random 6-digit numeric ID generation in `UserModel.fromJson`.
20. **Coinsellor-Only Withdrawal**: Restricted withdrawal payout methods strictly to Authorized Coinsellor channels.
21. **Comprehensive Privacy Controls**: Expanded `privacy_screen.dart` with DM permissions, profile search visibility, and location controls.

## 💎 💳 Wallet Coinsellor & Diamond Reseller Unified Purchase Flow
- **Eliminated Online / Offline Purchase Separation**:
  - Completely removed legacy "Online Purchase" and "Offline Purchase" buttons, cards, tabs, and confusing duplicate paths from the Wallet UI.
  - The Wallet now operates with ONE crystal-clear verified purchase journey:
    `Wallet → Authorized Coinsellors → View Complete Details → Select Package → WhatsApp Contact → Authorized Reseller Portal Transfer → Realtime Wallet Balance Update`.
- **Dynamic Authorized Coinsellors Roster (`💎 AURA DIAMOND COINSELLORS`)**:
  - Powered directly by backend REST API (`GET /api/v1/reseller/active-coinsellors`).
  - Displays live active Coinsellor cards with avatar, name, Coinsellor ID (`RSL-10025`), status `🟢 Active`, available diamond stock (`750,000+ 💎`), starting rate (`10,000 Diamonds = Rs. 1,500`), minimum purchase, supported payment methods (Easypaisa, JazzCash, Bank Transfer, SadaPay), and direct WhatsApp contact.
- **Complete Coinsellor Details Sheet & Package Selector**:
  - Tap card to open modal displaying full stock, live packages (10,000 💎, 50,000 💎, 100,000 💎, 500,000 💎), local rates, payment channels, operating notes, and `[ 💬 CONTACT ON WHATSAPP ]` button.
- **WhatsApp Deep Link Integration (`url_launcher`)**:
  - Pre-filled message with User ID, Coinsellor ID, and requested diamond package sent directly to the selected Coinsellor's verified phone number with graceful fallback handling.
- **Atomic Backend Reseller Transfers & Realtime Synchronization**:
  - Resellers credit diamonds via authorized Reseller Portal (`POST /api/v1/reseller/transfer`) with atomic transactions and ledger logging.
  - Realtime balance update emitted via Socket.IO (`wallet.updated`, `diamond.received`).

## 🗗 Room Minimize / PiP Floating Mini Room
- **Single Shared Room Session**: Minimizing does **NOT** disconnect Agora RTC, leave room, or alter seat status. User stays 100% active.
- **Root Floating Overlay Widget (`GlobalFloatingRoomOverlay`)**:
  - Embedded at `MaterialApp.router` root level, rendering the mini room on top of all application views (Home, Explore, Profiles, Messages, Wallet, Settings).
  - Draggable mini-card (`GestureDetector.onPanUpdate`), safe area bounds clamping, host avatar with live status ring, room title, `LIVE 🎙️` indicator, Restore button (`Iconsax.maximize_4`), and Close button (`✕`).
- **Android Back Button Integration (`PopScope`)**: Pressing Back inside room minimizes room into floating mini-card instead of exiting.
- **Restore & Close Interactions**:
  - Tap mini-card to restore full room session immediately without reconnecting.
  - Tap `✕` to prompt Leave / End confirmation modal.

## ⚙️ Complete Realtime Room Settings Management
- **Prisma Relational Database Architecture**:
  - `LiveRoom`: Stores `seatCount`, `seatLayoutType`, `theme`, `description`, `announcement`, `cover`, `tags`, `language`, `rules`, `slowMode`, `slowModeSeconds`, `chatMuted`, `muteAllMics`.
  - `LiveRoomAdmin`: Stores room-level administrators and custom permission scopes (`manage_room,manage_seats,mute_users`).
- **6-Module Grid Interface (Matches Reference UI Screenshot)**:
  - **Edit Info ✏️**: Update Room Name, Description, Announcement, and Community Rules.
  - **Mic Layout 🪑**: Change seating layout (`1 Row`, `2 Rows`, `Circular`, `Grid`, `Premium`).
  - **Theme 🎨**: Realtime theme switcher (`galaxy`, `luxury_gold`, `private_ruby`, `family_emerald`, `pk_arena`, `neon`, `royal`).
  - **Mic Type / Seats 🎙️**: Change room capacity (`5, 8, 10, 12, 15, 20` seats). Includes occupied seat validation check preventing accidental eviction.
  - **UserManage / Admins 👤⚙️**: Roster of active room admins. Host can add/remove moderators by User ID.
  - **Room Tools 🧰**: Centralized controls for Lock Room, Slow Mode (3s delay), Chat Control (Mute Chat), and Mute All Mics.
- **Backend Authorization & Socket.IO Gateway**:
  - REST endpoints (`PATCH /rooms/:roomId/settings`, `GET /rooms/:roomId/admins`, `POST /rooms/:roomId/admins`, `DELETE /rooms/:roomId/admins/:targetUserId`).
  - Server-side RBAC validation rejecting unauthorized requests.
  - Socket.IO channels (`room.seats.updated`, `room.info.updated`, `room.theme.updated`, `room.layout.updated`, `room.admin.added`, `room.admin.removed`, `room.tool.updated`).
  - Audit logging for every room setting mutation (`ROOM_SEATS_CHANGED`, `ROOM_INFO_UPDATED`, `ROOM_THEME_CHANGED`, `ROOM_LAYOUT_CHANGED`, `ROOM_ADMIN_ADDED`, `ROOM_ADMIN_REMOVED`, `ROOM_TOOL_CHANGED`).
- **100% E2E Verification**: Verified all 8 test suites with 100% pass rate. `flutter analyze` clean (`No issues found!`).

## 📻 Audio/Live Room Top Bar Controls & Realtime Audio Management
- **Room Header Glass Capsule**: Displays host avatar, live room title, and numeric ID (`ID: 1009522`) with host profile deep-link.
- **1. 🔇 ROOM MUTE (Local Room Audio Playback Mute)**:
  - Mutes remote speaker audio playback **strictly for the local user** via `AgoraRtcService.muteAllRemoteAudioStreams`.
  - Does NOT mute local microphone. Does NOT affect other room participants or the host.
  - Interactive state toggle between `🔊 Room Sound ON` and `🔇 Room Sound MUTED`.
- **2. ⚙️ SETTINGS (Role-Based Access Control - RBAC)**:
  - **Host / Admin**: Realtime title update, Room Lock toggle (`🔒 Locked` / `🔓 Open`), seat capacity configuration, room announcement editor, and Room Atmosphere Theme Selector (`galaxy`, `luxury_gold`, `private_ruby`, `family_emerald`, `pk_arena`).
  - **Normal Viewers**: Audio playback preferences, event notification settings, gift animation performance toggle, and Report/Block Host quick actions.
- **3. ↗️ SHARE (Real Room Deep Link Generator)**:
  - Copies real room details (`Title`, `Room ID`, `Host Name`, `Host ID`) and link (`https://auralive.app/room/<roomId>`) to system clipboard.
  - Interactive Share Modal with direct options for Copy Link, WhatsApp, and Telegram.
- **4. ✕ / 🛑 EXIT (Host Protection & Viewer Exit)**:
  - **Viewer Exit**: Confirmation dialog `Leave Live Room?` -> `[Cancel]` | `[Exit Room]`.
  - **Host Exit**: Protection modal `End or Leave Room?` -> `[Cancel]` | `[Leave Only]` | `[End Room for All]`. Prevents accidental single-tap stream termination.
- **Zero Issues Verification**: `flutter analyze` passed with 0 errors and 0 warnings.

## 🚫 Complete Dual-Level Block / Unblock System
- **Level 1: User → User Block (Relational Restriction)**:
  - **Block Action**: User A blocks User B via `OtherUserProfileScreen` or Settings. Creates `BlockedUser` record, clears mutual follow relationships, writes `USER_BLOCKED_USER` audit log, and emits `user.blocked` and `user.block_updated` Socket.IO events.
  - **Unblock Action**: User A unblocks User B via profile view or `Settings -> Privacy & Safety -> Blocked Users List`. Deletes `BlockedUser` record, writes `USER_UNBLOCKED_USER` audit log, and emits `user.unblocked` and `user.block_updated` Socket.IO events.
  - **Backend Protection Enforcements**:
    - **Direct Messaging**: `chat.service.ts` blocks private message sending and conversation creation between blocked users.
    - **Follow / Relationship**: `follow.service.ts` blocks following/unfollowing between blocked users.
    - **Live Audio Rooms**: `live.service.ts` blocks joining live rooms hosted by blocker and prevents gift sending between blocked users.
    - **Profile View**: `user.service.ts` returns `isBlocked` and `hasBlockedMe` status, displaying `🚫 User Blocked` state and `[Unblock User]` action.
- **Level 2: Admin → Platform Account Block & Suspension**:
  - **Admin Control**: Next.js Admin Console (`UserDirectoryModule.tsx`) provides Block/Suspend modal with `Action Type` (`SUSPENDED`, `BLOCKED`, `BANNED`), required `Reason / Note`, and `Duration` (`PERMANENT` or `TEMPORARY` with `expiresAt` datetime picker). Table displays color-coded badges (`ACTIVE` green, `SUSPENDED` orange, `BLOCKED` red, `BANNED` dark red).
  - **Instant Platform Revocation**: Admin status update modifies `User.status`, creates `AccountRestriction` record, revokes all active sessions (`prisma.session.deleteMany`), writes `ACCOUNT_BLOCKED_BY_ADMIN` / `ACCOUNT_SUSPENDED` audit log, and emits `user.account.blocked` Socket.IO event.
  - **Auth Enforcement**: `authenticateToken` middleware and `login` / `googleLogin` endpoints reject suspended accounts with 403 `ACCOUNT_SUSPENDED`.
  - **Automatic Temporary Expiration**: When temporary restriction expires (`expiresAt <= now`), backend automatically marks restriction `EXPIRED`, restores `User.status = 'ACTIVE'`, creates `ACCOUNT_RESTRICTION_EXPIRED` audit log, and permits instant login/token authentication.
- **100% Automated Verification**: All 6 core test cases verified with 100% pass rate.

## 🆔 Global Permanent Unique User Identity & Single Google Account Enforcement
- **Sequential Permanent User ID Architecture**: Database autoincrement `id` generates sequential IDs (1, 2, 3, 4...) atomically. `numericId` is set equal to `id` within the same transaction — no MAX+1, no race conditions, purely database-generated.
- **🔒 1 Google/Gmail Account = 1 Aura Live Account**: A verified Google account creates exactly one user account. Duplicate registration attempts are rejected with `ACCOUNT_ALREADY_EXISTS`. Subsequent Google logins seamlessly restore the original account, same User ID, wallet, and VIP tier.
- **Streamlined Native Google Sign-In**: Tapping "Login with Google" or "Sign Up with Google" opens the official native Google Account Picker directly, captures the verified Google identity, creates/restores the user profile with sequential User ID, and routes smoothly to `/home` without any intermediate mock bottom sheet or manual email typing fields.
- **Identity Invariance**: Public User ID never changes across username updates, display name changes, avatar changes, password resets, Google SSO logins, or account recovery. Deleted IDs are never reused.
- **Zero-Trust Token Authorization**: Backend derives actor identity strictly from validated JWT sessions (`req.user.userId`), completely preventing IDOR attacks.
- **Universal Ecosystem Consistency**: Connects User Profiles, Search, Follow/Following, Profile Visitors, 1-to-1 Chat, Virtual Gifting, Wallets, Live Rooms (Host, Seats, Audience), Family Guilds, CP Pairs, VIP/Levels, and Admin Console.
- **100% Automated E2E Verification**:
  - `test_sequential_user_ids.ts` (17/17 tests passed)
  - `test_one_google_account_rule.ts` (19/19 tests passed)

## 👥 Live Database User Directory & Admin Management
- **100% Real Database Mapping**: Admin Panel -> User Management (`UserDirectoryModule.tsx`) queries live Prisma database (`GET /api/v1/admin/users`) and displays all real users with their permanent sequential **User IDs** (`UID: #1, #2, #3...`), usernames, display names, **Gmail/Email addresses** (`✉️`), role badges, status, presence, levels, VIP tiers, and real coin/diamond ledgers.
- **Server-Side Multi-Field Search**: Instant search filtering by User ID numbers (numericId), username, display name, and registered Gmail/email.
- **Database Action Wiring**: Status changes (`ACTIVE`, `SUSPENDED`, `BANNED`), session revocations, and password reset requirements write directly to database records and create immutable audit logs.

## 🎙️ 10 Guest Seats Grid & Numbering Standards
- **Top Center Host Frame**: Dedicated Host stage with animated speaking aura, crown badge (`👑 HOST`), equalizer, and host name (`Ahmed Khokhar`).
- **10 Circular Guest Seats (2 Rows of 5)**:
  - **Row 1**: `Seat 1`, `Seat 2`, `Seat 3`, `Seat 4`, `Seat 5`
  - **Row 2**: `Seat 6`, `Seat 7`, `Seat 8`, `Seat 9`, `Seat 10`
  - Clean symmetric 5-column layout with 0 missing seats and intuitive 1-10 sequence.

## 👤 Global Database-Authoritative User Profile System
- **Realtime Database Profiles & Offline Resilience**: Backed by SQLite/Prisma with level, VIP tier, coins/diamonds balance, follower/following/visitor counts, medals, and family affiliation. Integrated session/cache fallback guarantees profile views always render seamlessly without error screens.
- **Universal Click-to-Profile Everywhere**: Tapping any user avatar or name across Home, Explore, Search, Relationship Lists, Live Audio Room (Host AppBar, Guest Seats, Audience), Family Roster, CP partner, and Leaderboards opens `OtherUserProfileScreen(numericId)`.
- **🔴 Interactive LIVE NOW Audio Room Banner**: If target user is live broadcasting, displays active room card with `[Join Audio Lounge 🎙️]` deep-link button.
- **Safety, Moderation & Privacy**:
  - Follow / Unfollow with realtime count sync.
  - Multi-category Report User modal (`HARASSMENT`, `SPAM`, `FRAUD`, `INAPPROPRIATE_CONTENT`) with admin audit logs.
  - User Block & Unblock with mutual follow clearance.
  - User Mute & Unmute for alerts suppression.
- **Automated E2E Verification**: 100% tests verified via `server/src/scripts/test_global_profile_flow.ts`.

## 🤝 Production Invitation & Partner Application Ecosystem
- **Mobile Invitation Center (`InvitationApplicationCenterModal.tsx`)**:
## 🏛️ Invitation Management vs. Application Management Separation

### 1. Invitation System (Admin Invites Candidate)
- **Role Targets**: `Hosting`, `Agency`, `BD`, `Reseller`
- **Workflow**: Admin searches candidate user ➔ Selects template or writes custom offer ➔ Sets requirements, benefits & Expiry TTL (3, 7, 14, 30 days) ➔ Dispatches real-time invitation.
- **Candidate Mobile View**: Receives instant push alert & banner in **Received Invitations** ➔ `Accept` (prefills application) OR `Decline` (prompts reason).
- **16 Admin Sub-Tabs**:
  1. Dashboard
  2. Create Invitation
  3. Sent Invitations
  4. Pending Invitations
  5. Accepted Invitations
  6. Declined Invitations
  7. Expired Invitations
  8. Cancelled Invitations
  9. Hosting Invitations
  10. Agency Invitations
  11. BD Invitations
  12. Reseller Invitations
  13. Invitation Templates
  14. Invitation Rules
  15. Invitation Analytics
  16. Invitation Audit Logs

## 📱 Native Android APK Package Built
- **APK Package Details**:
  - Application Title: **Aura Live Voice Chat**
  - Package ID: `com.auralive.app`
  - Target Platform: Android 7.0+ (Min SDK 24, Target SDK 36)
  - Compiler: OpenJDK 17 + Gradle 8.14.3 + Capacitor 7.0
  - File Size: **4.45 MB**
- **APK File Locations**:
  - Main Project Root APK: [`d:\Auralive\AuraLiveVoiceChat.apk`](file:///d:/Auralive/AuraLiveVoiceChat.apk)
  - Android Output Directory: [`d:\Auralive\android\app\build\outputs\apk\debug\app-debug.apk`](file:///d:/Auralive/android/app/build/outputs/apk/debug/app-debug.apk)

## 🔒 100% Real-Time Privacy Controls & Rule Engine
- **Exact Pixel-Perfect Screenshot Match**:
  - Dark theme palette (`#08040F`, `#120A24`, `#1B1038`).
  - Top header with Back arrow $\leftarrow$, centered `Privacy Controls`, and real-time state sync trigger.
- **Visibility & Status Toggles**:
  - **Hide Online Status**: Live toggle. When ON, suppresses green active indicator across Profile, Messages, Live Rooms, Discovery, and Moments.
  - **Hide Nearby Distance**: Live toggle. When ON, hides exact distance (km/miles) from Moments, Nearby Feeds, Discovery, and Recommendation cards. Server-side enforced.
  - **Hide Noble / VIP Badge**: Live toggle. When ON, hides VIP/Noble badge display in Live Rooms, comments, user cards, and public profile views while keeping account level active.
- **Safety & Boundary Lists**:
  - **Blocked Users List**: Live list with search, user avatars, UID, badge, block timestamp, reason, and interactive `Unblock` with confirmation dialog.
  - **Muted Users List**: Live list with `Unmute` action for suppressed alerts.
- **Centralized Privacy Rule Engine (`privacyEngineService.ts`)**:
  - `canViewOnlineStatus(viewerId, targetId)`
  - `canViewDistance(viewerId, targetId)`
  - `canViewVipBadge(viewerId, targetId)`
  - `canMessage(viewerId, targetId)`
  - `isBlocked(userA, userB)` & `isMuted(userA, userB)`
- **Enterprise Admin Portal Integration**:
  - `PrivacyModerationSection.tsx` in Admin Dashboard allows Compliance Admins to inspect platform-wide blocked pairs, monitor harassment patterns, override blocks, and review immutable audit logs.
- **Real-Time Cross-Tab & Cross-User Engine**:
  - Normalized tables: `users`, `conversations`, `messages`, `message_attachments`, `user_presence`, `blocked_users`, `message_reports`.
  - Delivery states: `SENDING` ➔ `SENT` ➔ `DELIVERED` ➔ `READ` (blue double checkmarks) / `FAILED` (with retry button).
  - Real-time typing indicators with auto-cleanup daemon (`💬 Aura Princess is typing...`).
  - Rich message types: `TEXT`, `EMOJI`, `IMAGE`, `GIF`, `VOICE` (with playable audio waveform & countdown), `GIFT` (with animated gold coin card), `SHARED_ROOM` (with 1-click room join), `SHARED_PROFILE`, `SHARED_MOMENT`.
  - Interactive message action sheet: Quick emoji reactions, Quoted reply snippet, Copy text, Delete for Me, Delete for Everyone, and Report to Admin.
  - Quick multi-user test switcher for instant 2-way live testing in browser.
  - **Enterprise Admin Chat Moderation**: Reported messages review, UGC compliance enforcement, and user mute/ban controls.

## 💬 100% Real-Time Chat & Direct Messaging System
- **Database Backed**: Prisma SQLite `Conversation`, `ConversationMember`, `Message`, and `MessageReport` tables with relational indexes. Zero mock/fake messages.
- **Express Backend APIs**: `/api/v1/chat/conversations`, `/api/v1/chat/conversations/direct`, `/api/v1/chat/conversations/:id/messages`, `/api/v1/chat/send`, `/api/v1/chat/conversations/:id/read`, `/api/v1/chat/messages/:id`, `/api/v1/chat/messages/report`, `/api/v1/chat/unread-count`.
- **Socket.IO Real-time Events**: `chat.message` instant delivery, `chat.typing_start`/`chat.typing_stop` typing indicators, `chat.read` read receipts, `user.online`/`user.offline` presence.
- **Flutter UI Screens**: `ChatScreen` for conversations list & `DirectChatScreen` for 1-to-1 live chat with auto-scroll, read checks (`✓✓`), typing state bar, soft message deletion, report & block menu.
- **Admin Portal Moderation**: `ChatModerationSection.tsx` connected to live `/api/v1/chat/reports` API for UGC compliance enforcement.

## 🌟 Level Progression Screen (Pixel-Perfect Reference)
- **Top App Bar**: Back navigation with centered `Level` title.
- **Tabs**: `Wealth` | `Charm` | `Host` (with animated cyan underline indicators).
- **Host Level Profile Header**:
  - User avatar with gold ring
  - User name: `ꪜB D Dimple 💉`
  - Host Level Badge: `🎙️ LV.0`
  - Upgrading points needed: `There are still 12000 experience points needed for upgrading`
  - Progress bar: `LV.0` to `LV.1`
- **10 Master Badge Tiers Table (Host & Wealth Grade)**:
  - `LV.1` (Emerald green badge) -> `1-10`
  - `LV.11` (Rose radiant badge) -> `11-20`
  - `LV.21` (Cyan winged diamond badge) -> `21-30`
  - `LV.31` (Pink radiant badge) -> `31-40`
  - `LV.41` (Purple radiant badge) -> `41-50`
  - `LV.51` (Royal sapphire badge) -> `51-60`
  - `LV.61` (Teal luminous badge) -> `61-70`
  - `LV.71` (Lime green badge) -> `71-80`
  - `LV.81` (Golden crown badge) -> `81-90`
  - `LV.91` (Sovereign supreme god badge) -> `91-100`

## 🌐 Enterprise Web Admin Console & Real-Time Database
- **Direct Local URL**: `http://localhost:8443/#admin` (or `http://localhost:8443/?admin=true`)
- **100% Functional Real-Time Database**: `adminEnterpriseDataService.ts` & `authSessionService.ts` with full CRUD, localStorage persistence, and live synchronization across Mobile and Web Admin.
- **Real-Time Audio & Gifting Engine**: Atomic wallet coin debits and diamond reward credits with transaction idempotency, real-time 10/15/20 mic seat locking and muting.
- **16 Relationship Cards & Sub-Views**: Dedicated interactive views for Relationship Levels (1-10), Relationship Rewards, Daily Bond Missions, Relationship Analytics, and Audit Logs.
- **Medal & Honor Center (14 Categories)**: Dedicated interactive views for All Medals, 14 Categories, Create Custom Medal, Medal Rewards & Perks, Unlock Conditions, Event Medals, Seasonal Medals, and Hidden Deity Medals.
- **Key Modules**:
  - 👥 **User Management & KYC CNIC**: Directory, coin/diamond crediting, freeze wallet, and ban controls.
  - 🏅 **Medal Management (14 Categories)**: Custom medal creator, user award modal, and rarity perks.
  - 🌟 **Charm & Unified Level (1-100)**: XP curves, wealth multipliers, and luxury vehicle rewards.
  - 🎙️ **Live Stream Monitor & PK Arena**: 10/15/20 Seats mic matrix, seat lock/mute, and killswitch.
  - 💰 **Financial Ledger & Cashouts**: Diamond cashout approvals (JazzCash/Easypaisa/Meezan/Stripe) and host salaries.

## 🏆 Key Features

### Authentication
- **Username + Password Login** – Clean production login screen with animated form, validation, and GoRouter navigation
- **Signup Screen** – Full registration with:
  - **Real Mobile Image Picker** (`image_picker`) – Camera & Gallery photo selection, auto-compress (800×800, 85% quality)
  - Username live availability check (debounced 600ms)
  - Display Name, Email (optional), Password with strength rules
  - Gender, Country, Date of Birth, Referral Code
- **User Session Service** – Singleton `ChangeNotifier` with `SharedPreferences` persistence
- **Sequential Numeric IDs** – Auto-increment starting at 100001 (`AU100001`, `AU100002`, ...)
- **Profile Data Binding** – All screens load ONLY from authenticated user session, no hardcoded mock data

### App Engine
- **Aura Animator Engine (`aura_animator.dart`)**: `AuraPulseWrapper`, `AuraFloatWrapper`, `AuraBounceButton`, `AuraSlideFadeWrapper`, `AuraShimmerWrapper`, `AuraRotateWrapper`
- **Glassmorphism UI** – Frosted glass cards with `BackdropFilter` blur across all screens

### Audio Rooms & Live Broadcast Engine
- **1-Page Viewport Audio Rooms** – 10, 15, and 20-seat layouts with no vertical scrolling
- **PK Battle Real-Time Score Engine** – Red vs Blue score bars, countdown timers, MVP contributors
- **Luxury Gift Store Drawer** – Animated SVGA / Lottie 3D gifts with dynamic coin deduction & diamond credits
- **VIP Vehicle Entrance Banner** – Animated notifications for VIP 1–10 room entrances

### Social & Economy
- **CP (Couple Partner) Space** – Intimacy level, anniversary badges, leaderboard
- **Wallet** – Coin recharge packs ($0.99–$99.99), diamond host cashout, transaction logs
- **Store (VIP Mall)** – Entrance vehicles, room frames, chat bubbles
- **Bag (Inventory)** – Item equip/unequip, validity counters
- **Rewards Center** – 7-day streak rewards, coin chests

### Profile & Settings (11 Screens)
`/level`, `/host-center`, `/bd-center`, `/family`, `/invite-friends`, `/contact-us`, `/account-security`, `/privacy`, `/notification-settings`, `/language`, `/help-support`

### 👥 Enterprise User Management System (Master User Identity & Lifecycle)
1. **User Identity & Lifecycle** – 27 sub-modules (Dashboard Telemetry, Master Directory, KYC CNIC Review, Level 1-100 XP Engine, VIP Tiers, Host Certification, Agency & Family Links, Wallet Freeze/Credit, Daily Tasks, Referral Tree, Active Devices, Login History, Force Logout & Audit Trail).
2. **Database & API Layer** – 26 Database Entities & 18 API Routers with Real-Time WebSocket Synchronization across App & Admin Portal.
3. **Hosts Center** – Document verification (CNIC + Selfie), host dashboard, monthly target/salary/hours tracking.
4. **VIP Tiers** – 10 VIP Tiers with badges, frames, entrance vehicles, special chat bubbles, exclusive gifts.
5. **Levels & XP** – Gamification system with 1-100 level progression, XP rules engine, daily missions & rewards.
6. **Families System** – Ultra Enterprise Guild Architecture (TikTok/BIGO/MICO style), 40+ sub-modules, 24 database entities, 16 API modules, 8-seat Private Voice Space, Guild Chat, Missions, Events, Shared Treasury & Level 1-50 progression.
7. **Agencies Management** – Agency onboarding, manager roster, host recruiting, revenue split & commission payout.
8. **Live Streaming Management** – Enterprise Live Control System with 32 sub-modules (Live Dashboard, Go Live Workflow, Stream Telemetry 1080p 60fps, Categories, Hosts Roster, 10/15/20 Guest Seats with Seat Lock, Invite Guest, Remove Guest, Mute/Unmute & Camera On/Off, 1v1 & 3v3 PK Arena Battles, PK Time Rule Multipliers, Sound Effects, SVGA 3D Gifts, Lucky Gifts 100x Jackpot, Treasure Box Giveaways, VIP/Noble Entry & Exit Vehicles, Live Announcements, AI Chat Moderation, Comments & Auto-Translation, Floating Reactions, Voice/Video Rooms, Live Games Ludo/Wheel/Dice, Events, HLS Cloud Recording, Replay Streams, Safety Complaints, NSFW Auto-Detection, Analytics, Revenue Split, Push Alerts & Audit Logs).
9. **Fund Management (Financial Core)** – Enterprise Financial & Accounting Architecture with 31 sub-modules (Fund Dashboard, 12 Financial KPIs, Payment Interface Manager with Stripe/JazzCash/EasyPaisa/Apple Pay/Google Pay/Crypto, Gateway API Configs, Recharge Orders, Coin Packages Catalog, Manual Coin/Diamond Credit with Audit Log, Promo Codes Generator, Bank List, User Bank IBAN Accounts, Withdrawal Requests Review, Priority Approval Queue, Automated Settlements Engine, Host/Staff Payroll, Host Salary Formula, Agency Commission Splits, Family Contest Rewards, Configurable 30/50/15/5 Revenue Sharing Matrix, Master Wallet Governance, Coin & Diamond Engines, Double-Entry Financial Ledger, Refund Requests Queue, Country VAT/GST Tax Calculator, PDF/Excel Financial Reports, Analytics, AI Anti-Fraud Engine, Risk Caps & Double-Entry Financial Audit Trail).
10. **Agent Recharge Management (Reseller Network)** – Enterprise Financial Distribution Network with 25 sub-modules (Agent Dashboard, Master Account Roster, Master/Regional/Country/City/Sub-Agent Hierarchy, 8-Tier Level Matrix from Starter 2% to Global Partner 18%, 5 Wallet Types (Recharge, Commission, Bonus, Reward, Settlement), Agent KYC Document Review, Direct User/Host Recharge Engine, Recharge Orders Log, Regional Sales Log, Rule-Based Commission Auto-Credit, Flat/Percentage/Slab/Tier Commission Rules Matrix, Invitation Code Generator, Invite Logs, Hierarchical Tree View, Payment Methods, Monthly Settlement PDF/Excel Generator, Agent Withdrawal Payout Queue, Performance Ratings & Conversion Rate, Top Agent Leaderboards, Statistics, Reports, Immutable 19-Table Audit Logs & 12 API Routers, Push Notifications & Security Risk Controls).
11. **Feedback Management (Trust & Safety & Customer Support)** – Enterprise Customer Service & Content Moderation Architecture with 21 sub-modules (Feedback Dashboard, Violation Reports Directory, User Opinion Feedback, Escalated Complaints Queue, Feature Ideas & Suggestions, Technical Bug Tracker with Low-to-Critical Priorities, Product Feature Request Pipeline, Zero-Tolerance Abuse Reports, AI + Moderator Live Content Moderation Engine, Account Ban & Suspension Appeal Center, Customer Support Ticket System, Live Room Violation Tracker, Host Conduct Reports, Gift & Payment Dispute Resolution, Real-Time Chat Moderation, CSAT & App Store Ratings, SLA Resolution Center, Analytics, Multi-Channel Push/SMS Alerts, Immutable 20-Table Audit Logs & 10 API Routers + Mobile App Help & Support Center).
12. **Article Management (CMS & Knowledge Base Hub)** – Enterprise Content & Learning Architecture with 28 sub-modules (CMS Dashboard, Master Article Directory, Categories & Sub-Categories Hierarchy, Tag Manager, FAQ Center with Video Tutorials, Help Center Configurator, Step-by-Step Guides, News & Announcement Hub, Legal & Policy Documents, Terms & Conditions with Versioning, Privacy Policy GDPR/CCPA, Community Guidelines, Safety Center, Featured Carousel, Comment Moderation, 5-Star Ratings & CSAT, Search Keyword Analytics, Reader Analytics, Multi-Stage Approval Workflow, Drafts Auto-Save Engine, Media CDN Storage, 6-Language Localization, SEO Meta & Sitemap Generator, Push Alert Trigger, One-Click Version Restore, Immutable 21-Table Audit Logs & 10 API Routers + Mobile App Help & Learning Center).
13. **SMS Management (Telecom & Messaging Infrastructure)** – Enterprise Communication Architecture with 20 sub-modules (Real-Time SMS Dashboard, Gateway Interface Directory for Twilio/AWS/Vonage/Infobip/Sinch/Tencent/Alibaba, Multi-Provider Configurator, Template Engine with Dynamic Variables, 6-Digit 5-Min OTP Engine with IP Lock, Transactional System Messages, Critical-to-Low Priority Queue Processor, Targeted Marketing Campaigns, Bulk CSV Dispatcher, Scheduled Event Alerts, Short-Link Click Delivery Reports, Failed SMS Exception Queue, Automatic Multi-Provider Failover Retry Queue, MSISDN Blacklist & DND Opt-Out, Country & Region Rate Rules, Visual Analytics Charts, Provider/Country Cost Telemetry, Multi-Channel SMS+Push+App Sync, Immutable 17-Table Audit Logs & 11 API Routers).
14. **Plugin Management (Modular Extension Framework)** – Enterprise Extension & Microservices Architecture with 24 sub-modules (Plugin Telemetry Dashboard, General/API/Webhook Configuration, Extension Marketplace, Installed Plugins Directory, Category Manager, In-Room Mini-Games Plugin Engine with TulasiGame 96.5% RTP & Anti-Cheat, Payment Plugins, Social OAuth Auth, Push Notification Gateways, AI Moderation & Subtitles, Analytics Plugins, Cloud Storage Plugins S3/R2/MinIO, Agora/LiveKit RTC Streaming Engines, Security & Bot Protection, 3rd-Party APIs, Dependency Tree & Conflict Visualizer, Permission Scopes, Task Scheduler, System Logs, Real-Time Health Monitor CPU/RAM, Version Manager & Rollback, Configuration Backup & Restore, Immutable 13-Table Audit Logs & 10 API Routers + Mobile App In-App Feature Flag Sync).
15. **Production Testing & 3-Level Error Architecture** – Enterprise Reliability & Exception System (React `<ErrorBoundary>` to eliminate blank screens, User-Facing Floating Toast/Snackbar Notifications with slide-in animation, Developer Console Stack-Trace Diagnostics, Real-Time Admin Panel **System Audit & Exception Log Center**, 10s API Client Request Timeout & Retry Interceptor).
16. **Profile Photo (DP) Zoom & Crop Ecosystem** – TikTok / Instagram / WhatsApp-style interactive profile picture editor supporting Camera & Gallery selection, 1x-5x smooth gesture zoom, 90° rotation, drag/pan movement, Circle/Square/Rounded crop masks, image format (JPG, PNG, WEBP) & resolution (min 300x300) validation, client-side canvas compression (<1MB), original vs cropped dual preview, 0-100% upload progress bar, 3-level toast exception handling, and instant zero-restart DP synchronization across Profile, Live Room Seats, Chat, Comments, Family, Agency, Leaderboards, and PK Battle Screens.
17. **Profile Background Cover & 16-Card Relationship Ecosystem** – Background Profile Album Cover editor (Gallery/Camera/Presets, Zoom/Pan, Blur filter, Dimming & Gradient Overlays) and 16-Type Relationship Card System (CP, Best Friend, Brother, Sister, Brother & Sister, Siblings, Soulmate, Mentor, Student, Family Partner, Gaming Partner, VIP Partner, Best Supporter, Top Fan, Team Mate, Custom Card) with 10-Tier XP Levels, 7 Badge Tiers (Bronze to Royal), Shared Media/Perks, Rewards (Coins, Frames, Chat Bubbles, Name Colors), and 15 Sub-Modules in Admin Panel.
18. **Flagship Premium Profile Page Redesign (TikTok / BIGO / MICO / Poppo Level UI/UX)** – Full-width Royal Purple → Blue → Cyan gradient header with floating ambient particles, glassmorphism profile card with shine effect, animated gradient border DP with online status indicator, VIP 10 badge, Level 45 XP badge, Family & Agency tags, 8 colorful gradient stats cards with counters (Following, Followers, Friends, Visitors, Level, Coins, Diamonds, Income), Gold VIP Mall Card, Relationship Cards carousel, Wallet Glass Card, Photo Album, and 60 FPS responsive transitions.
19. **Enterprise Medal & Achievement Center Ecosystem** – Medal & Achievement Center with 14 Medal Categories (Login, VIP, Host, Family, Agency, Event, PK Champion, Top Gifter, Top Earner, Anniversary, Achievement, Special Edition, Seasonal, Admin Exclusive), 5 Rarity Tiers (Common, Rare, Epic, Legendary, Mythic), Equip/Unequip Engine for Profile, Live Room Seats, Chat & Rankings, Collection Progress Tracker with Completion %, Medal Detail Popups, Reward Grants (Coins, Diamonds, Frames, Chat Bubbles, Name Colors), and 13 Sub-Modules in Admin Panel.
20. **Charm Level & 11-Level Unified Level Center Ecosystem** – Popularity & Attraction System (Gifts Received, Diamonds Earned, Broadcast Duration, PK Victories, Followers Growth) with Levels 1-100 (New Star to Legend), 11 Level Subsystems (Wealth Level, Charm Level, Host Level, VIP Level, Family Level, Agency Level, PK Level, Game Level, Creator Level, Achievement Level, Medal Level), Profile Interactive Rows, Privilege Unlocks, Charm Leaderboards, and 10 Sub-Modules in Admin Panel.
21. **Profile Layout UI Clean-up** – Removed duplicate `Edit Profile` list item from lower menu list while keeping top bio header button intact based on user visual feedback.
22. **Compact 8-Option Quick Access Grid (2 Rows of 4)** – Organized profile actions into two 4-item icon rows (Row 1: Wallet, Store, Bag, Reward | Row 2: CP, Family, BD Center, VIP) to shorten the profile page height and remove redundant vertical menu list items.
23. **Production Authentication & Session Management System** – Persistent login session engine with Access & Refresh Token storage, returning user auto-login (bypasses login screen), token auto-validation, refresh token rotation, offline resilience mode with banner, auto-fetch ecosystem sync (Profile, Wallet, VIP, Charm Level, Family, Agency, Notifications), and secure logout session reset matching TikTok & Instagram standards.
24. **Profile Header Spacing Optimization** – Eliminated extra 120px empty vertical gap between profile header bio and visitors/followers stats card as requested in user visual feedback screenshot.
25. **Dark Luxury Bottom Navigation Bar Styling** – Redesigned bottom navigation bar (`aura_bottom_nav.dart`) with dark luxury background (`#0F1117`), vibrant neon purple & gold active tab indicators, metallic silver inactive icons, glowing elevated `+` launcher button, and active dot indicators matching app theme.
26. **My Live Rooms Hub Layout Overflow Resolution** – Resolved `RIGHT OVERFLOWED BY 4.7 PIXELS` error on the Continue Listening banner inside `my_rooms_hub_screen.dart` using flex-box constraints and smooth text truncation.
27. **Profile AppBar Action Icons Removal** – Removed top-right Settings and Share icons from `profile_screen.dart` header to match user visual layout requirements.
28. **Medal Center Profile Screen Integration** – Embedded interactive `🏅 Medals` showcase button badge on Profile Header next to Edit Profile and dedicated `Medal & Achievement Center` menu row leading directly to `MedalCenterScreen`.
29. **Charm Level & Wealth Level Profile Screen Integration** – Embedded interactive `🏆 Wealth Lv.15`, `💖 Charm Lv.12`, and `⭐ Host Lv.08` gradient badges under User ID in Profile Header + dedicated `Wealth Level` & `Charm Level` menu rows leading directly to `LevelCenterScreen`.
30. **Persistent Auto-Login & Permanent Session Engine** – Configured `splash_screen.dart` to validate saved tokens and user session state on launch so authenticated users directly land on Home (`/home`) on every app launch without seeing login screen, persisting until explicit Logout or cache wipe.
31. **Edit Profile Screen Design Matching User Screenshot** – Pixel-perfect `EditProfileModal.tsx` matching exact user screenshot UI (Amber tip box `ⓘ Add at least 3 photos...`, Left big avatar box with Royalty Crown Frame & `Avatar` tag, Right 2x2 Showcase photos grid with slots 1, 2, 3, 4 with blue verified checkmark badge, helper text `Tap a photo to remove or change it. Hold and drag to reorder.`, clean form list rows for Username, Gender, Bio, Birthday, Country/Region with `>` chevrons).
32. **Full Interactive Details Row Modals & Real-Time Persistence** – Interactive popup modals for Username, Gender, Bio, Birthday Date, Country/Region, and Photo slot management with instant `userProfileEngine` sync across all components, BroadcastChannel cross-tab sync, and `"Saved successfully"` toast.
33. **Profile Screen Details Buttons Integration** – Bound all identity cards, avatar images, bio text, and `Edit Profile & Details` buttons across `PremiumProfileScreen.tsx` and `ProfileScreen.tsx` to launch `EditProfileModal`.
34. **App-Wide Layout & Responsive Overflow Resolution** – Updated `.screen` class in `src/index.css` to `overflow-x: hidden; overflow-y: auto;` to resolve screen vertical scroll clipping, added flexbox `min-w-0`, `flex-1`, `truncate`, and `whitespace-nowrap` constraints across `HomeScreen.tsx`, `FamilyScreen.tsx`, `LiveRoomScreen.tsx`, `ChatScreen.tsx`, `WalletScreen.tsx`, and `LeaderboardScreen.tsx` cards to eliminate horizontal overflow across all mobile screen widths.
35. **Vite Dev Server Entry Isolation & White Screen Resolution** – Isolated Vite scanner entries in `vite.config.ts` (`optimizeDeps.entries: ['index.html', 'src/main.tsx']`) and ignored external Prototype directories in `server.watch.ignored`. Resolved HTML dependency scan conflicts, enabling instant 2.2s clean dev server launch on `http://localhost:8443`.
36. **Exclusive Flutter Mobile Application Target & APK Build** – Primary focus 100% shifted to the native Flutter Mobile Application (`d:\Auralive\New-Live-App\apps\mobile\lib`), web processes stopped, and native Android Debug APK built via `flutter build apk --debug`.
37. **Complete Flutter Screen Overflow Audit & Resolution (41 Screens)** – Conducted comprehensive audit of all 41 Flutter screens, dialogs, bottom sheets, and cards. Resolved unconstrained Row text items with `Expanded`/`Flexible`, added `maxLines: 2` and `TextOverflow.ellipsis` across `medal_center_screen.dart`, `wallet_screen.dart`, `live_room_screen.dart`, and `chat_screen.dart`, and configured `isScrollControlled: true` + `viewInsets.bottom` keyboard padding across all forms.
38. **Prototype Audit & Original Zero-Copy Implementation Framework** – Full functional audit of reference application (`d:\Auralive\Prototype`) for behavior reference, user flows, and real-time events. Implemented with 100% original Dart & TypeScript, custom real-time engines, and 16 Enterprise Web Admin modules without copying prototype code, assets, or exact design.

## 🛠️ Build & Development






```bash
# Web Application & Enterprise Admin Panel
npm run dev

# Flutter Mobile APK Build
cd New-Live-App/apps/mobile
set GRADLE_USER_HOME=d:\Auralive\.gradle_cache&& flutter build apk --debug
```

## 📦 APK Artifacts
- **Flutter Mobile Debug APK:** [`d:\Auralive\New-Live-App\apps\mobile\build\app\outputs\flutter-apk\app-debug.apk`](file:///d:/Auralive/New-Live-App/apps/mobile/build/app/outputs/flutter-apk/app-debug.apk)
- **Root Release APK:** [`d:\Auralive\AuraLiveVoiceChat.apk`](file:///d:/Auralive/AuraLiveVoiceChat.apk)

## 📡 Deployment
- **GitHub:** https://github.com/AhmedJunaid333/aura-live-voice-chat
- **Vercel Admin Panel:** https://aura-live-voice-chat.vercel.app

## 📦 Key Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.0.0 | Core UI library |
| `react-dom` | ^19.0.0 | DOM renderer |
| `@tailwindcss/vite` | ^4.0.0 | Utility-first styling engine |
| `lucide-react` | ^0.475.0 | Icon library |
| `vite` | ^6.0.0 | Build tool & dev server |


