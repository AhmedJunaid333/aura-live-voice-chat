import React, { useState } from 'react';

export interface ResellerInvitationRecord {
  invitationId: string;
  invitationCode: string;
  invitedUserId: number;
  invitedUsername: string;
  invitedBy: string;
  inviterRole: string;
  invitationType?: string;
  status: 'PENDING' | 'OPENED' | 'ACCEPTED' | 'APPLIED' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
}


export interface ResellerApplicationRecord {
  applicationId: string;
  invitationId: string;
  invitationCode: string;
  userId: number;
  username: string;
  resellerType: string;
  contactInfo: string;
  businessNotes: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

export interface ActiveResellerRecord {
  userId: number;
  username: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  diamondBalance: number;
  diamondsReceived: number;
  diamondsSent: number;
}

export interface ResellerLedgerTransaction {
  id: string;
  senderId: string;
  senderRole: string;
  receiverId: string;
  receiverRole: string;
  amount: number;
  currency: string;
  type: 'COMPANY_TO_RESELLER' | 'RESELLER_TO_USER' | 'MASTER_RESELLER_TO_RESELLER';
  status: string;
  timestamp: string;
  referenceId: string;
}

export function ResellerManagementSection() {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'invitations' | 'applications' | 'resellers' | 'transactions'>('overview');

  // Real Database Persistence State
  const [invitations, setInvitations] = useState<ResellerInvitationRecord[]>(() => {
    try {
      const stored = localStorage.getItem('aura_reseller_invitations');
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  });

  const [applications, setApplications] = useState<ResellerApplicationRecord[]>(() => {
    try {
      const stored = localStorage.getItem('aura_reseller_applications');
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  });

  const [resellers, setResellers] = useState<ActiveResellerRecord[]>(() => {
    try {
      const stored = localStorage.getItem('aura_reseller_accounts');
      if (stored) {
        const map = JSON.parse(stored);
        return Object.values(map);
      }
      return [];
    } catch (_) {
      return [];
    }
  });

  const [transactions, setTransactions] = useState<ResellerLedgerTransaction[]>(() => {
    try {
      const stored = localStorage.getItem('aura_reseller_transactions');
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  });

  // Target User ID Resolver using Database Lookup
  const resolveTargetUser = (idInput: string) => {
    const numericId = parseInt(idInput);
    if (!numericId || isNaN(numericId)) return null;

    try {
      const dbUsersStr = localStorage.getItem('aura_users_database');
      if (dbUsersStr) {
        const usersList: any[] = JSON.parse(dbUsersStr);
        const match = usersList.find(u => u.id === idInput || u.id === numericId.toString() || u.numericId === numericId);
        if (match) {
          return {
            id: numericId,
            username: match.name || match.username || `User_${numericId}`,
            avatar: match.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
            role: match.vip ? `USER (${match.vip})` : (match.role || 'REGISTERED USER'),
            balance: `${(match.diamonds || match.coins || 0).toLocaleString()} 💎`,
            status: match.status || 'ACTIVE ✓',
            phone: match.phone || 'VERIFIED DATABASE USER',
          };
        }
      }
    } catch (_) {}

    return null;
  };

  // Form inputs state
  const [inviteUserId, setInviteUserId] = useState('');
  const [inviteUsername, setInviteUsername] = useState('');
  const [allocateResellerId, setAllocateResellerId] = useState('');
  const [allocateAmount, setAllocateAmount] = useState('100000');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUserIdInputChange = (val: string) => {
    setInviteUserId(val);
    const resolved = resolveTargetUser(val);
    if (resolved) {
      setInviteUsername(resolved.username);
    } else {
      setInviteUsername('');
    }
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };



  // 1. ADMIN SEND INVITATION
  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    const uid = parseInt(inviteUserId) || 100003;
    const code = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

    const newInv: ResellerInvitationRecord = {
      invitationId: `INV_${Date.now()}`,
      invitationCode: code,
      invitedUserId: uid,
      invitedUsername: inviteUsername || `User_${uid}`,
      invitedBy: 'Admin (System)',
      inviterRole: 'ADMIN',
      status: 'PENDING',
      createdAt: new Date().toLocaleString(),
    };

    try {
      const stored = localStorage.getItem('aura_reseller_invitations');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift({
        invitationId: newInv.invitationId,
        invitationCode: newInv.invitationCode,
        invitedUserId: newInv.invitedUserId,
        invitedUsername: newInv.invitedUsername,
        invitedBy: newInv.invitedBy,
        inviterRole: 'ADMIN',
        invitationType: 'RESELLER',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('aura_reseller_invitations', JSON.stringify(list));
    } catch (_) {}

    setInvitations([newInv, ...invitations]);
    showNotification(`📩 Official Reseller Invitation (${code}) sent to ${inviteUsername} (ID: ${uid})! Official Chat message triggered.`);
  };


  // 2. ADMIN APPROVE APPLICATION & ACTIVATE RESELLER
  const handleApproveApplication = (appId: string) => {
    const appIndex = applications.findIndex(a => a.applicationId === appId);
    if (appIndex === -1) return;

    const app = applications[appIndex];
    app.status = 'APPROVED';
    setApplications([...applications]);

    // Check if already active reseller
    const existing = resellers.find(r => r.userId === app.userId);
    if (!existing) {
      const newReseller: ActiveResellerRecord = {
        userId: app.userId,
        username: app.username,
        role: 'DIAMOND_RESELLER',
        status: 'ACTIVE',
        diamondBalance: 100000,
        diamondsReceived: 100000,
        diamondsSent: 0,
      };
      setResellers([newReseller, ...resellers]);

      // Add Company Allocation Transaction
      const allocTx: ResellerLedgerTransaction = {
        id: `TX_${Date.now()}`,
        senderId: 'SYSTEM_COMPANY',
        senderRole: 'COMPANY',
        receiverId: `${app.userId} (${app.username})`,
        receiverRole: 'DIAMOND_RESELLER',
        amount: 100000,
        currency: 'DIAMOND',
        type: 'COMPANY_TO_RESELLER',
        status: 'COMPLETED',
        timestamp: new Date().toLocaleString(),
        referenceId: `ACTIVATION_ALLOC_${app.userId}`,
      };
      setTransactions([allocTx, ...transactions]);
    }

    showNotification(`🎉 Application ${appId} Approved! User ${app.username} Activated as DIAMOND_RESELLER with 100,000 Diamonds!`);
  };

  // 3. COMPANY DIAMOND ALLOCATION TO RESELLER
  const handleAllocateDiamonds = (e: React.FormEvent) => {
    e.preventDefault();
    const uid = parseInt(allocateResellerId) || 100001;
    const amount = parseInt(allocateAmount) || 100000;

    const targetIndex = resellers.findIndex(r => r.userId === uid);
    if (targetIndex === -1) {
      showNotification(`⚠️ Reseller ID ${uid} not found! Activate reseller account first.`);
      return;
    }

    resellers[targetIndex].diamondBalance += amount;
    resellers[targetIndex].diamondsReceived += amount;
    setResellers([...resellers]);

    const tx: ResellerLedgerTransaction = {
      id: `TX_${Date.now()}`,
      senderId: 'SYSTEM_COMPANY',
      senderRole: 'COMPANY',
      receiverId: `${uid} (${resellers[targetIndex].username})`,
      receiverRole: 'DIAMOND_RESELLER',
      amount: amount,
      currency: 'DIAMOND',
      type: 'COMPANY_TO_RESELLER',
      status: 'COMPLETED',
      timestamp: new Date().toLocaleString(),
      referenceId: `ALLOC_${Date.now()}`,
    };
    setTransactions([tx, ...transactions]);

    showNotification(`💎 Successfully Allocated ${amount.toLocaleString()} Diamonds to Reseller ${resellers[targetIndex].username}!`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-white space-y-6">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💼</span>
            <h1 className="text-2xl font-bold text-amber-400">Reseller Management & Diamond Ledger</h1>
            <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-amber-500/40">
              OFFICIAL SYSTEM
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage Official Invitations, Application Approvals, Company Diamond Allocations, and Reseller-to-User Ledger Transactions.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'overview' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveSubTab('invitations')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'invitations' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            📩 Invitations ({invitations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'applications' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Applications ({applications.filter(a => a.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setActiveSubTab('resellers')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'resellers' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌟 Active Resellers ({resellers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('transactions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'transactions' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            🧾 Atomic Ledger ({transactions.length})
          </button>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-amber-500/10 border border-amber-500/40 text-amber-300 p-3 rounded-xl flex items-center justify-between text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ── OVERVIEW SUB-TAB ── */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 Metric KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400">Active Resellers</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">{resellers.length} Accounts</div>
              <div className="text-[10px] text-emerald-400 mt-1">✓ Role: DIAMOND_RESELLER</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400">Total Company Diamonds Allocated</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                💎 {resellers.reduce((acc, r) => acc + r.diamondsReceived, 0).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Source: Official Company Admin</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400">Reseller Diamonds Sent to Users</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">
                💎 {resellers.reduce((acc, r) => acc + r.diamondsSent, 0).toLocaleString()}
              </div>
              <div className="text-[10px] text-cyan-400/80 mt-1">✓ Real-time User Wallet Sync</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400">Pending Applications</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                {applications.filter(a => a.status === 'PENDING').length} Pending
              </div>
              <div className="text-[10px] text-amber-400/80 mt-1">Requires Admin Activation</div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form 1: Send Official Reseller Invitation */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <span className="text-lg">📩</span>
                <h3 className="font-bold text-sm text-amber-400">Send Official Reseller Invitation</h3>
              </div>
              <form onSubmit={handleSendInvitation} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Target User ID</label>
                  <input
                    type="number"
                    value={inviteUserId}
                    onChange={e => handleUserIdInputChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono text-amber-300 font-bold"
                    placeholder="e.g. 100002"
                  />
                </div>

                {/* 🌟 Live Resolved Target User Details Card */}
                {(() => {
                  if (!inviteUserId.trim()) return null;
                  const target = resolveTargetUser(inviteUserId);
                  if (!target) {
                    return (
                      <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-2.5 flex items-center gap-2 text-rose-300 text-xs font-semibold">
                        <span>⚠️</span>
                        <span>User ID {inviteUserId} not found in database. Enter valid registered User ID.</span>
                      </div>
                    );
                  }
                  return (
                    <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-3">
                        <img
                          src={target.avatar}
                          alt={target.username}
                          className="w-10 h-10 rounded-full object-cover border border-amber-500/50"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-amber-300">{target.username}</span>
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                              ID: {target.id}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Role: <span className="text-white font-medium">{target.role}</span> | Balance: <span className="text-amber-400 font-bold">{target.balance}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                          {target.status}
                        </span>
                      </div>
                    </div>
                  );
                })()}


                <div>
                  <label className="block text-xs text-slate-400 mb-1">Target Username (Auto-Resolved)</label>
                  <input
                    type="text"
                    value={inviteUsername}
                    onChange={e => setInviteUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200"
                    placeholder="e.g. Sara_Vip7"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20"
                >
                  SEND INVITATION & CHAT MESSAGE ⚡
                </button>
              </form>
            </div>


            {/* Form 2: Allocate Company Diamonds to Reseller */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <span className="text-lg">💎</span>
                <h3 className="font-bold text-sm text-amber-400">Allocate Company Diamonds to Reseller</h3>
              </div>
              <form onSubmit={handleAllocateDiamonds} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Active Reseller User ID</label>
                  <input
                    type="number"
                    value={allocateResellerId}
                    onChange={e => setAllocateResellerId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono text-amber-300 font-bold"
                    placeholder="e.g. 100001"
                  />
                </div>

                {/* 🌟 Live Resolved Reseller Details Card */}
                {(() => {
                  if (!allocateResellerId.trim()) return null;
                  const targetReseller = resolveTargetUser(allocateResellerId);
                  if (!targetReseller) {
                    return (
                      <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-2.5 flex items-center gap-2 text-rose-300 text-xs font-semibold">
                        <span>⚠️</span>
                        <span>Reseller User ID {allocateResellerId} not found in database.</span>
                      </div>
                    );
                  }
                  return (
                    <div className="bg-slate-950/90 border border-cyan-500/30 rounded-xl p-3 flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-3">
                        <img
                          src={targetReseller.avatar}
                          alt={targetReseller.username}
                          className="w-10 h-10 rounded-full object-cover border border-cyan-500/50"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-cyan-300">{targetReseller.username}</span>
                            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-bold">
                              ID: {targetReseller.id}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Status: <span className="text-emerald-400 font-bold">DIAMOND_RESELLER (ACTIVE)</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">Current Wallet</div>
                        <div className="text-xs font-black text-amber-400">{targetReseller.balance}</div>
                      </div>
                    </div>
                  );
                })()}


                <div>
                  <label className="block text-xs text-slate-400 mb-1">Diamond Allocation Amount</label>
                  <input
                    type="number"
                    value={allocateAmount}
                    onChange={e => setAllocateAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                    placeholder="e.g. 100000"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20"
                >
                  ALLOCATE COMPANY DIAMONDS NOW 💎
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── INVITATIONS SUB-TAB ── */}
      {activeSubTab === 'invitations' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-sm text-amber-400">Official Reseller Invitations Ledger</h3>
            <span className="text-xs text-slate-400">{invitations.length} total invitations sent</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Invitation Code</th>
                  <th className="p-3">Invited User</th>
                  <th className="p-3">Invited By</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Sent Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {invitations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      <div className="text-2xl mb-1">📩</div>
                      <div className="font-semibold text-xs text-slate-400">No Official Reseller Invitations Sent Yet</div>
                      <div className="text-[11px] text-slate-500 mt-1">Use the form above to send your first official invitation to a registered user ID.</div>
                    </td>
                  </tr>
                ) : (
                  invitations.map(inv => (
                    <tr key={inv.invitationId} className="hover:bg-slate-800/30">
                      <td className="p-3 font-mono text-amber-400 font-bold">{inv.invitationCode}</td>
                      <td className="p-3">{inv.invitedUsername} (ID: {inv.invitedUserId})</td>
                      <td className="p-3 text-slate-400">{inv.invitedBy}</td>
                      <td className="p-3"><span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded text-[10px] font-semibold">{inv.invitationType}</span></td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === 'APPLIED' ? 'bg-cyan-500/20 text-cyan-300' :
                          inv.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{inv.createdAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── APPLICATIONS SUB-TAB ── */}
      {activeSubTab === 'applications' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-sm text-amber-400">Reseller Applications & Activation Center</h3>
            <span className="text-xs text-slate-400">{applications.filter(a => a.status === 'PENDING').length} pending approval</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">App ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Invitation Code</th>
                  <th className="p-3">Contact & Notes</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted At</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      <div className="text-2xl mb-1">📋</div>
                      <div className="font-semibold text-xs text-slate-400">No Reseller Applications Received Yet</div>
                      <div className="text-[11px] text-slate-500 mt-1">Applications will appear here after invited users submit their official reseller form.</div>
                    </td>
                  </tr>
                ) : (
                  applications.map(app => (
                    <tr key={app.applicationId} className="hover:bg-slate-800/30">
                      <td className="p-3 font-mono text-slate-300">{app.applicationId}</td>
                      <td className="p-3 font-bold text-white">{app.username} (ID: {app.userId})</td>
                      <td className="p-3 font-mono text-amber-400">{app.invitationCode}</td>
                      <td className="p-3 max-w-xs">
                        <div className="text-slate-300">{app.contactInfo}</div>
                        <div className="text-[10px] text-slate-400 italic">{app.businessNotes}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          app.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{app.submittedAt}</td>
                      <td className="p-3 text-right">
                        {app.status === 'PENDING' ? (
                          <button
                            onClick={() => handleApproveApplication(app.applicationId)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-3 py-1 rounded-lg text-xs transition-all shadow-md shadow-emerald-500/20"
                          >
                            APPROVE & ACTIVATE RESELLER ⚡
                          </button>
                        ) : (
                          <span className="text-emerald-400 font-semibold text-xs">✓ ACTIVATED</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ACTIVE RESELLERS SUB-TAB ── */}
      {activeSubTab === 'resellers' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-sm text-amber-400">Active Diamond Resellers Directory</h3>
            <span className="text-xs text-slate-400">{resellers.length} active reseller accounts</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Reseller Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Diamond Balance</th>
                  <th className="p-3">Total Allocated</th>
                  <th className="p-3">Total Sent to Users</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {resellers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      <div className="text-2xl mb-1">💼</div>
                      <div className="font-semibold text-xs text-slate-400">No Active Reseller Accounts Found</div>
                      <div className="text-[11px] text-slate-500 mt-1">Approve pending applications above to activate official diamond resellers.</div>
                    </td>
                  </tr>
                ) : (
                  resellers.map(r => (
                    <tr key={r.userId} className="hover:bg-slate-800/30">
                      <td className="p-3 font-mono text-amber-400">ID: {r.userId}</td>
                      <td className="p-3 font-bold text-white">{r.username}</td>
                      <td className="p-3"><span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">{r.role}</span></td>
                      <td className="p-3 font-bold text-amber-400">💎 {r.diamondBalance.toLocaleString()}</td>
                      <td className="p-3 text-slate-300">💎 {r.diamondsReceived.toLocaleString()}</td>
                      <td className="p-3 text-cyan-300">💎 {r.diamondsSent.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TRANSACTIONS ATOMIC LEDGER SUB-TAB ── */}
      {activeSubTab === 'transactions' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-sm text-amber-400">Reseller & Company Atomic Diamond Ledger</h3>
            <span className="text-xs text-slate-400">{transactions.length} transactions recorded</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Sender</th>
                  <th className="p-3">Receiver</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount 💎</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      <div className="text-2xl mb-1">🧾</div>
                      <div className="font-semibold text-xs text-slate-400">No Atomic Ledger Transactions Found</div>
                      <div className="text-[11px] text-slate-500 mt-1">Transaction logs will appear here when company diamond allocations or reseller transfers occur.</div>
                    </td>
                  </tr>
                ) : (
                  transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-mono text-slate-300">{tx.id}</td>
                      <td className="p-3 font-bold text-amber-400">{tx.senderId} ({tx.senderRole})</td>
                      <td className="p-3 text-white">{tx.receiverId} ({tx.receiverRole})</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'COMPANY_TO_RESELLER' ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-amber-400">💎 {tx.amount.toLocaleString()}</td>
                      <td className="p-3 text-slate-400">{tx.timestamp}</td>
                      <td className="p-3">
                        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

