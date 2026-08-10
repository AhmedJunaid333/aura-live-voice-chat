import React, { useState, useEffect } from 'react';
import { 
  UserCheck, Shield, CheckCircle2, XCircle, AlertTriangle, 
  Trash2, Eye, History, Sparkles, RefreshCw, Filter 
} from 'lucide-react';
import { userProfileEngine, UserProfileData, ProfileAuditRecord } from '../services/userProfileService';
import { toast } from '../services/toastAndErrorService';

export const ProfileModerationSection: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileData>(() => userProfileEngine.getProfile());
  const [auditLogs, setAuditLogs] = useState<ProfileAuditRecord[]>(() => userProfileEngine.getAuditLogs());
  const [activeTab, setActiveTab] = useState<'PROFILES' | 'PHOTOS_QUEUE' | 'AUDIT_LOGS'>('PROFILES');

  useEffect(() => {
    const sync = () => {
      setProfile(userProfileEngine.getProfile());
      setAuditLogs(userProfileEngine.getAuditLogs());
    };
    sync();
    const unsub = userProfileEngine.subscribe(sync);
    return () => unsub();
  }, []);

  const handleVerifyAccount = () => {
    userProfileEngine.updateProfile(profile.userId, { verificationStatus: 'VERIFIED' });
    toast.success(`User ${profile.username} has been verified.`);
  };

  const handleApprovePhoto = (idx: number) => {
    toast.success(`Photo #${idx + 1} approved by compliance moderator.`);
  };

  const handleRejectPhoto = (idx: number) => {
    userProfileEngine.removePhoto(profile.userId, idx);
    toast.info(`Photo #${idx + 1} rejected and removed from user profile.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none text-white text-xs">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
              Identity & Trust Center
            </span>
            <span className="text-xs text-slate-400 font-mono">Profile Moderation & Media</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">User Profile Moderation & Photo Ledger</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Review user-submitted avatars, audit profile revisions, verify accounts, and inspect media safety.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVerifyAccount}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs shadow-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            Verify Account
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#11162B] border border-indigo-900/30">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile Completion</span>
          <p className="text-2xl font-black text-white mt-1">{profile.profileCompletion}%</p>
          <span className="text-[10px] text-emerald-400 font-bold">Comprehensive data</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-amber-900/30">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Verification Status</span>
          <p className="text-2xl font-black text-amber-300 mt-1">{profile.verificationStatus}</p>
          <span className="text-[10px] text-amber-400/80">KYC Level 2 Verified</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-purple-900/30">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Active Photos</span>
          <p className="text-2xl font-black text-purple-300 mt-1">{profile.photos.length}</p>
          <span className="text-[10px] text-purple-400/80">1 Primary Avatar + {profile.photos.length} Album</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-cyan-900/30">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Audit Log Events</span>
          <p className="text-2xl font-black text-cyan-300 mt-1">{auditLogs.length}</p>
          <span className="text-[10px] text-cyan-400/80">Tracked profile revisions</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-indigo-900/30 pb-2">
        <button
          onClick={() => setActiveTab('PROFILES')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            activeTab === 'PROFILES' ? 'bg-purple-600 text-white' : 'bg-black/40 text-slate-400 hover:text-white'
          }`}
        >
          👤 User Profile Details
        </button>
        <button
          onClick={() => setActiveTab('PHOTOS_QUEUE')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            activeTab === 'PHOTOS_QUEUE' ? 'bg-purple-600 text-white' : 'bg-black/40 text-slate-400 hover:text-white'
          }`}
        >
          🖼️ Photos Queue ({profile.photos.length})
        </button>
        <button
          onClick={() => setActiveTab('AUDIT_LOGS')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            activeTab === 'AUDIT_LOGS' ? 'bg-purple-600 text-white' : 'bg-black/40 text-slate-400 hover:text-white'
          }`}
        >
          📜 Profile Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: PROFILE DETAILS */}
      {activeTab === 'PROFILES' && (
        <div className="bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl space-y-4">
          <div className="flex items-center gap-4 border-b border-indigo-900/30 pb-4">
            <img src={profile.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-amber-400" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">{profile.username}</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                  {profile.vipBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">UID: {profile.userId} • Gender: {profile.gender} • {profile.countryFlag} {profile.country}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">User Bio</span>
              <p className="p-3 rounded-2xl bg-black/40 border border-indigo-900/40 text-slate-200">{profile.bio}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">Birthday & Age</span>
              <p className="p-3 rounded-2xl bg-black/40 border border-indigo-900/40 text-slate-200">{profile.birthday}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PHOTOS QUEUE */}
      {activeTab === 'PHOTOS_QUEUE' && (
        <div className="bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl space-y-4">
          <span className="font-bold text-white text-sm block">Uploaded Profile Photos Review</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {profile.photos.map((photo, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-black/40 border border-indigo-900/40 space-y-2">
                <div className="aspect-square rounded-xl overflow-hidden bg-black">
                  <img src={photo} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">Photo #{idx + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleApprovePhoto(idx)}
                      className="p-1 rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRejectPhoto(idx)}
                      className="p-1 rounded bg-rose-950 text-rose-300 hover:bg-rose-900 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="bg-[#11162B] rounded-3xl border border-indigo-900/30 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-indigo-900/30 flex items-center justify-between">
            <span className="font-bold text-white text-sm">Profile Mutation Ledger</span>
            <span className="text-[10px] text-slate-400 font-mono">Immutable Compliance Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/40 text-slate-400 font-bold border-b border-indigo-900/30">
                <tr>
                  <th className="p-4">Log ID</th>
                  <th className="p-4">Field Changed</th>
                  <th className="p-4">Old Value</th>
                  <th className="p-4">New Value</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-900/20">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-indigo-950/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-300">{log.id}</td>
                    <td className="p-4 font-bold text-white">{log.field}</td>
                    <td className="p-4 text-slate-400 max-w-xs truncate">{String(log.oldValue || '—')}</td>
                    <td className="p-4 text-emerald-400 max-w-xs truncate">{String(log.newValue || '—')}</td>
                    <td className="p-4 text-slate-400 font-mono">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
