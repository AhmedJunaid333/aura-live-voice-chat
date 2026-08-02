import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import '../colors.dart';
import '../typography.dart';
import '../spacing.dart';
import '../radius.dart';
import '../shadows.dart';
import '../gradients.dart';

class AuraGlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final BorderRadiusGeometry? borderRadius;

  const AuraGlassCard({
    super.key,
    required this.child,
    this.padding,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: borderRadius ?? AuraRadius.brLg,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: padding ?? AuraSpacing.allLg,
          decoration: BoxDecoration(
            color: AuraColors.glassBg,
            borderRadius: borderRadius ?? AuraRadius.brLg,
            border: Border.all(color: AuraColors.glassBorder),
            boxShadow: AuraShadows.glass,
          ),
          child: child,
        ),
      ),
    );
  }
}

class AuraLiveCard extends StatelessWidget {
  final String thumbnailUrl;
  final String hostName;
  final int viewerCount;
  final VoidCallback onTap;

  const AuraLiveCard({
    super.key,
    required this.thumbnailUrl,
    required this.hostName,
    required this.viewerCount,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: AuraRadius.brLg,
          color: AuraColors.surfaceElevated,
          boxShadow: AuraShadows.card,
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Thumbnail placeholder (using simple container for now)
            Container(color: AuraColors.surfaceLight),
            // Gradient overlay
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    AuraColors.black40,
                  ],
                ),
              ),
            ),
            // Top badges
            Positioned(
              top: AuraSpacing.sm,
              left: AuraSpacing.sm,
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: AuraSpacing.sm, vertical: AuraSpacing.xs),
                decoration: BoxDecoration(
                  gradient: AuraGradients.live,
                  borderRadius: AuraRadius.brXs,
                ),
                child: Text('LIVE', style: AuraTypography.badge.copyWith(color: AuraColors.white)),
              ),
            ),
            Positioned(
              top: AuraSpacing.sm,
              right: AuraSpacing.sm,
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: AuraSpacing.sm, vertical: AuraSpacing.xs),
                decoration: BoxDecoration(
                  color: AuraColors.black40,
                  borderRadius: AuraRadius.brXs,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Iconsax.eye, color: AuraColors.white, size: 12),
                    AuraSpacing.hXs,
                    Text('$viewerCount', style: AuraTypography.badge.copyWith(color: AuraColors.white)),
                  ],
                ),
              ),
            ),
            // Host info
            Positioned(
              bottom: AuraSpacing.sm,
              left: AuraSpacing.sm,
              right: AuraSpacing.sm,
              child: Text(
                hostName,
                style: AuraTypography.labelLarge.copyWith(color: AuraColors.white),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class AuraWalletCard extends StatelessWidget {
  final int balance;
  final VoidCallback onTopUp;

  const AuraWalletCard({
    super.key,
    required this.balance,
    required this.onTopUp,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: AuraSpacing.allLg,
      decoration: BoxDecoration(
        gradient: AuraGradients.primary,
        borderRadius: AuraRadius.brXl,
        boxShadow: AuraShadows.neonViolet,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Total Balance', style: AuraTypography.bodyMedium.copyWith(color: AuraColors.white)),
          AuraSpacing.vSm,
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Iconsax.coin1, color: AuraColors.gold, size: 28),
                  AuraSpacing.hSm,
                  Text('$balance', style: AuraTypography.displaySmall.copyWith(color: AuraColors.white)),
                ],
              ),
              ElevatedButton(
                onPressed: onTopUp,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AuraColors.white,
                  foregroundColor: AuraColors.primary,
                  shape: RoundedRectangleBorder(borderRadius: AuraRadius.brPill),
                ),
                child: const Text('Top Up'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class AuraVipCard extends StatelessWidget {
  final String tier;
  final String description;

  const AuraVipCard({
    super.key,
    required this.tier,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return AuraGlassCard(
      child: Container(
        decoration: BoxDecoration(
          gradient: AuraGradients.vip,
          borderRadius: AuraRadius.brLg,
        ),
        padding: AuraSpacing.allLg,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Iconsax.crown1, color: AuraColors.gold, size: 24),
                AuraSpacing.hSm,
                Text(tier, style: AuraTypography.titleLarge.copyWith(color: AuraColors.gold)),
              ],
            ),
            AuraSpacing.vSm,
            Text(description, style: AuraTypography.bodyMedium.copyWith(color: AuraColors.white)),
          ],
        ),
      ),
    );
  }
}

class AuraDiamondCard extends StatelessWidget {
  final int diamondCount;

  const AuraDiamondCard({
    super.key,
    required this.diamondCount,
  });

  @override
  Widget build(BuildContext context) {
    return AuraGlassCard(
      child: Container(
        decoration: BoxDecoration(
          gradient: AuraGradients.diamond,
          borderRadius: AuraRadius.brLg,
        ),
        padding: AuraSpacing.allLg,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Diamonds Earned', style: AuraTypography.titleMedium.copyWith(color: AuraColors.white)),
            Row(
              children: [
                const Icon(Icons.diamond_outlined, color: AuraColors.neonCyan, size: 24),
                AuraSpacing.hSm,
                Text('$diamondCount', style: AuraTypography.headlineMedium.copyWith(color: AuraColors.neonCyan)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class AuraAgencyCard extends StatelessWidget {
  final String agencyName;
  final int members;

  const AuraAgencyCard({
    super.key,
    required this.agencyName,
    required this.members,
  });

  @override
  Widget build(BuildContext context) {
    return AuraGlassCard(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Agency', style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary)),
              AuraSpacing.vXs,
              Text(agencyName, style: AuraTypography.titleMedium),
            ],
          ),
          Container(
            padding: EdgeInsets.symmetric(horizontal: AuraSpacing.sm, vertical: AuraSpacing.xs),
            decoration: BoxDecoration(
              color: AuraColors.surfaceLight,
              borderRadius: AuraRadius.brPill,
            ),
            child: Row(
              children: [
                const Icon(Iconsax.profile_2user, color: AuraColors.primary, size: 16),
                AuraSpacing.hXs,
                Text('$members', style: AuraTypography.labelMedium),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class AuraNotificationCard extends StatelessWidget {
  final String title;
  final String message;
  final String time;
  final bool isUnread;

  const AuraNotificationCard({
    super.key,
    required this.title,
    required this.message,
    required this.time,
    this.isUnread = false,
  });

  @override
  Widget build(BuildContext context) {
    return AuraGlassCard(
      padding: AuraSpacing.allMd,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 8,
            height: 8,
            margin: const EdgeInsets.only(top: 6),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isUnread ? AuraColors.neonRose : Colors.transparent,
            ),
          ),
          AuraSpacing.hSm,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(title, style: AuraTypography.titleMedium),
                    Text(time, style: AuraTypography.caption.copyWith(color: AuraColors.textTertiary)),
                  ],
                ),
                AuraSpacing.vXs,
                Text(message, style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
