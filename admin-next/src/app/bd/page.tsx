'use client';

import React, { useState, useEffect } from 'react';
import { adminApi, ApplicationRecord, BDAgencyAssignmentRecord, BDCommissionRecord } from '@/lib/api';

type BdTabKey = 'dashboard' | 'agencies' | 'hosts' | 'applications' | 'performance' | 'commission' | 'profile';

export default function BdPortalPage() {
  const [authToken, setAuthToken] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginIdentifier, setLoginIdentifier] = useState<string>('100001'); // default quick demo UID
  const [loginPassword, setLoginPassword] = useState<string>('123456');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // BD State
  const [activeTab, setActiveTab] = useState<BdTabKey>('dashboard');
  const [bdProfile, setBdProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [agencies, setAgencies] = useState<BDAgencyAssignmentRecord[]>([]);
  const [hosts, setHosts] = useState<any[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [commissionData, setCommissionData] = useState<any>({ commissionRate: 15, commissions: [] });
  const [loading, setLoading] = useState<boolean>(false);

  // Review Modal State
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [reviewRecommendation, setReviewRecommendation] = useState<string>('RECOMMEND_APPROVE');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Attempt authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setAuthError(null);

    try {
      // Authenticate against standard auth endpoint or verify BD
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier.trim(), password: loginPassword }),
      });
      const data = await res.json();

      if (data.success && data.data?.accessToken) {
        const token = data.data.accessToken;
        setAuthToken(token);
        localStorage.setItem('bd_auth_token', token);
        await loadBdData(token);
      } else {
        // Fallback: Check if user exists directly or verify BD profile
        setAuthError(data.error || 'Invalid credentials or BD access not enabled.');
      }
    } catch {
      // If running inside same origin, attempt direct load
      const checkRes = await adminApi.getBdDashboard();
      if (checkRes.success && checkRes.data) {
        setBdProfile(checkRes.data.bdProfile);
        setStats(checkRes.data.stats);
        setIsAuthenticated(true);
      } else {
        setAuthError('Unable to connect to BD authentication server.');
      }
    }
    setLoginLoading(false);
  };

  const loadBdData = async (token?: string) => {
    setLoading(true);
    const activeTok = token || authToken || localStorage.getItem('bd_auth_token') || undefined;

    const dashRes = await adminApi.getBdDashboard(activeTok);
    if (dashRes.success && dashRes.data) {
      setBdProfile(dashRes.data.bdProfile);
      setStats(dashRes.data.stats || {});
      setIsAuthenticated(true);

      // Load sub-modules
      const [agenciesList, hostsList, appsList, commList] = await Promise.all([
        adminApi.getBdAgencies(activeTok),
        adminApi.getBdHosts(activeTok),
        adminApi.getBdApplications(undefined, activeTok),
        adminApi.getBdCommission(activeTok),
      ]);

      setAgencies(agenciesList);
      setHosts(hostsList);
      setApplications(appsList);
      setCommissionData(commList);
    } else {
      setIsAuthenticated(false);
      setAuthError(dashRes.error || 'BD access is not enabled for this account.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('bd_auth_token');
    if (savedToken) {
      setAuthToken(savedToken);
      loadBdData(savedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bd_auth_token');
    setAuthToken('');
    setIsAuthenticated(false);
    setBdProfile(null);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !reviewNotes.trim()) return;

    setReviewLoading(true);
    setFeedbackMsg(null);

    const res = await adminApi.submitBdReview(
      selectedApp.id,
      reviewRecommendation,
      reviewNotes.trim(),
      authToken || undefined,
    );

    setReviewLoading(false);

    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: 'Review & Recommendation submitted to Admin successfully!',
      });
      setSelectedApp(null);
      setReviewNotes('');
      loadBdData();
    } else {
      setFeedbackMsg({
        type: 'error',
        text: res.error || 'Failed to submit review.',
      });
    }
  };

  // Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090E] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-indigo-600/30">
              🏢
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Aura Live BD Portal</h1>
            <p className="text-xs text-slate-400">
              Dedicated operational portal for authorized Business Development Managers
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">User ID / Username / Phone</label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. 100001 or username"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-black transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating BD Access...' : 'Login to BD Portal'}
            </button>
          </form>

          <p className="text-[11px] text-slate-500 text-center">
            BD accounts are created and authorized strictly by Aura Live Administration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-600/30">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">BD Portal</h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                {bdProfile?.bdCode}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Manager: <strong className="text-slate-200">{bdProfile?.name}</strong> • {bdProfile?.city}, {bdProfile?.country}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
            <span className="text-slate-400">Commission Rate:</span>
            <span className="text-amber-400 font-bold">{bdProfile?.commissionRate || 15}%</span>
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition border border-slate-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-900/40 border-b border-slate-800 px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {[
          { key: 'dashboard', label: '📊 Dashboard' },
          { key: 'agencies', label: `🏢 Agencies (${agencies.length})` },
          { key: 'hosts', label: `🎙️ Hosts (${hosts.length})` },
          { key: 'applications', label: `📋 Applications (${applications.length})` },
          { key: 'performance', label: '📈 Performance' },
          { key: 'commission', label: '💰 Commission' },
          { key: 'profile', label: '👤 BD Profile' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as BdTabKey)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === t.key
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Content Body */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Feedback Message */}
        {feedbackMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            <span>{feedbackMsg.text}</span>
            <button onClick={() => setFeedbackMsg(null)} className="text-white hover:opacity-75">✕</button>
          </div>
        )}

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 border border-indigo-500/30 p-4 rounded-2xl">
                <p className="text-xs text-indigo-400 font-semibold">🏢 Assigned Agencies</p>
                <p className="text-2xl font-black text-white mt-1">{stats.totalAgencies || agencies.length}</p>
              </div>
              <div className="bg-slate-900/80 border border-pink-500/30 p-4 rounded-2xl">
                <p className="text-xs text-pink-400 font-semibold">🎙️ Total Network Hosts</p>
                <p className="text-2xl font-black text-white mt-1">{stats.totalHosts || hosts.length}</p>
              </div>
              <div className="bg-slate-900/80 border border-amber-500/30 p-4 rounded-2xl">
                <p className="text-xs text-amber-400 font-semibold">📋 Assigned Applications</p>
                <p className="text-2xl font-black text-white mt-1">{stats.assignedApplications || applications.length}</p>
              </div>
              <div className="bg-slate-900/80 border border-emerald-500/30 p-4 rounded-2xl">
                <p className="text-xs text-emerald-400 font-semibold">💰 Commission Cut</p>
                <p className="text-2xl font-black text-emerald-300 mt-1">{stats.commissionRate || 15}%</p>
              </div>
            </div>

            {/* Quick Applications to Review */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📋</span> Applications Pending Your BD Review
                </h3>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  View All Applications →
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No applications currently assigned to your BD account.
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {applications.slice(0, 4).map((app) => (
                    <div key={app.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-xs">{app.applicationId}</span>
                          <span className="text-slate-400 text-xs font-semibold">{app.fullName}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                            {app.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Submitted: {new Date(app.submittedAt).toLocaleDateString()} • {app.city}, {app.country}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition border border-indigo-500/30"
                      >
                        Review & Recommend
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ASSIGNED AGENCIES */}
        {activeTab === 'agencies' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">🏢 My Assigned Agencies</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Agency Name</th>
                    <th className="px-4 py-3">Assigned Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {agencies.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-500">
                        No agencies assigned yet. Administration will assign agencies to your BD account.
                      </td>
                    </tr>
                  ) : (
                    agencies.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-bold text-white">{a.agencyName}</td>
                        <td className="px-4 py-3 text-slate-400">{new Date(a.assignedAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNED HOSTS */}
        {activeTab === 'hosts' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">🎙️ Broadcasters & Hosts in Assigned Network</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Host / User</th>
                    <th className="px-4 py-3">User ID</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {hosts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No active hosts found in assigned agencies.
                      </td>
                    </tr>
                  ) : (
                    hosts.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-800/40">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-pink-600/30 flex items-center justify-center font-bold text-pink-300">
                              {h.username?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-white">@{h.username}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-400">{h.numericId || h.id}</td>
                        <td className="px-4 py-3 text-slate-400">{h.country || 'Pakistan'}</td>
                        <td className="px-4 py-3 font-bold text-pink-400">{h.role}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            {h.status || 'ACTIVE'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white">📋 Applications Assigned for BD Review</h3>
            <p className="text-xs text-slate-400">
              Review applicant details, conduct initial verification, and submit your recommendation to Administration.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">App ID</th>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">BD Recommendation</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No applications currently assigned.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-mono font-bold text-indigo-300">{app.applicationId}</td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-white">{app.fullName}</p>
                          <p className="text-[10px] text-slate-500">@{app.username} • UID: {app.user?.numericId || app.userId}</p>
                        </td>
                        <td className="px-4 py-3 font-bold text-purple-400">{app.type}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {app.bdRecommendation ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                              {app.bdRecommendation.replace('_', ' ')}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Pending Review</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition border border-indigo-500/30"
                          >
                            Review & Recommend
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PERFORMANCE */}
        {activeTab === 'performance' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">📈 BD Network Performance Telemetry</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400">Assigned Agencies:</span>
                <p className="text-xl font-bold text-white mt-1">{agencies.length}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400">Total Network Hosts:</span>
                <p className="text-xl font-bold text-white mt-1">{hosts.length}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400">Applications Handled:</span>
                <p className="text-xl font-bold text-white mt-1">{applications.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: COMMISSION */}
        {activeTab === 'commission' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">💰 BD Commission & Earnings Ledger</h3>
                <p className="text-xs text-slate-400">
                  Calculated automatically based on your configured commission rate ({commissionData.commissionRate || 15}%).
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Configured Commission Rate</p>
                  <p className="text-2xl font-black text-amber-400 mt-1">{commissionData.commissionRate || 15}%</p>
                  <p className="text-[11px] text-slate-500 mt-1">Configured strictly by Admin.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: BD PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-white">👤 BD Manager Profile</h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500">BD Code:</span>
                  <p className="font-mono font-bold text-indigo-300 mt-0.5">{bdProfile?.bdCode}</p>
                </div>
                <div>
                  <span className="text-slate-500">BD Name:</span>
                  <p className="font-bold text-white mt-0.5">{bdProfile?.name}</p>
                </div>
                <div>
                  <span className="text-slate-500">User ID (UID):</span>
                  <p className="font-mono text-white mt-0.5">{bdProfile?.user?.numericId || bdProfile?.userId}</p>
                </div>
                <div>
                  <span className="text-slate-500">Username:</span>
                  <p className="text-purple-300 font-semibold mt-0.5">@{bdProfile?.user?.username}</p>
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span>
                  <p className="text-white mt-0.5">{bdProfile?.phone}</p>
                </div>
                <div>
                  <span className="text-slate-500">Location:</span>
                  <p className="text-white mt-0.5">{bdProfile?.city}, {bdProfile?.country}</p>
                </div>
                <div>
                  <span className="text-slate-500">Commission Rate:</span>
                  <p className="text-amber-400 font-bold mt-0.5">{bdProfile?.commissionRate}%</p>
                </div>
                <div>
                  <span className="text-slate-500">Account Status:</span>
                  <p className="text-emerald-400 font-bold mt-0.5">{bdProfile?.status}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-white">
                  BD Review: {selectedApp.applicationId}
                </h3>
                <p className="text-xs text-slate-400">
                  Applicant: <strong className="text-slate-200">{selectedApp.fullName}</strong> (@{selectedApp.username})
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Applicant Details */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500">Application Type:</span>
                    <p className="font-bold text-purple-400">{selectedApp.type}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Phone:</span>
                    <p className="text-white">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">City / Country:</span>
                    <p className="text-white">{selectedApp.city}, {selectedApp.country}</p>
                  </div>
                  {selectedApp.agencyName && (
                    <div>
                      <span className="text-slate-500">Agency Name:</span>
                      <p className="font-bold text-white">{selectedApp.agencyName}</p>
                    </div>
                  )}
                  {selectedApp.category && (
                    <div>
                      <span className="text-slate-500">Hosting Category:</span>
                      <p className="font-bold text-white">{selectedApp.category}</p>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-slate-500">Statement of Purpose:</span>
                  <p className="text-slate-200 mt-0.5 whitespace-pre-wrap">{selectedApp.whyJoin}</p>
                </div>
              </div>

              {/* Recommendation Form */}
              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Your BD Recommendation *</label>
                  <select
                    value={reviewRecommendation}
                    onChange={(e) => setReviewRecommendation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="RECOMMEND_APPROVE">✓ Recommend Approval</option>
                    <option value="RECOMMEND_REJECT">✕ Recommend Rejection</option>
                    <option value="REQUEST_INFO">⚠️ Request More Information</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">BD Review Notes & Feedback *</label>
                  <textarea
                    rows={3}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Enter your verification findings, interview feedback, or notes for Administration..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                    required
                  />
                </div>

                <div className="bg-indigo-950/30 border border-indigo-800/30 p-3 rounded-xl text-[11px] text-indigo-300">
                  ℹ️ <strong>Note:</strong> Your recommendation will be sent to Administration. Admin retains final approval authority.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewLoading || !reviewNotes.trim()}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition shadow-lg shadow-indigo-600/30"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Recommendation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
