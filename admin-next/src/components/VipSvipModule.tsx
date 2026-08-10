'use client';

import React, { useState } from 'react';

export default function VipSvipModule() {
  const [vipTiers] = useState([
    { level: 1, name: 'VIP 1 Baron', coinsReq: '10,000 Coins', badge: '👑 VIP 1', perk: 'Bronze Entrance Effect + Chat Glow', users: 12 },
    { level: 2, name: 'VIP 2 Count', coinsReq: '50,000 Coins', badge: '👑 VIP 2', perk: 'Silver Wings Frame + Speedster Car', users: 8 },
    { level: 3, name: 'VIP 3 Duke', coinsReq: '150,000 Coins', badge: '👑 VIP 3', perk: 'Gold Crown Badge + Ferrari F8', users: 5 },
    { level: 4, name: 'VIP 4 King', coinsReq: '500,000 Coins', badge: '👑 VIP 4', perk: 'Diamond Prism Frame + Bugatti Chiron', users: 3 },
    { level: 5, name: 'VIP 5 Emperor', coinsReq: '1,500,000 Coins', badge: '👑 VIP 5', perk: 'Imperial Dragon Entrance + Global Announce', users: 2 },
  ]);

  const [svipPrivileges] = useState([
    { rank: 'SVIP Platinum', perk: '100% Invisible Room Entry, Priority Mic Seat, Custom Entrance Sound, Dedicated Account Manager' },
    { rank: 'SVIP Diamond', perk: 'Global Screen Takeover Banner, Anti-Kick Immunity, Exclusive 3D Hologram Avatar Frame' },
    { rank: 'SVIP Sovereign', perk: 'Personalized Custom Room Theme, Unlimited Gift Discount 15%, Direct Founder Access' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/40 via-purple-900/30 to-indigo-900/40 border border-amber-500/30 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30">
            Nobility & Prestige Studio
          </span>
        </div>
        <h2 className="text-xl font-black text-white">👑 VIP Tiers & SVIP Sovereign Privileges</h2>
        <p className="text-xs text-slate-300 mt-1">Configure VIP level pricing, entrance vehicles, chat glow badges & SVIP immunity privileges</p>
      </div>

      {/* VIP Tiers Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-amber-400 flex items-center gap-2">
          🌟 Active VIP Level Progression Tiers (VIP 1 - VIP 5)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Tier Level</th>
                <th className="pb-3">Nobility Rank Name</th>
                <th className="pb-3">Coins Required</th>
                <th className="pb-3">Badge Icon</th>
                <th className="pb-3">Vehicle Entrance & Frame Perks</th>
                <th className="pb-3">Active App Users</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {vipTiers.map(t => (
                <tr key={t.level} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-amber-400">Level {t.level}</td>
                  <td className="font-bold text-white">{t.name}</td>
                  <td className="text-emerald-400 font-bold">{t.coinsReq}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      {t.badge}
                    </span>
                  </td>
                  <td className="text-slate-300">{t.perk}</td>
                  <td className="font-bold text-cyan-300">{t.users} Users</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SVIP Privileges Grid */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-purple-400 flex items-center gap-2">
          ⚡ SVIP Sovereign Immunity & Exclusive Privileges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {svipPrivileges.map(s => (
            <div key={s.rank} className="bg-[#1F2937]/50 border border-purple-500/30 p-4 rounded-xl space-y-2">
              <h4 className="font-black text-purple-300 text-sm">{s.rank}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{s.perk}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
