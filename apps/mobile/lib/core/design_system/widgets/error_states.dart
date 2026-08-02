import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import '../colors.dart';
import '../typography.dart';
import '../spacing.dart';
import 'buttons.dart';

class AuraErrorState extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const AuraErrorState({
    super.key,
    required this.message,
    required this.onRetry,
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
              color: AuraColors.error.withValues(alpha: 0.1),
              border: Border.all(color: AuraColors.error.withValues(alpha: 0.3)),
            ),
            child: const Icon(
              Iconsax.warning_2,
              size: 48,
              color: AuraColors.error,
            ),
          ),
          AuraSpacing.vLg,
          Text(
            'Oops! Something went wrong.',
            style: AuraTypography.titleLarge,
            textAlign: TextAlign.center,
          ),
          AuraSpacing.vSm,
          Text(
            message,
            style: AuraTypography.bodyLarge.copyWith(color: AuraColors.textSecondary),
            textAlign: TextAlign.center,
          ),
          AuraSpacing.vLg,
          AuraOutlineButton(
            text: 'Try Again',
            icon: const Icon(Iconsax.refresh, size: 20, color: AuraColors.textPrimary),
            onPressed: onRetry,
          ),
        ],
      ),
    );
  }
}
