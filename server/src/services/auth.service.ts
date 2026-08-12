import { prisma } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { broadcastGlobal } from '../websocket/socketServer.js';


export class AuthService {
  /**
   * Register a new production user with numeric ID generation
   */
  static async register(data: {
    username: string;
    email?: string;
    phone?: string;
    password: string;
    gender?: string;
    country?: string;
  }) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          ...(data.email ? [{ email: data.email }] : []),
          ...(data.phone ? [{ phone: data.phone }] : []),
        ],
      },
    });

    if (existing) {
      throw new Error('User already exists with this username, email, or phone.');
    }

    // Generate unique 6-digit numeric ID starting from 100001
    const lastUser = await prisma.user.findFirst({
      orderBy: { numericId: 'desc' },
      select: { numericId: true },
    });
    const numericId = lastUser ? lastUser.numericId + 1 : 100001;

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        numericId,
        username: data.username,
        email: data.email || null,
        phone: data.phone || null,
        passwordHash,
        gender: data.gender || 'Prefer not to say',
        country: data.country || 'Pakistan',
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

    const userResponse = {
      id: user.id,
      numericId: user.numericId,
      username: user.username,
      displayName: user.displayName || user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      country: user.country,
      coins: Number(user.coins),
      diamonds: Number(user.diamonds),
      level: user.level,
      vipTier: user.vipTier,
      avatar: user.avatar,
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
   * Authenticate user with username and password
   */
  static async login(data: { username?: string; identifier?: string; password: string }) {
    const loginUsername = (data.username || data.identifier || '').trim();
    if (!loginUsername) {
      throw new Error('Username is required for login.');
    }

    const isNumeric = /^\d+$/.test(loginUsername);
    const numericId = isNumeric ? parseInt(loginUsername, 10) : undefined;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: loginUsername },
          { email: loginUsername },
          { phone: loginUsername },
          ...(numericId ? [{ numericId }] : []),
        ],
      },
    });

    if (!user) {
      throw new Error('Invalid credentials. User not found.');
    }

    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      throw new Error(`Account is ${user.status.toLowerCase()}. Please contact support.`);
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

    // Save session in DB
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const userResponse = {
      id: user.id,
      numericId: user.numericId,
      username: user.username,
      displayName: user.displayName || user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      country: user.country,
      coins: Number(user.coins),
      diamonds: Number(user.diamonds),
      level: user.level,
      vipTier: user.vipTier,
      avatar: user.avatar,
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
   * Production Real Google Authentication Flow
   */
  static async googleLogin(data: {
    googleSubjectId: string;
    email?: string;
    displayName?: string;
    avatar?: string;
    idToken?: string;
  }) {
    if (!data.googleSubjectId && !data.email) {
      throw new Error('Google identity or email required.');
    }

    const providerAccountId = data.googleSubjectId || (data.email ? `g_email_${data.email}` : '');

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
    if (!user && data.email) {
      user = await prisma.user.findFirst({
        where: { email: data.email },
      });

      if (user) {
        await (prisma as any).authAccount.create({
          data: {
            userId: user.id,
            provider: 'GOOGLE',
            providerAccountId,
          },
        });
      }
    }

    // 3. If User still does not exist -> Create NEW REAL User in PostgreSQL
    if (!user) {
      const lastUser = await prisma.user.findFirst({
        orderBy: { numericId: 'desc' },
        select: { numericId: true },
      });
      const numericId = lastUser ? lastUser.numericId + 1 : 100001;

      let baseUsername = data.email
        ? data.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_')
        : (data.displayName ? data.displayName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase() : 'google_user');

      if (baseUsername.length < 4) baseUsername = `${baseUsername}_user`;
      if (baseUsername.length > 20) baseUsername = baseUsername.substring(0, 20);

      let username = baseUsername;
      let counter = 1;
      while (await prisma.user.findUnique({ where: { username } })) {
        username = `${baseUsername}_${counter}`;
        counter++;
      }

      const passwordHash = await hashPassword(`sso_google_${Date.now()}_${numericId}`);

      user = await prisma.user.create({
        data: {
          numericId,
          username,
          displayName: data.displayName || username,
          email: data.email || null,
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

      await (prisma as any).authAccount.create({
        data: {
          userId: user.id,
          provider: 'GOOGLE',
          providerAccountId,
        },
      });

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
    }

    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      throw new Error(`Account is ${user.status.toLowerCase()}. Please contact support.`);
    }

    const tokenPayload = {
      userId: user.id,
      numericId: user.numericId,
      username: user.username,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const userResponse = {
      id: user.id,
      numericId: user.numericId,
      username: user.username,
      displayName: user.displayName || data.displayName || user.username,
      email: user.email,
      role: user.role,
      country: user.country,
      coins: Number(user.coins),
      diamonds: Number(user.diamonds),
      level: user.level,
      vipTier: user.vipTier,
      avatar: user.avatar,
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
    const providerAccountId = data.googleSubjectId || (data.email ? `g_email_${data.email}` : '');
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
}
