import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import '../../domain/seat_entity.dart';
import 'user_avatar.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/animations.dart';

class SeatGridWidget extends StatelessWidget {
  final List<SeatEntity> seats;
  final Function(int seatIndex) onSeatTap;

  const SeatGridWidget({super.key, required this.seats, required this.onSeatTap});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.9,
      ),
      itemCount: 9,
      itemBuilder: (context, index) {
        final seat = index < seats.length ? seats[index] : SeatEntity(seatIndex: index, status: SeatStatus.empty, isMuted: false);
        final isOccupied = seat.status == SeatStatus.speaking || seat.status == SeatStatus.muted;

        return AuraFadeIn(
          delay: Duration(milliseconds: 50 * index),
          child: GestureDetector(
            onTap: () => onSeatTap(index),
            child: ClipRRect(
              borderRadius: AuraRadius.brLg,
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                child: Container(
                  decoration: BoxDecoration(
                    color: AuraColors.glassBg,
                    borderRadius: AuraRadius.brLg,
                    border: Border.all(color: isOccupied ? AuraColors.primary : AuraColors.glassBorder),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (isOccupied)
                        UserAvatarWidget(name: seat.userName ?? 'User', isSpeaking: seat.status == SeatStatus.speaking)
                      else
                        Icon(
                          seat.status == SeatStatus.requested ? Iconsax.timer_1 : Iconsax.add,
                          color: AuraColors.textSecondary.withValues(alpha: 0.5),
                          size: 28,
                        ),
                      AuraSpacing.vXs,
                      Text(
                        isOccupied ? (seat.userName ?? 'Speaker') : 'Seat ${index + 1}',
                        style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary),
                      ),
                    ],
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
