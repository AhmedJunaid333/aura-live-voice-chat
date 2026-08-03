import 'dart:async';
import 'package:agora_rtc_engine/agora_rtc_engine.dart';
import 'package:flutter/foundation.dart';
import 'package:permission_handler/permission_handler.dart';

/// Callback signatures for RTC Engine events
typedef OnVolumeIndicationCallback = void Function(List<AudioVolumeInfo> speakers, int totalVolume);
typedef OnTokenWillExpireCallback = void Function(String channelId);
typedef OnUserJoinedCallback = void Function(int uid, int elapsed);
typedef OnUserOfflineCallback = void Function(int uid, UserOfflineReasonType reason);
typedef OnConnectionStateCallback = void Function(ConnectionStateType state, ConnectionChangedReasonType reason);
typedef OnErrorCallback = void Function(ErrorCodeType err, String msg);

/// Production Agora RTC SDK Service Wrapper
class AgoraRtcService {
  static final AgoraRtcService _instance = AgoraRtcService._internal();
  factory AgoraRtcService() => _instance;
  AgoraRtcService._internal();

  RtcEngine? _engine;
  bool _isInitialized = false;
  bool _isJoined = false;
  bool _isMicMuted = false;
  String? _currentChannelId;
  int? _currentUid;
  ClientRoleType _currentRole = ClientRoleType.clientRoleAudience;

  // Registered Event Listeners
  OnVolumeIndicationCallback? onVolumeIndication;
  OnTokenWillExpireCallback? onTokenWillExpire;
  OnUserJoinedCallback? onUserJoined;
  OnUserOfflineCallback? onUserOffline;
  OnConnectionStateCallback? onConnectionState;
  OnErrorCallback? onErrorOccurred;

  bool get isInitialized => _isInitialized;
  bool get isJoined => _isJoined;
  bool get isMicMuted => _isMicMuted;
  ClientRoleType get currentRole => _currentRole;
  String? get currentChannelId => _currentChannelId;
  int? get currentUid => _currentUid;

  /// Request microphone permission prior to joining audio channel
  Future<bool> requestMicrophonePermission() async {
    final status = await Permission.microphone.request();
    return status.isGranted;
  }

  /// Initialize Agora RTC Engine with production 3A Audio settings
  Future<void> initializeEngine({required String appId}) async {
    if (_isInitialized && _engine != null) return;

    try {
      _engine = createAgoraRtcEngine();
      await _engine!.initialize(RtcEngineContext(
        appId: appId,
        channelProfile: ChannelProfileType.channelProfileLiveBroadcasting,
        audioScenario: AudioScenarioType.audioScenarioGameStreaming,
      ));

      // Register RTC Event Handlers
      _engine!.registerEventHandler(RtcEngineEventHandler(
        onJoinChannelSuccess: (RtcConnection connection, int elapsed) {
          debugPrint('🎙️ Agora RTC Joined Channel: ${connection.channelId}, UID: ${connection.localUid}');
          _isJoined = true;
          _currentChannelId = connection.channelId;
          _currentUid = connection.localUid;
        },
        onLeaveChannel: (RtcConnection connection, RtcStats stats) {
          debugPrint('🎙️ Agora RTC Left Channel: ${connection.channelId}');
          _isJoined = false;
          _currentChannelId = null;
        },
        onUserJoined: (RtcConnection connection, int remoteUid, int elapsed) {
          debugPrint('👥 Remote Speaker Joined: $remoteUid');
          onUserJoined?.call(remoteUid, elapsed);
        },
        onUserOffline: (RtcConnection connection, int remoteUid, UserOfflineReasonType reason) {
          debugPrint('👤 Remote Speaker Offline: $remoteUid (Reason: $reason)');
          onUserOffline?.call(remoteUid, reason);
        },
        onTokenPrivilegeWillExpire: (RtcConnection connection, String token) {
          debugPrint('⚠️ Agora RTC Token Privilege Will Expire! Refreshing token...');
          if (connection.channelId != null) {
            onTokenWillExpire?.call(connection.channelId!);
          }
        },
        onConnectionStateChanged: (RtcConnection connection, ConnectionStateType state, ConnectionChangedReasonType reason) {
          debugPrint('📶 RTC Connection State Changed: $state (Reason: $reason)');
          onConnectionState?.call(state, reason);
        },
        onAudioVolumeIndication: (RtcConnection connection, List<AudioVolumeInfo> speakers, int speakerNum, int totalVolume) {
          onVolumeIndication?.call(speakers, totalVolume);
        },
        onError: (ErrorCodeType err, String msg) {
          debugPrint('❌ Agora RTC Engine Error: $err - $msg');
          onErrorOccurred?.call(err, msg);
        },
      ));

      // Enable Audio & 3A Processing (AEC, ANS, AGC)
      await _engine!.enableAudio();
      await _engine!.setAudioProfile(
        profile: AudioProfileType.audioProfileMusicHighQualityStereo,
        scenario: AudioScenarioType.audioScenarioGameStreaming,
      );

      // Enable Real-time Volume Indications (200ms interval for smooth speaking animation)
      await _engine!.enableAudioVolumeIndication(
        interval: 200,
        smooth: 3,
        reportVad: true,
      );

      _isInitialized = true;
    } catch (e) {
      debugPrint('❌ Failed to initialize Agora RTC Engine: $e');
    }
  }

  /// Join Audio Voice Room with specified role and backend token
  Future<bool> joinChannel({
    required String channelId,
    required String token,
    required int uid,
    required bool isBroadcaster,
  }) async {
    if (_engine == null) return false;

    if (isBroadcaster) {
      final hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        debugPrint('⚠️ Microphone permission denied');
        return false;
      }
    }

    _currentRole = isBroadcaster
        ? ClientRoleType.clientRoleBroadcaster
        : ClientRoleType.clientRoleAudience;

    await _engine!.setClientRole(role: _currentRole);

    final ChannelMediaOptions options = ChannelMediaOptions(
      channelProfile: ChannelProfileType.channelProfileLiveBroadcasting,
      clientRoleType: _currentRole,
      publishMicrophoneTrack: isBroadcaster,
      autoSubscribeAudio: true,
    );

    try {
      await _engine!.joinChannel(
        token: token,
        channelId: channelId,
        uid: uid,
        options: options,
      );
      _isMicMuted = false;
      return true;
    } catch (e) {
      debugPrint('❌ Join Channel Failed: $e');
      return false;
    }
  }

  /// Dynamically switch client role (Audience <-> Broadcaster / Speaker)
  Future<void> switchRole({required bool isBroadcaster}) async {
    if (_engine == null || !_isJoined) return;

    if (isBroadcaster) {
      final hasPermission = await requestMicrophonePermission();
      if (!hasPermission) return;
    }

    _currentRole = isBroadcaster
        ? ClientRoleType.clientRoleBroadcaster
        : ClientRoleType.clientRoleAudience;

    await _engine!.setClientRole(role: _currentRole);
    await _engine!.updateChannelMediaOptions(ChannelMediaOptions(
      publishMicrophoneTrack: isBroadcaster && !_isMicMuted,
      autoSubscribeAudio: true,
    ));
  }

  /// Mute or Unmute Local Microphone
  Future<void> setMicrophoneMuted(bool mute) async {
    if (_engine == null) return;
    _isMicMuted = mute;
    await _engine!.muteLocalAudioStream(mute);
    await _engine!.updateChannelMediaOptions(ChannelMediaOptions(
      publishMicrophoneTrack: !_isMicMuted && _currentRole == ClientRoleType.clientRoleBroadcaster,
    ));
  }

  /// Renew RTC Token before expiration without dropping connection
  Future<void> renewToken(String newToken) async {
    if (_engine == null || !_isJoined) return;
    try {
      await _engine!.renewToken(newToken);
      debugPrint('✅ Agora RTC Token Renewed Successfully!');
    } catch (e) {
      debugPrint('❌ Failed to renew RTC Token: $e');
    }
  }

  /// Leave Room Channel
  Future<void> leaveChannel() async {
    if (_engine == null || !_isJoined) return;
    try {
      await _engine!.leaveChannel();
      _isJoined = false;
      _currentChannelId = null;
      _currentUid = null;
    } catch (e) {
      debugPrint('❌ Error leaving channel: $e');
    }
  }

  /// Destroy Engine on App Shutdown
  Future<void> release() async {
    if (_engine != null) {
      await leaveChannel();
      await _engine!.release();
      _engine = null;
      _isInitialized = false;
    }
  }
}
