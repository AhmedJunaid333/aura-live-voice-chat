'use client';

import React, { useState } from 'react';

export default function IntelligenceHubModule() {
  const [intel] = useState({
    arpu: '$12.50 / User',
    retentionD7: '84.2% Day 7 Retention',
    churnProbability: '2.1% Low Churn Risk',
    topSpendingRegion: '🇵🇰 Pakistan ($24,500 Volume)',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          📊 Intelligence Hub & Predictive Business Analytics
        </h2>
        <p className="text-xs text-slate-300 mt-1">Average Revenue Per User (ARPU), Day 7 / Day 30 user retention cohort analytics & churn risk machine intelligence</p>
      </div>

      {/* Intelligence Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Platform ARPU</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">{intel.arpu}</strong>
          <span className="text-[10px] text-slate-400">Monthly Average</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Day 7 User Retention</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">{intel.retentionD7}</strong>
          <span className="text-[10px] text-emerald-400">● High Engagement</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Churn Risk Index</span>
          <strong className="text-2xl font-black text-cyan-400 mt-1 block">{intel.churnProbability}</strong>
          <span className="text-[10px] text-slate-400">Predictive AI Model</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Top Revenue Territory</span>
          <strong className="text-2xl font-black text-purple-300 mt-1 block">{intel.topSpendingRegion}</strong>
          <span className="text-[10px] text-slate-400">Regional Leader</span>
        </div>
      </div>
    </div>
  );
}
