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

class StoreScreen extends StatefulWidget {
  const StoreScreen({super.key});

  @override
  State<StoreScreen> createState() => _StoreScreenState();
}

class _StoreScreenState extends State<StoreScreen> {
  String _selectedCategory = 'Vehicles';

  final List<String> _categories = ['Vehicles', 'Room Frames', 'Chat Bubbles', 'Special IDs'];

  final List<Map<String, dynamic>> _storeItems = [
    {
      'title': 'Golden Phantom Rolls 🚗',
      'category': 'Vehicles',
      'price': '50,000 Coins',
      'duration': '30 Days',
      'desc': 'Gold supercar entrance animation when joining live rooms.',
      'icon': Iconsax.car,
      'color': AuraColors.accent,
    },
    {
      'title': 'Dragon Wings Jet ✈️',
      'category': 'Vehicles',
      'price': '120,000 Coins',
      'duration': '30 Days',
      'desc': 'Mythic dragon plane entrance animation.',
      'icon': Iconsax.airplane,
      'color': AuraColors.primary,
    },
    {
      'title': 'Royal Crown Frame 👑',
      'category': 'Room Frames',
      'price': '30,000 Coins',
      'duration': '30 Days',
      'desc': 'Golden glowing crown frame for your audio room seat.',
      'icon': Iconsax.ruler,
      'color': AuraColors.secondary,
    },
    {
      'title': 'Gold Royalty Bubble 💬',
      'category': 'Chat Bubbles',
      'price': '15,000 Coins',
      'duration': '30 Days',
      'desc': 'Custom metallic gold text container in live chat.',
      'icon': Iconsax.message,
      'color': AuraColors.accent,
    },
    {
      'title': '4-Digit VIP ID (8888)',
      'category': 'Special IDs',
      'price': '500,000 Coins',
      'duration': 'Permanent',
      'desc': 'Rare 4-digit luxury ID number for your profile.',
      'icon': Iconsax.hashtag,
      'color': AuraColors.primary,
    },
  ];

  void _buyItem(Map<String, dynamic> item) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AuraColors.surfaceLight,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: AuraColors.border, borderRadius: BorderRadius.circular(2))),
            AuraSpacing.vLg,
            Icon(item['icon'] as IconData, color: item['color'] as Color, size: 48),
            AuraSpacing.vMd,
            Text(item['title'] as String, style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
            AuraSpacing.vSm,
            Text(item['desc'] as String, textAlign: TextAlign.center, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
            AuraSpacing.vLg,
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Purchased ${item['title']}! Item added to your Bag 🎒')));
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: EdgeInsets.zero,
                  shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
                ),
                child: Container(
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    gradient: AuraGradients.primary,
                    borderRadius: AuraRadius.brMd,
                    boxShadow: AuraShadows.neonViolet,
                  ),
                  child: Text('Purchase for ${item['price']}', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _storeItems.where((i) => i['category'] == _selectedCategory).toList();

    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Iconsax.arrow_left_2, color: AuraColors.textPrimary),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/profile');
            }
          },
        ),
        title: Text(
          'VIP Mall & Store',
          style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary),
        ),
        actions: [
          IconButton(
            icon: const Icon(Iconsax.bag_2, color: AuraColors.textPrimary),
            onPressed: () => context.push('/bag'),
          ),
          const SizedBox(width: 8),
        ],
        centerTitle: true,
      ),
      body: Column(
        children: [
          AuraSpacing.vMd,

          // Category Selector Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: _categories.map((cat) {
                final isSelected = _selectedCategory == cat;
                return GestureDetector(
                  onTap: () => setState(() => _selectedCategory = cat),
                  child: Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      gradient: isSelected ? AuraGradients.primary : null,
                      color: isSelected ? null : AuraColors.surfaceLight,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: isSelected ? Colors.transparent : AuraColors.border),
                      boxShadow: isSelected ? AuraShadows.neonViolet : [],
                    ),
                    child: Text(
                      cat,
                      style: AuraTypography.labelMedium.copyWith(
                        color: AuraColors.textPrimary,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          AuraSpacing.vLg,

          // Store Items Grid
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: filtered.length,
              separatorBuilder: (context, index) => AuraSpacing.vMd,
              itemBuilder: (context, index) {
                final item = filtered[index];

                return AuraSlideIn.right(
                  delay: Duration(milliseconds: index * 80),
                  child: ClipRRect(
                    borderRadius: AuraRadius.brLg,
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AuraColors.glassBg,
                          borderRadius: AuraRadius.brLg,
                          border: Border.all(color: AuraColors.glassBorder),
                        ),
                        child: Row(
                          children: [
                            AuraFloat(
                              duration: Duration(milliseconds: 1800 + (index * 200)),
                              child: Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: AuraColors.surface,
                                  borderRadius: AuraRadius.brMd,
                                  border: Border.all(color: item['color'] as Color),
                                ),
                                child: Icon(item['icon'] as IconData, color: item['color'] as Color, size: 28),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item['title'] as String,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    item['desc'] as String,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Valid: ${item['duration']}',
                                    style: AuraTypography.labelSmall.copyWith(color: AuraColors.primary),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            AuraBounceButton(
                              onTap: () => _buyItem(item),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                decoration: BoxDecoration(
                                  gradient: AuraGradients.primary,
                                  borderRadius: AuraRadius.brMd,
                                  boxShadow: AuraShadows.neonViolet,
                                ),
                                child: Text(
                                  item['price'] as String,
                                  style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
