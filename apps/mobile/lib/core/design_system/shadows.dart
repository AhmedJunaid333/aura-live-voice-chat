import 'package:flutter/material.dart';
import 'colors.dart';

/// Auralive Design System — Shadows & Neon Glow Effects
abstract final class AuraShadows {
  // ─── Standard Elevation ──────────────────────────────────────
  static const List<BoxShadow> none = [];

  static const List<BoxShadow> soft = [
    BoxShadow(
      color: Color(0x1A000000),
      blurRadius: 8,
      offset: Offset(0, 2),
    ),
  ];

  static const List<BoxShadow> medium = [
    BoxShadow(
      color: Color(0x33000000),
      blurRadius: 16,
      offset: Offset(0, 4),
    ),
  ];

  static const List<BoxShadow> strong = [
    BoxShadow(
      color: Color(0x4D000000),
      blurRadius: 24,
      offset: Offset(0, 8),
    ),
  ];

  static const List<BoxShadow> elevated = [
    BoxShadow(
      color: Color(0x66000000),
      blurRadius: 32,
      offset: Offset(0, 12),
    ),
    BoxShadow(
      color: Color(0x1A000000),
      blurRadius: 8,
      offset: Offset(0, 2),
    ),
  ];

  // ─── Glass Shadow ────────────────────────────────────────────
  static const List<BoxShadow> glass = [
    BoxShadow(
      color: Color(0x0DFFFFFF),
      blurRadius: 20,
      offset: Offset(0, -1),
    ),
    BoxShadow(
      color: Color(0x33000000),
      blurRadius: 24,
      offset: Offset(0, 8),
    ),
  ];

  // ─── Neon Glow Shadows ───────────────────────────────────────
  static List<BoxShadow> neonViolet = [
    BoxShadow(
      color: AuraColors.neonViolet.withValues(alpha: 0.4),
      blurRadius: 20,
      spreadRadius: 1,
    ),
    BoxShadow(
      color: AuraColors.neonViolet.withValues(alpha: 0.15),
      blurRadius: 40,
      spreadRadius: 4,
    ),
  ];

  static List<BoxShadow> neonCyan = [
    BoxShadow(
      color: AuraColors.neonCyan.withValues(alpha: 0.4),
      blurRadius: 20,
      spreadRadius: 1,
    ),
    BoxShadow(
      color: AuraColors.neonCyan.withValues(alpha: 0.15),
      blurRadius: 40,
      spreadRadius: 4,
    ),
  ];

  static List<BoxShadow> neonGold = [
    BoxShadow(
      color: AuraColors.neonGold.withValues(alpha: 0.4),
      blurRadius: 20,
      spreadRadius: 1,
    ),
    BoxShadow(
      color: AuraColors.neonGold.withValues(alpha: 0.15),
      blurRadius: 40,
      spreadRadius: 4,
    ),
  ];

  static List<BoxShadow> neonRose = [
    BoxShadow(
      color: AuraColors.neonRose.withValues(alpha: 0.4),
      blurRadius: 20,
      spreadRadius: 1,
    ),
    BoxShadow(
      color: AuraColors.neonRose.withValues(alpha: 0.15),
      blurRadius: 40,
      spreadRadius: 4,
    ),
  ];

  // ─── Subtle Inner Glow ───────────────────────────────────────
  static List<BoxShadow> innerGlowViolet = [
    BoxShadow(
      color: AuraColors.neonViolet.withValues(alpha: 0.12),
      blurRadius: 12,
      spreadRadius: -2,
    ),
  ];

  static List<BoxShadow> innerGlowGold = [
    BoxShadow(
      color: AuraColors.neonGold.withValues(alpha: 0.12),
      blurRadius: 12,
      spreadRadius: -2,
    ),
  ];

  // ─── Card Shadows ────────────────────────────────────────────
  static const List<BoxShadow> card = [
    BoxShadow(
      color: Color(0x26000000),
      blurRadius: 12,
      offset: Offset(0, 4),
    ),
  ];

  static List<BoxShadow> cardPrimary = [
    BoxShadow(
      color: AuraColors.primary.withValues(alpha: 0.2),
      blurRadius: 16,
      offset: const Offset(0, 4),
    ),
  ];
}
