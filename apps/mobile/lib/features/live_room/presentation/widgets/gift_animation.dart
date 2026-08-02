import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/gradients.dart';
import '../../../../core/design_system/animations.dart';

class GiftAnimationOverlay extends StatelessWidget {
  final String giftName;
  final String senderName;

  const GiftAnimationOverlay({super.key, required this.giftName, required this.senderName});

  @override
  Widget build(BuildContext context) {
    return AuraFadeIn(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          gradient: AuraGradients.primary,
          borderRadius: AuraRadius.brXl,
          boxShadow: AuraShadows.neonViolet,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Iconsax.gift, color: AuraColors.accent, size: 24),
            AuraSpacing.hSm,
            Text(
              '$senderName sent $giftName! 🎉',
              style: AuraTypography.labelLarge.copyWith(color: AuraColors.white),
            ),
          ],
        ),
      ),
    );
  }
}
