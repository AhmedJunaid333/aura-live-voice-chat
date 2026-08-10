import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export interface LevelCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'Wealth' | 'Charm' | 'Host';
  userName?: string;
  userAvatar?: string;
}

export const WEALTH_LEVEL_TIERS = [
  {
    iconBadge: 'LV.1',
    range: '1-10',
    gemIcon: '💎',
    badgeColor: 'text-slate-900 font-extrabold',
    bgBadge: 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300',
    border: 'border-slate-300/40',
    shadow: 'shadow-slate-500/20',
  },
  {
    iconBadge: 'LV.11',
    range: '11-20',
    gemIcon: '🔷',
    badgeColor: 'text-white font-extrabold',
    bgBadge: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700',
    border: 'border-blue-400/50',
    shadow: 'shadow-blue-500/30',
  },
  {
    iconBadge: 'LV.21',
    range: '21-30',
    gemIcon: '❇️',
    badgeColor: 'text-white font-extrabold',
    bgBadge: 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600',
    border: 'border-emerald-400/50',
    shadow: 'shadow-emerald-500/30',
  },
  {
    iconBadge: 'LV.31',
    range: '31-40',
    gemIcon: '💠',
    badgeColor: 'text-slate-950 font-extrabold',
    bgBadge: 'bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400',
    border: 'border-cyan-400/50',
    shadow: 'shadow-cyan-500/30',
  },
  {
    iconBadge: 'LV.41',
    range: '41-50',
    gemIcon: '🔮',
    badgeColor: 'text-white font-extrabold',
    bgBadge: 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-600',
    border: 'border-fuchsia-400/50',
    shadow: 'shadow-fuchsia-500/30',
  },
  {
    iconBadge: 'LV.51',
    range: '51-60',
    gemIcon: '🌌',
    badgeColor: 'text-white font-extrabold',
    bgBadge: 'bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800',
    border: 'border-blue-500/60',
    shadow: 'shadow-indigo-500/40',
  },
  {
    iconBadge: 'LV.61',
    range: '61-70',
    gemIcon: '💖',
    badgeColor: 'text-white font-extrabold',
    bgBadge: 'bg-gradient-to-r from-rose-500 via-pink-600 to-red-600',
    border: 'border-rose-400/60',
    shadow: 'shadow-rose-500/40',
  },
  {
    iconBadge: 'LV.71',
    range: '71-80',
    gemIcon: '⚡',
    badgeColor: 'text-white font-extrabold',
    bgBadge: 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500',
    border: 'border-amber-400/60',
    shadow: 'shadow-purple-500/40',
  },
  {
    iconBadge: 'LV.81',
    range: '81-90',
    gemIcon: '👑',
    badgeColor: 'text-slate-950 font-black',
    bgBadge: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-rose-500',
    border: 'border-yellow-400/80',
    shadow: 'shadow-amber-500/50',
  },
  {
    iconBadge: 'LV.91',
    range: '91-100',
    gemIcon: '☀️',
    badgeColor: 'text-white font-black',
    bgBadge: 'bg-gradient-to-r from-rose-600 via-amber-500 to-purple-700',
    border: 'border-amber-300',
    shadow: 'shadow-rose-500/60',
  },
];

export const HOST_LEVEL_TIERS = [
  {
    iconBadge: 'LV.1',
    range: '1-10',
    gemIcon: '🛡️',
    badgeColor: 'text-white font-extrabold',
    bgBadge: 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700',
    border: 'border-emerald-400/50',
    shadow: 'shadow-emerald-500/30',
  },
  {
    iconBadge: 'LV.11',
    range: '11-20',
    gemIcon: '🌸',
    badgeColor: 'text-white font-extrabold',
    bgBadge: 'bg-gradient-to-r from-rose-700 via-pink-600 to-rose-800',
    border: 'border-rose-400/50',
    shadow: 'shadow-rose-500/30',
  },
  {
    iconBadge: 'LV.21',
    range: '21-30',
    gemIcon: '💎',
    badgeColor: 'text-slate-900 font-extrabold',
    bgBadge: 'bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-500',
    border: 'border-cyan-300/60',
    shadow: 'shadow-cyan-400/30',
  },
  {
    iconBadge: 'LV.31',
    range: '31-40',
    gemIcon: '💖',
    badgeColor: 'text-white font-extrabold',
    bgBadge: 'bg-gradient-to-r from-pink-600 via-fuchsia-500 to-pink-700',
    border: 'border-pink-400/50',
    shadow: 'shadow-pink-500/30',
  },
  {
    iconBadge: 'LV.41',
    range: '41-50',
    gemIcon: '🔮',
    badgeColor: 'text-white font-extrabold',
    bgBadge: 'bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800',
    border: 'border-purple-400/50',
    shadow: 'shadow-purple-500/30',
  },
  {
    iconBadge: 'LV.51',
    range: '51-60',
    gemIcon: '🔷',
    badgeColor: 'text-white font-extrabold',
    bgBadge: 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800',
    border: 'border-blue-500/60',
    shadow: 'shadow-blue-500/40',
  },
  {
    iconBadge: 'LV.61',
    range: '61-70',
    gemIcon: '💠',
    badgeColor: 'text-white font-extrabold',
    bgBadge: 'bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700',
    border: 'border-teal-400/60',
    shadow: 'shadow-teal-500/40',
  },
  {
    iconBadge: 'LV.71',
    range: '71-80',
    gemIcon: '🌿',
    badgeColor: 'text-slate-950 font-black',
    bgBadge: 'bg-gradient-to-r from-lime-500 via-green-400 to-emerald-500',
    border: 'border-lime-300/80',
    shadow: 'shadow-lime-500/50',
  },
  {
    iconBadge: 'LV.81',
    range: '81-90',
    gemIcon: '👑',
    badgeColor: 'text-slate-950 font-black',
    bgBadge: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500',
    border: 'border-yellow-400/80',
    shadow: 'shadow-amber-500/50',
  },
  {
    iconBadge: 'LV.91',
    range: '91-100',
    gemIcon: '👑',
    badgeColor: 'text-white font-black',
    bgBadge: 'bg-gradient-to-r from-rose-600 via-amber-500 to-purple-700',
    border: 'border-amber-300',
    shadow: 'shadow-rose-500/60',
  },
];

export const LevelCenterModal: React.FC<LevelCenterModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'Wealth',
  userName = 'ꪜB D Dimple 💉',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
}) => {
  const [activeTab, setActiveTab] = useState<'Wealth' | 'Charm' | 'Host'>(
    defaultCategory === 'Charm' ? 'Charm' : defaultCategory === 'Host' ? 'Host' : 'Wealth'
  );

  if (!isOpen) return null;

  // Category-specific XP and level metrics matching reference
  const tabData = {
    Wealth: {
      currentLevel: 4,
      nextLevel: 5,
      neededXp: 13156,
      progressPercent: 78,
      badgeLabel: 'LV.4',
      badgeGradient: 'from-slate-200 via-slate-100 to-slate-300',
      badgeText: 'text-slate-900',
      gemIcon: '💎',
      tiers: WEALTH_LEVEL_TIERS,
    },
    Charm: {
      currentLevel: 12,
      nextLevel: 13,
      neededXp: 7420,
      progressPercent: 65,
      badgeLabel: 'LV.12',
      badgeGradient: 'from-blue-600 via-indigo-600 to-blue-700',
      badgeText: 'text-white',
      gemIcon: '💖',
      tiers: WEALTH_LEVEL_TIERS,
    },
    Host: {
      currentLevel: 0,
      nextLevel: 1,
      neededXp: 12000,
      progressPercent: 35,
      badgeLabel: 'LV.0',
      badgeGradient: 'from-blue-600 via-indigo-600 to-blue-700',
      badgeText: 'text-white',
      gemIcon: '🎙️',
      tiers: HOST_LEVEL_TIERS,
    },
  }[activeTab];

  return (
    <div className="fixed inset-0 z-50 bg-[#070E22] text-white flex flex-col overflow-y-auto hide-scrollbar select-none animate-fadeIn">
      {/* 1. TOP APP BAR */}
      <div className="sticky top-0 z-30 bg-[#070E22]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-blue-950/40">
        <button
          onClick={onClose}
          className="p-1 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-base font-bold text-white tracking-wide">
          Level
        </h1>

        {/* Placeholder to balance centered title */}
        <div className="w-6" />
      </div>

      {/* 2. TABS: WEALTH | CHARM | HOST */}
      <div className="flex items-center justify-around px-4 pt-3 pb-2 border-b border-blue-950/60 bg-[#070E22]">
        {(['Wealth', 'Charm', 'Host'] as const).map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative flex-1 py-2 text-center text-sm font-semibold transition cursor-pointer"
            >
              <span className={isActive ? 'text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'}>
                {tab}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/50" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. USER SUMMARY PROFILE CARD */}
      <div className="px-6 py-6 flex flex-col items-center text-center space-y-3 bg-gradient-to-b from-[#070E22] via-[#0A1638] to-[#070E22]">
        {/* User Avatar with Ring */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-xl shadow-blue-950">
            <img
              src={userAvatar}
              alt={userName}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        {/* User Name */}
        <h2 className="text-base font-extrabold text-white tracking-wide">
          {userName}
        </h2>

        {/* Current Level Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 border border-blue-400/60 shadow-md shadow-blue-950/60">
          <span className="text-xs">{tabData.gemIcon}</span>
          <span className={`text-xs font-black tracking-wider ${tabData.badgeText}`}>
            {tabData.badgeLabel}
          </span>
        </div>

        {/* Horizontal Level Progress Bar */}
        <div className="w-full max-w-sm pt-2 space-y-1.5">
          <div className="w-full h-2 rounded-full bg-[#0D1C45] overflow-hidden p-0.5 border border-blue-900/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 transition-all duration-700 shadow-sm shadow-blue-400"
              style={{ width: `${tabData.progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-bold text-slate-400 px-0.5">
            <span>LV.{tabData.currentLevel}</span>
            <span>LV.{tabData.nextLevel}</span>
          </div>
        </div>

        {/* Experience Points Needed Text */}
        <p className="text-xs text-slate-300 pt-1 font-medium">
          There are still{' '}
          <span className="font-bold text-blue-400 font-mono">
            {tabData.neededXp.toLocaleString()}
          </span>{' '}
          experience points needed for upgrading
        </p>
      </div>

      {/* 4. LEVEL ICONS & LEVEL RANGE TABLE */}
      <div className="flex-1 px-4 pb-12 space-y-3">
        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#0E1A3D] rounded-2xl border border-blue-900/40 text-xs font-bold text-slate-300 shadow-md">
          <span>Level icons</span>
          <span>Level range (Lv.)</span>
        </div>

        {/* Level Tiers Rows */}
        <div className="space-y-2.5">
          {tabData.tiers.map((tier, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-6 py-3.5 bg-[#0C1736] hover:bg-[#0F1D45] rounded-2xl border border-blue-900/30 transition-all duration-200 shadow-sm"
            >
              {/* Level Icon / Winged Badge */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full ${tier.bgBadge} ${tier.border} ${tier.shadow} border shadow-md`}
                >
                  <span className="text-xs">{tier.gemIcon}</span>
                  <span className={`text-[11px] tracking-wider ${tier.badgeColor}`}>
                    {tier.iconBadge}
                  </span>
                </div>
              </div>

              {/* Level Range (Lv.) */}
              <div className="text-sm font-bold text-slate-200 font-sans tracking-wide">
                {tier.range}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
