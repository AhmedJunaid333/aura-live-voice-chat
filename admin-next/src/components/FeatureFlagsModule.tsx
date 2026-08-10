'use client';

import React, { useState } from 'react';

export default function FeatureFlagsModule() {
  const [flags, setFlags] = useState([
    { id: 'FLAG-01', key: 'enable_lucky_gift_jackpot', description: 'Enable 5000x lucky gift jackpot payouts in live rooms', enabled: true },
    { id: 'FLAG-02', key: 'enable_agora_hifi_audio', description: 'Force 48kHz HD stereo voice audio bitrate for all mic seats', enabled: true },
    { id: 'FLAG-03', key: 'enable_svip_invisible_entry', description: 'Allow SVIP Sovereign users silent stealth room entrance', enabled: true },
    { id: 'FLAG-04', key: 'enable_reseller_direct_transfer', description: 'Allow Diamond Resellers to execute p2p transfers to mobile UIDs', enabled: true },
  ]);

  const toggleFlag = (id: string) => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🚩 Feature Flags & Remote Toggle Control Engine
        </h2>
        <p className="text-xs text-slate-300 mt-1">Dynamically toggle mobile app features, beta rollouts, audio RTC bitrates & reseller transfer rules in real time</p>
      </div>

      {/* Feature Flags List */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-purple-400">⚡ Active Mobile App Feature Toggles</h3>

        <div className="space-y-3">
          {flags.map(f => (
            <div key={f.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-bold text-xs">{f.key}</span>
                  <span className="text-[10px] text-slate-500 font-mono">[{f.id}]</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{f.description}</p>
              </div>

              <button
                onClick={() => toggleFlag(f.id)}
                className={`px-4 py-2 rounded-xl font-bold text-xs border transition cursor-pointer shrink-0 ${
                  f.enabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                {f.enabled ? '🟢 ENABLED' : '🔴 DISABLED'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
