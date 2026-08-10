import { useState } from 'react';

export function UnifiedCharmAndLevelSection() {
  const [activeSubTab, setActiveSubTab] = useState<'levels' | 'perks' | 'calculator'>('levels');
  const [calcLevel, setCalcLevel] = useState(50);

  const levelsData = [
    { lvl: 1, name: 'Novice Dreamer', xpReq: 0, reward: 'Basic Chat Bubble', vehicle: 'None', color: 'text-slate-400', badgeBg: 'bg-slate-700' },
    { lvl: 10, name: 'Bronze Rising Star', xpReq: 10000, reward: 'Bronze Glow + Chat Sound', vehicle: 'Vespa Scooter', color: 'text-amber-600', badgeBg: 'bg-amber-800' },
    { lvl: 25, name: 'Silver Vanguard', xpReq: 50000, reward: 'Silver Halo + Priority Seat', vehicle: 'Audi R8 Coupe', color: 'text-slate-300', badgeBg: 'bg-slate-600' },
    { lvl: 50, name: 'Gold Aureola Champion', xpReq: 250000, reward: 'Gold Name Glow + 10% Cashout Perk', vehicle: 'Ferrari F8 Tributo', color: 'text-amber-400', badgeBg: 'bg-amber-600' },
    { lvl: 75, name: 'Diamond Sovereign', xpReq: 1000000, reward: 'Diamond Prism Avatar Frame + Direct Support', vehicle: 'Bugatti Chiron W16', color: 'text-cyan-400', badgeBg: 'bg-cyan-600' },
    { lvl: 90, name: 'Galactic Overlord', xpReq: 3500000, reward: 'Galactic Entrance Fanfare + Custom Room Theme', vehicle: 'Lamborghini Terzo Millennio', color: 'text-purple-400', badgeBg: 'bg-purple-600' },
    { lvl: 100, name: 'Aura Pantheon Deity', xpReq: 10000000, reward: 'Godlike Realm Full Screen Animation + Sovereign Crest', vehicle: 'Interstellar Starship Cruiser', color: 'text-rose-400', badgeBg: 'bg-gradient-to-r from-amber-500 to-rose-600' },
  ];

  const calculatedXp = Math.round(Math.pow(calcLevel, 2.8) * 120);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-amber-900/40 border border-purple-500/30 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-black text-xs border border-purple-500/30">
              Levels 1 - 100 Progression Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Dynamic Multiplier Formula</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            🌟 Charm Management & Unified Level Engine
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Configure User Charm XP requirements, Wealth multipliers, custom luxury entrance vehicles (Bugatti, Ferrari, Starship), and VIP Star progression perks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { key: 'levels', label: '1-100 Level Ladder' },
            { key: 'calculator', label: '🧮 Formula Calculator' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveSubTab(t.key as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === t.key
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-[#111927] text-slate-400 hover:text-white border border-[#1E293B]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'levels' ? (
        <div className="bg-[#111927] border border-[#1E293B] rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-[#1E293B] flex justify-between items-center">
            <h3 className="font-extrabold text-white text-sm">👑 1-100 Unified Charm & Wealth Ladder</h3>
            <span className="text-xs text-slate-400 font-mono">Auto Calculated In Database</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0D1322] text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Level Tier</th>
                  <th className="p-3.5">Grade Title</th>
                  <th className="p-3.5">Required XP</th>
                  <th className="p-3.5">Exclusive Luxury Vehicle</th>
                  <th className="p-3.5">Chat & Room Perks</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {levelsData.map(l => (
                  <tr key={l.lvl} className="hover:bg-slate-900/60 transition">
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-xl font-mono font-black text-xs text-white ${l.badgeBg}`}>
                        LV.{l.lvl}
                      </span>
                    </td>
                    <td className={`p-3.5 font-bold ${l.color}`}>{l.name}</td>
                    <td className="p-3.5 font-mono text-cyan-400 font-bold">{l.xpReq.toLocaleString()} XP</td>
                    <td className="p-3.5 font-semibold text-amber-300">🚗 {l.vehicle}</td>
                    <td className="p-3.5 text-slate-300">{l.reward}</td>
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
      ) : (
        <div className="bg-[#111927] border border-[#1E293B] rounded-3xl p-6 shadow-2xl space-y-5">
          <div>
            <h3 className="text-lg font-black text-white">🧮 Real-Time XP Curve Calculator</h3>
            <p className="text-xs text-slate-400">Drag slider to compute exact XP curve and diamond threshold for any level from 1 to 100.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">Target Level:</span>
              <span className="text-purple-400 text-base font-black font-mono">Level {calcLevel}</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={calcLevel}
              onChange={e => setCalcLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400">Total Required Charm XP</span>
              <div className="text-xl font-black text-purple-400 font-mono mt-1">{calculatedXp.toLocaleString()} XP</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Coin Spend Equivalent</span>
              <div className="text-xl font-black text-emerald-400 font-mono mt-1">{(calculatedXp * 10).toLocaleString()} Coins</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Calculated Multiplier</span>
              <div className="text-xl font-black text-amber-400 font-mono mt-1">{(1 + calcLevel * 0.05).toFixed(2)}x Boost</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
