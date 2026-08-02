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

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _showPassword = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    setState(() => _isLoading = true);
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) {
        setState(() => _isLoading = false);
        context.go('/home');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Floating & Pulsing Animated Brand Badge
                AuraScaleIn(
                  child: AuraPulse(
                    child: Container(
                      width: 90,
                      height: 90,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: AuraGradients.primary,
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
                ),

                AuraSpacing.vLg,

                // Animated App Title
                AuraSlideIn(
                  child: Column(
                    children: [
                      Text(
                        'AURALIVE',
                        style: AuraTypography.headlineMedium.copyWith(
                          color: AuraColors.primary,
                          letterSpacing: 2.0,
                        ),
                      ),
                      AuraSpacing.vXs,
                      Text(
                        'Next-Gen Audio Broadcast & Live Streaming',
                        style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                      ),
                    ],
                  ),
                ),

                AuraSpacing.vXl,

                // Main Login Card (Glassmorphism)
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
                            Text(
                              'Welcome Back',
                              style: AuraTypography.titleLarge,
                            ),
                            AuraSpacing.vXs,
                            Text(
                              'Sign in to enter your live broadcast room.',
                              style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                            ),

                            AuraSpacing.vLg,

                            // Email / Username Input
                            Text('Email or Phone Number', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                            AuraSpacing.vXs,
                            Container(
                              decoration: BoxDecoration(
                                color: AuraColors.surfaceLight,
                                borderRadius: AuraRadius.brMd,
                                border: Border.all(color: AuraColors.border),
                              ),
                              child: TextField(
                                controller: _emailController,
                                style: AuraTypography.bodyMedium,
                                decoration: InputDecoration(
                                  hintText: 'Enter your email or phone',
                                  hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                                  prefixIcon: const Icon(Iconsax.user, color: AuraColors.primary, size: 20),
                                  border: InputBorder.none,
                                  contentPadding: const EdgeInsets.symmetric(vertical: 14),
                                ),
                              ),
                            ),

                            AuraSpacing.vMd,

                            // Password Input
                            Text('Password', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                            AuraSpacing.vXs,
                            Container(
                              decoration: BoxDecoration(
                                color: AuraColors.surfaceLight,
                                borderRadius: AuraRadius.brMd,
                                border: Border.all(color: AuraColors.border),
                              ),
                              child: TextField(
                                controller: _passwordController,
                                obscureText: !_showPassword,
                                style: AuraTypography.bodyMedium,
                                decoration: InputDecoration(
                                  hintText: 'Enter your password',
                                  hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                                  prefixIcon: const Icon(Iconsax.lock, color: AuraColors.primary, size: 20),
                                  suffixIcon: IconButton(
                                    icon: Icon(_showPassword ? Iconsax.eye_slash : Iconsax.eye, color: AuraColors.primary, size: 20),
                                    onPressed: () => setState(() => _showPassword = !_showPassword),
                                  ),
                                  border: InputBorder.none,
                                  contentPadding: const EdgeInsets.symmetric(vertical: 14),
                                ),
                              ),
                            ),

                            AuraSpacing.vSm,

                            // Forgot Password
                            Align(
                              alignment: Alignment.centerRight,
                              child: TextButton(
                                onPressed: () {},
                                child: Text('Forgot Password?', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                              ),
                            ),

                            AuraSpacing.vMd,

                            // Login Button
                            GestureDetector(
                              onTap: _isLoading ? null : _handleLogin,
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
                                          child: CircularProgressIndicator(color: AuraColors.textPrimary, strokeWidth: 2.5),
                                        )
                                      : Text(
                                          'SIGN IN',
                                          style: AuraTypography.labelLarge.copyWith(
                                            color: AuraColors.textPrimary,
                                            letterSpacing: 1.2,
                                          ),
                                        ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),

                AuraSpacing.vLg,

                // Social Login Options
                AuraFadeIn(
                  child: Column(
                    children: [
                      Text('Or sign in with', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                      AuraSpacing.vMd,
                      Wrap(
                        alignment: WrapAlignment.center,
                        spacing: 12,
                        runSpacing: 12,
                        children: [
                          _buildSocialButton(Icons.g_mobiledata, 'Google', () => _handleLogin()),
                          _buildSocialButton(Icons.apple, 'Apple', () => _handleLogin()),
                          _buildSocialButton(Iconsax.mobile, 'Phone', () => context.push('/otp')),
                        ],
                      ),
                    ],
                  ),
                ),

                AuraSpacing.vLg,

                // Register Footer Link
                AuraFadeIn(
                  child: Wrap(
                    alignment: WrapAlignment.center,
                    children: [
                      Text("Don't have an account? ", style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary)),
                      GestureDetector(
                        onTap: () => context.push('/register'),
                        child: Text('Register Now', style: AuraTypography.labelLarge.copyWith(color: AuraColors.primary)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSocialButton(IconData icon, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: ClipRRect(
        borderRadius: AuraRadius.brMd,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: AuraColors.glassBg,
              borderRadius: AuraRadius.brMd,
              border: Border.all(color: AuraColors.glassBorder),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(icon, color: AuraColors.primary, size: 20),
                AuraSpacing.hSm,
                Flexible(child: Text(label, style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary))),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
