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

class VipScreen extends StatefulWidget {
  const VipScreen({super.key});

  @override
  State<VipScreen> createState() => _VipScreenState();
}

class _VipScreenState extends State<VipScreen> {
  String _selectedPlan = '12m';
  bool _isJoined = false;

  final List<Map<String, dynamic>> _privileges = [
    {
      'title': 'Unique Entry Effect',
      'description': 'Dazzle everyone with a custom aurora animation when you join any room.',
      'icon': Iconsax.magic_star,
      'color': AuraColors.primary,
      'bgColor': AuraColors.surfaceLight,
    },
    {
      'title': 'Golden Name',
      'description': 'Stand out in every chat with a shimmering gold username and VIP badge.',
      'icon': Iconsax.edit_2,
      'color': AuraColors.accent,
      'bgColor': AuraColors.surfaceLight,
    },
    {
      'title': 'Exclusive Gifts',
      'description': 'Access VIP-only animated 3D gifts that give 2x support points.',
      'icon': Iconsax.gift,
      'color': AuraColors.secondary,
      'bgColor': AuraColors.surfaceLight,
    },
    {
      'title': 'Hidden Profile',
      'description': 'Browse streams invisibly and hide your online status from followers.',
      'icon': Iconsax.eye_slash,
      'color': AuraColors.textPrimary,
      'bgColor': AuraColors.surfaceLight,
    },
  ];

  final List<Map<String, dynamic>> _plans = [
    {'id': '12m', 'title': '12 Months', 'price': '9,999', 'unit': 'Diamonds/Year', 'popular': true},
    {'id': '3m', 'title': '3 Months', 'price': '2,999', 'unit': 'Diamonds/Quarter', 'popular': false},
    {'id': '1m', 'title': '1 Month', 'price': '1,199', 'unit': 'Diamonds/Month', 'popular': false},
  ];

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
              context.go('/home');
            }
          },
        ),
        title: Text(
          'Aura VIP',
          style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: AuraColors.glassBg,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AuraColors.glassBorder),
            ),
            child: Row(
              children: [
                const Text('💎', style: TextStyle(fontSize: 14)),
                const SizedBox(width: 4),
                Text('1.2k Diamonds', maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelMedium.copyWith(color: AuraColors.secondary)),
              ],
            ),
          )
        ],
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.only(left: 16, right: 16, top: 16, bottom: 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // VIP Hero Card
                AuraSlideIn(
                  child: Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      borderRadius: AuraRadius.brXl,
                      border: Border.all(color: AuraColors.primary.withValues(alpha: 0.5)),
                      gradient: AuraGradients.primary,
                      boxShadow: AuraShadows.neonViolet,
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Text('👑', style: TextStyle(fontSize: 16)),
                                      const SizedBox(width: 6),
                                      Expanded(child: Text('PREMIUM MEMBER', maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, letterSpacing: 1.5))),
                                    ],
                                  ),
                                  AuraSpacing.vSm,
                                  Text('Aura Elite', style: AuraTypography.headlineLarge.copyWith(color: AuraColors.textPrimary)),
                                ],
                              ),
                            ),
                            Container(
                              width: 60,
                              height: 60,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(color: AuraColors.accent, width: 2),
                              ),
                              child: const ClipOval(
                                child: Image(
                                  image: NetworkImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format'),
                                  fit: BoxFit.cover,
                                ),
                              ),
                            )
                          ],
                        ),

                        AuraSpacing.vLg,
                        AuraSpacing.vLg,

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                _buildBadgeIcon(Iconsax.star),
                                _buildBadgeIcon(Iconsax.flash),
                                _buildBadgeIcon(Iconsax.shield_tick),
                                Container(
                                  width: 36,
                                  height: 36,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: AuraColors.surface,
                                    border: Border.all(color: AuraColors.background, width: 2),
                                  ),
                                  child: Center(
                                    child: Text('+5', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary)),
                                  ),
                                )
                              ],
                            ),
                            Flexible(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text('Membership Status', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                                  const SizedBox(height: 2),
                                  Text(_isJoined ? 'Active (VIP Level 5)' : '24 Dec 2026', maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary)),
                                ],
                              ),
                            )
                          ],
                        )
                      ],
                    ),
                  ),
                ),

                AuraSpacing.vLg,
                AuraSpacing.vLg,

                // Elite Privileges Header
                Text('Elite Privileges', style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),

                AuraSpacing.vMd,

                // Privileges List
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _privileges.length,
                  separatorBuilder: (context, index) => AuraSpacing.vSm,
                  itemBuilder: (context, index) {
                    final p = _privileges[index];
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
                                width: 52,
                                height: 52,
                                decoration: BoxDecoration(
                                  color: p['bgColor'] as Color,
                                  borderRadius: AuraRadius.brMd,
                                ),
                                child: Icon(p['icon'] as IconData, color: p['color'] as Color, size: 28),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(p['title'] as String, style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                                    const SizedBox(height: 4),
                                    Text(p['description'] as String, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary, height: 1.3)),
                                  ],
                                ),
                              )
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),

                AuraSpacing.vLg,
                AuraSpacing.vLg,

                // Choose Your Plan Header
                Text('Choose Your Plan', style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),

                AuraSpacing.vMd,

                // Plan Selector Cards
                SizedBox(
                  height: 130,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _plans.length,
                    itemBuilder: (context, index) {
                      final plan = _plans[index];
                      final isSelected = _selectedPlan == plan['id'];
                      return GestureDetector(
                        onTap: () => setState(() => _selectedPlan = plan['id'] as String),
                        child: Container(
                          width: 140,
                          margin: const EdgeInsets.only(right: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AuraColors.surfaceLight,
                            borderRadius: AuraRadius.brLg,
                            border: Border.all(
                              color: isSelected ? AuraColors.primary : AuraColors.border,
                              width: isSelected ? 2 : 1,
                            ),
                            boxShadow: isSelected
                                ? AuraShadows.neonViolet
                                : null,
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                plan['popular'] == true ? 'MOST POPULAR' : '',
                                style: AuraTypography.labelSmall.copyWith(color: AuraColors.primary, fontSize: 9),
                              ),
                              const SizedBox(height: 4),
                              Text(plan['title'] as String, maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary)),
                              const SizedBox(height: 6),
                              Text(plan['price'] as String, maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.headlineSmall.copyWith(color: AuraColors.secondary)),
                              const SizedBox(height: 2),
                              Text(plan['unit'] as String, maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary, fontSize: 9)),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // Bottom Action Join CTA Button
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [AuraColors.background, AuraColors.background.withValues(alpha: 0.8), Colors.transparent],
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                ),
              ),
            ),
          ),
          Positioned(
            left: 20,
            right: 20,
            bottom: 20,
            child: AuraBounceButton(
              onTap: () {
                setState(() => _isJoined = !_isJoined);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(_isJoined ? 'Welcome to Aura VIP Apex Status! 👑' : 'VIP Status Paused')),
                );
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  gradient: AuraGradients.primary,
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: AuraShadows.neonViolet,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('⭐', style: TextStyle(fontSize: 18)),
                    const SizedBox(width: 8),
                    Flexible(
                      child: Text(
                        _isJoined ? 'VIP Active — Enjoy Privileges!' : 'Join VIP Now',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary),
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Icon(Iconsax.arrow_right_3, color: AuraColors.textPrimary),
                  ],
                ),
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildBadgeIcon(IconData icon) {
    return Container(
      width: 36,
      height: 36,
      margin: const EdgeInsets.only(right: 4),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: AuraColors.surface,
        border: Border.all(color: AuraColors.background, width: 2),
      ),
      child: Icon(icon, color: AuraColors.textPrimary, size: 16),
    );
  }
}
