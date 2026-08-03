enum SeatStatus { empty, requested, approved, speaking, muted, locked }

class SeatEntity {
  final int seatIndex;
  final String? userId;
  final String? userName;
  final String? userAvatar;
  final int level;
  final int vipTier;
  final bool isHost;
  final SeatStatus status;
  final bool isMuted;
  final bool isLocked;
  final bool isSpeaking;
  final int volume;

  SeatEntity({
    required this.seatIndex,
    this.userId,
    this.userName,
    this.userAvatar,
    this.level = 1,
    this.vipTier = 0,
    this.isHost = false,
    required this.status,
    this.isMuted = false,
    this.isLocked = false,
    this.isSpeaking = false,
    this.volume = 0,
  });

  SeatEntity copyWith({
    int? seatIndex,
    String? userId,
    String? userName,
    String? userAvatar,
    int? level,
    int? vipTier,
    bool? isHost,
    SeatStatus? status,
    bool? isMuted,
    bool? isLocked,
    bool? isSpeaking,
    int? volume,
  }) {
    return SeatEntity(
      seatIndex: seatIndex ?? this.seatIndex,
      userId: userId ?? this.userId,
      userName: userName ?? this.userName,
      userAvatar: userAvatar ?? this.userAvatar,
      level: level ?? this.level,
      vipTier: vipTier ?? this.vipTier,
      isHost: isHost ?? this.isHost,
      status: status ?? this.status,
      isMuted: isMuted ?? this.isMuted,
      isLocked: isLocked ?? this.isLocked,
      isSpeaking: isSpeaking ?? this.isSpeaking,
      volume: volume ?? this.volume,
    );
  }
}
