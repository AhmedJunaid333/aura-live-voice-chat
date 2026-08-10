import { Router } from 'express';
import { prisma } from '../config/database.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { profileUpdateSchema } from '../utils/validators.js';

export const usersRouter = Router();

// Get User Profile by Numeric ID
usersRouter.get('/:numericId', async (req, res, next) => {
  try {
    const numericId = parseInt(req.params.numericId, 10);
    const user = await prisma.user.findUnique({
      where: { numericId },
      select: {
        id: true,
        numericId: true,
        username: true,
        avatar: true,
        cover: true,
        bio: true,
        gender: true,
        country: true,
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
        coins: Number(user.coins),
        diamonds: Number(user.diamonds),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update Authenticated User Profile
usersRouter.put('/profile/update', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = profileUpdateSchema.parse(req.body);
    const updated = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(validated.username !== undefined && { username: validated.username }),
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
        ...updated,
        coins: Number(updated.coins),
        diamonds: Number(updated.diamonds),
      },
    });
  } catch (error) {
    next(error);
  }
});
