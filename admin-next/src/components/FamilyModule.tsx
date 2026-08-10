'use client';

import React, { useState } from 'react';

export default function FamilyModule() {
  const [families] = useState([
    { id: 'FAM-501', name: 'Royal Empire ✨', leader: 'Ahmed Khokhar (UID: 100001)', level: 'Level 15', members: '48 / 50 Members', totalXp: '4,500,000 XP', badge: '👑 Royal', status: 'ACTIVE' },
    { id: 'FAM-502', name: 'Aura VIP Streamers 🎙️', leader: 'Dimple (UID: 100003)', level: 'Level 10', members: '32 / 50 Members', totalXp: '2,100,000 XP', badge: '🌟 Aura VIP', status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white">👨‍👩‍👧‍👦 Family & Guild Ecosystem Management</h2>
        <p className="text-xs text-slate-300 mt-1">Manage user created families, family level progression, member quotas, badges & family battle leaderboards</p>
      </div>

      {/* Families Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-blue-400 flex items-center gap-2">
          🏰 Registered App Families & Guild Roster
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Family ID</th>
                <th className="pb-3">Family Name</th>
                <th className="pb-3">Family Leader</th>
                <th className="pb-3">Family Level</th>
                <th className="pb-3">Member Quota</th>
                <th className="pb-3">Total Family XP</th>
                <th className="pb-3">Badge Icon</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {families.map(f => (
                <tr key={f.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-blue-400">{f.id}</td>
                  <td className="font-bold text-white">{f.name}</td>
                  <td className="text-purple-300">{f.leader}</td>
                  <td className="font-bold text-amber-400">{f.level}</td>
                  <td className="text-cyan-300">{f.members}</td>
                  <td className="text-emerald-400 font-bold">{f.totalXp}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                      {f.badge}
                    </span>
                  </td>
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
