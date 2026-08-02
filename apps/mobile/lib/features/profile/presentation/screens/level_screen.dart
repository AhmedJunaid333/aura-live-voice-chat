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

class LevelScreen extends StatefulWidget {
  const LevelScreen({super.key});

  @override
  State<LevelScreen> createState() => _LevelScreenState();
}

class _LevelScreenState extends State<LevelScreen> {
  final int _currentLevel = 32;
  final int _currentEXP = 320000;
  final int _nextLevelEXP = 500000;

  final List<Map<String, dynamic>> _dailyTasks = [
    {
      'title': 'Daily Check-in',
      'exp': '+500 EXP',
      'completed': true,
      'icon': Iconsax.calendar_1,
    },
    {
      'title': 'Send Gifts in Audio Room',
      'exp': '+2,000 EXP',
      'completed': false,
      'progress': '2/5 Gifts',
      'icon': Iconsax.gift,
    },
    {
      'title': 'Watch Live Stream (30 Mins)',
      'exp': '+1,500 EXP',
      'completed': false,
      'progress': '18/30 Mins',
      'icon': Iconsax.video_play,
    },
    {
      'title': 'Publish a Moment',
      'exp': '+1,000 EXP',
      'completed': true,
      'icon': Iconsax.camera,
    },
  ];

  final List<Map<String, dynamic>> _privileges = [
    {'title': 'Gold Level Badge 👑', 'desc': 'Exclusive Level 30+ Crown Badge'},
    {'title': 'Luxury Entrance Vehicle 🚗', 'desc': 'Golden Supercar entrance animation'},
    {'title': 'VIP Chat Bubble 💬', 'desc': 'Glowing metallic chat text container'},
    {'title': 'Special Room Seat Ring 💍', 'desc': 'Animated glowing seat aura'},
  ];

  @override
  Widget build(BuildContext context) {
    final expRatio = _currentEXP / _nextLevelEXP;

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
          'User Level Center',
          style: AuraTypography.headlineSmall,
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Level Hero Card
            AuraSlideIn(
              delay: const Duration(milliseconds: 100),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: AuraGradients.primary,
                  borderRadius: AuraRadius.brLg,
                  boxShadow: AuraShadows.neonViolet,
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: const BoxDecoration(color: AuraColors.surfaceLight, shape: BoxShape.circle),
                                child: const Icon(Iconsax.crown, color: AuraColors.primary, size: 30),
                              ),
                              AuraSpacing.hMd,
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Level $_currentLevel',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: AuraTypography.headlineMedium.copyWith(color: AuraColors.textPrimary),
                                    ),
                                    Text(
                                      'Gold Royal Tier',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(color: AuraColors.glassBg, borderRadius: AuraRadius.brPill),
                          child: Text('Top 1%', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary)),
                        )
                      ],
                    ),
                    AuraSpacing.vLg,
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            'EXP Progress',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                          ),
                        ),
                        Text('${(_currentEXP / 1000).toStringAsFixed(0)}k / ${(_nextLevelEXP / 1000).toStringAsFixed(0)}k EXP',
                            style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary)),
                      ],
                    ),
                    AuraSpacing.vSm,
                    ClipRRect(
                      borderRadius: AuraRadius.brSm,
                      child: LinearProgressIndicator(
                        value: expRatio,
                        minHeight: 10,
                        backgroundColor: AuraColors.surface,
                        valueColor: const AlwaysStoppedAnimation(AuraColors.primary),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            AuraSpacing.vLg,

            // Daily EXP Quests Title
            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: Text(
                'Daily EXP Tasks',
                style: AuraTypography.titleLarge,
              ),
            ),
            AuraSpacing.vMd,

            AuraFadeIn(
              delay: const Duration(milliseconds: 300),
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _dailyTasks.length,
                separatorBuilder: (context, index) => AuraSpacing.vSm,
                itemBuilder: (context, index) {
                  final task = _dailyTasks[index];
                  return ClipRRect(
                    borderRadius: AuraRadius.brLg,
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AuraColors.glassBg,
                          borderRadius: AuraRadius.brLg,
                          border: Border.all(color: AuraColors.glassBorder),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: AuraColors.surfaceLight,
                                borderRadius: AuraRadius.brMd,
                                border: Border.all(color: AuraColors.border),
                              ),
                              child: Icon(task['icon'] as IconData, color: AuraColors.primary, size: 22),
                            ),
                            AuraSpacing.hMd,
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(task['title'] as String, style: AuraTypography.bodyLarge),
                                  AuraSpacing.vXxs,
                                  Text(task['exp'] as String, style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                ],
                              ),
                            ),
                            GestureDetector(
                              onTap: task['completed'] == true
                                  ? null
                                  : () {
                                      setState(() => task['completed'] = true);
                                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Task Claimed: ${task['exp']}! 🎉')));
                                    },
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                decoration: BoxDecoration(
                                  gradient: task['completed'] == true ? null : AuraGradients.primary,
                                  color: task['completed'] == true ? AuraColors.surface : null,
                                  borderRadius: AuraRadius.brMd,
                                  boxShadow: task['completed'] == true ? [] : AuraShadows.neonViolet,
                                ),
                                child: Text(
                                  task['completed'] == true ? 'Completed' : 'Claim',
                                  style: AuraTypography.labelMedium.copyWith(
                                    color: task['completed'] == true ? AuraColors.textSecondary : AuraColors.textPrimary,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            AuraSpacing.vLg,

            // Privileges Unlocked Title
            AuraFadeIn(
              delay: const Duration(milliseconds: 400),
              child: Text(
                'Level Privileges',
                style: AuraTypography.titleLarge,
              ),
            ),
            AuraSpacing.vMd,

            AuraFadeIn(
              delay: const Duration(milliseconds: 500),
              child: GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1.3,
                ),
                itemCount: _privileges.length,
                itemBuilder: (context, index) {
                  final priv = _privileges[index];
                  return ClipRRect(
                    borderRadius: AuraRadius.brLg,
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AuraColors.glassBg,
                          borderRadius: AuraRadius.brLg,
                          border: Border.all(color: AuraColors.glassBorder),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(priv['title'] as String, maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelLarge),
                            AuraSpacing.vSm,
                            Text(priv['desc'] as String, maxLines: 2, overflow: TextOverflow.ellipsis, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            AuraSpacing.vLg,
          ],
        ),
      ),
    );
  }
}
