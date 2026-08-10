'use client';

import React, { useState } from 'react';

export default function VipUserLevelsModule() {
  const [levels] = useState([
    { level: 1, expRequired: '0 EXP', title: 'Bronze Starter', perk: 'Basic Room Seat', badge: '🥉 Level 1' },
    { level: 10, expRequired: '100,000 EXP', title: 'Silver Vocalist', perk: 'Silver Entrance Frame', badge: '🥈 Level 10' },
    { level: 25, expRequired: '500,000 EXP', title: 'Gold Sovereign', perk: 'Gold Crown Badge + Speedster Entrance', badge: '🥇 Level 25' },
    { level: 50, expRequired: '2,500,000 EXP', title: 'Diamond Emperor', perk: 'Imperial Dragon Entrance + Global Announcement', badge: '💎 Level 50' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/40 via-purple-900/30 to-indigo-900/40 border border-amber-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          📊 VIP & User Levels System Matrix
        </h2>
        <p className="text-xs text-slate-300 mt-1">Configure User EXP level progression tiers (Level 1 to 100), level-up reward perks, entrance animations & badge icons</p>
      </div>

      {/* Levels Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-amber-400">🌟 EXP Level Progression Tiers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Level Rank</th>
                <th className="pb-3">Title Rank</th>
                <th className="pb-3">Required EXP Points</th>
                <th className="pb-3">Badge Icon</th>
                <th className="pb-3">Unlocked Reward Perks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {levels.map(l => (
                <tr key={l.level} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-amber-400">Level {l.level}</td>
                  <td className="font-bold text-white text-sm">{l.title}</td>
                  <td className="text-emerald-400 font-bold">{l.expRequired}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      {l.badge}
                    </span>
                  </td>
                  <td className="text-purple-300">{l.perk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
