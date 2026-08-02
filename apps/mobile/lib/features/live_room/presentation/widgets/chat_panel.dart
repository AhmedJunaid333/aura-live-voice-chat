import 'dart:ui';
import 'package:flutter/material.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/animations.dart';

class ChatPanelWidget extends StatelessWidget {
  final List<String> messages;

  const ChatPanelWidget({super.key, required this.messages});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: messages.length,
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 4.0),
          child: AuraSlideIn.right(
            child: ClipRRect(
              borderRadius: AuraRadius.brLg,
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AuraColors.glassBg,
                    borderRadius: AuraRadius.brLg,
                    border: Border.all(color: AuraColors.glassBorder),
                  ),
                  child: Text(
                    messages[index],
                    style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
