'use client';

import React, { useState } from 'react';

export default function EmojiModule() {
  const [emojis] = useState([
    { id: 'EMJ-01', code: ':aura_fire:', name: '🔥 Aura Fire', type: 'ANIMATED_STICKER', pack: 'VIP Pack Vol 1', status: 'ACTIVE' },
    { id: 'EMJ-02', code: ':aura_heart:', name: '💖 Aura Sparkling Heart', type: '3D_REACTION', pack: 'Love Lounge', status: 'ACTIVE' },
    { id: 'EMJ-03', code: ':aura_crown:', name: '👑 Royal Crown', type: 'VIP_EXCLUSIVE', pack: 'Nobility Elite', status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-indigo-900/40 border border-purple-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          😀 Emoji & Animated Sticker Management
        </h2>
        <p className="text-xs text-slate-300 mt-1">Upload and manage custom chat emojis, animated 3D stickers, SVIP reaction packs & room floating emojis</p>
      </div>

      {/* Emoji Catalog */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-purple-400">✨ Active Emoji & Sticker Catalog</h3>
          <button className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer">
            + Upload Emoji Pack
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Emoji ID</th>
                <th className="pb-3">Shortcode</th>
                <th className="pb-3">Display Name</th>
                <th className="pb-3">Category Type</th>
                <th className="pb-3">Sticker Pack</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {emojis.map(e => (
                <tr key={e.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{e.id}</td>
                  <td className="font-bold text-amber-300">{e.code}</td>
                  <td className="font-bold text-white text-sm">{e.name}</td>
                  <td className="text-pink-400">{e.type}</td>
                  <td className="text-slate-300">{e.pack}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {e.status}
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
