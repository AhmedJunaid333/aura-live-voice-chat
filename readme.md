# Aura Live Voice Chat – Next-Gen Live Streaming & Audio Broadcast Platform

An enterprise-grade live broadcasting, multi-seat voice lounge (10, 15, 20 seats), real-time PK battle arena, VIP virtual economy, Level Progression Studio, and comprehensive Web Admin Console.

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


