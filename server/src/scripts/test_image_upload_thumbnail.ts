import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { UploadService } from '../services/upload.service.js';

async function runImageUploadThumbnailTests() {
  console.log('🧪 =========================================================');
  console.log('🧪 RUNNING IMAGE UPLOAD & AUTOMATIC THUMBNAIL WORKFLOW TESTS');
  console.log('🧪 =========================================================\n');

  // Test 1: Process valid 800x600 PNG buffer
  console.log('--- TEST 1: Process 800x600 PNG $\to$ Full WebP + 300px Thumbnail ---');
  const samplePngBuffer = await sharp({
    create: {
      width: 800,
      height: 600,
      channels: 4,
      background: { r: 57, g: 215, b: 195, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const result1 = await UploadService.processImageUpload(samplePngBuffer, 'gift_crystal.png', 'https://aura-live.onrender.com');

  console.log('Result 1:', {
    imageUrl: result1.imageUrl,
    thumbnailUrl: result1.thumbnailUrl,
    fileName: result1.fileName,
    fileSizeFormatted: result1.fileSizeFormatted,
    mimeType: result1.mimeType,
    width: result1.width,
    height: result1.height,
  });

  if (!result1.imageUrl.includes('/uploads/images/') || !result1.thumbnailUrl.includes('/uploads/thumbnails/')) {
    throw new Error('TEST 1 FAILED: Invalid imageUrl or thumbnailUrl paths');
  }
  if (result1.mimeType !== 'image/webp') {
    throw new Error('TEST 1 FAILED: Expected mimeType image/webp');
  }
  console.log('✅ TEST 1 PASSED: Full WebP & Thumbnail generated successfully.\n');

  // Test 2: Inspect generated thumbnail file on disk
  console.log('--- TEST 2: Inspect Thumbnail Dimensions on Disk ---');
  const thumbBaseName = path.basename(result1.thumbnailUrl);
  const thumbPath = path.join(process.cwd(), 'uploads', 'thumbnails', thumbBaseName);

  if (!fs.existsSync(thumbPath)) {
    throw new Error(`TEST 2 FAILED: Thumbnail file does not exist on disk at ${thumbPath}`);
  }

  const thumbMeta = await sharp(thumbPath).metadata();
  console.log('Thumbnail on disk metadata:', {
    format: thumbMeta.format,
    width: thumbMeta.width,
    height: thumbMeta.height,
    size: thumbMeta.size,
  });

  if (thumbMeta.format !== 'webp') {
    throw new Error('TEST 2 FAILED: Thumbnail is not in WebP format');
  }
  if ((thumbMeta.width || 0) > 300 || (thumbMeta.height || 0) > 300) {
    throw new Error(`TEST 2 FAILED: Thumbnail exceeds 300px bounds (${thumbMeta.width}x${thumbMeta.height})`);
  }
  console.log('✅ TEST 2 PASSED: Thumbnail file strictly within 300px WebP specifications.\n');

  // Test 3: Rejection of invalid non-image buffer
  console.log('--- TEST 3: Validation Rejection of Corrupt / Non-Image Data ---');
  let rejected = false;
  try {
    const corruptBuffer = Buffer.from('NOT_AN_IMAGE_DATA_12345');
    await UploadService.processImageUpload(corruptBuffer, 'corrupt.txt');
  } catch (err: any) {
    rejected = true;
    console.log('Caught expected error:', err.message);
  }

  if (!rejected) {
    throw new Error('TEST 3 FAILED: Non-image data was not rejected');
  }
  console.log('✅ TEST 3 PASSED: Non-image data properly rejected with descriptive error.\n');

  // Test 4: Base64 Upload Handling
  console.log('--- TEST 4: Base64 JPEG Image Processing ---');
  const sampleJpgBuffer = await sharp({
    create: {
      width: 500,
      height: 500,
      channels: 3,
      background: { r: 255, g: 183, b: 3 },
    },
  })
    .jpeg()
    .toBuffer();

  const base64Str = sampleJpgBuffer.toString('base64');
  const decodedBuffer = Buffer.from(base64Str, 'base64');

  const result4 = await UploadService.processImageUpload(decodedBuffer, 'golden_trophy.jpg');
  console.log('Result 4:', {
    fileName: result4.fileName,
    width: result4.width,
    height: result4.height,
    fileSizeFormatted: result4.fileSizeFormatted,
  });

  if (result4.width !== 500 || result4.height !== 500) {
    throw new Error(`TEST 4 FAILED: Expected 500x500 dimensions, got ${result4.width}x${result4.height}`);
  }
  console.log('✅ TEST 4 PASSED: Base64 JPEG processed into WebP and thumbnail successfully.\n');

  console.log('🎉 =========================================================');
  console.log('🎉 ALL 4 IMAGE UPLOAD & THUMBNAIL WORKFLOW TESTS PASSED 100%');
  console.log('🎉 =========================================================\n');
}

runImageUploadThumbnailTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
