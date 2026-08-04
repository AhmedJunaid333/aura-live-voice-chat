'use client';

import React, { useState } from 'react';

export type AdminView = 
  | 'overview' 
  | 'rooms' 
  | 'users' 
  | 'gifts' 
  | 'finance' 
  | 'agencies' 
  | 'moderation' 
  | 'health';

export default function AdminDashboardPage() {
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [region, setRegion] = useState('Global');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBanModal, setShowBanModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const stats = [
    { label: 'Online Users', val: '42,850', change: '+12.4%', icon: '👥', color: 'from-blue-500 to-cyan-400', glow: 'rgba(59,130,246,0.3)' },
    { label: 'Active Live Rooms', val: '1,248', change: '+8.1%', icon: '🎙️', color: 'from-purple-500 to-pink-500', glow: 'rgba(168,85,247,0.3)' },
    { label: 'Active Hosts', val: '890', change: '+5.3%', icon: '👑', color: 'from-amber-400 to-orange-500', glow: 'rgba(245,158,11,0.3)' },
    { label: "Today's Revenue", val: '$18,450.00', change: '+18.9%', icon: '💰', color: 'from-emerald-400 to-teal-500', glow: 'rgba(16,185,129,0.3)' },
    { label: "Today's Recharges", val: '$24,800.00', change: '+14.2%', icon: '💳', color: 'from-cyan-400 to-blue-600', glow: 'rgba(6,182,212,0.3)' },
    { label: "Today's Withdrawals", val: '$6,350.00', change: '-2.1%', icon: '🏦', color: 'from-rose-500 to-red-600', glow: 'rgba(244,63,94,0.3)' },
    { label: 'Gift Volume Today', val: '1.85M Coins', change: '+22.5%', icon: '🎁', color: 'from-violet-500 to-purple-600', glow: 'rgba(139,92,246,0.3)' },
    { label: 'Coin Balance', val: '84.5M Coins', change: 'Stable', icon: '🪙', color: 'from-yellow-400 to-amber-600', glow: 'rgba(234,179,8,0.3)' },
  ];

  const activeRooms = [
    { id: 'RM-8821', title: '💖 Urdu Romantic Poetry & Songs', host: 'Sara_Vip7', listeners: 1420, seats: 10, category: 'Music', pK: true, audioFreq: [40, 85, 60, 95, 70, 30] },
    { id: 'RM-9042', title: '🔥 Ultimate 3v3 PK Battle Arena', host: 'King_Rana_VIP', listeners: 3890, seats: 15, category: 'PK Battle', pK: true, audioFreq: [90, 100, 80, 90, 95, 85] },
    { id: 'RM-1029', title: '🌙 Late Night Chat & Chill Space', host: 'Ali_Choudhary', listeners: 850, seats: 10, category: 'Chat', pK: false, audioFreq: [20, 45, 30, 60, 40, 25] },
    { id: 'RM-3301', title: '💎 VIP Luxury Diamond Giveaway', host: 'Ayesha_Official', listeners: 5210, seats: 20, category: 'Event', pK: false, audioFreq: [75, 90, 85, 100, 95, 90] },
  ];

  const usersList = [
    { id: '100821', name: 'Sara_Vip7', level: 'Lv.45', vip: 'VIP 7', family: 'Royal Lions', coins: '1,450,000', diamonds: '820,000', risk: 'Low', status: 'Active' },
    { id: '100452', name: 'Dark_Phantom', level: 'Lv.12', vip: 'VIP 1', family: 'None', coins: '12,000', diamonds: '500', risk: 'High', status: 'Active' },
    { id: '100998', name: 'King_Rana_VIP', level: 'Lv.58', vip: 'VIP 7', family: 'Rana Clan', coins: '8,900,000', diamonds: '4,200,000', risk: 'Low', status: 'Active' },
    { id: '100114', name: 'SpamBot_3912', level: 'Lv.1', vip: 'None', family: 'None', coins: '0', diamonds: '0', risk: 'Critical', status: 'Flagged' },
  ];

  const giftCatalog = [
    { id: 'G-101', name: 'Supercar Phantom', category: 'Luxury', cost: '50,000 Coins', vipReq: 'VIP 5', type: 'SVGA Animation', preview: '🏎️' },
    { id: 'G-102', name: 'Golden Dragon Sovereign', category: 'Super Rare', cost: '150,000 Coins', vipReq: 'VIP 7', type: 'Lottie 3D', preview: '🐉' },
    { id: 'G-103', name: 'Romantic Rose Rain', category: 'Romantic', cost: '5,000 Coins', vipReq: 'VIP 1', type: 'Lottie FX', preview: '🌹' },
    { id: 'G-104', name: 'Crown of Galaxy', category: 'Event', cost: '25,000 Coins', vipReq: 'VIP 3', type: 'SVGA Animation', preview: '👑' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#07040f] text-slate-100 font-sans overflow-hidden select-none">
      
      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`${sidebarCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-slate-900/60 backdrop-blur-xl border-r border-purple-500/20 flex flex-col justify-between z-30 relative`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-purple-500/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-xl text-cyan-400">
                  A
                </div>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-purple-300 text-base">
                    AURA LIVE
                  </h1>
                  <p className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">ENTERPRISE ADMIN</p>
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

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {[
              { id: 'overview', label: 'Dashboard', icon: '📊', badge: null },
              { id: 'rooms', label: 'Live Monitoring', icon: '🎙️', badge: '1,248 Live' },
              { id: 'users', label: 'Users & Hosts', icon: '👥', badge: null },
              { id: 'gifts', label: 'Gift Store CMS', icon: '🎁', badge: 'New' },
              { id: 'finance', label: 'Wallet & Ledger', icon: '💰', badge: null },
              { id: 'agencies', label: 'Agencies & Guilds', icon: '🏛️', badge: null },
              { id: 'moderation', label: 'AI Moderation', icon: '🛡️', badge: '3 Alerts' },
              { id: 'health', label: 'System Health', icon: '⚡', badge: '99.9%' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as AdminView)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all duration-200 ${
                  activeView === item.id 
                    ? 'bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-cyan-500/10 border border-purple-500/40 text-white shadow-lg shadow-purple-900/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  {!sidebarCollapsed && <span className="font-semibold text-sm">{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    item.badge.includes('Alert') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile Badge */}
        <div className="p-4 border-t border-purple-500/15 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 p-[2px]">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-sm font-bold">
                👑
              </div>
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">Super Admin</p>
                <p className="text-[10px] text-cyan-400 font-mono">ID: SA-99821</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#0B061A] via-[#08040f] to-[#050209]">
        
        {/* TOP HEADER CONTROL BAR */}
        <header className="h-20 px-8 border-b border-purple-500/15 flex items-center justify-between bg-slate-900/40 backdrop-blur-xl z-20">
          
          {/* Search Input */}
          <div className="relative w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input 
              type="text"
              placeholder="Search User ID, Room ID, Transaction Hash, IP..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-purple-500/20 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Controls & Region Switcher */}
          <div className="flex items-center gap-4">
            
            {/* Cluster Region Switcher */}
            <div className="flex items-center gap-2 bg-slate-950/70 border border-purple-500/20 rounded-2xl px-3 py-1.5">
              <span className="text-xs text-slate-400 font-semibold">Cluster:</span>
              {['Global', 'US-East', 'PK-MENA'].map(reg => (
                <button
                  key={reg}
                  onClick={() => setRegion(reg)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition ${
                    region === reg ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <button 
              onClick={() => setShowGiftModal(true)} 
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition active:scale-95 flex items-center gap-2"
            >
              <span>✨</span>
              <span>Create Gift</span>
            </button>

            <button 
              onClick={() => alert('Broadcast Alert Triggered across 1,248 active rooms!')} 
              className="px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs transition active:scale-95 flex items-center gap-2"
            >
              <span>📢</span>
              <span>Global Notice</span>
            </button>
          </div>
        </header>

        {/* DYNAMIC DASHBOARD SCREEN CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* VIEW 1: OVERVIEW DASHBOARD */}
          {activeView === 'overview' && (
            <>
              {/* Top Announcement Banner */}
              <div className="p-6 rounded-[20px] bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-cyan-900/20 border border-purple-500/30 backdrop-blur-xl relative overflow-hidden flex items-center justify-between">
                <div className="space-y-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold tracking-widest uppercase">
                    <span>🟢 CLUSTER HEALTH: OPTIMAL (18ms RTC LATENCY)</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">Welcome back, Chief Operations Admin!</h2>
                  <p className="text-xs text-slate-300">Aura Live Voice Chat real-time telemetry streaming active for region: <strong className="text-cyan-400">{region}</strong>.</p>
                </div>
                <div className="hidden lg:flex items-center gap-4 relative z-10">
                  <div className="text-center px-4 py-2 rounded-2xl bg-slate-950/60 border border-purple-500/20">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">RTC Concurrent Sockets</p>
                    <p className="text-lg font-black text-cyan-400">42,850</p>
                  </div>
                  <div className="text-center px-4 py-2 rounded-2xl bg-slate-950/60 border border-purple-500/20">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">DB Write QPS</p>
                    <p className="text-lg font-black text-purple-400">1,420 QPS</p>
                  </div>
                </div>
              </div>

              {/* 8 Dynamic Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((s, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-[20px] bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 relative group overflow-hidden"
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

              {/* Interactive Telemetry Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue & Gift Volume Chart */}
                <div className="lg:col-span-2 p-6 rounded-[20px] bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-white text-base">Real-Time Revenue & Recharge Trend</h3>
                      <p className="text-xs text-slate-400">Hourly comparison between Coins Spent & Fiat Recharges</p>
                    </div>
                    <span className="text-xs text-cyan-400 font-bold px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30">Live Stream</span>
                  </div>

                  {/* Simulated SVG Graph */}
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

                {/* Live Real-Time Audit Feed */}
                <div className="p-6 rounded-[20px] bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 space-y-4">
                  <h3 className="font-extrabold text-white text-base">Live Security Audit Feed</h3>
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {[
                      { type: 'GIFT', msg: 'Sara_Vip7 sent Supercar Phantom (50K Coins)', time: '2s ago', color: 'text-amber-300' },
                      { type: 'RECHARGE', msg: 'User #100998 completed $500 Recharge', time: '14s ago', color: 'text-emerald-300' },
                      { type: 'AI_MOD', msg: 'Voice toxicity flag detected in RM-8821', time: '42s ago', color: 'text-rose-400' },
                      { type: 'WITHDRAW', msg: 'Agency #A-99 payout request approved ($2,400)', time: '1m ago', color: 'text-cyan-300' },
                    ].map((log, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-950/70 border border-purple-500/15 flex items-start gap-3">
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

          {/* VIEW 2: LIVE VOICE ROOMS MONITORING */}
          {activeView === 'rooms' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Live Voice Rooms & Stream Inspector</h2>
                  <p className="text-xs text-slate-400">1,248 active RTC channels running on Agora Voice Engine</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-3.5 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold text-xs">Filter: 10 Seats</button>
                  <button className="px-3.5 py-2 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs">Filter: PK Battles</button>
                </div>
              </div>

              {/* Voice Rooms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeRooms.map((r, idx) => (
                  <div key={idx} className="p-6 rounded-[20px] bg-slate-900/60 backdrop-blur-xl border border-purple-500/20 space-y-4 hover:border-purple-500/40 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                        <div>
                          <span className="text-[10px] font-mono font-bold text-cyan-400">{r.id}</span>
                          <h3 className="font-extrabold text-white text-sm">{r.title}</h3>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {r.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-purple-500/10">
                      <span>Host: <strong className="text-white">{r.host}</strong></span>
                      <span>Listeners: <strong className="text-cyan-400">{r.listeners}</strong></span>
                      <span>Seats Layout: <strong className="text-purple-300">{r.seats} Seats</strong></span>
                    </div>

                    {/* Animated Audio Frequency Spectrum Bar */}
                    <div className="flex items-center gap-1.5 h-8 bg-slate-950 p-2 rounded-xl border border-purple-500/10">
                      <span className="text-[10px] text-slate-500 font-bold mr-2">AUDIO SPECTRUM:</span>
                      {r.audioFreq.map((val, fIdx) => (
                        <div key={fIdx} className="flex-1 bg-slate-800 rounded-full h-full flex items-end overflow-hidden">
                          <div 
                            className="w-full bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                            style={{ height: `${val}%` }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Admin Actions */}
                    <div className="flex items-center gap-3 pt-2">
                      <button onClick={() => alert(`Muted Host mic in room ${r.id}`)} className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition">
                        Mute Host
                      </button>
                      <button onClick={() => alert(`Room ${r.id} terminated`)} className="flex-1 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition">
                        Force Close
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: USERS & HOSTS TABLE */}
          {activeView === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Registered Users & Creator Hosts</h2>
                  <p className="text-xs text-slate-400">2.4M accounts across global clusters</p>
                </div>
                <button onClick={() => setShowBanModal(true)} className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs">
                  Ban User
                </button>
              </div>

              {/* Data Table */}
              <div className="rounded-[20px] bg-slate-900/60 backdrop-blur-xl border border-purple-500/20 overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-purple-500/15">
                    <tr>
                      <th className="p-4">User ID / Name</th>
                      <th className="p-4">Level & VIP</th>
                      <th className="p-4">Family Guild</th>
                      <th className="p-4">Coins / Diamonds</th>
                      <th className="p-4">Fraud Risk Score</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/10">
                    {usersList.map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition">
                        <td className="p-4">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {u.id}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold text-[10px] mr-2">{u.level}</span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px]">{u.vip}</span>
                        </td>
                        <td className="p-4 font-semibold text-slate-300">{u.family}</td>
                        <td className="p-4 font-mono">
                          <div className="text-yellow-400 font-bold">{u.coins} Coins</div>
                          <div className="text-cyan-400 font-bold">{u.diamonds} Diamonds</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            u.risk === 'Low' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {u.risk} Risk
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => setShowBanModal(true)} className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-bold">
                            Ban
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 4: GIFT CMS & STORE */}
          {activeView === 'gifts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-white">Gift Store CMS & Animation Catalog</h2>
                  <p className="text-xs text-slate-400">Manage SVGA / Lottie 3D animated gifts and coin pricing</p>
                </div>
                <button onClick={() => setShowGiftModal(true)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20">
                  + Add New Gift
                </button>
              </div>

              {/* Gift Grid Catalog */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {giftCatalog.map(g => (
                  <div key={g.id} className="p-6 rounded-[20px] bg-slate-900/60 backdrop-blur-xl border border-purple-500/20 space-y-4 hover:border-purple-500/40 transition flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-900/40 to-indigo-900/40 border border-purple-500/30 flex items-center justify-center text-4xl shadow-inner">
                      {g.preview}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-sm">{g.name}</h3>
                      <p className="text-[10px] text-cyan-400 font-bold uppercase">{g.category} • {g.type}</p>
                    </div>
                    <div className="w-full p-2.5 rounded-xl bg-slate-950 border border-purple-500/10 text-xs font-bold text-yellow-400 font-mono">
                      {g.cost}
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                      Requires {g.vipReq}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 5: SYSTEM HEALTH */}
          {activeView === 'health' && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-white">Production Infrastructure Telemetry</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'CPU Usage', val: '34%', status: 'Normal', color: 'from-blue-500 to-cyan-400' },
                  { label: 'RAM Memory', val: '48%', status: 'Healthy', color: 'from-purple-500 to-indigo-500' },
                  { label: 'Redis Cluster Memory', val: '62%', status: 'Optimal', color: 'from-emerald-400 to-teal-500' },
                ].map((m, idx) => (
                  <div key={idx} className="p-6 rounded-[20px] bg-slate-900/60 backdrop-blur-xl border border-purple-500/20 space-y-3">
                    <p className="text-xs text-slate-400 font-bold uppercase">{m.label}</p>
                    <h3 className="text-3xl font-black text-white">{m.val}</h3>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${m.color}`} style={{ width: m.val }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* BAN USER MODAL OVERLAY */}
      {showBanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-[24px] bg-slate-900 border border-purple-500/30 space-y-5 shadow-2xl">
            <h3 className="text-lg font-black text-white">Ban Account Authorization</h3>
            <p className="text-xs text-slate-400">Specify ban duration and audit log reason for target user.</p>
            <div className="space-y-3">
              <input type="text" placeholder="Reason (e.g., Voice Spam / Toxicity)" className="w-full p-3 rounded-xl bg-slate-950 border border-purple-500/20 text-xs text-white" />
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

      {/* CREATE GIFT MODAL OVERLAY */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-[24px] bg-slate-900 border border-purple-500/30 space-y-5 shadow-2xl">
            <h3 className="text-lg font-black text-white">Create & Upload Animated Gift</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Gift Title (e.g., Supercar Phantom)" className="w-full p-3 rounded-xl bg-slate-950 border border-purple-500/20 text-xs text-white" />
              <input type="number" placeholder="Cost in Coins (e.g., 50000)" className="w-full p-3 rounded-xl bg-slate-950 border border-purple-500/20 text-xs text-white" />
              <div className="p-4 rounded-xl border border-dashed border-purple-500/40 text-center text-xs text-slate-400 cursor-pointer hover:bg-white/5">
                Click to Upload SVGA / Lottie JSON File
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
