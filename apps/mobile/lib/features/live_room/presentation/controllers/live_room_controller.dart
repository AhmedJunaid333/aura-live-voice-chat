import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/agora_rtc_service.dart';
import '../../../../core/services/user_session_service.dart';
import '../../domain/room_entity.dart';
import '../../domain/seat_entity.dart';
import '../../domain/rtc_repository.dart';
import '../../data/rtc_repository_impl.dart';
import '../../data/websocket_client.dart';

enum UserRoomRole { host, speaker, audience }

class LiveRoomState {
  final RoomEntity? room;
  final UserRoomRole role;
  final List<SeatEntity> seats;
  final List<Map<String, String>> pendingSeatRequests; // [{'userId': id, 'userName': name}]
  final bool isMicMuted;
  final bool isConnecting;
  final bool isLive;
  final int networkQuality; // 0-5 scale
  final String? errorMessage;

  LiveRoomState({
    this.room,
    this.role = UserRoomRole.audience,
    this.seats = const [],
    this.pendingSeatRequests = const [],
    this.isMicMuted = false,
    this.isConnecting = false,
    this.isLive = false,
    this.networkQuality = 5,
    this.errorMessage,
  });

  LiveRoomState copyWith({
    RoomEntity? room,
    UserRoomRole? role,
    List<SeatEntity>? seats,
    List<Map<String, String>>? pendingSeatRequests,
    bool? isMicMuted,
    bool? isConnecting,
    bool? isLive,
    int? networkQuality,
    String? errorMessage,
  }) {
    return LiveRoomState(
      room: room ?? this.room,
      role: role ?? this.role,
      seats: seats ?? this.seats,
      pendingSeatRequests: pendingSeatRequests ?? this.pendingSeatRequests,
      isMicMuted: isMicMuted ?? this.isMicMuted,
      isConnecting: isConnecting ?? this.isConnecting,
      isLive: isLive ?? this.isLive,
      networkQuality: networkQuality ?? this.networkQuality,
      errorMessage: errorMessage,
    );
  }
}

class LiveRoomController extends StateNotifier<LiveRoomState> {
  final RtcRepository _rtcRepository;
  final AgoraRtcService _agoraService = AgoraRtcService();
  final VoiceRoomWebSocketClient _wsClient = VoiceRoomWebSocketClient();
  StreamSubscription? _wsSubscription;

  LiveRoomController({RtcRepository? rtcRepository})
      : _rtcRepository = rtcRepository ?? RtcRepositoryImpl(),
        super(LiveRoomState());

  /// Initialize Voice Room session with RTC + WebSockets
  Future<void> initRoom({
    required RoomEntity room,
    required bool isHost,
  }) async {
    state = state.copyWith(isConnecting: true, errorMessage: null);

    final currentUser = UserSessionService().currentUser;
    final String userId = currentUser?.uuid ?? (currentUser?.numericId != null ? '${currentUser!.numericId}' : 'usr_${DateTime.now().millisecondsSinceEpoch}');
    final String userName = currentUser?.displayName ?? currentUser?.username ?? (isHost ? 'Room Host' : 'Aura Guest');
    final String userAvatar = currentUser?.avatarUrl ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format';
    final int level = currentUser?.level ?? 1;
    final int vipTier = currentUser?.vip ?? 0;

    final UserRoomRole initialRole = isHost ? UserRoomRole.host : UserRoomRole.audience;
    final int seatCount = room.maxSeats;

    // Generate initial dynamic seats list
    final List<SeatEntity> initialSeats = List.generate(seatCount, (i) {
      if (i == 0) {
        // Seat 0 belongs to Host
        return SeatEntity(
          seatIndex: 0,
          userId: room.hostId,
          userName: room.hostName.isNotEmpty ? room.hostName : userName,
          userAvatar: room.hostAvatar ?? userAvatar,
          level: isHost ? level : 5,
          vipTier: isHost ? vipTier : 1,
          isHost: true,
          status: SeatStatus.speaking,
          isMuted: false,
        );
      }
      return SeatEntity(
        seatIndex: i,
        status: SeatStatus.empty,
      );
    });

    state = state.copyWith(
      room: room,
      role: initialRole,
      seats: initialSeats,
    );

    // 1. Connect WebSockets
    _wsClient.connect(roomId: room.id, userId: userId);
    _listenToWebSocketEvents(userId);

    // 2. Initialize Agora Engine & Register Callbacks
    await _rtcRepository.initializeEngine();
    _setupAgoraCallbacks(room.rtcChannelId, userId);

    // 3. Fetch Dynamic RTC Token
    final String roleStr = isHost ? 'HOST' : 'AUDIENCE';
    final String? rtcToken = await _rtcRepository.fetchRtcToken(
      channelId: room.rtcChannelId,
      userId: userId,
      role: roleStr,
    );

    // Extract numeric UID from user ID
    final int numericUid = int.tryParse(userId.replaceAll(RegExp(r'\D'), '')) ?? (userId.hashCode & 0x7FFFFFFF);

    // 4. Join Agora Channel
    final bool joined = await _rtcRepository.joinRoom(
      channelId: room.rtcChannelId,
      token: rtcToken ?? '',
      numericUid: numericUid,
      isBroadcaster: isHost,
    );

    if (joined) {
      state = state.copyWith(isConnecting: false, isLive: true);
    } else {
      state = state.copyWith(
        isConnecting: false,
        errorMessage: 'Failed to join Agora audio channel. Please check mic permissions.',
      );
    }
  }

  /// Register Agora RTC callbacks (Volume Indication, Token Renewal, Disconnect Recovery)
  void _setupAgoraCallbacks(String channelId, String userId) {
    _agoraService.onVolumeIndication = (speakers, totalVolume) {
      if (speakers.isEmpty) return;

      final updatedSeats = state.seats.map((seat) {
        if (seat.status == SeatStatus.empty) return seat;

        final isUserSpeaking = speakers.any((s) {
          final speakerUid = s.uid ?? 0;
          if (speakerUid == 0 && (state.role == UserRoomRole.host || state.role == UserRoomRole.speaker)) {
            return (seat.userId == userId) && (s.volume ?? 0) > 10;
          }
          final seatUid = int.tryParse(seat.userId?.replaceAll(RegExp(r'\D'), '') ?? '') ?? (seat.userId.hashCode & 0x7FFFFFFF);
          return (speakerUid == seatUid) && ((s.volume ?? 0) > 10);
        });

        return seat.copyWith(
          isSpeaking: isUserSpeaking,
          volume: isUserSpeaking ? 80 : 0,
        );
      }).toList();

      state = state.copyWith(seats: updatedSeats);
    };

    _agoraService.onTokenWillExpire = (expiringChannelId) async {
      debugPrint('🔄 Auto Refreshing Expiring Agora Token for $expiringChannelId...');
      final String roleStr = state.role == UserRoomRole.host
          ? 'HOST'
          : state.role == UserRoomRole.speaker
              ? 'SPEAKER'
              : 'AUDIENCE';

      final newToken = await _rtcRepository.fetchRtcToken(
        channelId: expiringChannelId,
        userId: userId,
        role: roleStr,
      );

      if (newToken != null) {
        await _rtcRepository.renewToken(newToken);
      }
    };

    _agoraService.onConnectionState = (connState, reason) {
      if (connState.index == 4) { // Failed / Disconnected
        debugPrint('⚠️ Connection lost! Reconnecting RTC audio...');
        state = state.copyWith(networkQuality: 1);
      } else if (connState.index == 3) { // Connected
        state = state.copyWith(networkQuality: 5);
      }
    };
  }

  /// Subscribe to WebSocket broadcast events
  void _listenToWebSocketEvents(String currentUserId) {
    _wsSubscription = _wsClient.eventsStream.listen((eventData) {
      final event = eventData['event'];
      final data = eventData['data'];

      switch (event) {
        case 'SEAT_REQUEST':
          if (state.role == UserRoomRole.host) {
            final String uId = data['userId'] ?? '';
            final String uName = data['userName'] ?? 'Guest';
            final existing = List<Map<String, String>>.from(state.pendingSeatRequests);
            if (!existing.any((req) => req['userId'] == uId)) {
              existing.add({'userId': uId, 'userName': uName});
              state = state.copyWith(pendingSeatRequests: existing);
            }
          }
          break;

        case 'SEAT_ACCEPT':
          final String targetUserId = data['userId'] ?? '';
          final int seatIdx = data['seatIndex'] ?? 1;
          if (targetUserId == currentUserId) {
            _becomeBroadcaster(seatIndex: seatIdx);
          }
          break;

        case 'SEAT_REJECT':
          final String targetUserId = data['userId'] ?? '';
          if (targetUserId == currentUserId) {
            state = state.copyWith(errorMessage: 'Host declined your seat request.');
          }
          break;

        case 'SEAT_LEAVE':
        case 'HOST_KICK_USER':
          final String targetUserId = data['userId'] ?? data['targetUserId'] ?? '';
          final int seatIdx = data['seatIndex'] ?? -1;
          if (targetUserId == currentUserId) {
            _becomeAudience();
          }
          _clearSeat(seatIndex: seatIdx, targetUserId: targetUserId);
          break;

        case 'MIC_MUTED':
        case 'MIC_UNMUTED':
        case 'HOST_MUTED_USER':
        case 'HOST_UNMUTED_USER':
          final String targetUserId = data['userId'] ?? data['targetUserId'] ?? '';
          final bool isMuted = data['isMuted'] ?? false;
          if (targetUserId == currentUserId) {
            state = state.copyWith(isMicMuted: isMuted);
            _agoraService.setMicrophoneMuted(isMuted);
          }
          _updateSeatMuteState(targetUserId, isMuted);
          break;

        case 'ROOM_LOCKED':
        case 'ROOM_UNLOCKED':
          final int seatIdx = data['seatIndex'] ?? -1;
          final bool isLocked = data['isLocked'] ?? false;
          _updateSeatLockState(seatIdx, isLocked);
          break;

        case 'ROOM_ENDED':
          state = state.copyWith(isLive: false);
          _rtcRepository.leaveRoom();
          break;
      }
    });
  }

  /// Toggle Local Microphone state
  Future<void> toggleMic() async {
    if (state.role == UserRoomRole.audience) return;
    final newMuteState = !state.isMicMuted;
    state = state.copyWith(isMicMuted: newMuteState);
    await _rtcRepository.setMicrophoneMuted(newMuteState);

    final currentUser = UserSessionService().currentUser;
    final String uId = currentUser?.uuid ?? (currentUser?.numericId != null ? '${currentUser!.numericId}' : 'usr_local');
    _updateSeatMuteState(uId, newMuteState);

    _wsClient.broadcastMicMuted(
      roomId: state.room?.id ?? '',
      userId: uId,
      isMuted: newMuteState,
    );
  }

  /// Audience -> Request Speaker Seat
  void requestSeat() {
    if (state.role != UserRoomRole.audience) return;
    final currentUser = UserSessionService().currentUser;
    final uId = currentUser?.uuid ?? (currentUser?.numericId != null ? '${currentUser!.numericId}' : 'usr_local');
    final uName = currentUser?.displayName ?? currentUser?.username ?? 'Aura Audience';

    _wsClient.broadcastSeatRequest(
      roomId: state.room?.id ?? '',
      userId: uId,
      userName: uName,
    );
  }

  /// Host -> Accept Seat Request
  Future<void> acceptSeatRequest(String targetUserId, String targetUserName) async {
    if (state.role != UserRoomRole.host) return;

    // Find first empty seat
    final emptyIndex = state.seats.indexWhere((s) => s.status == SeatStatus.empty && !s.isLocked);
    if (emptyIndex == -1) return;

    final updatedRequests = state.pendingSeatRequests.where((r) => r['userId'] != targetUserId).toList();

    final updatedSeats = List<SeatEntity>.from(state.seats);
    updatedSeats[emptyIndex] = SeatEntity(
      seatIndex: emptyIndex,
      userId: targetUserId,
      userName: targetUserName,
      status: SeatStatus.speaking,
      isMuted: false,
    );

    state = state.copyWith(
      seats: updatedSeats,
      pendingSeatRequests: updatedRequests,
    );

    _wsClient.broadcastSeatAccept(
      roomId: state.room?.id ?? '',
      userId: targetUserId,
      seatIndex: emptyIndex,
    );
  }

  /// Host -> Reject Seat Request
  void rejectSeatRequest(String targetUserId) {
    if (state.role != UserRoomRole.host) return;

    final updatedRequests = state.pendingSeatRequests.where((r) => r['userId'] != targetUserId).toList();
    state = state.copyWith(pendingSeatRequests: updatedRequests);

    _wsClient.broadcastSeatReject(
      roomId: state.room?.id ?? '',
      userId: targetUserId,
    );
  }

  /// Speaker / Broadcaster -> Upgrade role
  Future<void> _becomeBroadcaster({required int seatIndex}) async {
    state = state.copyWith(role: UserRoomRole.speaker, isMicMuted: false);
    await _rtcRepository.switchRole(isBroadcaster: true);

    final currentUser = UserSessionService().currentUser;
    final uId = currentUser?.uuid ?? (currentUser?.numericId != null ? '${currentUser!.numericId}' : 'usr_local');
    final uName = currentUser?.displayName ?? currentUser?.username ?? 'Speaker';

    final updatedSeats = List<SeatEntity>.from(state.seats);
    if (seatIndex < updatedSeats.length) {
      updatedSeats[seatIndex] = SeatEntity(
        seatIndex: seatIndex,
        userId: uId,
        userName: uName,
        status: SeatStatus.speaking,
        isMuted: false,
      );
      state = state.copyWith(seats: updatedSeats);
    }
  }

  /// Return to Audience role
  Future<void> leaveSeat() async {
    if (state.role != UserRoomRole.speaker) return;

    final currentUser = UserSessionService().currentUser;
    final uId = currentUser?.uuid ?? (currentUser?.numericId != null ? '${currentUser!.numericId}' : '');
    final mySeatIdx = state.seats.indexWhere((s) => s.userId == uId);

    await _becomeAudience();

    if (mySeatIdx != -1) {
      _clearSeat(seatIndex: mySeatIdx, targetUserId: uId);
      _wsClient.broadcastSeatLeave(
        roomId: state.room?.id ?? '',
        userId: uId,
        seatIndex: mySeatIdx,
      );
    }
  }

  /// Downgrade role to Audience
  Future<void> _becomeAudience() async {
    state = state.copyWith(role: UserRoomRole.audience, isMicMuted: true);
    await _rtcRepository.switchRole(isBroadcaster: false);
  }

  /// Host -> Mute / Unmute Speaker
  void hostMuteUser(int seatIndex, bool mute) {
    if (state.role != UserRoomRole.host) return;
    if (seatIndex < 0 || seatIndex >= state.seats.length) return;

    final targetSeat = state.seats[seatIndex];
    if (targetSeat.userId == null) return;

    _updateSeatMuteState(targetSeat.userId!, mute);
    _wsClient.broadcastHostMuteUser(
      roomId: state.room?.id ?? '',
      targetUserId: targetSeat.userId!,
      isMuted: mute,
    );
  }

  /// Host -> Lock / Unlock Seat
  void hostLockSeat(int seatIndex, bool lock) {
    if (state.role != UserRoomRole.host) return;
    if (seatIndex < 0 || seatIndex >= state.seats.length) return;

    _updateSeatLockState(seatIndex, lock);
    _wsClient.broadcastRoomLocked(
      roomId: state.room?.id ?? '',
      seatIndex: seatIndex,
      isLocked: lock,
    );
  }

  /// Host -> Kick Speaker off Seat
  void hostKickUser(int seatIndex) {
    if (state.role != UserRoomRole.host) return;
    if (seatIndex < 0 || seatIndex >= state.seats.length) return;

    final targetSeat = state.seats[seatIndex];
    if (targetSeat.userId == null) return;

    final String uId = targetSeat.userId!;
    _clearSeat(seatIndex: seatIndex, targetUserId: uId);

    _wsClient.broadcastHostKickUser(
      roomId: state.room?.id ?? '',
      targetUserId: uId,
      seatIndex: seatIndex,
    );
  }

  /// Host -> End Voice Room
  Future<void> endRoom() async {
    if (state.role != UserRoomRole.host) return;
    _wsClient.emit('ROOM_ENDED', {'roomId': state.room?.id});
    await leaveRoomSession();
  }

  /// Leave Room & Cleanup RTC
  Future<void> leaveRoomSession() async {
    _wsSubscription?.cancel();
    _wsClient.disconnect();
    await _rtcRepository.leaveRoom();
    state = LiveRoomState();
  }

  void _clearSeat({required int seatIndex, required String targetUserId}) {
    final updatedSeats = List<SeatEntity>.from(state.seats);
    if (seatIndex >= 0 && seatIndex < updatedSeats.length) {
      updatedSeats[seatIndex] = SeatEntity(
        seatIndex: seatIndex,
        status: SeatStatus.empty,
      );
    } else {
      final idx = updatedSeats.indexWhere((s) => s.userId == targetUserId);
      if (idx != -1) {
        updatedSeats[idx] = SeatEntity(
          seatIndex: idx,
          status: SeatStatus.empty,
        );
      }
    }
    state = state.copyWith(seats: updatedSeats);
  }

  void _updateSeatMuteState(String targetUserId, bool isMuted) {
    final updatedSeats = state.seats.map((seat) {
      if (seat.userId == targetUserId) {
        return seat.copyWith(
          isMuted: isMuted,
          status: isMuted ? SeatStatus.muted : SeatStatus.speaking,
        );
      }
      return seat;
    }).toList();
    state = state.copyWith(seats: updatedSeats);
  }

  void _updateSeatLockState(int seatIndex, bool isLocked) {
    final updatedSeats = List<SeatEntity>.from(state.seats);
    if (seatIndex >= 0 && seatIndex < updatedSeats.length) {
      updatedSeats[seatIndex] = updatedSeats[seatIndex].copyWith(
        isLocked: isLocked,
        status: isLocked ? SeatStatus.locked : SeatStatus.empty,
      );
      state = state.copyWith(seats: updatedSeats);
    }
  }

  @override
  void dispose() {
    _wsSubscription?.cancel();
    super.dispose();
  }
}

/// Riverpod StateNotifier Provider
final liveRoomControllerProvider =
    StateNotifierProvider<LiveRoomController, LiveRoomState>((ref) {
  return LiveRoomController();
});
