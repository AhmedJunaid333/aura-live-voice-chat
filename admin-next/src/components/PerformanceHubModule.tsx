'use client';

import React, { useState } from 'react';

export default function PerformanceHubModule() {
  const [metrics] = useState({
    avgLatencyMs: '18 ms',
    websocketPacketRate: '1,450 msgs/sec',
    agoraRtcPing: '24 ms',
    cpuUsagePercent: '14.2%',
    memoryUsageMB: '142 MB / 4096 MB',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-950 via-indigo-950 to-slate-900 border border-cyan-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          ⏲️ Performance Hub & Server Infrastructure Telemetry
        </h2>
        <p className="text-xs text-slate-300 mt-1">Real-time Node.js server load, Socket.IO WebSockets message throughput, Agora RTC ping latency & memory heap analytics</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">API Response Latency</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">{metrics.avgLatencyMs}</strong>
          <span className="text-[10px] text-emerald-400">● Ultra Fast</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">WebSocket Message Rate</span>
          <strong className="text-2xl font-black text-cyan-400 mt-1 block">{metrics.websocketPacketRate}</strong>
          <span className="text-[10px] text-slate-400">Socket.IO Gateway</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Agora RTC Ping</span>
          <strong className="text-2xl font-black text-purple-300 mt-1 block">{metrics.agoraRtcPing}</strong>
          <span className="text-[10px] text-slate-400">Audio Voice Stream</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">RAM Heap Usage</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">{metrics.memoryUsageMB}</strong>
          <span className="text-[10px] text-emerald-400">● Low Footprint</span>
        </div>
      </div>
    </div>
  );
}
