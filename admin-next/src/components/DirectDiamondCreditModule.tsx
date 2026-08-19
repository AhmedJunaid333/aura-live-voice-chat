'use client';

import React, { useState } from 'react';
import { adminApi, defaultRealUsers } from '@/lib/api';

export default function DirectDiamondCreditModule() {
  const [targetUid, setTargetUid] = useState('100001');
  const [amount, setAmount] = useState('100000');
  const [currency, setCurrency] = useState<'diamonds' | 'coins'>('diamonds');
  const [notes, setNotes] = useState('Admin direct manual credit');
  const [logs, setLogs] = useState([
    { id: 'TX-901', uid: '100001 (Ahmed Khokhar)', amount: '💎 500,000 Diamonds', notes: 'Wholesale Stock Topup', date: '2026-08-10 22:00' },
    { id: 'TX-902', uid: '100003 (Dimple)', amount: '🪙 15,000 Coins', notes: 'Broadcaster Monthly Reward', date: '2026-08-10 18:00' },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleDirectCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericId = parseInt(targetUid.trim(), 10);
    const numAmount = parseInt(amount, 10) || 0;
    
    if (isNaN(numericId) || numericId <= 0) {
      alert('Please enter a valid Numeric UID (e.g. 26 or 100001).');
      return;
    }

    if (numAmount <= 0) {
      alert('Please enter a positive amount to credit.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await adminApi.creditWallet(numericId, numAmount, currency, notes);

      if (res && res.success) {
        const username = res.data?.username || `User ${numericId}`;
        const newLog = {
          id: `TX-${Math.floor(900 + Math.random() * 99)}`,
          uid: `${numericId} (${username})`,
          amount: `${currency === 'diamonds' ? '💎' : '🪙'} ${numAmount.toLocaleString()} ${currency}`,
          notes,
          date: new Date().toLocaleString(),
        };
        setLogs([newLog, ...logs]);
        alert(`✅ Successfully credited ${numAmount.toLocaleString()} ${currency} to UID ${numericId} (@${username})! New Balance: ${res.data?.[currency]?.toLocaleString() || 'Updated'}`);
      } else {
        alert(`❌ Failed to credit account: ${res?.error || 'User not found or server error'}`);
      }
    } catch (err: any) {
      alert(`❌ Error executing credit: ${err?.message || 'Server error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-900/40 via-purple-900/30 to-indigo-900/40 border border-pink-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          💳 Direct Diamond & Coins Credit Console
        </h2>
        <p className="text-xs text-slate-300 mt-1">1-Click instant direct currency injection into any user account via target Numeric UID with full audit trail logging</p>
      </div>

      {/* Credit Form */}
      <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl">
        <h3 className="text-base font-black text-pink-400">💎 Execute Direct Account Top-Up</h3>

        <form onSubmit={handleDirectCredit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Target User Numeric UID</label>
            <input
              type="text"
              value={targetUid}
              onChange={e => setTargetUid(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold text-sm"
              placeholder="e.g. 100001"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Currency Type</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold"
              >
                <option value="diamonds">💎 Diamonds</option>
                <option value="coins">🪙 Coins</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold"
                placeholder="e.g. 100000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Audit Trail Note / Reason</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-pink-600/30 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? '⏳ Processing Direct Credit...' : '⚡ Confirm & Credit Instantly'}
          </button>
        </form>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-white">📜 Direct Diamond Credit Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Target UID & User</th>
                <th className="pb-3">Credited Amount</th>
                <th className="pb-3">Audit Notes</th>
                <th className="pb-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-pink-400">{l.id}</td>
                  <td className="font-bold text-white text-sm">{l.uid}</td>
                  <td className="font-bold text-emerald-400">{l.amount}</td>
                  <td className="text-slate-300">{l.notes}</td>
                  <td className="text-slate-400">{l.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
