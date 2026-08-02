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
import '../../../../core/design_system/icons.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _phoneController = TextEditingController();
  bool _showPassword = false;
  bool _isLoading = false;

  void _handleSignUp() {
    setState(() => _isLoading = true);
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) {
        setState(() => _isLoading = false);
        context.go('/otp');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Iconsax.arrow_left, color: AuraColors.textPrimary),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/login');
            }
          },
        ),
        title: Text(
          'Create Account',
          style: AuraTypography.titleLarge,
        ),
      ),
      body: Stack(
        children: [
          // Background Atmospheric Elements
          Positioned(
            top: -50,
            left: -50,
            child: Container(
              width: 350,
              height: 350,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AuraColors.primary.withOpacity(0.15),
                boxShadow: [BoxShadow(color: AuraColors.primary.withOpacity(0.3), blurRadius: 100)],
              ),
            ),
          ),
          Positioned(
            bottom: -50,
            right: -50,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AuraColors.secondary.withOpacity(0.15),
                boxShadow: [BoxShadow(color: AuraColors.secondary.withOpacity(0.3), blurRadius: 80)],
              ),
            ),
          ),

          // Main Viewport Canvas
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Hero Logo Section
                    AuraScaleIn(
                      child: Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          gradient: AuraGradients.primary,
                          borderRadius: AuraRadius.brLg,
                          border: Border.all(color: AuraColors.border),
                          boxShadow: AuraShadows.neonViolet,
                        ),
                        child: ClipRRect(
                          borderRadius: AuraRadius.brLg,
                          child: Image.asset(
                            'assets/images/logo.png',
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                    AuraSpacing.vMd,
                    AuraSlideIn(
                      child: Column(
                        children: [
                          Text(
                            'Aura Live',
                            style: AuraTypography.displaySmall,
                          ),
                          AuraSpacing.vXs,
                          Text(
                            'Step into the digital spotlight.',
                            style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                          ),
                        ],
                      ),
                    ),

                    AuraSpacing.vXl,

                    // Form Inputs in Glass Card
                    AuraSlideIn(
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
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Full Name
                                Text('Full Name', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildGlassInput(_nameController, 'Alex Rivera', Iconsax.user),

                                AuraSpacing.vMd,

                                // Email Address
                                Text('Email Address', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildGlassInput(_emailController, 'alex@aurora.live', Iconsax.sms),

                                AuraSpacing.vMd,

                                // Password
                                Text('Password', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                TextField(
                                  controller: _passwordController,
                                  obscureText: !_showPassword,
                                  style: AuraTypography.bodyMedium,
                                  decoration: InputDecoration(
                                    hintText: '••••••••',
                                    hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                                    prefixIcon: const Icon(Iconsax.lock, color: AuraColors.primary, size: 20),
                                    suffixIcon: IconButton(
                                      icon: Icon(_showPassword ? Iconsax.eye_slash : Iconsax.eye, color: AuraColors.textSecondary, size: 20),
                                      onPressed: () => setState(() => _showPassword = !_showPassword),
                                    ),
                                    filled: true,
                                    fillColor: AuraColors.surfaceLight,
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                    border: OutlineInputBorder(
                                      borderRadius: AuraRadius.brMd,
                                      borderSide: BorderSide.none,
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: AuraRadius.brMd,
                                      borderSide: BorderSide(color: AuraColors.border),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: AuraRadius.brMd,
                                      borderSide: BorderSide(color: AuraColors.primary),
                                    ),
                                  ),
                                ),

                                AuraSpacing.vMd,

                                // Phone Number
                                Text('Phone Number', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildGlassInput(_phoneController, '+1 (555) 000-0000', Iconsax.mobile),

                                AuraSpacing.vXl,

                                // Primary Sign Up Button
                                GestureDetector(
                                  onTap: _isLoading ? null : _handleSignUp,
                                  child: Container(
                                    width: double.infinity,
                                    height: 52,
                                    decoration: BoxDecoration(
                                      gradient: AuraGradients.primary,
                                      borderRadius: AuraRadius.brMd,
                                      boxShadow: AuraShadows.neonViolet,
                                    ),
                                    child: Center(
                                      child: _isLoading
                                          ? const SizedBox(
                                              width: 24,
                                              height: 24,
                                              child: CircularProgressIndicator(color: AuraColors.textPrimary, strokeWidth: 2),
                                            )
                                          : Row(
                                              mainAxisAlignment: MainAxisAlignment.center,
                                              children: [
                                                Text('Sign Up', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                                                AuraSpacing.hSm,
                                                const Icon(Iconsax.arrow_right_1, color: AuraColors.textPrimary, size: 18),
                                              ],
                                            ),
                                    ),
                                  ),
                                ),

                                AuraSpacing.vLg,

                                // Social Divider
                                Row(
                                  children: [
                                    const Expanded(child: Divider(color: AuraColors.border)),
                                    Flexible(
                                      child: Padding(
                                        padding: const EdgeInsets.symmetric(horizontal: 12),
                                        child: Text('OR CONTINUE WITH', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, letterSpacing: 1.5)),
                                      ),
                                    ),
                                    const Expanded(child: Divider(color: AuraColors.border)),
                                  ],
                                ),

                                AuraSpacing.vLg,

                                // Social 2-Column Buttons
                                Row(
                                  children: [
                                    Expanded(
                                      child: OutlinedButton.icon(
                                        onPressed: () => context.go('/otp'),
                                        icon: const Icon(Iconsax.global, size: 18, color: AuraColors.textPrimary),
                                        label: Text('Google', style: AuraTypography.labelMedium),
                                        style: OutlinedButton.styleFrom(
                                          padding: const EdgeInsets.symmetric(vertical: 14),
                                          side: const BorderSide(color: AuraColors.border),
                                          shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
                                          backgroundColor: AuraColors.surfaceLight,
                                        ),
                                      ),
                                    ),
                                    AuraSpacing.hMd,
                                    Expanded(
                                      child: OutlinedButton.icon(
                                        onPressed: () => context.go('/otp'),
                                        icon: const Icon(Icons.apple, size: 18, color: AuraColors.textPrimary),
                                        label: Text('Apple', style: AuraTypography.labelMedium),
                                        style: OutlinedButton.styleFrom(
                                          padding: const EdgeInsets.symmetric(vertical: 14),
                                          side: const BorderSide(color: AuraColors.border),
                                          shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
                                          backgroundColor: AuraColors.surfaceLight,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),

                    AuraSpacing.vLg,

                    // Footer Link
                    AuraFadeIn(
                      child: Wrap(
                        alignment: WrapAlignment.center,
                        children: [
                          Text('Already have an account? ', style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary)),
                          GestureDetector(
                            onTap: () => context.go('/login'),
                            child: Text('Log In', style: AuraTypography.labelLarge.copyWith(color: AuraColors.primary)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildGlassInput(TextEditingController controller, String hint, IconData icon) {
    return TextField(
      controller: controller,
      style: AuraTypography.bodyMedium,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
        prefixIcon: Icon(icon, color: AuraColors.primary, size: 20),
        filled: true,
        fillColor: AuraColors.surfaceLight,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: AuraRadius.brMd,
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: AuraRadius.brMd,
          borderSide: BorderSide(color: AuraColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: AuraRadius.brMd,
          borderSide: BorderSide(color: AuraColors.primary),
        ),
      ),
    );
  }
}
