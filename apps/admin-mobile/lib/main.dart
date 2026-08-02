import 'package:flutter/material.dart';

void main() {
  runApp(const AuraAdminApp());
}

class AuraAdminApp extends StatelessWidget {
  const AuraAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aura Admin Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        primaryColor: const Color(0xFF66FCF1),
        scaffoldBackgroundColor: const Color(0xFF0B0C10),
      ),
      home: const AdminDashboardScreen(),
    );
  }
}

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('🎙️ Aura Admin Mobile', style: TextStyle(color: Color(0xFF66FCF1))),
        backgroundColor: const Color(0xFF1F2833),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Live Platform Telemetry', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
            const SizedBox(height: 16),
            Row(
              children: [
                _buildCard('Active Rooms', '342', Colors.cyanAccent),
                const SizedBox(width: 12),
                _buildCard('Online Viewers', '124.5K', Colors.pinkAccent),
              ],
            ),
            const SizedBox(height: 24),
            const Text('Quick Operations', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
            const SizedBox(height: 12),
            ListTile(
              tileColor: const Color(0xFF1F2833),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              leading: const Icon(Icons.live_tv, color: Color(0xFF66FCF1)),
              title: const Text('Live Room Surveillance', style: TextStyle(color: Colors.white)),
              subtitle: const Text('Monitor or force terminate rooms', style: TextStyle(color: Colors.white54)),
              onTap: () {},
            ),
            const SizedBox(height: 8),
            ListTile(
              tileColor: const Color(0xFF1F2833),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              leading: const Icon(Icons.person_off, color: Colors.redAccent),
              title: const Text('Ban / Unban User', style: TextStyle(color: Colors.white)),
              subtitle: const Text('Global or Room scope ban', style: TextStyle(color: Colors.white54)),
              onTap: () {},
            ),
            const SizedBox(height: 8),
            ListTile(
              tileColor: const Color(0xFF1F2833),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              leading: const Icon(Icons.attach_money, color: Colors.greenAccent),
              title: const Text('Approve Creator Payouts', style: TextStyle(color: Colors.white)),
              subtitle: const Text('18 pending withdrawal requests', style: TextStyle(color: Colors.white54)),
              onTap: () {},
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCard(String title, String val, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1F2833),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Text(title, style: const TextStyle(color: Colors.white60, fontSize: 12)),
            const SizedBox(height: 8),
            Text(val, style: TextStyle(color: color, fontSize: 24, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
