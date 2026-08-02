import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import '../colors.dart';
import '../typography.dart';
import '../spacing.dart';
import '../radius.dart';
import '../gradients.dart';
import 'avatars.dart';
import 'buttons.dart';
import 'bottom_sheets.dart';

class AuraProfileHeader extends StatelessWidget {
  final String name;
  final String avatarUrl;
  final String userId;
  final int followers;
  final int following;
  final bool isVip;
  final VoidCallback onEditProfile;

  const AuraProfileHeader({
    super.key,
    required this.name,
    required this.avatarUrl,
    required this.userId,
    required this.followers,
    required this.following,
    this.isVip = false,
    required this.onEditProfile,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: AuraSpacing.allLg,
      decoration: BoxDecoration(
        color: AuraColors.surfaceElevated,
        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(24)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              AuraAvatar(imageUrl: avatarUrl, size: 80, isVip: isVip),
              AuraSpacing.hLg,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name, style: AuraTypography.headlineMedium),
                    AuraSpacing.vXs,
                    Text('ID: $userId', style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary)),
                    AuraSpacing.vSm,
                    Row(
                      children: [
                        _StatItem(label: 'Followers', value: followers),
                        AuraSpacing.hLg,
                        _StatItem(label: 'Following', value: following),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          AuraSpacing.vLg,
          Row(
            children: [
              Expanded(
                child: AuraOutlineButton(
                  text: 'Edit Profile',
                  onPressed: onEditProfile,
                ),
              ),
              AuraSpacing.hSm,
              AuraIconButton(
                icon: Iconsax.setting,
                onPressed: () {},
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String label;
  final int value;

  const _StatItem({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('$value', style: AuraTypography.titleMedium),
        Text(label, style: AuraTypography.labelMedium.copyWith(color: AuraColors.textSecondary)),
      ],
    );
  }
}

class AuraChatBubble extends StatelessWidget {
  final String sender;
  final String message;
  final bool isMe;

  const AuraChatBubble({
    super.key,
    required this.sender,
    required this.message,
    required this.isMe,
  });

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: EdgeInsets.only(bottom: AuraSpacing.sm, left: isMe ? 40 : 0, right: isMe ? 0 : 40),
        padding: AuraSpacing.allMd,
        decoration: BoxDecoration(
          gradient: isMe ? AuraGradients.primary : null,
          color: isMe ? null : AuraColors.surfaceLight,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(AuraRadius.lg),
            topRight: Radius.circular(AuraRadius.lg),
            bottomLeft: isMe ? Radius.circular(AuraRadius.lg) : Radius.zero,
            bottomRight: isMe ? Radius.zero : Radius.circular(AuraRadius.lg),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (!isMe) ...[
              Text(sender, style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
              AuraSpacing.vXs,
            ],
            Text(
              message,
              style: AuraTypography.bodyLarge.copyWith(color: isMe ? AuraColors.white : AuraColors.textPrimary),
            ),
          ],
        ),
      ),
    );
  }
}

class AuraCommentBubble extends StatelessWidget {
  final String sender;
  final String message;
  final String? badgeText;

  const AuraCommentBubble({
    super.key,
    required this.sender,
    required this.message,
    this.badgeText,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: AuraSpacing.xs),
      padding: EdgeInsets.symmetric(horizontal: AuraSpacing.md, vertical: AuraSpacing.sm),
      decoration: BoxDecoration(
        color: AuraColors.black40,
        borderRadius: AuraRadius.brPill,
      ),
      child: RichText(
        text: TextSpan(
          children: [
            if (badgeText != null) ...[
              WidgetSpan(
                alignment: PlaceholderAlignment.middle,
                child: Container(
                  margin: const EdgeInsets.only(right: 6),
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                  decoration: BoxDecoration(
                    gradient: AuraGradients.vip,
                    borderRadius: AuraRadius.brXs,
                  ),
                  child: Text(badgeText!, style: AuraTypography.badge.copyWith(color: AuraColors.white, fontSize: 8)),
                ),
              ),
            ],
            TextSpan(
              text: '$sender: ',
              style: AuraTypography.labelMedium.copyWith(color: AuraColors.gold),
            ),
            TextSpan(
              text: message,
              style: AuraTypography.bodyMedium.copyWith(color: AuraColors.white),
            ),
          ],
        ),
      ),
    );
  }
}

class AuraViewerList extends StatelessWidget {
  final List<String> avatarUrls;
  final int totalViewers;

  const AuraViewerList({
    super.key,
    required this.avatarUrls,
    required this.totalViewers,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 32,
      padding: EdgeInsets.symmetric(horizontal: AuraSpacing.sm),
      decoration: BoxDecoration(
        color: AuraColors.black40,
        borderRadius: AuraRadius.brPill,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: List.generate(
              avatarUrls.length > 3 ? 3 : avatarUrls.length,
              (index) => Align(
                widthFactor: 0.7,
                child: CircleAvatar(
                  radius: 12,
                  backgroundImage: NetworkImage(avatarUrls[index]),
                ),
              ),
            ),
          ),
          AuraSpacing.hSm,
          Text('$totalViewers', style: AuraTypography.labelMedium.copyWith(color: AuraColors.white)),
        ],
      ),
    );
  }
}

class AuraGiftPanel extends StatelessWidget {
  const AuraGiftPanel({super.key});

  @override
  Widget build(BuildContext context) {
    return AuraBottomSheet(
      title: 'Send Gift',
      child: GridView.builder(
        padding: AuraSpacing.allLg,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          childAspectRatio: 0.8,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: 8,
        itemBuilder: (context, index) {
          return Column(
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: AuraColors.surfaceLight,
                    borderRadius: AuraRadius.brLg,
                  ),
                  child: const Center(
                    child: Icon(Icons.card_giftcard, color: AuraColors.neonRose),
                  ),
                ),
              ),
              AuraSpacing.vXs,
              Text('Gift ${index + 1}', style: AuraTypography.labelSmall),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Iconsax.coin1, size: 10, color: AuraColors.gold),
                  const SizedBox(width: 2),
                  Text('${(index + 1) * 10}', style: AuraTypography.caption),
                ],
              ),
            ],
          );
        },
      ),
    );
  }
}

class AuraPKBattleUI extends StatelessWidget {
  final int hostScore;
  final int opponentScore;
  final Widget hostView;
  final Widget opponentView;

  const AuraPKBattleUI({
    super.key,
    required this.hostScore,
    required this.opponentScore,
    required this.hostView,
    required this.opponentView,
  });

  @override
  Widget build(BuildContext context) {
    final total = hostScore + opponentScore;
    final hostRatio = total == 0 ? 0.5 : hostScore / total;

    return Column(
      children: [
        Row(
          children: [
            Expanded(child: hostView),
            Expanded(child: opponentView),
          ],
        ),
        Container(
          height: 16,
          decoration: const BoxDecoration(
            color: AuraColors.black40,
          ),
          child: Row(
            children: [
              Expanded(
                flex: (hostRatio * 100).toInt(),
                child: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(colors: [AuraColors.neonViolet, AuraColors.neonRose]),
                  ),
                ),
              ),
              Expanded(
                flex: ((1 - hostRatio) * 100).toInt(),
                child: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(colors: [AuraColors.neonCyan, AuraColors.primary]),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
