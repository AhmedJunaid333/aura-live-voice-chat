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
import '../../../../core/widgets/aura_animator.dart' hide AuraPulse, AuraFloat;

class MyRoomsHubScreen extends StatefulWidget {
  const MyRoomsHubScreen({super.key});

  @override
  State<MyRoomsHubScreen> createState() => _MyRoomsHubScreenState();
}

class _MyRoomsHubScreenState extends State<MyRoomsHubScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _hasRooms = true; // Toggle for testing empty state vs full content

  final List<Map<String, dynamic>> _recentlyVisited = [
    {
      'id': '1',
      'cover': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=300&fit=crop&auto=format',
      'title': 'Royal Audio Lounge 👑',
      'hostAvatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
      'hostName': 'Queen Elena',
      'seats': '15 Seats',
      'online': '142',
      'lang': 'English',
      'category': 'Entertainment',
      'lastVisited': '10 mins ago',
      'isLive': true,
    },
    {
      'id': '2',
      'cover': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=300&fit=crop&auto=format',
      'title': 'Midnight Chill Vibes 🌙',
      'hostAvatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
      'hostName': 'Host Alex',
      'seats': '10 Seats',
      'online': '89',
      'lang': 'Urdu / Hindi',
      'category': 'Music',
      'lastVisited': '2 hours ago',
      'isLive': true,
    },
  ];

  final List<Map<String, dynamic>> _myCreatedRooms = [
    {
      'id': '101',
      'cover': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=300&fit=crop&auto=format',
      'title': 'VIP Crypto & Tech Club 🚀',
      'createdDate': 'Created July 2026',
      'status': 'Live',
      'isLive': true,
      'followers': '2.4k',
      'gifts': '45.2k',
      'visitors': '12.8k',
    },
    {
      'id': '102',
      'cover': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop&auto=format',
      'title': 'Late Night Karaoke 🎤',
      'createdDate': 'Created June 2026',
      'status': 'Offline',
      'isLive': false,
      'followers': '1.1k',
      'gifts': '18.4k',
      'visitors': '5.2k',
    },
  ];

  final List<Map<String, dynamic>> _favouriteRooms = [
    {
      'id': '3',
      'cover': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=300&fit=crop&auto=format',
      'title': 'Global Voice Meetup 🌍',
      'hostAvatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format',
      'hostName': 'Sophia',
      'online': '320',
      'category': 'Talk Show',
      'isLive': true,
    },
  ];

  final List<Map<String, dynamic>> _recentHosts = [
    {
      'name': 'Elena',
      'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
      'country': '🇵🇰 Pakistan',
      'vip': 'VIP 5',
      'isFollowing': true,
    },
    {
      'name': 'Alex',
      'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
      'country': '🇮🇶 Iraq',
      'vip': 'VIP 3',
      'isFollowing': false,
    },
    {
      'name': 'Sophia',
      'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format',
      'country': '🇧🇩 Bangladesh',
      'vip': 'VIP 7',
      'isFollowing': true,
    },
    {
      'name': 'David',
      'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
      'country': '🇸🇦 Saudi Arabia',
      'vip': 'VIP 2',
      'isFollowing': false,
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
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
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AuraColors.textPrimary, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'My Live Rooms Hub',
          style: AuraTypography.headlineMedium.copyWith(color: AuraColors.textPrimary),
        ),
        actions: [
          IconButton(
            icon: Icon(_hasRooms ? Iconsax.eye : Iconsax.eye_slash, color: AuraColors.accent),
            onPressed: () => setState(() => _hasRooms = !_hasRooms),
            tooltip: 'Toggle Empty State Demo',
          ),
          IconButton(
            icon: const Icon(Iconsax.search_normal_1, color: AuraColors.textPrimary),
            onPressed: () => context.push('/explore'),
          ),
          const SizedBox(width: 8),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        elevation: 8,
        backgroundColor: Colors.transparent,
        onPressed: () => context.push('/create-room-wizard'),
        label: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            gradient: AuraGradients.gold,
            borderRadius: AuraRadius.brPill,
            boxShadow: AuraShadows.neonGold,
          ),
          child: Row(
            children: [
              const Icon(Iconsax.add, color: AuraColors.background, size: 24),
              const SizedBox(width: 8),
              Text(
                'Create Room',
                style: AuraTypography.titleMedium.copyWith(
                  color: AuraColors.background,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
      body: !_hasRooms
          ? _buildEmptyState()
          : SingleChildScrollView(
              padding: const EdgeInsets.only(bottom: 90),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Continue Listening Widget (Hero Card)
                  _buildContinueListeningCard(),

                  AuraSpacing.vLg,

                  // 2. Recent Hosts Horizontal Avatar Bar
                  _buildSectionTitle('Recent Hosts', icon: Iconsax.people),
                  AuraSpacing.vSm,
                  _buildRecentHostsList(),

                  AuraSpacing.vLg,

                  // 3. Recently Visited Rooms Section
                  _buildSectionTitle('Recently Visited Rooms', icon: Iconsax.clock),
                  AuraSpacing.vSm,
                  _buildRecentlyVisitedList(),

                  AuraSpacing.vLg,

                  // 4. My Created Rooms Section
                  _buildSectionTitle('My Created Rooms', icon: Iconsax.home_hashtag),
                  AuraSpacing.vSm,
                  _buildMyCreatedRoomsList(),

                  AuraSpacing.vLg,

                  // 5. Favourite Rooms Section
                  _buildSectionTitle('Favourite Rooms', icon: Iconsax.heart5),
                  AuraSpacing.vSm,
                  _buildFavouriteRoomsList(),

                  AuraSpacing.vXl,
                ],
              ),
            ),
    );
  }

  Widget _buildSectionTitle(String title, {required IconData icon}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: [
          Icon(icon, color: AuraColors.accent, size: 20),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              title,
              style: AuraTypography.titleLarge.copyWith(
                color: AuraColors.textPrimary,
                fontWeight: FontWeight.bold,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  // 1. Continue Listening Banner
  Widget _buildContinueListeningCard() {
    return AuraSlideIn(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        child: Container(
          decoration: BoxDecoration(
            gradient: AuraGradients.primary,
            borderRadius: AuraRadius.brLg,
            boxShadow: AuraShadows.neonViolet,
          ),
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: AuraColors.accent, width: 2),
                ),
                child: const ClipOval(
                  child: Image(
                    image: NetworkImage('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&h=200&fit=crop&auto=format'),
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
                        const Icon(Iconsax.radar_1, color: AuraColors.accent, size: 14),
                        const SizedBox(width: 4),
                        Text(
                          'CONTINUE LISTENING',
                          style: AuraTypography.labelSmall.copyWith(
                            color: AuraColors.accent,
                            letterSpacing: 1.2,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    AuraSpacing.vXxs,
                    Text(
                      'Royal Audio Lounge 👑',
                      style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      'Queen Elena • 142 Listening',
                      style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                    ),
                  ],
                ),
              ),
              AuraBounceButton(
                onTap: () => context.push('/audio-meetup'),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: AuraColors.background,
                    borderRadius: AuraRadius.brPill,
                    boxShadow: AuraShadows.card,
                  ),
                  child: Row(
                    children: [
                      const Icon(Iconsax.play5, color: AuraColors.accent, size: 16),
                      const SizedBox(width: 4),
                      Text('Join', style: AuraTypography.labelLarge.copyWith(color: AuraColors.accent)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // 2. Recent Hosts Horizontal Avatar Bar
  Widget _buildRecentHostsList() {
    return SizedBox(
      height: 115,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        scrollDirection: Axis.horizontal,
        itemCount: _recentHosts.length,
        separatorBuilder: (context, index) => const SizedBox(width: 14),
        itemBuilder: (context, index) {
          final host = _recentHosts[index];
          return Column(
            children: [
              Stack(
                children: [
                  Container(
                    width: 58,
                    height: 58,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AuraColors.primary, width: 2),
                      boxShadow: AuraShadows.glass,
                    ),
                    child: ClipOval(
                      child: Image.network(host['avatar'] as String, fit: BoxFit.cover),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                      decoration: BoxDecoration(
                        gradient: AuraGradients.gold,
                        borderRadius: AuraRadius.brPill,
                      ),
                      child: Text(
                        host['vip'] as String,
                        style: AuraTypography.labelSmall.copyWith(color: AuraColors.background, fontSize: 8, fontWeight: FontWeight.bold),
                      ),
                    ),
                  )
                ],
              ),
              AuraSpacing.vXxs,
              SizedBox(
                width: 70,
                child: Text(
                  host['name'] as String,
                  style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Text(
                host['country'] as String,
                style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, fontSize: 9),
              ),
            ],
          );
        },
      ),
    );
  }

  // 3. Recently Visited Rooms
  Widget _buildRecentlyVisitedList() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: _recentlyVisited.length,
        separatorBuilder: (context, index) => AuraSpacing.vMd,
        itemBuilder: (context, index) {
          final room = _recentlyVisited[index];
          return Container(
            decoration: BoxDecoration(
              color: AuraColors.surfaceLight,
              borderRadius: AuraRadius.brLg,
              border: Border.all(color: AuraColors.border),
            ),
            child: Column(
              children: [
                // Room Cover Header
                Stack(
                  children: [
                    ClipRRect(
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                      child: Image.network(
                        room['cover'] as String,
                        height: 120,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                          gradient: LinearGradient(
                            colors: [Colors.transparent, Colors.black.withOpacity(0.8)],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      top: 10,
                      left: 10,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AuraColors.primary,
                          borderRadius: AuraRadius.brPill,
                        ),
                        child: Text(
                          room['category'] as String,
                          style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary, fontSize: 10),
                        ),
                      ),
                    ),
                    Positioned(
                      top: 10,
                      right: 10,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.black54,
                          borderRadius: AuraRadius.brPill,
                        ),
                        child: Row(
                          children: [
                            const Icon(Iconsax.eye, color: AuraColors.accent, size: 12),
                            const SizedBox(width: 4),
                            Text(
                              '${room['online']} Online',
                              style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary, fontSize: 10),
                            ),
                          ],
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 10,
                      left: 12,
                      right: 12,
                      child: Row(
                        children: [
                          Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: AuraColors.accent, width: 1.5),
                            ),
                            child: ClipOval(
                              child: Image.network(room['hostAvatar'] as String, fit: BoxFit.cover),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  room['title'] as String,
                                  style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                Text(
                                  'Host: ${room['hostName']} • ${room['seats']}',
                                  style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary, fontSize: 11),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                // Card Footer Actions
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Iconsax.clock, color: AuraColors.textSecondary, size: 14),
                            const SizedBox(width: 4),
                            Flexible(
                              child: Text(
                                'Visited ${room['lastVisited']}',
                                style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          OutlinedButton(
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: AuraColors.border),
                              shape: RoundedRectangleBorder(borderRadius: AuraRadius.brPill),
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            ),
                            onPressed: () => context.push('/live-room/1'),
                            child: Text('Details', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                          ),
                          const SizedBox(width: 6),
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AuraColors.primary,
                              shape: RoundedRectangleBorder(borderRadius: AuraRadius.brPill),
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            ),
                            onPressed: () => context.push('/audio-meetup'),
                            icon: const Icon(Iconsax.play5, size: 12, color: AuraColors.textPrimary),
                            label: Text('Join', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  // 4. My Created Rooms
  Widget _buildMyCreatedRoomsList() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: _myCreatedRooms.length,
        separatorBuilder: (context, index) => AuraSpacing.vMd,
        itemBuilder: (context, index) {
          final room = _myCreatedRooms[index];
          final isLive = room['isLive'] == true;
          return Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AuraColors.surfaceLight,
              borderRadius: AuraRadius.brLg,
              border: Border.all(color: isLive ? AuraColors.primary : AuraColors.border),
              boxShadow: isLive ? AuraShadows.neonViolet : [],
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    ClipRRect(
                      borderRadius: AuraRadius.brMd,
                      child: Image.network(room['cover'] as String, width: 70, height: 70, fit: BoxFit.cover),
                    ),
                    AuraSpacing.hMd,
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: isLive ? AuraColors.error : AuraColors.surface,
                                  borderRadius: AuraRadius.brPill,
                                ),
                                child: Text(
                                  isLive ? '• LIVE' : 'OFFLINE',
                                  style: AuraTypography.labelSmall.copyWith(
                                    color: isLive ? AuraColors.textPrimary : AuraColors.textSecondary,
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  room['createdDate'] as String,
                                  style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, fontSize: 10),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                          AuraSpacing.vXxs,
                          Text(
                            room['title'] as String,
                            style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          AuraSpacing.vXxs,
                          Text(
                            '👥 ${room['followers']} Followers • 🎁 ${room['gifts']} Gifts',
                            style: AuraTypography.bodySmall.copyWith(color: AuraColors.accent, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                AuraSpacing.vSm,
                const Divider(height: 1, color: AuraColors.border),
                AuraSpacing.vSm,
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildActionButton('Edit Room', Iconsax.edit_2, () {}),
                    _buildActionButton('Analytics', Iconsax.chart_2, () => context.push('/creator-analytics')),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: isLive ? AuraColors.primary : AuraColors.accent,
                        shape: RoundedRectangleBorder(borderRadius: AuraRadius.brPill),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                      ),
                      onPressed: () => context.push('/audio-meetup'),
                      icon: const Icon(Iconsax.video_circle, size: 16, color: AuraColors.background),
                      label: Text(
                        isLive ? 'Enter Room' : 'Go Live',
                        style: AuraTypography.labelSmall.copyWith(color: AuraColors.background, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildActionButton(String label, IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Row(
        children: [
          Icon(icon, color: AuraColors.textSecondary, size: 14),
          const SizedBox(width: 4),
          Text(label, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
        ],
      ),
    );
  }

  // 5. Favourite Rooms List
  Widget _buildFavouriteRoomsList() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: _favouriteRooms.length,
        separatorBuilder: (context, index) => AuraSpacing.vSm,
        itemBuilder: (context, index) {
          final room = _favouriteRooms[index];
          return Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AuraColors.surfaceLight,
              borderRadius: AuraRadius.brLg,
              border: Border.all(color: AuraColors.border),
            ),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: AuraRadius.brMd,
                  child: Image.network(room['cover'] as String, width: 50, height: 50, fit: BoxFit.cover),
                ),
                AuraSpacing.hMd,
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        room['title'] as String,
                        style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        '${room['category']} • ${room['online']} Listening',
                        style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Iconsax.heart5, color: AuraColors.error),
                  onPressed: () {},
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AuraColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: AuraRadius.brPill),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  ),
                  onPressed: () => context.push('/audio-meetup'),
                  child: Text('Join', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary)),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  // Empty State Illustration Widget
  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AuraPulse(
              child: Container(
                width: 130,
                height: 130,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AuraColors.surfaceLight,
                  border: Border.all(color: AuraColors.primary.withOpacity(0.4), width: 2),
                  boxShadow: AuraShadows.neonViolet,
                ),
                child: const Icon(
                  Iconsax.home_hashtag,
                  color: AuraColors.primary,
                  size: 64,
                ),
              ),
            ),
            AuraSpacing.vLg,
            Text(
              'No Rooms Yet',
              style: AuraTypography.headlineMedium.copyWith(color: AuraColors.textPrimary),
            ),
            AuraSpacing.vSm,
            Text(
              'You haven\'t joined or created any live audio room yet.',
              textAlign: TextAlign.center,
              style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
            ),
            AuraSpacing.vXl,
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AuraColors.primary),
                    shape: RoundedRectangleBorder(borderRadius: AuraRadius.brPill),
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  ),
                  onPressed: () => context.push('/explore'),
                  child: Text('Explore Rooms', style: AuraTypography.labelLarge.copyWith(color: AuraColors.primary)),
                ),
                const SizedBox(width: 16),
                Container(
                  decoration: BoxDecoration(
                    gradient: AuraGradients.gold,
                    borderRadius: AuraRadius.brPill,
                    boxShadow: AuraShadows.neonGold,
                  ),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(borderRadius: AuraRadius.brPill),
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    ),
                    onPressed: () => context.push('/create-room-wizard'),
                    child: Text('Create Room', style: AuraTypography.labelLarge.copyWith(color: AuraColors.background, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
