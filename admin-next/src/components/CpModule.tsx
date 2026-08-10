'use client';

import React, { useState } from 'react';

export default function CpModule() {
  const [cpPairs] = useState([
    { id: 'CP-101', user1: 'Ahmed Khokhar (UID: 100001)', user2: 'Dimple (UID: 100003)', level: 'CP Level 8', intimacyPoints: '850,000 Intimacy', ringName: '💎 Eternal Diamond Ring', date: '2026-08-01', status: 'ACTIVE' },
    { id: 'CP-102', user1: 'Ayesha_Singer (UID: 100002)', user2: 'Ali_Choudhary (UID: 100004)', level: 'CP Level 4', intimacyPoints: '240,000 Intimacy', ringName: '🌹 Rose Gold Ring', date: '2026-08-05', status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-900/40 via-purple-900/30 to-rose-900/40 border border-pink-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white">💕 CP (Couple Pair) & Intimacy Relationship Management</h2>
        <p className="text-xs text-slate-300 mt-1">Manage active CP pairs, CP level intimacy points, exclusive couple rings & CP leaderboards</p>
      </div>

      {/* Active CP Pairs Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-pink-400 flex items-center gap-2">
          💑 Active Registered CP Pairs (Couple Relationships)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">CP ID</th>
                <th className="pb-3">Partner 1</th>
                <th className="pb-3">Partner 2</th>
                <th className="pb-3">CP Level</th>
                <th className="pb-3">Intimacy XP Points</th>
                <th className="pb-3">Ring Badge</th>
                <th className="pb-3">Anniversary Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {cpPairs.map(cp => (
                <tr key={cp.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-pink-400">{cp.id}</td>
                  <td className="font-bold text-white">{cp.user1}</td>
                  <td className="font-bold text-white">{cp.user2}</td>
                  <td className="font-bold text-purple-300">{cp.level}</td>
                  <td className="font-bold text-amber-400">{cp.intimacyPoints}</td>
                  <td className="text-cyan-300">{cp.ringName}</td>
                  <td className="text-slate-400">{cp.date}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30">
                      {cp.status}
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
