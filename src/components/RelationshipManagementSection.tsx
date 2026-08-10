import React, { useState, useEffect } from 'react';
import { adminDb, type RelationshipRecord } from '../services/adminEnterpriseDataService';

export const CARD_TYPES = [
  { key: 'ALL', label: 'All 16 Cards', icon: '💎' },
  { key: 'CP', label: '1. CP (Royal Couple)', icon: '💖', color: 'from-pink-500 to-rose-600' },
  { key: 'BEST_FRIEND', label: '2. Best Friend (BFF)', icon: '🤝', color: 'from-cyan-500 to-blue-600' },
  { key: 'BROTHER', label: '3. Sworn Brother', icon: '🛡️', color: 'from-amber-500 to-orange-600' },
  { key: 'SISTER', label: '4. Sisterhood', icon: '🌸', color: 'from-purple-500 to-pink-500' },
  { key: 'SIBLINGS', label: '5. Siblings Bond', icon: '✨', color: 'from-emerald-500 to-teal-600' },
  { key: 'CONFIDANT', label: '6. Trusted Confidant', icon: '📜', color: 'from-indigo-500 to-purple-600' },
  { key: 'SOULMATE', label: '7. Celestial Soulmate', icon: '🌟', color: 'from-violet-500 to-fuchsia-600' },
  { key: 'MENTOR', label: '8. Grand Mentor', icon: '🎓', color: 'from-blue-600 to-indigo-700' },
  { key: 'DISCIPLE', label: '9. Disciple / Student', icon: '🌱', color: 'from-teal-500 to-emerald-600' },
  { key: 'GUARDIAN', label: '10. Guardian Angel', icon: '👼', color: 'from-amber-400 to-yellow-600' },
  { key: 'KNIGHT', label: '11. Royal Knight', icon: '⚔️', color: 'from-slate-500 to-slate-700' },
  { key: 'QUEEN', label: '12. Sovereign Queen', icon: '👸', color: 'from-rose-500 to-red-700' },
  { key: 'KING', label: '13. Sovereign King', icon: '🤴', color: 'from-amber-600 to-yellow-700' },
  { key: 'PARTNER', label: '14. PK Duo Partner', icon: '🔥', color: 'from-red-500 to-orange-600' },
  { key: 'TWIN', label: '15. Cosmic Twin', icon: '♊', color: 'from-cyan-400 to-teal-500' },
  { key: 'SWORN', label: '16. Blood Oath Brotherhood', icon: '🩸', color: 'from-red-700 to-rose-900' },
];

export const RELATIONSHIP_LEVELS_DATA = [
  { level: 1, name: 'First Encounter', reqXp: 0, ring: 'Silver Promise Ring', perk: 'Dual Chat Glow', color: 'text-slate-300' },
  { level: 2, name: 'Sweet Harmony', reqXp: 15000, ring: 'Rose Quartz Halo', perk: 'Exclusive Heart Emote Pack', color: 'text-pink-300' },
  { level: 3, name: 'True Companions', reqXp: 40000, ring: 'Golden Tiger Crest', perk: 'Co-Host Priority Mic Seat', color: 'text-amber-400' },
  { level: 4, name: 'Bound by Destiny', reqXp: 80000, ring: 'Cherry Blossom Halo', perk: 'Custom Room Greeting Sound', color: 'text-rose-400' },
  { level: 5, name: 'Eternal Devotion', reqXp: 150000, ring: 'Silver Guardian Shield', perk: 'Shared Castle Gift Fanfare', color: 'text-cyan-400' },
  { level: 6, name: 'Soul Resonance', reqXp: 250000, ring: 'Emerald Lotus Coronet', perk: 'Dual Entrance Sports Car', color: 'text-emerald-400' },
  { level: 7, name: 'Celestial Bond', reqXp: 400000, ring: 'Diamond Heart Sparkle Ring', perk: 'Exclusive CP 3D Space Room', color: 'text-purple-400' },
  { level: 8, name: 'Cosmic Majesty', reqXp: 650000, ring: 'Solar Flare Sovereign Crown', perk: '10% Shared Coin Cashback', color: 'text-yellow-400' },
  { level: 9, name: 'Immortal Legends', reqXp: 1000000, ring: 'Cosmic Galaxy Prism Ring', perk: 'Full Room Banner Takeover', color: 'text-indigo-400' },
  { level: 10, name: 'Aura Sovereign Deity', reqXp: 2000000, ring: 'Godlike Realm Halo Ring', perk: 'Immunity Shield & Starship Vehicle', color: 'text-pink-500' },
];

export const RELATIONSHIP_MISSIONS_DATA = [
  { id: 'RMIS-101', name: 'Send 50 Shared Hearts', desc: 'Gift 50 hearts inside partner stream', reward: '+500 Bond XP, +100 Coins', category: 'Daily Quest', active: true },
  { id: 'RMIS-102', name: 'Co-Host 30 Mins Audio Mic', desc: 'Sit on adjacent seats for 30 minutes', reward: '+1,200 Bond XP, Halo Sparkle', category: 'Live Mic Quest', active: true },
  { id: 'RMIS-103', name: 'Win 1 Duo PK Battle', desc: 'Defend partner stream in PK match', reward: '+3,000 Bond XP, Winner Badge', category: 'PK Battle Quest', active: true },
  { id: 'RMIS-104', name: 'Send Love Castle Mega Gift', desc: 'Send 10,000+ coin gift to partner', reward: '+10,000 Bond XP, Ring Upgrade', category: 'Luxury Gift Quest', active: true },
];

export function RelationshipManagementSection({ activeSubKey = 'all' }: { activeSubKey?: string }) {
  const [relationships, setRelationships] = useState<RelationshipRecord[]>(adminDb.getRelationships());
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPairModal, setShowPairModal] = useState(false);
  const [subView, setSubView] = useState<'cards' | 'levels' | 'rewards' | 'missions' | 'analytics' | 'audit'>('cards');

  // Pair Form State
  const [newType, setNewType] = useState<RelationshipRecord['type']>('CP');
  const [user1Id, setUser1Id] = useState('');
  const [user2Id, setUser2Id] = useState('');
  const [initialRing, setInitialRing] = useState('Diamond Heart Sparkle Ring');


  useEffect(() => {
    return adminDb.subscribe(() => {
      setRelationships(adminDb.getRelationships());
    });
  }, []);

  useEffect(() => {
    const key = activeSubKey.toLowerCase();
    if (key.includes('level')) setSubView('levels');
    else if (key.includes('reward')) setSubView('rewards');
    else if (key.includes('mission')) setSubView('missions');
    else if (key.includes('analytic')) setSubView('analytics');
    else if (key.includes('audit')) setSubView('audit');
    else {
      setSubView('cards');
      if (key.includes('cp')) setSelectedType('CP');
      else if (key.includes('best-friend') || key.includes('bff')) setSelectedType('BEST_FRIEND');
      else if (key.includes('brother')) setSelectedType('BROTHER');
      else if (key.includes('sister')) setSelectedType('SISTER');
      else if (key.includes('sibling')) setSelectedType('SIBLINGS');
      else if (key.includes('pending')) setStatusFilter('PENDING');
      else if (key.includes('active')) setStatusFilter('ACTIVE');
      else setSelectedType('ALL');
    }
  }, [activeSubKey]);

  const filteredList = relationships.filter(rel => {
    const matchesType = selectedType === 'ALL' || rel.type === selectedType;
    const matchesStatus = statusFilter === 'ALL' || rel.status === statusFilter;
    const matchesSearch =
      rel.cardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rel.user1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rel.user2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rel.user1.id.includes(searchQuery) ||
      rel.user2.id.includes(searchQuery);
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleCreatePair = (e: React.FormEvent) => {
    e.preventDefault();
    const cardInfo = CARD_TYPES.find(c => c.key === newType);
    adminDb.addRelationship({
      type: newType,
      cardName: cardInfo ? cardInfo.label.replace(/^\d+\.\s*/, '') : 'Royal Bond',
      icon: cardInfo ? cardInfo.icon : '💖',
      color: cardInfo ? cardInfo.color : 'from-pink-500 to-rose-600',
      user1: { id: user1Id, name: `User_${user1Id}`, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop', level: 25 },
      user2: { id: user2Id, name: `User_${user2Id}`, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', level: 30 },
      level: 1,
      currentXp: 5000,
      targetXp: 30000,
      anniversaryDays: 1,
      sharedGiftsCoins: 50000,
      status: 'ACTIVE',
      ringAnimation: initialRing,
      perks: ['Dual Chat Frame Glow', 'Custom In-Room Relationship Banner', 'Shared Gift Multiplier'],
    });
    setShowPairModal(false);
  };

  return (
    <section className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-indigo-900/40 border border-pink-500/30 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 font-black text-xs border border-pink-500/30">
                16 Social Economy Cards
              </span>
              <span className="text-xs text-slate-400 font-mono">Live In-App Database Synced</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              ❤️ Relationship Management & Bond Engine
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Manage all 16 Relationship card tiers (CP, BFF, Brothers, Sisters, Mentors, Guardians),
              real-time Level 1-10 progress, shared coin rewards, custom ring animations, and anniversary milestones.
            </p>
          </div>

          <button
            onClick={() => setShowPairModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-pink-900/50 flex items-center gap-2 cursor-pointer transition transform hover:scale-105"
          >
            <span>💍</span>
            <span>+ Pair New Relationship</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-View Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { key: 'cards', label: '🎴 16 Cards Hub' },
          { key: 'levels', label: '⚡ Levels (1-10) Progression' },
          { key: 'rewards', label: '🎁 Relationship Rewards' },
          { key: 'missions', label: '🎯 Daily Bond Missions' },
          { key: 'analytics', label: '📊 Relationship Analytics' },
          { key: 'audit', label: '📜 Bond Audit Logs' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSubView(tab.key as any)}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 ${
              subView === tab.key
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30'
                : 'bg-[#111927] text-slate-400 hover:text-white border border-[#1E293B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. SUB-VIEW: 16 CARDS HUB */}
      {subView === 'cards' && (
        <div className="space-y-5">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Active Bond Pairs', val: relationships.filter(r => r.status === 'ACTIVE').length, sub: 'Across 16 Card Tiers', color: 'text-pink-400' },
              { label: 'Total Shared Gifts', val: '27.4M Coins', sub: 'Shared Economy', color: 'text-amber-400' },
              { label: 'Max Level 10 Bonds', val: relationships.filter(r => r.level >= 7).length, sub: 'Celestial Sovereign', color: 'text-purple-400' },
              { label: 'Avg Anniversary Days', val: '107 Days', sub: 'High Retention', color: 'text-cyan-400' },
            ].map((m, i) => (
              <div key={i} className="bg-[#111927] border border-[#1E293B] rounded-2xl p-4 shadow-lg">
                <span className="text-[11px] font-semibold text-slate-400">{m.label}</span>
                <div className={`text-2xl font-black ${m.color} mt-1`}>{m.val}</div>
                <span className="text-[10px] text-slate-500">{m.sub}</span>
              </div>
            ))}
          </div>

          {/* 16 Card Types Horizontal Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-2" style={{ scrollbarWidth: 'none' }}>
            {CARD_TYPES.map(card => {
              const isSelected = selectedType === card.key;
              return (
                <button
                  key={card.key}
                  onClick={() => setSelectedType(card.key)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30'
                      : 'bg-[#111927] text-slate-300 hover:text-white border border-[#1E293B] hover:bg-slate-800'
                  }`}
                >
                  <span>{card.icon}</span>
                  <span>{card.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Status Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111927] border border-[#1E293B] p-3 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Search by User Name, UID or Card..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">Status:</span>
              {['ALL', 'ACTIVE', 'PENDING', 'DISBANDED'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    statusFilter === st
                      ? 'bg-pink-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* 16 Relationship Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredList.map(rel => {
              const progressPercent = Math.min(100, Math.round((rel.currentXp / rel.targetXp) * 100));

              return (
                <div
                  key={rel.id}
                  className="bg-[#111927] border border-[#1E293B] hover:border-pink-500/50 rounded-3xl p-5 shadow-xl transition space-y-4 relative overflow-hidden"
                >
                  {/* Card Header Badge */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${rel.color} flex items-center justify-center text-lg shadow-lg`}>
                        {rel.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-pink-400 font-bold">{rel.id}</span>
                        <h3 className="font-extrabold text-white text-sm leading-tight">{rel.cardName}</h3>
                        <span className="text-[10px] text-slate-400">Anniversary: <b>{rel.anniversaryDays} Days</b></span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        rel.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : rel.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        ● {rel.status}
                      </span>
                      <span className="text-[10px] font-bold text-amber-400">Level {rel.level} / 10</span>
                    </div>
                  </div>

                  {/* Paired Users Avatars */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={rel.user1.avatar} alt={rel.user1.name} className="w-9 h-9 rounded-full border-2 border-pink-500/60 object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-white leading-tight">{rel.user1.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">UID: {rel.user1.id}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-xs animate-bounce">{rel.icon}</span>
                      <span className="text-[9px] font-mono text-pink-400 font-bold">LV.{rel.level}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-right">
                      <div>
                        <h4 className="font-bold text-xs text-white leading-tight">{rel.user2.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">UID: {rel.user2.id}</span>
                      </div>
                      <img src={rel.user2.avatar} alt={rel.user2.name} className="w-9 h-9 rounded-full border-2 border-purple-500/60 object-cover" />
                    </div>
                  </div>

                  {/* XP Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold">
                      <span className="text-slate-400">Level {rel.level} XP Progress</span>
                      <span className="text-pink-400">{rel.currentXp.toLocaleString()} / {rel.targetXp.toLocaleString()} XP ({progressPercent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${rel.color} transition-all duration-500`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Perks & Ring Animation Info */}
                  <div className="bg-[#0D1322] p-2.5 rounded-xl border border-slate-800/80 text-[10px] space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>💍 Ring Effect:</span>
                      <span className="text-amber-300 font-semibold">{rel.ringAnimation}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>🪙 Shared Gifts:</span>
                      <span className="text-emerald-400 font-bold">{rel.sharedGiftsCoins.toLocaleString()} Coins</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => adminDb.updateRelationshipLevel(rel.id, rel.level + 1)}
                      className="py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white text-[10px] font-bold border border-purple-500/40 transition cursor-pointer"
                    >
                      ⚡ Level Up
                    </button>
                    <button
                      onClick={() => adminDb.updateRelationshipStatus(rel.id, rel.status === 'ACTIVE' ? 'DISBANDED' : 'ACTIVE')}
                      className={`py-1.5 rounded-xl text-[10px] font-bold border transition cursor-pointer ${
                        rel.status === 'ACTIVE'
                          ? 'bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border-rose-500/40'
                          : 'bg-emerald-500/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border-emerald-500/40'
                      }`}
                    >
                      {rel.status === 'ACTIVE' ? '🚫 Disband' : '✅ Activate'}
                    </button>
                    <button
                      onClick={() => adminDb.deleteRelationship(rel.id)}
                      className="py-1.5 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white text-[10px] font-bold border border-slate-700 transition cursor-pointer"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SUB-VIEW: LEVELS (1-10) PROGRESSION LADDER */}
      {subView === 'levels' && (
        <div className="bg-[#111927] border border-[#1E293B] rounded-3xl overflow-hidden shadow-2xl space-y-4 p-5">
          <div>
            <h3 className="font-extrabold text-white text-base">⚡ Relationship Bond Levels (1 to 10) Master Ladder</h3>
            <p className="text-xs text-slate-400">XP thresholds, required intimacy points, custom ring 3D halo effects, and room space unlock tiers.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0D1322] text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Bond Level</th>
                  <th className="p-3.5">Title Name</th>
                  <th className="p-3.5">Required XP</th>
                  <th className="p-3.5">3D Ring Animation</th>
                  <th className="p-3.5">Exclusive Room Privilege</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {RELATIONSHIP_LEVELS_DATA.map(lvl => (
                  <tr key={lvl.level} className="hover:bg-slate-900/60 transition">
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-xl bg-pink-500/20 text-pink-300 font-mono font-black text-xs border border-pink-500/30">
                        LV.{lvl.level}
                      </span>
                    </td>
                    <td className={`p-3.5 font-bold ${lvl.color}`}>{lvl.name}</td>
                    <td className="p-3.5 font-mono text-cyan-400 font-bold">{lvl.reqXp.toLocaleString()} XP</td>
                    <td className="p-3.5 font-semibold text-amber-300">💍 {lvl.ring}</td>
                    <td className="p-3.5 text-slate-300">{lvl.perk}</td>
                    <td className="p-3.5 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. SUB-VIEW: RELATIONSHIP REWARDS */}
      {subView === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: '🏰 Shared Love Castle', icon: '🏰', cost: '100,000 Coins', perk: 'Full Room Screen 3D Castle Takeover with Rose Fireworks', tier: 'Level 5+ Couples' },
            { title: '🏎️ Dual Celestial Sports Car', icon: '🏎️', cost: '500,000 Coins', perk: 'Custom Entrance vehicle with both user avatars', tier: 'Level 6+ Bonds' },
            { title: '💍 Sovereign Prism Ring', icon: '💍', cost: '1,000,000 Coins', perk: 'Glowing 3D Halo orbiting avatar everywhere in app', tier: 'Level 9+ Soulmates' },
          ].map((rew, i) => (
            <div key={i} className="bg-[#111927] border border-[#1E293B] rounded-3xl p-5 shadow-xl space-y-3">
              <div className="text-3xl">{rew.icon}</div>
              <h3 className="font-extrabold text-white text-base">{rew.title}</h3>
              <p className="text-xs text-slate-400">{rew.perk}</p>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="font-mono text-amber-400 font-bold">{rew.cost}</span>
                <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 text-[10px] font-bold">{rew.tier}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. SUB-VIEW: RELATIONSHIP MISSIONS */}
      {subView === 'missions' && (
        <div className="bg-[#111927] border border-[#1E293B] rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-white text-base">🎯 Daily Relationship & Bond Quests</h3>
              <p className="text-xs text-slate-400">Missions performed by pairs to gain shared intimacy XP and bonus coin multipliers.</p>
            </div>
            <button
              onClick={() => alert('New Relationship Mission Creator Triggered')}
              className="px-3 py-1.5 rounded-xl bg-pink-600 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              + Add Bond Mission
            </button>
          </div>

          <div className="space-y-3">
            {RELATIONSHIP_MISSIONS_DATA.map(m => (
              <div key={m.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-lg">
                    ✨
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{m.id} • {m.category}</span>
                    <h4 className="font-bold text-white text-sm">{m.name}</h4>
                    <p className="text-xs text-slate-400">{m.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs font-bold text-emerald-400 font-mono">{m.reward}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    ACTIVE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SUB-VIEW: ANALYTICS */}
      {subView === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Daily Intimacy XP Generated', val: '4.82M XP', change: '+24.2% Today', color: 'text-pink-400' },
            { label: 'Active CP Couples', val: '1,420 Pairs', change: 'Top Category', color: 'text-purple-400' },
            { label: 'Total Shared Castle Gifts', val: '18,400 Gifts', change: '84.2M Coins', color: 'text-amber-400' },
            { label: 'Average Relationship Duration', val: '142 Days', change: '94% Retention', color: 'text-cyan-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#111927] border border-[#1E293B] rounded-3xl p-5 shadow-xl">
              <span className="text-xs text-slate-400 font-semibold">{stat.label}</span>
              <div className={`text-2xl font-black ${stat.color} mt-2`}>{stat.val}</div>
              <span className="text-[10px] text-slate-500 mt-1 block">{stat.change}</span>
            </div>
          ))}
        </div>
      )}

      {/* 8. SUB-VIEW: AUDIT LOGS */}
      {subView === 'audit' && (
        <div className="bg-[#111927] border border-[#1E293B] rounded-3xl p-5 shadow-2xl space-y-3">
          <h3 className="font-extrabold text-white text-base">📜 Real-Time Relationship Audit Trail</h3>
          <div className="space-y-2">
            {[
              { id: 'LOG-R1', action: 'PAIR_CREATE', desc: 'Paired Sara_Vip7 and King_Rana_VIP into Royal Couple (CP)', time: '2m ago', status: 'SUCCESS' },
              { id: 'LOG-R2', action: 'LEVEL_UP', desc: 'Celestial Soulmate (#REL-SO-105) upgraded to Level 9', time: '14m ago', status: 'SUCCESS' },
              { id: 'LOG-R3', action: 'GIFT_REWARD', desc: 'Disbursed Shared Castle Gift (100k Coins) to Best Friend pair', time: '1h ago', status: 'SUCCESS' },
            ].map(log => (
              <div key={log.id} className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono text-cyan-400 text-[10px] font-bold">{log.id} • {log.action}</span>
                  <div className="text-white font-semibold mt-0.5">{log.desc}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-bold">{log.status}</span>
                  <div className="text-[10px] text-slate-500">{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. Pair Modal */}
      {showPairModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePair}
            className="w-full max-w-lg bg-[#111927] border border-[#1E293B] rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>💍</span>
                <span>Pair New 16-Tier Relationship</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPairModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Card Tier / Relationship Type</label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                {CARD_TYPES.filter(c => c.key !== 'ALL').map(c => (
                  <option key={c.key} value={c.key}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">User 1 UID</label>
                <input
                  type="text"
                  required
                  value={user1Id}
                  onChange={e => setUser1Id(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">User 2 UID</label>
                <input
                  type="text"
                  required
                  value={user2Id}
                  onChange={e => setUser2Id(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Ring / Halo Animation</label>
              <input
                type="text"
                value={initialRing}
                onChange={e => setInitialRing(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPairModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-xs font-bold text-white shadow-lg cursor-pointer"
              >
                Create Pair & Sync DB
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
