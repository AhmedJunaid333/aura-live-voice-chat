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
import '../../../../core/widgets/aura_animator.dart' hide AuraPulse, AuraFloat;

class CreateRoomWizardScreen extends StatefulWidget {
  const CreateRoomWizardScreen({super.key});

  @override
  State<CreateRoomWizardScreen> createState() => _CreateRoomWizardScreenState();
}

class _CreateRoomWizardScreenState extends State<CreateRoomWizardScreen> {
  int _currentStep = 1;
  final int _totalSteps = 11;

  // Step 1: Room Type
  String _selectedType = 'Audio Room';
  final List<Map<String, dynamic>> _types = [
    {'name': 'Audio Room', 'icon': Iconsax.audio_square, 'desc': 'High-fidelity multi-mic audio chat'},
    {'name': 'Music Room', 'icon': Iconsax.music, 'desc': 'Stream music & DJ live performances'},
    {'name': 'Podcast', 'icon': Iconsax.microphone_2, 'desc': 'Talk shows & guest interviews'},
    {'name': 'Gaming', 'icon': Iconsax.game, 'desc': 'Live game streaming & voice chat'},
    {'name': 'Talk Show', 'icon': Iconsax.messages_2, 'desc': 'Open discussions & debates'},
  ];

  // Step 2: Seat Layout
  int _selectedSeats = 15;
  final List<int> _seatOptions = [10, 15, 20];

  // Step 3: Room Theme
  String _selectedTheme = 'Royal Gold';
  final List<Map<String, dynamic>> _themes = [
    {'name': 'Royal Gold', 'colors': [Color(0xFFD4AF37), Color(0xFFC69214)]},
    {'name': 'Neon', 'colors': [Color(0xFF00D2FF), Color(0xFF9D00FF)]},
    {'name': 'Luxury', 'colors': [Color(0xFF8A2BE2), Color(0xFF4B0082)]},
    {'name': 'Cyber', 'colors': [Color(0xFFFF007F), Color(0xFF7F00FF)]},
    {'name': 'Fantasy', 'colors': [Color(0xFF00FFCC), Color(0xFF0099FF)]},
  ];

  // Step 4: Room Background
  int _selectedBgIndex = 0;
  final List<String> _backgrounds = [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop&auto=format',
  ];

  // Step 5: Room Name
  final TextEditingController _nameController = TextEditingController(text: 'Royal Luxury Audio Suite ✨');

  // Step 6: Category
  String _selectedCategory = 'Entertainment';
  final List<String> _categories = ['Entertainment', 'Music', 'Chat', 'Gaming', 'Podcast', 'Relationship'];

  // Step 7: Language
  String _selectedLanguage = 'English';
  final List<String> _languages = ['English', 'Urdu / Hindi', 'Arabic', 'Spanish', 'French', 'Turkish'];

  // Step 8: Country
  String _selectedCountry = 'Pakistan 🇵🇰';
  final List<String> _countries = ['Pakistan 🇵🇰', 'Iraq 🇮🇶', 'Saudi Arabia 🇸🇦', 'UAE 🇦🇪', 'Global 🌍'];

  // Step 9: Room Password
  final TextEditingController _passwordController = TextEditingController();
  bool _isPasswordEnabled = false;

  // Step 10: Mic Settings
  String _micSetting = 'Public'; // 'Public', 'Approval Required', 'Locked'

  // Step 11: Launch State
  bool _isCreating = false;

  @override
  void dispose() {
    _nameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < _totalSteps - 1) {
      setState(() => _currentStep++);
    } else if (_currentStep == _totalSteps - 1) {
      // Trigger Creation Success Step
      setState(() {
        _currentStep = _totalSteps;
        _isCreating = true;
      });
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          context.go('/audio-meetup?seats=$_selectedSeats');
        }
      });
    }
  }

  void _prevStep() {
    if (_currentStep > 1) {
      setState(() => _currentStep--);
    } else {
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AuraColors.textPrimary, size: 20),
          onPressed: _prevStep,
        ),
        title: Column(
          children: [
            Text('Create Room Wizard', style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
            Text('Step $_currentStep of $_totalSteps', style: AuraTypography.labelSmall.copyWith(color: AuraColors.accent)),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Top Step Progress Indicator
            LinearProgressIndicator(
              value: _currentStep / _totalSteps,
              backgroundColor: AuraColors.surfaceLight,
              color: AuraColors.accent,
              minHeight: 4,
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: _buildCurrentStepContent(),
              ),
            ),

            // Bottom Navigation CTA Bar
            if (_currentStep < _totalSteps)
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AuraColors.surface,
                  border: Border(top: BorderSide(color: AuraColors.border)),
                ),
                child: Row(
                  children: [
                    if (_currentStep > 1)
                      Expanded(
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AuraColors.border),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: AuraRadius.brPill),
                          ),
                          onPressed: _prevStep,
                          child: Text('Back', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textSecondary)),
                        ),
                      ),
                    if (_currentStep > 1) const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: AuraGradients.gold,
                          borderRadius: AuraRadius.brPill,
                          boxShadow: AuraShadows.neonGold,
                        ),
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: AuraRadius.brPill),
                          ),
                          onPressed: _nextStep,
                          child: Text(
                            _currentStep == _totalSteps - 1 ? 'Launch Room 🚀' : 'Next Step →',
                            style: AuraTypography.labelLarge.copyWith(color: AuraColors.background, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildCurrentStepContent() {
    switch (_currentStep) {
      case 1:
        return _buildStep1Type();
      case 2:
        return _buildStep2Seats();
      case 3:
        return _buildStep3Theme();
      case 4:
        return _buildStep4Background();
      case 5:
        return _buildStep5Name();
      case 6:
        return _buildStep6Category();
      case 7:
        return _buildStep7Language();
      case 8:
        return _buildStep8Country();
      case 9:
        return _buildStep9Password();
      case 10:
        return _buildStep10MicSettings();
      case 11:
        return _buildStep11Success();
      default:
        return const SizedBox();
    }
  }

  // Step 1: Room Type
  Widget _buildStep1Type() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Step 1: Choose Room Type', style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary)),
        AuraSpacing.vXs,
        Text('Select the main broadcast format for your live room', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
        AuraSpacing.vLg,
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _types.length,
          separatorBuilder: (context, index) => AuraSpacing.vSm,
          itemBuilder: (context, index) {
            final t = _types[index];
            final isSelected = _selectedType == t['name'];
            return GestureDetector(
              onTap: () => setState(() => _selectedType = t['name'] as String),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isSelected ? AuraColors.primary.withOpacity(0.15) : AuraColors.surfaceLight,
                  borderRadius: AuraRadius.brLg,
                  border: Border.all(color: isSelected ? AuraColors.primary : AuraColors.border, width: isSelected ? 2 : 1),
                  boxShadow: isSelected ? AuraShadows.neonViolet : [],
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: AuraColors.surface, shape: BoxShape.circle),
                      child: Icon(t['icon'] as IconData, color: isSelected ? AuraColors.primary : AuraColors.textSecondary, size: 24),
                    ),
                    AuraSpacing.hMd,
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(t['name'] as String, style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary)),
                          Text(t['desc'] as String, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                        ],
                      ),
                    ),
                    if (isSelected) const Icon(Icons.check_circle, color: AuraColors.primary, size: 24),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  // Step 2: Seat Layout Live Preview
  Widget _buildStep2Seats() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Step 2: Choose Seat Layout', style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary)),
        AuraSpacing.vXs,
        Text('Live interactive mic grid preview', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
        AuraSpacing.vLg,
        Row(
          children: _seatOptions.map((seats) {
            final isSelected = _selectedSeats == seats;
            return Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _selectedSeats = seats),
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    color: isSelected ? AuraColors.accent.withOpacity(0.15) : AuraColors.surfaceLight,
                    borderRadius: AuraRadius.brLg,
                    border: Border.all(color: isSelected ? AuraColors.accent : AuraColors.border, width: isSelected ? 2 : 1),
                    boxShadow: isSelected ? AuraShadows.neonGold : [],
                  ),
                  child: Column(
                    children: [
                      Icon(Iconsax.grid_5, color: isSelected ? AuraColors.accent : AuraColors.textSecondary, size: 28),
                      AuraSpacing.vSm,
                      Text('$seats Seats', style: AuraTypography.titleMedium.copyWith(color: isSelected ? AuraColors.accent : AuraColors.textPrimary)),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        ),
        AuraSpacing.vLg,
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: AuraColors.surfaceLight, borderRadius: AuraRadius.brLg, border: Border.all(color: AuraColors.border)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('LAYOUT LIVE PREVIEW ($_selectedSeats MICS)', style: AuraTypography.labelSmall.copyWith(color: AuraColors.accent)),
              AuraSpacing.vMd,
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 5, childAspectRatio: 1.0, crossAxisSpacing: 8, mainAxisSpacing: 8),
                itemCount: _selectedSeats,
                itemBuilder: (context, index) {
                  return Container(
                    decoration: BoxDecoration(shape: BoxShape.circle, color: AuraColors.surface, border: Border.all(color: index == 0 ? AuraColors.accent : AuraColors.border)),
                    child: Center(
                      child: index == 0 ? const Icon(Iconsax.crown, color: AuraColors.accent, size: 16) : Text('${index + 1}', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ],
    );
  }

  // Step 3: Theme Selection
  Widget _buildStep3Theme() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Step 3: Room Theme', style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary)),
        AuraSpacing.vXs,
        Text('Select your luxury visual color theme', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
        AuraSpacing.vLg,
        Column(
          children: _themes.map((theme) {
            final isSelected = _selectedTheme == theme['name'];
            final colors = theme['colors'] as List<Color>;
            return GestureDetector(
              onTap: () => setState(() => _selectedTheme = theme['name'] as String),
              child: Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: colors),
                  borderRadius: AuraRadius.brLg,
                  border: Border.all(color: isSelected ? Colors.white : Colors.transparent, width: 2),
                  boxShadow: isSelected ? AuraShadows.card : [],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(theme['name'] as String, style: AuraTypography.titleLarge.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                    if (isSelected) const Icon(Icons.check_circle, color: Colors.white, size: 24),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  // Step 4: Room Background
  Widget _buildStep4Background() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Step 4: Animated Background', style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary)),
        AuraSpacing.vXs,
        Text('Choose an animated backdrop wallpaper', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
        AuraSpacing.vLg,
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, childAspectRatio: 1.3, crossAxisSpacing: 12, mainAxisSpacing: 12),
          itemCount: _backgrounds.length,
          itemBuilder: (context, index) {
            final isSelected = _selectedBgIndex == index;
            return GestureDetector(
              onTap: () => setState(() => _selectedBgIndex = index),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: AuraRadius.brLg,
                  border: Border.all(color: isSelected ? AuraColors.accent : AuraColors.border, width: isSelected ? 3 : 1),
                  image: DecorationImage(image: NetworkImage(_backgrounds[index]), fit: BoxFit.cover),
                ),
                child: isSelected ? const Center(child: Icon(Icons.check_circle, color: AuraColors.accent, size: 32)) : const SizedBox(),
              ),
            );
          },
        ),
      ],
    );
  }

  // Step 5: Room Name
  Widget _buildStep5Name() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Step 5: Room Name', style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary)),
        AuraSpacing.vXs,
        Text('Give your broadcast room a captivating title', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
        AuraSpacing.vLg,
        TextField(
          controller: _nameController,
          style: AuraTypography.titleMedium,
          decoration: InputDecoration(
            filled: true,
            fillColor: AuraColors.surfaceLight,
            hintText: 'Enter room name',
            border: OutlineInputBorder(borderRadius: AuraRadius.brLg, borderSide: BorderSide.none),
            prefixIcon: const Icon(Iconsax.edit, color: AuraColors.accent),
          ),
        ),
      ],
    );
  }

  // Step 6: Category
  Widget _buildStep6Category() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Step 6: Room Category', style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary)),
        AuraSpacing.vXs,
        Text('Help listeners find your stream', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
        AuraSpacing.vLg,
        Wrap(
          spacing: 10,
          runSpacing: 12,
          children: _categories.map((cat) {
            final isSelected = _selectedCategory == cat;
            return ChoiceChip(
              label: Text(cat),
              selected: isSelected,
              selectedColor: AuraColors.primary,
              backgroundColor: AuraColors.surfaceLight,
              labelStyle: TextStyle(color: isSelected ? AuraColors.textPrimary : AuraColors.textSecondary),
              onSelected: (val) => setState(() => _selectedCategory = cat),
            );
          }).toList(),
        ),
      ],
    );
  }

  // Step 7: Language
  Widget _buildStep7Language() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Step 7: Primary Language', style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary)),
        AuraSpacing.vXs,
        Text('Select language spoken in room', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
        AuraSpacing.vLg,
        Column(
          children: _languages.map((lang) {
            final isSelected = _selectedLanguage == lang;
            return RadioListTile<String>(
              value: lang,
              groupValue: _selectedLanguage,
              title: Text(lang, style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary)),
              activeColor: AuraColors.accent,
              onChanged: (val) => setState(() => _selectedLanguage = val!),
            );
          }).toList(),
        ),
      ],
    );
  }

  // Step 8: Country
  Widget _buildStep8Country() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Step 8: Target Country', style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary)),
        AuraSpacing.vXs,
        Text('Pin your room to a regional leaderboard', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
        AuraSpacing.vLg,
        Column(
          children: _countries.map((c) {
            final isSelected = _selectedCountry == c;
            return RadioListTile<String>(
              value: c,
              groupValue: _selectedCountry,
              title: Text(c, style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary)),
              activeColor: AuraColors.primary,
              onChanged: (val) => setState(() => _selectedCountry = val!),
            );
          }).toList(),
        ),
      ],
    );
  }

  // Step 9: Password
  Widget _buildStep9Password() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Step 9: Room Password (Optional)', style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary)),
        AuraSpacing.vXs,
        Text('Make your room private with an access passcode', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
        AuraSpacing.vLg,
        SwitchListTile(
          title: Text('Enable Password Protection', style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary)),
          value: _isPasswordEnabled,
          activeColor: AuraColors.accent,
          onChanged: (val) => setState(() => _isPasswordEnabled = val),
        ),
        if (_isPasswordEnabled)
          Padding(
            padding: const EdgeInsets.only(top: 16),
            child: TextField(
              controller: _passwordController,
              keyboardType: TextInputType.number,
              obscureText: true,
              style: AuraTypography.titleMedium,
              decoration: InputDecoration(
                filled: true,
                fillColor: AuraColors.surfaceLight,
                hintText: 'Enter 4-digit PIN',
                border: OutlineInputBorder(borderRadius: AuraRadius.brLg, borderSide: BorderSide.none),
                prefixIcon: const Icon(Iconsax.lock, color: AuraColors.accent),
              ),
            ),
          ),
      ],
    );
  }

  // Step 10: Mic Settings
  Widget _buildStep10MicSettings() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Step 10: Mic Access Mode', style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary)),
        AuraSpacing.vXs,
        Text('Control who can take a mic seat', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
        AuraSpacing.vLg,
        Column(
          children: ['Public', 'Approval Required', 'Locked'].map((mode) {
            final isSelected = _micSetting == mode;
            return RadioListTile<String>(
              value: mode,
              groupValue: _micSetting,
              title: Text(mode, style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary)),
              activeColor: AuraColors.accent,
              onChanged: (val) => setState(() => _micSetting = val!),
            );
          }).toList(),
        ),
      ],
    );
  }

  // Step 11: Animated Success
  Widget _buildStep11Success() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          AuraSpacing.vXl,
          AuraPulse(
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: AuraGradients.gold,
                boxShadow: AuraShadows.neonGold,
              ),
              child: const Icon(Icons.check, color: AuraColors.background, size: 64),
            ),
          ),
          AuraSpacing.vLg,
          Text('Room Created Successfully! 🎉', style: AuraTypography.headlineMedium.copyWith(color: AuraColors.textPrimary)),
          AuraSpacing.vSm,
          Text('Launching your $_selectedTheme audio suite...', style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary)),
          AuraSpacing.vXl,
          const CircularProgressIndicator(color: AuraColors.accent),
        ],
      ),
    );
  }
}
