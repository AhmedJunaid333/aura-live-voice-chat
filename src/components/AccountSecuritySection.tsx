import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Lock, Unlock, LogOut, Key, UserX, 
  Search, RefreshCw, Eye, CheckCircle2, AlertTriangle, Shield 
} from 'lucide-react';
import { 
  accountSecurity, UserSecurityProfile, AdminSecurityAuditLog 
} from '../services/accountSecurityService';
import { toast } from '../services/toastAndErrorService';

export const AccountSecuritySection: React.FC = () => {
  const [profile, setProfile] = useState<UserSecurityProfile>(() => accountSecurity.getSecurityProfile('100821'));
  const [auditLogs, setAuditLogs] = useState<AdminSecurityAuditLog[]>(() => accountSecurity.getAdminAuditLogs());
  const [filter, setFilter] = useState<'ALL' | 'LOCKED' | 'HIGH_RISK'>('ALL');
  const [actionReason, setActionReason] = useState('');
  const [selectedAction, setSelectedAction] = useState<'LOCK' | 'LOGOUT' | 'RESET_PASS' | null>(null);

  useEffect(() => {
    const sync = () => {
      setProfile(accountSecurity.getSecurityProfile('100821'));
      setAuditLogs(accountSecurity.getAdminAuditLogs());
    };
    sync();
    const unsub = accountSecurity.subscribe(sync);
    return () => unsub();
  }, []);

  const handleForceLogout = () => {
    accountSecurity.adminForceLogout('100821', 'Platform Compliance Admin', actionReason || 'Mandatory security revocation.');
    toast.success('User 100821 sessions terminated.');
    setSelectedAction(null);
    setActionReason('');
  };

  const handleToggleLock = () => {
    if (profile.accountLocked) {
      accountSecurity.adminUnlockAccount('100821', 'Platform Compliance Admin');
      toast.success('Account 100821 unlocked.');
    } else {
      accountSecurity.adminLockAccount('100821', 'Platform Compliance Admin', actionReason || 'Suspicious automated activity detected.');
      toast.error('Account 100821 locked for security inspection.');
    }
    setSelectedAction(null);
    setActionReason('');
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none text-white text-xs">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Identity & Access Management (IAM)
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-Time Security Enforcement</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">User Account Security & Session Governance</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit user credentials, enforce 2FA verification policies, revoke unauthorized sessions, and control fraud locks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success('Security ledger synchronized.')}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 text-xs font-bold border border-indigo-800/40 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Security Ledger
          </button>
        </div>
      </div>

      {/* User Security Dossier Card */}
      <div className="p-6 rounded-3xl bg-[#11162B] border border-indigo-900/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-900/30 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">{profile.username}</h3>
              <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded-full text-indigo-300 border border-indigo-900/40">
                UID: {profile.userId}
              </span>
              {profile.accountLocked ? (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  LOCKED
                </span>
              ) : (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ACTIVE & COMPLIANT
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Rating Score: <strong className="text-amber-300">{profile.securityScore}/100</strong> • Level: <strong className="text-emerald-400">{profile.securityRating}</strong>
            </p>
          </div>

          {/* Quick Admin Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedAction('LOGOUT')}
              className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 font-bold border border-amber-800/40 flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Force Logout
            </button>
            <button
              onClick={() => setSelectedAction('LOCK')}
              className={`px-3 py-1.5 rounded-xl font-bold border flex items-center gap-1 cursor-pointer ${
                profile.accountLocked 
                  ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-800/40' 
                  : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-800/40'
              }`}
            >
              {profile.accountLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {profile.accountLocked ? 'Unlock Account' : 'Lock Account'}
            </button>
          </div>
        </div>

        {/* Security Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-indigo-900/30">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Phone Status</span>
            <p className="font-mono text-white text-xs mt-1">{accountSecurity.maskPhone(profile.phone)}</p>
            <span className="text-[10px] text-emerald-400 font-bold">Verified & Bound</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-indigo-900/30">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Email Status</span>
            <p className="font-mono text-white text-xs mt-1">{accountSecurity.maskEmail(profile.email)}</p>
            <span className="text-[10px] text-emerald-400 font-bold">Verified & Bound</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-indigo-900/30">
            <span className="text-[10px] text-slate-400 font-bold uppercase">2FA Policy</span>
            <p className="font-bold text-white text-xs mt-1">
              {profile.twoFactorEnabled ? 'SMS_OTP (Active)' : 'Disabled'}
            </p>
            <span className={`text-[10px] font-bold ${profile.twoFactorEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
              {profile.twoFactorEnabled ? 'Full Biometric/OTP' : 'Warning: Not Enabled'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-indigo-900/30">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Password Hash</span>
            <p className="font-mono text-white text-xs mt-1">PBKDF2/SHA-256</p>
            <span className="text-[10px] text-slate-400">Updated {profile.passwordLastChangedAt}</span>
          </div>
        </div>
      </div>

      {/* Admin Security Audit Log */}
      <div className="p-5 rounded-3xl bg-[#11162B] border border-indigo-900/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-indigo-900/30 pb-2">
          <span className="font-bold text-white text-sm">Administrative Security Audit Trail</span>
          <span className="text-[10px] text-slate-400 font-mono">Immutable Compliance Records</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {auditLogs.length === 0 ? (
            <p className="text-slate-500 py-4 text-center">No administrative security overrides recorded yet.</p>
          ) : (
            auditLogs.map(log => (
              <div key={log.id} className="p-3 rounded-2xl bg-black/40 border border-indigo-900/20 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-300">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">By: {log.adminName}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">Reason: "{log.reason}"</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">{log.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal for Admin Actions */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#140D24] border border-indigo-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3">
              <h3 className="font-extrabold text-white text-base">
                Confirm {selectedAction === 'LOCK' ? 'Account Lock Status' : 'Force Session Revocation'}
              </h3>
              <button onClick={() => setSelectedAction(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Administrative Reason & Audit Note:</label>
              <textarea 
                rows={2}
                placeholder="Reason for administrative security action..."
                value={actionReason}
                onChange={e => setActionReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-black/40 border border-indigo-900/40 text-white focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setSelectedAction(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={selectedAction === 'LOCK' ? handleToggleLock : handleForceLogout}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg"
              >
                Execute Action
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
