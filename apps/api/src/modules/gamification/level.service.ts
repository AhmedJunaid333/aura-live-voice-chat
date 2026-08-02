export interface XpRuleConfig {
  action: 'DAILY_LOGIN' | 'SEND_GIFT' | 'RECEIVE_GIFT' | 'CREATE_ROOM' | 'FOLLOW_USER';
  xpReward: number;
  dailyLimit: number;
  status: boolean;
}

export class LevelService {
  private xpRules: Map<string, XpRuleConfig> = new Map();
  private userXp: Map<string, number> = new Map();

  constructor() {
    // Configurable XP Rules
    this.xpRules.set('DAILY_LOGIN', { action: 'DAILY_LOGIN', xpReward: 10, dailyLimit: 1, status: true });
    this.xpRules.set('SEND_GIFT', { action: 'SEND_GIFT', xpReward: 100, dailyLimit: 0, status: true });
    this.xpRules.set('RECEIVE_GIFT', { action: 'RECEIVE_GIFT', xpReward: 50, dailyLimit: 0, status: true });
    this.xpRules.set('CREATE_ROOM', { action: 'CREATE_ROOM', xpReward: 50, dailyLimit: 5, status: true });
    this.xpRules.set('FOLLOW_USER', { action: 'FOLLOW_USER', xpReward: 5, dailyLimit: 20, status: true });
  }

  addXp(userId: string, action: 'DAILY_LOGIN' | 'SEND_GIFT' | 'RECEIVE_GIFT' | 'CREATE_ROOM' | 'FOLLOW_USER'): { xpGained: number; totalXp: number; level: number; levelUp: boolean } {
    const rule = this.xpRules.get(action);
    if (!rule || !rule.status) {
      return { xpGained: 0, totalXp: this.userXp.get(userId) || 0, level: this.calculateLevel(this.userXp.get(userId) || 0), levelUp: false };
    }

    const currentXp = this.userXp.get(userId) || 0;
    const oldLevel = this.calculateLevel(currentXp);
    const newXp = currentXp + rule.xpReward;
    this.userXp.set(userId, newXp);

    const newLevel = this.calculateLevel(newXp);
    const levelUp = newLevel > oldLevel;

    return {
      xpGained: rule.xpReward,
      totalXp: newXp,
      level: newLevel,
      levelUp
    };
  }

  calculateLevel(xp: number): number {
    // Level formula: Level = floor(sqrt(XP / 50)) + 1
    return Math.floor(Math.sqrt(xp / 50)) + 1;
  }
}
