import React, { useState, useEffect } from 'react';
import { adminDb, type UserRecord } from '../services/adminEnterpriseDataService';
import { adminApiClient, AdminUserRecord } from '../services/adminApiClient';

export function UserManagementAndKYCSection({ activeSubKey = 'all' }: { activeSubKey?: string }) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState('50000');
  const [creditType, setCreditType] = useState<'coins' | 'diamonds'>('coins');

  const fetchLiveUsers = async () => {
    const list = await adminApiClient.getUsers({ query: search, status: statusFilter });
    const formatted: UserRecord[] = list.map(u => ({
      id: u.numericId.toString(),
      internalId: u.id,
      name: u.username,
      email: u.email || (u.phone ? `Phone: ${u.phone}` : `Registered User`),
      phone: u.phone || 'Not Provided',
      avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}&background=7C3AED&color=fff`,
      level: u.level,
      vipTier: u.vipTier,
      coins: u.coins,
      diamonds: u.diamonds,
      role: u.role,
      status: u.status,
      walletFrozen: u.walletFrozen,
      country: u.country || 'Pakistan',
      joinedAt: new Date(u.createdAt).toISOString().split('T')[0],
    }));
    setUsers(formatted);
  };

  useEffect(() => {
    fetchLiveUsers();
    const interval = setInterval(fetchLiveUsers, 5000);
    return () => clearInterval(interval);
  }, [search, statusFilter]);

  useEffect(() => {
    const key = activeSubKey.toLowerCase();
    if (key.includes('kyc') || key.includes('verification')) setStatusFilter('KYC_PENDING');
    else if (key.includes('profile')) setStatusFilter('ALL');
    else setStatusFilter('ALL');
  }, [activeSubKey]);

  const filtered = users.filter(u => {
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Modals state
  const [viewUser, setViewUser] = useState<UserRecord | null>(null);
  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [logUser, setLogUser] = useState<UserRecord | null>(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState<UserRecord | null>(null);

  // Edit Credentials Form State
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

  const openEditModal = (u: UserRecord) => {
    setEditUser(u);
    setEditForm({
      username: u.name || '',
      password: '',
      bio: '',
      gender: 'MALE',
      country: u.country || 'Pakistan',
      role: u.role || 'USER',
      level: u.level || 1,
      vipTier: u.vipTier || 0,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    const intId = (editUser as any).internalId || parseInt(editUser.id, 10);
    await fetch(`http://localhost:3001/api/v1/admin/users/${intId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditUser(null);
    alert(`Successfully updated profile & credentials for @${editForm.username}!`);
    fetchLiveUsers();
  };

  const handleDeleteSubmit = async () => {
    if (!deleteUserTarget) return;
    const intId = (deleteUserTarget as any).internalId || parseInt(deleteUserTarget.id, 10);
    await fetch(`http://localhost:3001/api/v1/admin/users/${intId}`, {
      method: 'DELETE',
    });
    setDeleteUserTarget(null);
    alert(`Account deleted successfully!`);
    fetchLiveUsers();
  };

  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const val = parseInt(creditAmount) || 0;
    const intId = (selectedUser as any).internalId || parseInt(selectedUser.id, 10);
    
    await adminApiClient.creditUserWallet(intId, val, creditType);
    setShowCreditModal(false);
    alert(`Successfully credited ${val.toLocaleString()} ${creditType} to ${selectedUser.name}!`);
    fetchLiveUsers();
  };

  const handleToggleFreeze = async (u: UserRecord) => {
    const intId = (u as any).internalId || parseInt(u.id, 10);
    await adminApiClient.freezeUserWallet(intId, !u.walletFrozen);
    fetchLiveUsers();
  };

  const handleToggleStatus = async (u: UserRecord) => {
    const intId = (u as any).internalId || parseInt(u.id, 10);
    const newStatus = u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    await adminApiClient.updateUserStatus(intId, newStatus, 'Admin quick toggle');
    fetchLiveUsers();
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-cyan-900/40 border border-blue-500/30 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-black text-xs border border-blue-500/30">
              User Directory & KYC Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Live Roster Database</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            👥 User Management, KYC CNIC Records & Profile Dossier
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Search master user directory, approve KYC identity verifications, adjust VIP tiers, freeze/unfreeze wallets, credit virtual currency, and manage account penalties.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'ACTIVE', 'SUSPENDED', 'BANNED', 'KYC_PENDING'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-[#111927] text-slate-400 hover:text-white border border-[#1E293B]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center bg-[#111927] border border-[#1E293B] p-3 rounded-2xl">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search by User Name, UID, Phone, Email, Country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111927] border border-[#1E293B] rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#1E293B] flex justify-between items-center">
          <h3 className="font-extrabold text-white text-sm">📋 Registered User Dossier</h3>
          <span className="text-xs text-slate-400 font-mono">{filtered.length} Users Listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0D1322] text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3.5">User Details</th>
                <th className="p-3.5">Level & VIP</th>
                <th className="p-3.5">Coins & Diamonds</th>
                <th className="p-3.5">Role & Country</th>
                <th className="p-3.5">Wallet & Status</th>
                <th className="p-3.5 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    <div className="text-2xl mb-1">👥</div>
                    <div className="font-semibold text-xs text-slate-400">No Registered Users Found in Database</div>
                    <div className="text-[11px] text-slate-500 mt-1">Real users will automatically appear here once accounts are registered via app.</div>
                  </td>
                </tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id} className="hover:bg-slate-900/60 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full border-2 border-blue-500/60 object-cover" />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' ? (
                              <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">🛡️ ADMIN</span>
                            ) : u.role === 'DIAMOND_RESELLER' || u.role === 'RESELLER' ? (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">💎 RESELLER</span>
                            ) : null}
                          </div>
                          <div className="text-[10px] text-cyan-400 font-mono">UID: {u.id} • {u.country}</div>
                          <div className="text-[9px] text-slate-500 truncate max-w-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-amber-400">LV.{u.level} (VIP {u.vipTier})</div>
                      <div className="text-[10px] text-slate-400">{u.role}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-emerald-400">🪙 {u.coins.toLocaleString()} Coins</div>
                      <div className="font-semibold text-pink-400 text-[11px]">💎 {u.diamonds.toLocaleString()} Diamonds</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-200">{u.role}</div>
                      <div className="text-[10px] text-slate-500">{u.country}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : u.status === 'KYC_PENDING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          ● {u.status}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold ${u.walletFrozen ? 'text-rose-400' : 'text-slate-400'}`}>
                        Wallet: {u.walletFrozen ? '🔒 Frozen' : '🟢 Active'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <button
                          onClick={() => setViewUser(u)}
                          className="px-2 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-[10px] border border-blue-500/30 transition cursor-pointer"
                          title="View Profile Dossier"
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => openEditModal(u)}
                          className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-600 text-amber-300 hover:text-slate-950 font-bold text-[10px] border border-amber-500/30 transition cursor-pointer"
                          title="Edit Credentials & Profile"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setLogUser(u)}
                          className="px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-[10px] border border-purple-500/30 transition cursor-pointer"
                          title="View Activity & Audit Logs"
                        >
                          📜 Logs
                        </button>
                        <button
                          onClick={() => setDeleteUserTarget(u)}
                          className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[10px] border border-rose-500/30 transition cursor-pointer"
                          title="Delete User Account"
                        >
                          🗑️ Delete
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setShowCreditModal(true);
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold text-[10px] border border-emerald-500/40 transition cursor-pointer"
                          title="Credit Coins or Diamonds"
                        >
                          🪙 Credit
                        </button>
                        <button
                          onClick={() => handleToggleFreeze(u)}
                          className={`px-2 py-1 rounded-lg font-bold text-[10px] border transition cursor-pointer ${
                            u.walletFrozen
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {u.walletFrozen ? 'Unfreeze' : 'Freeze'}
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`px-2 py-1 rounded-lg font-bold text-[10px] border transition cursor-pointer ${
                            u.status === 'ACTIVE'
                              ? 'bg-rose-900/40 hover:bg-rose-600 text-rose-300 hover:text-white border-rose-700/50'
                              : 'bg-emerald-900/40 hover:bg-emerald-600 text-emerald-300 hover:text-white border-emerald-700/50'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Ban' : 'Activate'}
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

      {/* Credit Coins & Diamonds Modal */}
      {showCreditModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111927] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">🪙 Credit Currency to User</h3>
                <p className="text-xs text-slate-400">Target: {selectedUser.name} (UID: {selectedUser.id})</p>
              </div>
              <button
                onClick={() => setShowCreditModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
              >
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
                      creditType === 'coins'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    🪙 Coins
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreditType('diamonds')}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      creditType === 'diamonds'
                        ? 'bg-pink-500/20 text-pink-300 border-pink-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. 50000"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreditModal(false)}
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
      {/* 1. VIEW PROFILE DETAILS MODAL */}
      {viewUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111927] border border-blue-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                👁️ Full User Profile Dossier (UID: {viewUser.id})
              </h3>
              <button onClick={() => setViewUser(null)} className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer">
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <img src={viewUser.avatar} alt={viewUser.name} className="w-16 h-16 rounded-2xl object-cover border border-purple-500/40" />
              <div>
                <h4 className="text-lg font-black text-white">{viewUser.name}</h4>
                <p className="text-xs text-slate-400 font-mono">{viewUser.email}</p>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                    UID #{viewUser.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                    Role: {viewUser.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block">User UID</span>
                <strong className="text-white">#{viewUser.id}</strong>
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
          <div className="bg-[#111927] border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">✏️ Edit Profile & Credentials</h3>
                <p className="text-xs text-slate-400">Target: @{editUser.name} (UID: {editUser.id})</p>
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
          <div className="bg-[#111927] border border-purple-500/40 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">📜 Activity & Audit Logs</h3>
                <p className="text-xs text-slate-400">Target User: @{logUser.name} (UID: {logUser.id})</p>
              </div>
              <button onClick={() => setLogUser(null)} className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-slate-300">
              ● User registered & verified via database.<br />
              ● Currency wallet synchronized with Express server.<br />
              ● Admin telemetry active.
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
          <div className="bg-[#111927] border border-rose-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-rose-400">🗑️ Confirm User Account Deletion</h3>
              <button onClick={() => setDeleteUserTarget(null)} className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete account <strong className="text-white">@{deleteUserTarget.name} (UID: {deleteUserTarget.id})</strong> from SQLite database?
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
    </section>
  );
}
