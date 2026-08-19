import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { UploadService } from '../services/upload.service.js';

export const uploadRouter = Router();

// Memory storage for image processing with Sharp
const memoryStorage = multer.memoryStorage();
const imageUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

// Disk storage for audio and animations
const uploadsDir = path.join(process.cwd(), 'uploads');
const audioDir = path.join(uploadsDir, 'audio');
const svgaDir = path.join(uploadsDir, 'svga');

if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
if (!fs.existsSync(svgaDir)) fs.mkdirSync(svgaDir, { recursive: true });

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isAudio = file.mimetype.startsWith('audio/') || file.originalname.endsWith('.mp3') || file.originalname.endsWith('.wav');
    cb(null, isAudio ? audioDir : svgaDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const unique = crypto.randomBytes(6).toString('hex');
    cb(null, `${base}_${unique}${ext}`);
  },
});

const mediaUpload = multer({
  storage: diskStorage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
});

function getHostUrl(req: Request): string {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:5000';
  return `${protocol}://${host}`;
}

/**
 * 📤 POST /api/v1/upload/image
 * Accepts Multipart file ('image' or 'file') OR Base64 payload in JSON body
 * Generates full WebP image + 300px WebP thumbnail
 */
uploadRouter.post(
  '/image',
  imageUpload.single('image'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hostUrl = getHostUrl(req);
      let buffer: Buffer | null = null;
      let originalName = 'image';

      if (req.file) {
        buffer = req.file.buffer;
        originalName = req.file.originalname;
      } else if (req.body && (req.body.imageBase64 || req.body.image || req.body.file)) {
        const rawBase64 = req.body.imageBase64 || req.body.image || req.body.file;
        const cleanBase64 = rawBase64.replace(/^data:image\/\w+;base64,/, '');
        buffer = Buffer.from(cleanBase64, 'base64');
        originalName = req.body.fileName || req.body.name || 'image.png';
      }

      if (!buffer || buffer.length === 0) {
        res.status(400).json({
          success: false,
          error: 'No image file or base64 payload provided.',
        });
        return;
      }

      const result = await UploadService.processImageUpload(buffer, originalName, hostUrl);

      res.status(200).json({
        success: true,
        message: 'Image uploaded and thumbnail generated successfully! 🎨',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }
);

/**
 * 🎵 POST /api/v1/upload/audio
 * Uploads audio tracks (BGM / Sound effects)
 */
uploadRouter.post(
  '/audio',
  mediaUpload.single('file'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No audio file provided.' });
        return;
      }

      const hostUrl = getHostUrl(req);
      const audioUrl = `${hostUrl}/uploads/audio/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'Audio track uploaded successfully! 🎵',
        data: {
          audioUrl,
          fileName: req.file.filename,
          fileSize: req.file.size,
          fileSizeFormatted: UploadService.formatBytes(req.file.size),
          mimeType: req.file.mimetype,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }
);

/**
 * ✨ POST /api/v1/upload/svga
 * Uploads SVGA animation assets / Lottie JSON
 */
uploadRouter.post(
  '/svga',
  mediaUpload.single('file'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No SVGA/animation file provided.' });
        return;
      }

      const hostUrl = getHostUrl(req);
      const assetUrl = `${hostUrl}/uploads/svga/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'SVGA animation uploaded successfully! ✨',
        data: {
          assetUrl,
          fileName: req.file.filename,
          fileSize: req.file.size,
          fileSizeFormatted: UploadService.formatBytes(req.file.size),
          mimeType: req.file.mimetype,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }
);
