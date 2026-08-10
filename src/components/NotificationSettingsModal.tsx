import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Bell, Radio, MessageSquare, Gift, Volume2, 
  VolumeX, RefreshCw, Check, CheckCircle2, ArrowRight, Trash2, 
  Sparkles, ExternalLink, ShieldAlert, Play, Heart, Smartphone
} from 'lucide-react';
import { 
  notificationEngine, UserNotificationPreferences, AppNotification 
} from '../services/notificationEngineService';
import { toast } from '../services/toastAndErrorService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onNavigateToRoom?: (roomId: string) => void;
  onNavigateToChat?: (conversationId: string) => void;
}

export const NotificationSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userId = '100821',
  onNavigateToRoom,
  onNavigateToChat,
}) => {
  const [preferences, setPreferences] = useState<UserNotificationPreferences>(() => 
    notificationEngine.getPreferences(userId)
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() => 
    notificationEngine.getNotifications(userId)
  );
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [osPermission, setOsPermission] = useState<NotificationPermission>('default');

  // Real-time synchronization
  useEffect(() => {
    const sync = () => {
      setPreferences(notificationEngine.getPreferences(userId));
      setNotifications(notificationEngine.getNotifications(userId));
    };
    sync();
    const unsub = notificationEngine.subscribe(sync);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setOsPermission(Notification.permission);
    }
    return () => unsub();
  }, [userId]);

  if (!isOpen) return null;

  /* ── 1. TOGGLE HANDLERS ── */
  const handleToggleFollowingLive = () => {
    const nextVal = !preferences.followingLiveAlerts;
    notificationEngine.updatePreferences(userId, { followingLiveAlerts: nextVal });
    if (nextVal) {
      toast.success('Live alerts enabled for followed broadcasters.');
    } else {
      toast.info('Live broadcast push notifications disabled.');
    }
  };

  const handleToggleDirectMessages = () => {
    const nextVal = !preferences.directMessages;
    notificationEngine.updatePreferences(userId, { directMessages: nextVal });
    if (nextVal) {
      toast.success('Direct message push notifications enabled.');
    } else {
      toast.info('Direct message push alerts disabled.');
    }
  };

  const handleToggleGiftAlerts = () => {
    const nextVal = !preferences.giftReceivedAlerts;
    notificationEngine.updatePreferences(userId, { giftReceivedAlerts: nextVal });
    if (nextVal) {
      toast.success('Gift received notifications enabled.');
    } else {
      toast.info('Gift received notifications disabled.');
    }
  };

  const handleToggleSoundVibration = () => {
    const nextVal = !preferences.soundEnabled;
    notificationEngine.updatePreferences(userId, { 
      soundEnabled: nextVal, 
      vibrationEnabled: nextVal 
    });
    if (nextVal) {
      notificationEngine.playChimeSound();
      toast.success('Sound and vibration feedback enabled.');
    } else {
      toast.info('Sound and vibration muted.');
    }
  };

  /* ── 2. REQUEST OS PUSH PERMISSION ── */
  const handleRequestOsPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setOsPermission(perm);
        if (perm === 'granted') {
          toast.success('Device push notification authorization granted!');
        } else {
          toast.error('Push notification permission denied in browser/system settings.');
        }
      } catch (e) {
        toast.error('Unable to request system notification permission.');
      }
    } else {
      toast.info('Simulated in-app push alerts active.');
    }
  };

  /* ── 3. TEST SIMULATION HANDLERS ── */
  const handleTestLiveAlert = () => {
    const notif = notificationEngine.dispatchNotification({
      userId,
      type: 'FOLLOWING_USER_STARTED_LIVE',
      title: 'Aura Princess 👑 is Live Now',
      body: 'Join the "Urdu Ghazal & VIP Lounge" voice broadcast and chat with the host!',
      senderId: '100888',
      senderName: 'Aura Princess 👑',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
      data: { roomId: 'room-100888' },
    });
    if (notif) {
      toast.success('Live broadcast notification dispatched!');
    } else {
      toast.info('Notification suppressed per your Following Live Alerts setting.');
    }
  };

  const handleTestMessageAlert = () => {
    const notif = notificationEngine.dispatchNotification({
      userId,
      type: 'NEW_DIRECT_MESSAGE',
      title: 'New Message from MR √Lucky☆࿐',
      body: 'See you in the room later! 🚀',
      senderId: '100850',
      senderName: 'MR √Lucky☆࿐',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
      data: { conversationId: 'conv-100821-100850' },
    });
    if (notif) {
      toast.success('Direct message push alert dispatched!');
    } else {
      toast.info('Notification suppressed per your Direct Messages setting.');
    }
  };

  const handleTestGiftAlert = () => {
    const notif = notificationEngine.dispatchNotification({
      userId,
      type: 'GIFT_RECEIVED',
      title: 'Gift Received from Captain Alpha',
      body: 'You received a Diamond Crown 👑 (+10,000 Diamonds added to wallet)!',
      senderId: '100720',
      senderName: 'Captain Alpha',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
      data: { giftId: 'gift-crown', coins: 10000 },
    });
    if (notif) {
      toast.success('Gift received notification dispatched!');
    } else {
      toast.info('Notification suppressed per your Gift Alerts setting.');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#08040F] text-white flex flex-col animate-fadeIn select-none overflow-y-auto custom-scrollbar">
      
      {/* ── 1. TOP APP BAR ── */}
      <header className="sticky top-0 z-40 px-4 py-3.5 bg-[#120A24]/95 backdrop-blur-xl border-b border-purple-900/30 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-purple-950/60 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-white tracking-wide">
            Notification Settings
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowNotificationCenter(true)}
            className="relative p-2 rounded-full hover:bg-purple-950/60 text-purple-300 hover:text-white transition cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border border-[#120A24]">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── 2. MAIN SETTINGS CARDS ── */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-5 pb-20">
        
        {/* Banner Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/70 via-[#1B1038] to-[#0A0614] border border-purple-500/30 shadow-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Bell className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Push Alert Preferences</h3>
                <p className="text-[11px] text-slate-300">
                  Control real-time notifications for live streams, direct messages, and gifts.
                </p>
              </div>
            </div>
          </div>

          {osPermission !== 'granted' && (
            <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-300">
                <Smartphone className="w-4 h-4 flex-shrink-0" />
                <span className="text-[10px] font-bold">OS Notification Permission: {osPermission}</span>
              </div>
              <button 
                onClick={handleRequestOsPermission}
                className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[10px] shadow-sm cursor-pointer"
              >
                Enable Push
              </button>
            </div>
          )}
        </div>

        {/* ── SECTION 1: PUSH ALERTS ── */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
            Push Alerts
          </span>

          <div className="p-4 rounded-3xl bg-[#140D24] border border-purple-900/30 divide-y divide-purple-900/30 shadow-xl">
            
            {/* Toggle 1: Following Live Alerts */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                  <Radio className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Following Live Alerts</h4>
                  <p className="text-[10px] text-slate-400 max-w-[240px]">
                    Receive push alerts when broadcasters you follow start a live stream.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleToggleFollowingLive}
                aria-label="Toggle Following Live Alerts"
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  preferences.followingLiveAlerts ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Toggle 2: Direct Messages */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Direct Messages</h4>
                  <p className="text-[10px] text-slate-400 max-w-[240px]">
                    Get notified when friends send you 1-on-1 chat messages.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleToggleDirectMessages}
                aria-label="Toggle Direct Messages Alerts"
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  preferences.directMessages ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Toggle 3: Gift Received Alerts */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                  <Gift className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Gift Received Alerts</h4>
                  <p className="text-[10px] text-slate-400 max-w-[240px]">
                    Alerts when other users send you virtual gifts and diamonds.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleToggleGiftAlerts}
                aria-label="Toggle Gift Received Alerts"
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  preferences.giftReceivedAlerts ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Toggle 4: Sound & Vibration */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                  {preferences.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Sound & Vibration</h4>
                  <p className="text-[10px] text-slate-400 max-w-[240px]">
                    Play audio chimes and haptic pulses for incoming alerts.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleToggleSoundVibration}
                aria-label="Toggle Sound & Vibration"
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  preferences.soundEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

          </div>
        </div>

        {/* ── SECTION 2: IN-APP NOTIFICATION CENTER TRIGGER ── */}
        <div className="p-4 rounded-3xl bg-[#140D24] border border-purple-900/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              In-App Notification Center
            </span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                {unreadCount} Unread
              </span>
            )}
          </div>

          <button 
            onClick={() => setShowNotificationCenter(true)}
            className="w-full py-3 px-4 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/40 flex items-center justify-between text-xs font-bold transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#D4AF37]" />
              <span>Open Notification History</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* ── SECTION 3: TEST DISPATCH TOOLBAR (FOR QA) ── */}
        <div className="p-4 rounded-3xl bg-black/40 border border-purple-900/30 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Real-Time Push Simulation Toolbar
          </span>
          <p className="text-[10px] text-slate-400">
            Dispatch test events to verify real-time suppression, sound synthesis, and tap routing:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button 
              onClick={handleTestLiveAlert}
              className="p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-pink-300 text-[10px] font-bold border border-purple-800/40 transition cursor-pointer"
            >
              ⚡ Test Live Broadcast
            </button>
            <button 
              onClick={handleTestMessageAlert}
              className="p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-cyan-300 text-[10px] font-bold border border-purple-800/40 transition cursor-pointer"
            >
              💬 Test Direct Message
            </button>
            <button 
              onClick={handleTestGiftAlert}
              className="p-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-amber-300 text-[10px] font-bold border border-purple-800/40 transition cursor-pointer"
            >
              🎁 Test Gift Received
            </button>
          </div>
        </div>

      </main>

      {/* ── 3. IN-APP NOTIFICATION CENTER DRAWER / MODAL ── */}
      {showNotificationCenter && (
        <div className="fixed inset-0 z-50 bg-[#08040F] text-white flex flex-col animate-fadeIn select-none">
          <header className="sticky top-0 z-40 px-4 py-3.5 bg-[#120A24]/95 backdrop-blur-xl border-b border-purple-900/30 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowNotificationCenter(false)}
                className="p-1.5 rounded-full hover:bg-purple-950/60 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg font-black text-white tracking-wide">
                  Notification Center
                </h1>
                <span className="text-[10px] text-slate-400 font-mono">
                  {notifications.length} alerts • {unreadCount} unread
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => notificationEngine.markAllAsRead(userId)}
                className="px-2.5 py-1 rounded-xl bg-purple-950/80 text-purple-300 text-[10px] font-bold hover:bg-purple-900 transition"
              >
                Mark Read
              </button>
              <button 
                onClick={() => notificationEngine.clearAllNotifications(userId)}
                className="p-1.5 rounded-xl bg-rose-950/80 text-rose-300 text-[10px] font-bold hover:bg-rose-900 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          <div className="p-4 max-w-lg mx-auto w-full space-y-3 flex-1 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="text-center py-20 text-slate-500 space-y-2">
                <Bell className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-xs">No notifications yet.</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id}
                  onClick={() => {
                    notificationEngine.markAsRead(notif.id);
                    if (notif.data?.roomId && onNavigateToRoom) {
                      onNavigateToRoom(notif.data.roomId);
                      setShowNotificationCenter(false);
                      onClose();
                    } else if (notif.data?.conversationId && onNavigateToChat) {
                      onNavigateToChat(notif.data.conversationId);
                      setShowNotificationCenter(false);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-md ${
                    notif.read 
                      ? 'bg-[#140D24]/60 border-purple-900/20' 
                      : 'bg-[#1C1631] border-purple-500/40 shadow-purple-950/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {notif.senderAvatar ? (
                      <img src={notif.senderAvatar} alt={notif.senderName} className="w-10 h-10 rounded-full object-cover border border-purple-700 flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-purple-900/50 flex items-center justify-center text-purple-300 flex-shrink-0">
                        <Bell className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs truncate ${notif.read ? 'text-slate-300 font-semibold' : 'text-white font-black'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-mono ml-2 flex-shrink-0">
                          {notif.createdAt}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                        {notif.body}
                      </p>

                      {notif.data?.deepLink && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-purple-300 font-bold">
                          <span>Open Activity</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
