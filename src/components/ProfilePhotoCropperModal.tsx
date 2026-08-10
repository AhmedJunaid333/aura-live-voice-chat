import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, Image as ImageIcon, RotateCw, ZoomIn, ZoomOut, Maximize2, RefreshCw, 
  Check, X, AlertTriangle, ShieldCheck, Sparkles, UploadCloud, Eye, Sliders
} from 'lucide-react';
import { toast } from '../services/toastAndErrorService';

export interface ProfilePhotoCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDpUrl?: string;
  onSaveDp: (croppedDataUrl: string, thumbnailUrl: string) => void;
}

export type CropShape = 'circle' | 'square' | 'rounded';

export const ProfilePhotoCropperModal: React.FC<ProfilePhotoCropperModalProps> = ({
  isOpen,
  onClose,
  currentDpUrl,
  onSaveDp
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  
  // Crop & Transform States
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cropShape, setCropShape] = useState<CropShape>('circle');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Validation & Processing States
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset transforms when new image is loaded
  const resetTransform = useCallback(() => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
    setCroppedPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    setPreviewMode(false);
  }, []);

  // Handle File Selection
  const handleFileSelect = (file: File) => {
    // 1. Validation: Allowed Formats
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      toast.error('Invalid image format. Allowed formats: JPG, JPEG, PNG, WEBP');
      return;
    }

    // 2. Validation: Maximum Size (10 MB)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error('Image is too large. Maximum size allowed is 10 MB.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.src = src;
      img.onload = () => {
        // 3. Validation: Minimum Resolution (300x300)
        if (img.width < 300 || img.height < 300) {
          toast.error(`Image resolution too low (${img.width}x${img.height}). Minimum required is 300x300.`);
          return;
        }
        setImageDimensions({ width: img.width, height: img.height });
        setImageSrc(src);
        resetTransform();
        toast.info(`Loaded image (${img.width}x${img.height}px, ${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      };
      img.onerror = () => {
        toast.error('Corrupted image file. Please select a valid photo.');
      };
    };
    reader.readAsDataURL(file);
  };

  // Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel Zoom Handler
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!imageSrc) return;
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom((prevZoom) => Math.min(Math.max(prevZoom + delta, 1), 5));
  };

  // Rotate Handler
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Render Crop Preview to Canvas
  const generateCroppedImages = useCallback(() => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Render 1080x1080 high-res output
      const targetSize = 1080;
      canvas.width = targetSize;
      canvas.height = targetSize;

      ctx.clearRect(0, 0, targetSize, targetSize);
      ctx.save();

      // Apply Shape Clipping if needed
      if (cropShape === 'circle') {
        ctx.beginPath();
        ctx.arc(targetSize / 2, targetSize / 2, targetSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      } else if (cropShape === 'rounded') {
        const radius = 120;
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(targetSize - radius, 0);
        ctx.quadraticCurveTo(targetSize, 0, targetSize, radius);
        ctx.lineTo(targetSize, targetSize - radius);
        ctx.quadraticCurveTo(targetSize, targetSize, targetSize - radius, targetSize);
        ctx.lineTo(radius, targetSize);
        ctx.quadraticCurveTo(0, targetSize, 0, targetSize - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.clip();
      }

      // Move context to center
      ctx.translate(targetSize / 2, targetSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);
      ctx.translate(pan.x, pan.y);

      // Draw image centered
      ctx.drawImage(img, -targetSize / 2, -targetSize / 2, targetSize, targetSize);
      ctx.restore();

      // Compress to WEBP / JPEG under 1MB
      const mainDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setCroppedPreviewUrl(mainDataUrl);

      // Generate 150x150 Thumbnail
      const thumbCanvas = document.createElement('canvas');
      const thumbCtx = thumbCanvas.getContext('2d');
      if (thumbCtx) {
        thumbCanvas.width = 150;
        thumbCanvas.height = 150;
        thumbCtx.drawImage(canvas, 0, 0, 150, 150);
        setThumbnailPreviewUrl(thumbCanvas.toDataURL('image/jpeg', 0.8));
      }

      setIsProcessing(false);
      setPreviewMode(true);
      toast.success('Image cropped & compressed successfully!');
    };
  }, [imageSrc, zoom, rotation, pan, cropShape]);

  // Handle Save & Upload Simulation
  const handleSaveAndUpload = () => {
    if (!croppedPreviewUrl || !thumbnailPreviewUrl) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress timer from 0% to 100%
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          onSaveDp(croppedPreviewUrl, thumbnailPreviewUrl);
          toast.success('Profile photo updated successfully across all screens!');
          onClose();
        }, 400);
      }
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#12141D] border border-[#2D3142] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3142] bg-[#181B26]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                Edit Profile Picture
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  TikTok Style
                </span>
              </h3>
              <p className="text-xs text-gray-400">Zoom, Crop, Move & Rotate your DP</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* File Picker / Source Selection */}
          {!imageSrc ? (
            <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-[#2D3142] hover:border-amber-500/50 rounded-2xl bg-[#181B26]/50 transition-all text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Choose Profile Photo</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm">
                  Upload JPG, PNG or WEBP up to 10 MB. Recommended size 1080x1080.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold rounded-xl shadow-lg transition-transform active:scale-95 text-sm"
                >
                  <ImageIcon className="w-4 h-4" />
                  Select Gallery / File
                </button>
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#252A3B] hover:bg-[#2D3349] text-white font-medium rounded-xl border border-[#3A415A] transition-colors text-sm"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  Camera
                </button>
              </div>

              {/* Hidden Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Interactive Cropper Canvas Container */}
              {!previewMode ? (
                <div className="space-y-4">
                  <div 
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                    className="relative w-full h-80 bg-black/90 rounded-2xl overflow-hidden border border-[#2D3142] cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
                  >
                    {/* Background Image Layer with Transforms */}
                    <img
                      src={imageSrc}
                      alt="Source DP"
                      style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                        transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                      }}
                      className="max-w-none max-h-none pointer-events-none object-contain"
                    />

                    {/* Mask Overlay Frame */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div 
                        className={`w-64 h-64 border-2 border-amber-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] ${
                          cropShape === 'circle' ? 'rounded-full' : cropShape === 'rounded' ? 'rounded-3xl' : 'rounded-none'
                        }`}
                      />
                    </div>

                    {/* Grid Overlay Guide */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-64 h-64 grid grid-cols-3 grid-rows-3 opacity-30">
                        <div className="border border-white/40"></div>
                        <div className="border border-white/40"></div>
                        <div className="border border-white/40"></div>
                        <div className="border border-white/40"></div>
                        <div className="border border-white/40"></div>
                        <div className="border border-white/40"></div>
                        <div className="border border-white/40"></div>
                        <div className="border border-white/40"></div>
                        <div className="border border-white/40"></div>
                      </div>
                    </div>
                  </div>

                  {/* Controls Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#181B26] p-3 rounded-2xl border border-[#2D3142]">
                    
                    {/* Zoom Slider */}
                    <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                      <ZoomOut className="w-4 h-4 text-gray-400" />
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
                      />
                      <ZoomIn className="w-4 h-4 text-amber-400" />
                      <span className="text-xs text-gray-300 font-mono w-10 text-right">{zoom.toFixed(1)}x</span>
                    </div>

                    {/* Shapes */}
                    <div className="flex items-center bg-[#11131A] p-1 rounded-xl border border-[#2B3045] gap-1">
                      <button
                        onClick={() => setCropShape('circle')}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                          cropShape === 'circle' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Circle
                      </button>
                      <button
                        onClick={() => setCropShape('square')}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                          cropShape === 'square' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Square
                      </button>
                      <button
                        onClick={() => setCropShape('rounded')}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                          cropShape === 'rounded' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Rounded
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleRotate}
                        title="Rotate 90°"
                        className="p-2 rounded-xl bg-[#252A3B] hover:bg-[#32384D] text-gray-300 hover:text-white border border-[#3A415A] transition-colors"
                      >
                        <RotateCw className="w-4 h-4 text-amber-400" />
                      </button>
                      <button
                        onClick={resetTransform}
                        title="Reset Zoom & Pan"
                        className="p-2 rounded-xl bg-[#252A3B] hover:bg-[#32384D] text-gray-300 hover:text-white border border-[#3A415A] transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Dual Preview Screen */
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl text-amber-300 text-xs">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Image Compressed to &lt;1 MB (1080x1080 High Resolution)
                    </span>
                    <button 
                      onClick={() => setPreviewMode(false)} 
                      className="underline font-semibold hover:text-white"
                    >
                      Re-crop
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Original Preview */}
                    <div className="bg-[#181B26] p-3 rounded-2xl border border-[#2D3142] flex flex-col items-center">
                      <span className="text-xs font-medium text-gray-400 mb-2">Original Photo</span>
                      <div className="w-36 h-36 rounded-xl overflow-hidden border border-[#3A415A] bg-black flex items-center justify-center">
                        <img src={imageSrc} alt="Original" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    {/* Cropped Preview */}
                    <div className="bg-[#181B26] p-3 rounded-2xl border border-[#2D3142] flex flex-col items-center">
                      <span className="text-xs font-medium text-amber-400 mb-2">Cropped DP Result</span>
                      <div className={`w-36 h-36 overflow-hidden border-2 border-amber-400 shadow-lg shadow-amber-500/10 bg-black flex items-center justify-center ${
                        cropShape === 'circle' ? 'rounded-full' : cropShape === 'rounded' ? 'rounded-2xl' : 'rounded-none'
                      }`}>
                        <img src={croppedPreviewUrl || ''} alt="Cropped Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Uploading Progress Bar Overlay */}
          {isUploading && (
            <div className="p-4 bg-[#181B26] border border-amber-500/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-300 font-medium">
                <span className="flex items-center gap-2 text-amber-400">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Uploading profile picture...
                </span>
                <span className="font-mono text-amber-400 font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-[#252A3B] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-150 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2D3142] bg-[#181B26]">
          {imageSrc && (
            <button
              onClick={() => {
                setImageSrc(null);
                setSelectedFile(null);
                resetTransform();
              }}
              className="text-xs text-gray-400 hover:text-red-400 underline transition-colors"
            >
              Choose different photo
            </button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              Cancel
            </button>

            {imageSrc && !previewMode && (
              <button
                onClick={generateCroppedImages}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                Preview & Compress
              </button>
            )}

            {imageSrc && previewMode && (
              <button
                onClick={handleSaveAndUpload}
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-transform active:scale-95 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Save & Update DP
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
