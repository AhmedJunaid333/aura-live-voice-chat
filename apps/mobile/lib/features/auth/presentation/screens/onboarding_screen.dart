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

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, dynamic>> _slides = [
    {
      'icon': Iconsax.microphone_2,
      'title': 'Live Voice\nRooms',
      'sub': 'Join thousands of live audio rooms every night. Talk, sing, vibe.',
    },
    {
      'icon': Iconsax.presention_chart,
      'title': 'Send Gifts\n& Shine',
      'sub': 'Express yourself with animated gifts. Crowns, diamonds, galaxies — stand out.',
    },
    {
      'icon': Iconsax.ranking,
      'title': 'PK Battles\n& Fame',
      'sub': 'Challenge rooms to epic PK battles. Earn fans, climb the ranks, claim glory.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      body: Stack(
        children: [
          // Background Gradient Animation/Effect
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: AuraGradients.primary, // Using primary gradient for unified dark luxury theme
              ),
            ),
          ),
          
          SafeArea(
            child: Column(
              children: [
                // Skip Button
                Align(
                  alignment: Alignment.topRight,
                  child: Padding(
                    padding: const EdgeInsets.only(right: 20, top: 10),
                    child: TextButton(
                      onPressed: () => context.go('/home'),
                      child: Text('Skip', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textSecondary)),
                    ),
                  ),
                ),

                // PageView Content
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: (index) => setState(() => _currentPage = index),
                    itemCount: _slides.length,
                    itemBuilder: (context, index) {
                      final slide = _slides[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 32.0),
                        child: SingleChildScrollView(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              // Icon Avatar Box
                              AuraScaleIn(
                                child: Container(
                                  width: 140,
                                  height: 140,
                                  decoration: BoxDecoration(
                                    color: AuraColors.surfaceLight,
                                    borderRadius: AuraRadius.brXl,
                                    border: Border.all(color: AuraColors.primary),
                                    boxShadow: AuraShadows.neonViolet,
                                  ),
                                  child: Center(
                                    child: Icon(slide['icon'] as IconData, size: 64, color: AuraColors.primary),
                                  ),
                                ),
                              ),
                              AuraSpacing.vXl,
                              AuraSlideIn(
                                child: Text(
                                  slide['title'] as String,
                                  textAlign: TextAlign.center,
                                  style: AuraTypography.displaySmall,
                                ),
                              ),
                              AuraSpacing.vMd,
                              AuraFadeIn(
                                child: Text(
                                  slide['sub'] as String,
                                  textAlign: TextAlign.center,
                                  style: AuraTypography.bodyLarge.copyWith(color: AuraColors.textSecondary),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),

                // Indicators & Action CTA
                Padding(
                  padding: const EdgeInsets.all(32.0),
                  child: Column(
                    children: [
                      // Indicator Dots (Glassmorphism inspired style)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(_slides.length, (index) {
                          return AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            width: _currentPage == index ? 24 : 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: _currentPage == index ? AuraColors.primary : AuraColors.surfaceLight,
                              borderRadius: AuraRadius.brSm,
                              border: Border.all(color: AuraColors.border),
                            ),
                          );
                        }),
                      ),
                      AuraSpacing.vLg,

                      // Continue / Enter Button
                      GestureDetector(
                        onTap: () {
                          if (_currentPage < _slides.length - 1) {
                            _pageController.nextPage(duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
                          } else {
                            context.go('/home');
                          }
                        },
                        child: Container(
                          width: double.infinity,
                          height: 56,
                          decoration: BoxDecoration(
                            gradient: AuraGradients.primary,
                            borderRadius: AuraRadius.brMd,
                            boxShadow: AuraShadows.neonViolet,
                          ),
                          child: Center(
                            child: Text(
                              _currentPage < _slides.length - 1 ? 'Continue' : '🚀 Enter Aura Live',
                              style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
