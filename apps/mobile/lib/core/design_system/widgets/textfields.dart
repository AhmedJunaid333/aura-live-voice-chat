import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import '../colors.dart';
import '../typography.dart';
import '../spacing.dart';
import '../radius.dart';
import '../shadows.dart';
import '../gradients.dart';
import '../animations.dart';

class AuraTextField extends StatefulWidget {
  final String hintText;
  final TextEditingController? controller;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final bool obscureText;
  final TextInputType? keyboardType;

  const AuraTextField({
    super.key,
    required this.hintText,
    this.controller,
    this.prefixIcon,
    this.suffixIcon,
    this.obscureText = false,
    this.keyboardType,
  });

  @override
  State<AuraTextField> createState() => _AuraTextFieldState();
}

class _AuraTextFieldState extends State<AuraTextField> {
  final FocusNode _focusNode = FocusNode();
  bool _isFocused = false;

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(() {
      setState(() {
        _isFocused = _focusNode.hasFocus;
      });
    });
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(
        color: AuraColors.glassBg,
        borderRadius: AuraRadius.brLg,
        border: Border.all(
          color: _isFocused ? AuraColors.primary : AuraColors.glassBorder,
        ),
        boxShadow: _isFocused ? AuraShadows.neonViolet : [],
      ),
      child: ClipRRect(
        borderRadius: AuraRadius.brLg,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
          child: TextField(
            controller: widget.controller,
            focusNode: _focusNode,
            obscureText: widget.obscureText,
            keyboardType: widget.keyboardType,
            style: AuraTypography.bodyLarge.copyWith(color: AuraColors.textPrimary),
            decoration: InputDecoration(
              hintText: widget.hintText,
              hintStyle: AuraTypography.bodyLarge.copyWith(color: AuraColors.textDisabled),
              prefixIcon: widget.prefixIcon,
              suffixIcon: widget.suffixIcon,
              border: InputBorder.none,
              contentPadding: AuraSpacing.allMd,
            ),
          ),
        ),
      ),
    );
  }
}

class AuraSearchBar extends StatelessWidget {
  final String hintText;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;

  const AuraSearchBar({
    super.key,
    this.hintText = 'Search...',
    this.controller,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return AuraTextField(
      hintText: hintText,
      controller: controller,
      prefixIcon: const Icon(Iconsax.search_normal, color: AuraColors.textSecondary),
    );
  }
}
