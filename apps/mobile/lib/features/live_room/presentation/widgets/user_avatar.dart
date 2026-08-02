import 'package:flutter/material.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/shadows.dart';

class UserAvatarWidget extends StatelessWidget {
  final String name;
  final bool isSpeaking;

  const UserAvatarWidget({super.key, required this.name, this.isSpeaking = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(
          color: isSpeaking ? AuraColors.primary : Colors.transparent,
          width: 3,
        ),
        boxShadow: isSpeaking ? AuraShadows.neonViolet : [],
      ),
      child: CircleAvatar(
        radius: 24,
        backgroundColor: AuraColors.surfaceLight,
        child: Text(
          name.isNotEmpty ? name[0].toUpperCase() : 'U',
          style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary),
        ),
      ),
    );
  }
}
