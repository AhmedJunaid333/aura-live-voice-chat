import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import 'package:go_router/go_router.dart';
import '../../../features/live_room/presentation/screens/go_live_sheet.dart';
import '../colors.dart';
import '../typography.dart';
import '../spacing.dart';
import '../shadows.dart';
import '../gradients.dart';
import '../animations.dart';

class AuraBottomNavBar extends StatelessWidget {
  final String activeTab;

  const AuraBottomNavBar({
    super.key,
    required this.activeTab,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          decoration: const BoxDecoration(
            color: AuraColors.glassBg,
            border: Border(
              top: BorderSide(color: AuraColors.glassBorder, width: 1),
            ),
            boxShadow: AuraShadows.glass,
          ),
          padding: const EdgeInsets.only(top: 6, bottom: 14),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              _buildNavItem(
                context,
                id: 'home',
                label: 'EXPLORE',
                icon: Iconsax.discover,
                activeIcon: Iconsax.discover5,
                route: '/home',
              ),
              _buildNavItem(
                context,
                id: 'moments',
                label: 'MOMENTS',
                icon: Iconsax.global,
                activeIcon: Iconsax.global5,
                route: '/live-feed',
              ),
              AuraBounce(
      onTap: () => GoLiveSheet.show(context),
                child: Container(
                  width: 54,
                  height: 54,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: AuraGradients.primary,
                    boxShadow: AuraShadows.neonViolet,
                  ),
                  child: const Icon(
                    Iconsax.add,
                    color: AuraColors.white,
                    size: 32,
                  ),
                ),
              ),
              _buildNavItem(
                context,
                id: 'chat',
                label: 'CHAT',
                icon: Iconsax.message,
                activeIcon: Iconsax.message5,
                route: '/chat',
                badgeCount: 5,
              ),
              _buildNavItem(
                context,
                id: 'me',
                label: 'PROFILE',
                icon: Iconsax.profile_circle,
                activeIcon: Iconsax.profile_circle5,
                route: '/profile',
              ),
            ],
          ),
        ),
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
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: AuraColors.primary.withValues(alpha: 0.5),
                            blurRadius: 10,
                          ),
                        ]
                      : [],
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isSelected ? activeIcon : icon,
                  color: isSelected ? AuraColors.primary : AuraColors.textSecondary,
                  size: 24,
                ),
              ),
              if (badgeCount > 0)
                Positioned(
                  top: -4,
                  right: -8,
                  child: Container(
                    padding: const EdgeInsets.all(3),
                    decoration: const BoxDecoration(
                      color: AuraColors.error,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                    child: Text(
                      '$badgeCount',
                      style: AuraTypography.badge.copyWith(color: AuraColors.white, fontSize: 9),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
          AuraSpacing.vXs,
          Text(
            label,
            style: AuraTypography.overline.copyWith(
              color: isSelected ? AuraColors.primary : AuraColors.textSecondary,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class AuraAppBar extends StatelessWidget implements PreferredSizeWidget {
  final Widget? title;
  final String? titleText;
  final List<Widget>? actions;
  final Widget? leading;
  final bool centerTitle;

  const AuraAppBar({
    super.key,
    this.title,
    this.titleText,
    this.actions,
    this.leading,
    this.centerTitle = true,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          decoration: const BoxDecoration(
            color: AuraColors.glassBg,
            border: Border(
              bottom: BorderSide(color: AuraColors.glassBorder),
            ),
          ),
          child: SafeArea(
            bottom: false,
            child: SizedBox(
              height: 56,
              child: Stack(
                children: [
                  if (leading != null)
                    Positioned(
                      left: 0,
                      top: 0,
                      bottom: 0,
                      child: Center(child: leading!),
                    ),
                  if (leading == null && Navigator.canPop(context))
                    Positioned(
                      left: 0,
                      top: 0,
                      bottom: 0,
                      child: Center(
                        child: IconButton(
                          icon: const Icon(Iconsax.arrow_left, color: AuraColors.textPrimary),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ),
                    ),
                  Center(
                    child: title ??
                        Text(
                          titleText ?? '',
                          style: AuraTypography.titleLarge,
                        ),
                  ),
                  if (actions != null)
                    Positioned(
                      right: 0,
                      top: 0,
                      bottom: 0,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: actions!,
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(56.0);
}
