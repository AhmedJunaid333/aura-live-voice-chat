class RoomEntity {
  final String id;
  final String roomNumber;
  final String title;
  final String hostId;
  final String hostName;
  final String category;
  final int maxSeats;
  final int totalViewers;

  RoomEntity({
    required this.id,
    required this.roomNumber,
    required this.title,
    required this.hostId,
    required this.hostName,
    required this.category,
    required this.maxSeats,
    required this.totalViewers,
  });
}
