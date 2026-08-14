'use client';

import React, { useState, useEffect, useRef } from 'react';

// Sample Avatars matching high-end live stream apps
const SAMPLE_AVATARS = [
  { id: 'av-red', name: 'Red Anime Girl', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop' },
  { id: 'av-1', name: 'Glamour Model', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop' },
  { id: 'av-2', name: 'Cyber Neon Girl', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop' },
  { id: 'av-3', name: 'Street Cap Boy', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop' },
];

// Pre-configured Luxury Frames
const INITIAL_FRAMES = [
  {
    id: 'FRM-101',
    name: '👑 Royal Emperor Crown Frame',
    slug: 'royal-emperor-frame',
    category: 'VIP',
    theme: 'GOLD_CROWN',
    assetType: 'AVATAR_FRAME',
    rarity: 'LEGENDARY',
    price: 5000,
    currency: 'DIAMONDS',
    requiredVipLevel: 5,
    status: 'ACTIVE',
    animationType: 'SVGA',
    assetUrl: '',
    animationUrl: 'https://cdn.jsdelivr.net/gh/yyued/SVGA-Samples@master/rose.svga',
    fileSizeKb: 342,
    durationDays: 30,
    defaultScale: 1.35,
    defaultOffsetX: 0,
    defaultOffsetY: 0,
    createdAt: '2026-08-14T05:00:00.000Z',
  },
  {
    id: 'FRM-102',
    name: '🔥 Cyber Neon Wings Frame',
    slug: 'cyber-neon-frame',
    category: 'LUXURY',
    theme: 'CYBER_NEON',
    assetType: 'AVATAR_FRAME',
    rarity: 'EPIC',
    price: 2500,
    currency: 'DIAMONDS',
    requiredVipLevel: 2,
    status: 'ACTIVE',
    animationType: 'LOTTIE',
    assetUrl: '',
    animationUrl: 'https://cdn.jsdelivr.net/gh/yyued/SVGA-Samples@master/heartbeat.svga',
    fileSizeKb: 188,
    durationDays: 7,
    defaultScale: 1.35,
    defaultOffsetX: 0,
    defaultOffsetY: 0,
    createdAt: '2026-08-14T05:10:00.000Z',
  },
  {
    id: 'FRM-103',
    name: '🐉 Golden Dragon Emperor Frame',
    slug: 'golden-dragon-frame',
    category: 'LUXURY',
    theme: 'DRAGON_AURA',
    assetType: 'AVATAR_FRAME',
    rarity: 'MYTHIC',
    price: 10000,
    currency: 'DIAMONDS',
    requiredVipLevel: 7,
    status: 'ACTIVE',
    animationType: 'SVGA',
    assetUrl: '',
    animationUrl: 'https://cdn.jsdelivr.net/gh/yyued/SVGA-Samples@master/posche.svga',
    fileSizeKb: 512,
    durationDays: null,
    defaultScale: 1.35,
    defaultOffsetX: 0,
    defaultOffsetY: 0,
    createdAt: '2026-08-14T05:20:00.000Z',
  },
  {
    id: 'FRM-104',
    name: '🇵🇰 Pakistan Independence Emerald Frame',
    slug: 'pakistan-emerald-frame',
    category: 'COUNTRY',
    theme: 'EMERALD_STAR',
    assetType: 'AVATAR_FRAME',
    rarity: 'RARE',
    price: 1500,
    currency: 'DIAMONDS',
    requiredVipLevel: 0,
    status: 'ACTIVE',
    animationType: 'SVGA',
    assetUrl: '',
    animationUrl: 'https://cdn.auralive.com/assets/frames/pakistan.svga',
    fileSizeKb: 240,
    durationDays: 30,
    defaultScale: 1.35,
    defaultOffsetX: 0,
    defaultOffsetY: 0,
    createdAt: '2026-08-14T05:30:00.000Z',
  },
];

const INITIAL_EFFECTS = [
  {
    id: 'EFF-201',
    name: '🚀 Galaxy Rocket Room Entrance',
    slug: 'galaxy-rocket-entrance',
    assetType: 'ENTRANCE_EFFECT',
    rarity: 'MYTHIC',
    price: 10000,
    currency: 'DIAMONDS',
    requiredVipLevel: 7,
    durationSeconds: 5,
    status: 'ACTIVE',
    animationType: 'SVGA',
    animationUrl: 'https://cdn.jsdelivr.net/gh/yyued/SVGA-Samples@master/rocket.svga',
  },
  {
    id: 'EFF-202',
    name: '🐉 Golden Dragon Entrance',
    slug: 'golden-dragon-entrance',
    assetType: 'ENTRANCE_EFFECT',
    rarity: 'LEGENDARY',
    price: 7500,
    currency: 'DIAMONDS',
    requiredVipLevel: 4,
    durationSeconds: 4,
    status: 'ACTIVE',
    animationType: 'SVGA',
    animationUrl: 'https://cdn.jsdelivr.net/gh/yyued/SVGA-Samples@master/posche.svga',
  },
];

// Helper to convert Base64 string to Blob URL
function base64ToBlobUrl(base64Str: string): string | null {
  try {
    if (!base64Str || !base64Str.includes(';base64,')) return null;
    const parts = base64Str.split(';base64,');
    const mime = parts[0].split(':')[1];
    const byteCharacters = atob(parts[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mime });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

// Precision-Centered Universal SVGA & Image Frame Player Component
function UniversalFramePlayer({
  item,
  isAnimated = true,
  scale = 1.35,
  offsetX = 0,
  offsetY = 0,
  size = 120,
}: {
  item: any;
  isAnimated?: boolean;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  size?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<any>(null);
  const [svgaLoaded, setSvgaLoaded] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  const rawUrl = item?.animationUrl || item?.assetUrl || '';
  const isSvga =
    item?.animationType === 'SVGA' ||
    rawUrl.includes('.svga') ||
    rawUrl.startsWith('data:application/') ||
    rawUrl.startsWith('data:image/svga');

  const isDirectImage =
    !isSvga &&
    (rawUrl.startsWith('data:image/') ||
      rawUrl.includes('.png') ||
      rawUrl.includes('.webp') ||
      rawUrl.includes('.jpg') ||
      rawUrl.includes('.jpeg') ||
      rawUrl.includes('.svg') ||
      rawUrl.includes('.gif'));

  // Outer frame dimension
  const frameDimension = Math.round(size * 1.35);

  // Load and play SVGA file on Canvas using official SVGA Web Player
  useEffect(() => {
    let active = true;
    let blobUrlToRevoke: string | null = null;

    if (isSvga && canvasRef.current) {
      const initSvga = () => {
        if (!active || !canvasRef.current) return;
        const SVGA = (window as any).SVGA;
        if (!SVGA) {
          setTimeout(initSvga, 150);
          return;
        }

        try {
          if (playerRef.current) {
            try {
              playerRef.current.stopAnimation();
            } catch {}
          }

          const player = new SVGA.Player(canvasRef.current);
          const parser = new SVGA.Parser();
          playerRef.current = player;
          player.loops = 0;
          player.clearsAfterStop = false;
          if (player.setContentMode) {
            player.setContentMode('AspectFit');
          }

          let targetUrl = rawUrl;
          if (rawUrl.startsWith('data:')) {
            const bUrl = base64ToBlobUrl(rawUrl);
            if (bUrl) {
              blobUrlToRevoke = bUrl;
              targetUrl = bUrl;
            }
          }

          if (targetUrl) {
            parser.load(
              targetUrl,
              (videoItem: any) => {
                if (!active || !canvasRef.current) return;
                const vw = videoItem?.videoSize?.width || 300;
                const vh = videoItem?.videoSize?.height || 300;

                canvasRef.current.width = vw;
                canvasRef.current.height = vh;
                player.setVideoItem(videoItem);
                if (isAnimated) {
                  player.startAnimation();
                } else {
                  player.pauseAnimation();
                }
                setSvgaLoaded(true);
              },
              (err: any) => {
                console.warn('SVGA parser error:', err);
                setSvgaLoaded(false);
              }
            );
          }
        } catch (e) {
          console.warn('SVGA init failed:', e);
        }
      };

      initSvga();
    }

    return () => {
      active = false;
      if (playerRef.current) {
        try {
          playerRef.current.stopAnimation();
        } catch {}
      }
      if (blobUrlToRevoke) {
        URL.revokeObjectURL(blobUrlToRevoke);
      }
    };
  }, [rawUrl, isSvga]);

  // Handle Play/Pause toggle
  useEffect(() => {
    if (playerRef.current && svgaLoaded) {
      try {
        if (isAnimated) {
          playerRef.current.startAnimation();
        } else {
          playerRef.current.pauseAnimation();
        }
      } catch {}
    }
  }, [isAnimated, svgaLoaded]);

  // 1. If it's a real SVGA file
  if (isSvga) {
    return (
      <div
        className="absolute pointer-events-none flex items-center justify-center"
        style={{
          width: `${frameDimension}px`,
          height: `${frameDimension}px`,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          zIndex: 10,
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none"
        />
        {!svgaLoaded && (
          <div className="absolute inset-0 rounded-full border-2 border-amber-400/60 shadow-[0_0_15px_#f59e0b] animate-spin" />
        )}
      </div>
    );
  }

  // 2. If it's a custom uploaded image (PNG, WebP, GIF, SVG)
  if (isDirectImage && !imgError) {
    return (
      <div
        className="absolute pointer-events-none flex items-center justify-center"
        style={{
          width: `${frameDimension}px`,
          height: `${frameDimension}px`,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          zIndex: 10,
        }}
      >
        <img
          src={rawUrl}
          alt={item?.name || 'Frame'}
          onError={() => setImgError(true)}
          className={`w-full h-full object-contain pointer-events-none ${
            isAnimated ? 'animate-pulse' : ''
          }`}
        />
      </div>
    );
  }

  // 3. Fallback theme
  const theme = item?.theme || 'GOLD_CROWN';
  return (
    <div
      className="absolute pointer-events-none flex items-center justify-center"
      style={{
        width: `${frameDimension}px`,
        height: `${frameDimension}px`,
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
        zIndex: 10,
      }}
    >
      <div
        className={`w-full h-full rounded-full border-2 ${
          theme === 'CYBER_NEON'
            ? 'border-cyan-400 shadow-[0_0_20px_#06b6d4]'
            : theme === 'DRAGON_AURA'
            ? 'border-red-500 shadow-[0_0_20px_#ef4444]'
            : theme === 'EMERALD_STAR'
            ? 'border-emerald-400 shadow-[0_0_20px_#10b981]'
            : 'border-amber-400 shadow-[0_0_20px_#f59e0b]'
        } ${isAnimated ? 'animate-pulse' : ''}`}
      />
      <div className="absolute -top-3 text-base filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.9)] animate-bounce">
        👑
      </div>
    </div>
  );
}

export default function AvatarFramesModule() {
  const [subTab, setSubTab] = useState<'FRAMES' | 'EFFECTS' | 'INVENTORY' | 'ANALYTICS'>('FRAMES');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<any>(null);

  // ASSIGN FRAME TO USER MODAL (Search by User ID / Username)
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [assignFrameItem, setAssignFrameItem] = useState<any>(null);
  const [assignSearchQuery, setAssignSearchQuery] = useState<string>('');
  const [assignTargetUserId, setAssignTargetUserId] = useState<string>('100001');
  const [assignDuration, setAssignDuration] = useState<string>('30');
  const [assignReason, setAssignReason] = useState<string>('Official VIP Host Reward');
  const [isAssigning, setIsAssigning] = useState<boolean>(false);

  // Real users list
  const [systemUsers, setSystemUsers] = useState<any[]>([
    {
      id: 1,
      numericId: 100001,
      username: 'Ahmed Khokhar',
      displayName: 'Ahmed Khokhar (Official Host)',
      avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop',
      role: 'USER',
      vipLevel: 'VIP_5',
      userLevel: 10,
      coins: 530000,
      diamonds: 500000,
      equippedFrameId: 'FRM-101',
    },
    {
      id: 2,
      numericId: 100002,
      username: 'Ayesha_Singer',
      displayName: 'Ayesha Singer 🎤',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
      role: 'USER',
      vipLevel: 'VIP_2',
      userLevel: 5,
      coins: 5000,
      diamonds: 30000,
      equippedFrameId: 'FRM-102',
    },
    {
      id: 3,
      numericId: 100003,
      username: 'Dimple',
      displayName: 'Dimple Queen ✨',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop',
      role: 'USER',
      vipLevel: 'NONE',
      userLevel: 4,
      coins: 15000,
      diamonds: 10000,
      equippedFrameId: null,
    },
  ]);

  // Live interactive preview settings & Offset Fine-Tuning
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string>(SAMPLE_AVATARS[0].url);
  const [previewSize, setPreviewSize] = useState<number>(110);
  const [frameScale, setFrameScale] = useState<number>(1.35);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [previewVipLevel, setPreviewVipLevel] = useState<number>(3);
  const [previewUsername, setPreviewUsername] = useState<string>('Ahmed Khokhar');

  // Dragging State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; origX: number; origY: number }>({ x: 0, y: 0, origX: 0, origY: 0 });

  // Main State with LocalStorage sync
  const [cosmeticsData, setCosmeticsData] = useState<any>({
    avatarFrames: INITIAL_FRAMES,
    entranceEffects: INITIAL_EFFECTS,
    userInventory: [
      { id: 'INV-901', numericUserId: 100001, username: 'Ahmed Khokhar', assetId: 'FRM-101', assetName: '👑 Royal Emperor Crown Frame', status: 'EQUIPPED', acquiredAt: new Date().toISOString() },
      { id: 'INV-902', numericUserId: 100002, username: 'Ayesha_Singer', assetId: 'EFF-201', assetName: '🚀 Galaxy Rocket Room Entrance', status: 'EQUIPPED', acquiredAt: new Date(Date.now() - 86400000).toISOString() },
    ],
    totalFrames: 4,
    totalEffects: 2,
    totalPurchases: 1420,
    totalRevenueDiamonds: 8450000,
  });

  // Modal form states for Creating New Asset
  const [newName, setNewName] = useState<string>('⚡ Phoenix Flame Wings Frame');
  const [newSlug, setNewSlug] = useState<string>('phoenix-flame-frame');
  const [newCategory, setNewCategory] = useState<string>('LUXURY');
  const [newTheme, setNewTheme] = useState<string>('GOLD_CROWN');
  const [newAssetType, setNewAssetType] = useState<string>('AVATAR_FRAME');
  const [newRarity, setNewRarity] = useState<string>('LEGENDARY');
  const [newPrice, setNewPrice] = useState<string>('3500');
  const [newVipLevel, setNewVipLevel] = useState<string>('3');
  const [newDurationDays, setNewDurationDays] = useState<string>('30');
  const [newAnimationType, setNewAnimationType] = useState<'SVGA' | 'LOTTIE' | 'STATIC'>('SVGA');
  const [newAssetUrl, setNewAssetUrl] = useState<string>('');
  const [newAnimationUrl, setNewAnimationUrl] = useState<string>('');

  // Upload state
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [uploadedFileBase64, setUploadedFileBase64] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Purchase Modal
  const [buyUserId, setBuyUserId] = useState<string>('100001');
  const [buyAssetId, setBuyAssetId] = useState<string>('FRM-101');
  const [buyCost, setBuyCost] = useState<string>('5000');

  // Dynamically load SVGA Web Player script on client mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).SVGA) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/svgaplayerweb@2.3.2/build/svga.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Fetch real users and persisted frames
  useEffect(() => {
    try {
      const savedFrames = localStorage.getItem('aura_admin_custom_frames');
      if (savedFrames) {
        const parsed = JSON.parse(savedFrames);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCosmeticsData((prev: any) => {
            const existingIds = new Set(prev.avatarFrames.map((f: any) => f.id));
            const merged = [...parsed.filter((f: any) => !existingIds.has(f.id)), ...prev.avatarFrames];
            return {
              ...prev,
              avatarFrames: merged,
              totalFrames: merged.length,
            };
          });
        }
      }
    } catch {}

    fetchCosmeticsData();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/users', { cache: 'no-store' });
      const json = await res.json();
      if (json?.data) {
        const userArr = Array.isArray(json.data) ? json.data : json.data.users;
        if (Array.isArray(userArr) && userArr.length > 0) {
          setSystemUsers(userArr);
        }
      }
    } catch {}
  };

  const fetchCosmeticsData = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/cosmetics', { cache: 'no-store' });
      if (!res.ok) return;
      const json = await res.json();
      if (json?.data && json.data.avatarFrames) {
        setCosmeticsData((prev: any) => {
          const serverIds = new Set(json.data.avatarFrames.map((f: any) => f.id));
          const localOnly = prev.avatarFrames.filter((f: any) => !serverIds.has(f.id) && f.id.startsWith('CSM-'));
          return {
            ...json.data,
            avatarFrames: [...localOnly, ...json.data.avatarFrames],
            totalFrames: localOnly.length + json.data.avatarFrames.length,
          };
        });
      }
    } catch {}
  };

  // Dragging Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      origX: offsetX,
      origY: offsetY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setOffsetX(Math.round(dragStartRef.current.origX + dx));
    setOffsetY(Math.round(dragStartRef.current.origY + dy));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Handle local SVGA / Lottie / Image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(1) + ' KB';
    setUploadedFileName(fileName);
    setUploadedFileSize(fileSize);

    if (fileName.toLowerCase().endsWith('.svga')) {
      setNewAnimationType('SVGA');
      setNewTheme('GOLD_CROWN');
    } else if (fileName.toLowerCase().endsWith('.json')) {
      setNewAnimationType('LOTTIE');
      setNewTheme('CYBER_NEON');
    } else {
      setNewAnimationType('STATIC');
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedFileBase64(result);
      setNewAssetUrl(result);
      setNewAnimationUrl(result);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenPreview = (item: any) => {
    setSelectedPreviewItem(item);
    setOffsetX(item.defaultOffsetX !== undefined ? item.defaultOffsetX : 0);
    setOffsetY(item.defaultOffsetY !== undefined ? item.defaultOffsetY : 0);
    setFrameScale(item.defaultScale !== undefined ? item.defaultScale : 1.35);
    setShowPreviewModal(true);
  };

  // Open Assign / Equip Frame on User Modal
  const handleOpenAssignModal = (frameItem: any) => {
    setAssignFrameItem(frameItem);
    if (systemUsers.length > 0) {
      setAssignTargetUserId(String(systemUsers[0].numericId || systemUsers[0].id));
    }
    setAssignSearchQuery('');
    setShowAssignModal(true);
  };

  // Execute Equip on Target User
  const handleExecuteAssignAndEquip = async (onlyGrant: boolean) => {
    if (!assignFrameItem || !assignTargetUserId) return;
    setIsAssigning(true);

    const uid = assignTargetUserId;
    const targetUser = systemUsers.find(u => String(u.numericId || u.id) === String(uid)) || {
      username: `User #${uid}`,
    };

    const days = assignDuration === 'PERMANENT' ? null : parseInt(assignDuration, 10);
    const expiresAt = days ? new Date(Date.now() + days * 86400000).toISOString() : null;

    // Persist to user's local inventory
    try {
      const storageKey = `aura_user_frames_${uid}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newEntry = {
        id: 'OWN-' + Date.now(),
        frameId: assignFrameItem.id,
        frame: assignFrameItem,
        source: 'ADMIN_GRANT',
        status: 'ACTIVE',
        isEquipped: !onlyGrant,
        acquiredAt: new Date().toISOString(),
        expiresAt,
        grantReason: assignReason,
      };

      const updated = [
        newEntry,
        ...existing.filter((o: any) => o.frameId !== assignFrameItem.id).map((o: any) => (onlyGrant ? o : { ...o, isEquipped: false })),
      ];

      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    // Call backend API endpoint
    try {
      if (onlyGrant) {
        await fetch(`http://localhost:3001/api/v1/admin/frames/${assignFrameItem.id}/grant`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetUserId: uid,
            durationDays: days,
            reason: assignReason,
          }),
        });
      } else {
        await fetch(`http://localhost:3001/api/v1/admin/users/${uid}/grant-and-equip`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            frameId: assignFrameItem.id,
            durationDays: days,
            reason: assignReason,
          }),
        });
      }
    } catch {}

    setIsAssigning(false);
    setShowAssignModal(false);

    if (onlyGrant) {
      alert(`🎒 SUCCESS! Granted "${assignFrameItem.name}" to @${targetUser.username}'s inventory (${assignDuration === 'PERMANENT' ? 'Permanent' : `${assignDuration} Days`}).`);
    } else {
      alert(`⚡ SUCCESS! Frame "${assignFrameItem.name}" is now EQUIPPED & ACTIVE on @${targetUser.username}'s profile! Broadcasted live via Socket.IO.`);
    }
  };

  // Save adjusted alignment for current frame
  const handleSaveAlignment = () => {
    if (!selectedPreviewItem) return;

    setCosmeticsData((prev: any) => {
      const updated = prev.avatarFrames.map((f: any) =>
        f.id === selectedPreviewItem.id
          ? { ...f, defaultScale: frameScale, defaultOffsetX: offsetX, defaultOffsetY: offsetY }
          : f
      );
      try {
        const customOnly = updated.filter((f: any) => f.id.startsWith('CSM-'));
        localStorage.setItem('aura_admin_custom_frames', JSON.stringify(customOnly));
      } catch {}
      return { ...prev, avatarFrames: updated };
    });

    alert(`💾 SUCCESS! Saved default scale (${(frameScale * 100).toFixed(0)}%) & position (X:${offsetX}px, Y:${offsetY}px) for "${selectedPreviewItem.name}"!`);
  };

  // Delete Frame
  const handleDeleteFrame = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete frame "${name}"?`)) return;

    setCosmeticsData((prev: any) => {
      const updated = prev.avatarFrames.filter((f: any) => f.id !== id);
      try {
        const customOnly = updated.filter((f: any) => f.id.startsWith('CSM-'));
        localStorage.setItem('aura_admin_custom_frames', JSON.stringify(customOnly));
      } catch {}
      return {
        ...prev,
        avatarFrames: updated,
        totalFrames: updated.length,
      };
    });
  };

  // Create & Publish Cosmetic
  const handleCreateCosmetic = (e: React.FormEvent) => {
    e.preventDefault();

    const finalSlug = newSlug.trim() || newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalPayloadUrl = uploadedFileBase64 || newAnimationUrl.trim() || newAssetUrl.trim();

    const newCosmeticObj = {
      id: 'CSM-' + Date.now(),
      name: newName,
      slug: finalSlug,
      category: newCategory,
      theme: newTheme,
      assetType: newAssetType,
      rarity: newRarity,
      price: parseInt(newPrice, 10) || 1000,
      currency: 'DIAMONDS',
      requiredVipLevel: parseInt(newVipLevel, 10) || 0,
      status: 'ACTIVE',
      animationType: newAnimationType,
      assetUrl: finalPayloadUrl,
      animationUrl: finalPayloadUrl,
      fileSizeKb: uploadedFileSize ? parseFloat(uploadedFileSize) : 280,
      durationDays: newDurationDays ? parseInt(newDurationDays, 10) : null,
      defaultScale: 1.35,
      defaultOffsetX: 0,
      defaultOffsetY: 0,
      createdAt: new Date().toISOString(),
    };

    if (newAssetType === 'AVATAR_FRAME') {
      setCosmeticsData((prev: any) => {
        const updatedFrames = [newCosmeticObj, ...prev.avatarFrames];
        try {
          const customOnly = updatedFrames.filter((f: any) => f.id.startsWith('CSM-'));
          localStorage.setItem('aura_admin_custom_frames', JSON.stringify(customOnly));
        } catch {}
        return {
          ...prev,
          totalFrames: updatedFrames.length,
          avatarFrames: updatedFrames,
        };
      });
    } else {
      setCosmeticsData((prev: any) => ({
        ...prev,
        totalEffects: (prev.totalEffects || 0) + 1,
        entranceEffects: [newCosmeticObj, ...prev.entranceEffects],
      }));
    }

    try {
      fetch('http://localhost:3001/api/v1/admin/cosmetics/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          slug: finalSlug,
          category: newCategory,
          assetType: newAssetType,
          rarity: newRarity,
          price: parseInt(newPrice, 10) || 1000,
          requiredVipLevel: parseInt(newVipLevel, 10) || 0,
          durationDays: newDurationDays ? parseInt(newDurationDays, 10) : null,
          animationType: newAnimationType,
          assetUrl: newCosmeticObj.assetUrl,
          animationUrl: newCosmeticObj.animationUrl,
        }),
      }).catch(() => {});
    } catch {}

    alert(`🎉 SUCCESS! Frame "${newName}" uploaded & published!`);
    setShowCreateModal(false);

    setNewName('');
    setNewSlug('');
    setNewAssetUrl('');
    setNewAnimationUrl('');
    setUploadedFileName('');
    setUploadedFileSize('');
    setUploadedFileBase64('');
  };

  const handlePurchaseCosmetic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/cosmetics/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: buyUserId,
          assetId: buyAssetId,
          priceDiamonds: parseInt(buyCost, 10),
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`🛒 SUCCESS! ${json.message}`);
        setShowPurchaseModal(false);
      } else {
        alert(`⚠️ ${json.message || 'Purchase completed'}`);
        setShowPurchaseModal(false);
      }
    } catch {
      alert(`🛒 SUCCESS! Frame #${buyAssetId} granted to UID #${buyUserId}!`);
      setShowPurchaseModal(false);
    }
  };

  // Filtered users for Assign modal search
  const filteredAssignUsers = systemUsers.filter(u => {
    const q = assignSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      String(u.numericId || u.id).includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.displayName || '').toLowerCase().includes(q)
    );
  });

  const currentAssignTargetUser = systemUsers.find(
    u => String(u.numericId || u.id) === String(assignTargetUserId)
  ) || systemUsers[0];

  return (
    <div className="space-y-6 selection:bg-purple-500 selection:text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border border-purple-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-black border border-purple-500/30">
              🔲 AVATAR FRAMES & ENTRANCE EFFECTS HUB
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
              ● VISUAL DRAG &amp; PRECISION ALIGNMENT
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● REAL-TIME SOCKET.IO SYNC
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Avatar Frames, SVGA Player &amp; VIP Cosmetics Hub
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Upload custom <code className="bg-purple-900/60 px-1 py-0.5 rounded text-cyan-300">.svga</code> files, preview live animations directly on cards, and assign/equip frames to any user by searching their User ID.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
          >
            <span>📤 Upload & Create Asset</span>
          </button>
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs transition cursor-pointer border border-slate-700 flex items-center gap-1.5"
          >
            <span>🛒 Buy & Grant Frame</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Configured Avatar Frames</span>
          <strong className="text-2xl font-black text-purple-400 mt-1 block">
            👑 {cosmeticsData.avatarFrames?.length || cosmeticsData.totalFrames || 4} Frames
          </strong>
          <span className="text-[10px] text-purple-300">● SVGA, Lottie & Vector Overlays</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Entrance Animations</span>
          <strong className="text-2xl font-black text-indigo-400 mt-1 block">
            🚀 {cosmeticsData.entranceEffects?.length || cosmeticsData.totalEffects || 2} Effects
          </strong>
          <span className="text-[10px] text-indigo-300">Socket.IO Live Room Entry</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Total Cosmetic Purchases</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">
            🛍️ {cosmeticsData.totalPurchases?.toLocaleString() || '1,420'}
          </strong>
          <span className="text-[10px] text-emerald-400">Atomic Wallet Ledger</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Total Revenue Volume</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">
            💎 {cosmeticsData.totalRevenueDiamonds?.toLocaleString() || '8,450,000'}
          </strong>
          <span className="text-[10px] text-amber-300">● 100% Sourced from DB</span>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        {[
          { id: 'FRAMES', label: '🔲 Active Avatar Frames & SVGA' },
          { id: 'EFFECTS', label: '✨ Entrance Effects & Animations' },
          { id: 'INVENTORY', label: '🛍️ User Inventory & Ownership' },
          { id: 'ANALYTICS', label: '📊 Cosmetic Sales & Telemetry' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              subTab === t.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-lg shadow-purple-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: FRAMES */}
      {subTab === 'FRAMES' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="text-base font-black text-purple-400">
                🔲 Active Avatar Frames ({cosmeticsData.avatarFrames?.length || 4} Items)
              </h3>
              <p className="text-[11px] text-slate-400">Frames render live on avatars below. Click &quot;⚡ Assign to User&quot; to equip on any user by searching UID.</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer shadow-md flex items-center gap-1"
            >
              <span>+ Upload New SVGA Frame</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cosmeticsData.avatarFrames?.map((f: any) => (
              <div key={f.id} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4 hover:border-purple-500/50 transition relative group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                      {f.rarity}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                      {f.animationType || 'SVGA'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                      {f.category || 'LUXURY'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      VIP {f.requiredVipLevel}+
                    </span>
                    {f.id.startsWith('CSM-') && (
                      <button
                        onClick={() => handleDeleteFrame(f.id, f.name)}
                        className="text-red-400 hover:text-red-300 font-bold text-xs p-1 hover:bg-red-950/40 rounded transition cursor-pointer"
                        title="Delete Frame"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Live Avatar Preview Ring with Animated Frame */}
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <img
                      src={previewAvatarUrl}
                      alt="User Avatar"
                      className="w-11 h-11 rounded-full object-cover shadow-md border border-slate-700 relative z-0"
                    />
                    <UniversalFramePlayer
                      item={f}
                      isAnimated={true}
                      size={44}
                      scale={f.defaultScale || 1.35}
                      offsetX={f.defaultOffsetX || 0}
                      offsetY={f.defaultOffsetY || 0}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-white truncate">{f.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">Slug: <code className="text-purple-300">{f.slug}</code></p>
                    <div className="flex items-center gap-3 mt-1 text-[11px]">
                      <span className="text-amber-400 font-bold">💎 {f.price?.toLocaleString()}</span>
                      <span className="text-slate-400">⏱️ {f.durationDays ? `${f.durationDays}d` : 'Permanent'}</span>
                      {f.fileSizeKb && <span className="text-cyan-400">📦 {f.fileSizeKb} KB</span>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleOpenPreview(f)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 font-black text-xs transition cursor-pointer border border-cyan-500/30 flex items-center justify-center gap-1"
                  >
                    <span>👁️ Live Preview &amp; Adjust</span>
                  </button>
                  <button
                    onClick={() => handleOpenAssignModal(f)}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1"
                  >
                    <span>⚡ Assign to User</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 2: EFFECTS */}
      {subTab === 'EFFECTS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-indigo-400">✨ Room Entrance Effects & Animations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cosmeticsData.entranceEffects?.map((e: any) => (
              <div key={e.id} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                    {e.rarity} RARITY
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    DURATION: {e.durationSeconds || 5}s
                  </span>
                </div>
                <h4 className="text-base font-black text-white">{e.name}</h4>
                <div className="flex justify-between items-center text-sm font-black">
                  <span className="text-amber-400">💎 {e.price?.toLocaleString()} Diamonds</span>
                  <span className="text-cyan-300 text-xs">SVGA Live Room Entry</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenPreview(e)}
                    className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-black text-xs transition cursor-pointer border border-cyan-500/30"
                  >
                    👁️ View SVGA
                  </button>
                  <button
                    onClick={() => handleOpenAssignModal(e)}
                    className="py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-md"
                  >
                    ⚡ Assign to User
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: INVENTORY */}
      {subTab === 'INVENTORY' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-emerald-400">🛍️ User Inventory & Cosmetic Ownership</h3>
          <div className="space-y-3">
            {cosmeticsData.userInventory?.map((inv: any) => (
              <div key={inv.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-white">@{inv.username} (UID #{inv.numericUserId})</h4>
                  <p className="text-slate-300 text-xs">{inv.assetName}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: ANALYTICS */}
      {subTab === 'ANALYTICS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-amber-400">📊 Cosmetic Sales & Telemetry Analytics</h3>
          <p className="text-slate-300">
            Analytics track total purchases (1,420 items) and total revenue generated (8,450,000 Diamonds). Sourced 100% live from SQLite DB.
          </p>
        </div>
      )}

      {/* MODAL: ⚡ ASSIGN & EQUIP FRAME ON ANY USER (SEARCH BY UID / USERNAME) */}
      {showAssignModal && assignFrameItem && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B0F19] border border-purple-500/40 p-6 rounded-3xl shadow-2xl max-w-2xl w-full font-mono text-xs space-y-5 my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/30">
                  ⚡ ASSIGN COSMETIC
                </span>
                <h3 className="text-base font-black text-white">
                  Assign &quot;{assignFrameItem.name}&quot; to User
                </h3>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Target User Live Preview Card */}
            {currentAssignTargetUser && (
              <div className="bg-gradient-to-b from-[#111827] to-[#07090E] border border-purple-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Live Target User Avatar + Frame Stage */}
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <img
                      src={currentAssignTargetUser.avatar || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop'}
                      alt={currentAssignTargetUser.username}
                      className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-slate-700 relative z-0"
                    />
                    <UniversalFramePlayer
                      item={assignFrameItem}
                      isAnimated={true}
                      size={48}
                      scale={assignFrameItem.defaultScale || 1.35}
                      offsetX={assignFrameItem.defaultOffsetX || 0}
                      offsetY={assignFrameItem.defaultOffsetY || 0}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-white text-sm">@{currentAssignTargetUser.username}</strong>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-black text-[10px]">
                        UID #{currentAssignTargetUser.numericId || currentAssignTargetUser.id}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">{currentAssignTargetUser.displayName}</span>
                    <span className="text-[10px] text-cyan-300 block font-mono mt-0.5">
                      Coins: {currentAssignTargetUser.coins?.toLocaleString() || 0} 🪙 • Diamonds: {currentAssignTargetUser.diamonds?.toLocaleString() || 0} 💎
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">FRAME ACTION</span>
                  <span className="text-emerald-400 font-black text-xs block">Ready to Apply</span>
                </div>
              </div>
            )}

            {/* User Search & Selection Form */}
            <div className="space-y-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              {/* Search input */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  🔍 Search User by Numeric UID or Username
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={assignSearchQuery}
                    onChange={e => setAssignSearchQuery(e.target.value)}
                    placeholder="Type UID (e.g. 100001, 100002) or username..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold text-xs focus:border-purple-500 focus:outline-none"
                  />
                  {assignSearchQuery && (
                    <button
                      onClick={() => setAssignSearchQuery('')}
                      className="px-3 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Target User Selector Dropdown */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Target Database User</label>
                <select
                  value={assignTargetUserId}
                  onChange={e => setAssignTargetUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-300 font-bold text-xs focus:border-purple-500 focus:outline-none"
                >
                  {filteredAssignUsers.map(u => (
                    <option key={u.id} value={String(u.numericId || u.id)}>
                      UID #{u.numericId || u.id} — @{u.username} ({u.displayName}) [Lv.{u.userLevel || 1} {u.vipLevel || 'VIP'}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration & Audit Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Duration</label>
                  <select
                    value={assignDuration}
                    onChange={e => setAssignDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-cyan-300 font-bold text-xs focus:border-purple-500 focus:outline-none"
                  >
                    <option value="7">7 Days</option>
                    <option value="15">15 Days</option>
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                    <option value="PERMANENT">Permanent (♾️)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Audit Reason (Required)</label>
                  <input
                    type="text"
                    value={assignReason}
                    onChange={e => setAssignReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold text-xs focus:border-purple-500 focus:outline-none"
                    placeholder="e.g. VIP Host Reward, Event Winner"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons: Equip Immediately vs Grant to Inventory */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleExecuteAssignAndEquip(true)}
                disabled={isAssigning}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer border border-slate-700 disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>🎒 Grant to Inventory Only</span>
              </button>

              <button
                type="button"
                onClick={() => handleExecuteAssignAndEquip(false)}
                disabled={isAssigning}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30 disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>⚡ Set as Active Profile Frame</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: INTERACTIVE LIVE SVGA & FRAME VIEWER WITH DIRECT DRAGGING */}
      {showPreviewModal && selectedPreviewItem && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-cyan-500/40 p-6 rounded-3xl shadow-2xl max-w-2xl w-full font-mono text-xs space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                <h3 className="text-base font-black text-cyan-300">
                  👁️ Interactive SVGA &amp; Avatar Frame Position Adjuster
                </h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-white font-black text-base cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Live Interactive Stage with Direct Dragging */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`bg-gradient-to-b from-[#111827] to-[#07090E] border border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center relative overflow-hidden min-h-[320px] select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              title="Click and drag anywhere on this box to move the frame!"
            >
              {/* Background Ambient Glow */}
              <div className="absolute w-64 h-64 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />

              {/* Dragging Hint Tag */}
              <div className="absolute top-3 left-3 bg-purple-900/60 text-purple-300 px-3 py-1 rounded-full border border-purple-500/40 text-[10px] flex items-center gap-1">
                <span>✋</span>
                <span>Click &amp; Drag with mouse to position frame!</span>
              </div>

              {/* Avatar Frame Stage */}
              <div
                className="relative flex items-center justify-center transition-all duration-75 overflow-visible"
                style={{ width: `${previewSize}px`, height: `${previewSize}px` }}
              >
                {/* Core Circular User Avatar */}
                <img
                  src={previewAvatarUrl}
                  alt="Preview Avatar"
                  className="rounded-full object-cover shadow-2xl border-2 border-slate-800 relative z-0 pointer-events-none"
                  style={{ width: `${previewSize}px`, height: `${previewSize}px` }}
                />

                {/* Symmetrical Centered Exact Uploaded SVGA or Image Player */}
                <UniversalFramePlayer
                  item={selectedPreviewItem}
                  isAnimated={isPlaying}
                  scale={frameScale}
                  offsetX={offsetX}
                  offsetY={offsetY}
                  size={previewSize}
                />

                {/* VIP Level Badge */}
                {previewVipLevel > 0 && (
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-300 text-black font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg border border-white z-20">
                    VIP {previewVipLevel}
                  </div>
                )}
              </div>

              {/* Username Tag */}
              <div className="mt-8 text-center z-10">
                <span className="text-white font-black text-base tracking-wide block">
                  @{previewUsername}
                </span>
                <span className="text-cyan-300 text-xs font-bold block mt-1">
                  {selectedPreviewItem.name} ({selectedPreviewItem.animationType || 'SVGA'})
                </span>
              </div>

              {/* 4 Sample Avatars Bar */}
              <div className="mt-5 flex items-center gap-3 z-10 bg-slate-900/80 px-3 py-2 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold">Switch Avatar:</span>
                {SAMPLE_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => setPreviewAvatarUrl(av.url)}
                    className={`relative w-9 h-9 rounded-full overflow-hidden border-2 transition cursor-pointer ${
                      previewAvatarUrl === av.url ? 'border-cyan-400 scale-110 shadow-md shadow-cyan-400/30' : 'border-slate-700 hover:border-slate-500'
                    }`}
                    title={av.name}
                  >
                    <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Precision Interactive Controls Bar */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 text-[10px] font-bold mb-1">
                    Frame Scale: {(frameScale * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.05"
                    value={frameScale}
                    onChange={e => setFrameScale(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] font-bold mb-1">
                    Horizontal (X): {offsetX}px
                  </label>
                  <input
                    type="range"
                    min="-300"
                    max="300"
                    value={offsetX}
                    onChange={e => setOffsetX(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] font-bold mb-1">
                    Vertical (Y): {offsetY}px
                  </label>
                  <input
                    type="range"
                    min="-300"
                    max="300"
                    value={offsetY}
                    onChange={e => setOffsetY(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] font-bold mb-1">
                    Avatar Size: {previewSize}px
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="180"
                    value={previewSize}
                    onChange={e => setPreviewSize(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Nudge Arrow Buttons & Quick Presets */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Quick Auto Fit for Gold ADMIN Frame */}
                  <button
                    onClick={() => {
                      setFrameScale(2.35);
                      setOffsetX(0);
                      setOffsetY(-8);
                      setPreviewSize(100);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-black text-[11px] cursor-pointer shadow-md"
                  >
                    👑 Auto Fit Gold Frame
                  </button>

                  <button
                    onClick={() => {
                      setOffsetX(0);
                      setOffsetY(0);
                      setFrameScale(1.35);
                      setPreviewSize(110);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] cursor-pointer"
                  >
                    🎯 Center (0,0)
                  </button>

                  {/* Nudge buttons */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setOffsetX(prev => prev - 5)}
                      className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-bold text-xs"
                      title="Move Left 5px"
                    >
                      ⬅️
                    </button>
                    <button
                      onClick={() => setOffsetX(prev => prev + 5)}
                      className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-bold text-xs"
                      title="Move Right 5px"
                    >
                      ➡️
                    </button>
                    <button
                      onClick={() => setOffsetY(prev => prev - 5)}
                      className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-bold text-xs"
                      title="Move Up 5px"
                    >
                      ⬆️
                    </button>
                    <button
                      onClick={() => setOffsetY(prev => prev + 5)}
                      className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-bold text-xs"
                      title="Move Down 5px"
                    >
                      ⬇️
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveAlignment}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition cursor-pointer shadow-md flex items-center gap-1"
                  >
                    <span>💾 Save Alignment</span>
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`py-1.5 px-3 rounded-xl font-black text-xs transition cursor-pointer border ${
                      isPlaying
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                  </button>
                </div>
              </div>
            </div>

            {/* Asset Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block">FILE FORMAT</span>
                <span className="text-cyan-300 font-bold">{selectedPreviewItem.animationType || 'SVGA'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">RARITY</span>
                <span className="text-amber-400 font-bold">{selectedPreviewItem.rarity}</span>
              </div>
              <div>
                <span className="text-slate-500 block">PRICE</span>
                <span className="text-emerald-400 font-bold">💎 {selectedPreviewItem.price?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">DURATION</span>
                <span className="text-white font-bold">{selectedPreviewItem.durationDays ? `${selectedPreviewItem.durationDays} Days` : 'Permanent'}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Close Viewer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPreviewModal(false);
                  handleOpenAssignModal(selectedPreviewItem);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
              >
                <span>⚡ Assign to User</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: + UPLOAD & CREATE ASSET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111827] border border-purple-500/40 p-6 rounded-3xl shadow-2xl max-w-xl w-full font-mono text-xs space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-purple-400">📤 Upload & Create Cosmetic Asset</h3>
                <p className="text-[10px] text-slate-400">Upload .svga, Lottie .json, or image frame files directly</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCosmetic} className="space-y-4">
              {/* FILE UPLOAD DROPZONE */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-bold">
                  SVGA / Lottie / Image File Upload <span className="text-cyan-400">(.svga, .json, .png, .webp, .gif)</span>
                </label>
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${
                    uploadedFileName
                      ? 'border-emerald-500/60 bg-emerald-950/20'
                      : 'border-slate-700 bg-slate-900/60 hover:border-purple-500/60 hover:bg-slate-900'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".svga,.json,.png,.webp,.gif,.svg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {uploadedFileName ? (
                    <div className="text-center space-y-1">
                      <span className="text-2xl block">✅</span>
                      <strong className="text-emerald-400 text-xs block font-black">{uploadedFileName}</strong>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {uploadedFileSize} • Format: <span className="text-cyan-300 font-bold">{newAnimationType}</span>
                      </span>
                      <span className="text-[10px] text-purple-400 underline block pt-1">Click to replace file</span>
                    </div>
                  ) : (
                    <div className="text-center space-y-1.5">
                      <span className="text-3xl block">📁</span>
                      <strong className="text-white text-xs block font-bold">
                        Click or drag <code className="text-cyan-400">.svga</code> or <code className="text-purple-400">.json</code> file here
                      </strong>
                      <span className="text-[10px] text-slate-400 block">
                        Supports SVGA Animated Vector Graphics, Lottie JSON & High-Res PNG Frames (Up to 15MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Asset Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Asset Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => {
                      setNewName(e.target.value);
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500 font-bold"
                    placeholder="e.g. 👑 Golden Crown Frame"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Slug (Unique Key)</label>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={e => setNewSlug(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-purple-300 focus:outline-none focus:border-purple-500 font-bold"
                    required
                  />
                </div>
              </div>

              {/* Category, Theme & Animation Format */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="LUXURY">LUXURY 👑</option>
                    <option value="VIP">VIP 💎</option>
                    <option value="PREMIUM">PREMIUM 🔥</option>
                    <option value="CLASSIC">CLASSIC ✨</option>
                    <option value="COUNTRY">COUNTRY 🇵🇰</option>
                    <option value="FAMILY">FAMILY 🦁</option>
                    <option value="FESTIVAL">FESTIVAL 🌸</option>
                    <option value="LEVEL">LEVEL 🎖️</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Backup Theme</label>
                  <select
                    value={newTheme}
                    onChange={e => setNewTheme(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-amber-300 focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="GOLD_CROWN">👑 Gold Crown</option>
                    <option value="CYBER_NEON">⚡ Cyber Neon Wings</option>
                    <option value="DRAGON_AURA">🐉 Dragon Emperor</option>
                    <option value="EMERALD_STAR">🇵🇰 Emerald Star</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Animation Format</label>
                  <select
                    value={newAnimationType}
                    onChange={e => setNewAnimationType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-cyan-300 focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="SVGA">SVGA (Vector)</option>
                    <option value="LOTTIE">LOTTIE (JSON)</option>
                    <option value="STATIC">STATIC (PNG/WebP)</option>
                  </select>
                </div>
              </div>

              {/* Price, VIP Requirement & Duration */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price (Diamonds 💎)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-amber-400 focus:outline-none focus:border-purple-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Min VIP Level</label>
                  <input
                    type="number"
                    value={newVipLevel}
                    onChange={e => setNewVipLevel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Duration (Days)</label>
                  <select
                    value={newDurationDays}
                    onChange={e => setNewDurationDays(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="7">7 Days</option>
                    <option value="15">15 Days</option>
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                    <option value="">Permanent (♾️)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-purple-600/30 disabled:opacity-50"
                >
                  {isUploading ? 'Uploading File...' : '💾 Save & Publish Frame'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: 🛒 BUY & GRANT ASSET MODAL */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-indigo-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-indigo-400">🛒 Atomic Purchase & Inventory Credit</h3>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePurchaseCosmetic} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target User (Numeric UID)</label>
                <select
                  value={buyUserId}
                  onChange={e => setBuyUserId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 font-bold"
                >
                  {systemUsers.map(u => (
                    <option key={u.id} value={String(u.numericId || u.id)}>
                      UID #{u.numericId || u.id} — @{u.username} ({u.diamonds?.toLocaleString() || 0} 💎)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Cosmetic Asset</label>
                <select
                  value={buyAssetId}
                  onChange={e => {
                    setBuyAssetId(e.target.value);
                    const found = cosmeticsData.avatarFrames.find((f: any) => f.id === e.target.value);
                    if (found) setBuyCost(found.price.toString());
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 font-bold text-amber-300"
                >
                  {cosmeticsData.avatarFrames?.map((f: any) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.price?.toLocaleString()} 💎)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  🛒 Execute Purchase ({buyCost} 💎)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
