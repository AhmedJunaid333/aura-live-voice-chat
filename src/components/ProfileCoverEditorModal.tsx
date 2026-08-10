import React, { useState, useRef, useCallback } from 'react';
import { 
  Camera, Image as ImageIcon, Sparkles, Sliders, Eye, RotateCw, ZoomIn, ZoomOut, 
  Check, X, Layers, Sun, ShieldCheck, Palette, RefreshCw
} from 'lucide-react';
import { toast } from '../services/toastAndErrorService';

export interface ProfileCoverEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoverUrl?: string;
  onSaveCover: (coverUrl: string) => void;
}

export const PRESET_THEMES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
];

export const ProfileCoverEditorModal: React.FC<ProfileCoverEditorModalProps> = ({
  isOpen,
  onClose,
  currentCoverUrl,
  onSaveCover
}) => {
  const [coverSrc, setCoverSrc] = useState<string | null>(currentCoverUrl || null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [blur, setBlur] = useState<number>(0);
  const [darkOverlay, setDarkOverlay] = useState<number>(30); // 0 to 80%
  const [gradientOverlay, setGradientOverlay] = useState<boolean>(true);
  
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size exceeds 10 MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverSrc(e.target?.result as string);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      toast.success('Cover image loaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!coverSrc) return;
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

  const handleSave = () => {
    if (!coverSrc) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSaveCover(coverSrc);
      toast.success('Background profile cover updated!');
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#12141D] border border-[#2D3142] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3142] bg-[#181B26]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                Profile Album Cover Editor
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                  Step 2 Cover
                </span>
              </h3>
              <p className="text-xs text-gray-400">Reposition, zoom, blur & apply overlays for profile header</p>
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
          
          {/* Interactive Cover Canvas Header Preview */}
          <div 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative w-full h-52 bg-black rounded-2xl overflow-hidden border border-[#2D3142] cursor-grab active:cursor-grabbing select-none"
          >
            {coverSrc ? (
              <img
                src={coverSrc}
                alt="Cover Header"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  filter: `blur(${blur}px)`,
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                }}
                className="w-full h-full object-cover max-w-none pointer-events-none"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 text-gray-400 space-y-2">
                <ImageIcon className="w-10 h-10 text-purple-400" />
                <span className="text-xs">No cover image selected</span>
              </div>
            )}

            {/* Dark & Gradient Shaders */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity"
              style={{ backgroundColor: `rgba(0,0,0,${darkOverlay / 100})` }}
            />
            {gradientOverlay && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#12141D] via-transparent to-black/30 pointer-events-none" />
            )}

            {/* Mock Profile Header Content Overlay */}
            <div className="absolute bottom-3 left-4 flex items-center gap-3 pointer-events-none">
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-500/20 flex items-center justify-center font-bold text-amber-300 shadow-md">
                AU
              </div>
              <div>
                <span className="text-sm font-bold text-white shadow-sm flex items-center gap-1.5">
                  Aura Host Profile
                  <span className="text-[10px] bg-amber-500/80 text-black font-extrabold px-1.5 py-0.2 rounded-full">VIP 10</span>
                </span>
                <p className="text-[11px] text-gray-300 shadow-sm">Cover Header Real Preview</p>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="space-y-4 bg-[#181B26] p-4 rounded-2xl border border-[#2D3142]">
            
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-300 font-medium w-16">Zoom:</span>
              <ZoomOut className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="1"
                max="4"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
              />
              <ZoomIn className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-300 font-mono w-10">{zoom.toFixed(1)}x</span>
            </div>

            {/* Blur Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-300 font-medium w-16">Blur:</span>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={blur}
                onChange={(e) => setBlur(parseFloat(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
              />
              <span className="text-xs text-gray-300 font-mono w-10">{blur}px</span>
            </div>

            {/* Dark Overlay Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-300 font-medium w-16">Dimming:</span>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={darkOverlay}
                onChange={(e) => setDarkOverlay(parseInt(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
              />
              <span className="text-xs text-gray-300 font-mono w-10">{darkOverlay}%</span>
            </div>

            {/* Toggle Gradient */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-gray-300 font-medium">Gradient Overlay</span>
              <button
                onClick={() => setGradientOverlay(!gradientOverlay)}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  gradientOverlay ? 'bg-purple-500' : 'bg-gray-700'
                }`}
              >
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-transform ${
                  gradientOverlay ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Preset Themes Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-300">Choose Preset App Themes:</span>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_THEMES.map((themeUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCoverSrc(themeUrl);
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  className="h-16 rounded-xl overflow-hidden border border-[#2D3142] hover:border-purple-400 transition-transform hover:scale-105"
                >
                  <img src={themeUrl} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Upload Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#252A3B] hover:bg-[#32384D] text-white font-medium text-xs rounded-xl border border-[#3A415A] transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-purple-400" />
              Upload from Gallery
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2D3142] bg-[#181B26]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !coverSrc}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Save Background Cover
          </button>
        </div>

      </div>
    </div>
  );
};
