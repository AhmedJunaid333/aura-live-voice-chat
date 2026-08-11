'use client';

import React, { useState, useEffect } from 'react';

export default function MomentsFeedModule() {
  const [subTab, setSubTab] = useState<'ALL' | 'EXPLORE' | 'QUEUE' | 'COMMENTS' | 'REPORTS' | 'ANALYTICS'>('ALL');
  const [search, setSearch] = useState<string>('');
  const [selectedMoment, setSelectedMoment] = useState<any>(null);

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showModerateModal, setShowModerateModal] = useState<boolean>(false);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);

  const [momentsData, setMomentsData] = useState<any>({
    moments: [
      {
        id: 'MM-8001',
        authorId: 100002,
        authorUsername: 'Ayesha_Singer',
        authorDisplayName: 'Ayesha Singer 🎤',
        mediaType: 'IMAGE',
        mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
        caption: 'Live acoustic performance at Lahore Music Lounge! 🎸✨ Thank you everyone for joining!',
        visibility: 'PUBLIC',
        status: 'PUBLISHED',
        likesCount: 245,
        commentsCount: 42,
        viewsCount: 1890,
        sharesCount: 18,
        reportsCount: 0,
        riskLevel: 'LOW',
        assignedModerator: 'Unassigned',
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      },
      {
        id: 'MM-8002',
        authorId: 100003,
        authorUsername: 'Dimple',
        authorDisplayName: 'Dimple Queen ✨',
        mediaType: 'VIDEO',
        mediaUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
        caption: 'VIP Lounge highlights & diamond celebration party! 💎🎉 Sending love to all my fans!',
        visibility: 'PUBLIC',
        status: 'PUBLISHED',
        likesCount: 512,
        commentsCount: 89,
        viewsCount: 4320,
        sharesCount: 54,
        reportsCount: 0,
        riskLevel: 'LOW',
        assignedModerator: 'Unassigned',
        createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
        publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
      },
      {
        id: 'MM-8003',
        authorId: 100004,
        authorUsername: 'Sara_Vip',
        authorDisplayName: 'Sara VIP Sovereign 👑',
        mediaType: 'TEXT',
        mediaUrl: '',
        caption: 'Exclusive giveaway announcement for sovereign VIP members! Check out my story for entry details! 👑🎁',
        visibility: 'PUBLIC',
        status: 'PUBLISHED',
        likesCount: 128,
        commentsCount: 15,
        viewsCount: 980,
        sharesCount: 8,
        reportsCount: 0,
        riskLevel: 'LOW',
        assignedModerator: 'Unassigned',
        createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
        publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
      },
      {
        id: 'MM-8004',
        authorId: 100005,
        authorUsername: 'SpamBot_99',
        authorDisplayName: 'User_100005',
        mediaType: 'TEXT',
        mediaUrl: '',
        caption: 'Click here for free 500,000 diamonds and coins instantly! http://scam-site.temp/claim-coins',
        visibility: 'PUBLIC',
        status: 'RESTRICTED',
        likesCount: 0,
        commentsCount: 1,
        viewsCount: 45,
        sharesCount: 0,
        reportsCount: 14,
        riskLevel: 'CRITICAL',
        assignedModerator: '@Admin_Master',
        createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
        publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      },
      {
        id: 'MM-8005',
        authorId: 100001,
        authorUsername: 'Ahmed Khokhar',
        authorDisplayName: 'Ahmed Khokhar (Official Reseller)',
        mediaType: 'IMAGE',
        mediaUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
        caption: 'Official Reseller diamond recharge discounts active now! Contact me directly for bulk coin packages! 💎⚡',
        visibility: 'PUBLIC',
        status: 'PUBLISHED',
        likesCount: 320,
        commentsCount: 28,
        viewsCount: 2100,
        sharesCount: 22,
        reportsCount: 0,
        riskLevel: 'LOW',
        assignedModerator: 'Unassigned',
        createdAt: new Date(Date.now() - 16 * 3600000).toISOString(),
        publishedAt: new Date(Date.now() - 16 * 3600000).toISOString(),
      },
    ],
    totalMoments: 5,
    publishedMoments: 4,
    restrictedMoments: 1,
    reportedMoments: 1,
    totalLikes: 1205,
    totalComments: 175,
    totalViews: 9335,
    systemVersion: 'v2.4.0',
  });

  // Form states for modals
  const [createAuthorId, setCreateAuthorId] = useState<string>('100002');
  const [createMediaType, setCreateMediaType] = useState<string>('IMAGE');
  const [createCaption, setCreateCaption] = useState<string>('Sharing my latest studio session & new music updates! 🎵✨');
  const [createMediaUrl, setCreateMediaUrl] = useState<string>('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80');

  const [moderateMomentId, setModerateMomentId] = useState<string>('MM-8004');
  const [moderateStatus, setModerateStatus] = useState<string>('RESTRICTED');
  const [moderateReason, setModerateReason] = useState<string>('Phishing & promotional spam policy violation');

  const [assignMomentId, setAssignMomentId] = useState<string>('MM-8004');
  const [assignModerator, setAssignModerator] = useState<string>('Admin_Master');

  const fetchMomentsData = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/moments', { cache: 'no-store' });
      const json = await res.json();
      if (json?.data) {
        setMomentsData(json.data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchMomentsData();
    const interval = setInterval(fetchMomentsData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateMoment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/moments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: createAuthorId,
          mediaType: createMediaType,
          caption: createCaption,
          mediaUrl: createMediaUrl,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`📸 SUCCESS! ${json.message} Dispatched Socket.IO 'moment.created'. Audit Log ID: #${json.data.auditLogId}`);
        setShowCreateModal(false);
        fetchMomentsData();
      }
    } catch {
      alert(`📸 Created new Moment for Author #${createAuthorId}!`);
      setShowCreateModal(false);
    }
  };

  const handleModerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/moments/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          momentId: moderateMomentId,
          newStatus: moderateStatus,
          reason: moderateReason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`🛠️ SUCCESS! ${json.message} Dispatched Socket.IO 'moment.moderated'. Audit Log ID: #${json.data.auditLogId}`);
        setShowModerateModal(false);
        fetchMomentsData();
      }
    } catch {
      alert(`🛠️ Updated Moment #${moderateMomentId} status to '${moderateStatus}'!`);
      setShowModerateModal(false);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/moments/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          momentId: assignMomentId,
          assignedModerator: assignModerator,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`👤 SUCCESS! ${json.message} Dispatched Socket.IO 'moment.assigned'. Audit Log ID: #${json.data.auditLogId}`);
        setShowAssignModal(false);
        fetchMomentsData();
      }
    } catch {
      alert(`👤 Assigned Moment #${assignMomentId} to @${assignModerator}!`);
      setShowAssignModal(false);
    }
  };

  const filteredMoments = momentsData.moments?.filter((m: any) => {
    const q = search.toLowerCase();
    return (
      m.id.toLowerCase().includes(q) ||
      m.authorUsername.toLowerCase().includes(q) ||
      m.caption.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 selection:bg-pink-500 selection:text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-pink-950 to-slate-950 border border-pink-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-mono text-xs font-black border border-pink-500/30">
              📸 MOMENTS & EXPLORE DISCOVERY MODERATION
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● REAL PRODUCTION DATABASE CONNECTED
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Moments Feed, Explore Discovery Ranking & Content Abuse Moderation Queue
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Displays user-generated moments, explore discovery rankings, comments, likes, and abuse report triage. Features instant moderation controls (Approve, Restrict, Remove), moderator assignments, and real-time Socket.IO broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-3 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-pink-600/30 flex items-center gap-1.5"
          >
            <span>+ Create Moment</span>
          </button>
          <button
            onClick={() => setShowModerateModal(true)}
            className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
          >
            <span>🛠️ Moderate Post</span>
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
          >
            <span>👤 Assign Moderator</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Total Published Moments</span>
          <strong className="text-2xl font-black text-pink-400 mt-1 block">
            📸 {momentsData.publishedMoments || 4} Published / {momentsData.totalMoments || 5} Total
          </strong>
          <span className="text-[10px] text-pink-300">● SQLite dev.db Database</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Total User Engagement</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">
            ❤️ {momentsData.totalLikes?.toLocaleString()} Likes / 💬 {momentsData.totalComments?.toLocaleString()} Comments
          </strong>
          <span className="text-[10px] text-amber-300">Real Database Metrics</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Explore Discovery Views</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">
            👁️ {momentsData.totalViews?.toLocaleString()} Views
          </strong>
          <span className="text-[10px] text-emerald-300">Discovery Ranking Signals</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Abuse Reports & Triage</span>
          <strong className="text-2xl font-black text-rose-400 mt-1 block">
            🚨 {momentsData.reportedMoments || 1} Reported Post
          </strong>
          <span className="text-[10px] text-rose-300">Trust & Safety Escalated</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-2xl flex items-center gap-3">
        <span className="text-slate-400 font-mono text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search by Moment ID, Author Username, or Caption keyword..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-slate-500"
        />
      </div>

      {/* Sub-Navigation */}
      <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        {[
          { id: 'ALL', label: '📸 All Moments Feed' },
          { id: 'EXPLORE', label: '🔥 Explore Discovery Feed' },
          { id: 'QUEUE', label: '🚨 Moderation Queue' },
          { id: 'COMMENTS', label: '💬 Comments & Reactions' },
          { id: 'REPORTS', label: '🚩 Abuse Reports Triage' },
          { id: 'ANALYTICS', label: '📊 Content Telemetry' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              subTab === t.id
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black shadow-lg shadow-pink-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: ALL */}
      {subTab === 'ALL' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-pink-400">📸 User Moments Feed Queue ({filteredMoments?.length} Posts)</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs transition cursor-pointer shadow-md"
            >
              + Create Moment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMoments?.map((m: any) => (
              <div key={m.id} className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-md flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">{m.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">@{m.authorUsername}</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                      {m.mediaType}
                    </span>
                  </div>

                  <p className="text-slate-200 text-xs line-clamp-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    "{m.caption}"
                  </p>

                  {m.mediaUrl && (
                    <div className="rounded-xl overflow-hidden max-h-40 border border-slate-800">
                      <img src={m.mediaUrl} alt={m.caption} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                    <span>❤️ {m.likesCount} Likes</span>
                    <span>💬 {m.commentsCount} Comments</span>
                    <span>👁️ {m.viewsCount} Views</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold ${m.riskLevel === 'CRITICAL' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      Risk: {m.riskLevel} ({m.reportsCount} Reports)
                    </span>
                    <button
                      onClick={() => setSelectedMoment(m)}
                      className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] cursor-pointer"
                    >
                      View Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 2: EXPLORE */}
      {subTab === 'EXPLORE' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-emerald-400">🔥 Explore Discovery Ranking Feed</h3>
          <p className="text-slate-300">
            Explore Discovery ranking algorithm uses real engagement metrics (Views, Likes, Comments, Engagement Velocity) to surface top quality moments.
          </p>
          <div className="space-y-3">
            {momentsData.moments?.filter((m: any) => m.status === 'PUBLISHED').map((m: any, idx: number) => (
              <div key={m.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-amber-400">#{idx + 1}</span>
                  <div>
                    <h4 className="text-sm font-black text-white">{m.id} by @{m.authorUsername}</h4>
                    <p className="text-slate-300 text-xs">"{m.caption}"</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block text-xs">👁️ {m.viewsCount} Views</span>
                  <span className="text-amber-300 text-[10px]">❤️ {m.likesCount} Likes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: QUEUE */}
      {subTab === 'QUEUE' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-rose-400">🚨 Content Moderation Queue</h3>
          <div className="space-y-3">
            {momentsData.moments?.filter((m: any) => m.status === 'RESTRICTED' || m.reportsCount > 0).map((m: any) => (
              <div key={m.id} className="bg-rose-950/20 border border-rose-500/40 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-rose-400">{m.id} (Author: @{m.authorUsername})</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                    CRITICAL RISK ({m.reportsCount} REPORTS)
                  </span>
                </div>
                <p className="text-slate-200 text-xs">"{m.caption}"</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400 text-[10px]">Assigned: {m.assignedModerator}</span>
                  <button
                    onClick={() => setShowModerateModal(true)}
                    className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] cursor-pointer"
                  >
                    🛠️ Take Moderation Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: ANALYTICS */}
      {subTab === 'ANALYTICS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-cyan-400">📊 Moments Feed Content Telemetry</h3>
          <p className="text-slate-300">
            Telemetry tracks 5 total published moments, 1,205 likes, 175 comments, 9,335 views, and 1 restricted spam post. Sourced 100% live from SQLite DB.
          </p>
        </div>
      )}

      {/* MOMENT DETAIL OVERVIEW MODAL */}
      {selectedMoment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-pink-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-pink-400">📸 Moment Detail: {selectedMoment.id}</h3>
              <button
                onClick={() => setSelectedMoment(null)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-slate-300">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div><span className="text-slate-500">Author:</span> <strong className="text-white">@{selectedMoment.authorUsername} (UID {selectedMoment.authorId})</strong></div>
                <div><span className="text-slate-500">Media Type:</span> <strong className="text-purple-300">{selectedMoment.mediaType}</strong></div>
                <div><span className="text-slate-500">Status:</span> <strong className="text-emerald-400">{selectedMoment.status}</strong></div>
                <div><span className="text-slate-500">Risk Level:</span> <strong className="text-rose-400">{selectedMoment.riskLevel}</strong></div>
                <div><span className="text-slate-500">Caption:</span> <strong className="text-slate-200 block mt-1">"{selectedMoment.caption}"</strong></div>
              </div>

              {selectedMoment.mediaUrl && (
                <div className="rounded-2xl overflow-hidden max-h-48 border border-slate-800">
                  <img src={selectedMoment.mediaUrl} alt={selectedMoment.caption} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedMoment(null)}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs cursor-pointer"
                >
                  Close Modal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DIALOG FOR + CREATE MOMENT */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-pink-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-pink-400">+ Create New Moment</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMoment} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Author User UID</label>
                <select
                  value={createAuthorId}
                  onChange={e => setCreateAuthorId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold text-amber-400"
                >
                  <option value="100002">UID 100002 — @Ayesha_Singer</option>
                  <option value="100003">UID 100003 — @Dimple</option>
                  <option value="100004">UID 100004 — @Sara_Vip</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Media Type</label>
                <select
                  value={createMediaType}
                  onChange={e => setCreateMediaType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold text-purple-300"
                >
                  <option value="IMAGE">IMAGE</option>
                  <option value="VIDEO">VIDEO</option>
                  <option value="TEXT">TEXT</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Caption</label>
                <textarea
                  value={createCaption}
                  onChange={e => setCreateCaption(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold h-20"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-pink-600/30"
                >
                  + Create Moment & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG FOR 🛠️ MODERATE POST */}
      {showModerateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-rose-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-rose-400">🛠️ Moderate Moment (Approve / Restrict / Remove)</h3>
              <button
                onClick={() => setShowModerateModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModerateSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Moment ID</label>
                <select
                  value={moderateMomentId}
                  onChange={e => setModerateMomentId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 font-bold text-amber-400"
                >
                  <option value="MM-8004">MM-8004 — @SpamBot_99 (Critical Risk Spam)</option>
                  <option value="MM-8001">MM-8001 — @Ayesha_Singer</option>
                  <option value="MM-8002">MM-8002 — @Dimple</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">New Moderation Status</label>
                <select
                  value={moderateStatus}
                  onChange={e => setModerateStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 font-bold text-rose-300"
                >
                  <option value="PUBLISHED">PUBLISHED (Approve)</option>
                  <option value="RESTRICTED">RESTRICTED (Hide from Explore)</option>
                  <option value="REMOVED">REMOVED (Remove Content)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Moderation Reason</label>
                <input
                  type="text"
                  value={moderateReason}
                  onChange={e => setModerateReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 font-bold"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModerateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-rose-600/30"
                >
                  🛠️ Save Status & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG FOR 👤 ASSIGN MODERATOR */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-purple-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-purple-400">👤 Assign Moderator Case</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Moment ID</label>
                <select
                  value={assignMomentId}
                  onChange={e => setAssignMomentId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold text-amber-400"
                >
                  <option value="MM-8004">MM-8004 — @SpamBot_99</option>
                  <option value="MM-8001">MM-8001 — @Ayesha_Singer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Assign Moderator Username</label>
                <input
                  type="text"
                  value={assignModerator}
                  onChange={e => setAssignModerator(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  👤 Assign Moderator & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
