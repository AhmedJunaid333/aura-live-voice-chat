import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Mic, Building2, Crown, Briefcase, CheckCircle2, Clock, 
  AlertCircle, XCircle, FileText, Upload, ShieldCheck, ArrowRight, 
  Sparkles, Radio, Users, Wallet, RefreshCw, Send, Check, X
} from 'lucide-react';
import { adminDb, ApplicationRecord, ApplicationType, ApplicationStatus } from '../services/adminEnterpriseDataService';
import { authSessionService } from '../services/authSessionService';
import { toast } from '../services/toastAndErrorService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialType?: ApplicationType;
}

export const InvitationApplicationCenterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialType = 'HOSTING',
}) => {
  const [selectedType, setSelectedType] = useState<ApplicationType>(initialType);
  const [activeView, setActiveView] = useState<'hub' | 'form' | 'status' | 'active_center'>('hub');
  
  // Real-time user session
  const currentUser = authSessionService.getEcosystem()?.profile || {
    userId: '100821',
    numericId: '100821',
    username: 'Sara_Vip7',
    displayName: 'Sara_Vip7',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    country: 'Pakistan',
  };

  // Applications list from DB
  const [myApplications, setMyApplications] = useState<ApplicationRecord[]>([]);
  const [userRoles, setUserRoles] = useState(adminDb.getUserRolePermissions(currentUser.userId));

  // Form State
  const [formData, setFormData] = useState<Record<string, any>>({
    fullName: currentUser.displayName,
    userId: currentUser.userId,
    phone: '+92 300 8472910',
    email: 'sara.vip7@auralive.io',
    country: currentUser.country || 'Pakistan',
    city: 'Lahore',
    gender: 'Female',
    dob: '1998-06-15',
    preferredHostingType: 'Music & Talk Show',
    streamingExperience: '3 Years on live audio platforms',
    languages: 'Urdu, Punjabi, English',
    availability: 'Nightly 9:00 PM - 1:00 AM PKT (4 Hours)',
    socialLinks: 'instagram.com/sara_voice_pk',
    bio: 'Experienced Urdu vocalist ready for official live rooms.',
    
    // Agency fields
    proposedAgencyName: 'Royal Lions Talent Agency',
    expectedHosts: 25,
    recruitmentPlan: 'Recruit top acoustic vocalists & PK battlers across Pakistan & GCC.',
    agencyExperience: 'Managed 50+ live creators with agency ranking #1.',
    paymentInfo: 'Meezan Bank Corporate Account',
    
    // BD fields
    industryExperience: '5 Years in Live Broadcast Talent Acquisition',
    recruitmentTarget: '10 Agencies & 100 Verified Hosts per Quarter',
    region: 'South Asia & GCC Region',
    references: 'Former Regional Lead at LiveStream Corp',
    
    // Reseller fields
    businessName: 'Aura Official Wholesale Top-up',
    monthlySalesTarget: '$50,000 USD Coins Volume',
    paymentMethod: 'USDT (TRC20) & Bank Wire',
    businessType: 'Authorized Digital Goods Reseller',
  });

  const [uploadedDocs, setUploadedDocs] = useState<{ name: string; url: string; type: string; size: string }[]>([
    { name: 'National_ID_Proof.jpg', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=250&fit=crop', type: 'image/jpeg', size: '1.4 MB' },
    { name: 'Sample_Portfolio_Reel.mp4', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=250&fit=crop', type: 'video/mp4', size: '8.2 MB' },
  ]);

  const [resubmitInfoText, setResubmitInfoText] = useState('');

  // Synchronize applications on mount & changes
  useEffect(() => {
    const refresh = () => {
      const apps = adminDb.getUserApplications(currentUser.userId);
      setMyApplications(apps);
      setUserRoles(adminDb.getUserRolePermissions(currentUser.userId));
    };
    refresh();
    const unsub = adminDb.subscribeToApplications(refresh);
    return () => unsub();
  }, [currentUser.userId]);

  if (!isOpen) return null;

  // Active application for current selected type
  const activeApp = myApplications.find(a => a.type === selectedType);

  // Status visual badge styling
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'APPROVED':
        return { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, label: 'Approved & Active' };
      case 'UNDER_REVIEW':
        return { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: <Clock className="w-4 h-4 text-amber-400 animate-spin" />, label: 'Under Review' };
      case 'INFO_REQUIRED':
        return { bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', icon: <AlertCircle className="w-4 h-4 text-yellow-400 animate-bounce" />, label: 'Action Required' };
      case 'REJECTED':
        return { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: <XCircle className="w-4 h-4 text-rose-400" />, label: 'Rejected' };
      case 'SUBMITTED':
        return { bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: <Clock className="w-4 h-4 text-blue-400" />, label: 'Submitted' };
      case 'SUSPENDED':
        return { bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: <AlertCircle className="w-4 h-4 text-purple-400" />, label: 'Suspended' };
      case 'DRAFT':
        return { bg: 'bg-slate-500/20 text-slate-300 border-slate-500/40', icon: <FileText className="w-4 h-4 text-slate-400" />, label: 'Draft Saved' };
      default:
        return { bg: 'bg-slate-500/20 text-slate-300 border-slate-500/40', icon: <Clock className="w-4 h-4 text-slate-400" />, label: status };
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email) {
      toast.error('Please complete all required fields before submitting.');
      return;
    }

    const res = adminDb.submitApplication({
      type: selectedType,
      userId: currentUser.userId,
      applicantName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      city: formData.city,
      avatarUrl: currentUser.avatarUrl,
      formData: { ...formData },
      documents: [...uploadedDocs],
    });

    if (res.success) {
      toast.success(`${selectedType} application submitted successfully to Admin Review Board!`);
      setActiveView('status');
    } else {
      toast.error(res.error || 'Submission failed.');
    }
  };

  // Save Draft Handler
  const handleSaveDraft = () => {
    adminDb.saveDraftApplication({
      type: selectedType,
      userId: currentUser.userId,
      applicantName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      city: formData.city,
      avatarUrl: currentUser.avatarUrl,
      formData: { ...formData },
    });
    toast.info('Application draft saved locally.');
  };

  // Resubmit with info
  const handleResubmitWithInfo = () => {
    if (!resubmitInfoText || resubmitInfoText.trim().length < 5) {
      toast.error('Please provide detailed information response.');
      return;
    }
    if (!activeApp) return;

    const res = adminDb.resubmitWithInfo(activeApp.id, {
      ...activeApp.formData,
      userResponseNote: resubmitInfoText,
    }, [
      { name: 'Additional_Clarification_Document.pdf', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400&h=250&fit=crop', type: 'application/pdf', size: '2.0 MB' },
    ]);

    if (res.success) {
      toast.success('Additional info submitted. Application returned to Under Review.');
      setResubmitInfoText('');
    } else {
      toast.error(res.error || 'Resubmission failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070913] text-white flex flex-col overflow-y-auto hide-scrollbar select-none animate-fadeIn">
      
      {/* 1. TOP APP BAR */}
      <div className="sticky top-0 z-30 bg-[#070913]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-purple-900/30">
        <button
          onClick={() => {
            if (activeView !== 'hub') setActiveView('hub');
            else onClose();
          }}
          className="p-1 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          {activeView === 'hub' ? 'Invitation & Application Center' : `${selectedType} Portal`}
        </h1>

        <button 
          onClick={onClose}
          className="text-xs font-bold text-purple-400 hover:text-purple-300 px-2 py-1 rounded-lg bg-purple-950/60 border border-purple-800/40"
        >
          Close
        </button>
      </div>

      {/* 2. MAIN HUB: 4 APPLICATION CARDS */}
      {activeView === 'hub' && (
        <div className="flex-1 px-4 py-5 space-y-4 max-w-lg mx-auto w-full pb-16">
          
          {/* Header Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-900/60 via-indigo-950/80 to-[#0B0F28] border border-purple-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
              Official Partner Ecosystem
            </span>
            <h2 className="text-lg font-black text-white mt-2 leading-tight">
              Join Aura Live Voice Chat Leadership
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Apply for official platform roles, unlock dedicated partner centers, revenue shares, and broadcast permissions.
            </p>
          </div>

          {/* ── 📩 RECEIVED INVITATIONS SECTION (REAL-TIME DISPATCH) ── */}
          {(() => {
            const userInvs = adminDb.getUserInvitations(currentUser.userId).filter(i => i.status === 'PENDING');
            if (userInvs.length === 0) return null;
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📩 Official Invitations Received ({userInvs.length})</span>
                  </h3>
                  <span className="text-[10px] text-amber-400 font-mono">Action Required</span>
                </div>

                {userInvs.map(inv => (
                  <div key={inv.id} className="p-4 rounded-3xl bg-gradient-to-br from-amber-950/40 via-indigo-950/60 to-black/80 border border-amber-500/40 shadow-xl space-y-3 animate-pulse-glow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-lg">
                          👑
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white text-xs">
                            {inv.type} Official Invitation
                          </h4>
                          <span className="text-[10px] text-amber-300 font-mono">
                            From: {inv.invitedByAdminName} • Expires: {inv.expiresAt}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                        Pending
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 italic bg-black/40 p-2.5 rounded-xl border border-amber-900/30">
                      "{inv.message}"
                    </p>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">Key Benefits:</span>
                      {inv.benefits.slice(0, 2).map((b, idx) => (
                        <p key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {b}
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          const reason = prompt('Optional reason for declining invitation:');
                          const res = adminDb.declineInvitation(inv.id, currentUser.userId, reason || undefined);
                          if (res.success) {
                            toast.info(`Invitation ${inv.id} declined.`);
                          }
                        }}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => {
                          const res = adminDb.acceptInvitation(inv.id, currentUser.userId);
                          if (res.success) {
                            toast.success(`Accepted ${inv.type} invitation! Opening verified application.`);
                            setSelectedType(inv.type);
                            setActiveView('form');
                          } else {
                            toast.error(res.error || 'Failed to accept invitation.');
                          }
                        }}
                        className="flex-[2] py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-950/60 transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept & Fill Application
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* 4 Application Cards */}
          <div className="grid grid-cols-1 gap-3.5">
            
            {/* 1. APPLY FOR HOSTING */}
            {(() => {
              const app = myApplications.find(a => a.type === 'HOSTING');
              const isApproved = app?.status === 'APPROVED' || userRoles.isHost;
              return (
                <div className="p-4 rounded-2xl bg-[#0D1226] border border-purple-500/20 hover:border-purple-500/40 transition-all shadow-lg flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-2xl shadow-lg shadow-pink-900/40">
                        🎤
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-white text-sm">Apply for Hosting</h3>
                          {app && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadge(app.status).bg}`}>
                              {app.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Become an official Host and start broadcasting multi-seat voice rooms.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-purple-900/20 flex items-center justify-between">
                    <span className="text-[11px] text-purple-300 font-medium">
                      {isApproved ? 'Host Role Active' : app ? `Application ID: ${app.id}` : 'Earn hourly coin salary + gifts'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedType('HOSTING');
                        if (isApproved) setActiveView('active_center');
                        else if (app) setActiveView('status');
                        else setActiveView('form');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black shadow-md transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer ${
                        isApproved
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : app
                          ? 'bg-purple-700 hover:bg-purple-600 text-white'
                          : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                      }`}
                    >
                      {isApproved ? 'Open Host Center ➔' : app ? 'View Status ➔' : 'Apply Now ➔'}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 2. APPLY FOR AGENCY */}
            {(() => {
              const app = myApplications.find(a => a.type === 'AGENCY');
              const isApproved = app?.status === 'APPROVED' || userRoles.isAgencyOwner;
              return (
                <div className="p-4 rounded-2xl bg-[#0D1226] border border-blue-500/20 hover:border-blue-500/40 transition-all shadow-lg flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-900/40">
                        🏢
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-white text-sm">Apply for Agency</h3>
                          {app && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadge(app.status).bg}`}>
                              {app.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Create or join an official Agency and manage verified host talent.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-blue-900/20 flex items-center justify-between">
                    <span className="text-[11px] text-blue-300 font-medium">
                      {isApproved ? 'Agency Owner Active' : app ? `Application ID: ${app.id}` : '15% Agency commission & roster tools'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedType('AGENCY');
                        if (isApproved) setActiveView('active_center');
                        else if (app) setActiveView('status');
                        else setActiveView('form');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black shadow-md transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer ${
                        isApproved
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : app
                          ? 'bg-blue-700 hover:bg-blue-600 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                      }`}
                    >
                      {isApproved ? 'Open Agency Center ➔' : app ? 'View Status ➔' : 'Apply Now ➔'}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 3. APPLY FOR BD */}
            {(() => {
              const app = myApplications.find(a => a.type === 'BD');
              const isApproved = app?.status === 'APPROVED' || userRoles.isBD;
              return (
                <div className="p-4 rounded-2xl bg-[#0D1226] border border-amber-500/20 hover:border-amber-500/40 transition-all shadow-lg flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-900/40">
                        👑
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-white text-sm">Apply for BD</h3>
                          {app && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadge(app.status).bg}`}>
                              {app.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Apply to become a regional Business Developer for ecosystem growth.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-900/20 flex items-center justify-between">
                    <span className="text-[11px] text-amber-300 font-medium">
                      {isApproved ? 'BD Role Active' : app ? `Application ID: ${app.id}` : 'Direct recruitment & regional bonuses'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedType('BD');
                        if (isApproved) setActiveView('active_center');
                        else if (app) setActiveView('status');
                        else setActiveView('form');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black shadow-md transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer ${
                        isApproved
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : app
                          ? 'bg-amber-700 hover:bg-amber-600 text-white'
                          : 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950'
                      }`}
                    >
                      {isApproved ? 'Open BD Center ➔' : app ? 'View Status ➔' : 'Apply Now ➔'}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 4. APPLY FOR RESELLER */}
            {(() => {
              const app = myApplications.find(a => a.type === 'RESELLER');
              const isApproved = app?.status === 'APPROVED' || userRoles.isReseller;
              return (
                <div className="p-4 rounded-2xl bg-[#0D1226] border border-emerald-500/20 hover:border-emerald-500/40 transition-all shadow-lg flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl shadow-lg shadow-emerald-900/40">
                        💼
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-white text-sm">Apply for Reseller</h3>
                          {app && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadge(app.status).bg}`}>
                              {app.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Apply to become an authorized wholesale coin reseller & top-up point.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-900/20 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-300 font-medium">
                      {isApproved ? 'Reseller Active' : app ? `Application ID: ${app.id}` : '18% wholesale coin margin & portal'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedType('RESELLER');
                        if (isApproved) setActiveView('active_center');
                        else if (app) setActiveView('status');
                        else setActiveView('form');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black shadow-md transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer ${
                        isApproved
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : app
                          ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                      }`}
                    >
                      {isApproved ? 'Open Reseller Center ➔' : app ? 'View Status ➔' : 'Apply Now ➔'}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 5. APPLY FOR BD LEADER */}
            {(() => {
              const app = myApplications.find(a => a.type === 'BD_LEADER');
              const isApproved = app?.status === 'APPROVED' || userRoles.isBDLeader;
              return (
                <div className="p-4 rounded-2xl bg-[#0D1226] border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all shadow-lg flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-800 flex items-center justify-center text-2xl shadow-lg shadow-fuchsia-900/40">
                        👑
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-white text-sm">Apply for BD Leader</h3>
                          {app && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadge(app.status).bg}`}>
                              {app.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Supervise regional BD officers, manage growth budgets & agency recruitment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-fuchsia-900/20 flex items-center justify-between">
                    <span className="text-[11px] text-fuchsia-300 font-medium">
                      {isApproved ? 'BD Leader Active' : app ? `Application ID: ${app.id}` : '$250K regional budget & executive bonuses'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedType('BD_LEADER');
                        if (isApproved) setActiveView('active_center');
                        else if (app) setActiveView('status');
                        else setActiveView('form');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black shadow-md transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer ${
                        isApproved
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : app
                          ? 'bg-fuchsia-700 hover:bg-fuchsia-600 text-white'
                          : 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white'
                      }`}
                    >
                      {isApproved ? 'Open BD Leader Center ➔' : app ? 'View Status ➔' : 'Apply Now ➔'}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 6. APPLY FOR PLATFORM ADMIN / MODERATOR */}
            {(() => {
              const app = myApplications.find(a => a.type === 'ADMIN_MOD');
              const isApproved = app?.status === 'APPROVED' || userRoles.isAdminMod;
              return (
                <div className="p-4 rounded-2xl bg-[#0D1226] border border-indigo-500/20 hover:border-indigo-500/40 transition-all shadow-lg flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-800 flex items-center justify-center text-2xl shadow-lg shadow-indigo-900/40">
                        🛡️
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-white text-sm">Apply for Platform Admin</h3>
                          {app && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadge(app.status).bg}`}>
                              {app.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Official room moderation, safety governance, compliance & dispute audit.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-indigo-900/20 flex items-center justify-between">
                    <span className="text-[11px] text-indigo-300 font-medium">
                      {isApproved ? 'Admin / Moderator Active' : app ? `Application ID: ${app.id}` : 'Compliance badge & safety tools'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedType('ADMIN_MOD');
                        if (isApproved) setActiveView('active_center');
                        else if (app) setActiveView('status');
                        else setActiveView('form');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black shadow-md transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer ${
                        isApproved
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : app
                          ? 'bg-indigo-700 hover:bg-indigo-600 text-white'
                          : 'bg-gradient-to-r from-indigo-600 to-slate-700 text-white'
                      }`}
                    >
                      {isApproved ? 'Open Admin Console ➔' : app ? 'View Status ➔' : 'Apply Now ➔'}
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* 3. APPLICATION STATUS & TRACKING VIEW */}
      {activeView === 'status' && activeApp && (
        <div className="flex-1 px-4 py-5 space-y-4 max-w-lg mx-auto w-full pb-16 animate-fadeIn">
          
          {/* Status Hero Card */}
          <div className="p-6 rounded-3xl bg-[#0F142D] border border-purple-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-300 font-bold uppercase tracking-wider">
                {activeApp.type} APPLICATION
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${getStatusBadge(activeApp.status).bg}`}>
                {getStatusBadge(activeApp.status).icon}
                {getStatusBadge(activeApp.status).label}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-400">Application Reference ID</span>
              <p className="text-xl font-black font-mono text-purple-300">{activeApp.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-purple-900/40">
              <div>
                <span className="text-slate-400 text-[10px]">Submitted Date</span>
                <p className="font-bold text-white mt-0.5">{activeApp.submittedAt}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Applicant Name</span>
                <p className="font-bold text-white mt-0.5">{activeApp.applicantName}</p>
              </div>
            </div>

            {/* Action Required / Info Required Note */}
            {activeApp.status === 'INFO_REQUIRED' && (
              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/40 space-y-3">
                <div className="flex items-center gap-2 text-yellow-300 text-xs font-black">
                  <AlertCircle className="w-4 h-4" />
                  Administrator Requested Additional Information:
                </div>
                <p className="text-xs text-yellow-100 italic bg-black/40 p-2.5 rounded-xl border border-yellow-500/20">
                  "{activeApp.infoRequiredNote}"
                </p>
                <div className="space-y-2">
                  <textarea
                    value={resubmitInfoText}
                    onChange={(e) => setResubmitInfoText(e.target.value)}
                    placeholder="Type your response and address the missing information..."
                    rows={3}
                    className="w-full text-xs p-3 rounded-xl bg-black/60 border border-yellow-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    onClick={handleResubmitWithInfo}
                    className="w-full py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Resubmit for Review
                  </button>
                </div>
              </div>
            )}

            {/* Rejection Note */}
            {activeApp.status === 'REJECTED' && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-black">
                  <XCircle className="w-4 h-4" />
                  Rejection Reason:
                </div>
                <p className="text-xs text-rose-100 italic bg-black/40 p-2.5 rounded-xl border border-rose-500/20">
                  "{activeApp.rejectionReason}"
                </p>
                <button
                  onClick={() => setActiveView('form')}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition"
                >
                  Create New Application ➔
                </button>
              </div>
            )}

            {/* Approved Message */}
            {activeApp.status === 'APPROVED' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 space-y-3 text-center">
                <p className="text-xs text-emerald-200">
                  Your application has been verified by the Admin Board. Your role permissions are active.
                </p>
                <button
                  onClick={() => setActiveView('active_center')}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition"
                >
                  Enter Official {activeApp.type} Center ➔
                </button>
              </div>
            )}
          </div>

          {/* Audit History Timeline */}
          <div className="p-5 rounded-3xl bg-[#0D1226] border border-purple-900/30 space-y-3">
            <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Review History & Audit Trail
            </h3>

            <div className="space-y-2.5">
              {activeApp.statusHistory.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{h.status}</span>
                      <span className="text-[10px] text-slate-400">{h.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">{h.note}</p>
                    <span className="text-[9px] text-purple-400 font-mono">Actor: {h.actor} ({h.actorRole})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. APPLICATION FORM VIEW */}
      {activeView === 'form' && (
        <form onSubmit={handleSubmit} className="flex-1 px-4 py-5 space-y-4 max-w-lg mx-auto w-full pb-20 animate-fadeIn">
          
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Application Form</span>
              <h2 className="text-base font-black text-white">{selectedType} Official Application</h2>
            </div>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3 py-1.5 rounded-xl bg-purple-800/60 hover:bg-purple-700 text-purple-200 text-xs font-bold border border-purple-500/30"
            >
              Save Draft
            </button>
          </div>

          {/* Common Personal Information */}
          <div className="p-4 rounded-2xl bg-[#0D1226] border border-purple-900/30 space-y-3 text-xs">
            <h3 className="font-bold text-purple-300 border-b border-purple-900/30 pb-2">1. Personal & Contact Details</h3>
            
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">User ID *</label>
                <input
                  type="text"
                  readOnly
                  value={formData.userId}
                  className="w-full p-2.5 rounded-xl bg-black/20 border border-purple-900/30 text-purple-300 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          </div>

          {/* Type-Specific Professional Fields */}
          <div className="p-4 rounded-2xl bg-[#0D1226] border border-purple-900/30 space-y-3 text-xs">
            <h3 className="font-bold text-purple-300 border-b border-purple-900/30 pb-2">
              2. {selectedType} Qualifications & Strategy
            </h3>

            {selectedType === 'HOSTING' && (
              <>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Preferred Room Category *</label>
                  <select
                    value={formData.preferredHostingType}
                    onChange={e => setFormData({ ...formData, preferredHostingType: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="Music & Talk Show">Music & Talk Show</option>
                    <option value="Gaming PK Battle">Gaming PK Battle</option>
                    <option value="Late Night Chill">Late Night Chill</option>
                    <option value="Podcast & Discussions">Podcast & Discussions</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Live Streaming Experience *</label>
                  <input
                    type="text"
                    value={formData.streamingExperience}
                    onChange={e => setFormData({ ...formData, streamingExperience: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Weekly Availability (Hours) *</label>
                  <input
                    type="text"
                    value={formData.availability}
                    onChange={e => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </>
            )}

            {selectedType === 'AGENCY' && (
              <>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Proposed Agency Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.proposedAgencyName}
                    onChange={e => setFormData({ ...formData, proposedAgencyName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Expected Hosts *</label>
                    <input
                      type="number"
                      value={formData.expectedHosts}
                      onChange={e => setFormData({ ...formData, expectedHosts: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Payout Method *</label>
                    <input
                      type="text"
                      value={formData.paymentInfo}
                      onChange={e => setFormData({ ...formData, paymentInfo: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Recruitment Strategy *</label>
                  <textarea
                    rows={2}
                    value={formData.recruitmentPlan}
                    onChange={e => setFormData({ ...formData, recruitmentPlan: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </>
            )}

            {selectedType === 'BD' && (
              <>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Target Regional Market *</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Quarterly Recruitment Target *</label>
                  <input
                    type="text"
                    value={formData.recruitmentTarget}
                    onChange={e => setFormData({ ...formData, recruitmentTarget: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </>
            )}

            {selectedType === 'BD_LEADER' && (
              <>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Assigned Super-Region *</label>
                  <input
                    type="text"
                    value={formData.region || 'South Asia & Middle East Executive Territory'}
                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Management Track Record & Teams Supervised *</label>
                  <input
                    type="text"
                    value={formData.industryExperience || 'Supervised 20+ Regional BD Officers & 150 Agencies'}
                    onChange={e => setFormData({ ...formData, industryExperience: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Quarterly Budget Request *</label>
                    <input
                      type="text"
                      value={formData.monthlySalesTarget || '$250,000 Acquisition Fund'}
                      onChange={e => setFormData({ ...formData, monthlySalesTarget: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Master Agencies Target *</label>
                    <input
                      type="text"
                      value={formData.recruitmentTarget || '50 Master Agencies / Quarter'}
                      onChange={e => setFormData({ ...formData, recruitmentTarget: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </>
            )}

            {selectedType === 'ADMIN_MOD' && (
              <>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Moderation & Room Safety Experience *</label>
                  <input
                    type="text"
                    value={formData.industryExperience || '5 Years Head of Live Room Safety & Anti-Fraud Compliance'}
                    onChange={e => setFormData({ ...formData, industryExperience: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Clearance Level *</label>
                    <select
                      value={formData.preferredHostingType || 'COMPLIANCE'}
                      onChange={e => setFormData({ ...formData, preferredHostingType: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                    >
                      <option value="MODERATOR">Room Moderator</option>
                      <option value="COMPLIANCE">Compliance & Safety</option>
                      <option value="SUPER_ADMIN">Super Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Daily Availability *</label>
                    <input
                      type="text"
                      value={formData.availability || '12 Hours Daily / Night Shift Ready'}
                      onChange={e => setFormData({ ...formData, availability: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Safety & Anti-Fraud Understanding *</label>
                  <textarea
                    rows={2}
                    value={formData.recruitmentPlan || 'Certified in AML, UGC Safety Standards & Live Audio Stream Moderation'}
                    onChange={e => setFormData({ ...formData, recruitmentPlan: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </>
            )}

            {selectedType === 'RESELLER' && (
              <>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Wholesale Business Name *</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Monthly Coins Target *</label>
                    <input
                      type="text"
                      value={formData.monthlySalesTarget}
                      onChange={e => setFormData({ ...formData, monthlySalesTarget: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Payment Method *</label>
                    <input
                      type="text"
                      value={formData.paymentMethod}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-purple-900/50 text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Document Uploads */}
          <div className="p-4 rounded-2xl bg-[#0D1226] border border-purple-900/30 space-y-3 text-xs">
            <h3 className="font-bold text-purple-300 border-b border-purple-900/30 pb-2 flex items-center justify-between">
              <span>3. Verification Documents</span>
              <span className="text-[10px] text-slate-400">Encrypted Transport</span>
            </h3>

            <div className="space-y-2">
              {uploadedDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-purple-900/40">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="font-bold text-white truncate max-w-[200px]">{doc.name}</p>
                      <span className="text-[10px] text-slate-400">{doc.size} • Verified</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    Ready
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setUploadedDocs([
                  ...uploadedDocs,
                  { name: `Supplemental_KYC_${Date.now()}.pdf`, url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=250&fit=crop', type: 'application/pdf', size: '2.4 MB' },
                ]);
                toast.success('Document attached successfully.');
              }}
              className="w-full py-2.5 rounded-xl border border-dashed border-purple-500/40 hover:border-purple-400 text-purple-300 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Additional Verification Proof
            </button>
          </div>

          {/* Submission Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveView('hub')}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs shadow-xl shadow-purple-950/60 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Application
            </button>
          </div>
        </form>
      )}

      {/* 5. ACTIVATED OFFICIAL CENTER VIEW (WHEN APPROVED) */}
      {activeView === 'active_center' && (
        <div className="flex-1 px-4 py-5 space-y-4 max-w-lg mx-auto w-full pb-16 animate-fadeIn">
          
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900/60 via-teal-950/80 to-[#0A1A1E] border border-emerald-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                OFFICIAL {selectedType} CENTER
              </span>
              <span className="text-xs text-emerald-400 font-mono">Status: ACTIVE</span>
            </div>

            <div>
              <h2 className="text-lg font-black text-white">Welcome, Official {selectedType} Partner</h2>
              <p className="text-xs text-emerald-200/80 mt-1">
                Your role, permissions, and broadcast privileges are fully operational.
              </p>
            </div>

            {/* Role specific active controls */}
            {selectedType === 'HOSTING' && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30">
                    <span className="text-slate-400 text-[10px]">Hourly Rate</span>
                    <p className="text-base font-black text-amber-400 mt-0.5">1,500 Coins/hr</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30">
                    <span className="text-slate-400 text-[10px]">Host Status</span>
                    <p className="text-base font-black text-emerald-400 mt-0.5">Go Live Ready</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    toast.success('Live audio room engine initialized!');
                    onClose();
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Radio className="w-4 h-4" />
                  Launch Official Broadcast Room
                </button>
              </div>
            )}

            {selectedType === 'AGENCY' && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-black/40 border border-blue-500/30">
                    <span className="text-slate-400 text-[10px]">Agency Share</span>
                    <p className="text-base font-black text-blue-400 mt-0.5">15% Commission</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/40 border border-blue-500/30">
                    <span className="text-slate-400 text-[10px]">Recruitment Code</span>
                    <p className="text-base font-black font-mono text-cyan-300 mt-0.5">AURA-88421</p>
                  </div>
                </div>
                <button
                  onClick={() => toast.info('Agency Host Recruitment Link copied to clipboard!')}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  Invite Hosts to Agency Roster
                </button>
              </div>
            )}

            {selectedType === 'BD' && (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/30 text-xs">
                  <span className="text-slate-400 text-[10px]">Assigned Territory</span>
                  <p className="text-sm font-black text-amber-300 mt-0.5">Pakistan & GCC Regional Growth</p>
                </div>
                <button
                  onClick={() => toast.info('BD Regional Analytics Report generated.')}
                  className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  Open BD Management Portal
                </button>
              </div>
            )}

            {selectedType === 'BD_LEADER' && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-black/40 border border-fuchsia-500/30">
                    <span className="text-slate-400 text-[10px]">Super Region</span>
                    <p className="text-sm font-black text-fuchsia-300 mt-0.5">South Asia & GCC</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/40 border border-fuchsia-500/30">
                    <span className="text-slate-400 text-[10px]">Quarterly Budget</span>
                    <p className="text-sm font-black text-emerald-400 mt-0.5">$250,000 USD</p>
                  </div>
                </div>
                <button
                  onClick={() => toast.info('BD Leader Regional Command Center initialized.')}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:from-fuchsia-500 hover:to-purple-600 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  Open Executive BD Command Portal
                </button>
              </div>
            )}

            {selectedType === 'ADMIN_MOD' && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-black/40 border border-indigo-500/30">
                    <span className="text-slate-400 text-[10px]">Clearance Level</span>
                    <p className="text-sm font-black text-cyan-300 mt-0.5">COMPLIANCE & SAFETY</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/40 border border-indigo-500/30">
                    <span className="text-slate-400 text-[10px]">Killswitch Status</span>
                    <p className="text-sm font-black text-emerald-400 mt-0.5">ARMED & READY</p>
                  </div>
                </div>
                <button
                  onClick={() => toast.info('Platform Moderator Safety Dashboard active.')}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Open Platform Moderator Console
                </button>
              </div>
            )}

            {selectedType === 'RESELLER' && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30">
                    <span className="text-slate-400 text-[10px]">Wholesale Discount</span>
                    <p className="text-base font-black text-emerald-400 mt-0.5">18% Margin</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/40 border border-emerald-500/30">
                    <span className="text-slate-400 text-[10px]">Coin Inventory</span>
                    <p className="text-base font-black text-yellow-400 mt-0.5">5.0M Coins</p>
                  </div>
                </div>
                <button
                  onClick={() => toast.info('Reseller Quick Top-Up Terminal Ready.')}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  Open Wholesale Recharge Terminal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
