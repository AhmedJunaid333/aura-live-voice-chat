import 'package:flutter/material.dart';

class VipScreen extends StatelessWidget {
  const VipScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F0E17),
        title: const Text('VIP Privilege Center', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: List.generate(7, (i) {
            final tier = i + 1;
            return Card(
              color: const Color(0xFF1F1B2E),
              margin: const EdgeInsets.symmetric(vertical: 8),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(colors: [Color(0xFFFF007F), Color(0xFF8A2BE2)]),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text('VIP $tier', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        ),
                        const Spacer(),
                        Text('${tier * 10000} Coins/mo', style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text('• ${tier * 2}% Gift Discount Privilege', style: const TextStyle(color: Colors.white70)),
                    const Text('• Exclusive VIP Avatar Frame', style: TextStyle(color: Colors.white70)),
                    const Text('• Luxury Room Entrance Effect', style: TextStyle(color: Colors.white70)),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF8A2BE2)),
                        onPressed: () {},
                        child: Text('Activate VIP $tier', style: const TextStyle(color: Colors.white)),
                      ),
                    )
                  ],
                ),
              ),
            );
          }),
        ),
      ),
    );
  }
}
