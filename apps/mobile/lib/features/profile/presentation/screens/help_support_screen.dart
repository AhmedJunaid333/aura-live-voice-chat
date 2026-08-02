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

class HelpSupportScreen extends StatefulWidget {
  const HelpSupportScreen({super.key});

  @override
  State<HelpSupportScreen> createState() => _HelpSupportScreenState();
}

class _HelpSupportScreenState extends State<HelpSupportScreen> {
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, String>> _faqs = [
    {
      'question': 'How do I recharge Coins & Diamonds?',
      'answer': 'Go to Me Screen -> Wallet -> Select Coin Pack -> Complete Payment via Google Play, EasyPaisa, or Credit Card.',
    },
    {
      'question': 'How to apply for Host / BD Agency status?',
      'answer': 'Open Me Screen -> BD Center / Host Center -> Click Recruit Host or contact your BD Agency Lead.',
    },
    {
      'question': 'How do 10, 15, and 20 Seat Audio Rooms work?',
      'answer': 'When going live, select your preferred seat layout. You can also switch dynamic seat count inside the room.',
    },
    {
      'question': 'What are CP Relationship Privileges?',
      'answer': 'CP (Couple Partner) allows you to bond with a partner, send CP gifts, earn CP intimacy points, and unlock exclusive entrance cars.',
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
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
              context.go('/settings');
            }
          },
        ),
        title: Text(
          'Help & FAQ',
          style: AuraTypography.headlineSmall,
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Input
            AuraFadeIn(
              delay: const Duration(milliseconds: 100),
              child: Container(
                height: 48,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: AuraColors.surfaceLight,
                  borderRadius: AuraRadius.brPill,
                  border: Border.all(color: AuraColors.border),
                ),
                child: Row(
                  children: [
                    const Icon(Iconsax.search_normal, color: AuraColors.textSecondary, size: 20),
                    AuraSpacing.hSm,
                    Expanded(
                      child: TextField(
                        controller: _searchController,
                        style: AuraTypography.bodyMedium,
                        decoration: InputDecoration(
                          hintText: 'Search help articles & FAQs...',
                          hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            AuraSpacing.vLg,

            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: Text('Frequently Asked Questions', style: AuraTypography.titleLarge),
            ),
            AuraSpacing.vMd,

            AuraFadeIn(
              delay: const Duration(milliseconds: 300),
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _faqs.length,
                separatorBuilder: (context, index) => AuraSpacing.vSm,
                itemBuilder: (context, index) {
                  final faq = _faqs[index];
                  return ClipRRect(
                    borderRadius: AuraRadius.brLg,
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                      child: Container(
                        decoration: BoxDecoration(
                          color: AuraColors.glassBg,
                          borderRadius: AuraRadius.brLg,
                          border: Border.all(color: AuraColors.glassBorder),
                        ),
                        child: Theme(
                          data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                          child: ExpansionTile(
                            shape: const RoundedRectangleBorder(side: BorderSide.none),
                            leading: const Icon(Iconsax.message_question, color: AuraColors.primary),
                            title: Text(faq['question']!, style: AuraTypography.bodyLarge),
                            iconColor: AuraColors.primary,
                            collapsedIconColor: AuraColors.textSecondary,
                            children: [
                              Padding(
                                padding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
                                child: Text(faq['answer']!, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary, height: 1.4)),
                              )
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            AuraSpacing.vLg,

            // Live Support Button
            AuraFadeIn(
              delay: const Duration(milliseconds: 400),
              child: GestureDetector(
                onTap: () => context.push('/contact-us'),
                child: Container(
                  width: double.infinity,
                  height: 48,
                  decoration: BoxDecoration(
                    gradient: AuraGradients.primary,
                    borderRadius: AuraRadius.brPill,
                    boxShadow: AuraShadows.neonViolet,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Iconsax.headphone, color: AuraColors.textPrimary, size: 18),
                      AuraSpacing.hSm,
                      Text('Contact 24/7 VIP Support', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                    ],
                  ),
                ),
              ),
            ),

            AuraSpacing.vLg,
          ],
        ),
      ),
    );
  }
}
