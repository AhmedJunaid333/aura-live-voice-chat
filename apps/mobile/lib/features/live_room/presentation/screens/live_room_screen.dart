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

class LiveRoomScreen extends StatefulWidget {
  final String roomId;
  const LiveRoomScreen({super.key, required this.roomId});

  @override
  State<LiveRoomScreen> createState() => _LiveRoomScreenState();
}

class _LiveRoomScreenState extends State<LiveRoomScreen> {
  bool _isMicOn = false;
  final List<Map<String, dynamic>> _seats = [
    {'id': 1, 'name': 'Luna', 'active': true, 'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format', 'speaking': false},
    {'id': 2, 'name': 'Cyber', 'active': true, 'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format', 'speaking': true},
    {'id': 3, 'name': 'Nova', 'active': false, 'avatar': '', 'speaking': false},
    {'id': 4, 'name': 'Void', 'active': true, 'avatar': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&auto=format', 'speaking': false},
    {'id': 5, 'name': 'Zen', 'active': false, 'avatar': '', 'speaking': false},
    {'id': 6, 'name': 'Pixel', 'active': true, 'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format', 'speaking': false},
    {'id': 7, 'name': 'Mars', 'active': false, 'avatar': '', 'speaking': false},
    {'id': 8, 'name': 'Aria', 'active': true, 'avatar': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format', 'speaking': false},
    {'id': 9, 'name': 'Odin', 'active': false, 'avatar': '', 'speaking': false},
    {'id': 10, 'name': 'Volt', 'active': false, 'avatar': '', 'speaking': false},
    {'id': 11, 'name': 'Echo', 'active': false, 'avatar': '', 'speaking': false},
    {'id': 12, 'name': 'Jade', 'active': false, 'avatar': '', 'speaking': false},
    {'id': 13, 'name': 'Link', 'active': false, 'avatar': '', 'speaking': false},
    {'id': 14, 'name': 'Meta', 'active': false, 'avatar': '', 'speaking': false},
    {'id': 15, 'name': 'Neon', 'active': false, 'avatar': '', 'speaking': false},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: AuraColors.primary, width: 2),
            ),
            child: const ClipOval(
              child: Image(
                image: NetworkImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format'),
                fit: BoxFit.cover,
              ),
            ),
          ),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Live Broadcast', style: AuraTypography.headlineSmall.copyWith(color: AuraColors.primary)),
            Row(
              children: [
                Container(
                  width: 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: AuraColors.error,
                    shape: BoxShape.circle,
                    boxShadow: AuraShadows.neonRose,
                  ),
                ),
                AuraSpacing.hXs,
                Flexible(
                  child: Text(
                    'TECH & FUTURE',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, letterSpacing: 1),
                  ),
                ),
              ],
            )
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Iconsax.close_circle, color: AuraColors.textSecondary),
            onPressed: () => context.pop(),
          ),
        ],
      ),
      body: Stack(
        children: [
          // Background Ambient Light Glare
          Positioned(
            top: -50,
            left: -50,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AuraColors.primary.withValues(alpha: 0.1),
                boxShadow: [BoxShadow(color: AuraColors.primary.withValues(alpha: 0.2), blurRadius: 80)],
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
                boxShadow: [BoxShadow(color: AuraColors.secondary.withValues(alpha: 0.25), blurRadius: 80)],
              ),
            ),
          ),

          Column(
            children: [
              // 15 Seats Grid
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: AuraFadeIn(
                    child: GridView.builder(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 5,
                        crossAxisSpacing: 8,
                        mainAxisSpacing: 8,
                        childAspectRatio: 0.68,
                      ),
                      itemCount: _seats.length,
                      itemBuilder: (context, index) {
                        final seat = _seats[index];
                        final isActive = seat['active'] as bool;
                        final isSpeaking = seat['speaking'] as bool;
                    
                        return Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Stack(
                              clipBehavior: Clip.none,
                              alignment: Alignment.center,
                              children: [
                                Container(
                                  width: 48,
                                  height: 48,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: isSpeaking
                                          ? AuraColors.primary
                                          : (isActive ? AuraColors.primary.withValues(alpha: 0.4) : AuraColors.border),
                                      width: isSpeaking ? 2.5 : 1.5,
                                    ),
                                    boxShadow: isSpeaking
                                        ? AuraShadows.neonViolet
                                        : [],
                                  ),
                                  child: isActive
                                      ? ClipOval(
                                          child: Image(
                                            image: NetworkImage(seat['avatar'] as String),
                                            fit: BoxFit.cover,
                                          ),
                                        )
                                      : Icon(Iconsax.add, color: AuraColors.textSecondary.withValues(alpha: 0.5), size: 20),
                                ),
                    
                                // Speaker Wave Animation Pill
                                if (isSpeaking)
                                  Positioned(
                                    bottom: -4,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                      decoration: BoxDecoration(
                                        color: AuraColors.primary,
                                        borderRadius: AuraRadius.brSm,
                                        boxShadow: AuraShadows.neonViolet,
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(Iconsax.audio_square, color: AuraColors.white, size: 10),
                                        ],
                                      ),
                                    ),
                                  ),
                    
                                // Seat Number Pill
                                if (!isActive)
                                  Positioned(
                                    bottom: -2,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                      decoration: BoxDecoration(
                                        color: AuraColors.surfaceLight,
                                        borderRadius: AuraRadius.brSm,
                                        border: Border.all(color: AuraColors.border),
                                      ),
                                      child: Text(
                                        '${seat['id']}',
                                        style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, fontSize: 8),
                                      ),
                                    ),
                                  )
                              ],
                            ),
                            AuraSpacing.vXs,
                            FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Text(
                                seat['name'] as String,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: AuraTypography.bodySmall.copyWith(
                                  color: isActive ? AuraColors.textPrimary : AuraColors.textSecondary,
                                  fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                          ],
                        );
                      },
                    ),
                  ),
                ),
              ),

              // Live Room Interactive Actions & Messages Area
              AuraSlideIn.up(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: ClipRRect(
                    borderRadius: AuraRadius.brXl,
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AuraColors.glassBg,
                          borderRadius: AuraRadius.brXl,
                          border: Border.all(color: AuraColors.glassBorder),
                        ),
                        child: Row(
                          children: [
                            // Input Chat Pill
                            Expanded(
                              child: Container(
                                height: 44,
                                padding: const EdgeInsets.symmetric(horizontal: 14),
                                decoration: BoxDecoration(
                                  color: AuraColors.surfaceLight,
                                  borderRadius: AuraRadius.brLg,
                                  border: Border.all(color: AuraColors.border),
                                ),
                                child: TextField(
                                  style: AuraTypography.bodyMedium,
                                  decoration: InputDecoration(
                                    hintText: 'Say something nice...',
                                    hintStyle: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                                    border: InputBorder.none,
                                  ),
                                ),
                              ),
                            ),
                            AuraSpacing.hSm,
                    
                            // Gift Action Button
                            GestureDetector(
                              onTap: () {},
                              child: Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: AuraGradients.primary,
                                  boxShadow: AuraShadows.neonViolet,
                                ),
                                child: Icon(Iconsax.gift, color: AuraColors.white, size: 20),
                              ),
                            ),
                            AuraSpacing.hSm,
                    
                            // Mic Toggle Button
                            GestureDetector(
                              onTap: () => setState(() => _isMicOn = !_isMicOn),
                              child: Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: _isMicOn ? AuraColors.success : AuraColors.surfaceLight,
                                  border: Border.all(color: AuraColors.border),
                                ),
                                child: Icon(
                                  _isMicOn ? Iconsax.microphone_2 : Iconsax.microphone_slash,
                                  color: AuraColors.white,
                                  size: 20,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              )
            ],
          )
        ],
      ),
    );
  }
}
