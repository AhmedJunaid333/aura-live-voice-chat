'use client';

import React, { useState } from 'react';

export default function FinanceHubModule() {
  const [finance] = useState({
    grossRevenue: '$48,500.00',
    hostPayouts: '$18,200.00',
    resellerCommissions: '$6,400.00',
    netPlatformProfit: '$23,900.00 (49.2% Margin)',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-indigo-950 to-slate-900 border border-emerald-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🏦 Finance Hub & Platform P&L Profit Analytics
        </h2>
        <p className="text-xs text-slate-300 mt-1">Real-time gross revenue, host payout expenses, reseller wholesale cuts & net platform profit margin tracking</p>
      </div>

      {/* Finance P&L Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Gross Monthly Revenue</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">{finance.grossRevenue}</strong>
          <span className="text-[10px] text-slate-400">All Gateways Combined</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Host Broadcaster Payouts</span>
          <strong className="text-2xl font-black text-rose-400 mt-1 block">{finance.hostPayouts}</strong>
          <span className="text-[10px] text-slate-400">30-Day Payout Expense</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Reseller Discounts</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">{finance.resellerCommissions}</strong>
          <span className="text-[10px] text-slate-400">Wholesale Cut</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Net Platform Profit</span>
          <strong className="text-2xl font-black text-cyan-400 mt-1 block">{finance.netPlatformProfit}</strong>
          <span className="text-[10px] text-emerald-400">● Clean Balance Sheet</span>
        </div>
      </div>
    </div>
  );
}
