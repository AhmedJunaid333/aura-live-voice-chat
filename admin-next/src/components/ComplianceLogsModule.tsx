'use client';

import React, { useState } from 'react';

export default function ComplianceLogsModule() {
  const [complianceLogs] = useState([
    { id: 'CMP-901', category: 'GDPR_DATA_AUDIT', actor: 'Admin_Master', target: 'User_100003 (Dimple)', details: 'Verified encryption and data privacy compliance for broadcaster KYC records.', date: '2026-08-10 22:30' },
    { id: 'CMP-902', category: 'FINANCIAL_RECONCILIATION', actor: 'SYSTEM_CRON', target: 'Prisma SQLite DB', details: 'Monthly coin & diamond ledger balance verified against wallet transactions.', date: '2026-08-10 20:00' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          📜 Regulatory Compliance & Data Privacy Logs
        </h2>
        <p className="text-xs text-slate-300 mt-1">GDPR compliance verification audit trail, data privacy access logs & financial reconciliation records</p>
      </div>

      {/* Compliance Logs Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-blue-400">📋 System Compliance Audit History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Log ID</th>
                <th className="pb-3">Compliance Category</th>
                <th className="pb-3">Executing Actor</th>
                <th className="pb-3">Target Entity</th>
                <th className="pb-3">Audit Details</th>
                <th className="pb-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {complianceLogs.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{c.id}</td>
                  <td className="font-bold text-amber-300">{c.category}</td>
                  <td className="text-purple-300">{c.actor}</td>
                  <td className="text-white font-bold">{c.target}</td>
                  <td className="text-slate-300 max-w-xs">{c.details}</td>
                  <td className="text-slate-400">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
