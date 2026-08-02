import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/animations.dart';
import '../../../../core/widgets/aura_bottom_nav.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, dynamic>> _conversations = [
    {
      'id': '1',
      'name': 'MR √Lucky☆࿐',
      'gender': 'male',
      'badge': 'Noble',
      'badgeColor': AuraColors.warning,
      'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
      'time': '10:45 AM',
      'message': 'See you in the room later! 🚀',
      'unread': 2,
      'goldBorder': true,
    },
    {
      'id': '2',
      'name': 'Aura Princess 👑',
      'gender': 'female',
      'badge': 'Noble',
      'badgeColor': AuraColors.warning,
      'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
      'time': '09:12 AM',
      'message': 'Did you check the new rewards section?',
      'unread': 0,
      'goldBorder': true,
    },
    {
      'id': '3',
      'name': 'Captain Alpha',
      'gender': 'male',
      'badge': 'SVIP',
      'badgeColor': AuraColors.textSecondary,
      'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
      'time': 'Yesterday',
      'message': 'The family battle starts in 10 mins.',
      'unread': 0,
      'goldBorder': false,
    },
    {
      'id': '4',
      'name': 'Brother Mike',
      'gender': 'male',
      'badge': null,
      'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format',
      'time': 'Yesterday',
      'message': 'Shared a Moment with you.',
      'unread': 0,
      'goldBorder': false,
    },
    {
      'id': '5',
      'name': 'Serene Soul',
      'gender': 'female',
      'badge': null,
      'avatar': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&auto=format',
      'time': 'Tuesday',
      'message': 'Thanks for the support!',
      'unread': 0,
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
    final query = _searchController.text.toLowerCase().trim();
    final filtered = _conversations.where((c) {
      final name = (c['name'] as String).toLowerCase();
      final msg = (c['message'] as String).toLowerCase();
      return query.isEmpty || name.contains(query) || msg.contains(query);
    }).toList();

    return Scaffold(
      backgroundColor: AuraColors.background,
      bottomNavigationBar: const AuraBottomNav(activeTab: 'chat'),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'Messages',
          style: AuraTypography.headlineMedium,
        ),
        actions: [
          IconButton(
            icon: const Icon(Iconsax.user_add, color: AuraColors.primary),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Iconsax.setting, color: AuraColors.primary),
            onPressed: () {},
          ),
          AuraSpacing.hSm,
        ],
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: FloatingActionButton(
          backgroundColor: AuraColors.primary,
          elevation: 6,
          onPressed: () {},
          child: const Icon(Iconsax.edit, color: AuraColors.background, size: 24),
        ),
      ),
      body: Column(
        children: [
          // Search Input Bar
          AuraSlideIn(
            delay: const Duration(milliseconds: 100),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: TextField(
                controller: _searchController,
                onChanged: (_) => setState(() {}),
                style: AuraTypography.bodyMedium,
                decoration: InputDecoration(
                  hintText: 'Search conversations...',
                  hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                  prefixIcon: const Icon(Iconsax.search_normal, color: AuraColors.textSecondary, size: 20),
                  filled: true,
                  fillColor: AuraColors.surfaceLight,
                  contentPadding: const EdgeInsets.symmetric(vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: AuraRadius.brPill,
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),
          ),

          // Conversation List
          Expanded(
            child: AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                itemCount: filtered.length,
                separatorBuilder: (context, index) => const Divider(height: 1, color: AuraColors.border, indent: 72),
                itemBuilder: (context, index) {
                  final chat = filtered[index];
                  final hasBadge = chat['badge'] != null;
                  final goldBorder = chat['goldBorder'] == true;
                  final unread = chat['unread'] as int;
                  final isMale = chat['gender'] == 'male';

                  return InkWell(
                    onTap: () {},
                    borderRadius: AuraRadius.brLg,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
                      child: Row(
                        children: [
                          // Avatar + Badge
                          Stack(
                            clipBehavior: Clip.none,
                            children: [
                              Container(
                                width: 56,
                                height: 56,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: goldBorder ? AuraColors.warning : AuraColors.border,
                                    width: goldBorder ? 2 : 1,
                                  ),
                                  boxShadow: goldBorder ? AuraShadows.neonViolet : [],
                                ),
                                child: ClipOval(
                                  child: Image(
                                    image: NetworkImage(chat['avatar'] as String),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              if (hasBadge)
                                Positioned(
                                  bottom: -2,
                                  right: -2,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                    decoration: BoxDecoration(
                                      color: chat['badgeColor'] as Color,
                                      borderRadius: AuraRadius.brPill,
                                      border: Border.all(color: AuraColors.background, width: 1.5),
                                    ),
                                    child: Text(
                                      chat['badge'] as String,
                                      style: AuraTypography.labelSmall.copyWith(color: AuraColors.background, fontSize: 8),
                                    ),
                                  ),
                                )
                            ],
                          ),

                          AuraSpacing.hMd,

                          // Message details
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Row(
                                        children: [
                                          Flexible(
                                            child: Text(
                                              chat['name'] as String,
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: AuraTypography.bodyLarge,
                                            ),
                                          ),
                                          AuraSpacing.hSm,
                                          Icon(
                                            isMale ? Iconsax.man : Iconsax.woman,
                                            color: isMale ? Colors.blueAccent : Colors.pinkAccent,
                                            size: 14,
                                          ),
                                        ],
                                      ),
                                    ),
                                    Text(
                                      chat['time'] as String,
                                      style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                                    ),
                                  ],
                                ),
                                AuraSpacing.vXxs,
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        chat['message'] as String,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                                      ),
                                    ),
                                    if (unread > 0)
                                      Container(
                                        width: 20,
                                        height: 20,
                                        decoration: const BoxDecoration(
                                          color: AuraColors.error,
                                          shape: BoxShape.circle,
                                        ),
                                        child: Center(
                                          child: Text(
                                            '$unread',
                                            style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary, fontSize: 10),
                                          ),
                                        ),
                                      )
                                  ],
                                )
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          ],
        ),
      );
  }
}
