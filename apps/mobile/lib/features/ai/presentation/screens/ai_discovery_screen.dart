import 'dart:ui';
import 'package:flutter/material.dart';
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

class AiDiscoveryScreen extends StatelessWidget {
  const AiDiscoveryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: FittedBox(fit: BoxFit.scaleDown, child: Text('✨ AI Discovery & Recommendations', style: AuraTypography.titleLarge)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AuraFadeIn(
              delay: const Duration(milliseconds: 100),
              child: Text('Recommended For You', style: AuraTypography.titleLarge),
            ),
            AuraSpacing.vMd,
            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: _buildRoomCard('🔥 Midnight Chill & Songs', 'Aura Melody', '98.5% Match', '450 Viewers'),
            ),
            AuraSpacing.vLg,
            AuraFadeIn(
              delay: const Duration(milliseconds: 300),
              child: Text('⭐ Rising Hosts in Pakistan', style: AuraTypography.titleLarge),
            ),
            AuraSpacing.vMd,
            AuraFadeIn(
              delay: const Duration(milliseconds: 400),
              child: _buildRoomCard('🎤 Live Vocal Arena', 'DJ Alex', '95.0% Match', '1.2K Viewers'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRoomCard(String title, String host, String matchScore, String viewers) {
    return ClipRRect(
      borderRadius: AuraRadius.brLg,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AuraColors.glassBg,
            borderRadius: AuraRadius.brLg,
            border: Border.all(color: AuraColors.glassBorder),
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AuraColors.primary,
                ),
                child: const Icon(Iconsax.star1, color: AuraColors.warning),
              ),
              AuraSpacing.hMd,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: AuraTypography.bodyLarge),
                    AuraSpacing.vXxs,
                    Text('Host: $host • $viewers', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AuraColors.error,
                  borderRadius: AuraRadius.brSm,
                ),
                child: Text(matchScore, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
