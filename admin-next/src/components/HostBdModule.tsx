'use client';

import React, { useState } from 'react';

export default function HostBdModule() {
  const [hosts, setHosts] = useState([
    { id: 'HST-301', user: 'Dimple (UID: 100003)', category: 'Audio Lounge Streamer', agency: 'Aura Talent Agency', liveHours: '45.5 Hours', target: 'COMPLETED (100%)', earnings: '$450.00', status: 'VERIFIED_HOST' },
    { id: 'HST-302', user: 'Ayesha_Singer (UID: 100002)', category: 'Music & Singing Host', agency: 'Star Media Agency', liveHours: '28.0 Hours', target: 'IN_PROGRESS (70%)', earnings: '$280.00', status: 'VERIFIED_HOST' },
  ]);

  const [bdAgencies] = useState([
    { id: 'BD-701', agencyName: 'Aura Talent Agency', leader: 'Ahmed Khokhar (UID: 100001)', totalHosts: 24, monthlyRevenue: '$12,500.00', commissionRate: '15%', status: 'ACTIVE' },
    { id: 'BD-702', agencyName: 'Star Media Agency', leader: 'Admin_Master (UID: 999999)', totalHosts: 18, monthlyRevenue: '$8,900.00', commissionRate: '15%', status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-cyan-900/40 border border-purple-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white">🎙️ Host Center & BD (Business Development) Agency Management</h2>
        <p className="text-xs text-slate-300 mt-1">Manage streamer host verification, target completion tracking, BD agencies, agency leaders & commission payouts</p>
      </div>

      {/* Verified Streamer Hosts Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-purple-400 flex items-center gap-2">
          ⭐ Verified Streamer Broadcasters & Live Hours Telemetry
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Host ID</th>
                <th className="pb-3">Streamer Name</th>
                <th className="pb-3">Stream Category</th>
                <th className="pb-3">Assigned BD Agency</th>
                <th className="pb-3">Monthly Live Hours</th>
                <th className="pb-3">Target Status</th>
                <th className="pb-3">Monthly Earnings</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {hosts.map(h => (
                <tr key={h.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-purple-400">{h.id}</td>
                  <td className="font-bold text-white">{h.user}</td>
                  <td className="text-slate-300">{h.category}</td>
                  <td className="text-cyan-300">{h.agency}</td>
                  <td className="font-bold text-amber-400">{h.liveHours}</td>
                  <td className="text-emerald-400 font-bold">{h.target}</td>
                  <td className="font-bold text-emerald-300">{h.earnings}</td>
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

      {/* BD Agency Management Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-cyan-400 flex items-center gap-2">
          🏢 BD Agencies & Agency Leader Roster
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Agency ID</th>
                <th className="pb-3">Agency Title</th>
                <th className="pb-3">BD Leader / Owner</th>
                <th className="pb-3">Total Managed Hosts</th>
                <th className="pb-3">Monthly Agency Revenue</th>
                <th className="pb-3">Commission Cut</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {bdAgencies.map(a => (
                <tr key={a.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{a.id}</td>
                  <td className="font-bold text-white">{a.agencyName}</td>
                  <td className="text-purple-300 font-bold">{a.leader}</td>
                  <td className="font-bold text-amber-300">{a.totalHosts} Hosts</td>
                  <td className="font-bold text-emerald-400">{a.monthlyRevenue}</td>
                  <td className="text-slate-300">{a.commissionRate}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
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
