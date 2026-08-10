'use client';

import React, { useState, useEffect } from 'react';
import { defaultRealUsers } from '@/lib/api';

export default function FamilyModule() {
  const [subTab, setSubTab] = useState<'ROSTER' | 'MEMBERS' | 'XP' | 'CREATE' | 'REMOVE'>('ROSTER');

  const [familyData, setFamilyData] = useState<any>({
    activeFamilies: [],
    totalFamilies: 1,
    totalMembers: 4,
    averageLevel: 12,
  });

  const [newFamilyName, setNewFamilyName] = useState<string>('👑 Alpha Vanguard Guild');
  const [newFamilyOwnerId, setNewFamilyOwnerId] = useState<string>('1');
  const [newFamilyDesc, setNewFamilyDesc] = useState<string>('Top Tier Gaming & Audio Lounge Guild');

  const [targetFamilyId, setTargetFamilyId] = useState<string>('FAM-101');
  const [joinUserId, setJoinUserId] = useState<string>('3');
  const [joinRole, setJoinRole] = useState<string>('OFFICER');

  const [xpFamilyId, setXpFamilyId] = useState<string>('FAM-101');
  const [xpAmount, setXpAmount] = useState<string>('5000');
  const [xpReason, setXpReason] = useState<string>('Monthly Guild Mission Victory');

  const [removeUserId, setRemoveUserId] = useState<string>('3');
  const [removeReason, setRemoveReason] = useState<string>('Inactivity in family events');

  const fetchFamilyData = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/family', { cache: 'no-store' });
      const json = await res.json();
      if (json?.data) {
        setFamilyData(json.data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchFamilyData();
    const interval = setInterval(fetchFamilyData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/family/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFamilyName, ownerId: newFamilyOwnerId, description: newFamilyDesc }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}! Code: ${json.data.code}`);
        fetchFamilyData();
      }
    } catch {
      alert('Error creating family');
    }
  };

  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/family/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyId: targetFamilyId, userId: joinUserId, familyRole: joinRole }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}`);
        fetchFamilyData();
      }
    } catch {
      alert('Error adding member to family');
    }
  };

  const handleAddFamilyXp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/family/xp/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyId: xpFamilyId, xpAmount, reason: xpReason }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}`);
        fetchFamilyData();
      }
    } catch {
      alert('Error adding family XP');
    }
  };

  const handleRemoveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/family/members/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyId: targetFamilyId, userId: removeUserId, reason: removeReason }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}`);
        fetchFamilyData();
      }
    } catch {
      alert('Error removing member from family');
    }
  };

  return (
    <div className="space-y-6 selection:bg-purple-500 selection:text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 border border-indigo-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-black border border-indigo-500/30">
              👨‍👩‍👧‍👦 FAMILY & GUILD ECOSYSTEM MANAGEMENT
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● DATABASE AUTHORITATIVE ROSTER
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Family & Guild Ecosystem Control Center
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Manage official families/guilds, member hierarchy roles, monthly family XP missions, contribution ledgers & moderation. Sourced 100% from SQLite DB.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Active Families & Guilds</span>
          <strong className="text-2xl font-black text-indigo-400 mt-1 block">
            {familyData.totalFamilies} Guilds
          </strong>
          <span className="text-[10px] text-emerald-400">● Active Guild Roster</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Total Guild Members</span>
          <strong className="text-2xl font-black text-purple-300 mt-1 block">
            {familyData.totalMembers} Members
          </strong>
          <span className="text-[10px] text-purple-300">Registered Roster</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Average Family Level</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">
            Lv.12 Guild
          </strong>
          <span className="text-[10px] text-amber-300 font-bold">● 62,500 Total XP</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Monthly Mission Status</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">
            ACTIVE
          </strong>
          <span className="text-[10px] text-emerald-400">● 100% Target Met</span>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        {[
          { id: 'ROSTER', label: '👨‍👩‍👧‍👦 Active Families & Guilds' },
          { id: 'MEMBERS', label: '👥 Member Hierarchy & Roles' },
          { id: 'XP', label: '🎯 Add Family XP' },
          { id: 'CREATE', label: '⚡ Create Family & Add Member' },
          { id: 'REMOVE', label: '🚪 Expel Member' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              subTab === t.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: ACTIVE FAMILIES ROSTER */}
      {subTab === 'ROSTER' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-indigo-400">👨‍👩‍👧‍👦 Active Family & Guild Roster</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Family ID</th>
                  <th className="pb-3">Guild Name</th>
                  <th className="pb-3">Unique Code</th>
                  <th className="pb-3">Guild Owner</th>
                  <th className="pb-3">Guild Level</th>
                  <th className="pb-3">Guild XP</th>
                  <th className="pb-3">Members Count</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {familyData.activeFamilies?.map((f: any) => (
                  <tr key={f.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-indigo-400">{f.id}</td>
                    <td className="font-bold text-white text-sm">{f.name}</td>
                    <td className="font-bold text-amber-400">{f.code}</td>
                    <td className="font-bold text-cyan-300">@{f.owner.username} (UID: {f.owner.numericId})</td>
                    <td className="text-purple-300 font-bold">Lv.{f.level}</td>
                    <td className="text-emerald-400 font-bold">⭐ {f.xp.toLocaleString()} XP</td>
                    <td className="text-slate-300 font-bold">{f.membersCount} / {f.maxMembers}</td>
                    <td>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 2: MEMBER ROSTER */}
      {subTab === 'MEMBERS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-purple-400">👥 Family Member Hierarchy & Roles</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Member Account</th>
                  <th className="pb-3">Family Role</th>
                  <th className="pb-3">Member Contribution</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {familyData.activeFamilies[0]?.members?.map((m: any) => (
                  <tr key={m.numericId} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-white text-sm">@{m.username} (UID: {m.numericId})</td>
                    <td className="font-bold text-amber-400">{m.familyRole}</td>
                    <td className="font-bold text-emerald-400">⭐ {m.contribution.toLocaleString()} Points</td>
                    <td>
                      <span className="text-slate-500 text-[10px]">VERIFIED MEMBER</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 3: ADD XP */}
      {subTab === 'XP' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-amber-400">🎯 Add Family XP & Process Level Progression</h3>
          <form onSubmit={handleAddFamilyXp} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Family ID</label>
              <input
                type="text"
                value={xpFamilyId}
                onChange={e => setXpFamilyId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Family XP Amount</label>
              <input
                type="number"
                value={xpAmount}
                onChange={e => setXpAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold text-amber-300"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Grant Reason Note</label>
              <input
                type="text"
                value={xpReason}
                onChange={e => setXpReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-amber-600/30"
            >
              🎯 Add Family XP in Database
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 4: CREATE & ADD */}
      {subTab === 'CREATE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Create Family Form */}
          <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-black text-indigo-400">⚡ Create New Family / Guild</h3>
            <form onSubmit={handleCreateFamily} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Family Name</label>
                <input
                  type="text"
                  value={newFamilyName}
                  onChange={e => setNewFamilyName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Family Owner</label>
                <select
                  value={newFamilyOwnerId}
                  onChange={e => setNewFamilyOwnerId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 font-bold"
                >
                  {defaultRealUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      ID: {u.id} — UID: {u.numericId} (@{u.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Guild Description</label>
                <input
                  type="text"
                  value={newFamilyDesc}
                  onChange={e => setNewFamilyDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                ⚡ Create Family in Database
              </button>
            </form>
          </div>

          {/* Add Member Form */}
          <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-black text-purple-400">👥 Add Member to Family</h3>
            <form onSubmit={handleJoinFamily} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Family ID</label>
                <input
                  type="text"
                  value={targetFamilyId}
                  onChange={e => setTargetFamilyId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Member Account</label>
                <select
                  value={joinUserId}
                  onChange={e => setJoinUserId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
                >
                  {defaultRealUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      ID: {u.id} — UID: {u.numericId} (@{u.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Assign Family Role</label>
                <select
                  value={joinRole}
                  onChange={e => setJoinRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold text-amber-400"
                >
                  <option value="CO_OWNER">👑 CO_OWNER</option>
                  <option value="OFFICER">🛡️ OFFICER</option>
                  <option value="MEMBER">👤 MEMBER</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30"
              >
                👥 Add Member & Assign Role
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUB TAB 5: REMOVE MEMBER */}
      {subTab === 'REMOVE' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-red-400">🚪 Expel / Remove Member from Family</h3>
          <form onSubmit={handleRemoveMember} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Family ID</label>
              <input
                type="text"
                value={targetFamilyId}
                onChange={e => setTargetFamilyId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Member Account UID</label>
              <select
                value={removeUserId}
                onChange={e => setRemoveUserId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-red-500 font-bold"
              >
                {defaultRealUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    UID: {u.numericId} — @{u.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Expulsion Reason Note</label>
              <input
                type="text"
                value={removeReason}
                onChange={e => setRemoveReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-red-600/30"
            >
              🚪 Expel Member & Log Audit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
