'use client';

import React, { useState } from 'react';

export default function AgencyModule() {
  const [agencies] = useState([
    { id: 'AGY-101', name: 'Aura Talent Agency 🌟', leader: 'Ahmed Khokhar (UID: 100001)', hosts: 24, targetHours: '1,200 Hours', revenue: '$14,500.00', commission: '15%', status: 'APPROVED' },
    { id: 'AGY-102', name: 'Star Media Agency 🎙️', leader: 'Admin_Master (UID: 999999)', hosts: 18, targetHours: '900 Hours', revenue: '$9,800.00', commission: '15%', status: 'APPROVED' },
    { id: 'AGY-103', name: 'Crown Live Agency 👑', leader: 'Dimple (UID: 100003)', hosts: 12, targetHours: '600 Hours', revenue: '$6,200.00', commission: '12%', status: 'PENDING' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🏛️ Agency Management & BD Host Network
        </h2>
        <p className="text-xs text-slate-300 mt-1">Manage Business Development (BD) agencies, broadcaster host targets, commission splits & monthly agency payout contracts</p>
      </div>

      {/* Agencies Roster */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-blue-400">🏢 Approved BD Agencies Roster</h3>
          <button className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition cursor-pointer">
            + Register New BD Agency
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Agency ID</th>
                <th className="pb-3">Agency Name</th>
                <th className="pb-3">BD Leader</th>
                <th className="pb-3">Managed Hosts</th>
                <th className="pb-3">Monthly Hours</th>
                <th className="pb-3">Revenue Generated</th>
                <th className="pb-3">Commission Cut</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {agencies.map(a => (
                <tr key={a.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{a.id}</td>
                  <td className="font-bold text-white text-sm">{a.name}</td>
                  <td className="text-purple-300">{a.leader}</td>
                  <td className="font-bold text-amber-400">{a.hosts} Hosts</td>
                  <td className="text-slate-300">{a.targetHours}</td>
                  <td className="font-bold text-emerald-400">{a.revenue}</td>
                  <td className="text-cyan-300">{a.commission}</td>
                  <td>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      a.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {a.status}
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
