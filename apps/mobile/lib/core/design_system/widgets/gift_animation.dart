import 'package:flutter/material.dart';
import '../colors.dart';
import '../typography.dart';

class AuraGiftAnimation extends StatefulWidget {
  final String giftName;
  final String senderName;
  final String? giftImageUrl;
  final VoidCallback onComplete;

  const AuraGiftAnimation({
    super.key,
    required this.giftName,
    required this.senderName,
    this.giftImageUrl,
    required this.onComplete,
  });

  @override
  State<AuraGiftAnimation> createState() => _AuraGiftAnimationState();
}

class _AuraGiftAnimationState extends State<AuraGiftAnimation> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    );

    _scaleAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.0, end: 1.2).chain(CurveTween(curve: Curves.easeOutBack)), weight: 30),
      TweenSequenceItem(tween: Tween(begin: 1.2, end: 1.0).chain(CurveTween(curve: Curves.easeInOut)), weight: 20),
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 1.0), weight: 30),
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 1.5).chain(CurveTween(curve: Curves.easeIn)), weight: 20),
    ]).animate(_controller);

    _opacityAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.0, end: 1.0), weight: 10),
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 1.0), weight: 70),
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 0.0), weight: 20),
    ]).animate(_controller);

    _controller.forward().then((_) {
      widget.onComplete();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: IgnorePointer(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Opacity(
              opacity: _opacityAnimation.value,
              child: Transform.scale(
                scale: _scaleAnimation.value,
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (widget.giftImageUrl != null)
                        Image.network(
                          widget.giftImageUrl!,
                          width: 120,
                          height: 120,
                        )
                      else
                        const Icon(
                          Icons.card_giftcard,
                          size: 120,
                          color: AuraColors.neonRose,
                        ),
                      const SizedBox(height: 16),
                      Text(
                        '${widget.senderName} sent a ${widget.giftName}!',
                        style: AuraTypography.titleLarge.copyWith(
                          color: AuraColors.white,
                          shadows: [
                            Shadow(
                              color: AuraColors.neonRose.withValues(alpha: 0.8),
                              blurRadius: 10,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
