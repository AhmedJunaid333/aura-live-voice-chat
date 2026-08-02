import 'dart:math';
import 'package:flutter/material.dart';
import '../colors.dart';
import '../radius.dart';
import '../gradients.dart';

class AuraLoadingSpinner extends StatefulWidget {
  final double size;

  const AuraLoadingSpinner({
    super.key,
    this.size = 48,
  });

  @override
  State<AuraLoadingSpinner> createState() => _AuraLoadingSpinnerState();
}

class _AuraLoadingSpinnerState extends State<AuraLoadingSpinner> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
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
      child: AnimatedBuilder(
        animation: _controller,
        builder: (_, child) {
          return Transform.rotate(
            angle: _controller.value * 2 * pi,
            child: child,
          );
        },
        child: Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: SweepGradient(
              colors: [
                AuraColors.primary.withValues(alpha: 0),
                AuraColors.primary,
              ],
            ),
          ),
          padding: const EdgeInsets.all(4),
          child: Container(
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: AuraColors.background,
            ),
          ),
        ),
      ),
    );
  }
}

class AuraSkeletonLoader extends StatefulWidget {
  final double width;
  final double height;
  final BorderRadiusGeometry? borderRadius;

  const AuraSkeletonLoader({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius,
  });

  @override
  State<AuraSkeletonLoader> createState() => _AuraSkeletonLoaderState();
}

class _AuraSkeletonLoaderState extends State<AuraSkeletonLoader> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Color?> _colorAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    
    _colorAnimation = ColorTween(
      begin: AuraColors.surfaceLight,
      end: AuraColors.surfaceElevated,
    ).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _colorAnimation,
      builder: (_, __) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            color: _colorAnimation.value,
            borderRadius: widget.borderRadius ?? AuraRadius.brMd,
          ),
        );
      },
    );
  }
}

class AuraProgressBar extends StatelessWidget {
  final double progress; // 0.0 to 1.0
  final double height;
  final bool animate;

  const AuraProgressBar({
    super.key,
    required this.progress,
    this.height = 8,
    this.animate = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: double.infinity,
      decoration: BoxDecoration(
        color: AuraColors.surfaceLight,
        borderRadius: AuraRadius.brPill,
      ),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final width = constraints.maxWidth * progress.clamp(0.0, 1.0);
          
          Widget bar = Container(
            width: width,
            height: height,
            decoration: BoxDecoration(
              gradient: AuraGradients.primary,
              borderRadius: AuraRadius.brPill,
            ),
          );

          if (animate) {
            bar = AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeOut,
              width: width,
              height: height,
              decoration: BoxDecoration(
                gradient: AuraGradients.primary,
                borderRadius: AuraRadius.brPill,
              ),
            );
          }

          return Stack(
            children: [bar],
          );
        },
      ),
    );
  }
}
