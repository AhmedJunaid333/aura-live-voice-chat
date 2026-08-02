import 'dart:ui';
import 'dart:async';
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
import '../../../../core/design_system/icons.dart';

class OtpScreen extends StatefulWidget {
  const OtpScreen({super.key});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final List<TextEditingController> _controllers = List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (_) => FocusNode());
  int _timerSeconds = 45;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    setState(() => _timerSeconds = 45);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_timerSeconds > 0) {
        setState(() => _timerSeconds--);
      } else {
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    for (var c in _controllers) {
      c.dispose();
    }
    for (var f in _focusNodes) {
      f.dispose();
    }
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
          icon: Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AuraColors.surfaceLight,
              borderRadius: AuraRadius.brSm,
              border: Border.all(color: AuraColors.border),
            ),
            child: const Icon(Iconsax.arrow_left, color: AuraColors.textPrimary, size: 16),
          ),
          onPressed: () => context.go('/login'),
        ),
      ),
      body: Stack(
        children: [
          // Background Drifting Aurora Lights
          Positioned(
            top: -100,
            left: -50,
            child: Container(
              width: 400,
              height: 400,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AuraColors.primary.withOpacity(0.15),
                boxShadow: [BoxShadow(color: AuraColors.primary.withOpacity(0.3), blurRadius: 100)],
              ),
            ),
          ),
          Positioned(
            bottom: 0,
            right: -50,
            child: Container(
              width: 350,
              height: 350,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AuraColors.secondary.withOpacity(0.15),
                boxShadow: [BoxShadow(color: AuraColors.secondary.withOpacity(0.3), blurRadius: 100)],
              ),
            ),
          ),

          // Main Viewport Canvas
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Icon Header
                    AuraScaleIn(
                      child: Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: AuraColors.surfaceLight,
                          borderRadius: AuraRadius.brLg,
                          border: Border.all(color: AuraColors.primary),
                          boxShadow: AuraShadows.neonViolet,
                        ),
                        child: const Center(
                          child: Icon(Iconsax.sms, size: 38, color: AuraColors.primary),
                        ),
                      ),
                    ),
                    AuraSpacing.vMd,
                    AuraSlideIn(
                      child: Text(
                        'Verification Code',
                        style: AuraTypography.headlineMedium,
                      ),
                    ),
                    AuraSpacing.vXs,
                    AuraSlideIn(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          'We sent a 6-digit code to your contact details. Please enter it below.',
                          textAlign: TextAlign.center,
                          style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                        ),
                      ),
                    ),

                    AuraSpacing.vXl,

                    // Verification Glass Card
                    AuraFadeIn(
                      child: ClipRRect(
                        borderRadius: AuraRadius.brLg,
                        child: BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                          child: Container(
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: AuraColors.glassBg,
                              borderRadius: AuraRadius.brLg,
                              border: Border.all(color: AuraColors.glassBorder),
                            ),
                            child: Column(
                              children: [
                                // 6 OTP Box Fields
                                FittedBox(
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: List.generate(6, (index) {
                                      return Padding(
                                        padding: const EdgeInsets.symmetric(horizontal: 4.0),
                                        child: SizedBox(
                                          width: 44,
                                          height: 54,
                                          child: TextField(
                                            controller: _controllers[index],
                                            focusNode: _focusNodes[index],
                                            keyboardType: TextInputType.number,
                                            textAlign: TextAlign.center,
                                            maxLength: 1,
                                            style: AuraTypography.headlineSmall.copyWith(color: AuraColors.primary),
                                            decoration: InputDecoration(
                                              counterText: '',
                                              filled: true,
                                              fillColor: AuraColors.surfaceLight,
                                              contentPadding: EdgeInsets.zero,
                                              border: OutlineInputBorder(
                                                borderRadius: AuraRadius.brSm,
                                                borderSide: BorderSide(color: AuraColors.border),
                                              ),
                                              enabledBorder: OutlineInputBorder(
                                                borderRadius: AuraRadius.brSm,
                                                borderSide: BorderSide(color: AuraColors.border),
                                              ),
                                              focusedBorder: OutlineInputBorder(
                                                borderRadius: AuraRadius.brSm,
                                                borderSide: BorderSide(color: AuraColors.primary, width: 2),
                                              ),
                                            ),
                                            onChanged: (val) {
                                              if (val.isNotEmpty && index < 5) {
                                                _focusNodes[index + 1].requestFocus();
                                              } else if (val.isEmpty && index > 0) {
                                                _focusNodes[index - 1].requestFocus();
                                              }
                                            },
                                          ),
                                        ),
                                      );
                                    }),
                                  ),
                                ),

                                AuraSpacing.vLg,

                                // Resend Code Timer
                                _timerSeconds > 0
                                    ? Text(
                                        'Resend code in 0:${_timerSeconds < 10 ? '0$_timerSeconds' : _timerSeconds}',
                                        style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                                      )
                                    : GestureDetector(
                                        onTap: _startTimer,
                                        child: Text(
                                          'Resend Code Now',
                                          style: AuraTypography.labelLarge.copyWith(color: AuraColors.primary),
                                        ),
                                      ),

                                AuraSpacing.vLg,

                                // Primary Verify & Proceed Button
                                GestureDetector(
                                  onTap: () => context.go('/home'),
                                  child: Container(
                                    width: double.infinity,
                                    height: 50,
                                    decoration: BoxDecoration(
                                      gradient: AuraGradients.primary,
                                      borderRadius: AuraRadius.brMd,
                                      boxShadow: AuraShadows.neonViolet,
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Text('Verify & Proceed', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                                        AuraSpacing.hSm,
                                        const Icon(Iconsax.arrow_right_1, color: AuraColors.textPrimary, size: 18),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
