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
import '../../../../core/widgets/aura_bottom_nav.dart';
import '../../../../core/widgets/aura_animator.dart' hide AuraPulse, AuraFloat;
import '../../../../core/services/user_session_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late UserSessionService _sessionService;

  @override
  void initState() {
    super.initState();
    _sessionService = UserSessionService();
    _sessionService.addListener(_onSessionUpdated);
  }

  @override
  void dispose() {
    _sessionService.removeListener(_onSessionUpdated);
    super.dispose();
  }

  void _onSessionUpdated() {
    if (mounted) setState(() {});
  }

  void _showEditProfileBottomSheet(BuildContext context) {
    final user = _sessionService.currentUser;
    final nameController = TextEditingController(text: user?.displayName ?? '');
    final bioController = TextEditingController(text: user?.bio ?? '');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AuraColors.surfaceLight,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(ctx).viewInsets.bottom,
          left: 20,
          right: 20,
          top: 20,
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(width: 40, height: 4, decoration: BoxDecoration(color: AuraColors.border, borderRadius: AuraRadius.brPill)),
              ),
              AuraSpacing.vLg,
              Text('Edit Profile', style: AuraTypography.titleLarge),
              AuraSpacing.vLg,
              Center(
                child: Stack(
                  children: [
                    Container(
                      width: 90,
                      height: 90,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: AuraColors.primary, width: 3),
                      ),
                      child: ClipOval(
                        child: user?.avatarUrl != null && user!.avatarUrl!.isNotEmpty
                            ? Image.network(user.avatarUrl!, fit: BoxFit.cover)
                            : Container(
                                color: AuraColors.surface,
                                child: const Icon(Iconsax.user, color: AuraColors.primary, size: 40),
                              ),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(
                          color: AuraColors.primary,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Iconsax.camera, color: AuraColors.textPrimary, size: 14),
                      ),
                    ),
                  ],
                ),
              ),
              AuraSpacing.vLg,
              Text('Display Name', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
              AuraSpacing.vXxs,
              TextField(
                controller: nameController,
                style: AuraTypography.bodyMedium,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: AuraColors.surfaceLight,
                  border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.border)),
                ),
              ),
              AuraSpacing.vMd,
              Text('Bio', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
              AuraSpacing.vXxs,
              TextField(
                controller: bioController,
                style: AuraTypography.bodyMedium,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: AuraColors.surfaceLight,
                  border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.border)),
                ),
              ),
              AuraSpacing.vLg,
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AuraColors.primary,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: AuraRadius.brPill),
                  ),
                  onPressed: () async {
                    await _sessionService.updateProfile(
                      displayName: nameController.text.trim(),
                      bio: bioController.text.trim(),
                    );
                    if (ctx.mounted) Navigator.pop(ctx);
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Profile updated successfully!')),
                      );
                    }
                  },
                  child: Text('Save Changes', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                ),
              ),
              AuraSpacing.vLg,
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = _sessionService.currentUser;

    return Scaffold(
      backgroundColor: AuraColors.background,
      bottomNavigationBar: const AuraBottomNav(activeTab: 'me'),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Iconsax.menu, color: AuraColors.textPrimary),
          onPressed: () {},
        ),
        title: Text(
          'Me',
          style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary),
        ),
        actions: [
          IconButton(
            icon: const Icon(Iconsax.setting_2, color: AuraColors.textPrimary),
            onPressed: () => context.push('/settings'),
          ),
          IconButton(
            icon: const Icon(Iconsax.share, color: AuraColors.textPrimary),
            onPressed: () => context.push('/invite-friends'),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(bottom: 32),
        child: Column(
          children: [
            // Profile Header Section with Palace Texture
            Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.center,
              children: [
                Opacity(
                  opacity: 0.35,
                  child: Container(
                    height: 240,
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      image: DecorationImage(
                        image: NetworkImage('https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=800&h=400&fit=crop&auto=format'),
                        fit: BoxFit.cover,
                      ),
                    ),
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.transparent, AuraColors.background],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                      ),
                    ),
                  ),
                ),
                Positioned(
                  top: 20,
                  left: 0,
                  right: 0,
                  child: Column(
                    children: [
                      // Avatar Container
                      Stack(
                        children: [
                          Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: AuraColors.primary, width: 4),
                              boxShadow: AuraShadows.neonViolet,
                            ),
                            child: ClipOval(
                              child: user?.avatarUrl != null && user!.avatarUrl!.isNotEmpty
                                  ? Image.network(
                                      user.avatarUrl!,
                                      fit: BoxFit.cover,
                                      errorBuilder: (context, error, stackTrace) => Container(
                                        color: AuraColors.surface,
                                        child: const Icon(Iconsax.user, color: AuraColors.primary, size: 48),
                                      ),
                                    )
                                  : Container(
                                      color: AuraColors.surface,
                                      child: const Icon(Iconsax.user, color: AuraColors.primary, size: 48),
                                    ),
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              padding: const EdgeInsets.all(3),
                              decoration: BoxDecoration(
                                gradient: AuraGradients.primary,
                                shape: BoxShape.circle,
                                border: Border.all(color: AuraColors.background, width: 2),
                              ),
                              child: const Icon(Iconsax.verify, color: AuraColors.textPrimary, size: 14),
                            ),
                          )
                        ],
                      ),
                      AuraSpacing.vMd,
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Flexible(
                            child: Text(
                              user?.displayName ?? user?.username ?? 'Aura User',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary),
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(Icons.male, color: Colors.blueAccent, size: 18),
                        ],
                      ),
                      Text('ID: ${user?.numericId ?? "100001"} | Code: ${user?.userCode ?? "AU100001"} | Age: ${user?.age ?? 18}', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                      if (user?.bio != null) ...[
                        AuraSpacing.vXs,
                        Text(user!.bio, style: AuraTypography.bodySmall.copyWith(color: AuraColors.accent, fontStyle: FontStyle.italic)),
                      ],
                      AuraSpacing.vSm,
                      GestureDetector(
                        onTap: () => _showEditProfileBottomSheet(context),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(
                            color: AuraColors.surfaceLight,
                            borderRadius: AuraRadius.brPill,
                            border: Border.all(color: AuraColors.primary.withValues(alpha: 0.5)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Iconsax.edit_2, size: 14, color: AuraColors.primary),
                              const SizedBox(width: 6),
                              Text(
                                'Edit Profile',
                                style: AuraTypography.labelSmall.copyWith(
                                  color: AuraColors.textPrimary,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              ],
            ),

            AuraSpacing.vLg,
            AuraSpacing.vLg,

            // Dynamic Stats Row Container
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: ClipRRect(
                borderRadius: AuraRadius.brLg,
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                      color: AuraColors.glassBg,
                      borderRadius: AuraRadius.brLg,
                      border: Border.all(color: AuraColors.glassBorder),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Expanded(child: _buildStatItem('${user?.visitors ?? 0}', 'Visitors')),
                        Container(width: 1, height: 28, color: AuraColors.border),
                        Expanded(child: _buildStatItem('${user?.following ?? 0}', 'Following')),
                        Container(width: 1, height: 28, color: AuraColors.border),
                        Expanded(child: _buildStatItem('${user?.followers ?? 0}', 'Followers')),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            AuraSpacing.vLg,

            // Quick Actions Grid (4 columns)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AuraColors.surfaceLight,
                  borderRadius: AuraRadius.brLg,
                  border: Border.all(color: AuraColors.border),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Expanded(child: _buildQuickAction('Wallet', Iconsax.wallet_3, AuraColors.accent, () => context.push('/wallet'))),
                    Expanded(child: _buildQuickAction('Store', Iconsax.shop, AuraColors.primary, () => context.push('/store'))),
                    Expanded(child: _buildQuickAction('Bag', Iconsax.bag_2, AuraColors.secondary, () => context.push('/bag'))),
                    Expanded(child: _buildQuickAction('Reward', Iconsax.gift, AuraColors.success, () => context.push('/reward'))),
                  ],
                ),
              ),
            ),

            AuraSpacing.vLg,

            // User Options Menu List
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                decoration: BoxDecoration(
                  color: AuraColors.surfaceLight,
                  borderRadius: AuraRadius.brLg,
                  border: Border.all(color: AuraColors.border),
                ),
                child: Column(
                  children: [
                    _buildCustomOptionRow(
                      title: 'Edit Profile',
                      icon: Iconsax.edit,
                      iconColor: AuraColors.primary,
                      onTap: () => _showEditProfileBottomSheet(context),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'Level ${user?.level ?? 1}',
                      icon: Iconsax.chart_2,
                      iconColor: AuraColors.warning,
                      onTap: () => context.push('/level'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'Host Center',
                      icon: Iconsax.microphone,
                      iconColor: AuraColors.accent,
                      onTap: () => context.push('/host-center'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'BD Center',
                      icon: Iconsax.briefcase,
                      iconColor: AuraColors.secondary,
                      onTap: () => context.push('/bd-center'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'Family',
                      icon: Iconsax.people,
                      iconColor: AuraColors.success,
                      onTap: () => context.push('/family'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'CP System',
                      icon: Iconsax.heart,
                      iconColor: Colors.pinkAccent,
                      onTap: () => context.push('/cp-system'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'Invite Friends',
                      icon: Iconsax.user_add,
                      iconColor: AuraColors.primary,
                      onTap: () => context.push('/invite-friends'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'Contact Us',
                      icon: Iconsax.call,
                      iconColor: AuraColors.info,
                      onTap: () => context.push('/contact-us'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'Settings',
                      icon: Iconsax.setting,
                      iconColor: AuraColors.textSecondary,
                      onTap: () => context.push('/settings'),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String val, String label) {
    return Column(
      children: [
        Text(val, style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
        AuraSpacing.vSm,
        Text(label, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
      ],
    );
  }

  Widget _buildQuickAction(String title, IconData icon, Color color, VoidCallback onTap) {
    return AuraBounceButton(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(color: AuraColors.surface, borderRadius: AuraRadius.brMd, border: Border.all(color: AuraColors.border)),
            child: Icon(icon, color: color, size: 26),
          ),
          AuraSpacing.vSm,
          Text(title, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary)),
        ],
      ),
    );
  }

  Widget _buildCustomOptionRow({
    required String title,
    required IconData icon,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return AuraBounceButton(
      onTap: onTap,
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: AuraColors.surface,
            borderRadius: AuraRadius.brMd,
            border: Border.all(color: AuraColors.border),
          ),
          child: Icon(icon, color: iconColor, size: 24),
        ),
        title: Text(
          title,
          style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary),
        ),
        trailing: const Icon(
          Iconsax.arrow_right_3,
          color: AuraColors.textSecondary,
          size: 20,
        ),
      ),
    );
  }
}
