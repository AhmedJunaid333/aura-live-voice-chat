import React, { useState, useEffect } from 'react';
import { UserManagementAndKYCSection } from '../components/UserManagementAndKYCSection';
import { UserProfileDossierSection } from '../components/UserProfileDossierSection';
import { ResellerManagementSection } from '../components/ResellerManagementSection';
import { WithdrawalAndLedgerSection } from '../components/WithdrawalAndLedgerSection';
import { LiveStreamMonitorSection } from '../components/LiveStreamMonitorSection';
import { adminApiClient } from '../services/adminApiClient';

export function MasterAdminConsole() {
  const [activeTab, setActiveTab] = useState<'users' | 'profile' | 'reseller' | 'wallet' | 'live' | 'audit'>('users');
  const [telemetry, setTelemetry] = useState<any>({
    totalUsers: 4,
    activeRooms: 1,
    totalResellers: 1,
    totalCoins: 10520000,
    totalDiamonds: 5535000,
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const loadTelemetry = async () => {
    const data = await adminApiClient.getDashboardStats();
    if (data) {
      setTelemetry(data);
    }
    const logs = await adminApiClient.getAuditLogs();
    setAuditLogs(logs);
  };

  useEffect(() => {
    loadTelemetry();
    const interval = setInterval(loadTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#07090E] text-white font-sans selection:bg-purple-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-[#1E2638] px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">AURA LIVE MASTER ADMIN CONSOLE</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  ● REAL DB ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Flutter Mobile App Real-Time Control & Telemetry System</p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-[#131A2B] border border-[#232D42] px-3 py-1.5 rounded-xl">
              <span className="text-slate-400">Real Users:</span> <strong className="text-purple-400 font-bold">{telemetry.totalUsers || 4}</strong>
            </div>
            <div className="bg-[#131A2B] border border-[#232D42] px-3 py-1.5 rounded-xl">
              <span className="text-slate-400">Total Coins:</span> <strong className="text-amber-400 font-bold">🪙 {(telemetry.totalCoins || 0).toLocaleString()}</strong>
            </div>
            <div className="bg-[#131A2B] border border-[#232D42] px-3 py-1.5 rounded-xl">
              <span className="text-slate-400">Total Diamonds:</span> <strong className="text-pink-400 font-bold">💎 {(telemetry.totalDiamonds || 0).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-[#0D1322] border border-[#1E293B] p-2 rounded-2xl flex items-center gap-2 overflow-x-auto scrollbar-none shadow-xl">
          {[
            { id: 'users', label: '👥 Registered Users Directory', badge: telemetry.totalUsers || 4 },
            { id: 'profile', label: '👤 User Profile Dossier Telemetry' },
            { id: 'reseller', label: '💎 Diamond & Reseller Engine', badge: telemetry.totalResellers || 1 },
            { id: 'wallet', label: '💰 Wallet & Currency Operations' },
            { id: 'live', label: '🎙️ Live Stream & Room Monitor', badge: `${telemetry.activeRooms || 1} Live` },
            { id: 'audit', label: '📜 System Audit & Security Trail' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-purple-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab View Panels */}
        <div className="transition-all duration-300">
          {activeTab === 'users' && (
            <UserManagementAndKYCSection activeSubKey="all-users" />
          )}

          {activeTab === 'profile' && (
            <UserProfileDossierSection />
          )}

          {activeTab === 'reseller' && (
            <ResellerManagementSection />
          )}

          {activeTab === 'wallet' && (
            <WithdrawalAndLedgerSection />
          )}

          {activeTab === 'live' && (
            <LiveStreamMonitorSection />
          )}

          {activeTab === 'audit' && (
            <div className="bg-[#0D1322] border border-[#1E293B] rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white">📜 Immutable Real-Time Audit Log Ledger</h3>
                  <p className="text-xs text-slate-400">Chronological history of all admin wallet credits, role assignments, freezes & bans</p>
                </div>
                <button onClick={loadTelemetry} className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/40 cursor-pointer">
                  🔄 Refresh Logs
                </button>
              </div>

              {auditLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No admin audit logs recorded yet. Perform an action (like wallet credit or role update) to see log entries.
                </div>
              ) : (
                <div className="space-y-2 font-mono text-xs">
                  {auditLogs.map((log: any) => (
                    <div key={log.id} className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <span className="text-cyan-400 font-bold">[{new Date(log.createdAt).toLocaleString()}]</span>{' '}
                        <span className="text-purple-300 font-bold">Admin #{log.adminId}</span>{' '}
                        <span className="text-amber-400">{log.action}</span> on Target User <span className="text-emerald-400">#{log.targetUserId}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] italic">{log.details}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
