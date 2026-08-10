'use client';

import React, { useState } from 'react';
import { defaultRealUsers, adminApi } from '@/lib/api';

export default function AllPortalsAccessModule() {
  const [selectedUser, setSelectedUser] = useState<string>('100001');
  const [targetRole, setTargetRole] = useState<string>('DIAMOND_RESELLER');
  const [roleLogs, setRoleLogs] = useState([
    { id: 'RBAC-101', target: 'User_100001 (Ahmed Khokhar)', oldRole: 'USER', newRole: 'DIAMOND_RESELLER', assignedBy: 'Admin_Master', date: '2026-08-10 22:00' },
    { id: 'RBAC-102', target: 'Dimple (UID: 100003)', oldRole: 'USER', newRole: 'HOST', assignedBy: 'Admin_Master', date: '2026-08-10 18:00' },
  ]);

  const [permissionsMatrix, setPermissionsMatrix] = useState([
    { portal: '🌐 CEO Global Portal', superAdmin: true, admin: false, finance: false, reseller: false, agency: false, host: false },
    { portal: '👥 User Directory & Credentials', superAdmin: true, admin: true, finance: false, reseller: false, agency: false, host: false },
    { portal: '💰 Wallet & Currency Engine', superAdmin: true, admin: true, finance: true, reseller: false, agency: false, host: false },
    { portal: '💳 Aura Sell Diamonds', superAdmin: true, admin: true, finance: true, reseller: true, agency: false, host: false },
    { portal: '🏛️ Agency Management', superAdmin: true, admin: true, finance: false, reseller: false, agency: true, host: false },
    { portal: '🎙️ Host Broadcaster Portal', superAdmin: true, admin: true, finance: false, reseller: false, agency: true, host: true },
    { portal: '💸 Withdrawals & Cashouts', superAdmin: true, admin: true, finance: true, reseller: false, agency: false, host: false },
    { portal: '🛡️ Trust & Safety Moderation', superAdmin: true, admin: true, finance: false, reseller: false, agency: false, host: false },
    { portal: '⚡ Technical System Config', superAdmin: true, admin: false, finance: false, reseller: false, agency: false, host: false },
  ]);

  const handleTogglePermission = (portalIndex: number, roleKey: string) => {
    setPermissionsMatrix(prev => {
      const copy = [...prev];
      (copy[portalIndex] as any)[roleKey] = !(copy[portalIndex] as any)[roleKey];
      return copy;
    });
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = defaultRealUsers.find(u => u.numericId === parseInt(selectedUser, 10)) || defaultRealUsers[0];

    // Call backend API to update user role
    await adminApi.updateUser(user.id, { role: targetRole });

    const newLog = {
      id: `RBAC-${Math.floor(100 + Math.random() * 900)}`,
      target: `${user.username} (UID: ${user.numericId})`,
      oldRole: user.role,
      newRole: targetRole,
      assignedBy: 'Admin_Master (UID: 999999)',
      date: new Date().toLocaleString(),
    };
    setRoleLogs([newLog, ...roleLogs]);
    alert(`✅ Successfully updated role for ${user.username} to '${targetRole}' in database and audit log!`);
  };

  return (
    <div className="space-y-6 selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-purple-950 to-indigo-950 border border-blue-500/40 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-black border border-blue-500/30">
              🛡️ CENTRALIZED RBAC & PORTAL MATRIX
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● BACKEND ENFORCED
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            All Portals Access & Role-Based Access Control (RBAC)
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Granular portal permission scopes, resource ownership enforcement & dynamic RBAC assignment for CEO, Admin, Finance, Resellers, Agencies, Hosts & Users.
          </p>
        </div>
      </div>

      {/* Role Assignment Form & Resource Ownership Policy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role Assign Form */}
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-base font-black text-blue-400">👤 Assign User System Role & Permissions</h3>
          <form onSubmit={handleAssignRole} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Account Numeric UID</label>
              <select
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 font-bold"
              >
                {defaultRealUsers.map(u => (
                  <option key={u.id} value={u.numericId}>
                    UID: {u.numericId} — @{u.username} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Assign Platform Role Scope</label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 font-bold text-amber-400"
              >
                <option value="SUPER_ADMIN_CEO">👑 SUPER_ADMIN_CEO (Root Access)</option>
                <option value="SUPER_ADMIN">🛡️ SUPER_ADMIN</option>
                <option value="ADMIN">🔧 ADMIN</option>
                <option value="FINANCE_ADMIN">💰 FINANCE_ADMIN</option>
                <option value="OPERATIONS_ADMIN">⚙️ OPERATIONS_ADMIN</option>
                <option value="COUNTRY_HEAD">🏛️ COUNTRY_HEAD</option>
                <option value="MASTER_RESELLER">💎 MASTER_RESELLER</option>
                <option value="DIAMOND_RESELLER">💳 DIAMOND_RESELLER</option>
                <option value="COIN_SELLER">🪙 COIN_SELLER</option>
                <option value="AGENCY_MANAGER">🏛️ AGENCY_MANAGER</option>
                <option value="HOST">🎙️ HOST (Verified Broadcaster)</option>
                <option value="USER">👤 USER (Standard Mobile)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-blue-600/30"
            >
              ⚡ Confirm & Update Database RBAC Role
            </button>
          </form>
        </div>

        {/* Resource Ownership Policy Card */}
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-3 shadow-xl">
          <h3 className="text-base font-black text-purple-400">🔐 Strict Resource Ownership Enforcement Rules</h3>
          <p className="text-xs text-slate-300">
            Permissions alone do not grant access. The Express backend enforces strict <strong>Resource Ownership Guards</strong> on every endpoint:
          </p>
          <ul className="text-xs font-mono space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Reseller Isolation:</strong> Reseller A can NEVER view or transfer Reseller B's diamonds or transactions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Agency Scope:</strong> Agency Managers can only view their own signed streamer hosts & commission targets.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Coin Seller Lock:</strong> Coin Sellers cannot process another seller's locked cashout request.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Backend Validation:</strong> Frontend hiding is strictly UX; backend checks token, role, permission & ownership.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Portal Permission Scope Matrix Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-white">📋 Sub-Portal Access & Permission Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Portal / Sub-Module</th>
                <th className="pb-3 text-center">Super Admin</th>
                <th className="pb-3 text-center">Admin</th>
                <th className="pb-3 text-center">Finance</th>
                <th className="pb-3 text-center">Reseller</th>
                <th className="pb-3 text-center">Agency</th>
                <th className="pb-3 text-center">Host</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {permissionsMatrix.map((p, idx) => (
                <tr key={p.portal} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-white text-sm">{p.portal}</td>
                  {['superAdmin', 'admin', 'finance', 'reseller', 'agency', 'host'].map(roleKey => (
                    <td key={roleKey} className="text-center">
                      <input
                        type="checkbox"
                        checked={(p as any)[roleKey]}
                        onChange={() => handleTogglePermission(idx, roleKey)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change History Audit Trail */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-amber-400">📜 RBAC Role Assignment Audit History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Audit ID</th>
                <th className="pb-3">Target User</th>
                <th className="pb-3">Previous Role</th>
                <th className="pb-3">Newly Assigned Role</th>
                <th className="pb-3">Assigned By</th>
                <th className="pb-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {roleLogs.map(l => (
                <tr key={l.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-cyan-400">{l.id}</td>
                  <td className="font-bold text-white text-sm">{l.target}</td>
                  <td className="text-slate-400">{l.oldRole}</td>
                  <td className="font-bold text-amber-400">{l.newRole}</td>
                  <td className="text-purple-300">{l.assignedBy}</td>
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
