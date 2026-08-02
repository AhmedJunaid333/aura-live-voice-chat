import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/animations.dart';

class SafetyCenterScreen extends StatelessWidget {
  const SafetyCenterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text('🛡️ Trust & Safety Center', style: AuraTypography.titleLarge),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            AuraSlideIn(
              delay: const Duration(milliseconds: 100),
              child: ClipRRect(
                borderRadius: AuraRadius.brLg,
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AuraColors.glassBg,
                      borderRadius: AuraRadius.brLg,
                      border: Border.all(color: AuraColors.success.withValues(alpha: 0.5)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Iconsax.shield_tick, color: AuraColors.success, size: 32),
                        AuraSpacing.hMd,
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Account Status: Good Standing', maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.bodyLarge),
                              AuraSpacing.vXxs,
                              Text('Risk Score: 5 / 100 (Normal)', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
