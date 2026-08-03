import 'dart:async';
import 'package:flutter/foundation.dart';

/// Real-time WebSocket Gateway Client for Live Room Synchronization
class VoiceRoomWebSocketClient {
  static final VoiceRoomWebSocketClient _instance = VoiceRoomWebSocketClient._internal();
  factory VoiceRoomWebSocketClient() => _instance;
  VoiceRoomWebSocketClient._internal();

  StreamController<Map<String, dynamic>>? _eventStreamController;
  bool _isConnected = false;
  String? _currentRoomId;
  String? _currentUserId;

  Stream<Map<String, dynamic>> get eventsStream {
    _eventStreamController ??= StreamController<Map<String, dynamic>>.broadcast();
    return _eventStreamController!.stream;
  }

  bool get isConnected => _isConnected;

  void connect({required String roomId, required String userId}) {
    _currentRoomId = roomId;
    _currentUserId = userId;
    _isConnected = true;
    _eventStreamController ??= StreamController<Map<String, dynamic>>.broadcast();
    debugPrint("🔌 WebSocket Connected to Voice Room: $roomId for user: $userId");

    // Emit initial connection event
    emit('USER_JOINED', {
      'roomId': roomId,
      'userId': userId,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  void emit(String event, Map<String, dynamic> payload) {
    if (_eventStreamController == null || _eventStreamController!.isClosed) {
      _eventStreamController = StreamController<Map<String, dynamic>>.broadcast();
    }

    debugPrint("📡 [WS Broadcast Out] $event -> $payload");
    _eventStreamController!.add({'event': event, 'data': payload});
  }

  void broadcastSeatRequest({required String roomId, required String userId, required String userName}) {
    emit('SEAT_REQUEST', {
      'roomId': roomId,
      'userId': userId,
      'userName': userName,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  void broadcastSeatAccept({required String roomId, required String userId, required int seatIndex}) {
    emit('SEAT_ACCEPT', {
      'roomId': roomId,
      'userId': userId,
      'seatIndex': seatIndex,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  void broadcastSeatReject({required String roomId, required String userId}) {
    emit('SEAT_REJECT', {
      'roomId': roomId,
      'userId': userId,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  void broadcastSeatLeave({required String roomId, required String userId, required int seatIndex}) {
    emit('SEAT_LEAVE', {
      'roomId': roomId,
      'userId': userId,
      'seatIndex': seatIndex,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  void broadcastMicMuted({required String roomId, required String userId, required bool isMuted}) {
    emit(isMuted ? 'MIC_MUTED' : 'MIC_UNMUTED', {
      'roomId': roomId,
      'userId': userId,
      'isMuted': isMuted,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  void broadcastHostMuteUser({required String roomId, required String targetUserId, required bool isMuted}) {
    emit(isMuted ? 'HOST_MUTED_USER' : 'HOST_UNMUTED_USER', {
      'roomId': roomId,
      'targetUserId': targetUserId,
      'isMuted': isMuted,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  void broadcastHostKickUser({required String roomId, required String targetUserId, required int seatIndex}) {
    emit('HOST_KICK_USER', {
      'roomId': roomId,
      'targetUserId': targetUserId,
      'seatIndex': seatIndex,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  void broadcastRoomLocked({required String roomId, required int seatIndex, required bool isLocked}) {
    emit(isLocked ? 'ROOM_LOCKED' : 'ROOM_UNLOCKED', {
      'roomId': roomId,
      'seatIndex': seatIndex,
      'isLocked': isLocked,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  void disconnect() {
    if (_isConnected && _currentRoomId != null && _currentUserId != null) {
      emit('USER_LEFT', {
        'roomId': _currentRoomId,
        'userId': _currentUserId,
        'timestamp': DateTime.now().toIso8601String(),
      });
    }
    _isConnected = false;
    _currentRoomId = null;
    _currentUserId = null;
  }
}
