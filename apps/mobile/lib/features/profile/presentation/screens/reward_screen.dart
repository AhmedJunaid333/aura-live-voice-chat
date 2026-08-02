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
import '../../../../core/widgets/aura_animator.dart' hide AuraPulse, AuraFloat;

class RewardScreen extends StatefulWidget {
  const RewardScreen({super.key});

  @override
  State<RewardScreen> createState() => _RewardScreenState();
}

class _RewardScreenState extends State<RewardScreen> {
  int _streakDays = 4;

  final List<Map<String, dynamic>> _streakRewards = [
    {'day': 1, 'reward': '100 Coins', 'claimed': true},
    {'day': 2, 'reward': '200 Coins', 'claimed': true},
    {'day': 3, 'reward': '300 Coins', 'claimed': true},
    {'day': 4, 'reward': '500 Coins', 'claimed': true},
    {'day': 5, 'reward': '800 Coins', 'claimed': false},
    {'day': 6, 'reward': '1,000 Coins', 'claimed': false},
    {'day': 7, 'reward': '🚗 Supercar (7D)', 'claimed': false},
  ];

  void _claimDay5() {
    setState(() {
      _streakDays = 5;
      _streakRewards[4]['claimed'] = true;
    });
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Day 5 Streak Claimed: +800 Gold Coins! 🎁')));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Iconsax.arrow_left_2, color: AuraColors.textPrimary),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/profile');
            }
          },
        ),
        title: Text(
          'Daily Rewards Center',
          style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Daily Streak Hero Banner
            AuraSlideIn(
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: AuraGradients.primary,
                  borderRadius: AuraRadius.brXl,
                  boxShadow: AuraShadows.neonViolet,
                ),
                child: Column(
                  children: [
                    const AuraPulse(
                      child: Icon(Iconsax.star_15, color: AuraColors.textPrimary, size: 44),
                    ),
                    AuraSpacing.vMd,
                    Text('Daily Check-in Streak: $_streakDays Days 🔥', style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
                    AuraSpacing.vSm,
                    Text('Check in every day to claim luxury cars and coin chests!', textAlign: TextAlign.center, style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary)),
                  ],
                ),
              ),
            ),

            AuraSpacing.vLg,
            AuraSpacing.vLg,

            Text('7-Day Streak Rewards', style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
            AuraSpacing.vMd,

            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                childAspectRatio: 1.1,
              ),
              itemCount: _streakRewards.length,
              itemBuilder: (context, index) {
                final r = _streakRewards[index];
                final isClaimed = r['claimed'] == true;

                return AuraSlideIn.up(
                  delay: Duration(milliseconds: index * 60),
                  child: AuraBounceButton(
                    onTap: (index == 4 && !isClaimed) ? _claimDay5 : null,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: isClaimed ? AuraColors.surfaceLight : AuraColors.glassBg,
                        borderRadius: AuraRadius.brMd,
                        border: Border.all(color: isClaimed ? AuraColors.border : AuraColors.primary, width: isClaimed ? 1 : 2),
                        boxShadow: isClaimed ? [] : AuraShadows.neonViolet,
                      ),
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('Day ${r['day']}', style: AuraTypography.labelSmall.copyWith(color: isClaimed ? AuraColors.textSecondary : AuraColors.primary)),
                            AuraSpacing.vSm,
                            Text(r['reward'] as String, style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary)),
                            AuraSpacing.vSm,
                            Icon(isClaimed ? Iconsax.tick_circle : Iconsax.gift, color: isClaimed ? AuraColors.success : AuraColors.primary, size: 16),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),

            AuraSpacing.vLg,
          ],
        ),
      ),
    );
  }
}
