import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/gradients.dart';
import '../../../../core/design_system/animations.dart';

class HostCenterScreen extends StatefulWidget {
  const HostCenterScreen({super.key});

  @override
  State<HostCenterScreen> createState() => _HostCenterScreenState();
}

class _HostCenterScreenState extends State<HostCenterScreen> {
  final String _hostStatus = 'Verified Host 🛡️';
  final String _agencyCode = 'BD-AURALIVE-88';
  final int _monthlyHours = 148;
  final int _targetHours = 150;
  final String _diamondEarned = '1,250,000';
  final String _estimatedIncome = '\$12,500.00';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Iconsax.arrow_left, color: AuraColors.textPrimary),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/profile');
            }
          },
        ),
        title: Text(
          'Host Center',
          style: AuraTypography.headlineSmall,
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Host Dashboard Card
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
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _hostStatus,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary),
                              ),
                              AuraSpacing.vXxs,
                              Text(
                                'Agency: $_agencyCode',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary),
                              ),
                            ],
                          ),
                        ),
                        GestureDetector(
                          onTap: () => context.push('/audio-meetup'),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: AuraColors.surfaceLight,
                              borderRadius: AuraRadius.brPill,
                            ),
                            child: Row(
                              children: [
                                const Icon(Iconsax.video, color: AuraColors.primary, size: 16),
                                AuraSpacing.hSm,
                                Text('Go Live Now', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                              ],
                            ),
                          ),
                        )
                      ],
                    ),
                    AuraSpacing.vLg,
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Expanded(child: _buildDashboardMetric('Monthly Live', '$_monthlyHours/$_targetHours hrs', AuraColors.textPrimary)),
                        Container(width: 1, height: 36, color: AuraColors.border),
                        Expanded(child: _buildDashboardMetric('Diamonds Earned', _diamondEarned, AuraColors.warning)),
                        Container(width: 1, height: 36, color: AuraColors.border),
                        Expanded(child: _buildDashboardMetric('Estimated Income', _estimatedIncome, AuraColors.success)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            AuraSpacing.vLg,

            // Performance Analytics Section
            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: Text(
                'Live Analytics & Targets',
                style: AuraTypography.titleLarge,
              ),
            ),
            AuraSpacing.vMd,

            AuraFadeIn(
              delay: const Duration(milliseconds: 300),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AuraColors.surfaceLight,
                  borderRadius: AuraRadius.brLg,
                  border: Border.all(color: AuraColors.border),
                ),
                child: Column(
                  children: [
                    _buildAnalyticsRow('Monthly Live Target (150 Hours)', '98.6% Completed'),
                    AuraSpacing.vSm,
                    ClipRRect(
                      borderRadius: AuraRadius.brSm,
                      child: const LinearProgressIndicator(
                        value: 0.986,
                        minHeight: 10,
                        backgroundColor: AuraColors.surface,
                        valueColor: AlwaysStoppedAnimation(AuraColors.primary),
                      ),
                    ),
                    const Divider(height: 24, color: AuraColors.border),
                    _buildAnalyticsRow('Diamond Target Tier (1,000,000)', 'Tier S Achieved 🏆'),
                  ],
                ),
              ),
            ),
            AuraSpacing.vLg,

            // Quick Host Tools
            AuraFadeIn(
              delay: const Duration(milliseconds: 400),
              child: Text(
                'Host Management Tools',
                style: AuraTypography.titleLarge,
              ),
            ),
            AuraSpacing.vMd,

            AuraFadeIn(
              delay: const Duration(milliseconds: 500),
              child: Row(
                children: [
                  Expanded(child: _buildToolTile('📊 Settlement Log', 'View Earnings', AuraColors.primary, () {})),
                  AuraSpacing.hMd,
                  Expanded(child: _buildToolTile('📜 Host Rules', 'Guidelines', AuraColors.secondary, () {})),
                  AuraSpacing.hMd,
                  Expanded(child: _buildToolTile('👥 Agency Support', 'Contact BD', AuraColors.warning, () => context.push('/bd-center'))),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildDashboardMetric(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: AuraTypography.titleMedium.copyWith(color: color)),
        AuraSpacing.vXxs,
        Text(label, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
      ],
    );
  }

  Widget _buildAnalyticsRow(String label, String status) {
    return Row(
      children: [
        Expanded(
          child: Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: AuraTypography.bodyMedium,
          ),
        ),
        AuraSpacing.hSm,
        Text(
          status,
          style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary),
        ),
      ],
    );
  }

  Widget _buildToolTile(String title, String subtitle, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: AuraRadius.brLg,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
            decoration: BoxDecoration(
              color: AuraColors.glassBg,
              borderRadius: AuraRadius.brLg,
              border: Border.all(color: AuraColors.glassBorder),
            ),
            child: Column(
              children: [
                Text(title, style: AuraTypography.labelMedium.copyWith(color: color)),
                AuraSpacing.vXxs,
                Text(subtitle, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
