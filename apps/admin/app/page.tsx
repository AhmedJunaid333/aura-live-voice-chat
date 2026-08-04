'use client';

import React, { useState, useMemo } from 'react';

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
  Download: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('ALL');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  
  const [targetUser, setTargetUser] = useState<any>(null);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('7');
  const [newGiftName, setNewGiftName] = useState('');
  const [newGiftPrice, setNewGiftPrice] = useState('50000');
  const [newGiftVip, setNewGiftVip] = useState('1');

  const [usersList, setUsersList] = useState([
    { id: '100821', name: 'Sara_Vip7', level: 'Lv.45', vip: 'VIP 7', family: 'Royal Lions', coins: '1,450,000', diamonds: '820,000', risk: 'Low', status: 'ACTIVE' },
    { id: '100452', name: 'Dark_Phantom', level: 'Lv.12', vip: 'VIP 1', family: 'None', coins: '12,000', diamonds: '500', risk: 'High', status: 'SUSPENDED' },
    { id: '100998', name: 'King_Rana_VIP', level: 'Lv.58', vip: 'VIP 7', family: 'Rana Clan', coins: '8,900,000', diamonds: '4,200,000', risk: 'Low', status: 'ACTIVE' },
    { id: '100114', name: 'SpamBot_3912', level: 'Lv.1', vip: 'VIP 0', family: 'None', coins: '0', diamonds: '0', risk: 'Critical', status: 'BANNED' },
  ]);

  const [activeRooms, setActiveRooms] = useState([
    { id: 'RM-8821', title: '💖 Urdu Romantic Poetry & Songs', host: 'Sara_Vip7', listeners: 1420, seats: 10, category: 'Music', pK: true, isMuted: false },
    { id: 'RM-9042', title: '🔥 Ultimate 3v3 PK Battle Arena', host: 'King_Rana_VIP', listeners: 3890, seats: 15, category: 'PK Battle', pK: true, isMuted: false },
    { id: 'RM-1029', title: '🌙 Late Night Chat & Chill Space', host: 'Ali_Choudhary', listeners: 850, seats: 10, category: 'Chat', pK: false, isMuted: false },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 'log-1', type: 'RECHARGE', desc: 'User #100998 completed $500.00 JazzCash order', time: '12s ago', status: 'SUCCESS', accent: 'text-[#10B981]' },
    { id: 'log-2', type: 'GIFT_SEND', desc: 'Sara_Vip7 sent Supercar Phantom (50,000 Coins)', time: '34s ago', status: 'COMPLETED', accent: 'text-[#06B6D4]' },
    { id: 'log-3', type: 'AI_MOD', desc: 'Voice toxicity warning issued in Room #RM-8821', time: '1m ago', status: 'FLAGGED', accent: 'text-[#EF4444]' },
  ]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.id.includes(searchQuery);
      const matchesStatus = userStatusFilter === 'ALL' || u.status === userStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [usersList, searchQuery, userStatusFilter]);

  const handleConfirmBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser || !banReason.trim()) return;

    setUsersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, status: 'BANNED' } : u));
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        type: 'BAN_USER',
        desc: `Admin banned User #${targetUser.id} (${targetUser.name}) for ${banDuration} days. Reason: ${banReason}`,
        time: 'Just now',
        status: 'BANNED',
        accent: 'text-[#EF4444]'
      },
      ...prev
    ]);

    setShowBanModal(false);
    setBanReason('');
    alert(`User ${targetUser.name} (${targetUser.id}) has been banned for ${banDuration} days.`);
  };

  const handleCreateGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGiftName.trim()) return;

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        type: 'CREATE_GIFT',
        desc: `Admin created gift '${newGiftName}' for ${newGiftPrice} Coins (Requires VIP ${newGiftVip})`,
        time: 'Just now',
        status: 'PUBLISHED',
        accent: 'text-[#10B981]'
      },
      ...prev
    ]);

    setShowCreateModal(false);
    setNewGiftName('');
    alert(`New Gift '${newGiftName}' published to store!`);
  };

  const handleToggleMute = (roomId: string) => {
    setActiveRooms(prev => prev.map(r => r.id === roomId ? { ...r, isMuted: !r.isMuted } : r));
  };

  const handleCloseRoom = (roomId: string) => {
    setActiveRooms(prev => prev.filter(r => r.id !== roomId));
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        type: 'CLOSE_ROOM',
        desc: `Admin force closed Live Voice Room #${roomId}`,
        time: 'Just now',
        status: 'TERMINATED',
        accent: 'text-[#EF4444]'
      },
      ...prev
    ]);
  };

  const handleExportCSV = () => {
    const csvRows = ['User ID,Name,Level,VIP,Coins,Diamonds,Risk,Status'];
    usersList.forEach(u => csvRows.push(`${u.id},${u.name},${u.level},${u.vip},"${u.coins}","${u.diamonds}",${u.risk},${u.status}`));
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura_admin_users_${Date.now()}.csv`;
    a.click();
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
    { label: 'Active Live Rooms', value: `${activeRooms.length}`, change: '+8.1%', accent: 'bg-[#3B82F6]' },
    { label: 'Active Creator Hosts', value: '890', change: '+5.3%', accent: 'bg-[#3B82F6]' },
    { label: 'Pending Withdrawals', value: '$6,350.00', change: '-2.1%', accent: 'bg-[#F59E0B]' },
    { label: 'Flagged Safety Reports', value: '14 Reports', change: 'Requires Action', accent: 'bg-[#EF4444]' },
    { label: 'Agora RTC Latency', value: '18 ms', change: 'Optimal', accent: 'bg-[#10B981]' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0B1220] text-white font-sans overflow-hidden select-none">
      
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

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#0B1220]">
        
        <header className="h-20 px-8 border-b border-[#273449] flex items-center justify-between bg-[#111827]/80 backdrop-blur-md z-20">
          <div className="relative w-80">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <Icon.Search />
            </span>
            <input
              type="text"
              placeholder="Search User ID, Name, Room..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#273449] text-white font-bold text-xs border border-[#273449] transition flex items-center gap-2"
            >
              <Icon.Download />
              <span>Export CSV</span>
            </button>

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

        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Executive Dashboard</h2>
              <p className="text-sm text-[#94A3B8] mt-1">Real-time telemetry & functional state for cluster: <strong className="text-[#06B6D4]">{cluster}</strong></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((k, i) => (
                <div
                  key={i}
                  className="bg-[#131C2E] border border-[#273449] rounded-[20px] p-6 shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
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

          <section className="bg-[#131C2E] border border-[#273449] rounded-[20px] p-6 space-y-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">User Ecosystem & Host Management</h3>
                <p className="text-sm text-[#94A3B8]">Filterable user accounts and real-time suspension controls</p>
              </div>

              <div className="flex items-center gap-2 bg-[#1E293B] border border-[#273449] rounded-xl p-1">
                {['ALL', 'ACTIVE', 'SUSPENDED', 'BANNED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setUserStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      userStatusFilter === st ? 'bg-[#4F46E5] text-white' : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#273449]">
              <table className="w-full text-left text-xs text-[#CBD5E1]">
                <thead className="bg-[#1E293B] text-[#94A3B8] font-bold uppercase tracking-wider text-[11px] border-b border-[#273449]">
                  <tr>
                    <th className="p-4">User ID / Name</th>
                    <th className="p-4">Level & VIP</th>
                    <th className="p-4">Family</th>
                    <th className="p-4">Coins / Diamonds</th>
                    <th className="p-4">Fraud Risk</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#273449] bg-[#0B1220]/40">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-[#1E293B]/40 transition">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{u.name}</div>
                        <div className="text-[11px] text-[#94A3B8] font-mono">ID: {u.id}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-[#4F46E5]/20 text-[#4F46E5] font-bold text-xs mr-2">{u.level}</span>
                        <span className="px-2.5 py-1 rounded-md bg-[#F59E0B]/20 text-[#F59E0B] font-bold text-xs">{u.vip}</span>
                      </td>
                      <td className="p-4 font-semibold">{u.family}</td>
                      <td className="p-4 font-mono">
                        <div className="text-[#F59E0B] font-bold">{u.coins} Coins</div>
                        <div className="text-[#06B6D4] font-bold">{u.diamonds} Diamonds</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          u.risk === 'Low' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                        }`}>
                          {u.risk} Risk
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          u.status === 'ACTIVE' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {u.status !== 'BANNED' ? (
                          <button
                            onClick={() => { setTargetUser(u); setShowBanModal(true); }}
                            className="px-3 py-1.5 rounded-lg bg-[#EF4444]/20 hover:bg-[#EF4444]/30 border border-[#EF4444]/40 text-[#EF4444] text-xs font-bold transition"
                          >
                            Ban Account
                          </button>
                        ) : (
                          <span className="text-xs text-[#94A3B8] font-bold">Banned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-bold text-white">Live Voice Rooms Telemetry</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeRooms.map(r => (
                <div key={r.id} className="bg-[#131C2E] border border-[#273449] rounded-[20px] p-6 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#06B6D4]">{r.id}</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#4F46E5]/20 text-[#4F46E5]">
                      {r.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base truncate">{r.title}</h4>
                  <div className="text-xs text-[#94A3B8] space-y-1">
                    <p>Host: <strong className="text-white">{r.host}</strong></p>
                    <p>Listeners: <strong className="text-[#06B6D4]">{r.listeners} Viewers</strong></p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleToggleMute(r.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        r.isMuted ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30' : 'bg-[#1E293B] text-white border-[#273449]'
                      }`}
                    >
                      {r.isMuted ? 'Unmute Mic' : 'Mute Mic'}
                    </button>
                    <button
                      onClick={() => handleCloseRoom(r.id)}
                      className="flex-1 py-2 rounded-xl bg-[#EF4444]/20 hover:bg-[#EF4444]/30 border border-[#EF4444]/40 text-[#EF4444] text-xs font-bold transition"
                    >
                      Force Close
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#131C2E] border border-[#273449] rounded-[20px] p-6 space-y-4 shadow-lg">
            <h4 className="text-lg font-bold text-white">Security & Audit Event Stream</h4>
            <div className="space-y-2.5">
              {auditLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#1E293B]/50 border border-[#273449] text-xs">
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

      {showBanModal && targetUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleConfirmBan} className="w-full max-w-md p-6 rounded-[20px] bg-[#131C2E] border border-[#273449] space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Ban Account Authorization</h3>
            <p className="text-xs text-[#94A3B8]">Target User: <strong className="text-white">{targetUser.name} (ID: {targetUser.id})</strong></p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#CBD5E1] mb-1 block">Ban Duration</label>
                <select
                  value={banDuration}
                  onChange={e => setBanDuration(e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#273449] rounded-xl p-3 text-xs text-white"
                >
                  <option value="7">7 Days Suspension</option>
                  <option value="30">30 Days Suspension</option>
                  <option value="365">1 Year Suspension</option>
                  <option value="9999">Permanent MAC / IP Ban</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#CBD5E1] mb-1 block">Reason for Audit Log</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Voice Toxicity / Financial Fraud"
                  value={banReason}
                  onChange={e => setBanReason(e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#273449] rounded-xl p-3 text-xs text-white placeholder-[#94A3B8]"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setShowBanModal(false)}
                className="flex-1 h-[52px] rounded-[16px] bg-[#1E293B] text-xs font-bold text-[#CBD5E1]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-[52px] rounded-[16px] bg-[#EF4444] text-xs font-bold text-white shadow-md"
              >
                Execute Ban
              </button>
            </div>
          </form>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateGift} className="w-full max-w-md p-6 rounded-[20px] bg-[#131C2E] border border-[#273449] space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Create Animated Gift Asset</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#CBD5E1] mb-1 block">Gift Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Supercar Phantom"
                  value={newGiftName}
                  onChange={e => setNewGiftName(e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#273449] rounded-xl p-3 text-xs text-white placeholder-[#94A3B8]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#CBD5E1] mb-1 block">Price in Coins</label>
                <input
                  type="number"
                  required
                  value={newGiftPrice}
                  onChange={e => setNewGiftPrice(e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#273449] rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#CBD5E1] mb-1 block">Required VIP Tier</label>
                <select
                  value={newGiftVip}
                  onChange={e => setNewGiftVip(e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#273449] rounded-xl p-3 text-xs text-white"
                >
                  <option value="1">VIP 1</option>
                  <option value="3">VIP 3</option>
                  <option value="5">VIP 5</option>
                  <option value="7">VIP 7</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 h-[52px] rounded-[16px] bg-[#1E293B] text-xs font-bold text-[#CBD5E1]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-[52px] rounded-[16px] bg-[#4F46E5] text-xs font-bold text-white shadow-md"
              >
                Publish Gift
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
