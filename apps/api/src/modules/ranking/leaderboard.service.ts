export interface LeaderboardRank {
  entityId: string;
  score: bigint;
  rank: number;
}

export class LeaderboardService {
  private leaderboards: Map<string, Map<string, bigint>> = new Map();

  recordScore(type: 'GIVER' | 'HOST' | 'FAMILY', period: 'DAILY' | 'WEEKLY' | 'MONTHLY', entityId: string, score: bigint) {
    const key = `${type}:${period}`;
    if (!this.leaderboards.has(key)) {
      this.leaderboards.set(key, new Map());
    }
    const board = this.leaderboards.get(key)!;
    const currentScore = board.get(entityId) || BigInt(0);
    board.set(entityId, currentScore + score);
  }

  getRankings(type: 'GIVER' | 'HOST' | 'FAMILY', period: 'DAILY' | 'WEEKLY' | 'MONTHLY'): LeaderboardRank[] {
    const key = `${type}:${period}`;
    const board = this.leaderboards.get(key);
    if (!board) return [];

    const sorted = Array.from(board.entries()).sort((a, b) => (b[1] > a[1] ? 1 : -1));
    return sorted.map(([entityId, score], index) => ({
      entityId,
      score,
      rank: index + 1
    }));
  }
}
