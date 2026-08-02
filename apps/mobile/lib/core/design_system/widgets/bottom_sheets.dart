import 'dart:ui';
import 'package:flutter/material.dart';
import '../colors.dart';
import '../spacing.dart';
import '../radius.dart';
import '../shadows.dart';

class AuraBottomSheet extends StatelessWidget {
  final Widget child;
  final String? title;

  const AuraBottomSheet({
    super.key,
    required this.child,
    this.title,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          decoration: const BoxDecoration(
            color: AuraColors.glassBg,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            border: Border(top: BorderSide(color: AuraColors.glassBorder)),
            boxShadow: AuraShadows.glass,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              AuraSpacing.vSm,
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AuraColors.textDisabled,
                    borderRadius: AuraRadius.brPill,
                  ),
                ),
              ),
              if (title != null) ...[
                AuraSpacing.vMd,
                Text(
                  title!,
                  style: const TextStyle(
                    color: AuraColors.textPrimary,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
              AuraSpacing.vMd,
              Flexible(child: child),
            ],
          ),
        ),
      ),
    );
  }
}

Future<T?> showAuraBottomSheet<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  bool isScrollControlled = true,
}) {
  return showModalBottomSheet<T>(
    context: context,
    backgroundColor: Colors.transparent,
    isScrollControlled: isScrollControlled,
    builder: builder,
  );
}
