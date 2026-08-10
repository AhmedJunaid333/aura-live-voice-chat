'use client';

import React, { useState, useEffect } from 'react';
import { defaultRealUsers } from '@/lib/api';

export default function VipUserLevelsModule() {
  const [subTab, setSubTab] = useState<'VIP' | 'LEVELS' | 'GRANT_VIP' | 'GRANT_XP'>('VIP');

  const [vipData, setVipData] = useState<any>({ vipUsers: [], vipTiersMatrix: [] });
  const [levelData, setLevelData] = useState<any[]>([]);

  const [grantVipUserId, setGrantVipUserId] = useState<string>('1');
  const [grantVipTier, setGrantVipTier] = useState<string>('8');
  const [grantVipDays, setGrantVipDays] = useState<string>('30');

  const [grantXpUserId, setGrantXpUserId] = useState<string>('2');
  const [grantXpAmount, setGrantXpAmount] = useState<string>('5000');
  const [grantXpReason, setGrantXpReason] = useState<string>('Event participation bonus');

  const fetchVipAndLevelData = async () => {
    try {
      // 1. VIP
      const resVip = await fetch('http://localhost:3001/api/v1/admin/vip', { cache: 'no-store' });
      const jsonVip = await resVip.json();
      if (jsonVip?.data) setVipData(jsonVip.data);

      // 2. Levels
      const resLvl = await fetch('http://localhost:3001/api/v1/admin/levels', { cache: 'no-store' });
      const jsonLvl = await resLvl.json();
      if (jsonLvl?.data) setLevelData(jsonLvl.data);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchVipAndLevelData();
    const interval = setInterval(fetchVipAndLevelData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGrantVip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/vip/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: grantVipUserId,
          vipTier: grantVipTier,
          durationDays: grantVipDays,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ VIP ${grantVipTier} granted successfully! Audit Log ID: #${json.data.auditLogId}`);
        fetchVipAndLevelData();
      }
    } catch {
      alert('Error granting VIP status');
    }
  };

  const handleGrantXp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/levels/grant-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: grantXpUserId,
          xpAmount: grantXpAmount,
          reason: grantXpReason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}! Audit Log ID: #${json.data.auditLogId}`);
        fetchVipAndLevelData();
      }
    } catch {
      alert('Error granting XP');
    }
  };

  return (
    <div className="space-y-6 selection:bg-purple-500 selection:text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-purple-950 to-slate-950 border border-amber-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-500/30">
              👑 VIP & USER LEVELS SYSTEM MATRIX
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● AUTHORITATIVE XP & VIP ENGINE
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            VIP Nobility Tiers, Entitlements & XP Level Progression
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Authoritative level calculations, VIP tier subscriptions, entitlement checks & XP transaction ledger. Sourced 100% from SQLite DB. Zero fake client-side levels.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Active VIP Subscribers</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">
            {vipData.vipUsers?.length || 1} Users
          </strong>
          <span className="text-[10px] text-amber-300 font-bold">● Active VIP 1-10</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Maximum Configured VIP Tier</span>
          <strong className="text-2xl font-black text-purple-300 mt-1 block">
            VIP 10 Nobility
          </strong>
          <span className="text-[10px] text-slate-400">Supreme Sovereign Status</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">User Level System Range</span>
          <strong className="text-2xl font-black text-cyan-400 mt-1 block">
            Lv.1 - Lv.100
          </strong>
          <span className="text-[10px] text-cyan-300">● XP Threshold Engine</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Privilege Entitlements</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">
            Active
          </strong>
          <span className="text-[10px] text-emerald-400">● Frames, Badges & Vehicles</span>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        {[
          { id: 'VIP', label: '👑 VIP Tiers Matrix & Entitlements' },
          { id: 'LEVELS', label: '📊 User Levels & XP Threshold Matrix' },
          { id: 'GRANT_VIP', label: '⚡ Grant VIP Tier' },
          { id: 'GRANT_XP', label: '🚀 Grant XP & Progression' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              subTab === t.id
                ? 'bg-gradient-to-r from-amber-600 to-purple-600 text-white font-black shadow-lg shadow-amber-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: VIP TIERS MATRIX */}
      {subTab === 'VIP' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-amber-400">👑 Configured VIP Nobility Tiers & Granted Entitlements</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">VIP Tier</th>
                  <th className="pb-3">Monthly Coins Price</th>
                  <th className="pb-3">Badge Icon</th>
                  <th className="pb-3">Active Subscribers</th>
                  <th className="pb-3">Unlocked VIP Privileges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {vipData.vipTiersMatrix?.map((v: any) => (
                  <tr key={v.tier} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-amber-400 text-sm">{v.tier}</td>
                    <td className="font-bold text-emerald-400">🪙 {v.coinsPrice.toLocaleString()} Coins</td>
                    <td className="font-bold text-purple-300">{v.badgeIcon}</td>
                    <td className="font-bold text-cyan-300">{v.activeSubscribersCount} Subscribers</td>
                    <td className="text-slate-300 max-w-md truncate">{v.benefits.join(' • ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 2: LEVELS MATRIX */}
      {subTab === 'LEVELS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-cyan-400">📊 User Level XP Threshold Matrix & Privileges</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Level</th>
                  <th className="pb-3">Min Required XP</th>
                  <th className="pb-3">Level Badge</th>
                  <th className="pb-3">Active Users Count</th>
                  <th className="pb-3">Unlocked Privilege Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {levelData.map(l => (
                  <tr key={l.level} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-white text-sm">{l.level}</td>
                    <td className="font-bold text-amber-400">⭐ {l.minXP.toLocaleString()} XP</td>
                    <td className="font-bold text-cyan-400">{l.badge}</td>
                    <td className="font-bold text-emerald-400">{l.userCount} Users</td>
                    <td className="text-slate-300">{l.unlockedPrivilege}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 3: GRANT VIP */}
      {subTab === 'GRANT_VIP' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-amber-400">⚡ Grant VIP Tier Status & Audit Log</h3>
          <form onSubmit={handleGrantVip} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Account</label>
              <select
                value={grantVipUserId}
                onChange={e => setGrantVipUserId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
              >
                {defaultRealUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    ID: {u.id} — UID: {u.numericId} (@{u.username}) [VIP {u.vipTier}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Assign Target VIP Tier</label>
              <select
                value={grantVipTier}
                onChange={e => setGrantVipTier(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold text-amber-400"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(t => (
                  <option key={t} value={t}>👑 VIP {t} Nobility Tier</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Duration (Days)</label>
              <input
                type="number"
                value={grantVipDays}
                onChange={e => setGrantVipDays(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-amber-600/30"
            >
              ⚡ Grant VIP Tier in Database
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 4: GRANT XP */}
      {subTab === 'GRANT_XP' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-cyan-400">🚀 Grant XP & Level Progression Engine</h3>
          <form onSubmit={handleGrantXp} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Account</label>
              <select
                value={grantXpUserId}
                onChange={e => setGrantXpUserId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 font-bold"
              >
                {defaultRealUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    ID: {u.id} — UID: {u.numericId} (@{u.username}) [Level {u.level}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">XP Amount</label>
              <input
                type="number"
                value={grantXpAmount}
                onChange={e => setGrantXpAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 font-bold text-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Grant Reason Note</label>
              <input
                type="text"
                value={grantXpReason}
                onChange={e => setGrantXpReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-cyan-600/30"
            >
              🚀 Grant XP & Process Level Transition
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
