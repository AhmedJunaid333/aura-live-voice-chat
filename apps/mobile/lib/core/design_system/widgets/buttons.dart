import 'package:flutter/material.dart';
import '../colors.dart';
import '../typography.dart';
import '../spacing.dart';
import '../radius.dart';
import '../shadows.dart';
import '../gradients.dart';
import '../animations.dart';

class AuraGradientButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final bool isLoading;
  final Widget? icon;

  const AuraGradientButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return AuraBounce(
      onTap: onPressed,
      child: Container(
        padding: AuraSpacing.allMd,
        decoration: BoxDecoration(
          gradient: AuraGradients.primary,
          borderRadius: AuraRadius.brPill,
          boxShadow: AuraShadows.neonViolet,
        ),
        alignment: Alignment.center,
        child: isLoading
            ? const SizedBox(
                height: 24,
                width: 24,
                child: CircularProgressIndicator(
                  color: AuraColors.white,
                  strokeWidth: 2,
                ),
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (icon != null) ...[
                    icon!,
                    AuraSpacing.hSm,
                  ],
                  Text(
                    text,
                    style: AuraTypography.buttonText.copyWith(color: AuraColors.white),
                  ),
                ],
              ),
      ),
    );
  }
}

class AuraOutlineButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final Widget? icon;

  const AuraOutlineButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return AuraBounce(
      onTap: onPressed,
      child: Container(
        padding: AuraSpacing.allMd,
        decoration: BoxDecoration(
          color: AuraColors.glassBg,
          borderRadius: AuraRadius.brPill,
          border: Border.all(color: AuraColors.glassBorder),
        ),
        alignment: Alignment.center,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) ...[
              icon!,
              AuraSpacing.hSm,
            ],
            Text(
              text,
              style: AuraTypography.buttonText.copyWith(color: AuraColors.textPrimary),
            ),
          ],
        ),
      ),
    );
  }
}

class AuraIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onPressed;
  final Color? color;

  const AuraIconButton({
    super.key,
    required this.icon,
    required this.onPressed,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return AuraBounce(
      onTap: onPressed,
      child: Container(
        padding: AuraSpacing.allSm,
        decoration: BoxDecoration(
          color: AuraColors.glassBg,
          shape: BoxShape.circle,
          border: Border.all(color: AuraColors.glassBorder),
          boxShadow: [
            BoxShadow(
              color: (color ?? AuraColors.primary).withValues(alpha: 0.4),
              blurRadius: 20,
            ),
          ],
        ),
        child: Icon(
          icon,
          color: color ?? AuraColors.textPrimary,
          size: 24,
        ),
      ),
    );
  }
}

class AuraFAB extends StatelessWidget {
  final IconData icon;
  final VoidCallback onPressed;

  const AuraFAB({
    super.key,
    required this.icon,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return AuraBounce(
      onTap: onPressed,
      child: AuraPulse(
        child: Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            gradient: AuraGradients.primary,
            shape: BoxShape.circle,
            boxShadow: AuraShadows.neonViolet,
          ),
          child: Icon(
            icon,
            color: AuraColors.white,
            size: 28,
          ),
        ),
      ),
    );
  }
}
