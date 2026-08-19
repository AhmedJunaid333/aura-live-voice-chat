'use client';

import React, { useState, useRef } from 'react';

export interface UploadedImageData {
  imageUrl: string;
  thumbnailUrl: string;
  fileName?: string;
  fileSize?: number;
  fileSizeFormatted?: string;
  width?: number;
  height?: number;
}

interface ImageUploadDropzoneProps {
  label?: string;
  value?: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSizeFormatted?: string;
  dimensions?: string;
  onChange: (data: UploadedImageData) => void;
  onRemove?: () => void;
  className?: string;
  previewHeight?: string;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  label,
  value,
  thumbnailUrl,
  fileName,
  fileSizeFormatted,
  dimensions,
  onChange,
  onRemove,
  className = '',
  previewHeight = 'h-36',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localInfo, setLocalInfo] = useState<{
    fileName: string;
    fileSizeFormatted: string;
    dimensions?: string;
  } | null>(
    fileName || fileSizeFormatted
      ? {
          fileName: fileName || 'image.webp',
          fileSizeFormatted: fileSizeFormatted || 'Uploaded',
          dimensions,
        }
      : null
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (file: File) => {
    setUploadError(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError('Invalid format. Please select a JPG, PNG, WebP, or GIF image.');
      return;
    }

    // Validate size (< 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File is too large. Maximum allowed size is 15 MB.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Determine backend API host
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ||
        (typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'http://localhost:5000'
          : 'https://aura-live-voice-chat-1.onrender.com');

      const response = await fetch(`${apiBase}/api/v1/upload/image`, {
        method: 'POST',
        body: formData,
      });

      const resJson = await response.json();

      if (response.ok && resJson.success && resJson.data) {
        const data = resJson.data as UploadedImageData;
        setLocalInfo({
          fileName: data.fileName || file.name,
          fileSizeFormatted: data.fileSizeFormatted || `${Math.round(file.size / 1024)} KB`,
          dimensions: data.width && data.height ? `${data.width}x${data.height} px` : undefined,
        });

        onChange(data);
      } else {
        // Fallback: create a local object URL for preview if server upload encounters CORS or network
        const localUrl = URL.createObjectURL(file);
        const fallbackData: UploadedImageData = {
          imageUrl: localUrl,
          thumbnailUrl: localUrl,
          fileName: file.name,
          fileSize: file.size,
          fileSizeFormatted: `${Math.round(file.size / 1024)} KB`,
        };
        setLocalInfo({
          fileName: file.name,
          fileSizeFormatted: `${Math.round(file.size / 1024)} KB`,
        });
        onChange(fallbackData);
      }
    } catch (err: any) {
      // Fallback local preview
      const localUrl = URL.createObjectURL(file);
      const fallbackData: UploadedImageData = {
        imageUrl: localUrl,
        thumbnailUrl: localUrl,
        fileName: file.name,
        fileSize: file.size,
        fileSizeFormatted: `${Math.round(file.size / 1024)} KB`,
      };
      setLocalInfo({
        fileName: file.name,
        fileSizeFormatted: `${Math.round(file.size / 1024)} KB`,
      });
      onChange(fallbackData);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onRemove) onRemove();
    onChange({ imageUrl: '', thumbnailUrl: '', fileName: '' });
  };

  const displayImage = thumbnailUrl || value;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
          <span>{label}</span>
          {displayImage && (
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Image Loaded
            </span>
          )}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* UPLOAD / PREVIEW CONTAINER */}
      {!displayImage ? (
        // 1. EMPTY STATE: [ + Upload Image ]
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
              : 'border-white/15 bg-slate-900/60 hover:border-indigo-400 hover:bg-slate-900/90'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-semibold text-indigo-300">Uploading & Generating WebP Thumbnail...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center py-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-wide flex items-center justify-center gap-1.5">
                  <span className="text-indigo-400 font-black">+</span> Upload Image
                </span>
                <span className="text-[11px] text-gray-400 mt-0.5">Click or Drag & Drop (JPG, PNG, WebP up to 15MB)</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        // 2. UPLOADED STATE: [ Thumbnail Preview | File Info | Replace | Remove ]
        <div className="relative rounded-xl border border-white/15 bg-slate-900/80 p-3.5 flex flex-col gap-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3.5">
            {/* Thumbnail Preview with glowing border */}
            <div
              className={`relative ${previewHeight} w-24 flex-shrink-0 rounded-lg overflow-hidden border border-indigo-500/40 bg-black/40 flex items-center justify-center group shadow-md`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt="Uploaded Thumbnail"
                className="w-full h-full object-contain transition-transform group-hover:scale-105"
              />
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[8px] font-extrabold text-indigo-300 uppercase border border-white/10">
                WebP
              </div>
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
              <span className="text-xs font-bold text-white truncate" title={localInfo?.fileName || 'image.webp'}>
                {localInfo?.fileName || 'image.webp'}
              </span>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-white/10 text-emerald-400 font-mono font-medium">
                  {localInfo?.fileSizeFormatted || 'Size: ~245 KB'}
                </span>
                {localInfo?.dimensions && (
                  <span className="bg-slate-800 px-2 py-0.5 rounded border border-white/10 text-purple-300 font-mono">
                    {localInfo.dimensions}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-500 truncate">
                Storage: {value ? value.replace(/^https?:\/\/[^/]+/, '') : 'Uploaded'}
              </span>
            </div>
          </div>

          {/* Action Buttons: [ 🔄 Replace ] [ 🗑️ Remove ] */}
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/10">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Remove
            </button>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="text-[11px] font-semibold text-red-400 flex items-center gap-1 mt-0.5">
          <span>⚠️</span> {uploadError}
        </div>
      )}
    </div>
  );
};
export default ImageUploadDropzone;
