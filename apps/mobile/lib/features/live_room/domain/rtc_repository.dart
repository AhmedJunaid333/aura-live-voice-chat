abstract class RtcRepository {
  /// Fetch dynamic RTC token from backend
  Future<String?> fetchRtcToken({
    required String channelId,
    required String userId,
    required String role, // 'HOST' | 'SPEAKER' | 'AUDIENCE'
  });

  /// Initialize Agora RTC Engine
  Future<void> initializeEngine();

  /// Join audio room channel
  Future<bool> joinRoom({
    required String channelId,
    required String token,
    required int numericUid,
    required bool isBroadcaster,
  });

  /// Switch role between Broadcaster & Audience
  Future<void> switchRole({required bool isBroadcaster});

  /// Mute / Unmute local microphone
  Future<void> setMicrophoneMuted(bool mute);

  /// Renew token before expiration
  Future<void> renewToken(String newToken);

  /// Leave channel
  Future<void> leaveRoom();
}
