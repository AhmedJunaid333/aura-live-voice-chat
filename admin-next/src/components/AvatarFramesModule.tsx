'use client';

import React, { useState } from 'react';

export default function AvatarFramesModule() {
  const [frames] = useState([
    { id: 'FRM-01', title: '👑 Golden Monarch Frame', rarity: 'VIP_4_PLUS', price: '50,000 Coins', borderEffect: 'Gold Glowing Wings', animation: 'Lottie SVGA', status: 'ACTIVE' },
    { id: 'FRM-02', title: '🌌 Galactic Nebula Frame', rarity: 'SVIP_SOVEREIGN', price: '150,000 Coins', borderEffect: 'Cosmic Hologram', animation: '3D Shader Loop', status: 'ACTIVE' },
    { id: 'FRM-03', title: '🌹 Romantic Rose Frame', rarity: 'CP_EXCLUSIVE', price: '25,000 Coins', borderEffect: 'Floating Rose Petals', animation: 'GIF Particle', status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-pink-900/40 border border-purple-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🔲 Avatar Frames & Entrance Effects Hub
        </h2>
        <p className="text-xs text-slate-300 mt-1">Manage VIP/SVIP animated avatar frames, Lottie SVGA entrance animations, mic seat glow borders & store pricing</p>
      </div>

      {/* Frames Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-purple-400">✨ Active Animated Avatar Frames ({frames.length} Items)</h3>
          <button className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer">
            + Upload New Frame Effect
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Frame ID</th>
                <th className="pb-3">Frame Name</th>
                <th className="pb-3">Rarity / Privilege</th>
                <th className="pb-3">Store Price</th>
                <th className="pb-3">Border Visual Effect</th>
                <th className="pb-3">Engine Format</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {frames.map(f => (
                <tr key={f.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{f.id}</td>
                  <td className="font-bold text-white text-sm">{f.title}</td>
                  <td className="text-amber-300 font-bold">{f.rarity}</td>
                  <td className="font-bold text-emerald-400">{f.price}</td>
                  <td className="text-purple-300">{f.borderEffect}</td>
                  <td className="text-slate-300">{f.animation}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {f.status}
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
