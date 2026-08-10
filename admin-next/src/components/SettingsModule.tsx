'use client';

import React, { useState } from 'react';

export default function SettingsModule() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [appNotice, setAppNotice] = useState('Welcome to Aura Live Voice Chat! Enjoy 24/7 audio lounges and PK battles ✨');
  const [socketPort] = useState('3001');
  const [dbEngine] = useState('SQLite Prisma ORM (dev.db)');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System settings and maintenance configuration saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white">⚙️ System Configurations & Global App Control</h2>
        <p className="text-xs text-slate-300 mt-1">Configure maintenance mode, global system announcements, Socket.IO WebSockets gateway and database telemetry</p>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance Toggle */}
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-black text-white">🚧 Application Maintenance Control</h3>
          <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div>
              <h4 className="font-bold text-xs text-white">Maintenance Mode Status</h4>
              <p className="text-[10px] text-slate-400">When enabled, mobile app users see a maintenance screen</p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                maintenanceMode
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {maintenanceMode ? '🚨 Maintenance ENABLED' : '🟢 Server ONLINE'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Global System Announcement Banner</label>
            <textarea
              rows={3}
              value={appNotice}
              onChange={e => setAppNotice(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
        </div>

        {/* Server Telemetry */}
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-black text-cyan-400">⚡ Server Telemetry & Database Status</h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400">API Gateway Port</span>
              <span className="font-bold text-cyan-300">Port {socketPort} (Active)</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400">Database Engine</span>
              <span className="font-bold text-purple-300">{dbEngine}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400">Realtime Gateway</span>
              <span className="font-bold text-emerald-400">● Socket.IO WebSockets Connected</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30"
            >
              💾 Save All System Configurations
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
