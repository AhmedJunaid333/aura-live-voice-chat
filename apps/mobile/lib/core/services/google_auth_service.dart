import 'package:connectivity_plus/connectivity_plus.dart';
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
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;

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

      // 1. Google Account Picker
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        return GoogleAuthResult(
          success: false,
          message: 'Google Sign-In was cancelled by user.',
        );
      }

      // 2. Obtain OAuth Auth Details
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

      // 3. Create Firebase Credential
      final OAuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      // 4. Authenticate with Firebase
      final UserCredential userCredential = await _firebaseAuth.signInWithCredential(credential);
      final User? firebaseUser = userCredential.user;

      final String? idToken = await firebaseUser?.getIdToken() ?? googleAuth.idToken;

      return GoogleAuthResult(
        success: true,
        message: 'Google Authentication Successful!',
        idToken: idToken,
        accessToken: googleAuth.accessToken,
        email: firebaseUser?.email ?? googleUser.email,
        displayName: firebaseUser?.displayName ?? googleUser.displayName ?? googleUser.email.split('@').first,
        photoUrl: firebaseUser?.photoURL ?? googleUser.photoUrl,
        googleId: firebaseUser?.uid ?? googleUser.id,
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
      await _firebaseAuth.signOut();
    } catch (_) {}
  }
}
