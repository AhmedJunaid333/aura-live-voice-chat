import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/gradients.dart';
import '../../../../core/design_system/animations.dart';
import '../../../../core/services/user_session_service.dart';
import '../../domain/room_entity.dart';
import '../../domain/seat_entity.dart';
import '../controllers/live_room_controller.dart';

class LiveRoomScreen extends ConsumerStatefulWidget {
  final String roomId;
  final int maxSeats;
  final bool isHost;

  const LiveRoomScreen({
    super.key,
    required this.roomId,
    this.maxSeats = 15,
    this.isHost = false,
  });

  @override
  ConsumerState<LiveRoomScreen> createState() => _LiveRoomScreenState();
}

class _LiveRoomScreenState extends ConsumerState<LiveRoomScreen> {
  final TextEditingController _chatController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final currentUser = UserSessionService().currentUser;
      final room = RoomEntity(
        id: widget.roomId,
        roomNumber: '888999',
        title: widget.isHost ? 'Grand Royal Voice Suite ✨' : 'Midnight Chill & Songs 🎵',
        hostId: widget.isHost ? (currentUser?.uuid ?? (currentUser?.numericId != null ? '${currentUser!.numericId}' : 'u-host')) : 'u-1001',
        hostName: widget.isHost ? (currentUser?.displayName ?? currentUser?.username ?? 'Room Host') : 'Aura Host',
        category: 'Music',
        rtcChannelId: 'channel_${widget.roomId}',
        maxSeats: widget.maxSeats,
        totalViewers: 120,
      );

      ref.read(liveRoomControllerProvider.notifier).initRoom(
            room: room,
            isHost: widget.isHost,
          );
    });
  }

  @override
  void dispose() {
    _chatController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final roomState = ref.watch(liveRoomControllerProvider);
    final roomNotifier = ref.read(liveRoomControllerProvider.notifier);
    final room = roomState.room;

    final int seatCount = room?.maxSeats ?? widget.maxSeats;
    final int crossAxisCount = seatCount <= 10 ? 4 : 5;

    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Container(
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
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              room?.title ?? 'Live Audio Room',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AuraTypography.headlineSmall.copyWith(color: AuraColors.primary, fontSize: 16),
            ),
            Row(
              children: [
                Container(
                  width: 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: AuraColors.error,
                    shape: BoxShape.circle,
                    boxShadow: AuraShadows.neonRose,
                  ),
                ),
                AuraSpacing.hXs,
                Flexible(
                  child: Text(
                    '${room?.category.toUpperCase() ?? "MUSIC"} • ${seatCount} SEATS',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, letterSpacing: 1),
                  ),
                ),
              ],
            )
          ],
        ),
        actions: [
          if (roomState.role == UserRoomRole.host && roomState.pendingSeatRequests.isNotEmpty)
            Stack(
              alignment: Alignment.center,
              children: [
                IconButton(
                  icon: Icon(Iconsax.profile_2user, color: AuraColors.primary),
                  onPressed: () => _showSeatRequestsSheet(context, roomState, roomNotifier),
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(color: AuraColors.error, shape: BoxShape.circle),
                    child: Text(
                      '${roomState.pendingSeatRequests.length}',
                      style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          IconButton(
            icon: Icon(Iconsax.close_circle, color: AuraColors.textSecondary),
            onPressed: () async {
              if (roomState.role == UserRoomRole.host) {
                await roomNotifier.endRoom();
              } else {
                await roomNotifier.leaveRoomSession();
              }
              if (mounted) context.pop();
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          // Background Ambient Glare
          Positioned(
            top: -50,
            left: -50,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AuraColors.primary.withValues(alpha: 0.1),
                boxShadow: [BoxShadow(color: AuraColors.primary.withValues(alpha: 0.2), blurRadius: 80)],
              ),
            ),
          ),
          Positioned(
            bottom: -50,
            right: -50,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AuraColors.secondary.withValues(alpha: 0.15),
                boxShadow: [BoxShadow(color: AuraColors.secondary.withValues(alpha: 0.25), blurRadius: 80)],
              ),
            ),
          ),

          Column(
            children: [
              // Dynamic Seats Grid (10, 15, or 20 Seats)
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  child: AuraFadeIn(
                    child: GridView.builder(
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: crossAxisCount,
                        crossAxisSpacing: 8,
                        mainAxisSpacing: 10,
                        childAspectRatio: 0.65,
                      ),
                      itemCount: roomState.seats.length,
                      itemBuilder: (context, index) {
                        final seat = roomState.seats[index];
                        final bool isOccupied = seat.status != SeatStatus.empty && seat.status != SeatStatus.locked;
                        final bool isSpeaking = seat.isSpeaking;

                        return GestureDetector(
                          onTap: () => _handleSeatTap(context, seat, roomState, roomNotifier),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Stack(
                                clipBehavior: Clip.none,
                                alignment: Alignment.center,
                                children: [
                                  // Seat Avatar Container
                                  AnimatedContainer(
                                    duration: const Duration(milliseconds: 200),
                                    width: 48,
                                    height: 48,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: isSpeaking
                                            ? AuraColors.primary
                                            : (isOccupied ? AuraColors.primary.withValues(alpha: 0.5) : AuraColors.border),
                                        width: isSpeaking ? 2.5 : 1.5,
                                      ),
                                      boxShadow: isSpeaking ? AuraShadows.neonViolet : [],
                                    ),
                                    child: isOccupied
                                        ? ClipOval(
                                            child: Image.network(
                                              seat.userAvatar ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format',
                                              fit: BoxFit.cover,
                                              errorBuilder: (_, __, ___) => Icon(Iconsax.user, color: AuraColors.primary),
                                            ),
                                          )
                                        : seat.isLocked
                                            ? Icon(Iconsax.lock, color: AuraColors.error, size: 20)
                                            : Icon(Iconsax.add, color: AuraColors.textSecondary.withValues(alpha: 0.5), size: 20),
                                  ),

                                  // Host Crown Badge
                                  if (seat.isHost)
                                    Positioned(
                                      top: -6,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                        decoration: BoxDecoration(
                                          gradient: AuraGradients.gold,
                                          borderRadius: AuraRadius.brSm,
                                        ),
                                        child: Text(
                                          'HOST 👑',
                                          style: AuraTypography.labelSmall.copyWith(color: Colors.black, fontSize: 7, fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    ),

                                  // Speaking Audio Wave Animated Pill
                                  if (isSpeaking)
                                    Positioned(
                                      bottom: -4,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                        decoration: BoxDecoration(
                                          color: AuraColors.primary,
                                          borderRadius: AuraRadius.brSm,
                                          boxShadow: AuraShadows.neonViolet,
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(Iconsax.audio_square, color: AuraColors.white, size: 10),
                                          ],
                                        ),
                                      ),
                                    ),

                                  // Mic Muted Icon Pill
                                  if (isOccupied && seat.isMuted)
                                    Positioned(
                                      bottom: -2,
                                      right: -2,
                                      child: Container(
                                        padding: const EdgeInsets.all(2),
                                        decoration: const BoxDecoration(color: AuraColors.error, shape: BoxShape.circle),
                                        child: const Icon(Iconsax.microphone_slash, color: Colors.white, size: 10),
                                      ),
                                    ),

                                  // Seat Index Pill (for empty seats)
                                  if (!isOccupied && !seat.isLocked)
                                    Positioned(
                                      bottom: -2,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                        decoration: BoxDecoration(
                                          color: AuraColors.surfaceLight,
                                          borderRadius: AuraRadius.brSm,
                                          border: Border.all(color: AuraColors.border),
                                        ),
                                        child: Text(
                                          '${seat.seatIndex + 1}',
                                          style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, fontSize: 8),
                                        ),
                                      ),
                                    )
                                ],
                              ),
                              AuraSpacing.vXs,
                              FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Text(
                                  seat.userName ?? (seat.isLocked ? 'Locked' : 'Mic ${seat.seatIndex + 1}'),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: AuraTypography.bodySmall.copyWith(
                                    color: isOccupied ? AuraColors.textPrimary : AuraColors.textSecondary,
                                    fontWeight: isOccupied ? FontWeight.bold : FontWeight.normal,
                                    fontSize: 10,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                ),
              ),

              // Bottom Interactive Action Controls Bar
              AuraSlideIn.up(
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: ClipRRect(
                    borderRadius: AuraRadius.brXl,
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AuraColors.glassBg,
                          borderRadius: AuraRadius.brXl,
                          border: Border.all(color: AuraColors.glassBorder),
                        ),
                        child: Row(
                          children: [
                            // Chat Input Field
                            Expanded(
                              child: Container(
                                height: 44,
                                padding: const EdgeInsets.symmetric(horizontal: 14),
                                decoration: BoxDecoration(
                                  color: AuraColors.surfaceLight,
                                  borderRadius: AuraRadius.brLg,
                                  border: Border.all(color: AuraColors.border),
                                ),
                                child: TextField(
                                  controller: _chatController,
                                  style: AuraTypography.bodyMedium,
                                  decoration: InputDecoration(
                                    hintText: 'Say something nice...',
                                    hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                                    border: InputBorder.none,
                                  ),
                                ),
                              ),
                            ),
                            AuraSpacing.hSm,

                            // Gift Button
                            GestureDetector(
                              onTap: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('🎁 Gift Store Opening...'),
                                    backgroundColor: AuraColors.primary,
                                  ),
                                );
                              },
                              child: Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: AuraGradients.primary,
                                  boxShadow: AuraShadows.neonViolet,
                                ),
                                child: Icon(Iconsax.gift, color: AuraColors.white, size: 20),
                              ),
                            ),
                            AuraSpacing.hSm,

                            // Audience Request Mic / Leave Mic Button
                            if (roomState.role == UserRoomRole.audience)
                              GestureDetector(
                                onTap: () {
                                  roomNotifier.requestSeat();
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: const Text('🙋 Requested seat from host!'),
                                      backgroundColor: AuraColors.primary,
                                    ),
                                  );
                                },
                                child: Container(
                                  width: 44,
                                  height: 44,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: AuraColors.surfaceLight,
                                    border: Border.all(color: AuraColors.primary),
                                  ),
                                  child: Icon(Iconsax.microphone, color: AuraColors.primary, size: 20),
                                ),
                              ),

                            if (roomState.role == UserRoomRole.speaker)
                              GestureDetector(
                                onTap: () async {
                                  await roomNotifier.leaveSeat();
                                },
                                child: Container(
                                  width: 44,
                                  height: 44,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: AuraColors.error.withValues(alpha: 0.2),
                                    border: Border.all(color: AuraColors.error),
                                  ),
                                  child: Icon(Iconsax.logout, color: AuraColors.error, size: 20),
                                ),
                              ),

                            // Mic Mute/Unmute Button (for Host & Speaker)
                            if (roomState.role != UserRoomRole.audience) ...[
                              AuraSpacing.hSm,
                              GestureDetector(
                                onTap: () => roomNotifier.toggleMic(),
                                child: Container(
                                  width: 44,
                                  height: 44,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: !roomState.isMicMuted ? AuraColors.success : AuraColors.surfaceLight,
                                    border: Border.all(color: AuraColors.border),
                                  ),
                                  child: Icon(
                                    !roomState.isMicMuted ? Iconsax.microphone_2 : Iconsax.microphone_slash,
                                    color: AuraColors.white,
                                    size: 20,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              )
            ],
          )
        ],
      ),
    );
  }

  void _handleSeatTap(
    BuildContext context,
    SeatEntity seat,
    LiveRoomState roomState,
    LiveRoomController roomNotifier,
  ) {
    if (roomState.role == UserRoomRole.host) {
      _showHostSeatControlsSheet(context, seat, roomNotifier);
    } else if (roomState.role == UserRoomRole.audience) {
      if (seat.status == SeatStatus.empty && !seat.isLocked) {
        roomNotifier.requestSeat();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('🙋 Requested seat ${seat.seatIndex + 1} from Host!'),
            backgroundColor: AuraColors.primary,
          ),
        );
      }
    }
  }

  void _showHostSeatControlsSheet(BuildContext context, SeatEntity seat, LiveRoomController roomNotifier) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AuraColors.surfaceLight,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (modalContext) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Host Seat ${seat.seatIndex + 1} Controls', style: AuraTypography.titleLarge),
              AuraSpacing.vLg,
              if (seat.userId != null && !seat.isHost) ...[
                ListTile(
                  leading: Icon(seat.isMuted ? Iconsax.microphone_2 : Iconsax.microphone_slash, color: AuraColors.primary),
                  title: Text(seat.isMuted ? 'Unmute Speaker' : 'Mute Speaker', style: AuraTypography.bodyLarge),
                  onTap: () {
                    Navigator.pop(modalContext);
                    roomNotifier.hostMuteUser(seat.seatIndex, !seat.isMuted);
                  },
                ),
                ListTile(
                  leading: Icon(Iconsax.user_remove, color: AuraColors.error),
                  title: Text('Kick Speaker Off Seat', style: AuraTypography.bodyLarge.copyWith(color: AuraColors.error)),
                  onTap: () {
                    Navigator.pop(modalContext);
                    roomNotifier.hostKickUser(seat.seatIndex);
                  },
                ),
              ],
              ListTile(
                leading: Icon(seat.isLocked ? Iconsax.unlock : Iconsax.lock, color: AuraColors.secondary),
                title: Text(seat.isLocked ? 'Unlock Seat' : 'Lock Seat', style: AuraTypography.bodyLarge),
                onTap: () {
                  Navigator.pop(modalContext);
                  roomNotifier.hostLockSeat(seat.seatIndex, !seat.isLocked);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _showSeatRequestsSheet(BuildContext context, LiveRoomState roomState, LiveRoomController roomNotifier) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AuraColors.surfaceLight,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (modalContext) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Pending Seat Requests (${roomState.pendingSeatRequests.length})', style: AuraTypography.titleLarge),
              AuraSpacing.vLg,
              if (roomState.pendingSeatRequests.isEmpty)
                Text('No pending requests', style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary))
              else
                ...roomState.pendingSeatRequests.map((req) {
                  final uId = req['userId'] ?? '';
                  final uName = req['userName'] ?? 'Guest';
                  return ListTile(
                    leading: const Icon(Iconsax.user, color: AuraColors.primary),
                    title: Text(uName, style: AuraTypography.bodyLarge),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Iconsax.tick_circle, color: AuraColors.success),
                          onPressed: () {
                            Navigator.pop(modalContext);
                            roomNotifier.acceptSeatRequest(uId, uName);
                          },
                        ),
                        IconButton(
                          icon: const Icon(Iconsax.close_circle, color: AuraColors.error),
                          onPressed: () {
                            Navigator.pop(modalContext);
                            roomNotifier.rejectSeatRequest(uId);
                          },
                        ),
                      ],
                    ),
                  );
                }).toList(),
            ],
          ),
        );
      },
    );
  }
}
