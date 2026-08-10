/* ═══════════════════════════════════════════════════════════════════ */
/* ── AURA LIVE VOICE CHAT — REAL-TIME PRIVACY RULE ENGINE SERVICE ── */
/* ═══════════════════════════════════════════════════════════════════ */

export interface UserPrivacySettings {
  userId: string;
  hideOnlineStatus: boolean;
  hideNearbyDistance: boolean;
  hideVipBadge: boolean;
  allowPrivateMessagesFrom: 'EVERYONE' | 'FOLLOWERS_ONLY' | 'NO_ONE';
  allowTaggingInMoments: boolean;
  profileVisibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
  updatedAt: string;
}

export interface BlockedUserRecord {
  id: string; // e.g. BLK-101
  blockerId: string;
  blockedId: string;
  blockedUserName: string;
  blockedUserAvatar: string;
  blockedUserBadge?: string;
  blockedUserGender?: 'male' | 'female';
  reason?: string;
  blockedAt: string;
}

export interface MutedUserRecord {
  id: string; // e.g. MUT-101
  muterId: string;
  mutedId: string;
  mutedUserName: string;
  mutedUserAvatar: string;
  mutedAt: string;
}

export interface PrivacyAuditLog {
  id: string;
  userId: string;
  action: 'UPDATE_PRIVACY' | 'BLOCK_USER' | 'UNBLOCK_USER' | 'MUTE_USER' | 'UNMUTE_USER' | 'ADMIN_PRIVACY_OVERRIDE';
  details: string;
  timestamp: string;
}

const STORAGE_KEY = 'AURALIVE_PRIVACY_DB_V2';
const CHANNEL_NAME = 'AURALIVE_PRIVACY_CHANNEL_V2';

/* ── 🌟 DEFAULT PRIVACY SEED DATA ── */
export const DEFAULT_PRIVACY_SETTINGS: UserPrivacySettings = {
  userId: '100821', // Sara_Vip7
  hideOnlineStatus: false,
  hideNearbyDistance: false,
  hideVipBadge: false,
  allowPrivateMessagesFrom: 'EVERYONE',
  allowTaggingInMoments: true,
  profileVisibility: 'PUBLIC',
  updatedAt: new Date().toISOString(),
};

export const INITIAL_BLOCKED_USERS: BlockedUserRecord[] = [
  {
    id: 'BLK-901',
    blockerId: '100821',
    blockedId: '100998',
    blockedUserName: 'King_Rana_VIP',
    blockedUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
    blockedUserBadge: 'VIP 5',
    blockedUserGender: 'male',
    reason: 'Unsolicited spam in live stream chat.',
    blockedAt: '2026-07-28 16:40',
  },
  {
    id: 'BLK-902',
    blockerId: '100821',
    blockedId: '100412',
    blockedUserName: 'Toxic_Gamer99',
    blockedUserAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
    blockedUserBadge: 'Noble',
    blockedUserGender: 'male',
    reason: 'Inappropriate DM behavior.',
    blockedAt: '2026-08-01 22:15',
  },
];

export const INITIAL_MUTED_USERS: MutedUserRecord[] = [
  {
    id: 'MUT-801',
    muterId: '100821',
    mutedId: '100615',
    mutedUserName: 'Brother Mike',
    mutedUserAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&auto=format',
    mutedAt: '2026-08-03 14:10',
  },
];

/* ── 🚀 PRIVACY ENGINE CLASS ── */
class PrivacyEngineService {
  private settings: Map<string, UserPrivacySettings> = new Map();
  private blockedUsers: BlockedUserRecord[] = [];
  private mutedUsers: MutedUserRecord[] = [];
  private auditLogs: PrivacyAuditLog[] = [];
  private listeners: Set<() => void> = new Set();
  private channel: BroadcastChannel | null = null;

  constructor() {
    this.initBroadcast();
    this.load();
  }

  private initBroadcast() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'PRIVACY_SYNC') {
            this.load();
            this.notify(false);
          }
        };
      } catch (e) {
        console.warn('Privacy BroadcastChannel init failed', e);
      }
    }
  }

  private notify(broadcast: boolean = true) {
    this.save();
    if (broadcast && this.channel) {
      try {
        this.channel.postMessage({ type: 'PRIVACY_SYNC', timestamp: Date.now() });
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
          if (parsed.settings) {
            this.settings = new Map(Object.entries(parsed.settings));
          }
          this.blockedUsers = parsed.blockedUsers || INITIAL_BLOCKED_USERS;
          this.mutedUsers = parsed.mutedUsers || INITIAL_MUTED_USERS;
          this.auditLogs = parsed.auditLogs || [];
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load privacy database', e);
    }
    this.settings.set('100821', DEFAULT_PRIVACY_SETTINGS);
    this.blockedUsers = INITIAL_BLOCKED_USERS;
    this.mutedUsers = INITIAL_MUTED_USERS;
    this.auditLogs = [];
    this.save();
  }

  private save() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const objSettings: Record<string, UserPrivacySettings> = {};
        this.settings.forEach((val, key) => {
          objSettings[key] = val;
        });
        const payload = {
          settings: objSettings,
          blockedUsers: this.blockedUsers,
          mutedUsers: this.mutedUsers,
          auditLogs: this.auditLogs,
          lastUpdated: new Date().toISOString(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Failed to save privacy database', e);
    }
  }

  /* ── 1. GET USER PRIVACY SETTINGS ── */
  public getSettings(userId: string = '100821'): UserPrivacySettings {
    let s = this.settings.get(userId);
    if (!s) {
      s = {
        ...DEFAULT_PRIVACY_SETTINGS,
        userId,
        updatedAt: new Date().toISOString(),
      };
      this.settings.set(userId, s);
      this.save();
    }
    return { ...s };
  }

  /* ── 2. UPDATE USER PRIVACY SETTINGS ── */
  public updateSettings(userId: string, partial: Partial<UserPrivacySettings>): UserPrivacySettings {
    const current = this.getSettings(userId);
    const updated: UserPrivacySettings = {
      ...current,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    this.settings.set(userId, updated);

    this.logAudit({
      userId,
      action: 'UPDATE_PRIVACY',
      details: `Privacy settings updated: Online=${updated.hideOnlineStatus}, Distance=${updated.hideNearbyDistance}, VIP=${updated.hideVipBadge}`,
    });

    this.notify(true);
    return updated;
  }

  /* ── 3. CENTRALIZED PRIVACY RULES ── */

  /**
   * Rule: Can viewer see target user's green Online dot?
   */
  public canViewOnlineStatus(viewerId: string, targetUserId: string): boolean {
    if (viewerId === targetUserId) return true;
    if (this.isBlocked(viewerId, targetUserId)) return false;

    const targetSettings = this.getSettings(targetUserId);
    if (targetSettings.hideOnlineStatus) {
      return false; // Suppressed for unauthorized viewers
    }
    return true;
  }

  /**
   * Rule: Can viewer see target user's exact nearby distance (e.g. 1.2 km)?
   */
  public canViewDistance(viewerId: string, targetUserId: string): boolean {
    if (viewerId === targetUserId) return true;
    if (this.isBlocked(viewerId, targetUserId)) return false;

    const targetSettings = this.getSettings(targetUserId);
    if (targetSettings.hideNearbyDistance) {
      return false; // Exact distance hidden by policy
    }
    return true;
  }

  /**
   * Rule: Can viewer see target user's Noble or VIP tier badge?
   */
  public canViewVipBadge(viewerId: string, targetUserId: string): boolean {
    if (viewerId === targetUserId) return true;

    const targetSettings = this.getSettings(targetUserId);
    if (targetSettings.hideVipBadge) {
      return false; // VIP badge hidden by policy
    }
    return true;
  }

  /**
   * Rule: Can viewer send a private 1-on-1 chat message to target?
   */
  public canMessage(viewerId: string, targetUserId: string): { allowed: boolean; reason?: string } {
    if (this.isBlocked(viewerId, targetUserId)) {
      return { allowed: false, reason: 'You cannot message this user because a block restriction is active.' };
    }
    if (this.isBlocked(targetUserId, viewerId)) {
      return { allowed: false, reason: 'This recipient has restricted messages from you.' };
    }

    const targetSettings = this.getSettings(targetUserId);
    if (targetSettings.allowPrivateMessagesFrom === 'NO_ONE') {
      return { allowed: false, reason: 'This user does not accept direct messages.' };
    }

    return { allowed: true };
  }

  /* ── 4. BLOCK USER MANAGEMENT ── */
  public getBlockedUsers(blockerId: string = '100821'): BlockedUserRecord[] {
    return this.blockedUsers.filter(b => b.blockerId === blockerId);
  }

  public isBlocked(userA: string, userB: string): boolean {
    return this.blockedUsers.some(
      b => (b.blockerId === userA && b.blockedId === userB) ||
           (b.blockerId === userB && b.blockedId === userA)
    );
  }

  public blockUser(
    blockerId: string,
    target: { id: string; name: string; avatar: string; badge?: string; gender?: 'male' | 'female' },
    reason: string = 'User blocked via Privacy Controls.'
  ): BlockedUserRecord {
    // Prevent duplicate block
    const existing = this.blockedUsers.find(b => b.blockerId === blockerId && b.blockedId === target.id);
    if (existing) return existing;

    const newBlock: BlockedUserRecord = {
      id: `BLK-${Date.now()}`,
      blockerId,
      blockedId: target.id,
      blockedUserName: target.name,
      blockedUserAvatar: target.avatar,
      blockedUserBadge: target.badge || 'VIP Member',
      blockedUserGender: target.gender || 'male',
      reason,
      blockedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    this.blockedUsers.unshift(newBlock);

    this.logAudit({
      userId: blockerId,
      action: 'BLOCK_USER',
      details: `Blocked user ${target.name} (UID: ${target.id}). Reason: ${reason}`,
    });

    this.notify(true);
    return newBlock;
  }

  public unblockUser(blockerId: string, targetUserId: string): boolean {
    const prevLen = this.blockedUsers.length;
    this.blockedUsers = this.blockedUsers.filter(
      b => !(b.blockerId === blockerId && b.blockedId === targetUserId)
    );

    if (this.blockedUsers.length < prevLen) {
      this.logAudit({
        userId: blockerId,
        action: 'UNBLOCK_USER',
        details: `Unblocked user UID: ${targetUserId}`,
      });
      this.notify(true);
      return true;
    }
    return false;
  }

  /* ── 5. MUTE USER MANAGEMENT ── */
  public getMutedUsers(muterId: string = '100821'): MutedUserRecord[] {
    return this.mutedUsers.filter(m => m.muterId === muterId);
  }

  public isMuted(muterId: string, targetUserId: string): boolean {
    return this.mutedUsers.some(m => m.muterId === muterId && m.mutedId === targetUserId);
  }

  public muteUser(
    muterId: string,
    target: { id: string; name: string; avatar: string }
  ): MutedUserRecord {
    const existing = this.mutedUsers.find(m => m.muterId === muterId && m.mutedId === target.id);
    if (existing) return existing;

    const newMute: MutedUserRecord = {
      id: `MUT-${Date.now()}`,
      muterId,
      mutedId: target.id,
      mutedUserName: target.name,
      mutedUserAvatar: target.avatar,
      mutedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    this.mutedUsers.unshift(newMute);

    this.logAudit({
      userId: muterId,
      action: 'MUTE_USER',
      details: `Muted alerts from user ${target.name} (UID: ${target.id})`,
    });

    this.notify(true);
    return newMute;
  }

  public unmuteUser(muterId: string, targetUserId: string): boolean {
    const prevLen = this.mutedUsers.length;
    this.mutedUsers = this.mutedUsers.filter(
      m => !(m.muterId === muterId && m.mutedId === targetUserId)
    );

    if (this.mutedUsers.length < prevLen) {
      this.logAudit({
        userId: muterId,
        action: 'UNMUTE_USER',
        details: `Unmuted notifications from user UID: ${targetUserId}`,
      });
      this.notify(true);
      return true;
    }
    return false;
  }

  /* ── 6. AUDIT LOGS ── */
  public getAuditLogs(): PrivacyAuditLog[] {
    return [...this.auditLogs];
  }

  private logAudit(entry: Omit<PrivacyAuditLog, 'id' | 'timestamp'>) {
    const log: PrivacyAuditLog = {
      ...entry,
      id: `PAUD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    this.auditLogs.unshift(log);
  }

  /* ── 7. REACTIVE SUBSCRIPTIONS ── */
  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const privacyEngine = new PrivacyEngineService();
