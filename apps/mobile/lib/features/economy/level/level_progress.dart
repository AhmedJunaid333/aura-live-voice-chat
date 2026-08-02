import 'package:flutter/material.dart';

class LevelProgressBarWidget extends StatelessWidget {
  final int currentLevel;
  final int currentXp;
  final int nextLevelXp;

  const LevelProgressBarWidget({
    super.key,
    required this.currentLevel,
    required this.currentXp,
    required this.nextLevelXp,
  });

  @override
  Widget build(BuildContext context) {
    final progress = (currentXp / nextLevelXp).clamp(0.0, 1.0);

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1F1B2E),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Level $currentLevel Host', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              Text('$currentXp / $nextLevelXp XP', style: const TextStyle(color: Colors.white60, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.white10,
            color: const Color(0xFFFF007F),
            minHeight: 8,
            borderRadius: BorderRadius.circular(4),
          ),
        ],
      ),
    );
  }
}
