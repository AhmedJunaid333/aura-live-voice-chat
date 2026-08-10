'use client';

import React, { useState } from 'react';

export default function AllPortalsAccessModule() {
  const [accessMatrix] = useState([
    { portal: '👤 Master Portal', minRole: 'SUPER_ADMIN', permissions: 'READ_WRITE_DELETE_ALL', status: 'PROTECTED' },
    { portal: '🏛️ Country Head Portal', minRole: 'COUNTRY_HEAD', permissions: 'REGIONAL_WRITE', status: 'PROTECTED' },
    { portal: '💳 Reseller Portal (Aura Sell)', minRole: 'DIAMOND_RESELLER', permissions: 'RESELLER_P2P_TRANSFER', status: 'ACTIVE' },
    { portal: '🎙️ Broadcaster Host Portal', minRole: 'HOST', permissions: 'STREAMING_EARNINGS_READ', status: 'ACTIVE' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-indigo-900/40 border border-blue-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🛡️ All Portals Access & Permission Matrix
        </h2>
        <p className="text-xs text-slate-300 mt-1">Role-Based Access Control (RBAC) permission mapping, sub-portal credentials authorization & API access tokens</p>
      </div>

      {/* Access Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-blue-400">🔑 Sub-Portal Authorization Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Sub-Portal Name</th>
                <th className="pb-3">Minimum Access Role</th>
                <th className="pb-3">Granted Scope Permissions</th>
                <th className="pb-3">Security Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {accessMatrix.map(a => (
                <tr key={a.portal} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-white text-sm">{a.portal}</td>
                  <td className="font-bold text-purple-300">{a.minRole}</td>
                  <td className="text-cyan-300">{a.permissions}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
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
