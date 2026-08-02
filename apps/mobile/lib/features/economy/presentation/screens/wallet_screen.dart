import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/gradients.dart';
import '../../../../core/design_system/animations.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  int _coinsBalance = 1480250;
  int _diamondsBalance = 125000;
  String _selectedPayment = 'Google Play';

  final List<Map<String, dynamic>> _rechargePacks = [
    {'coins': '7,000 Coins 🪙', 'price': '\$0.99', 'bonus': '+500 Bonus', 'popular': false},
    {'coins': '36,000 Coins 🪙', 'price': '\$4.99', 'bonus': '+3,000 Bonus', 'popular': true},
    {'coins': '150,000 Coins 🪙', 'price': '\$19.99', 'bonus': '+15,000 Bonus', 'popular': false},
    {'coins': '800,000 Coins 🪙', 'price': '\$99.99', 'bonus': '+100,000 Bonus', 'popular': false},
  ];

  final List<Map<String, dynamic>> _transactions = [
    {'title': 'Recharge via Google Play', 'amount': '+150,000 Coins', 'time': 'Today 10:30 AM', 'type': 'in'},
    {'title': 'Sent Diamond Crown to Host', 'amount': '-5,000 Coins', 'time': 'Today 09:15 AM', 'type': 'out'},
    {'title': 'Host Diamond Cashout', 'amount': '+\$1,250.00 USD', 'time': 'Yesterday', 'type': 'in'},
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _handleRecharge(Map<String, dynamic> pack) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AuraColors.surfaceLight,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: AuraColors.border, borderRadius: BorderRadius.circular(2))),
            AuraSpacing.vLg,
            const Icon(Iconsax.wallet_3, color: AuraColors.accent, size: 44),
            AuraSpacing.vMd,
            Text('Confirm Purchase: ${pack['coins']}', style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
            AuraSpacing.vSm,
            Text('Payment Method: $_selectedPayment (${pack['price']})', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
            AuraSpacing.vLg,
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  setState(() => _coinsBalance += 150000);
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Successfully purchased ${pack['coins']}! 🎉'), backgroundColor: AuraColors.surface));
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: EdgeInsets.zero,
                  shape: RoundedRectangleBorder(borderRadius: AuraRadius.brMd),
                ),
                child: Container(
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    gradient: AuraGradients.primary,
                    borderRadius: AuraRadius.brMd,
                    boxShadow: AuraShadows.neonViolet,
                  ),
                  child: Text('Pay ${pack['price']} Now', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AuraColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Iconsax.arrow_left_2, color: AuraColors.textPrimary),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/profile');
            }
          },
        ),
        title: Text(
          'My Wallet',
          style: AuraTypography.headlineSmall.copyWith(color: AuraColors.textPrimary),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Wallet Balance Card
            AuraSlideIn.up(
              child: ClipRRect(
                borderRadius: AuraRadius.brLg,
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AuraColors.glassBg,
                      borderRadius: AuraRadius.brLg,
                      border: Border.all(color: AuraColors.glassBorder),
                      boxShadow: AuraShadows.neonViolet,
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('GOLD COINS BALANCE', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, letterSpacing: 1.2)),
                                  AuraSpacing.vSm,
                                  Text(
                                    '${(_coinsBalance / 1000).toStringAsFixed(1)}k 🪙',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: AuraTypography.headlineMedium.copyWith(color: AuraColors.accent),
                                  ),
                                ],
                              ),
                            ),
                            Container(width: 1, height: 40, color: AuraColors.border),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text('HOST DIAMONDS', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, letterSpacing: 1.2)),
                                  AuraSpacing.vSm,
                                  Text(
                                    '${(_diamondsBalance / 1000).toStringAsFixed(1)}k 💎',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: AuraTypography.headlineMedium.copyWith(color: AuraColors.secondary),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        AuraSpacing.vLg,
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Flexible(child: Text('Estimated Host Earnings', overflow: TextOverflow.ellipsis, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary))),
                            Text('\$1,250.00 USD', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            AuraSpacing.vLg,
            AuraSpacing.vLg,

            // Recharge Coin Packs Title
            Text(
              'Select Coin Recharge Pack',
              style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary),
            ),
            AuraSpacing.vMd,

            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.2,
              ),
              itemCount: _rechargePacks.length,
              itemBuilder: (context, index) {
                final pack = _rechargePacks[index];
                final isPopular = pack['popular'] == true;

                return GestureDetector(
                  onTap: () => _handleRecharge(pack),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AuraColors.surfaceLight,
                      borderRadius: AuraRadius.brLg,
                      border: Border.all(color: isPopular ? AuraColors.primary : AuraColors.border, width: isPopular ? 2 : 1),
                      boxShadow: isPopular ? AuraShadows.neonViolet : [],
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (isPopular)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(gradient: AuraGradients.primary, borderRadius: BorderRadius.circular(10)),
                            child: Text('MOST POPULAR', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textPrimary, fontSize: 8)),
                          ),
                        if (isPopular) AuraSpacing.vSm,
                        FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Text(pack['coins'] as String, maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                        ),
                        Text(pack['bonus'] as String, maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelSmall.copyWith(color: AuraColors.accent)),
                        AuraSpacing.vSm,
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                          decoration: BoxDecoration(color: AuraColors.surface, borderRadius: BorderRadius.circular(14), border: Border.all(color: AuraColors.border)),
                          child: Text(pack['price'] as String, maxLines: 1, overflow: TextOverflow.ellipsis, style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary)),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),

            AuraSpacing.vLg,
            AuraSpacing.vLg,

            // Transactions History
            Text(
              'Recent Transactions',
              style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary),
            ),
            AuraSpacing.vMd,

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _transactions.length,
              separatorBuilder: (context, index) => AuraSpacing.vSm,
              itemBuilder: (context, index) {
                final tx = _transactions[index];
                final isIn = tx['type'] == 'in';

                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AuraColors.surfaceLight,
                    borderRadius: AuraRadius.brMd,
                    border: Border.all(color: AuraColors.border),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: isIn ? AuraColors.success.withValues(alpha: 0.1) : AuraColors.error.withValues(alpha: 0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(isIn ? Iconsax.arrow_down : Iconsax.arrow_up_2, color: isIn ? AuraColors.success : AuraColors.error, size: 18),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(tx['title'] as String, style: AuraTypography.labelMedium.copyWith(color: AuraColors.textPrimary)),
                            Text(tx['time'] as String, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                          ],
                        ),
                      ),
                      Text(
                        tx['amount'] as String,
                        style: AuraTypography.labelMedium.copyWith(color: isIn ? AuraColors.success : AuraColors.error),
                      ),
                    ],
                  ),
                );
              },
            ),

            AuraSpacing.vLg,
            AuraSpacing.vLg,
          ],
        ),
      ),
    );
  }
}
