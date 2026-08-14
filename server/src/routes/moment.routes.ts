import { Router } from 'express';
import { MomentService } from '../services/moment.service.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const momentRouter = Router();

// Configure local uploads directory for moment media
const uploadsDir = path.join(process.cwd(), 'uploads', 'moments');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `moment-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

/**
 * 📡 GET /api/v1/moments — Get Moments Feed (Following, Featured, Nearby, Search)
 */
momentRouter.get('/', async (req, res, next) => {
  try {
    // Optional auth token to determine like states
    let currentUserId: number | null = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = (await import('jsonwebtoken')).default;
        const { ENV } = await import('../config/env.js');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as any;
        currentUserId = decoded.userId || decoded.id || null;
      } catch (_) {}
    }

    const feed = await MomentService.getMoments(currentUserId, {
      tab: req.query.tab as any,
      countryCode: req.query.countryCode as string,
      search: req.query.search as string,
      authorId: req.query.authorId ? Number(req.query.authorId) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    });

    res.status(200).json({ success: true, data: feed });
  } catch (error) {
    next(error);
  }
});

/**
 * 📸 POST /api/v1/moments — Create New Moment
 */
const createMomentSchema = z.object({
  caption: z.string().optional(),
  mediaUrl: z.string().min(1, 'Media URL is required'),
  mediaType: z.enum(['IMAGE', 'VIDEO', 'TEXT']).default('IMAGE'),
  thumbnailUrl: z.string().optional(),
  privacy: z.enum(['PUBLIC', 'FOLLOWERS', 'PRIVATE']).default('PUBLIC'),
  countryCode: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
});

momentRouter.post('/', async (req, res, next) => {
  try {
    let resolvedUserId: number = 1;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (token) {
      try {
        const jwt = (await import('jsonwebtoken')).default;
        const { ENV } = await import('../config/env.js');
        const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as any;
        if (decoded?.userId) resolvedUserId = decoded.userId;
      } catch (_) {}
    }
    if (!token && (req.body.authorNumericId || req.body.authorId || req.body.userId)) {
      resolvedUserId = Number(req.body.authorNumericId || req.body.authorId || req.body.userId);
    } else if (!token && req.headers['x-user-id']) {
      resolvedUserId = Number(req.headers['x-user-id']);
    }

    const validated = createMomentSchema.parse(req.body);
    const moment = await MomentService.createMoment(resolvedUserId, validated);
    res.status(201).json({ success: true, data: moment, message: 'Moment posted successfully! 🎉' });
  } catch (error) {
    next(error);
  }
});

/**
 * 📤 POST /api/v1/moments/upload — Upload Media File (Multipart or Base64)
 */
momentRouter.post('/upload', upload.single('media'), async (req, res, next) => {
  try {
    if (req.file) {
      const serverBase = `${req.protocol}://${req.get('host')}`;
      const mediaUrl = `${serverBase}/uploads/moments/${req.file.filename}`;
      const isVideo = req.file.mimetype.startsWith('video');
      res.status(200).json({
        success: true,
        data: {
          mediaUrl,
          mediaType: isVideo ? 'VIDEO' : 'IMAGE',
          filename: req.file.filename,
        },
      });
      return;
    }

    // Support Base64 Image upload
    if (req.body.base64) {
      const base64Data = req.body.base64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `moment-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);

      const serverBase = `${req.protocol}://${req.get('host')}`;
      const mediaUrl = `${serverBase}/uploads/moments/${filename}`;
      res.status(200).json({
        success: true,
        data: {
          mediaUrl,
          mediaType: 'IMAGE',
          filename,
        },
      });
      return;
    }

    res.status(400).json({ success: false, error: 'No media file or base64 data provided' });
  } catch (error) {
    next(error);
  }
});

/**
 * ❤️ POST /api/v1/moments/:momentId/like — Like Moment
 */
momentRouter.post('/:momentId/like', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await MomentService.likeMoment(req.user!.userId, req.params.momentId as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * 💔 DELETE /api/v1/moments/:momentId/like — Unlike Moment
 */
momentRouter.delete('/:momentId/like', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await MomentService.unlikeMoment(req.user!.userId, req.params.momentId as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * 💬 GET /api/v1/moments/:momentId/comments — Get Comments
 */
momentRouter.get('/:momentId/comments', async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;
    const result = await MomentService.getComments(req.params.momentId as string, page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * 💬 POST /api/v1/moments/:momentId/comments — Add Comment
 */
momentRouter.post('/:momentId/comments', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const text = req.body.text as string;
    if (!text || !text.trim()) {
      res.status(400).json({ success: false, error: 'Comment text is required' });
      return;
    }
    const result = await MomentService.addComment(req.user!.userId, req.params.momentId as string, text);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * 🗑️ DELETE /api/v1/moments/:momentId/comments/:commentId — Delete Comment
 */
momentRouter.delete('/:momentId/comments/:commentId', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const result = await MomentService.deleteComment(req.user!.userId, req.params.commentId as string);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * 👁️ POST /api/v1/moments/:momentId/view — Record View
 */
momentRouter.post('/:momentId/view', async (req, res, next) => {
  try {
    let userId: number | null = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = (await import('jsonwebtoken')).default;
        const { ENV } = await import('../config/env.js');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as any;
        userId = decoded.userId || decoded.id || null;
      } catch (_) {}
    }
    await MomentService.recordView(userId, req.params.momentId as string, req.ip);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * ↗️ POST /api/v1/moments/:momentId/share — Record Share
 */
momentRouter.post('/:momentId/share', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const platform = (req.body.platform as string) || 'INTERNAL';
    const result = await MomentService.recordShare(req.user!.userId, req.params.momentId as string, platform);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * 🚨 POST /api/v1/moments/:momentId/report — Report Moment
 */
momentRouter.post('/:momentId/report', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { reason, details } = req.body;
    if (!reason) {
      res.status(400).json({ success: false, error: 'Reason is required' });
      return;
    }
    const report = await MomentService.reportMoment(req.user!.userId, req.params.momentId as string, reason as string, details as string | undefined);
    res.status(200).json({ success: true, data: report, message: 'Report submitted successfully' });
  } catch (error) {
    next(error);
  }
});
