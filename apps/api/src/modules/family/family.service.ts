export interface FamilyRecord {
  id: string;
  name: string;
  badgeUrl: string;
  ownerId: string;
  level: number;
  totalXp: bigint;
  treasuryCoins: bigint;
  membersCount: number;
}

export class FamilyService {
  private families: Map<string, FamilyRecord> = new Map();

  createFamily(name: string, ownerId: string, badgeUrl: string): FamilyRecord {
    const id = `fam-${Date.now()}`;
    const family: FamilyRecord = {
      id,
      name,
      badgeUrl,
      ownerId,
      level: 1,
      totalXp: BigInt(0),
      treasuryCoins: BigInt(0),
      membersCount: 1
    };
    this.families.set(id, family);
    return family;
  }

  addFamilyXp(familyId: string, xpGained: number): FamilyRecord {
    const family = this.families.get(familyId);
    if (!family) throw new Error('Family not found');

    family.totalXp += BigInt(xpGained);
    family.level = Math.floor(Math.sqrt(Number(family.totalXp) / 100)) + 1;
    return family;
  }
}
