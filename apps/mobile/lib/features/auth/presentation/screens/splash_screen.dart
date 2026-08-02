import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import 'dart:async';

import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/gradients.dart';
import '../../../../core/design_system/animations.dart';
import '../../../../core/design_system/icons.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  double _progress = 0.0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startProgress();
  }

  void _startProgress() {
    _timer = Timer.periodic(const Duration(milliseconds: 30), (timer) {
      if (_progress >= 1.0) {
        timer.cancel();
        if (mounted) {
          context.go('/login');
        }
      } else {
        setState(() {
          _progress += 0.015;
          if (_progress > 1.0) _progress = 1.0;
        });
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      body: Stack(
        alignment: Alignment.center,
        children: [
          // Radial Atmospheric Background
          Container(
            decoration: const BoxDecoration(
              gradient: AuraGradients.primary, // Using primary for radial spotlight effect in context
            ),
          ),
          
          // Central Glowing Gold Aura Layer (Spotlight)
          Positioned(
            child: Container(
              width: 320,
              height: 320,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AuraColors.primary.withOpacity(0.15),
                boxShadow: AuraShadows.neonViolet,
              ),
            ),
          ),

          // Center Branding & Logo
          SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo Container with Pulse
                AuraPulse(
                  child: Container(
                    width: 140,
                    height: 140,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AuraColors.surfaceLight,
                      border: Border.all(color: AuraColors.primary, width: 2),
                      boxShadow: AuraShadows.neonViolet,
                    ),
                    child: ClipOval(
                      child: Image.asset(
                        'assets/images/logo.png',
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),

                AuraSpacing.vLg,

                // Title: AURALIVE
                AuraFadeIn(
                  child: Text(
                    'AURALIVE',
                    style: AuraTypography.displaySmall.copyWith(
                      letterSpacing: 6,
                    ),
                  ),
                ),

                AuraSpacing.vSm,

                // Tagline
                AuraFadeIn(
                  child: Text(
                    'PREMIUM AUDIO SUITE',
                    style: AuraTypography.labelLarge.copyWith(
                      color: AuraColors.primary,
                      letterSpacing: 3,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Bottom Progress Bar & Footer
          Positioned(
            bottom: 60,
            left: 40,
            right: 40,
            child: AuraSlideIn(
              child: Column(
                children: [
                  // Subtle Progress Line
                  Container(
                    width: 140,
                    height: 2,
                    decoration: BoxDecoration(
                      color: AuraColors.border,
                      borderRadius: AuraRadius.brSm,
                    ),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Container(
                        width: 140 * _progress,
                        height: 2,
                        decoration: BoxDecoration(
                          gradient: AuraGradients.primary,
                          borderRadius: AuraRadius.brSm,
                          boxShadow: AuraShadows.neonViolet,
                        ),
                      ),
                    ),
                  ),

                  AuraSpacing.vMd,

                  // Footer Text
                  FittedBox(
                    child: Text(
                      'POWERED BY AURALIVE HI-FI',
                      style: AuraTypography.labelSmall.copyWith(
                        color: AuraColors.textSecondary,
                        letterSpacing: 2,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
