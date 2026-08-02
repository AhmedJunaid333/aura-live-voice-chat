import 'dart:async';
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

  String? _selectedAvatarUrl;
  bool _showPassword = false;
  bool _showConfirmPassword = false;
  bool _isLoading = false;

  // Username live availability checking state
  Timer? _debounceTimer;
  bool _isCheckingUsername = false;
  bool? _isUsernameAvailable;
  String? _usernameStatusText;

  final List<String> _presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&auto=format',
  ];

  @override
  void initState() {
    super.initState();
    _usernameController.addListener(_onUsernameChanged);
  }

  @override
  void dispose() {
    _usernameController.removeListener(_onUsernameChanged);
    _usernameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _debounceTimer?.cancel();
    super.dispose();
  }

  void _onUsernameChanged() {
    _debounceTimer?.cancel();
    final username = _usernameController.text.trim();

    if (username.isEmpty) {
      setState(() {
        _isCheckingUsername = false;
        _isUsernameAvailable = null;
        _usernameStatusText = null;
      });
      return;
    }

    final usernameRegExp = RegExp(r'^[a-zA-Z0-9_]{3,20}$');
    if (!usernameRegExp.hasMatch(username)) {
      setState(() {
        _isCheckingUsername = false;
        _isUsernameAvailable = false;
        _usernameStatusText = '3–20 chars (letters, numbers, _ only)';
      });
      return;
    }

    setState(() {
      _isCheckingUsername = true;
      _isUsernameAvailable = null;
      _usernameStatusText = 'Checking availability...';
    });

    _debounceTimer = Timer(const Duration(milliseconds: 500), () {
      if (!mounted) return;
      // Simulated live availability check against existing taken usernames
      final takenUsernames = ['admin', 'aura_live', 'ahmed123', 'joe_live', 'superstar'];
      final isAvailable = !takenUsernames.contains(username.toLowerCase());

      setState(() {
        _isCheckingUsername = false;
        _isUsernameAvailable = isAvailable;
        _usernameStatusText = isAvailable ? '✅ Username Available' : '❌ Username Already Taken';
      });
    });
  }

  void _openAvatarPickerSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AuraColors.surfaceLight,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(width: 40, height: 4, decoration: BoxDecoration(color: AuraColors.border, borderRadius: AuraRadius.brPill)),
              AuraSpacing.vMd,
              Text('Select Profile Photo', style: AuraTypography.titleLarge),
              AuraSpacing.vSm,
              Text('Choose from camera, gallery, or luxury avatars', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
              AuraSpacing.vLg,
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildPickerOption(Iconsax.camera, 'Camera', () {
                    Navigator.pop(context);
                    setState(() => _selectedAvatarUrl = _presetAvatars[0]);
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Camera photo selected & compressed! 📸')));
                  }),
                  _buildPickerOption(Iconsax.gallery, 'Gallery', () {
                    Navigator.pop(context);
                    setState(() => _selectedAvatarUrl = _presetAvatars[1]);
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Gallery image cropped & ready! 🖼️')));
                  }),
                ],
              ),
              AuraSpacing.vLg,
              Align(
                alignment: Alignment.centerLeft,
                child: Text('Preset Luxury Avatars', style: AuraTypography.labelMedium.copyWith(color: AuraColors.accent)),
              ),
              AuraSpacing.vSm,
              SizedBox(
                height: 70,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _presetAvatars.length,
                  separatorBuilder: (context, index) => const SizedBox(width: 12),
                  itemBuilder: (context, index) {
                    final url = _presetAvatars[index];
                    return GestureDetector(
                      onTap: () {
                        setState(() => _selectedAvatarUrl = url);
                        Navigator.pop(context);
                      },
                      child: Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: _selectedAvatarUrl == url ? AuraColors.primary : AuraColors.border, width: 2),
                        ),
                        child: ClipOval(child: Image.network(url, fit: BoxFit.cover)),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPickerOption(IconData icon, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: AuraGradients.primary,
              shape: BoxShape.circle,
              boxShadow: AuraShadows.neonViolet,
            ),
            child: Icon(icon, color: AuraColors.textPrimary, size: 28),
          ),
          AuraSpacing.vXs,
          Text(label, style: AuraTypography.labelMedium),
        ],
      ),
    );
  }

  void _handleSignUp() {
    final username = _usernameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    final confirmPassword = _confirmPasswordController.text.trim();

    final usernameRegExp = RegExp(r'^[a-zA-Z0-9_]{3,20}$');
    final passwordRegExp = RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$');

    if (username.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter a username'), backgroundColor: AuraColors.error));
      return;
    }

    if (!usernameRegExp.hasMatch(username)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Username must be 3–20 characters (letters, numbers, _ only)'), backgroundColor: AuraColors.error));
      return;
    }

    if (_isUsernameAvailable == false) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please choose an available username'), backgroundColor: AuraColors.error));
      return;
    }

    if (email.isNotEmpty && !email.contains('@')) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter a valid email address'), backgroundColor: AuraColors.error));
      return;
    }

    if (password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please enter a password'), backgroundColor: AuraColors.error));
      return;
    }

    if (!passwordRegExp.hasMatch(password)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Password must be at least 8 chars with 1 uppercase, 1 lowercase, and 1 number'),
        backgroundColor: AuraColors.error,
      ));
      return;
    }

    if (password != confirmPassword) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Passwords do not match'), backgroundColor: AuraColors.error));
      return;
    }

    setState(() => _isLoading = true);

    // POST /auth/signup Simulation -> Initializes Wallet: Coins=0, Diamonds=0, XP=0, Level=1, VIP=0
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Account & Live Wallet initialized for @$username! Welcome! 🚀'),
            backgroundColor: AuraColors.success,
          ),
        );
        // Direct navigation to Home Page
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
        title: Text('Create Account', style: AuraTypography.titleLarge),
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
                    // 3. Large Animated Avatar Picker
                    AuraScaleIn(
                      child: GestureDetector(
                        onTap: _openAvatarPickerSheet,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Container(
                              width: 110,
                              height: 110,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: AuraGradients.primary,
                                boxShadow: AuraShadows.neonViolet,
                                border: Border.all(color: AuraColors.accent, width: 3),
                              ),
                              child: _selectedAvatarUrl == null
                                  ? Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        const Icon(Iconsax.add, color: AuraColors.textPrimary, size: 28),
                                        const SizedBox(height: 2),
                                        Text(
                                          'Upload Photo',
                                          style: AuraTypography.labelSmall.copyWith(
                                            color: AuraColors.textPrimary,
                                            fontSize: 9,
                                            fontWeight: FontWeight.bold,
                                          ),
                                          textAlign: TextAlign.center,
                                        ),
                                      ],
                                    )
                                  : ClipOval(
                                      child: Image.network(_selectedAvatarUrl!, fit: BoxFit.cover),
                                    ),
                            ),
                            Positioned(
                              bottom: 0,
                              right: 0,
                              child: Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: AuraColors.accent,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: AuraColors.background, width: 2),
                                ),
                                child: const Icon(Iconsax.edit_2, color: AuraColors.background, size: 14),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    AuraSpacing.vMd,

                    AuraSlideIn(
                      child: Column(
                        children: [
                          Text('Join Aura Live', style: AuraTypography.displaySmall),
                          AuraSpacing.vXs,
                          Text('Step into the digital voice spotlight', style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary)),
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
                                // Username Field with Live Debounce Availability Check
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('Username', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                    if (_isCheckingUsername)
                                      const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: AuraColors.accent))
                                    else if (_usernameStatusText != null)
                                      Text(
                                        _usernameStatusText!,
                                        style: AuraTypography.labelSmall.copyWith(
                                          color: _isUsernameAvailable == true ? AuraColors.success : AuraColors.error,
                                          fontSize: 10,
                                        ),
                                      ),
                                  ],
                                ),
                                AuraSpacing.vXs,
                                TextField(
                                  controller: _usernameController,
                                  style: AuraTypography.bodyMedium,
                                  decoration: InputDecoration(
                                    hintText: 'e.g. ahmed123, joe_live',
                                    hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                                    prefixIcon: const Icon(Iconsax.user, color: AuraColors.primary, size: 20),
                                    suffixIcon: _isUsernameAvailable == true
                                        ? const Icon(Iconsax.verify, color: AuraColors.success, size: 20)
                                        : (_isUsernameAvailable == false ? const Icon(Iconsax.close_circle, color: AuraColors.error, size: 20) : null),
                                    filled: true,
                                    fillColor: AuraColors.surfaceLight,
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                    border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide.none),
                                    enabledBorder: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.border)),
                                    focusedBorder: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.primary)),
                                  ),
                                ),

                                AuraSpacing.vMd,

                                // Email (Optional)
                                Text('Email Address (Optional)', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                TextField(
                                  controller: _emailController,
                                  style: AuraTypography.bodyMedium,
                                  decoration: InputDecoration(
                                    hintText: 'user@example.com',
                                    hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                                    prefixIcon: const Icon(Iconsax.sms, color: AuraColors.primary, size: 20),
                                    filled: true,
                                    fillColor: AuraColors.surfaceLight,
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                    border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide.none),
                                    enabledBorder: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.border)),
                                    focusedBorder: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.primary)),
                                  ),
                                ),

                                AuraSpacing.vMd,

                                // Password (8+ chars, Uppercase, Lowercase, Number)
                                Text('Password', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                TextField(
                                  controller: _passwordController,
                                  obscureText: !_showPassword,
                                  style: AuraTypography.bodyMedium,
                                  decoration: InputDecoration(
                                    hintText: 'Min 8 chars (1 upper, 1 lower, 1 num)',
                                    hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary, fontSize: 12),
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

                                AuraSpacing.vXl,

                                // Create Account Gradient Button
                                GestureDetector(
                                  onTap: _isLoading ? null : _handleSignUp,
                                  child: Container(
                                    width: double.infinity,
                                    height: 54,
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
                                              'Create Account',
                                              style: AuraTypography.labelLarge.copyWith(
                                                color: AuraColors.textPrimary,
                                                letterSpacing: 1.2,
                                                fontWeight: FontWeight.bold,
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
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('Already have an account? ', style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary)),
                          GestureDetector(
                            onTap: () => context.go('/login'),
                            child: Text('Login', style: AuraTypography.labelLarge.copyWith(color: AuraColors.primary)),
                          ),
                        ],
                      ),
                    ),
                    AuraSpacing.vXl,
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
