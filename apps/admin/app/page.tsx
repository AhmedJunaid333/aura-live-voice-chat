'use client';

import React, { useState } from 'react';

const Icon = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Live: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" /></svg>,
  Economy: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Moderation: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Analytics: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  CMS: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Governance: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Search: () => <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Bell: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  Plus: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>,
  ChevronDown: () => <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  ChevronRight: () => <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    users: true,
    live: false,
    economy: false,
    moderation: false,
    analytics: false,
    cms: false,
    governance: false,
  });
  const [cluster, setCluster] = useState('Global');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sidebarMenu = [
    { id: 'dashboard', title: 'Dashboard', icon: <Icon.Dashboard /> },
    {
      id: 'users',
      title: 'Users',
      icon: <Icon.Users />,
      items: ['Users List', 'Hosts Center', 'VIP Tiers', 'Levels & XP', 'Families', 'Agencies']
    },
    {
      id: 'live',
      title: 'Live Streaming',
      icon: <Icon.Live />,
      items: ['Audio Rooms', 'Video Streams', 'PK Battles', 'Live Monitor', 'RTC Edge Monitor']
    },
    {
      id: 'economy',
      title: 'Economy',
      icon: <Icon.Economy />,
      items: ['Wallet Ledger', 'Diamonds', 'Coins', 'Recharges', 'Withdrawals', 'Gifts CMS', 'Lucky Gifts']
    },
    {
      id: 'moderation',
      title: 'Moderation',
      icon: <Icon.Moderation />,
      items: ['Reports Queue', 'AI Moderation', 'Banned Users', 'Device Ban', 'Blacklist']
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <Icon.Analytics />,
      items: ['Revenue', 'User Retention', 'Room Traffic', 'Gift Trends', 'Leaderboards']
    },
    {
      id: 'cms',
      title: 'CMS',
      icon: <Icon.CMS />,
      items: ['Banners', 'Wallpapers', 'Avatar Frames', 'Emojis', 'Mini Games', 'Seasonal Events']
    },
    {
      id: 'governance',
      title: 'Governance',
      icon: <Icon.Governance />,
      items: ['CEO Portal', 'Country Managers', 'Finance Hub', 'Security', 'RBAC Matrix']
    },
  ];

  const kpis = [
    { label: 'Online Users', value: '42,850', change: '+12.4%', accent: 'bg-[#3B82F6]' },
    { label: "Today's Gross Revenue", value: '$18,450.00', change: '+18.9%', accent: 'bg-[#10B981]' },
    { label: "Today's Recharges", value: '$24,800.00', change: '+14.2%', accent: 'bg-[#10B981]' },
    { label: 'Active Live Rooms', value: '1,248', change: '+8.1%', accent: 'bg-[#3B82F6]' },
    { label: 'Active Creator Hosts', value: '890', change: '+5.3%', accent: 'bg-[#3B82F6]' },
    { label: 'Pending Withdrawals', value: '$6,350.00', change: '-2.1%', accent: 'bg-[#F59E0B]' },
    { label: 'Flagged Safety Reports', value: '14 Reports', change: 'Requires Action', accent: 'bg-[#EF4444]' },
    { label: 'Agora RTC Latency', value: '18 ms', change: 'Optimal', accent: 'bg-[#10B981]' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0B1220] text-white font-sans overflow-hidden select-none">
      
      {/* 1. PROFESSIONAL SIDEBAR (#111827) */}
      <aside className="w-72 bg-[#111827] border-r border-[#273449] flex flex-col justify-between flex-shrink-0 z-30">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-[#273449]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center font-black text-xl text-white shadow-md">
                A
              </div>
              <div>
                <h1 className="font-extrabold tracking-tight text-white text-base">AURA LIVE</h1>
                <p className="text-[11px] font-semibold text-[#06B6D4] tracking-widest uppercase">ENTERPRISE ADMIN</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
            {sidebarMenu.map(sec => {
              const isAccordion = !!sec.items;
              const isOpen = openSections[sec.id];
              const isActive = activeTab === sec.id;

              return (
                <div key={sec.id} className="space-y-1">
                  <button
                    onClick={() => isAccordion ? toggleSection(sec.id) : setActiveTab(sec.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 ${
                      isActive || (isAccordion && isOpen)
                        ? 'bg-[#1E293B] text-white font-bold'
                        : 'text-[#CBD5E1] hover:text-white hover:bg-[#1E293B]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#06B6D4]">{sec.icon}</span>
                      <span className="text-sm font-semibold">{sec.title}</span>
                    </div>
                    {isAccordion && (
                      <span>{isOpen ? <Icon.ChevronDown /> : <Icon.ChevronRight />}</span>
                    )}
                  </button>

                  {isAccordion && isOpen && (
                    <div className="pl-9 pr-2 py-1 space-y-1 border-l-2 border-[#273449] ml-5">
                      {sec.items!.map(sub => (
                        <button
                          key={sub}
                          onClick={() => setActiveTab(sub.toLowerCase().replace(/\s+/g, '-'))}
                          className="w-full text-left py-2 px-3 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#273449] bg-[#0B1220]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-[#273449] flex items-center justify-center font-bold text-sm text-[#06B6D4]">
              SA
            </div>
            <div>
              <p className="text-xs font-bold text-white">Super Admin</p>
              <p className="text-[11px] text-[#94A3B8]">CEO Governance</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#0B1220]">
        
        {/* 2. MINIMAL ENTERPRISE TOP BAR (#111827 / Glassmorphism) */}
        <header className="h-20 px-8 border-b border-[#273449] flex items-center justify-between bg-[#111827]/80 backdrop-blur-md z-20">
          
          <div className="relative w-80">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <Icon.Search />
            </span>
            <input
              type="text"
              placeholder="Search User ID, Room, Transaction..."
              className="w-full bg-[#1E293B] border border-[#273449] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#4F46E5] transition"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-[#1E293B] border border-[#273449] rounded-xl p-1">
              {['Global', 'US-East', 'PK-MENA'].map(c => (
                <button
                  key={c}
                  onClick={() => setCluster(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    cluster === c ? 'bg-[#4F46E5] text-white' : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-xl bg-[#1E293B] border border-[#273449] text-[#CBD5E1] hover:text-white transition"
            >
              <Icon.Bell />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="h-[52px] px-6 rounded-[16px] bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Icon.Plus />
              <span>Create</span>
            </button>
          </div>
        </header>

        {/* 3. DASHBOARD MAIN CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Executive Dashboard</h2>
              <p className="text-sm text-[#94A3B8] mt-1">Real-time platform telemetry and operational health for cluster: <strong className="text-[#06B6D4]">{cluster}</strong></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((k, i) => (
                <div
                  key={i}
                  className="bg-[#131C2E] border border-[#273449] rounded-[20px] p-6 shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-[#CBD5E1]">{k.label}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        k.change.startsWith('+') ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#1E293B] text-[#94A3B8]'
                      }`}>
                        {k.change}
                      </span>
                    </div>
                    <div className="text-[38px] font-black text-white tracking-tight mt-1">{k.value}</div>
                  </div>

                  <div className={`h-1.5 w-full rounded-full ${k.accent} mt-6`} />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-bold text-[#CBD5E1]">Financial & Traffic Telemetry</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#131C2E] border border-[#273449] rounded-[20px] p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">Gross Platform Revenue ($ USD)</h4>
                    <p className="text-sm text-[#94A3B8]">Hourly Coin Purchases vs Fiat Recharges</p>
                  </div>
                  <span className="text-xs font-bold text-[#10B981] px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30">
                    Live Updates
                  </span>
                </div>

                <div className="h-60 w-full flex items-end justify-between gap-3 pt-6 border-b border-[#273449] pb-3">
                  {[45, 60, 55, 80, 95, 70, 85, 100, 90, 110, 125, 140].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div
                        className="w-full bg-[#4F46E5] hover:bg-[#06B6D4] rounded-t-lg transition-all duration-200"
                        style={{ height: `${val}%` }}
                      />
                      <span className="text-[10px] text-[#94A3B8] font-medium">{i * 2}:00</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#131C2E] border border-[#273449] rounded-[20px] p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">Coin Consumption & Gift Volume</h4>
                    <p className="text-sm text-[#94A3B8]">Real-time SVGA / Lottie 3D Gift Animations</p>
                  </div>
                  <span className="text-xs font-bold text-[#06B6D4] px-3 py-1 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30">
                    1.85M Coins
                  </span>
                </div>

                <div className="h-60 w-full flex items-end justify-between gap-3 pt-6 border-b border-[#273449] pb-3">
                  {[30, 50, 75, 60, 90, 110, 95, 130, 105, 120, 135, 150].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div
                        className="w-full bg-[#06B6D4] hover:bg-[#10B981] rounded-t-lg transition-all duration-200"
                        style={{ height: `${val}%` }}
                      />
                      <span className="text-[10px] text-[#94A3B8] font-medium">{i * 2}:00</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#131C2E] border border-[#273449] rounded-[20px] p-6 space-y-4 shadow-lg">
              <h4 className="text-lg font-bold text-white">Country Revenue & User Distribution</h4>
              <div className="space-y-3">
                {[
                  { country: '🇵🇰 Pakistan (PK-MENA)', revenue: '$12,450', percent: '62%' },
                  { country: '🇺🇸 United States (US-East)', revenue: '$4,800', percent: '24%' },
                  { country: '🇸🇦 Saudi Arabia (GCC)', revenue: '$2,100', percent: '10%' },
                  { country: '🇬🇧 United Kingdom (EU-West)', revenue: '$1,100', percent: '4%' },
                ].map((c, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-[#CBD5E1]">{c.country}</span>
                      <span className="font-bold text-white font-mono">{c.revenue} ({c.percent})</span>
                    </div>
                    <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#4F46E5] h-full rounded-full" style={{ width: c.percent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#131C2E] border border-[#273449] rounded-[20px] p-6 space-y-4 shadow-lg">
              <h4 className="text-lg font-bold text-white">Top Earner Hosts Today</h4>
              <div className="space-y-3">
                {[
                  { name: 'Sara_Vip7', rank: '#1', diamonds: '820,000 Diamonds', agency: 'Royal Lions' },
                  { name: 'King_Rana_VIP', rank: '#2', diamonds: '640,000 Diamonds', agency: 'Rana Guild' },
                  { name: 'Ayesha_Official', rank: '#3', diamonds: '490,000 Diamonds', agency: 'Aura Creators' },
                ].map((h, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#1E293B]/60 border border-[#273449]">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center font-bold text-xs text-white">
                        {h.rank}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white">{h.name}</p>
                        <p className="text-[11px] text-[#94A3B8]">{h.agency}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#06B6D4]">{h.diamonds}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#131C2E] border border-[#273449] rounded-[20px] p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-white">Real-Time Security & Financial Audit Stream</h4>
              <button className="text-xs font-bold text-[#4F46E5] hover:underline">View Complete Audit Logs →</button>
            </div>

            <div className="space-y-2.5">
              {[
                { type: 'RECHARGE', desc: 'User #100998 completed $500.00 JazzCash order', time: '12s ago', status: 'SUCCESS', accent: 'text-[#10B981]' },
                { type: 'GIFT_SEND', desc: 'Sara_Vip7 sent Supercar Phantom (50,000 Coins)', time: '34s ago', status: 'COMPLETED', accent: 'text-[#06B6D4]' },
                { type: 'AI_MOD', desc: 'Voice toxicity warning issued in Room #RM-8821', time: '1m ago', status: 'FLAGGED', accent: 'text-[#EF4444]' },
                { type: 'WITHDRAWAL', desc: 'Agency #A-99 payout request approved ($2,400.00)', time: '3m ago', status: 'SETTLED', accent: 'text-[#F59E0B]' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-[#1E293B]/50 border border-[#273449] text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded-md bg-[#273449] font-mono font-bold text-[#CBD5E1] text-[10px]">
                      {log.type}
                    </span>
                    <span className="text-[#CBD5E1]">{log.desc}</span>
                  </div>
                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-[#94A3B8] text-[11px]">{log.time}</span>
                    <span className={`font-bold text-[11px] ${log.accent}`}>{log.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {showNotifications && (
        <div className="fixed inset-y-0 right-0 z-50 w-96 bg-[#111827] border-l border-[#273449] shadow-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#273449] pb-4">
            <h3 className="text-lg font-bold text-white">System Notifications</h3>
            <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#131C2E] border border-[#273449] space-y-1">
              <span className="text-xs font-bold text-[#EF4444]">🚨 High Risk Withdrawal Alert</span>
              <p className="text-xs text-[#CBD5E1]">User #100452 requested $1,200 withdrawal with High Fraud Risk Score.</p>
              <p className="text-[10px] text-[#94A3B8]">2 mins ago</p>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-[20px] bg-[#131C2E] border border-[#273449] space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Create Platform Asset</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Asset Title / Name" className="w-full bg-[#1E293B] border border-[#273449] rounded-xl p-3 text-xs text-white placeholder-[#94A3B8]" />
              <select className="w-full bg-[#1E293B] border border-[#273449] rounded-xl p-3 text-xs text-white">
                <option>New SVGA Animated Gift</option>
                <option>Global Announcement Notice</option>
                <option>Avatar Frame Theme</option>
              </select>
            </div>
            <div className="flex gap-4 pt-2">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 h-[52px] rounded-[16px] bg-[#1E293B] text-xs font-bold text-[#CBD5E1] hover:bg-[#273449]">
                Cancel
              </button>
              <button onClick={() => { alert('Asset Created!'); setShowCreateModal(false); }} className="flex-1 h-[52px] rounded-[16px] bg-[#4F46E5] hover:bg-[#4338CA] text-xs font-bold text-white shadow-md">
                Confirm Create
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
