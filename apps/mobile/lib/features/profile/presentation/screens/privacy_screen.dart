import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/animations.dart';

class PrivacyScreen extends StatefulWidget {
  const PrivacyScreen({super.key});

  @override
  State<PrivacyScreen> createState() => _PrivacyScreenState();
}

class _PrivacyScreenState extends State<PrivacyScreen> {
  bool _hideOnlineStatus = false;
  bool _hideLocation = false;
  bool _hideVIPBadge = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Iconsax.arrow_left, color: AuraColors.textPrimary),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/settings');
            }
          },
        ),
        title: Text(
          'Privacy Controls',
          style: AuraTypography.headlineSmall,
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AuraFadeIn(
              delay: const Duration(milliseconds: 100),
              child: Text('Visibility & Status', style: AuraTypography.titleLarge),
            ),
            AuraSpacing.vMd,

            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: ClipRRect(
                borderRadius: AuraRadius.brLg,
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    decoration: BoxDecoration(
                      color: AuraColors.glassBg,
                      borderRadius: AuraRadius.brLg,
                      border: Border.all(color: AuraColors.glassBorder),
                    ),
                    child: Column(
                      children: [
                        SwitchListTile(
                          value: _hideOnlineStatus,
                          activeColor: AuraColors.primary,
                          onChanged: (val) => setState(() => _hideOnlineStatus = val),
                          secondary: const Icon(Iconsax.eye_slash, color: AuraColors.primary),
                          title: Text('Hide Online Status', style: AuraTypography.bodyLarge),
                          subtitle: Text('Do not show green active indicator to non-friends.', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                        ),
                        const Divider(height: 1, indent: 56, color: AuraColors.border),
                        SwitchListTile(
                          value: _hideLocation,
                          activeColor: AuraColors.primary,
                          onChanged: (val) => setState(() => _hideLocation = val),
                          secondary: const Icon(Iconsax.location_slash, color: AuraColors.primary),
                          title: Text('Hide Nearby Distance', style: AuraTypography.bodyLarge),
                          subtitle: Text('Hide exact distance on Moments & Live feed.', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                        ),
                        const Divider(height: 1, indent: 56, color: AuraColors.border),
                        SwitchListTile(
                          value: _hideVIPBadge,
                          activeColor: AuraColors.primary,
                          onChanged: (val) => setState(() => _hideVIPBadge = val),
                          secondary: const Icon(Iconsax.crown, color: AuraColors.primary),
                          title: Text('Hide Noble / VIP Badge', style: AuraTypography.bodyLarge),
                          subtitle: Text('Hide level badge tag in live chat streams.', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            AuraSpacing.vLg,

            AuraFadeIn(
              delay: const Duration(milliseconds: 300),
              child: Text('Blacklist & Permissions', style: AuraTypography.titleLarge),
            ),
            AuraSpacing.vMd,

            AuraFadeIn(
              delay: const Duration(milliseconds: 400),
              child: ClipRRect(
                borderRadius: AuraRadius.brLg,
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    decoration: BoxDecoration(
                      color: AuraColors.glassBg,
                      borderRadius: AuraRadius.brLg,
                      border: Border.all(color: AuraColors.glassBorder),
                    ),
                    child: ListTile(
                      leading: const Icon(Iconsax.minus_cirlce, color: AuraColors.error),
                      title: Text('Blocked Users List', style: AuraTypography.bodyLarge),
                      subtitle: Text('Manage blocked contacts & muted users.', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                      trailing: const Icon(Iconsax.arrow_right_3, color: AuraColors.textSecondary),
                      onTap: () {},
                    ),
                  ),
                ),
              ),
            ),

            AuraSpacing.vLg,
          ],
        ),
      ),
    );
  }
}
