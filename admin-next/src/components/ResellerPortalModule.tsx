'use client';

import React, { useState } from 'react';

export default function ResellerPortalModule() {
  const [resellers, setResellers] = useState([
    { id: 'RSL-901', name: 'Ahmed Khokhar (UID: 100001)', role: 'MASTER_RESELLER', diamondStock: '💎 500,000 Diamonds', totalSold: '💎 2,500,000 Diamonds', discount: '10% Wholesaler', status: 'ACTIVE' },
    { id: 'RSL-902', name: 'Ayesha_Singer (UID: 100002)', role: 'SUB_RESELLER', diamondStock: '💎 25,000 Diamonds', totalSold: '💎 150,000 Diamonds', discount: '5% Standard', status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-900/40 via-purple-900/30 to-indigo-900/40 border border-pink-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          💳 Aura Sell Diamonds / Diamond Reseller Portal
        </h2>
        <p className="text-xs text-slate-300 mt-1">Manage Diamond Resellers, wholesale diamond inventories, sub-reseller authorizations & instant peer-to-peer diamond transfers</p>
      </div>

      {/* Reseller Directory */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-pink-400">💎 Authorized Diamond Reseller Network</h3>
          <button className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs transition cursor-pointer">
            + Approve New Reseller Account
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Reseller ID</th>
                <th className="pb-3">Reseller Name</th>
                <th className="pb-3">Tier Role</th>
                <th className="pb-3">Current Stock</th>
                <th className="pb-3">Lifetime Volume Sold</th>
                <th className="pb-3">Wholesale Discount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {resellers.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{r.id}</td>
                  <td className="font-bold text-white text-sm">{r.name}</td>
                  <td className="text-purple-300 font-bold">{r.role}</td>
                  <td className="font-bold text-pink-400">{r.diamondStock}</td>
                  <td className="text-emerald-400 font-bold">{r.totalSold}</td>
                  <td className="text-amber-300">{r.discount}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      {r.status}
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
