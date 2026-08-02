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

class AccountSecurityScreen extends StatefulWidget {
  const AccountSecurityScreen({super.key});

  @override
  State<AccountSecurityScreen> createState() => _AccountSecurityScreenState();
}

class _AccountSecurityScreenState extends State<AccountSecurityScreen> {
  bool _is2FAEnabled = true;

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
          'Account Security',
          style: AuraTypography.headlineSmall,
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Security Score Card
            AuraSlideIn(
              delay: const Duration(milliseconds: 100),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF059669), Color(0xFF047857)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: AuraRadius.brLg,
                  boxShadow: const [BoxShadow(color: Color(0x33059669), blurRadius: 16, offset: Offset(0, 6))],
                ),
                child: Row(
                  children: [
                    const Icon(Iconsax.shield_tick, color: Colors.white, size: 40),
                    AuraSpacing.hMd,
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Security Rating: High 🛡️', style: AuraTypography.titleLarge.copyWith(color: Colors.white)),
                          AuraSpacing.vXxs,
                          Text('Your account is protected by 2FA & bound credentials.', style: AuraTypography.labelMedium.copyWith(color: const Color(0xFFA7F3D0))),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            AuraSpacing.vLg,

            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: Text('Account Credentials', style: AuraTypography.titleLarge),
            ),
            AuraSpacing.vMd,

            AuraFadeIn(
              delay: const Duration(milliseconds: 300),
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
                        ListTile(
                          leading: const Icon(Iconsax.mobile, color: AuraColors.primary),
                          title: Text('Phone Number', style: AuraTypography.bodyLarge),
                          subtitle: Text('+92 3** ****888', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                          trailing: Text('Bound', style: AuraTypography.labelMedium.copyWith(color: AuraColors.success)),
                        ),
                        const Divider(height: 1, indent: 56, color: AuraColors.border),
                        ListTile(
                          leading: const Icon(Iconsax.sms, color: AuraColors.primary),
                          title: Text('Email Address', style: AuraTypography.bodyLarge),
                          subtitle: Text('user@auralive.app', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                          trailing: Text('Bound', style: AuraTypography.labelMedium.copyWith(color: AuraColors.success)),
                        ),
                        const Divider(height: 1, indent: 56, color: AuraColors.border),
                        ListTile(
                          leading: const Icon(Iconsax.lock, color: AuraColors.primary),
                          title: Text('Change Password', style: AuraTypography.bodyLarge),
                          trailing: const Icon(Iconsax.arrow_right_3, color: AuraColors.textSecondary),
                          onTap: () {},
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            AuraSpacing.vLg,

            AuraFadeIn(
              delay: const Duration(milliseconds: 400),
              child: Text('Two-Factor Authentication', style: AuraTypography.titleLarge),
            ),
            AuraSpacing.vMd,

            AuraFadeIn(
              delay: const Duration(milliseconds: 500),
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
                    child: SwitchListTile(
                      value: _is2FAEnabled,
                      activeColor: AuraColors.primary,
                      onChanged: (val) => setState(() => _is2FAEnabled = val),
                      secondary: const Icon(Iconsax.shield_security, color: AuraColors.primary),
                      title: Text('Enable 2FA Verification', style: AuraTypography.bodyLarge),
                      subtitle: Text('Require SMS OTP code for new device logins.', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
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
