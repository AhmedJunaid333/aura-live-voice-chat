import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/animations.dart';

class LanguageScreen extends StatefulWidget {
  const LanguageScreen({super.key});

  @override
  State<LanguageScreen> createState() => _LanguageScreenState();
}

class _LanguageScreenState extends State<LanguageScreen> {
  String _selectedLanguage = 'English (US)';

  final List<Map<String, String>> _languages = [
    {'name': 'English (US)', 'native': 'English', 'flag': '🇺🇸'},
    {'name': 'Urdu (اردو)', 'native': 'اردو', 'flag': '🇵🇰'},
    {'name': 'Arabic (العربية)', 'native': 'العربية', 'flag': '🇸🇦'},
    {'name': 'Bengali (বাংলা)', 'native': 'বাংলা', 'flag': '🇧🇩'},
    {'name': 'Hindi (हिन्दी)', 'native': 'हिन्दी', 'flag': '🇮🇳'},
    {'name': 'Spanish', 'native': 'Español', 'flag': '🇪🇸'},
    {'name': 'French', 'native': 'Français', 'flag': '🇫🇷'},
    {'name': 'Turkish', 'native': 'Türkçe', 'flag': '🇹🇷'},
  ];

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
          'Select Language',
          style: AuraTypography.headlineSmall,
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AuraFadeIn(
              delay: const Duration(milliseconds: 100),
              child: Text('App Languages', style: AuraTypography.titleLarge),
            ),
            AuraSpacing.vMd,

            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: ClipRRect(
                borderRadius: AuraRadius.brLg,
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    decoration: BoxDecoration(
                      color: AuraColors.glassBg,
                      borderRadius: AuraRadius.brLg,
                      border: Border.all(color: AuraColors.glassBorder),
                    ),
                    child: ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _languages.length,
                      separatorBuilder: (context, index) => const Divider(height: 1, indent: 56, color: AuraColors.border),
                      itemBuilder: (context, index) {
                        final lang = _languages[index];
                        final isSelected = _selectedLanguage == lang['name'];

                        return ListTile(
                          leading: Text(lang['flag']!, style: const TextStyle(fontSize: 22)),
                          title: Text(lang['name']!, style: AuraTypography.bodyLarge),
                          subtitle: Text(lang['native']!, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                          trailing: isSelected ? const Icon(Iconsax.tick_circle, color: AuraColors.primary, size: 22) : null,
                          onTap: () {
                            setState(() => _selectedLanguage = lang['name']!);
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                                content: Text('Language Switched to ${lang['name']} 🌐', style: AuraTypography.bodyMedium),
                                backgroundColor: AuraColors.surfaceLight,
                            ));
                          },
                        );
                      },
                    ),
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
