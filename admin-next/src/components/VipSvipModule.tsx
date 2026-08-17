'use client';

import React, { useState, useEffect } from 'react';

export default function VipSvipModule() {
  const [activeTab, setActiveTab] = useState<'VIP_STUDIO' | 'SVIP_STUDIO' | 'DASHBOARD' | 'USER_ADJUST'>('VIP_STUDIO');
  const [vipTiers, setVipTiers] = useState<any[]>([]);
  const [svipTiers, setSvipTiers] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit modal state
  const [editingTier, setEditingTier] = useState<any | null>(null);
  const [editTierType, setEditTierType] = useState<'VIP' | 'SVIP'>('VIP');

  // Manual grant state
  const [targetUserId, setTargetUserId] = useState('100001');
  const [grantType, setGrantType] = useState<'VIP' | 'SVIP'>('VIP');
  const [grantLevel, setGrantLevel] = useState('3');
  const [grantDuration, setGrantDuration] = useState('30');
  const [grantReason, setGrantReason] = useState('Nobility status promotion for elite community patron');

  // Manual XP grant state
  const [xpUserId, setXpUserId] = useState('100001');
  const [xpType, setXpType] = useState<'VIP' | 'SVIP'>('VIP');
  const [xpAmount, setXpAmount] = useState('5000');
  const [xpReason, setXpReason] = useState('Special seasonal event bonus XP');

  const fetchTiersAndStats = async () => {
    setLoading(true);
    try {
      // 1. VIP tiers
      const resVip = await fetch('http://localhost:3001/api/v1/admin/membership/vip-tiers', { cache: 'no-store' });
      const dataVip = await resVip.json();
      if (dataVip?.data) setVipTiers(dataVip.data);

      // 2. SVIP tiers
      const resSvip = await fetch('http://localhost:3001/api/v1/admin/membership/svip-tiers', { cache: 'no-store' });
      const dataSvip = await resSvip.json();
      if (dataSvip?.data) setSvipTiers(dataSvip.data);

      // 3. Dashboard stats
      const resStats = await fetch('http://localhost:3001/api/v1/admin/membership/dashboard', { cache: 'no-store' });
      const dataStats = await resStats.json();
      if (dataStats?.data) setDashboardStats(dataStats.data);
    } catch (_) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiersAndStats();
  }, []);

  const handleSeedDefaults = async () => {
    if (!confirm('Reseed default VIP 1-7 and SVIP 1-8 tiers?')) return;
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/membership/seed', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setMsg({ type: 'success', text: '✅ Successfully seeded VIP 1-7 & SVIP 1-8 configurations!' });
        fetchTiersAndStats();
      }
    } catch (e: any) {
      setMsg({ type: 'error', text: 'Error seeding tiers: ' + e.message });
    }
  };

  const handleSaveTier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;

    try {
      const endpoint =
        editTierType === 'VIP'
          ? `http://localhost:3001/api/v1/admin/membership/vip-tiers/${editingTier.level}`
          : `http://localhost:3001/api/v1/admin/membership/svip-tiers/${editingTier.level}`;

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTier),
      });
      const json = await res.json();
      if (json.success) {
        setMsg({ type: 'success', text: `✅ Saved changes for ${editingTier.name}!` });
        setEditingTier(null);
        fetchTiersAndStats();
      } else {
        setMsg({ type: 'error', text: json.message || 'Failed to update tier' });
      }
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message });
    }
  };

  const handleManualGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantReason || grantReason.trim().length < 4) {
      alert('Mandatory compliance reason is required!');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/membership/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId,
          membershipType: grantType,
          targetLevel: grantLevel,
          durationDays: grantDuration,
          reason: grantReason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMsg({ type: 'success', text: `✅ ${json.message} (Audit Log ID: #${json.data.audit.id.slice(0, 8)})` });
        fetchTiersAndStats();
      } else {
        setMsg({ type: 'error', text: json.message || 'Failed to grant status' });
      }
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message });
    }
  };

  const handleManualAwardXp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/membership/award-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: xpUserId,
          membershipType: xpType,
          amount: xpAmount,
          reason: xpReason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMsg({ type: 'success', text: `✅ ${json.message}` });
        fetchTiersAndStats();
      } else {
        setMsg({ type: 'error', text: json.message || 'Failed to award XP' });
      }
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-purple-950 to-slate-950 border border-amber-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-500/30">
              👑 NOBILITY MATRIX (VIP 1–7 & SVIP 1–8)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● 100% DATABASE-DRIVEN ENGINE
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            VIP 1–7 & SVIP 1–8 Membership Engine & Sovereign Studio
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Configure XP thresholds, reward payouts (Daily/Weekly/Monthly/Level-up), 3D vehicle entrances, anti-kick immunity, and audit-logged manual assignments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTiersAndStats}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleSeedDefaults}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black text-xs rounded-xl shadow-lg transition"
          >
            🌱 Seed Defaults (1-7 & 1-8)
          </button>
        </div>
      </div>

      {/* Feedback Message */}
      {msg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-mono font-bold flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/60 border-red-500/40 text-red-300'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('VIP_STUDIO')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${
            activeTab === 'VIP_STUDIO'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          👑 VIP 1–7 Studio ({vipTiers.length} Levels)
        </button>
        <button
          onClick={() => setActiveTab('SVIP_STUDIO')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${
            activeTab === 'SVIP_STUDIO'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          ⚡ SVIP 1–8 Sovereign Hub ({svipTiers.length} Levels)
        </button>
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${
            activeTab === 'DASHBOARD'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          📊 Membership Analytics
        </button>
        <button
          onClick={() => setActiveTab('USER_ADJUST')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${
            activeTab === 'USER_ADJUST'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          🛠️ User Search & Manual Adjust
        </button>
      </div>

      {/* ─── TAB 1: VIP 1–7 STUDIO ─── */}
      {activeTab === 'VIP_STUDIO' && (
        <div className="space-y-4">
          <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-amber-400">🌟 VIP Nobility Tiers Matrix (VIP 1 to 7)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Exactly 7 VIP levels. Edit XP requirements, 3D entrance vehicles, and reward payouts.</p>
              </div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30">
                Strict VIP Ceiling: 7 Levels
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3">Level</th>
                    <th className="pb-3">Nobility Title</th>
                    <th className="pb-3">XP Requirement</th>
                    <th className="pb-3">Recharge USD</th>
                    <th className="pb-3">Badge Icon</th>
                    <th className="pb-3">3D Entrance Effect</th>
                    <th className="pb-3">Level-Up Reward</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {vipTiers.map((tier) => {
                    const levelUpReward = tier.levelUpRewardJson ? JSON.parse(tier.levelUpRewardJson) : {};
                    return (
                      <tr key={tier.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 font-bold text-amber-400">VIP {tier.level}</td>
                        <td className="font-bold text-white">{tier.title || tier.name}</td>
                        <td className="text-cyan-300 font-bold">{tier.xpRequired.toLocaleString()} XP</td>
                        <td className="text-emerald-400 font-bold">${tier.rechargeRequiredUsd}</td>
                        <td>
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                            style={{
                              backgroundColor: `${tier.colorHex || '#CD7F32'}20`,
                              color: tier.colorHex || '#CD7F32',
                              borderColor: `${tier.colorHex || '#CD7F32'}40`,
                            }}
                          >
                            {tier.badgeIcon || `VIP ${tier.level}`}
                          </span>
                        </td>
                        <td className="text-slate-300">{tier.entryEffect || 'Standard Entrance'}</td>
                        <td className="text-amber-300">
                          💎 {levelUpReward.diamonds || 0} / 🪙 {levelUpReward.coins || 0}
                        </td>
                        <td>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tier.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {tier.active ? 'ACTIVE' : 'DISABLED'}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => {
                              setEditingTier(tier);
                              setEditTierType('VIP');
                            }}
                            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg border border-amber-500/30 font-bold text-xs"
                          >
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: SVIP 1–8 SOVEREIGN HUB ─── */}
      {activeTab === 'SVIP_STUDIO' && (
        <div className="space-y-4">
          <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-purple-400">⚡ SVIP Sovereign Hierarchy (SVIP 1 to 8)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Prestige layer for ultra-elite patrons. Includes immunity shields, priority seats & invisible room entry.</p>
              </div>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/30">
                Strict SVIP Ceiling: 8 Levels
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3">Level</th>
                    <th className="pb-3">Sovereign Title</th>
                    <th className="pb-3">SVIP XP Req</th>
                    <th className="pb-3">Min VIP</th>
                    <th className="pb-3">Min Spend</th>
                    <th className="pb-3">Crown Icon</th>
                    <th className="pb-3">Immunity / Privileges</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {svipTiers.map((tier) => (
                    <tr key={tier.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 font-bold text-purple-400">SVIP {tier.level}</td>
                      <td className="font-bold text-white">{tier.title || tier.name}</td>
                      <td className="text-cyan-300 font-bold">{tier.xpRequired.toLocaleString()} XP</td>
                      <td className="text-amber-400 font-bold">VIP {tier.minVipLevel}+</td>
                      <td className="text-emerald-400 font-bold">${tier.minLifetimeRecharge.toLocaleString()}</td>
                      <td>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                          👑 {tier.crownIcon || `SVIP ${tier.level}`}
                        </span>
                      </td>
                      <td className="text-slate-300">
                        {tier.antiKickImmunity && '🛡️ Anti-Kick '}
                        {tier.invisibleEntry && '👻 Invisible '}
                        {tier.prioritySeat && '🪑 Priority Seat'}
                      </td>
                      <td>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tier.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {tier.active ? 'ACTIVE' : 'DISABLED'}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => {
                            setEditingTier(tier);
                            setEditTierType('SVIP');
                          }}
                          className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/30 font-bold text-xs"
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: DASHBOARD STATS ─── */}
      {activeTab === 'DASHBOARD' && dashboardStats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
              <span className="text-xs text-slate-400">Total Registered App Users</span>
              <p className="text-2xl font-black text-white mt-1">{dashboardStats.totalUsers || 0}</p>
            </div>
            <div className="bg-[#111827] border border-amber-500/30 p-5 rounded-2xl">
              <span className="text-xs text-amber-400">Active VIP 1–7 Patrons</span>
              <p className="text-2xl font-black text-amber-300 mt-1">{dashboardStats.totalVipUsers || 0}</p>
            </div>
            <div className="bg-[#111827] border border-purple-500/30 p-5 rounded-2xl">
              <span className="text-xs text-purple-400">Active SVIP 1–8 Sovereigns</span>
              <p className="text-2xl font-black text-purple-300 mt-1">{dashboardStats.totalSvipUsers || 0}</p>
            </div>
            <div className="bg-[#111827] border border-emerald-500/30 p-5 rounded-2xl">
              <span className="text-xs text-emerald-400">Authoritative Engine Status</span>
              <p className="text-2xl font-black text-emerald-300 mt-1">ONLINE ●</p>
            </div>
          </div>

          {/* VIP Distribution */}
          <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-3">
            <h4 className="text-sm font-black text-amber-400">👑 VIP 1–7 Tier Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
              {[1, 2, 3, 4, 5, 6, 7].map((lvl) => (
                <div key={lvl} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs font-bold text-amber-400">VIP {lvl}</span>
                  <p className="text-lg font-black text-white mt-1">{dashboardStats.vipDistribution?.[lvl] || 0}</p>
                  <span className="text-[10px] text-slate-500">Patrons</span>
                </div>
              ))}
            </div>
          </div>

          {/* SVIP Distribution */}
          <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-3">
            <h4 className="text-sm font-black text-purple-400">⚡ SVIP 1–8 Sovereign Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-8 gap-3">
              {Array.from({ length: 8 }, (_, i) => i + 1).map((lvl) => (
                <div key={lvl} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs font-bold text-purple-400">SVIP {lvl}</span>
                  <p className="text-lg font-black text-white mt-1">{dashboardStats.svipDistribution?.[lvl] || 0}</p>
                  <span className="text-[10px] text-slate-500">Sovereigns</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: USER SEARCH & MANUAL ADJUSTMENT ─── */}
      {activeTab === 'USER_ADJUST' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Grant VIP/SVIP Form */}
          <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-base font-black text-amber-400 flex items-center gap-2">
              🎖️ Audited VIP/SVIP Nobility Grant
            </h3>
            <p className="text-xs text-slate-400">
              Grant or revoke VIP (1-7) or SVIP (1-8) status to any user. Requires mandatory audit compliance reason.
            </p>

            <form onSubmit={handleManualGrant} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target User ID (Numeric ID or DB ID)</label>
                <input
                  type="text"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  placeholder="e.g. 100001"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Membership Type</label>
                  <select
                    value={grantType}
                    onChange={(e) => setGrantType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  >
                    <option value="VIP">VIP (Levels 1–7)</option>
                    <option value="SVIP">SVIP (Levels 1–8)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Level</label>
                  <select
                    value={grantLevel}
                    onChange={(e) => setGrantLevel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  >
                    {grantType === 'VIP'
                      ? [0, 1, 2, 3, 4, 5, 6, 7].map((l) => (
                          <option key={l} value={l}>
                            {l === 0 ? 'Revoke (Level 0)' : `VIP ${l}`}
                          </option>
                        ))
                      : [0, 1, 2, 3, 4, 5, 6, 7, 8].map((l) => (
                          <option key={l} value={l}>
                            {l === 0 ? 'Revoke (Level 0)' : `SVIP ${l}`}
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Duration (Days)</label>
                <input
                  type="number"
                  value={grantDuration}
                  onChange={(e) => setGrantDuration(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  min="1"
                  max="3650"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Mandatory Audit Reason <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={grantReason}
                  onChange={(e) => setGrantReason(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  placeholder="Explain why this status was granted (logged in immutable audit record)"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black rounded-xl shadow-lg transition"
              >
                🚀 Apply Audited Membership Grant
              </button>
            </form>
          </div>

          {/* Award XP Form */}
          <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-base font-black text-cyan-400 flex items-center gap-2">
              ⚡ Award Membership XP Points
            </h3>
            <p className="text-xs text-slate-400">
              Credit verified VIP or SVIP XP points. Triggers real-time automatic tier evaluation and level-up rewards.
            </p>

            <form onSubmit={handleManualAwardXp} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">User ID</label>
                <input
                  type="text"
                  value={xpUserId}
                  onChange={(e) => setXpUserId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  placeholder="e.g. 100001"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target XP Ledger</label>
                  <select
                    value={xpType}
                    onChange={(e) => setXpType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  >
                    <option value="VIP">VIP XP</option>
                    <option value="SVIP">SVIP XP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">XP Amount</label>
                  <input
                    type="number"
                    value={xpAmount}
                    onChange={(e) => setXpAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                    placeholder="5000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Grant Reason / Event Name</label>
                <textarea
                  value={xpReason}
                  onChange={(e) => setXpReason(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                  placeholder="Reason for XP credit"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-black rounded-xl shadow-lg transition"
              >
                ⚡ Award Verified Membership XP
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT TIER MODAL ─── */}
      {editingTier && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                ✏️ Edit {editTierType} {editingTier.level} Configuration
              </h3>
              <button onClick={() => setEditingTier(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTier} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nobility Title Name</label>
                <input
                  type="text"
                  value={editingTier.title || editingTier.name}
                  onChange={(e) => setEditingTier({ ...editingTier, title: e.target.value, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">XP Requirement</label>
                  <input
                    type="number"
                    value={editingTier.xpRequired}
                    onChange={(e) => setEditingTier({ ...editingTier, xpRequired: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    {editTierType === 'VIP' ? 'Recharge USD Req' : 'Min Lifetime Spend'}
                  </label>
                  <input
                    type="number"
                    value={editTierType === 'VIP' ? editingTier.rechargeRequiredUsd : editingTier.minLifetimeRecharge}
                    onChange={(e) =>
                      setEditingTier({
                        ...editingTier,
                        ...(editTierType === 'VIP'
                          ? { rechargeRequiredUsd: parseFloat(e.target.value) || 0 }
                          : { minLifetimeRecharge: parseFloat(e.target.value) || 0 }),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">3D Room Entrance Effect</label>
                <input
                  type="text"
                  value={editingTier.entryEffect || ''}
                  onChange={(e) => setEditingTier({ ...editingTier, entryEffect: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  placeholder="e.g. Sports Car 3D Entrance 🏎️"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={editingTier.active}
                  onChange={(e) => setEditingTier({ ...editingTier, active: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="activeCheck" className="text-slate-300 font-bold">
                  Tier Active in Live App
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTier(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl shadow-lg"
                >
                  Save Tier Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
