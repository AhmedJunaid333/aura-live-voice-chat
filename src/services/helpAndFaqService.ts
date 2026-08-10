/* ═══════════════════════════════════════════════════════════════════ */
/* ── AURA LIVE VOICE CHAT — REAL-TIME HELP, FAQ & SUPPORT SERVICE ── */
/* ═══════════════════════════════════════════════════════════════════ */

export interface FaqCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FaqArticle {
  id: string; // e.g. 'FAQ-101'
  categoryId: string;
  title: string;
  shortDescription: string;
  content: string[]; // Step-by-step paragraphs or bullet points
  icon: string;
  sortOrder: number;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FaqFeedbackRecord {
  id: string;
  articleId: string;
  userId: string;
  isHelpful: boolean;
  timestamp: string;
}

export interface SupportTicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: 'USER' | 'SUPPORT_AGENT' | 'SYSTEM';
  senderAvatar?: string;
  content: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string; // e.g. 'TICKET-9402'
  userId: string;
  userName: string;
  userVipBadge?: string;
  subject: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
  priority: 'NORMAL' | 'HIGH' | 'VIP_URGENT';
  messages: SupportTicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface FaqSearchLog {
  id: string;
  query: string;
  resultsCount: number;
  timestamp: string;
}

const STORAGE_KEY = 'AURALIVE_HELP_FAQ_DB_V2';
const CHANNEL_NAME = 'AURALIVE_HELP_FAQ_CHANNEL_V2';

/* ── 🌟 DEFAULT CATEGORIES ── */
export const INITIAL_FAQ_CATEGORIES: FaqCategory[] = [
  { id: 'cat-wallet', name: 'Wallet & Recharge', description: 'Coins, diamonds, and payment methods', icon: '💳', sortOrder: 1, isActive: true },
  { id: 'cat-agency', name: 'Host & BD Agency', description: 'Host verification, guild quotas, and rewards', icon: '🎙️', sortOrder: 2, isActive: true },
  { id: 'cat-rooms', name: 'Audio & Video Rooms', description: '10, 15, and 20 Seat audio room layout', icon: '📻', sortOrder: 3, isActive: true },
  { id: 'cat-cp', name: 'CP Relationships', description: 'Intimacy rings, CP space, and privileges', icon: '💍', sortOrder: 4, isActive: true },
  { id: 'cat-vip', name: 'VIP & Royalty Levels', description: 'Exclusive entrance effects, badges, and perks', icon: '👑', sortOrder: 5, isActive: true },
  { id: 'cat-security', name: 'Account & Security', description: '2FA, phone binding, and password changes', icon: '🔒', sortOrder: 6, isActive: true },
  { id: 'cat-technical', name: 'Technical Issues', description: 'Audio permissions, lags, and connection fixes', icon: '⚙️', sortOrder: 7, isActive: true },
];

/* ── 🌟 INITIAL PRODUCTION FAQ ARTICLES (MATCHING SCREENSHOT) ── */
export const INITIAL_FAQ_ARTICLES: FaqArticle[] = [
  {
    id: 'FAQ-101',
    categoryId: 'cat-wallet',
    title: 'How do I recharge Coins & Diamonds?',
    shortDescription: 'Instant payment methods, wallet settlement, and diamond recharge guides.',
    content: [
      '1. Open your Profile tab and tap on "Wallet & Diamonds".',
      '2. Select your preferred diamond recharge package (ranging from 100 to 500,000 Diamonds).',
      '3. Choose a verified payment gateway: EasyPaisa, JazzCash, Google Play In-App Billing, Apple Pay, or Credit/Debit Card.',
      '4. Authorize the secure transaction. Diamonds will be credited to your balance within 3 to 10 seconds.',
      '5. Bonus CP intimacy points and VIP experience (XP) are automatically calculated and added to your level progress.'
    ],
    icon: '💳',
    sortOrder: 1,
    isPublished: true,
    isFeatured: true,
    viewCount: 1420,
    helpfulCount: 412,
    notHelpfulCount: 8,
    keywords: ['recharge', 'coins', 'diamonds', 'wallet', 'payment', 'easypaisa', 'jazzcash', 'buy'],
    createdAt: '2026-08-01 10:00',
    updatedAt: '2026-08-07 14:30',
  },
  {
    id: 'FAQ-102',
    categoryId: 'cat-agency',
    title: 'How to apply for Host / BD Agency status?',
    shortDescription: 'Application review criteria, agency contract requirements, and monthly quotas.',
    content: [
      '1. Go to Profile > Host Center or Agency Management Portal.',
      '2. Tap "Submit Host / BD Leader Application".',
      '3. Complete verified KYC identification, submit a 30-second audio voice sample, and bind your legal phone number.',
      '4. Enterprise Compliance Officers review applications within 24 to 48 business hours.',
      '5. Once approved, you unlock custom room banner creation, high-definition audio bitrate (128kbps), and automated weekly commission withdrawals.'
    ],
    icon: '🎙️',
    sortOrder: 2,
    isPublished: true,
    isFeatured: true,
    viewCount: 980,
    helpfulCount: 295,
    notHelpfulCount: 5,
    keywords: ['host', 'agency', 'apply', 'bd', 'leader', 'creator', 'guild', 'commission', 'application'],
    createdAt: '2026-08-02 11:30',
    updatedAt: '2026-08-07 16:00',
  },
  {
    id: 'FAQ-103',
    categoryId: 'cat-rooms',
    title: 'How do 10, 15, and 20 Seat Audio Rooms work?',
    shortDescription: 'Multi-seat mic layouts, host speaker permissions, and room background themes.',
    content: [
      '• 10-Seat Lounge: Ideal for intimate friend gatherings, PK voice battles, and casual chill discussions.',
      '• 15-Seat Audio Room: Designed for family guild meetups, musical talent contests, and open mic concerts.',
      '• 20-Seat Grand Palace: Unlocked for VIP Royalty Tier 7+ and Certified Agencies for mega celebratory events.',
      '• Host Controls: As room admin, you can lock/unlock individual seats, mute disruptive speakers, grant temporary mic privileges, and set room entrance requirements.'
    ],
    icon: '📻',
    sortOrder: 3,
    isPublished: true,
    isFeatured: true,
    viewCount: 1150,
    helpfulCount: 380,
    notHelpfulCount: 12,
    keywords: ['seats', 'audio', 'room', '10', '15', '20', 'mic', 'mute', 'live', 'broadcast', 'host'],
    createdAt: '2026-08-03 09:15',
    updatedAt: '2026-08-06 18:20',
  },
  {
    id: 'FAQ-104',
    categoryId: 'cat-cp',
    title: 'What are CP Relationship Privileges?',
    shortDescription: 'Couples space, custom intimacy rings, shared gift multipliers, and joint banners.',
    content: [
      '1. Send a CP Proposal Ring to your special partner in any live audio lounge or via direct message.',
      '2. When your partner accepts, your dynamic CP Space is activated on both user profiles.',
      '3. Intimacy Points increase by sending couple gifts, staying together on audio seats, and completing daily intimacy missions.',
      '4. Milestone Rewards: Unlock custom CP avatar frames, glowing entrance vehicle banners, exclusive 3D rose gifts, and high-tier intimacy rank badges on platform leaderboards.'
    ],
    icon: '💍',
    sortOrder: 4,
    isPublished: true,
    isFeatured: true,
    viewCount: 1840,
    helpfulCount: 560,
    notHelpfulCount: 14,
    keywords: ['cp', 'relationship', 'intimacy', 'ring', 'couple', 'love', 'space', 'partner', 'privileges'],
    createdAt: '2026-08-04 15:45',
    updatedAt: '2026-08-07 19:10',
  },
  {
    id: 'FAQ-105',
    categoryId: 'cat-security',
    title: 'How does Two-Factor Authentication (2FA) protect my account?',
    shortDescription: 'Enabling SMS/Email OTP challenges, revoking suspicious device sessions, and password complexity.',
    content: [
      '1. Open Settings > Account Security.',
      '2. Toggle on "Two-Factor Authentication". You will receive a 6-digit verification code to your bound phone/email.',
      '3. Once 2FA is active, logins from unverified devices or foreign IP locations require OTP authorization.',
      '4. You can also view your Active Device Sessions list and tap "Revoke Session" or "Logout All Other Devices" to terminate unauthorized connections instantly.'
    ],
    icon: '🔒',
    sortOrder: 5,
    isPublished: true,
    isFeatured: false,
    viewCount: 720,
    helpfulCount: 210,
    notHelpfulCount: 3,
    keywords: ['security', '2fa', 'two-factor', 'password', 'otp', 'device', 'session', 'protect', 'hack'],
    createdAt: '2026-08-05 12:00',
    updatedAt: '2026-08-07 20:00',
  },
  {
    id: 'FAQ-106',
    categoryId: 'cat-vip',
    title: 'What are the benefits of VIP & Noble Royalty Levels?',
    shortDescription: 'VIP 1 to 10 tier badges, invisible entrance stealth mode, and anti-kick privileges.',
    content: [
      '• VIP 1-3 (Baron / Viscount): Custom username color, gold chat bubble, and +15% XP leveling boost.',
      '• VIP 4-6 (Count / Marquis): Animated 3D entry luxury car effect, priority seat queue, and custom profile wallpaper.',
      '• VIP 7-10 (Duke / King / Emperor): Anti-kick and anti-mute immunity, private invisible stealth room browsing, dedicated 24/7 VIP concierge support, and 20-Seat Audio Room creation rights.'
    ],
    icon: '👑',
    sortOrder: 6,
    isPublished: true,
    isFeatured: false,
    viewCount: 1650,
    helpfulCount: 490,
    notHelpfulCount: 7,
    keywords: ['vip', 'noble', 'royalty', 'king', 'emperor', 'badge', 'perks', 'privileges', 'entrance', 'xp'],
    createdAt: '2026-08-05 14:20',
    updatedAt: '2026-08-07 21:00',
  },
  {
    id: 'FAQ-107',
    categoryId: 'cat-technical',
    title: 'Microphone permission or audio not working in Live Rooms?',
    shortDescription: 'Resolving mic mute states, browser/OS audio permissions, and Bluetooth lag.',
    content: [
      '1. Check that your physical device mic permission is granted to Aura Live in phone/browser settings.',
      '2. If on a seat, ensure the green mic button at the bottom right is unmuted (not showing a red slash).',
      '3. If using Bluetooth headphones, switch audio output to speaker or reconnect headphones to refresh audio sampling.',
      '4. If issue persists, close the room, clear app cache in Settings, or tap "Contact 24/7 VIP Support" below.'
    ],
    icon: '⚙️',
    sortOrder: 7,
    isPublished: true,
    isFeatured: false,
    viewCount: 890,
    helpfulCount: 260,
    notHelpfulCount: 15,
    keywords: ['audio', 'microphone', 'mic', 'sound', 'permission', 'lag', 'bluetooth', 'mute', 'troubleshoot'],
    createdAt: '2026-08-06 08:30',
    updatedAt: '2026-08-07 22:15',
  },
];

/* ── 🌟 DEFAULT SUPPORT TICKETS ── */
export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TICKET-9402',
    userId: '100821',
    userName: 'Sara_Vip7',
    userVipBadge: 'VIP 7',
    subject: 'Diamond Recharge Assistance & Bonus XP',
    category: 'Wallet & Recharge',
    status: 'IN_PROGRESS',
    priority: 'VIP_URGENT',
    messages: [
      {
        id: 'MSG-1',
        ticketId: 'TICKET-9402',
        senderId: '100821',
        senderName: 'Sara_Vip7',
        senderRole: 'USER',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
        content: 'Hi support team! I purchased 50,000 Diamonds earlier via JazzCash, and received them instantly. Just wanted to confirm if the weekend double CP promotion applies to this transaction?',
        createdAt: '2026-08-08 05:40',
      },
      {
        id: 'MSG-2',
        ticketId: 'TICKET-9402',
        senderId: 'SUPPORT-AGENT-01',
        senderName: 'Elena (Senior VIP Concierge)',
        senderRole: 'SUPPORT_AGENT',
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&auto=format',
        content: 'Hello Sara! Welcome to 24/7 VIP Concierge. Yes, absolutely! Your account has been credited with +10,000 Bonus Intimacy Points and your VIP 7 weekly multiplier is active. Please let us know if we can assist you with anything else!',
        createdAt: '2026-08-08 05:45',
      },
    ],
    createdAt: '2026-08-08 05:40',
    updatedAt: '2026-08-08 05:45',
  },
];

/* ── 🚀 HELP & FAQ CMS CLASS ── */
class HelpAndFaqService {
  private categories: FaqCategory[] = [...INITIAL_FAQ_CATEGORIES];
  private articles: FaqArticle[] = [...INITIAL_FAQ_ARTICLES];
  private feedbacks: FaqFeedbackRecord[] = [];
  private searchLogs: FaqSearchLog[] = [];
  private tickets: SupportTicket[] = [...INITIAL_SUPPORT_TICKETS];
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
          if (event.data?.type === 'HELP_FAQ_SYNC') {
            this.load();
            this.notify(false);
          }
        };
      } catch (e) {
        console.warn('Help & FAQ BroadcastChannel init failed', e);
      }
    }
  }

  private notify(broadcast: boolean = true) {
    this.save();
    if (broadcast && this.channel) {
      try {
        this.channel.postMessage({ type: 'HELP_FAQ_SYNC', timestamp: Date.now() });
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
          if (parsed.categories) this.categories = parsed.categories;
          if (parsed.articles) this.articles = parsed.articles;
          if (parsed.feedbacks) this.feedbacks = parsed.feedbacks;
          if (parsed.searchLogs) this.searchLogs = parsed.searchLogs;
          if (parsed.tickets) this.tickets = parsed.tickets;
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load help & FAQ database', e);
    }
    this.categories = [...INITIAL_FAQ_CATEGORIES];
    this.articles = [...INITIAL_FAQ_ARTICLES];
    this.tickets = [...INITIAL_SUPPORT_TICKETS];
    this.save();
  }

  private save() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const payload = {
          categories: this.categories,
          articles: this.articles,
          feedbacks: this.feedbacks,
          searchLogs: this.searchLogs,
          tickets: this.tickets,
          lastUpdated: new Date().toISOString(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Failed to save help & FAQ database', e);
    }
  }

  /* ── 1. PUBLIC QUERIES ── */
  public getCategories(): FaqCategory[] {
    return this.categories.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public getPublishedArticles(categoryId?: string): FaqArticle[] {
    return this.articles
      .filter(a => a.isPublished && (!categoryId || a.categoryId === categoryId))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public getArticleById(id: string): FaqArticle | undefined {
    const article = this.articles.find(a => a.id === id);
    if (article) {
      article.viewCount += 1;
      this.notify(true);
    }
    return article;
  }

  /* ── 2. REAL-TIME SEARCH WITH KEYWORDS & LOGGING ── */
  public searchArticles(query: string): FaqArticle[] {
    if (!query.trim()) {
      return this.getPublishedArticles();
    }
    const q = query.toLowerCase().trim();
    const results = this.articles.filter(a => {
      if (!a.isPublished) return false;
      const inTitle = a.title.toLowerCase().includes(q);
      const inShort = a.shortDescription.toLowerCase().includes(q);
      const inContent = a.content.some(c => c.toLowerCase().includes(q));
      const inKeywords = a.keywords.some(k => k.toLowerCase().includes(q));
      return inTitle || inShort || inContent || inKeywords;
    });

    // Log query
    this.searchLogs.unshift({
      id: `LOG-${Date.now()}`,
      query,
      resultsCount: results.length,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    });
    this.save();

    return results;
  }

  /* ── 3. HELPFULNESS FEEDBACK WITH ABUSE PREVENTER ── */
  public voteHelpful(articleId: string, isHelpful: boolean, userId: string = '100821'): { success: boolean; message: string } {
    const existing = this.feedbacks.find(f => f.articleId === articleId && f.userId === userId);
    if (existing) {
      return { success: false, message: 'You have already submitted feedback for this article.' };
    }

    const article = this.articles.find(a => a.id === articleId);
    if (!article) {
      return { success: false, message: 'Article not found.' };
    }

    if (isHelpful) {
      article.helpfulCount += 1;
    } else {
      article.notHelpfulCount += 1;
    }

    this.feedbacks.push({
      id: `FB-${Date.now()}`,
      articleId,
      userId,
      isHelpful,
      timestamp: new Date().toISOString(),
    });

    this.notify(true);
    return { success: true, message: 'Thanks for your feedback!' };
  }

  /* ── 4. 24/7 VIP SUPPORT TICKET SYSTEM ── */
  public getOrCreateUserTicket(userId: string = '100821', userName: string = 'Sara_Vip7'): SupportTicket {
    let openTicket = this.tickets.find(t => t.userId === userId && t.status !== 'CLOSED');
    if (!openTicket) {
      openTicket = {
        id: `TICKET-${Math.floor(1000 + Math.random() * 9000)}`,
        userId,
        userName,
        userVipBadge: 'VIP 7',
        subject: 'General 24/7 VIP Concierge Inquiry',
        category: 'General Support',
        status: 'OPEN',
        priority: 'VIP_URGENT',
        messages: [
          {
            id: `MSG-${Date.now()}`,
            ticketId: `TICKET-${Date.now()}`,
            senderId: 'SYSTEM',
            senderName: 'Aura Concierge Bot',
            senderRole: 'SYSTEM',
            content: 'Welcome to Aura Live 24/7 VIP Support Desk! A live support concierge will be with you in under 60 seconds.',
            createdAt: 'Just now',
          },
        ],
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      this.tickets.unshift(openTicket);
      this.notify(true);
    }
    return openTicket;
  }

  public sendUserSupportMessage(ticketId: string, content: string, userId: string = '100821', userName: string = 'Sara_Vip7'): SupportTicketMessage | null {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) return null;

    const newMsg: SupportTicketMessage = {
      id: `MSG-${Date.now()}`,
      ticketId,
      senderId: userId,
      senderName: userName,
      senderRole: 'USER',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
      content: content.trim(),
      createdAt: 'Just now',
    };

    ticket.messages.push(newMsg);
    ticket.status = 'IN_PROGRESS';
    ticket.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Auto simulated support response after 2 seconds for interactive real-time demo
    setTimeout(() => {
      this.sendAgentSupportReply(ticketId, `Thank you for your message regarding "${content.slice(0, 30)}...". Our senior concierge has logged this with reference ID ${ticket.id}.`);
    }, 1800);

    this.notify(true);
    return newMsg;
  }

  public sendAgentSupportReply(ticketId: string, content: string): SupportTicketMessage | null {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (!ticket) return null;

    const newMsg: SupportTicketMessage = {
      id: `MSG-${Date.now()}`,
      ticketId,
      senderId: 'SUPPORT-AGENT-01',
      senderName: 'Elena (VIP Concierge)',
      senderRole: 'SUPPORT_AGENT',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&auto=format',
      content: content.trim(),
      createdAt: 'Just now',
    };

    ticket.messages.push(newMsg);
    ticket.status = 'WAITING_FOR_USER';
    ticket.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    this.notify(true);
    return newMsg;
  }

  public resolveTicket(ticketId: string): void {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'RESOLVED';
      ticket.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
      this.notify(true);
    }
  }

  /* ── 5. ADMIN FAQ CMS MANAGEMENT ── */
  public getAllAdminArticles(): FaqArticle[] {
    return [...this.articles].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public getAllAdminTickets(): SupportTicket[] {
    return [...this.tickets];
  }

  public getSearchLogs(): FaqSearchLog[] {
    return [...this.searchLogs];
  }

  public createArticle(article: Omit<FaqArticle, 'id' | 'viewCount' | 'helpfulCount' | 'notHelpfulCount' | 'createdAt' | 'updatedAt'>): FaqArticle {
    const newArt: FaqArticle = {
      ...article,
      id: `FAQ-${Date.now()}`,
      viewCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    this.articles.unshift(newArt);
    this.notify(true);
    return newArt;
  }

  public updateArticle(id: string, partial: Partial<FaqArticle>): FaqArticle | null {
    const art = this.articles.find(a => a.id === id);
    if (!art) return null;
    Object.assign(art, partial, { updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) });
    this.notify(true);
    return art;
  }

  public togglePublish(id: string): boolean {
    const art = this.articles.find(a => a.id === id);
    if (art) {
      art.isPublished = !art.isPublished;
      this.notify(true);
      return art.isPublished;
    }
    return false;
  }

  public deleteArticle(id: string): void {
    this.articles = this.articles.filter(a => a.id !== id);
    this.notify(true);
  }

  /* ── 6. REACTIVE SUBSCRIPTION ── */
  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const helpAndFaqEngine = new HelpAndFaqService();
