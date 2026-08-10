'use client';

import React, { useState } from 'react';

export default function WallpapersModule() {
  const [wallpapers] = useState([
    { id: 'WLP-01', name: '🌃 Cyberpunk Neon Lounge', theme: 'NEON_NIGHT', price: '10,000 Coins', image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop', status: 'ACTIVE' },
    { id: 'WLP-02', name: '🏰 Royal Palace Velvet', theme: 'ROYAL_GOLD', price: '25,000 Coins', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop', status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-indigo-900/40 border border-blue-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🌄 Audio Lounge Room Wallpapers Studio
        </h2>
        <p className="text-xs text-slate-300 mt-1">Manage 3D audio room themes, custom room wallpapers, host lounge backgrounds & store pricing</p>
      </div>

      {/* Wallpapers Grid */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-blue-400">🌌 Room Wallpaper Theme Catalog</h3>
          <button className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition cursor-pointer">
            + Upload Room Wallpaper
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wallpapers.map(w => (
            <div key={w.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3">
              <img src={w.image} alt={w.name} className="w-full h-36 object-cover rounded-xl border border-slate-700" />
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">{w.name}</h4>
                  <span className="text-xs text-amber-400 font-bold font-mono">{w.price}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                  {w.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
