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

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {

  @override
  Widget build(BuildContext context) {
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
                    height: 180,
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
                            child: const ClipOval(
                              child: Image(
                                image: NetworkImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format'),
                                fit: BoxFit.cover,
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
                              'MR √Lucky☆࿐',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary),
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(Icons.male, color: Colors.blueAccent, size: 18),
                        ],
                      ),
                      Text('ID: 106172', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                      AuraSpacing.vSm,
                      GestureDetector(
                        onTap: () {
                          // Navigate to edit profile modal or dialog
                          _showEditProfileBottomSheet(context);
                        },
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

            // Stats Row Container
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
                        Expanded(child: _buildStatItem('9', 'Visitors')),
                        Container(width: 1, height: 28, color: AuraColors.border),
                        Expanded(child: _buildStatItem('4', 'Following')),
                        Container(width: 1, height: 28, color: AuraColors.border),
                        Expanded(child: _buildStatItem('2', 'Followers')),
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

            // User Options Menu List (Includes Level, Host Center, BD Center, Family, CP, Invite Friends, Contact us, Setting)
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
                      title: 'Level',
                      icon: Iconsax.award,
                      iconColor: AuraColors.accent,
                      onTap: () => context.push('/level'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'Host Center',
                      icon: Iconsax.user_tag,
                      iconColor: AuraColors.primary,
                      onTap: () => context.push('/host-center'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'BD Center',
                      icon: Iconsax.people,
                      iconColor: AuraColors.secondary,
                      onTap: () => context.push('/bd-center'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'Family',
                      icon: Iconsax.shield_tick,
                      iconColor: AuraColors.accent,
                      onTap: () => context.push('/family'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'CP',
                      icon: Iconsax.heart,
                      iconColor: AuraColors.error,
                      onTap: () => context.push('/cp'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'Invite Friends',
                      icon: Iconsax.user_add,
                      iconColor: AuraColors.success,
                      onTap: () => context.push('/invite-friends'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'Contact us',
                      icon: Iconsax.headphone,
                      iconColor: AuraColors.primary,
                      onTap: () => context.push('/contact-us'),
                    ),
                    Divider(height: 1, color: AuraColors.border, indent: 68),
                    _buildCustomOptionRow(
                      title: 'Setting',
                      icon: Iconsax.setting_2,
                      iconColor: AuraColors.textPrimary,
                      onTap: () => context.push('/settings'),
                    ),
                  ],
                ),
              ),
            ),

            AuraSpacing.vLg,
          ],
        ),
      ),
    );
  }

  void _showEditProfileBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: EdgeInsets.only(
            top: 24,
            left: 20,
            right: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          decoration: BoxDecoration(
            color: AuraColors.surface,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            border: Border.all(color: AuraColors.border),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Edit Profile', style: AuraTypography.headlineMedium.copyWith(color: AuraColors.textPrimary)),
                  IconButton(
                    icon: const Icon(Icons.close, color: AuraColors.textSecondary),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              AuraSpacing.vMd,
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
                      child: const ClipOval(
                        child: Image(
                          image: NetworkImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format'),
                          fit: BoxFit.cover,
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
              Text('Nickname', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
              AuraSpacing.vXxs,
              TextField(
                controller: TextEditingController(text: 'MR √Lucky☆࿐'),
                style: AuraTypography.bodyMedium,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: AuraColors.surfaceLight,
                  border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide.none),
                ),
              ),
              AuraSpacing.vMd,
              Text('Bio', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
              AuraSpacing.vXxs,
              TextField(
                controller: TextEditingController(text: 'Living life, streaming luxury vibes ✨'),
                style: AuraTypography.bodyMedium,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: AuraColors.surfaceLight,
                  border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide.none),
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
                  onPressed: () {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Profile updated successfully!')),
                    );
                  },
                  child: Text('Save Changes', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                ),
              ),
            ],
          ),
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
