import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/animations.dart';

class InviteFriendsScreen extends StatefulWidget {
  const InviteFriendsScreen({super.key});

  @override
  State<InviteFriendsScreen> createState() => _InviteFriendsScreenState();
}

class _InviteFriendsScreenState extends State<InviteFriendsScreen> {
  final String _referralCode = 'AURA888';
  final int _totalInvited = 12;
  final String _earnedCoins = '12,000 Coins';

  void _copyCode() {
    Clipboard.setData(ClipboardData(text: _referralCode));
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text('Referral Code Copied! 📋', style: AuraTypography.bodyMedium),
      backgroundColor: AuraColors.surfaceLight,
    ));
  }

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
              context.go('/profile');
            }
          },
        ),
        title: Text(
          'Invite Friends & Rewards',
          style: AuraTypography.headlineSmall,
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Referral Card
            AuraSlideIn(
              delay: const Duration(milliseconds: 100),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF16A34A), Color(0xFF15803D)], // Keeping original green gradient for rewards
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: AuraRadius.brLg,
                  boxShadow: const [BoxShadow(color: Color(0x3316A34A), blurRadius: 16, offset: Offset(0, 6))],
                ),
                child: Column(
                  children: [
                    const Icon(Iconsax.star1, color: Colors.yellowAccent, size: 40),
                    AuraSpacing.vSm,
                    Text('Earn 1,000 Coins per Referral!', style: AuraTypography.titleLarge.copyWith(color: Colors.white)),
                    AuraSpacing.vXxs,
                    Text('Invite friends to join Auralive and receive instant rewards.', textAlign: TextAlign.center, style: AuraTypography.labelMedium.copyWith(color: const Color(0xFFDCFCE7))),
                    AuraSpacing.vLg,
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(color: Colors.white12, borderRadius: AuraRadius.brMd),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('YOUR REFERRAL CODE', maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelSmall.copyWith(color: Colors.white70, letterSpacing: 1.2)),
                                Text(_referralCode, maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.headlineMedium.copyWith(color: Colors.white)),
                              ],
                            ),
                          ),
                          GestureDetector(
                            onTap: _copyCode,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              decoration: BoxDecoration(color: Colors.white, borderRadius: AuraRadius.brMd),
                              child: Row(
                                children: [
                                  const Icon(Iconsax.copy, size: 14, color: Color(0xFF16A34A)),
                                  AuraSpacing.hSm,
                                  Text('Copy Code', style: AuraTypography.labelMedium.copyWith(color: const Color(0xFF16A34A))),
                                ],
                              ),
                            ),
                          )
                        ],
                      ),
                    ),
                    AuraSpacing.vMd,
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Expanded(child: _buildMetric('Friends Invited', '$_totalInvited Friends', Colors.white)),
                        Container(width: 1, height: 32, color: Colors.white30),
                        Expanded(child: _buildMetric('Total Earned', _earnedCoins, AuraColors.warning)),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            AuraSpacing.vLg,

            // Share Buttons Row
            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: Text('Share Invite Link', style: AuraTypography.titleLarge),
            ),
            AuraSpacing.vMd,
            AuraFadeIn(
              delay: const Duration(milliseconds: 300),
              child: Row(
                children: [
                  Expanded(child: _buildShareButton('WhatsApp', Iconsax.message, const Color(0xFF25D366))),
                  AuraSpacing.hMd,
                  Expanded(child: _buildShareButton('Facebook', Iconsax.forward, const Color(0xFF1877F2))),
                  AuraSpacing.hMd,
                  Expanded(child: _buildShareButton('Copy Link', Iconsax.link, AuraColors.primary)),
                ],
              ),
            ),

            AuraSpacing.vLg,
          ],
        ),
      ),
    );
  }

  Widget _buildMetric(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: AuraTypography.titleMedium.copyWith(color: color)),
        AuraSpacing.vXxs,
        Text(label, style: AuraTypography.labelSmall.copyWith(color: Colors.white70)),
      ],
    );
  }

  Widget _buildShareButton(String label, IconData icon, Color color) {
    return ClipRRect(
      borderRadius: AuraRadius.brLg,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: AuraColors.glassBg,
            borderRadius: AuraRadius.brLg,
            border: Border.all(color: AuraColors.glassBorder),
          ),
          child: Column(
            children: [
              Icon(icon, color: color, size: 24),
              AuraSpacing.vSm,
              Text(label, style: AuraTypography.labelMedium.copyWith(color: color)),
            ],
          ),
        ),
      ),
    );
  }
}
