import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/gradients.dart';
import '../../../../core/design_system/animations.dart';

class BdCenterScreen extends StatefulWidget {
  const BdCenterScreen({super.key});

  @override
  State<BdCenterScreen> createState() => _BdCenterScreenState();
}

class _BdCenterScreenState extends State<BdCenterScreen> {
  final String _agencyCode = 'BD-AURALIVE-88';
  final int _totalManagedHosts = 24;
  final String _monthlyCommission = '\$18,450.00';
  final String _agencyTier = 'Tier S Diamond Agency 💎';

  final List<Map<String, dynamic>> _managedHosts = [
    {'name': 'Alexander Noble', 'id': '888888', 'hours': '148 hrs', 'diamonds': '1.25M', 'status': 'Top Host'},
    {'name': 'Aura Princess 👑', 'id': '106172', 'hours': '132 hrs', 'diamonds': '980K', 'status': 'VIP Host'},
    {'name': 'Julian Star', 'id': '042109', 'hours': '115 hrs', 'diamonds': '740K', 'status': 'Active'},
    {'name': 'Seraphina Rose', 'id': '302188', 'hours': '98 hrs', 'diamonds': '520K', 'status': 'Active'},
  ];

  void _copyAgencyCode() {
    Clipboard.setData(ClipboardData(text: _agencyCode));
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Agency Code Copied to Clipboard! 📋', style: AuraTypography.bodyMedium),
        backgroundColor: AuraColors.surfaceLight,
    ));
  }

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
          'BD Center (Agency Panel)',
          style: AuraTypography.headlineSmall,
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Agency Header Card
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
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _agencyTier,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary),
                              ),
                              AuraSpacing.vXxs,
                              Text('Business Development Partner', style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary)),
                            ],
                          ),
                        ),
                        AuraSpacing.hSm,
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: AuraColors.glassBg, borderRadius: AuraRadius.brPill),
                          child: Text('18% Commission', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary)),
                        ),
                      ],
                    ),
                    AuraSpacing.vLg,
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: AuraColors.surface, borderRadius: AuraRadius.brMd),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('AGENCY CODE', maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, letterSpacing: 1.2)),
                                Text(_agencyCode, maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary)),
                              ],
                            ),
                          ),
                          GestureDetector(
                            onTap: _copyAgencyCode,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              decoration: BoxDecoration(
                                color: AuraColors.surfaceLight,
                                borderRadius: AuraRadius.brMd,
                              ),
                              child: Row(
                                children: [
                                  const Icon(Iconsax.copy, size: 14, color: AuraColors.primary),
                                  AuraSpacing.hSm,
                                  Text('Copy Code', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                ],
                              ),
                            ),
                          )
                        ],
                      ),
                    ),
                    AuraSpacing.vLg,
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Expanded(child: _buildBDMetric('Managed Hosts', '$_totalManagedHosts Hosts', AuraColors.textPrimary)),
                        Container(width: 1, height: 32, color: AuraColors.border),
                        Expanded(child: _buildBDMetric('Monthly Payout', _monthlyCommission, AuraColors.success)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            AuraSpacing.vLg,

            // Managed Hosts List Title
            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      'Managed Hosts List',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AuraTypography.titleLarge,
                    ),
                  ),
                  TextButton.icon(
                    onPressed: () {},
                    icon: const Icon(Iconsax.user_add, color: AuraColors.primary, size: 16),
                    label: Text('Recruit Host', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                  )
                ],
              ),
            ),
            AuraSpacing.vMd,

            AuraFadeIn(
              delay: const Duration(milliseconds: 300),
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _managedHosts.length,
                separatorBuilder: (context, index) => AuraSpacing.vSm,
                itemBuilder: (context, index) {
                  final host = _managedHosts[index];
                  return Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AuraColors.surfaceLight,
                      borderRadius: AuraRadius.brLg,
                      border: Border.all(color: AuraColors.border),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(color: AuraColors.surface, shape: BoxShape.circle),
                          child: const Icon(Iconsax.user, color: AuraColors.primary, size: 20),
                        ),
                        AuraSpacing.hMd,
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(host['name'] as String, style: AuraTypography.bodyLarge),
                              Text('ID: ${host['id']} • ${host['hours']}', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(host['diamonds'] as String, style: AuraTypography.labelLarge.copyWith(color: AuraColors.warning)),
                            Text(host['status'] as String, style: AuraTypography.labelSmall.copyWith(color: AuraColors.primary)),
                          ],
                        )
                      ],
                    ),
                  );
                },
              ),
            ),
            AuraSpacing.vLg,
          ],
        ),
      ),
    );
  }

  Widget _buildBDMetric(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: AuraTypography.titleMedium.copyWith(color: color)),
        AuraSpacing.vXxs,
        Text(label, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
      ],
    );
  }
}
