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
import '../../../../core/widgets/aura_bottom_nav.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, String>> _categories = [
    {
      'title': 'Late Night Jazz',
      'bg': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop&auto=format',
    },
    {
      'title': 'Tech Summit',
      'bg': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop&auto=format',
    },
    {
      'title': 'Mindfulness',
      'bg': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop&auto=format',
    },
    {
      'title': 'Crypto & Finance',
      'bg': 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=300&fit=crop&auto=format',
    },
  ];

  final List<Map<String, dynamic>> _trendingRooms = [
    {
      'id': 1,
      'title': 'Future of Generative AI in Design',
      'host': 'Sarah Jenkins',
      'listeners': '1.2k',
      'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
    },
    {
      'id': 2,
      'title': 'Investment Insider: Crypto Q4 Strategy',
      'host': 'Marcus Chen',
      'listeners': '850',
      'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
    },
    {
      'id': 3,
      'title': 'Global Beat Drop Live Session',
      'host': 'DJ Koda',
      'listeners': '2.5k',
      'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
    },
  ];

  final List<Map<String, dynamic>> _topHosts = [
    {
      'name': 'Elena Rose',
      'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format',
      'goldBorder': true,
    },
    {
      'name': 'Julian Blue',
      'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format',
      'goldBorder': false,
    },
    {
      'name': 'Derrick K.',
      'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format',
      'goldBorder': false,
    },
    {
      'name': 'Sia Om',
      'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&auto=format',
      'goldBorder': false,
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      bottomNavigationBar: const AuraBottomNav(activeTab: 'home'),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        titleSpacing: 16,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16),
          child: GestureDetector(
            onTap: () => context.push('/profile'),
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: AuraColors.primary, width: 2),
                boxShadow: AuraShadows.neonViolet,
              ),
              child: const ClipOval(
                child: Image(
                  image: NetworkImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format'),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
        ),
        title: Text(
          'Explore',
          style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary),
        ),
        actions: [
          IconButton(
            icon: Icon(Iconsax.notification, color: AuraColors.textPrimary),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AuraFadeIn(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: ClipRRect(
                  borderRadius: AuraRadius.brLg,
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                    child: Container(
                      height: 48,
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      decoration: BoxDecoration(
                        color: AuraColors.glassBg,
                        borderRadius: AuraRadius.brLg,
                        border: Border.all(color: AuraColors.glassBorder),
                      ),
                      child: Row(
                        children: [
                          Icon(Iconsax.search_normal, color: AuraColors.textSecondary, size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                            child: TextField(
                              controller: _searchController,
                              style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textPrimary),
                              decoration: InputDecoration(
                                hintText: 'Search rooms, hosts, or topics',
                                hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                                border: InputBorder.none,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Categories', style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
                  Text('See All', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                ],
              ),
            ),

            AuraSlideIn(
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: _categories.map((cat) {
                    return Container(
                      width: 170,
                      height: 105,
                      margin: const EdgeInsets.only(right: 14),
                      decoration: BoxDecoration(
                        borderRadius: AuraRadius.brLg,
                        border: Border.all(color: AuraColors.border),
                        image: DecorationImage(
                          image: NetworkImage(cat['bg']!),
                          fit: BoxFit.cover,
                        ),
                      ),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          borderRadius: AuraRadius.brLg,
                          gradient: const LinearGradient(
                            colors: [Colors.black87, Colors.transparent],
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                          ),
                        ),
                        alignment: Alignment.bottomLeft,
                        child: Text(
                          cat['title']!,
                          style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

            AuraSpacing.vLg,

            AuraFadeIn(
              delay: const Duration(milliseconds: 100),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: AuraGradients.primary,
                    borderRadius: AuraRadius.brLg,
                    boxShadow: AuraShadows.neonViolet,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Iconsax.star, color: AuraColors.textPrimary, size: 18),
                          const SizedBox(width: 6),
                          Text(
                            'ELITE RECOMMENDATION',
                            style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary, letterSpacing: 1.2),
                          ),
                        ],
                      ),
                      AuraSpacing.vSm,
                      Row(
                        children: [
                          Container(
                            width: 60,
                            height: 60,
                            decoration: BoxDecoration(
                              borderRadius: AuraRadius.brMd,
                              border: Border.all(color: AuraColors.textPrimary),
                              image: const DecorationImage(
                                image: NetworkImage('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop&auto=format'),
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                          AuraSpacing.hMd,
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Global Economic Forum 2024',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Exclusive insights from world-leading economists.',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                                ),
                                AuraSpacing.vSm,
                                ElevatedButton(
                                  onPressed: () => context.push('/audio-meetup'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AuraColors.surfaceLight,
                                    foregroundColor: AuraColors.textPrimary,
                                    elevation: 0,
                                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                                    shape: RoundedRectangleBorder(borderRadius: AuraRadius.brLg),
                                  ),
                                  child: Text('Join Elite Room', style: AuraTypography.labelMedium),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),

            AuraSpacing.vLg,

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Trending Now', style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
                  Text('See All', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                ],
              ),
            ),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _trendingRooms.length,
              separatorBuilder: (context, index) => AuraSpacing.vSm,
              itemBuilder: (context, index) {
                final room = _trendingRooms[index];
                return AuraSlideIn(
                  delay: Duration(milliseconds: 150 + (index * 50)),
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
                          children: [
                            Stack(
                              clipBehavior: Clip.none,
                              children: [
                                Container(
                                  width: 52,
                                  height: 52,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(color: AuraColors.primary),
                                  ),
                                  child: ClipOval(
                                    child: Image(
                                      image: NetworkImage(room['avatar'] as String),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                                Positioned(
                                  bottom: -2,
                                  right: -2,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                    decoration: BoxDecoration(
                                      gradient: AuraGradients.live,
                                      borderRadius: AuraRadius.brSm,
                                      border: Border.all(color: AuraColors.textPrimary),
                                      boxShadow: AuraShadows.neonRose,
                                    ),
                                    child: Text('LIVE', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary, fontSize: 8)),
                                  ),
                                ),
                              ],
                            ),
                            AuraSpacing.hMd,
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
                                  const SizedBox(height: 4),
                                  Row(
                                    children: [
                                      Icon(Iconsax.profile_circle, color: AuraColors.textSecondary, size: 14),
                                      const SizedBox(width: 4),
                                      Expanded(
                                        child: Text(
                                          room['host'] as String,
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                                        ),
                                      ),
                                      AuraSpacing.hSm,
                                      Icon(Iconsax.people, color: AuraColors.textSecondary, size: 14),
                                      const SizedBox(width: 4),
                                      Text(room['listeners'] as String, style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary)),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            AuraSpacing.hSm,
                            Container(
                              decoration: BoxDecoration(
                                gradient: AuraGradients.primary,
                                borderRadius: AuraRadius.brMd,
                                boxShadow: AuraShadows.neonViolet,
                              ),
                              child: ElevatedButton(
                                onPressed: () => context.push('/audio-meetup'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.transparent,
                                  shadowColor: Colors.transparent,
                                  elevation: 0,
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                  shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
                                ),
                                child: Text('Join', style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary)),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),

            AuraSpacing.vXl,

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Text('Top Hosts', style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
            ),

            AuraSlideIn(
              delay: const Duration(milliseconds: 200),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: _topHosts.map((host) {
                    final isGold = host['goldBorder'] == true;
                    return Container(
                      width: 90,
                      margin: const EdgeInsets.only(right: 16),
                      child: Column(
                        children: [
                          Container(
                            width: 72,
                            height: 72,
                            padding: const EdgeInsets.all(2),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isGold ? AuraColors.primary : Colors.transparent,
                                width: isGold ? 2 : 0,
                              ),
                              boxShadow: isGold ? AuraShadows.neonViolet : [],
                            ),
                            child: ClipOval(
                              child: Image(
                                image: NetworkImage(host['avatar'] as String),
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                          AuraSpacing.vSm,
                          Text(
                            host['name'] as String,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary),
                          ),
                          AuraSpacing.vSm,
                          SizedBox(
                            width: double.infinity,
                            height: 24,
                            child: OutlinedButton(
                              onPressed: () {},
                              style: OutlinedButton.styleFrom(
                                padding: EdgeInsets.zero,
                                side: BorderSide(color: AuraColors.primary),
                                shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
                              ),
                              child: Text(
                                'FOLLOW',
                                style: AuraTypography.labelSmall.copyWith(color: AuraColors.primary, fontSize: 9),
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
