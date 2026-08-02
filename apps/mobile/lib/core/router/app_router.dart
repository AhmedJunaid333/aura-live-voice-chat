import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/register_screen.dart';
import '../../features/auth/presentation/screens/onboarding_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/home/presentation/screens/explore_screen.dart';
import '../../features/home/presentation/screens/live_feed_screen.dart';
import '../../features/live_room/presentation/screens/live_room_screen.dart';
import '../../features/live_room/presentation/screens/audio_meetup_screen.dart';
import '../../features/economy/presentation/screens/wallet_screen.dart';
import '../../features/economy/presentation/screens/vip_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../../features/profile/presentation/screens/settings_screen.dart';
import '../../features/profile/presentation/screens/cp_screen.dart';
import '../../features/profile/presentation/screens/level_screen.dart';
import '../../features/profile/presentation/screens/host_center_screen.dart';
import '../../features/profile/presentation/screens/bd_center_screen.dart';
import '../../features/profile/presentation/screens/invite_friends_screen.dart';
import '../../features/profile/presentation/screens/contact_us_screen.dart';
import '../../features/profile/presentation/screens/account_security_screen.dart';
import '../../features/profile/presentation/screens/privacy_screen.dart';
import '../../features/profile/presentation/screens/notification_settings_screen.dart';
import '../../features/profile/presentation/screens/language_screen.dart';
import '../../features/profile/presentation/screens/help_support_screen.dart';
import '../../features/profile/presentation/screens/store_screen.dart';
import '../../features/profile/presentation/screens/bag_screen.dart';
import '../../features/profile/presentation/screens/reward_screen.dart';
import '../../features/revenue/family_screen.dart';
import '../../features/revenue/leaderboard_screen.dart';
import '../../features/revenue/agency_panel_screen.dart';
import '../../features/ai_assistant/presentation/screens/ai_discover_screen.dart';
import '../../features/chat/presentation/screens/chat_screen.dart';

import '../../features/home/presentation/screens/my_rooms_hub_screen.dart';
import '../../features/live_room/presentation/screens/create_room_wizard_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/my-rooms',
        builder: (context, state) => const MyRoomsHubScreen(),
      ),
      GoRoute(
        path: '/create-room-wizard',
        builder: (context, state) => const CreateRoomWizardScreen(),
      ),
      GoRoute(
        path: '/',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/explore',
        builder: (context, state) => const ExploreScreen(),
      ),
      GoRoute(
        path: '/live-feed',
        builder: (context, state) => const LiveFeedScreen(),
      ),
      GoRoute(
        path: '/live-room/:id',
        builder: (context, state) {
          final roomId = state.pathParameters['id'] ?? '1';
          return LiveRoomScreen(roomId: roomId);
        },
      ),
      GoRoute(
        path: '/audio-meetup',
        builder: (context, state) {
          final seatsStr = state.uri.queryParameters['seats'];
          final seatCount = seatsStr != null ? int.tryParse(seatsStr) ?? 10 : 10;
          return AudioMeetupScreen(initialSeatCount: seatCount);
        },
      ),
      GoRoute(
        path: '/wallet',
        builder: (context, state) => const WalletScreen(),
      ),
      GoRoute(
        path: '/vip',
        builder: (context, state) => const VipScreen(),
      ),
      GoRoute(
        path: '/store',
        builder: (context, state) => const StoreScreen(),
      ),
      GoRoute(
        path: '/bag',
        builder: (context, state) => const BagScreen(),
      ),
      GoRoute(
        path: '/reward',
        builder: (context, state) => const RewardScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/cp',
        builder: (context, state) => const CpScreen(),
      ),
      GoRoute(
        path: '/level',
        builder: (context, state) => const LevelScreen(),
      ),
      GoRoute(
        path: '/host-center',
        builder: (context, state) => const HostCenterScreen(),
      ),
      GoRoute(
        path: '/bd-center',
        builder: (context, state) => const BdCenterScreen(),
      ),
      GoRoute(
        path: '/invite-friends',
        builder: (context, state) => const InviteFriendsScreen(),
      ),
      GoRoute(
        path: '/contact-us',
        builder: (context, state) => const ContactUsScreen(),
      ),
      GoRoute(
        path: '/account-security',
        builder: (context, state) => const AccountSecurityScreen(),
      ),
      GoRoute(
        path: '/privacy',
        builder: (context, state) => const PrivacyScreen(),
      ),
      GoRoute(
        path: '/notification-settings',
        builder: (context, state) => const NotificationSettingsScreen(),
      ),
      GoRoute(
        path: '/language',
        builder: (context, state) => const LanguageScreen(),
      ),
      GoRoute(
        path: '/help-support',
        builder: (context, state) => const HelpSupportScreen(),
      ),
      GoRoute(
        path: '/family',
        builder: (context, state) => const FamilyScreen(),
      ),
      GoRoute(
        path: '/leaderboard',
        builder: (context, state) => const LeaderboardScreen(),
      ),
      GoRoute(
        path: '/agency-panel',
        builder: (context, state) => const AgencyPanelScreen(),
      ),
      GoRoute(
        path: '/ai-discover',
        builder: (context, state) => const AIDiscoverScreen(),
      ),
      GoRoute(
        path: '/chat',
        builder: (context, state) => const ChatScreen(),
      ),
    ],
  );
});
