'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ImageUploadDropzone } from './ImageUploadDropzone';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Gift {
  id: string;
  name: string;
  icon: string;
  costCoins: number;
  rewardDiamonds: number;
  category: string;
  animationType: string;
  animationLevel?: string;
  emoji?: string;
  svgaUrl?: string;
  lottieUrl?: string;
  imageUrl?: string;
  soundUrl?: string;
  xpReward: number;
  isLucky: boolean;
  multiplierMax: number;
  active: boolean;
  status?: 'ACTIVE' | 'DRAFT' | 'DISABLED' | 'ARCHIVED';
  createdAt: string;
  _count?: { transactions: number };
}

interface GiftTx {
  id: string;
  senderId: number;
  receiverId: number;
  giftId: string;
  count: number;
  totalCoins: number;
  totalDiamonds: number;
  createdAt: string;
  gift?: { name: string; icon: string };
}

interface FormState {
  name: string;
  icon: string;
  category: string;
  animationType: string;
  animationLevel: string;
  emoji: string;
  costCoins: number;
  rewardDiamonds: number;
  xpReward: number;
  isLucky: boolean;
  multiplierMax: number;
  svgaUrl: string;
  lottieUrl: string;
  imageUrl: string;
  soundUrl: string;
  active: boolean;
  status: 'ACTIVE' | 'DRAFT' | 'DISABLED' | 'ARCHIVED';
}

const BLANK_FORM: FormState = {
  name: '',
  icon: '🎁',
  category: 'Standard (Popular)',
  animationType: 'SMALL',
  animationLevel: 'Small Bubble',
  emoji: '',
  costCoins: 0,
  rewardDiamonds: 0,
  xpReward: 100,
  isLucky: false,
  multiplierMax: 500,
  svgaUrl: '',
  lottieUrl: '',
  imageUrl: '',
  soundUrl: '',
  active: true,
  status: 'ACTIVE',
};

function getApiBase(): string {
  if (typeof window !== 'undefined') {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return 'https://aura-live-voice-chat-1.onrender.com/api/v1';
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://aura-live-voice-chat-1.onrender.com/api/v1';
}

const CATEGORIES = [
  'Standard (Popular)', 'Popular', 'Love', 'Luxury', 'Animation',
  'Event', 'Seasonal', 'VIP', 'Special', 'New', 'Activity',
  'Local', 'Romantic', 'Lucky', 'Draw', 'Multi', 'Family Prestige',
];

const ANIMATION_LEVELS = [
  'Small Bubble', 'Medium Effect', 'Large Effect', 'Full Screen', 'Special/Legendary',
];
const ANIMATION_TYPES = [
  'SMALL', 'SVG', 'SVGA', 'LOTTIE', '3D_OVERLAY', 'FULL_SCREEN',
  'AUTUMN_WINDMILL_SVGA', 'BLUE_ENCHANTRESS_SVGA', 'CHILDHOOD_SWEETHEARTS_SVGA',
  'CROWNING_LOVE_SVGA', 'FLOWER_BOAT_SVGA', 'MERMAID_GIRL_SVGA',
  'RABBIT_HEARTBEAT_SVGA', 'RUNAWAY_SWEETHEART_SVGA', 'SECRET_CAGE_SVGA',
  'MAGIC_DEY_SVGA', 'STAR_GODDESS_3D', 'LEO_ROAR', 'STAR_FALL_3D',
  'SUPER_LEO_FIRE_3D', 'BOBA_SPLASH', 'GLOW_STICK_FX', 'VINYL_SPIN_3D',
  'GOLDEN_TROPHY_3D', 'ROSE_BURST', 'HEART_FOUNTAIN', 'ROYAL_CROWN_3D',
  'SUPERCAR_3D', 'GALAXY_ROCKET_3D', 'SUPER_YACHT_3D', 'DRAGON_FIRE_3D',
  'COSMIC_PORTAL_3D', 'ROYAL_CASTLE_3D', 'LUCKY_CHEST_3D',
];

// Comprehensive catalog matching server and mobile app
const STATIC_CATALOG: Gift[] = [
  // 10 Personal SVGA Gifts
  { id: 'GIFT-AUTUMN-WINDMILL',      name: 'Autumn Windmill',       icon: '🍂', costCoins: 1200, rewardDiamonds: 840,  category: 'Popular',         animationType: 'AUTUMN_WINDMILL_SVGA',     svgaUrl: '/uploads/svga/Autumn_Windmill_.svga', xpReward: 600,  isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-BLUE-ENCHANTRESS',     name: 'Blue Enchantress',      icon: '💙', costCoins: 600,  rewardDiamonds: 420,  category: 'Draw',            animationType: 'BLUE_ENCHANTRESS_SVGA',    svgaUrl: '/uploads/svga/Blue_Enchantress.svga', xpReward: 300,  isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-CHILDHOOD-SWEETHEARTS',name: 'Childhood Sweethearts', icon: '👫', costCoins: 1500, rewardDiamonds: 1050, category: 'Popular',         animationType: 'CHILDHOOD_SWEETHEARTS_SVGA',svgaUrl: '/uploads/svga/Childhood_sweethearts_1.svga', xpReward: 750, isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-CROWNING-LOVE',        name: 'Crowning Love',         icon: '👑', costCoins: 3500, rewardDiamonds: 2450, category: 'VIP',             animationType: 'CROWNING_LOVE_SVGA',       svgaUrl: '/uploads/svga/Crowning_Love_2.svga', xpReward: 1750, isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-FLOWER-BOAT',          name: 'Flower Boat',           icon: '⛵', costCoins: 800,  rewardDiamonds: 560,  category: 'Popular',         animationType: 'FLOWER_BOAT_SVGA',         svgaUrl: '/uploads/svga/Flower_Boat_1.svga', xpReward: 400,  isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-MERMAID-GIRL',         name: 'Mermaid Girl',          icon: '🧜‍♀️', costCoins: 2200, rewardDiamonds: 1540, category: 'Multi',           animationType: 'MERMAID_GIRL_SVGA',        svgaUrl: '/uploads/svga/Mermaid_girl_1.svga', xpReward: 1100, isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-RABBIT-HEARTBEAT',     name: 'Rabbit Heartbeat',      icon: '🐰', costCoins: 1000, rewardDiamonds: 700,  category: 'Family Prestige', animationType: 'RABBIT_HEARTBEAT_SVGA',    svgaUrl: '/uploads/svga/Rabbit_Heartbeat_1.svga', xpReward: 500, isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-RUNAWAY-SWEETHEART',   name: 'Runaway Sweetheart',    icon: '💖', costCoins: 1800, rewardDiamonds: 1260, category: 'Popular',         animationType: 'RUNAWAY_SWEETHEART_SVGA',  svgaUrl: '/uploads/svga/Runaway_Sweetheart_1.svga', xpReward: 900, isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-SECRET-CAGE',          name: 'Secret Cage',           icon: '🕊️', costCoins: 900,  rewardDiamonds: 630,  category: 'Draw',            animationType: 'SECRET_CAGE_SVGA',         svgaUrl: '/uploads/svga/Secret_Cage_1.svga', xpReward: 450,  isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-MAGIC-DEY',            name: 'Magic Lamp Dream',      icon: '🪔', costCoins: 750,  rewardDiamonds: 525,  category: 'Special FX',      animationType: 'MAGIC_DEY_SVGA',           svgaUrl: '/uploads/svga/dey_1.svga', xpReward: 375,  isLucky: false, multiplierMax: 500, active: true, createdAt: '' },

  // Live broadcast popular 8 gifts
  { id: 'GIFT-STAR-GODDESS',         name: 'Star Goddess',          icon: '✨', costCoins: 200,  rewardDiamonds: 140,  category: 'Popular',         animationType: 'STAR_GODDESS_3D',          xpReward: 100,  isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-LEO',                  name: 'Leo',                   icon: '🦁', costCoins: 1,    rewardDiamonds: 1,    category: 'Popular',         animationType: 'LEO_ROAR',                 xpReward: 5,    isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-PICKING-STARS',        name: 'Picking stars',         icon: '⭐', costCoins: 999,  rewardDiamonds: 700,  category: 'Multi',           animationType: 'STAR_FALL_3D',             xpReward: 500,  isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-SUPER-LEO',            name: 'Super Leo',             icon: '🔥', costCoins: 2888, rewardDiamonds: 2020, category: 'VIP',             animationType: 'SUPER_LEO_FIRE_3D',        xpReward: 1440, isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-BUBBLE-MILK-TEA',      name: 'Bubble milk tea',       icon: '🧋', costCoins: 1,    rewardDiamonds: 1,    category: 'Popular',         animationType: 'BOBA_SPLASH',              xpReward: 5,    isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-GLOW-STICK',           name: 'Glow Stick',            icon: '🪄', costCoins: 1,    rewardDiamonds: 1,    category: 'Draw',            animationType: 'GLOW_STICK_FX',            xpReward: 5,    isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-RECORD-PLAYER',        name: 'Record Player',         icon: '📻', costCoins: 100,  rewardDiamonds: 70,   category: 'Family Prestige', animationType: 'VINYL_SPIN_3D',           xpReward: 50,   isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-TROPHY',               name: 'Trophy',                icon: '🏆', costCoins: 500,  rewardDiamonds: 350,  category: 'Popular',         animationType: 'GOLDEN_TROPHY_3D',         xpReward: 250,  isLucky: false, multiplierMax: 500, active: true, createdAt: '' },

  // Standard luxury & romantic catalog
  { id: 'GIFT-101',                  name: 'Red Rose',              icon: '🌹', costCoins: 10,   rewardDiamonds: 7,    category: 'Popular',         animationType: 'ROSE_BURST',               xpReward: 20,   isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-102',                  name: 'Love Heart',            icon: '💖', costCoins: 50,   rewardDiamonds: 35,   category: 'Romantic',        animationType: 'HEART_FOUNTAIN',           xpReward: 50,   isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-103',                  name: 'Diamond Ring',          icon: '💍', costCoins: 200,  rewardDiamonds: 140,  category: 'Popular',         animationType: 'DIAMOND_SHINE',            xpReward: 100,  isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-501',                  name: 'Royal Golden Crown',    icon: '👑', costCoins: 500,  rewardDiamonds: 350,  category: 'Luxury',          animationType: 'ROYAL_CROWN_3D',           xpReward: 250,  isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-1501',                 name: 'Cyber Supercar',        icon: '🏎️', costCoins: 1500, rewardDiamonds: 1050, category: 'Luxury',          animationType: 'SUPERCAR_3D',              xpReward: 500,  isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-2001',                 name: 'Galaxy Space Rocket',   icon: '🚀', costCoins: 2000, rewardDiamonds: 1400, category: 'Special FX',       animationType: 'GALAXY_ROCKET_3D',         xpReward: 750,  isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-5001',                 name: 'Billionaire Yacht',     icon: '🛥️', costCoins: 5000, rewardDiamonds: 3500, category: 'Luxury',          animationType: 'SUPER_YACHT_3D',           xpReward: 1000, isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-8001',                 name: 'Golden Dragon FX',      icon: '🐉', costCoins: 8000, rewardDiamonds: 5600, category: 'Special FX',       animationType: 'DRAGON_FIRE_3D',           xpReward: 1500, isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-10001',                name: 'Luxury Private Jet',    icon: '✈️', costCoins: 10000,rewardDiamonds: 7000, category: 'Luxury',          animationType: 'PRIVATE_JET_3D',           xpReward: 2000, isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-20001',                name: 'Cosmic Galaxy Portal',  icon: '🌌', costCoins: 20000,rewardDiamonds: 14000,category: 'Special FX',      animationType: 'COSMIC_PORTAL_3D',         xpReward: 3000, isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-25001',                name: 'Imperial Royal Castle', icon: '🏰', costCoins: 25000,rewardDiamonds: 17500,category: 'Luxury',         animationType: 'ROYAL_CASTLE_3D',          xpReward: 5000, isLucky: false, multiplierMax: 500, active: true, createdAt: '' },
  { id: 'GIFT-LUCKY-1',              name: 'Lucky Treasure Chest',  icon: '🎰', costCoins: 100,  rewardDiamonds: 70,   category: 'Lucky',           animationType: 'LUCKY_CHEST_3D',           xpReward: 200,  isLucky: true,  multiplierMax: 500, active: true, createdAt: '' },
];

// ─── Category tag colour map ───────────────────────────────────────────────────
const CAT_STYLE: Record<string, string> = {
  Popular:          'bg-pink-500/20    text-pink-300    border-pink-500/30',
  Romantic:         'bg-rose-500/20    text-rose-300    border-rose-500/30',
  Luxury:           'bg-amber-500/20   text-amber-300   border-amber-500/30',
  'Special FX':     'bg-cyan-500/20    text-cyan-300    border-cyan-500/30',
  Lucky:            'bg-purple-500/20  text-purple-300  border-purple-500/30',
  Draw:             'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Multi:            'bg-indigo-500/20  text-indigo-300  border-indigo-500/30',
  'Family Prestige':'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
  VIP:              'bg-yellow-500/20  text-yellow-300  border-yellow-500/30',
  All:              'bg-slate-700      text-slate-300   border-slate-600',
};

const ANIM_STYLE: Record<string, string> = {
  SVGA: 'bg-cyan-800/50 text-cyan-300', LOTTIE: 'bg-fuchsia-800/50 text-fuchsia-300',
  '3D_OVERLAY': 'bg-indigo-800/50 text-indigo-300', FULL_SCREEN: 'bg-rose-800/50 text-rose-300',
  LUCKY_CHEST_3D: 'bg-amber-800/50 text-amber-300',
  AUTUMN_WINDMILL_SVGA: 'bg-orange-800/50 text-orange-300',
  BLUE_ENCHANTRESS_SVGA: 'bg-sky-800/50 text-sky-300',
  CHILDHOOD_SWEETHEARTS_SVGA: 'bg-pink-800/50 text-pink-300',
  CROWNING_LOVE_SVGA: 'bg-yellow-800/50 text-yellow-300',
  FLOWER_BOAT_SVGA: 'bg-emerald-800/50 text-emerald-300',
  MERMAID_GIRL_SVGA: 'bg-teal-800/50 text-teal-300',
  RABBIT_HEARTBEAT_SVGA: 'bg-rose-800/50 text-rose-300',
  RUNAWAY_SWEETHEART_SVGA: 'bg-pink-800/50 text-pink-300',
  SECRET_CAGE_SVGA: 'bg-purple-800/50 text-purple-300',
  MAGIC_DEY_SVGA: 'bg-amber-800/50 text-amber-300',
};

function getAnimStyle(t: string) {
  return ANIM_STYLE[t] || 'bg-slate-700/50 text-slate-300';
}

// ─── Small reusable Pill ───────────────────────────────────────────────────────
function Pill({ text, cls }: { text: string; cls: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black border ${cls}`}>
      {text}
    </span>
  );
}

// ─── GiftCard ─────────────────────────────────────────────────────────────────
function GiftCard({
  gift, onEdit, onDelete, onDuplicate, onToggle,
}: { gift: Gift; onEdit: (g: Gift) => void; onDelete: (id: string) => void; onDuplicate: (id: string) => void; onToggle: (id: string, active: boolean) => void }) {
  const catCls = CAT_STYLE[gift.category] || CAT_STYLE.All;
  return (
    <div
      className={`relative bg-[#0F1623] border rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 hover:border-slate-600 ${gift.active ? 'border-[#1E2D42]' : 'border-amber-900/50 opacity-75'}`}
    >
      {/* Top Status & Lucky badge */}
      <div className="absolute top-2 left-2 flex gap-1 z-10">
        <span className={`px-2 py-0.5 text-[8.5px] font-black rounded-full border ${gift.active ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' : 'bg-amber-950/80 text-amber-300 border-amber-500/40'}`}>
          {gift.active ? 'ACTIVE' : 'DRAFT'}
        </span>
        {gift.isLucky && (
          <span className="px-2 py-0.5 text-[8.5px] font-black rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            🎰 LUCKY
          </span>
        )}
      </div>

      {/* Gift preview box */}
      <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#131B2E] to-[#0A0F1C] flex items-center justify-center relative border-b border-[#1E2D42] p-4">
        {/* Animation type badge */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${getAnimStyle(gift.animationType)}`}>
            {gift.animationType}
          </span>
          {gift.svgaUrl && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-cyan-800/60 text-cyan-300 border border-cyan-500/30">SVGA</span>}
          {gift.lottieUrl && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-fuchsia-800/60 text-fuchsia-300 border border-fuchsia-500/30">JSON</span>}
          {gift.imageUrl && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-blue-800/60 text-blue-300 border border-blue-500/30">IMG</span>}
          {gift.soundUrl && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-green-800/60 text-green-300 border border-green-500/30">AUDIO</span>}
        </div>
        {/* Emoji or Image Icon */}
        {gift.imageUrl ? (
          <img src={gift.imageUrl} alt={gift.name} className="w-20 h-20 object-contain drop-shadow-2xl rounded-xl" />
        ) : (
          <span className="text-5xl select-none drop-shadow-2xl filter">{gift.icon || '🎁'}</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-black text-white truncate leading-tight">{gift.name}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-bold rounded-md border ${catCls}`}>
              {gift.category}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-[#0B0F19] p-2.5 rounded-xl border border-[#1A2233]">
          <div>
            <p className="text-[9.5px] text-slate-400 font-semibold">Cost</p>
            <p className="text-xs font-black text-amber-400 leading-tight">
              💎 {gift.costCoins.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[9.5px] text-slate-400 font-semibold">XP</p>
            <p className="text-xs font-black text-pink-400 leading-tight">+{gift.xpReward}</p>
          </div>
          <div>
            <p className="text-[9.5px] text-slate-400 font-semibold">Earns</p>
            <p className="text-xs font-black text-emerald-400 leading-tight">
              🪙 {gift.rewardDiamonds.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 mt-auto pt-2 border-t border-[#1E2D42]">
          <button
            onClick={() => onEdit(gift)}
            className="flex-1 py-1.5 text-[10px] font-black rounded-lg bg-indigo-900/50 hover:bg-indigo-800/70 text-indigo-300 transition cursor-pointer border border-indigo-700/40"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDuplicate(gift.id)}
            title="Duplicate Gift Asset"
            className="px-2.5 py-1.5 text-[10px] font-black rounded-lg bg-purple-900/50 hover:bg-purple-800/70 text-purple-300 transition cursor-pointer border border-purple-700/40"
          >
            📑
          </button>
          <button
            onClick={() => onToggle(gift.id, !gift.active)}
            title={gift.active ? 'Deactivate Gift' : 'Activate Gift'}
            className={`px-2.5 py-1.5 text-[10px] font-black rounded-lg transition cursor-pointer border ${
              gift.active
                ? 'bg-amber-900/30 hover:bg-amber-800/50 text-amber-300 border-amber-700/30'
                : 'bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-300 border-emerald-700/30'
            }`}
          >
            {gift.active ? '⏸' : '▶'}
          </button>
          <button
            onClick={() => onDelete(gift.id)}
            title="Delete Gift Asset"
            className="px-2.5 py-1.5 text-[10px] font-black rounded-lg bg-red-900/30 hover:bg-red-800/50 text-red-400 transition cursor-pointer border border-red-700/30"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Single Dedicated Upload Card ─────────────────────────────────────────────
function UploadBox({
  title,
  sublabel,
  value,
  accept,
  uploadEndpoint,
  onUploaded,
}: {
  title: string;
  sublabel: string;
  value?: string;
  accept: string;
  uploadEndpoint: string;
  onUploaded: (url: string, name: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState(value ? value.split('/').pop() || '' : '');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    const apiBase = getApiBase();
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('image', file);

      const res = await fetch(`${apiBase}${uploadEndpoint}`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (json.success && json.data) {
        const url = json.data.assetUrl || json.data.imageUrl || json.data.audioUrl || json.data.url;
        setFileName(file.name);
        onUploaded(url, file.name);
      } else {
        alert(json.error || 'Upload failed');
      }
    } catch {
      const localUrl = URL.createObjectURL(file);
      setFileName(file.name);
      onUploaded(localUrl, file.name);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="bg-[#1A1F2C] hover:bg-[#202738] border border-[#2B3448] hover:border-indigo-500/50 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition group relative min-h-[105px]"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
      <div className="w-8 h-8 rounded-xl bg-[#262E42] group-hover:bg-indigo-600/20 text-slate-300 group-hover:text-indigo-400 flex items-center justify-center mb-1.5 transition">
        {uploading ? (
          <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        )}
      </div>
      <p className="text-[11px] font-black text-slate-200">{title}</p>
      <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[120px]">
        {fileName || sublabel}
      </p>
      {value && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function GiftModal({
  gift, onClose, onSave, saving,
}: { gift: Gift | null; onClose: () => void; onSave: (f: FormState) => void; saving: boolean }) {
  const [form, setForm] = useState<FormState>(
    gift
      ? {
          name: gift.name, icon: gift.icon, category: gift.category,
          animationType: gift.animationType,
          animationLevel: gift.animationLevel || 'Small Bubble',
          emoji: gift.emoji || '',
          costCoins: gift.costCoins,
          rewardDiamonds: gift.rewardDiamonds, xpReward: gift.xpReward,
          isLucky: gift.isLucky, multiplierMax: gift.multiplierMax,
          svgaUrl: gift.svgaUrl || '', lottieUrl: gift.lottieUrl || '',
          imageUrl: gift.imageUrl || '', soundUrl: gift.soundUrl || '',
          active: gift.active,
          status: gift.status || (gift.active ? 'ACTIVE' : 'DRAFT'),
        }
      : BLANK_FORM
  );

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const set = (k: keyof FormState, v: any) => setForm(f => ({ ...f, [k]: v }));

  const inpClass =
    'w-full bg-[#181E2C] border border-[#2B3548] rounded-xl px-3.5 py-2.5 text-white text-xs font-bold placeholder-slate-500 focus:outline-none focus:border-blue-500 transition';

  const handleCreateOrPublish = (status: 'ACTIVE' | 'DRAFT') => {
    if (!form.name.trim()) {
      alert('Please enter a valid Gift Name.');
      return;
    }
    onSave({
      ...form,
      status,
      active: status === 'ACTIVE',
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#121622] border border-[#232C3D] rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#1F2738] sticky top-0 bg-[#121622] z-20">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">{gift ? 'Edit Gift Asset' : 'Create New Gift Asset'}</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Configure visual properties and economy settings for this gift.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-[#1D2433] hover:bg-[#2A344A] flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer font-bold text-base">✕</button>
        </div>

        {/* Modal Body: 2-Column Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Settings (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Gift Name */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                <span className="text-red-500 mr-1">*</span>Gift Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Enter gift name..."
                className={inpClass}
                required
              />
            </div>

            {/* Price & XP Reward */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  <span className="text-red-500 mr-1">*</span>Price (Joe Diamonds 💎)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.costCoins}
                  onChange={e => {
                    const diamonds = Math.max(0, parseInt(e.target.value, 10) || 0);
                    setForm(f => ({
                      ...f,
                      costCoins: diamonds,
                      rewardDiamonds: Math.floor(diamonds * 0.7),
                    }));
                  }}
                  className={`${inpClass} text-amber-400 font-extrabold`}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  <span className="text-red-500 mr-1">*</span>XP Reward
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.xpReward}
                  onChange={e => set('xpReward', parseInt(e.target.value, 10) || 0)}
                  className={`${inpClass} text-pink-400 font-extrabold`}
                />
              </div>
            </div>

            {/* Category & Animation Level */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  <span className="text-red-500 mr-1">*</span>Gift Category
                </label>
                <select
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  className={`${inpClass} cursor-pointer`}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="bg-[#121622] text-white">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  <span className="text-red-500 mr-1">*</span>Animation Level
                </label>
                <select
                  value={form.animationLevel}
                  onChange={e => set('animationLevel', e.target.value)}
                  className={`${inpClass} cursor-pointer`}
                >
                  {ANIMATION_LEVELS.map(l => (
                    <option key={l} value={l} className="bg-[#121622] text-white">{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Associated Emoji */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Associated Emoji (Optional)
              </label>
              <input
                type="text"
                value={form.emoji}
                onChange={e => set('emoji', e.target.value)}
                placeholder="e.g. 🔥 or heart"
                className={inpClass}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Triggers a floating reaction animation in the live room.
              </p>
            </div>

            {/* Additional Economy Details (Host Earning & Lucky Toggle) */}
            <div className="bg-[#161C2A] border border-[#232D3F] rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">🪙 Host Coin Earning (70%):</span>
                <span className="font-black text-emerald-400">{form.rewardDiamonds.toLocaleString()} Coins</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#232D3F]">
                <div>
                  <p className="text-xs font-black text-amber-400">🎰 Lucky Gift Jackpot Mode</p>
                  <p className="text-[10px] text-slate-400">Random multiplier up to 500x on send</p>
                </div>
                <button
                  type="button"
                  onClick={() => set('isLucky', !form.isLucky)}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                    form.isLucky ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      form.isLucky ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Preview & 4 Uploaders (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live Animation Preview Box */}
            <div>
              <p className="text-xs font-bold text-slate-300 mb-1.5">Live Animation Preview</p>
              <div className="w-full aspect-[4/3] bg-[#222736] border border-[#313B4E] rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner group">
                {form.imageUrl || form.svgaUrl ? (
                  <div className="flex flex-col items-center justify-center p-4">
                    {form.imageUrl ? (
                      <img
                        src={form.imageUrl}
                        alt={form.name || 'Gift Preview'}
                        className="w-24 h-24 object-contain drop-shadow-2xl animate-pulse"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-3xl shadow-2xl">
                        {form.icon || '🎁'}
                      </div>
                    )}
                    <p className="text-xs font-black text-white mt-2 truncate max-w-[170px]">
                      {form.name || 'Gift Asset'}
                    </p>
                    {form.svgaUrl && (
                      <span className="text-[8.5px] font-black text-cyan-300 bg-cyan-900/60 px-2 py-0.5 rounded-full mt-1">
                        SVGA Animation Linked ✨
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <span className="text-4xl mb-1 filter drop-shadow">🎁</span>
                    <p className="text-xs font-bold text-slate-300">Gift Item</p>
                  </div>
                )}

                {/* Audio Element & Controls */}
                {form.soundUrl && (
                  <audio
                    ref={audioRef}
                    src={form.soundUrl}
                    loop
                    autoPlay={isPlaying}
                    muted={isMuted}
                  />
                )}

                {/* Bottom Active Preview Badge */}
                <div className="absolute bottom-3 right-3 bg-[#131926]/90 backdrop-blur border border-[#334155] px-2 py-0.5 rounded-md text-[8.5px] font-black text-blue-400 tracking-wider uppercase">
                  Active Preview
                </div>

                {/* Playback Controls Overlay on Hover */}
                <div className="absolute top-2.5 left-2.5 flex gap-1.5 opacity-80 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-6 h-6 rounded-lg bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-xs cursor-pointer"
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-6 h-6 rounded-lg bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-xs cursor-pointer"
                  >
                    {isMuted ? '🔇' : '🔊'}
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Dedicated Upload Dropzones (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-2.5">
              <UploadBox
                title="Upload SVGA"
                sublabel="Dragon.svga"
                value={form.svgaUrl}
                accept=".svga"
                uploadEndpoint="/upload/svga"
                onUploaded={(url) => set('svgaUrl', url)}
              />
              <UploadBox
                title="Lottie (JSON)"
                sublabel="Star.json"
                value={form.lottieUrl}
                accept=".json"
                uploadEndpoint="/upload/svga"
                onUploaded={(url) => set('lottieUrl', url)}
              />
              <UploadBox
                title="Static Image"
                sublabel="Rose.png"
                value={form.imageUrl}
                accept="image/*"
                uploadEndpoint="/upload/image"
                onUploaded={(url) => set('imageUrl', url)}
              />
              <UploadBox
                title="Audio / Sound"
                sublabel="Sound.mp3"
                value={form.soundUrl}
                accept="audio/*"
                uploadEndpoint="/upload/audio"
                onUploaded={(url) => set('soundUrl', url)}
              />
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-5 border-t border-[#1F2738] bg-[#121622] flex items-center justify-end gap-3 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={() => handleCreateOrPublish('DRAFT')}
            disabled={saving || !form.name.trim()}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-xs transition cursor-pointer disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleCreateOrPublish('ACTIVE')}
            disabled={saving || !form.name.trim()}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-600/30"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : gift ? (
              'Save & Update Asset'
            ) : (
              'Create Gift Asset'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Send Gift Panel ───────────────────────────────────────────────────────────
function SendGiftPanel({ gifts }: { gifts: Gift[] }) {
  const [senderId, setSenderId] = useState('100001');
  const [receiverId, setReceiverId] = useState('100003');
  const [giftId, setGiftId] = useState('GIFT-101');
  const [qty, setQty] = useState('1');
  const [roomId, setRoomId] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; msg: string }>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const res = await fetch(`${getApiBase()}/gifts/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderUserId: +senderId, receiverUserId: +receiverId, giftId, quantity: +qty, roomId: roomId || undefined }),
      });
      const json = await res.json();
      setResult({ success: json.success, msg: json.message || json.error || 'Done' });
    } catch {
      setResult({ success: false, msg: 'Network error — is the backend running?' });
    } finally {
      setSending(false);
    }
  };

  const inp = 'w-full bg-[#0B1121] border border-[#1E2D42] rounded-xl px-3 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-indigo-500 transition';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#0D1424] border border-[#1E2D42] rounded-2xl p-5">
        <h3 className="text-sm font-black text-white mb-1">⚡ Trigger Atomic Gift Send</h3>
        <p className="text-[10px] text-slate-400 mb-4">Debits sender diamonds, credits host coin earnings, emits real-time Socket.IO overlay.</p>
        <form onSubmit={handleSend} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Sender UID</label>
              <input value={senderId} onChange={e => setSenderId(e.target.value)} className={inp} placeholder="100001" required />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Receiver UID</label>
              <input value={receiverId} onChange={e => setReceiverId(e.target.value)} className={inp} placeholder="100003" required />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Select Gift</label>
            <select value={giftId} onChange={e => setGiftId(e.target.value)} className={inp}>
              {gifts.map(g => (
                <option key={g.id} value={g.id}>{g.icon} {g.name} — {g.costCoins.toLocaleString()} 💎</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Quantity</label>
              <input type="number" min={1} max={999} value={qty} onChange={e => setQty(e.target.value)} className={inp} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Room ID (optional)</label>
              <input value={roomId} onChange={e => setRoomId(e.target.value)} className={inp} placeholder="room-xxxx" />
            </div>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20"
          >
            {sending ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> : '🎁 Send Gift & Emit Overlay'}
          </button>
          {result && (
            <div className={`p-3 rounded-xl text-xs font-bold border ${result.success ? 'bg-emerald-900/30 border-emerald-700/40 text-emerald-300' : 'bg-red-900/30 border-red-700/40 text-red-300'}`}>
              {result.success ? '✅' : '❌'} {result.msg}
            </div>
          )}
        </form>
      </div>

      {/* Legend / Info panel */}
      <div className="bg-[#0D1424] border border-[#1E2D42] rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-black text-indigo-400">🔬 How the Gift Economy Works</h3>
        {[
          { icon: '💎', color: 'text-amber-400', label: 'Sender Pays Diamonds', desc: 'Diamonds are atomically deducted from sender wallet.' },
          { icon: '🪙', color: 'text-emerald-400', label: 'Host Earns Coins', desc: '70% of diamond value credited as host coins in real-time.' },
          { icon: '📡', color: 'text-cyan-400', label: 'Socket.IO Overlay', desc: 'SVGA / 3D animation emitted to all room participants.' },
          { icon: '🎰', color: 'text-purple-400', label: 'Lucky RNG Engine', desc: 'Cryptographically secure server-side multiplier up to 500x.' },
          { icon: '📜', color: 'text-pink-400', label: 'Immutable Ledger', desc: 'Every transaction recorded in GiftTransaction & WalletLedger.' },
        ].map(item => (
          <div key={item.label} className="flex gap-3">
            <span className="text-2xl leading-none mt-0.5">{item.icon}</span>
            <div>
              <p className={`text-xs font-black ${item.color}`}>{item.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function GiftHubModule() {
  const [gifts, setGifts] = useState<Gift[]>(STATIC_CATALOG);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DRAFT'>('ALL');
  const [search, setSearch] = useState('');
  const [subTab, setSubTab] = useState<'CATALOG' | 'SEND' | 'LEDGER' | 'ANALYTICS'>('CATALOG');
  const [modalGift, setModalGift] = useState<Gift | 'new' | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [txs, setTxs] = useState<GiftTx[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch gifts from DB via admin endpoint (fallback to static catalog)
  const loadGifts = useCallback(async () => {
    setLoading(true);
    const apiBase = getApiBase();
    try {
      const res = await fetch(`${apiBase}/admin/gifts`, { cache: 'no-store' });
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: Gift[] = json.data.map((g: any) => ({
          id: g.id,
          name: g.name,
          icon: g.icon || '🎁',
          costCoins: g.costCoins || 0,
          rewardDiamonds: g.rewardDiamonds || 0,
          category: g.category || 'Popular',
          animationType: g.animationType || 'SMALL',
          animationLevel: g.animationLevel || 'Small Bubble',
          emoji: g.emoji || '',
          svgaUrl: g.svgaUrl,
          lottieUrl: g.lottieUrl,
          imageUrl: g.imageUrl,
          soundUrl: g.soundUrl,
          xpReward: g.xpReward || 100,
          isLucky: g.isLucky || false,
          multiplierMax: g.multiplierMax || 500,
          active: g.active !== false,
          status: g.active ? 'ACTIVE' : 'DRAFT',
          createdAt: g.createdAt || '',
          _count: g._count,
        }));
        setGifts(mapped);
        setLoading(false);
        return;
      }
    } catch { /* fall through to public catalog */ }

    // Fallback: public catalog endpoint
    try {
      const res = await fetch(`${apiBase}/gifts/catalog`, { cache: 'no-store' });
      const json = await res.json();
      if (json.gifts && Array.isArray(json.gifts) && json.gifts.length > 0) {
        const mapped: Gift[] = json.gifts.map((g: any) => ({
          id: g.id,
          name: g.name,
          icon: g.emoji || g.icon || '🎁',
          costCoins: g.costDiamonds || g.costCoins || 0,
          rewardDiamonds: g.hostEarnCoins || g.rewardDiamonds || 0,
          category: g.category || 'Popular',
          animationType: g.animationType || 'SMALL',
          animationLevel: g.animationLevel || 'Small Bubble',
          emoji: g.emoji || '',
          svgaUrl: g.svgaUrl,
          lottieUrl: g.lottieUrl,
          imageUrl: g.imageUrl,
          soundUrl: g.soundUrl,
          xpReward: g.xpReward || 100,
          isLucky: g.isLucky || false,
          multiplierMax: g.multiplierMax || 500,
          active: g.active !== false,
          status: g.active ? 'ACTIVE' : 'DRAFT',
          createdAt: g.createdAt || '',
        }));
        setGifts(mapped);
      }
    } catch {
      // keep static catalog as-is
    } finally {
      setLoading(false);
    }
  }, []);

  // Seed DB from static catalog
  const handleSeedDB = useCallback(async () => {
    setSeeding(true);
    const apiBase = getApiBase();
    try {
      const res = await fetch(`${apiBase}/admin/gifts/seed`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        showToast(`🌱 ${json.message}`, true);
        await loadGifts();
      } else {
        showToast(json.error || 'Seed failed', false);
      }
    } catch {
      showToast('❌ Backend offline — cannot seed', false);
    } finally {
      setSeeding(false);
    }
  }, [loadGifts]);

  const loadTxs = useCallback(async () => {
    setTxLoading(true);
    const apiBase = getApiBase();
    try {
      const res = await fetch(`${apiBase}/admin/gift-transactions`, { cache: 'no-store' });
      const json = await res.json();
      if (json.data) setTxs(json.data);
    } catch { /* offline */ }
    setTxLoading(false);
  }, []);

  useEffect(() => { loadGifts(); }, [loadGifts]);
  useEffect(() => { if (subTab === 'LEDGER' || subTab === 'ANALYTICS') loadTxs(); }, [subTab, loadTxs]);

  // Filtered list
  const filtered = gifts.filter(g => {
    const matchCat = activeCategory === 'All' || g.category === activeCategory;
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && g.active) ||
      (statusFilter === 'DRAFT' && !g.active);
    return matchCat && matchSearch && matchStatus;
  });

  // Stats
  const totalVolume = txs.reduce((s, t) => s + t.totalCoins, 0);
  const luckyGifts = gifts.filter(g => g.isLucky).length;
  const activeGifts = gifts.filter(g => g.active).length;
  const draftGifts = gifts.filter(g => !g.active).length;

  // Duplicate Gift
  const handleDuplicate = async (id: string) => {
    const apiBase = getApiBase();
    try {
      const res = await fetch(`${apiBase}/admin/gifts/${id}/duplicate`, {
        method: 'POST',
      });
      const json = await res.json();
      if (json.success && json.data) {
        showToast(`📑 ${json.message}`, true);
        await loadGifts();
      } else {
        showToast(json.error || 'Failed to duplicate gift', false);
      }
    } catch {
      const source = gifts.find(g => g.id === id);
      if (source) {
        const clone: Gift = {
          ...source,
          id: `GIFT-${Date.now()}`,
          name: `${source.name} (Copy)`,
          active: false,
          status: 'DRAFT',
          createdAt: new Date().toISOString(),
        };
        setGifts(g => [clone, ...g]);
        showToast(`📑 Duplicated "${source.name}"!`, true);
      }
    }
  };

  // Save gift (create or update)
  const handleSave = async (form: FormState) => {
    setSaving(true);
    const apiBase = getApiBase();
    try {
      const payload = {
        name: form.name,
        icon: form.icon,
        category: form.category,
        animationType: form.animationType,
        animationLevel: form.animationLevel,
        emoji: form.emoji,
        costCoins: form.costCoins,
        rewardDiamonds: form.rewardDiamonds,
        xpReward: form.xpReward,
        isLucky: form.isLucky,
        multiplierMax: form.multiplierMax,
        svgaUrl: form.svgaUrl || null,
        lottieUrl: form.lottieUrl || null,
        imageUrl: form.imageUrl || null,
        soundUrl: form.soundUrl || null,
        active: form.active,
        status: form.status,
      };
      const isEdit = modalGift && modalGift !== 'new';
      const url = isEdit
        ? `${apiBase}/admin/gifts/${(modalGift as Gift).id}`
        : `${apiBase}/admin/gifts`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success || json.id || res.ok) {
        showToast(isEdit ? '✅ Gift updated successfully!' : '✅ Gift asset created!', true);
        setModalGift(null);
        await loadGifts();
      } else {
        showToast(json.error || json.message || 'Error saving gift', false);
      }
    } catch {
      if (modalGift === 'new') {
        const newGift: Gift = {
          ...form,
          id: `GIFT-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        setGifts(g => [newGift, ...g]);
        showToast('✅ Gift saved locally!', true);
      } else {
        setGifts(g =>
          g.map(x => (x.id === (modalGift as Gift).id ? { ...x, ...form } : x))
        );
        showToast('✅ Gift updated locally!', true);
      }
      setModalGift(null);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    setGifts(g => g.map(x => x.id === id ? { ...x, active, status: active ? 'ACTIVE' : 'DRAFT' } : x));
    showToast(active ? '✅ Gift activated in store!' : '⏸ Gift moved to Drafts!', true);
    const apiBase = getApiBase();
    try {
      await fetch(`${apiBase}/admin/gifts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active, status: active ? 'ACTIVE' : 'DRAFT' }),
      });
    } catch { /* offline */ }
  };

  const handleDelete = async (id: string) => {
    setGifts(g => g.filter(x => x.id !== id));
    setConfirmDelete(null);
    showToast('🗑 Gift removed', true);
    const apiBase = getApiBase();
    try { await fetch(`${apiBase}/admin/gifts/${id}`, { method: 'DELETE' }); }
    catch { /* offline */ }
  };

  const SUB_TABS = [
    { id: 'CATALOG',   label: '🎁 Gift Assets' },
    { id: 'SEND',      label: '⚡ Live Send Test' },
    { id: 'LEDGER',    label: '📜 Transactions Ledger' },
    { id: 'ANALYTICS', label: '📊 Gift Analytics' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] px-5 py-3.5 rounded-2xl text-xs font-black shadow-2xl border backdrop-blur-sm transition-all ${toast.ok ? 'bg-emerald-900/90 border-emerald-600/50 text-emerald-200' : 'bg-red-900/90 border-red-600/50 text-red-200'}`}>
          {toast.msg}
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0D1424] border border-red-700/50 rounded-2xl p-6 max-w-sm w-full mx-4">
            <p className="text-sm font-black text-white mb-1">🗑 Delete Gift Asset?</p>
            <p className="text-xs text-slate-400 mb-5">This action cannot be undone and will remove the gift from the active catalog.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition cursor-pointer">Yes, Delete</button>
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs transition cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalGift !== null && (
        <GiftModal
          gift={modalGift === 'new' ? null : modalGift}
          onClose={() => setModalGift(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-indigo-950/40 border border-pink-500/30 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🎁</span>
            <h2 className="text-xl font-black text-white tracking-tight">Gift Hub Asset Management</h2>
          </div>
          <p className="text-xs text-slate-300">Complete production virtual gift catalog, animation engine, and live room distribution system</p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={handleSeedDB}
            disabled={seeding}
            title="Seed all gifts into DB"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-900/40 border border-emerald-700/40 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/70 text-xs font-black transition cursor-pointer"
          >
            <span className={seeding ? 'animate-spin' : ''}>🌱</span>
            {seeding ? 'Seeding…' : 'Seed DB'}
          </button>
          <button
            onClick={loadGifts}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0D1424] border border-[#1E2D42] text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
          >
            <span className={`${loading ? 'animate-spin' : ''}`}>↻</span> Refresh
          </button>
          <button
            onClick={() => setModalGift('new')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black transition cursor-pointer shadow-lg shadow-blue-600/30"
          >
            <span className="text-base leading-none">+</span> Create Gift Asset
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Catalog', value: gifts.length, sub: `${activeGifts} active / ${draftGifts} drafts`, color: 'text-white' },
          { label: 'Lucky Mode', value: `${luckyGifts} 🎰`, sub: 'RNG engine enabled', color: 'text-amber-400' },
          { label: 'Gift Volume', value: `💎 ${totalVolume.toLocaleString()}`, sub: 'all time transactions', color: 'text-pink-400' },
          { label: 'Host Earning Rate', value: '70%', sub: 'coin value payout', color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0D1424] border border-[#1E2D42] rounded-2xl p-4">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{s.label}</p>
            <p className={`text-xl font-black mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Sub-Nav ───────────────────────────────────────────────────────── */}
      <div className="bg-[#0D1424] border border-[#1E2D42] rounded-2xl p-1.5 flex gap-1 overflow-x-auto">
        {SUB_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition cursor-pointer text-center whitespace-nowrap ${
              subTab === t.id
                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: CATALOG */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {subTab === 'CATALOG' && (
        <div className="space-y-4">
          {/* Status filter + Search + Category filters */}
          <div className="bg-[#0D1424] border border-[#1E2D42] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Left status buttons */}
            <div className="flex gap-1.5 self-start md:self-auto">
              {(['ALL', 'ACTIVE', 'DRAFT'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-[#101522] text-slate-400 border-[#1E283A] hover:text-white'
                  }`}
                >
                  {st === 'ALL' ? 'All Gifts' : st === 'ACTIVE' ? 'Active' : 'Drafts'}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search gifts..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#0B1121] border border-[#1E2D42] rounded-xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none max-w-full">
              {['All', ...CATEGORIES.slice(0, 8)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer border ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-transparent text-slate-400 border-[#1E2D42] hover:text-white hover:border-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-[#0D1424] border border-[#1E2D42] rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-slate-800/50" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-slate-800/70 rounded-lg w-3/4" />
                    <div className="h-2 bg-slate-800/50 rounded-lg w-1/2" />
                    <div className="h-8 bg-slate-800/30 rounded-xl mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-[#0D1424] border border-[#1E2D42] rounded-2xl p-16 text-center">
              <p className="text-5xl mb-4">🎁</p>
              <p className="text-sm font-black text-white">No gifts found in &quot;{activeCategory}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">Try a different filter or add a new gift asset.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filtered.map(g => (
                <GiftCard
                  key={g.id}
                  gift={g}
                  onEdit={(g) => setModalGift(g)}
                  onDuplicate={(id) => handleDuplicate(id)}
                  onDelete={(id) => setConfirmDelete(id)}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: SEND GIFT */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {subTab === 'SEND' && <SendGiftPanel gifts={gifts.filter(g => g.active)} />}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: TRANSACTIONS LEDGER */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {subTab === 'LEDGER' && (
        <div className="bg-[#0D1424] border border-[#1E2D42] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#1E2D42] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">📜 Gift Transaction Ledger</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Immutable audit trail of all gift sends</p>
            </div>
            <button onClick={loadTxs} disabled={txLoading} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer">
              <span className={txLoading ? 'animate-spin' : ''}>↻</span> Reload
            </button>
          </div>

          {txLoading ? (
            <div className="p-10 text-center text-xs text-slate-400 font-bold">Loading transactions…</div>
          ) : txs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-4xl mb-3">📜</p>
              <p className="text-sm font-black text-slate-400">No gift transactions yet</p>
              <p className="text-[10px] text-slate-500 mt-1">Send a gift from the ⚡ Live Send Test tab to see entries here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-[#1E2D42]">
                    {['Gift', 'Sender UID', 'Receiver UID', 'Qty', '💎 Cost', '🪙 Earned', 'Time'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-black">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txs.map((tx, i) => (
                    <tr key={tx.id} className={`border-b border-[#1E2D42]/50 hover:bg-slate-800/30 transition ${i % 2 === 0 ? '' : 'bg-slate-900/20'}`}>
                      <td className="px-4 py-3 font-black text-white">{tx.gift?.icon || '🎁'} {tx.gift?.name || tx.giftId}</td>
                      <td className="px-4 py-3 text-slate-300 font-mono">{tx.senderId}</td>
                      <td className="px-4 py-3 text-slate-300 font-mono">{tx.receiverId}</td>
                      <td className="px-4 py-3 text-white font-black">×{tx.count}</td>
                      <td className="px-4 py-3 text-amber-400 font-black">💎 {tx.totalCoins.toLocaleString()}</td>
                      <td className="px-4 py-3 text-emerald-400 font-black">🪙 {tx.totalDiamonds.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono">{new Date(tx.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 4: ANALYTICS */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {subTab === 'ANALYTICS' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0D1424] border border-[#1E2D42] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-white">📊 Top Performing Gifts</h3>
            <div className="space-y-3">
              {gifts.slice(0, 6).map((g, idx) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between bg-[#141B2B] p-3.5 rounded-2xl border border-[#202B3F]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs font-black">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-black text-white">{g.name}</p>
                      <p className="text-[10px] text-slate-400">{g.category}</p>
                    </div>
                  </div>
                  <p className="text-xs font-black text-amber-400">💎 {g.costCoins.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0D1424] border border-[#1E2D42] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-black text-white">🔬 Economy Architecture</h3>
            {[
              { title: 'Atomic Wallet Deduction', desc: 'Diamonds are debited from user balance with database-level concurrency locks.' },
              { title: 'Real-time Host Earning', desc: 'Host receives 70% coin credit instantly for withdrawal or conversions.' },
              { title: 'Socket.IO Broadcast Event', desc: 'Full-screen SVGA / 3D overlay event emitted to all live room listeners.' },
              { title: 'Animation Queue & Deduplication', desc: 'Mobile client deduplicates by eventId and queues multiple gifts smoothly.' },
            ].map(item => (
              <div key={item.title} className="bg-[#141B2B] p-3.5 rounded-2xl border border-[#202B3F]">
                <p className="text-xs font-black text-pink-400">{item.title}</p>
                <p className="text-[11px] text-slate-300 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
