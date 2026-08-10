/* ═══════════════════════════════════════════════════════════════════ */
/* ── AURA LIVE VOICE CHAT — REAL-TIME CHAT & MESSAGING ENGINE ────── */
/* ═══════════════════════════════════════════════════════════════════ */

export type MessageType = 
  | 'TEXT' 
  | 'EMOJI' 
  | 'IMAGE' 
  | 'GIF' 
  | 'VOICE' 
  | 'SYSTEM' 
  | 'GIFT' 
  | 'SHARED_PROFILE' 
  | 'SHARED_ROOM' 
  | 'SHARED_MOMENT';

export type MessageDeliveryStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

export interface ChatUser {
  id: string; // numeric UID e.g. '100821'
  name: string;
  avatar: string;
  gender: 'male' | 'female';
  badge?: 'Noble' | 'SVIP' | 'VIP' | 'MOD' | 'ADMIN' | null;
  badgeColor?: string;
  goldBorder?: boolean;
  status: 'ONLINE' | 'OFFLINE' | 'AWAY';
  lastSeen: string;
  country: string;
}

export interface ChatAttachment {
  id: string;
  type: 'IMAGE' | 'VOICE' | 'GIFT' | 'ROOM' | 'PROFILE';
  url?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  giftId?: string;
  giftName?: string;
  giftIcon?: string;
  giftCoins?: number;
  roomId?: string;
  roomTitle?: string;
  profileUid?: string;
  profileName?: string;
}

export interface ChatMessage {
  id: string; // e.g. MSG-1723081001-9821
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  content: string;
  type: MessageType;
  attachment?: ChatAttachment;
  status: MessageDeliveryStatus;
  replyToMessageId?: string;
  replySnippet?: {
    id: string;
    senderName: string;
    content: string;
  };
  reactions: Record<string, string[]>; // emoji -> list of userIds
  deletedFor: string[]; // list of userIds who deleted for themselves
  deletedForEveryone?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatConversation {
  id: string; // e.g. CONV-100821-100850
  type: 'DIRECT' | 'GROUP';
  memberIds: string[];
  members: ChatUser[];
  lastMessageId?: string;
  lastMessageText: string;
  lastMessageTime: string;
  lastMessageType: MessageType;
  lastSenderId?: string;
  unreadCounts: Record<string, number>; // userId -> unread count
  pinned?: boolean;
  muted?: boolean;
  isTyping?: Record<string, boolean>; // userId -> is typing
  createdAt: string;
  updatedAt: string;
}

export interface MessageReport {
  id: string;
  messageId: string;
  conversationId: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  messageContent: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  timestamp: string;
  adminNotes?: string;
}

const STORAGE_KEY = 'AURALIVE_REALTIME_CHAT_DB_V2';

/* ── 🌟 DEFAULT INITIAL USERS (MATCHING EXACT SCREENSHOT) ── */
export const INITIAL_CHAT_USERS: ChatUser[] = [
  {
    id: '100821',
    name: 'Sara_Vip7',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    gender: 'female',
    badge: 'Noble',
    badgeColor: 'bg-[#D4AF37] text-white',
    goldBorder: true,
    status: 'ONLINE',
    lastSeen: 'Just now',
    country: 'Pakistan',
  },
  {
    id: '100850',
    name: 'MR √Lucky☆࿐',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    gender: 'male',
    badge: 'Noble',
    badgeColor: 'bg-[#D4AF37] text-white',
    goldBorder: true,
    status: 'ONLINE',
    lastSeen: 'Just now',
    country: 'Pakistan',
  },
  {
    id: '100888',
    name: 'Aura Princess 👑',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    gender: 'female',
    badge: 'Noble',
    badgeColor: 'bg-[#D4AF37] text-white',
    goldBorder: true,
    status: 'ONLINE',
    lastSeen: '2m ago',
    country: 'United Arab Emirates',
  },
  {
    id: '100720',
    name: 'Captain Alpha',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    gender: 'male',
    badge: 'SVIP',
    badgeColor: 'bg-slate-700 text-white',
    goldBorder: false,
    status: 'OFFLINE',
    lastSeen: 'Yesterday 11:30 PM',
    country: 'Saudi Arabia',
  },
  {
    id: '100615',
    name: 'Brother Mike',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop',
    gender: 'male',
    badge: null,
    goldBorder: false,
    status: 'OFFLINE',
    lastSeen: 'Yesterday',
    country: 'United States',
  },
  {
    id: '100344',
    name: 'Serene Soul',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop',
    gender: 'female',
    badge: null,
    goldBorder: false,
    status: 'AWAY',
    lastSeen: 'Tuesday',
    country: 'United Kingdom',
  },
  {
    id: '100998',
    name: 'King_Rana_VIP',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    gender: 'male',
    badge: 'Noble',
    badgeColor: 'bg-[#D4AF37] text-white',
    goldBorder: true,
    status: 'ONLINE',
    lastSeen: 'Just now',
    country: 'Pakistan',
  },
];

/* ── INITIAL CONVERSATIONS ── */
export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'CONV-100821-100850',
    type: 'DIRECT',
    memberIds: ['100821', '100850'],
    members: [INITIAL_CHAT_USERS[0], INITIAL_CHAT_USERS[1]],
    lastMessageId: 'MSG-001-LUCKY',
    lastMessageText: 'See you in the room later! 🚀',
    lastMessageTime: '10:45 AM',
    lastMessageType: 'TEXT',
    lastSenderId: '100850',
    unreadCounts: { '100821': 2, '100850': 0 },
    pinned: true,
    createdAt: '2026-08-08 08:00',
    updatedAt: '2026-08-08 10:45',
  },
  {
    id: 'CONV-100821-100888',
    type: 'DIRECT',
    memberIds: ['100821', '100888'],
    members: [INITIAL_CHAT_USERS[0], INITIAL_CHAT_USERS[2]],
    lastMessageId: 'MSG-002-PRINCESS',
    lastMessageText: 'Did you check the new rewards section?',
    lastMessageTime: '09:12 AM',
    lastMessageType: 'TEXT',
    lastSenderId: '100888',
    unreadCounts: { '100821': 0, '100888': 0 },
    createdAt: '2026-08-08 07:30',
    updatedAt: '2026-08-08 09:12',
  },
  {
    id: 'CONV-100821-100720',
    type: 'DIRECT',
    memberIds: ['100821', '100720'],
    members: [INITIAL_CHAT_USERS[0], INITIAL_CHAT_USERS[3]],
    lastMessageId: 'MSG-003-ALPHA',
    lastMessageText: 'The family battle starts in 10 mins.',
    lastMessageTime: 'Yesterday',
    lastMessageType: 'TEXT',
    lastSenderId: '100720',
    unreadCounts: { '100821': 0, '100720': 0 },
    createdAt: '2026-08-07 15:00',
    updatedAt: '2026-08-07 20:30',
  },
  {
    id: 'CONV-100821-100615',
    type: 'DIRECT',
    memberIds: ['100821', '100615'],
    members: [INITIAL_CHAT_USERS[0], INITIAL_CHAT_USERS[4]],
    lastMessageId: 'MSG-004-MIKE',
    lastMessageText: 'Shared a Moment with you.',
    lastMessageTime: 'Yesterday',
    lastMessageType: 'SHARED_MOMENT',
    lastSenderId: '100615',
    unreadCounts: { '100821': 0, '100615': 0 },
    createdAt: '2026-08-07 10:00',
    updatedAt: '2026-08-07 14:15',
  },
  {
    id: 'CONV-100821-100344',
    type: 'DIRECT',
    memberIds: ['100821', '100344'],
    members: [INITIAL_CHAT_USERS[0], INITIAL_CHAT_USERS[5]],
    lastMessageId: 'MSG-005-SERENE',
    lastMessageText: 'Thanks for the support!',
    lastMessageTime: 'Tuesday',
    lastMessageType: 'TEXT',
    lastSenderId: '100344',
    unreadCounts: { '100821': 0, '100344': 0 },
    createdAt: '2026-08-05 11:00',
    updatedAt: '2026-08-05 18:20',
  },
];

/* ── INITIAL MESSAGES ── */
export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'MSG-001-LUCKY-PREV',
    conversationId: 'CONV-100821-100850',
    senderId: '100821',
    senderName: 'Sara_Vip7',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    receiverId: '100850',
    content: 'Are you ready for the PK tournament tonight?',
    type: 'TEXT',
    status: 'READ',
    reactions: { '🔥': ['100850'] },
    deletedFor: [],
    createdAt: '2026-08-08 10:40',
    updatedAt: '2026-08-08 10:41',
  },
  {
    id: 'MSG-001-LUCKY-GIFT',
    conversationId: 'CONV-100821-100850',
    senderId: '100850',
    senderName: 'MR √Lucky☆࿐',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    receiverId: '100821',
    content: 'Sent you a Luxury Supercar! 🏎️',
    type: 'GIFT',
    attachment: {
      id: 'ATT-GIFT-01',
      type: 'GIFT',
      giftId: 'SUPERCAR_99',
      giftName: 'Golden Supercar',
      giftIcon: '🏎️',
      giftCoins: 5000,
    },
    status: 'DELIVERED',
    reactions: { '❤️': ['100821'] },
    deletedFor: [],
    createdAt: '2026-08-08 10:44',
    updatedAt: '2026-08-08 10:44',
  },
  {
    id: 'MSG-001-LUCKY',
    conversationId: 'CONV-100821-100850',
    senderId: '100850',
    senderName: 'MR √Lucky☆࿐',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    receiverId: '100821',
    content: 'See you in the room later! 🚀',
    type: 'TEXT',
    status: 'DELIVERED',
    reactions: {},
    deletedFor: [],
    createdAt: '2026-08-08 10:45',
    updatedAt: '2026-08-08 10:45',
  },
  {
    id: 'MSG-002-PRINCESS',
    conversationId: 'CONV-100821-100888',
    senderId: '100888',
    senderName: 'Aura Princess 👑',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    receiverId: '100821',
    content: 'Did you check the new rewards section?',
    type: 'TEXT',
    status: 'READ',
    reactions: {},
    deletedFor: [],
    createdAt: '2026-08-08 09:12',
    updatedAt: '2026-08-08 09:12',
  },
  {
    id: 'MSG-003-ALPHA',
    conversationId: 'CONV-100821-100720',
    senderId: '100720',
    senderName: 'Captain Alpha',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    receiverId: '100821',
    content: 'The family battle starts in 10 mins.',
    type: 'TEXT',
    status: 'READ',
    reactions: { '⚔️': ['100821'] },
    deletedFor: [],
    createdAt: '2026-08-07 20:30',
    updatedAt: '2026-08-07 20:30',
  },
  {
    id: 'MSG-004-MIKE',
    conversationId: 'CONV-100821-100615',
    senderId: '100615',
    senderName: 'Brother Mike',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop',
    receiverId: '100821',
    content: 'Shared a Moment with you.',
    type: 'SHARED_MOMENT',
    attachment: {
      id: 'ATT-MOMENT-01',
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
    },
    status: 'READ',
    reactions: {},
    deletedFor: [],
    createdAt: '2026-08-07 14:15',
    updatedAt: '2026-08-07 14:15',
  },
  {
    id: 'MSG-005-SERENE',
    conversationId: 'CONV-100821-100344',
    senderId: '100344',
    senderName: 'Serene Soul',
    senderAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop',
    receiverId: '100821',
    content: 'Thanks for the support!',
    type: 'TEXT',
    status: 'READ',
    reactions: { '🙏': ['100821'] },
    deletedFor: [],
    createdAt: '2026-08-05 18:20',
    updatedAt: '2026-08-05 18:20',
  },
];

/* ── 🚀 REAL-TIME ENGINE SERVICE SINGLETON ── */
class RealtimeChatEngineService {
  private users: ChatUser[] = [];
  private conversations: ChatConversation[] = [];
  private messages: ChatMessage[] = [];
  private blockedUserIds: Set<string> = new Set();
  private reports: MessageReport[] = [];
  private currentUserId: string = '100821'; // Default logged-in user
  private listeners: Set<() => void> = new Set();
  private broadcastChannel?: BroadcastChannel;
  private typingTimeouts: Map<string, any> = new Map();

  constructor() {
    this.load();
    this.initBroadcast();
  }

  private initBroadcast() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('AURALIVE_REALTIME_CHAT_CHANNEL');
        this.broadcastChannel.onmessage = (event) => {
          if (event?.data?.type === 'CHAT_SYNC') {
            this.load();
            this.notify();
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported', e);
      }
    }
  }

  private notify() {
    this.listeners.forEach(fn => {
      try { fn(); } catch (e) { console.error(e); }
    });
  }

  private emitSync() {
    this.save();
    this.notify();
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'CHAT_SYNC', timestamp: Date.now() });
      } catch (e) {}
    }
  }

  private load() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.users = parsed.users || INITIAL_CHAT_USERS;
          this.conversations = parsed.conversations || INITIAL_CONVERSATIONS;
          this.messages = parsed.messages || INITIAL_MESSAGES;
          this.blockedUserIds = new Set(parsed.blockedUserIds || []);
          this.reports = parsed.reports || [];
          this.currentUserId = parsed.currentUserId || '100821';
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load chat DB', e);
    }
    this.users = INITIAL_CHAT_USERS;
    this.conversations = INITIAL_CONVERSATIONS;
    this.messages = INITIAL_MESSAGES;
    this.blockedUserIds = new Set();
    this.reports = [];
    this.currentUserId = '100821';
    this.save();
  }

  private save() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const payload = {
          users: this.users,
          conversations: this.conversations,
          messages: this.messages,
          blockedUserIds: Array.from(this.blockedUserIds),
          reports: this.reports,
          currentUserId: this.currentUserId,
          lastUpdated: new Date().toISOString(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Failed to save chat DB', e);
    }
  }

  /* ── USER SESSION & PRESENCE ── */
  public getCurrentUser(): ChatUser {
    return this.users.find(u => u.id === this.currentUserId) || this.users[0];
  }

  public setCurrentUser(userId: string): void {
    if (this.users.some(u => u.id === userId)) {
      this.currentUserId = userId;
      this.emitSync();
    }
  }

  public getUsers(): ChatUser[] {
    return [...this.users];
  }

  public getUserById(id: string): ChatUser | undefined {
    return this.users.find(u => u.id === id);
  }

  public updateUserPresence(userId: string, status: 'ONLINE' | 'OFFLINE' | 'AWAY'): void {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.users = this.users.map(u => u.id === userId ? { ...u, status, lastSeen: status === 'ONLINE' ? 'Just now' : now } : u);
    this.emitSync();
  }

  /* ── CONVERSATIONS CRUD & REAL-TIME OBSERVERS ── */
  public getConversations(userId: string = this.currentUserId): ChatConversation[] {
    return this.conversations
      .filter(c => c.memberIds.includes(userId))
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }

  public getConversationById(id: string): ChatConversation | undefined {
    return this.conversations.find(c => c.id === id);
  }

  public getOrCreateDirectConversation(userAId: string, userBId: string): ChatConversation {
    const sortedIds = [userAId, userBId].sort();
    const convId = `CONV-${sortedIds[0]}-${sortedIds[1]}`;
    let existing = this.conversations.find(c => c.id === convId);

    if (!existing) {
      const userA = this.getUserById(userAId) || this.users[0];
      const userB = this.getUserById(userBId) || this.users[1];
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

      existing = {
        id: convId,
        type: 'DIRECT',
        memberIds: [userAId, userBId],
        members: [userA, userB],
        lastMessageText: 'Conversation started',
        lastMessageTime: 'Just now',
        lastMessageType: 'SYSTEM',
        unreadCounts: { [userAId]: 0, [userBId]: 0 },
        createdAt: now,
        updatedAt: now,
      };

      this.conversations.unshift(existing);
      this.emitSync();
    }

    return existing;
  }

  public getUnreadCount(userId: string = this.currentUserId): number {
    return this.conversations
      .filter(c => c.memberIds.includes(userId))
      .reduce((sum, c) => sum + (c.unreadCounts[userId] || 0), 0);
  }

  public markConversationAsRead(conversationId: string, userId: string = this.currentUserId): void {
    let changed = false;
    this.conversations = this.conversations.map(c => {
      if (c.id === conversationId && (c.unreadCounts[userId] || 0) > 0) {
        changed = true;
        return {
          ...c,
          unreadCounts: { ...c.unreadCounts, [userId]: 0 },
        };
      }
      return c;
    });

    // Mark all inbound messages as READ
    this.messages = this.messages.map(m => {
      if (m.conversationId === conversationId && m.receiverId === userId && m.status !== 'READ') {
        changed = true;
        return { ...m, status: 'READ', updatedAt: new Date().toISOString() };
      }
      return m;
    });

    if (changed) {
      this.emitSync();
    }
  }

  /* ── MESSAGES CRUD & REAL-TIME TRANSMISSION ── */
  public getMessages(conversationId: string, currentUserId: string = this.currentUserId): ChatMessage[] {
    return this.messages
      .filter(m => m.conversationId === conversationId && !m.deletedFor.includes(currentUserId) && !m.deletedForEveryone)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public sendMessage(payload: {
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    type?: MessageType;
    attachment?: ChatAttachment;
    replyToMessageId?: string;
  }): ChatMessage {
    const sender = this.getUserById(payload.senderId) || this.getCurrentUser();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowIso = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const msgId = `MSG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let replySnippet;
    if (payload.replyToMessageId) {
      const parent = this.messages.find(m => m.id === payload.replyToMessageId);
      if (parent) {
        replySnippet = {
          id: parent.id,
          senderName: parent.senderName,
          content: parent.content,
        };
      }
    }

    const newMsg: ChatMessage = {
      id: msgId,
      conversationId: payload.conversationId,
      senderId: payload.senderId,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      receiverId: payload.receiverId,
      content: payload.content,
      type: payload.type || 'TEXT',
      attachment: payload.attachment,
      status: 'SENT',
      replyToMessageId: payload.replyToMessageId,
      replySnippet,
      reactions: {},
      deletedFor: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    this.messages.push(newMsg);

    // Update conversation metadata & increment receiver unread count
    this.conversations = this.conversations.map(c => {
      if (c.id === payload.conversationId) {
        const curUnread = c.unreadCounts[payload.receiverId] || 0;
        return {
          ...c,
          lastMessageId: msgId,
          lastMessageText: payload.content || (payload.type === 'VOICE' ? '🎙️ Voice note' : 'Sent an attachment'),
          lastMessageTime: nowTime,
          lastMessageType: payload.type || 'TEXT',
          lastSenderId: payload.senderId,
          unreadCounts: {
            ...c.unreadCounts,
            [payload.receiverId]: curUnread + 1,
          },
          updatedAt: nowIso,
        };
      }
      return c;
    });

    // Simulate real-time network progression to DELIVERED
    setTimeout(() => {
      this.messages = this.messages.map(m => m.id === msgId && m.status === 'SENT' ? { ...m, status: 'DELIVERED' } : m);
      this.emitSync();
    }, 400);

    this.emitSync();
    return newMsg;
  }

  public retryMessage(messageId: string): void {
    this.messages = this.messages.map(m => {
      if (m.id === messageId && m.status === 'FAILED') {
        return { ...m, status: 'SENT', updatedAt: new Date().toISOString() };
      }
      return m;
    });
    this.emitSync();
  }

  /* ── MESSAGE ACTIONS (DELETE, REACT, REPORT) ── */
  public deleteMessageForMe(messageId: string, userId: string = this.currentUserId): void {
    this.messages = this.messages.map(m => {
      if (m.id === messageId) {
        const deletedFor = Array.from(new Set([...m.deletedFor, userId]));
        return { ...m, deletedFor };
      }
      return m;
    });
    this.emitSync();
  }

  public deleteMessageForEveryone(messageId: string): void {
    this.messages = this.messages.map(m => {
      if (m.id === messageId) {
        return {
          ...m,
          deletedForEveryone: true,
          content: 'This message was deleted.',
          type: 'SYSTEM',
        };
      }
      return m;
    });
    this.emitSync();
  }

  public toggleReaction(messageId: string, emoji: string, userId: string = this.currentUserId): void {
    this.messages = this.messages.map(m => {
      if (m.id === messageId) {
        const existing = m.reactions[emoji] || [];
        const updatedList = existing.includes(userId)
          ? existing.filter(u => u !== userId)
          : [...existing, userId];
        
        const newReactions = { ...m.reactions };
        if (updatedList.length === 0) {
          delete newReactions[emoji];
        } else {
          newReactions[emoji] = updatedList;
        }
        return { ...m, reactions: newReactions };
      }
      return m;
    });
    this.emitSync();
  }

  public reportMessage(payload: {
    messageId: string;
    conversationId: string;
    reporterId: string;
    reason: string;
  }): MessageReport {
    const reporter = this.getUserById(payload.reporterId) || this.getCurrentUser();
    const msg = this.messages.find(m => m.id === payload.messageId);
    const reportId = `REP-${Date.now()}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const report: MessageReport = {
      id: reportId,
      messageId: payload.messageId,
      conversationId: payload.conversationId,
      reporterId: payload.reporterId,
      reporterName: reporter.name,
      reportedUserId: msg?.senderId || 'UNKNOWN',
      reportedUserName: msg?.senderName || 'Unknown User',
      messageContent: msg?.content || '',
      reason: payload.reason,
      status: 'PENDING',
      timestamp: now,
    };

    this.reports.unshift(report);
    this.emitSync();
    return report;
  }

  public getReports(): MessageReport[] {
    return [...this.reports];
  }

  public resolveReport(reportId: string, notes?: string): void {
    this.reports = this.reports.map(r => r.id === reportId ? { ...r, status: 'RESOLVED', adminNotes: notes } : r);
    this.emitSync();
  }

  public dismissReport(reportId: string): void {
    this.reports = this.reports.map(r => r.id === reportId ? { ...r, status: 'DISMISSED' } : r);
    this.emitSync();
  }

  /* ── BLOCK & PRIVACY ── */
  public toggleBlockUser(targetUserId: string): boolean {
    const isBlocked = this.blockedUserIds.has(targetUserId);
    if (isBlocked) {
      this.blockedUserIds.delete(targetUserId);
    } else {
      this.blockedUserIds.add(targetUserId);
    }
    this.emitSync();
    return !isBlocked;
  }

  public isUserBlocked(targetUserId: string): boolean {
    return this.blockedUserIds.has(targetUserId);
  }

  /* ── REAL-TIME TYPING INDICATOR ── */
  public setTyping(conversationId: string, userId: string, isTyping: boolean): void {
    this.conversations = this.conversations.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          isTyping: {
            ...c.isTyping,
            [userId]: isTyping,
          },
        };
      }
      return c;
    });

    const timeoutKey = `${conversationId}-${userId}`;
    if (this.typingTimeouts.has(timeoutKey)) {
      clearTimeout(this.typingTimeouts.get(timeoutKey));
      this.typingTimeouts.delete(timeoutKey);
    }

    if (isTyping) {
      const timeout = setTimeout(() => {
        this.setTyping(conversationId, userId, false);
      }, 3000);
      this.typingTimeouts.set(timeoutKey, timeout);
    }

    this.emitSync();
  }

  /* ── SUBSCRIPTION ── */
  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const chatEngine = new RealtimeChatEngineService();
