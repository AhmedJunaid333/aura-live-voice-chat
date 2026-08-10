'use client';

import React, { useState } from 'react';

export default function AntiFraudModule() {
  const [alerts] = useState([
    { id: 'FRD-801', targetUser: 'User_100005', threat: 'MULTI_ACCOUNT_CLONE', riskScore: '94% HIGH RISK', ip: '182.185.12.44', actionTaken: 'WALLET_AUTO_FREEZE', date: '2026-08-10 21:15' },
    { id: 'FRD-802', targetUser: 'User_100009', threat: 'RESELLER_RAPID_TRANSFER', riskScore: '85% MEDIUM RISK', ip: '111.92.45.12', actionTaken: 'MANUAL_REVIEW', date: '2026-08-10 19:40' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900/40 via-red-900/30 to-purple-900/40 border border-rose-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🛡️ Anti-Fraud & Risk Security Center
        </h2>
        <p className="text-xs text-slate-300 mt-1">Real-time risk scoring, multi-account device cloning detection, suspicious diamond transfer flags & automated IP ban rules</p>
      </div>

      {/* Fraud Security Alerts Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-rose-400">🚨 Automated Risk Threat Detection Feed</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Alert ID</th>
                <th className="pb-3">Flagged User</th>
                <th className="pb-3">Threat Signature</th>
                <th className="pb-3">Risk Assessment</th>
                <th className="pb-3">IP Address</th>
                <th className="pb-3">Automated System Action</th>
                <th className="pb-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {alerts.map(a => (
                <tr key={a.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-rose-400">{a.id}</td>
                  <td className="font-bold text-white text-sm">{a.targetUser}</td>
                  <td className="text-amber-300 font-bold">{a.threat}</td>
                  <td className="text-rose-400 font-bold">{a.riskScore}</td>
                  <td className="text-cyan-300">{a.ip}</td>
                  <td className="text-purple-300">{a.actionTaken}</td>
                  <td className="text-slate-400">{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
