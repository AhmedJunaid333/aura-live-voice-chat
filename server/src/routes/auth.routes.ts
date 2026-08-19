import { Router } from 'express';
import { prisma } from '../config/database.js';
import { AuthService } from '../services/auth.service.js';
import { registerSchema, loginSchema, adminLoginSchema } from '../utils/validators.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

export const authRouter = Router();

authRouter.post('/register', authLimiter, async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await AuthService.register(validated);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', authLimiter, async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await AuthService.login(validated);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/admin/login', authLimiter, async (req, res, next) => {
  try {
    const validated = adminLoginSchema.parse(req.body);
    const result = await AuthService.adminLogin(validated);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        numericId: true,
        username: true,
        displayName: true,
        email: true,
        phone: true,
        avatar: true,
        cover: true,
        bio: true,
        gender: true,
        country: true,
        countryCode: true,
        birthday: true,
        level: true,
        xp: true,
        vipTier: true,
        coins: true,
        diamonds: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found in database.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...user,
        displayName: user.displayName || user.username,
        coins: Number(user.coins),
        diamonds: Number(user.diamonds),
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (req.user?.userId) {
      await AuthService.logout(req.user.userId);
    }
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/google', authLimiter, async (req, res, next) => {
  try {
    const { googleSubjectId, email, displayName, avatar, idToken } = req.body;
    const maskedEmail = email ? email.replace(/(.{2})(.*)(?=@)/, (_: string, a: string, b: string) => a + '*'.repeat(b.length)) : 'unspecified';
    console.log(`🔑 [AUTH-SSO] Processing Google SSO for email: ${maskedEmail}, subjectId: ${Boolean(googleSubjectId)}, idToken: ${Boolean(idToken)}`);
    const result = await AuthService.googleLogin({
      googleSubjectId,
      email,
      displayName,
      avatar,
      idToken,
    });
    console.log(`✅ [AUTH-SSO] Google SSO success: User ID ${result.user.id} (numericId: ${result.user.numericId})`);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(`❌ [AUTH-SSO] Google SSO error:`, error);
    next(error);
  }
});

authRouter.post('/link-google', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { googleSubjectId, email } = req.body;
    if (!req.user?.userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const result = await AuthService.linkGoogleAccount(req.user.userId, { googleSubjectId, email });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken || req.body.token;
    const result = await AuthService.refreshSession(refreshToken);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(401).json({ success: false, error: (error as Error).message });
  }
});

authRouter.post('/refresh-token', async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken || req.body.token;
    const result = await AuthService.refreshSession(refreshToken);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(401).json({ success: false, error: (error as Error).message });
  }
});

