'use client';

import React, { useState } from 'react';

export default function RechargeHubModule() {
  const [packages] = useState([
    { id: 'PKG-01', title: '🪙 Starter Pack', coins: '10,000 Coins', price: '$1.00 USD', bonus: '+1,000 Bonus Coins', popular: false },
    { id: 'PKG-02', title: '🪙 Popular Pack', coins: '50,000 Coins', price: '$5.00 USD', bonus: '+7,500 Bonus Coins', popular: true },
    { id: 'PKG-03', title: '🪙 VIP Mega Pack', coins: '500,000 Coins', price: '$50.00 USD', bonus: '+100,000 Bonus Coins', popular: false },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-blue-900/40 border border-emerald-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          💳 Recharge Hub & Payment Gateway Packages
        </h2>
        <p className="text-xs text-slate-300 mt-1">Configure Google Play Billing, Apple IAP, Stripe, JazzCash, EasyPaisa coin recharge store packages & bonus promotions</p>
      </div>

      {/* Recharge Packages Grid */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-emerald-400">🛍️ Mobile App Coin Store Packages</h3>
          <button className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition cursor-pointer">
            + Add New Coin Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map(p => (
            <div key={p.id} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3 relative">
              {p.popular && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold border border-amber-500/30">
                  ★ MOST POPULAR
                </span>
              )}
              <h4 className="font-extrabold text-white text-base">{p.title}</h4>
              <div className="text-2xl font-black text-amber-400 font-mono">{p.coins}</div>
              <p className="text-xs text-emerald-400 font-bold font-mono">{p.bonus}</p>
              <div className="pt-2 flex justify-between items-center border-t border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Price:</span>
                <strong className="text-white font-bold">{p.price}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
