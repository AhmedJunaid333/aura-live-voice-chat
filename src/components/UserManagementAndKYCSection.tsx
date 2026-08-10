import React, { useState, useEffect } from 'react';
import { adminDb, type UserRecord } from '../services/adminEnterpriseDataService';

export function UserManagementAndKYCSection({ activeSubKey = 'all' }: { activeSubKey?: string }) {
  const [users, setUsers] = useState<UserRecord[]>(adminDb.getUsers());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState('50000');
  const [creditType, setCreditType] = useState<'coins' | 'diamonds'>('coins');

  useEffect(() => {
    return adminDb.subscribe(() => {
      setUsers(adminDb.getUsers());
    });
  }, []);

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

  const handleCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const val = parseInt(creditAmount) || 0;
    if (creditType === 'coins') {
      adminDb.updateUserCoins(selectedUser.id, val);
    } else {
      adminDb.updateUserDiamonds(selectedUser.id, val);
    }
    setShowCreditModal(false);
    alert(`Successfully credited ${val.toLocaleString()} ${creditType} to ${selectedUser.name}!`);
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
                <th className="p-3.5">Family & Agency</th>
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
                    <div className="text-[11px] text-slate-500 mt-1">Real users will automatically appear here once accounts are registered.</div>
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
                            {u.isHost && <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">🎙️ HOST</span>}
                          </div>
                          <div className="text-[10px] text-cyan-400 font-mono">UID: {u.id} • {u.country}</div>
                          <div className="text-[9px] text-slate-500 truncate max-w-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-amber-400">LV.{u.level} ({u.vip})</div>
                      <div className="text-[10px] text-slate-400">{u.grade}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-emerald-400">🪙 {u.coins.toLocaleString()} Coins</div>
                      <div className="font-semibold text-pink-400 text-[11px]">💎 {u.diamonds.toLocaleString()} Diamonds</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-200">{u.family}</div>
                      <div className="text-[10px] text-slate-500">{u.agency}</div>
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
                      <div className="flex justify-end items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setShowCreditModal(true);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold text-[10px] border border-emerald-500/40 transition cursor-pointer"
                        >
                          🪙 Credit
                        </button>
                        <button
                          onClick={() => adminDb.toggleFreezeWallet(u.id)}
                          className={`px-2.5 py-1.5 rounded-xl font-bold text-[10px] border transition cursor-pointer ${
                            u.walletFrozen
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {u.walletFrozen ? 'Unfreeze' : 'Freeze'}
                        </button>
                        <button
                          onClick={() => adminDb.updateUserStatus(u.id, u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE')}
                          className={`px-2.5 py-1.5 rounded-xl font-bold text-[10px] border transition cursor-pointer ${
                            u.status === 'ACTIVE'
                              ? 'bg-rose-900/40 hover:bg-rose-600 text-rose-300 hover:text-white border-rose-700/50'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Ban' : 'Unban'}
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

      {/* Credit Virtual Currency Modal */}
      {showCreditModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreditSubmit}
            className="w-full max-w-md bg-[#111927] border border-[#1E293B] rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">🪙 Credit Virtual Balance</h3>
              <button
                type="button"
                onClick={() => setShowCreditModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full border border-blue-500 object-cover" />
              <div>
                <h4 className="font-bold text-white text-xs">{selectedUser.name}</h4>
                <span className="text-[10px] text-cyan-400 font-mono">UID: {selectedUser.id}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Currency Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCreditType('coins')}
                  className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
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
                  className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Amount to Credit</label>
              <input
                type="number"
                required
                value={creditAmount}
                onChange={e => setCreditAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreditModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white cursor-pointer shadow-lg"
              >
                Confirm Credit & Sync DB
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
