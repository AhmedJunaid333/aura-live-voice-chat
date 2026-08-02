import '../domain/room_entity.dart';

class LiveApi {
  Future<String> fetchRtcToken(String roomId, String userId, String role) async {
    // Calls Backend API: POST /api/v1/rtc/token
    return "AGORA_RTC_TOKEN_MOCK_$roomId";
  }

  Future<RoomEntity> getRoomDetails(String roomId) async {
    return RoomEntity(
      id: roomId,
      roomNumber: "888999",
      title: "🔥 Aura Live Voice Room",
      hostId: "u-host-101",
      hostName: "Aura Queen",
      category: "Music",
      maxSeats: 9,
      totalViewers: 450,
    );
  }
}
