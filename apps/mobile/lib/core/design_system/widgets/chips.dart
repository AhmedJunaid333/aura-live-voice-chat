import 'package:flutter/material.dart';
import '../colors.dart';
import '../typography.dart';
import '../spacing.dart';
import '../radius.dart';
import '../gradients.dart';
import '../animations.dart';

class AuraChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const AuraChip({
    super.key,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AuraBounce(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: EdgeInsets.symmetric(horizontal: AuraSpacing.lg, vertical: AuraSpacing.sm),
        decoration: BoxDecoration(
          gradient: isSelected ? AuraGradients.primary : null,
          color: isSelected ? null : AuraColors.surfaceLight,
          borderRadius: AuraRadius.brPill,
          border: isSelected ? null : Border.all(color: AuraColors.glassBorder),
        ),
        child: Text(
          label,
          style: AuraTypography.labelLarge.copyWith(
            color: isSelected ? AuraColors.white : AuraColors.textSecondary,
          ),
        ),
      ),
    );
  }
}

class AuraTagChip extends StatelessWidget {
  final String label;
  final Color? color;

  const AuraTagChip({
    super.key,
    required this.label,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: AuraSpacing.sm, vertical: AuraSpacing.xs),
      decoration: BoxDecoration(
        color: (color ?? AuraColors.primary).withValues(alpha: 0.2),
        borderRadius: AuraRadius.brPill,
        border: Border.all(color: (color ?? AuraColors.primary).withValues(alpha: 0.5)),
      ),
      child: Text(
        label,
        style: AuraTypography.caption.copyWith(
          color: color ?? AuraColors.primary,
        ),
      ),
    );
  }
}
