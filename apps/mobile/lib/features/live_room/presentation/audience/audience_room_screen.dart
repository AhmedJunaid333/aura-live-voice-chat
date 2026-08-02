import 'package:flutter/material.dart';
import '../../domain/seat_entity.dart';
import '../widgets/seat_grid.dart';
import '../widgets/chat_panel.dart';

class AudienceRoomScreen extends StatefulWidget {
  final String roomId;
  const AudienceRoomScreen({super.key, required this.roomId});

  @override
  State<AudienceRoomScreen> createState() => _AudienceRoomScreenState();
}

class _AudienceRoomScreenState extends State<AudienceRoomScreen> {
  final List<SeatEntity> _seats = List.generate(
    9,
    (i) => SeatEntity(
      seatIndex: i,
      userId: i == 0 ? 'u-host' : null,
      userName: i == 0 ? 'Aura Host' : null,
      status: i == 0 ? SeatStatus.speaking : SeatStatus.empty,
      isMuted: false,
    ),
  );

  final List<String> _chat = [
    'System: Joined room as audience listener.',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0E17),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text('Audience Mode - Room #${widget.roomId}', style: const TextStyle(fontSize: 16, color: Colors.white)),
        actions: [
          IconButton(
            icon: const Icon(Icons.close, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            flex: 5,
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: SeatGridWidget(
                seats: _seats,
                onSeatTap: (index) {
                  _requestMicSeat(index);
                },
              ),
            ),
          ),
          Expanded(
            flex: 4,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ChatPanelWidget(messages: _chat),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: const Color(0xFF1F1B2E),
            child: Row(
              children: [
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF8A2BE2)),
                  onPressed: () => _requestMicSeat(1),
                  icon: const Icon(Icons.mic, color: Colors.white, size: 18),
                  label: const Text('Request Mic', style: TextStyle(color: Colors.white)),
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.card_giftcard, color: Color(0xFFFF007F), size: 28),
                  onPressed: () {},
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _requestMicSeat(int index) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Seat $index requested! Sent to host for approval.')),
    );
  }
}
