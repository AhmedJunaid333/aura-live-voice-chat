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

class ContactUsScreen extends StatefulWidget {
  const ContactUsScreen({super.key});

  @override
  State<ContactUsScreen> createState() => _ContactUsScreenState();
}

class _ContactUsScreenState extends State<ContactUsScreen> {
  final TextEditingController _feedbackController = TextEditingController();
  String _selectedCategory = 'Recharge & Wallet';

  final List<String> _categories = ['Recharge & Wallet', 'Audio Room Issue', 'VIP & Level', 'Report Bug', 'General Inquiry'];

  @override
  void dispose() {
    _feedbackController.dispose();
    super.dispose();
  }

  void _submitFeedback() {
    final text = _feedbackController.text.trim();
    if (text.isEmpty) return;
    _feedbackController.clear();
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Feedback Submitted! Our VIP Team will respond within 24 hours. 🎧', style: AuraTypography.bodyMedium),
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
          'Contact & Support',
          style: AuraTypography.headlineSmall,
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 24/7 VIP Card
            AuraSlideIn(
              delay: const Duration(milliseconds: 100),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFE11D48), Color(0xFFBE123C)], // Keep original red gradient
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: AuraRadius.brLg,
                  boxShadow: const [BoxShadow(color: Color(0x33E11D48), blurRadius: 16, offset: Offset(0, 6))],
                ),
                child: Row(
                  children: [
                    const Icon(Iconsax.headphone, color: Colors.white, size: 42),
                    AuraSpacing.hMd,
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('24/7 VIP Customer Support', style: AuraTypography.titleLarge.copyWith(color: Colors.white)),
                          AuraSpacing.vXxs,
                          Text('Instant assistance for recharge, audio rooms, and account queries.', style: AuraTypography.labelMedium.copyWith(color: const Color(0xFFFECDD3))),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            AuraSpacing.vLg,

            // Submit Feedback Form
            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: Text('Submit Ticket / Inquiry', style: AuraTypography.titleLarge),
            ),
            AuraSpacing.vMd,

            // Category Chips
            AuraFadeIn(
              delay: const Duration(milliseconds: 300),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: _categories.map((cat) {
                    final isSelected = _selectedCategory == cat;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedCategory = cat),
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? AuraColors.primary : AuraColors.surface,
                          borderRadius: AuraRadius.brPill,
                          border: Border.all(color: isSelected ? AuraColors.primary : AuraColors.border),
                        ),
                        child: Text(
                          cat,
                          style: AuraTypography.labelMedium.copyWith(
                            color: isSelected ? AuraColors.textPrimary : AuraColors.textSecondary,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

            AuraSpacing.vMd,

            // Text Input Field
            AuraFadeIn(
              delay: const Duration(milliseconds: 400),
              child: TextField(
                controller: _feedbackController,
                maxLines: 4,
                style: AuraTypography.bodyMedium,
                decoration: InputDecoration(
                  hintText: 'Describe your issue in detail...',
                  hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                  filled: true,
                  fillColor: AuraColors.surfaceLight,
                  contentPadding: const EdgeInsets.all(16),
                  border: OutlineInputBorder(borderRadius: AuraRadius.brLg, borderSide: BorderSide(color: AuraColors.border)),
                  enabledBorder: OutlineInputBorder(borderRadius: AuraRadius.brLg, borderSide: BorderSide(color: AuraColors.border)),
                  focusedBorder: OutlineInputBorder(borderRadius: AuraRadius.brLg, borderSide: const BorderSide(color: AuraColors.primary)),
                ),
              ),
            ),

            AuraSpacing.vMd,

            AuraFadeIn(
              delay: const Duration(milliseconds: 500),
              child: GestureDetector(
                onTap: _submitFeedback,
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
                      const Icon(Iconsax.send_1, color: AuraColors.textPrimary, size: 18),
                      AuraSpacing.hSm,
                      Text('Submit Ticket', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
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
