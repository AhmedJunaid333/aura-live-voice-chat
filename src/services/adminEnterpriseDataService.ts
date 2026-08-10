/**
 * 🌟 AURA LIVE ENTERPRISE ADMIN DATABASE & REAL-TIME STATE SERVICE
 * Fully functional database persistence for 16 Relationship Cards, User KYC,
 * Medals, Charm Levels 1-100, Live Rooms, PK Arena, Cashouts, and Families.
 */

export interface RelationshipRecord {
  id: string;
  type: 'CP' | 'BEST_FRIEND' | 'BROTHER' | 'SISTER' | 'SIBLINGS' | 'CONFIDANT' | 'SOULMATE' | 'MENTOR' | 'DISCIPLE' | 'GUARDIAN' | 'KNIGHT' | 'QUEEN' | 'KING' | 'PARTNER' | 'TWIN' | 'SWORN';
  cardName: string;
  icon: string;
  color: string;
  user1: { id: string; name: string; avatar: string; level: number };
  user2: { id: string; name: string; avatar: string; level: number };
  level: number; // 1 to 10
  currentXp: number;
  targetXp: number;
  anniversaryDays: number;
  sharedGiftsCoins: number;
  status: 'ACTIVE' | 'PENDING' | 'DISBANDED';
  ringAnimation: string;
  perks: string[];
  createdAt: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  gender: 'Female' | 'Male';
  country: string;
  level: number;
  xp: number;
  vip: string;
  family: string;
  agency: string;
  isHost: boolean;
  coins: number;
  diamonds: number;
  walletFrozen: boolean;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'KYC_PENDING';
  grade: string;
  cnicNumber?: string;
  cnicFrontUrl?: string;
  selfieUrl?: string;
  joinedAt: string;
}

export interface MedalRecord {
  id: string;
  name: string;
  category: string;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  xpBonus: string;
  badgeBorder: string;
  unlockCondition: string;
  awardedUsersCount: number;
  active: boolean;
}

/* ═══════════════════════════════════════════════════════════════════ */
/* ── INVITATION SYSTEM INTERFACES (ADMIN INVITES USER) ───────────── */
/* ═══════════════════════════════════════════════════════════════════ */

export type InvitationType = 'HOSTING' | 'AGENCY' | 'BD' | 'RESELLER';
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'CANCELLED';

export interface InvitationRecord {
  id: string; // e.g. INV-2026-0001
  type: InvitationType;
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar: string;
  targetUserCountry: string;
  invitedByAdminId: string;
  invitedByAdminName: string;
  message: string;
  requirements: string[];
  benefits: string[];
  expiryDays: number;
  expiresAt: string;
  status: InvitationStatus;
  declineReason?: string;
  acceptedAt?: string;
  declinedAt?: string;
  cancelledAt?: string;
  resultingApplicationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationTemplate {
  id: string;
  type: InvitationType;
  title: string;
  defaultMessage: string;
  defaultRequirements: string[];
  defaultBenefits: string[];
  defaultExpiryDays: number;
}

export interface InvitationRule {
  maxActiveInvitesPerUser: number;
  defaultExpiryDays: number;
  allowDeclineReason: boolean;
  cooldownHoursAfterDecline: number;
  autoNotificationPush: boolean;
}

export interface InvitationAuditLog {
  id: string;
  invitationId: string;
  targetUserId: string;
  action: 'INVITATION_CREATED' | 'INVITATION_SENT' | 'INVITATION_ACCEPTED' | 'INVITATION_DECLINED' | 'INVITATION_CANCELLED' | 'INVITATION_EXPIRED';
  actor: string;
  actorRole: 'ADMIN' | 'USER' | 'SYSTEM';
  timestamp: string;
  note: string;
}

/* ═══════════════════════════════════════════════════════════════════ */
/* ── APPLICATION SYSTEM INTERFACES (USER APPLIES, ADMIN APPROVES) ── */
/* ═══════════════════════════════════════════════════════════════════ */

export type PublicApplicationType = 'HOSTING' | 'AGENCY' | 'BD' | 'RESELLER';
export type ApplicationType = 'HOSTING' | 'AGENCY' | 'BD' | 'RESELLER';
export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'INFO_REQUIRED' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED' | 'SUSPENDED';

export interface ApplicationDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  uploadedAt: string;
}

export interface ApplicationStatusHistory {
  status: ApplicationStatus;
  timestamp: string;
  actor: string;
  actorRole: 'USER' | 'ADMIN' | 'SYSTEM';
  note: string;
}

export interface ApplicationRecord {
  id: string; // e.g. HOST-2026-000001, AGENCY-2026-000001, BD-2026-000001, RESELLER-2026-000001
  type: ApplicationType;
  userId: string;
  applicantName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  avatarUrl: string;
  status: ApplicationStatus;
  invitationSource?: string; // e.g. 'Invited by Admin: INV-2026-0001' or 'Direct Public Application'
  submittedAt: string;
  updatedAt: string;
  reviewerAdminId?: string;
  rejectionReason?: string;
  infoRequiredNote?: string;
  adminNotes?: string;
  formData: Record<string, any>;
  documents: ApplicationDocument[];
  statusHistory: ApplicationStatusHistory[];
}

export interface HostingProfile {
  userId: string;
  hostId: string;
  roomCategory: string;
  hourlyRateCoins: number;
  totalBroadcastHours: number;
  approvedAt: string;
  status: 'ACTIVE' | 'SUSPENDED';
  badge: string;
  goLiveAllowed: boolean;
}

export interface AgencyProfile {
  agencyId: string;
  ownerUserId: string;
  agencyName: string;
  commissionPercent: number;
  totalHosts: number;
  walletBalance: number;
  approvedAt: string;
  status: 'ACTIVE' | 'SUSPENDED';
  recruitmentCode: string;
}

export interface BDProfile {
  bdId: string;
  userId: string;
  assignedRegion: string;
  recruitedAgenciesCount: number;
  targetRevenue: number;
  approvedAt: string;
  status: 'ACTIVE' | 'SUSPENDED';
  roleTier: string;
}

export interface BDLeaderProfile {
  bdLeaderId: string;
  userId: string;
  assignedSuperRegion: string;
  managedBDCount: number;
  quarterlyBudgetUsd: number;
  approvedAt: string;
  status: 'ACTIVE' | 'SUSPENDED';
  leadershipTier: string;
  commissionBonusRate: number;
}

export interface AdminModProfile {
  adminModId: string;
  userId: string;
  jurisdiction: string;
  clearanceLevel: 'MODERATOR' | 'COMPLIANCE' | 'SUPER_ADMIN';
  dailyAuditQuota: number;
  assignedBadge: string;
  approvedAt: string;
  status: 'ACTIVE' | 'SUSPENDED';
  emergencyKillswitchAccess: boolean;
}

export interface ResellerProfile {
  resellerId: string;
  userId: string;
  businessName: string;
  discountRate: number;
  monthlyQuotaCoins: number;
  walletBalanceCoins: number;
  approvedAt: string;
  status: 'ACTIVE' | 'SUSPENDED';
  paymentChannel: string;
}

export interface ApplicationAuditLog {
  id: string;
  applicationId: string;
  userId: string;
  adminId: string;
  action: string;
  previousStatus?: ApplicationStatus;
  newStatus: ApplicationStatus;
  reason?: string;
  timestamp: string;
}

export interface ApplicationNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SUBMITTED' | 'UNDER_REVIEW' | 'INFO_REQUIRED' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  applicationId: string;
  read: boolean;
  createdAt: string;
}

export interface LiveRoomRecord {
  id: string;
  title: string;
  host: { id: string; name: string; avatar: string };
  category: 'Music' | 'Gaming PK' | 'Talk Show' | 'Podcast' | 'Party';
  listeners: number;
  seatCount: 10 | 15 | 20;
  lockedSeats: number[];
  mutedSeats: number[];
  status: 'LIVE' | 'PK_BATTLE' | 'ENDED';
  giftRevenueCoins: number;
  pkOpponent?: { id: string; name: string; score: number };
  pkMyScore?: number;
  isPK: boolean;
}

export interface WithdrawalRecord {
  id: string;
  userId: string;
  username: string;
  diamondsToCashout: number;
  usdAmount: string;
  pkrAmount: string;
  gateway: 'JazzCash' | 'Easypaisa' | 'Meezan Bank' | 'Stripe' | 'PayPal';
  accountTitle: string;
  accountNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  txnRef?: string;
}

export interface FamilyRecord {
  id: string;
  name: string;
  icon: string;
  leader: { id: string; name: string };
  membersCount: number;
  level: number;
  xp: number;
  treasuryCoins: number;
  weeklyGiftsCoins: number;
  country: string;
  status: 'ACTIVE' | 'FROZEN';
}

const STORAGE_KEY = 'AURALIVE_ENTERPRISE_ADMIN_DB_V2';

/* ── DEFAULT SEED DATA (PRODUCTION EMPTY) ── */
const INITIAL_RELATIONSHIPS: RelationshipRecord[] = [];
const INITIAL_USERS: UserRecord[] = [];


const INITIAL_MEDALS: MedalRecord[] = [
  { id: 'MED-101', name: 'VIP 10 Crown', category: 'VIP & Nobility', icon: '👑', rarity: 'MYTHIC', xpBonus: '+50% XP', badgeBorder: 'border-amber-400', unlockCondition: 'Reach VIP 10 Status', awardedUsersCount: 14, active: true },
  { id: 'MED-102', name: 'PK Champion', category: 'PK Tournament', icon: '🔥', rarity: 'LEGENDARY', xpBonus: '+30% Win Multiplier', badgeBorder: 'border-red-500', unlockCondition: 'Win 50+ 1v1 PK Battles', awardedUsersCount: 88, active: true },
  { id: 'MED-103', name: 'Top Gifter', category: 'Economy & Wealth', icon: '💎', rarity: 'EPIC', xpBonus: '+20% Gift Cashback', badgeBorder: 'border-cyan-400', unlockCondition: 'Send 1,000,000+ Coins in Gifts', awardedUsersCount: 240, active: true },
  { id: 'MED-104', name: 'Family Leader', category: 'Guild & Community', icon: '🦁', rarity: 'LEGENDARY', xpBonus: '+15% Family Treasury', badgeBorder: 'border-purple-500', unlockCondition: 'Found a Level 5+ Family Guild', awardedUsersCount: 42, active: true },
  { id: 'MED-105', name: 'Certified Vocalist', category: 'Host & Talent', icon: '🎙️', rarity: 'RARE', xpBonus: '+10% Host Salary', badgeBorder: 'border-emerald-400', unlockCondition: 'Pass Host Voice Audition', awardedUsersCount: 310, active: true },
];

const INITIAL_ROOMS: LiveRoomRecord[] = [];
const INITIAL_WITHDRAWALS: WithdrawalRecord[] = [];
const INITIAL_FAMILIES: FamilyRecord[] = [];

/* ── 🌟 INVITATION SEED DATA & TEMPLATES ── */
export const INITIAL_INVITATIONS: InvitationRecord[] = [];
export const INITIAL_INVITATION_AUDIT_LOGS: InvitationAuditLog[] = [];
const INITIAL_APPLICATIONS: ApplicationRecord[] = [];

export const INITIAL_INVITATION_TEMPLATES: InvitationTemplate[] = [
  {
    id: 'TPL-HOST-01',
    type: 'HOSTING',
    title: '🎤 Official Vocal Host Broadcaster Invitation',
    defaultMessage: 'We have identified your vocal talent and active community leadership. We would like to invite you as an Official Vocal Host with guaranteed coin salary and verified badge.',
    defaultRequirements: [
      'Minimum 15 live audio hours per week',
      'Host 10-seat or 20-seat interactive voice lounges',
      'Maintain positive community and UGC standards',
    ],
    defaultBenefits: [
      'Guaranteed 1,500 Coins/hour base compensation',
      'Exclusive 🎙️ Official Host verified badge',
      'Featured room recommendation on Aura Live homepage',
      'Priority access to PK Battle tournaments',
    ],
    defaultExpiryDays: 7,
  },
  {
    id: 'TPL-AGENCY-01',
    type: 'AGENCY',
    title: '🏢 Official Talent Agency Partnership Invitation',
    defaultMessage: 'Your community guild has shown outstanding performance. We invite you to formalize a verified Talent Agency with 15% revenue share and full host roster management tools.',
    defaultRequirements: [
      'Maintain at least 10 active broadcaster hosts',
      'Coordinate weekly agency PK events',
      'Submit verified business or national identity documents',
    ],
    defaultBenefits: [
      '15% monthly commission on all agency host earnings',
      'Direct Agency Portal & Host Recruitment Roster',
      'Monthly recruitment coin subsidies',
    ],
    defaultExpiryDays: 14,
  },
  {
    id: 'TPL-BD-01',
    type: 'BD',
    title: '👑 Regional Business Developer (BD) Invitation',
    defaultMessage: 'Official Invitation to join Aura Live platform operations as a Regional Business Developer (BD) for regional broadcaster and agency onboarding.',
    defaultRequirements: [
      'Onboard 10 agencies and 100 verified hosts per quarter',
      'Supervise regional growth and broadcaster compliance',
    ],
    defaultBenefits: [
      '$500,000 target quarterly revenue incentive',
      'Regional representative executive badge',
      'Direct line to Platform Governance Board',
    ],
    defaultExpiryDays: 30,
  },
  {
    id: 'TPL-RESELLER-01',
    type: 'RESELLER',
    title: '💼 Authorized Wholesale Coins Reseller Invitation',
    defaultMessage: 'We invite your digital commerce business to operate as an Authorized Aura Live Wholesale Coins Distributor with wholesale margin.',
    defaultRequirements: [
      'Minimum monthly coin purchase volume of $50,000 USD',
      'Provide instant top-up service to players via USDT or Stripe',
    ],
    defaultBenefits: [
      '18% wholesale coin profit margin',
      'Dedicated Wholesale Recharge API Terminal',
      'Zero transaction fees on master wallet funding',
    ],
    defaultExpiryDays: 7,
  },
];

/* ── DATABASE SERVICE SINGLETON ── */

class AdminEnterpriseDataService {
  private relationships: RelationshipRecord[] = [];
  private users: UserRecord[] = [];
  private medals: MedalRecord[] = [];
  private rooms: LiveRoomRecord[] = [];
  private withdrawals: WithdrawalRecord[] = [];
  private families: FamilyRecord[] = [];
  private invitations: InvitationRecord[] = [];
  private invitationTemplates: InvitationTemplate[] = [];
  private invitationAuditLogs: InvitationAuditLog[] = [];
  private applications: ApplicationRecord[] = [];
  private hostingProfiles: HostingProfile[] = [];
  private agencyProfiles: AgencyProfile[] = [];
  private bdProfiles: BDProfile[] = [];
  private bdLeaderProfiles: BDLeaderProfile[] = [];
  private adminModProfiles: AdminModProfile[] = [];
  private resellerProfiles: ResellerProfile[] = [];
  private applicationAuditLogs: ApplicationAuditLog[] = [];
  private applicationNotifications: ApplicationNotification[] = [];
  private listeners: Set<() => void> = new Set();
  private appListeners: Array<(apps: ApplicationRecord[]) => void> = [];
  private invListeners: Set<(invites: InvitationRecord[]) => void> = new Set();

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const SEED_DUMMY_IDS = ['100821', '100452', '100998', '100344'];
          this.relationships = (parsed.relationships || []).filter((r: any) => !SEED_DUMMY_IDS.includes(r.user1?.id) && !SEED_DUMMY_IDS.includes(r.user2?.id));
          this.users = (parsed.users || []).filter((u: any) => !SEED_DUMMY_IDS.includes(u.id));

          this.medals = parsed.medals || INITIAL_MEDALS;
          this.rooms = parsed.rooms || INITIAL_ROOMS;
          this.withdrawals = (parsed.withdrawals || []).filter((w: any) => !SEED_DUMMY_IDS.includes(w.userId));
          this.families = (parsed.families || []).filter((f: any) => !SEED_DUMMY_IDS.includes(f.leader?.id));

          this.invitations = parsed.invitations || INITIAL_INVITATIONS;

          this.invitationTemplates = parsed.invitationTemplates || INITIAL_INVITATION_TEMPLATES;
          this.invitationAuditLogs = parsed.invitationAuditLogs || INITIAL_INVITATION_AUDIT_LOGS;
          this.applications = parsed.applications || INITIAL_APPLICATIONS;
          this.hostingProfiles = parsed.hostingProfiles || [];
          this.agencyProfiles = parsed.agencyProfiles || [];
          this.bdProfiles = parsed.bdProfiles || [];
          this.bdLeaderProfiles = parsed.bdLeaderProfiles || [];
          this.adminModProfiles = parsed.adminModProfiles || [];
          this.resellerProfiles = parsed.resellerProfiles || [];
          this.applicationAuditLogs = parsed.applicationAuditLogs || [];
          this.applicationNotifications = parsed.applicationNotifications || [];
          return;
        }
      }
    } catch (e) {
      console.warn('LocalStorage load fallback to defaults', e);
    }
    this.relationships = INITIAL_RELATIONSHIPS;
    this.users = INITIAL_USERS;
    this.medals = INITIAL_MEDALS;
    this.rooms = INITIAL_ROOMS;
    this.withdrawals = INITIAL_WITHDRAWALS;
    this.families = INITIAL_FAMILIES;
    this.invitations = INITIAL_INVITATIONS;
    this.invitationTemplates = INITIAL_INVITATION_TEMPLATES;
    this.invitationAuditLogs = INITIAL_INVITATION_AUDIT_LOGS;
    this.applications = INITIAL_APPLICATIONS;
    this.hostingProfiles = [];
    this.agencyProfiles = [];
    this.bdProfiles = [];
    this.bdLeaderProfiles = [];
    this.adminModProfiles = [];
    this.resellerProfiles = [];
    this.applicationAuditLogs = [];
    this.applicationNotifications = [];
    this.save();
  }

  private save() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const payload = {
          relationships: this.relationships,
          users: this.users,
          medals: this.medals,
          rooms: this.rooms,
          withdrawals: this.withdrawals,
          families: this.families,
          invitations: this.invitations,
          invitationTemplates: this.invitationTemplates,
          invitationAuditLogs: this.invitationAuditLogs,
          applications: this.applications,
          hostingProfiles: this.hostingProfiles,
          agencyProfiles: this.agencyProfiles,
          bdProfiles: this.bdProfiles,
          bdLeaderProfiles: this.bdLeaderProfiles,
          adminModProfiles: this.adminModProfiles,
          resellerProfiles: this.resellerProfiles,
          applicationAuditLogs: this.applicationAuditLogs,
          applicationNotifications: this.applicationNotifications,
          lastUpdated: new Date().toISOString(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (e) {}
    });
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (err) { console.error(err); }
    });
  }

  /* ── 16 RELATIONSHIP CARDS CRUD ── */
  public getRelationships(): RelationshipRecord[] {
    return [...this.relationships];
  }

  public addRelationship(rel: Omit<RelationshipRecord, 'id' | 'createdAt'>): RelationshipRecord {
    const newRecord: RelationshipRecord = {
      ...rel,
      id: `REL-${rel.type}-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.relationships = [newRecord, ...this.relationships];
    this.save();
    return newRecord;
  }

  public updateRelationshipLevel(id: string, newLevel: number): void {
    this.relationships = this.relationships.map(r => {
      if (r.id === id) {
        return {
          ...r,
          level: Math.min(10, Math.max(1, newLevel)),
          currentXp: newLevel * 30000,
          targetXp: (newLevel + 1) * 35000,
        };
      }
      return r;
    });
    this.save();
  }

  public updateRelationshipStatus(id: string, status: 'ACTIVE' | 'PENDING' | 'DISBANDED'): void {
    this.relationships = this.relationships.map(r => r.id === id ? { ...r, status } : r);
    this.save();
  }

  public deleteRelationship(id: string): void {
    this.relationships = this.relationships.filter(r => r.id !== id);
    this.save();
  }

  /* ── USER MANAGEMENT CRUD ── */
  public getUsers(): UserRecord[] {
    return [...this.users];
  }

  public updateUserCoins(id: string, deltaCoins: number): void {
    this.users = this.users.map(u => u.id === id ? { ...u, coins: Math.max(0, u.coins + deltaCoins) } : u);
    this.save();
  }

  public updateUserDiamonds(id: string, deltaDiamonds: number): void {
    this.users = this.users.map(u => u.id === id ? { ...u, diamonds: Math.max(0, u.diamonds + deltaDiamonds) } : u);
    this.save();
  }

  public toggleFreezeWallet(id: string): void {
    this.users = this.users.map(u => u.id === id ? { ...u, walletFrozen: !u.walletFrozen } : u);
    this.save();
  }

  public updateUserStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'KYC_PENDING'): void {
    this.users = this.users.map(u => u.id === id ? { ...u, status } : u);
    this.save();
  }

  public updateUserVip(id: string, vip: string): void {
    this.users = this.users.map(u => u.id === id ? { ...u, vip } : u);
    this.save();
  }

  /* ── MEDAL MANAGEMENT CRUD ── */
  public getMedals(): MedalRecord[] {
    return [...this.medals];
  }

  public addMedal(medal: Omit<MedalRecord, 'id' | 'awardedUsersCount'>): MedalRecord {
    const newMedal: MedalRecord = {
      ...medal,
      id: `MED-${Math.floor(100 + Math.random() * 900)}`,
      awardedUsersCount: 0,
    };
    this.medals = [newMedal, ...this.medals];
    this.save();
    return newMedal;
  }

  public toggleMedalActive(id: string): void {
    this.medals = this.medals.map(m => m.id === id ? { ...m, active: !m.active } : m);
    this.save();
  }

  /* ── LIVE ROOMS & PK ARENA CRUD ── */
  public getRooms(): LiveRoomRecord[] {
    return [...this.rooms];
  }

  public toggleSeatLock(roomId: string, seatIndex: number): void {
    this.rooms = this.rooms.map(r => {
      if (r.id === roomId) {
        const locked = r.lockedSeats.includes(seatIndex)
          ? r.lockedSeats.filter(s => s !== seatIndex)
          : [...r.lockedSeats, seatIndex];
        return { ...r, lockedSeats: locked };
      }
      return r;
    });
    this.save();
  }

  public toggleSeatMute(roomId: string, seatIndex: number): void {
    this.rooms = this.rooms.map(r => {
      if (r.id === roomId) {
        const muted = r.mutedSeats.includes(seatIndex)
          ? r.mutedSeats.filter(s => s !== seatIndex)
          : [...r.mutedSeats, seatIndex];
        return { ...r, mutedSeats: muted };
      }
      return r;
    });
    this.save();
  }

  public closeRoom(roomId: string): void {
    this.rooms = this.rooms.map(r => r.id === roomId ? { ...r, status: 'ENDED' } : r);
    this.save();
  }

  /* ── CASHOUT WITHDRAWALS CRUD ── */
  public getWithdrawals(): WithdrawalRecord[] {
    return [...this.withdrawals];
  }

  public approveWithdrawal(id: string, txnRef: string): void {
    this.withdrawals = this.withdrawals.map(w => {
      if (w.id === id) {
        return {
          ...w,
          status: 'APPROVED',
          processedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          txnRef: txnRef || `TXN-PK-${Math.floor(100000 + Math.random() * 900000)}`,
        };
      }
      return w;
    });
    this.save();
  }

  public rejectWithdrawal(id: string): void {
    this.withdrawals = this.withdrawals.map(w => w.id === id ? { ...w, status: 'REJECTED' } : w);
    this.save();
  }

  /* ── REAL-TIME GIFTING & WALLET ATOMIC TRANSACTIONS ── */
  public sendGiftTransaction(senderId: string, recipientId: string, giftName: string, coinPrice: number, diamondReward: number): { success: boolean; error?: string; remainingCoins?: number } {
    const sender = this.users.find(u => u.id === senderId);
    if (!sender) return { success: false, error: 'Sender user not found' };
    if (sender.walletFrozen) return { success: false, error: 'Wallet is frozen. Contact Admin.' };
    if (sender.coins < coinPrice) return { success: false, error: 'Insufficient coin balance.' };

    // Atomically debit sender
    sender.coins -= coinPrice;
    sender.xp += Math.round(coinPrice * 0.1);

    // Atomically credit recipient
    const recipient = this.users.find(u => u.id === recipientId);
    if (recipient) {
      recipient.diamonds += diamondReward;
      recipient.xp += Math.round(diamondReward * 0.2);
    }

    this.save();
    return { success: true, remainingCoins: sender.coins };
  }

  /* ── REAL-TIME ROOM PRESENCE & SEAT JOIN/LEAVE ── */
  public joinSeat(roomId: string, seatIndex: number, user: { id: string; name: string; avatar: string }): boolean {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) return false;
    if (room.lockedSeats.includes(seatIndex)) return false;
    this.save();
    return true;
  }

  private applications: ApplicationRecord[] = [];
  private hostingProfiles: HostingProfile[] = [];
  private agencyProfiles: AgencyProfile[] = [];
  private bdProfiles: BDProfile[] = [];
  private resellerProfiles: ResellerProfile[] = [];
  private applicationAuditLogs: ApplicationAuditLog[] = [];
  private applicationNotifications: ApplicationNotification[] = [];
  private appListeners: Array<(apps: ApplicationRecord[]) => void> = [];

  /* ═══════════════════════════════════════════════════════════════════ */
  /* ── INVITATION MANAGEMENT SYSTEM CRUD (ADMIN INVITES USER) ──────── */
  /* ═══════════════════════════════════════════════════════════════════ */

  public getInvitations(type?: InvitationType, status?: InvitationStatus): InvitationRecord[] {
    let list = [...this.invitations];
    if (type) list = list.filter(i => i.type === type);
    if (status) list = list.filter(i => i.status === status);
    return list;
  }

  public getInvitationById(id: string): InvitationRecord | undefined {
    return this.invitations.find(i => i.id === id);
  }

  public getUserInvitations(userId: string): InvitationRecord[] {
    return this.invitations.filter(i => i.targetUserId === userId);
  }

  public createInvitation(payload: {
    type: InvitationType;
    targetUserId: string;
    targetUserName: string;
    targetUserAvatar?: string;
    targetUserCountry?: string;
    invitedByAdminId: string;
    invitedByAdminName: string;
    message: string;
    requirements: string[];
    benefits: string[];
    expiryDays: number;
  }): { success: boolean; invitation?: InvitationRecord; error?: string } {
    // 1. Check if user already has pending invitation for this type
    const active = this.invitations.find(
      i => i.targetUserId === payload.targetUserId && i.type === payload.type && i.status === 'PENDING'
    );
    if (active) {
      return {
        success: false,
        error: `User ${payload.targetUserName} already has a pending ${payload.type} invitation (${active.id}).`,
      };
    }

    const year = new Date().getFullYear();
    const count = this.invitations.length + 1;
    const invId = `INV-${year}-${String(count).padStart(4, '0')}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (payload.expiryDays || 7));
    const expiresAt = expiryDate.toISOString().replace('T', ' ').slice(0, 19);

    const newInvite: InvitationRecord = {
      id: invId,
      type: payload.type,
      targetUserId: payload.targetUserId,
      targetUserName: payload.targetUserName,
      targetUserAvatar: payload.targetUserAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      targetUserCountry: payload.targetUserCountry || 'Pakistan',
      invitedByAdminId: payload.invitedByAdminId,
      invitedByAdminName: payload.invitedByAdminName,
      message: payload.message,
      requirements: payload.requirements,
      benefits: payload.benefits,
      expiryDays: payload.expiryDays || 7,
      expiresAt,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    this.invitations.unshift(newInvite);

    // Audit log
    this.invitationAuditLogs.unshift({
      id: `IAUD-${Date.now()}`,
      invitationId: invId,
      targetUserId: payload.targetUserId,
      action: 'INVITATION_SENT',
      actor: payload.invitedByAdminName,
      actorRole: 'ADMIN',
      timestamp: now,
      note: `Admin ${payload.invitedByAdminName} dispatched ${payload.type} invitation to ${payload.targetUserName} with ${payload.expiryDays} days expiry.`,
    });

    // Realtime notification to user
    this.applicationNotifications.unshift({
      id: `NOTIF-INV-${Date.now()}`,
      userId: payload.targetUserId,
      title: `👑 Official ${payload.type} Invitation Received!`,
      message: `You have been officially invited by Platform Admin to become a verified ${payload.type}. Open your Invitation Center to review benefits and accept.`,
      type: 'SUBMITTED',
      applicationId: invId,
      read: false,
      createdAt: now,
    });

    this.save();
    this.notifyInvListeners();
    return { success: true, invitation: newInvite };
  }

  public acceptInvitation(id: string, userId: string): { success: boolean; invitation?: InvitationRecord; error?: string } {
    const invite = this.invitations.find(i => i.id === id);
    if (!invite) return { success: false, error: 'Invitation not found.' };
    if (invite.targetUserId !== userId) return { success: false, error: 'Unauthorized user for this invitation.' };
    if (invite.status !== 'PENDING') return { success: false, error: `Invitation is already ${invite.status}.` };

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    invite.status = 'ACCEPTED';
    invite.acceptedAt = now;
    invite.updatedAt = now;

    this.invitationAuditLogs.unshift({
      id: `IAUD-${Date.now()}`,
      invitationId: invite.id,
      targetUserId: userId,
      action: 'INVITATION_ACCEPTED',
      actor: invite.targetUserName,
      actorRole: 'USER',
      timestamp: now,
      note: `User accepted ${invite.type} invitation. Proceeding to verified application submission.`,
    });

    this.save();
    this.notifyInvListeners();
    return { success: true, invitation: invite };
  }

  public declineInvitation(id: string, userId: string, reason?: string): { success: boolean; invitation?: InvitationRecord; error?: string } {
    const invite = this.invitations.find(i => i.id === id);
    if (!invite) return { success: false, error: 'Invitation not found.' };
    if (invite.targetUserId !== userId) return { success: false, error: 'Unauthorized user for this invitation.' };
    if (invite.status !== 'PENDING') return { success: false, error: `Invitation is already ${invite.status}.` };

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    invite.status = 'DECLINED';
    invite.declineReason = reason || 'User chose not to proceed at this time.';
    invite.declinedAt = now;
    invite.updatedAt = now;

    this.invitationAuditLogs.unshift({
      id: `IAUD-${Date.now()}`,
      invitationId: invite.id,
      targetUserId: userId,
      action: 'INVITATION_DECLINED',
      actor: invite.targetUserName,
      actorRole: 'USER',
      timestamp: now,
      note: `User declined invitation. Reason: "${invite.declineReason}"`,
    });

    this.save();
    this.notifyInvListeners();
    return { success: true, invitation: invite };
  }

  public cancelInvitation(id: string, adminId: string, reason?: string): { success: boolean; invitation?: InvitationRecord; error?: string } {
    const invite = this.invitations.find(i => i.id === id);
    if (!invite) return { success: false, error: 'Invitation not found.' };

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    invite.status = 'CANCELLED';
    invite.cancelledAt = now;
    invite.updatedAt = now;

    this.invitationAuditLogs.unshift({
      id: `IAUD-${Date.now()}`,
      invitationId: invite.id,
      targetUserId: invite.targetUserId,
      action: 'INVITATION_CANCELLED',
      actor: adminId,
      actorRole: 'ADMIN',
      timestamp: now,
      note: `Admin cancelled invitation. Reason: "${reason || 'Administrative recall'}"`,
    });

    this.save();
    this.notifyInvListeners();
    return { success: true, invitation: invite };
  }

  public expireOverdueInvitations(): number {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    let expiredCount = 0;
    this.invitations.forEach(i => {
      if (i.status === 'PENDING' && i.expiresAt < now) {
        i.status = 'EXPIRED';
        i.updatedAt = now;
        expiredCount++;
        this.invitationAuditLogs.unshift({
          id: `IAUD-${Date.now()}-${expiredCount}`,
          invitationId: i.id,
          targetUserId: i.targetUserId,
          action: 'INVITATION_EXPIRED',
          actor: 'SYSTEM',
          actorRole: 'SYSTEM',
          timestamp: now,
          note: `Invitation TTL expired automatically without acceptance.`,
        });
      }
    });
    if (expiredCount > 0) {
      this.save();
      this.notifyInvListeners();
    }
    return expiredCount;
  }

  public getInvitationTemplates(): InvitationTemplate[] {
    return [...this.invitationTemplates];
  }

  public getInvitationAuditLogs(): InvitationAuditLog[] {
    return [...this.invitationAuditLogs];
  }

  public getInvitationAnalytics(): {
    totalSent: number;
    pending: number;
    accepted: number;
    declined: number;
    expired: number;
    cancelled: number;
    conversionRate: string;
  } {
    const total = this.invitations.length;
    const pending = this.invitations.filter(i => i.status === 'PENDING').length;
    const accepted = this.invitations.filter(i => i.status === 'ACCEPTED').length;
    const declined = this.invitations.filter(i => i.status === 'DECLINED').length;
    const expired = this.invitations.filter(i => i.status === 'EXPIRED').length;
    const cancelled = this.invitations.filter(i => i.status === 'CANCELLED').length;
    const rate = total > 0 ? ((accepted / total) * 100).toFixed(1) + '%' : '0%';
    return {
      totalSent: total,
      pending,
      accepted,
      declined,
      expired,
      cancelled,
      conversionRate: rate,
    };
  }

  public subscribeToInvitations(callback: (invites: InvitationRecord[]) => void): () => void {
    this.invListeners.add(callback);
    callback(this.getInvitations());
    return () => {
      this.invListeners.delete(callback);
    };
  }

  private notifyInvListeners() {
    this.invListeners.forEach(cb => {
      try { cb(this.getInvitations()); } catch (e) { console.error(e); }
    });
  }

  /* ═══════════════════════════════════════════════════════════════════ */
  /* ── APPLICATION SYSTEM CRUD (USER APPLIES, ADMIN APPROVES) ──────── */
  /* ═══════════════════════════════════════════════════════════════════ */

  public getApplications(type?: ApplicationType, status?: ApplicationStatus): ApplicationRecord[] {
    let result = [...this.applications];
    if (type) result = result.filter(a => a.type === type);
    if (status) result = result.filter(a => a.status === status);
    return result;
  }

  public getApplicationById(id: string): ApplicationRecord | undefined {
    return this.applications.find(a => a.id === id);
  }

  public getUserApplications(userId: string): ApplicationRecord[] {
    return this.applications.filter(a => a.userId === userId);
  }

  public hasActiveApplication(userId: string, type: ApplicationType): boolean {
    const activeStatuses: ApplicationStatus[] = ['SUBMITTED', 'UNDER_REVIEW', 'INFO_REQUIRED'];
    return this.applications.some(a => a.userId === userId && a.type === type && activeStatuses.includes(a.status));
  }

  public submitApplication(payload: {
    type: ApplicationType;
    userId: string;
    applicantName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    avatarUrl: string;
    formData: Record<string, any>;
    documents: { name: string; url: string; type: string; size: string }[];
  }): { success: boolean; application?: ApplicationRecord; error?: string } {
    // 1. Duplicate Protection Check
    if (this.hasActiveApplication(payload.userId, payload.type)) {
      return {
        success: false,
        error: `You already have an active ${payload.type} application currently under review.`,
      };
    }

    // 2. Generate Unique Non-Duplicating ID
    const prefixMap: Record<ApplicationType, string> = {
      HOSTING: 'HOST',
      AGENCY: 'AGENCY',
      BD: 'BD',
      RESELLER: 'RESELLER',
    };
    const year = new Date().getFullYear();
    const count = this.applications.filter(a => a.type === payload.type).length + 1;
    const appId = `${prefixMap[payload.type]}-${year}-${String(count).padStart(6, '0')}`;

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const newApp: ApplicationRecord = {
      id: appId,
      type: payload.type,
      userId: payload.userId,
      applicantName: payload.applicantName,
      email: payload.email,
      phone: payload.phone,
      country: payload.country,
      city: payload.city,
      avatarUrl: payload.avatarUrl,
      status: 'SUBMITTED',
      submittedAt: now,
      updatedAt: now,
      formData: payload.formData,
      documents: payload.documents.map((d, i) => ({
        ...d,
        id: `DOC-${Date.now()}-${i}`,
        uploadedAt: now,
      })),
      statusHistory: [
        {
          status: 'SUBMITTED',
          timestamp: now,
          actor: payload.applicantName,
          actorRole: 'USER',
          note: `Application submitted with ${payload.documents.length} verified documents.`,
        },
      ],
    };

    this.applications.unshift(newApp);

    // 3. Create Audit Log & Notification
    this.applicationAuditLogs.unshift({
      id: `AUD-${Date.now()}`,
      applicationId: appId,
      userId: payload.userId,
      adminId: 'SYSTEM',
      action: 'APPLICATION_SUBMITTED',
      newStatus: 'SUBMITTED',
      timestamp: now,
    });

    this.applicationNotifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: payload.userId,
      title: `${payload.type} Application Received`,
      message: `Your application (${appId}) has been successfully submitted and forwarded to the Admin Review Board.`,
      type: 'SUBMITTED',
      applicationId: appId,
      read: false,
      createdAt: now,
    });

    this.save();
    this.notifyAppListeners();
    return { success: true, application: newApp };
  }

  public saveDraftApplication(payload: {
    type: ApplicationType;
    userId: string;
    applicantName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    avatarUrl: string;
    formData: Record<string, any>;
  }): ApplicationRecord {
    const existingDraft = this.applications.find(
      a => a.userId === payload.userId && a.type === payload.type && a.status === 'DRAFT'
    );

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (existingDraft) {
      existingDraft.formData = payload.formData;
      existingDraft.updatedAt = now;
      this.save();
      return existingDraft;
    }

    const prefixMap: Record<ApplicationType, string> = {
      HOSTING: 'HOST',
      AGENCY: 'AGENCY',
      BD: 'BD',
      BD_LEADER: 'BDL',
      RESELLER: 'RESELLER',
      ADMIN_MOD: 'ADMIN',
    };
    const year = new Date().getFullYear();
    const count = this.applications.filter(a => a.type === payload.type).length + 1;
    const appId = `${prefixMap[payload.type]}-${year}-${String(count).padStart(6, '0')}`;

    const draft: ApplicationRecord = {
      id: appId,
      type: payload.type,
      userId: payload.userId,
      applicantName: payload.applicantName,
      email: payload.email,
      phone: payload.phone,
      country: payload.country,
      city: payload.city,
      avatarUrl: payload.avatarUrl,
      status: 'DRAFT',
      submittedAt: now,
      updatedAt: now,
      formData: payload.formData,
      documents: [],
      statusHistory: [
        {
          status: 'DRAFT',
          timestamp: now,
          actor: payload.applicantName,
          actorRole: 'USER',
          note: 'Application draft saved locally.',
        },
      ],
    };

    this.applications.unshift(draft);
    this.save();
    return draft;
  }

  public approveApplication(id: string, reviewerId: string, adminNotes?: string): { success: boolean; application?: ApplicationRecord; error?: string } {
    const app = this.applications.find(a => a.id === id);
    if (!app) return { success: false, error: 'Application not found' };

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const prevStatus = app.status;
    app.status = 'APPROVED';
    app.updatedAt = now;
    app.reviewerAdminId = reviewerId;
    if (adminNotes) app.adminNotes = adminNotes;

    app.statusHistory.push({
      status: 'APPROVED',
      timestamp: now,
      actor: reviewerId,
      actorRole: 'ADMIN',
      note: adminNotes || 'Application verified and approved by Administrator.',
    });

    // ── ROLE & PERMISSION ACTIVATION ──
    const targetUser = this.users.find(u => u.id === app.userId);
    if (targetUser) {
      if (app.type === 'HOSTING') {
        targetUser.isHost = true;
        this.hostingProfiles.push({
          userId: app.userId,
          hostId: `HST-${Math.floor(1000 + Math.random() * 9000)}`,
          roomCategory: app.formData.preferredHostingType || 'Music & Talk Show',
          hourlyRateCoins: 1500,
          totalBroadcastHours: 0,
          approvedAt: now,
          status: 'ACTIVE',
          badge: '🎙️ Official Host',
          goLiveAllowed: true,
        });
      } else if (app.type === 'AGENCY') {
        targetUser.agency = app.formData.proposedAgencyName || `${app.applicantName} Agency`;
        this.agencyProfiles.push({
          agencyId: `AG-${Math.floor(1000 + Math.random() * 9000)}`,
          ownerUserId: app.userId,
          agencyName: app.formData.proposedAgencyName || `${app.applicantName} Agency`,
          commissionPercent: 15,
          totalHosts: 1,
          walletBalance: 50000,
          approvedAt: now,
          status: 'ACTIVE',
          recruitmentCode: `AURA-${Math.floor(10000 + Math.random() * 90000)}`,
        });
      } else if (app.type === 'BD') {
        this.bdProfiles.push({
          bdId: `BD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: app.userId,
          assignedRegion: app.country,
          recruitedAgenciesCount: 0,
          targetRevenue: 500000,
          approvedAt: now,
          status: 'ACTIVE',
          roleTier: 'Senior BD Officer',
        });
      } else if (app.type === 'BD_LEADER') {
        this.bdLeaderProfiles.push({
          bdLeaderId: `BDL-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: app.userId,
          assignedSuperRegion: app.country + ' & Regional Territories',
          managedBDCount: 12,
          quarterlyBudgetUsd: 250000,
          approvedAt: now,
          status: 'ACTIVE',
          leadershipTier: 'Executive BD Director',
          commissionBonusRate: 22,
        });
      } else if (app.type === 'ADMIN_MOD') {
        this.adminModProfiles.push({
          adminModId: `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: app.userId,
          jurisdiction: app.country + ' Live Security & Safety',
          clearanceLevel: 'COMPLIANCE',
          dailyAuditQuota: 50,
          assignedBadge: '🛡️ Official Platform Moderator',
          approvedAt: now,
          status: 'ACTIVE',
          emergencyKillswitchAccess: true,
        });
      } else if (app.type === 'RESELLER') {
        this.resellerProfiles.push({
          resellerId: `RSL-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: app.userId,
          businessName: app.formData.businessName || `${app.applicantName} Reseller Point`,
          discountRate: 18,
          monthlyQuotaCoins: 5000000,
          walletBalanceCoins: 250000,
          approvedAt: now,
          status: 'ACTIVE',
          paymentChannel: app.formData.paymentMethod || 'Bank Transfer',
        });
      }
    }

    // Audit Log
    this.applicationAuditLogs.unshift({
      id: `AUD-${Date.now()}`,
      applicationId: app.id,
      userId: app.userId,
      adminId: reviewerId,
      action: 'APPLICATION_APPROVED',
      previousStatus: prevStatus,
      newStatus: 'APPROVED',
      reason: adminNotes,
      timestamp: now,
    });

    // Real-time Push Notification to User
    this.applicationNotifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: app.userId,
      title: `🎉 ${app.type} Application Approved!`,
      message: `Congratulations! Your ${app.type} application (${app.id}) has been approved. Your official ${app.type} Center and permissions are now active.`,
      type: 'APPROVED',
      applicationId: app.id,
      read: false,
      createdAt: now,
    });

    this.save();
    this.notifyAppListeners();
    return { success: true, application: app };
  }

  public rejectApplication(id: string, reviewerId: string, reason: string): { success: boolean; application?: ApplicationRecord; error?: string } {
    if (!reason || reason.trim().length < 5) {
      return { success: false, error: 'Rejection reason is required (minimum 5 characters).' };
    }

    const app = this.applications.find(a => a.id === id);
    if (!app) return { success: false, error: 'Application not found' };

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const prevStatus = app.status;
    app.status = 'REJECTED';
    app.updatedAt = now;
    app.reviewerAdminId = reviewerId;
    app.rejectionReason = reason;

    app.statusHistory.push({
      status: 'REJECTED',
      timestamp: now,
      actor: reviewerId,
      actorRole: 'ADMIN',
      note: `Rejected: ${reason}`,
    });

    this.applicationAuditLogs.unshift({
      id: `AUD-${Date.now()}`,
      applicationId: app.id,
      userId: app.userId,
      adminId: reviewerId,
      action: 'APPLICATION_REJECTED',
      previousStatus: prevStatus,
      newStatus: 'REJECTED',
      reason,
      timestamp: now,
    });

    this.applicationNotifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: app.userId,
      title: `⚠️ ${app.type} Application Rejected`,
      message: `Your ${app.type} application (${app.id}) was not approved. Reason: "${reason}". You may re-apply after addressing the feedback.`,
      type: 'REJECTED',
      applicationId: app.id,
      read: false,
      createdAt: now,
    });

    this.save();
    this.notifyAppListeners();
    return { success: true, application: app };
  }

  public requestInformation(id: string, reviewerId: string, note: string): { success: boolean; application?: ApplicationRecord; error?: string } {
    if (!note || note.trim().length < 5) {
      return { success: false, error: 'Please specify the exact required information.' };
    }

    const app = this.applications.find(a => a.id === id);
    if (!app) return { success: false, error: 'Application not found' };

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const prevStatus = app.status;
    app.status = 'INFO_REQUIRED';
    app.updatedAt = now;
    app.reviewerAdminId = reviewerId;
    app.infoRequiredNote = note;

    app.statusHistory.push({
      status: 'INFO_REQUIRED',
      timestamp: now,
      actor: reviewerId,
      actorRole: 'ADMIN',
      note: `Additional Info Requested: ${note}`,
    });

    this.applicationAuditLogs.unshift({
      id: `AUD-${Date.now()}`,
      applicationId: app.id,
      userId: app.userId,
      adminId: reviewerId,
      action: 'ADDITIONAL_INFO_REQUESTED',
      previousStatus: prevStatus,
      newStatus: 'INFO_REQUIRED',
      reason: note,
      timestamp: now,
    });

    this.applicationNotifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: app.userId,
      title: `📋 Additional Info Needed for ${app.type}`,
      message: `The Admin Board requires more details for (${app.id}): "${note}". Please open your application to update.`,
      type: 'INFO_REQUIRED',
      applicationId: app.id,
      read: false,
      createdAt: now,
    });

    this.save();
    this.notifyAppListeners();
    return { success: true, application: app };
  }

  public resubmitWithInfo(
    id: string,
    updatedFields: Record<string, any>,
    newDocs?: { name: string; url: string; type: string; size: string }[]
  ): { success: boolean; application?: ApplicationRecord; error?: string } {
    const app = this.applications.find(a => a.id === id);
    if (!app) return { success: false, error: 'Application not found' };

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    app.formData = { ...app.formData, ...updatedFields };
    app.status = 'UNDER_REVIEW';
    app.updatedAt = now;
    app.infoRequiredNote = undefined;

    if (newDocs && newDocs.length > 0) {
      newDocs.forEach((d, i) => {
        app.documents.push({
          ...d,
          id: `DOC-ADD-${Date.now()}-${i}`,
          uploadedAt: now,
        });
      });
    }

    app.statusHistory.push({
      status: 'UNDER_REVIEW',
      timestamp: now,
      actor: app.applicantName,
      actorRole: 'USER',
      note: 'User provided requested information and resubmitted.',
    });

    this.save();
    this.notifyAppListeners();
    return { success: true, application: app };
  }

  public setUnderReview(id: string, reviewerId: string): void {
    const app = this.applications.find(a => a.id === id);
    if (!app) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    app.status = 'UNDER_REVIEW';
    app.reviewerAdminId = reviewerId;
    app.updatedAt = now;
    app.statusHistory.push({
      status: 'UNDER_REVIEW',
      timestamp: now,
      actor: reviewerId,
      actorRole: 'ADMIN',
      note: 'Application placed under formal review queue.',
    });
    this.save();
    this.notifyAppListeners();
  }

  public getUserRolePermissions(userId: string): {
    isHost: boolean;
    isAgencyOwner: boolean;
    isBD: boolean;
    isBDLeader: boolean;
    isReseller: boolean;
    isAdminMod: boolean;
    roles: string[];
    hostingProfile?: HostingProfile;
    agencyProfile?: AgencyProfile;
    bdProfile?: BDProfile;
    bdLeaderProfile?: BDLeaderProfile;
    resellerProfile?: ResellerProfile;
    adminModProfile?: AdminModProfile;
  } {
    const user = this.users.find(u => u.id === userId);
    const hostP = this.hostingProfiles.find(h => h.userId === userId && h.status === 'ACTIVE');
    const agencyP = this.agencyProfiles.find(a => a.ownerUserId === userId && a.status === 'ACTIVE');
    const bdP = this.bdProfiles.find(b => b.userId === userId && b.status === 'ACTIVE');
    const bdlP = this.bdLeaderProfiles.find(b => b.userId === userId && b.status === 'ACTIVE');
    const resellerP = this.resellerProfiles.find(r => r.userId === userId && r.status === 'ACTIVE');
    const adminModP = this.adminModProfiles.find(a => a.userId === userId && a.status === 'ACTIVE');

    const roles: string[] = ['USER'];
    if (hostP || user?.isHost) roles.push('HOST');
    if (agencyP) roles.push('AGENCY_OWNER');
    if (bdP) roles.push('BUSINESS_DEVELOPER');
    if (bdlP) roles.push('BD_LEADER');
    if (resellerP) roles.push('RESELLER');
    if (adminModP) roles.push('ADMIN_MODERATOR');

    return {
      isHost: !!hostP || !!user?.isHost,
      isAgencyOwner: !!agencyP,
      isBD: !!bdP,
      isBDLeader: !!bdlP,
      isReseller: !!resellerP,
      isAdminMod: !!adminModP,
      roles,
      hostingProfile: hostP,
      agencyProfile: agencyP,
      bdProfile: bdP,
      bdLeaderProfile: bdlP,
      resellerProfile: resellerP,
      adminModProfile: adminModP,
    };
  }

  public getApplicationNotifications(userId?: string): ApplicationNotification[] {
    if (userId) {
      return this.applicationNotifications.filter(n => n.userId === userId);
    }
    return [...this.applicationNotifications];
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.applicationNotifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
    }
  }

  public getApplicationAuditLogs(): ApplicationAuditLog[] {
    return [...this.applicationAuditLogs];
  }

  public subscribeToApplications(callback: (apps: ApplicationRecord[]) => void): () => void {
    this.appListeners.push(callback);
    callback(this.getApplications());
    return () => {
      this.appListeners = this.appListeners.filter(l => l !== callback);
    };
  }

  private notifyAppListeners(): void {
    const apps = this.getApplications();
    this.appListeners.forEach(l => {
      try {
        l(apps);
      } catch (e) {
        // ignore callback error
      }
    });
  }
}

export const adminDb = new AdminEnterpriseDataService();

