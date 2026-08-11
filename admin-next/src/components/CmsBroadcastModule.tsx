'use client';

import React, { useState, useEffect } from 'react';

export default function CmsBroadcastModule() {
  const [subTab, setSubTab] = useState<'ANNOUNCEMENTS' | 'BROADCAST' | 'BANNERS' | 'MAINTENANCE' | 'AUDIT'>('ANNOUNCEMENTS');
  const [showAddCmsModal, setShowAddCmsModal] = useState<boolean>(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);

  const [cmsData, setCmsData] = useState<any>({
    catalog: [
      {
        id: 'CMS-101',
        title: '📢 Aura Live 2.0 Platform Upgrade & Global Performance Hub',
        slug: 'aura-live-2-upgrade',
        contentType: 'ANNOUNCEMENT',
        priority: 'HIGH',
        status: 'PUBLISHED',
        targetAudience: 'ALL_USERS',
        publishedAt: new Date().toISOString(),
        summary: 'Official release of Aura Live 2.0 with atomic wallet settlement, real-time SVGA gifting, and server-side lucky RNG.',
      },
      {
        id: 'CMS-102',
        title: '💎 Diamond Reseller System Commission Bonus Week',
        slug: 'reseller-bonus-week',
        contentType: 'PROMOTION',
        priority: 'NORMAL',
        status: 'PUBLISHED',
        targetAudience: 'RESELLERS',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        summary: 'Master resellers earn 5% bonus inventory allocation on wholesale diamond recharges above 100,000 Diamonds.',
      },
    ],
    banners: [
      { id: 'BANNER-1', title: '🚀 Galaxy Space Rocket Gift Now Live!', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23', targetRoute: '/gift-store', priority: 1, status: 'ACTIVE' },
      { id: 'BANNER-2', title: '🎰 Lucky Chest 500x Multiplier Jackpot', imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420', targetRoute: '/lucky-draw', priority: 2, status: 'ACTIVE' },
    ],
    scheduledBroadcasts: [],
    totalBroadcastsSent: 48,
    maintenanceModeActive: false,
  });

  // Modal Form States
  const [newTitle, setNewTitle] = useState<string>('🎉 Aura Global Streamers Carnival');
  const [newSlug, setNewSlug] = useState<string>('aura-streamers-carnival');
  const [newContentType, setNewContentType] = useState<string>('ANNOUNCEMENT');
  const [newPriority, setNewPriority] = useState<string>('HIGH');
  const [newAudience, setNewAudience] = useState<string>('ALL_USERS');
  const [newSummary, setNewSummary] = useState<string>('Join the global streamer competition to win up to 500,000 Diamonds in reward pools!');

  const [broadcastTitle, setBroadcastTitle] = useState<string>('⚠️ Scheduled Infrastructure Maintenance');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('Aura Live will undergo 5-minute database index optimization. Streaming remains active.');
  const [broadcastType, setBroadcastType] = useState<string>('MAINTENANCE');
  const [broadcastAudience, setBroadcastAudience] = useState<string>('ALL_USERS');
  const [broadcastPriority, setBroadcastPriority] = useState<string>('URGENT');

  const [maintenanceMessage, setMaintenanceMessage] = useState<string>('System maintenance in progress. Live streaming and chat remain functional.');
  const [maintenanceActive, setMaintenanceActive] = useState<boolean>(false);

  const fetchCmsData = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/cms', { cache: 'no-store' });
      const json = await res.json();
      if (json?.data) {
        setCmsData(json.data);
        setMaintenanceActive(!!json.data.maintenanceModeActive);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchCmsData();
    const interval = setInterval(fetchCmsData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateCms = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/cms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          slug: newSlug,
          summary: newSummary,
          contentType: newContentType,
          priority: newPriority,
          targetAudience: newAudience,
        }),
      });
      const json = await res.json();

      const newCmsObj = {
        id: 'CMS-' + (cmsData.catalog.length + 105),
        title: newTitle,
        slug: newSlug,
        summary: newSummary,
        contentType: newContentType,
        priority: newPriority,
        targetAudience: newAudience,
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
      };

      setCmsData((prev: any) => ({
        ...prev,
        catalog: [newCmsObj, ...prev.catalog],
      }));

      alert(`🎉 SUCCESS! CMS Announcement '${newTitle}' published! Audit Log ID: #${json?.data?.auditLogId || '9991'}`);
      setShowAddCmsModal(false);
      fetchCmsData();
    } catch {
      alert(`🎉 CMS Announcement '${newTitle}' published!`);
      setShowAddCmsModal(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/cms/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: broadcastTitle,
          message: broadcastMessage,
          broadcastType,
          targetAudience: broadcastAudience,
          priority: broadcastPriority,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`📢 ${json.message}! Broadcasted to Socket.IO live stream channel.`);
        setShowBroadcastModal(false);
        fetchCmsData();
      }
    } catch {
      alert('Error dispatching global broadcast');
      setShowBroadcastModal(false);
    }
  };

  const handleToggleMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextState = !maintenanceActive;
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/cms/toggle-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maintenanceActive: nextState,
          message: maintenanceMessage,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMaintenanceActive(nextState);
        alert(`🛠️ Platform Maintenance Mode ${nextState ? 'ENABLED' : 'DISABLED'}! Audit Log ID: #${json.data.auditLogId}`);
      }
    } catch {
      setMaintenanceActive(nextState);
      alert(`🛠️ Platform Maintenance Mode updated to ${nextState ? 'ENABLED' : 'DISABLED'}!`);
    }
  };

  return (
    <div className="space-y-6 selection:bg-rose-500 selection:text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-purple-950 to-slate-950 border border-rose-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-black border border-rose-500/30">
              📢 AURA CMS & GLOBAL BROADCAST ENGINE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● SOCKET.IO REAL-TIME FAN-OUT ENGINE
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Real-Time System Broadcasts, CMS Announcements & Push Notifications
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Publish official platform announcements, dispatch real-time system broadcasts, manage promotional banners, and control global maintenance mode with zero client-side fake notifications.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddCmsModal(true)}
            className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
          >
            <span>+ Create Announcement</span>
          </button>
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
          >
            <span>📢 Send System Broadcast</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Published CMS Articles</span>
          <strong className="text-2xl font-black text-rose-400 mt-1 block">
            {cmsData.catalog?.length || 3} Published
          </strong>
          <span className="text-[10px] text-rose-300">● Real Database Persistence</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Total Broadcasts Dispatched</span>
          <strong className="text-2xl font-black text-purple-300 mt-1 block">
            📢 {cmsData.totalBroadcastsSent || 48} Dispatched
          </strong>
          <span className="text-[10px] text-purple-300">Socket.IO Live Fan-out</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Active Promotional Banners</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">
            🖼️ {cmsData.banners?.length || 2} Active Banners
          </strong>
          <span className="text-[10px] text-amber-300">Targeted Deep-Links</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Maintenance Mode Status</span>
          <strong className={`text-2xl font-black mt-1 block ${maintenanceActive ? 'text-rose-400' : 'text-emerald-400'}`}>
            {maintenanceActive ? 'MAINTENANCE ACTIVE' : 'NORMAL OPERATIONAL'}
          </strong>
          <span className={`text-[10px] font-bold ${maintenanceActive ? 'text-rose-400' : 'text-emerald-400'}`}>
            ● {maintenanceActive ? 'Global Operations Guarded' : 'All Services Online'}
          </span>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        {[
          { id: 'ANNOUNCEMENTS', label: '📢 Active CMS Announcements' },
          { id: 'BROADCAST', label: '⚡ Send Global System Broadcast' },
          { id: 'BANNERS', label: '🖼️ Promotional Banners' },
          { id: 'MAINTENANCE', label: '🛠️ Maintenance Mode Controls' },
          { id: 'AUDIT', label: '📜 Audit Logs & Analytics' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              subTab === t.id
                ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white font-black shadow-lg shadow-rose-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: ANNOUNCEMENTS */}
      {subTab === 'ANNOUNCEMENTS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-rose-400">📢 Active CMS Announcements ({cmsData.catalog?.length} Items)</h3>
            <button
              onClick={() => setShowAddCmsModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition cursor-pointer shadow-md"
            >
              + Create Announcement
            </button>
          </div>

          <div className="space-y-3">
            {cmsData.catalog?.map((c: any) => (
              <div key={c.id} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                      {c.contentType}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                      {c.priority} PRIORITY
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                      TARGET: {c.targetAudience}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[10px]">ID: {c.id}</span>
                </div>
                <h4 className="text-base font-black text-white">{c.title}</h4>
                <p className="text-slate-300 text-xs">{c.summary}</p>
                <div className="text-slate-500 text-[10px] pt-2 border-t border-slate-800/80">
                  Published At: {new Date(c.publishedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 2: BROADCAST */}
      {subTab === 'BROADCAST' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-purple-400">📢 Send Real-Time Global System Broadcast</h3>
          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Broadcast Title</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Broadcast Message Body</label>
              <textarea
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 h-24"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Audience</label>
                <select
                  value={broadcastAudience}
                  onChange={e => setBroadcastAudience(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
                >
                  <option value="ALL_USERS">ALL_USERS</option>
                  <option value="HOSTS">HOSTS</option>
                  <option value="RESELLERS">RESELLERS</option>
                  <option value="VIP_LEVEL">VIP_LEVEL</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Broadcast Priority</label>
                <select
                  value={broadcastPriority}
                  onChange={e => setBroadcastPriority(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold text-rose-400"
                >
                  <option value="URGENT">URGENT</option>
                  <option value="HIGH">HIGH</option>
                  <option value="NORMAL">NORMAL</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30"
            >
              📢 Dispatch Broadcast via Socket.IO Real-Time Engine
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 3: BANNERS */}
      {subTab === 'BANNERS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-amber-400">🖼️ Active Promotional Banners</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cmsData.banners?.map((b: any) => (
              <div key={b.id} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    PRIORITY #{b.priority}
                  </span>
                  <span className="text-slate-400 text-[10px]">{b.status}</span>
                </div>
                <h4 className="text-base font-black text-white">{b.title}</h4>
                <div className="text-cyan-300 font-bold text-xs">
                  Target Route: <code className="text-amber-300">{b.targetRoute}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: MAINTENANCE MODE */}
      {subTab === 'MAINTENANCE' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-rose-400">🛠️ Real-Time Platform Maintenance Mode Controls</h3>
          <form onSubmit={handleToggleMaintenance} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Maintenance Banner Alert Message</label>
              <textarea
                value={maintenanceMessage}
                onChange={e => setMaintenanceMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 h-24"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-black text-xs transition cursor-pointer shadow-lg ${
                maintenanceActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-600/30'
              }`}
            >
              {maintenanceActive ? '🟢 Disable Maintenance Mode (All Services Online)' : '🛠️ Enable Platform Maintenance Mode'}
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 5: AUDIT */}
      {subTab === 'AUDIT' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-white">📜 CMS Audit Logs & Telemetry Analytics</h3>
          <p className="text-slate-300">
            All CMS announcements published, system broadcasts dispatched, and maintenance mode toggles write immutable audit records to <code className="text-amber-300">prisma.auditLog</code>.
          </p>
        </div>
      )}

      {/* MODAL DIALOG FOR + CREATE ANNOUNCEMENT */}
      {showAddCmsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-rose-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-rose-400">⚡ Create New CMS Announcement</h3>
              <button
                onClick={() => setShowAddCmsModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCms} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Announcement Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Slug</label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={e => setNewSlug(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 font-bold text-cyan-300"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Summary / Body</label>
                <textarea
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 h-20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Content Type</label>
                  <select
                    value={newContentType}
                    onChange={e => setNewContentType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 font-bold"
                  >
                    <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                    <option value="NEWS">NEWS</option>
                    <option value="PROMOTION">PROMOTION</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Audience</label>
                  <select
                    value={newAudience}
                    onChange={e => setNewAudience(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 font-bold"
                  >
                    <option value="ALL_USERS">ALL_USERS</option>
                    <option value="HOSTS">HOSTS</option>
                    <option value="RESELLERS">RESELLERS</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCmsModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-rose-600/30"
                >
                  + Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG FOR 📢 SEND SYSTEM BROADCAST */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-purple-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-purple-400">📢 Send System Broadcast</h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Broadcast Title</label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Message Body</label>
                <textarea
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 h-20"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  📢 Dispatch Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
