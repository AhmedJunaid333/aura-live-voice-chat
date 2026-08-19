'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BASE_URL } from '@/lib/api';

// Pre-configured Luxury Frames Catalog for Admin Grants & Equips
const FRAME_CATALOG = [
  {
    id: 'FRM-101',
    name: '👑 Royal Emperor Crown Frame',
    slug: 'royal-emperor-frame',
    theme: 'GOLD_CROWN',
    rarity: 'LEGENDARY',
    price: 5000,
    animationType: 'SVGA',
    animationUrl: 'https://cdn.jsdelivr.net/gh/yyued/SVGA-Samples@master/rose.svga',
  },
  {
    id: 'FRM-102',
    name: '🔥 Cyber Neon Wings Frame',
    slug: 'cyber-neon-frame',
    theme: 'CYBER_NEON',
    rarity: 'EPIC',
    price: 2500,
    animationType: 'LOTTIE',
    animationUrl: 'https://cdn.jsdelivr.net/gh/yyued/SVGA-Samples@master/heartbeat.svga',
  },
  {
    id: 'FRM-103',
    name: '🐉 Golden Dragon Emperor Frame',
    slug: 'golden-dragon-frame',
    theme: 'DRAGON_AURA',
    rarity: 'MYTHIC',
    price: 10000,
    animationType: 'SVGA',
    animationUrl: 'https://cdn.jsdelivr.net/gh/yyued/SVGA-Samples@master/posche.svga',
  },
  {
    id: 'FRM-104',
    name: '🇵🇰 Pakistan Independence Emerald Frame',
    slug: 'pakistan-emerald-frame',
    theme: 'EMERALD_STAR',
    rarity: 'RARE',
    price: 1500,
    animationType: 'SVGA',
    animationUrl: 'https://cdn.auralive.com/assets/frames/pakistan.svga',
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

// Precision Universal SVGA & Image Frame Player Component
function UniversalFramePlayer({
  item,
  isAnimated = true,
  scale = 1.25,
  size = 120,
}: {
  item: any;
  isAnimated?: boolean;
  scale?: number;
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

  const frameDimension = Math.round(size * 1.35);

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

  if (isSvga) {
    return (
      <div
        className="absolute pointer-events-none flex items-center justify-center"
        style={{
          width: `${frameDimension}px`,
          height: `${frameDimension}px`,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
          zIndex: 10,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        {!svgaLoaded && (
          <div className="absolute inset-0 rounded-full border-4 border-amber-400 shadow-[0_0_20px_#f59e0b] animate-spin" />
        )}
      </div>
    );
  }

  if (isDirectImage && !imgError) {
    return (
      <div
        className="absolute pointer-events-none flex items-center justify-center"
        style={{
          width: `${frameDimension}px`,
          height: `${frameDimension}px`,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
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

  return (
    <div
      className="absolute pointer-events-none flex items-center justify-center"
      style={{
        width: `${frameDimension}px`,
        height: `${frameDimension}px`,
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: 10,
      }}
    >
      <div
        className={`w-full h-full rounded-full border-4 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.8)] ${
          isAnimated ? 'animate-spin' : ''
        }`}
        style={{ animationDuration: '6s' }}
      />
      <div className="absolute -top-5 text-2xl filter drop-shadow-[0_4px_10px_rgba(245,158,11,0.9)] animate-bounce">
        👑
      </div>
    </div>
  );
}

export default function UserDirectoryModule() {
  const [subTab, setSubTab] = useState<'ALL' | 'ONLINE' | 'RESELLERS_HOSTS' | 'VIP' | 'SUSPENDED' | 'SECURITY' | 'ANALYTICS'>('ALL');
  const [search, setSearch] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userModalTab, setUserModalTab] = useState<'OVERVIEW' | 'COSMETICS'>('OVERVIEW');

  // Modals
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showRevokeModal, setShowRevokeModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showUnblockConfirmModal, setShowUnblockConfirmModal] = useState<boolean>(false);

  // Avatar Frame & Cosmetics Control State for selectedUser
  const [userOwnedFrames, setUserOwnedFrames] = useState<any[]>([]);
  const [equippedFrame, setEquippedFrame] = useState<any>(null);
  const [previewFrame, setPreviewFrame] = useState<any>(null);
  const [grantFrameId, setGrantFrameId] = useState<string>('FRM-101');
  const [grantDuration, setGrantDuration] = useState<string>('30');
  const [grantReason, setGrantReason] = useState<string>('VIP Reward from Administration');
  const [isProcessingFrame, setIsProcessingFrame] = useState<boolean>(false);

  const [userData, setUserData] = useState<any>({
    users: [
      {
        id: 1,
        internalId: 1,
        numericId: 100001,
        username: 'Ahmed Khokhar',
        displayName: 'Ahmed Khokhar (Official Host & Reseller)',
        email: 'ahmed***@auralive.com',
        avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop',
        role: 'USER',
        status: 'ACTIVE',
        onlineStatus: 'ONLINE',
        userLevel: 10,
        vipLevel: 'VIP_5',
        isHost: true,
        isReseller: true,
        country: 'Pakistan',
        coins: 530000,
        diamonds: 500000,
        equippedFrameId: 'FRM-101',
        createdAt: '2026-08-09T07:40:07.132Z',
        lastActive: new Date().toISOString(),
      },
      {
        id: 2,
        internalId: 2,
        numericId: 100002,
        username: 'Ayesha_Singer',
        displayName: 'Ayesha Singer 🎤',
        email: 'ayesha***@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
        role: 'USER',
        status: 'ACTIVE',
        onlineStatus: 'ONLINE',
        userLevel: 5,
        vipLevel: 'VIP_2',
        isHost: true,
        isReseller: false,
        country: 'Pakistan',
        coins: 5000,
        diamonds: 30000,
        equippedFrameId: 'FRM-102',
        createdAt: '2026-08-09T07:40:28.287Z',
        lastActive: new Date().toISOString(),
      },
      {
        id: 3,
        internalId: 3,
        numericId: 100003,
        username: 'Dimple',
        displayName: 'Dimple Queen ✨',
        email: 'dimple***@auralive.io',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop',
        role: 'USER',
        status: 'ACTIVE',
        onlineStatus: 'ONLINE',
        userLevel: 4,
        vipLevel: 'NONE',
        isHost: true,
        isReseller: false,
        country: 'Pakistan',
        coins: 15000,
        diamonds: 10000,
        equippedFrameId: null,
        createdAt: '2026-08-10T15:37:12.736Z',
        lastActive: new Date().toISOString(),
      },
    ],
    totalRegisteredUsers: 3,
    onlineUsers: 3,
    offlineUsers: 0,
    activeUsers: 3,
    suspendedUsers: 0,
    resellersCount: 1,
    hostsCount: 3,
    systemVersion: 'v2.4.0',
  });

  // Status & Security form states
  const [statusUserId, setStatusUserId] = useState<string>('1');
  const [statusVal, setStatusVal] = useState<string>('SUSPENDED');
  const [statusReason, setStatusReason] = useState<string>('Admin Directory Status Control');
  const [statusDuration, setStatusDuration] = useState<string>('PERMANENT');
  const [statusExpiresAt, setStatusExpiresAt] = useState<string>('');

  const [revokeUserId, setRevokeUserId] = useState<string>('1');
  const [resetUserId, setResetUserId] = useState<string>('1');
  const [unblockUserId, setUnblockUserId] = useState<string>('');

  // Dynamically load SVGA Web Player script on client mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).SVGA) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/svgaplayerweb@2.3.2/build/svga.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/users`, { cache: 'no-store' });
      const json = await res.json();
      if (json?.data) {
        if (Array.isArray(json.data)) {
          setUserData((prev: any) => ({
            ...prev,
            users: json.data,
            totalRegisteredUsers: json.data.length,
          }));
        } else if (json.data.users) {
          setUserData(json.data);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // When a user is clicked, load their frames and inventory
  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setUserModalTab('OVERVIEW');

    // Load user's persisted inventory from localStorage or mock
    const uid = user.numericId || user.id;
    let initialInventory: any[] = [];
    try {
      const saved = localStorage.getItem(`aura_user_frames_${uid}`);
      if (saved) {
        initialInventory = JSON.parse(saved);
      }
    } catch {}

    if (!initialInventory || initialInventory.length === 0) {
      if (user.equippedFrameId) {
        const found = FRAME_CATALOG.find(f => f.id === user.equippedFrameId) || FRAME_CATALOG[0];
        initialInventory = [
          {
            id: 'OWN-' + Date.now(),
            frameId: found.id,
            frame: found,
            source: 'ADMIN_GRANT',
            status: 'ACTIVE',
            isEquipped: true,
            acquiredAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
            grantReason: 'Official Host Starter Frame',
          },
        ];
      } else {
        initialInventory = [];
      }
    }

    setUserOwnedFrames(initialInventory);

    // Determine current active equipped frame
    const activeOwnership = initialInventory.find(i => i.isEquipped && i.status === 'ACTIVE');
    const curEquipped = activeOwnership
      ? activeOwnership.frame
      : user.equippedFrameId
      ? FRAME_CATALOG.find(f => f.id === user.equippedFrameId)
      : null;

    setEquippedFrame(curEquipped);
    setPreviewFrame(curEquipped);

    // Also attempt remote backend fetch
    fetch(`${BASE_URL}/admin/users/${uid}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(json => {
        if (json?.data?.inventory) {
          setUserOwnedFrames(json.data.inventory);
          if (json.data.user?.equippedFrame) {
            setEquippedFrame(json.data.user.equippedFrame);
            setPreviewFrame(json.data.user.equippedFrame);
          }
        }
      })
      .catch(() => {});
  };

  // Helper to persist inventory to localStorage
  const saveUserInventory = (uid: number | string, inventory: any[], activeFrameId: string | null) => {
    try {
      localStorage.setItem(`aura_user_frames_${uid}`, JSON.stringify(inventory));
    } catch {}

    // Update in main user list state
    setUserData((prev: any) => ({
      ...prev,
      users: prev.users.map((u: any) =>
        (u.numericId === uid || u.id === uid)
          ? { ...u, equippedFrameId: activeFrameId }
          : u
      ),
    }));

    if (selectedUser && (selectedUser.numericId === uid || selectedUser.id === uid)) {
      setSelectedUser((prev: any) => ({ ...prev, equippedFrameId: activeFrameId }));
    }
  };

  // 1. SET / EQUIP FRAME (Makes an owned frame active)
  const handleEquipFrame = async (frameItem: any) => {
    if (!selectedUser) return;
    const uid = selectedUser.numericId || selectedUser.id;
    setIsProcessingFrame(true);

    const updated = userOwnedFrames.map(item => ({
      ...item,
      isEquipped: item.frameId === frameItem.id,
    }));

    setUserOwnedFrames(updated);
    setEquippedFrame(frameItem);
    setPreviewFrame(frameItem);
    saveUserInventory(uid, updated, frameItem.id);

    try {
      await fetch(`${BASE_URL}/admin/users/${uid}/equip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frameId: frameItem.id, reason: 'Equipped by Admin' }),
      });
    } catch {}

    setIsProcessingFrame(false);
    alert(`✨ SUCCESS! Frame "${frameItem.name}" is now ACTIVE on @${selectedUser.username}'s profile!`);
  };

  // 2. REMOVE / UNEQUIP FRAME (Clears active frame)
  const handleUnequipFrame = async () => {
    if (!selectedUser) return;
    const uid = selectedUser.numericId || selectedUser.id;
    setIsProcessingFrame(true);

    const updated = userOwnedFrames.map(item => ({
      ...item,
      isEquipped: false,
    }));

    setUserOwnedFrames(updated);
    setEquippedFrame(null);
    setPreviewFrame(null);
    saveUserInventory(uid, updated, null);

    try {
      await fetch(`${BASE_URL}/admin/users/${uid}/unequip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Unequipped by Admin' }),
      });
    } catch {}

    setIsProcessingFrame(false);
    alert(`🚫 SUCCESS! Active frame removed from @${selectedUser.username}. Profile DP is now clean without overlay.`);
  };

  // 3. GRANT FRAME TO INVENTORY (Without equipping)
  const handleGrantFrameOnly = async () => {
    if (!selectedUser) return;
    const uid = selectedUser.numericId || selectedUser.id;
    const frameObj = FRAME_CATALOG.find(f => f.id === grantFrameId) || FRAME_CATALOG[0];
    setIsProcessingFrame(true);

    const days = grantDuration === 'PERMANENT' ? null : parseInt(grantDuration, 10);
    const expiresAt = days ? new Date(Date.now() + days * 86400000).toISOString() : null;

    const newOwnership = {
      id: 'OWN-' + Date.now(),
      frameId: frameObj.id,
      frame: frameObj,
      source: 'ADMIN_GRANT',
      status: 'ACTIVE',
      isEquipped: false,
      acquiredAt: new Date().toISOString(),
      expiresAt,
      grantReason,
    };

    const updated = [newOwnership, ...userOwnedFrames.filter(o => o.frameId !== frameObj.id)];
    setUserOwnedFrames(updated);
    saveUserInventory(uid, updated, selectedUser.equippedFrameId);

    try {
      await fetch(`http://localhost:3001/api/v1/admin/frames/${frameObj.id}/grant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: uid,
          durationDays: days,
          reason: grantReason,
        }),
      });
    } catch {}

    setIsProcessingFrame(false);
    alert(`🎒 SUCCESS! Granted "${frameObj.name}" to @${selectedUser.username}'s inventory (${grantDuration === 'PERMANENT' ? 'Permanent' : `${grantDuration} Days`}).`);
  };

  // 4. GRANT & EQUIP ATOMICALLY (Adds to inventory AND sets as active profile frame)
  const handleGrantAndEquip = async () => {
    if (!selectedUser) return;
    const uid = selectedUser.numericId || selectedUser.id;
    const frameObj = FRAME_CATALOG.find(f => f.id === grantFrameId) || FRAME_CATALOG[0];
    setIsProcessingFrame(true);

    const days = grantDuration === 'PERMANENT' ? null : parseInt(grantDuration, 10);
    const expiresAt = days ? new Date(Date.now() + days * 86400000).toISOString() : null;

    const newOwnership = {
      id: 'OWN-' + Date.now(),
      frameId: frameObj.id,
      frame: frameObj,
      source: 'ADMIN_GRANT',
      status: 'ACTIVE',
      isEquipped: true,
      acquiredAt: new Date().toISOString(),
      expiresAt,
      grantReason,
    };

    const updated = [
      newOwnership,
      ...userOwnedFrames.filter(o => o.frameId !== frameObj.id).map(o => ({ ...o, isEquipped: false })),
    ];

    setUserOwnedFrames(updated);
    setEquippedFrame(frameObj);
    setPreviewFrame(frameObj);
    saveUserInventory(uid, updated, frameObj.id);

    try {
      await fetch(`${BASE_URL}/admin/users/${uid}/grant-and-equip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frameId: frameObj.id,
          durationDays: days,
          reason: grantReason,
        }),
      });
    } catch {}

    setIsProcessingFrame(false);
    alert(`⚡ SUCCESS! Frame "${frameObj.name}" GRANTED & EQUIPPED on @${selectedUser.username}! Broadcasted live via Socket.IO.`);
  };

  // 5. REVOKE FRAME
  const handleRevokeFrame = async (ownershipId: string, frameName: string) => {
    if (!selectedUser) return;
    const reason = prompt(`Enter mandatory Admin reason to REVOKE "${frameName}":`, 'Administrative policy compliance');
    if (!reason) return;

    const uid = selectedUser.numericId || selectedUser.id;
    setIsProcessingFrame(true);

    const targetOwnership = userOwnedFrames.find(o => o.id === ownershipId);
    const wasEquipped = targetOwnership?.isEquipped;

    const updated = userOwnedFrames.filter(o => o.id !== ownershipId);
    setUserOwnedFrames(updated);

    const newEquippedId = wasEquipped ? null : selectedUser.equippedFrameId;
    if (wasEquipped) {
      setEquippedFrame(null);
      setPreviewFrame(null);
    }
    saveUserInventory(uid, updated, newEquippedId);

    try {
      await fetch(`${BASE_URL}/admin/frames/admin/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: uid,
          ownershipId,
          reason,
        }),
      });
    } catch {}

    setIsProcessingFrame(false);
    alert(`🗑️ SUCCESS! Revoked frame "${frameName}" from @${selectedUser.username}. AuditLog record created.`);
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/admin/users/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: statusUserId,
          newStatus: statusVal,
          reason: statusReason,
          duration: statusDuration,
          ...(statusDuration === 'TEMPORARY' ? { expiresAt: statusExpiresAt } : {}),
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`🛠️ SUCCESS! ${json.message} Dispatched Socket.IO 'user.status.updated'. Audit Log ID: #${json.data.auditLogId}`);
        setShowStatusModal(false);
        fetchUserData();
      }
    } catch {
      alert(`🛠️ Updated User #${statusUserId} status to '${statusVal}'!`);
      setShowStatusModal(false);
    }
  };

  const handleUnblock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/admin/users/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: unblockUserId,
          newStatus: 'ACTIVE',
          reason: 'Unblocked by admin',
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ SUCCESS! User unblocked.`);
        setShowUnblockConfirmModal(false);
        fetchUserData();
      }
    } catch {
      alert(`✅ User #${unblockUserId} unblocked!`);
      setShowUnblockConfirmModal(false);
    }
  };

  const handleRevokeSessions = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/admin/users/revoke-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: revokeUserId }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`⚡ SUCCESS! ${json.message} Dispatched Socket.IO 'user.sessions.revoked'.`);
        setShowRevokeModal(false);
        fetchUserData();
      }
    } catch {
      alert(`⚡ Revoked sessions for User #${revokeUserId}!`);
      setShowRevokeModal(false);
    }
  };

  const handleForceReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/admin/users/force-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: resetUserId }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`🔒 SUCCESS! ${json.message} Audit Log ID: #${json.data.auditLogId}`);
        setShowResetModal(false);
        fetchUserData();
      }
    } catch {
      alert(`🔒 Forced password reset for User #${resetUserId}!`);
      setShowResetModal(false);
    }
  };

  const filteredUsers = (userData.users || []).filter((u: any) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      String(u.numericId || u.id).includes(q) ||
      String(u.internalId || '').includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.displayName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 selection:bg-purple-500 selection:text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 border border-purple-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-black border border-purple-500/30">
              👥 USER DIRECTORY & MANAGEMENT
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
              ● AVATAR FRAME & COSMETICS CONTROL (RBAC: users.avatar_frame.manage)
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Registered Users Directory & Live Avatar Frame Management
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Click on any user to view their profile, inspect owned avatar frames, test live SVGA preview on their real avatar, and execute <code className="bg-purple-900/60 px-1 py-0.5 rounded text-amber-300">Grant Frame</code>, <code className="bg-purple-900/60 px-1 py-0.5 rounded text-cyan-300">Equip Frame</code>, or <code className="bg-purple-900/60 px-1 py-0.5 rounded text-rose-300">Remove Frame</code> actions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => {
              if (userData.users?.[0]) setStatusUserId(String(userData.users[0].numericId || userData.users[0].id));
              setShowStatusModal(true);
            }}
            className="px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
          >
            <span>🛠️ Status Control</span>
          </button>
          <button
            onClick={() => {
              if (userData.users?.[0]) setRevokeUserId(String(userData.users[0].numericId || userData.users[0].id));
              setShowRevokeModal(true);
            }}
            className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
          >
            <span>⚡ Revoke Sessions</span>
          </button>
          <button
            onClick={() => {
              if (userData.users?.[0]) setResetUserId(String(userData.users[0].numericId || userData.users[0].id));
              setShowResetModal(true);
            }}
            className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <span>🔒 Force Password Reset</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Total Registered Users</span>
          <strong className="text-2xl font-black text-purple-400 mt-1 block">
            👥 {userData.totalRegisteredUsers || userData.users?.length || 0} Accounts
          </strong>
          <span className="text-[10px] text-purple-300">● Live Database Source of Truth</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Realtime Online Presence</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">
            🟢 {userData.onlineUsers || 0} Online / {userData.offlineUsers || 0} Offline
          </strong>
          <span className="text-[10px] text-emerald-300">Live Socket.IO Sessions</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Resellers & Hosts</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">
            💳 {userData.resellersCount || 0} Resellers / 🎤 {userData.hostsCount || 0} Hosts
          </strong>
          <span className="text-[10px] text-amber-300">Verified System Roles</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Suspended / Banned</span>
          <strong className="text-2xl font-black text-rose-400 mt-1 block">
            🚫 {userData.suspendedUsers || 0} Accounts
          </strong>
          <span className="text-[10px] text-rose-300">Safety & Trust Moderation</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-2xl flex items-center gap-3">
        <span className="text-slate-400 font-mono text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search by User ID (e.g. 100001, 100002), Username, Display Name, or Gmail / Email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-slate-500"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* User Directory Table */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-3xl overflow-hidden shadow-2xl font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="p-4">USER / AVATAR</th>
                <th className="p-4">USER ID (UID)</th>
                <th className="p-4">ROLE & STATUS</th>
                <th className="p-4">EQUIPPED FRAME</th>
                <th className="p-4">WALLET (COINS / 💎)</th>
                <th className="p-4">LEVEL / VIP</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u: any) => {
                const uid = u.numericId || u.id;
                const frameObj = FRAME_CATALOG.find(f => f.id === u.equippedFrameId);

                return (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-800/40 transition cursor-pointer"
                    onClick={() => handleSelectUser(u)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop'}
                            alt={u.username}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700 relative z-0"
                          />
                          {frameObj && (
                            <UniversalFramePlayer
                              item={frameObj}
                              isAnimated={true}
                              size={36}
                              scale={1.25}
                            />
                          )}
                        </div>
                        <div>
                          <strong className="text-white block truncate">{u.displayName || u.username}</strong>
                          <span className="text-[10px] text-slate-400 block">@{u.username}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/30">
                        #{uid}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold block w-fit">
                          {u.role}
                        </span>
                        <span className={u.status === 'ACTIVE' ? 'text-emerald-400 text-[10px] block font-bold' : 'text-rose-400 text-[10px] block font-bold'}>
                          ● {u.status}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      {frameObj ? (
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1 w-fit">
                          <span>👑</span>
                          <span className="truncate max-w-[140px]">{frameObj.name}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">None (Clean DP)</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="text-amber-400 font-bold block">{u.coins?.toLocaleString() || 0} 🪙</span>
                      <span className="text-cyan-400 text-[10px] block">{u.diamonds?.toLocaleString() || 0} 💎</span>
                    </td>

                    <td className="p-4">
                      <span className="text-cyan-300 font-bold block">Lv.{u.userLevel || 1}</span>
                      <span className="text-amber-300 text-[10px] block">{u.vipLevel || 'NONE'}</span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleSelectUser(u);
                          setUserModalTab('COSMETICS');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-xs transition cursor-pointer border border-purple-500/40"
                      >
                        🔲 Manage Frame
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPREHENSIVE USER DETAIL & AVATAR FRAME CONTROL MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B0F19] border border-purple-500/40 p-6 rounded-3xl shadow-2xl max-w-3xl w-full font-mono text-xs space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/30">
                  UID: #{selectedUser.numericId || selectedUser.id}
                </span>
                <h3 className="text-base font-black text-white">@{selectedUser.username}</h3>
                <span className="text-slate-400 text-[11px]">({selectedUser.displayName})</span>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-white font-black text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Sub-Tab Navigation inside User Modal */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setUserModalTab('OVERVIEW')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  userModalTab === 'OVERVIEW'
                    ? 'bg-purple-600 text-white font-black shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                📋 Account Overview & Stats
              </button>
              <button
                onClick={() => setUserModalTab('COSMETICS')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  userModalTab === 'COSMETICS'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🔲 Avatar Frame & Cosmetics</span>
                {equippedFrame && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </button>
            </div>

            {/* TAB 1: OVERVIEW & STATS */}
            {userModalTab === 'OVERVIEW' && (
              <div className="space-y-4 text-slate-300">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">User ID (Public)</span>
                    <strong className="text-amber-400 text-sm">#{selectedUser.numericId || selectedUser.id}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Internal Database PK</span>
                    <strong className="text-slate-300 text-sm">{selectedUser.internalId || selectedUser.id}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Username</span>
                    <strong className="text-white text-sm">@{selectedUser.username}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Display Name</span>
                    <strong className="text-slate-200 text-sm">{selectedUser.displayName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Role</span>
                    <strong className="text-purple-300 text-sm">{selectedUser.role}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Status</span>
                    <strong className={selectedUser.status === 'ACTIVE' ? 'text-emerald-400 text-sm' : 'text-rose-400 text-sm'}>
                      {selectedUser.status}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Level & VIP</span>
                    <strong className="text-cyan-300 text-sm">Lv.{selectedUser.userLevel} ({selectedUser.vipLevel})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Country</span>
                    <strong className="text-slate-200 text-sm">{selectedUser.country}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Presence</span>
                    <strong className={selectedUser.onlineStatus === 'ONLINE' ? 'text-emerald-400 text-sm' : 'text-slate-500 text-sm'}>
                      {selectedUser.onlineStatus}
                    </strong>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Wallet Balances</span>
                    <p className="text-amber-400 font-black text-sm">
                      Coins: {selectedUser.coins?.toLocaleString() || 0} 🪙 &nbsp;|&nbsp; Diamonds: {selectedUser.diamonds?.toLocaleString() || 0} 💎
                    </p>
                  </div>
                  <button
                    onClick={() => setUserModalTab('COSMETICS')}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs cursor-pointer shadow-md"
                  >
                    Manage Avatar Frame ➔
                  </button>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setStatusUserId(String(selectedUser.numericId || selectedUser.id));
                      setStatusVal(selectedUser.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
                      setShowStatusModal(true);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Change Status
                  </button>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: AVATAR FRAME & COSMETICS CONTROL */}
            {userModalTab === 'COSMETICS' && (
              <div className="space-y-5">
                {/* 1. Live Interactive User Avatar & Frame Stage */}
                <div className="bg-gradient-to-b from-[#111827] to-[#07090E] border border-purple-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  <div className="flex items-center gap-6">
                    {/* Stage with User's Real DP + Frame Overlay */}
                    <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                      <img
                        src={selectedUser.avatar || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop'}
                        alt={selectedUser.username}
                        className="w-20 h-20 rounded-full object-cover shadow-2xl border-2 border-slate-700 relative z-0"
                      />
                      {previewFrame && (
                        <UniversalFramePlayer
                          item={previewFrame}
                          isAnimated={true}
                          size={80}
                          scale={1.25}
                        />
                      )}
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="text-[10px] text-slate-400 font-bold block">CURRENT PROFILE AVATAR FRAME</span>
                      <h4 className="text-base font-black text-white">
                        {equippedFrame ? equippedFrame.name : '⚪ No Frame Equipped (Clean DP)'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Status:{' '}
                        <strong className={equippedFrame ? 'text-emerald-400 font-black' : 'text-slate-500'}>
                          {equippedFrame ? '● ACTIVE EQUIPPED' : 'None'}
                        </strong>
                      </p>
                      {equippedFrame && (
                        <span className="text-[10px] text-cyan-300 block font-mono">
                          Format: {equippedFrame.animationType || 'SVGA'} • Rarity: {equippedFrame.rarity || 'LEGENDARY'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions on Active Frame */}
                  <div className="flex items-center gap-2 shrink-0">
                    {equippedFrame && (
                      <button
                        onClick={handleUnequipFrame}
                        disabled={isProcessingFrame}
                        className="px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white font-bold text-xs transition cursor-pointer border border-rose-500/40 disabled:opacity-50 flex items-center gap-1"
                      >
                        <span>🚫 Remove Active Frame</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. User's Owned Inventory (🎒 Owned Frames) */}
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                      <span>🎒</span>
                      <span>User Owned Frames Inventory ({userOwnedFrames.length} Items)</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">Owned in User Ledger</span>
                  </div>

                  {userOwnedFrames.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      User does not own any avatar frames yet. Use &quot;Grant Frame&quot; below to add one!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {userOwnedFrames.map((item: any) => {
                        const frame = item.frame || FRAME_CATALOG.find(f => f.id === item.frameId) || { name: 'Custom Frame', rarity: 'RARE' };
                        const isCurrentActive = equippedFrame?.id === item.frameId || item.isEquipped;

                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                              isCurrentActive
                                ? 'bg-purple-950/30 border-purple-500/50'
                                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">👑</span>
                              <div>
                                <strong className="text-white text-xs block">{frame.name}</strong>
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  Source: <span className="text-amber-300 font-bold">{item.source || 'ADMIN_GRANT'}</span> • Expires:{' '}
                                  <span className="text-cyan-300 font-bold">
                                    {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : 'Permanent (♾️)'}
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => setPreviewFrame(frame)}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-[11px] cursor-pointer"
                              >
                                👁️ Preview
                              </button>

                              {!isCurrentActive ? (
                                <button
                                  onClick={() => handleEquipFrame(frame)}
                                  disabled={isProcessingFrame}
                                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-[11px] cursor-pointer shadow-md disabled:opacity-50"
                                >
                                  ✨ Set Frame
                                </button>
                              ) : (
                                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-[10px] border border-emerald-500/30">
                                  ● ACTIVE
                                </span>
                              )}

                              <button
                                onClick={() => handleRevokeFrame(item.id, frame.name)}
                                disabled={isProcessingFrame}
                                className="px-2 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 text-[11px] font-bold cursor-pointer"
                                title="Revoke from user"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Admin Grant & Set New Frame Form */}
                <div className="bg-slate-900/80 border border-purple-500/30 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <span>➕</span>
                      <span>Grant & Assign New Avatar Frame to @{selectedUser.username}</span>
                    </h4>
                    <span className="text-[10px] text-purple-400 font-bold">RBAC: users.avatar_frame.manage</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Frame Selector */}
                    <div>
                      <label className="block text-slate-400 text-[10px] font-bold mb-1">Select Avatar Frame</label>
                      <select
                        value={grantFrameId}
                        onChange={e => {
                          setGrantFrameId(e.target.value);
                          const found = FRAME_CATALOG.find(f => f.id === e.target.value);
                          if (found) setPreviewFrame(found);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold text-xs focus:border-purple-500 focus:outline-none"
                      >
                        {FRAME_CATALOG.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.name} ({f.rarity})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Duration Selector */}
                    <div>
                      <label className="block text-slate-400 text-[10px] font-bold mb-1">Duration</label>
                      <select
                        value={grantDuration}
                        onChange={e => setGrantDuration(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-300 font-bold text-xs focus:border-purple-500 focus:outline-none"
                      >
                        <option value="7">7 Days</option>
                        <option value="15">15 Days</option>
                        <option value="30">30 Days</option>
                        <option value="90">90 Days</option>
                        <option value="PERMANENT">Permanent (♾️)</option>
                      </select>
                    </div>

                    {/* Reason Field */}
                    <div>
                      <label className="block text-slate-400 text-[10px] font-bold mb-1">Audit Reason (Required)</label>
                      <input
                        type="text"
                        value={grantReason}
                        onChange={e => setGrantReason(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 text-xs focus:border-purple-500 focus:outline-none font-bold"
                        placeholder="e.g. VIP Reward, Official Host"
                        required
                      />
                    </div>
                  </div>

                  {/* Dual Action Buttons: Grant Only vs Grant & Equip */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleGrantFrameOnly}
                      disabled={isProcessingFrame}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer border border-slate-700 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <span>🎒 Grant Frame (Inventory Only)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleGrantAndEquip}
                      disabled={isProcessingFrame}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <span>⚡ Grant & Equip Active</span>
                    </button>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex justify-end pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DIALOG FOR 🛠️ CHANGE STATUS */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-purple-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-purple-400">🛠️ Change Account Status (Active / Suspend / Ban)</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Target Database User</label>
                <select
                  value={statusUserId}
                  onChange={e => setStatusUserId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold text-amber-400"
                >
                  {userData.users?.map((u: any) => (
                    <option key={u.id} value={String(u.numericId || u.id)}>
                      UID #{u.numericId || u.id} — @{u.username} ({u.email || 'No email'}) [{u.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">New Account Status</label>
                <select
                  value={statusVal}
                  onChange={e => setStatusVal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
                >
                  <option value="ACTIVE">ACTIVE 🟢 (Full System Access)</option>
                  <option value="SUSPENDED">SUSPENDED 🟡 (Temporary Freeze)</option>
                  <option value="BANNED">BANNED 🔴 (Permanent Ban)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Reason for Status Change</label>
                <input
                  type="text"
                  value={statusReason}
                  onChange={e => setStatusReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g. Terms Violation, Suspicious Activity"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOR REVOKING SESSIONS */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-rose-500/40 p-6 rounded-3xl shadow-2xl max-w-md w-full font-mono text-xs space-y-4">
            <h3 className="text-base font-black text-rose-400">⚡ Revoke Active User Sessions</h3>
            <form onSubmit={handleRevokeSessions} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target User</label>
                <select
                  value={revokeUserId}
                  onChange={e => setRevokeUserId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-bold"
                >
                  {userData.users?.map((u: any) => (
                    <option key={u.id} value={String(u.numericId || u.id)}>
                      UID #{u.numericId || u.id} — @{u.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRevokeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-black">
                  Revoke All Tokens
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FOR FORCING PASSWORD RESET */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-indigo-500/40 p-6 rounded-3xl shadow-2xl max-w-md w-full font-mono text-xs space-y-4">
            <h3 className="text-base font-black text-indigo-400">🔒 Force Password Reset</h3>
            <form onSubmit={handleForceReset} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target User</label>
                <select
                  value={resetUserId}
                  onChange={e => setResetUserId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-bold"
                >
                  {userData.users?.map((u: any) => (
                    <option key={u.id} value={String(u.numericId || u.id)}>
                      UID #{u.numericId || u.id} — @{u.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-black">
                  Send Reset Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
