'use client';

import React, { useState, useEffect } from 'react';
import { adminApi, ApplicationRecord, BDRecord } from '@/lib/api';

export default function ApplicationsModule() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [bds, setBds] = useState<BDRecord[]>([]);
  const [selectedBdToAssign, setSelectedBdToAssign] = useState<string>('');
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    let typeParam = undefined;
    let statusParam = undefined;

    if (activeTab === 'AGENCY' || activeTab === 'HOSTING') {
      typeParam = activeTab;
    } else if (activeTab !== 'ALL') {
      statusParam = activeTab;
    }

    const [data, bdsList] = await Promise.all([
      adminApi.getApplications({
        type: typeParam,
        status: statusParam,
        search: searchTerm,
        limit: 50,
      }),
      adminApi.getBds(),
    ]);

    if (data.applications) {
      setApplications(data.applications);
      setStats(data.stats || {});
    }
    setBds(bdsList || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, [activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleUpdateStatus = async (status: string, reason?: string) => {
    if (!selectedApp) return;
    setActionLoading(true);
    setFeedbackMsg(null);

    const res = await adminApi.updateApplicationStatus(selectedApp.id, {
      status,
      adminNotes: adminNotes.trim() || undefined,
      rejectionReason: reason || undefined,
    });

    setActionLoading(false);

    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: `Application ${selectedApp.applicationId} ${status.toLowerCase()} successfully! User role updated.`,
      });
      setShowRejectModal(false);
      setRejectionReason('');
      setAdminNotes('');
      // Refresh current detail and list
      const updated = await adminApi.getApplicationDetail(selectedApp.id);
      setSelectedApp(updated);
      fetchApplications();
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.error || 'Failed to update application status.',
      });
    }
  };

  const handleAssignBd = async (bdId: string) => {
    if (!selectedApp) return;
    setActionLoading(true);
    const res = await adminApi.assignApplicationToBd(selectedApp.id, bdId || null);
    setActionLoading(false);
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: res.message || 'Application assigned to BD successfully.' });
      const updated = await adminApi.getApplicationDetail(selectedApp.id);
      setSelectedApp(updated);
      fetchApplications();
    } else {
      setFeedbackMsg({ type: 'error', text: res.error || 'Failed to assign application to BD.' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✓ APPROVED</span>;
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">⏳ PENDING</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">🔍 UNDER REVIEW</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">✕ REJECTED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>📋</span> Applications Center
          </h1>
          <p className="text-sm text-slate-400">
            Review, verify, and approve Agency and Host applications with automated role promotion.
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 self-start md:self-auto border border-slate-700"
        >
          <span>🔄</span> Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
          <p className="text-xs text-slate-400 font-semibold">Total Apps</p>
          <p className="text-xl font-black text-white">{stats.totalAll ?? applications.length}</p>
        </div>
        <div className="bg-slate-900/80 border border-indigo-500/30 p-3 rounded-xl">
          <p className="text-xs text-indigo-400 font-semibold">🏢 Agency Apps</p>
          <p className="text-xl font-black text-indigo-300">{stats.agencyCount ?? 0}</p>
        </div>
        <div className="bg-slate-900/80 border border-pink-500/30 p-3 rounded-xl">
          <p className="text-xs text-pink-400 font-semibold">🎙️ Hosting Apps</p>
          <p className="text-xl font-black text-pink-300">{stats.hostingCount ?? 0}</p>
        </div>
        <div className="bg-slate-900/80 border border-amber-500/30 p-3 rounded-xl">
          <p className="text-xs text-amber-400 font-semibold">⏳ Pending</p>
          <p className="text-xl font-black text-amber-300">{stats.pendingCount ?? 0}</p>
        </div>
        <div className="bg-slate-900/80 border border-cyan-500/30 p-3 rounded-xl">
          <p className="text-xs text-cyan-400 font-semibold">🔍 Under Review</p>
          <p className="text-xl font-black text-cyan-300">{stats.underReviewCount ?? 0}</p>
        </div>
        <div className="bg-slate-900/80 border border-emerald-500/30 p-3 rounded-xl">
          <p className="text-xs text-emerald-400 font-semibold">✓ Approved</p>
          <p className="text-xl font-black text-emerald-300">{stats.approvedCount ?? 0}</p>
        </div>
        <div className="bg-slate-900/80 border border-rose-500/30 p-3 rounded-xl">
          <p className="text-xs text-rose-400 font-semibold">✕ Rejected</p>
          <p className="text-xl font-black text-rose-300">{stats.rejectedCount ?? 0}</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { key: 'ALL', label: 'All' },
            { key: 'AGENCY', label: '🏢 Agency' },
            { key: 'HOSTING', label: '🎙️ Hosting' },
            { key: 'PENDING', label: '⏳ Pending' },
            { key: 'UNDER_REVIEW', label: '🔍 Under Review' },
            { key: 'APPROVED', label: '✓ Approved' },
            { key: 'REJECTED', label: '✕ Rejected' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 min-w-[240px]">
          <input
            type="text"
            placeholder="Search by ID, name, username, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-white hover:opacity-75">✕</button>
        </div>
      )}

      {/* Main Applications Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">App ID / Date</th>
                <th className="px-4 py-3">Applicant / User</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Loading applications...</span>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">📋</span>
                      <p className="font-semibold text-slate-300">No applications found.</p>
                      <p className="text-xs text-slate-500">Applications submitted from the mobile app will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3">
                      <p className="font-mono font-bold text-white text-xs">{app.applicationId}</p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(app.submittedAt).toLocaleDateString()} {new Date(app.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300 text-xs">
                          {app.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{app.fullName}</p>
                          <p className="text-[10px] text-slate-400">@{app.username} • ID: {app.user?.numericId || app.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {app.type === 'AGENCY' ? (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          🏢 AGENCY
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          🎙️ HOSTING
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {app.type === 'AGENCY' ? (
                        <div>
                          <p className="font-semibold text-slate-200 text-xs">{app.agencyName || 'Agency'}</p>
                          <p className="text-[10px] text-slate-400">Expected Hosts: {app.expectedHosts || 'N/A'}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-slate-200 text-xs">{app.category || 'General Hosting'}</p>
                          <p className="text-[10px] text-slate-400">{app.dailyHours ? `${app.dailyHours} hrs/day` : 'Flexible'}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-xl text-xs font-bold transition border border-purple-500/30"
                      >
                        Review & Actions
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail & Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 rounded-t-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white">Application Review</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800">
                    {selectedApp.applicationId}
                  </span>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Submitted on {new Date(selectedApp.submittedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Applicant Profile Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300 text-base">
                    {selectedApp.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{selectedApp.fullName}</h3>
                    <p className="text-slate-400">@{selectedApp.username} • User ID: {selectedApp.user?.numericId || selectedApp.userId}</p>
                    <p className="text-slate-500 text-[11px]">Current Role: <span className="font-bold text-purple-300">{selectedApp.user?.role || 'USER'}</span></p>
                  </div>
                </div>
                <div className="text-right text-slate-400">
                  <p>📍 {selectedApp.city}, {selectedApp.country}</p>
                  <p>📞 {selectedApp.phone}</p>
                  {selectedApp.email && <p>✉️ {selectedApp.email}</p>}
                </div>
              </div>

              {/* Specifics (Agency / Hosting) */}
              {selectedApp.type === 'AGENCY' ? (
                <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-indigo-900/30">
                  <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider">🏢 Agency Specifics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Agency Name:</span>
                      <p className="font-semibold text-white mt-0.5">{selectedApp.agencyName}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Expected Hosts:</span>
                      <p className="font-semibold text-white mt-0.5">{selectedApp.expectedHosts || 'Not specified'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">Agency Description:</span>
                      <p className="text-slate-200 mt-0.5 whitespace-pre-wrap">{selectedApp.agencyDescription}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-pink-900/30">
                  <h4 className="font-bold text-pink-300 text-xs uppercase tracking-wider">🎙️ Hosting Specifics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500">Hosting Category:</span>
                      <p className="font-semibold text-white mt-0.5">{selectedApp.category || 'General'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Daily Hours:</span>
                      <p className="font-semibold text-white mt-0.5">{selectedApp.dailyHours ? `${selectedApp.dailyHours} hours/day` : 'Not specified'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">Expected Schedule:</span>
                      <p className="text-slate-200 mt-0.5">{selectedApp.schedule || 'Flexible'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Shared Responses */}
              <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">📝 Qualifications & Statement</h4>
                {selectedApp.experience && (
                  <div>
                    <span className="text-slate-500">Previous Experience:</span>
                    <p className="text-slate-200 mt-0.5">{selectedApp.experience}</p>
                  </div>
                )}
                <div>
                  <span className="text-slate-500">Why do you want to join Aura Live:</span>
                  <p className="text-slate-200 mt-0.5 whitespace-pre-wrap">{selectedApp.whyJoin}</p>
                </div>
                {selectedApp.socialLinks && (
                  <div>
                    <span className="text-slate-500">Social Links / Website:</span>
                    <p className="text-purple-400 mt-0.5">{selectedApp.socialLinks}</p>
                  </div>
                )}
                {selectedApp.additionalInfo && (
                  <div>
                    <span className="text-slate-500">Additional Information:</span>
                    <p className="text-slate-300 mt-0.5">{selectedApp.additionalInfo}</p>
                  </div>
                )}
              </div>

              {/* BD Assignment & Review Section */}
              <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏢</span> Business Development (BD) Assignment & Review
                  </h4>
                  {selectedApp.assignedBd && (
                    <span className="px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Assigned: {selectedApp.assignedBd.bdCode} ({selectedApp.assignedBd.name})
                    </span>
                  )}
                </div>

                {/* BD Recommendation if reviewed */}
                {selectedApp.bdRecommendation && (
                  <div className="bg-indigo-950/40 border border-indigo-800/40 p-3 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-400 font-bold">BD Recommendation:</span>
                      {selectedApp.bdRecommendation === 'RECOMMEND_APPROVE' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ RECOMMEND APPROVAL
                        </span>
                      )}
                      {selectedApp.bdRecommendation === 'RECOMMEND_REJECT' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          ✕ RECOMMEND REJECTION
                        </span>
                      )}
                      {selectedApp.bdRecommendation === 'REQUEST_INFO' && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ⚠️ REQUEST MORE INFO
                        </span>
                      )}
                    </div>
                    {selectedApp.bdReviewNotes && (
                      <p className="text-slate-200 text-xs mt-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        &quot;{selectedApp.bdReviewNotes}&quot;
                      </p>
                    )}
                    {selectedApp.bdReviewedAt && (
                      <p className="text-[10px] text-slate-500">
                        Reviewed by BD on {new Date(selectedApp.bdReviewedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Assign / Reassign to BD Dropdown */}
                <div className="flex items-center gap-2 pt-1">
                  <select
                    value={selectedBdToAssign}
                    onChange={(e) => setSelectedBdToAssign(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Assign Application to BD Manager --</option>
                    {bds.filter(b => b.status === 'ACTIVE').map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bdCode} — {b.name} ({b.city})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!selectedBdToAssign || actionLoading}
                    onClick={() => handleAssignBd(selectedBdToAssign)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                  >
                    Assign BD
                  </button>
                  {selectedApp.assignedBdId && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleAssignBd('')}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition"
                    >
                      Unassign
                    </button>
                  )}
                </div>
              </div>

              {/* Admin Notes / Rejection Reason if any */}
              {selectedApp.adminNotes && (
                <div className="bg-cyan-950/30 border border-cyan-800/40 p-3 rounded-xl">
                  <span className="text-cyan-400 font-bold">Admin Notes:</span>
                  <p className="text-slate-200 mt-0.5">{selectedApp.adminNotes}</p>
                </div>
              )}

              {selectedApp.rejectionReason && (
                <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl">
                  <span className="text-rose-400 font-bold">Rejection Reason:</span>
                  <p className="text-slate-200 mt-0.5">{selectedApp.rejectionReason}</p>
                </div>
              )}

              {/* Admin Notes Input */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Add / Update Admin Notes (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Verified social profile, approved for Tier 1 hosting..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Modal Footer / Action Buttons */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 rounded-b-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus('UNDER_REVIEW')}
                  className="px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white rounded-xl text-xs font-bold transition border border-cyan-500/30 disabled:opacity-50"
                >
                  🔍 Mark Under Review
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={actionLoading}
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition border border-rose-500/30 disabled:opacity-50"
                >
                  ✕ Reject Application
                </button>
                <button
                  disabled={actionLoading || selectedApp.status === 'APPROVED'}
                  onClick={() => handleUpdateStatus('APPROVED')}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black transition shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                >
                  {selectedApp.status === 'APPROVED' ? '✓ Already Approved' : `✓ Approve & Promote to ${selectedApp.type === 'AGENCY' ? 'AGENCY_OWNER' : 'HOST'}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal with Mandatory Reason */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-800/60 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-rose-500">⚠️</span> Reject Application {selectedApp.applicationId}
            </h3>
            <p className="text-xs text-slate-400">
              Please state the specific reason for rejecting this application. This reason will be visible to the applicant.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Incomplete experience details, minimum age requirement not met..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading || !rejectionReason.trim()}
                onClick={() => handleUpdateStatus('REJECTED', rejectionReason)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
