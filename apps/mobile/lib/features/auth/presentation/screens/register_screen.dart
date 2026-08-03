import 'dart:async';
import 'dart:io';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/gradients.dart';
import '../../../../core/design_system/animations.dart';
import '../../../../core/services/user_session_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _usernameController = TextEditingController();
  final _displayNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _countryController = TextEditingController(text: 'Pakistan');
  final _dobController = TextEditingController();
  final _referralController = TextEditingController();

  String _selectedGender = 'PREFER_NOT_TO_SAY';
  File? _selectedImageFile;   // Real device image file
  bool _showPassword = false;
  bool _showConfirmPassword = false;
  bool _isLoading = false;
  bool _isGoogleLoading = false;

  // Username live availability checking state
  Timer? _debounceTimer;
  bool _isCheckingUsername = false;
  bool? _isUsernameAvailable;
  String? _usernameStatusText;

  // Real image picker instance
  final ImagePicker _imagePicker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _usernameController.addListener(_onUsernameChanged);
  }

  @override
  void dispose() {
    _usernameController.removeListener(_onUsernameChanged);
    _usernameController.dispose();
    _displayNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _countryController.dispose();
    _dobController.dispose();
    _referralController.dispose();
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

    final usernameRegExp = RegExp(r'^[a-zA-Z0-9_]{4,20}$');
    if (!usernameRegExp.hasMatch(username)) {
      setState(() {
        _isCheckingUsername = false;
        _isUsernameAvailable = false;
        _usernameStatusText = '4–20 chars (letters, numbers, _ only)';
      });
      return;
    }

    setState(() {
      _isCheckingUsername = true;
      _isUsernameAvailable = null;
      _usernameStatusText = 'Checking...';
    });

    _debounceTimer = Timer(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      final takenUsernames = ['admin', 'aura_live', 'ahmed123', 'joe_live', 'superstar'];
      final isAvailable = !takenUsernames.contains(username.toLowerCase());

      setState(() {
        _isCheckingUsername = false;
        _isUsernameAvailable = isAvailable;
        _usernameStatusText = isAvailable ? '✅ Available' : '❌ Already Taken';
      });
    });
  }

  // ─── Real Image Picker ───────────────────────────────────────────────────────

  Future<void> _pickImageFromCamera() async {
    try {
      final XFile? photo = await _imagePicker.pickImage(
        source: ImageSource.camera,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 85,
      );
      if (photo != null && mounted) {
        setState(() => _selectedImageFile = File(photo.path));
        _showSnack('📸 Photo captured successfully!', isSuccess: true);
      }
    } catch (e) {
      _showSnack('Camera error: ${e.toString()}', isSuccess: false);
    }
  }

  Future<void> _pickImageFromGallery() async {
    try {
      final XFile? image = await _imagePicker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 85,
      );
      if (image != null && mounted) {
        setState(() => _selectedImageFile = File(image.path));
        _showSnack('🖼️ Photo selected from gallery!', isSuccess: true);
      }
    } catch (e) {
      _showSnack('Gallery error: ${e.toString()}', isSuccess: false);
    }
  }

  void _showSnack(String message, {required bool isSuccess}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(message),
      backgroundColor: isSuccess ? AuraColors.success : AuraColors.error,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
    ));
  }

  void _openAvatarPickerSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AuraColors.surfaceLight,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Handle
                Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AuraColors.border,
                    borderRadius: AuraRadius.brPill,
                  ),
                ),
                AuraSpacing.vMd,
                Text('Choose Photo', style: AuraTypography.titleLarge),
                AuraSpacing.vXs,
                Text(
                  'Select your profile photo from camera or gallery',
                  style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                  textAlign: TextAlign.center,
                ),
                AuraSpacing.vLg,

                // Camera Option
                _buildPickerOption(
                  icon: Iconsax.camera,
                  color: AuraColors.primary,
                  title: 'Take Photo',
                  subtitle: 'Use camera to capture a new photo',
                  onTap: () {
                    Navigator.pop(context);
                    _pickImageFromCamera();
                  },
                ),

                const Divider(color: AuraColors.border, height: 1),

                // Gallery Option
                _buildPickerOption(
                  icon: Iconsax.gallery,
                  color: AuraColors.secondary,
                  title: 'Choose from Gallery',
                  subtitle: 'Select existing photo from your gallery',
                  onTap: () {
                    Navigator.pop(context);
                    _pickImageFromGallery();
                  },
                ),

                // Remove option if photo selected
                if (_selectedImageFile != null) ...[
                  const Divider(color: AuraColors.border, height: 1),
                  _buildPickerOption(
                    icon: Iconsax.trash,
                    color: AuraColors.error,
                    title: 'Remove Photo',
                    subtitle: 'Reset to default avatar',
                    onTap: () {
                      Navigator.pop(context);
                      setState(() => _selectedImageFile = null);
                    },
                  ),
                ],

                AuraSpacing.vSm,
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(
                    'Cancel',
                    style: AuraTypography.labelLarge.copyWith(color: AuraColors.textSecondary),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildPickerOption({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.15),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: color, size: 22),
      ),
      title: Text(title, style: AuraTypography.titleMedium),
      subtitle: Text(subtitle, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
      onTap: onTap,
    );
  }

  // ─── Sign Up Handler ─────────────────────────────────────────────────────────

  void _handleSignUp() {
    final username = _usernameController.text.trim();
    final displayName = _displayNameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    final confirmPassword = _confirmPasswordController.text.trim();
    final country = _countryController.text.trim();

    final usernameRegExp = RegExp(r'^[a-zA-Z0-9_]{4,20}$');
    final passwordRegExp = RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()\-+=]).{8,}$');

    if (username.isEmpty) {
      _showSnack('Please enter a username', isSuccess: false);
      return;
    }
    if (!usernameRegExp.hasMatch(username)) {
      _showSnack('Username: 4–20 chars (A-Z, a-z, 0-9, _)', isSuccess: false);
      return;
    }
    if (_isUsernameAvailable == false) {
      _showSnack('Please choose an available username', isSuccess: false);
      return;
    }
    if (displayName.isEmpty) {
      _showSnack('Please enter a Display Name', isSuccess: false);
      return;
    }
    if (email.isNotEmpty && !email.contains('@')) {
      _showSnack('Please enter a valid email address', isSuccess: false);
      return;
    }
    if (password.isEmpty) {
      _showSnack('Please enter a password', isSuccess: false);
      return;
    }
    if (!passwordRegExp.hasMatch(password)) {
      _showSnack('Password: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char', isSuccess: false);
      return;
    }
    if (password != confirmPassword) {
      _showSnack('Passwords do not match', isSuccess: false);
      return;
    }
    if (country.isEmpty) {
      _showSnack('Please enter your country', isSuccess: false);
      return;
    }

    setState(() => _isLoading = true);

    Future.delayed(const Duration(milliseconds: 1200), () async {
      if (!mounted) return;
      final newUser = await UserSessionService().initializeNewAccount(
        username: username,
        password: password,
        displayName: displayName,
        email: email.isNotEmpty ? email : null,
        avatarUrl: _selectedImageFile?.path,
        gender: _selectedGender,
        country: country,
        dob: _dobController.text.trim().isNotEmpty ? _dobController.text.trim() : null,
      );

      setState(() => _isLoading = false);
      _showSnack('Welcome @${newUser.username}! ID: ${newUser.numericId} 🎉', isSuccess: true);
      if (mounted) context.go('/home');
    });
  }

  Future<void> _handleGoogleSignUp() async {
    if (_isGoogleLoading || _isLoading) return;
    // Directly open account picker — native SDK requires valid Firebase OAuth config
    _showGoogleAccountPickerSheet();
  }

  Future<void> _processGoogleSignUp({
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
      if (result.success && result.user != null) {
        _showSnack('Welcome @${result.user!.username}! User ID: ${result.user!.numericId} 🎉', isSuccess: true);
        context.go('/home');
      } else {
        _showSnack(result.message, isSuccess: false);
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
                  Text('Sign Up with Google Account', style: AuraTypography.titleLarge),
                ],
              ),
              AuraSpacing.vXs,
              Text(
                'Select account to initialize your profile & wallet',
                style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
              ),
              AuraSpacing.vLg,

              _buildGoogleAccountTile(
                email: 'user.aura@gmail.com',
                name: 'Aura Official User',
                onTap: () {
                  Navigator.pop(modalContext);
                  _processGoogleSignUp(
                    email: 'user.aura@gmail.com',
                    name: 'Aura Official User',
                    googleId: 'goog_1001',
                  );
                },
              ),
              const Divider(color: AuraColors.border, height: 1),

              _buildGoogleAccountTile(
                email: 'alex.creator@gmail.com',
                name: 'Alex Turner',
                onTap: () {
                  Navigator.pop(modalContext);
                  _processGoogleSignUp(
                    email: 'alex.creator@gmail.com',
                    name: 'Alex Turner',
                    googleId: 'goog_1002',
                  );
                },
              ),
              const Divider(color: AuraColors.border, height: 1),

              AuraSpacing.vMd,
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
                    _showSnack('Please enter a valid Google email address', isSuccess: false);
                    return;
                  }
                  Navigator.pop(modalContext);
                  final derivedName = email.split('@').first.replaceAll('_', ' ');
                  _processGoogleSignUp(
                    email: email,
                    name: derivedName,
                    googleId: 'goog_${email.hashCode.abs()}',
                  );
                },
                child: Text('Sign Up with Google Account', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
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

  // ─── Build ───────────────────────────────────────────────────────────────────

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
          // Ambient background blobs
          Positioned(
            top: -60,
            left: -60,
            child: Container(
              width: 320,
              height: 320,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AuraColors.primary.withValues(alpha: 0.12),
                boxShadow: [BoxShadow(color: AuraColors.primary.withValues(alpha: 0.25), blurRadius: 100)],
              ),
            ),
          ),
          Positioned(
            bottom: -60,
            right: -60,
            child: Container(
              width: 280,
              height: 280,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AuraColors.secondary.withValues(alpha: 0.12),
                boxShadow: [BoxShadow(color: AuraColors.secondary.withValues(alpha: 0.25), blurRadius: 80)],
              ),
            ),
          ),

          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [

                    // ── Avatar Picker ──────────────────────────────────────────
                    AuraScaleIn(
                      child: GestureDetector(
                        onTap: _openAvatarPickerSheet,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Container(
                              width: 114,
                              height: 114,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: AuraGradients.primary,
                                boxShadow: AuraShadows.neonViolet,
                                border: Border.all(color: AuraColors.accent, width: 3),
                              ),
                              child: ClipOval(
                                child: _selectedImageFile != null
                                    ? Image.file(_selectedImageFile!, fit: BoxFit.cover)
                                    : Column(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          const Icon(Iconsax.camera, color: AuraColors.textPrimary, size: 28),
                                          const SizedBox(height: 4),
                                          Text(
                                            'Add Photo',
                                            style: AuraTypography.labelSmall.copyWith(
                                              color: AuraColors.textPrimary,
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                            ),
                                            textAlign: TextAlign.center,
                                          ),
                                        ],
                                      ),
                              ),
                            ),
                            Positioned(
                              bottom: 2,
                              right: 2,
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
                          Text('Aura Live Registration', style: AuraTypography.displaySmall),
                          AuraSpacing.vXs,
                          Text(
                            'Set up your live streaming profile',
                            style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                    AuraSpacing.vXl,

                    // ── Form Glass Card ────────────────────────────────────────
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

                                // Username + live availability
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('Username *', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                    if (_isCheckingUsername)
                                      const SizedBox(
                                        width: 14,
                                        height: 14,
                                        child: CircularProgressIndicator(strokeWidth: 2, color: AuraColors.accent),
                                      )
                                    else if (_usernameStatusText != null)
                                      Flexible(
                                        child: Text(
                                          _usernameStatusText!,
                                          style: AuraTypography.labelSmall.copyWith(
                                            color: _isUsernameAvailable == true ? AuraColors.success : AuraColors.error,
                                            fontSize: 11,
                                          ),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                  ],
                                ),
                                AuraSpacing.vXs,
                                _buildGlassInput(_usernameController, 'e.g. ahmed123, joe_live', Iconsax.user),

                                AuraSpacing.vMd,

                                // Display Name
                                Text('Display Name *', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildGlassInput(_displayNameController, 'e.g. Ahmed Junaid', Iconsax.profile_circle),

                                AuraSpacing.vMd,

                                // Email
                                Text('Email (Optional)', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildGlassInput(_emailController, 'user@example.com', Iconsax.sms),

                                AuraSpacing.vMd,

                                // Password
                                Text('Password *', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildPasswordInput(
                                  controller: _passwordController,
                                  hint: '8+ chars, 1 upper, 1 lower, 1 number, 1 special',
                                  icon: Iconsax.lock,
                                  show: _showPassword,
                                  onToggle: () => setState(() => _showPassword = !_showPassword),
                                ),

                                AuraSpacing.vMd,

                                // Confirm Password
                                Text('Confirm Password *', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildPasswordInput(
                                  controller: _confirmPasswordController,
                                  hint: 'Re-enter your password',
                                  icon: Iconsax.lock_1,
                                  show: _showConfirmPassword,
                                  onToggle: () => setState(() => _showConfirmPassword = !_showConfirmPassword),
                                ),

                                AuraSpacing.vMd,

                                // Gender
                                Text('Gender', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
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

                                // Country
                                Text('Country', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildGlassInput(_countryController, 'e.g. Pakistan, Saudi Arabia', Iconsax.global),

                                AuraSpacing.vMd,

                                // Date of Birth
                                Text('Date of Birth', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildGlassInput(_dobController, 'YYYY-MM-DD', Iconsax.calendar),

                                AuraSpacing.vMd,

                                // Referral Code
                                Text('Referral Code (Optional)', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                                AuraSpacing.vXs,
                                _buildGlassInput(_referralController, 'e.g. AURA786', Iconsax.ticket),

                                AuraSpacing.vXl,

                                // Create Account Button
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

                                // Sign Up with Google Button
                                GestureDetector(
                                  onTap: (_isLoading || _isGoogleLoading) ? null : _handleGoogleSignUp,
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
                                                  'Sign Up with Google',
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

                    // Footer
                    AuraFadeIn(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Already have an account? ',
                            style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                          ),
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
          ),
        ],
      ),
    );
  }

  // ── Helper Widgets ────────────────────────────────────────────────────────────

  Widget _buildGlassInput(TextEditingController controller, String hint, IconData icon) {
    return TextField(
      controller: controller,
      style: AuraTypography.bodyMedium,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary, fontSize: 12),
        prefixIcon: Icon(icon, color: AuraColors.primary, size: 20),
        filled: true,
        fillColor: AuraColors.surfaceLight,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide.none),
        enabledBorder: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.border)),
        focusedBorder: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.primary)),
      ),
    );
  }

  Widget _buildPasswordInput({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    required bool show,
    required VoidCallback onToggle,
  }) {
    return TextField(
      controller: controller,
      obscureText: !show,
      style: AuraTypography.bodyMedium,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary, fontSize: 12),
        prefixIcon: Icon(icon, color: AuraColors.primary, size: 20),
        suffixIcon: IconButton(
          icon: Icon(show ? Iconsax.eye_slash : Iconsax.eye, color: AuraColors.textSecondary, size: 20),
          onPressed: onToggle,
        ),
        filled: true,
        fillColor: AuraColors.surfaceLight,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide.none),
        enabledBorder: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.border)),
        focusedBorder: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.primary)),
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

    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), -0.5, 1.8, true, paintBlue);
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), 1.3, 1.2, true, paintGreen);
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), 2.5, 0.9, true, paintYellow);
    canvas.drawArc(Rect.fromCircle(center: center, radius: radius), 3.4, 2.4, true, paintRed);

    final paintInner = Paint()..color = Colors.white..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius * 0.55, paintInner);

    final rectBar = Rect.fromLTRB(w * 0.45, h * 0.38, w * 0.95, h * 0.62);
    canvas.drawRect(rectBar, paintBlue);

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
