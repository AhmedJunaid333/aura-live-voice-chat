'use client';

import React, { useState } from 'react';

export default function LuckyGiftModule() {
  const [gifts, setGifts] = useState([
    { id: 'GFT-101', name: '🌹 Red Rose', price: '10 Coins', multiplier: '500x Lucky', animation: '3D Flower Burst', category: 'LUCKY', active: true },
    { id: 'GFT-102', name: '💎 Diamond Ring', price: '500 Coins', multiplier: '1000x Jackpot', animation: 'Sparkle Ring', category: 'LUCKY', active: true },
    { id: 'GFT-103', name: '🏎️ Ferrari F8', price: '5,000 Coins', multiplier: '2000x Mega', animation: '3D Sports Car Entry', category: 'LUXURY', active: true },
    { id: 'GFT-104', name: '🏰 Royal Castle', price: '20,000 Coins', multiplier: '5000x Sovereign', animation: 'Full Screen Castle', category: 'SVIP', active: true },
  ]);

  const toggleGift = (id: string) => {
    setGifts(prev => prev.map(g => g.id === id ? { ...g, active: !g.active } : g));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/40 via-red-900/30 to-purple-900/40 border border-amber-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🎯 Lucky Gift Engine & Virtual Gift Store
        </h2>
        <p className="text-xs text-slate-300 mt-1">Configure virtual gifts, lucky multipliers, jackpot odds, 3D animations and coin reward rates</p>
      </div>

      {/* Gift Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-amber-400">🎁 Active In-App Gift Catalog ({gifts.length} Items)</h3>
          <button className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer">
            + Add New Virtual Gift
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Gift ID</th>
                <th className="pb-3">Gift Title</th>
                <th className="pb-3">Coin Price</th>
                <th className="pb-3">Lucky Multiplier</th>
                <th className="pb-3">3D Animation</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {gifts.map(g => (
                <tr key={g.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{g.id}</td>
                  <td className="font-bold text-white text-sm">{g.name}</td>
                  <td className="font-bold text-amber-400">{g.price}</td>
                  <td className="text-pink-400 font-bold">{g.multiplier}</td>
                  <td className="text-purple-300">{g.animation}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {g.category}
                    </span>
                  </td>
                  <td>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      g.active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {g.active ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleGift(g.id)}
                      className={`px-3 py-1 rounded-xl font-bold text-[10px] transition cursor-pointer border ${
                        g.active ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {g.active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
