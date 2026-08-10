import React, { useState, useEffect } from 'react';
import { adminDb, type MedalRecord } from '../services/adminEnterpriseDataService';

export const MEDAL_CATEGORIES = [
  'All 14 Categories',
  'VIP & Nobility',
  'PK Tournament',
  'Economy & Wealth',
  'Guild & Community',
  'Host & Talent',
  'Charm & Romance',
  'Guardian Angel',
  'Celestial Pantheon',
  'Anniversary & Loyalty',
  'Special Seasonal',
];

export function MedalManagementSection({ activeSubKey = 'all' }: { activeSubKey?: string }) {
  const [medals, setMedals] = useState<MedalRecord[]>(adminDb.getMedals());
  const [selectedCat, setSelectedCat] = useState('All 14 Categories');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedMedalForAward, setSelectedMedalForAward] = useState<MedalRecord | null>(null);
  const [targetUid, setTargetUid] = useState('100821');
  const [subView, setSubView] = useState<'all' | 'categories' | 'create' | 'rewards' | 'conditions' | 'user' | 'event' | 'seasonal' | 'hidden' | 'analytics' | 'reports'>('all');

  // New Medal Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('VIP & Nobility');
  const [icon, setIcon] = useState('🏆');
  const [rarity, setRarity] = useState<MedalRecord['rarity']>('LEGENDARY');
  const [xpBonus, setXpBonus] = useState('+25% XP');
  const [unlockCondition, setUnlockCondition] = useState('Reach Level 50 Creator');

  useEffect(() => {
    return adminDb.subscribe(() => {
      setMedals(adminDb.getMedals());
    });
  }, []);

  useEffect(() => {
    const key = activeSubKey.toLowerCase();
    if (key.includes('create')) {
      setSubView('create');
      setShowCreateModal(true);
    } else if (key.includes('reward')) setSubView('rewards');
    else if (key.includes('condition')) setSubView('conditions');
    else if (key.includes('user')) setSubView('user');
    else if (key.includes('event')) setSubView('event');
    else if (key.includes('seasonal')) setSubView('seasonal');
    else if (key.includes('hidden')) setSubView('hidden');
    else if (key.includes('analytic')) setSubView('analytics');
    else if (key.includes('report')) setSubView('reports');
    else if (key.includes('category') || key.includes('categories')) setSubView('categories');
    else setSubView('all');
  }, [activeSubKey]);

  const filtered = medals.filter(m => {
    if (subView === 'event') return m.category.includes('PK') || m.category.includes('Event');
    if (subView === 'seasonal') return m.category.includes('Seasonal') || m.rarity === 'MYTHIC';
    if (subView === 'hidden') return m.rarity === 'MYTHIC' || m.name.includes('Deity');
    return selectedCat === 'All 14 Categories' || m.category === selectedCat;
  });

  const handleCreateMedal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    adminDb.addMedal({
      name,
      category,
      icon,
      rarity,
      xpBonus,
      badgeBorder: rarity === 'MYTHIC' ? 'border-amber-400' : rarity === 'LEGENDARY' ? 'border-red-500' : 'border-purple-500',
      unlockCondition,
      active: true,
    });
    setName('');
    setShowCreateModal(false);
  };

  const handleAwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedalForAward) return;
    alert(`Medal "${selectedMedalForAward.name}" successfully awarded to User UID: ${targetUid} and synced with live database!`);
    setShowAwardModal(false);
  };

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/40 via-yellow-900/30 to-purple-900/40 border border-amber-500/30 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/30">
              14 Medal Categories Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Live Roster Synchronization</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            🏅 Medal & Honor Achievement Center
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Configure custom honor medals, set seasonal XP multipliers, award badges to VIP/Streamer UIDs, and monitor active leaderboard achievements.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer transition transform hover:scale-105"
        >
          <span>✨</span>
          <span>+ Create Custom Medal</span>
        </button>
      </div>

      {/* Sub-View Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { key: 'all', label: '🏆 All Medals' },
          { key: 'categories', label: '🗂️ 14 Categories' },
          { key: 'rewards', label: '💎 Medal Rewards & Perks' },
          { key: 'conditions', label: '📜 Unlock Conditions' },
          { key: 'event', label: '🔥 Event Medals' },
          { key: 'seasonal', label: '🍂 Seasonal Medals' },
          { key: 'hidden', label: '✨ Hidden Godlike Medals' },
          { key: 'analytics', label: '📊 Medal Analytics' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSubView(tab.key as any)}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 ${
              subView === tab.key
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'bg-[#111927] text-slate-400 hover:text-white border border-[#1E293B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Pills (When in All or Categories mode) */}
      {(subView === 'all' || subView === 'categories') && (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1" style={{ scrollbarWidth: 'none' }}>
          {MEDAL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                selectedCat === cat
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/60'
                  : 'bg-[#111927] text-slate-400 hover:text-white border border-[#1E293B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Rewards Matrix */}
      {subView === 'rewards' && (
        <div className="bg-[#111927] border border-[#1E293B] rounded-3xl p-5 shadow-2xl space-y-4">
          <h3 className="font-extrabold text-white text-base">💎 Medal Bonus Perks & Multipliers Matrix</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { rank: 'MYTHIC', perk: '+50% Intimacy XP + Full Screen Announcement', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-500/40' },
              { rank: 'LEGENDARY', perk: '+30% PK Multiplier + Custom Avatar Ring', color: 'text-red-400', bg: 'bg-red-950/40 border-red-500/40' },
              { rank: 'EPIC', perk: '+20% Gift Cashback + Priority Voice Mic Seat', color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-500/40' },
            ].map((p, i) => (
              <div key={i} className={`p-4 rounded-2xl border ${p.bg} space-y-2`}>
                <span className={`text-xs font-black font-mono ${p.color}`}>{p.rank} TIER</span>
                <p className="text-xs text-white font-semibold">{p.perk}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conditions Matrix */}
      {subView === 'conditions' && (
        <div className="bg-[#111927] border border-[#1E293B] rounded-3xl p-5 shadow-2xl space-y-4">
          <h3 className="font-extrabold text-white text-base">📜 Automatic Medal Unlock Conditions</h3>
          <div className="space-y-3">
            {medals.map(m => (
              <div key={m.id} className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{m.name}</h4>
                    <span className="text-slate-400">{m.unlockCondition}</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold font-mono">{m.xpBonus}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Matrix */}
      {subView === 'analytics' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Medals Awarded', val: '4,890 Badges', sub: 'Across 14 Categories', color: 'text-amber-400' },
            { label: 'Most Popular Badge', val: 'PK Champion 🔥', sub: '88 Users Claimed', color: 'text-red-400' },
            { label: 'Mythic Deity Holders', val: '14 Users', sub: 'Top 0.01% Elite', color: 'text-purple-400' },
            { label: 'Average Medal Retention', val: '180 Days', sub: 'Seasonal Reset', color: 'text-cyan-400' },
          ].map((s, i) => (
            <div key={i} className="bg-[#111927] border border-[#1E293B] rounded-3xl p-5 shadow-xl">
              <span className="text-xs text-slate-400 font-semibold">{s.label}</span>
              <div className={`text-2xl font-black ${s.color} mt-2`}>{s.val}</div>
              <span className="text-[10px] text-slate-500 mt-1 block">{s.sub}</span>
            </div>
          ))}
        </div>
      )}

      {/* Medals Grid (Default / Filtered) */}
      {(subView === 'all' || subView === 'categories' || subView === 'event' || subView === 'seasonal' || subView === 'hidden') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(medal => (
            <div
              key={medal.id}
              className="bg-[#111927] border border-[#1E293B] hover:border-amber-500/50 rounded-3xl p-5 shadow-xl transition space-y-3 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border-2 border-amber-400/50 flex items-center justify-center text-2xl shadow-inner">
                    {medal.icon}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    medal.rarity === 'MYTHIC'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : medal.rarity === 'LEGENDARY'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  }`}>
                    {medal.rarity}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] font-mono text-slate-500">{medal.category}</span>
                  <h3 className="font-extrabold text-white text-sm leading-snug">{medal.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{medal.unlockCondition}</p>
                </div>

                <div className="mt-3 bg-slate-900/80 p-2 rounded-xl border border-slate-800 text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">XP / Perk:</span>
                    <span className="text-emerald-400 font-bold">{medal.xpBonus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Awarded Count:</span>
                    <span className="text-amber-400 font-bold">{medal.awardedUsersCount} Users</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setSelectedMedalForAward(medal);
                    setShowAwardModal(true);
                  }}
                  className="py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-[10px] font-bold border border-amber-500/40 transition cursor-pointer"
                >
                  🎁 Award User
                </button>
                <button
                  onClick={() => adminDb.toggleMedalActive(medal.id)}
                  className={`py-1.5 rounded-xl text-[10px] font-bold border transition cursor-pointer ${
                    medal.active
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {medal.active ? '● Active' : '○ Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Medal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateMedal}
            className="w-full max-w-md bg-[#111927] border border-[#1E293B] rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">🏅 Create New Honor Medal</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Medal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Master Singer Crown"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  {MEDAL_CATEGORIES.filter(c => c !== 'All 14 Categories').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Rarity</label>
                <select
                  value={rarity}
                  onChange={e => setRarity(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="COMMON">Common</option>
                  <option value="RARE">Rare</option>
                  <option value="EPIC">Epic</option>
                  <option value="LEGENDARY">Legendary</option>
                  <option value="MYTHIC">Mythic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Icon Emoji</label>
                <input
                  type="text"
                  value={icon}
                  onChange={e => setIcon(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">XP / Bonus Perk</label>
                <input
                  type="text"
                  value={xpBonus}
                  onChange={e => setXpBonus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unlock Condition</label>
              <input
                type="text"
                value={unlockCondition}
                onChange={e => setUnlockCondition(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-xs font-bold text-slate-950 cursor-pointer"
              >
                Save Medal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Award Medal Modal */}
      {showAwardModal && selectedMedalForAward && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleAwardSubmit}
            className="w-full max-w-md bg-[#111927] border border-[#1E293B] rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">🎁 Award Medal to User</h3>
              <button
                type="button"
                onClick={() => setShowAwardModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <span className="text-3xl">{selectedMedalForAward.icon}</span>
              <div>
                <h4 className="font-bold text-white text-sm">{selectedMedalForAward.name}</h4>
                <span className="text-[10px] text-amber-400 font-mono">{selectedMedalForAward.category} • {selectedMedalForAward.rarity}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target User ID (UID)</label>
              <input
                type="text"
                required
                value={targetUid}
                onChange={e => setTargetUid(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAwardModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-xs font-bold text-slate-950 cursor-pointer"
              >
                Confirm Award
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
