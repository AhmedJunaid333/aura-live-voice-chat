import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'colors.dart';
import 'typography.dart';
import 'radius.dart';

/// Auralive Design System — Material 3 Theme
/// Dark-first luxury theme with custom ThemeExtension.
abstract final class AuraTheme {
  static ThemeData dark() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: AuraColors.primary,
      scaffoldBackgroundColor: AuraColors.background,

      // ─── Color Scheme ──────────────────────────────────────
      colorScheme: const ColorScheme.dark(
        primary: AuraColors.primary,
        onPrimary: AuraColors.textOnPrimary,
        secondary: AuraColors.secondary,
        onSecondary: AuraColors.textOnPrimary,
        tertiary: AuraColors.accent,
        onTertiary: AuraColors.textOnAccent,
        error: AuraColors.error,
        onError: AuraColors.textOnPrimary,
        surface: AuraColors.surface,
        onSurface: AuraColors.textPrimary,
        surfaceContainerHighest: AuraColors.surfaceElevated,
      ),

      // ─── Typography ────────────────────────────────────────
      textTheme: AuraTypography.textTheme,

      // ─── App Bar ───────────────────────────────────────────
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        systemOverlayStyle: SystemUiOverlayStyle.light,
        titleTextStyle: AuraTypography.headlineSmall,
        iconTheme: const IconThemeData(color: AuraColors.textPrimary, size: 22),
      ),

      // ─── Card ──────────────────────────────────────────────
      cardTheme: CardThemeData(
        color: AuraColors.surfaceLight,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: AuraRadius.brLg,
          side: const BorderSide(color: AuraColors.border, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),

      // ─── Bottom Sheet ──────────────────────────────────────
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: AuraColors.surface,
        shape: RoundedRectangleBorder(borderRadius: AuraRadius.topXxl),
        elevation: 0,
        dragHandleColor: AuraColors.white20,
        dragHandleSize: const Size(40, 4),
        showDragHandle: true,
      ),

      // ─── Dialog ────────────────────────────────────────────
      dialogTheme: DialogThemeData(
        backgroundColor: AuraColors.surfaceLight,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: AuraRadius.brXl),
        titleTextStyle: AuraTypography.headlineSmall,
        contentTextStyle: AuraTypography.bodyMedium,
      ),

      // ─── Elevated Button ───────────────────────────────────
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AuraColors.primary,
          foregroundColor: AuraColors.textOnPrimary,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
          textStyle: AuraTypography.buttonText,
        ),
      ),

      // ─── Outlined Button ───────────────────────────────────
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AuraColors.primary,
          side: const BorderSide(color: AuraColors.borderPrimary, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
          textStyle: AuraTypography.buttonText.copyWith(color: AuraColors.primary),
        ),
      ),

      // ─── Text Button ───────────────────────────────────────
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AuraColors.primary,
          textStyle: AuraTypography.labelLarge,
        ),
      ),

      // ─── Input Decoration ──────────────────────────────────
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AuraColors.surfaceLight,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: AuraRadius.brMd,
          borderSide: const BorderSide(color: AuraColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: AuraRadius.brMd,
          borderSide: const BorderSide(color: AuraColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: AuraRadius.brMd,
          borderSide: const BorderSide(color: AuraColors.primary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: AuraRadius.brMd,
          borderSide: const BorderSide(color: AuraColors.error),
        ),
        hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textTertiary),
        labelStyle: AuraTypography.labelMedium,
      ),

      // ─── Chip ──────────────────────────────────────────────
      chipTheme: ChipThemeData(
        backgroundColor: AuraColors.surfaceLight,
        selectedColor: AuraColors.primaryMuted,
        labelStyle: AuraTypography.labelMedium,
        side: const BorderSide(color: AuraColors.border),
        shape: RoundedRectangleBorder(borderRadius: AuraRadius.brPill),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      ),

      // ─── Tab Bar ───────────────────────────────────────────
      tabBarTheme: TabBarThemeData(
        labelColor: AuraColors.textPrimary,
        unselectedLabelColor: AuraColors.textTertiary,
        labelStyle: AuraTypography.labelLarge,
        unselectedLabelStyle: AuraTypography.labelMedium,
        indicator: UnderlineTabIndicator(
          borderSide: const BorderSide(color: AuraColors.primary, width: 2.5),
          borderRadius: AuraRadius.brPill,
        ),
        dividerColor: Colors.transparent,
      ),

      // ─── Divider ───────────────────────────────────────────
      dividerTheme: const DividerThemeData(
        color: AuraColors.border,
        thickness: 1,
        space: 1,
      ),

      // ─── Icon ──────────────────────────────────────────────
      iconTheme: const IconThemeData(
        color: AuraColors.textSecondary,
        size: 22,
      ),

      // ─── List Tile ─────────────────────────────────────────
      listTileTheme: ListTileThemeData(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
        tileColor: Colors.transparent,
        textColor: AuraColors.textPrimary,
        iconColor: AuraColors.textSecondary,
      ),

      // ─── Switch ────────────────────────────────────────────
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return AuraColors.primary;
          return AuraColors.textTertiary;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return AuraColors.primaryMuted;
          return AuraColors.surfaceLight;
        }),
      ),

      // ─── Snackbar ──────────────────────────────────────────
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AuraColors.surfaceElevated,
        contentTextStyle: AuraTypography.bodyMedium,
        shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
        behavior: SnackBarBehavior.floating,
      ),

      // ─── Page Transitions ──────────────────────────────────
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: {
          TargetPlatform.android: CupertinoPageTransitionsBuilder(),
          TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
        },
      ),
    );
  }
}
