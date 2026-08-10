'use client';

import React, { useState } from 'react';

export default function GamesEventsModule() {
  const [games] = useState([
    { id: 'GAME-01', title: '🍒 Fruit Slots Wheel', category: 'LUCKY_SLOTS', winRate: '92.5%', totalBets: '15,200,000 Coins', status: 'ONLINE' },
    { id: 'GAME-02', title: '🃏 Teen Patti Battle', category: 'CARD_STRATEGY', winRate: '88.0%', totalBets: '8,500,000 Coins', status: 'ONLINE' },
    { id: 'GAME-03', title: '🎡 Fortune Jackpot Wheel', category: 'MEGA_WHEEL', winRate: '95.0%', totalBets: '32,100,000 Coins', status: 'ONLINE' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/40 via-red-900/30 to-purple-900/40 border border-amber-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🎮 In-App Mini-Games & Events Studio
        </h2>
        <p className="text-xs text-slate-300 mt-1">Configure audio lounge mini-games (Fruit Slots, Teen Patti, Lucky Wheel), jackpot payout odds & seasonal tournament events</p>
      </div>

      {/* Games Catalog */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-amber-400">🎲 Active Voice Lounge Mini-Games</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Game ID</th>
                <th className="pb-3">Game Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">RTP / Return Odds</th>
                <th className="pb-3">Total Coins Bet Volume</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {games.map(g => (
                <tr key={g.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{g.id}</td>
                  <td className="font-bold text-white text-sm">{g.title}</td>
                  <td className="text-purple-300">{g.category}</td>
                  <td className="text-emerald-400 font-bold">{g.winRate}</td>
                  <td className="font-bold text-amber-400">{g.totalBets}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {g.status}
                    </span>
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
