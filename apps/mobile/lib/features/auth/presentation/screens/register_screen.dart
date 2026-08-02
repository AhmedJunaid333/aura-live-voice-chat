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

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _countryController = TextEditingController(text: 'Pakistan');
  final _dobController = TextEditingController();
  final _referralController = TextEditingController();

  String _selectedGender = 'PREFER_NOT_TO_SAY';
  bool _showPassword = false;
  bool _showConfirmPassword = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _usernameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _countryController.dispose();
    _dobController.dispose();
    _referralController.dispose();
    super.dispose();
  }

  void _handleSignUp() {
    final username = _usernameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    final confirmPassword = _confirmPasswordController.text.trim();
    final country = _countryController.text.trim();
    final usernameRegExp = RegExp(r'^[a-zA-Z0-9_]{4,20}$');

    if (username.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a username'),
          backgroundColor: AuraColors.error,
        ),
      );
      return;
    }

    if (!usernameRegExp.hasMatch(username)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Username must be 4–20 characters with letters, numbers, or _'),
          backgroundColor: AuraColors.error,
        ),
      );
      return;
    }

    if (email.isNotEmpty && !email.contains('@')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter a valid email address'),
          backgroundColor: AuraColors.error,
        ),
      );
      return;
    }

    if (password.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Password must be at least 6 characters'),
          backgroundColor: AuraColors.error,
        ),
      );
      return;
    }

    if (password != confirmPassword) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Passwords do not match'),
          backgroundColor: AuraColors.error,
        ),
      );
      return;
    }

    if (country.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter your country'),
          backgroundColor: AuraColors.error,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    // POST /api/v1/auth/register Simulation
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Account created successfully for @$username! 🎉'),
            backgroundColor: AuraColors.success,
          ),
        );
        context.go('/home');
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
                color: AuraColors.primary.withValues(alpha: 0.15),
                boxShadow: [BoxShadow(color: AuraColors.primary.withValues(alpha: 0.3), blurRadius: 100)],
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
                color: AuraColors.secondary.withValues(alpha: 0.15),
                boxShadow: [BoxShadow(color: AuraColors.secondary.withValues(alpha: 0.3), blurRadius: 80)],
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
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: Image.asset('assets/images/logo.png', fit: BoxFit.contain),
                        ),
                      ),
                    ),
                    AuraSpacing.vMd,
                    AuraSlideIn(
                      child: Column(
                        children: [
                          Text(
                            'Join Aura Live',
                            style: AuraTypography.displaySmall,
                          ),
                          AuraSpacing.vXs,
                          Text(
                            'Choose a unique username to get started.',
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
                                // Username (Required)
                                Text('Username (Required)', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildGlassInput(_usernameController, 'e.g. ahmed123, joe_live', Iconsax.user),

                                AuraSpacing.vMd,

                                // Email (Optional)
                                Text('Email Address (Optional)', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildGlassInput(_emailController, 'user@example.com', Iconsax.sms),

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
                                    border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide.none),
                                    enabledBorder: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.border)),
                                    focusedBorder: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.primary)),
                                  ),
                                ),

                                AuraSpacing.vMd,

                                // Confirm Password
                                Text('Confirm Password', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                TextField(
                                  controller: _confirmPasswordController,
                                  obscureText: !_showConfirmPassword,
                                  style: AuraTypography.bodyMedium,
                                  decoration: InputDecoration(
                                    hintText: 'Re-enter your password',
                                    hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                                    prefixIcon: const Icon(Iconsax.lock_1, color: AuraColors.primary, size: 20),
                                    suffixIcon: IconButton(
                                      icon: Icon(_showConfirmPassword ? Iconsax.eye_slash : Iconsax.eye, color: AuraColors.textSecondary, size: 20),
                                      onPressed: () => setState(() => _showConfirmPassword = !_showConfirmPassword),
                                    ),
                                    filled: true,
                                    fillColor: AuraColors.surfaceLight,
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                    border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide.none),
                                    enabledBorder: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.border)),
                                    focusedBorder: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.primary)),
                                  ),
                                ),

                                AuraSpacing.vMd,

                                // Country
                                Text('Country', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildGlassInput(_countryController, 'e.g. Pakistan, Saudi Arabia', Iconsax.global),

                                AuraSpacing.vMd,

                                // Gender (Optional)
                                Text('Gender (Optional)', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16),
                                  decoration: BoxDecoration(
                                    color: AuraColors.surfaceLight,
                                    borderRadius: AuraRadius.brMd,
                                    border: Border.all(color: AuraColors.border),
                                  ),
                                  child: DropdownButtonHideUnderline(
                                    child: DropdownButton<String>(
                                      value: _selectedGender,
                                      isExpanded: true,
                                      dropdownColor: AuraColors.surfaceLight,
                                      style: AuraTypography.bodyMedium,
                                      items: const [
                                        DropdownMenuItem(value: 'PREFER_NOT_TO_SAY', child: Text('Prefer not to say')),
                                        DropdownMenuItem(value: 'MALE', child: Text('Male')),
                                        DropdownMenuItem(value: 'FEMALE', child: Text('Female')),
                                        DropdownMenuItem(value: 'OTHER', child: Text('Other')),
                                      ],
                                      onChanged: (val) {
                                        if (val != null) setState(() => _selectedGender = val);
                                      },
                                    ),
                                  ),
                                ),

                                AuraSpacing.vMd,

                                // Date of Birth (Optional)
                                Text('Date of Birth (Optional)', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildGlassInput(_dobController, 'YYYY-MM-DD', Iconsax.calendar),

                                AuraSpacing.vMd,

                                // Referral Code (Optional)
                                Text('Referral Code (Optional)', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildGlassInput(_referralController, 'e.g. AURA786', Iconsax.ticket),

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
                                          : Text(
                                              'CREATE ACCOUNT',
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

                    // Footer Link
                    AuraFadeIn(
                      child: Wrap(
                        alignment: WrapAlignment.center,
                        children: [
                          Text('Already have an account? ', style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary)),
                          GestureDetector(
                            onTap: () => context.go('/login'),
                            child: Text('Login', style: AuraTypography.labelLarge.copyWith(color: AuraColors.primary)),
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
