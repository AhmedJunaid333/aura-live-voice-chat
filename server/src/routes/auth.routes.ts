import { Router } from 'express';
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

authRouter.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  res.status(200).json({ success: true, data: req.user });
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
    const result = await AuthService.googleLogin({
      googleSubjectId,
      email,
      displayName,
      avatar,
      idToken,
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
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
