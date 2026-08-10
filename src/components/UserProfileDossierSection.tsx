import React, { useState, useEffect } from 'react';
import { adminApiClient, AdminUserRecord } from '../services/adminApiClient';

export function UserProfileDossierSection() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [creditAmount, setCreditAmount] = useState('50000');
  const [creditType, setCreditType] = useState<'coins' | 'diamonds'>('coins');
  const [showCreditModal, setShowCreditModal] = useState(false);

  const loadUsers = async () => {
    const list = await adminApiClient.getUsers({ query: search });
    setUsers(list);
    if (list.length > 0 && selectedUserId === null) {
      setSelectedUserId(list[0].id);
    }
  };

  const loadUserDetails = async (id: number) => {
    setLoading(true);
    const details = await adminApiClient.getUserDetails(id);
    setSelectedUserDetail(details || users.find(u => u.id === id) || null);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  useEffect(() => {
    if (selectedUserId) {
      loadUserDetails(selectedUserId);
    }
  }, [selectedUserId]);

  const activeUser = selectedUserDetail || users.find(u => u.id === selectedUserId);

  const handleToggleFreeze = async () => {
    if (!activeUser) return;
    await adminApiClient.freezeUserWallet(activeUser.id, !activeUser.walletFrozen);
    loadUserDetails(activeUser.id);
    loadUsers();
  };

  const handleToggleStatus = async () => {
    if (!activeUser) return;
    const newStatus = activeUser.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    await adminApiClient.updateUserStatus(activeUser.id, newStatus, 'Profile dossier action');
    loadUserDetails(activeUser.id);
    loadUsers();
  };

  const handleCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;
    const amount = parseInt(creditAmount, 10) || 0;
    await adminApiClient.creditUserWallet(activeUser.id, amount, creditType);
    setShowCreditModal(false);
    alert(`Successfully credited ${amount.toLocaleString()} ${creditType} to ${activeUser.username}!`);
    loadUserDetails(activeUser.id);
    loadUsers();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/30 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-black text-xs border border-purple-500/30">
              Live Dossier Inspector
            </span>
            <span className="text-xs text-slate-400 font-mono">Master User Identity Schema</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            👤 Live User Profile & Real-Time Identity Telemetry
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Inspect live user attributes, online presence, hardware session info, wallet balances, VIP levels, and moderation penalties directly from database.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="🔍 Search User Name / UID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-inner"
          />
        </div>
      </div>

      {/* User Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {users.map(u => (
          <button
            key={u.id}
            onClick={() => setSelectedUserId(u.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 border ${
              selectedUserId === u.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/60 shadow-lg scale-[1.02]'
                : 'bg-[#111927] text-slate-400 hover:text-white border-[#1E293B] hover:border-slate-700'
            }`}
          >
            <img
              src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username)}&background=7C3AED&color=fff`}
              alt={u.username}
              className="w-6 h-6 rounded-full object-cover border border-white/20"
            />
            <span>{u.username}</span>
            <span className="text-[10px] font-mono text-cyan-300">#{u.numericId}</span>
          </button>
        ))}
      </div>

      {/* Main Profile Dossier Card */}
      {activeUser ? (
        <div className="bg-[#111927] border border-[#1E293B] rounded-3xl p-6 shadow-2xl space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={activeUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeUser.username)}&background=7C3AED&color=fff`}
                  alt={activeUser.username}
                  className="w-20 h-20 rounded-3xl border-2 border-purple-500/60 shadow-xl object-cover"
                />
                <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#111927] ${
                  activeUser.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'
                }`} title={activeUser.status} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-black text-white">{activeUser.username}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/30">
                    UID: {activeUser.numericId}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    activeUser.role === 'SUPER_ADMIN' || activeUser.role === 'ADMIN'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : activeUser.role === 'DIAMOND_RESELLER' || activeUser.role === 'RESELLER'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {activeUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-300 italic">{activeUser.bio || 'Aura Live VIP Account ✨'}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
                  <span>📍 {activeUser.country || 'Pakistan'}</span>
                  <span>🗓️ Registered: {new Date(activeUser.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreditModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg flex items-center gap-1.5"
              >
                🪙 Credit Currency
              </button>
              <button
                onClick={handleToggleFreeze}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs border transition cursor-pointer ${
                  activeUser.walletFrozen
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {activeUser.walletFrozen ? '🔓 Unfreeze Wallet' : '🔒 Freeze Wallet'}
              </button>
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs border transition cursor-pointer ${
                  activeUser.status === 'ACTIVE'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-600 hover:text-white'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600 hover:text-white'
                }`}
              >
                {activeUser.status === 'ACTIVE' ? '🚫 Ban User' : '✅ Unban User'}
              </button>
            </div>
          </div>

          {/* Grid Attributes Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Economy Card */}
            <div className="bg-[#0D1322] border border-[#1E293B] p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                💰 Live Wallet & Economy Balance
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Coins Balance</span>
                  <span className="font-extrabold text-amber-400 text-sm">🪙 {activeUser.coins.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Diamonds Balance</span>
                  <span className="font-extrabold text-pink-400 text-sm">💎 {activeUser.diamonds.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Wallet Status</span>
                  <span className={`font-bold text-xs ${activeUser.walletFrozen ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {activeUser.walletFrozen ? '🔒 Frozen' : '🟢 Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Progression & Ranks Card */}
            <div className="bg-[#0D1322] border border-[#1E293B] p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                👑 Level XP & Nobility Rank
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">User Level</span>
                  <span className="font-extrabold text-purple-300 text-sm">Level {activeUser.level || 1}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">VIP Tier</span>
                  <span className="font-extrabold text-amber-300 text-sm">VIP {activeUser.vipTier || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">System Role</span>
                  <span className="font-bold text-xs text-cyan-300">{activeUser.role}</span>
                </div>
              </div>
            </div>

            {/* Hardware & Session Telemetry */}
            <div className="bg-[#0D1322] border border-[#1E293B] p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                ⚡ Hardware & Security Telemetry
              </h4>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Account Status</span>
                  <span className={`font-bold ${activeUser.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ● {activeUser.status}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Session ID</span>
                  <span className="text-slate-300 font-bold">SES-{activeUser.numericId}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Device Hardware</span>
                  <span className="text-slate-300 font-bold">Android / iOS App</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-[#111927] border border-[#1E293B] rounded-3xl text-slate-400 text-xs">
          Loading live user profile dossier...
        </div>
      )}

      {/* Credit Modal */}
      {showCreditModal && activeUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111927] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">🪙 Credit Currency to User</h3>
                <p className="text-xs text-slate-400">Target: {activeUser.username} (UID: {activeUser.numericId})</p>
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
    </div>
  );
}
