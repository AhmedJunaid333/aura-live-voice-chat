class RoomEntity {
  final String id;
  final String roomNumber;
  final String title;
  final String hostId;
  final String hostName;
  final String? hostAvatar;
  final String category;
  final String rtcChannelId;
  final int maxSeats;
  final int totalViewers;
  final bool isPrivate;

  RoomEntity({
    required this.id,
    required this.roomNumber,
    required this.title,
    required this.hostId,
    required this.hostName,
    this.hostAvatar,
    required this.category,
    required this.rtcChannelId,
    required this.maxSeats,
    required this.totalViewers,
    this.isPrivate = false,
  });

  RoomEntity copyWith({
    String? id,
    String? roomNumber,
    String? title,
    String? hostId,
    String? hostName,
    String? hostAvatar,
    String? category,
    String? rtcChannelId,
    int? maxSeats,
    int? totalViewers,
    bool? isPrivate,
  }) {
    return RoomEntity(
      id: id ?? this.id,
      roomNumber: roomNumber ?? this.roomNumber,
      title: title ?? this.title,
      hostId: hostId ?? this.hostId,
      hostName: hostName ?? this.hostName,
      hostAvatar: hostAvatar ?? this.hostAvatar,
      category: category ?? this.category,
      rtcChannelId: rtcChannelId ?? this.rtcChannelId,
      maxSeats: maxSeats ?? this.maxSeats,
      totalViewers: totalViewers ?? this.totalViewers,
      isPrivate: isPrivate ?? this.isPrivate,
    );
  }
}
