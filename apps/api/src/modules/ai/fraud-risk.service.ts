export interface UserRiskAssessment {
  userId: string;
  riskScore: number; // 0 to 100
  riskLevel: 'NORMAL' | 'REVIEW' | 'BLOCK';
  detectedPatterns: string[];
  isBlocked: boolean;
}

export class FraudRiskService {
  private userRiskScores: Map<string, UserRiskAssessment> = new Map();

  evaluateUser(params: {
    userId: string;
    deviceCount: number;
    paymentCardsUsed: number;
    giftLoopPatternDetected: boolean;
    rapidCoinTransferDetected: boolean;
  }): UserRiskAssessment {
    let score = 0;
    const patterns: string[] = [];

    // Rule 1: Multiple Devices
    if (params.deviceCount > 3) {
      score += 25;
      patterns.push('MULTIPLE_DEVICES');
    }

    // Rule 2: Multiple Payment Cards
    if (params.paymentCardsUsed > 3) {
      score += 30;
      patterns.push('SUSPICIOUS_CARD_VARIATION');
    }

    // Rule 3: Gift Loop Pattern
    if (params.giftLoopPatternDetected) {
      score += 40;
      patterns.push('GIFT_LOOP_CIRCULAR_TRANSFER');
    }

    // Rule 4: Rapid Coin Transfer
    if (params.rapidCoinTransferDetected) {
      score += 20;
      patterns.push('RAPID_COIN_TRANSFER');
    }

    const finalScore = Math.min(100, score);
    const riskLevel: 'NORMAL' | 'REVIEW' | 'BLOCK' = finalScore >= 70 ? 'BLOCK' : finalScore >= 30 ? 'REVIEW' : 'NORMAL';
    const isBlocked = riskLevel === 'BLOCK';

    const assessment: UserRiskAssessment = {
      userId: params.userId,
      riskScore: finalScore,
      riskLevel,
      detectedPatterns: patterns,
      isBlocked
    };

    this.userRiskScores.set(params.userId, assessment);
    return assessment;
  }

  getAssessment(userId: string): UserRiskAssessment {
    return (
      this.userRiskScores.get(userId) || {
        userId,
        riskScore: 0,
        riskLevel: 'NORMAL',
        detectedPatterns: [],
        isBlocked: false
      }
    );
  }
}
