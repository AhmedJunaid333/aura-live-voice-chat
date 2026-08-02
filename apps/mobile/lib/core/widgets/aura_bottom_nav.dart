import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/live_room/presentation/screens/go_live_sheet.dart';

class AuraBottomNav extends StatelessWidget {
  final String activeTab; // 'home', 'moments', 'live', 'chat', 'me'

  const AuraBottomNav({
    super.key,
    required this.activeTab,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: Color(0xFFF1F5F9), width: 1),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 12,
            offset: Offset(0, -4),
          ),
        ],
      ),
      padding: const EdgeInsets.only(top: 6, bottom: 14),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // 1. EXPLORE (Home)
          _buildNavItem(
            context,
            id: 'home',
            label: 'EXPLORE',
            icon: Icons.explore_outlined,
            activeIcon: Icons.explore,
            route: '/home',
          ),

          // 2. MOMENTS (Feed)
          _buildNavItem(
            context,
            id: 'moments',
            label: 'MOMENTS',
            icon: Icons.public_outlined,
            activeIcon: Icons.public,
            route: '/live-feed',
          ),

          // 3. Center Elevated Gold '+' Floating Launcher Button
          GestureDetector(
            onTap: () => GoLiveSheet.show(context),
            child: Container(
              width: 54,
              height: 54,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [Color(0xFFD4AF37), Color(0xFFC69214)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Color(0x66C69214),
                    blurRadius: 14,
                    spreadRadius: 2,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: const Icon(
                Icons.add,
                color: Colors.white,
                size: 32,
              ),
            ),
          ),

          // 4. CHAT (Messages with Badge)
          _buildNavItem(
            context,
            id: 'chat',
            label: 'CHAT',
            icon: Icons.chat_bubble_outline,
            activeIcon: Icons.chat_bubble,
            route: '/chat',
            badgeCount: 5,
          ),

          // 5. PROFILE (Me)
          _buildNavItem(
            context,
            id: 'me',
            label: 'PROFILE',
            icon: Icons.person_outline,
            activeIcon: Icons.person,
            route: '/profile',
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(
    BuildContext context, {
    required String id,
    required String label,
    required IconData icon,
    required IconData activeIcon,
    required String route,
    int badgeCount = 0,
  }) {
    final isSelected = activeTab == id;
    const activeColor = Color(0xFF1E1B18);
    const inactiveColor = Color(0xFF64748B);

    return GestureDetector(
      onTap: () {
        if (id == 'home') {
          if (context.canPop()) {
            context.pop();
          } else if (activeTab != 'home') {
            context.go('/home');
          }
        } else {
          if (activeTab != id) {
            context.push(route);
          }
        }
      },
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Icon(
                isSelected ? activeIcon : icon,
                color: isSelected ? activeColor : inactiveColor,
                size: 24,
              ),
              if (badgeCount > 0)
                Positioned(
                  top: -4,
                  right: -8,
                  child: Container(
                    padding: const EdgeInsets.all(3),
                    decoration: const BoxDecoration(
                      color: Color(0xFFDC2626),
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                    child: Text(
                      '$badgeCount',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              color: isSelected ? activeColor : inactiveColor,
              fontSize: 9,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
              letterSpacing: 0.5,
              fontFamily: 'Hanken Grotesk',
            ),
          ),
        ],
      ),
    );
  }
}
