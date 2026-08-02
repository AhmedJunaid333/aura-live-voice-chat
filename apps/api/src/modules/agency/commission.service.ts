export interface CommissionBreakdown {
  totalDiamonds: bigint;
  platformDiamonds: bigint;
  agencyDiamonds: bigint;
  creatorDiamonds: bigint;
}

export class CommissionService {
  /**
   * Calculates revenue split:
   * Platform Rate: 20%
   * Agency Rate: 10%
   * Creator Rate: 70%
   */
  calculateSplit(totalDiamonds: bigint, platformShare: number = 20, agencyShare: number = 10): CommissionBreakdown {
    const totalNum = Number(totalDiamonds);
    const platformNum = Math.floor(totalNum * (platformShare / 100));
    const agencyNum = Math.floor(totalNum * (agencyShare / 100));
    const creatorNum = totalNum - platformNum - agencyNum;

    return {
      totalDiamonds,
      platformDiamonds: BigInt(platformNum),
      agencyDiamonds: BigInt(agencyNum),
      creatorDiamonds: BigInt(creatorNum)
    };
  }
}
