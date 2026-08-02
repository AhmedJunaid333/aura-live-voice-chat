import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'colors.dart';

/// Auralive Design System — Typography
/// Poppins for headings, Inter for body text.
abstract final class AuraTypography {
  // ─── Headings (Poppins) ───────────────────────────────────────
  static TextStyle displayLarge = GoogleFonts.poppins(
    fontSize: 40,
    fontWeight: FontWeight.w700,
    color: AuraColors.textPrimary,
    letterSpacing: -1.0,
    height: 1.2,
  );

  static TextStyle displayMedium = GoogleFonts.poppins(
    fontSize: 32,
    fontWeight: FontWeight.w700,
    color: AuraColors.textPrimary,
    letterSpacing: -0.5,
    height: 1.25,
  );

  static TextStyle displaySmall = GoogleFonts.poppins(
    fontSize: 28,
    fontWeight: FontWeight.w600,
    color: AuraColors.textPrimary,
    letterSpacing: -0.25,
    height: 1.3,
  );

  static TextStyle headlineLarge = GoogleFonts.poppins(
    fontSize: 24,
    fontWeight: FontWeight.w600,
    color: AuraColors.textPrimary,
    height: 1.3,
  );

  static TextStyle headlineMedium = GoogleFonts.poppins(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: AuraColors.textPrimary,
    height: 1.35,
  );

  static TextStyle headlineSmall = GoogleFonts.poppins(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: AuraColors.textPrimary,
    height: 1.4,
  );

  // ─── Titles (Poppins) ────────────────────────────────────────
  static TextStyle titleLarge = GoogleFonts.poppins(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: AuraColors.textPrimary,
    height: 1.4,
  );

  static TextStyle titleMedium = GoogleFonts.poppins(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: AuraColors.textPrimary,
    height: 1.4,
  );

  static TextStyle titleSmall = GoogleFonts.poppins(
    fontSize: 13,
    fontWeight: FontWeight.w500,
    color: AuraColors.textPrimary,
    height: 1.4,
  );

  // ─── Body (Inter) ────────────────────────────────────────────
  static TextStyle bodyLarge = GoogleFonts.inter(
    fontSize: 16,
    fontWeight: FontWeight.w400,
    color: AuraColors.textPrimary,
    height: 1.5,
  );

  static TextStyle bodyMedium = GoogleFonts.inter(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: AuraColors.textSecondary,
    height: 1.5,
  );

  static TextStyle bodySmall = GoogleFonts.inter(
    fontSize: 12,
    fontWeight: FontWeight.w400,
    color: AuraColors.textSecondary,
    height: 1.5,
  );

  // ─── Labels (Inter) ──────────────────────────────────────────
  static TextStyle labelLarge = GoogleFonts.inter(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: AuraColors.textPrimary,
    height: 1.4,
    letterSpacing: 0.1,
  );

  static TextStyle labelMedium = GoogleFonts.inter(
    fontSize: 12,
    fontWeight: FontWeight.w600,
    color: AuraColors.textSecondary,
    height: 1.4,
    letterSpacing: 0.2,
  );

  static TextStyle labelSmall = GoogleFonts.inter(
    fontSize: 10,
    fontWeight: FontWeight.w600,
    color: AuraColors.textTertiary,
    height: 1.4,
    letterSpacing: 0.3,
  );

  // ─── Caption & Overline ──────────────────────────────────────
  static TextStyle caption = GoogleFonts.inter(
    fontSize: 11,
    fontWeight: FontWeight.w400,
    color: AuraColors.textTertiary,
    height: 1.4,
  );

  static TextStyle overline = GoogleFonts.inter(
    fontSize: 10,
    fontWeight: FontWeight.w700,
    color: AuraColors.textTertiary,
    letterSpacing: 1.5,
    height: 1.4,
  );

  // ─── Special ─────────────────────────────────────────────────
  static TextStyle buttonText = GoogleFonts.poppins(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: AuraColors.textOnPrimary,
    letterSpacing: 0.5,
    height: 1.4,
  );

  static TextStyle badge = GoogleFonts.poppins(
    fontSize: 9,
    fontWeight: FontWeight.w700,
    color: AuraColors.textOnPrimary,
    height: 1.2,
  );

  static TextStyle coinAmount = GoogleFonts.poppins(
    fontSize: 16,
    fontWeight: FontWeight.w700,
    color: AuraColors.accent,
    height: 1.2,
  );

  // ─── Material 3 TextTheme ────────────────────────────────────
  static TextTheme get textTheme => TextTheme(
        displayLarge: displayLarge,
        displayMedium: displayMedium,
        displaySmall: displaySmall,
        headlineLarge: headlineLarge,
        headlineMedium: headlineMedium,
        headlineSmall: headlineSmall,
        titleLarge: titleLarge,
        titleMedium: titleMedium,
        titleSmall: titleSmall,
        bodyLarge: bodyLarge,
        bodyMedium: bodyMedium,
        bodySmall: bodySmall,
        labelLarge: labelLarge,
        labelMedium: labelMedium,
        labelSmall: labelSmall,
      );
}
