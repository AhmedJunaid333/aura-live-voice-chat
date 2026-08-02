export interface PkBattleRecord {
  id: string;
  room1Id: string;
  room2Id: string;
  host1Id: string;
  host2Id: string;
  score1: bigint;
  score2: bigint;
  status: 'INVITED' | 'LIVE' | 'FINISHED';
  winnerId?: string;
  durationSeconds: number;
}

export class PkBattleService {
  private battles: Map<string, PkBattleRecord> = new Map();

  startBattle(room1Id: string, room2Id: string, host1Id: string, host2Id: string, durationSeconds = 300): PkBattleRecord {
    const battleId = `pk-${Date.now()}`;
    const battle: PkBattleRecord = {
      id: battleId,
      room1Id,
      room2Id,
      host1Id,
      host2Id,
      score1: BigInt(0),
      score2: BigInt(0),
      status: 'LIVE',
      durationSeconds
    };
    this.battles.set(battleId, battle);
    return battle;
  }

  addGiftScore(battleId: string, hostId: string, giftCoins: bigint): PkBattleRecord {
    const battle = this.battles.get(battleId);
    if (!battle || battle.status !== 'LIVE') throw new Error('Active PK battle not found');

    if (hostId === battle.host1Id) {
      battle.score1 += giftCoins;
    } else if (hostId === battle.host2Id) {
      battle.score2 += giftCoins;
    }

    return battle;
  }

  endBattle(battleId: string): PkBattleRecord {
    const battle = this.battles.get(battleId);
    if (!battle) throw new Error('PK battle not found');

    battle.status = 'FINISHED';
    if (battle.score1 > battle.score2) {
      battle.winnerId = battle.host1Id;
    } else if (battle.score2 > battle.score1) {
      battle.winnerId = battle.host2Id;
    } else {
      battle.winnerId = 'DRAW';
    }

    return battle;
  }
}
