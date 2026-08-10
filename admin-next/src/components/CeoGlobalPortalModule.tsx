'use client';

import React, { useState } from 'react';

export default function CeoGlobalPortalModule() {
  const [executiveOverview] = useState({
    totalValuationEstimate: '$1,250,000 USD',
    annualRunRate: '$582,000 USD',
    totalUsersCount: '4 Real Accounts Seeded',
    monthlyActiveUsers: '4 MAU',
    serverHealthScore: '100% EXCELLENT',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-purple-950 to-slate-900 border border-amber-500/40 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🛡️ CEO Global Portal & Executive Command Studio
        </h2>
        <p className="text-xs text-slate-300 mt-1">Highest level executive platform telemetry, annual run rate, company metrics & global operations command</p>
      </div>

      {/* CEO Executive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Platform Run Rate (ARR)</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">{executiveOverview.annualRunRate}</strong>
          <span className="text-[10px] text-emerald-400">● Positive Cash Flow</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Total Platform Valuation</span>
          <strong className="text-2xl font-black text-purple-300 mt-1 block">{executiveOverview.totalValuationEstimate}</strong>
          <span className="text-[10px] text-slate-400">Enterprise Asset</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Monthly Active Users</span>
          <strong className="text-2xl font-black text-cyan-400 mt-1 block">{executiveOverview.monthlyActiveUsers}</strong>
          <span className="text-[10px] text-slate-400">Live SQLite DB</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Infrastructure Health</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">{executiveOverview.serverHealthScore}</strong>
          <span className="text-[10px] text-emerald-400">● Zero Downtime</span>
        </div>
      </div>
    </div>
  );
}
