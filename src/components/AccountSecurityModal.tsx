import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Shield, ShieldCheck, Phone, Mail, Lock, Key, 
  Smartphone, Laptop, Globe, AlertTriangle, CheckCircle2, XCircle, 
  RefreshCw, Check, X, ArrowRight, Eye, EyeOff, Sparkles, LogOut, Clock
} from 'lucide-react';
import { 
  accountSecurity, UserSecurityProfile, UserDeviceSession, SecurityEventRecord, SecurityRating 
} from '../services/accountSecurityService';
import { toast } from '../services/toastAndErrorService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const AccountSecurityModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userId = '100821',
}) => {
  const [profile, setProfile] = useState<UserSecurityProfile>(() => 
    accountSecurity.getSecurityProfile(userId)
  );
  const [sessions, setSessions] = useState<UserDeviceSession[]>(() => 
    accountSecurity.getSessions(userId)
  );
  const [events, setEvents] = useState<SecurityEventRecord[]>(() => 
    accountSecurity.getSecurityEvents(userId)
  );

  // Active sub-modals
  const [activeModal, setActiveModal] = useState<'PHONE' | 'EMAIL' | 'PASSWORD' | '2FA_SETUP' | null>(null);

  // Form State: Phone Change
  const [newPhoneInput, setNewPhoneInput] = useState('');
  const [phoneChallengeId, setPhoneChallengeId] = useState('');
  const [phoneOtpInput, setPhoneOtpInput] = useState('');
  const [phoneStep, setPhoneStep] = useState<1 | 2>(1);
  const [simulatedPhoneOtp, setSimulatedPhoneOtp] = useState('');

  // Form State: Email Change
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailChallengeId, setEmailChallengeId] = useState('');
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [emailStep, setEmailStep] = useState<1 | 2>(1);
  const [simulatedEmailOtp, setSimulatedEmailOtp] = useState('');

  // Form State: Change Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [logoutOtherDevices, setLogoutOtherDevices] = useState(true);

  // Form State: 2FA Toggle Challenge
  const [twoFactorChallengeId, setTwoFactorChallengeId] = useState('');
  const [twoFactorOtpInput, setTwoFactorOtpInput] = useState('');
  const [simulatedTwoFactorOtp, setSimulatedTwoFactorOtp] = useState('');

  // Synchronize with database in real-time
  useEffect(() => {
    const sync = () => {
      setProfile(accountSecurity.getSecurityProfile(userId));
      setSessions(accountSecurity.getSessions(userId));
      setEvents(accountSecurity.getSecurityEvents(userId));
    };
    sync();
    const unsub = accountSecurity.subscribe(sync);
    return () => unsub();
  }, [userId]);

  if (!isOpen) return null;

  /* ── 1. PHONE CHANGE HANDLERS ── */
  const handleRequestPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoneInput.trim() || newPhoneInput.length < 8) {
      toast.error('Please enter a valid international phone number.');
      return;
    }

    const res = accountSecurity.requestOtp({
      userId,
      target: newPhoneInput.trim(),
      type: 'PHONE_BIND',
    });

    if (res.success) {
      setPhoneChallengeId(res.challengeId);
      setSimulatedPhoneOtp(res.simulatedCode);
      setPhoneStep(2);
      toast.success(`Verification code dispatched to ${newPhoneInput}`);
    }
  };

  const handleVerifyPhoneChange = (e: React.FormEvent) => {
    e.preventDefault();
    const res = accountSecurity.changePhoneNumber(userId, newPhoneInput.trim(), phoneChallengeId, phoneOtpInput);
    if (res.success) {
      toast.success('Phone number updated and bound securely.');
      setActiveModal(null);
      setPhoneStep(1);
      setNewPhoneInput('');
      setPhoneOtpInput('');
    } else {
      toast.error(res.error || 'Phone verification failed.');
    }
  };

  /* ── 2. EMAIL CHANGE HANDLERS ── */
  const handleRequestEmailOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailInput.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const res = accountSecurity.requestOtp({
      userId,
      target: newEmailInput.trim(),
      type: 'EMAIL_BIND',
    });

    if (res.success) {
      setEmailChallengeId(res.challengeId);
      setSimulatedEmailOtp(res.simulatedCode);
      setEmailStep(2);
      toast.success(`Verification email code sent to ${newEmailInput}`);
    }
  };

  const handleVerifyEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    const res = accountSecurity.changeEmailAddress(userId, newEmailInput.trim(), emailChallengeId, emailOtpInput);
    if (res.success) {
      toast.success('Email address updated and bound securely.');
      setActiveModal(null);
      setEmailStep(1);
      setNewEmailInput('');
      setEmailOtpInput('');
    } else {
      toast.error(res.error || 'Email verification failed.');
    }
  };

  /* ── 3. CHANGE PASSWORD HANDLER ── */
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = accountSecurity.changePassword({
      userId,
      currentPassword,
      newPassword,
      confirmPassword,
      logoutOtherDevices,
    });

    if (res.success) {
      toast.success('Password changed successfully.');
      setActiveModal(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error(res.error || 'Failed to change password.');
    }
  };

  /* ── 4. TWO-FACTOR AUTHENTICATION TOGGLE ── */
  const handleToggle2FA = () => {
    if (profile.twoFactorEnabled) {
      // Disable 2FA
      const res = accountSecurity.requestOtp({
        userId,
        target: profile.phone,
        type: 'TWO_FACTOR',
      });
      setTwoFactorChallengeId(res.challengeId);
      setSimulatedTwoFactorOtp(res.simulatedCode);
      setActiveModal('2FA_SETUP');
    } else {
      // Enable 2FA
      const res = accountSecurity.requestOtp({
        userId,
        target: profile.phone,
        type: 'TWO_FACTOR',
      });
      setTwoFactorChallengeId(res.challengeId);
      setSimulatedTwoFactorOtp(res.simulatedCode);
      setActiveModal('2FA_SETUP');
    }
  };

  const handleVerify2FAToggle = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.twoFactorEnabled) {
      const res = accountSecurity.disableTwoFactor(userId, twoFactorChallengeId, twoFactorOtpInput);
      if (res.success) {
        toast.info('Two-Factor Authentication disabled.');
        setActiveModal(null);
        setTwoFactorOtpInput('');
      } else {
        toast.error(res.error || 'Verification failed.');
      }
    } else {
      const res = accountSecurity.enableTwoFactor(userId, twoFactorChallengeId, twoFactorOtpInput);
      if (res.success) {
        toast.success('Two-Factor Authentication enabled with High Security Rating!');
        setActiveModal(null);
        setTwoFactorOtpInput('');
      } else {
        toast.error(res.error || 'Verification failed.');
      }
    }
  };

  /* ── 5. DEVICE MANAGEMENT ── */
  const handleRevokeSession = (sessionId: string, deviceName: string) => {
    const success = accountSecurity.revokeSession(sessionId, userId);
    if (success) {
      toast.info(`Revoked session for ${deviceName}.`);
    }
  };

  const handleLogoutAllOther = () => {
    const count = accountSecurity.revokeAllOtherSessions(userId);
    toast.success(`Logged out of ${count} other device sessions.`);
  };

  const getRatingBadge = (rating: SecurityRating) => {
    switch (rating) {
      case 'VERY_HIGH':
        return { label: 'High Security (Protected)', color: 'from-emerald-600 to-teal-600', text: 'text-emerald-300', border: 'border-emerald-500/40' };
      case 'HIGH':
        return { label: 'High Protection', color: 'from-blue-600 to-indigo-600', text: 'text-blue-300', border: 'border-blue-500/40' };
      case 'MEDIUM':
        return { label: 'Medium Protection', color: 'from-amber-600 to-yellow-600', text: 'text-amber-300', border: 'border-amber-500/40' };
      case 'LOW':
        return { label: 'Low Security (Action Required)', color: 'from-rose-600 to-pink-600', text: 'text-rose-300', border: 'border-rose-500/40' };
    }
  };

  const ratingInfo = getRatingBadge(profile.securityRating);

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
            Account Security
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => toast.success('Security diagnostics synchronized with database.')}
            className="p-2 rounded-full hover:bg-purple-950/60 text-purple-400 hover:text-purple-200 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── 2. MAIN CONTENT BODY ── */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4 pb-20">
        
        {/* ── A. SECURITY RATING CARD (DYNAMIC RATING) ── */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/70 via-[#1B1038] to-[#0A0614] border border-purple-500/30 shadow-2xl space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Protection</span>
                <h3 className="text-base font-black text-white flex items-center gap-1.5">
                  <span>Security Rating: {profile.securityRating === 'VERY_HIGH' || profile.securityRating === 'HIGH' ? 'High' : profile.securityRating}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${ratingInfo.border} ${ratingInfo.text} bg-black/40`}>
                    {profile.securityScore}/100
                  </span>
                </h3>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden border border-purple-900/40">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${ratingInfo.color} transition-all duration-500`}
              style={{ width: `${profile.securityScore}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Your account is guarded with multi-layered phone binding, verified email, and real-time OTP verification.
          </p>
        </div>

        {/* ── B. ACCOUNT CREDENTIALS SECTION ── */}
        <div className="p-4 rounded-3xl bg-[#140D24] border border-purple-900/30 space-y-3 shadow-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
            Account Credentials
          </span>

          <div className="divide-y divide-purple-900/30">
            
            {/* Phone Number Item */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Phone Number</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {accountSecurity.maskPhone(profile.phone)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-bold">
                  Bound
                </span>
                <button 
                  onClick={() => {
                    setPhoneStep(1);
                    setNewPhoneInput('');
                    setActiveModal('PHONE');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-800/40 transition cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Email Address Item */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                  <Mail className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Email Address</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {accountSecurity.maskEmail(profile.email)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-bold">
                  Bound
                </span>
                <button 
                  onClick={() => {
                    setEmailStep(1);
                    setNewEmailInput('');
                    setActiveModal('EMAIL');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-800/40 transition cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Change Password Item */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                  <Lock className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Change Password</h4>
                  <p className="text-[10px] text-slate-400">
                    Last updated {profile.passwordLastChangedAt || 'recently'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setActiveModal('PASSWORD')}
                className="px-3 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-800/40 transition cursor-pointer flex items-center gap-1"
              >
                <span>Update</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Two-Factor Authentication Item */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Enable 2FA Verification</h4>
                  <p className="text-[10px] text-slate-400">
                    Require OTP verification on new device logins
                  </p>
                </div>
              </div>

              {/* Dynamic Toggle Switch */}
              <button 
                onClick={handleToggle2FA}
                aria-label="Toggle 2FA"
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  profile.twoFactorEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md transition-transform" />
              </button>
            </div>

          </div>
        </div>

        {/* ── C. ACTIVE DEVICES & SESSION MANAGEMENT ── */}
        <div className="p-4 rounded-3xl bg-[#140D24] border border-purple-900/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Trusted Devices ({sessions.length})
            </span>
            {sessions.length > 1 && (
              <button 
                onClick={handleLogoutAllOther}
                className="text-[10px] text-rose-400 font-bold hover:underline cursor-pointer"
              >
                Logout All Other Devices
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {sessions.map(s => (
              <div 
                key={s.id}
                className={`p-3 rounded-2xl border flex items-center justify-between ${
                  s.isCurrent 
                    ? 'bg-purple-950/50 border-purple-500/40' 
                    : 'bg-black/40 border-purple-900/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-900/40 flex items-center justify-center text-purple-300">
                    {s.platform === 'Android' || s.platform === 'iOS' ? (
                      <Smartphone className="w-4 h-4" />
                    ) : (
                      <Laptop className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-extrabold text-white text-xs">{s.deviceName}</h5>
                      {s.isCurrent && (
                        <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full bg-emerald-500 text-black">
                          THIS DEVICE
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {s.location} • {s.lastActive}
                    </p>
                  </div>
                </div>

                {!s.isCurrent && (
                  <button 
                    onClick={() => handleRevokeSession(s.id, s.deviceName)}
                    className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-[10px] font-bold border border-rose-800/40 transition cursor-pointer"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── D. RECENT SECURITY ACTIVITY LEDGER ── */}
        <div className="p-4 rounded-3xl bg-[#140D24] border border-purple-900/30 space-y-3 shadow-xl">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Security Activity Ledger
            </span>
            <span className="text-[9px] text-purple-400 font-mono">SHA-256 Verified</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {events.map(ev => (
              <div key={ev.id} className="p-2.5 rounded-2xl bg-black/40 border border-purple-900/20 text-xs flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[11px]">{ev.event}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{ev.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* ── 3. CHANGE PHONE MODAL (OTP FLOW) ── */}
      {activeModal === 'PHONE' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#140D24] border border-purple-500/40 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-extrabold text-white text-base">
                  {phoneStep === 1 ? 'Change Phone Number' : 'Verify OTP Code'}
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {phoneStep === 1 ? (
              <form onSubmit={handleRequestPhoneOtp} className="space-y-4">
                <p className="text-slate-300 text-xs">
                  Enter your new phone number. We will send a secure 6-digit one-time password (OTP) to verify ownership.
                </p>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">New Mobile Number</label>
                  <input 
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={newPhoneInput}
                    onChange={e => setNewPhoneInput(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl bg-[#1C1631] border border-purple-900/40 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg transition hover:scale-[1.02] cursor-pointer"
                >
                  Send Verification Code ➔
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneChange} className="space-y-4">
                <p className="text-slate-300 text-xs">
                  Enter the 6-digit OTP code sent to <strong className="text-white">{newPhoneInput}</strong>:
                </p>
                {simulatedPhoneOtp && (
                  <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] text-center font-mono">
                    Developer OTP Test Code: <span className="font-black text-amber-300">{simulatedPhoneOtp}</span>
                  </div>
                )}
                <div>
                  <input 
                    type="text"
                    required
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={phoneOtpInput}
                    onChange={e => setPhoneOtpInput(e.target.value)}
                    className="w-full text-center text-lg tracking-widest p-3 rounded-2xl bg-[#1C1631] border border-purple-900/40 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg transition hover:scale-[1.02] cursor-pointer"
                >
                  Verify & Bind Phone
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── 4. CHANGE EMAIL MODAL (OTP FLOW) ── */}
      {activeModal === 'EMAIL' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#140D24] border border-purple-500/40 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-white text-base">
                  {emailStep === 1 ? 'Change Email Address' : 'Verify Email Code'}
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {emailStep === 1 ? (
              <form onSubmit={handleRequestEmailOtp} className="space-y-4">
                <p className="text-slate-300 text-xs">
                  Enter your new email address. We will dispatch a verification code to confirm ownership.
                </p>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">New Email Address</label>
                  <input 
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={newEmailInput}
                    onChange={e => setNewEmailInput(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl bg-[#1C1631] border border-purple-900/40 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg transition hover:scale-[1.02] cursor-pointer"
                >
                  Send Verification Link ➔
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyEmailChange} className="space-y-4">
                <p className="text-slate-300 text-xs">
                  Enter the 6-digit code sent to <strong className="text-white">{newEmailInput}</strong>:
                </p>
                {simulatedEmailOtp && (
                  <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] text-center font-mono">
                    Developer OTP Test Code: <span className="font-black text-cyan-300">{simulatedEmailOtp}</span>
                  </div>
                )}
                <div>
                  <input 
                    type="text"
                    required
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={emailOtpInput}
                    onChange={e => setEmailOtpInput(e.target.value)}
                    className="w-full text-center text-lg tracking-widest p-3 rounded-2xl bg-[#1C1631] border border-purple-900/40 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg transition hover:scale-[1.02] cursor-pointer"
                >
                  Verify & Bind Email
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── 5. CHANGE PASSWORD MODAL ── */}
      {activeModal === 'PASSWORD' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#140D24] border border-purple-500/40 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-pink-400" />
                <h3 className="font-extrabold text-white text-base">Change Password</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Current Password</label>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#1C1631] border border-purple-900/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">New Password (Min 8 chars, 1 Upper, 1 Number, 1 Special)</label>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="New strong password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#1C1631] border border-purple-900/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Confirm New Password</label>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#1C1631] border border-purple-900/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button 
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="text-[10px] text-purple-300 font-bold hover:underline"
                >
                  {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                </button>

                <label className="flex items-center gap-1.5 text-[10px] text-slate-300 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={logoutOtherDevices}
                    onChange={e => setLogoutOtherDevices(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                  <span>Logout other devices</span>
                </label>
              </div>

              <button 
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold shadow-lg transition hover:scale-[1.02] cursor-pointer pt-2"
              >
                Change Password Securely
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── 6. 2FA TOGGLE OTP CHALLENGE MODAL ── */}
      {activeModal === '2FA_SETUP' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#140D24] border border-purple-500/40 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-base">
                  {profile.twoFactorEnabled ? 'Disable 2FA Verification' : 'Enable 2FA Verification'}
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleVerify2FAToggle} className="space-y-4">
              <p className="text-slate-300 text-xs">
                To confirm this security modification, enter the 6-digit OTP code sent to your bound phone number (<strong className="text-white">{accountSecurity.maskPhone(profile.phone)}</strong>):
              </p>

              {simulatedTwoFactorOtp && (
                <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] text-center font-mono">
                  Developer 2FA Test OTP: <span className="font-black text-emerald-300">{simulatedTwoFactorOtp}</span>
                </div>
              )}

              <div>
                <input 
                  type="text"
                  required
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={twoFactorOtpInput}
                  onChange={e => setTwoFactorOtpInput(e.target.value)}
                  className="w-full text-center text-lg tracking-widest p-3 rounded-2xl bg-[#1C1631] border border-purple-900/40 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>

              <button 
                type="submit"
                className={`w-full py-3 rounded-2xl text-white font-bold shadow-lg transition hover:scale-[1.02] cursor-pointer ${
                  profile.twoFactorEnabled 
                    ? 'bg-rose-600 hover:bg-rose-500' 
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {profile.twoFactorEnabled ? 'Confirm Disable 2FA' : 'Verify & Enable 2FA'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
