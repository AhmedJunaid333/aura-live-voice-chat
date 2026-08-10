'use client';

import React, { useState } from 'react';

export default function HostCenterModule() {
  const [hosts] = useState([
    { id: 'HST-01', user: 'Dimple (UID: 100003)', streamType: 'Audio Lounge', level: 'Lv.4 Streamer', liveHours: '45.5 / 50 Hours', targetBonus: '$150.00', status: 'VERIFIED_HOST' },
    { id: 'HST-02', user: 'Ayesha_Singer (UID: 100002)', streamType: 'Music Vocalist', level: 'Lv.2 Streamer', liveHours: '28.0 / 40 Hours', targetBonus: '$80.00', status: 'VERIFIED_HOST' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🏛️ Broadcaster Host Center & Streamer Ecosystem
        </h2>
        <p className="text-xs text-slate-300 mt-1">Manage streamer broadcaster applications, monthly streaming target hours, level progression & performance bonuses</p>
      </div>

      {/* Broadcaster Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-purple-400">🎙️ Verified Broadcasters Roster</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Host ID</th>
                <th className="pb-3">Broadcaster Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Streamer Level</th>
                <th className="pb-3">Live Hours Target</th>
                <th className="pb-3">Bonus Payout</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {hosts.map(h => (
                <tr key={h.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{h.id}</td>
                  <td className="font-bold text-white text-sm">{h.user}</td>
                  <td className="text-slate-300">{h.streamType}</td>
                  <td className="text-purple-300 font-bold">{h.level}</td>
                  <td className="text-amber-400 font-bold">{h.liveHours}</td>
                  <td className="font-bold text-emerald-400">{h.targetBonus}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                      {h.status}
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
