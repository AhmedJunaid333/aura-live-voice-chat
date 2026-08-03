import 'dart:io';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:iconsax/iconsax.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/design_system/colors.dart';
import '../../../../core/design_system/typography.dart';
import '../../../../core/design_system/spacing.dart';
import '../../../../core/design_system/radius.dart';
import '../../../../core/design_system/shadows.dart';
import '../../../../core/design_system/gradients.dart';
import '../../../../core/design_system/animations.dart';
import '../../../../core/services/user_session_service.dart';
import '../../../../core/services/wallet_ledger_service.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  late UserSessionService _sessionService;
  late WalletLedgerService _ledgerService;
  final ImagePicker _imagePicker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _sessionService = UserSessionService();
    _ledgerService = WalletLedgerService();
    _sessionService.addListener(_onUpdated);
    _ledgerService.addListener(_onUpdated);
    _ledgerService.init();
  }

  @override
  void dispose() {
    _sessionService.removeListener(_onUpdated);
    _ledgerService.removeListener(_onUpdated);
    super.dispose();
  }

  void _onUpdated() {
    if (mounted) setState(() {});
  }

  final List<Map<String, dynamic>> _rechargePacks = [
    {'coins': 7000, 'coinsLabel': '7,000 Coins 🪙', 'price': '\$0.99', 'bonus': '+500 Bonus'},
    {'coins': 36000, 'coinsLabel': '36,000 Coins 🪙', 'price': '\$4.99', 'bonus': '+3,000 Bonus'},
    {'coins': 150000, 'coinsLabel': '150,000 Coins 🪙', 'price': '\$19.99', 'bonus': '+15,000 Bonus'},
    {'coins': 800000, 'coinsLabel': '800,000 Coins 🪙', 'price': '\$99.99', 'bonus': '+100,000 Bonus'},
  ];

  final List<String> _resellers = [
    'Aura Official Reseller #1 (Pakistan)',
    'VIP Agent Global Hub',
    'Gulf & Middle East Reseller',
    'South Asia Official Reseller',
  ];

  final List<String> _paymentMethods = [
    'Easypaisa',
    'JazzCash',
    'Bank Transfer (HBL / UBL)',
    'USDT / Crypto (Binance Pay)',
  ];

  // 1. OFFLINE PURCHASE MODAL & FLOW
  void _showOfflinePurchaseBottomSheet() {
    final user = _sessionService.currentUser;
    if (user == null) return;

    String selectedReseller = _resellers.first;
    Map<String, dynamic> selectedPack = _rechargePacks[1]; // default 36k
    String selectedMethod = _paymentMethods.first;
    final txnController = TextEditingController();
    File? selectedScreenshot;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AuraColors.surfaceLight,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (modalCtx, setModalState) {
            Future<void> pickScreenshot(ImageSource source) async {
              try {
                final XFile? image = await _imagePicker.pickImage(
                  source: source,
                  maxWidth: 800,
                  maxHeight: 800,
                  imageQuality: 85,
                );
                if (image != null) {
                  setModalState(() {
                    selectedScreenshot = File(image.path);
                  });
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Screenshot error: $e'), backgroundColor: AuraColors.error),
                  );
                }
              }
            }

            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(ctx).viewInsets.bottom,
                left: 20,
                right: 20,
                top: 20,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(width: 40, height: 4, decoration: BoxDecoration(color: AuraColors.border, borderRadius: AuraRadius.brPill)),
                    ),
                    AuraSpacing.vLg,
                    Row(
                      children: [
                        const Icon(Iconsax.card_send, color: AuraColors.gold, size: 28),
                        const SizedBox(width: 10),
                        Text('Offline Purchased ⭐ NEW', style: AuraTypography.titleLarge),
                      ],
                    ),
                    Text('Purchase Gold Coins via Official Reseller Agent', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                    AuraSpacing.vLg,

                    // Select Reseller
                    Text('Select Reseller Agent', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                    AuraSpacing.vXxs,
                    DropdownButtonFormField<String>(
                      value: selectedReseller,
                      dropdownColor: AuraColors.surfaceLight,
                      style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textPrimary),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: AuraColors.surfaceLight,
                        border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.border)),
                      ),
                      items: _resellers
                          .map((r) => DropdownMenuItem(value: r, child: Text(r, overflow: TextOverflow.ellipsis)))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) setModalState(() => selectedReseller = val);
                      },
                    ),
                    AuraSpacing.vMd,

                    // Select Package
                    Text('Select Coin Package', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                    AuraSpacing.vXxs,
                    DropdownButtonFormField<Map<String, dynamic>>(
                      value: selectedPack,
                      dropdownColor: AuraColors.surfaceLight,
                      style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textPrimary),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: AuraColors.surfaceLight,
                        border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.border)),
                      ),
                      items: _rechargePacks
                          .map((p) => DropdownMenuItem(value: p, child: Text('${p['coinsLabel']} - ${p['price']}')))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) setModalState(() => selectedPack = val);
                      },
                    ),
                    AuraSpacing.vMd,

                    // Select Payment Method
                    Text('Payment Method Used', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                    AuraSpacing.vXxs,
                    DropdownButtonFormField<String>(
                      value: selectedMethod,
                      dropdownColor: AuraColors.surfaceLight,
                      style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textPrimary),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: AuraColors.surfaceLight,
                        border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.border)),
                      ),
                      items: _paymentMethods
                          .map((m) => DropdownMenuItem(value: m, child: Text(m)))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) setModalState(() => selectedMethod = val);
                      },
                    ),
                    AuraSpacing.vMd,

                    // Transaction ID
                    Text('Transaction ID / Reference Number', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                    AuraSpacing.vXxs,
                    TextField(
                      controller: txnController,
                      style: AuraTypography.bodyMedium,
                      decoration: InputDecoration(
                        hintText: 'e.g. TXN984210984',
                        hintStyle: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary),
                        filled: true,
                        fillColor: AuraColors.surfaceLight,
                        border: OutlineInputBorder(borderRadius: AuraRadius.brMd, borderSide: BorderSide(color: AuraColors.border)),
                      ),
                    ),
                    AuraSpacing.vMd,

                    // Upload Screenshot
                    Text('Payment Proof Screenshot', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary)),
                    AuraSpacing.vXxs,
                    GestureDetector(
                      onTap: () {
                        showModalBottomSheet(
                          context: ctx,
                          backgroundColor: AuraColors.surfaceLight,
                          shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
                          builder: (_) => Container(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                ListTile(
                                  leading: const Icon(Iconsax.camera, color: AuraColors.primary),
                                  title: const Text('Take Screenshot Photo'),
                                  onTap: () {
                                    Navigator.pop(ctx);
                                    pickScreenshot(ImageSource.camera);
                                  },
                                ),
                                ListTile(
                                  leading: const Icon(Iconsax.gallery, color: AuraColors.secondary),
                                  title: const Text('Choose Screenshot from Gallery'),
                                  onTap: () {
                                    Navigator.pop(ctx);
                                    pickScreenshot(ImageSource.gallery);
                                  },
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                      child: Container(
                        height: 100,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: AuraColors.surface,
                          borderRadius: AuraRadius.brMd,
                          border: Border.all(color: AuraColors.border),
                        ),
                        child: selectedScreenshot != null
                            ? ClipRRect(
                                borderRadius: AuraRadius.brMd,
                                child: Image.file(selectedScreenshot!, fit: BoxFit.cover),
                              )
                            : Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Iconsax.export_1, color: AuraColors.primary, size: 28),
                                  const SizedBox(height: 4),
                                  Text('Tap to Upload Payment Screenshot', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                                ],
                              ),
                      ),
                    ),
                    AuraSpacing.vLg,

                    // Submit Request Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AuraColors.primary,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: AuraRadius.brPill),
                        ),
                        onPressed: () async {
                          final txnId = txnController.text.trim();
                          if (txnId.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Please enter your Transaction ID!'), backgroundColor: AuraColors.error),
                            );
                            return;
                          }

                          await _ledgerService.submitOfflinePurchase(
                            userId: user.numericId,
                            username: user.username,
                            resellerName: selectedReseller,
                            coinPackage: selectedPack['coinsLabel'],
                            coinsAmount: selectedPack['coins'] as int,
                            priceAmount: selectedPack['price'] as String,
                            paymentMethod: selectedMethod,
                            transactionId: txnId,
                            screenshotPath: selectedScreenshot?.path,
                          );

                          if (ctx.mounted) Navigator.pop(ctx);
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Offline Purchase Request Submitted! Awaiting Admin Verification. ⏳'),
                                backgroundColor: AuraColors.success,
                              ),
                            );
                          }
                        },
                        child: Text('Submit Purchase Request', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                      ),
                    ),
                    AuraSpacing.vLg,
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  // 2. ADMIN VERIFICATION PORTAL SHEET
  void _showAdminPortalBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AuraColors.surfaceLight,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (adminCtx, setAdminState) {
            final requests = _ledgerService.offlineRequests;

            return Padding(
              padding: const EdgeInsets.all(20),
              child: SizedBox(
                height: MediaQuery.of(ctx).size.height * 0.75,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(width: 40, height: 4, decoration: BoxDecoration(color: AuraColors.border, borderRadius: AuraRadius.brPill)),
                    ),
                    AuraSpacing.vLg,
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Iconsax.security_user, color: AuraColors.primary, size: 28),
                            const SizedBox(width: 8),
                            Text('Admin Offline Purchase Verification', style: AuraTypography.titleLarge),
                          ],
                        ),
                      ],
                    ),
                    Text('Manage pending reseller coin orders & approve ledger entries', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                    AuraSpacing.vLg,

                    Expanded(
                      child: requests.isEmpty
                          ? Center(
                              child: Text('No Offline Purchase Requests Found', style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary)),
                            )
                          : ListView.separated(
                              itemCount: requests.length,
                              separatorBuilder: (_, __) => AuraSpacing.vMd,
                              itemBuilder: (context, index) {
                                final req = requests[index];
                                final isPending = req.status == 'PENDING';
                                final isApproved = req.status == 'APPROVED';

                                Color statusColor = isPending
                                    ? AuraColors.warning
                                    : (isApproved ? AuraColors.success : AuraColors.error);

                                return Container(
                                  padding: const EdgeInsets.all(14),
                                  decoration: BoxDecoration(
                                    color: AuraColors.surface,
                                    borderRadius: AuraRadius.brMd,
                                    border: Border.all(color: AuraColors.border),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text('Order #${req.id}', style: AuraTypography.titleMedium),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                            decoration: BoxDecoration(
                                              color: statusColor.withValues(alpha: 0.15),
                                              borderRadius: AuraRadius.brPill,
                                              border: Border.all(color: statusColor.withValues(alpha: 0.4)),
                                            ),
                                            child: Text(
                                              req.status,
                                              style: AuraTypography.badge.copyWith(color: statusColor),
                                            ),
                                          )
                                        ],
                                      ),
                                      AuraSpacing.vXs,
                                      Text('User ID: ${req.userId} (${req.username})', style: AuraTypography.bodySmall),
                                      Text('Package: ${req.coinPackage} (${req.priceAmount})', style: AuraTypography.bodySmall.copyWith(color: AuraColors.gold)),
                                      Text('Reseller: ${req.resellerName}', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                                      Text('Txn ID: ${req.transactionId} via ${req.paymentMethod}', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                                      AuraSpacing.vSm,

                                      if (isPending) ...[
                                        Row(
                                          children: [
                                            Expanded(
                                              child: ElevatedButton(
                                                style: ElevatedButton.styleFrom(backgroundColor: AuraColors.success),
                                                onPressed: () async {
                                                  final ok = await _ledgerService.approveOfflinePurchase(req.id);
                                                  if (ok) {
                                                    setAdminState(() {});
                                                    if (context.mounted) {
                                                      ScaffoldMessenger.of(context).showSnackBar(
                                                        SnackBar(content: Text('Order #${req.id} Approved! ${req.coinsAmount} Coins credited. 🎉')),
                                                      );
                                                    }
                                                  }
                                                },
                                                child: const Text('Approve & Add Coins'),
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                            Expanded(
                                              child: OutlinedButton(
                                                style: OutlinedButton.styleFrom(side: const BorderSide(color: AuraColors.error)),
                                                onPressed: () async {
                                                  final ok = await _ledgerService.rejectOfflinePurchase(req.id);
                                                  if (ok) {
                                                    setAdminState(() {});
                                                    if (context.mounted) {
                                                      ScaffoldMessenger.of(context).showSnackBar(
                                                        SnackBar(content: Text('Order #${req.id} Rejected.')),
                                                      );
                                                    }
                                                  }
                                                },
                                                child: const Text('Reject Order', style: TextStyle(color: AuraColors.error)),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ],
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  // 3. LEDGER HISTORY MODAL
  void _showLedgerHistoryBottomSheet() {
    final entries = _ledgerService.ledgerEntries;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AuraColors.surfaceLight,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: SizedBox(
          height: MediaQuery.of(ctx).size.height * 0.7,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(width: 40, height: 4, decoration: BoxDecoration(color: AuraColors.border, borderRadius: AuraRadius.brPill)),
              ),
              AuraSpacing.vLg,
              Row(
                children: [
                  const Icon(Iconsax.receipt_2, color: AuraColors.primary, size: 28),
                  const SizedBox(width: 8),
                  Text('Wallet Ledger Audit History', style: AuraTypography.titleLarge),
                ],
              ),
              Text('Immutable double-entry ledger for all credit/debit transactions', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
              AuraSpacing.vLg,

              Expanded(
                child: entries.isEmpty
                    ? Center(
                        child: Text('No Ledger Transactions Recorded Yet', style: AuraTypography.bodyMedium.copyWith(color: AuraColors.textSecondary)),
                      )
                    : ListView.separated(
                        itemCount: entries.length,
                        separatorBuilder: (_, __) => AuraSpacing.vSm,
                        itemBuilder: (context, index) {
                          final e = entries[index];
                          final isCredit = e.transactionCategory == 'CREDIT';

                          return Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AuraColors.surface,
                              borderRadius: AuraRadius.brMd,
                              border: Border.all(color: AuraColors.border),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: isCredit ? AuraColors.success.withValues(alpha: 0.15) : AuraColors.error.withValues(alpha: 0.15),
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(
                                    isCredit ? Iconsax.arrow_down : Iconsax.arrow_up_3,
                                    color: isCredit ? AuraColors.success : AuraColors.error,
                                    size: 20,
                                  ),
                                ),
                                AuraSpacing.hMd,
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(e.description, style: AuraTypography.titleMedium),
                                      Text('${e.type} | Ref: ${e.referenceId}', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                                    ],
                                  ),
                                ),
                                Text(
                                  '${isCredit ? "+" : "-"}${e.amount} 🪙',
                                  style: AuraTypography.titleMedium.copyWith(
                                    color: isCredit ? AuraColors.success : AuraColors.error,
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = _sessionService.currentUser;
    final coins = user?.coins ?? 0;
    final diamonds = user?.diamonds ?? 0;
    final offlineRequests = _ledgerService.offlineRequests;

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
        actions: [
          IconButton(
            tooltip: 'Admin Offline Purchases Portal',
            icon: const Icon(Iconsax.security_user, color: AuraColors.gold),
            onPressed: _showAdminPortalBottomSheet,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1 & 2. GOLD COIN & DIAMOND BALANCES (Default 0)
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
                                  Text('GOLD COIN BALANCE', style: AuraTypography.labelSmall.copyWith(color: AuraColors.textSecondary, letterSpacing: 1.2)),
                                  AuraSpacing.vSm,
                                  Text(
                                    '$coins 🪙',
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
                                    '$diamonds 💎',
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
                            Flexible(child: Text('User ID: ${user?.numericId ?? 100001}', overflow: TextOverflow.ellipsis, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary))),
                            Text('Recharge Total: 0 🪙', style: AuraTypography.labelLarge.copyWith(color: AuraColors.textPrimary)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            AuraSpacing.vLg,

            // 3. OFFLINE PURCHASED ⭐ NEW CARD
            GestureDetector(
              onTap: _showOfflinePurchaseBottomSheet,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: AuraGradients.primary,
                  borderRadius: AuraRadius.brLg,
                  boxShadow: AuraShadows.neonViolet,
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: const BoxDecoration(color: AuraColors.surfaceLight, shape: BoxShape.circle),
                      child: const Icon(Iconsax.card_send, color: AuraColors.gold, size: 28),
                    ),
                    AuraSpacing.hMd,
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text('Offline Purchased', style: AuraTypography.titleLarge.copyWith(color: AuraColors.textPrimary)),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(color: AuraColors.gold, borderRadius: AuraRadius.brPill),
                                child: Text('NEW', style: AuraTypography.badge.copyWith(color: AuraColors.background, fontSize: 9)),
                              ),
                            ],
                          ),
                          AuraSpacing.vXxs,
                          Text('Buy Coins via Official Reseller Agent', style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
                          if (offlineRequests.isNotEmpty) ...[
                            AuraSpacing.vXxs,
                            Text(
                              '${offlineRequests.length} Orders Submitted (${offlineRequests.where((r) => r.status == "PENDING").length} Pending)',
                              style: AuraTypography.labelSmall.copyWith(color: AuraColors.accent),
                            ),
                          ],
                        ],
                      ),
                    ),
                    const Icon(Iconsax.arrow_right_3, color: AuraColors.textPrimary),
                  ],
                ),
              ),
            ),

            AuraSpacing.vLg,

            // 4. WALLET DASHBOARD GRID CARDS
            Text('Wallet Services & Features', style: AuraTypography.titleLarge),
            AuraSpacing.vMd,

            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.5,
              children: [
                _buildWalletCard(
                  icon: Iconsax.add_circle,
                  color: AuraColors.primary,
                  title: 'Recharge',
                  subtitle: 'In-App Packages',
                  onTap: () {},
                ),
                _buildWalletCard(
                  icon: Iconsax.convert_card,
                  color: AuraColors.secondary,
                  title: 'Transfer',
                  subtitle: 'Send Coins',
                  onTap: () {},
                ),
                _buildWalletCard(
                  icon: Iconsax.money_send,
                  color: AuraColors.success,
                  title: 'Withdrawal',
                  subtitle: 'Cashout Diamonds',
                  onTap: () {},
                ),
                _buildWalletCard(
                  icon: Iconsax.receipt_item,
                  color: AuraColors.gold,
                  title: 'Transactions',
                  subtitle: 'History Logs',
                  onTap: () {},
                ),
                _buildWalletCard(
                  icon: Iconsax.receipt_2,
                  color: AuraColors.accent,
                  title: 'Ledger History',
                  subtitle: 'Audit Ledger',
                  onTap: _showLedgerHistoryBottomSheet,
                ),
                _buildWalletCard(
                  icon: Iconsax.ticket,
                  color: Colors.purpleAccent,
                  title: 'Coupons',
                  subtitle: 'Discount Vouchers',
                  onTap: () {},
                ),
                _buildWalletCard(
                  icon: Iconsax.crown,
                  color: AuraColors.gold,
                  title: 'VIP Recharge',
                  subtitle: 'Exclusive Tiers',
                  onTap: () => context.push('/vip'),
                ),
                _buildWalletCard(
                  icon: Iconsax.card,
                  color: Colors.tealAccent,
                  title: 'Payment Methods',
                  subtitle: 'Manage Cards',
                  onTap: () {},
                ),
              ],
            ),

            AuraSpacing.vLg,
          ],
        ),
      ),
    );
  }

  Widget _buildWalletCard({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AuraColors.surfaceLight,
          borderRadius: AuraRadius.brLg,
          border: Border.all(color: AuraColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: AuraRadius.brSm,
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(height: 8),
            Text(title, style: AuraTypography.titleMedium.copyWith(color: AuraColors.textPrimary)),
            Text(subtitle, style: AuraTypography.bodySmall.copyWith(color: AuraColors.textSecondary)),
          ],
        ),
      ),
    );
  }
}
