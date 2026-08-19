'use client';

import React, { useState, useEffect } from 'react';
import { adminApi, WithdrawalRequestRecord, WithdrawalConfigRecord } from '@/lib/api';

export default function WithdrawalManagementModule() {
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'CONFIG'>('REQUESTS');
  const [requests, setRequests] = useState<WithdrawalRequestRecord[]>([]);
  const [stats, setStats] = useState<any>({
    pendingCount: 0,
    completedCount: 0,
    rejectedCount: 0,
    beansPerUsd: 10000,
  });
  const [config, setConfig] = useState<WithdrawalConfigRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Action Modal State
  const [selectedReq, setSelectedReq] = useState<WithdrawalRequestRecord | null>(null);
  const [actionType, setActionType] = useState<'PROCESS' | 'PAYMENT_SENT' | 'COMPLETE' | 'REJECT'>('PROCESS');
  const [paymentRef, setPaymentRef] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Config Form State
  const [configForm, setConfigForm] = useState({
    beansPerUsd: 10000,
    minWithdrawalBeans: 10000,
    maxWithdrawalBeans: 5000000,
    resellerFeePercent: 0,
    officialFeePercent: 2,
    officialMethods: 'JazzCash,Easypaisa,Bank Transfer,USDT',
    isWithdrawalEnabled: true,
    isResellerWithdrawEnabled: true,
    isOfficialWithdrawEnabled: true,
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  useEffect(() => {
    fetchData();
  }, [channelFilter, statusFilter]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resData, cfgData] = await Promise.all([
        adminApi.getAdminWithdrawals({
          channel: channelFilter !== 'ALL' ? channelFilter : undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          search: searchQuery || undefined,
        }),
        adminApi.getWithdrawalConfig(),
      ]);

      if (resData?.requests) {
        setRequests(resData.requests);
        setStats(resData.stats || {});
      }
      if (cfgData) {
        setConfig(cfgData);
        setConfigForm({
          beansPerUsd: cfgData.beansPerUsd ?? 10000,
          minWithdrawalBeans: cfgData.minWithdrawalBeans ?? 10000,
          maxWithdrawalBeans: cfgData.maxWithdrawalBeans ?? 5000000,
          resellerFeePercent: cfgData.resellerFeePercent ?? 0,
          officialFeePercent: cfgData.officialFeePercent ?? 2,
          officialMethods: cfgData.officialMethods ?? 'JazzCash,Easypaisa,Bank Transfer,USDT',
          isWithdrawalEnabled: cfgData.isWithdrawalEnabled ?? true,
          isResellerWithdrawEnabled: cfgData.isResellerWithdrawEnabled ?? true,
          isOfficialWithdrawEnabled: cfgData.isOfficialWithdrawEnabled ?? true,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleOpenActionModal = (req: WithdrawalRequestRecord, defaultAction: 'PROCESS' | 'PAYMENT_SENT' | 'COMPLETE' | 'REJECT') => {
    setSelectedReq(req);
    setActionType(defaultAction);
    setPaymentRef(req.paymentReference || '');
    setActionNotes('');
  };

  const handleExecuteAction = async () => {
    if (!selectedReq) return;
    setIsSubmittingAction(true);
    try {
      const res = await adminApi.processWithdrawalAction(selectedReq.id, actionType, {
        notes: actionNotes,
        paymentReference: paymentRef,
        rejectionReason: actionType === 'REJECT' ? actionNotes : undefined,
      });

      if (res.success) {
        alert(`✅ Action '${actionType}' applied to ${selectedReq.requestNumber} successfully!`);
        setSelectedReq(null);
        fetchData();
      } else {
        alert(`❌ Error: ${res.error || 'Action failed.'}`);
      }
    } catch (e: any) {
      alert(`❌ Error: ${e.message}`);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      const res = await adminApi.updateWithdrawalConfig(configForm);
      if (res.success) {
        alert('🎉 Withdrawal configuration updated and live across all client apps!');
        fetchData();
      } else {
        alert(`❌ Error: ${res.error || 'Failed to update configuration.'}`);
      }
    } catch (e: any) {
      alert(`❌ Error: ${e.message}`);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">⏳ PENDING</span>;
      case 'PROCESSING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">⚙️ PROCESSING</span>;
      case 'PAYMENT_SENT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">📤 PAYMENT SENT</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✅ COMPLETED</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">❌ REJECTED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/30">🚫 CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Telemetry */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#1E1B4B] via-[#0F172A] to-[#1E1B4B] p-6 rounded-2xl border border-indigo-500/20 shadow-2xl">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🫘</span>
            <div>
              <h2 className="text-2xl font-black text-white tracking-wide">Beans & Withdrawal Management</h2>
              <p className="text-xs text-indigo-300 mt-0.5">Real-time Reseller & Official Withdrawal Engine with Atomic PostgreSQL Holds</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#111827] p-1.5 rounded-xl border border-slate-700/60 shadow-inner">
          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'REQUESTS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Withdrawal Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('CONFIG')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'CONFIG' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ Rates & Economy Settings
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold">Pending Requests</span>
          <div className="text-2xl font-black text-amber-400 mt-1">⏳ {stats.pendingCount || 0}</div>
          <span className="text-[10px] text-amber-300">Action required by Reseller/Admin</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold">Completed Cashouts</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">✅ {stats.completedCount || 0}</div>
          <span className="text-[10px] text-emerald-300">Held Beans permanently settled</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold">Active Conversion Rate</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            🫘 {(config?.beansPerUsd ?? stats.beansPerUsd ?? 10000).toLocaleString()} = $1.00 USD
          </div>
          <span className="text-[10px] text-slate-400">Server-side PostgreSQL Rate</span>
        </div>
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold">Channel Gateway Status</span>
          <div className="text-sm font-bold text-slate-200 mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${config?.isResellerWithdrawEnabled ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              <span>Reseller Withdraw: {config?.isResellerWithdrawEnabled ? 'ACTIVE' : 'DISABLED'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${config?.isOfficialWithdrawEnabled ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              <span>Official Withdraw: {config?.isOfficialWithdrawEnabled ? 'ACTIVE' : 'DISABLED'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: WITHDRAWAL REQUESTS */}
      {activeTab === 'REQUESTS' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Channel Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Channel:</span>
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="bg-[#1F2937] border border-slate-700 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">All Channels</option>
                  <option value="RESELLER">🏪 Reseller Withdraw</option>
                  <option value="OFFICIAL">🏢 Official Withdraw</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#1F2937] border border-slate-700 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">⏳ PENDING</option>
                  <option value="PROCESSING">⚙️ PROCESSING</option>
                  <option value="PAYMENT_SENT">📤 PAYMENT SENT</option>
                  <option value="COMPLETED">✅ COMPLETED</option>
                  <option value="REJECTED">❌ REJECTED</option>
                </select>
              </div>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Request #, UID, Account..."
                className="bg-[#1F2937] border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 w-64 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition"
              >
                Search
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                    <th className="p-4">Request # / Date</th>
                    <th className="p-4">Applicant User</th>
                    <th className="p-4">Channel & Target</th>
                    <th className="p-4">Beans Redeemed</th>
                    <th className="p-4">Payout (Net USD)</th>
                    <th className="p-4">Payment Account Details</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        <div className="animate-spin inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
                        <p>Loading real-time withdrawal requests from database...</p>
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        No withdrawal requests found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    requests.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4">
                          <div className="font-bold text-cyan-400">{r.requestNumber}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(r.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-300 border border-slate-700 overflow-hidden">
                              {r.user?.avatar ? (
                                <img src={r.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                              ) : (
                                r.user?.username?.slice(0, 2).toUpperCase() || 'U'
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white">@{r.user?.username || 'user'}</div>
                              <div className="text-[10px] text-indigo-400 font-mono">UID: {r.user?.numericId || r.userId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {r.channel === 'RESELLER' ? (
                            <div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                🏪 Reseller
                              </span>
                              <div className="text-xs text-slate-300 font-bold mt-1">
                                @{r.sellerUser?.user?.username || `UID ${r.sellerUserId}`}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                🏢 Official
                              </span>
                              <div className="text-xs text-slate-300 font-bold mt-1">
                                {r.officialProvider || r.paymentMethod}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="font-black text-amber-400 text-sm">
                            🫘 {(r.beansAmount || r.amount).toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400">Rate: 10k = $1.00</div>
                        </td>
                        <td className="p-4">
                          <div className="font-black text-emerald-400 text-sm">
                            ${(r.netUsd || r.payoutAmount || 0).toFixed(2)} USD
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Gross: ${(r.grossUsd || 0).toFixed(2)} | Fee: ${(r.feeUsd || 0).toFixed(2)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white">{r.paymentMethod}</div>
                          <div className="text-xs text-slate-300 font-semibold">{r.accountTitle}</div>
                          <div className="text-xs text-cyan-300 font-mono">{r.accountNumber}</div>
                          {r.bankName && <div className="text-[10px] text-slate-400">Bank: {r.bankName}</div>}
                          {r.iban && <div className="text-[10px] text-slate-400">IBAN: {r.iban}</div>}
                        </td>
                        <td className="p-4">{getStatusBadge(r.status)}</td>
                        <td className="p-4 text-right space-y-1">
                          {r.status === 'PENDING' && (
                            <button
                              onClick={() => handleOpenActionModal(r, 'PROCESS')}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition w-full"
                            >
                              Process
                            </button>
                          )}
                          {r.status === 'PROCESSING' && (
                            <button
                              onClick={() => handleOpenActionModal(r, 'PAYMENT_SENT')}
                              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition w-full"
                            >
                              Send Payment
                            </button>
                          )}
                          {r.status === 'PAYMENT_SENT' && (
                            <button
                              onClick={() => handleOpenActionModal(r, 'COMPLETE')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition w-full"
                            >
                              Complete
                            </button>
                          )}
                          {(r.status === 'PENDING' || r.status === 'PROCESSING') && (
                            <button
                              onClick={() => handleOpenActionModal(r, 'REJECT')}
                              className="px-3 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition w-full"
                            >
                              Reject & Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONFIGURATION & RATES */}
      {activeTab === 'CONFIG' && (
        <form onSubmit={handleSaveConfig} className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-6 shadow-xl max-w-4xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              ⚙️ Economy Conversion Rates & Withdrawal Limits
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure global Beans → USD exchange rate, minimum/maximum limits, processing fees, and channel access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Conversion Rate */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Beans per $1.00 USD (Conversion Rate) 🫘
              </label>
              <input
                type="number"
                value={configForm.beansPerUsd}
                onChange={(e) => setConfigForm({ ...configForm, beansPerUsd: parseInt(e.target.value, 10) || 10000 })}
                className="w-full bg-[#1F2937] border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400">Example: 10,000 Beans = $1.00 USD | 100,000 Beans = $10.00 USD</p>
            </div>

            {/* Official Methods */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Enabled Official Methods (Comma separated) 💳
              </label>
              <input
                type="text"
                value={configForm.officialMethods}
                onChange={(e) => setConfigForm({ ...configForm, officialMethods: e.target.value })}
                className="w-full bg-[#1F2937] border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400">Supported: JazzCash, Easypaisa, Bank Transfer, USDT</p>
            </div>

            {/* Min Beans */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Minimum Withdrawal (Beans) 🔻
              </label>
              <input
                type="number"
                value={configForm.minWithdrawalBeans}
                onChange={(e) => setConfigForm({ ...configForm, minWithdrawalBeans: parseInt(e.target.value, 10) || 10000 })}
                className="w-full bg-[#1F2937] border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400">Default: 10,000 Beans ($1.00 USD)</p>
            </div>

            {/* Max Beans */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Maximum Withdrawal Per Request (Beans) 🔺
              </label>
              <input
                type="number"
                value={configForm.maxWithdrawalBeans}
                onChange={(e) => setConfigForm({ ...configForm, maxWithdrawalBeans: parseInt(e.target.value, 10) || 5000000 })}
                className="w-full bg-[#1F2937] border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400">Default: 5,000,000 Beans ($500.00 USD)</p>
            </div>

            {/* Reseller Fee */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Reseller Processing Fee (%) 🏪
              </label>
              <input
                type="number"
                step="0.1"
                value={configForm.resellerFeePercent}
                onChange={(e) => setConfigForm({ ...configForm, resellerFeePercent: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#1F2937] border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400">Default: 0%</p>
            </div>

            {/* Official Fee */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Official Gateway Fee (%) 🏢
              </label>
              <input
                type="number"
                step="0.1"
                value={configForm.officialFeePercent}
                onChange={(e) => setConfigForm({ ...configForm, officialFeePercent: parseFloat(e.target.value) || 2 })}
                className="w-full bg-[#1F2937] border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400">Default: 2.0%</p>
            </div>
          </div>

          {/* Master Toggles */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300">Channel & Master Availability</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 bg-[#1F2937] p-3 rounded-xl border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={configForm.isWithdrawalEnabled}
                  onChange={(e) => setConfigForm({ ...configForm, isWithdrawalEnabled: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-xs font-bold text-white">Master Withdrawal Active</span>
              </label>

              <label className="flex items-center gap-3 bg-[#1F2937] p-3 rounded-xl border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={configForm.isResellerWithdrawEnabled}
                  onChange={(e) => setConfigForm({ ...configForm, isResellerWithdrawEnabled: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-xs font-bold text-white">Allow Reseller Withdraw</span>
              </label>

              <label className="flex items-center gap-3 bg-[#1F2937] p-3 rounded-xl border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={configForm.isOfficialWithdrawEnabled}
                  onChange={(e) => setConfigForm({ ...configForm, isOfficialWithdrawEnabled: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-xs font-bold text-white">Allow Official Withdraw</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSavingConfig}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition shadow-lg flex items-center gap-2"
            >
              {isSavingConfig ? 'Saving Settings...' : '💾 Save & Publish Configuration'}
            </button>
          </div>
        </form>
      )}

      {/* ACTION MODAL */}
      {selectedReq && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 w-full max-w-lg rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                ⚡ Process Withdrawal #{selectedReq.requestNumber}
              </h3>
              <button
                onClick={() => setSelectedReq(null)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Summary Details */}
            <div className="bg-[#1F2937]/70 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">User:</span>
                <span className="font-bold text-white">@{selectedReq.user?.username} (UID: {selectedReq.user?.numericId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Beans to Deduct:</span>
                <span className="font-black text-amber-400">🫘 {(selectedReq.beansAmount || selectedReq.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Net Payout:</span>
                <span className="font-black text-emerald-400">${(selectedReq.netUsd || selectedReq.payoutAmount || 0).toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="font-bold text-cyan-300">{selectedReq.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Title:</span>
                <span className="font-bold text-white">{selectedReq.accountTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Number:</span>
                <span className="font-mono font-bold text-white">{selectedReq.accountNumber}</span>
              </div>
            </div>

            {/* Action Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Select Action:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActionType('PROCESS')}
                  className={`py-2 rounded-lg text-xs font-bold border transition ${
                    actionType === 'PROCESS'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-[#1F2937] text-slate-300 border-slate-700'
                  }`}
                >
                  ⚙️ Start Processing
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('PAYMENT_SENT')}
                  className={`py-2 rounded-lg text-xs font-bold border transition ${
                    actionType === 'PAYMENT_SENT'
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-[#1F2937] text-slate-300 border-slate-700'
                  }`}
                >
                  📤 Payment Sent
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('COMPLETE')}
                  className={`py-2 rounded-lg text-xs font-bold border transition ${
                    actionType === 'COMPLETE'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-[#1F2937] text-slate-300 border-slate-700'
                  }`}
                >
                  ✅ Confirm Completed
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('REJECT')}
                  className={`py-2 rounded-lg text-xs font-bold border transition ${
                    actionType === 'REJECT'
                      ? 'bg-red-600 text-white border-red-500'
                      : 'bg-[#1F2937] text-slate-300 border-slate-700'
                  }`}
                >
                  ❌ Reject & Refund
                </button>
              </div>
            </div>

            {/* Payment Reference */}
            {(actionType === 'PAYMENT_SENT' || actionType === 'COMPLETE') && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Payment Reference ID / TRX #:</label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. JC-9920194821 or Bank Ref"
                  className="w-full bg-[#1F2937] border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* Notes / Reason */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                {actionType === 'REJECT' ? 'Rejection Reason (Sent to user & releases Beans):' : 'Internal Notes (Optional):'}
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder={actionType === 'REJECT' ? 'e.g. Invalid account number or KYC mismatch.' : 'Optional notes...'}
                className="w-full bg-[#1F2937] border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 h-20"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingAction}
                onClick={handleExecuteAction}
                className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg"
              >
                {isSubmittingAction ? 'Processing...' : `Confirm ${actionType}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
