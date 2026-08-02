enum SeatStatus { empty, requested, approved, speaking, muted }

class SeatEntity {
  final int seatIndex;
  final String? userId;
  final String? userName;
  final SeatStatus status;
  final bool isMuted;

  SeatEntity({
    required this.seatIndex,
    this.userId,
    this.userName,
    required this.status,
    required this.isMuted,
  });
}
