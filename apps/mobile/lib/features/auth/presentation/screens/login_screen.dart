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
import '../../../../core/services/user_session_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _showPassword = false;
  bool _isLoading = false;

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    final username = _usernameController.text.trim();
    final password = _passwordController.text.trim();
    final usernameRegExp = RegExp(r'^[a-zA-Z0-9_]{4,20}$');

    if (username.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter your username'),
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

    if (password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter your password'),
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

    setState(() => _isLoading = true);

    // POST /api/v1/auth/login Simulation
    Future.delayed(const Duration(milliseconds: 1000), () async {
      if (mounted) {
        final numericId = 100000 + (username.hashCode.abs() % 899999);
        final user = UserModel(
          numericId: numericId,
          uuid: 'usr_login_$numericId',
          username: username,
          displayName: username,
          email: '$username@auralive.app',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&auto=format',
          userCode: 'AU$numericId',
          level: 5,
          vip: 1,
          coins: 1500,
          diamonds: 320,
          followers: 42,
          following: 18,
          visitors: 99,
          bio: 'Voice room enthusiast | Aura Live Official 🎙️',
        );

        await UserSessionService().setCurrentUser(user, token: 'jwt_login_token_$numericId');

        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Welcome back, @$username! ✨'),
            backgroundColor: AuraColors.success,
          ),
        );
        context.go('/home');
      }
    });
  }

  void _showForgotPasswordDialog() {
    final forgotUsernameController = TextEditingController();
    final forgotEmailController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AuraColors.surfaceLight,
        shape: RoundedRectangleBorder(borderRadius: AuraRadius.brLg),
        title: Text('Reset Password', style: AuraTypography.titleLarge),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Enter your Username and registered Email address to receive a reset link.', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
            AuraSpacing.vMd,
            Text('Username', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
            AuraSpacing.vXs,
            TextField(
              controller: forgotUsernameController,
              style: AuraTypography.bodyMedium,
              decoration: InputDecoration(
                hintText: 'e.g. ahmed123',
                hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                prefixIcon: const Icon(Iconsax.user, color: AuraColors.primary, size: 18),
                border: OutlineInputBorder(borderRadius: AuraRadius.brMd),
              ),
            ),
            AuraSpacing.vMd,
            Text('Registered Email', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
            AuraSpacing.vXs,
            TextField(
              controller: forgotEmailController,
              style: AuraTypography.bodyMedium,
              decoration: InputDecoration(
                hintText: 'e.g. user@example.com',
                hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                prefixIcon: const Icon(Iconsax.sms, color: AuraColors.primary, size: 18),
                border: OutlineInputBorder(borderRadius: AuraRadius.brMd),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel', style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AuraColors.primary),
            onPressed: () {
              final un = forgotUsernameController.text.trim();
              final em = forgotEmailController.text.trim();
              if (un.isEmpty || em.isEmpty || !em.contains('@')) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Please enter valid Username and Email'), backgroundColor: AuraColors.error),
                );
                return;
              }
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Password reset link sent to $em for @$un'), backgroundColor: AuraColors.success),
              );
            },
            child: Text('Send Reset Link', style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary)),
          ),
        ],
      ),
    );
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
                // Floating Animated Brand Badge
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
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Image.asset('assets/images/logo.png', fit: BoxFit.contain),
                      ),
                    ),
                  ),
                ),
                AuraSpacing.vLg,

                // App Name
                AuraFadeIn(
                  child: Column(
                    children: [
                      Text(
                        'AURA LIVE',
                        style: AuraTypography.displaySmall.copyWith(
                          color: AuraColors.textPrimary,
                          letterSpacing: 3.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        'NEXT-GEN VOICE ROOMS',
                        style: AuraTypography.labelSmall.copyWith(
                          color: AuraColors.accent,
                          letterSpacing: 2.0,
                        ),
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
                              'Enter your username and password to log in.',
                              style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                            ),

                            AuraSpacing.vLg,

                            // Username Input
                            Text('Username', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                            AuraSpacing.vXs,
                            Container(
                              decoration: BoxDecoration(
                                color: AuraColors.surfaceLight,
                                borderRadius: AuraRadius.brMd,
                                border: Border.all(color: AuraColors.border),
                              ),
                              child: TextField(
                                controller: _usernameController,
                                style: AuraTypography.bodyMedium,
                                decoration: InputDecoration(
                                  hintText: 'e.g. ahmed123, joe_live',
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
                                onPressed: _showForgotPasswordDialog,
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
                                          'LOGIN',
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

                // Register Footer Link
                AuraFadeIn(
                  child: Wrap(
                    alignment: WrapAlignment.center,
                    children: [
                      Text("Don't have an account? ", style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary)),
                      GestureDetector(
                        onTap: () => context.push('/register'),
                        child: Text('Create Account', style: AuraTypography.labelLarge.copyWith(color: AuraColors.primary)),
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
}
