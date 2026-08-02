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

class AudioMeetupScreen extends StatefulWidget {
  final int initialSeatCount;

  const AudioMeetupScreen({
    super.key,
    this.initialSeatCount = 10,
  });

  @override
  State<AudioMeetupScreen> createState() => _AudioMeetupScreenState();
}

class _AudioMeetupScreenState extends State<AudioMeetupScreen> {
  late int _currentSeatCount;
  final TextEditingController _msgController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isMicOn = false;

  // Live Chat Messages
  final List<Map<String, dynamic>> _messages = [
    {
      'type': 'mod',
      'sender': 'Moderator',
      'role': 'Mod',
      'text': 'Welcome to the Grand Ballroom. Please maintain elegance at all times.',
      'time': '10:40 AM',
    },
    {
      'type': 'user',
      'sender': 'Julian',
      'role': 'User',
      'text': 'The audio quality here is truly premium. Simply stunning.',
      'time': '10:42 AM',
    },
    {
      'type': 'gift',
      'sender': 'MR √Lucky☆࿐',
      'role': 'VIP',
      'text': 'sent a 👑 Diamond Crown to Alexander Noble!',
      'time': '10:44 AM',
    },
    {
      'type': 'system',
      'sender': 'Evelyn',
      'role': 'System',
      'text': 'joined the Grand Ballroom ✨',
      'time': '10:45 AM',
    },
  ];

  // Dynamic Seats Data Generator
  late Map<int, Map<String, dynamic>> _seatsData;

  @override
  void initState() {
    super.initState();
    _currentSeatCount = widget.initialSeatCount;
    _initSeatsData();
  }

  void _initSeatsData() {
    _seatsData = {
      1: {
        'type': 'occupied',
        'name': 'Evelyn',
        'sub': 'Noble',
        'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
        'badge': Iconsax.verify5,
        'isMuted': false,
      },
      2: {'type': 'empty', 'name': 'Seat 2'},
      3: {
        'type': 'occupied',
        'name': 'Julian',
        'sub': 'ID: 042',
        'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
        'isMuted': false,
      },
      4: {'type': 'empty', 'name': 'Seat 4'},
      5: {
        'type': 'occupied',
        'name': 'Seraphina',
        'sub': 'ID: 109',
        'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format',
        'isMuted': true,
      },
      6: {'type': 'locked', 'name': 'Locked'},
      7: {'type': 'empty', 'name': 'Seat 7'},
      8: {'type': 'empty', 'name': 'Seat 8'},
      9: {
        'type': 'occupied',
        'name': 'Koda',
        'sub': 'VIP',
        'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
        'isMuted': false,
      },
      10: {'type': 'empty', 'name': 'Seat 10'},
      11: {'type': 'empty', 'name': 'Seat 11'},
      12: {'type': 'locked', 'name': 'Locked'},
      13: {
        'type': 'occupied',
        'name': 'Zara',
        'sub': 'Pro',
        'avatar': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&auto=format',
        'isMuted': false,
      },
      14: {'type': 'empty', 'name': 'Seat 14'},
      15: {'type': 'empty', 'name': 'Seat 15'},
      16: {'type': 'locked', 'name': 'Locked'},
      17: {'type': 'empty', 'name': 'Seat 17'},
      18: {'type': 'empty', 'name': 'Seat 18'},
      19: {
        'type': 'occupied',
        'name': 'Alpha',
        'sub': 'SVIP',
        'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
        'isMuted': false,
      },
      20: {'type': 'empty', 'name': 'Seat 20'},
    };
  }

  void _sendMessage() {
    final text = _msgController.text.trim();
    if (text.isEmpty) return;
    final now = DateTime.now();
    final timeStr = '${now.hour % 12 == 0 ? 12 : now.hour % 12}:${now.minute.toString().padLeft(2, '0')} ${now.hour >= 12 ? 'PM' : 'AM'}';

    setState(() {
      _messages.add({
        'type': 'user',
        'sender': 'MR √Lucky☆࿐',
        'role': 'Me',
        'text': text,
        'time': timeStr,
      });
      _msgController.clear();
    });

    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _handleSeatTap(int index) {
    final seat = _seatsData[index];
    if (seat == null) return;
    final seatType = seat['type'] as String;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
          child: Container(
            color: AuraColors.glassBg,
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(width: 40, height: 4, decoration: BoxDecoration(color: AuraColors.border, borderRadius: BorderRadius.circular(2))),
                AuraSpacing.vMd,
                Text('Seat #$index Control Panel', style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
                AuraSpacing.vXs,
                Text('Status: ${seatType.toUpperCase()}', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                AuraSpacing.vLg,
                if (seatType == 'occupied') ...[
                  ListTile(
                    leading: Icon(seat['isMuted'] == true ? Iconsax.microphone_2 : Iconsax.microphone_slash, color: AuraColors.warning),
                    title: Text(seat['isMuted'] == true ? 'Unmute Speaker' : 'Mute Speaker', style: AuraTypography.bodyMedium),
                    onTap: () {
                      setState(() => seat['isMuted'] = !(seat['isMuted'] as bool));
                      Navigator.pop(context);
                    },
                  ),
                  ListTile(
                    leading: Icon(Iconsax.gift, color: AuraColors.primary),
                    title: Text('Send Gift to Speaker', style: AuraTypography.bodyMedium),
                    onTap: () => Navigator.pop(context),
                  ),
                  ListTile(
                    leading: Icon(Iconsax.user_minus, color: AuraColors.error),
                    title: Text('Remove from Seat', style: AuraTypography.bodyMedium),
                    onTap: () {
                      setState(() {
                        _seatsData[index] = {'type': 'empty', 'name': 'Seat $index'};
                      });
                      Navigator.pop(context);
                    },
                  ),
                ] else if (seatType == 'empty') ...[
                  ListTile(
                    leading: Icon(Iconsax.user_add, color: AuraColors.success),
                    title: Text('Take This Seat', style: AuraTypography.bodyMedium),
                    onTap: () {
                      setState(() {
                        _seatsData[index] = {
                          'type': 'occupied',
                          'name': 'MR √Lucky☆࿐',
                          'sub': 'Me',
                          'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
                          'isMuted': false,
                        };
                      });
                      Navigator.pop(context);
                    },
                  ),
                  ListTile(
                    leading: Icon(Iconsax.lock, color: AuraColors.primary),
                    title: Text('Lock Seat', style: AuraTypography.bodyMedium),
                    onTap: () {
                      setState(() {
                        _seatsData[index] = {'type': 'locked', 'name': 'Locked'};
                      });
                      Navigator.pop(context);
                    },
                  ),
                ] else if (seatType == 'locked') ...[
                  ListTile(
                    leading: Icon(Iconsax.unlock, color: AuraColors.success),
                    title: Text('Unlock Seat', style: AuraTypography.bodyMedium),
                    onTap: () {
                      setState(() {
                        _seatsData[index] = {'type': 'empty', 'name': 'Seat $index'};
                      });
                      Navigator.pop(context);
                    },
                  ),
                ],
                AuraSpacing.vMd,
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _msgController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: RoomHeaderWidget(
        title: 'Grand Ballroom',
        subtitle: 'AURA PREMIUM LIVE',
        currentSeatCount: _currentSeatCount,
        onSeatCountChanged: (count) {
          setState(() => _currentSeatCount = count);
        },
      ),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Host Section Widget (Ultra-Compact for 1-Page Layout)
            HostWidget(
              name: 'Alexander Noble',
              hostId: 'ID: 888888',
              avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format',
              seatCount: _currentSeatCount,
            ),

            AuraSpacing.vXs,

            // 2. Responsive 1-Page Bounded Seat Grid Widget
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: SeatGridWidget(
                seatCount: _currentSeatCount,
                seatsData: _seatsData,
                onSeatTap: _handleSeatTap,
              ),
            ),

            AuraSpacing.vXs,

            // 3. Live Chat Message Stream
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: ListView.separated(
                  controller: _scrollController,
                  physics: const BouncingScrollPhysics(),
                  itemCount: _messages.length,
                  separatorBuilder: (context, index) => AuraSpacing.vXs,
                  itemBuilder: (context, index) {
                    final msg = _messages[index];
                    return ChatMessageWidget(message: msg);
                  },
                ),
              ),
            ),

            // 4. Bottom Input Control Bar (Fixed Pinned)
            BottomInputWidget(
              controller: _msgController,
              isMicOn: _isMicOn,
              onSend: _sendMessage,
              onMicToggle: () => setState(() => _isMicOn = !_isMicOn),
            ),
          ],
        ),
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// REUSABLE FLUTTER WIDGETS
// -----------------------------------------------------------------------------

class RoomHeaderWidget extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final String subtitle;
  final int currentSeatCount;
  final ValueChanged<int> onSeatCountChanged;

  const RoomHeaderWidget({
    super.key,
    required this.title,
    required this.subtitle,
    required this.currentSeatCount,
    required this.onSeatCountChanged,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: true,
      leading: IconButton(
        icon: Icon(Iconsax.arrow_left, color: AuraColors.textPrimary),
        onPressed: () {
          if (context.canPop()) {
            context.pop();
          } else {
            context.go('/home');
          }
        },
      ),
      title: Column(
        children: [
          Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary),
          ),
          AuraSpacing.vXs,
          Text(
            subtitle,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: AuraTypography.labelSmall.copyWith(color: AuraColors.primary, letterSpacing: 1.5),
          ),
        ],
      ),
      actions: [
        Theme(
          data: Theme.of(context).copyWith(
            popupMenuTheme: PopupMenuThemeData(
              color: AuraColors.surfaceLight,
              textStyle: AuraTypography.bodyMedium,
            ),
          ),
          child: PopupMenuButton<int>(
            icon: Icon(Iconsax.more, color: AuraColors.textPrimary),
            onSelected: onSeatCountChanged,
            itemBuilder: (context) => [
              const PopupMenuItem(value: 10, child: Text('10 Seats Room')),
              const PopupMenuItem(value: 15, child: Text('15 Seats Room')),
              const PopupMenuItem(value: 20, child: Text('20 Seats Room')),
            ],
          ),
        ),
      ],
    );
  }
}

class HostWidget extends StatelessWidget {
  final String name;
  final String hostId;
  final String avatarUrl;
  final int seatCount;

  const HostWidget({
    super.key,
    required this.name,
    required this.hostId,
    required this.avatarUrl,
    required this.seatCount,
  });

  @override
  Widget build(BuildContext context) {
    final avatarSize = seatCount == 20 ? 46.0 : (seatCount == 15 ? 52.0 : 60.0);

    return Column(
      children: [
        Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.center,
          children: [
            Container(
              width: avatarSize,
              height: avatarSize,
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: AuraGradients.primary,
                boxShadow: AuraShadows.neonViolet,
              ),
              child: ClipOval(
                child: Image(
                  image: NetworkImage(avatarUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Positioned(
              bottom: -6,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                decoration: BoxDecoration(
                  gradient: AuraGradients.primary,
                  borderRadius: AuraRadius.brPill,
                  border: Border.all(color: AuraColors.background),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Iconsax.star1, color: AuraColors.white, size: 8),
                    AuraSpacing.hXs,
                    Text(
                      'HOST',
                      style: AuraTypography.labelSmall.copyWith(color: AuraColors.white, fontSize: 8),
                    ),
                  ],
                ),
              ),
            )
          ],
        ),
        AuraSpacing.vSm,
        Text(
          name,
          style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary),
        ),
        Text(
          hostId,
          style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary),
        ),
      ],
    );
  }
}

class SeatGridWidget extends StatelessWidget {
  final int seatCount;
  final Map<int, Map<String, dynamic>> seatsData;
  final ValueChanged<int> onSeatTap;

  const SeatGridWidget({
    super.key,
    required this.seatCount,
    required this.seatsData,
    required this.onSeatTap,
  });

  @override
  Widget build(BuildContext context) {
    final cols = seatCount == 20 ? 5 : 4;
    final seatSize = seatCount == 20 ? 30.0 : (seatCount == 15 ? 34.0 : 40.0);
    final ratio = seatCount == 20 ? 1.05 : (seatCount == 15 ? 1.0 : 0.95);
    final spacing = seatCount == 20 ? 2.0 : (seatCount == 15 ? 3.0 : 4.0);

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: cols,
        mainAxisSpacing: spacing,
        crossAxisSpacing: spacing,
        childAspectRatio: ratio,
      ),
      itemCount: seatCount,
      itemBuilder: (context, index) {
        final seatIndex = index + 1;
        final seat = seatsData[seatIndex] ?? {'type': 'empty', 'name': 'Seat $seatIndex'};

        return AudioSeatWidget(
          seatIndex: seatIndex,
          seatData: seat,
          size: seatSize,
          onTap: () => onSeatTap(seatIndex),
        );
      },
    );
  }
}

class AudioSeatWidget extends StatelessWidget {
  final int seatIndex;
  final Map<String, dynamic> seatData;
  final double size;
  final VoidCallback onTap;

  const AudioSeatWidget({
    super.key,
    required this.seatIndex,
    required this.seatData,
    this.size = 40.0,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final type = seatData['type'] as String;

    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (type == 'occupied') ...[
            Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: size,
                  height: size,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: AuraColors.primary, width: 1.5),
                    boxShadow: AuraShadows.neonViolet,
                  ),
                  child: ClipOval(
                    child: Image(
                      image: NetworkImage(seatData['avatar'] as String),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                if (seatData['badge'] != null)
                  Positioned(
                    top: -2,
                    right: -2,
                    child: Container(
                      padding: const EdgeInsets.all(1.5),
                      decoration: BoxDecoration(color: AuraColors.primary, shape: BoxShape.circle),
                      child: Icon(seatData['badge'] as IconData, color: AuraColors.white, size: 7),
                    ),
                  ),
                if (seatData['isMuted'] == true)
                  Positioned(
                    bottom: -2,
                    right: -2,
                    child: Container(
                      padding: const EdgeInsets.all(1.5),
                      decoration: BoxDecoration(color: AuraColors.error, shape: BoxShape.circle),
                      child: Icon(Iconsax.microphone_slash, color: AuraColors.white, size: 7),
                    ),
                  ),
              ],
            ),
            AuraSpacing.vXs,
            Text(
              seatData['name'] as String,
              overflow: TextOverflow.ellipsis,
              style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary, fontSize: 8.5),
            ),
            Text(
              seatData['sub'] as String,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AuraTypography.labelSmall.copyWith(color: AuraColors.primary, fontSize: 7.5),
            ),
          ] else if (type == 'locked') ...[
            Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AuraColors.surfaceLight,
                border: Border.all(color: AuraColors.border),
              ),
              child: Icon(Iconsax.lock, color: AuraColors.textSecondary, size: size * 0.4),
            ),
            AuraSpacing.vXs,
            Text(
              'Locked',
              style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, fontSize: 8),
            ),
          ] else ...[
            Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AuraColors.surfaceLight,
                border: Border.all(color: AuraColors.border),
              ),
              child: Icon(Iconsax.add, color: AuraColors.textSecondary, size: size * 0.4),
            ),
            AuraSpacing.vXs,
            Text(
              seatData['name'] as String,
              style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, fontSize: 8),
            ),
          ]
        ],
      ),
    );
  }
}

class ChatMessageWidget extends StatelessWidget {
  final Map<String, dynamic> message;

  const ChatMessageWidget({
    super.key,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    final type = message['type'] as String;

    if (type == 'mod') {
      return Align(
        alignment: Alignment.centerLeft,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          decoration: BoxDecoration(
            color: AuraColors.warning.withValues(alpha: 0.1),
            borderRadius: AuraRadius.brSm,
            border: Border.all(color: AuraColors.warning.withValues(alpha: 0.3)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                message['sender'] as String,
                style: AuraTypography.labelMedium.copyWith(color: AuraColors.warning, fontSize: 8.5),
              ),
              AuraSpacing.vXs,
              Text(
                message['text'] as String,
                style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textPrimary, fontSize: 11.5),
              ),
            ],
          ),
        ),
      );
    } else if (type == 'gift') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: AuraColors.primary.withValues(alpha: 0.1),
          borderRadius: AuraRadius.brSm,
          border: Border.all(color: AuraColors.primary.withValues(alpha: 0.3)),
        ),
        child: Text(
          '🎁 ${message['sender']} ${message['text']}',
          style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary, fontSize: 11),
        ),
      );
    } else if (type == 'system') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
        child: Text(
          '✨ ${message['sender']} ${message['text']}',
          style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary, fontSize: 10, fontStyle: FontStyle.italic),
        ),
      );
    } else {
      return Align(
        alignment: Alignment.centerLeft,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          decoration: BoxDecoration(
            color: AuraColors.surfaceLight,
            borderRadius: AuraRadius.brSm,
            border: Border.all(color: AuraColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                message['sender'] as String,
                style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary, fontSize: 8.5),
              ),
              AuraSpacing.vXs,
              Text(
                message['text'] as String,
                style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textPrimary, fontSize: 11.5),
              ),
            ],
          ),
        ),
      );
    }
  }
}

class BottomInputWidget extends StatelessWidget {
  final TextEditingController controller;
  final bool isMicOn;
  final VoidCallback onSend;
  final VoidCallback onMicToggle;

  const BottomInputWidget({
    super.key,
    required this.controller,
    required this.isMicOn,
    required this.onSend,
    required this.onMicToggle,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: AuraColors.glassBg,
            border: Border(top: BorderSide(color: AuraColors.glassBorder)),
          ),
          child: Row(
            children: [
              // Message Input Field
              Expanded(
                child: Container(
                  height: 42,
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: AuraColors.surfaceLight,
                    borderRadius: AuraRadius.brPill,
                    border: Border.all(color: AuraColors.border),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: controller,
                          onSubmitted: (_) => onSend(),
                          style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textPrimary, fontSize: 12),
                          decoration: InputDecoration(
                            hintText: 'Send an elegant message...',
                            hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary, fontSize: 11),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: Icon(Iconsax.send_1, color: AuraColors.primary, size: 16),
                        onPressed: onSend,
                      )
                    ],
                  ),
                ),
              ),

              AuraSpacing.hSm,

              // Gift Button
              GestureDetector(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gift Modal Opened! 🎁')));
                },
                child: Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: AuraGradients.primary,
                    boxShadow: AuraShadows.neonViolet,
                  ),
                  child: Icon(Iconsax.gift, color: AuraColors.white, size: 20),
                ),
              ),

              AuraSpacing.hSm,

              // Mic Button
              GestureDetector(
                onTap: onMicToggle,
                child: Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isMicOn ? AuraColors.success : AuraColors.surfaceLight,
                    border: Border.all(color: AuraColors.border),
                  ),
                  child: Icon(
                    isMicOn ? Iconsax.microphone_2 : Iconsax.microphone_slash,
                    color: AuraColors.white,
                    size: 20,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
