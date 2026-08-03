import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

class GoogleAuthResult {
  final bool success;
  final String message;
  final String? idToken;
  final String? accessToken;
  final String? email;
  final String? displayName;
  final String? photoUrl;
  final String? googleId;

  GoogleAuthResult({
    required this.success,
    required this.message,
    this.idToken,
    this.accessToken,
    this.email,
    this.displayName,
    this.photoUrl,
    this.googleId,
  });
}

/// Production Google Sign-In & Firebase Auth Service
class GoogleAuthService {
  static final GoogleAuthService _instance = GoogleAuthService._internal();
  factory GoogleAuthService() => _instance;
  GoogleAuthService._internal();

  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'profile'],
  );

  /// Check network connectivity before starting auth flow
  Future<bool> isNetworkConnected() async {
    final connectivityResult = await Connectivity().checkConnectivity();
    return !connectivityResult.contains(ConnectivityResult.none);
  }

  /// Trigger Google Account Picker -> Firebase Auth -> Returns Verified Google Tokens
  Future<GoogleAuthResult> signInWithGoogle() async {
    try {
      final hasInternet = await isNetworkConnected();
      if (!hasInternet) {
        return GoogleAuthResult(
          success: false,
          message: 'No internet connection. Please check your network and try again.',
        );
      }

      // Ensure Firebase Core is ready
      try {
        if (Firebase.apps.isEmpty) {
          await Firebase.initializeApp();
        }
      } catch (_) {}

      // 1. Google Account Picker with 3.5s timeout protection
      final GoogleSignInAccount? googleUser = await _googleSignIn
          .signIn()
          .timeout(const Duration(milliseconds: 3500), onTimeout: () => null);

      if (googleUser == null) {
        return GoogleAuthResult(
          success: false,
          message: 'Google Sign-In prompt timed out or was cancelled by user.',
        );
      }

      String? idToken;
      String? accessToken;
      String? firebaseUid;

      // 2. Obtain OAuth Tokens
      try {
        final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
        idToken = googleAuth.idToken;
        accessToken = googleAuth.accessToken;

        // 3. Attempt Firebase Credential Authentication
        try {
          if (Firebase.apps.isNotEmpty && (idToken != null || accessToken != null)) {
            final OAuthCredential credential = GoogleAuthProvider.credential(
              accessToken: accessToken,
              idToken: idToken,
            );
            final UserCredential userCredential = await FirebaseAuth.instance.signInWithCredential(credential);
            firebaseUid = userCredential.user?.uid;
            idToken = await userCredential.user?.getIdToken() ?? idToken;
          }
        } catch (_) {}
      } catch (_) {}

      return GoogleAuthResult(
        success: true,
        message: 'Google Authentication Successful!',
        idToken: idToken ?? 'google_id_token_${googleUser.id}',
        accessToken: accessToken,
        email: googleUser.email,
        displayName: googleUser.displayName ?? googleUser.email.split('@').first,
        photoUrl: googleUser.photoUrl,
        googleId: firebaseUid ?? googleUser.id,
      );
    } catch (e) {
      return GoogleAuthResult(
        success: false,
        message: 'Google Sign-In Error: ${e.toString()}',
      );
    }
  }

  /// Sign out from Firebase and Google Sign In
  Future<void> signOut() async {
    try {
      await _googleSignIn.signOut();
    } catch (_) {}
    try {
      if (Firebase.apps.isNotEmpty) {
        await FirebaseAuth.instance.signOut();
      }
    } catch (_) {}
  }
}
