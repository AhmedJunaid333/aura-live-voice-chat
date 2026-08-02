import 'package:flutter/material.dart';
import '../../domain/seat_entity.dart';
import '../widgets/seat_grid.dart';
import '../widgets/chat_panel.dart';

class HostRoomScreen extends StatefulWidget {
  final String roomId;
  const HostRoomScreen({super.key, required this.roomId});

  @override
  State<HostRoomScreen> createState() => _HostRoomScreenState();
}

class _HostRoomScreenState extends State<HostRoomScreen> {
  final List<SeatEntity> _seats = List.generate(
    9,
    (i) => SeatEntity(
      seatIndex: i,
      userId: i == 0 ? 'u-host' : null,
      userName: i == 0 ? 'Host (Me)' : null,
      status: i == 0 ? SeatStatus.speaking : SeatStatus.empty,
      isMuted: false,
    ),
  );

  final List<String> _chat = [
    'System: Room started as Host. Mic active.',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0E17),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text('Host Dashboard - Room #${widget.roomId}', style: const TextStyle(fontSize: 16, color: Colors.white)),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFFF007F)),
            onPressed: () => Navigator.pop(context),
            child: const Text('End Room', style: TextStyle(color: Colors.white, fontSize: 12)),
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
                  _showHostSeatControls(index);
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
        ],
      ),
    );
  }

  void _showHostSeatControls(int index) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1F1B2E),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16),
          height: 200,
          child: Column(
            children: [
              Text('Seat ${index + 1} Controls', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              const Divider(color: Colors.white24),
              ListTile(
                leading: const Icon(Icons.mic_off, color: Color(0xFFFF007F)),
                title: const Text('Mute/Unmute Speaker', style: TextStyle(color: Colors.white)),
                onTap: () => Navigator.pop(context),
              ),
              ListTile(
                leading: const Icon(Icons.remove_circle, color: Colors.redAccent),
                title: const Text('Remove Speaker from Seat', style: TextStyle(color: Colors.white)),
                onTap: () => Navigator.pop(context),
              ),
            ],
          ),
        );
      },
    );
  }
}
