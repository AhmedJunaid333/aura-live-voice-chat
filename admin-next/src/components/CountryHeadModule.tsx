'use client';

import React, { useState } from 'react';

export default function CountryHeadModule() {
  const [countries] = useState([
    { code: 'PK', country: '🇵🇰 Pakistan Regional Zone', head: 'Ahmed Khokhar (UID: 100001)', activeHosts: 42, activeResellers: 12, monthlyCoins: '🪙 45,200,000', status: 'ACTIVE' },
    { code: 'AE', country: '🇦🇪 UAE & Gulf Zone', head: 'Admin_Master (UID: 999999)', activeHosts: 28, activeResellers: 8, monthlyCoins: '🪙 28,900,000', status: 'ACTIVE' },
    { code: 'IN', country: '🇮🇳 India Regional Zone', head: 'Dimple (UID: 100003)', activeHosts: 35, activeResellers: 10, monthlyCoins: '🪙 32,500,000', status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🏛️ Country Head Portal & Regional Territory Control
        </h2>
        <p className="text-xs text-slate-300 mt-1">Manage regional Country Heads, country-specific host quotas, localized payment gateways & territory earnings analytics</p>
      </div>

      {/* Country Heads Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-blue-400">🌍 Assigned Regional Country Heads</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Zone Code</th>
                <th className="pb-3">Territory Region</th>
                <th className="pb-3">Country Manager / Head</th>
                <th className="pb-3">Regional Hosts</th>
                <th className="pb-3">Authorized Resellers</th>
                <th className="pb-3">Monthly Zone Volume</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {countries.map(c => (
                <tr key={c.code} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{c.code}</td>
                  <td className="font-bold text-white text-sm">{c.country}</td>
                  <td className="text-purple-300 font-bold">{c.head}</td>
                  <td className="text-amber-400 font-bold">{c.activeHosts} Hosts</td>
                  <td className="text-pink-400 font-bold">{c.activeResellers} Resellers</td>
                  <td className="font-bold text-emerald-400">{c.monthlyCoins}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {c.status}
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
