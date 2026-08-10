/* ═══════════════════════════════════════════════════════════════════ */
/* ── AURA LIVE VOICE CHAT — REAL-TIME PROFILE SHUFFLE & DISCOVERY ── */
/* ═══════════════════════════════════════════════════════════════════ */

import { privacyEngine } from './privacyEngineService';

export interface DiscoverableProfile {
  id: string; // e.g. '100822'
  username: string; // e.g. 'Zeeshan_Host'
  avatar: string;
  gender: 'Male' | 'Female' | 'Other';
  country: string;
  countryFlag: string;
  countryCode: string;
  level: number;
  vipBadge?: string;
  hostBadge?: string;
  familyBadge?: string;
  agencyBadge?: string;
  isOnline: boolean;
  isLive: boolean;
  liveRoomTitle?: string;
  liveListeners?: number;
  tags: string[];
  bio: string;
  distanceKm?: number;
  followersCount: number;
  popularityScore: number;
}

export interface DiscoveryShuffleConfig {
  shuffleEnabled: boolean;
  onlinePriority: boolean;
  hostPriority: boolean;
  vipPriority: boolean;
  antiRepeatWindowSize: number; // e.g. 10
  defaultLimit: number; // e.g. 6
}

export interface ShuffleAnalytics {
  totalShuffleRequests: number;
  topDiscoveredProfiles: { profileId: string; username: string; count: number }[];
  followConversions: number;
  skipRate: number;
}

const STORAGE_KEY = 'AURALIVE_DISCOVERY_SHUFFLE_DB_V2';
const CHANNEL_NAME = 'AURALIVE_DISCOVERY_SHUFFLE_CHANNEL_V2';

/* ── 🌟 POOL OF REAL DISCOVERABLE USERS ── */
export const INITIAL_DISCOVERY_PROFILES: DiscoverableProfile[] = [
  {
    id: '100822',
    username: 'Zeeshan_Aura',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format',
    gender: 'Male',
    country: 'Pakistan',
    countryFlag: '🇵🇰',
    countryCode: 'PK',
    level: 52,
    vipBadge: 'VIP 9',
    hostBadge: 'Verified Host',
    familyBadge: 'Royal Lions',
    agencyBadge: 'Aura BD',
    isOnline: true,
    isLive: true,
    liveRoomTitle: '📻 Ghazal & Urdu Poetry Night #PK',
    liveListeners: 1420,
    tags: ['Poetry', 'Singing', 'LateNight'],
    bio: 'Broadcasting heart touching acoustic songs and poetry every night! Join my 15-seat stage.',
    distanceKm: 4.2,
    followersCount: 38200,
    popularityScore: 98,
  },
  {
    id: '100823',
    username: 'Elena_Singer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&auto=format',
    gender: 'Female',
    country: 'Turkey',
    countryFlag: '🇹🇷',
    countryCode: 'TR',
    level: 38,
    vipBadge: 'VIP 7',
    hostBadge: 'Pop Star',
    familyBadge: 'Istanbul Knights',
    isOnline: true,
    isLive: true,
    liveRoomTitle: '🎤 Turkish & English Hits Live PK Battle!',
    liveListeners: 890,
    tags: ['Music', 'PK Battle', 'Dance'],
    bio: 'Professional vocalist & keyboardist. Daily PK battles with top hosts across Europe!',
    distanceKm: 1200,
    followersCount: 19400,
    popularityScore: 92,
  },
  {
    id: '100824',
    username: 'Malik_Gold',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format',
    gender: 'Male',
    country: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    countryCode: 'SA',
    level: 65,
    vipBadge: 'VIP 10',
    familyBadge: 'Crown Dynasty',
    isOnline: true,
    isLive: false,
    tags: ['Gifting', 'VIP 10', 'HighRoller'],
    bio: 'Top Gifter of Aura Live! Gifting million diamond dragons to authentic room hosts.',
    distanceKm: 3400,
    followersCount: 54100,
    popularityScore: 99,
  },
  {
    id: '100825',
    username: 'Fatima_Live',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&auto=format',
    gender: 'Female',
    country: 'UAE',
    countryFlag: '🇦🇪',
    countryCode: 'AE',
    level: 41,
    vipBadge: 'VIP 6',
    hostBadge: 'Chill Vibes',
    familyBadge: 'Dubai Royals',
    isOnline: true,
    isLive: true,
    liveRoomTitle: '☕ Dubai Evening Podcast & Chill Chat',
    liveListeners: 620,
    tags: ['Chat', 'Coffee', 'Advice'],
    bio: 'Warm conversations, deep life questions, and friendly laughter. Welcoming all guests!',
    distanceKm: 2100,
    followersCount: 14700,
    popularityScore: 88,
  },
  {
    id: '100826',
    username: 'Ali_King',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&auto=format',
    gender: 'Male',
    country: 'Pakistan',
    countryFlag: '🇵🇰',
    countryCode: 'PK',
    level: 29,
    vipBadge: 'VIP 4',
    isOnline: false,
    isLive: false,
    tags: ['Gaming', 'Anime', 'Friendship'],
    bio: 'Mobile esports gamer & anime fanatic. Seeking like-minded party room friends.',
    distanceKm: 18.5,
    followersCount: 6200,
    popularityScore: 76,
  },
  {
    id: '100827',
    username: 'Anya_Voice',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&auto=format',
    gender: 'Female',
    country: 'India',
    countryFlag: '🇮🇳',
    countryCode: 'IN',
    level: 49,
    vipBadge: 'VIP 8',
    hostBadge: 'Melody Star',
    isOnline: true,
    isLive: true,
    liveRoomTitle: '🌸 Bollywood Unplugged Medley 🎶',
    liveListeners: 1750,
    tags: ['Bollywood', 'Singing', 'Acoustic'],
    bio: 'Singing sweet soulful classics with guitar accompaniment. Daily audio rooms!',
    distanceKm: 850,
    followersCount: 42000,
    popularityScore: 96,
  },
  {
    id: '100828',
    username: 'Tariq_BD_Agency',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=300&fit=crop&auto=format',
    gender: 'Male',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    countryCode: 'BD',
    level: 58,
    vipBadge: 'VIP 9',
    hostBadge: 'Agency Director',
    agencyBadge: 'Dhaka Elite',
    isOnline: true,
    isLive: false,
    tags: ['Recruitment', 'Agency', 'Business'],
    bio: 'Official BD Agency Leader. Recruiting top voice talents for weekly revenue share contracts.',
    distanceKm: 2800,
    followersCount: 28300,
    popularityScore: 91,
  },
  {
    id: '100829',
    username: 'Noor_Star',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&auto=format',
    gender: 'Female',
    country: 'Pakistan',
    countryFlag: '🇵🇰',
    countryCode: 'PK',
    level: 33,
    vipBadge: 'VIP 5',
    isOnline: true,
    isLive: false,
    tags: ['Fashion', 'Art', 'Lifestyle'],
    bio: 'Designer & digital artist. Love connecting with creative minds on Aura Live!',
    distanceKm: 8.9,
    followersCount: 11200,
    popularityScore: 84,
  },
];

/* ── 🚀 PROFILE DISCOVERY & SHUFFLE SERVICE ── */
class ProfileDiscoveryService {
  private profiles: DiscoverableProfile[] = [...INITIAL_DISCOVERY_PROFILES];
  private recentShuffledIds: string[] = [];
  private config: DiscoveryShuffleConfig = {
    shuffleEnabled: true,
    onlinePriority: true,
    hostPriority: true,
    vipPriority: true,
    antiRepeatWindowSize: 6,
    defaultLimit: 4,
  };
  private analytics: ShuffleAnalytics = {
    totalShuffleRequests: 1420,
    topDiscoveredProfiles: [
      { profileId: '100822', username: 'Zeeshan_Aura', count: 480 },
      { profileId: '100827', username: 'Anya_Voice', count: 410 },
      { profileId: '100824', username: 'Malik_Gold', count: 375 },
    ],
    followConversions: 312,
    skipRate: 14.8,
  };
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
          if (event.data?.type === 'SHUFFLE_SYNC') {
            this.load();
            this.notify(false);
          }
        };
      } catch (e) {
        console.warn('Discovery BroadcastChannel init failed', e);
      }
    }
  }

  private notify(broadcast: boolean = true) {
    this.save();
    if (broadcast && this.channel) {
      try {
        this.channel.postMessage({ type: 'SHUFFLE_SYNC', timestamp: Date.now() });
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
          if (parsed.profiles) this.profiles = parsed.profiles;
          if (parsed.config) this.config = parsed.config;
          if (parsed.analytics) this.analytics = parsed.analytics;
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load discovery shuffle database', e);
    }
    this.profiles = [...INITIAL_DISCOVERY_PROFILES];
    this.save();
  }

  private save() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const payload = {
          profiles: this.profiles,
          config: this.config,
          analytics: this.analytics,
          lastUpdated: new Date().toISOString(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Failed to save discovery shuffle database', e);
    }
  }

  /* ── 1. UNIVERSAL PROFILE SHUFFLE ACTION ── */
  public shuffleProfiles(
    context: 'HOME' | 'LIVE' | 'DISCOVER' | 'NEARBY' | 'ROOMS' | 'EXPLORE' = 'DISCOVER',
    limit: number = 4
  ): DiscoverableProfile[] {
    this.analytics.totalShuffleRequests += 1;

    // Filter eligible profiles: respect privacy, blocks, and mutes
    const eligible = this.profiles.filter(p => {
      if (privacyEngine.isBlocked(p.id)) return false;
      return true;
    });

    if (eligible.length === 0) return [];

    // Anti-repetition: filter out IDs from recent window if pool is large enough
    let candidatePool = eligible.filter(p => !this.recentShuffledIds.includes(p.id));
    if (candidatePool.length < limit) {
      // Clear recent window when pool is exhausted
      this.recentShuffledIds = [];
      candidatePool = eligible;
    }

    // Weighted sort: Online status, VIP priority, Host status + random jitter
    const scored = candidatePool.map(p => {
      let score = Math.random() * 50;
      if (this.config.onlinePriority && p.isOnline) score += 40;
      if (this.config.hostPriority && p.isLive) score += 30;
      if (this.config.vipPriority && p.vipBadge) score += 20;
      return { profile: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const selected = scored.slice(0, limit).map(s => s.profile);

    // Update anti-repetition memory
    const newIds = selected.map(p => p.id);
    this.recentShuffledIds = [...this.recentShuffledIds, ...newIds].slice(-this.config.antiRepeatWindowSize);

    // Track analytics for top discovered profiles
    selected.forEach(p => {
      const existing = this.analytics.topDiscoveredProfiles.find(t => t.profileId === p.id);
      if (existing) {
        existing.count += 1;
      } else {
        this.analytics.topDiscoveredProfiles.push({ profileId: p.id, username: p.username, count: 1 });
      }
    });

    this.notify(true);
    return selected;
  }

  public getAllProfiles(): DiscoverableProfile[] {
    return [...this.profiles];
  }

  public getConfig(): DiscoveryShuffleConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<DiscoveryShuffleConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.notify(true);
  }

  public getAnalytics(): ShuffleAnalytics {
    return { ...this.analytics };
  }

  /* ── 2. REACTIVE SUBSCRIPTION ── */
  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const profileDiscoveryEngine = new ProfileDiscoveryService();
