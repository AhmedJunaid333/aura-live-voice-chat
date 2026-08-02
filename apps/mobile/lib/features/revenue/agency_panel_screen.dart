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

class AgencyPanelScreen extends StatefulWidget {
  const AgencyPanelScreen({super.key});

  @override
  State<AgencyPanelScreen> createState() => _AgencyPanelScreenState();
}

class _AgencyPanelScreenState extends State<AgencyPanelScreen> {
  final List<Map<String, dynamic>> _performers = [
    {
      'id': '1',
      'name': 'Aria Bloom',
      'tag': 'Top Earner',
      'todayCoins': '45.2k',
      'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
      'isLive': true,
    },
    {
      'id': '2',
      'name': 'Zenith_Live',
      'tag': 'Rising Star',
      'todayCoins': '28.1k',
      'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
      'isLive': false,
    },
    {
      'id': '3',
      'name': 'Melody_Vibe',
      'tag': 'Consistent',
      'todayCoins': '19.5k',
      'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&auto=format',
      'isLive': false,
    },
  ];

  final List<Map<String, dynamic>> _tools = [
    {'title': 'Recruit Hosts', 'icon': Iconsax.user_add, 'color': AuraColors.primary, 'bg': AuraColors.primary.withOpacity(0.2)},
    {'title': 'Payout Records', 'icon': Iconsax.wallet, 'color': AuraColors.primary, 'bg': AuraColors.primary.withOpacity(0.2)},
    {'title': 'Agency Rules', 'icon': Iconsax.document, 'color': AuraColors.error, 'bg': AuraColors.error.withOpacity(0.2)},
    {'title': 'Support', 'icon': Iconsax.headphone, 'color': AuraColors.textPrimary, 'bg': AuraColors.surfaceLight},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Iconsax.arrow_left, color: AuraColors.primary),
          onPressed: () => context.pop(),
        ),
        title: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: AuraColors.primary, width: 2),
              ),
              child: const ClipOval(
                child: Image(
                  image: NetworkImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format'),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            AuraSpacing.hSm,
            Text(
              'Aura Live',
              style: AuraTypography.headlineSmall.copyWith(color: AuraColors.primary),
            ),
          ],
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: AuraColors.surfaceLight,
              borderRadius: AuraRadius.brPill,
              border: Border.all(color: AuraColors.border),
            ),
            child: Text('💎 1,250', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Agency Header Card
            AuraSlideIn(
              delay: const Duration(milliseconds: 100),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AuraColors.surfaceLight,
                  borderRadius: AuraRadius.brLg,
                  border: Border.all(color: AuraColors.border),
                  boxShadow: AuraShadows.neonViolet,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
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
                                  Expanded(child: Text('Galaxy Talent Agency', overflow: TextOverflow.ellipsis, maxLines: 1, style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary))),
                                  AuraSpacing.hSm,
                                  const Icon(Iconsax.verify, color: AuraColors.primary, size: 18),
                                ],
                              ),
                              AuraSpacing.vXxs,
                              Text('MASTER AGENCY ACCOUNT', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, letterSpacing: 1.5)),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AuraColors.primary.withOpacity(0.2),
                            borderRadius: AuraRadius.brSm,
                            border: Border.all(color: AuraColors.primary),
                          ),
                          child: Text('LVL 12', style: AuraTypography.labelSmall.copyWith(color: AuraColors.primary)),
                        )
                      ],
                    ),

                    AuraSpacing.vLg,

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(child: Text('Exp Progress', overflow: TextOverflow.ellipsis, maxLines: 1, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary))),
                        Text('8,450 / 10,000', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                      ],
                    ),

                    AuraSpacing.vSm,

                    ClipRRect(
                      borderRadius: AuraRadius.brSm,
                      child: const LinearProgressIndicator(
                        value: 0.84,
                        minHeight: 8,
                        backgroundColor: AuraColors.surface,
                        valueColor: AlwaysStoppedAnimation<Color>(AuraColors.primary),
                      ),
                    )
                  ],
                ),
              ),
            ),

            AuraSpacing.vLg,

            // Performance Overview (3 Cards)
            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: Row(
                children: [
                  Expanded(child: _buildStatCard('142', 'Total Hosts', Iconsax.people, AuraColors.primary)),
                  AuraSpacing.hMd,
                  Expanded(child: _buildStatCard('2.4M', 'Mthly Rev', Iconsax.diamonds, AuraColors.primary, isHighlighted: true)),
                  AuraSpacing.hMd,
                  Expanded(child: _buildStatCard('58', 'Daily Act.', Iconsax.flash, AuraColors.warning)),
                ],
              ),
            ),

            AuraSpacing.vLg,
            AuraSpacing.vSm,

            // Top Performers Header
            AuraFadeIn(
              delay: const Duration(milliseconds: 300),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Top Performers', style: AuraTypography.titleLarge),
                  Text('VIEW ALL', style: AuraTypography.labelSmall.copyWith(color: AuraColors.primary, letterSpacing: 1)),
                ],
              ),
            ),

            AuraSpacing.vMd,

            // Performers List
            AuraFadeIn(
              delay: const Duration(milliseconds: 400),
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _performers.length,
                separatorBuilder: (context, index) => AuraSpacing.vSm,
                itemBuilder: (context, index) {
                  final p = _performers[index];
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
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Row(
                                children: [
                                  Stack(
                                    children: [
                                      Container(
                                        width: 46,
                                        height: 46,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          border: Border.all(color: AuraColors.primary, width: 2),
                                        ),
                                        child: ClipOval(
                                          child: Image(
                                            image: NetworkImage(p['avatar'] as String),
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                      ),
                                      if (p['isLive'] == true)
                                        Positioned(
                                          bottom: 0,
                                          right: 0,
                                          child: Container(
                                            width: 12,
                                            height: 12,
                                            decoration: BoxDecoration(
                                              color: AuraColors.error,
                                              shape: BoxShape.circle,
                                              border: Border.all(color: AuraColors.background, width: 2),
                                            ),
                                          ),
                                        )
                                    ],
                                  ),
                                  AuraSpacing.hMd,
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(p['name'] as String, maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.bodyLarge),
                                        AuraSpacing.vXxs,
                                        Text(p['tag'] as String, style: AuraTypography.bodySmall.copyWith(color: AuraColors.primary)),
                                      ],
                                    ),
                                  )
                                ],
                              ),
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text('💎 ${p['todayCoins']}', style: AuraTypography.labelLarge.copyWith(color: AuraColors.primary)),
                                Text('Today', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
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

            AuraSpacing.vLg,
            AuraSpacing.vSm,

            // Agency Tools Header
            AuraFadeIn(
              delay: const Duration(milliseconds: 500),
              child: Text('Agency Tools', style: AuraTypography.titleLarge),
            ),

            AuraSpacing.vMd,

            // Agency Tools Grid (2x2)
            AuraFadeIn(
              delay: const Duration(milliseconds: 600),
              child: GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1.3,
                ),
                itemCount: _tools.length,
                itemBuilder: (context, index) {
                  final tool = _tools[index];
                  return ClipRRect(
                    borderRadius: AuraRadius.brLg,
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                      child: Container(
                        decoration: BoxDecoration(
                          color: AuraColors.glassBg,
                          borderRadius: AuraRadius.brLg,
                          border: Border.all(color: AuraColors.glassBorder),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                color: tool['bg'] as Color,
                                shape: BoxShape.circle,
                              ),
                              child: Icon(tool['icon'] as IconData, color: tool['color'] as Color, size: 24),
                            ),
                            AuraSpacing.vSm,
                            Text(tool['title'] as String, style: AuraTypography.labelMedium),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String value, String label, IconData icon, Color color, {bool isHighlighted = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        color: AuraColors.surfaceLight,
        borderRadius: AuraRadius.brMd,
        border: Border.all(color: isHighlighted ? AuraColors.primary : AuraColors.border),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 22),
          AuraSpacing.vSm,
          Text(value, style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary)),
          AuraSpacing.vXxs,
          Text(label, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
        ],
      ),
    );
  }
}
