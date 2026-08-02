import 'package:flutter/material.dart';

/// 1. AuraPulse - Glowing / Pulsing scale animation
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
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration)..repeat(reverse: true);
    _scaleAnimation = Tween<double>(begin: widget.minScale, end: widget.maxScale).animate(
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
    return ScaleTransition(
      scale: _scaleAnimation,
      child: widget.child,
    );
  }
}

/// 2. AuraFloat - Up and down floating animation for cars, crowns & chests
class AuraFloat extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final double offsetDistance;

  const AuraFloat({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 2000),
    this.offsetDistance = 6.0,
  });

  @override
  State<AuraFloat> createState() => _AuraFloatState();
}

class _AuraFloatState extends State<AuraFloat> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _offsetAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration)..repeat(reverse: true);
    _offsetAnimation = Tween<double>(begin: -widget.offsetDistance, end: widget.offsetDistance).animate(
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
      animation: _offsetAnimation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _offsetAnimation.value),
          child: widget.child,
        );
      },
    );
  }
}

/// 3. AuraBounceButton - Touch press compression bounce wrapper
class AuraBounceButton extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final double scaleDown;

  const AuraBounceButton({
    super.key,
    required this.child,
    this.onTap,
    this.scaleDown = 0.94,
  });

  @override
  State<AuraBounceButton> createState() => _AuraBounceButtonState();
}

class _AuraBounceButtonState extends State<AuraBounceButton> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
      reverseDuration: const Duration(milliseconds: 150),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: widget.scaleDown).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    _controller.forward();
  }

  void _onTapUp(TapUpDetails details) {
    _controller.reverse();
    if (widget.onTap != null) widget.onTap!();
  }

  void _onTapCancel() {
    _controller.reverse();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: widget.child,
      ),
    );
  }
}

/// 4. AuraSlideFadeWrapper - Entrance slide & fade wrapper for cards & list items
class AuraSlideFadeWrapper extends StatefulWidget {
  final Widget child;
  final Duration duration;
  final Duration delay;
  final Offset beginOffset;

  const AuraSlideFadeWrapper({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 500),
    this.delay = Duration.zero,
    this.beginOffset = const Offset(0.0, 0.15),
  });

  @override
  State<AuraSlideFadeWrapper> createState() => _AuraSlideFadeWrapperState();
}

class _AuraSlideFadeWrapperState extends State<AuraSlideFadeWrapper> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration);
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _slideAnimation = Tween<Offset>(begin: widget.beginOffset, end: Offset.zero).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );

    if (widget.delay == Duration.zero) {
      _controller.forward();
    } else {
      Future.delayed(widget.delay, () {
        if (mounted) _controller.forward();
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: widget.child,
      ),
    );
  }
}

/// 5. AuraShimmerWrapper - Luxury metallic gold shimmer / shine wrapper
class AuraShimmerWrapper extends StatefulWidget {
  final Widget child;
  final Duration duration;

  const AuraShimmerWrapper({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 2500),
  });

  @override
  State<AuraShimmerWrapper> createState() => _AuraShimmerWrapperState();
}

class _AuraShimmerWrapperState extends State<AuraShimmerWrapper> with SingleTickerProviderStateMixin {
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
        return ShaderMask(
          blendMode: BlendMode.srcATop,
          shaderCallback: (bounds) {
            return LinearGradient(
              colors: const [
                Color(0x00FFFFFF),
                Color(0x99FFFDF5),
                Color(0xFFD4AF37),
                Color(0x99FFFDF5),
                Color(0x00FFFFFF),
              ],
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

/// 6. AuraRotateWrapper - Smooth continuous rotation for VIP frames & rings
class AuraRotateWrapper extends StatefulWidget {
  final Widget child;
  final Duration duration;

  const AuraRotateWrapper({
    super.key,
    required this.child,
    this.duration = const Duration(seconds: 8),
  });

  @override
  State<AuraRotateWrapper> createState() => _AuraRotateWrapperState();
}

class _AuraRotateWrapperState extends State<AuraRotateWrapper> with SingleTickerProviderStateMixin {
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
    return RotationTransition(
      turns: _controller,
      child: widget.child,
    );
  }
}
