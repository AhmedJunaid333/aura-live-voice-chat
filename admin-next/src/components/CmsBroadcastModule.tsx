'use client';

import React, { useState } from 'react';

export default function CmsBroadcastModule() {
  const [broadcasts, setBroadcasts] = useState([
    { id: 'BC-501', title: '🎉 Welcome to Aura Live Voice Chat!', target: 'ALL_USERS', channel: 'GLOBAL_TOP_BANNER', date: '2026-08-10 20:00', status: 'ACTIVE' },
    { id: 'BC-502', title: '💎 Special Reseller Diamond Discount Live!', target: 'RESELLERS', channel: 'PUSH_NOTIFICATION', date: '2026-08-10 18:00', status: 'COMPLETED' },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('ALL_USERS');

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const item = {
      id: `BC-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      target: newTarget,
      channel: 'GLOBAL_TOP_BANNER',
      date: new Date().toLocaleString(),
      status: 'ACTIVE',
    };
    setBroadcasts([item, ...broadcasts]);
    setNewTitle('');
    alert('System announcement broadcast sent to all online mobile users!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-indigo-900/40 border border-blue-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          📢 CMS & Global System Broadcast Engine
        </h2>
        <p className="text-xs text-slate-300 mt-1">Broadcast real-time system notices, top screen Marquee announcements & targeted push notifications</p>
      </div>

      {/* Send Announcement Form */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-blue-400">📡 Send Instant App Announcement</h3>
        <form onSubmit={handleSendBroadcast} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Write global notification / broadcast message..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            required
          />
          <select
            value={newTarget}
            onChange={e => setNewTarget(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL_USERS">All Mobile Users</option>
            <option value="HOSTS_ONLY">Verified Hosts Only</option>
            <option value="RESELLERS">Resellers Only</option>
            <option value="VIP_USERS">VIP/SVIP Users Only</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-blue-600/30"
          >
            🚀 Broadcast Now
          </button>
        </form>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-white">📜 Broadcast Notification History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Broadcast ID</th>
                <th className="pb-3">Message Title / Text</th>
                <th className="pb-3">Target Audience</th>
                <th className="pb-3">Broadcast Channel</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {broadcasts.map(b => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{b.id}</td>
                  <td className="font-bold text-white text-sm">{b.title}</td>
                  <td className="text-purple-300">{b.target}</td>
                  <td className="text-slate-300">{b.channel}</td>
                  <td className="text-slate-400">{b.date}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {b.status}
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
