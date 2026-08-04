'use client';

import React, { useState } from 'react';

export type EnterpriseModule = 
  | 'overview' 
  | 'governance' 
  | 'users' 
  | 'streaming' 
  | 'rtc' 
  | 'moderation' 
  | 'finance' 
  | 'payments' 
  | 'gifts' 
  | 'pk' 
  | 'agencies' 
  | 'resellers' 
  | 'cms' 
  | 'leaderboards' 
  | 'analytics' 
  | 'safety' 
  | 'storage' 
  | 'developer';

export default function AdminDashboardPage() {
  const [activeModule, setActiveModule] = useState<EnterpriseModule>('overview');
  const [rolePortal, setRolePortal] = useState('👑 CEO Global Portal');
  const [region, setRegion] = useState('🌐 Global Cluster');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const menuCategories = [
    {
      category: 'GOVERNANCE & ACCESS',
      items: [
        { id: 'overview', label: 'CEO & Global Dashboard', icon: '📊', badge: 'Live' },
        { id: 'governance', label: 'Governance & RBAC Roles', icon: '🛡️', badge: '10 Portals' },
      ]
    },
    {
      category: 'USER & STREAMING ECOSYSTEM',
      items: [
        { id: 'users', label: 'Users & Host Center', icon: '👥', badge: '2.4M Users' },
        { id: 'streaming', label: 'Live Voice & Multi-Host', icon: '🎙️', badge: '1,248 Live' },
        { id: 'rtc', label: 'Agora RTC & WebSocket', icon: '📶', badge: '18ms Latency' },
      ]
    },
    {
      category: 'MODERATION & TRUST',
      items: [
        { id: 'moderation', label: 'AI Voice & Chat Moderation', icon: '🚨', badge: '3 Flags' },
        { id: 'safety', label: 'Anti-Fraud & Risk Engine', icon: '🔒', badge: 'Active' },
      ]
    },
    {
      category: 'FINANCE, GIFTS & PK',
      items: [
        { id: 'finance', label: 'Wallet, Coins & Beans Ledger', icon: '💰', badge: '$18.4K Today' },
        { id: 'payments', label: 'Gateways (Stripe, JazzCash)', icon: '💳', badge: '5 Providers' },
        { id: 'gifts', label: 'Gifts CMS & Lottie 3D', icon: '🎁', badge: 'SVGA/3D' },
        { id: 'pk', label: 'Solo & Team PK Battles', icon: '⚔️', badge: '84 Active' },
      ]
    },
    {
      category: 'BUSINESS & RESELLERS',
      items: [
        { id: 'agencies', label: 'Agency & Creator Salaries', icon: '🏛️', badge: '142 Agencies' },
        { id: 'resellers', label: 'Reseller Coin Stock', icon: '💎', badge: 'Direct Credit' },
      ]
    },
    {
      category: 'ENGAGEMENT, LEADERBOARDS & SYSTEM',
      items: [
        { id: 'cms', label: 'Avatar Frames & Event CMS', icon: '🎨', badge: 'Banners/Wheel' },
        { id: 'leaderboards', label: 'Hall of Fame & Top Givers', icon: '🏆', badge: 'Weekly/Monthly' },
        { id: 'analytics', label: 'Deep Business Analytics', icon: '📈', badge: '18 Reports' },
        { id: 'storage', label: 'CDN, Media & Storage', icon: '📁', badge: 'Asset Manager' },
        { id: 'developer', label: 'Developer API & Health', icon: '⚙️', badge: '99.99% Uptime' },
      ]
    }
  ];

  const masterStats = [
    { label: 'Online Users', val: '42,850', change: '+12.4%', icon: '👥', color: 'from-blue-500 to-cyan-400', glow: 'rgba(59,130,246,0.25)' },
    { label: 'Active Live Rooms', val: '1,248', change: '+8.1%', icon: '🎙️', color: 'from-purple-500 to-pink-500', glow: 'rgba(168,85,247,0.25)' },
    { label: 'Active Creator Hosts', val: '890', change: '+5.3%', icon: '👑', color: 'from-amber-400 to-orange-500', glow: 'rgba(245,158,11,0.25)' },
    { label: "Today's Gross Revenue", val: '$18,450.00', change: '+18.9%', icon: '💰', color: 'from-emerald-400 to-teal-500', glow: 'rgba(16,185,129,0.25)' },
    { label: "Fiat Recharges Today", val: '$24,800.00', change: '+14.2%', icon: '💳', color: 'from-cyan-400 to-blue-600', glow: 'rgba(6,182,212,0.25)' },
    { label: "Creator Withdrawals", val: '$6,350.00', change: '-2.1%', icon: '🏦', color: 'from-rose-500 to-red-600', glow: 'rgba(244,63,94,0.25)' },
    { label: 'Gift Coin Volume', val: '1.85M Coins', change: '+22.5%', icon: '🎁', color: 'from-violet-500 to-purple-600', glow: 'rgba(139,92,246,0.25)' },
    { label: 'Platform Coin Reserve', val: '84.5M Coins', change: 'Stable', icon: '🪙', color: 'from-yellow-400 to-amber-600', glow: 'rgba(234,179,8,0.25)' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#05020a] text-slate-100 font-sans overflow-hidden select-none">
      
      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`${sidebarCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 bg-slate-950/80 backdrop-blur-2xl border-r border-purple-500/20 flex flex-col justify-between z-30 relative`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          <div className="h-20 flex items-center justify-between px-5 border-b border-purple-500/15 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-xl text-cyan-400">
                  A
                </div>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-purple-300 text-sm">
                    AURA LIVE v1.0
                  </h1>
                  <p className="text-[9px] font-extrabold text-cyan-400 tracking-widest uppercase">ENTERPRISE ADMIN</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            >
              {sidebarCollapsed ? '➡️' : '⬅️'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {menuCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                {!sidebarCollapsed && (
                  <p className="px-3 text-[9px] font-black text-purple-400/80 uppercase tracking-widest mb-1.5">
                    {cat.category}
                  </p>
                )}
                {cat.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id as EnterpriseModule)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      activeModule === item.id 
                        ? 'bg-gradient-to-r from-purple-600/30 via-indigo-600/25 to-cyan-500/15 border border-purple-500/40 text-white shadow-lg shadow-purple-900/20' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.icon}</span>
                      {!sidebarCollapsed && <span className="font-semibold text-xs">{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        item.badge.includes('Alert') || item.badge.includes('Flags')
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-purple-500/15 bg-slate-950/60 flex-shrink-0">
            {!sidebarCollapsed ? (
              <div className="space-y-1">
                <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">ACTIVE GOVERNANCE PORTAL</p>
                <select 
                  value={rolePortal}
                  onChange={e => setRolePortal(e.target.value)}
                  className="w-full bg-slate-900 border border-purple-500/30 rounded-xl p-2 text-xs font-bold text-cyan-300 focus:outline-none"
                >
                  <option>👑 CEO Global Portal</option>
                  <option>🛡️ Super Admin Portal</option>
                  <option>🌐 Country Head Portal</option>
                  <option>💰 Finance Manager Portal</option>
                  <option>🚨 Moderator Portal</option>
                </select>
              </div>
            ) : (
              <div className="text-center font-bold text-cyan-400 text-xs">👑</div>
            )}
          </div>

        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#0B061A] via-[#07040f] to-[#040108]">
        
        <header className="h-20 px-8 border-b border-purple-500/15 flex items-center justify-between bg-slate-950/60 backdrop-blur-2xl z-20">
          <div className="relative w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input 
              type="text"
              placeholder="Search User ID, Host Name, Room ID, TX Hash, IP..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-purple-500/25 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900/80 border border-purple-500/20 rounded-2xl px-3 py-1.5">
              <span className="text-xs text-slate-400 font-semibold">Cluster:</span>
              {['🌐 Global', '🇺🇸 US-East', '🇵🇰 PK-MENA', '🇪🇺 EU-West'].map(reg => (
                <button
                  key={reg}
                  onClick={() => setRegion(reg)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition ${
                    region === reg ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowGiftModal(true)} 
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition flex items-center gap-2"
            >
              <span>✨</span>
              <span>Create Gift</span>
            </button>

            <button 
              onClick={() => alert('Global Announcement Sent!')} 
              className="px-4 py-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs transition flex items-center gap-2"
            >
              <span>📢</span>
              <span>Global Announcement</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {activeModule === 'overview' && (
            <>
              <div className="p-6 rounded-[24px] bg-gradient-to-r from-indigo-950/60 via-purple-950/50 to-cyan-950/30 border border-purple-500/30 backdrop-blur-xl relative overflow-hidden flex items-center justify-between shadow-2xl">
                <div className="space-y-1 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase">
                    <span>🟢 CLUSTER HEALTH: OPTIMAL (18ms AGORA RTC LATENCY)</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">{rolePortal} Overview</h2>
                  <p className="text-xs text-slate-300">Aura Live Voice Chat Enterprise v1.0 • Active Cluster: <strong className="text-cyan-400">{region}</strong>.</p>
                </div>
                <div className="hidden lg:flex items-center gap-4 z-10">
                  <div className="text-center px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-purple-500/25">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Concurrent Sockets</p>
                    <p className="text-lg font-black text-cyan-400">42,850</p>
                  </div>
                  <div className="text-center px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-purple-500/25">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">DB Write QPS</p>
                    <p className="text-lg font-black text-purple-400">1,420 QPS</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {masterStats.map((s, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-[20px] bg-slate-900/60 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 relative group overflow-hidden"
                    style={{ boxShadow: `0 8px 32px ${s.glow}` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl p-2.5 rounded-2xl bg-slate-950 border border-purple-500/20">{s.icon}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        s.change.startsWith('+') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.change}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-400">{s.label}</p>
                    <h3 className="text-2xl font-black text-white mt-1 tracking-tight">{s.val}</h3>
                    <div className={`mt-3 h-1 w-full rounded-full bg-gradient-to-r ${s.color}`} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-[24px] bg-slate-900/60 border border-purple-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-white text-base">Gross Platform Revenue & Coin Volume</h3>
                      <p className="text-xs text-slate-400">Hourly comparison between Coin Purchases & Fiat Recharges</p>
                    </div>
                    <span className="text-xs text-cyan-400 font-bold px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30">Live Stream</span>
                  </div>

                  <div className="h-64 w-full flex items-end justify-between gap-3 pt-6 border-b border-purple-500/15 pb-2">
                    {[45, 60, 55, 80, 95, 70, 85, 100, 90, 110, 125, 140].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div 
                          className="w-full bg-gradient-to-t from-indigo-600 via-purple-500 to-cyan-400 rounded-t-xl transition-all duration-300 group-hover:brightness-125"
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-[10px] font-semibold text-slate-500">{i * 2}:00</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-[24px] bg-slate-900/60 border border-purple-500/20 space-y-4">
                  <h3 className="font-extrabold text-white text-base">Audit & Compliance Stream</h3>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {[
                      { type: 'GIFT', msg: 'Sara_Vip7 sent Supercar Phantom (50K Coins)', time: '2s ago', color: 'text-amber-300' },
                      { type: 'RECHARGE', msg: 'User #100998 completed $500 JazzCash Order', time: '14s ago', color: 'text-emerald-300' },
                      { type: 'AI_MOD', msg: 'Voice toxicity flag detected in RM-8821', time: '42s ago', color: 'text-rose-400' },
                      { type: 'WITHDRAW', msg: 'Agency #A-99 payout request approved ($2,400)', time: '1m ago', color: 'text-cyan-300' },
                    ].map((log, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-950/80 border border-purple-500/15 flex items-start gap-3">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {log.type}
                        </span>
                        <div className="flex-1">
                          <p className={`text-xs font-medium ${log.color}`}>{log.msg}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeModule === 'governance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-white">Governance, Portals & RBAC Permissions Matrix</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { portal: 'CEO Global Portal', scope: 'All Regions', permissions: 'Full Executive Override', users: 2 },
                  { portal: 'Country Head Portal', scope: 'Country Specific (PK / US)', permissions: 'Financial & Agency Settlement', users: 14 },
                  { portal: 'Moderator Portal', scope: 'Live Rooms & Chat', permissions: 'Mute, Kick, Room Lock, Warnings', users: 85 },
                ].map((p, i) => (
                  <div key={i} className="p-6 rounded-[20px] bg-slate-900/60 border border-purple-500/20 space-y-3">
                    <h3 className="font-extrabold text-cyan-400 text-sm">{p.portal}</h3>
                    <p className="text-xs text-slate-300">Scope: <strong>{p.scope}</strong></p>
                    <p className="text-xs text-slate-400">Permissions: {p.permissions}</p>
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                      {p.users} Active Officers
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModule === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">User Ecosystem & Creator Host Center</h2>
                  <p className="text-xs text-slate-400">2.4M Users • 18.5K Creator Hosts • Verification Center</p>
                </div>
                <button onClick={() => setShowBanModal(true)} className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs">
                  ⛔ Ban User Account
                </button>
              </div>

              <div className="rounded-[20px] bg-slate-900/60 border border-purple-500/20 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase text-[10px] border-b border-purple-500/15">
                    <tr>
                      <th className="p-4">User ID / Name</th>
                      <th className="p-4">Level & VIP</th>
                      <th className="p-4">Family / Guild</th>
                      <th className="p-4">Coins / Diamonds</th>
                      <th className="p-4">Fraud Risk</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/10">
                    {[
                      { id: '100821', name: 'Sara_Vip7', level: 'Lv.45', vip: 'VIP 7', family: 'Royal Lions', coins: '1,450,000', diamonds: '820,000', risk: 'Low' },
                      { id: '100452', name: 'Dark_Phantom', level: 'Lv.12', vip: 'VIP 1', family: 'None', coins: '12,000', diamonds: '500', risk: 'High' },
                      { id: '100998', name: 'King_Rana_VIP', level: 'Lv.58', vip: 'VIP 7', family: 'Rana Clan', coins: '8,900,000', diamonds: '4,200,000', risk: 'Low' },
                    ].map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition">
                        <td className="p-4">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {u.id}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold text-[10px] mr-2">{u.level}</span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px]">{u.vip}</span>
                        </td>
                        <td className="p-4 font-semibold">{u.family}</td>
                        <td className="p-4 font-mono">
                          <div className="text-yellow-400 font-bold">{u.coins} Coins</div>
                          <div className="text-cyan-400 font-bold">{u.diamonds} Diamonds</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            {u.risk} Risk
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => setShowBanModal(true)} className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-bold">
                            Ban Account
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeModule === 'gifts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Gift Store CMS & Animation Catalog</h2>
                  <p className="text-xs text-slate-400">SVGA / Lottie 3D Animated Gifts, Pricing & Lucky Engine</p>
                </div>
                <button onClick={() => setShowGiftModal(true)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg">
                  + Upload New SVGA Gift
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Supercar Phantom', cost: '50,000 Coins', vip: 'VIP 5', preview: '🏎️', type: 'SVGA 3D' },
                  { name: 'Golden Dragon Sovereign', cost: '150,000 Coins', vip: 'VIP 7', preview: '🐉', type: 'Lottie FX' },
                  { name: 'Romantic Rose Rain', cost: '5,000 Coins', vip: 'VIP 1', preview: '🌹', type: 'SVGA 2D' },
                  { name: 'Crown of Galaxy', cost: '25,000 Coins', vip: 'VIP 3', preview: '👑', type: 'Lottie FX' },
                ].map((g, i) => (
                  <div key={i} className="p-6 rounded-[20px] bg-slate-900/60 border border-purple-500/20 flex flex-col items-center text-center space-y-3">
                    <span className="text-5xl">{g.preview}</span>
                    <h3 className="font-extrabold text-white text-sm">{g.name}</h3>
                    <p className="text-[10px] text-cyan-400 font-bold uppercase">{g.type}</p>
                    <div className="w-full p-2 rounded-xl bg-slate-950 text-xs font-bold text-yellow-400 font-mono">
                      {g.cost}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {showBanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-[24px] bg-slate-900 border border-purple-500/30 space-y-5 shadow-2xl">
            <h3 className="text-lg font-black text-white">⛔ Ban Account Authorization</h3>
            <p className="text-xs text-slate-400">Specify ban duration and audit log reason for target user.</p>
            <div className="space-y-3">
              <input type="text" placeholder="Reason (e.g., Voice Toxicity)" className="w-full p-3 rounded-xl bg-slate-950 border border-purple-500/20 text-xs text-white" />
              <select className="w-full p-3 rounded-xl bg-slate-950 border border-purple-500/20 text-xs text-white">
                <option>7 Days Suspension</option>
                <option>30 Days Suspension</option>
                <option>Permanent Hardware MAC/IP Ban</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowBanModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300">Cancel</button>
              <button onClick={() => { alert('Account Banned!'); setShowBanModal(false); }} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white shadow-lg shadow-rose-600/30">Confirm Ban</button>
            </div>
          </div>
        </div>
      )}

      {showGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-[24px] bg-slate-900 border border-purple-500/30 space-y-5 shadow-2xl">
            <h3 className="text-lg font-black text-white">✨ Upload SVGA / Lottie 3D Gift</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Gift Title (e.g., Supercar Phantom)" className="w-full p-3 rounded-xl bg-slate-950 border border-purple-500/20 text-xs text-white" />
              <input type="number" placeholder="Cost in Coins (e.g., 50000)" className="w-full p-3 rounded-xl bg-slate-950 border border-purple-500/20 text-xs text-white" />
              <div className="p-4 rounded-xl border border-dashed border-purple-500/40 text-center text-xs text-slate-400 cursor-pointer hover:bg-white/5">
                📁 Click to Upload SVGA / Lottie JSON File
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowGiftModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300">Cancel</button>
              <button onClick={() => { alert('New Gift Published!'); setShowGiftModal(false); }} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-xs font-bold text-white shadow-lg shadow-purple-500/30">Publish Gift</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
