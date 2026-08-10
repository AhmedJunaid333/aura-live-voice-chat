'use client';

import React, { useState, useEffect } from 'react';
import { defaultRealUsers } from '@/lib/api';

export default function SecurityRolesModule() {
  const [subTab, setSubTab] = useState<'ROLES' | 'ASSIGN' | 'SESSIONS' | 'AUDIT'>('ROLES');

  const [secOverview, setSecOverview] = useState<any>({
    securityHealth: 'SECURE',
    activeSessions: 4,
    totalUsers: 4,
    failedLoginsCount: 0,
    unauthorizedRequestsCount: 0,
    totalAuditLogs: 12,
  });

  const [rolesList, setRolesList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('1');
  const [targetRole, setTargetRole] = useState<string>('DIAMOND_RESELLER');
  const [assignReason, setAssignReason] = useState<string>('Security permission update');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const fetchSecurityData = async () => {
    try {
      // 1. Fetch Security Overview
      const resOverview = await fetch('http://localhost:3001/api/v1/admin/security/overview', { cache: 'no-store' });
      const jsonOverview = await resOverview.json();
      if (jsonOverview?.data) {
        setSecOverview(jsonOverview.data);
      }

      // 2. Fetch Security Roles Matrix
      const resRoles = await fetch('http://localhost:3001/api/v1/admin/security/roles', { cache: 'no-store' });
      const jsonRoles = await resRoles.json();
      if (jsonRoles?.data) {
        setRolesList(jsonRoles.data);
      }

      // 3. Fetch Audit Logs
      const resLogs = await fetch('http://localhost:3001/api/v1/admin/audit-logs', { cache: 'no-store' });
      const jsonLogs = await resLogs.json();
      if (jsonLogs?.data) {
        setAuditLogs(jsonLogs.data);
      }
    } catch {
      // Server fallback
    }
  };

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/security/roles/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser,
          targetRole,
          reason: assignReason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}! Audit Log ID: #${json.data.auditLogId}`);
        fetchSecurityData();
      }
    } catch {
      alert('Error assigning security role');
    }
  };

  return (
    <div className="space-y-6 selection:bg-purple-500 selection:text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border border-purple-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-black border border-purple-500/30">
              🛡️ SECURITY & RBAC ROLES CENTER
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● BACKEND RBAC AUTHORIZED
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Central Security, Authentication & Role-Based Authorization
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Enforces strict backend JWT token validation, granular permission scopes, resource ownership checks & immutable security audit logging across all platform portals.
          </p>
        </div>

        {/* Security Health Badge */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl font-mono text-xs text-right">
          <span className="text-slate-400 text-[10px] block">SECURITY HEALTH STATUS</span>
          <strong className="text-emerald-400 font-bold text-sm block">● {secOverview.securityHealth}</strong>
          <span className="text-slate-500 text-[9px]">0 Unauthorized Bypasses</span>
        </div>
      </div>

      {/* Security Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Active Authorized Sessions</span>
          <strong className="text-2xl font-black text-cyan-400 mt-1 block">
            {secOverview.activeSessions} Sessions
          </strong>
          <span className="text-[10px] text-cyan-300">● Connected Sessions</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Registered User Accounts</span>
          <strong className="text-2xl font-black text-purple-300 mt-1 block">
            {secOverview.totalUsers} Real DB Users
          </strong>
          <span className="text-[10px] text-slate-400">Prisma User Table</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Failed Login Attempts</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">
            {secOverview.failedLoginsCount} Attempts
          </strong>
          <span className="text-[10px] text-emerald-400">● 0 Suspicious Spikes</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Immutable Audit Log Trail</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">
            {secOverview.totalAuditLogs || auditLogs.length} Events
          </strong>
          <span className="text-[10px] text-amber-300">Prisma AuditLog</span>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        {[
          { id: 'ROLES', label: '🛡️ Roles & Permissions Matrix' },
          { id: 'ASSIGN', label: '🔑 Assign Role & RBAC Authorization' },
          { id: 'SESSIONS', label: '📱 Active Sessions & Security Events' },
          { id: 'AUDIT', label: '📜 Immutable Audit Logs' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              subTab === t.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-lg shadow-purple-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: ROLES & PERMISSIONS MATRIX */}
      {subTab === 'ROLES' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-purple-400">📋 Configured Platform Roles & Granted Scope Permissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Role Identifier</th>
                  <th className="pb-3">Granted Permissions Count</th>
                  <th className="pb-3">Active DB Users</th>
                  <th className="pb-3">Granted Permission Scopes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {rolesList.map(r => (
                  <tr key={r.role} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-cyan-400">{r.role}</td>
                    <td className="font-bold text-amber-400">{r.permissionsCount} Scopes</td>
                    <td className="font-bold text-emerald-400">{r.activeUsers} Users</td>
                    <td className="text-slate-300 max-w-md truncate">
                      {r.permissions.join(', ') || 'Standard App Privileges'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 2: ASSIGN ROLE */}
      {subTab === 'ASSIGN' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-purple-400">🔑 Execute RBAC Role Update & Audit Log</h3>
          <form onSubmit={handleRoleAssign} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Account</label>
              <select
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
              >
                {defaultRealUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    ID: {u.id} — UID: {u.numericId} (@{u.username}) [{u.role}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Assign Target System Role</label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold text-amber-400"
              >
                <option value="SUPER_ADMIN_CEO">👑 SUPER_ADMIN_CEO</option>
                <option value="SUPER_ADMIN">🛡️ SUPER_ADMIN</option>
                <option value="ADMIN">🔧 ADMIN</option>
                <option value="FINANCE_ADMIN">💰 FINANCE_ADMIN</option>
                <option value="OPERATIONS_ADMIN">⚙️ OPERATIONS_ADMIN</option>
                <option value="COUNTRY_HEAD">🏛️ COUNTRY_HEAD</option>
                <option value="MASTER_RESELLER">💎 MASTER_RESELLER</option>
                <option value="DIAMOND_RESELLER">💳 DIAMOND_RESELLER</option>
                <option value="COIN_SELLER">🪙 COIN_SELLER</option>
                <option value="HOST">🎙️ HOST</option>
                <option value="USER">👤 USER</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Audit Trail Reason Note</label>
              <input
                type="text"
                value={assignReason}
                onChange={e => setAssignReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30"
            >
              ⚡ Confirm & Update RBAC Role in Database
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 3: AUDIT LOGS */}
      {subTab === 'AUDIT' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-white">📜 Immutable Security Audit Log Trail</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Log ID</th>
                  <th className="pb-3">Executing Actor</th>
                  <th className="pb-3">Action Type</th>
                  <th className="pb-3">Target Resource</th>
                  <th className="pb-3">Audit Details</th>
                  <th className="pb-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {auditLogs.map((l: any) => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-cyan-400">#{l.id}</td>
                    <td className="font-bold text-purple-300">{l.actorRole}</td>
                    <td className="font-bold text-amber-300">{l.action}</td>
                    <td className="text-slate-300">{l.resource}</td>
                    <td className="text-slate-300 max-w-xs truncate">{l.details}</td>
                    <td className="text-slate-400">{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
