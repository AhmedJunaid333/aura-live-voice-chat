import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:iconsax/iconsax.dart';
import '../../core/design_system/colors.dart';
import '../../core/design_system/typography.dart';
import '../../core/design_system/spacing.dart';
import '../../core/design_system/radius.dart';
import '../../core/design_system/shadows.dart';
import '../../core/design_system/gradients.dart';
import '../../core/design_system/animations.dart';
import '../../core/design_system/icons.dart';
import '../../core/widgets/aura_bottom_nav.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  String _selectedTab = 'Weekly';

  final List<Map<String, dynamic>> _leaderboardList = [
    {
      'rank': 4,
      'name': 'Nova Prime',
      'tier': 'Elite',
      'tierColor': AuraColors.warning,
      'listeners': '720.4K Listeners',
      'aura': '782,100',
      'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
    },
    {
      'rank': 5,
      'name': 'Echo_Pulse',
      'tier': 'Elite',
      'tierColor': AuraColors.warning,
      'listeners': '691.0K Listeners',
      'aura': '755,420',
      'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    },
    {
      'rank': 6,
      'name': 'VibeMaster',
      'tier': 'Pro',
      'tierColor': AuraColors.textSecondary,
      'listeners': '542.2K Listeners',
      'aura': '622,900',
      'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&auto=format',
    },
    {
      'rank': 7,
      'name': 'Apex_Stream',
      'tier': 'Billionaire',
      'tierColor': AuraColors.warning,
      'listeners': '480.1K Listeners',
      'aura': '590,400',
      'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format',
    },
    {
      'rank': 8,
      'name': 'GoldDigger_88',
      'tier': 'Elite',
      'tierColor': AuraColors.warning,
      'listeners': '410.5K Listeners',
      'aura': '512,000',
      'avatar': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&auto=format',
    },
    {
      'rank': 9,
      'name': 'SynthWave',
      'tier': 'Pro',
      'tierColor': AuraColors.textSecondary,
      'listeners': '390.0K Listeners',
      'aura': '485,300',
      'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      bottomNavigationBar: const AuraBottomNav(activeTab: 'me'),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Iconsax.arrow_left, color: AuraColors.textPrimary),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/home');
            }
          },
        ),
        title: Text(
          'Auralive Leaderboard',
          style: AuraTypography.headlineSmall,
        ),
        actions: [
          IconButton(
            icon: const Icon(Iconsax.medal_star, color: AuraColors.warning),
            onPressed: () {},
          ),
          AuraSpacing.hSm,
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Top Podium Section
            AuraSlideIn(
              delay: const Duration(milliseconds: 100),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.only(top: 24, bottom: 32, left: 16, right: 16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AuraColors.primary.withOpacity(0.1), AuraColors.background],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    // Rank #2
                    Expanded(
                      child: _buildPodiumUser(
                        rank: 2,
                        name: 'Zephyr',
                        aura: '942K Aura',
                        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
                        borderColor: AuraColors.textSecondary,
                        avatarSize: 64,
                      ),
                    ),

                    AuraSpacing.hMd,

                    // Rank #1
                    Expanded(
                      child: _buildPodiumUser(
                        rank: 1,
                        name: 'Julian Voss',
                        aura: '1.2M Aura',
                        badge: 'Billionaire',
                        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format',
                        borderColor: AuraColors.warning,
                        avatarSize: 88,
                        isFirst: true,
                      ),
                    ),

                    AuraSpacing.hMd,

                    // Rank #3
                    Expanded(
                      child: _buildPodiumUser(
                        rank: 3,
                        name: 'Luna_Sky',
                        aura: '815K Aura',
                        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format',
                        borderColor: const Color(0xFFC67D0A),
                        avatarSize: 64,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Tab Switcher Bar
            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: Container(
                color: AuraColors.background,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: ['Daily', 'Weekly', 'All Time'].map((tab) {
                    final isSelected = _selectedTab == tab;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedTab = tab),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          border: isSelected
                              ? Border(bottom: BorderSide(color: AuraColors.primary, width: 3))
                              : null,
                        ),
                        child: Text(
                          tab,
                          style: AuraTypography.labelMedium.copyWith(
                            color: isSelected ? AuraColors.textPrimary : AuraColors.textSecondary,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

            const Divider(height: 1, color: AuraColors.border),
            AuraSpacing.vMd,

            // Leaderboard List Rows (Ranks 4+)
            AuraFadeIn(
              delay: const Duration(milliseconds: 300),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _leaderboardList.length,
                  separatorBuilder: (context, index) => AuraSpacing.vSm,
                  itemBuilder: (context, index) {
                    final item = _leaderboardList[index];
                    final color = item['tierColor'] as Color;
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
                          child: Row(
                            children: [
                              SizedBox(
                                width: 24,
                                child: Text(
                                  '${item['rank']}',
                                  textAlign: TextAlign.center,
                                  style: AuraTypography.titleMedium.copyWith(color: AuraColors.primary),
                                ),
                              ),
                              AuraSpacing.hMd,
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(color: AuraColors.border),
                                ),
                                child: ClipOval(
                                  child: Image(
                                    image: NetworkImage(item['avatar'] as String),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              AuraSpacing.hMd,
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            item['name'] as String,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: AuraTypography.bodyLarge,
                                          ),
                                        ),
                                        AuraSpacing.hSm,
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                          decoration: BoxDecoration(
                                            borderRadius: AuraRadius.brSm,
                                            border: Border.all(color: color),
                                          ),
                                          child: Text(
                                            item['tier'] as String,
                                            style: AuraTypography.labelSmall.copyWith(color: color, fontSize: 8),
                                          ),
                                        )
                                      ],
                                    ),
                                    AuraSpacing.vXxs,
                                    Text(
                                      item['listeners'] as String,
                                      style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                                    ),
                                  ],
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    item['aura'] as String,
                                    style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary),
                                  ),
                                  Text(
                                    'Aura',
                                    style: AuraTypography.labelSmall.copyWith(color: AuraColors.primary, fontSize: 9),
                                  ),
                                ],
                              )
                            ],
                          ),
                        ),
                      ),
                    );
                  },
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

  Widget _buildPodiumUser({
    required int rank,
    required String name,
    required String aura,
    String? badge,
    required String avatarUrl,
    required Color borderColor,
    required double avatarSize,
    bool isFirst = false,
  }) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        if (isFirst) ...[
          const Icon(Iconsax.crown, color: AuraColors.warning, size: 28),
          AuraSpacing.vSm,
        ],
        Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.center,
          children: [
            Container(
              width: avatarSize,
              height: avatarSize,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: borderColor, width: isFirst ? 4 : 2),
                boxShadow: isFirst ? AuraShadows.neonViolet : [],
              ),
              child: ClipOval(
                child: Image(
                  image: NetworkImage(avatarUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Positioned(
              bottom: -10,
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: isFirst ? 12 : 8, vertical: 2),
                decoration: BoxDecoration(
                  color: borderColor,
                  borderRadius: AuraRadius.brPill,
                  boxShadow: AuraShadows.neonViolet,
                ),
                child: Text(
                  '#$rank',
                  style: AuraTypography.labelSmall.copyWith(
                    color: isFirst ? AuraColors.background : AuraColors.textPrimary,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
            )
          ],
        ),
        AuraSpacing.vMd,
        FittedBox(
          fit: BoxFit.scaleDown,
          child: Text(
            name,
            style: isFirst ? AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary) : AuraTypography.bodyMedium.copyWith(color: AuraColors.textPrimary),
          ),
        ),
        AuraSpacing.vXxs,
        Text(
          aura,
          style: AuraTypography.labelSmall.copyWith(color: AuraColors.primary),
        ),
        if (badge != null) ...[
          AuraSpacing.vSm,
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
            decoration: BoxDecoration(
              color: AuraColors.primary.withOpacity(0.2),
              borderRadius: AuraRadius.brSm,
              border: Border.all(color: AuraColors.primary.withOpacity(0.4)),
            ),
            child: Text(
              badge.toUpperCase(),
              style: AuraTypography.labelSmall.copyWith(color: AuraColors.primary, fontSize: 8),
            ),
          ),
        ]
      ],
    );
  }
}
