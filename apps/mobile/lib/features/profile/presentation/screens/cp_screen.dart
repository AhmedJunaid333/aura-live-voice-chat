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

class CpScreen extends StatefulWidget {
  const CpScreen({super.key});

  @override
  State<CpScreen> createState() => _CpScreenState();
}

class _CpScreenState extends State<CpScreen> {
  String _selectedRankTab = 'Weekly';

  final List<Map<String, dynamic>> _cpLeaderboard = [
    {
      'rank': 1,
      'p1Name': 'Julian',
      'p1Avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
      'p2Name': 'Evelyn',
      'p2Avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
      'ring': 'Platinum Ring 💍',
      'intimacy': '1,520,000',
      'cpLevel': 'Lv. 12 Eternal',
    },
    {
      'rank': 2,
      'p1Name': 'MR √Lucky☆',
      'p1Avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
      'p2Name': 'Aura Princess',
      'p2Avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
      'ring': 'Diamond Ring 💎',
      'intimacy': '99,999',
      'cpLevel': 'Lv. 8 Romantic',
      'isSelf': true,
    },
    {
      'rank': 3,
      'p1Name': 'Koda',
      'p1Avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
      'p2Name': 'Mia',
      'p2Avatar': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&auto=format',
      'ring': 'Gold Ring 🌟',
      'intimacy': '75,400',
      'cpLevel': 'Lv. 6 Soulmate',
    },
    {
      'rank': 4,
      'p1Name': 'Alpha',
      'p1Avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
      'p2Name': 'Seraphina',
      'p2Avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format',
      'ring': 'Rose Ring 🌹',
      'intimacy': '54,200',
      'cpLevel': 'Lv. 5 Beloved',
    },
  ];

  void _showSendGiftModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AuraColors.surfaceLight,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: AuraColors.border, borderRadius: BorderRadius.circular(2))),
            AuraSpacing.vLg,
            const Icon(Iconsax.gift, color: AuraColors.primary, size: 48),
            AuraSpacing.vMd,
            Text('Send Luxury Relationship Gift', style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
            AuraSpacing.vSm,
            Text('Boost your CP Intimacy points with Aura Princess 👑', textAlign: TextAlign.center, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
            AuraSpacing.vLg,
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Expanded(child: _buildGiftItem('🌹 Rose', '100 Coins', '+500 Pts')),
                Expanded(child: _buildGiftItem('💍 Love Ring', '520 Coins', '+2.6k Pts')),
                Expanded(child: _buildGiftItem('👑 Crown', '1,314 Coins', '+6.6k Pts')),
              ],
            ),
            AuraSpacing.vLg,
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Relationship Gift Sent! +2,600 Intimacy Points 🎉')));
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: EdgeInsets.zero,
                  shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
                ),
                child: Container(
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    gradient: AuraGradients.primary,
                    borderRadius: AuraRadius.brMd,
                    boxShadow: AuraShadows.neonViolet,
                  ),
                  child: Text('Send Gift Now', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGiftItem(String name, String price, String bonus) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AuraColors.surface,
        borderRadius: AuraRadius.brMd,
        border: Border.all(color: AuraColors.border),
      ),
      child: Column(
        children: [
          Text(name, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary)),
          AuraSpacing.vSm,
          Text(price, style: AuraTypography.labelMedium.copyWith(color: AuraColors.accent)),
          Text(bonus, style: AuraTypography.bodySmall.copyWith(color: AuraColors.primary)),
        ],
      ),
    );
  }

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
              context.go('/profile');
            }
          },
        ),
        title: Text(
          'CP Space',
          style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary),
        ),
        actions: [
          IconButton(
            icon: const Icon(Iconsax.share, color: AuraColors.textPrimary),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Iconsax.info_circle, color: AuraColors.textPrimary),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // 1. Hero CP Partner Showcase Card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              child: ClipRRect(
                borderRadius: AuraRadius.brLg,
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: AuraColors.glassBg,
                      borderRadius: AuraRadius.brLg,
                      border: Border.all(color: AuraColors.glassBorder),
                      boxShadow: AuraShadows.neonViolet,
                    ),
                    child: Column(
                      children: [
                        // Dual Avatars Row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            // Partner 1 (You)
                            Expanded(
                              child: Column(
                                children: [
                                  Container(
                                    width: 66,
                                    height: 66,
                                    padding: const EdgeInsets.all(2),
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(color: AuraColors.accent, width: 2),
                                    ),
                                    child: const ClipOval(
                                      child: Image(
                                        image: NetworkImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format'),
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                  ),
                                  AuraSpacing.vSm,
                                  Text(
                                    'MR √Lucky☆࿐',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary),
                                  ),
                                  Text('ID: 106172', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                                ],
                              ),
                            ),

                            // Center Pulsing Heart
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 8),
                              child: AuraFloat(
                                child: AuraPulse(
                                  child: Column(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                          color: AuraColors.error.withValues(alpha: 0.1),
                                          shape: BoxShape.circle,
                                          boxShadow: [BoxShadow(color: AuraColors.error.withValues(alpha: 0.3), blurRadius: 10)],
                                        ),
                                        child: Icon(Iconsax.heart5, color: AuraColors.error, size: 28),
                                      ),
                                      AuraSpacing.vSm,
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(
                                          gradient: AuraGradients.primary,
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: Text('Lv.9 Forever', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary, fontSize: 9)),
                                      )
                                    ],
                                  ),
                                ),
                              ),
                            ),

                            // Partner 2 (Aura Princess)
                            Expanded(
                              child: Column(
                                children: [
                                  Container(
                                    width: 66,
                                    height: 66,
                                    padding: const EdgeInsets.all(2),
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(color: AuraColors.primary, width: 2),
                                    ),
                                    child: const ClipOval(
                                      child: Image(
                                        image: NetworkImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format'),
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                  ),
                                  AuraSpacing.vSm,
                                  Text(
                                    'Aura Princess 👑',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary),
                                  ),
                                  Text('ID: 888888', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                                ],
                              ),
                            ),
                          ],
                        ),

                        AuraSpacing.vLg,

                        // Intimacy Progress Bar
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(child: Text('Intimacy Progress', overflow: TextOverflow.ellipsis, maxLines: 1, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary))),
                            Text('99,999 / 100,000 Points', style: AuraTypography.labelSmall.copyWith(color: AuraColors.primary)),
                          ],
                        ),
                        AuraSpacing.vSm,
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: LinearProgressIndicator(
                            value: 0.999,
                            minHeight: 8,
                            backgroundColor: AuraColors.surface,
                            valueColor: AlwaysStoppedAnimation(AuraColors.primary),
                          ),
                        ),

                        AuraSpacing.vLg,

                        // Anniversary & Ring Badges Row
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                decoration: BoxDecoration(
                                  color: AuraColors.surface,
                                  borderRadius: AuraRadius.brMd,
                                  border: Border.all(color: AuraColors.border),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Iconsax.calendar_1, color: AuraColors.error, size: 13),
                                    const SizedBox(width: 6),
                                    Flexible(
                                      child: Text(
                                        '180 Days in Love 💕',
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary, fontSize: 10.5),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                decoration: BoxDecoration(
                                  color: AuraColors.surface,
                                  borderRadius: AuraRadius.brMd,
                                  border: Border.all(color: AuraColors.accent),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Iconsax.ruler, color: AuraColors.accent, size: 13),
                                    const SizedBox(width: 6),
                                    Flexible(
                                      child: Text(
                                        'Diamond Ring 💍',
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: AuraTypography.labelSmall.copyWith(color: AuraColors.accent, fontSize: 10.5),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        )
                      ],
                    ),
                  ),
                ),
              ),
            ),

            AuraSpacing.vMd,

            // 2. CP Quick Action Grid (4 Features)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              child: Row(
                children: [
                  _buildCPActionTile('💍 Ring Store', 'Upgrade Ring', AuraColors.accent, () {}),
                  const SizedBox(width: 8),
                  _buildCPActionTile('🎁 CP Gift', 'Send Gift', AuraColors.primary, _showSendGiftModal),
                  const SizedBox(width: 8),
                  _buildCPActionTile('📸 CP Wall', 'Memories', AuraColors.secondary, () {}),
                  const SizedBox(width: 8),
                  _buildCPActionTile('✨ Entrance', 'Effect', AuraColors.success, () {}),
                ],
              ),
            ),

            AuraSpacing.vLg,

            // 3. CP Intimacy Leaderboard Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AuraColors.surfaceLight,
                  borderRadius: AuraRadius.brLg,
                  border: Border.all(color: AuraColors.border),
                ),
                child: Column(
                  children: [
                    // Leaderboard Title & Subtabs
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            'CP Intimacy Ranks',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary),
                          ),
                        ),
                        Row(
                          children: ['Daily', 'Weekly', 'All'].map((tab) {
                            final isSelected = _selectedRankTab == tab || (_selectedRankTab == 'All-Time' && tab == 'All');
                            return GestureDetector(
                              onTap: () => setState(() => _selectedRankTab = tab == 'All' ? 'All-Time' : tab),
                              child: Container(
                                margin: const EdgeInsets.only(left: 4),
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                decoration: BoxDecoration(
                                  gradient: isSelected ? AuraGradients.primary : null,
                                  color: isSelected ? null : AuraColors.surface,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: isSelected ? Colors.transparent : AuraColors.border),
                                ),
                                child: Text(
                                  tab,
                                  style: AuraTypography.labelSmall.copyWith(
                                    color: isSelected ? AuraColors.textPrimary : AuraColors.textSecondary,
                                    fontSize: 10,
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        )
                      ],
                    ),

                    AuraSpacing.vLg,

                    // CP Leaderboard Rows
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _cpLeaderboard.length,
                      separatorBuilder: (context, index) => Divider(height: 12, color: AuraColors.border),
                      itemBuilder: (context, index) {
                        final item = _cpLeaderboard[index];
                        final isSelf = item['isSelf'] == true;

                        return Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: isSelf ? AuraColors.surface : Colors.transparent,
                            borderRadius: BorderRadius.circular(14),
                            border: isSelf ? Border.all(color: AuraColors.primary) : null,
                          ),
                          child: Row(
                            children: [
                              // Rank Number
                              SizedBox(
                                width: 24,
                                child: Text(
                                  '#${item['rank']}',
                                  style: AuraTypography.labelLarge.copyWith(
                                    color: item['rank'] == 1 ? AuraColors.accent : (item['rank'] == 2 ? AuraColors.primary : AuraColors.textSecondary),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),

                              // Dual Avatars Stack
                              SizedBox(
                                width: 48,
                                height: 32,
                                child: Stack(
                                  children: [
                                    ClipOval(child: Image.network(item['p1Avatar'] as String, width: 30, height: 30, fit: BoxFit.cover)),
                                    Positioned(
                                      left: 16,
                                      child: ClipOval(child: Image.network(item['p2Avatar'] as String, width: 30, height: 30, fit: BoxFit.cover)),
                                    ),
                                  ],
                                ),
                              ),

                              const SizedBox(width: 8),

                              // Names & Ring Info
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      '${item['p1Name']} ❤️ ${item['p2Name']}',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary),
                                    ),
                                    const SizedBox(height: 1),
                                    Text(
                                      '${item['ring']} • ${item['cpLevel']}',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                                    ),
                                  ],
                                ),
                              ),

                              const SizedBox(width: 4),

                              // Intimacy Score
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    item['intimacy'] as String,
                                    style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary),
                                  ),
                                  Text(
                                    'Intimacy',
                                    style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary, fontSize: 9),
                                  ),
                                ],
                              )
                            ],
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

            AuraSpacing.vLg,
            AuraSpacing.vLg,
          ],
        ),
      ),
    );
  }

  Widget _buildCPActionTile(String title, String subtitle, Color iconColor, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
          decoration: BoxDecoration(
            color: AuraColors.surfaceLight,
            borderRadius: AuraRadius.brMd,
            border: Border.all(color: AuraColors.border),
          ),
          child: Column(
            children: [
              FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(title, style: AuraTypography.labelSmall.copyWith(color: iconColor)),
              ),
              AuraSpacing.vSm,
              Text(subtitle, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary, fontSize: 9)),
            ],
          ),
        ),
      ),
    );
  }
}
