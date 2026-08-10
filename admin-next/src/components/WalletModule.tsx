'use client';

import React, { useState } from 'react';

export default function WalletModule() {
  const [recharges] = useState([
    { id: 'RC-9901', user: 'Ahmed Khokhar (UID: 100001)', amount: '🪙 500,000 Coins', price: '$50.00', gateway: 'Stripe / Google Pay', status: 'COMPLETED', date: '2026-08-10 21:30' },
    { id: 'RC-9902', user: 'Dimple (UID: 100003)', amount: '💎 100,000 Diamonds', price: '$20.00', gateway: 'JazzCash', status: 'COMPLETED', date: '2026-08-10 20:45' },
    { id: 'RC-9903', user: 'Ayesha_Singer (UID: 100002)', amount: '🪙 25,000 Coins', price: '$5.00', gateway: 'EasyPaisa', status: 'COMPLETED', date: '2026-08-10 19:12' },
  ]);

  const [withdrawals, setWithdrawals] = useState([
    { id: 'WD-8801', user: 'Ahmed Khokhar (UID: 100001)', diamonds: '100,000 Diamonds', amount: '$50.00', bank: 'Meezan Bank PK77MEZN000123', status: 'APPROVED', date: '2026-08-10' },
    { id: 'WD-8802', user: 'Dimple (UID: 100003)', diamonds: '50,000 Diamonds', amount: '$25.00', bank: 'EasyPaisa 03001234567', status: 'PENDING', date: '2026-08-10' },
  ]);

  const handleApproveWithdrawal = (id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'APPROVED' } : w));
    alert(`Withdrawal request ${id} approved successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold">Total Coins Circulation</span>
          <div className="text-2xl font-black text-amber-400 mt-1">🪙 10,520,000</div>
          <span className="text-[10px] text-emerald-400">● 100% Backed by SQLite DB</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold">Total Diamonds Reserve</span>
          <div className="text-2xl font-black text-pink-400 mt-1">💎 5,535,000</div>
          <span className="text-[10px] text-emerald-400">● Reseller Liquidity Active</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold">Completed Recharges</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">$1,250.00</div>
          <span className="text-[10px] text-slate-400">3 Transactions Today</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold">Pending Cashouts</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">1 Request ($25.00)</div>
          <span className="text-[10px] text-amber-400">Action Required</span>
        </div>
      </div>

      {/* Recharges Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          💳 Recent In-App Recharge Transactions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">User Target</th>
                <th className="pb-3">Package Amount</th>
                <th className="pb-3">Payment Gateway</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {recharges.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{r.id}</td>
                  <td>{r.user}</td>
                  <td className="font-bold text-amber-300">{r.amount}</td>
                  <td>{r.gateway}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {r.status}
                    </span>
                  </td>
                  <td className="text-slate-400">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Requests Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          💸 Broadcaster & Host Cashout Requests
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Request ID</th>
                <th className="pb-3">Host User</th>
                <th className="pb-3">Diamonds Redeemed</th>
                <th className="pb-3">Payout Value</th>
                <th className="pb-3">Payout Account</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {withdrawals.map(w => (
                <tr key={w.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-purple-400">{w.id}</td>
                  <td>{w.user}</td>
                  <td className="font-bold text-pink-300">{w.diamonds}</td>
                  <td className="font-bold text-emerald-400">{w.amount}</td>
                  <td>{w.bank}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      w.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td>
                    {w.status === 'PENDING' ? (
                      <button
                        onClick={() => handleApproveWithdrawal(w.id)}
                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[10px] transition cursor-pointer"
                      >
                        ✓ Approve Payout
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
