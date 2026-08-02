import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/animations.dart';

class AIDiscoverScreen extends StatefulWidget {
  const AIDiscoverScreen({super.key});

  @override
  State<AIDiscoverScreen> createState() => _AIDiscoverScreenState();
}

class _AIDiscoverScreenState extends State<AIDiscoverScreen> {
  final TextEditingController _searchController = TextEditingController();
  final List<String> _selectedHashtags = ['Music'];

  final List<String> _hashtags = ['Music', 'Gaming', 'Love', 'ASMR', 'Dance'];

  final List<Map<String, dynamic>> _globalStars = [
    {
      'rank': 1,
      'name': 'AuraQueen',
      'xp': '1.5M XP',
      'borderColor': AuraColors.warning,
      'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
    },
    {
      'rank': 2,
      'name': 'X-Ray',
      'xp': '892k XP',
      'borderColor': AuraColors.textSecondary,
      'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    },
    {
      'rank': 3,
      'name': 'NeonZen',
      'xp': '745k XP',
      'borderColor': const Color(0xFFCD7F32),
      'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format',
    },
  ];

  final List<Map<String, dynamic>> _activeStreams = [
    {
      'id': '1',
      'title': 'Midnight Vibes w/ Sarah',
      'category': 'Music & Chill',
      'icon': '🎵',
      'viewers': '1.4k',
      'image': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=500&fit=crop&auto=format',
    },
    {
      'id': '2',
      'title': 'Global Tournament Semi-Finals',
      'category': 'Competitive Gaming',
      'icon': '🎮',
      'viewers': '842',
      'image': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=500&fit=crop&auto=format',
    },
    {
      'id': '3',
      'title': 'Painting Neon Galaxies',
      'category': 'Creative Art',
      'icon': '🎨',
      'viewers': '2.1k',
      'image': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=500&fit=crop&auto=format',
    },
    {
      'id': '4',
      'title': 'Night Chats & Q&A',
      'category': 'Talk Show',
      'icon': '💬',
      'viewers': '3.5k',
      'image': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&auto=format',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: AuraColors.warning, width: 2),
                boxShadow: AuraShadows.neonViolet,
              ),
              child: const ClipOval(
                child: Image(
                  image: NetworkImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format'),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            AuraSpacing.hMd,
            Text(
              'Aura',
              style: AuraTypography.headlineMedium.copyWith(color: AuraColors.primary),
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
            child: Row(
              children: [
                const Text('💎', style: TextStyle(fontSize: 14)),
                AuraSpacing.hSm,
                Text('1.2k Diamonds', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary)),
              ],
            ),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Bar
            AuraSlideIn(
              delay: const Duration(milliseconds: 100),
              child: TextField(
                controller: _searchController,
                style: AuraTypography.bodyMedium,
                decoration: InputDecoration(
                  hintText: 'Search streamers, hashtags, or IDs',
                  hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                  prefixIcon: const Icon(Iconsax.search_normal, color: AuraColors.textSecondary),
                  suffixIcon: const Icon(Iconsax.setting_4, color: AuraColors.primary),
                  filled: true,
                  fillColor: AuraColors.surfaceLight,
                  contentPadding: const EdgeInsets.symmetric(vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: AuraRadius.brLg,
                    borderSide: BorderSide(color: AuraColors.border),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: AuraRadius.brLg,
                    borderSide: BorderSide(color: AuraColors.border),
                  ),
                ),
              ),
            ),

            AuraSpacing.vLg,

            // Trending Topics Header
            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Trending Topics', style: AuraTypography.titleLarge),
                  Text('SEE ALL', style: AuraTypography.labelSmall.copyWith(color: AuraColors.primary, letterSpacing: 1)),
                ],
              ),
            ),

            AuraSpacing.vMd,

            // Hashtags Scroll
            AuraFadeIn(
              delay: const Duration(milliseconds: 300),
              child: SizedBox(
                height: 40,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: _hashtags.length,
                  itemBuilder: (context, index) {
                    final tag = _hashtags[index];
                    final isSelected = _selectedHashtags.contains(tag);
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          if (isSelected) {
                            _selectedHashtags.remove(tag);
                          } else {
                            _selectedHashtags.add(tag);
                          }
                        });
                      },
                      child: Container(
                        margin: const EdgeInsets.only(right: 10),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? AuraColors.primary : AuraColors.surfaceLight,
                          borderRadius: AuraRadius.brPill,
                          border: Border.all(color: isSelected ? AuraColors.primary : AuraColors.border),
                          boxShadow: isSelected ? AuraShadows.neonViolet : null,
                        ),
                        child: Row(
                          children: [
                            Text('#', style: AuraTypography.labelMedium.copyWith(color: isSelected ? AuraColors.background : AuraColors.primary)),
                            AuraSpacing.hSm,
                            Text(tag, style: AuraTypography.labelMedium.copyWith(color: isSelected ? AuraColors.background : AuraColors.textPrimary)),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),

            AuraSpacing.vLg,
            AuraSpacing.vSm,

            // Global Star Ranking Header
            AuraFadeIn(
              delay: const Duration(milliseconds: 400),
              child: Center(
                child: Text('Global Star Ranking', style: AuraTypography.titleLarge),
              ),
            ),

            AuraSpacing.vLg,

            // Global Star Podium
            AuraFadeIn(
              delay: const Duration(milliseconds: 500),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  // Rank 2
                  Expanded(child: _buildPodiumMember('2', _globalStars[1]['name'] as String, _globalStars[1]['xp'] as String, AuraColors.textSecondary, _globalStars[1]['avatar'] as String, 80)),
                  AuraSpacing.hLg,
                  // Rank 1
                  Expanded(child: _buildPodiumMember('1', _globalStars[0]['name'] as String, _globalStars[0]['xp'] as String, AuraColors.warning, _globalStars[0]['avatar'] as String, 110, isFirst: true)),
                  AuraSpacing.hLg,
                  // Rank 3
                  Expanded(child: _buildPodiumMember('3', _globalStars[2]['name'] as String, _globalStars[2]['xp'] as String, const Color(0xFFCD7F32), _globalStars[2]['avatar'] as String, 80)),
                ],
              ),
            ),

            AuraSpacing.vLg,
            AuraSpacing.vLg,

            // Active Now Streamers Section
            AuraFadeIn(
              delay: const Duration(milliseconds: 600),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Active Now', style: AuraTypography.titleLarge),
                  Row(
                    children: [
                      const Icon(Iconsax.category, color: AuraColors.primary, size: 20),
                      AuraSpacing.hMd,
                      const Icon(Iconsax.menu_1, color: AuraColors.textSecondary, size: 20),
                    ],
                  )
                ],
              ),
            ),

            AuraSpacing.vMd,

            AuraFadeIn(
              delay: const Duration(milliseconds: 700),
              child: GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 0.75,
                ),
                itemCount: _activeStreams.length,
                itemBuilder: (context, index) {
                  final stream = _activeStreams[index];
                  return GestureDetector(
                    onTap: () => context.push('/live-room/${stream['id']}'),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: AuraRadius.brLg,
                        border: Border.all(color: AuraColors.border),
                        image: DecorationImage(
                          image: NetworkImage(stream['image'] as String),
                          fit: BoxFit.cover,
                          colorFilter: const ColorFilter.mode(Colors.black38, BlendMode.darken),
                        ),
                      ),
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(color: AuraColors.error, borderRadius: AuraRadius.brSm),
                                child: Text('LIVE', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary, fontSize: 9, letterSpacing: 1)),
                              ),
                              AuraSpacing.hSm,
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(color: Colors.black45, borderRadius: AuraRadius.brSm),
                                child: Text(stream['viewers'] as String, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary, fontSize: 9)),
                              )
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(stream['title'] as String, maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                              AuraSpacing.vSm,
                              Row(
                                children: [
                                  Text(stream['icon'] as String, style: const TextStyle(fontSize: 12)),
                                  AuraSpacing.hSm,
                                  Expanded(child: Text(stream['category'] as String, maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, fontSize: 10))),
                                ],
                              )
                            ],
                          )
                        ],
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

  Widget _buildPodiumMember(String rank, String name, String xp, Color color, String avatarUrl, double size, {bool isFirst = false}) {
    return Column(
      children: [
        if (isFirst) const Text('👑', style: TextStyle(fontSize: 24)),
        Stack(
          alignment: Alignment.center,
          children: [
            Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: color, width: 4),
                boxShadow: isFirst ? AuraShadows.neonViolet : null,
              ),
              child: ClipOval(
                child: Image(
                  image: NetworkImage(avatarUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Positioned(
              bottom: 0,
              child: Container(
                width: isFirst ? 28 : 22,
                height: isFirst ? 28 : 22,
                decoration: BoxDecoration(
                  color: color,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(rank, style: AuraTypography.labelMedium.copyWith(color: AuraColors.background, fontWeight: FontWeight.bold)),
                ),
              ),
            )
          ],
        ),
        AuraSpacing.vMd,
        FittedBox(fit: BoxFit.scaleDown, child: Text(name, style: AuraTypography.labelLarge)),
        FittedBox(fit: BoxFit.scaleDown, child: Text(xp, style: AuraTypography.labelSmall.copyWith(color: isFirst ? AuraColors.primary : AuraColors.textSecondary))),
      ],
    );
  }
}
