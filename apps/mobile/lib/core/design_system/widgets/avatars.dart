import 'dart:io';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import '../colors.dart';
import '../typography.dart';
import '../radius.dart';
import '../gradients.dart';

/// Universal Avatar Image Widget supporting both Network HTTP URLs and Local File Paths
class AuraAvatarImage extends StatelessWidget {
  final String? avatarUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final Widget? fallback;

  const AuraAvatarImage({
    super.key,
    this.avatarUrl,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.fallback,
  });

  @override
  Widget build(BuildContext context) {
    final defaultFallback = fallback ??
        Container(
          color: AuraColors.surface,
          child: Center(
            child: Icon(
              Iconsax.user,
              color: AuraColors.primary,
              size: (width != null && width! > 0) ? width! * 0.48 : 36,
            ),
          ),
        );

    if (avatarUrl == null || avatarUrl!.trim().isEmpty) {
      return SizedBox(width: width, height: height, child: defaultFallback);
    }

    final url = avatarUrl!.trim();

    // 1. Check Network URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return Image.network(
        url,
        width: width,
        height: height,
        fit: fit,
        errorBuilder: (context, error, stackTrace) =>
            SizedBox(width: width, height: height, child: defaultFallback),
      );
    }

    // 2. Check Local File Path (from Camera/Gallery image picker)
    try {
      final cleanPath = url.startsWith('file://') ? Uri.parse(url).path : url;
      final file = File(cleanPath);
      if (file.existsSync()) {
        return Image.file(
          file,
          width: width,
          height: height,
          fit: fit,
          errorBuilder: (context, error, stackTrace) =>
              SizedBox(width: width, height: height, child: defaultFallback),
        );
      }
    } catch (_) {}

    // 3. Fallback to network or default
    return Image.network(
      url,
      width: width,
      height: height,
      fit: fit,
      errorBuilder: (context, error, stackTrace) =>
          SizedBox(width: width, height: height, child: defaultFallback),
    );
  }
}

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
            ),
            child: ClipOval(
              child: AuraAvatarImage(
                avatarUrl: imageUrl,
                width: size,
                height: size,
                fit: BoxFit.cover,
              ),
            ),
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
                child: AuraAvatarImage(
                  avatarUrl: imageUrl,
                  width: size,
                  height: size,
                  fit: BoxFit.cover,
                ),
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
