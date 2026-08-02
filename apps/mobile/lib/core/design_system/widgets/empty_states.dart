import 'package:flutter/material.dart';
import '../colors.dart';
import '../typography.dart';
import '../spacing.dart';
import 'buttons.dart';

class AuraEmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String message;
  final String? buttonText;
  final VoidCallback? onButtonPressed;

  const AuraEmptyState({
    super.key,
    required this.icon,
    required this.title,
    required this.message,
    this.buttonText,
    this.onButtonPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: AuraSpacing.allLg,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            padding: AuraSpacing.allXxl,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AuraColors.surfaceLight,
              border: Border.all(color: AuraColors.glassBorder),
            ),
            child: Icon(
              icon,
              size: 48,
              color: AuraColors.textSecondary,
            ),
          ),
          AuraSpacing.vLg,
          Text(
            title,
            style: AuraTypography.titleLarge,
            textAlign: TextAlign.center,
          ),
          AuraSpacing.vSm,
          Text(
            message,
            style: AuraTypography.bodyLarge.copyWith(color: AuraColors.textSecondary),
            textAlign: TextAlign.center,
          ),
          if (buttonText != null && onButtonPressed != null) ...[
            AuraSpacing.vLg,
            AuraGradientButton(
              text: buttonText!,
              onPressed: onButtonPressed!,
            ),
          ],
        ],
      ),
    );
  }
}
