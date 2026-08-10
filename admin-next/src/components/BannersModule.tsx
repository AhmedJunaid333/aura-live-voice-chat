'use client';

import React, { useState } from 'react';

export default function BannersModule() {
  const [banners] = useState([
    { id: 'BNR-01', title: '🔥 Grand Voice Tournament 2026', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop', targetUrl: 'aura://event/tournament', location: 'HOME_CAROUSEL', priority: 1, status: 'PUBLISHED' },
    { id: 'BNR-02', title: '💎 Reseller Mega Cashback Event', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop', targetUrl: 'aura://reseller/recharge', location: 'STORE_BANNER', priority: 2, status: 'PUBLISHED' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-cyan-900/30 to-blue-900/40 border border-emerald-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🖼️ Banners & Promotional Media Studio
        </h2>
        <p className="text-xs text-slate-300 mt-1">Manage home screen carousel banners, audio lounge event promo banners, store discount banners & deep link routes</p>
      </div>

      {/* Banners Grid */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-emerald-400">🖼️ Published In-App Banner Carousel</h3>
          <button className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition cursor-pointer">
            + Upload New Banner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map(b => (
            <div key={b.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden space-y-3 p-4">
              <img src={b.image} alt={b.title} className="w-full h-36 object-cover rounded-xl border border-slate-700" />
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-sm">{b.title}</h4>
                  <p className="text-[11px] text-cyan-400 font-mono mt-0.5">Route: {b.targetUrl}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
