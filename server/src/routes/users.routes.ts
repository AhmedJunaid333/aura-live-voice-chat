import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { authenticateToken, optionalAuthenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { profileUpdateSchema } from '../utils/validators.js';
import { UserService } from '../services/user.service.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const usersRouter = Router();

// Configure local uploads directory for user avatars
const avatarUploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
if (!fs.existsSync(avatarUploadsDir)) {
  fs.mkdirSync(avatarUploadsDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, avatarUploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// Upload User Avatar Photo & Update DB
usersRouter.post('/avatar/upload', authenticateToken, avatarUpload.single('avatar'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.file) {
      const serverBase = `${req.protocol}://${req.get('host')}`;
      const avatarUrl = `${serverBase}/uploads/avatars/${req.file.filename}`;
      
      const updated = await prisma.user.update({
        where: { id: req.user!.userId },
        data: { avatar: avatarUrl },
      });

      res.status(200).json({
        success: true,
        data: {
          avatarUrl,
          user: {
            ...updated,
            coins: Number(updated.coins),
            diamonds: Number(updated.diamonds),
          },
        },
        message: 'Avatar uploaded and saved successfully! 🎉',
      });
      return;
    }

    const { imageBase64 } = req.body || {};
    if (imageBase64 && typeof imageBase64 === 'string') {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
      const filePath = path.join(avatarUploadsDir, filename);
      fs.writeFileSync(filePath, buffer);

      const serverBase = `${req.protocol}://${req.get('host')}`;
      const avatarUrl = `${serverBase}/uploads/avatars/${filename}`;

      const updated = await prisma.user.update({
        where: { id: req.user!.userId },
        data: { avatar: avatarUrl },
      });

      res.status(200).json({
        success: true,
        data: {
          avatarUrl,
          user: {
            ...updated,
            coins: Number(updated.coins),
            diamonds: Number(updated.diamonds),
          },
        },
        message: 'Avatar uploaded and saved successfully! 🎉',
      });
      return;
    }

    res.status(400).json({ success: false, error: 'No image file or base64 data provided' });
  } catch (error) {
    next(error);
  }
});

// Search Users
usersRouter.get('/search', optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const q = String(req.query.q || '');
    const page = parseInt(String(req.query.page || '1'), 10);
    const limit = parseInt(String(req.query.limit || '20'), 10);
    const currentUserId = req.user?.userId;

    const result = await UserService.searchUsers(q, currentUserId, page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// Get current user's blocked users
usersRouter.get('/blocked', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await UserService.getBlockedUsers(req.user!.userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Get current user's muted users
usersRouter.get('/muted', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await UserService.getMutedUsers(req.user!.userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Get Rich User Profile by Numeric ID or Username
usersRouter.get('/:identifier/profile', optionalAuthenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const identifier = String(req.params.identifier);
    const currentUserId = req.user?.userId;
    const profile = await UserService.getUserProfile(identifier, currentUserId);

    if (!profile) {
      res.status(404).json({ success: false, error: 'User profile not found.' });
      return;
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
});

// Get User Live Status
usersRouter.get('/:numericId/live-status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const numericId = parseInt(String(req.params.numericId), 10);
    const result = await UserService.getUserLiveStatus(numericId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Block a User
usersRouter.post('/:numericId/block', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const numericId = parseInt(String(req.params.numericId), 10);
    const reason = req.body?.reason;
    const result = await UserService.blockUser(req.user!.userId, numericId, reason);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Unblock a User
usersRouter.delete('/:numericId/block', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const numericId = parseInt(String(req.params.numericId), 10);
    const result = await UserService.unblockUser(req.user!.userId, numericId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Mute a User
usersRouter.post('/:numericId/mute', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const numericId = parseInt(String(req.params.numericId), 10);
    const reason = req.body?.reason;
    const result = await UserService.muteUser(req.user!.userId, numericId, reason);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Unmute a User
usersRouter.delete('/:numericId/mute', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const numericId = parseInt(String(req.params.numericId), 10);
    const result = await UserService.unmuteUser(req.user!.userId, numericId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Report a User
usersRouter.post('/:numericId/report', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const numericId = parseInt(String(req.params.numericId), 10);
    const { category, reason, details } = req.body || {};
    const result = await UserService.reportUser(req.user!.userId, numericId, category, reason, details);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// 🏆 Get User Contribution Ranking (Day / Week / Monthly)
usersRouter.get(['/:numericId/contributions', '/contributions/:numericId'], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const numericId = parseInt(String(req.params.numericId), 10);
    const period = (req.query.period as string) || 'day';
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50;

    const result = await UserService.getContributionRanking({
      targetIdentifier: numericId,
      period: period as any,
      limit,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Backward compatible Get User Profile by Numeric ID
usersRouter.get('/:numericId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const numericId = parseInt(String(req.params.numericId), 10);
    const user = await prisma.user.findUnique({
      where: { numericId },
      select: {
        id: true,
        numericId: true,
        username: true,
        displayName: true,
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
      res.status(404).json({ success: false, error: 'User not found' });
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

// Update Authenticated User Profile in PostgreSQL
usersRouter.put('/profile/update', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = profileUpdateSchema.parse(req.body);
    const updated = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(validated.username !== undefined && { username: validated.username }),
        ...(validated.displayName !== undefined && { displayName: validated.displayName }),
        ...(validated.bio !== undefined && { bio: validated.bio }),
        ...(validated.gender !== undefined && { gender: validated.gender }),
        ...(validated.country !== undefined && { country: validated.country }),
        ...(validated.countryCode !== undefined && { countryCode: validated.countryCode }),
        ...(validated.avatar !== undefined && { avatar: validated.avatar }),
        ...(validated.cover !== undefined && { cover: validated.cover }),
        ...(validated.birthday ? { birthday: new Date(validated.birthday) } : {}),
      },
    });

    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        numericId: updated.numericId,
        username: updated.username,
        displayName: updated.displayName || updated.username,
        email: updated.email,
        phone: updated.phone,
        avatar: updated.avatar,
        cover: updated.cover,
        bio: updated.bio,
        gender: updated.gender,
        country: updated.country,
        countryCode: updated.countryCode,
        birthday: updated.birthday,
        level: updated.level,
        xp: updated.xp,
        vipTier: updated.vipTier,
        role: updated.role,
        status: updated.status,
        coins: Number(updated.coins),
        diamonds: Number(updated.diamonds),
      },
      message: 'Profile saved successfully to PostgreSQL! 🎉',
    });
  } catch (error) {
    next(error);
  }
});

