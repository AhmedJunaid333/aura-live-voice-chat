import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'user_session_service.dart';

enum AuthProviderType { LOCAL, GOOGLE }

/// Production-grade Encrypted Storage Service for Tokens, Sessions & Credentials
class SecureStorageService {
  static final SecureStorageService _instance = SecureStorageService._internal();
  factory SecureStorageService() => _instance;
  SecureStorageService._internal();

  final FlutterSecureStorage _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  static const String _keyJwtToken = 'aura_jwt_token';
  static const String _keyRefreshToken = 'aura_refresh_token';
  static const String _keyCurrentUser = 'aura_current_user';
  static const String _keyAuthProvider = 'aura_auth_provider';
  static const String _keyLastLogin = 'aura_last_login_timestamp';

  /// Save active user session securely
  Future<void> saveSession({
    required UserModel user,
    required String jwtToken,
    required String refreshToken,
    required AuthProviderType provider,
  }) async {
    await _storage.write(key: _keyJwtToken, value: jwtToken);
    await _storage.write(key: _keyRefreshToken, value: refreshToken);
    await _storage.write(key: _keyCurrentUser, value: jsonEncode(user.toJson()));
    await _storage.write(key: _keyAuthProvider, value: provider.name);
    await _storage.write(key: _keyLastLogin, value: DateTime.now().toIso8601String());
  }

  /// Get stored JWT token
  Future<String?> getJwtToken() async {
    return await _storage.read(key: _keyJwtToken);
  }

  /// Get stored Refresh token
  Future<String?> getRefreshToken() async {
    return await _storage.read(key: _keyRefreshToken);
  }

  /// Get stored User model
  Future<UserModel?> getCurrentUser() async {
    final userJsonStr = await _storage.read(key: _keyCurrentUser);
    if (userJsonStr == null || userJsonStr.isEmpty) return null;
    try {
      return UserModel.fromJson(jsonDecode(userJsonStr));
    } catch (_) {
      return null;
    }
  }

  /// Get stored Auth Provider
  Future<AuthProviderType> getAuthProvider() async {
    final providerStr = await _storage.read(key: _keyAuthProvider);
    if (providerStr == 'GOOGLE') return AuthProviderType.GOOGLE;
    return AuthProviderType.LOCAL;
  }

  /// Clear secure storage session on logout
  Future<void> clearSession() async {
    await _storage.delete(key: _keyJwtToken);
    await _storage.delete(key: _keyRefreshToken);
    await _storage.delete(key: _keyCurrentUser);
    await _storage.delete(key: _keyAuthProvider);
    await _storage.delete(key: _keyLastLogin);
  }

  /// Check if a valid session token exists
  Future<bool> hasValidToken() async {
    final token = await getJwtToken();
    return token != null && token.isNotEmpty;
  }
}
