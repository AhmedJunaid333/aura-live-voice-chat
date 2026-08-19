import { z } from 'zod';

export const registerSchema = z.object({
  username: z.preprocess((val) => (val == null ? '' : String(val).trim()), z.string().min(1, 'Username is required').max(100)),
  displayName: z.preprocess((val) => (val == null || String(val).trim() === '' ? undefined : String(val).trim()), z.string().max(100).optional()),
  email: z.preprocess((val) => (val == null || String(val).trim() === '' ? undefined : String(val).trim()), z.string().email('Invalid email address').optional()),
  phone: z.preprocess((val) => (val == null || String(val).trim() === '' ? undefined : String(val).trim()), z.string().max(50).optional()),
  password: z.preprocess((val) => (val == null ? '' : String(val)), z.string().min(1, 'Password is required').max(100)),
  gender: z.preprocess((val) => (val == null || String(val).trim() === '' ? 'Male' : String(val).trim()), z.string().optional()),
  country: z.preprocess((val) => (val == null || String(val).trim() === '' ? 'Pakistan' : String(val).trim()), z.string().optional()),
  birthday: z.any().optional().nullable(),
  dob: z.any().optional().nullable(),
  avatar: z.any().optional().nullable(),
  referralCode: z.any().optional().nullable(),
});

export const loginSchema = z.object({
  username: z.preprocess((val) => (val == null || String(val).trim() === '' ? undefined : String(val).trim()), z.string().optional()),
  identifier: z.preprocess((val) => (val == null || String(val).trim() === '' ? undefined : String(val).trim()), z.string().optional()),
  password: z.preprocess((val) => (val == null ? '' : String(val)), z.string().min(1, 'Password is required')),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const profileUpdateSchema = z.object({
  username: z.string().min(1).max(50).optional(),
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(300).optional(),
  gender: z.string().optional(),
  birthday: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  avatar: z.string().optional(),
  cover: z.string().optional(),
});

export const sendResellerInvitationSchema = z.object({
  targetUserId: z.number().int().positive(),
  type: z.enum(['HOSTING', 'AGENCY', 'BD', 'RESELLER']).default('RESELLER'),
  message: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  expiryDays: z.number().int().min(1).max(30).default(7),
});

export const submitResellerApplicationSchema = z.object({
  invitationCode: z.string().min(1),
  applicantName: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  businessNotes: z.string().optional(),
});

export const allocateCompanyDiamondsSchema = z.object({
  resellerUserId: z.number().int().positive(),
  amount: z.number().int().positive(),
  notes: z.string().optional(),
});

export const transferDiamondsSchema = z.object({
  targetUserId: z.number().int().positive(),
  amount: z.number().int().positive(),
  notes: z.string().optional(),
});

export const createLiveRoomSchema = z.object({
  title: z.string().min(2).max(100),
  category: z.string().default('Music'),
  seatCount: z.number().int().min(5).max(25).default(10),
});
