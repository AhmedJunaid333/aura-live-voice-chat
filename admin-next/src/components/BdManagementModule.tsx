'use client';

import React, { useState, useEffect } from 'react';
import { adminApi, BDRecord, UserRecord } from '@/lib/api';

export default function BdManagementModule() {
  const [bds, setBds] = useState<BDRecord[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showAssignAgencyModal, setShowAssignAgencyModal] = useState<boolean>(false);
  const [selectedBd, setSelectedBd] = useState<BDRecord | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states for Create BD
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [bdName, setBdName] = useState<string>('');
  const [bdCode, setBdCode] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [country, setCountry] = useState<string>('Pakistan');
  const [city, setCity] = useState<string>('');
  const [commissionRate, setCommissionRate] = useState<number>(15.0);
  const [status, setStatus] = useState<string>('ACTIVE');
  const [notes, setNotes] = useState<string>('');

  // Form state for Assign Agency
  const [agencyName, setAgencyName] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    const [bdsList, usersList] = await Promise.all([
      adminApi.getBds({ status: statusFilter !== 'ALL' ? statusFilter : undefined, search: searchTerm }),
      adminApi.getUsers(),
    ]);

    setBds(bdsList);
    setUsers(usersList || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleUserSelect = (uid: number) => {
    setSelectedUserId(uid);
    const found = users.find(u => u.id === uid || u.numericId === uid);
    if (found) {
      setBdName(found.username || '');
      setEmail(found.email || '');
      setPhone(found.phone || '');
      setCountry(found.country || 'Pakistan');
      setBdCode(`BD-${(found.country || 'PK').substring(0, 2).toUpperCase()}-${found.numericId}`);
    }
  };

  const handleCreateBd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !bdName || !phone || !city) {
      setFeedback({ type: 'error', text: 'Please fill in all mandatory fields.' });
      return;
    }

    setActionLoading(true);
    setFeedback(null);

    const res = await adminApi.createBd({
      userId: Number(selectedUserId),
      name: bdName,
      bdCode: bdCode.trim() || undefined,
      phone,
      email: email.trim() || undefined,
      country,
      city,
      commissionRate,
      status,
      notes,
    });

    setActionLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', text: res.message || 'BD account created successfully!' });
      setShowCreateModal(false);
      // Reset form
      setSelectedUserId('');
      setBdName('');
      setBdCode('');
      setPhone('');
      setEmail('');
      setCity('');
      setNotes('');
      loadData();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Failed to create BD account.' });
    }
  };

  const handleAssignAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBd || !agencyName.trim()) return;

    setActionLoading(true);
    setFeedback(null);

    const res = await adminApi.assignAgencyToBd(selectedBd.id, agencyName.trim());
    setActionLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', text: `Agency ${agencyName} assigned to BD ${selectedBd.bdCode} successfully!` });
      setShowAssignAgencyModal(false);
      setAgencyName('');
      loadData();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Failed to assign agency.' });
    }
  };

  const handleToggleStatus = async (bd: BDRecord) => {
    const newStatus = bd.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const res = await adminApi.updateBd(bd.id, { status: newStatus });
    if (res.success) {
      setFeedback({ type: 'success', text: `BD ${bd.bdCode} status changed to ${newStatus}.` });
      loadData();
    } else {
      setFeedback({ type: 'error', text: 'Failed to update BD status.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🏢</span> BD (Business Development) Management
          </h1>
          <p className="text-sm text-slate-400">
            Create BD accounts from real database users, assign agencies and applications, and manage commission rates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/bd"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-950/60 hover:bg-purple-900 border border-purple-700 text-purple-300 rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <span>🚀</span> Open BD Portal
          </a>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-black transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <span>+</span> Create New BD
          </button>
        </div>
      </div>

      {/* Telemetry Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
          <p className="text-xs text-slate-400 font-semibold">Total BD Managers</p>
          <p className="text-2xl font-black text-white mt-1">{bds.length}</p>
        </div>
        <div className="bg-slate-900/80 border border-emerald-500/30 p-4 rounded-2xl">
          <p className="text-xs text-emerald-400 font-semibold">Active BDs</p>
          <p className="text-2xl font-black text-emerald-300 mt-1">
            {bds.filter(b => b.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-slate-900/80 border border-indigo-500/30 p-4 rounded-2xl">
          <p className="text-xs text-indigo-400 font-semibold">Assigned Agencies</p>
          <p className="text-2xl font-black text-indigo-300 mt-1">
            {bds.reduce((sum, b) => sum + (b._count?.agencyAssignments || 0), 0)}
          </p>
        </div>
        <div className="bg-slate-900/80 border border-amber-500/30 p-4 rounded-2xl">
          <p className="text-xs text-amber-400 font-semibold">Applications Handled</p>
          <p className="text-2xl font-black text-amber-300 mt-1">
            {bds.reduce((sum, b) => sum + (b._count?.applications || 0), 0)}
          </p>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="text-white hover:opacity-75">✕</button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          {['ALL', 'ACTIVE', 'PENDING', 'SUSPENDED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search BD by code, name, city, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={loadData}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* BD Roster Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">BD Code / Name</th>
                <th className="px-4 py-3">User Account</th>
                <th className="px-4 py-3">Contact & Location</th>
                <th className="px-4 py-3">Commission Cut</th>
                <th className="px-4 py-3">Assigned Network</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Loading BD accounts...</span>
                    </div>
                  </td>
                </tr>
              ) : bds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">🏢</span>
                      <p className="font-semibold text-slate-300">No Business Development Managers Found.</p>
                      <p className="text-xs text-slate-500">Click &quot;+ Create New BD&quot; to appoint an existing user as BD.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                bds.map((bd) => (
                  <tr key={bd.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3">
                      <p className="font-mono font-bold text-indigo-300 text-xs">{bd.bdCode}</p>
                      <p className="font-bold text-white text-xs mt-0.5">{bd.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-xs">
                          {bd.user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs">@{bd.user?.username}</p>
                          <p className="text-[10px] text-slate-400">UID: {bd.user?.numericId || bd.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-300 text-xs">📞 {bd.phone}</p>
                      <p className="text-[10px] text-slate-500">📍 {bd.city}, {bd.country}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {bd.commissionRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-300 font-semibold text-xs">
                        🏢 {bd._count?.agencyAssignments || 0} Agencies
                      </p>
                      <p className="text-[10px] text-slate-500">
                        📋 {bd._count?.applications || 0} Applications
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {bd.status === 'ACTIVE' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          ✕ {bd.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedBd(bd);
                            setShowAssignAgencyModal(true);
                          }}
                          className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold transition border border-indigo-500/30"
                        >
                          + Assign Agency
                        </button>
                        <button
                          onClick={() => handleToggleStatus(bd)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition border ${
                            bd.status === 'ACTIVE'
                              ? 'bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border-rose-500/30'
                              : 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border-emerald-500/30'
                          }`}
                        >
                          {bd.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create BD Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🏢</span> Appoint New Business Development (BD) Manager
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBd} className="space-y-3 text-xs">
              {/* Select Real Database User */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Existing User *</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => handleUserSelect(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">-- Choose User from Database --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      @{u.username} (UID: {u.numericId}) — {u.email || u.country || 'User'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">BD Manager Name *</label>
                  <input
                    type="text"
                    value={bdName}
                    onChange={(e) => setBdName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">BD Code (Unique)</label>
                  <input
                    type="text"
                    value={bdCode}
                    onChange={(e) => setBdCode(e.target.value)}
                    placeholder="e.g. BD-PK-1001"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+923001234567"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="bd@auralive.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lahore"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Commission %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="ACTIVE">ACTIVE (Can log in to BD Portal)</option>
                  <option value="PENDING">PENDING</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes about BD agreement or territories..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black disabled:opacity-50 transition shadow-lg shadow-indigo-600/30"
                >
                  {actionLoading ? 'Creating BD...' : 'Appoint & Activate BD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Agency Modal */}
      {showAssignAgencyModal && selectedBd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🏢</span> Assign Agency to BD ({selectedBd.bdCode})
            </h3>
            <p className="text-xs text-slate-400">
              Assign a talent agency to BD manager <strong className="text-indigo-300">{selectedBd.name}</strong>. The BD will be able to monitor the agency and its hosts in the BD Portal.
            </p>
            <form onSubmit={handleAssignAgency} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Agency Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Aura Talent Agency, Star Media..."
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignAgencyModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !agencyName.trim()}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition"
                >
                  {actionLoading ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
