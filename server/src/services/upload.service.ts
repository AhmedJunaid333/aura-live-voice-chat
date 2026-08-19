import fs from 'fs';
import path from 'path';
import sharp, { Metadata } from 'sharp';
import crypto from 'crypto';

export interface ProcessedImageResult {
  imageUrl: string;
  thumbnailUrl: string;
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  mimeType: string;
  width: number;
  height: number;
}

export class UploadService {
  private static uploadsDir = path.join(process.cwd(), 'uploads');
  private static imagesDir = path.join(process.cwd(), 'uploads', 'images');
  private static thumbnailsDir = path.join(process.cwd(), 'uploads', 'thumbnails');

  public static initDirectories(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
    if (!fs.existsSync(this.imagesDir)) {
      fs.mkdirSync(this.imagesDir, { recursive: true });
    }
    if (!fs.existsSync(this.thumbnailsDir)) {
      fs.mkdirSync(this.thumbnailsDir, { recursive: true });
    }
  }

  public static formatBytes(bytes: number, decimals = 1): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Validates and processes an image buffer:
   * 1. Validates format (JPEG, PNG, WebP, GIF)
   * 2. Extracts width, height, and metadata
   * 3. Converts to high-quality full WebP (uploads/images)
   * 4. Generates an optimized WebP thumbnail (uploads/thumbnails, max 300x300)
   * 5. Returns full URLs and metadata
   */
  public static async processImageUpload(
    buffer: Buffer,
    originalName: string,
    hostUrl?: string
  ): Promise<ProcessedImageResult> {
    this.initDirectories();

    const maxFileSize = 15 * 1024 * 1024; // 15MB
    if (buffer.length > maxFileSize) {
      throw new Error(`File exceeds maximum size of 15MB. Provided: ${this.formatBytes(buffer.length)}`);
    }

    let metadata: Metadata;
    try {
      metadata = await sharp(buffer).metadata();
    } catch (err: any) {
      throw new Error('Invalid or unsupported image file. Allowed formats: JPG, PNG, WebP, GIF.');
    }

    const allowedFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
    if (!metadata.format || !allowedFormats.includes(metadata.format.toLowerCase())) {
      throw new Error(`Unsupported image format: ${metadata.format}. Allowed: JPG, PNG, WebP, GIF.`);
    }

    const uniqueId = crypto.randomBytes(8).toString('hex');
    const sanitizedBase = path.parse(originalName || 'image').name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const finalFileName = `${sanitizedBase}_${uniqueId}.webp`;
    const thumbFileName = `thumb_${sanitizedBase}_${uniqueId}.webp`;

    const fullImagePath = path.join(this.imagesDir, finalFileName);
    const thumbImagePath = path.join(this.thumbnailsDir, thumbFileName);

    // 1. Process & Save Full Resolution WebP
    const fullImageBuffer = await sharp(buffer)
      .webp({ quality: 90, effort: 4 })
      .toBuffer();

    await fs.promises.writeFile(fullImagePath, fullImageBuffer);

    // 2. Process & Save Optimized WebP Thumbnail (max 300x300 with aspect preservation)
    const thumbBuffer = await sharp(buffer)
      .resize({
        width: 300,
        height: 300,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    await fs.promises.writeFile(thumbImagePath, thumbBuffer);

    const fullMetadata = await sharp(fullImageBuffer).metadata();
    const width = fullMetadata.width || metadata.width || 0;
    const height = fullMetadata.height || metadata.height || 0;
    const fileSize = fullImageBuffer.length;

    const baseDomain = hostUrl ? hostUrl.replace(/\/$/, '') : '';
    const imageUrl = `${baseDomain}/uploads/images/${finalFileName}`;
    const thumbnailUrl = `${baseDomain}/uploads/thumbnails/${thumbFileName}`;

    return {
      imageUrl,
      thumbnailUrl,
      fileName: finalFileName,
      fileSize,
      fileSizeFormatted: this.formatBytes(fileSize),
      mimeType: 'image/webp',
      width,
      height,
    };
  }
}
