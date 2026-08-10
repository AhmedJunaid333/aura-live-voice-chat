'use client';

import React, { useState, useEffect } from 'react';
import { adminApi, UserRecord } from '@/lib/api';

export default function UserManagementModule() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState('50000');
  const [creditType, setCreditType] = useState<'coins' | 'diamonds'>('coins');

  const loadUsers = async () => {
    const list = await adminApi.getUsers({ query: search, status: statusFilter });
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
    const interval = setInterval(loadUsers, 5000);
    return () => clearInterval(interval);
  }, [search, statusFilter]);

  const handleToggleFreeze = async (u: UserRecord) => {
    await adminApi.freezeWallet(u.id, !u.walletFrozen);
    loadUsers();
  };

  const handleToggleStatus = async (u: UserRecord) => {
    const newStatus = u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    await adminApi.updateUserStatus(u.id, newStatus, 'Admin console toggle');
    loadUsers();
  };

  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const amount = parseInt(creditAmount, 10) || 0;
    await adminApi.creditWallet(selectedUser.id, amount, creditType);
    setShowCreditModal(false);
    alert(`Successfully credited ${amount.toLocaleString()} ${creditType} to @${selectedUser.username}!`);
    loadUsers();
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            👥 Registered Users Directory
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs border border-purple-500/30">
              {users.length} Users Found
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Direct 1-to-1 sync with Flutter Mobile App & SQLite Database</p>
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
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Cards Grid */}
      {users.length === 0 ? (
        <div className="p-12 text-center bg-[#111827] border border-[#1F2937] rounded-2xl text-slate-400 text-xs">
          No registered users found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map(u => (
            <div key={u.id} className="bg-[#111827] border border-[#1F2937] hover:border-purple-500/50 p-5 rounded-2xl space-y-4 shadow-xl transition-all">
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

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {u.status}
                </span>
              </div>

              {/* Stats Bar */}
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

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => { setSelectedUser(u); setShowCreditModal(true); }}
                  className="flex-1 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 transition cursor-pointer"
                >
                  🪙 Credit Balance
                </button>
                <button
                  onClick={() => handleToggleFreeze(u)}
                  className={`px-3 py-2 rounded-xl font-bold text-xs border transition cursor-pointer ${
                    u.walletFrozen ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {u.walletFrozen ? '🔓 Unfreeze' : '🔒 Freeze'}
                </button>
                <button
                  onClick={() => handleToggleStatus(u)}
                  className={`px-3 py-2 rounded-xl font-bold text-xs border transition cursor-pointer ${
                    u.status === 'ACTIVE' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {u.status === 'ACTIVE' ? '🚫 Ban' : '✅ Unban'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Credit Modal */}
      {showCreditModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">🪙 Credit Currency to User</h3>
                <p className="text-xs text-slate-400">Target: @{selectedUser.username} (UID: {selectedUser.numericId})</p>
              </div>
              <button onClick={() => setShowCreditModal(false)} className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer">
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
    </div>
  );
}
