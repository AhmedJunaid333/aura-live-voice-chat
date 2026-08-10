/* ═══════════════════════════════════════════════════════════════════ */
/* ── AURA LIVE VOICE CHAT — REAL-TIME REWARDS & DAILY MISSIONS ─── */
/* ═══════════════════════════════════════════════════════════════════ */

export interface DailyStreakDay {
  day: number; // 1 to 7
  title: string;
  coins: number;
  diamonds: number;
  xp: number;
  badge?: string;
  icon: string;
  claimed: boolean;
  isToday: boolean;
}

export interface DailyMissionTask {
  id: string; // e.g. 'TASK-01'
  title: string;
  description: string;
  category: 'STREAM' | 'CHAT' | 'GIFT' | 'COMMUNITY' | 'CP';
  icon: string;
  targetCount: number;
  currentProgress: number;
  rewardCoins: number;
  rewardDiamonds: number;
  rewardXp: number;
  claimed: boolean;
  deepLink?: string;
}

export interface LevelMilestoneReward {
  level: number;
  title: string;
  badge: string;
  diamonds: number;
  avatarFrame?: string;
  entranceEffect?: string;
  claimed: boolean;
  unlocked: boolean;
}

const STORAGE_KEY = 'AURALIVE_REWARDS_DB_V2';
const CHANNEL_NAME = 'AURALIVE_REWARDS_CHANNEL_V2';

/* ── 🌟 DEFAULT 7-DAY SIGN-IN MATRIX ── */
export const INITIAL_DAILY_STREAK: DailyStreakDay[] = [
  { day: 1, title: 'Day 1', coins: 500, diamonds: 0, xp: 50, icon: '🪙', claimed: true, isToday: false },
  { day: 2, title: 'Day 2', coins: 1000, diamonds: 10, xp: 100, icon: '💎', claimed: true, isToday: false },
  { day: 3, title: 'Day 3', coins: 1500, diamonds: 25, xp: 150, icon: '🪙', claimed: false, isToday: true },
  { day: 4, title: 'Day 4', coins: 2500, diamonds: 50, xp: 200, icon: '💎', claimed: false, isToday: false },
  { day: 5, title: 'Day 5', coins: 4000, diamonds: 100, xp: 300, icon: '🎁', claimed: false, isToday: false },
  { day: 6, title: 'Day 6', coins: 6000, diamonds: 200, xp: 500, badge: 'Silver Aura', icon: '✨', claimed: false, isToday: false },
  { day: 7, title: 'Day 7', coins: 15000, diamonds: 1000, xp: 1500, badge: 'Royal Crown Box', icon: '👑', claimed: false, isToday: false },
];

/* ── 🌟 DEFAULT DAILY MISSIONS ── */
export const INITIAL_DAILY_MISSIONS: DailyMissionTask[] = [
  {
    id: 'TASK-GIFT-01',
    title: 'Send 3 Gifts in Live Audio Rooms',
    description: 'Support your favorite room hosts with any virtual gift.',
    category: 'GIFT',
    icon: '🎁',
    targetCount: 3,
    currentProgress: 2,
    rewardCoins: 500,
    rewardDiamonds: 50,
    rewardXp: 150,
    claimed: false,
    deepLink: 'live',
  },
  {
    id: 'TASK-LISTEN-02',
    title: 'Listen in Audio Room for 15 Minutes',
    description: 'Hang out in any 10, 15, or 20-seat audio room.',
    category: 'STREAM',
    icon: '🎧',
    targetCount: 15,
    currentProgress: 15,
    rewardCoins: 1000,
    rewardDiamonds: 100,
    rewardXp: 300,
    claimed: false,
    deepLink: 'live',
  },
  {
    id: 'TASK-CHAT-03',
    title: 'Send 5 Direct Chat Messages',
    description: 'Keep the conversation going with friends and family members.',
    category: 'CHAT',
    icon: '💬',
    targetCount: 5,
    currentProgress: 5,
    rewardCoins: 400,
    rewardDiamonds: 20,
    rewardXp: 100,
    claimed: true,
    deepLink: 'chat',
  },
  {
    id: 'TASK-FOLLOW-04',
    title: 'Follow 2 New Verified Broadcasters',
    description: 'Discover rising talents in the discovery and party feed.',
    category: 'COMMUNITY',
    icon: '🌟',
    targetCount: 2,
    currentProgress: 1,
    rewardCoins: 300,
    rewardDiamonds: 15,
    rewardXp: 80,
    claimed: false,
    deepLink: 'discover',
  },
  {
    id: 'TASK-CP-05',
    title: 'Stay on Audio Seat with CP Partner',
    description: 'Share a mic seat for 10 minutes to boost intimacy points.',
    category: 'CP',
    icon: '💍',
    targetCount: 10,
    currentProgress: 7,
    rewardCoins: 1500,
    rewardDiamonds: 150,
    rewardXp: 400,
    claimed: false,
    deepLink: 'live',
  },
];

/* ── 🌟 DEFAULT LEVEL MILESTONES ── */
export const INITIAL_LEVEL_MILESTONES: LevelMilestoneReward[] = [
  { level: 10, title: 'Baron Royalty Ascent', badge: 'VIP 1', diamonds: 500, avatarFrame: 'Golden Laurel', claimed: true, unlocked: true },
  { level: 25, title: 'Viscount Crown Milestone', badge: 'VIP 3', diamonds: 2500, avatarFrame: 'Emerald Wing', claimed: false, unlocked: true },
  { level: 50, title: 'Count Grand Palace', badge: 'VIP 5', diamonds: 10000, entranceEffect: 'Cyber Sports Car', claimed: false, unlocked: false },
  { level: 100, title: 'Emperor Sovereign Apex', badge: 'VIP 10', diamonds: 50000, entranceEffect: 'Golden Dragon Chariot', claimed: false, unlocked: false },
];

/* ── 🚀 REWARDS ENGINE CLASS ── */
class RewardsEngineService {
  private streakDays: DailyStreakDay[] = [...INITIAL_DAILY_STREAK];
  private missions: DailyMissionTask[] = [...INITIAL_DAILY_MISSIONS];
  private milestones: LevelMilestoneReward[] = [...INITIAL_LEVEL_MILESTONES];
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
          if (event.data?.type === 'REWARDS_SYNC') {
            this.load();
            this.notify(false);
          }
        };
      } catch (e) {
        console.warn('Rewards BroadcastChannel init failed', e);
      }
    }
  }

  private notify(broadcast: boolean = true) {
    this.save();
    if (broadcast && this.channel) {
      try {
        this.channel.postMessage({ type: 'REWARDS_SYNC', timestamp: Date.now() });
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
          if (parsed.streakDays) this.streakDays = parsed.streakDays;
          if (parsed.missions) this.missions = parsed.missions;
          if (parsed.milestones) this.milestones = parsed.milestones;
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load rewards database', e);
    }
    this.streakDays = [...INITIAL_DAILY_STREAK];
    this.missions = [...INITIAL_DAILY_MISSIONS];
    this.milestones = [...INITIAL_LEVEL_MILESTONES];
    this.save();
  }

  private save() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const payload = {
          streakDays: this.streakDays,
          missions: this.missions,
          milestones: this.milestones,
          lastUpdated: new Date().toISOString(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Failed to save rewards database', e);
    }
  }

  /* ── 1. GETTERS ── */
  public getStreakDays(): DailyStreakDay[] {
    return [...this.streakDays];
  }

  public getMissions(): DailyMissionTask[] {
    return [...this.missions];
  }

  public getMilestones(): LevelMilestoneReward[] {
    return [...this.milestones];
  }

  /* ── 2. CLAIM ACTIONS ── */
  public claimTodayStreak(): { success: boolean; coins: number; diamonds: number; message: string } {
    const today = this.streakDays.find(d => d.isToday);
    if (!today) {
      return { success: false, coins: 0, diamonds: 0, message: 'No active daily reward for today.' };
    }
    if (today.claimed) {
      return { success: false, coins: 0, diamonds: 0, message: 'Today’s daily sign-in reward is already claimed.' };
    }

    today.claimed = true;
    this.notify(true);

    return {
      success: true,
      coins: today.coins,
      diamonds: today.diamonds,
      message: `Successfully claimed Day ${today.day} Reward! +${today.coins.toLocaleString()} Coins & +${today.diamonds} Diamonds added to your wallet!`,
    };
  }

  public claimMission(taskId: string): { success: boolean; coins: number; diamonds: number; message: string } {
    const task = this.missions.find(m => m.id === taskId);
    if (!task) {
      return { success: false, coins: 0, diamonds: 0, message: 'Mission task not found.' };
    }
    if (task.claimed) {
      return { success: false, coins: 0, diamonds: 0, message: 'Mission reward already claimed.' };
    }
    if (task.currentProgress < task.targetCount) {
      return { success: false, coins: 0, diamonds: 0, message: `Mission not complete yet (${task.currentProgress}/${task.targetCount}).` };
    }

    task.claimed = true;
    this.notify(true);

    return {
      success: true,
      coins: task.rewardCoins,
      diamonds: task.rewardDiamonds,
      message: `Mission Completed: "${task.title}"! +${task.rewardCoins.toLocaleString()} Coins & +${task.rewardDiamonds} Diamonds credited!`,
    };
  }

  public claimMilestone(level: number): { success: boolean; diamonds: number; message: string } {
    const mile = this.milestones.find(m => m.level === level);
    if (!mile) {
      return { success: false, diamonds: 0, message: 'Milestone not found.' };
    }
    if (mile.claimed) {
      return { success: false, diamonds: 0, message: 'Milestone reward already claimed.' };
    }
    if (!mile.unlocked) {
      return { success: false, diamonds: 0, message: `Reach Level ${mile.level} to unlock this milestone.` };
    }

    mile.claimed = true;
    this.notify(true);

    return {
      success: true,
      diamonds: mile.diamonds,
      message: `Milestone Claimed: Level ${mile.level} (${mile.title})! +${mile.diamonds.toLocaleString()} Diamonds added!`,
    };
  }

  /* ── 3. REACTIVE SUBSCRIPTION ── */
  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const rewardsEngine = new RewardsEngineService();
