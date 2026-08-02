import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/gradients.dart';
import '../../../../core/design_system/animations.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Iconsax.arrow_left_2, color: AuraColors.textPrimary),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/home');
            }
          },
        ),
        title: Text(
          'Settings',
          style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          children: [
            // Settings Group 1
            _buildGroupCard([
              _buildSettingRow(
                icon: Iconsax.security_user,
                title: 'Account Security',
                onTap: () => context.push('/account-security'),
              ),
              _buildSettingRow(
                icon: Iconsax.lock,
                title: 'Privacy',
                onTap: () => context.push('/privacy'),
              ),
            ]),

            AuraSpacing.vLg,

            // Settings Group 2
            _buildGroupCard([
              _buildSettingRow(
                icon: Iconsax.notification,
                title: 'Notifications',
                onTap: () => context.push('/notification-settings'),
              ),
              _buildSettingRow(
                icon: Iconsax.language_square,
                title: 'Language',
                onTap: () => context.push('/language'),
              ),
            ]),

            AuraSpacing.vLg,

            // Settings Group 3
            _buildGroupCard([
              _buildSettingRow(
                icon: Iconsax.message_question,
                title: 'Help & Support',
                onTap: () => context.push('/help-support'),
              ),
            ]),

            AuraSpacing.vLg,
            AuraSpacing.vLg,

            // Log Out Button
            Center(
              child: ElevatedButton(
                onPressed: () => context.go('/login'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AuraColors.surfaceLight,
                  foregroundColor: AuraColors.error,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                    side: BorderSide(color: AuraColors.error.withOpacity(0.5)),
                  ),
                ),
                child: Text('Log Out', style: AuraTypography.labelLarge.copyWith(color: AuraColors.error)),
              ),
            ),

            AuraSpacing.vLg,

            Text(
              'Version 2.4.1 (Premium)',
              style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary),
            ),

            AuraSpacing.vLg,
          ],
        ),
      ),
    );
  }

  Widget _buildGroupCard(List<Widget> rows) {
    return ClipRRect(
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
            children: List.generate(rows.length, (index) {
              return Column(
                children: [
                  rows[index],
                  if (index < rows.length - 1)
                    Divider(height: 1, color: AuraColors.border, indent: 16, endIndent: 16),
                ],
              );
            }),
          ),
        ),
      ),
    );
  }

  Widget _buildSettingRow({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: AuraColors.surface,
          shape: BoxShape.circle,
          border: Border.all(color: AuraColors.border),
        ),
        child: Icon(icon, color: AuraColors.primary, size: 20),
      ),
      title: Text(
        title,
        style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary),
      ),
      trailing: const Icon(Iconsax.arrow_right_3, color: AuraColors.textSecondary, size: 18),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    );
  }
}
