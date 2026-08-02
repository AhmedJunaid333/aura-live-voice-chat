import 'package:flutter/material.dart';

class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final coinPackages = [
      {'title': '100 Coins', 'price': '\$0.99'},
      {'title': '550 Coins (+50 Bonus)', 'price': '\$4.99'},
      {'title': '1,200 Coins (+200 Bonus)', 'price': '\$9.99'},
      {'title': '6,500 Coins (+1,500 Bonus)', 'price': '\$49.99'},
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F0E17),
        title: const Text('My Wallet', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Balances
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF1F1B2E), Color(0xFF8A2BE2)]),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Column(
                    children: [
                      Text('🪙 50,000', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.amber)),
                      Text('Coins Balance', style: TextStyle(color: Colors.white60, fontSize: 12)),
                    ],
                  ),
                  Column(
                    children: [
                      Text('💎 12,400', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.cyanAccent)),
                      Text('Creator Diamonds', style: TextStyle(color: Colors.white60, fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text('Recharge Coin Packages', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                itemCount: coinPackages.length,
                itemBuilder: (context, index) {
                  final pkg = coinPackages[index];
                  return Card(
                    color: const Color(0xFF1F1B2E),
                    margin: const EdgeInsets.symmetric(vertical: 6),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: ListTile(
                      leading: const Icon(Icons.monetization_on, color: Colors.amber, size: 32),
                      title: Text(pkg['title']!, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      trailing: ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFFF007F)),
                        onPressed: () {},
                        child: Text(pkg['price']!, style: const TextStyle(color: Colors.white)),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
