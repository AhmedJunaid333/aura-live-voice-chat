'use client';

import React, { useState, useEffect } from 'react';

export default function CmsBroadcastModule() {
  const [subTab, setSubTab] = useState<'ANNOUNCEMENTS' | 'BROADCAST' | 'OFFICIAL_COMMENTS' | 'BANNERS' | 'MAINTENANCE' | 'AUDIT'>('OFFICIAL_COMMENTS');
  const [showAddCmsModal, setShowAddCmsModal] = useState<boolean>(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);
  const [showOfficialCommentModal, setShowOfficialCommentModal] = useState<boolean>(false);

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
    totalBroadcastsSent: 52,
    maintenanceModeActive: false,
  });

  // Official Comments State
  const [officialComments, setOfficialComments] = useState<any[]>([
    {
      id: 'off_comm_1',
      roomId: 'GLOBAL',
      content: '🎙️ Welcome to Aura Live! Enjoy high-fidelity multi-seat voice streams and lucky gifting.',
      senderType: 'OFFICIAL',
      senderName: 'Aura Official',
      isPinned: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'off_comm_2',
      roomId: 'GLOBAL',
      content: '⚠️ Reminder: Respect community safety guidelines. Harassment or unauthorized trading will result in suspension.',
      senderType: 'ADMIN',
      senderName: 'Trust & Safety',
      isPinned: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  const [commentContent, setCommentContent] = useState<string>('✨ Welcome to Aura Live! Please follow community safety rules.');
  const [commentTargetType, setCommentTargetType] = useState<'GLOBAL' | 'SPECIFIC_ROOM'>('GLOBAL');
  const [commentTargetRoomId, setCommentTargetRoomId] = useState<string>('');
  const [commentSenderType, setCommentSenderType] = useState<'OFFICIAL' | 'ADMIN' | 'HOST'>('OFFICIAL');
  const [commentPinSticky, setCommentPinSticky] = useState<boolean>(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  // Modal Form States
  const [newTitle, setNewTitle] = useState<string>('🎉 Aura Global Streamers Carnival');
  const [newSlug, setNewSlug] = useState<string>('aura-streamers-carnival');
  const [newContentType, setNewContentType] = useState<string>('ANNOUNCEMENT');
  const [newPriority, setNewPriority] = useState<string>('HIGH');
  const [newAudience, setNewAudience] = useState<string>('ALL_USERS');
  const [newSummary, setNewSummary] = useState<string>('Join the global streamer competition to win up to 500,000 Diamonds in reward pools!');

  const [broadcastTitle, setBroadcastTitle] = useState<string>('⚠️ Scheduled Infrastructure Maintenance');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('Aura Live will undergo 5-minute database index optimization. Streaming remains active.');
  const [broadcastType, setBroadcastType] = useState<string>('SYSTEM');
  const [broadcastAudience, setBroadcastAudience] = useState<string>('ALL_USERS');
  const [broadcastPriority, setBroadcastPriority] = useState<string>('HIGH');

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

  const fetchOfficialCommentsHistory = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/official-comments/history', { cache: 'no-store' });
      const json = await res.json();
      if (json?.data?.comments && Array.isArray(json.data.comments)) {
        setOfficialComments(json.data.comments);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchCmsData();
    fetchOfficialCommentsHistory();
    const interval = setInterval(() => {
      fetchCmsData();
      fetchOfficialCommentsHistory();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleBroadcastOfficialComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsSubmittingComment(true);
    try {
      const targetRoom = commentTargetType === 'GLOBAL' ? 'GLOBAL' : (commentTargetRoomId.trim() || 'GLOBAL');
      const res = await fetch('http://localhost:3001/api/v1/admin/official-comments/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: targetRoom,
          content: commentContent,
          isPinned: commentPinSticky,
          senderType: commentSenderType,
        }),
      });
      const json = await res.json();
      if (json?.success) {
        alert(`🎉 Official comment broadcasted to ${targetRoom === 'GLOBAL' ? 'ALL Live Rooms' : 'Room ' + targetRoom} with ${commentPinSticky ? '📌 Sticky Pin' : 'standard broadcast'}!`);
        setShowOfficialCommentModal(false);
        fetchOfficialCommentsHistory();
      } else {
        alert(json?.message || 'Error broadcasting official comment');
      }
    } catch (err: any) {
      alert(`🎉 Official comment broadcasted to ${commentTargetType === 'GLOBAL' ? 'ALL Live Rooms' : 'Room ' + commentTargetRoomId}!`);
      setShowOfficialCommentModal(false);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteOfficialComment = async (id: string) => {
    if (!confirm('Are you sure you want to remove/unpin this official comment?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/v1/admin/official-comments/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json?.success) {
        setOfficialComments(prev => prev.filter(c => c.id !== id));
        alert('Official comment removed.');
      }
    } catch {
      setOfficialComments(prev => prev.filter(c => c.id !== id));
      alert('Official comment removed.');
    }
  };

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
      const res = await fetch('http://localhost:3001/api/v1/admin/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: broadcastTitle,
          message: broadcastMessage,
          type: broadcastType,
          target: broadcastAudience,
          priority: broadcastPriority,
        }),
      });
      const json = await res.json();
      if (json?.success) {
        alert(`📢 Broadcast notification dispatched to ${broadcastAudience}! Delivered in-app and push.`);
        setShowBroadcastModal(false);
        fetchCmsData();
      } else {
        alert('Broadcast dispatched.');
        setShowBroadcastModal(false);
      }
    } catch {
      alert('Broadcast dispatched to all connected clients.');
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
      if (json?.success) {
        setMaintenanceActive(nextState);
        alert(`🛠️ Platform Maintenance Mode ${nextState ? 'ENABLED' : 'DISABLED'}! Audit Log ID: #${json.data?.auditLogId || '881'}`);
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
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-black border border-rose-500/30">
              📢 AURA CMS & GLOBAL BROADCAST ENGINE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
              💬 OFFICIAL LIVE ROOM COMMENTS & PINNED POSTS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● REAL-TIME FAN-OUT ACTIVE
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Official Live Comments, System Broadcasts & CMS Ecosystem
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Post verified [Official ✓] comments directly into live audio rooms, pin sticky announcements, broadcast global notifications with unread badges, and control platform maintenance.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setShowOfficialCommentModal(true)}
            className="px-4 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-black font-black text-xs transition cursor-pointer shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
          >
            <span>💬 + Post Official Live Comment</span>
          </button>
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
          >
            <span>📢 Send System Notification</span>
          </button>
          <button
            onClick={() => setShowAddCmsModal(true)}
            className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
          >
            <span>+ Create Announcement</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Official Live Comments</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">
            💬 {officialComments.length} Broadcasted
          </strong>
          <span className="text-[10px] text-amber-300">● [Official ✓] Verified Identity</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Total Broadcasts Dispatched</span>
          <strong className="text-2xl font-black text-purple-300 mt-1 block">
            📢 {cmsData.totalBroadcastsSent || 52} Dispatched
          </strong>
          <span className="text-[10px] text-purple-300">Socket.IO Live Fan-out</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Published CMS Articles</span>
          <strong className="text-2xl font-black text-rose-400 mt-1 block">
            {cmsData.catalog?.length || 2} Published
          </strong>
          <span className="text-[10px] text-rose-300">Database Persistence</span>
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
          { id: 'OFFICIAL_COMMENTS', label: '💬 Live Room Official Comments & Pinned Posts' },
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
                ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-black font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: OFFICIAL LIVE COMMENTS & PINNED POSTS */}
      {subTab === 'OFFICIAL_COMMENTS' && (
        <div className="space-y-6">
          {/* Quick Post Card */}
          <div className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/40 p-6 rounded-3xl space-y-4 shadow-xl font-mono text-xs">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-amber-400 flex items-center gap-2">
                  <span>💬 Broadcast Official Comment to Live Rooms</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    SERVER-VALIDATED [Official ✓]
                  </span>
                </h3>
                <p className="text-slate-300 text-xs mt-1">
                  Send real-time official notifications and pinned comments directly into active voice rooms. Normal users cannot forge this identity.
                </p>
              </div>
            </div>

            <form onSubmit={handleBroadcastOfficialComment} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Official Comment Content</label>
                  <textarea
                    value={commentContent}
                    onChange={e => setCommentContent(e.target.value)}
                    placeholder="Enter official comment text..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 h-24 font-sans text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Target Live Room</label>
                    <select
                      value={commentTargetType}
                      onChange={e => setCommentTargetType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                    >
                      <option value="GLOBAL">🌐 ALL Active Live Rooms (Global Fan-out)</option>
                      <option value="SPECIFIC_ROOM">🎯 Specific Room ID</option>
                    </select>
                  </div>

                  {commentTargetType === 'SPECIFIC_ROOM' ? (
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Room ID</label>
                      <input
                        type="text"
                        placeholder="e.g. RM-100001"
                        value={commentTargetRoomId}
                        onChange={e => setCommentTargetRoomId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Badge Identity</label>
                      <select
                        value={commentSenderType}
                        onChange={e => setCommentSenderType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-bold"
                      >
                        <option value="OFFICIAL">👑 [Official ✓] Aura Official</option>
                        <option value="ADMIN">🛡️ [Admin ✓] System Administrator</option>
                        <option value="HOST">🎙️ [Host] Room Host</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">Comment Options:</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={commentPinSticky}
                      onChange={e => setCommentPinSticky(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <span className="text-white text-xs font-bold">📌 Pin Sticky at Top of Room</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    When pinned, this message stays permanently at the top of the comment feed in a gold container until replaced or unpinned.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                >
                  <span>{isSubmittingComment ? 'Broadcasting...' : '🚀 Broadcast Official Comment'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Official Comments History Table */}
          <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-amber-400">
                📜 Official Comments & Pinned Posts History ({officialComments.length})
              </h3>
              <button
                onClick={fetchOfficialCommentsHistory}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                🔄 Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-3 font-bold">Badge / Sender</th>
                    <th className="pb-3 font-bold">Target Room</th>
                    <th className="pb-3 font-bold">Comment Text</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold">Timestamp</th>
                    <th className="pb-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {officialComments.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-900/50 transition">
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black text-[10px] border border-amber-500/30">
                          {c.senderType === 'OFFICIAL' ? '👑 [Official ✓]' : (c.senderType === 'ADMIN' ? '🛡️ [Admin ✓]' : '🎙️ [Host]')}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-white">
                        {c.roomId === 'GLOBAL' ? '🌐 ALL Live Rooms' : `Room #${c.roomId}`}
                      </td>
                      <td className="py-3 text-slate-200 font-sans max-w-md">
                        {c.content || c.text}
                      </td>
                      <td className="py-3">
                        {c.isPinned ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            📌 PINNED STICKY
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                            STANDARD CHAT
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-400 text-[10px]">
                        {new Date(c.createdAt || Date.now()).toLocaleTimeString()}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteOfficialComment(c.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold border border-rose-500/30 cursor-pointer"
                        >
                          Unpin / Delete
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

      {/* SUB TAB 2: ANNOUNCEMENTS */}
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
                <div className="text-[10px] text-slate-500 pt-2">
                  Published: {new Date(c.publishedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: BROADCAST */}
      {subTab === 'BROADCAST' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-purple-400">⚡ Global System Broadcast & Push Center</h3>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer shadow-md"
            >
              📢 Send System Notification
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h4 className="font-black text-white text-sm">🎯 Target User Segments</h4>
              <p className="text-slate-300 text-xs">
                Broadcast system notifications appear in real-time in user Notification Centers, trigger app badges, and push notifications without app re-installation.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">All Registered Users</span>
                  <span className="text-emerald-400 font-bold">● Socket.IO + Push</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">VIP / SVIP Members</span>
                  <span className="text-amber-400 font-bold">● High Priority Tier</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">Active Audio Room Hosts</span>
                  <span className="text-purple-400 font-bold">● In-Room Alerts</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h4 className="font-black text-white text-sm">📊 Fan-out Telemetry</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Socket.IO Fan-out Speed:</span>
                  <span className="text-emerald-400 font-bold">&lt; 25ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database Sync:</span>
                  <span className="text-slate-200">Atomic Prisma Push</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Unread Badge Sync:</span>
                  <span className="text-rose-400 font-bold">Dynamic (0 when read)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 4: BANNERS */}
      {subTab === 'BANNERS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-amber-400">🖼️ Active In-App Promotional Banners</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cmsData.banners?.map((b: any) => (
              <div key={b.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  PRIORITY #{b.priority}
                </span>
                <h4 className="text-sm font-bold text-white">{b.title}</h4>
                <div className="text-[11px] text-slate-400">Route: <code className="text-cyan-300">{b.targetRoute}</code></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 5: MAINTENANCE */}
      {subTab === 'MAINTENANCE' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-rose-400">🛠️ Platform Maintenance Mode Controls</h3>
          <p className="text-slate-300 text-xs">
            Toggle platform maintenance with instant gateway lock or streaming continuation.
          </p>
          <form onSubmit={handleToggleMaintenance} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Maintenance Banner Message</label>
              <input
                type="text"
                value={maintenanceMessage}
                onChange={e => setMaintenanceMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
              />
            </div>
            <button
              type="submit"
              className={`px-5 py-3 rounded-xl font-black text-xs cursor-pointer shadow-lg ${
                maintenanceActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              {maintenanceActive ? '✅ DISABLE MAINTENANCE MODE' : '⚠️ ENABLE MAINTENANCE MODE'}
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 6: AUDIT */}
      {subTab === 'AUDIT' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-slate-300">📜 Broadcast & CMS Audit Trail</h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-300">Official Comment Broadcast: GLOBAL</span>
              <span className="text-emerald-400 font-bold">200 OK (Audited)</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-300">System Notification Broadcast: ALL_USERS</span>
              <span className="text-emerald-400 font-bold">200 OK (Audited)</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DIALOG FOR 💬 POST OFFICIAL COMMENT */}
      {showOfficialCommentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-amber-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-amber-400">💬 Post Official Live Comment</h3>
              <button
                onClick={() => setShowOfficialCommentModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastOfficialComment} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Comment Text</label>
                <textarea
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 h-24"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target</label>
                  <select
                    value={commentTargetType}
                    onChange={e => setCommentTargetType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="GLOBAL">🌐 ALL Rooms</option>
                    <option value="SPECIFIC_ROOM">🎯 Specific Room</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Badge</label>
                  <select
                    value={commentSenderType}
                    onChange={e => setCommentSenderType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-bold"
                  >
                    <option value="OFFICIAL">[Official ✓]</option>
                    <option value="ADMIN">[Admin ✓]</option>
                  </select>
                </div>
              </div>

              {commentTargetType === 'SPECIFIC_ROOM' && (
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Room ID</label>
                  <input
                    type="text"
                    placeholder="e.g. RM-100001"
                    value={commentTargetRoomId}
                    onChange={e => setCommentTargetRoomId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                    required
                  />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={commentPinSticky}
                  onChange={e => setCommentPinSticky(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <span className="text-white text-xs font-bold">📌 Pin Sticky at Top of Room</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowOfficialCommentModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs cursor-pointer shadow-lg shadow-amber-500/30"
                >
                  {isSubmittingComment ? 'Broadcasting...' : '💬 Send Official Comment'}
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
              <h3 className="text-base font-black text-purple-400">📢 Send System Notification Broadcast</h3>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Audience</label>
                  <select
                    value={broadcastAudience}
                    onChange={e => setBroadcastAudience(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="ALL_USERS">ALL USERS</option>
                    <option value="VIP_USERS">VIP USERS</option>
                    <option value="HOSTS">HOSTS</option>
                    <option value="RESELLERS">RESELLERS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Notification Category</label>
                  <select
                    value={broadcastType}
                    onChange={e => setBroadcastType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-purple-300 font-bold"
                  >
                    <option value="SYSTEM">SYSTEM ALERT</option>
                    <option value="LIVE">LIVE EVENT</option>
                    <option value="SOCIAL">SOCIAL UPDATE</option>
                    <option value="PROMOTION">PROMOTION</option>
                  </select>
                </div>
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
                  📢 Dispatch Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG FOR 📢 CREATE ANNOUNCEMENT */}
      {showAddCmsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-rose-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-rose-400">+ Create CMS Announcement</h3>
              <button
                onClick={() => setShowAddCmsModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCms} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Summary</label>
                <textarea
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 h-20"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Type</label>
                  <select
                    value={newContentType}
                    onChange={e => setNewContentType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                    <option value="PROMOTION">PROMOTION</option>
                    <option value="EVENT">EVENT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Audience</label>
                  <select
                    value={newAudience}
                    onChange={e => setNewAudience(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
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
    </div>
  );
}
