import 'package:flutter/material.dart';

/// Auralive Design System — Color Palette
/// Dark-first luxury design with neon glow accents.
/// Usage: AuraColors.primary, AuraColors.surface, etc.
abstract final class AuraColors {
  // ─── Brand Primary ───────────────────────────────────────────
  static const Color primary = Color(0xFF6C5CE7);
  static const Color primaryLight = Color(0xFF8B7CF6);
  static const Color primaryDark = Color(0xFF5A4BD1);
  static const Color primaryMuted = Color(0x336C5CE7);

  // ─── Brand Secondary ─────────────────────────────────────────
  static const Color secondary = Color(0xFF00D2FF);
  static const Color secondaryLight = Color(0xFF66E3FF);
  static const Color secondaryDark = Color(0xFF00A8CC);
  static const Color secondaryMuted = Color(0x3300D2FF);

  // ─── Accent / Gold ───────────────────────────────────────────
  static const Color accent = Color(0xFFFFD700);
  static const Color accentLight = Color(0xFFFFE44D);
  static const Color accentDark = Color(0xFFC9A800);
  static const Color accentMuted = Color(0x33FFD700);
  static const Color gold = Color(0xFFD4AF37);
  static const Color goldLight = Color(0xFFE8C967);
  static const Color goldDark = Color(0xFFB8941E);

  // ─── Surfaces (Dark) ─────────────────────────────────────────
  static const Color background = Color(0xFF0A0A0F);
  static const Color surface = Color(0xFF12121A);
  static const Color surfaceLight = Color(0xFF1A1A2E);
  static const Color surfaceElevated = Color(0xFF22223A);
  static const Color surfaceCard = Color(0xFF16162380);
  static const Color surfaceBright = Color(0xFF2A2A45);

  // ─── Glass / Frost ────────────────────────────────────────────
  static const Color glassBg = Color(0x1AFFFFFF);
  static const Color glassBorder = Color(0x1AFFFFFF);
  static const Color glassOverlay = Color(0x0DFFFFFF);
  static const Color glassDark = Color(0x33000000);

  // ─── Text ─────────────────────────────────────────────────────
  static const Color textPrimary = Color(0xFFF0F0F5);
  static const Color textSecondary = Color(0xFFB0B0C8);
  static const Color textTertiary = Color(0xFF7878A0);
  static const Color textDisabled = Color(0xFF50506A);
  static const Color textOnPrimary = Color(0xFFFFFFFF);
  static const Color textOnAccent = Color(0xFF1A1A2E);

  // ─── Borders ──────────────────────────────────────────────────
  static const Color border = Color(0x1AFFFFFF);
  static const Color borderLight = Color(0x0DFFFFFF);
  static const Color borderStrong = Color(0x33FFFFFF);
  static const Color borderPrimary = Color(0x4D6C5CE7);

  // ─── Semantic ─────────────────────────────────────────────────
  static const Color success = Color(0xFF10B981);
  static const Color successLight = Color(0xFF34D399);
  static const Color successBg = Color(0x1A10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color errorLight = Color(0xFFF87171);
  static const Color errorBg = Color(0x1AEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningLight = Color(0xFFFBBF24);
  static const Color warningBg = Color(0x1AF59E0B);
  static const Color info = Color(0xFF3B82F6);
  static const Color infoBg = Color(0x1A3B82F6);

  // ─── Neon Glow ────────────────────────────────────────────────
  static const Color neonViolet = Color(0xFF8B5CF6);
  static const Color neonCyan = Color(0xFF06B6D4);
  static const Color neonGold = Color(0xFFFFD700);
  static const Color neonRose = Color(0xFFF43F5E);
  static const Color neonGreen = Color(0xFF22C55E);

  // ─── Social / Status ──────────────────────────────────────────
  static const Color online = Color(0xFF22C55E);
  static const Color offline = Color(0xFF6B7280);
  static const Color busy = Color(0xFFEF4444);
  static const Color away = Color(0xFFF59E0B);
  static const Color live = Color(0xFFEF4444);
  static const Color vip = Color(0xFFFFD700);

  // ─── Ranks ────────────────────────────────────────────────────
  static const Color rankBronze = Color(0xFFCD7F32);
  static const Color rankSilver = Color(0xFFC0C0C0);
  static const Color rankGold = Color(0xFFFFD700);
  static const Color rankPlatinum = Color(0xFFE5E4E2);
  static const Color rankDiamond = Color(0xFFB9F2FF);

  // ─── Transparent helpers ──────────────────────────────────────
  static const Color transparent = Colors.transparent;
  static const Color white = Colors.white;
  static const Color black = Colors.black;
  static const Color white10 = Color(0x1AFFFFFF);
  static const Color white20 = Color(0x33FFFFFF);
  static const Color white40 = Color(0x66FFFFFF);
  static const Color white60 = Color(0x99FFFFFF);
  static const Color black20 = Color(0x33000000);
  static const Color black40 = Color(0x66000000);
  static const Color black60 = Color(0x99000000);
}
