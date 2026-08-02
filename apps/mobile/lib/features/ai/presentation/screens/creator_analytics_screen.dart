import 'package:flutter/material.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/gradients.dart';
import '../../../../core/design_system/animations.dart';

class CreatorAnalyticsScreen extends StatelessWidget {
  const CreatorAnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text('📊 Creator Performance Analytics', style: AuraTypography.titleLarge),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            AuraSlideIn(
              delay: const Duration(milliseconds: 100),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: AuraGradients.primary,
                  borderRadius: AuraRadius.brLg,
                  boxShadow: AuraShadows.neonViolet,
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(child: Text('Creator Rank Tier', maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary))),
                        Text('💎 Platinum Host', style: AuraTypography.titleMedium.copyWith(color: AuraColors.warning)),
                      ],
                    ),
                    AuraSpacing.vLg,
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Expanded(
                          child: Column(
                            children: [
                              Text('30.0 hrs', style: AuraTypography.titleLarge),
                              AuraSpacing.vXxs,
                              Text('Total Live Time', maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                            ],
                          ),
                        ),
                        Expanded(
                          child: Column(
                            children: [
                              Text('78%', style: AuraTypography.titleLarge),
                              AuraSpacing.vXxs,
                              Text('Viewer Retention', maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                            ],
                          ),
                        ),
                        Expanded(
                          child: Column(
                            children: [
                              Text('18%', style: AuraTypography.titleLarge),
                              AuraSpacing.vXxs,
                              Text('Gift Conversion', maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
