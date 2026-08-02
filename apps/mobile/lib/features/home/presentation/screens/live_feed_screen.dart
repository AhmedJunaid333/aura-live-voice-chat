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
import '../../../../core/design_system/icons.dart';
import '../../../../core/widgets/aura_bottom_nav.dart';

class LiveFeedScreen extends StatefulWidget {
  const LiveFeedScreen({super.key});

  @override
  State<LiveFeedScreen> createState() => _LiveFeedScreenState();
}

class _LiveFeedScreenState extends State<LiveFeedScreen> {
  String _selectedTab = 'Featured';

  final List<Map<String, dynamic>> _moments = [
    {
      'id': '1',
      'author': 'Alexander Noble',
      'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
      'badge': 'HOST',
      'time': '10 mins ago',
      'text': 'Exclusive acoustic session in the Grand Ballroom tonight at 10 PM. Don\'t miss out! 🎷✨',
      'postImage': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop&auto=format',
      'likes': '1.4k',
      'comments': '240',
      'shares': '58',
      'isLiked': true,
    },
    {
      'id': '2',
      'author': 'Evelyn Vance',
      'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
      'badge': 'SVIP',
      'time': '1 hour ago',
      'text': 'Late night jazz & philosophy thoughts... What inspires your creative aura tonight? 🌙☕',
      'postImage': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=400&fit=crop&auto=format',
      'likes': '842',
      'comments': '96',
      'shares': '14',
      'isLiked': false,
    },
    {
      'id': '3',
      'author': 'Julian Voss',
      'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
      'badge': 'Billionaire',
      'time': '3 hours ago',
      'text': 'Just unlocked the Billionaire status! Thanks everyone for the incredible support in the live room 👑💎',
      'postImage': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop&auto=format',
      'likes': '3.2k',
      'comments': '512',
      'shares': '120',
      'isLiked': true,
    },
  ];

  final List<Map<String, dynamic>> _stories = [
    {'name': 'Your Story', 'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format', 'isAdd': true},
    {'name': 'Zara', 'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format', 'isLive': true},
    {'name': 'Koda', 'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format', 'isLive': true},
    {'name': 'Sarah', 'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format', 'isLive': false},
    {'name': 'Mia', 'avatar': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&auto=format', 'isLive': false},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      bottomNavigationBar: const AuraBottomNav(activeTab: 'moments'),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        titleSpacing: 16,
        title: Text(
          'Moments',
          style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary),
        ),
        actions: [
          IconButton(
            icon: Icon(Iconsax.search_normal, color: AuraColors.textPrimary),
            onPressed: () => context.push('/explore'),
          ),
          IconButton(
            icon: Icon(Iconsax.camera, color: AuraColors.textPrimary),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Container(
          decoration: BoxDecoration(
            gradient: AuraGradients.primary,
            borderRadius: AuraRadius.brXl,
            boxShadow: AuraShadows.neonViolet,
          ),
          child: FloatingActionButton.extended(
            onPressed: () {},
            backgroundColor: Colors.transparent,
            elevation: 0,
            icon: Icon(Iconsax.edit, color: AuraColors.textPrimary, size: 20),
            label: Text('Post Moment', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              color: AuraColors.background,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: ['Following', 'Featured', 'Nearby'].map((tab) {
                  final isSelected = _selectedTab == tab;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedTab = tab),
                    child: Container(
                      margin: const EdgeInsets.only(right: 24),
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      decoration: BoxDecoration(
                        border: isSelected
                            ? Border(bottom: BorderSide(color: AuraColors.primary, width: 2))
                            : null,
                        boxShadow: isSelected ? [BoxShadow(color: AuraColors.primary.withOpacity(0.5), blurRadius: 4, offset: const Offset(0, 2))] : [],
                      ),
                      child: Text(
                        tab,
                        style: AuraTypography.titleMedium.copyWith(
                          color: isSelected ? AuraColors.primary : AuraColors.textSecondary,
                        ),
                      ),
                    ),
                  );
                }).toList(),
                ),
              ),
            ),

            AuraSpacing.vMd,

            AuraFadeIn(
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: _stories.map((story) {
                    final isAdd = story['isAdd'] == true;
                    final isLive = story['isLive'] == true;

                    return Container(
                      margin: const EdgeInsets.only(right: 14),
                      child: Column(
                        children: [
                          Stack(
                            clipBehavior: Clip.none,
                            children: [
                              Container(
                                width: 60,
                                height: 60,
                                padding: const EdgeInsets.all(2),
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: isLive ? AuraColors.neonRose : (isAdd ? AuraColors.border : AuraColors.primary),
                                    width: 2,
                                  ),
                                  boxShadow: isLive ? AuraShadows.neonRose : (isAdd ? [] : AuraShadows.neonViolet),
                                ),
                                child: ClipOval(
                                  child: Image(
                                    image: NetworkImage(story['avatar'] as String),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              if (isAdd)
                                Positioned(
                                  bottom: 0,
                                  right: 0,
                                  child: Container(
                                    padding: const EdgeInsets.all(2),
                                    decoration: BoxDecoration(color: AuraColors.primary, shape: BoxShape.circle),
                                    child: Icon(Iconsax.add, color: AuraColors.textPrimary, size: 12),
                                  ),
                                ),
                              if (isLive)
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
                                    child: Text('LIVE', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary, fontSize: 7)),
                                  ),
                                )
                            ],
                          ),
                          AuraSpacing.vSm,
                          Text(
                            story['name'] as String,
                            style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

            AuraSpacing.vLg,

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _moments.length,
              separatorBuilder: (context, index) => AuraSpacing.vLg,
              itemBuilder: (context, index) {
                final item = _moments[index];
                final isLiked = item['isLiked'] as bool;

                return AuraSlideIn(
                  delay: Duration(milliseconds: 150 + (index * 50)),
                  child: ClipRRect(
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
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 44,
                                  height: 44,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(color: AuraColors.primary),
                                    boxShadow: AuraShadows.neonViolet,
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
                                          Flexible(
                                            child: Text(
                                              item['author'] as String,
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary),
                                            ),
                                          ),
                                          AuraSpacing.hSm,
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                            decoration: BoxDecoration(
                                              gradient: AuraGradients.primary,
                                              borderRadius: AuraRadius.brSm,
                                            ),
                                            child: Text(
                                              item['badge'] as String,
                                              style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary, fontSize: 8),
                                            ),
                                          )
                                        ],
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        item['time'] as String,
                                        style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                                      ),
                                    ],
                                  ),
                                ),
                                IconButton(
                                  icon: Icon(Iconsax.more, color: AuraColors.textSecondary),
                                  onPressed: () {},
                                ),
                              ],
                            ),

                            AuraSpacing.vMd,

                            Text(
                              item['text'] as String,
                              style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textPrimary, height: 1.4),
                            ),

                            AuraSpacing.vMd,

                            Container(
                              height: 200,
                              width: double.infinity,
                              decoration: BoxDecoration(
                                borderRadius: AuraRadius.brLg,
                                image: DecorationImage(
                                  image: NetworkImage(item['postImage'] as String),
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),

                            AuraSpacing.vLg,

                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    GestureDetector(
                                      onTap: () {
                                        setState(() {
                                          item['isLiked'] = !isLiked;
                                        });
                                      },
                                      child: Row(
                                        children: [
                                          Icon(
                                            isLiked ? Iconsax.heart5 : Iconsax.heart,
                                            color: isLiked ? AuraColors.neonRose : AuraColors.textSecondary,
                                            size: 20,
                                          ),
                                          const SizedBox(width: 4),
                                          Text(
                                            item['likes'] as String,
                                            style: AuraTypography.labelMedium.copyWith(
                                              color: isLiked ? AuraColors.neonRose : AuraColors.textSecondary,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 20),
                                    Row(
                                      children: [
                                        Icon(Iconsax.message, color: AuraColors.textSecondary, size: 20),
                                        const SizedBox(width: 4),
                                        Text(
                                          item['comments'] as String,
                                          style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Icon(Iconsax.send_2, color: AuraColors.textSecondary, size: 18),
                                    const SizedBox(width: 4),
                                    Text(
                                      item['shares'] as String,
                                      style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary),
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
                );
              },
            ),

            const SizedBox(height: 80),
          ],
        ),
      ),
    );
  }
}
