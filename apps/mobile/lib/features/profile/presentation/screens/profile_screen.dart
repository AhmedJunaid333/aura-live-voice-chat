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
import '../../../../core/design_system/widgets/avatars.dart';
import '../../../../core/widgets/aura_bottom_nav.dart';
import '../../../../core/services/user_session_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late UserSessionService _sessionService;
  final ImagePicker _imagePicker = ImagePicker();

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
    String? selectedAvatarPath = user?.avatarUrl;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AuraColors.surfaceLight,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (bottomSheetContext, setModalState) {
            Future<void> pickPhoto(ImageSource source) async {
              try {
                final XFile? image = await _imagePicker.pickImage(
                  source: source,
                  maxWidth: 800,
                  maxHeight: 800,
                  imageQuality: 85,
                );
                if (image != null) {
                  setModalState(() {
                    selectedAvatarPath = image.path;
                  });
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Image error: ${e.toString()}'), backgroundColor: AuraColors.error),
                  );
                }
              }
            }

            void showPhotoOptions() {
              showModalBottomSheet(
                context: ctx,
                backgroundColor: AuraColors.surfaceLight,
                shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                ),
                builder: (context) => Container(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('Change Profile Photo', style: AuraTypography.titleLarge),
                      AuraSpacing.vMd,
                      ListTile(
                        leading: const Icon(Iconsax.camera, color: AuraColors.primary),
                        title: Text('Take Photo', style: AuraTypography.titleMedium),
                        onTap: () {
                          Navigator.pop(context);
                          pickPhoto(ImageSource.camera);
                        },
                      ),
                      ListTile(
                        leading: const Icon(Iconsax.gallery, color: AuraColors.secondary),
                        title: Text('Choose from Gallery', style: AuraTypography.titleMedium),
                        onTap: () {
                          Navigator.pop(context);
                          pickPhoto(ImageSource.gallery);
                        },
                      ),
                    ],
                  ),
                ),
              );
            }

            return Padding(
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
                      child: GestureDetector(
                        onTap: showPhotoOptions,
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
                                child: AuraAvatarImage(
                                  avatarUrl: selectedAvatarPath,
                                  width: 90,
                                  height: 90,
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
                            avatarUrl: selectedAvatarPath,
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
            );
          },
        );
      },
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
                              child: AuraAvatarImage(
                                avatarUrl: user?.avatarUrl,
                                width: 100,
                                height: 100,
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
                              const Icon(Iconsax.edit, color: AuraColors.primary, size: 14),
                              const SizedBox(width: 4),
                              Text('Edit Profile', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 120),

            // Profile Stats Grid
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
                decoration: BoxDecoration(
                  color: AuraColors.surfaceLight,
                  borderRadius: AuraRadius.brLg,
                  border: Border.all(color: AuraColors.border),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatItem('Visitors', '${user?.visitors ?? 0}'),
                    Container(width: 1, height: 30, color: AuraColors.border),
                    _buildStatItem('Following', '${user?.following ?? 0}'),
                    Container(width: 1, height: 30, color: AuraColors.border),
                    _buildStatItem('Followers', '${user?.followers ?? 0}'),
                  ],
                ),
              ),
            ),

            AuraSpacing.vLg,

            // Quick Access Grid: Wallet, Store, Bag, Reward
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
                    _buildQuickAction(context, Iconsax.wallet_3, 'Wallet', AuraColors.gold, () => context.push('/wallet')),
                    _buildQuickAction(context, Iconsax.shop, 'Store', AuraColors.primary, () => context.push('/store')),
                    _buildQuickAction(context, Iconsax.shopping_bag, 'Bag', AuraColors.secondary, () => context.push('/bag')),
                    _buildQuickAction(context, Iconsax.gift, 'Reward', AuraColors.success, () => context.push('/reward')),
                  ],
                ),
              ),
            ),

            AuraSpacing.vLg,

            // Profile Menu Items List
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
                    _buildMenuItem(
                      context,
                      icon: Iconsax.edit,
                      title: 'Edit Profile',
                      onTap: () => _showEditProfileBottomSheet(context),
                    ),
                    const Divider(color: AuraColors.border, height: 1),
                    _buildMenuItem(
                      context,
                      icon: Iconsax.chart_2,
                      title: 'Level ${user?.level ?? 1}',
                      subtitle: 'XP Progress',
                      onTap: () => context.push('/level'),
                    ),
                    const Divider(color: AuraColors.border, height: 1),
                    _buildMenuItem(
                      context,
                      icon: Iconsax.microphone,
                      title: 'Host Center',
                      subtitle: 'Lv.${user?.hostLevel ?? 1} Host Rank',
                      onTap: () => context.push('/host-center'),
                    ),
                    const Divider(color: AuraColors.border, height: 1),
                    _buildMenuItem(
                      context,
                      icon: Iconsax.crown,
                      title: 'VIP Privileges',
                      subtitle: user?.vip != null && user!.vip > 0 ? 'VIP ${user.vip}' : 'Non-VIP',
                      onTap: () => context.push('/vip'),
                    ),
                    const Divider(color: AuraColors.border, height: 1),
                    _buildMenuItem(
                      context,
                      icon: Iconsax.heart,
                      title: 'CP Relationship Space',
                      subtitle: 'Love Partner',
                      onTap: () => context.push('/cp'),
                    ),
                    const Divider(color: AuraColors.border, height: 1),
                    _buildMenuItem(
                      context,
                      icon: Iconsax.people,
                      title: 'Family',
                      subtitle: user?.family ?? 'No Family',
                      onTap: () => context.push('/family'),
                    ),
                    const Divider(color: AuraColors.border, height: 1),
                    _buildMenuItem(
                      context,
                      icon: Iconsax.building,
                      title: 'BD Center',
                      subtitle: user?.agency ?? 'No Agency',
                      onTap: () => context.push('/bd-center'),
                    ),
                    const Divider(color: AuraColors.border, height: 1),
                    _buildMenuItem(
                      context,
                      icon: Iconsax.user_add,
                      title: 'Invite Friends',
                      onTap: () => context.push('/invite-friends'),
                    ),
                    const Divider(color: AuraColors.border, height: 1),
                    _buildMenuItem(
                      context,
                      icon: Iconsax.call,
                      title: 'Contact Us',
                      onTap: () => context.push('/contact-us'),
                    ),
                    const Divider(color: AuraColors.border, height: 1),
                    _buildMenuItem(
                      context,
                      icon: Iconsax.setting,
                      title: 'Settings',
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

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(value, style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
        const SizedBox(height: 2),
        Text(label, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
      ],
    );
  }

  Widget _buildQuickAction(BuildContext context, IconData icon, String label, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.15),
              borderRadius: AuraRadius.brMd,
              border: Border.all(color: color.withValues(alpha: 0.3)),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 6),
          Text(label, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary)),
        ],
      ),
    );
  }

  Widget _buildMenuItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    String? subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AuraColors.surfaceElevated,
          borderRadius: AuraRadius.brSm,
        ),
        child: Icon(icon, color: AuraColors.primary, size: 20),
      ),
      title: Text(title, style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary)),
      subtitle: subtitle != null ? Text(subtitle, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)) : null,
      trailing: const Icon(Iconsax.arrow_right_3, color: AuraColors.textSecondary, size: 16),
    );
  }
}
