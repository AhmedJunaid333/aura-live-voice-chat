import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Full Production Account Entity & Data Model according to Aura Live v1.0 Rules
class UserModel {
  final int numericId;          // Auto-increment numeric ID shown to users (e.g. 100001)
  final String uuid;           // Internal unique UUID
  final String username;       // Entered during signup
  final String displayName;    // Default: Same as Username
  final String? email;         // Optional
  final String? avatarUrl;     // Uploaded image or null (for default avatar)
  final String gender;         // MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
  final String country;        // Default: Pakistan
  final String? dob;           // Date of birth (YYYY-MM-DD)
  final int age;               // Dynamic age calculated from dob
  final String bio;            // Default: Welcome to my Aura Live profile! 🎤✨
  final String userCode;       // Referral code (e.g. AU100001)

  // System & Wallet Metrics initialized to zero / level 1
  final int level;             // Default: 1
  final int currentXp;         // Default: 0
  final int nextLevelXp;      // Default: 100
  final int vip;               // Default: 0
  final int coins;             // Default: 0
  final int diamonds;          // Default: 0
  final int beans;             // Default: 0
  final int followers;         // Default: 0
  final int following;         // Default: 0
  final int friends;           // Default: 0
  final int visitors;          // Default: 0
  final int giftsReceived;     // Default: 0
  final int giftsSent;         // Default: 0
  final int roomsCreated;      // Default: 0
  final int totalLiveMinutes;  // Default: 0
  final int pkWins;            // Default: 0
  final int pkLoss;            // Default: 0

  // Status & Ranks
  final String family;         // Default: No Family
  final String agency;         // Default: No Agency
  final int hostLevel;         // Default: 1
  final int hostXp;            // Default: 0
  final String creatorRank;    // Default: Bronze
  final String leaderboardRank;// Default: Unranked

  UserModel({
    required this.numericId,
    required this.uuid,
    required this.username,
    required this.displayName,
    this.email,
    this.avatarUrl,
    this.gender = 'PREFER_NOT_TO_SAY',
    this.country = 'Pakistan',
    this.dob,
    int? age,
    this.bio = 'Welcome to my Aura Live profile! 🎤✨',
    required this.userCode,
    this.level = 1,
    this.currentXp = 0,
    this.nextLevelXp = 100,
    this.vip = 0,
    this.coins = 0,
    this.diamonds = 0,
    this.beans = 0,
    this.followers = 0,
    this.following = 0,
    this.friends = 0,
    this.visitors = 0,
    this.giftsReceived = 0,
    this.giftsSent = 0,
    this.roomsCreated = 0,
    this.totalLiveMinutes = 0,
    this.pkWins = 0,
    this.pkLoss = 0,
    this.family = 'No Family',
    this.agency = 'No Agency',
    this.hostLevel = 1,
    this.hostXp = 0,
    this.creatorRank = 'Bronze',
    this.leaderboardRank = 'Unranked',
  }) : age = age ?? _calculateAgeFromDob(dob);

  static int _calculateAgeFromDob(String? dobStr) {
    if (dobStr == null || dobStr.isEmpty) return 18;
    try {
      final dobDate = DateTime.parse(dobStr);
      final today = DateTime.now();
      int calculatedAge = today.year - dobDate.year;
      if (today.month < dobDate.month || (today.month == dobDate.month && today.day < dobDate.day)) {
        calculatedAge--;
      }
      return calculatedAge < 0 ? 18 : calculatedAge;
    } catch (_) {
      return 18;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'numericId': numericId,
      'uuid': uuid,
      'username': username,
      'displayName': displayName,
      'email': email,
      'avatarUrl': avatarUrl,
      'gender': gender,
      'country': country,
      'dob': dob,
      'age': age,
      'bio': bio,
      'userCode': userCode,
      'level': level,
      'currentXp': currentXp,
      'nextLevelXp': nextLevelXp,
      'vip': vip,
      'coins': coins,
      'diamonds': diamonds,
      'beans': beans,
      'followers': followers,
      'following': following,
      'friends': friends,
      'visitors': visitors,
      'giftsReceived': giftsReceived,
      'giftsSent': giftsSent,
      'roomsCreated': roomsCreated,
      'totalLiveMinutes': totalLiveMinutes,
      'pkWins': pkWins,
      'pkLoss': pkLoss,
      'family': family,
      'agency': agency,
      'hostLevel': hostLevel,
      'hostXp': hostXp,
      'creatorRank': creatorRank,
      'leaderboardRank': leaderboardRank,
    };
  }

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      numericId: json['numericId'] ?? 100001,
      uuid: json['uuid'] ?? '',
      username: json['username'] ?? '',
      displayName: json['displayName'] ?? json['username'] ?? 'Aura User',
      email: json['email'],
      avatarUrl: json['avatarUrl'],
      gender: json['gender'] ?? 'PREFER_NOT_TO_SAY',
      country: json['country'] ?? 'Pakistan',
      dob: json['dob'],
      age: json['age'],
      bio: json['bio'] ?? 'Welcome to my Aura Live profile! 🎤✨',
      userCode: json['userCode'] ?? 'AU100001',
      level: json['level'] ?? 1,
      currentXp: json['currentXp'] ?? 0,
      nextLevelXp: json['nextLevelXp'] ?? 100,
      vip: json['vip'] ?? 0,
      coins: json['coins'] ?? 0,
      diamonds: json['diamonds'] ?? 0,
      beans: json['beans'] ?? 0,
      followers: json['followers'] ?? 0,
      following: json['following'] ?? 0,
      friends: json['friends'] ?? 0,
      visitors: json['visitors'] ?? 0,
      giftsReceived: json['giftsReceived'] ?? 0,
      giftsSent: json['giftsSent'] ?? 0,
      roomsCreated: json['roomsCreated'] ?? 0,
      totalLiveMinutes: json['totalLiveMinutes'] ?? 0,
      pkWins: json['pkWins'] ?? 0,
      pkLoss: json['pkLoss'] ?? 0,
      family: json['family'] ?? 'No Family',
      agency: json['agency'] ?? 'No Agency',
      hostLevel: json['hostLevel'] ?? 1,
      hostXp: json['hostXp'] ?? 0,
      creatorRank: json['creatorRank'] ?? 'Bronze',
      leaderboardRank: json['leaderboardRank'] ?? 'Unranked',
    );
  }
}

class UserSessionService extends ChangeNotifier {
  static final UserSessionService _instance = UserSessionService._internal();
  factory UserSessionService() => _instance;
  UserSessionService._internal();

  UserModel? _currentUser;
  String? _jwtToken;
  String? _refreshToken;

  UserModel? get currentUser => _currentUser;
  String? get jwtToken => _jwtToken;
  String? get refreshToken => _refreshToken;
  bool get isAuthenticated => _currentUser != null;

  Future<void> initSession() async {
    final prefs = await SharedPreferences.getInstance();
    final userJsonStr = prefs.getString('aura_current_user');
    _jwtToken = prefs.getString('aura_jwt_token');
    _refreshToken = prefs.getString('aura_refresh_token');

    if (userJsonStr != null) {
      try {
        _currentUser = UserModel.fromJson(jsonDecode(userJsonStr));
      } catch (e) {
        _currentUser = null;
      }
    }
    notifyListeners();
  }

  /// Create a fresh account based on Production Initialization Rules
  Future<UserModel> initializeNewAccount({
    required String username,
    required String displayName,
    String? email,
    String? avatarUrl,
    String gender = 'PREFER_NOT_TO_SAY',
    String country = 'Pakistan',
    String? dob,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    
    // Auto-increment numeric ID counter starting from 100001
    int lastNumericId = prefs.getInt('aura_last_numeric_id') ?? 100000;
    int nextNumericId = lastNumericId + 1;
    await prefs.setInt('aura_last_numeric_id', nextNumericId);

    // Internal UUID Generation
    final String uuid = 'usr_${DateTime.now().millisecondsSinceEpoch}_$nextNumericId';
    final String userCode = 'AU$nextNumericId';

    final newUser = UserModel(
      numericId: nextNumericId,
      uuid: uuid,
      username: username,
      displayName: displayName.isNotEmpty ? displayName : username,
      email: email,
      avatarUrl: avatarUrl,
      gender: gender,
      country: country,
      dob: dob,
      userCode: userCode,
      level: 1,
      currentXp: 0,
      nextLevelXp: 100,
      vip: 0,
      coins: 0,
      diamonds: 0,
      beans: 0,
      followers: 0,
      following: 0,
      friends: 0,
      visitors: 0,
      giftsReceived: 0,
      giftsSent: 0,
      roomsCreated: 0,
      totalLiveMinutes: 0,
      pkWins: 0,
      pkLoss: 0,
      family: 'No Family',
      agency: 'No Agency',
      hostLevel: 1,
      hostXp: 0,
      creatorRank: 'Bronze',
      leaderboardRank: 'Unranked',
    );

    await setCurrentUser(
      newUser,
      token: 'jwt_auth_token_${newUser.uuid}',
      refreshToken: 'refresh_auth_token_${newUser.uuid}',
    );

    return newUser;
  }

  Future<void> setCurrentUser(UserModel user, {String? token, String? refreshToken}) async {
    _currentUser = user;
    if (token != null) _jwtToken = token;
    if (refreshToken != null) _refreshToken = refreshToken;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('aura_current_user', jsonEncode(user.toJson()));
    if (token != null) await prefs.setString('aura_jwt_token', token);
    if (refreshToken != null) await prefs.setString('aura_refresh_token', refreshToken);

    notifyListeners();
  }

  Future<void> updateProfile({
    String? displayName,
    String? avatarUrl,
    String? bio,
    String? country,
    String? gender,
    String? dob,
  }) async {
    if (_currentUser == null) return;

    _currentUser = UserModel(
      numericId: _currentUser!.numericId,
      uuid: _currentUser!.uuid,
      username: _currentUser!.username,
      displayName: displayName ?? _currentUser!.displayName,
      email: _currentUser!.email,
      avatarUrl: avatarUrl ?? _currentUser!.avatarUrl,
      gender: gender ?? _currentUser!.gender,
      country: country ?? _currentUser!.country,
      dob: dob ?? _currentUser!.dob,
      bio: bio ?? _currentUser!.bio,
      userCode: _currentUser!.userCode,
      level: _currentUser!.level,
      currentXp: _currentUser!.currentXp,
      nextLevelXp: _currentUser!.nextLevelXp,
      vip: _currentUser!.vip,
      coins: _currentUser!.coins,
      diamonds: _currentUser!.diamonds,
      beans: _currentUser!.beans,
      followers: _currentUser!.followers,
      following: _currentUser!.following,
      friends: _currentUser!.friends,
      visitors: _currentUser!.visitors,
      giftsReceived: _currentUser!.giftsReceived,
      giftsSent: _currentUser!.giftsSent,
      roomsCreated: _currentUser!.roomsCreated,
      totalLiveMinutes: _currentUser!.totalLiveMinutes,
      pkWins: _currentUser!.pkWins,
      pkLoss: _currentUser!.pkLoss,
      family: _currentUser!.family,
      agency: _currentUser!.agency,
      hostLevel: _currentUser!.hostLevel,
      hostXp: _currentUser!.hostXp,
      creatorRank: _currentUser!.creatorRank,
      leaderboardRank: _currentUser!.leaderboardRank,
    );

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('aura_current_user', jsonEncode(_currentUser!.toJson()));
    notifyListeners();
  }

  Future<void> addXp(int xpAmount) async {
    if (_currentUser == null) return;

    int newXp = _currentUser!.currentXp + xpAmount;
    int level = _currentUser!.level;
    int nextLevelXp = _currentUser!.nextLevelXp;

    while (newXp >= nextLevelXp) {
      newXp -= nextLevelXp;
      level += 1;
      nextLevelXp = (level * 150);
    }

    _currentUser = UserModel(
      numericId: _currentUser!.numericId,
      uuid: _currentUser!.uuid,
      username: _currentUser!.username,
      displayName: _currentUser!.displayName,
      email: _currentUser!.email,
      avatarUrl: _currentUser!.avatarUrl,
      gender: _currentUser!.gender,
      country: _currentUser!.country,
      dob: _currentUser!.dob,
      bio: _currentUser!.bio,
      userCode: _currentUser!.userCode,
      level: level,
      currentXp: newXp,
      nextLevelXp: nextLevelXp,
      vip: _currentUser!.vip,
      coins: _currentUser!.coins,
      diamonds: _currentUser!.diamonds,
      beans: _currentUser!.beans,
      followers: _currentUser!.followers,
      following: _currentUser!.following,
      friends: _currentUser!.friends,
      visitors: _currentUser!.visitors,
      giftsReceived: _currentUser!.giftsReceived,
      giftsSent: _currentUser!.giftsSent,
      roomsCreated: _currentUser!.roomsCreated,
      totalLiveMinutes: _currentUser!.totalLiveMinutes,
      pkWins: _currentUser!.pkWins,
      pkLoss: _currentUser!.pkLoss,
      family: _currentUser!.family,
      agency: _currentUser!.agency,
      hostLevel: _currentUser!.hostLevel,
      hostXp: _currentUser!.hostXp,
      creatorRank: _currentUser!.creatorRank,
      leaderboardRank: _currentUser!.leaderboardRank,
    );

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('aura_current_user', jsonEncode(_currentUser!.toJson()));
    notifyListeners();
  }

  Future<void> logout() async {
    _currentUser = null;
    _jwtToken = null;
    _refreshToken = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('aura_current_user');
    await prefs.remove('aura_jwt_token');
    await prefs.remove('aura_refresh_token');
    notifyListeners();
  }
}
