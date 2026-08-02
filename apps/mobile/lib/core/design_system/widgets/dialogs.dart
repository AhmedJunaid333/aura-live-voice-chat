import 'dart:ui';
import 'package:flutter/material.dart';
import '../colors.dart';
import '../typography.dart';
import '../spacing.dart';
import '../radius.dart';
import '../shadows.dart';
import '../gradients.dart';
import 'buttons.dart';

class AuraDialog extends StatelessWidget {
  final String title;
  final Widget content;
  final List<Widget> actions;

  const AuraDialog({
    super.key,
    required this.title,
    required this.content,
    required this.actions,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      insetPadding: AuraSpacing.allLg,
      child: ClipRRect(
        borderRadius: AuraRadius.brXl,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            decoration: BoxDecoration(
              color: AuraColors.glassBg,
              borderRadius: AuraRadius.brXl,
              border: Border.all(color: AuraColors.glassBorder),
              boxShadow: AuraShadows.glass,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: AuraSpacing.allLg,
                  decoration: BoxDecoration(
                    gradient: AuraGradients.surface,
                    border: const Border(
                      bottom: BorderSide(color: AuraColors.glassBorder),
                    ),
                  ),
                  child: Center(
                    child: Text(
                      title,
                      style: AuraTypography.titleLarge,
                    ),
                  ),
                ),
                Padding(
                  padding: AuraSpacing.allLg,
                  child: content,
                ),
                Padding(
                  padding: EdgeInsets.fromLTRB(AuraSpacing.lg, 0, AuraSpacing.lg, AuraSpacing.lg),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: actions,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class AuraConfirmDialog extends StatelessWidget {
  final String title;
  final String message;
  final VoidCallback onConfirm;
  final VoidCallback onCancel;
  final String confirmText;
  final String cancelText;

  const AuraConfirmDialog({
    super.key,
    required this.title,
    required this.message,
    required this.onConfirm,
    required this.onCancel,
    this.confirmText = 'Confirm',
    this.cancelText = 'Cancel',
  });

  @override
  Widget build(BuildContext context) {
    return AuraDialog(
      title: title,
      content: Text(
        message,
        style: AuraTypography.bodyLarge.copyWith(color: AuraColors.textSecondary),
        textAlign: TextAlign.center,
      ),
      actions: [
        Expanded(
          child: AuraOutlineButton(
            text: cancelText,
            onPressed: onCancel,
          ),
        ),
        AuraSpacing.hMd,
        Expanded(
          child: AuraGradientButton(
            text: confirmText,
            onPressed: onConfirm,
          ),
        ),
      ],
    );
  }
}

Future<T?> showAuraDialog<T>({
  required BuildContext context,
  required WidgetBuilder builder,
}) {
  return showDialog<T>(
    context: context,
    barrierColor: AuraColors.black40,
    builder: builder,
  );
}
