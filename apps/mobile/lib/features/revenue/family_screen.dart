import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:iconsax/iconsax.dart';
import '../../core/design_system/colors.dart';
import '../../core/design_system/typography.dart';
import '../../core/design_system/spacing.dart';
import '../../core/design_system/radius.dart';
import '../../core/design_system/shadows.dart';
import '../../core/design_system/gradients.dart';
import '../../core/design_system/animations.dart';
import '../../core/design_system/icons.dart';

class FamilyScreen extends StatefulWidget {
  const FamilyScreen({super.key});

  @override
  State<FamilyScreen> createState() => _FamilyScreenState();
}

class _FamilyScreenState extends State<FamilyScreen> {
  String _selectedTab = 'overview';

  final List<Map<String, dynamic>> _members = [
    {'rank': 1, 'name': 'Aria Moon', 'role': 'Owner', 'contribution': 48200, 'badge': '👑', 'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format'},
    {'rank': 2, 'name': 'MR √Lucky☆', 'role': 'Admin', 'contribution': 31500, 'badge': '⚡', 'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format'},
    {'rank': 3, 'name': 'Luna Ray', 'role': 'Elder', 'contribution': 22800, 'badge': '🌙', 'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&auto=format'},
    {'rank': 4, 'name': 'Marcus K', 'role': 'Member', 'contribution': 18400, 'badge': '🎵', 'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format'},
    {'rank': 5, 'name': 'Queen Zara', 'role': 'Member', 'contribution': 14200, 'badge': '💎', 'avatar': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Iconsax.arrow_left, color: AuraColors.textPrimary),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/profile');
            }
          },
        ),
        title: Text(
          'Royal Aura Family',
          style: AuraTypography.headlineSmall,
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Family Card
            AuraSlideIn(
              delay: const Duration(milliseconds: 100),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: AuraGradients.primary,
                  borderRadius: AuraRadius.brLg,
                  boxShadow: AuraShadows.neonViolet,
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 60,
                          height: 60,
                          padding: const EdgeInsets.all(2),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle, 
                            border: Border.all(color: AuraColors.textPrimary, width: 2),
                            boxShadow: AuraShadows.neonViolet,
                          ),
                          child: const ClipOval(child: Image(image: NetworkImage('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=120&h=120&fit=crop&auto=format'), fit: BoxFit.cover)),
                        ),
                        AuraSpacing.hMd,
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Royal Aura Family 🛡️', style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
                              AuraSpacing.vXxs,
                              Text('Family ID: 8888 • Rank #3 Global', style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    AuraSpacing.vLg,
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: const [
                        Expanded(child: _FamilyStat('Members', '48 / 50')),
                        Expanded(child: _FamilyStat('Family EXP', '1,420,800')),
                        Expanded(child: _FamilyStat('Weekly Rank', '#3 Global')),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            AuraSpacing.vLg,

            // Tabs Selector
            AuraFadeIn(
              delay: const Duration(milliseconds: 200),
              child: Row(
                children: ['overview', 'members', 'battle'].map((tab) {
                  final isSelected = _selectedTab == tab;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedTab = tab),
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: isSelected ? AuraColors.primary : AuraColors.surface,
                          borderRadius: AuraRadius.brMd,
                          border: Border.all(color: isSelected ? AuraColors.primary : AuraColors.border),
                        ),
                        child: Center(
                          child: Text(
                            tab.toUpperCase(),
                            style: AuraTypography.labelSmall.copyWith(
                              color: isSelected ? AuraColors.textPrimary : AuraColors.textSecondary,
                            ),
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),

            AuraSpacing.vLg,

            // Members List
            AuraFadeIn(
              delay: const Duration(milliseconds: 300),
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _members.length,
                separatorBuilder: (context, index) => AuraSpacing.vSm,
                itemBuilder: (context, index) {
                  final member = _members[index];
                  return ClipRRect(
                    borderRadius: AuraRadius.brLg,
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AuraColors.glassBg,
                          borderRadius: AuraRadius.brLg,
                          border: Border.all(color: AuraColors.glassBorder),
                        ),
                        child: Row(
                          children: [
                            Text('#${member['rank']}', style: AuraTypography.titleMedium.copyWith(color: AuraColors.primary)),
                            AuraSpacing.hMd,
                            Container(
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                boxShadow: member['rank'] <= 3 ? AuraShadows.neonViolet : null,
                              ),
                              child: ClipOval(child: Image.network(member['avatar'] as String, width: 36, height: 36, fit: BoxFit.cover)),
                            ),
                            AuraSpacing.hMd,
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('${member['name']} ${member['badge']}', style: AuraTypography.bodyLarge),
                                  Text(member['role'] as String, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                                ],
                              ),
                            ),
                            Text('${member['contribution']} EXP', style: AuraTypography.labelMedium.copyWith(color: AuraColors.primary)),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            AuraSpacing.vLg,
          ],
        ),
      ),
    );
  }
}

class _FamilyStat extends StatelessWidget {
  final String label;
  final String val;

  const _FamilyStat(this.label, this.val);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        FittedBox(fit: BoxFit.scaleDown, child: Text(val, style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary))),
        AuraSpacing.vXxs,
        FittedBox(fit: BoxFit.scaleDown, child: Text(label, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary))),
      ],
    );
  }
}
