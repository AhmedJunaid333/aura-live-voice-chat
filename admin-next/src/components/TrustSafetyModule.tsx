'use client';

import React, { useState } from 'react';

export default function TrustSafetyModule() {
  const [safetyLogs] = useState([
    { id: 'SAF-101', user: 'User_100008', violation: 'EXPLICIT_AUDIO_NOISE', trustScore: '45/100 (POOR)', penalty: 'AUDIO_MUTE_24H', date: '2026-08-10 22:10', status: 'PENALIZED' },
    { id: 'SAF-102', user: 'User_100012', violation: 'SPAM_TEXT_FLOOD', trustScore: '65/100 (FAIR)', penalty: 'CHAT_RESTRICT_1H', date: '2026-08-10 19:30', status: 'PENALIZED' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-indigo-900/40 border border-blue-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🛡️ Trust & Safety System
        </h2>
        <p className="text-xs text-slate-300 mt-1">Automated content safety scoring, user trust scores, noise filtering violations & ban appeal reviews</p>
      </div>

      {/* Trust & Safety Violations Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-blue-400">⚖️ Safety Violations & Trust Index</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Log ID</th>
                <th className="pb-3">User Target</th>
                <th className="pb-3">Violation Category</th>
                <th className="pb-3">User Trust Score</th>
                <th className="pb-3">Enforced Penalty</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {safetyLogs.map(s => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{s.id}</td>
                  <td className="font-bold text-white text-sm">{s.user}</td>
                  <td className="text-rose-400 font-bold">{s.violation}</td>
                  <td className="text-amber-400 font-bold">{s.trustScore}</td>
                  <td className="text-purple-300">{s.penalty}</td>
                  <td className="text-slate-400">{s.date}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                      {s.status}
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
