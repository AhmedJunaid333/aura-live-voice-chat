/* ═══════════════════════════════════════════════════════════════════ */
/* ── AURA LIVE VOICE CHAT — REAL-TIME USER PROFILE SERVICE ───────── */
/* ═══════════════════════════════════════════════════════════════════ */

export interface UserProfileData {
  userId: string; // e.g. '100821'
  username: string; // e.g. 'Sara_Vip7'
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  bio: string;
  birthday: string; // '1998-06-15'
  country: string; // 'Pakistan'
  countryFlag: string; // '🇵🇰'
  countryCode: string; // 'PK'
  avatar: string;
  photos: string[]; // photo 1, photo 2, photo 3, photo 4, ...
  vipBadge: string; // 'VIP 10'
  level: number; // 45
  xp: number;
  familyName?: string;
  agencyName?: string;
  profileCompletion: number; // percentage 0-100
  verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'UNDER_REVIEW';
  updatedAt: string;
}

export interface ProfileAuditRecord {
  id: string;
  userId: string;
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
}

const STORAGE_KEY = 'AURALIVE_USER_PROFILE_DB_V2';
const CHANNEL_NAME = 'AURALIVE_PROFILE_CHANNEL_V2';

/* ── 🌟 DEFAULT AUTHENTICATED PROFILE ── */
export const DEFAULT_USER_PROFILE: UserProfileData = {
  userId: '100001',
  username: 'User_100001',
  gender: 'Prefer not to say',

  bio: 'Aura Live Registered User ✨',
  birthday: '2000-01-01',
  country: 'Pakistan',
  countryFlag: '🇵🇰',
  countryCode: 'PK',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&auto=format',
  photos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop&auto=format',
  ],
  vipBadge: 'VIP 1',
  level: 1,
  xp: 100,
  familyName: 'None',
  agencyName: 'None',
  profileCompletion: 50,
  verificationStatus: 'VERIFIED',
  updatedAt: new Date().toISOString(),
};


/* ── 🚀 USER PROFILE SERVICE CLASS ── */
class UserProfileService {
  private profiles: Map<string, UserProfileData> = new Map();
  private auditLogs: ProfileAuditRecord[] = [];
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
          if (event.data?.type === 'PROFILE_SYNC') {
            this.load();
            this.notify(false);
          }
        };
      } catch (e) {
        console.warn('Profile BroadcastChannel init failed', e);
      }
    }
  }

  private notify(broadcast: boolean = true) {
    this.save();
    if (broadcast && this.channel) {
      try {
        this.channel.postMessage({ type: 'PROFILE_SYNC', timestamp: Date.now() });
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
          if (parsed.profiles) {
            this.profiles = new Map(Object.entries(parsed.profiles));
          }
          if (parsed.auditLogs) {
            this.auditLogs = parsed.auditLogs;
          }
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load user profile database', e);
    }
    this.profiles.set('100821', DEFAULT_USER_PROFILE);
    this.save();
  }

  private save() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const objProfiles: Record<string, UserProfileData> = {};
        this.profiles.forEach((val, key) => {
          objProfiles[key] = val;
        });
        const payload = {
          profiles: objProfiles,
          auditLogs: this.auditLogs,
          lastUpdated: new Date().toISOString(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Failed to save user profile database', e);
    }
  }

  /* ── 1. GET USER PROFILE ── */
  public getProfile(userId: string = '100821'): UserProfileData {
    let p = this.profiles.get(userId);
    if (!p) {
      p = { ...DEFAULT_USER_PROFILE, userId };
      this.profiles.set(userId, p);
      this.save();
    }
    return { ...p };
  }

  /* ── 2. UPDATE PROFILE FIELDS ── */
  public updateProfile(userId: string, partial: Partial<UserProfileData>): UserProfileData {
    const current = this.getProfile(userId);

    // Audit logging for changed fields
    Object.entries(partial).forEach(([key, val]) => {
      if ((current as any)[key] !== val && key !== 'updatedAt') {
        this.auditLogs.unshift({
          id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId,
          field: key,
          oldValue: (current as any)[key],
          newValue: val,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        });
      }
    });

    const updated: UserProfileData = {
      ...current,
      ...partial,
      updatedAt: new Date().toISOString(),
    };

    updated.profileCompletion = this.calculateCompletion(updated);
    this.profiles.set(userId, updated);
    this.notify(true);
    return updated;
  }

  /* ── 3. PHOTO MANAGEMENT ── */
  public addPhoto(userId: string, photoUrl: string): UserProfileData {
    const profile = this.getProfile(userId);
    const photos = [...profile.photos, photoUrl];
    return this.updateProfile(userId, { photos });
  }

  public removePhoto(userId: string, index: number): UserProfileData {
    const profile = this.getProfile(userId);
    const photos = profile.photos.filter((_, i) => i !== index);
    return this.updateProfile(userId, { photos });
  }

  public reorderPhotos(userId: string, newPhotos: string[]): UserProfileData {
    return this.updateProfile(userId, { photos: newPhotos });
  }

  public setPrimaryAvatar(userId: string, photoUrl: string): UserProfileData {
    return this.updateProfile(userId, { avatar: photoUrl });
  }

  /* ── 4. USERNAME AVAILABILITY CHECK ── */
  public checkUsernameAvailability(newUsername: string, currentUserId: string = '100821'): { available: boolean; message?: string } {
    const clean = newUsername.trim();
    if (clean.length < 3 || clean.length > 20) {
      return { available: false, message: 'Username must be between 3 and 20 characters.' };
    }
    const regex = /^[a-zA-Z0-9_ ]+$/;
    if (!regex.test(clean)) {
      return { available: false, message: 'Username contains invalid special characters.' };
    }

    for (const [uid, prof] of this.profiles.entries()) {
      if (uid !== currentUserId && prof.username.toLowerCase() === clean.toLowerCase()) {
        return { available: false, message: 'This username is already registered.' };
      }
    }
    return { available: true };
  }

  /* ── 5. CALCULATE COMPLETION ── */
  public calculateCompletion(profile: UserProfileData): number {
    let score = 0;
    if (profile.avatar) score += 20;
    if (profile.username) score += 15;
    if (profile.gender) score += 15;
    if (profile.bio && profile.bio.length > 10) score += 20;
    if (profile.birthday) score += 10;
    if (profile.country) score += 10;
    if (profile.photos && profile.photos.length >= 3) score += 10;
    return Math.min(100, score);
  }

  public getAuditLogs(userId?: string): ProfileAuditRecord[] {
    if (userId) return this.auditLogs.filter(a => a.userId === userId);
    return [...this.auditLogs];
  }

  /* ── 6. REACTIVE SUBSCRIPTION ── */
  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const userProfileEngine = new UserProfileService();
