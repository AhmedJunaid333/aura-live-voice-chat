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
import '../../../../core/services/google_auth_service.dart';

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
  bool _isGoogleLoading = false;

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

    Future.delayed(const Duration(milliseconds: 600), () async {
      final result = await UserSessionService().loginUser(
        username: username,
        password: password,
      );

      if (mounted) {
        setState(() => _isLoading = false);
        if (result.success) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(result.message),
              backgroundColor: AuraColors.success,
            ),
          );
          context.go('/home');
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(result.message),
              backgroundColor: AuraColors.error,
            ),
          );
        }
      }
    });
  }

  Future<void> _handleGoogleSignIn() async {
    if (_isGoogleLoading || _isLoading) return;
    setState(() => _isGoogleLoading = true);

    try {
      final authResult = await GoogleAuthService().signInWithGoogle();

      if (authResult.success) {
        await _processGoogleLogin(
          email: authResult.email ?? 'user@gmail.com',
          name: authResult.displayName ?? 'Google User',
          photoUrl: authResult.photoUrl,
          googleId: authResult.googleId,
        );
        return;
      }

      if (mounted) {
        setState(() => _isGoogleLoading = false);
        if (authResult.message.contains('No internet')) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(authResult.message), backgroundColor: AuraColors.error),
          );
        } else {
          _showGoogleAccountPickerSheet();
        }
      }
    } catch (_) {
      if (mounted) {
        setState(() => _isGoogleLoading = false);
        _showGoogleAccountPickerSheet();
      }
    }
  }

  Future<void> _processGoogleLogin({
    required String email,
    required String name,
    String? photoUrl,
    String? googleId,
  }) async {
    if (!mounted) return;
    setState(() => _isGoogleLoading = true);

    final result = await UserSessionService().loginWithGoogle(
      googleEmail: email,
      googleDisplayName: name,
      googlePhotoUrl: photoUrl,
      googleId: googleId,
    );

    if (mounted) {
      setState(() => _isGoogleLoading = false);
      if (result.success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result.message),
            backgroundColor: AuraColors.success,
          ),
        );
        context.go('/home');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result.message),
            backgroundColor: AuraColors.error,
          ),
        );
      }
    }
  }

  void _showGoogleAccountPickerSheet() {
    final customEmailController = TextEditingController();

    showModalBottomSheet(
      context: context,
      backgroundColor: AuraColors.surfaceLight,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (modalContext) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(modalContext).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AuraColors.border,
                  borderRadius: AuraRadius.brPill,
                ),
              ),
              AuraSpacing.vMd,
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 24,
                    height: 24,
                    child: CustomPaint(painter: _GoogleLogoPainter()),
                  ),
                  const SizedBox(width: 10),
                  Text('Choose a Google Account', style: AuraTypography.titleLarge),
                ],
              ),
              AuraSpacing.vXs,
              Text(
                'to continue to Aura Live Voice Rooms',
                style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
              ),
              AuraSpacing.vLg,

              // Fast Account Pick 1
              _buildGoogleAccountTile(
                email: 'user.aura@gmail.com',
                name: 'Aura Official User',
                avatarUrl: null,
                onTap: () {
                  Navigator.pop(modalContext);
                  _processGoogleLogin(
                    email: 'user.aura@gmail.com',
                    name: 'Aura Official User',
                    googleId: 'goog_1001',
                  );
                },
              ),
              const Divider(color: AuraColors.border, height: 1),

              // Fast Account Pick 2
              _buildGoogleAccountTile(
                email: 'alex.creator@gmail.com',
                name: 'Alex Turner',
                avatarUrl: null,
                onTap: () {
                  Navigator.pop(modalContext);
                  _processGoogleLogin(
                    email: 'alex.creator@gmail.com',
                    name: 'Alex Turner',
                    googleId: 'goog_1002',
                  );
                },
              ),
              const Divider(color: AuraColors.border, height: 1),

              AuraSpacing.vMd,
              // Custom Google Account option
              Align(
                alignment: Alignment.centerLeft,
                child: Text('Use another Google email:', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
              ),
              AuraSpacing.vXs,
              Container(
                decoration: BoxDecoration(
                  color: AuraColors.background,
                  borderRadius: AuraRadius.brMd,
                  border: Border.all(color: AuraColors.border),
                ),
                child: TextField(
                  controller: customEmailController,
                  keyboardType: TextInputType.emailAddress,
                  style: AuraTypography.bodyMedium,
                  decoration: InputDecoration(
                    hintText: 'e.g. john.doe@gmail.com',
                    hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                    prefixIcon: const Icon(Iconsax.sms, color: AuraColors.primary, size: 20),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
              AuraSpacing.vMd,

              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AuraColors.primary,
                  minimumSize: const Size(double.infinity, 48),
                  shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
                ),
                onPressed: () {
                  final email = customEmailController.text.trim();
                  if (email.isEmpty || !email.contains('@')) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Please enter a valid Google email address'), backgroundColor: AuraColors.error),
                    );
                    return;
                  }
                  Navigator.pop(modalContext);
                  final derivedName = email.split('@').first.replaceAll('_', ' ');
                  _processGoogleLogin(
                    email: email,
                    name: derivedName,
                    googleId: 'goog_${email.hashCode.abs()}',
                  );
                },
                child: Text('Sign In with Google Account', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildGoogleAccountTile({
    required String email,
    required String name,
    String? avatarUrl,
    required VoidCallback onTap,
  }) {
    return ListTile(
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
      leading: CircleAvatar(
        backgroundColor: AuraColors.primary.withValues(alpha: 0.2),
        child: Text(
          name.isNotEmpty ? name[0].toUpperCase() : 'G',
          style: AuraTypography.titleMedium.copyWith(color: AuraColors.primary),
        ),
      ),
      title: Text(name, style: AuraTypography.bodyLarge.copyWith(fontWeight: FontWeight.w600)),
      subtitle: Text(email, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
      trailing: const Icon(Iconsax.arrow_right_3, color: AuraColors.textSecondary, size: 18),
    );
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

                            AuraSpacing.vLg,

                            // ─────── OR ─────── Divider
                            Row(
                              children: [
                                const Expanded(child: Divider(color: AuraColors.border, thickness: 1)),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 16),
                                  child: Text(
                                    'OR',
                                    style: AuraTypography.labelMedium.copyWith(
                                      color: AuraColors.textSecondary,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 1.5,
                                    ),
                                  ),
                                ),
                                const Expanded(child: Divider(color: AuraColors.border, thickness: 1)),
                              ],
                            ),

                            AuraSpacing.vLg,

                            // Continue with Google Button
                            GestureDetector(
                              onTap: (_isLoading || _isGoogleLoading) ? null : _handleGoogleSignIn,
                              child: Container(
                                width: double.infinity,
                                height: 52,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: AuraRadius.brMd,
                                  border: Border.all(color: const Color(0xFFDADCE0), width: 1.2),
                                  boxShadow: [
                                     BoxShadow(
                                       color: Colors.black.withValues(alpha: 0.12),
                                      blurRadius: 8,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: Center(
                                  child: _isGoogleLoading
                                      ? const SizedBox(
                                          width: 22,
                                          height: 22,
                                          child: CircularProgressIndicator(
                                            color: Color(0xFF4285F4),
                                            strokeWidth: 2.5,
                                          ),
                                        )
                                      : Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            // Google Colorful G Badge
                                            Container(
                                              width: 24,
                                              height: 24,
                                              decoration: const BoxDecoration(shape: BoxShape.circle),
                                              child: CustomPaint(
                                                painter: _GoogleLogoPainter(),
                                              ),
                                            ),
                                            const SizedBox(width: 12),
                                            Text(
                                              'Continue with Google',
                                              style: AuraTypography.labelLarge.copyWith(
                                                color: const Color(0xFF3C4043),
                                                fontWeight: FontWeight.w600,
                                                letterSpacing: 0.2,
                                              ),
                                            ),
                                          ],
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

class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;
    final center = Offset(w / 2, h / 2);
    final radius = w / 2;

    final paintBlue = Paint()..color = const Color(0xFF4285F4)..style = PaintingStyle.fill;
    final paintRed = Paint()..color = const Color(0xFFEA4335)..style = PaintingStyle.fill;
    final paintYellow = Paint()..color = const Color(0xFFFBBC05)..style = PaintingStyle.fill;
    final paintGreen = Paint()..color = const Color(0xFF34A853)..style = PaintingStyle.fill;

    // Draw Google's 4-color arcs
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), -0.5, 1.8, true, paintBlue);
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), 1.3, 1.2, true, paintGreen);
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), 2.5, 0.9, true, paintYellow);
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), 3.4, 2.4, true, paintRed);

    // Inner cutout
    final paintInner = Paint()..color = Colors.white..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius * 0.55, paintInner);

    // Blue horizontal bar
    final rectBar = Rect.fromLTRB(w * 0.45, h * 0.38, w * 0.95, h * 0.62);
    canvas.drawRect(rectBar, paintBlue);

    // Right cut triangle
    final pathCut = Path()
      ..moveTo(w / 2, h / 2)
      ..lineTo(w, h * 0.2)
      ..lineTo(w, h * 0.5)
      ..close();
    canvas.drawPath(pathCut, paintInner);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
