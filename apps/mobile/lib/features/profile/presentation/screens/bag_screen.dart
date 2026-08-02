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

class BagScreen extends StatefulWidget {
  const BagScreen({super.key});

  @override
  State<BagScreen> createState() => _BagScreenState();
}

class _BagScreenState extends State<BagScreen> {
  final List<Map<String, dynamic>> _bagItems = [
    {
      'title': 'Golden Phantom Rolls 🚗',
      'type': 'Vehicle',
      'equipped': true,
      'expiry': '28 Days Left',
      'icon': Iconsax.car,
      'color': AuraColors.accent,
    },
    {
      'title': 'Royal Crown Frame 👑',
      'type': 'Room Frame',
      'equipped': true,
      'expiry': '14 Days Left',
      'icon': Iconsax.ruler,
      'color': AuraColors.secondary,
    },
    {
      'title': 'Gold Royalty Bubble 💬',
      'type': 'Chat Bubble',
      'equipped': false,
      'expiry': '30 Days Left',
      'icon': Iconsax.message,
      'color': AuraColors.primary,
    },
  ];

  @override
  Widget build(BuildContext context) {
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
          'My Bag (Inventory)',
          style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary),
        ),
        centerTitle: true,
      ),
      body: _bagItems.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Iconsax.bag_2, color: AuraColors.textSecondary, size: 64),
                  AuraSpacing.vMd,
                  Text('Your Bag is Empty', style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary)),
                  Text('Visit the VIP Store to acquire luxury items!', style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary)),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: _bagItems.length,
              separatorBuilder: (context, index) => AuraSpacing.vMd,
              itemBuilder: (context, index) {
                final item = _bagItems[index];
                final isEquipped = item['equipped'] == true;

                return ClipRRect(
                  borderRadius: AuraRadius.brLg,
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                    child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AuraColors.glassBg,
                        borderRadius: AuraRadius.brLg,
                        border: Border.all(color: isEquipped ? AuraColors.primary : AuraColors.glassBorder, width: isEquipped ? 2 : 1),
                        boxShadow: isEquipped ? AuraShadows.neonViolet : [],
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AuraColors.surface,
                              borderRadius: AuraRadius.brMd,
                              border: Border.all(color: item['color'] as Color),
                            ),
                            child: Icon(item['icon'] as IconData, color: item['color'] as Color, size: 28),
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
                                  '${item['type']} • ${item['expiry']}',
                                  style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          ElevatedButton(
                            onPressed: () {
                              setState(() => item['equipped'] = !isEquipped);
                              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(isEquipped ? 'Unequipped ${item['title']}' : 'Equipped ${item['title']}! ✨')));
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              padding: EdgeInsets.zero,
                              shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
                            ),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              decoration: BoxDecoration(
                                gradient: isEquipped ? null : AuraGradients.primary,
                                color: isEquipped ? AuraColors.surfaceLight : null,
                                borderRadius: AuraRadius.brMd,
                                border: isEquipped ? Border.all(color: AuraColors.border) : null,
                                boxShadow: isEquipped ? [] : AuraShadows.neonViolet,
                              ),
                              child: Text(
                                isEquipped ? 'Unequip' : 'Equip',
                                style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
