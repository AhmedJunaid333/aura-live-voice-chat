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
  svgaUrl?: string;
  lottieUrl?: string;
  imageUrl?: string;
  soundUrl?: string;
  xpReward: number;
  isLucky: boolean;
  multiplierMax: number;
  active: boolean;
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
}

const BLANK_FORM: FormState = {
  name: '',
  icon: '🎁',
  category: 'Popular',
  animationType: 'SMALL',
  costCoins: 100,
  rewardDiamonds: 70,
  xpReward: 100,
  isLucky: false,
  multiplierMax: 500,
  svgaUrl: '',
  lottieUrl: '',
  imageUrl: '',
  soundUrl: '',
  active: true,
};

function getApiBase(): string {
  if (typeof window !== 'undefined') {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return 'https://aura-live-voice-chat-1.onrender.com/api/v1';
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
}

const CATEGORIES = ['All', 'Popular', 'Luxury', 'Special FX', 'Romantic', 'Lucky', 'Draw', 'Multi', 'Family Prestige', 'VIP'];
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
  gift, onEdit, onDelete, onToggle,
}: { gift: Gift; onEdit: (g: Gift) => void; onDelete: (id: string) => void; onToggle: (id: string, active: boolean) => void }) {
  const catCls = CAT_STYLE[gift.category] || CAT_STYLE.All;
  return (
    <div
      className={`relative bg-[#0F1623] border rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 hover:border-slate-600 ${gift.active ? 'border-[#1E2D42]' : 'border-red-900/50 opacity-60'}`}
    >
      {/* Lucky ribbon */}
      {gift.isLucky && (
        <div className="absolute top-3 left-[-28px] rotate-[-45deg] bg-gradient-to-r from-amber-500 to-orange-500 text-[8px] font-black text-black px-8 py-0.5 z-10 shadow-md">
          LUCKY
        </div>
      )}

      {/* Gift preview box */}
      <div className="w-full aspect-square bg-gradient-to-br from-[#131B2E] to-[#0A0F1C] flex items-center justify-center relative border-b border-[#1E2D42]">
        {/* Animation type badge */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${getAnimStyle(gift.animationType)}`}>
            {gift.animationType}
          </span>
          {gift.svgaUrl && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-cyan-800/50 text-cyan-300">SVGA</span>}
          {gift.lottieUrl && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-fuchsia-800/50 text-fuchsia-300">JSON</span>}
          {gift.imageUrl && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-blue-800/50 text-blue-300">IMG</span>}
          {gift.soundUrl && <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-green-800/50 text-green-300">AUDIO</span>}
        </div>
        {/* Emoji or Image Icon */}
        {gift.imageUrl ? (
          <img src={gift.imageUrl} alt={gift.name} className="w-16 h-16 object-contain drop-shadow-2xl rounded-lg" />
        ) : (
          <span className="text-5xl select-none drop-shadow-2xl filter">{gift.icon}</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[13px] font-black text-white truncate leading-tight">{gift.name}</p>
            <Pill text={gift.category} cls={catCls} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">Cost</p>
            <p className="text-base font-black text-amber-400 leading-tight">
              💎 {gift.costCoins.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-400 font-semibold">XP</p>
            <p className="text-base font-black text-pink-400 leading-tight">+{gift.xpReward}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-400 font-semibold">Earns</p>
            <p className="text-base font-black text-emerald-400 leading-tight">
              🪙 {gift.rewardDiamonds.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-[#1E2D42]">
          <button
            onClick={() => onEdit(gift)}
            className="flex-1 py-1.5 text-[10px] font-black rounded-xl bg-indigo-900/50 hover:bg-indigo-800/70 text-indigo-300 transition cursor-pointer border border-indigo-700/40"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onToggle(gift.id, !gift.active)}
            className={`flex-1 py-1.5 text-[10px] font-black rounded-xl transition cursor-pointer border ${
              gift.active
                ? 'bg-amber-900/30 hover:bg-amber-800/50 text-amber-300 border-amber-700/30'
                : 'bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-300 border-emerald-700/30'
            }`}
          >
            {gift.active ? '⏸ Deactivate' : '▶ Activate'}
          </button>
          <button
            onClick={() => onDelete(gift.id)}
            className="px-3 py-1.5 text-[10px] font-black rounded-xl bg-red-900/30 hover:bg-red-800/50 text-red-400 transition cursor-pointer border border-red-700/30"
          >
            🗑
          </button>
        </div>
      </div>
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
          animationType: gift.animationType, costCoins: gift.costCoins,
          rewardDiamonds: gift.rewardDiamonds, xpReward: gift.xpReward,
          isLucky: gift.isLucky, multiplierMax: gift.multiplierMax,
          svgaUrl: gift.svgaUrl || '', lottieUrl: gift.lottieUrl || '',
          imageUrl: gift.imageUrl || '', soundUrl: gift.soundUrl || '',
          active: gift.active,
        }
      : BLANK_FORM
  );

  const set = (k: keyof FormState, v: any) => setForm(f => ({ ...f, [k]: v }));

  function inp(cls = '') {
    return `w-full bg-[#0B1121] border border-[#1E2D42] rounded-xl px-3 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-indigo-500 transition ${cls}`;
  }

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0D1424] border border-[#1E2D42] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1E2D42] sticky top-0 bg-[#0D1424] z-10">
          <div>
            <h3 className="text-base font-black text-white">{gift ? '✏️ Edit Gift' : '➕ Add New Gift'}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Configure virtual gift asset for the live economy</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer font-bold text-sm">✕</button>
        </div>

        <div className="p-5 space-y-5">
          {/* Row 1: emoji + name */}
          <div className="flex gap-3">
            <div className="w-20 flex-shrink-0">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Icon</label>
              <input value={form.icon} onChange={e => set('icon', e.target.value)} className={`${inp()} text-center text-2xl`} maxLength={4} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Gift Name</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} className={inp()} placeholder="e.g. Royal Galaxy Crown 3D" required />
            </div>
          </div>

          {/* Row 2: category + animation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inp()}>
                {['Popular','Romantic','Luxury','Special FX','Lucky'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">Animation Type</label>
              <select value={form.animationType} onChange={e => set('animationType', e.target.value)} className={inp()}>
                {ANIMATION_TYPES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>

          {/* Row 3: costs */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">💎 Diamond Cost</label>
              <input type="number" min={1} value={form.costCoins} onChange={e => set('costCoins', +e.target.value)} className={`${inp()} text-amber-400`} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">🪙 Host Earns</label>
              <input type="number" min={0} value={form.rewardDiamonds} onChange={e => set('rewardDiamonds', +e.target.value)} className={`${inp()} text-emerald-400`} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">⚡ XP Reward</label>
              <input type="number" min={0} value={form.xpReward} onChange={e => set('xpReward', +e.target.value)} className={`${inp()} text-pink-400`} />
            </div>
          </div>

          {/* Row 4: media URLs */}
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Media Assets (optional)</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <ImageUploadDropzone
                  label="Gift Icon / Artwork (Auto WebP + Thumbnail)"
                  value={form.imageUrl}
                  onChange={(data) => set('imageUrl', data.imageUrl)}
                  onRemove={() => set('imageUrl', '')}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-cyan-400 block mb-1">SVGA URL (optional)</label>
                <input value={form.svgaUrl} onChange={e => set('svgaUrl', e.target.value)} className={inp()} placeholder="https://.../.svga" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-green-400 block mb-1">Sound Effect URL (optional)</label>
                <input value={form.soundUrl} onChange={e => set('soundUrl', e.target.value)} className={inp()} placeholder="https://.../.mp3" />
              </div>
            </div>
          </div>

          {/* Row 5: lucky toggle */}
          <div className="flex items-center justify-between bg-[#0B1121] border border-[#1E2D42] rounded-2xl p-4">
            <div>
              <p className="text-sm font-black text-amber-400">🎰 Lucky Gift Mode</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Enables server-side RNG multiplier engine</p>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Max Multiplier</label>
                <input type="number" min={1} max={5000} value={form.multiplierMax} onChange={e => set('multiplierMax', +e.target.value)} className={`${inp()} w-24 text-amber-400`} disabled={!form.isLucky} />
              </div>
              <button
                type="button"
                onClick={() => set('isLucky', !form.isLucky)}
                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer focus:outline-none ${form.isLucky ? 'bg-amber-500' : 'bg-slate-700'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${form.isLucky ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Row 6: active toggle */}
          <div className="flex items-center justify-between bg-[#0B1121] border border-[#1E2D42] rounded-2xl p-4">
            <div>
              <p className="text-sm font-black text-white">Active in Catalog</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Inactive gifts are hidden from the mobile store</p>
            </div>
            <button
              type="button"
              onClick={() => set('active', !form.active)}
              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer focus:outline-none ${form.active ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${form.active ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Save */}
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 disabled:opacity-50 text-white font-black text-sm transition cursor-pointer shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            {saving ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : gift ? '💾 Update Gift' : '✨ Create Gift'}
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
  const [search, setSearch] = useState('');
  const [subTab, setSubTab] = useState<'CATALOG' | 'SEND' | 'LEDGER'>('CATALOG');
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
      // Try admin endpoint first (returns full DB rows)
      const res = await fetch(`${apiBase}/admin/gifts`, { cache: 'no-store' });
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: Gift[] = json.data.map((g: any) => ({
          id: g.id, name: g.name, icon: g.icon || '🎁',
          costCoins: g.costCoins || 0, rewardDiamonds: g.rewardDiamonds || 0,
          category: g.category || 'Popular', animationType: g.animationType || 'SMALL',
          svgaUrl: g.svgaUrl, lottieUrl: g.lottieUrl,
          imageUrl: g.imageUrl, soundUrl: g.soundUrl,
          xpReward: g.xpReward || 100, isLucky: g.isLucky || false,
          multiplierMax: g.multiplierMax || 500, active: g.active !== false,
          createdAt: g.createdAt || '', _count: g._count,
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
          id: g.id, name: g.name, icon: g.emoji || g.icon || '🎁',
          costCoins: g.costDiamonds || g.costCoins || 0,
          rewardDiamonds: g.hostEarnCoins || g.rewardDiamonds || 0,
          category: g.category || 'Popular', animationType: g.animationType || 'SMALL',
          svgaUrl: g.svgaUrl, lottieUrl: g.lottieUrl,
          imageUrl: g.imageUrl, soundUrl: g.soundUrl,
          xpReward: g.xpReward || 100, isLucky: g.isLucky || false,
          multiplierMax: g.multiplierMax || 500, active: g.active !== false,
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
  useEffect(() => { if (subTab === 'LEDGER') loadTxs(); }, [subTab, loadTxs]);

  // Filtered list
  const filtered = gifts.filter(g => {
    const matchCat = activeCategory === 'All' || g.category === activeCategory;
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Stats
  const totalVolume = txs.reduce((s, t) => s + t.totalCoins, 0);
  const luckyGifts = gifts.filter(g => g.isLucky).length;
  const activeGifts = gifts.filter(g => g.active).length;

  // Save gift (create or update)
  const handleSave = async (form: FormState) => {
    setSaving(true);
    const apiBase = getApiBase();
    try {
      const payload = {
        name: form.name, icon: form.icon, category: form.category,
        animationType: form.animationType, costCoins: form.costCoins,
        rewardDiamonds: form.rewardDiamonds, xpReward: form.xpReward,
        isLucky: form.isLucky, multiplierMax: form.multiplierMax,
        svgaUrl: form.svgaUrl || null, lottieUrl: form.lottieUrl || null,
        imageUrl: form.imageUrl || null, soundUrl: form.soundUrl || null,
        active: form.active,
      };
      const isEdit = modalGift && modalGift !== 'new';
      const url = isEdit
        ? `${apiBase}/admin/gifts/${(modalGift as Gift).id}`
        : `${apiBase}/admin/gifts`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (json.success || json.id || res.ok) {
        showToast(isEdit ? '✅ Gift updated!' : '✅ Gift created!', true);
        setModalGift(null);
        await loadGifts();
      } else {
        showToast(json.error || json.message || 'Error saving gift', false);
      }
    } catch {
      // Update locally for demo
      if (modalGift === 'new') {
        const newGift: Gift = { ...form, id: `GIFT-${Date.now()}`, createdAt: new Date().toISOString() };
        setGifts(g => [...g, newGift]);
        showToast('✅ Gift added locally (backend offline)', true);
      } else {
        setGifts(g => g.map(x => x.id === (modalGift as Gift).id ? { ...x, ...form } : x));
        showToast('✅ Gift updated locally (backend offline)', true);
      }
      setModalGift(null);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    setGifts(g => g.map(x => x.id === id ? { ...x, active } : x));
    showToast(active ? '✅ Gift activated' : '⏸ Gift deactivated', true);
    const apiBase = getApiBase();
    try {
      await fetch(`${apiBase}/admin/gifts/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });
    } catch { /* offline — local state already updated */ }
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
    { id: 'CATALOG', label: '🎁 Gift Catalog' },
    { id: 'SEND',    label: '⚡ Send Gift' },
    { id: 'LEDGER',  label: '📜 Transactions' },
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
            <p className="text-sm font-black text-white mb-1">🗑 Delete Gift?</p>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-2xl">🎁</span>
            <h2 className="text-xl font-black text-white tracking-tight">Gift Management Hub</h2>
          </div>
          <p className="text-xs text-slate-400">Manage your catalog of virtual gifts, prices, and live animation assets.</p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={handleSeedDB}
            disabled={seeding}
            title="Seed all 12 default gifts into Neon DB"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-900/40 border border-emerald-700/40 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/70 text-xs font-black transition cursor-pointer"
          >
            <span className={seeding ? 'animate-spin' : ''}>🌱</span>
            {seeding ? 'Seeding…' : 'Seed DB'}
          </button>
          <button
            onClick={loadGifts}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D1424] border border-[#1E2D42] text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer"
          >
            <span className={`${loading ? 'animate-spin' : ''}`}>↻</span> Refresh
          </button>
          <button
            onClick={() => setModalGift('new')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-black transition cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            ➕ Add New Gift
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Gifts', value: gifts.length, sub: `${activeGifts} active`, color: 'text-white' },
          { label: 'Lucky Gifts', value: `${luckyGifts} 🎰`, sub: 'RNG engine enabled', color: 'text-amber-400' },
          { label: 'Gift Volume', value: `💎 ${totalVolume.toLocaleString()}`, sub: 'all time', color: 'text-cyan-400' },
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
      <div className="bg-[#0D1424] border border-[#1E2D42] rounded-2xl p-1.5 flex gap-1">
        {SUB_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer text-center ${
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
          {/* Search + Category filters */}
          <div className="bg-[#0D1424] border border-[#1E2D42] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center">
            {/* Search */}
            <div className="relative w-full md:w-72 flex-shrink-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search gifts by name..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#0B1121] border border-[#1E2D42] rounded-xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border ${
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
              <p className="text-[10px] text-slate-500 mt-1">Send a gift from the ⚡ Send Gift tab to see entries here</p>
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
    </div>
  );
}
