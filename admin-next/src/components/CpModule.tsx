'use client';

import React, { useState, useEffect } from 'react';
import { defaultRealUsers } from '@/lib/api';

export default function CpModule() {
  const [subTab, setSubTab] = useState<'ROSTER' | 'PENDING' | 'INTIMACY' | 'ACTIONS'>('ROSTER');

  const [cpData, setCpData] = useState<any>({
    activeCouples: [],
    pendingRequests: [],
    totalActiveCouples: 1,
    totalPendingRequests: 1,
    averageIntimacy: 12500,
  });

  const [senderId, setSenderId] = useState<string>('1');
  const [receiverId, setReceiverId] = useState<string>('2');
  const [targetCpId, setTargetCpId] = useState<string>('CP-1001');
  const [intimacyAmount, setIntimacyAmount] = useState<string>('2500');
  const [unpairReason, setUnpairReason] = useState<string>('Mutual unpair agreement');

  const fetchCpData = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/cp', { cache: 'no-store' });
      const json = await res.json();
      if (json?.data) {
        setCpData(json.data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchCpData();
    const interval = setInterval(fetchCpData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendCpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/cp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, receiverId }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}! Audit Log ID: #${json.data.auditLogId}`);
        fetchCpData();
      }
    } catch {
      alert('Error sending CP request');
    }
  };

  const handleAcceptCpRequest = async (requestId: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/cp/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}! CP ID: ${json.data.cpId}`);
        fetchCpData();
      }
    } catch {
      alert('Error accepting CP request');
    }
  };

  const handleAddIntimacy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/cp/intimacy/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpId: targetCpId, intimacyAmount }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}! Audit Log ID: #${json.data.auditLogId}`);
        fetchCpData();
      }
    } catch {
      alert('Error adding intimacy points');
    }
  };

  const handleUnpairCp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/cp/unpair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpId: targetCpId, reason: unpairReason }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}! Status: ${json.data.status}`);
        fetchCpData();
      }
    } catch {
      alert('Error unpairing CP relationship');
    }
  };

  return (
    <div className="space-y-6 selection:bg-pink-500 selection:text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-950 via-purple-950 to-slate-950 border border-pink-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-mono text-xs font-black border border-pink-500/30">
              💕 CP & INTIMACY RELATIONSHIP MANAGEMENT
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● REAL RELATIONSHIP LEDGER
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Couple Pairs, Intimacy Progression & Relationship Control
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Authoritative user-to-user CP requests, intimacy point ledger, CP rings, levels & unpair workflows. 100% database-driven source of truth.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Active CP Couples</span>
          <strong className="text-2xl font-black text-pink-400 mt-1 block">
            {cpData.totalActiveCouples} Couples
          </strong>
          <span className="text-[10px] text-pink-300">● Active Relationships</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Pending CP Requests</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">
            {cpData.totalPendingRequests} Pending
          </strong>
          <span className="text-[10px] text-amber-300 font-bold">Awaiting User Confirmation</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Average Intimacy Points</span>
          <strong className="text-2xl font-black text-cyan-400 mt-1 block">
            💖 {cpData.averageIntimacy?.toLocaleString()} Points
          </strong>
          <span className="text-[10px] text-cyan-300">● Gift & Activity Ledger</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Active Ring Entitlement</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">
            💎 Diamond Ring
          </strong>
          <span className="text-[10px] text-emerald-400">● Granted CP Ring</span>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        {[
          { id: 'ROSTER', label: '💕 Active CP Couples Roster' },
          { id: 'PENDING', label: '📬 Pending CP Requests' },
          { id: 'INTIMACY', label: '💖 Add Intimacy XP' },
          { id: 'ACTIONS', label: '⚡ Send Request & Unpair' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              subTab === t.id
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black shadow-lg shadow-pink-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: ACTIVE CP ROSTER */}
      {subTab === 'ROSTER' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-pink-400">💕 Active Couple Pairs Roster</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">CP ID</th>
                  <th className="pb-3">Partner A</th>
                  <th className="pb-3">Partner B</th>
                  <th className="pb-3">CP Level</th>
                  <th className="pb-3">Intimacy Points</th>
                  <th className="pb-3">Granted CP Ring</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {cpData.activeCouples?.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-pink-400">{c.id}</td>
                    <td className="font-bold text-white text-sm">@{c.userA.username} (UID: {c.userA.numericId})</td>
                    <td className="font-bold text-white text-sm">@{c.userB.username} (UID: {c.userB.numericId})</td>
                    <td className="text-purple-300 font-bold">CP Lv.{c.cpLevel}</td>
                    <td className="text-cyan-400 font-bold">💖 {c.intimacyPoints.toLocaleString()}</td>
                    <td className="text-amber-300 font-bold">{c.cpRingName}</td>
                    <td className="text-slate-300">{c.durationDays} Days</td>
                    <td>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 2: PENDING REQUESTS */}
      {subTab === 'PENDING' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-amber-400">📬 Pending CP Relationship Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Request ID</th>
                  <th className="pb-3">Sender Account</th>
                  <th className="pb-3">Receiver Account</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {cpData.pendingRequests?.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-amber-400">{p.id}</td>
                    <td className="font-bold text-white">@{p.userA.username} (UID: {p.userA.numericId})</td>
                    <td className="font-bold text-white">@{p.userB.username} (UID: {p.userB.numericId})</td>
                    <td>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleAcceptCpRequest(p.id)}
                        className="px-3 py-1 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[10px] font-bold transition cursor-pointer"
                      >
                        ⚡ Confirm & Accept CP
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 3: INTIMACY XP */}
      {subTab === 'INTIMACY' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-cyan-400">💖 Add Intimacy Points to CP Couple</h3>
          <form onSubmit={handleAddIntimacy} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target CP ID</label>
              <input
                type="text"
                value={targetCpId}
                onChange={e => setTargetCpId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Intimacy XP Points</label>
              <input
                type="number"
                value={intimacyAmount}
                onChange={e => setIntimacyAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 font-bold text-cyan-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-cyan-600/30"
            >
              💖 Add Intimacy & Update CP Level
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 4: ACTIONS */}
      {subTab === 'ACTIONS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Send CP Form */}
          <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-black text-pink-400">💌 Send New CP Relationship Request</h3>
            <form onSubmit={handleSendCpRequest} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Sender Account (User A)</label>
                <select
                  value={senderId}
                  onChange={e => setSenderId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold"
                >
                  {defaultRealUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      ID: {u.id} — UID: {u.numericId} (@{u.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Receiver Account (User B)</label>
                <select
                  value={receiverId}
                  onChange={e => setReceiverId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold"
                >
                  {defaultRealUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      ID: {u.id} — UID: {u.numericId} (@{u.username})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-pink-600/30"
              >
                💌 Send CP Couple Request
              </button>
            </form>
          </div>

          {/* Unpair Form */}
          <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-black text-red-400">💔 Terminate / Unpair CP Relationship</h3>
            <form onSubmit={handleUnpairCp} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target CP ID</label>
                <input
                  type="text"
                  value={targetCpId}
                  onChange={e => setTargetCpId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Unpair Reason Note</label>
                <input
                  type="text"
                  value={unpairReason}
                  onChange={e => setUnpairReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-red-600/30"
              >
                💔 Terminate & Unpair CP Relationship
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
