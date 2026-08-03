// Aura Live Voice Room - Shared Types & DTO Contracts

// ============================================================================
// AUTH DTOs
// ============================================================================

export interface RegisterRequestDto {
  userTag: string;
  nickname: string;
  email?: string;
  phone?: string;
  password?: string;
  avatarUrl?: string;
}

export interface LoginRequestDto {
  target: string; // email, phone, or userTag
  password?: string;
  otpCode?: string;
  deviceId?: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserProfileDto;
}

export interface SendOtpDto {
  target: string;
  type: 'REGISTER' | 'LOGIN' | 'PASSWORD_RESET' | 'PHONE_VERIFY';
}

export interface GoogleAuthRequestDto {
  idToken: string;
  email?: string;
  displayName?: string;
  photoUrl?: string;
  googleId?: string;
  deviceId?: string;
}

export interface LinkGoogleRequestDto {
  userId: string;
  googleId: string;
  email: string;
  idToken: string;
}

// ============================================================================
// USER DTOs
// ============================================================================

export interface UserProfileDto {
  id: string;
  userTag: string;
  nickname: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  gender: string;
  level: number;
  vipTier: number;
  isVerifiedHost: boolean;
  status: string;
  createdAt: string;
}

// ============================================================================
// LIVE ROOM DTOs
// ============================================================================

export interface CreateLiveRoomDto {
  title: string;
  description?: string;
  coverUrl?: string;
  category?: string;
  isPrivate?: boolean;
  password?: string;
  maxSeats?: number;
}

export interface LiveRoomDto {
  id: string;
  roomNumber: string;
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  hostId: string;
  hostNickname: string;
  hostAvatarUrl?: string | null;
  category: string;
  isPrivate: boolean;
  status: 'IDLE' | 'LIVE' | 'ENDED';
  maxSeats: number;
  rtcChannelId: string;
  totalViewers: number;
  peakViewers: number;
  startedAt?: string | null;
}

export interface JoinRoomRequestDto {
  roomId: string;
  password?: string;
}

export interface JoinRoomResponseDto {
  room: LiveRoomDto;
  rtcToken: string;
  userRole: 'HOST' | 'CO_HOST' | 'MODERATOR' | 'SPEAKER' | 'LISTENER';
  seats: SpeakerSeatDto[];
}

// ============================================================================
// SPEAKER SEAT DTOs
// ============================================================================

export interface SpeakerSeatDto {
  id: string;
  seatIndex: number;
  userId?: string | null;
  userNickname?: string | null;
  userAvatarUrl?: string | null;
  status: 'EMPTY' | 'OCCUPIED' | 'LOCKED' | 'RESERVED';
  isLocked: boolean;
  isMuted: boolean;
}

export interface SeatRequestDto {
  roomId: string;
  targetSeatIndex?: number;
}

export interface ApproveSeatDto {
  roomId: string;
  requestId: string;
  userId: string;
  seatIndex: number;
  approve: boolean;
}

// ============================================================================
// GIFT & VIRTUAL ECONOMY DTOs
// ============================================================================

export interface SendGiftDto {
  roomId: string;
  receiverId: string;
  giftId: string;
  giftCount: number;
}

export interface GiftDto {
  id: string;
  name: string;
  iconUrl: string;
  animationUrl?: string | null;
  coinPrice: number;
  category: string;
  isVipOnly: boolean;
}

export interface WalletDto {
  userId: string;
  coinBalance: number;
  diamondBalance: number;
  totalSpentCoins: number;
  totalEarnedDiamonds: number;
}

export interface RechargeWalletDto {
  packageId: string;
  paymentMethod: string;
  transactionToken: string;
}

// ============================================================================
// WEBSOCKET REAL-TIME EVENTS CONTRACT
// ============================================================================

export enum WsEventType {
  // Connection
  JOIN_ROOM = 'JOIN_ROOM',
  LEAVE_ROOM = 'LEAVE_ROOM',
  USER_JOINED = 'USER_JOINED',
  USER_LEFT = 'USER_LEFT',

  // Chat & Gifts
  ROOM_CHAT = 'ROOM_CHAT',
  GIFT_SENT = 'GIFT_SENT',

  // Seats
  SEAT_UPDATE = 'SEAT_UPDATE',
  SEAT_REQUESTED = 'SEAT_REQUESTED',
  SEAT_APPROVED = 'SEAT_APPROVED',
  SEAT_MUTED = 'SEAT_MUTED',

  // Room Admin
  ROOM_CLOSED = 'ROOM_CLOSED',
  USER_KICKED = 'USER_KICKED'
}

export interface WsMessagePayload<T = unknown> {
  event: WsEventType;
  roomId: string;
  senderId?: string;
  timestamp: number;
  data: T;
}
