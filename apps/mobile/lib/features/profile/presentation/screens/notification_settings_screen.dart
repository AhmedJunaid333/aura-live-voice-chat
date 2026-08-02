import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/gradients.dart';
import '../../../../core/design_system/animations.dart';
import '../../../../core/design_system/icons.dart';

class NotificationSettingsScreen extends StatefulWidget {
  const NotificationSettingsScreen({super.key});

  @override
  State<NotificationSettingsScreen> createState() => _NotificationSettingsScreenState();
}

class _NotificationSettingsScreenState extends State<NotificationSettingsScreen> {
  bool _liveAlerts = true;
  bool _directMessages = true;
  bool _giftAlerts = true;
  bool _soundVibration = true;

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
          'Notification Settings',
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
              child: Text('Push Alerts', style: AuraTypography.titleLarge),
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
                          value: _liveAlerts,
                          activeColor: AuraColors.primary,
                          onChanged: (val) => setState(() => _liveAlerts = val),
                          secondary: const Icon(Iconsax.video_play, color: AuraColors.primary),
                          title: Text('Following Live Alerts', style: AuraTypography.bodyLarge),
                          subtitle: Text('Notify when your favorite host starts live stream.', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                        ),
                        const Divider(height: 1, indent: 56, color: AuraColors.border),
                        SwitchListTile(
                          value: _directMessages,
                          activeColor: AuraColors.primary,
                          onChanged: (val) => setState(() => _directMessages = val),
                          secondary: const Icon(Iconsax.message, color: AuraColors.primary),
                          title: Text('Direct Messages', style: AuraTypography.bodyLarge),
                          subtitle: Text('Notify when receiving new private chat messages.', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                        ),
                        const Divider(height: 1, indent: 56, color: AuraColors.border),
                        SwitchListTile(
                          value: _giftAlerts,
                          activeColor: AuraColors.primary,
                          onChanged: (val) => setState(() => _giftAlerts = val),
                          secondary: const Icon(Iconsax.gift, color: AuraColors.primary),
                          title: Text('Gift Received Alerts', style: AuraTypography.bodyLarge),
                          subtitle: Text('Notify on receiving diamond gifts or CP intimacy.', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                        ),
                        const Divider(height: 1, indent: 56, color: AuraColors.border),
                        SwitchListTile(
                          value: _soundVibration,
                          activeColor: AuraColors.primary,
                          onChanged: (val) => setState(() => _soundVibration = val),
                          secondary: const Icon(Iconsax.volume_high, color: AuraColors.primary),
                          title: Text('Sound & Vibration', style: AuraTypography.bodyLarge),
                          subtitle: Text('Play sound chime for incoming notifications.', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                        ),
                      ],
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
