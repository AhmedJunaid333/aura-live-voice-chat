import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import '../colors.dart';
import '../typography.dart';
import '../spacing.dart';
import '../radius.dart';
import '../gradients.dart';

class AuraLevelBadge extends StatelessWidget {
  final int level;

  const AuraLevelBadge({
    super.key,
    required this.level,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: AuraSpacing.sm, vertical: AuraSpacing.xs),
      decoration: BoxDecoration(
        gradient: AuraGradients.primary,
        borderRadius: AuraRadius.brPill,
      ),
      child: Text(
        'Lv.$level',
        style: AuraTypography.badge.copyWith(color: AuraColors.white),
      ),
    );
  }
}

class AuraVerificationBadge extends StatelessWidget {
  const AuraVerificationBadge({super.key});

  @override
  Widget build(BuildContext context) {
    return const Icon(
      Icons.verified,
      color: AuraColors.neonCyan,
      size: 16,
    );
  }
}

class AuraCoinWidget extends StatelessWidget {
  final int amount;

  const AuraCoinWidget({
    super.key,
    required this.amount,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Iconsax.coin1, color: AuraColors.gold, size: 16),
        AuraSpacing.hXs ?? const SizedBox(width: 4),
        Text(
          '$amount',
          style: AuraTypography.coinAmount.copyWith(color: AuraColors.gold),
        ),
      ],
    );
  }
}

class AuraVipBadge extends StatelessWidget {
  final String tier;

  const AuraVipBadge({
    super.key,
    required this.tier,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: AuraSpacing.sm, vertical: AuraSpacing.xs),
      decoration: BoxDecoration(
        gradient: AuraGradients.vip,
        borderRadius: AuraRadius.brPill,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Iconsax.crown1, color: AuraColors.white, size: 12),
          AuraSpacing.hXs ?? const SizedBox(width: 4),
          Text(
            tier.toUpperCase(),
            style: AuraTypography.badge.copyWith(color: AuraColors.white),
          ),
        ],
      ),
    );
  }
}
