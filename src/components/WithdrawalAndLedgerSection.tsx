import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export interface BackendWithdrawalRecord {
  id: string;
  requestNumber: string;
  transactionId: string;
  userNumericId: number;
  username: string;
  avatar?: string;
  sellerNumericId: number;
  sellerUsername: string;
  amount: number;
  currency: string;
  payoutAmount: number;
  paymentMethod: string;
  accountTitle: string;
  accountNumber: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
}

export function WithdrawalAndLedgerSection() {
  const [withdrawals, setWithdrawals] = useState<BackendWithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState<BackendWithdrawalRecord | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/v1/withdrawal/requests');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setWithdrawals(res.data.data);
      }
    } catch (_) {
      // Fallback empty
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      const res = await apiClient.post('/api/v1/withdrawal/process', {
        requestId: selectedItem.id,
        action: 'COMPLETE',
      });
      if (res.data?.success) {
        setShowApprovalModal(false);
        fetchWithdrawals();
      }
    } catch (err: any) {
      alert(`Error approving withdrawal: ${err.message || 'Server error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      const res = await apiClient.post('/api/v1/withdrawal/process', {
        requestId: selectedItem.id,
        action: 'REJECT',
        reason: rejectionReasonInput || 'Rejected by Administrator',
      });
      if (res.data?.success) {
        setShowRejectModal(false);
        setRejectionReasonInput('');
        fetchWithdrawals();
      }
    } catch (err: any) {
      alert(`Error rejecting withdrawal: ${err.message || 'Server error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = withdrawals.filter(w => statusFilter === 'ALL' || w.status === statusFilter);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-indigo-900/40 border border-emerald-500/30 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/30">
              💎 Financial Treasury Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Easypaisa • JazzCash • Bank Transfer • USDT</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            💰 Financial Ledger, Cashout Approvals & Coin Sellers
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Review live diamond cashout requests, approve payout transfers, verify account titles, and process Coin Seller transactions in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'COMPLETED', 'REJECTED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#111927] text-slate-400 hover:text-white border border-[#1E293B]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending Cashout Requests', val: `${withdrawals.filter(w => w.status === 'PENDING').length} Requests`, sub: 'Awaiting Coin Seller', color: 'text-amber-400' },
          { label: 'Completed Cashouts', val: `${withdrawals.filter(w => w.status === 'COMPLETED').length} Disbursed`, sub: '100% Verified', color: 'text-emerald-400' },
          { label: 'Total Diamonds Processed', val: `${withdrawals.reduce((sum, w) => sum + (w.status === 'COMPLETED' ? w.amount : 0), 0).toLocaleString()} 💎`, sub: 'Authoritative Ledger', color: 'text-cyan-400' },
          { label: 'Total Cashout Value', val: `$${withdrawals.reduce((sum, w) => sum + (w.status === 'COMPLETED' ? w.payoutAmount : 0), 0).toFixed(2)} USD`, sub: '1 USD = 45k 💎', color: 'text-purple-400' },
        ].map((k, i) => (
          <div key={i} className="bg-[#111927] border border-[#1E293B] rounded-2xl p-4 shadow-lg">
            <span className="text-[11px] font-semibold text-slate-400">{k.label}</span>
            <div className={`text-xl font-black ${k.color} mt-1`}>{k.val}</div>
            <span className="text-[10px] text-slate-500">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* Cashouts Table */}
      <div className="bg-[#111927] border border-[#1E293B] rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#1E293B] flex justify-between items-center">
          <h3 className="font-extrabold text-white text-sm">📋 Live Withdrawal & Cashout Request Queue</h3>
          <button onClick={fetchWithdrawals} className="text-xs text-indigo-400 font-mono hover:underline">
            🔄 Refresh Queue
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs font-mono">Loading cashout queue...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-mono">
            No withdrawal requests match current filter ({statusFilter}).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0D1322] text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Req #</th>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Assigned Seller</th>
                  <th className="p-3.5">Diamonds</th>
                  <th className="p-3.5">Payout ($ USD)</th>
                  <th className="p-3.5">Payment Method</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map(w => (
                  <tr key={w.id} className="hover:bg-slate-900/60 transition">
                    <td className="p-3.5 font-mono text-cyan-400 font-bold">{w.requestNumber}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{w.username}</div>
                      <div className="text-[10px] text-slate-500 font-mono">UID: {w.userNumericId}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-purple-300">@{w.sellerUsername}</div>
                      <div className="text-[10px] text-slate-500 font-mono">UID: {w.sellerNumericId}</div>
                    </td>
                    <td className="p-3.5 font-bold text-pink-400">💎 {w.amount.toLocaleString()}</td>
                    <td className="p-3.5">
                      <div className="font-black text-emerald-400">${w.payoutAmount.toFixed(2)} USD</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-amber-300">{w.paymentMethod}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{w.accountNumber} ({w.accountTitle})</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        w.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : w.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        ● {w.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {w.status === 'PENDING' ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedItem(w);
                              setShowApprovalModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] transition cursor-pointer shadow-md"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(w);
                              setShowRejectModal(true);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-900/40 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[10px] border border-rose-700/50 transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complete Modal */}
      {showApprovalModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleApprove}
            className="w-full max-w-md bg-[#111927] border border-[#1E293B] rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">✅ Confirm Cashout Disbursement</h3>
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">User: <strong className="text-white">{selectedItem.username}</strong> ({selectedItem.userNumericId})</div>
              <div className="text-slate-400">Diamonds: <strong className="text-pink-400">💎 {selectedItem.amount.toLocaleString()}</strong></div>
              <div className="text-slate-400">Payout: <strong className="text-emerald-400">${selectedItem.payoutAmount.toFixed(2)} USD</strong></div>
              <div className="text-slate-400">Channel: <strong className="text-amber-300">{selectedItem.paymentMethod}</strong> - {selectedItem.accountNumber}</div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-bold text-slate-950 cursor-pointer shadow-lg"
              >
                {actionLoading ? 'Processing...' : 'Disburse & Complete'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleReject}
            className="w-full max-w-md bg-[#111927] border border-[#1E293B] rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">✕ Reject Cashout Request</h3>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">User: <strong className="text-white">{selectedItem.username}</strong> ({selectedItem.userNumericId})</div>
              <div className="text-slate-400">Reserved: <strong className="text-pink-400">💎 {selectedItem.amount.toLocaleString()}</strong> (Will be refunded)</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rejection Reason</label>
              <input
                type="text"
                required
                placeholder="e.g. Account number invalid or details mismatch"
                value={rejectionReasonInput}
                onChange={e => setRejectionReasonInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-xs font-bold text-white cursor-pointer shadow-lg"
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
