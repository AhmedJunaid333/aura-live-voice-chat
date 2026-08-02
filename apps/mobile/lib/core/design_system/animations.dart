import 'dart:math';
import 'package:flutter/material.dart';

/// Auralive Design System — Animation Engine
/// Complete animation system with entrance, continuous, and effect animations.

// ─── Duration Constants ────────────────────────────────────────
abstract final class AuraDuration {
  static const Duration instant = Duration(milliseconds: 100);
  static const Duration fast = Duration(milliseconds: 200);
  static const Duration normal = Duration(milliseconds: 350);
  static const Duration slow = Duration(milliseconds: 500);
  static const Duration slower = Duration(milliseconds: 700);
  static const Duration slowest = Duration(milliseconds: 1000);
  static const Duration pulse = Duration(milliseconds: 1500);
  static const Duration float = Duration(milliseconds: 2000);
  static const Duration shimmer = Duration(milliseconds: 2500);
  static const Duration rotate = Duration(seconds: 8);
}

// ─── Curve Constants ───────────────────────────────────────────
abstract final class AuraCurves {
  static const Curve smooth = Curves.easeInOut;
  static const Curve enter = Curves.easeOutCubic;
  static const Curve exit = Curves.easeInCubic;
  static const Curve bounce = Curves.elasticOut;
  static const Curve spring = Curves.easeOutBack;
  static const Curve decelerate = Curves.decelerate;
}

// ═══════════════════════════════════════════════════════════════
// 1. ENTRANCE ANIMATIONS
// ═══════════════════════════════════════════════════════════════

/// AuraFadeIn — Fade entrance animation
class AuraFadeIn extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final Duration delay;
  final Curve curve;

  const AuraFadeIn({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 500),
    this.delay = Duration.zero,
    this.curve = Curves.easeOut,
  });

  @override
  State<AuraFadeIn> createState() => _AuraFadeInState();
}

class _AuraFadeInState extends State<AuraFadeIn> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration);
    _opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: widget.curve),
    );
    _start();
  }

  Future<void> _start() async {
    if (widget.delay > Duration.zero) {
      await Future.delayed(widget.delay);
    }
    if (mounted) _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => FadeTransition(opacity: _opacity, child: widget.child);
}

/// AuraScaleIn — Scale entrance animation
class AuraScaleIn extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final Duration delay;
  final double beginScale;
  final Curve curve;

  const AuraScaleIn({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 500),
    this.delay = Duration.zero,
    this.beginScale = 0.8,
    this.curve = Curves.easeOutBack,
  });

  @override
  State<AuraScaleIn> createState() => _AuraScaleInState();
}

class _AuraScaleInState extends State<AuraScaleIn> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scale;
  late Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration);
    _scale = Tween<double>(begin: widget.beginScale, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: widget.curve),
    );
    _opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _start();
  }

  Future<void> _start() async {
    if (widget.delay > Duration.zero) await Future.delayed(widget.delay);
    if (mounted) _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _opacity,
      child: ScaleTransition(scale: _scale, child: widget.child),
    );
  }
}

/// AuraSlideIn — Slide entrance animation from any direction
class AuraSlideIn extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final Duration delay;
  final Offset beginOffset;
  final Curve curve;

  const AuraSlideIn({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 500),
    this.delay = Duration.zero,
    this.beginOffset = const Offset(0, 0.15),
    this.curve = Curves.easeOutCubic,
  });

  /// Slide from bottom
  const AuraSlideIn.up({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 500),
    this.delay = Duration.zero,
    this.curve = Curves.easeOutCubic,
  }) : beginOffset = const Offset(0, 0.2);

  /// Slide from right
  const AuraSlideIn.left({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 500),
    this.delay = Duration.zero,
    this.curve = Curves.easeOutCubic,
  }) : beginOffset = const Offset(0.2, 0);

  /// Slide from left
  const AuraSlideIn.right({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 500),
    this.delay = Duration.zero,
    this.curve = Curves.easeOutCubic,
  }) : beginOffset = const Offset(-0.2, 0);

  @override
  State<AuraSlideIn> createState() => _AuraSlideInState();
}

class _AuraSlideInState extends State<AuraSlideIn> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _slide;
  late Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration);
    _slide = Tween<Offset>(begin: widget.beginOffset, end: Offset.zero).animate(
      CurvedAnimation(parent: _controller, curve: widget.curve),
    );
    _opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _start();
  }

  Future<void> _start() async {
    if (widget.delay > Duration.zero) await Future.delayed(widget.delay);
    if (mounted) _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _opacity,
      child: SlideTransition(position: _slide, child: widget.child),
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// 2. CONTINUOUS ANIMATIONS
// ═══════════════════════════════════════════════════════════════

/// AuraPulse — Continuous pulsing scale animation
class AuraPulse extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final double minScale;
  final double maxScale;

  const AuraPulse({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 1500),
    this.minScale = 0.95,
    this.maxScale = 1.05,
  });

  @override
  State<AuraPulse> createState() => _AuraPulseState();
}

class _AuraPulseState extends State<AuraPulse> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration)..repeat(reverse: true);
    _scale = Tween<double>(begin: widget.minScale, end: widget.maxScale).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => ScaleTransition(scale: _scale, child: widget.child);
}

/// AuraGlow — Animated neon glow border effect
class AuraGlow extends StatefulWidget {
  final Widget child;
  final Color glowColor;
  final double maxRadius;
  final Duration duration;

  const AuraGlow({
    super.key,
    required this.child,
    this.glowColor = const Color(0xFF6C5CE7),
    this.maxRadius = 20,
    this.duration = const Duration(milliseconds: 1500),
  });

  @override
  State<AuraGlow> createState() => _AuraGlowState();
}

class _AuraGlowState extends State<AuraGlow> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _blur;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration)..repeat(reverse: true);
    _blur = Tween<double>(begin: widget.maxRadius * 0.4, end: widget.maxRadius).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _blur,
      builder: (context, child) {
        return Container(
          decoration: BoxDecoration(
            boxShadow: [
              BoxShadow(
                color: widget.glowColor.withValues(alpha: 0.4),
                blurRadius: _blur.value,
                spreadRadius: 1,
              ),
            ],
          ),
          child: widget.child,
        );
      },
    );
  }
}

/// AuraFloat — Up/down floating animation
class AuraFloat extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final double distance;

  const AuraFloat({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 2000),
    this.distance = 6,
  });

  @override
  State<AuraFloat> createState() => _AuraFloatState();
}

class _AuraFloatState extends State<AuraFloat> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _offset;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration)..repeat(reverse: true);
    _offset = Tween<double>(begin: -widget.distance, end: widget.distance).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _offset,
      builder: (context, child) {
        return Transform.translate(offset: Offset(0, _offset.value), child: widget.child);
      },
    );
  }
}

/// AuraBounce — Touch press bounce feedback
class AuraBounce extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final double scaleDown;

  const AuraBounce({
    super.key,
    required this.child,
    this.onTap,
    this.scaleDown = 0.94,
  });

  @override
  State<AuraBounce> createState() => _AuraBounceState();
}

class _AuraBounceState extends State<AuraBounce> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
      reverseDuration: const Duration(milliseconds: 150),
    );
    _scale = Tween<double>(begin: 1.0, end: widget.scaleDown).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) {
        _controller.reverse();
        widget.onTap?.call();
      },
      onTapCancel: () => _controller.reverse(),
      child: ScaleTransition(scale: _scale, child: widget.child),
    );
  }
}

/// AuraRotate — Continuous 360° rotation
class AuraRotate extends StatefulWidget {
  final Widget child;
  final Duration duration;

  const AuraRotate({
    super.key,
    required this.child,
    this.duration = const Duration(seconds: 8),
  });

  @override
  State<AuraRotate> createState() => _AuraRotateState();
}

class _AuraRotateState extends State<AuraRotate> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration)..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => RotationTransition(turns: _controller, child: widget.child);
}

// ═══════════════════════════════════════════════════════════════
// 3. EFFECT ANIMATIONS
// ═══════════════════════════════════════════════════════════════

/// AuraShimmer — Luxury metallic shimmer/shine sweep
class AuraShimmer extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final List<Color>? colors;

  const AuraShimmer({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 2500),
    this.colors,
  });

  @override
  State<AuraShimmer> createState() => _AuraShimmerState();
}

class _AuraShimmerState extends State<AuraShimmer> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration)..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = widget.colors ??
        const [
          Color(0x00FFFFFF),
          Color(0x99FFFDF5),
          Color(0xFFD4AF37),
          Color(0x99FFFDF5),
          Color(0x00FFFFFF),
        ];

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return ShaderMask(
          blendMode: BlendMode.srcATop,
          shaderCallback: (bounds) {
            return LinearGradient(
              colors: colors,
              stops: const [0.0, 0.35, 0.5, 0.65, 1.0],
              begin: Alignment(-2.0 + (_controller.value * 4.0), -1.0),
              end: Alignment(-1.0 + (_controller.value * 4.0), 1.0),
            ).createShader(bounds);
          },
          child: widget.child,
        );
      },
    );
  }
}

/// AuraRipple — Expanding ripple effect (e.g. for live indicators)
class AuraRipple extends StatefulWidget {
  final Widget child;
  final Color rippleColor;
  final double maxRadius;
  final Duration duration;

  const AuraRipple({
    super.key,
    required this.child,
    this.rippleColor = const Color(0xFFEF4444),
    this.maxRadius = 30,
    this.duration = const Duration(milliseconds: 1500),
  });

  @override
  State<AuraRipple> createState() => _AuraRippleState();
}

class _AuraRippleState extends State<AuraRipple> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration)..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          painter: _RipplePainter(
            progress: _controller.value,
            color: widget.rippleColor,
            maxRadius: widget.maxRadius,
          ),
          child: widget.child,
        );
      },
    );
  }
}

class _RipplePainter extends CustomPainter {
  final double progress;
  final Color color;
  final double maxRadius;

  _RipplePainter({required this.progress, required this.color, required this.maxRadius});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final baseRadius = min(size.width, size.height) / 2;
    for (int i = 0; i < 3; i++) {
      final p = (progress + i * 0.33) % 1.0;
      final radius = baseRadius + (maxRadius * p);
      final opacity = (1.0 - p).clamp(0.0, 1.0) * 0.3;
      final paint = Paint()
        ..color = color.withValues(alpha: opacity)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;
      canvas.drawCircle(center, radius, paint);
    }
  }

  @override
  bool shouldRepaint(_RipplePainter old) => old.progress != progress;
}

// ═══════════════════════════════════════════════════════════════
// 4. PAGE TRANSITIONS
// ═══════════════════════════════════════════════════════════════

/// Custom page route with fade + slide transition
class AuraPageRoute<T> extends PageRouteBuilder<T> {
  AuraPageRoute({required WidgetBuilder builder})
      : super(
          pageBuilder: (context, animation, secondaryAnimation) => builder(context),
          transitionDuration: const Duration(milliseconds: 350),
          reverseTransitionDuration: const Duration(milliseconds: 300),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            final curvedAnimation = CurvedAnimation(
              parent: animation,
              curve: Curves.easeOutCubic,
              reverseCurve: Curves.easeInCubic,
            );
            return FadeTransition(
              opacity: curvedAnimation,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0.05, 0),
                  end: Offset.zero,
                ).animate(curvedAnimation),
                child: child,
              ),
            );
          },
        );
}

// ═══════════════════════════════════════════════════════════════
// 5. STAGGER LIST BUILDER
// ═══════════════════════════════════════════════════════════════

/// Builds staggered entrance animations for list items
class AuraStaggerList extends StatelessWidget {
  final int itemCount;
  final Widget Function(BuildContext context, int index, Duration delay) builder;
  final Duration baseDelay;
  final Duration staggerDelay;

  const AuraStaggerList({
    super.key,
    required this.itemCount,
    required this.builder,
    this.baseDelay = Duration.zero,
    this.staggerDelay = const Duration(milliseconds: 80),
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(itemCount, (index) {
        final delay = baseDelay + staggerDelay * index;
        return builder(context, index, delay);
      }),
    );
  }
}
