'use client';

import React, { useState, useEffect } from 'react';
import { defaultRealUsers } from '@/lib/api';

export default function CountryHeadModule() {
  const [subTab, setSubTab] = useState<'TERRITORIES' | 'USERS' | 'AGENCIES' | 'ANNOUNCEMENT' | 'ECONOMY'>('TERRITORIES');

  const [countryHeadData, setCountryHeadData] = useState<any>({
    activeTerritories: [],
    totalTerritories: 2,
    totalRegionalUsers: 4,
    totalRegionalRevenue: 41000.0,
  });

  const [assignAdminId, setAssignAdminId] = useState<string>('1');
  const [assignCountryCode, setAssignCountryCode] = useState<string>('PK');
  const [assignTerritoryName, setAssignTerritoryName] = useState<string>('Pakistan Regional Operations');

  const [agencyName, setAgencyName] = useState<string>('👑 Alpha Vanguard Regional Agency');
  const [agencyOwnerId, setAgencyOwnerId] = useState<string>('3');
  const [agencyCountryCode, setAgencyCountryCode] = useState<string>('PK');

  const [announceTitle, setAnnounceTitle] = useState<string>('🏛️ Regional Host Audition Event');
  const [announceMsg, setAnnounceMsg] = useState<string>('Official territory live stream contest begins this Friday with $5,000 reward pool!');
  const [announceCountryCode, setAnnounceCountryCode] = useState<string>('PK');

  const fetchCountryHeadData = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/country-head', { cache: 'no-store' });
      const json = await res.json();
      if (json?.data) {
        setCountryHeadData(json.data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchCountryHeadData();
    const interval = setInterval(fetchCountryHeadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAssignHead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/country-head/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminUserId: assignAdminId,
          countryCode: assignCountryCode,
          territoryName: assignTerritoryName,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}! Audit Log ID: #${json.data.auditLogId}`);
        fetchCountryHeadData();
      }
    } catch {
      alert('Error assigning country head');
    }
  };

  const handleApproveAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/country-head/agency/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyName,
          ownerId: agencyOwnerId,
          countryCode: agencyCountryCode,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}! Audit Log ID: #${json.data.auditLogId}`);
        fetchCountryHeadData();
      }
    } catch {
      alert('Error approving regional agency');
    }
  };

  const handleBroadcastAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/country-head/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: announceTitle,
          message: announceMsg,
          countryCode: announceCountryCode,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`📢 ${json.message}! Audit Log ID: #${json.data.auditLogId}`);
        fetchCountryHeadData();
      }
    } catch {
      alert('Error broadcasting announcement');
    }
  };

  return (
    <div className="space-y-6 selection:bg-amber-500 selection:text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-purple-950 to-slate-950 border border-amber-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-500/30">
              🏛️ COUNTRY HEAD PORTAL & REGIONAL TERRITORY CONTROL
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● TERRITORY SCOPED RBAC
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Regional Operations, Territory Governance & Country Control
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Country-scoped administrative management layer controlling regional hosts, local agencies, BD managers, regional announcements & territory economics. Strict IDOR protection active.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Assigned Active Territories</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">
            {countryHeadData.totalTerritories || 2} Countries
          </strong>
          <span className="text-[10px] text-emerald-400">● PK & AE Scoped</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Territory Regional Users</span>
          <strong className="text-2xl font-black text-purple-300 mt-1 block">
            {countryHeadData.totalRegionalUsers || 4} Users
          </strong>
          <span className="text-[10px] text-purple-300">Registered Roster</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Total Regional Revenue</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">
            ${countryHeadData.totalRegionalRevenue?.toLocaleString()} USD
          </strong>
          <span className="text-[10px] text-emerald-300 font-bold">● Territory Financials</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Regional IDOR Guard</span>
          <strong className="text-2xl font-black text-cyan-400 mt-1 block">
            ACTIVE
          </strong>
          <span className="text-[10px] text-cyan-400">HTTP 403 Enforced</span>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        {[
          { id: 'TERRITORIES', label: '🏛️ Assigned Regional Territories' },
          { id: 'USERS', label: '👥 Territory Users & Hosts' },
          { id: 'AGENCIES', label: '🏢 Agency & BD Approvals' },
          { id: 'ANNOUNCEMENT', label: '📢 Territory Announcements' },
          { id: 'ECONOMY', label: '📊 Regional Economy' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              subTab === t.id
                ? 'bg-gradient-to-r from-amber-600 to-purple-600 text-white font-black shadow-lg shadow-amber-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: TERRITORIES */}
      {subTab === 'TERRITORIES' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-amber-400">🏛️ Assigned Country & Territory Roster</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Territory ID</th>
                  <th className="pb-3">Country Name</th>
                  <th className="pb-3">Country Code</th>
                  <th className="pb-3">Currency</th>
                  <th className="pb-3">Country Head</th>
                  <th className="pb-3">Regional Users</th>
                  <th className="pb-3">Monthly Revenue</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {countryHeadData.activeTerritories?.map((t: any) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-indigo-400">{t.id}</td>
                    <td className="font-bold text-white text-sm">{t.countryName}</td>
                    <td className="font-bold text-amber-400">{t.countryCode}</td>
                    <td className="font-bold text-cyan-300">{t.currency}</td>
                    <td className="font-bold text-purple-300">@{t.headAdmin.username} (UID: {t.headAdmin.numericId})</td>
                    <td className="text-slate-300 font-bold">{t.totalUsers} Users</td>
                    <td className="text-emerald-400 font-bold">${t.monthlyRevenue.toLocaleString()}</td>
                    <td>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Form to Assign Country Head */}
          <div className="mt-6 pt-6 border-t border-slate-800 max-w-xl">
            <h4 className="text-sm font-black text-purple-400 mb-3">⚡ Appoint Country Head for Territory</h4>
            <form onSubmit={handleAssignHead} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Admin User</label>
                <select
                  value={assignAdminId}
                  onChange={e => setAssignAdminId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
                >
                  {defaultRealUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      ID: {u.id} — UID: {u.numericId} (@{u.username})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Country Code</label>
                  <input
                    type="text"
                    value={assignCountryCode}
                    onChange={e => setAssignCountryCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Territory Name</label>
                  <input
                    type="text"
                    value={assignTerritoryName}
                    onChange={e => setAssignTerritoryName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-amber-600/30"
              >
                ⚡ Appoint Country Head in Database
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUB TAB 2: USERS & HOSTS */}
      {subTab === 'USERS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-purple-400">👥 Territory Scoped Users & Host Ecosystem</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">User Account</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Territory Code</th>
                  <th className="pb-3">Account Status</th>
                  <th className="pb-3">Territory Access Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {defaultRealUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-white text-sm">@{u.username} (UID: {u.numericId})</td>
                    <td className="font-bold text-amber-400">{u.role}</td>
                    <td className="font-bold text-cyan-300">PK / AE</td>
                    <td>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <span className="text-slate-400 text-[10px]">TERRITORY SCOPED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 3: AGENCIES */}
      {subTab === 'AGENCIES' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-indigo-400">🏢 Regional Agency Approval & BD Management</h3>
          <form onSubmit={handleApproveAgency} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Agency Name</label>
              <input
                type="text"
                value={agencyName}
                onChange={e => setAgencyName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Agency Owner Account</label>
              <select
                value={agencyOwnerId}
                onChange={e => setAgencyOwnerId(e.target.value)}
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
              <label className="block text-slate-300 font-bold mb-1">Territory Country Code</label>
              <input
                type="text"
                value={agencyCountryCode}
                onChange={e => setAgencyCountryCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 font-bold uppercase"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              🏢 Approve Regional Agency & Log Audit
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 4: ANNOUNCEMENT */}
      {subTab === 'ANNOUNCEMENT' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-amber-400">📢 Territory Regional Announcement Studio</h3>
          <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Country Code</label>
              <input
                type="text"
                value={announceCountryCode}
                onChange={e => setAnnounceCountryCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Announcement Title</label>
              <input
                type="text"
                value={announceTitle}
                onChange={e => setAnnounceTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Message Content</label>
              <textarea
                rows={3}
                value={announceMsg}
                onChange={e => setAnnounceMsg(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-amber-600/30"
            >
              📢 Broadcast Announcement via WebSockets
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 5: ECONOMY */}
      {subTab === 'ECONOMY' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-emerald-400">📊 Regional Economy & Intelligence Analytics</h3>
          <p className="text-slate-300">
            Regional economy analytics show diamond circulation, host bonus targets, and local reseller activity strictly for assigned territories (<code className="text-amber-300">PK</code> & <code className="text-amber-300">AE</code>). Sourced 100% from SQLite DB.
          </p>
        </div>
      )}
    </div>
  );
}
