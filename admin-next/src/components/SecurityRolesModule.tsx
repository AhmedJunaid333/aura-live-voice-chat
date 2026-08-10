'use client';

import React, { useState } from 'react';

export default function SecurityRolesModule() {
  const [roles] = useState([
    { role: 'SUPER_ADMIN', description: 'Full root access to all portals, database backups & direct currency credit', count: 1 },
    { role: 'DIAMOND_RESELLER', description: 'Wholesale diamond stock access, peer-to-peer mobile UID transfers', count: 1 },
    { role: 'COUNTRY_HEAD', description: 'Territory regional analytics, host management & localized payouts', count: 1 },
    { role: 'HOST', description: 'Verified broadcaster access, live hours telemetry & cashout requests', count: 1 },
    { role: 'USER', description: 'Standard mobile app user access to audio rooms, gifts & moments', count: 2 },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900/40 border border-purple-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🛡️ Security & RBAC Roles Center
        </h2>
        <p className="text-xs text-slate-300 mt-1">Role-Based Access Control (RBAC) definition, API key rotation, IP whitelisting & multi-factor authentication (MFA)</p>
      </div>

      {/* Roles Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-purple-400">🔑 Configured RBAC Roles & Permissions Scope</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Role Identifier</th>
                <th className="pb-3">Permissions Scope Description</th>
                <th className="pb-3">Active Users Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {roles.map(r => (
                <tr key={r.role} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{r.role}</td>
                  <td className="text-slate-300">{r.description}</td>
                  <td className="font-bold text-amber-400">{r.count} Users</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
