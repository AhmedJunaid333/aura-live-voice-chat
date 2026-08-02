import 'dart:math';
import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import '../colors.dart';
import '../typography.dart';
import '../spacing.dart';
import '../radius.dart';
import '../shadows.dart';
import '../gradients.dart';

class AuraAvatar extends StatelessWidget {
  final String imageUrl;
  final double size;
  final bool isOnline;
  final bool isVip;
  final int? level;

  const AuraAvatar({
    super.key,
    required this.imageUrl,
    this.size = 48,
    this.isOnline = false,
    this.isVip = false,
    this.level,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size + (isVip ? 8 : 0),
      height: size + (isVip ? 8 : 0),
      child: Stack(
        alignment: Alignment.center,
        clipBehavior: Clip.none,
        children: [
          Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AuraColors.surfaceLight,
              border: isVip ? Border.all(color: AuraColors.gold, width: 2) : null,
              image: imageUrl.isNotEmpty
                  ? DecorationImage(
                      image: NetworkImage(imageUrl),
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
            child: imageUrl.isEmpty
                ? Icon(Iconsax.user, size: size * 0.5, color: AuraColors.textSecondary)
                : null,
          ),
          if (isOnline)
            Positioned(
              bottom: isVip ? 2 : 0,
              right: isVip ? 2 : 0,
              child: Container(
                width: size * 0.25,
                height: size * 0.25,
                decoration: BoxDecoration(
                  color: AuraColors.success,
                  shape: BoxShape.circle,
                  border: Border.all(color: AuraColors.background, width: 2),
                ),
              ),
            ),
          if (level != null)
            Positioned(
              bottom: -8,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  gradient: AuraGradients.primary,
                  borderRadius: AuraRadius.brPill,
                ),
                child: Text(
                  'Lv.$level',
                  style: AuraTypography.badge.copyWith(color: AuraColors.white, fontSize: 8),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class AuraHostFrame extends StatefulWidget {
  final Widget child;
  final double size;

  const AuraHostFrame({
    super.key,
    required this.child,
    this.size = 64,
  });

  @override
  State<AuraHostFrame> createState() => _AuraHostFrameState();
}

class _AuraHostFrameState extends State<AuraHostFrame> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          AnimatedBuilder(
            animation: _controller,
            builder: (_, child) {
              return Transform.rotate(
                angle: _controller.value * 2 * pi,
                child: Container(
                  width: widget.size,
                  height: widget.size,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: SweepGradient(
                      colors: [
                        AuraColors.neonGold,
                        AuraColors.neonRose,
                        AuraColors.neonCyan,
                        AuraColors.neonGold,
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
          Container(
            width: widget.size - 6,
            height: widget.size - 6,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: AuraColors.background,
            ),
            padding: const EdgeInsets.all(2),
            child: widget.child,
          ),
        ],
      ),
    );
  }
}

class AuraGuestSeat extends StatelessWidget {
  final bool isOccupied;
  final String? imageUrl;
  final VoidCallback? onTap;
  final double size;

  const AuraGuestSeat({
    super.key,
    this.isOccupied = false,
    this.imageUrl,
    this.onTap,
    this.size = 48,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: AuraColors.surfaceLight,
          border: Border.all(color: AuraColors.glassBorder),
        ),
        child: isOccupied && imageUrl != null
            ? ClipOval(
                child: Image.network(imageUrl!, fit: BoxFit.cover),
              )
            : Icon(
                Iconsax.add,
                color: AuraColors.textSecondary,
                size: size * 0.5,
              ),
      ),
    );
  }
}
