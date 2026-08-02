import 'package:flutter/material.dart';

/// Auralive Design System — Spacing (4px grid)
abstract final class AuraSpacing {
  // ─── Raw Values ──────────────────────────────────────────────
  static const double xxs = 2;
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 20;
  static const double xxl = 24;
  static const double xxxl = 32;
  static const double huge = 48;
  static const double massive = 64;

  // ─── SizedBox Vertical Gaps ──────────────────────────────────
  static const SizedBox vXxs = SizedBox(height: xxs);
  static const SizedBox vXs = SizedBox(height: xs);
  static const SizedBox vSm = SizedBox(height: sm);
  static const SizedBox vMd = SizedBox(height: md);
  static const SizedBox vLg = SizedBox(height: lg);
  static const SizedBox vXl = SizedBox(height: xl);
  static const SizedBox vXxl = SizedBox(height: xxl);
  static const SizedBox vXxxl = SizedBox(height: xxxl);
  static const SizedBox vHuge = SizedBox(height: huge);
  static const SizedBox vMassive = SizedBox(height: massive);

  // ─── SizedBox Horizontal Gaps ────────────────────────────────
  static const SizedBox hXxs = SizedBox(width: xxs);
  static const SizedBox hXs = SizedBox(width: xs);
  static const SizedBox hSm = SizedBox(width: sm);
  static const SizedBox hMd = SizedBox(width: md);
  static const SizedBox hLg = SizedBox(width: lg);
  static const SizedBox hXl = SizedBox(width: xl);
  static const SizedBox hXxl = SizedBox(width: xxl);
  static const SizedBox hXxxl = SizedBox(width: xxxl);

  // ─── EdgeInsets All ──────────────────────────────────────────
  static const EdgeInsets allXs = EdgeInsets.all(xs);
  static const EdgeInsets allSm = EdgeInsets.all(sm);
  static const EdgeInsets allMd = EdgeInsets.all(md);
  static const EdgeInsets allLg = EdgeInsets.all(lg);
  static const EdgeInsets allXl = EdgeInsets.all(xl);
  static const EdgeInsets allXxl = EdgeInsets.all(xxl);

  // ─── EdgeInsets Horizontal ───────────────────────────────────
  static const EdgeInsets hPadSm = EdgeInsets.symmetric(horizontal: sm);
  static const EdgeInsets hPadMd = EdgeInsets.symmetric(horizontal: md);
  static const EdgeInsets hPadLg = EdgeInsets.symmetric(horizontal: lg);
  static const EdgeInsets hPadXl = EdgeInsets.symmetric(horizontal: xl);
  static const EdgeInsets hPadXxl = EdgeInsets.symmetric(horizontal: xxl);

  // ─── EdgeInsets Vertical ─────────────────────────────────────
  static const EdgeInsets vPadSm = EdgeInsets.symmetric(vertical: sm);
  static const EdgeInsets vPadMd = EdgeInsets.symmetric(vertical: md);
  static const EdgeInsets vPadLg = EdgeInsets.symmetric(vertical: lg);
  static const EdgeInsets vPadXl = EdgeInsets.symmetric(vertical: xl);

  // ─── Screen Padding ──────────────────────────────────────────
  static const EdgeInsets screenPadding = EdgeInsets.symmetric(horizontal: lg, vertical: md);
  static const EdgeInsets screenHorizontal = EdgeInsets.symmetric(horizontal: lg);
  static const EdgeInsets cardPadding = EdgeInsets.all(lg);
  static const EdgeInsets listItemPadding = EdgeInsets.symmetric(horizontal: lg, vertical: md);
}
