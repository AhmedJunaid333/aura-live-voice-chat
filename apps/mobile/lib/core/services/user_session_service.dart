import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserModel {
  final String id;
  final String username;
  final String displayName;
  final String? email;
  final String? avatarUrl;
  final String gender;
  final String country;
  final int level;
  final int vip;
  final int coins;
  final int diamonds;
  final int followers;
  final int following;
  final int visitors;
  final String bio;

  UserModel({
    required this.id,
    required this.username,
    required this.displayName,
    this.email,
    this.avatarUrl,
    this.gender = 'PREFER_NOT_TO_SAY',
    this.country = 'Pakistan',
    this.level = 1,
    this.vip = 0,
    this.coins = 0,
    this.diamonds = 0,
    this.followers = 0,
    this.following = 0,
    this.visitors = 0,
    this.bio = 'Welcome to my Aura Live profile! 🎤✨',
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'displayName': displayName,
      'email': email,
      'avatarUrl': avatarUrl,
      'gender': gender,
      'country': country,
      'level': level,
      'vip': vip,
      'coins': coins,
      'diamonds': diamonds,
      'followers': followers,
      'following': following,
      'visitors': visitors,
      'bio': bio,
    };
  }

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      username: json['username'] ?? '',
      displayName: json['displayName'] ?? json['username'] ?? 'Aura User',
      email: json['email'],
      avatarUrl: json['avatarUrl'],
      gender: json['gender'] ?? 'PREFER_NOT_TO_SAY',
      country: json['country'] ?? 'Pakistan',
      level: json['level'] ?? 1,
      vip: json['vip'] ?? 0,
      coins: json['coins'] ?? 0,
      diamonds: json['diamonds'] ?? 0,
      followers: json['followers'] ?? 0,
      following: json['following'] ?? 0,
      visitors: json['visitors'] ?? 0,
      bio: json['bio'] ?? 'Welcome to my Aura Live profile! 🎤✨',
    );
  }
}

class UserSessionService extends ChangeNotifier {
  static final UserSessionService _instance = UserSessionService._internal();
  factory UserSessionService() => _instance;
  UserSessionService._internal();

  UserModel? _currentUser;
  String? _jwtToken;

  UserModel? get currentUser => _currentUser;
  String? get jwtToken => _jwtToken;
  bool get isAuthenticated => _currentUser != null;

  Future<void> initSession() async {
    final prefs = await SharedPreferences.getInstance();
    final userJsonStr = prefs.getString('aura_current_user');
    _jwtToken = prefs.getString('aura_jwt_token');

    if (userJsonStr != null) {
      try {
        _currentUser = UserModel.fromJson(jsonDecode(userJsonStr));
      } catch (e) {
        _currentUser = null;
      }
    }
    notifyListeners();
  }

  Future<void> setCurrentUser(UserModel user, {String? token}) async {
    _currentUser = user;
    if (token != null) _jwtToken = token;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('aura_current_user', jsonEncode(user.toJson()));
    if (token != null) {
      await prefs.setString('aura_jwt_token', token);
    }
    notifyListeners();
  }

  Future<void> updateProfile({
    String? displayName,
    String? avatarUrl,
    String? bio,
    String? country,
    String? gender,
  }) async {
    if (_currentUser == null) return;

    _currentUser = UserModel(
      id: _currentUser!.id,
      username: _currentUser!.username,
      displayName: displayName ?? _currentUser!.displayName,
      email: _currentUser!.email,
      avatarUrl: avatarUrl ?? _currentUser!.avatarUrl,
      gender: gender ?? _currentUser!.gender,
      country: country ?? _currentUser!.country,
      level: _currentUser!.level,
      vip: _currentUser!.vip,
      coins: _currentUser!.coins,
      diamonds: _currentUser!.diamonds,
      followers: _currentUser!.followers,
      following: _currentUser!.following,
      visitors: _currentUser!.visitors,
      bio: bio ?? _currentUser!.bio,
    );

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('aura_current_user', jsonEncode(_currentUser!.toJson()));
    notifyListeners();
  }

  Future<void> logout() async {
    _currentUser = null;
    _jwtToken = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('aura_current_user');
    await prefs.remove('aura_jwt_token');
    notifyListeners();
  }
}
