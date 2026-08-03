import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'user_session_service.dart';

class WalletLedgerEntry {
  final String id;
  final int userId;
  final String username;
  final String type; // CREDIT, DEBIT, OFFLINE_PURCHASE, RECHARGE, GIFT, WITHDRAW, REFUND
  final String transactionCategory; // CREDIT, DEBIT
  final int amount;
  final String currency; // GOLD_COIN, DIAMOND, BEAN
  final String description;
  final String referenceId;
  final DateTime timestamp;

  WalletLedgerEntry({
    required this.id,
    required this.userId,
    required this.username,
    required this.type,
    required this.transactionCategory,
    required this.amount,
    this.currency = 'GOLD_COIN',
    required this.description,
    required this.referenceId,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'username': username,
        'type': type,
        'transactionCategory': transactionCategory,
        'amount': amount,
        'currency': currency,
        'description': description,
        'referenceId': referenceId,
        'timestamp': timestamp.toIso8601String(),
      };

  factory WalletLedgerEntry.fromJson(Map<String, dynamic> json) => WalletLedgerEntry(
        id: json['id'],
        userId: json['userId'],
        username: json['username'],
        type: json['type'],
        transactionCategory: json['transactionCategory'],
        amount: json['amount'],
        currency: json['currency'] ?? 'GOLD_COIN',
        description: json['description'],
        referenceId: json['referenceId'],
        timestamp: DateTime.parse(json['timestamp']),
      );
}

class OfflinePurchaseRequest {
  final String id;
  final int userId;
  final String username;
  final String resellerName;
  final String coinPackage;
  final int coinsAmount;
  final String priceAmount;
  final String paymentMethod;
  final String transactionId;
  final String? screenshotPath;
  String status; // PENDING, APPROVED, REJECTED
  String? rejectionReason;
  final DateTime createdAt;

  OfflinePurchaseRequest({
    required this.id,
    required this.userId,
    required this.username,
    required this.resellerName,
    required this.coinPackage,
    required this.coinsAmount,
    required this.priceAmount,
    required this.paymentMethod,
    required this.transactionId,
    this.screenshotPath,
    this.status = 'PENDING',
    this.rejectionReason,
    required this.createdAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'username': username,
        'resellerName': resellerName,
        'coinPackage': coinPackage,
        'coinsAmount': coinsAmount,
        'priceAmount': priceAmount,
        'paymentMethod': paymentMethod,
        'transactionId': transactionId,
        'screenshotPath': screenshotPath,
        'status': status,
        'rejectionReason': rejectionReason,
        'createdAt': createdAt.toIso8601String(),
      };

  factory OfflinePurchaseRequest.fromJson(Map<String, dynamic> json) => OfflinePurchaseRequest(
        id: json['id'],
        userId: json['userId'],
        username: json['username'],
        resellerName: json['resellerName'],
        coinPackage: json['coinPackage'],
        coinsAmount: json['coinsAmount'],
        priceAmount: json['priceAmount'],
        paymentMethod: json['paymentMethod'],
        transactionId: json['transactionId'],
        screenshotPath: json['screenshotPath'],
        status: json['status'] ?? 'PENDING',
        rejectionReason: json['rejectionReason'],
        createdAt: DateTime.parse(json['createdAt']),
      );
}

class WalletLedgerService extends ChangeNotifier {
  static final WalletLedgerService _instance = WalletLedgerService._internal();
  factory WalletLedgerService() => _instance;
  WalletLedgerService._internal();

  final List<WalletLedgerEntry> _ledgerEntries = [];
  final List<OfflinePurchaseRequest> _offlineRequests = [];
  bool _initialized = false;

  List<WalletLedgerEntry> get ledgerEntries => List.unmodifiable(_ledgerEntries.reversed);
  List<OfflinePurchaseRequest> get offlineRequests => List.unmodifiable(_offlineRequests.reversed);

  Future<void> init() async {
    if (_initialized) return;
    final prefs = await SharedPreferences.getInstance();

    final ledgerJson = prefs.getString('aura_wallet_ledger');
    if (ledgerJson != null) {
      try {
        final List list = jsonDecode(ledgerJson);
        _ledgerEntries.clear();
        _ledgerEntries.addAll(list.map((e) => WalletLedgerEntry.fromJson(e)));
      } catch (_) {}
    }

    final offlineJson = prefs.getString('aura_offline_purchases');
    if (offlineJson != null) {
      try {
        final List list = jsonDecode(offlineJson);
        _offlineRequests.clear();
        _offlineRequests.addAll(list.map((e) => OfflinePurchaseRequest.fromJson(e)));
      } catch (_) {}
    }

    _initialized = true;
    notifyListeners();
  }

  Future<void> _saveLedger() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('aura_wallet_ledger', jsonEncode(_ledgerEntries.map((e) => e.toJson()).toList()));
  }

  Future<void> _saveOfflineRequests() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('aura_offline_purchases', jsonEncode(_offlineRequests.map((e) => e.toJson()).toList()));
  }

  Future<void> addLedgerEntry({
    required int userId,
    required String username,
    required String type,
    required String transactionCategory,
    required int amount,
    String currency = 'GOLD_COIN',
    required String description,
    required String referenceId,
  }) async {
    final entry = WalletLedgerEntry(
      id: 'LDG_${DateTime.now().millisecondsSinceEpoch}',
      userId: userId,
      username: username,
      type: type,
      transactionCategory: transactionCategory,
      amount: amount,
      currency: currency,
      description: description,
      referenceId: referenceId,
      timestamp: DateTime.now(),
    );

    _ledgerEntries.add(entry);
    await _saveLedger();
    notifyListeners();
  }

  Future<OfflinePurchaseRequest> submitOfflinePurchase({
    required int userId,
    required String username,
    required String resellerName,
    required String coinPackage,
    required int coinsAmount,
    required String priceAmount,
    required String paymentMethod,
    required String transactionId,
    String? screenshotPath,
  }) async {
    final request = OfflinePurchaseRequest(
      id: 'OFF_${DateTime.now().millisecondsSinceEpoch}',
      userId: userId,
      username: username,
      resellerName: resellerName,
      coinPackage: coinPackage,
      coinsAmount: coinsAmount,
      priceAmount: priceAmount,
      paymentMethod: paymentMethod,
      transactionId: transactionId,
      screenshotPath: screenshotPath,
      status: 'PENDING',
      createdAt: DateTime.now(),
    );

    _offlineRequests.add(request);
    await _saveOfflineRequests();
    notifyListeners();
    return request;
  }

  Future<bool> approveOfflinePurchase(String requestId) async {
    final index = _offlineRequests.indexWhere((r) => r.id == requestId);
    if (index == -1) return false;

    final request = _offlineRequests[index];
    if (request.status != 'PENDING') return false;

    request.status = 'APPROVED';
    await _saveOfflineRequests();

    // 1. Create Wallet Ledger Entry
    await addLedgerEntry(
      userId: request.userId,
      username: request.username,
      type: 'OFFLINE_PURCHASE',
      transactionCategory: 'CREDIT',
      amount: request.coinsAmount,
      currency: 'GOLD_COIN',
      description: 'Offline Purchase via ${request.resellerName} (${request.transactionId})',
      referenceId: request.id,
    );

    // 2. Credit Coins in UserSessionService
    await UserSessionService().addCoins(request.coinsAmount);

    notifyListeners();
    return true;
  }

  Future<bool> rejectOfflinePurchase(String requestId, {String reason = 'Invalid Transaction ID / Payment Screenshot'}) async {
    final index = _offlineRequests.indexWhere((r) => r.id == requestId);
    if (index == -1) return false;

    final request = _offlineRequests[index];
    if (request.status != 'PENDING') return false;

    request.status = 'REJECTED';
    request.rejectionReason = reason;
    await _saveOfflineRequests();

    notifyListeners();
    return true;
  }
}
