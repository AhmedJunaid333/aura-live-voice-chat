import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/gradients.dart';
import '../../../../core/design_system/animations.dart';
import '../../../../core/widgets/aura_bottom_nav.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _selectedCountry = 'All';

  final List<Map<String, dynamic>> _countryFilters = [
    {'id': 'All', 'label': 'All', 'flag': null},
    {'id': 'PK', 'label': 'Pakistan', 'flag': '🇵🇰'},
    {'id': 'IQ', 'label': 'Iraq', 'flag': '🇮🇶'},
    {'id': 'BD', 'label': 'Bangladesh', 'flag': '🇧🇩'},
  ];

  final List<Map<String, dynamic>> _liveRooms = [
    {
      'id': '1',
      'title': 'حت عدي',
      'hostAvatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format',
      'flag': '🇨🇻',
      'tag': 'Dating',
      'tagBg': AuraColors.primary.withOpacity(0.2),
      'tagColor': AuraColors.primary,
      'badgeIcon': Iconsax.verify,
      'badgeColor': AuraColors.primary,
      'rightBadge': 'UNO Waiting',
      'rightBadgeBg': AuraColors.neonCyan,
      'speakers': [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
      ],
      'listeners': '16',
    },
    {
      'id': '2',
      'title': '🎀my life🎀',
      'hostAvatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&auto=format',
      'flag': '🇵🇰',
      'tag': 'Story',
      'tagBg': AuraColors.neonCyan.withOpacity(0.2),
      'tagColor': AuraColors.neonCyan,
      'badgeIcon': Iconsax.magic_star,
      'badgeColor': AuraColors.neonRose,
      'speakers': [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
      ],
      'listeners': '54',
    },
    {
      'id': '3',
      'title': 'MENTEL HOUS♠',
      'hostAvatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&auto=format',
      'flag': '🇵🇰',
      'tag': 'Emotion',
      'tagBg': AuraColors.primary.withOpacity(0.2),
      'tagColor': AuraColors.primary,
      'badgeIcon': Iconsax.shield_tick,
      'badgeColor': AuraColors.primary,
      'gameWidget': 'Fishing',
      'speakers': [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
      ],
      'listeners': '58',
    },
    {
      'id': '4',
      'title': 'do Dil ak jan💖🧸',
      'hostAvatar': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&auto=format',
      'flag': '🇵🇰',
      'tag': 'Chat',
      'tagBg': AuraColors.neonViolet.withOpacity(0.2),
      'tagColor': AuraColors.neonViolet,
      'badgeIcon': Iconsax.star,
      'badgeColor': AuraColors.neonViolet,
      'speakers': [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
      ],
      'listeners': '92',
    },
  ];

  Future<bool> _showExitDialog(BuildContext context) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AuraColors.surfaceLight,
        shape: RoundedRectangleBorder(
          borderRadius: AuraRadius.brLg,
          side: BorderSide(color: AuraColors.border),
        ),
        title: Text(
          'Exit Application',
          textAlign: TextAlign.center,
          style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary),
        ),
        content: Text(
          'Do you want to exit the application?',
          textAlign: TextAlign.center,
          style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
        ),
        actions: [
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => Navigator.of(context).pop(false),
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(color: AuraColors.border),
                    shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: Text(
                    'No',
                    style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary),
                  ),
                ),
              ),
              AuraSpacing.hSm,
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: AuraGradients.primary,
                    borderRadius: AuraRadius.brMd,
                    boxShadow: AuraShadows.neonViolet,
                  ),
                  child: ElevatedButton(
                    onPressed: () => Navigator.of(context).pop(true),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: Text(
                      'Yes, Exit',
                      style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary),
                    ),
                  ),
                ),
              ),
            ],
          )
        ],
      ),
    );
    return result ?? false;
  }

  String _activeHeaderTab = 'Hot';

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        if (context.canPop()) {
          context.pop();
        } else {
          final shouldExit = await _showExitDialog(context);
          if (shouldExit) {
            SystemNavigator.pop();
          }
        }
      },
      child: Scaffold(
        backgroundColor: AuraColors.background,
        bottomNavigationBar: const AuraBottomNav(activeTab: 'home'),
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          titleSpacing: 16,
          title: Row(
            children: [
              _buildTopTab('Me', () => context.push('/my-rooms')),
              const SizedBox(width: 20),
              _buildTopTab('Hot', () => setState(() => _activeHeaderTab = 'Hot')),
              const SizedBox(width: 20),
              _buildTopTab('Game', () => context.push('/explore')),
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(Iconsax.search_normal_1, color: AuraColors.textPrimary, size: 24),
              onPressed: () => context.push('/explore'),
            ),
            IconButton(
              icon: const Icon(Iconsax.award, color: AuraColors.textPrimary, size: 24),
              onPressed: () => context.push('/leaderboard'),
            ),
            const SizedBox(width: 8),
          ],
        ),
        body: Stack(
          children: [
            SingleChildScrollView(
              padding: const EdgeInsets.only(bottom: 40),
              child: Column(
                children: [
                  AuraFadeIn(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      child: Container(
                        height: 150,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          borderRadius: AuraRadius.brLg,
                          image: const DecorationImage(
                            image: NetworkImage('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=400&fit=crop&auto=format'),
                            fit: BoxFit.cover,
                          ),
                        ),
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            borderRadius: AuraRadius.brLg,
                            gradient: const LinearGradient(
                              colors: [Colors.black87, Colors.transparent],
                              begin: Alignment.bottomLeft,
                              end: Alignment.topRight,
                            ),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: AuraColors.neonRose,
                                  borderRadius: AuraRadius.brSm,
                                  boxShadow: AuraShadows.neonRose,
                                ),
                                child: Text(
                                  'FEATURED EVENT',
                                  style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary),
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Romantic Fireworks',
                                    style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary, fontWeight: FontWeight.w900),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '2026.7/25~2026.8/08 UTC+8',
                                    style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),

                  AuraSpacing.vMd,

                  AuraSlideIn(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => context.push('/leaderboard'),
                              child: Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  borderRadius: AuraRadius.brLg,
                                  gradient: AuraGradients.primary,
                                  boxShadow: AuraShadows.neonViolet,
                                ),
                                child: FittedBox(
                                  fit: BoxFit.scaleDown,
                                  alignment: Alignment.centerLeft,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'Ranking List',
                                        style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary),
                                      ),
                                      const SizedBox(height: 8),
                                      Row(
                                        children: [
                                          _buildPodiumMiniAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&auto=format', 24),
                                          const SizedBox(width: 4),
                                          _buildPodiumMiniAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&auto=format', 32, isCenter: true),
                                          const SizedBox(width: 4),
                                          _buildPodiumMiniAvatar('https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop&auto=format', 24),
                                        ],
                                      )
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),

                          AuraSpacing.hSm,

                          Expanded(
                            child: Container(
                              height: 90,
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                borderRadius: AuraRadius.brLg,
                                color: AuraColors.surfaceLight,
                                border: Border.all(color: AuraColors.border),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Events',
                                    style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary),
                                  ),
                                  Row(
                                    children: [
                                      ClipRRect(
                                        borderRadius: AuraRadius.brSm,
                                        child: Image.network('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=80&h=50&fit=crop&auto=format', width: 44, height: 28, fit: BoxFit.cover),
                                      ),
                                      const SizedBox(width: 6),
                                      ClipRRect(
                                        borderRadius: AuraRadius.brSm,
                                        child: Image.network('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=80&h=50&fit=crop&auto=format', width: 44, height: 28, fit: BoxFit.cover),
                                      ),
                                    ],
                                  )
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  AuraSpacing.vLg,

                  AuraSlideIn(
                    delay: const Duration(milliseconds: 100),
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        children: [
                          ..._countryFilters.map((filter) {
                            final isSelected = _selectedCountry == filter['id'];
                            return GestureDetector(
                              onTap: () => setState(() => _selectedCountry = filter['id'] as String),
                              child: Container(
                                margin: const EdgeInsets.only(right: 10),
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                decoration: BoxDecoration(
                                  color: isSelected ? AuraColors.primary.withOpacity(0.2) : AuraColors.glassBg,
                                  borderRadius: AuraRadius.brLg,
                                  border: Border.all(
                                    color: isSelected ? AuraColors.primary : AuraColors.glassBorder,
                                    width: isSelected ? 1.5 : 1,
                                  ),
                                  boxShadow: isSelected ? AuraShadows.neonViolet : [],
                                ),
                                child: Row(
                                  children: [
                                    if (filter['flag'] != null) ...[
                                      Text(filter['flag'] as String, style: const TextStyle(fontSize: 14)),
                                      const SizedBox(width: 6),
                                    ],
                                    Text(
                                      filter['label'] as String,
                                      style: AuraTypography.labelMedium.copyWith(
                                        color: isSelected ? AuraColors.primary : AuraColors.textSecondary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }).toList(),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AuraColors.glassBg,
                              borderRadius: AuraRadius.brLg,
                              border: Border.all(color: AuraColors.glassBorder),
                            ),
                            child: Icon(Iconsax.menu, color: AuraColors.textSecondary, size: 20),
                          ),
                        ],
                      ),
                    ),
                  ),

                  AuraSpacing.vLg,

                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _liveRooms.length,
                    separatorBuilder: (context, index) => AuraSpacing.vMd,
                    itemBuilder: (context, index) {
                      final room = _liveRooms[index];
                      final speakers = room['speakers'] as List<String>;
                      final rightBadge = room['rightBadge'] as String?;
                      final gameWidget = room['gameWidget'] as String?;

                      return AuraSlideIn(
                        delay: Duration(milliseconds: 150 + (index * 50)),
                        child: GestureDetector(
                          onTap: () => context.push('/audio-meetup'),
                          child: ClipRRect(
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
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Container(
                                      width: 80,
                                      height: 80,
                                      decoration: BoxDecoration(
                                        borderRadius: AuraRadius.brMd,
                                        image: DecorationImage(
                                          image: NetworkImage(room['hostAvatar'] as String),
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),

                                    AuraSpacing.hSm,

                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            room['title'] as String,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary),
                                          ),
                                          
                                          AuraSpacing.vSm,

                                          Row(
                                            children: [
                                              Text(room['flag'] as String, style: const TextStyle(fontSize: 12)),
                                              const SizedBox(width: 6),
                                              Flexible(
                                                child: Container(
                                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                                  decoration: BoxDecoration(
                                                    color: room['tagBg'] as Color,
                                                    borderRadius: AuraRadius.brSm,
                                                  ),
                                                  child: Text(
                                                    room['tag'] as String,
                                                    overflow: TextOverflow.ellipsis,
                                                    style: AuraTypography.labelSmall.copyWith(color: room['tagColor'] as Color),
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(width: 6),
                                              Icon(room['badgeIcon'] as IconData, color: room['badgeColor'] as Color, size: 14),
                                            ],
                                          ),

                                          AuraSpacing.vSm,

                                          Row(
                                            children: [
                                              Expanded(
                                                child: SingleChildScrollView(
                                                  scrollDirection: Axis.horizontal,
                                                  child: Row(
                                                    children: speakers.map((url) {
                                                      return Container(
                                                        margin: const EdgeInsets.only(right: 4),
                                                        width: 22,
                                                        height: 22,
                                                        decoration: BoxDecoration(
                                                          shape: BoxShape.circle,
                                                          border: Border.all(color: AuraColors.border, width: 1.5),
                                                        ),
                                                        child: ClipOval(child: Image.network(url, fit: BoxFit.cover)),
                                                      );
                                                    }).toList(),
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(width: 4),
                                              Container(
                                                width: 18,
                                                height: 18,
                                                decoration: BoxDecoration(
                                                  color: AuraColors.primary.withOpacity(0.2),
                                                  shape: BoxShape.circle,
                                                ),
                                                child: Icon(Iconsax.add, color: AuraColors.primary, size: 12),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),

                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.end,
                                      children: [
                                        if (rightBadge != null) ...[
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                            decoration: BoxDecoration(
                                              color: room['rightBadgeBg'] as Color,
                                              borderRadius: AuraRadius.brSm,
                                            ),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                Icon(Iconsax.game, color: AuraColors.textPrimary, size: 10),
                                                const SizedBox(width: 4),
                                                Text(rightBadge, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary)),
                                              ],
                                            ),
                                          ),
                                          AuraSpacing.vMd,
                                        ] else if (gameWidget != null) ...[
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                            decoration: BoxDecoration(
                                              color: AuraColors.primary,
                                              borderRadius: AuraRadius.brSm,
                                            ),
                                            child: Text('Fishing 🎣', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary)),
                                          ),
                                          AuraSpacing.vMd,
                                        ],

                                        Row(
                                          children: [
                                            Icon(Iconsax.chart, color: AuraColors.neonCyan, size: 14),
                                            const SizedBox(width: 2),
                                            Text(
                                              room['listeners'] as String,
                                              style: AuraTypography.labelMedium.copyWith(color: AuraColors.neonCyan),
                                            ),
                                          ],
                                        )
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),

            Positioned(
              bottom: 16,
              left: 16,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  gradient: AuraGradients.live,
                  borderRadius: AuraRadius.brLg,
                  boxShadow: AuraShadows.neonRose,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Iconsax.gift, color: AuraColors.textPrimary, size: 18),
                    const SizedBox(width: 6),
                    Text('Get rewards', style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPodiumMiniAvatar(String url, double size, {bool isCenter = false}) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: isCenter ? AuraColors.textPrimary : AuraColors.textSecondary, width: isCenter ? 2 : 1),
      ),
      child: ClipOval(child: Image.network(url, fit: BoxFit.cover)),
    );
  }

  Widget _buildTopTab(String label, VoidCallback onTap) {
    final isSelected = _activeHeaderTab == label;
    return GestureDetector(
      onTap: onTap,
      child: AnimatedDefaultTextStyle(
        duration: const Duration(milliseconds: 200),
        style: TextStyle(
          fontSize: isSelected ? 24 : 18,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          color: isSelected ? AuraColors.textPrimary : AuraColors.textSecondary.withValues(alpha: 0.7),
        ),
        child: Text(label),
      ),
    );
  }
}
