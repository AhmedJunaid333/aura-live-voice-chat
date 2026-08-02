import 'dart:async';

class VoiceRoomWebSocketClient {
  final _eventStreamController = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get eventsStream => _eventStreamController.stream;

  void connect(String roomId, String userId) {
    print("🔌 WebSocket Connected to room: $roomId for user: $userId");
  }

  void emit(String event, Map<String, dynamic> data) {
    _eventStreamController.add({'event': event, 'data': data});
  }

  void disconnect() {
    _eventStreamController.close();
  }
}
