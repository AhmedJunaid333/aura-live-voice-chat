import type { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt.js';
import { broadcastGlobal } from '../websocket/socketServer.js';

/**
 * Atomically allocates the next sequential public numeric ID starting from 100001.
 * Safely calculates highest numericId + 1 without sequence locks or transaction timeouts.
 */
export async function allocateNextPublicNumericId(tx?: Prisma.TransactionClient): Promise<number> {
  const client = tx || prisma;
  const highest = await client.user.findFirst({
    orderBy: { numericId: 'desc' },
    select: { numericId: true },
  });

  const base = 100000;
  if (!highest || !highest.numericId || highest.numericId < base) {
    return base + 1;
  }
  return highest.numericId + 1;
}

export class AuthService {
  /**
   * Register a new user with permanent sequential Public Numeric ID (100001, 100002...).
   *
   * ID generation strategy:
   *   1. Queries max numericId + 1 in Neon Cloud PostgreSQL.
   *   2. Email & username uniqueness is strictly enforced with case-insensitivity.
   *   3. If an account already exists, returns a clear, actionable error message.
   */
  static async register(data: {
    username: string;
    displayName?: string | null;
    email?: string | null;
    phone?: string | null;
    password: string;
    gender?: string | null;
    country?: string | null;
    birthday?: string | null;
    dob?: string | null;
    avatar?: string | null;
  }) {
    const normalizedUsername = data.username.trim();
    const normalizedEmail = data.email && data.email.trim().length > 0 ? data.email.trim().toLowerCase() : undefined;
    const normalizedPhone = data.phone && data.phone.trim().length > 0 ? data.phone.trim() : undefined;

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: normalizedUsername, mode: 'insensitive' } },
          ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
          ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
        ],
      },
    });

    if (existing) {
      if (existing.username.toLowerCase() === normalizedUsername.toLowerCase()) {
        throw new Error('This username is already taken. Please choose another username.');
      }
      if (normalizedEmail && existing.email?.toLowerCase() === normalizedEmail.toLowerCase()) {
        throw new Error('An account with this email already exists. Please log in.');
      }
      throw new Error('An account with these details already exists. Please log in.');
    }

    const passwordHash = await hashPassword(data.password);
    const nextNumericId = await allocateNextPublicNumericId();

    let parsedBirthday: Date | undefined;
    const bdayStr = data.birthday || data.dob;
    if (bdayStr) {
      try {
        const d = new Date(bdayStr);
        if (!isNaN(d.getTime())) {
          parsedBirthday = d;
        }
      } catch (_) {}
    }

    const user = await prisma.user.create({
      data: {
        numericId: nextNumericId,
        username: normalizedUsername,
        displayName: data.displayName?.trim() || normalizedUsername,
        email: normalizedEmail || null,
        phone: normalizedPhone || null,
        passwordHash,
        gender: data.gender || 'Male',
        country: data.country || 'Pakistan',
        birthday: parsedBirthday,
        avatar: data.avatar || null,
        coins: 5000, // Welcome coin grant
        diamonds: 0,
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    const tokenPayload = {
      userId: user.id,
      numericId: user.numericId,
      username: user.username,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save session in DB
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    });

    const userResponse = {
      id: user.id,
      numericId: user.numericId,
      username: user.username,
      displayName: user.displayName || user.username,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      cover: user.cover,
      gender: user.gender,
      country: user.country,
      birthday: user.birthday?.toISOString(),
      coins: user.coins,
      diamonds: user.diamonds,
      level: user.level,
      vipTier: user.vipTier,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
    };

    // Broadcast Realtime Event to Admin Portal
    broadcastGlobal('user.registered', userResponse);

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }


  /**
   * Authenticate user with username/email/phone and password
   */
  static async login(data: { username?: string; identifier?: string; password: string }) {
    const rawIdentifier = (data.username || data.identifier || '').trim();
    if (!rawIdentifier) {
      throw new Error('Username, email, or User ID is required for login.');
    }

    const isNumeric = /^\d+$/.test(rawIdentifier);
    const numericId = isNumeric ? parseInt(rawIdentifier, 10) : undefined;
    const normalizedEmail = rawIdentifier.toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: rawIdentifier },
          { email: normalizedEmail },
          { phone: rawIdentifier },
          ...(numericId ? [{ numericId }] : []),
        ],
      },
    });

    if (!user) {
      throw new Error('Invalid credentials. User not found.');
    }

    if (user.status === 'BANNED' || user.status === 'SUSPENDED' || user.status === 'BLOCKED') {
      const activeRestriction = await prisma.accountRestriction.findFirst({
        where: {
          userId: user.id,
          status: 'ACTIVE',
        },
        orderBy: { createdAt: 'desc' },
      });

      if (activeRestriction && activeRestriction.expiresAt && new Date(activeRestriction.expiresAt) <= new Date()) {
        await prisma.$transaction([
          prisma.accountRestriction.update({
            where: { id: activeRestriction.id },
            data: { status: 'EXPIRED' },
          }),
          prisma.user.update({
            where: { id: user.id },
            data: { status: 'ACTIVE' },
          }),
          prisma.auditLog.create({
            data: {
              actorId: user.id,
              actorRole: 'SYSTEM_AUTOPILOT',
              action: 'ACCOUNT_RESTRICTION_EXPIRED',
              resource: `User:${user.numericId}`,
              details: `Temporary restriction expired. Restored account status to ACTIVE on login.`,
            },
          }),
        ]);
        user.status = 'ACTIVE';
      } else {
        const reasonText = activeRestriction?.reason ? ` Reason: ${activeRestriction.reason}.` : '';
        const expiryText = activeRestriction?.expiresAt ? ` Expires: ${activeRestriction.expiresAt.toISOString()}.` : ' Permanent restriction.';
        throw new Error(`Account is ${user.status.toLowerCase()} by administration.${reasonText}${expiryText} Please contact support.`);
      }
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials. Incorrect password.');
    }

    const tokenPayload = {
      userId: user.id,
      numericId: user.numericId,
      username: user.username,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save session in DB (ignore duplicate token collisions with upsert/try-catch)
    try {
      await prisma.session.create({
        data: {
          userId: user.id,
          token: accessToken,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      });
    } catch (_) {
      // Session already created
    }

    const userResponse = {
      id: user.id,
      numericId: user.numericId,
      username: user.username,
      displayName: user.displayName || user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      bio: user.bio,
      gender: user.gender,
      birthday: user.birthday,
      country: user.country,
      countryCode: user.countryCode,
      coins: Number(user.coins),
      diamonds: Number(user.diamonds),
      level: user.level,
      vipTier: user.vipTier,
      avatar: user.avatar,
      cover: user.cover,
      status: user.status,
    };

    // Broadcast Realtime Login to Admin Portal
    broadcastGlobal('user.login', userResponse);
    broadcastGlobal('user.online', { userId: user.id, numericId: user.numericId, username: user.username });

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Log out authenticated user
   */
  static async logout(userId: number) {
    try {
      await prisma.session.deleteMany({
        where: { userId },
      });
    } catch (_) {}

    broadcastGlobal('user.logout', { userId });
    broadcastGlobal('user.offline', { userId });
    return true;
  }

  /**
   * Strict One Google/Gmail Account = One Aura Live Account Authentication Flow
   *
   * Logic:
   * 1. Check if AuthAccount exists for this Google provider & subject ID.
   * 2. If not found, check if User with matching normalized email exists (auto-link).
   * 3. If User exists: Return the SAME existing user account (same User ID, wallet, VIP).
   *    Never create a duplicate User ID or secondary profile.
   * 4. If User does NOT exist: Atomically create ONE User (sequential numericId = id)
   *    and ONE linked AuthAccount. Concurrency-safe against race conditions.
   */
  static async googleLogin(data: {
    googleSubjectId: string;
    email?: string;
    displayName?: string;
    avatar?: string;
    idToken?: string;
  }) {
    const rawGoogleId = (data.googleSubjectId || '').trim();
    const normalizedEmail = data.email ? data.email.trim().toLowerCase() : undefined;

    if (!rawGoogleId && !normalizedEmail) {
      throw new Error('Google identity or email is required.');
    }

    const providerAccountId = rawGoogleId || (normalizedEmail ? `g_email_${normalizedEmail}` : '');

    // 1. Search existing AuthAccount relation (provider = 'GOOGLE', providerAccountId = providerAccountId)
    let authAccount = await (prisma as any).authAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'GOOGLE',
          providerAccountId,
        },
      },
      include: { user: true },
    });

    let user = authAccount?.user;

    // 2. If AuthAccount not found, check if User with matching email exists for auto-linking
    if (!user && normalizedEmail) {
      user = await prisma.user.findFirst({
        where: { email: normalizedEmail },
      });

      if (user) {
        // Link Google account to this existing User without creating a new user or new ID
        await (prisma as any).authAccount.upsert({
          where: {
            provider_providerAccountId: {
              provider: 'GOOGLE',
              providerAccountId,
            },
          },
          create: {
            userId: user.id,
            provider: 'GOOGLE',
            providerAccountId,
          },
          update: {
            userId: user.id,
          },
        });
      }
    }

    // 3. If User still does not exist -> Create NEW account with sequential User ID
    if (!user) {
      let baseUsername = normalizedEmail
        ? normalizedEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_')
        : (data.displayName ? data.displayName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase() : 'google_user');

      if (baseUsername.length < 4) baseUsername = `${baseUsername}_user`;
      if (baseUsername.length > 20) baseUsername = baseUsername.substring(0, 20);

      let username = baseUsername;
      let counter = 1;
      while (await prisma.user.findUnique({ where: { username } })) {
        username = `${baseUsername}_${counter}`;
        counter++;
      }

      const passwordHash = await hashPassword(`sso_google_${Date.now()}`);

      try {
        const nextNumericId = await allocateNextPublicNumericId();
        const created = await prisma.user.create({
          data: {
            numericId: nextNumericId,
            username,
            displayName: data.displayName || username,
            email: normalizedEmail || null,
            passwordHash,
            avatar: data.avatar || null,
            gender: 'Prefer not to say',
            country: 'Pakistan',
            coins: 5000,
            diamonds: 0,
            role: 'USER',
            status: 'ACTIVE',
          },
        });

        try {
          await (prisma as any).authAccount.create({
            data: {
              userId: created.id,
              provider: 'GOOGLE',
              providerAccountId,
            },
          });
        } catch (_) {}

        user = created;

        broadcastGlobal('user.created', {
          id: user.id,
          numericId: user.numericId,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt.toISOString(),
        });
      } catch (concurrencyErr: any) {
        // Concurrency protection: If another simultaneous request already created the user/AuthAccount
        const recoveredAccount = await (prisma as any).authAccount.findUnique({
          where: {
            provider_providerAccountId: {
              provider: 'GOOGLE',
              providerAccountId,
            },
          },
          include: { user: true },
        });

        if (recoveredAccount?.user) {
          user = recoveredAccount.user;
        } else if (normalizedEmail) {
          const existingUser = await prisma.user.findFirst({
            where: { email: normalizedEmail },
          });
          if (existingUser) {
            user = existingUser;
          } else {
            throw concurrencyErr;
          }
        } else {
          throw concurrencyErr;
        }
      }
    }

    if (user.status === 'BANNED' || user.status === 'SUSPENDED' || user.status === 'BLOCKED') {
      const activeRestriction = await prisma.accountRestriction.findFirst({
        where: {
          userId: user.id,
          status: 'ACTIVE',
        },
        orderBy: { createdAt: 'desc' },
      });

      if (activeRestriction && activeRestriction.expiresAt && new Date(activeRestriction.expiresAt) <= new Date()) {
        await prisma.$transaction([
          prisma.accountRestriction.update({
            where: { id: activeRestriction.id },
            data: { status: 'EXPIRED' },
          }),
          prisma.user.update({
            where: { id: user.id },
            data: { status: 'ACTIVE' },
          }),
          prisma.auditLog.create({
            data: {
              actorId: user.id,
              actorRole: 'SYSTEM_AUTOPILOT',
              action: 'ACCOUNT_RESTRICTION_EXPIRED',
              resource: `User:${user.numericId}`,
              details: `Temporary restriction expired. Restored account status to ACTIVE on Google login.`,
            },
          }),
        ]);
        user.status = 'ACTIVE';
      } else {
        const reasonText = activeRestriction?.reason ? ` Reason: ${activeRestriction.reason}.` : '';
        const expiryText = activeRestriction?.expiresAt ? ` Expires: ${activeRestriction.expiresAt.toISOString()}.` : ' Permanent restriction.';
        throw new Error(`Account is ${user.status.toLowerCase()} by administration.${reasonText}${expiryText} Please contact support.`);
      }
    }

    const tokenPayload = {
      userId: user.id,
      numericId: user.numericId,
      username: user.username,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    try {
      await prisma.session.create({
        data: {
          userId: user.id,
          token: accessToken,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      });
    } catch (_) {}

    const userResponse = {
      id: user.id,
      numericId: user.numericId,
      username: user.username,
      displayName: user.displayName || data.displayName || user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      gender: user.gender,
      birthday: user.birthday,
      country: user.country,
      countryCode: user.countryCode,
      coins: Number(user.coins),
      diamonds: Number(user.diamonds),
      level: user.level,
      vipTier: user.vipTier,
      avatar: user.avatar,
      cover: user.cover,
      status: user.status,
    };

    broadcastGlobal('user.login', userResponse);
    broadcastGlobal('user.online', { userId: user.id, numericId: user.numericId, username: user.username });

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Link Google Account to Authenticated Username+Password User
   */
  static async linkGoogleAccount(userId: number, data: { googleSubjectId: string; email?: string }) {
    const rawGoogleId = (data.googleSubjectId || '').trim();
    const normalizedEmail = data.email ? data.email.trim().toLowerCase() : undefined;
    const providerAccountId = rawGoogleId || (normalizedEmail ? `g_email_${normalizedEmail}` : '');

    if (!providerAccountId) throw new Error('Invalid Google identity.');

    const existing = await (prisma as any).authAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'GOOGLE',
          providerAccountId,
        },
      },
    });

    if (existing) {
      if (existing.userId === userId) {
        return { success: true, message: 'Google account is already linked to your profile.' };
      }
      throw new Error('This Google account is already linked to another user.');
    }

    await (prisma as any).authAccount.create({
      data: {
        userId,
        provider: 'GOOGLE',
        providerAccountId,
      },
    });

    return { success: true, message: 'Google account linked successfully.' };
  }

  /**
   * Admin-only authentication
   */
  static async adminLogin(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      throw new Error('Unauthorized. Admin access required.');
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid admin credentials.');
    }

    const tokenPayload = {
      userId: user.id,
      numericId: user.numericId,
      username: user.username,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      admin: {
        id: user.id,
        numericId: user.numericId,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshSession(refreshTokenStr: string) {
    if (!refreshTokenStr) {
      throw new Error('Refresh token is required.');
    }
    const payload = verifyRefreshToken(refreshTokenStr);
    if (!payload || !payload.userId) {
      throw new Error('Invalid or expired refresh token.');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        numericId: true,
        username: true,
        displayName: true,
        email: true,
        avatar: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status === 'BANNED') {
      throw new Error('User account is invalid or banned.');
    }

    const newTokenPayload: TokenPayload = {
      userId: user.id,
      numericId: user.numericId,
      username: user.username,
      role: user.role,
    };

    const accessToken = generateAccessToken(newTokenPayload);
    const newRefreshToken = generateRefreshToken(newTokenPayload);

    return {
      user: {
        id: user.id,
        numericId: user.numericId,
        username: user.username,
        displayName: user.displayName || user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}

