import 'package:flutter/material.dart';
import 'colors.dart';

/// Auralive Design System — Luxury Gradients
abstract final class AuraGradients {
  // ─── Primary Brand ───────────────────────────────────────────
  static const LinearGradient primary = LinearGradient(
    colors: [Color(0xFF6C5CE7), Color(0xFF8B5CF6), Color(0xFFA855F7)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient primaryVertical = LinearGradient(
    colors: [Color(0xFF6C5CE7), Color(0xFFA855F7)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  // ─── Gold / Luxury ───────────────────────────────────────────
  static const LinearGradient gold = LinearGradient(
    colors: [Color(0xFFB8941E), Color(0xFFD4AF37), Color(0xFFFFD700), Color(0xFFE8C967)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient goldHorizontal = LinearGradient(
    colors: [Color(0xFFD4AF37), Color(0xFFFFD700)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  // ─── Neon / Electric ─────────────────────────────────────────
  static const LinearGradient neon = LinearGradient(
    colors: [Color(0xFF00D2FF), Color(0xFF6C5CE7), Color(0xFFF43F5E)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient neonCyan = LinearGradient(
    colors: [Color(0xFF06B6D4), Color(0xFF00D2FF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient neonRose = LinearGradient(
    colors: [Color(0xFFF43F5E), Color(0xFFEC4899)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ─── Glass / Surface ─────────────────────────────────────────
  static const LinearGradient glass = LinearGradient(
    colors: [Color(0x1AFFFFFF), Color(0x0DFFFFFF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient glassDark = LinearGradient(
    colors: [Color(0x33161623), Color(0x1A0A0A0F)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient surface = LinearGradient(
    colors: [Color(0xFF12121A), Color(0xFF0A0A0F)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient surfaceElevated = LinearGradient(
    colors: [Color(0xFF1A1A2E), Color(0xFF12121A)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  // ─── VIP / Premium ───────────────────────────────────────────
  static const LinearGradient vip = LinearGradient(
    colors: [Color(0xFFB8941E), Color(0xFFD4AF37), Color(0xFFFFD700)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient diamond = LinearGradient(
    colors: [Color(0xFF06B6D4), Color(0xFF3B82F6), Color(0xFF8B5CF6)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ─── Rank Gradients ──────────────────────────────────────────
  static const LinearGradient rankBronze = LinearGradient(
    colors: [Color(0xFFCD7F32), Color(0xFFE8A85C)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient rankSilver = LinearGradient(
    colors: [Color(0xFF9E9E9E), Color(0xFFE0E0E0)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient rankGold = LinearGradient(
    colors: [Color(0xFFD4AF37), Color(0xFFFFD700)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient rankPlatinum = LinearGradient(
    colors: [Color(0xFFB0B0B0), Color(0xFFE5E4E2), Color(0xFFB0B0B0)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient rankDiamond = LinearGradient(
    colors: [Color(0xFF89CFF0), Color(0xFFB9F2FF), Color(0xFF89CFF0)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ─── Background Overlays ─────────────────────────────────────
  static const LinearGradient fadeToBlack = LinearGradient(
    colors: [Colors.transparent, Color(0xFF0A0A0F)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient fadeFromBlack = LinearGradient(
    colors: [Color(0xFF0A0A0F), Colors.transparent],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  // ─── Live / Status ───────────────────────────────────────────
  static const LinearGradient live = LinearGradient(
    colors: [Color(0xFFEF4444), Color(0xFFF97316)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  static const LinearGradient success = LinearGradient(
    colors: [Color(0xFF10B981), Color(0xFF34D399)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  // ─── Radial ──────────────────────────────────────────────────
  static const RadialGradient spotlightViolet = RadialGradient(
    colors: [Color(0x336C5CE7), Colors.transparent],
    radius: 0.8,
  );

  static const RadialGradient spotlightCyan = RadialGradient(
    colors: [Color(0x3300D2FF), Colors.transparent],
    radius: 0.8,
  );

  static const RadialGradient spotlightGold = RadialGradient(
    colors: [Color(0x33FFD700), Colors.transparent],
    radius: 0.8,
  );
}
