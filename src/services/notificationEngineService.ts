/* ═══════════════════════════════════════════════════════════════════ */
/* ── AURA LIVE VOICE CHAT — REAL-TIME NOTIFICATION ENGINE SERVICE ── */
/* ═══════════════════════════════════════════════════════════════════ */

import { privacyEngine } from './privacyEngineService';

export type NotificationType = 
  | 'FOLLOWING_USER_STARTED_LIVE'
  | 'NEW_DIRECT_MESSAGE'
  | 'GIFT_RECEIVED'
  | 'SYSTEM_NOTIFICATION'
  | 'SECURITY_ALERT'
  | 'FAMILY_NOTIFICATION'
  | 'INVITATION_NOTIFICATION'
  | 'AGENCY_NOTIFICATION'
  | 'ADMIN_NOTIFICATION';

export interface UserNotificationPreferences {
  userId: string;
  followingLiveAlerts: boolean;
  directMessages: boolean;
  giftReceivedAlerts: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  systemAnnouncements: boolean;
  updatedAt: string;
}

export interface AppNotification {
  id: string; // e.g. NOTIF-101
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  data?: {
    conversationId?: string;
    roomId?: string;
    giftId?: string;
    coins?: number;
    invitationId?: string;
    deepLink?: string;
  };
  read: boolean;
  deliveryStatus: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'READ';
  createdAt: string;
}

export interface NotificationDeviceToken {
  id: string;
  userId: string;
  deviceId: string;
  platform: 'Android' | 'iOS' | 'Web' | 'Desktop';
  pushToken: string;
  lastActive: string;
}

export interface AdminPushCampaign {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  targetAudience: 'ALL_USERS' | 'VIP_USERS' | 'HOSTS' | 'AGENCIES' | 'FAMILIES' | 'COUNTRY_PK';
  deepLink?: string;
  sentCount: number;
  deliveredCount: number;
  status: 'COMPLETED' | 'SCHEDULED' | 'FAILED';
  createdAt: string;
}

const STORAGE_KEY = 'AURALIVE_NOTIFICATIONS_DB_V2';
const CHANNEL_NAME = 'AURALIVE_NOTIFICATIONS_CHANNEL_V2';

/* ── 🌟 DEFAULT NOTIFICATION SEEDS FOR TEST USER (Sara_Vip7) ── */
export const DEFAULT_NOTIFICATION_PREFERENCES: UserNotificationPreferences = {
  userId: '100821',
  followingLiveAlerts: true,
  directMessages: true,
  giftReceivedAlerts: true,
  soundEnabled: true,
  vibrationEnabled: true,
  systemAnnouncements: true,
  updatedAt: new Date().toISOString(),
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-901',
    userId: '100821',
    type: 'FOLLOWING_USER_STARTED_LIVE',
    title: 'Aura Princess 👑 is Live Now',
    body: 'Join the "Urdu Ghazal & VIP Lounge" voice broadcast and chat with the host!',
    senderId: '100888',
    senderName: 'Aura Princess 👑',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
    data: {
      roomId: 'room-100888',
      deepLink: 'live/room-100888',
    },
    read: false,
    deliveryStatus: 'DELIVERED',
    createdAt: '10 minutes ago',
  },
  {
    id: 'NOTIF-902',
    userId: '100821',
    type: 'GIFT_RECEIVED',
    title: 'Gift Received from MR √Lucky☆࿐',
    body: 'You received a Royal Palace 🏰 gift (+5,000 Diamonds added to your wallet)!',
    senderId: '100850',
    senderName: 'MR √Lucky☆࿐',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
    data: {
      giftId: 'gift-palace',
      coins: 5000,
      deepLink: 'wallet/gifts',
    },
    read: false,
    deliveryStatus: 'DELIVERED',
    createdAt: '1 hour ago',
  },
  {
    id: 'NOTIF-903',
    userId: '100821',
    type: 'NEW_DIRECT_MESSAGE',
    title: 'New Message from Captain Alpha',
    body: 'The family battle starts in 10 mins. Are you ready?',
    senderId: '100720',
    senderName: 'Captain Alpha',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
    data: {
      conversationId: 'conv-100821-100720',
      deepLink: 'chat/conv-100821-100720',
    },
    read: true,
    deliveryStatus: 'READ',
    createdAt: 'Yesterday',
  },
  {
    id: 'NOTIF-904',
    userId: '100821',
    type: 'SECURITY_ALERT',
    title: 'Security Notice: New Session Authorized',
    body: 'Your account was successfully authenticated from iPhone 15 Pro Max in Dubai, UAE.',
    read: true,
    deliveryStatus: 'READ',
    createdAt: '2 days ago',
  },
];

export const INITIAL_ADMIN_CAMPAIGNS: AdminPushCampaign[] = [
  {
    id: 'CAMP-801',
    title: 'Weekend Double Diamonds Fiesta! 💎',
    body: 'Recharge any diamond pack this weekend to receive a 100% bonus CP reward badge!',
    type: 'SYSTEM_NOTIFICATION',
    targetAudience: 'ALL_USERS',
    sentCount: 14850,
    deliveredCount: 14210,
    status: 'COMPLETED',
    createdAt: '2026-08-07 12:00',
  },
  {
    id: 'CAMP-802',
    title: 'New Agency Tier Commission Structure',
    body: 'Attention agency owners: Weekly commission settlements have been processed with automated withdrawal ledger.',
    type: 'AGENCY_NOTIFICATION',
    targetAudience: 'AGENCIES',
    sentCount: 340,
    deliveredCount: 338,
    status: 'COMPLETED',
    createdAt: '2026-08-06 09:30',
  },
];

/* ── 🚀 NOTIFICATION ENGINE CLASS ── */
class NotificationEngineService {
  private preferences: Map<string, UserNotificationPreferences> = new Map();
  private notifications: AppNotification[] = [];
  private devices: NotificationDeviceToken[] = [];
  private adminCampaigns: AdminPushCampaign[] = [];
  private listeners: Set<() => void> = new Set();
  private channel: BroadcastChannel | null = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.initBroadcast();
    this.load();
  }

  private initBroadcast() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'NOTIFICATIONS_SYNC') {
            this.load();
            this.notify(false);
          }
        };
      } catch (e) {
        console.warn('Notifications BroadcastChannel init failed', e);
      }
    }
  }

  private notify(broadcast: boolean = true) {
    this.save();
    if (broadcast && this.channel) {
      try {
        this.channel.postMessage({ type: 'NOTIFICATIONS_SYNC', timestamp: Date.now() });
      } catch (e) {
        console.error(e);
      }
    }
    this.listeners.forEach(fn => {
      try { fn(); } catch (e) { console.error(e); }
    });
  }

  private load() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.preferences) {
            this.preferences = new Map(Object.entries(parsed.preferences));
          }
          this.notifications = parsed.notifications || INITIAL_NOTIFICATIONS;
          this.devices = parsed.devices || [];
          this.adminCampaigns = parsed.adminCampaigns || INITIAL_ADMIN_CAMPAIGNS;
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load notifications database', e);
    }
    this.preferences.set('100821', DEFAULT_NOTIFICATION_PREFERENCES);
    this.notifications = INITIAL_NOTIFICATIONS;
    this.adminCampaigns = INITIAL_ADMIN_CAMPAIGNS;
    this.save();
  }

  private save() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const objPrefs: Record<string, UserNotificationPreferences> = {};
        this.preferences.forEach((val, key) => {
          objPrefs[key] = val;
        });
        const payload = {
          preferences: objPrefs,
          notifications: this.notifications,
          devices: this.devices,
          adminCampaigns: this.adminCampaigns,
          lastUpdated: new Date().toISOString(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Failed to save notifications database', e);
    }
  }

  /* ── 1. PREFERENCES CRUD ── */
  public getPreferences(userId: string = '100821'): UserNotificationPreferences {
    let p = this.preferences.get(userId);
    if (!p) {
      p = {
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        userId,
        updatedAt: new Date().toISOString(),
      };
      this.preferences.set(userId, p);
      this.save();
    }
    return { ...p };
  }

  public updatePreferences(userId: string, partial: Partial<UserNotificationPreferences>): UserNotificationPreferences {
    const current = this.getPreferences(userId);
    const updated: UserNotificationPreferences = {
      ...current,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    this.preferences.set(userId, updated);
    this.notify(true);
    return updated;
  }

  /* ── 2. NOTIFICATION CENTER & QUERIES ── */
  public getNotifications(userId: string = '100821'): AppNotification[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  public getUnreadCount(userId: string = '100821'): number {
    return this.notifications.filter(n => n.userId === userId && !n.read).length;
  }

  public markAsRead(notificationId: string): void {
    const notif = this.notifications.find(n => n.id === notificationId);
    if (notif && !notif.read) {
      notif.read = true;
      notif.deliveryStatus = 'READ';
      this.notify(true);
    }
  }

  public markAllAsRead(userId: string = '100821'): void {
    let changed = false;
    this.notifications.forEach(n => {
      if (n.userId === userId && !n.read) {
        n.read = true;
        n.deliveryStatus = 'READ';
        changed = true;
      }
    });
    if (changed) {
      this.notify(true);
    }
  }

  public deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notify(true);
  }

  public clearAllNotifications(userId: string = '100821'): void {
    this.notifications = this.notifications.filter(n => n.userId !== userId);
    this.notify(true);
  }

  /* ── 3. DISPATCH NOTIFICATION WITH PREFERENCE & PRIVACY ENFORCEMENT ── */
  public dispatchNotification(payload: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    senderId?: string;
    senderName?: string;
    senderAvatar?: string;
    data?: AppNotification['data'];
  }): AppNotification | null {
    const prefs = this.getPreferences(payload.userId);

    // Check Privacy Engine Mute / Block
    if (payload.senderId) {
      if (privacyEngine.isBlocked(payload.userId, payload.senderId)) {
        console.log(`[NOTIF] Suppressed notification from blocked user ${payload.senderId}`);
        return null;
      }
      if (privacyEngine.isMuted(payload.userId, payload.senderId)) {
        console.log(`[NOTIF] Suppressed notification from muted user ${payload.senderId}`);
        return null;
      }
    }

    // Check Notification Preference Switches
    if (payload.type === 'FOLLOWING_USER_STARTED_LIVE' && !prefs.followingLiveAlerts) {
      console.log('[NOTIF] Suppressed Following Live Alert per user setting');
      return null;
    }
    if (payload.type === 'NEW_DIRECT_MESSAGE' && !prefs.directMessages) {
      console.log('[NOTIF] Suppressed Direct Message push alert per user setting');
      return null;
    }
    if (payload.type === 'GIFT_RECEIVED' && !prefs.giftReceivedAlerts) {
      console.log('[NOTIF] Suppressed Gift Received push alert per user setting');
      return null;
    }

    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      userId: payload.userId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      senderId: payload.senderId,
      senderName: payload.senderName,
      senderAvatar: payload.senderAvatar,
      data: payload.data,
      read: false,
      deliveryStatus: 'DELIVERED',
      createdAt: 'Just now',
    };

    this.notifications.unshift(newNotif);

    // Audio & Haptic Feedback if enabled
    if (prefs.soundEnabled) {
      this.playChimeSound();
    }
    if (prefs.vibrationEnabled && typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch (e) {
        // Safe fallback
      }
    }

    // Native Web Notification dispatch if permission granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(payload.title, {
          body: payload.body,
          icon: payload.senderAvatar || '/favicon.ico',
        });
      } catch (e) {
        console.warn('Native notification failed', e);
      }
    }

    this.notify(true);
    return newNotif;
  }

  /* ── 4. WEB AUDIO SYNTHESIZER CHIME ── */
  public playChimeSound() {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  /* ── 5. ADMIN PUSH CAMPAIGNS ── */
  public getAdminCampaigns(): AdminPushCampaign[] {
    return [...this.adminCampaigns];
  }

  public createAdminCampaign(campaign: Omit<AdminPushCampaign, 'id' | 'sentCount' | 'deliveredCount' | 'createdAt'>): AdminPushCampaign {
    const newCamp: AdminPushCampaign = {
      ...campaign,
      id: `CAMP-${Date.now()}`,
      sentCount: 15420,
      deliveredCount: 15190,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    this.adminCampaigns.unshift(newCamp);

    // Broadcast to current user
    this.dispatchNotification({
      userId: '100821',
      type: campaign.type,
      title: campaign.title,
      body: campaign.body,
      data: { deepLink: campaign.deepLink },
    });

    this.notify(true);
    return newCamp;
  }

  /* ── 6. REACTIVE SUBSCRIPTION ── */
  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const notificationEngine = new NotificationEngineService();
