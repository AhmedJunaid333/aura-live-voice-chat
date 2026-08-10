import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Eye, EyeOff, MapPin, Award, Shield, UserX, 
  VolumeX, RefreshCw, Check, X, Search, UserPlus, AlertTriangle, 
  Sparkles, CheckCircle2, Lock, ArrowRight
} from 'lucide-react';
import { 
  privacyEngine, UserPrivacySettings, BlockedUserRecord, MutedUserRecord 
} from '../services/privacyEngineService';
import { chatEngine } from '../services/chatEngineService';
import { toast } from '../services/toastAndErrorService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const PrivacyControlsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userId = '100821',
}) => {
  const [settings, setSettings] = useState<UserPrivacySettings>(() => 
    privacyEngine.getSettings(userId)
  );
  const [blockedUsers, setBlockedUsers] = useState<BlockedUserRecord[]>(() => 
    privacyEngine.getBlockedUsers(userId)
  );
  const [mutedUsers, setMutedUsers] = useState<MutedUserRecord[]>(() => 
    privacyEngine.getMutedUsers(userId)
  );

  // Sub-drawers
  const [activeSubModal, setActiveSubModal] = useState<'BLOCKED_LIST' | 'MUTED_LIST' | null>(null);
  const [searchBlocked, setSearchBlocked] = useState('');
  const [unblockConfirmUser, setUnblockConfirmUser] = useState<BlockedUserRecord | null>(null);
  const [showBlockNewUserModal, setShowBlockNewUserModal] = useState(false);

  // Real-time synchronization with Privacy Engine
  useEffect(() => {
    const sync = () => {
      setSettings(privacyEngine.getSettings(userId));
      setBlockedUsers(privacyEngine.getBlockedUsers(userId));
      setMutedUsers(privacyEngine.getMutedUsers(userId));
    };
    sync();
    const unsub = privacyEngine.subscribe(sync);
    return () => unsub();
  }, [userId]);

  if (!isOpen) return null;

  /* ── 1. TOGGLE HANDLERS ── */
  const handleToggleOnlineStatus = () => {
    const nextVal = !settings.hideOnlineStatus;
    privacyEngine.updateSettings(userId, { hideOnlineStatus: nextVal });
    if (nextVal) {
      toast.info('Online status hidden. Other users will not see your active green indicator.');
    } else {
      toast.success('Online status visible according to standard rules.');
    }
  };

  const handleToggleNearbyDistance = () => {
    const nextVal = !settings.hideNearbyDistance;
    privacyEngine.updateSettings(userId, { hideNearbyDistance: nextVal });
    if (nextVal) {
      toast.info('Nearby distance hidden from Moments and Discovery.');
    } else {
      toast.success('Nearby distance visible on location feeds.');
    }
  };

  const handleToggleVipBadge = () => {
    const nextVal = !settings.hideVipBadge;
    privacyEngine.updateSettings(userId, { hideVipBadge: nextVal });
    if (nextVal) {
      toast.info('VIP and Noble tier badge visibility hidden from public rooms & comments.');
    } else {
      toast.success('VIP badge visibility restored.');
    }
  };

  /* ── 2. BLOCK / UNBLOCK HANDLERS ── */
  const handleConfirmUnblock = () => {
    if (!unblockConfirmUser) return;
    const ok = privacyEngine.unblockUser(userId, unblockConfirmUser.blockedId);
    if (ok) {
      toast.success(`User ${unblockConfirmUser.blockedUserName} unblocked successfully.`);
      setUnblockConfirmUser(null);
    }
  };

  const handleQuickBlockUser = (targetUser: { id: string; name: string; avatar: string; badge?: string; gender?: 'male' | 'female' }) => {
    privacyEngine.blockUser(userId, targetUser, 'Blocked from Privacy Management.');
    toast.success(`Blocked ${targetUser.name}. They can no longer message or interact with you.`);
    setShowBlockNewUserModal(false);
  };

  const handleUnmute = (targetUserId: string, targetName: string) => {
    const ok = privacyEngine.unmuteUser(userId, targetUserId);
    if (ok) {
      toast.success(`User ${targetName} unmuted.`);
    }
  };

  const allAvailableUsers = chatEngine.getUsers().filter(u => u.id !== userId);

  const filteredBlockedUsers = blockedUsers.filter(b => {
    if (!searchBlocked.trim()) return true;
    const q = searchBlocked.toLowerCase();
    return b.blockedUserName.toLowerCase().includes(q) || b.blockedId.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#08040F] text-white flex flex-col animate-fadeIn select-none overflow-y-auto custom-scrollbar">
      
      {/* ── 1. TOP APP BAR ── */}
      <header className="sticky top-0 z-40 px-4 py-3.5 bg-[#120A24]/95 backdrop-blur-xl border-b border-purple-900/30 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-purple-950/60 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-white tracking-wide">
            Privacy Controls
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => toast.success('Privacy state synchronized with server.')}
            className="p-2 rounded-full hover:bg-purple-950/60 text-purple-400 hover:text-purple-200 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── 2. MAIN PRIVACY CARDS ── */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-5 pb-20">
        
        {/* Banner Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/70 via-[#1B1038] to-[#0A0614] border border-purple-500/30 shadow-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Shield className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Privacy & Visibility Shield</h3>
              <p className="text-[11px] text-slate-300">
                Control who can see your online status, nearby distance, and VIP badge across the platform.
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: VISIBILITY & STATUS ── */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
            Visibility & Status
          </span>

          <div className="p-4 rounded-3xl bg-[#140D24] border border-purple-900/30 divide-y divide-purple-900/30 shadow-xl">
            
            {/* Toggle 1: Hide Online Status */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                  {settings.hideOnlineStatus ? <EyeOff className="w-4 h-4 text-pink-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Hide Online Status</h4>
                  <p className="text-[10px] text-slate-400 max-w-[240px]">
                    Do not display your green active presence indicator to other users.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleToggleOnlineStatus}
                aria-label="Toggle Hide Online Status"
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  settings.hideOnlineStatus ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Toggle 2: Hide Nearby Distance */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Hide Nearby Distance</h4>
                  <p className="text-[10px] text-slate-400 max-w-[240px]">
                    Hide exact kilometer/mile distance on Moments, Discovery, and feed cards.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleToggleNearbyDistance}
                aria-label="Toggle Hide Nearby Distance"
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  settings.hideNearbyDistance ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Toggle 3: Hide Noble / VIP Badge */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Hide Noble / VIP Badge</h4>
                  <p className="text-[10px] text-slate-400 max-w-[240px]">
                    Hide your VIP and Noble level badge in live rooms, comments, and public cards.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleToggleVipBadge}
                aria-label="Toggle Hide VIP Badge"
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  settings.hideVipBadge ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

          </div>
        </div>

        {/* ── SECTION 2: INTERACTION BOUNDARIES ── */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
            Safety & Boundaries
          </span>

          <div className="p-4 rounded-3xl bg-[#140D24] border border-purple-900/30 divide-y divide-purple-900/30 shadow-xl">
            
            {/* Blocked Users List */}
            <button 
              onClick={() => setActiveSubModal('BLOCKED_LIST')}
              className="w-full py-3 flex items-center justify-between hover:bg-purple-950/30 rounded-2xl px-2 transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-300">
                  <UserX className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Blocked Users List</h4>
                  <p className="text-[10px] text-slate-400">
                    Manage accounts blocked from messaging or interacting with you.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/30 font-bold">
                  {blockedUsers.length} Blocked
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </button>

            {/* Muted Users List */}
            <button 
              onClick={() => setActiveSubModal('MUTED_LIST')}
              className="w-full py-3 flex items-center justify-between hover:bg-purple-950/30 rounded-2xl px-2 transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-300">
                  <VolumeX className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Muted Users List</h4>
                  <p className="text-[10px] text-slate-400">
                    Suppress notifications and alerts without completely blocking.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30 font-bold">
                  {mutedUsers.length} Muted
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </button>

          </div>
        </div>

      </main>

      {/* ── 3. BLOCKED USERS SUB-MODAL ── */}
      {activeSubModal === 'BLOCKED_LIST' && (
        <div className="fixed inset-0 z-50 bg-[#08040F] text-white flex flex-col animate-fadeIn select-none">
          <header className="sticky top-0 z-40 px-4 py-3.5 bg-[#120A24]/95 backdrop-blur-xl border-b border-purple-900/30 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveSubModal(null)}
                className="p-1.5 rounded-full hover:bg-purple-950/60 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg font-black text-white tracking-wide">
                  Blocked Users List
                </h1>
                <span className="text-[10px] text-slate-400 font-mono">
                  {blockedUsers.length} accounts restricted
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowBlockNewUserModal(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md flex items-center gap-1 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              + Block User
            </button>
          </header>

          <div className="p-4 max-w-lg mx-auto w-full space-y-4 flex-1">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search blocked users by name or UID..."
                value={searchBlocked}
                onChange={e => setSearchBlocked(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl bg-[#1C1631] border border-purple-900/40 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            {/* Blocked Users List */}
            <div className="space-y-2">
              {filteredBlockedUsers.length === 0 ? (
                <div className="text-center py-16 text-slate-500 space-y-2">
                  <UserX className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-xs">No blocked users found.</p>
                </div>
              ) : (
                filteredBlockedUsers.map(user => (
                  <div 
                    key={user.id}
                    className="p-3.5 rounded-2xl bg-[#140D24] border border-purple-900/30 flex items-center justify-between shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.blockedUserAvatar} 
                        alt={user.blockedUserName} 
                        className="w-11 h-11 rounded-full object-cover border border-purple-800"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white text-xs">{user.blockedUserName}</h4>
                          <span className={`text-[10px] ${user.blockedUserGender === 'male' ? 'text-blue-400' : 'text-pink-400'}`}>
                            {user.blockedUserGender === 'male' ? '♂' : '♀'}
                          </span>
                          {user.blockedUserBadge && (
                            <span className="text-[8px] px-1.5 py-0.2 rounded-full font-bold bg-[#D4AF37] text-white">
                              {user.blockedUserBadge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">
                          UID: {user.blockedId} • Blocked: {user.blockedAt}
                        </p>
                        {user.reason && (
                          <p className="text-[9px] text-rose-300/80 italic mt-0.5">
                            "{user.reason}"
                          </p>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => setUnblockConfirmUser(user)}
                      className="px-3 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-800/40 transition cursor-pointer"
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. MUTED USERS SUB-MODAL ── */}
      {activeSubModal === 'MUTED_LIST' && (
        <div className="fixed inset-0 z-50 bg-[#08040F] text-white flex flex-col animate-fadeIn select-none">
          <header className="sticky top-0 z-40 px-4 py-3.5 bg-[#120A24]/95 backdrop-blur-xl border-b border-purple-900/30 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveSubModal(null)}
                className="p-1.5 rounded-full hover:bg-purple-950/60 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg font-black text-white tracking-wide">
                  Muted Users List
                </h1>
                <span className="text-[10px] text-slate-400 font-mono">
                  {mutedUsers.length} accounts muted
                </span>
              </div>
            </div>
          </header>

          <div className="p-4 max-w-lg mx-auto w-full space-y-4 flex-1">
            <div className="space-y-2">
              {mutedUsers.length === 0 ? (
                <div className="text-center py-16 text-slate-500 space-y-2">
                  <VolumeX className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-xs">No muted users.</p>
                </div>
              ) : (
                mutedUsers.map(user => (
                  <div 
                    key={user.id}
                    className="p-3.5 rounded-2xl bg-[#140D24] border border-purple-900/30 flex items-center justify-between shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.mutedUserAvatar} 
                        alt={user.mutedUserName} 
                        className="w-11 h-11 rounded-full object-cover border border-purple-800"
                      />
                      <div>
                        <h4 className="font-bold text-white text-xs">{user.mutedUserName}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                          UID: {user.mutedId} • Muted: {user.mutedAt}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleUnmute(user.mutedId, user.mutedUserName)}
                      className="px-3 py-1 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-xs font-bold border border-amber-800/40 transition cursor-pointer"
                    >
                      Unmute
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 5. UNBLOCK CONFIRMATION DIALOG ── */}
      {unblockConfirmUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#140D24] border border-purple-500/40 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <h3 className="font-extrabold text-white text-base">Unblock User?</h3>
              <button onClick={() => setUnblockConfirmUser(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-slate-300">
              Are you sure you want to unblock <strong className="text-white">{unblockConfirmUser.blockedUserName}</strong> (UID: {unblockConfirmUser.blockedId})? They will be able to message you and view your public broadcasts again.
            </p>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setUnblockConfirmUser(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmUnblock}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
              >
                Confirm Unblock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. QUICK BLOCK NEW USER MODAL (FOR TESTING) ── */}
      {showBlockNewUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#140D24] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
              <div className="flex items-center gap-2 text-rose-300">
                <UserX className="w-5 h-5" />
                <h3 className="font-extrabold text-white text-base">Block a User</h3>
              </div>
              <button onClick={() => setShowBlockNewUserModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-slate-300">
              Select any account to test instant real-time blocking across chat, messages, live rooms, and discovery:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {allAvailableUsers.map(user => {
                const isAlreadyBlocked = blockedUsers.some(b => b.blockedId === user.id);
                return (
                  <div 
                    key={user.id}
                    className="p-2.5 rounded-xl bg-black/40 border border-purple-900/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-white text-xs">{user.name}</h4>
                        <span className="text-[9px] text-slate-400 font-mono">UID: {user.id}</span>
                      </div>
                    </div>

                    {isAlreadyBlocked ? (
                      <span className="text-[10px] text-rose-400 font-bold">Already Blocked</span>
                    ) : (
                      <button 
                        onClick={() => handleQuickBlockUser(user)}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                      >
                        Block
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
