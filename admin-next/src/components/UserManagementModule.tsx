'use client';

import React, { useState, useEffect } from 'react';
import { adminApi, UserRecord, defaultRealUsers } from '@/lib/api';

export default function UserManagementModule() {
  const [users, setUsers] = useState<UserRecord[]>(defaultRealUsers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Modals state
  const [viewUser, setViewUser] = useState<UserRecord | null>(null);
  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [logUser, setLogUser] = useState<UserRecord | null>(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState<UserRecord | null>(null);
  const [creditUser, setCreditUser] = useState<UserRecord | null>(null);

  // Form states for Edit Credentials
  const [editForm, setEditForm] = useState({
    username: '',
    password: '',
    bio: '',
    gender: 'MALE',
    country: 'Pakistan',
    role: 'USER',
    level: 1,
    vipTier: 0,
  });

  // Form state for Credit
  const [creditAmount, setCreditAmount] = useState('50000');
  const [creditType, setCreditType] = useState<'coins' | 'diamonds'>('coins');

  const loadUsers = async () => {
    const list = await adminApi.getUsers({ query: search, status: statusFilter });
    setUsers(list);
    const logs = await adminApi.getAuditLogs();
    setAuditLogs(logs);
  };

  useEffect(() => {
    loadUsers();
    const interval = setInterval(loadUsers, 5000);
    return () => clearInterval(interval);
  }, [search, statusFilter]);

  const openEditModal = (u: UserRecord) => {
    setEditUser(u);
    setEditForm({
      username: u.username || '',
      password: '',
      bio: u.bio || '',
      gender: u.gender || 'MALE',
      country: u.country || 'Pakistan',
      role: u.role || 'USER',
      level: u.level || 1,
      vipTier: u.vipTier || 0,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    await adminApi.updateUser(editUser.id, editForm);
    setEditUser(null);
    alert(`Successfully updated profile & credentials for @${editForm.username}!`);
    loadUsers();
  };

  const handleDeleteSubmit = async () => {
    if (!deleteUserTarget) return;
    await adminApi.deleteUser(deleteUserTarget.id);
    setDeleteUserTarget(null);
    alert(`Account @${deleteUserTarget.username} deleted successfully!`);
    loadUsers();
  };

  const handleToggleFreeze = async (u: UserRecord) => {
    await adminApi.freezeWallet(u.id, !u.walletFrozen);
    loadUsers();
  };

  const handleToggleStatus = async (u: UserRecord) => {
    const newStatus = u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    await adminApi.updateUserStatus(u.id, newStatus, 'Admin console action');
    loadUsers();
  };

  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditUser) return;
    const amount = parseInt(creditAmount, 10) || 0;
    await adminApi.creditWallet(creditUser.id, amount, creditType);
    setCreditUser(null);
    alert(`Successfully credited ${amount.toLocaleString()} ${creditType} to @${creditUser.username}!`);
    loadUsers();
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            👥 Real App Users Directory & Credentials Manager
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs border border-purple-500/30">
              {users.length} Users Listed
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage View, Edit Credentials, Audit Logs, Ban, Freeze & Delete Actions</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="🔍 Search Username / UID / Email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#1F2937] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 w-full md:w-64"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#1F2937] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Users</option>
            <option value="BANNED">Banned Users</option>
          </select>
        </div>
      </div>

      {/* User Directory Grid */}
      {users.length === 0 ? (
        <div className="p-12 text-center bg-[#111827] border border-[#1F2937] rounded-2xl text-slate-400 text-xs">
          No registered users found in SQLite Database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map(u => (
            <div key={u.id} className="bg-[#111827] border border-[#1F2937] hover:border-purple-500/50 p-5 rounded-2xl space-y-4 shadow-xl transition-all">
              {/* Profile Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}&background=7C3AED&color=fff`}
                    alt={u.username}
                    className="w-12 h-12 rounded-2xl object-cover border border-purple-500/40 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{u.username}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                        UID: {u.numericId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      {u.email || u.phone || 'Registered User'} • {u.country || 'Pakistan'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {u.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
                    {u.role}
                  </span>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-4 gap-2 bg-[#1F2937]/50 p-3 rounded-xl text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">Level</span>
                  <strong className="text-purple-300 font-extrabold">Lv.{u.level}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">VIP Tier</span>
                  <strong className="text-amber-400 font-extrabold">VIP {u.vipTier}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Coins</span>
                  <strong className="text-amber-400 font-extrabold">🪙 {u.coins.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Diamonds</span>
                  <strong className="text-pink-400 font-extrabold">💎 {u.diamonds.toLocaleString()}</strong>
                </div>
              </div>

              {/* Actions Control Bar (View, Edit Credentials, Logs, Delete, Credit, Freeze, Ban) */}
              <div className="space-y-2 pt-1">
                {/* Row 1 Actions */}
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => setViewUser(u)}
                    className="py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-600 hover:text-white text-[11px] font-bold border border-blue-500/30 transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => openEditModal(u)}
                    className="py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-600 hover:text-slate-950 text-[11px] font-bold border border-amber-500/30 transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setLogUser(u)}
                    className="py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-600 hover:text-white text-[11px] font-bold border border-purple-500/30 transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    📜 Logs
                  </button>
                  <button
                    onClick={() => setDeleteUserTarget(u)}
                    className="py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white text-[11px] font-bold border border-rose-500/30 transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    🗑️ Delete
                  </button>
                </div>

                {/* Row 2 Wallet & Moderation Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCreditUser(u)}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 transition cursor-pointer"
                  >
                    🪙 Credit Balance
                  </button>
                  <button
                    onClick={() => handleToggleFreeze(u)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition cursor-pointer ${
                      u.walletFrozen ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {u.walletFrozen ? '🔓 Unfreeze' : '🔒 Freeze'}
                  </button>
                  <button
                    onClick={() => handleToggleStatus(u)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition cursor-pointer ${
                      u.status === 'ACTIVE' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {u.status === 'ACTIVE' ? '🚫 Ban' : '✅ Unban'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1. VIEW PROFILE DETAILS MODAL */}
      {viewUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-blue-500/40 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                👁️ Full User Profile Dossier (UID: {viewUser.numericId})
              </h3>
              <button onClick={() => setViewUser(null)} className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer">
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <img
                src={viewUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewUser.username)}&background=7C3AED&color=fff`}
                alt={viewUser.username}
                className="w-16 h-16 rounded-2xl object-cover border border-purple-500/40"
              />
              <div>
                <h4 className="text-lg font-black text-white">{viewUser.username}</h4>
                <p className="text-xs text-slate-400 italic">{viewUser.bio || 'Aura Live Registered User ✨'}</p>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                    UID #{viewUser.numericId}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                    Role: {viewUser.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">User ID</span>
                <strong className="text-white">#{viewUser.id} (UID: {viewUser.numericId})</strong>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Country</span>
                <strong className="text-white">{viewUser.country || 'Pakistan'}</strong>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Coins Balance</span>
                <strong className="text-amber-400">🪙 {viewUser.coins.toLocaleString()}</strong>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">Diamonds Balance</span>
                <strong className="text-pink-400">💎 {viewUser.diamonds.toLocaleString()}</strong>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">User Level</span>
                <strong className="text-purple-300">Level {viewUser.level}</strong>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">VIP Tier</span>
                <strong className="text-amber-300">VIP {viewUser.vipTier}</strong>
              </div>
            </div>

            <button
              onClick={() => setViewUser(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Close Profile View
            </button>
          </div>
        </div>
      )}

      {/* 2. EDIT PROFILE & CREDENTIALS MODAL */}
      {editUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-amber-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">✏️ Edit Profile & Credentials</h3>
                <p className="text-xs text-slate-400">Target: @{editUser.username} (UID: {editUser.numericId})</p>
              </div>
              <button onClick={() => setEditUser(null)} className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Username / Display Name</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Reset Password / Credentials</label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Leave empty to keep current password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Bio / Status</label>
                <textarea
                  rows={2}
                  value={editForm.bio}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">System Role</label>
                  <select
                    value={editForm.role}
                    onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="USER">USER</option>
                    <option value="HOST">HOST</option>
                    <option value="DIAMOND_RESELLER">DIAMOND_RESELLER</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Country</label>
                  <input
                    type="text"
                    value={editForm.country}
                    onChange={e => setEditForm({ ...editForm, country: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">User Level</label>
                  <input
                    type="number"
                    value={editForm.level}
                    onChange={e => setEditForm({ ...editForm, level: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">VIP Tier Level</label>
                  <input
                    type="number"
                    value={editForm.vipTier}
                    onChange={e => setEditForm({ ...editForm, vipTier: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition cursor-pointer shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. USER AUDIT LOGS MODAL */}
      {logUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-purple-500/40 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">📜 Activity & Audit Logs</h3>
                <p className="text-xs text-slate-400">Target User: @{logUser.username} (UID: {logUser.numericId})</p>
              </div>
              <button onClick={() => setLogUser(null)} className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {auditLogs.filter(l => l.resource?.includes(logUser.numericId.toString())).length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  No specific audit logs recorded for @{logUser.username} yet.
                </div>
              ) : (
                auditLogs.filter(l => l.resource?.includes(logUser.numericId.toString())).map(log => (
                  <div key={log.id} className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-2">
                    <div>
                      <span className="text-cyan-400 font-bold">[{new Date(log.createdAt).toLocaleTimeString()}]</span>{' '}
                      <span className="text-amber-400 font-bold">{log.action}</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">{log.details}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setLogUser(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Close Activity Logs
            </button>
          </div>
        </div>
      )}

      {/* 4. DELETE CONFIRMATION MODAL */}
      {deleteUserTarget && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-rose-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-rose-400">🗑️ Confirm User Account Deletion</h3>
              <button onClick={() => setDeleteUserTarget(null)} className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete account <strong className="text-white">@{deleteUserTarget.username} (UID: {deleteUserTarget.numericId})</strong> from SQLite database? This action cannot be undone.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteUserTarget(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition cursor-pointer shadow-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CREDIT MODAL */}
      {creditUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">🪙 Credit Currency to User</h3>
                <p className="text-xs text-slate-400">Target: @{creditUser.username} (UID: {creditUser.numericId})</p>
              </div>
              <button onClick={() => setCreditUser(null)} className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Currency Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCreditType('coins')}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      creditType === 'coins' ? 'bg-amber-500/20 text-amber-300 border-amber-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    🪙 Coins
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreditType('diamonds')}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      creditType === 'diamonds' ? 'bg-pink-500/20 text-pink-300 border-pink-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    💎 Diamonds
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Amount to Credit</label>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={e => setCreditAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. 50000"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreditUser(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black transition cursor-pointer shadow-lg"
                >
                  Confirm Credit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
