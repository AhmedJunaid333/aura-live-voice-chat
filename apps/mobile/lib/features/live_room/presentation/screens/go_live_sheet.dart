import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/gradients.dart';
import '../../../../core/design_system/animations.dart';

class GoLiveSheet extends StatefulWidget {
  const GoLiveSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const GoLiveSheet(),
    );
  }

  @override
  State<GoLiveSheet> createState() => _GoLiveSheetState();
}

class _GoLiveSheetState extends State<GoLiveSheet> {
  String _selectedRoomType = 'Audio Room';
  String _selectedCategory = 'Music';
  String _selectedLayout = '10 Seats';
  final TextEditingController _titleController = TextEditingController(text: 'Grand Ballroom Live ✨');

  final List<Map<String, dynamic>> _roomTypes = [
    {'name': 'Audio Room', 'icon': Iconsax.microphone_2},
    {'name': 'Private Room', 'icon': Iconsax.lock},
    {'name': 'Family Room', 'icon': Iconsax.profile_2user},
    {'name': 'PK Room', 'icon': Iconsax.ranking},
  ];

  final List<String> _categories = ['Music', 'Chat', 'Gaming', 'ASMR', 'Dating'];

  final List<Map<String, dynamic>> _layouts = [
    {'name': '10 Seats', 'cols': 4, 'seats': 10},
    {'name': '15 Seats', 'cols': 4, 'seats': 15},
    {'name': '20 Seats', 'cols': 5, 'seats': 20},
  ];

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(36)),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          height: MediaQuery.of(context).size.height * 0.85,
          decoration: BoxDecoration(
            color: AuraColors.glassBg,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(36)),
            border: Border(top: BorderSide(color: AuraColors.glassBorder)),
            boxShadow: [
              BoxShadow(
                color: AuraColors.background.withOpacity(0.8),
                blurRadius: 30,
                offset: const Offset(0, -10),
              )
            ],
          ),
          child: Stack(
            children: [
              Column(
                children: [
                  // Handle
                  AuraSpacing.vSm,
                  Container(
                    width: 48,
                    height: 5,
                    decoration: BoxDecoration(
                      color: AuraColors.border,
                      borderRadius: AuraRadius.brPill,
                    ),
                  ),

                  // Header Row
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            'Go Live',
                            overflow: TextOverflow.ellipsis,
                            style: AuraTypography.headlineMedium.copyWith(color: AuraColors.textPrimary),
                          ),
                        ),
                        IconButton(
                          icon: Icon(Iconsax.close_circle, color: AuraColors.textSecondary),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                  ),

                  Divider(height: 1, color: AuraColors.border),

                  // Scrollable Options Content
                  Expanded(
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Room Type Selection
                          Text(
                            'ROOM TYPE',
                            style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, letterSpacing: 1.5),
                          ),
                          AuraSpacing.vSm,
                          GridView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: 12,
                              mainAxisSpacing: 12,
                              childAspectRatio: 1.6,
                            ),
                            itemCount: _roomTypes.length,
                            itemBuilder: (context, index) {
                              final type = _roomTypes[index];
                              final isSelected = _selectedRoomType == type['name'];
                              return GestureDetector(
                                onTap: () => setState(() => _selectedRoomType = type['name'] as String),
                                child: Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: isSelected ? AuraColors.primary.withOpacity(0.2) : AuraColors.surfaceLight,
                                    borderRadius: AuraRadius.brLg,
                                    border: Border.all(
                                      color: isSelected ? AuraColors.primary : AuraColors.border,
                                      width: isSelected ? 2 : 1,
                                    ),
                                    boxShadow: isSelected ? AuraShadows.neonViolet : [],
                                  ),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(type['icon'] as IconData, color: isSelected ? AuraColors.primary : AuraColors.textSecondary, size: 28),
                                      AuraSpacing.vXs,
                                      Text(
                                        type['name'] as String,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: AuraTypography.labelLarge.copyWith(color: isSelected ? AuraColors.primary : AuraColors.textPrimary),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),

                          AuraSpacing.vLg,

                          // Room Configuration
                          Text(
                            'ROOM CONFIGURATION',
                            style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, letterSpacing: 1.5),
                          ),
                          AuraSpacing.vSm,

                          // Category Chips Scroll
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
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
                                      borderRadius: AuraRadius.brPill,
                                      border: Border.all(color: isSelected ? Colors.transparent : AuraColors.border),
                                      boxShadow: isSelected ? AuraShadows.neonViolet : [],
                                    ),
                                    child: Text(
                                      cat,
                                      style: AuraTypography.labelMedium.copyWith(
                                        color: isSelected ? AuraColors.white : AuraColors.textSecondary,
                                      ),
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                          ),

                          AuraSpacing.vMd,

                          // Room Title Input
                          TextField(
                            controller: _titleController,
                            style: AuraTypography.bodyLarge.copyWith(color: AuraColors.textPrimary),
                            decoration: InputDecoration(
                              hintText: 'Enter Room Title...',
                              hintStyle: AuraTypography.bodyLarge.copyWith(color: AuraColors.textSecondary),
                              suffixIcon: Icon(Iconsax.edit, color: AuraColors.textSecondary, size: 18),
                              filled: true,
                              fillColor: AuraColors.surfaceLight,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                              border: UnderlineInputBorder(
                                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                                borderSide: BorderSide(color: AuraColors.primary, width: 2),
                              ),
                              enabledBorder: UnderlineInputBorder(
                                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                                borderSide: BorderSide(color: AuraColors.border, width: 2),
                              ),
                              focusedBorder: UnderlineInputBorder(
                                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                                borderSide: BorderSide(color: AuraColors.primary, width: 2),
                              ),
                            ),
                          ),

                          AuraSpacing.vLg,

                          // Room Layout Selector
                          Text(
                            'AUDIO ROOM SEATS LAYOUT',
                            style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, letterSpacing: 1.5),
                          ),
                          AuraSpacing.vSm,

                          Row(
                            children: _layouts.map((ly) {
                              final isSelected = _selectedLayout == ly['name'];
                              final seats = ly['seats'] as int;

                              return Expanded(
                                child: GestureDetector(
                                  onTap: () => setState(() => _selectedLayout = ly['name'] as String),
                                  child: Container(
                                    margin: const EdgeInsets.only(right: 8),
                                    padding: const EdgeInsets.symmetric(vertical: 14),
                                    decoration: BoxDecoration(
                                      color: isSelected ? AuraColors.primary.withOpacity(0.2) : AuraColors.surfaceLight,
                                      borderRadius: AuraRadius.brLg,
                                      border: Border.all(
                                        color: isSelected ? AuraColors.primary : AuraColors.border,
                                        width: isSelected ? 2 : 1,
                                      ),
                                      boxShadow: isSelected ? AuraShadows.neonViolet : [],
                                    ),
                                    child: Column(
                                      children: [
                                        Icon(
                                          Iconsax.element_plus,
                                          color: isSelected ? AuraColors.primary : AuraColors.textSecondary,
                                          size: 24,
                                        ),
                                        AuraSpacing.vXs,
                                        Text(
                                          '$seats Seats',
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: AuraTypography.labelMedium.copyWith(
                                            color: isSelected ? AuraColors.primary : AuraColors.textSecondary,
                                          ),
                                        )
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            }).toList(),
                          ),

                          const SizedBox(height: 80),
                        ],
                      ),
                    ),
                  ),
                ],
              ),

              // Footer Start Live Button Action Bar
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: ClipRRect(
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AuraColors.glassBg,
                        border: Border(top: BorderSide(color: AuraColors.glassBorder)),
                      ),
                      child: SizedBox(
                        width: double.infinity,
                        height: 54,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: AuraGradients.primary,
                            borderRadius: AuraRadius.brPill,
                            boxShadow: AuraShadows.neonViolet,
                          ),
                          child: ElevatedButton.icon(
                            onPressed: () {
                              final selectedObj = _layouts.firstWhere((l) => l['name'] == _selectedLayout, orElse: () => _layouts.first);
                              final seatCount = selectedObj['seats'] as int;

                              Navigator.pop(context);
                              context.push('/audio-meetup?seats=$seatCount');
                            },
                            icon: Icon(Iconsax.flash, color: AuraColors.white, size: 22),
                            label: Text(
                              'Start Audio Broadcast',
                              style: AuraTypography.titleMedium.copyWith(color: AuraColors.white),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              shape: RoundedRectangleBorder(borderRadius: AuraRadius.brPill),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
