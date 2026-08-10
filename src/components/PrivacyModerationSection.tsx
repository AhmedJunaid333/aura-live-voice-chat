import React, { useState, useEffect } from 'react';
import { 
  EyeOff, MapPin, Award, UserX, ShieldAlert, Shield, 
  Search, RefreshCw, Eye, CheckCircle2, AlertTriangle, UserCheck 
} from 'lucide-react';
import { 
  privacyEngine, UserPrivacySettings, BlockedUserRecord, PrivacyAuditLog 
} from '../services/privacyEngineService';
import { toast } from '../services/toastAndErrorService';

export const PrivacyModerationSection: React.FC = () => {
  const [settings, setSettings] = useState<UserPrivacySettings>(() => privacyEngine.getSettings('100821'));
  const [blockedUsers, setBlockedUsers] = useState<BlockedUserRecord[]>(() => privacyEngine.getBlockedUsers('100821'));
  const [auditLogs, setAuditLogs] = useState<PrivacyAuditLog[]>(() => privacyEngine.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'ALL' | 'BLOCKED' | 'AUDIT'>('ALL');

  useEffect(() => {
    const sync = () => {
      setSettings(privacyEngine.getSettings('100821'));
      setBlockedUsers(privacyEngine.getBlockedUsers('100821'));
      setAuditLogs(privacyEngine.getAuditLogs());
    };
    sync();
    const unsub = privacyEngine.subscribe(sync);
    return () => unsub();
  }, []);

  const handleAdminUnblock = (blockerId: string, blockedId: string, blockedName: string) => {
    privacyEngine.unblockUser(blockerId, blockedId);
    toast.success(`Admin override: Unblocked ${blockedName}.`);
  };

  const filteredBlocked = blockedUsers.filter(b => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return b.blockedUserName.toLowerCase().includes(q) || b.blockedId.toLowerCase().includes(q) || b.blockerId.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fadeIn select-none text-white text-xs">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
              User Rights & Boundary Governance
            </span>
            <span className="text-xs text-slate-400 font-mono">Platform Privacy Oversight</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Privacy Controls & Blocked Users Moderation</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit user privacy preferences, monitor block lists for harassment patterns, and maintain privacy compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success('Privacy ledger synchronized.')}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 text-xs font-bold border border-indigo-800/40 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Ledger
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#11162B] border border-indigo-900/30">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Online Hidden</span>
          <p className="text-2xl font-black text-white mt-1">
            {settings.hideOnlineStatus ? '1 (Active)' : '0 (Visible)'}
          </p>
          <span className="text-[10px] text-indigo-400">Target User UID: 100821</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-cyan-900/30">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Distance Hidden</span>
          <p className="text-2xl font-black text-cyan-300 mt-1">
            {settings.hideNearbyDistance ? 'Protected' : 'Visible'}
          </p>
          <span className="text-[10px] text-cyan-400/80">Moments & Discovery</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-amber-900/30">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">VIP Badge Privacy</span>
          <p className="text-2xl font-black text-amber-300 mt-1">
            {settings.hideVipBadge ? 'Hidden' : 'Displayed'}
          </p>
          <span className="text-[10px] text-amber-400/80">Live stream public cards</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-rose-900/30">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Active Block Pairs</span>
          <p className="text-2xl font-black text-rose-300 mt-1">
            {blockedUsers.length}
          </p>
          <span className="text-[10px] text-rose-400/80">Restricted connections</span>
        </div>
      </div>

      {/* Blocked Users Table */}
      <div className="bg-[#11162B] rounded-3xl border border-indigo-900/30 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-indigo-900/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserX className="w-4 h-4 text-rose-400" />
            <h3 className="font-bold text-white text-sm">Platform Active Blocked Users Ledger</h3>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Blocker, Blocked User, or UID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-indigo-900/40 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-slate-400 font-bold border-b border-indigo-900/30">
              <tr>
                <th className="p-4">Block ID</th>
                <th className="p-4">Blocker (Account Owner)</th>
                <th className="p-4">Blocked Target</th>
                <th className="p-4">Reason / Notes</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-right">Moderator Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-900/20">
              {filteredBlocked.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No active blocked user records matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredBlocked.map(item => (
                  <tr key={item.id} className="hover:bg-indigo-950/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-300">
                      {item.id}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-white">Sara_Vip7</p>
                        <span className="text-[10px] text-slate-400 font-mono">UID: {item.blockerId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <img src={item.blockedUserAvatar} alt={item.blockedUserName} className="w-7 h-7 rounded-full object-cover border border-purple-800" />
                        <div>
                          <p className="font-bold text-rose-300">{item.blockedUserName}</p>
                          <span className="text-[10px] text-slate-400 font-mono">UID: {item.blockedId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 max-w-xs truncate italic">
                      "{item.reason || 'Restricted via Privacy Controls'}"
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[10px]">
                      {item.blockedAt}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleAdminUnblock(item.blockerId, item.blockedId, item.blockedUserName)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 font-bold text-xs border border-indigo-800/40 transition cursor-pointer"
                      >
                        Unblock Override
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Privacy Audit Trail */}
      <div className="p-5 rounded-3xl bg-[#11162B] border border-indigo-900/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-indigo-900/30 pb-2">
          <span className="font-bold text-white text-sm">Privacy Audit Log Stream</span>
          <span className="text-[10px] text-slate-400 font-mono">Immutable User Privacy Ledger</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {auditLogs.length === 0 ? (
            <p className="text-slate-500 py-4 text-center">No privacy audit entries recorded yet.</p>
          ) : (
            auditLogs.map(log => (
              <div key={log.id} className="p-3 rounded-2xl bg-black/40 border border-indigo-900/20 flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-purple-300">{log.action}</span>
                  <p className="text-slate-300 text-[11px] mt-0.5">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">{log.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
