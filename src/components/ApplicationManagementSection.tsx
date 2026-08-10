import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle2, XCircle, AlertCircle, Clock, Search, 
  Filter, Eye, Check, X, Shield, Users, Mic, Building2, Crown, 
  Briefcase, Download, ExternalLink, ArrowRight, RefreshCw, Send
} from 'lucide-react';
import { 
  adminDb, ApplicationRecord, ApplicationType, ApplicationStatus, ApplicationDocument 
} from '../services/adminEnterpriseDataService';
import { toast } from '../services/toastAndErrorService';

interface Props {
  currentSubTab?: string;
}

export const ApplicationManagementSection: React.FC<Props> = ({ currentSubTab = 'all-applications' }) => {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Application for Review Dossier Modal
  const [reviewApp, setReviewApp] = useState<ApplicationRecord | null>(null);
  
  // Action Modals State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReasonText, setRejectionReasonText] = useState('');
  
  const [showInfoReqModal, setShowInfoReqModal] = useState(false);
  const [infoReqNoteText, setInfoReqNoteText] = useState('');

  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Subscribe to real-time application state
  useEffect(() => {
    const unsub = adminDb.subscribeToApplications(apps => {
      setApplications(apps);
      if (reviewApp) {
        const updated = apps.find(a => a.id === reviewApp.id);
        if (updated) setReviewApp(updated);
      }
    });
    return () => unsub();
  }, [reviewApp]);

  // Handle currentSubTab routing from Admin Dashboard sidebar
  useEffect(() => {
    if (currentSubTab.includes('hosting')) setSelectedTypeFilter('HOSTING');
    else if (currentSubTab.includes('agency')) setSelectedTypeFilter('AGENCY');
    else if (currentSubTab.includes('bd')) setSelectedTypeFilter('BD');
    else if (currentSubTab.includes('reseller')) setSelectedTypeFilter('RESELLER');
    else if (currentSubTab.includes('pending')) setSelectedStatusFilter('SUBMITTED');
    else if (currentSubTab.includes('under-review')) setSelectedStatusFilter('UNDER_REVIEW');
    else if (currentSubTab.includes('info-required')) setSelectedStatusFilter('INFO_REQUIRED');
    else if (currentSubTab.includes('approved')) setSelectedStatusFilter('APPROVED');
    else if (currentSubTab.includes('rejected')) setSelectedStatusFilter('REJECTED');
    else setSelectedTypeFilter('ALL');
  }, [currentSubTab]);

  // Filter applications
  const filteredApps = applications.filter(app => {
    if (selectedTypeFilter !== 'ALL' && app.type !== selectedTypeFilter) return false;
    if (selectedStatusFilter !== 'ALL' && app.status !== selectedStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.id.toLowerCase().includes(q) ||
        app.applicantName.toLowerCase().includes(q) ||
        app.userId.toLowerCase().includes(q) ||
        app.country.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // KPI Metrics
  const totalCount = applications.length;
  const pendingCount = applications.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length;
  const infoReqCount = applications.filter(a => a.status === 'INFO_REQUIRED').length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;

  // Status Badge Helper
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'UNDER_REVIEW':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'INFO_REQUIRED':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'REJECTED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'SUBMITTED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'SUSPENDED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  // Type Icon Helper
  const getTypeIcon = (type: ApplicationType) => {
    switch (type) {
      case 'HOSTING': return <Mic className="w-4 h-4 text-pink-400" />;
      case 'AGENCY': return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'BD': return <Crown className="w-4 h-4 text-amber-400" />;
      case 'BD_LEADER': return <Crown className="w-4 h-4 text-fuchsia-400" />;
      case 'ADMIN_MOD': return <Shield className="w-4 h-4 text-indigo-400" />;
      case 'RESELLER': return <Briefcase className="w-4 h-4 text-emerald-400" />;
    }
  };

  // Actions
  const handleApprove = (app: ApplicationRecord) => {
    const res = adminDb.approveApplication(app.id, 'ADMIN_SUPER', adminNoteInput || 'Verified official partner credentials.');
    if (res.success) {
      toast.success(`Application ${app.id} APPROVED. Server-side permissions & profile activated.`);
      setAdminNoteInput('');
    } else {
      toast.error(res.error || 'Approval failed.');
    }
  };

  const handleConfirmReject = () => {
    if (!reviewApp) return;
    if (!rejectionReasonText || rejectionReasonText.trim().length < 5) {
      toast.error('Please enter a valid rejection reason.');
      return;
    }
    const res = adminDb.rejectApplication(reviewApp.id, 'ADMIN_SUPER', rejectionReasonText);
    if (res.success) {
      toast.info(`Application ${reviewApp.id} Rejected with feedback.`);
      setShowRejectModal(false);
      setRejectionReasonText('');
    } else {
      toast.error(res.error || 'Rejection failed.');
    }
  };

  const handleConfirmInfoRequest = () => {
    if (!reviewApp) return;
    if (!infoReqNoteText || infoReqNoteText.trim().length < 5) {
      toast.error('Please specify what information is needed.');
      return;
    }
    const res = adminDb.requestInformation(reviewApp.id, 'ADMIN_SUPER', infoReqNoteText);
    if (res.success) {
      toast.info(`Additional info requested from ${reviewApp.applicantName}.`);
      setShowInfoReqModal(false);
      setInfoReqNoteText('');
    } else {
      toast.error(res.error || 'Request failed.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11162B] p-5 rounded-3xl border border-purple-900/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
              Enterprise Governance
            </span>
            <span className="text-xs text-slate-400 font-mono">RBAC + Live Sync</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Application & Partner Approval Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time vetting, KYC verification, and server-side permission activation for Hosts, Agencies, BDs & Resellers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setApplications(adminDb.getApplications());
              toast.success('Application queue synchronized with real-time database.');
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 text-xs font-bold border border-purple-800/40 flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Real-Time
          </button>
        </div>
      </div>

      {/* 2. KPI TELEMETRY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#11162B] border border-purple-900/30">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Applications</span>
          <p className="text-2xl font-black text-white mt-1">{totalCount}</p>
          <span className="text-[10px] text-purple-400">All categories</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#11162B] border border-blue-900/30">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Pending Review</span>
          <p className="text-2xl font-black text-blue-300 mt-1">{pendingCount}</p>
          <span className="text-[10px] text-blue-400/80">Requires admin action</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#11162B] border border-yellow-900/30">
          <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Info Required</span>
          <p className="text-2xl font-black text-yellow-300 mt-1">{infoReqCount}</p>
          <span className="text-[10px] text-yellow-400/80">Awaiting user response</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#11162B] border border-emerald-900/30">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Approved Partners</span>
          <p className="text-2xl font-black text-emerald-300 mt-1">{approvedCount}</p>
          <span className="text-[10px] text-emerald-400/80">Active role & permissions</span>
        </div>
      </div>

      {/* 3. TYPE FILTER PILLS & SEARCH */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Type Filter Pills (Public Applications) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#11162B] rounded-2xl border border-purple-900/30">
            {[
              { key: 'ALL', label: 'All Types' },
              { key: 'HOSTING', label: '🎤 Hosting' },
              { key: 'AGENCY', label: '🏢 Agency' },
              { key: 'BD', label: '👑 BD' },
              { key: 'RESELLER', label: '💼 Reseller' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setSelectedTypeFilter(t.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  selectedTypeFilter === t.key
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, User, Country..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-[#11162B] border border-purple-900/30 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'INFO_REQUIRED', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXPIRED'].map(s => (
            <button
              key={s}
              onClick={() => setSelectedStatusFilter(s)}
              className={`px-3 py-1 rounded-lg font-bold border transition cursor-pointer ${
                selectedStatusFilter === s
                  ? 'bg-purple-950 text-purple-300 border-purple-500 shadow-sm'
                  : 'bg-[#11162B]/60 text-slate-400 border-purple-900/20 hover:text-white'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 4. APPLICATIONS TABLE */}
      <div className="bg-[#11162B] rounded-3xl border border-purple-900/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-slate-400 font-bold border-b border-purple-900/30">
              <tr>
                <th className="p-4">Application ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Applicant / User</th>
                <th className="p-4">Location</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/20">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No applications match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-purple-950/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-purple-300">
                      {app.id}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(app.type)}
                        <span className="font-bold text-white">{app.type}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={app.avatarUrl}
                          alt={app.applicantName}
                          className="w-8 h-8 rounded-full object-cover border border-purple-500/30"
                        />
                        <div>
                          <p className="font-extrabold text-white">{app.applicantName}</p>
                          <span className="text-[10px] text-slate-400 font-mono">UID: {app.userId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">
                      {app.city}, {app.country}
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {app.submittedAt}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusBadge(app.status)}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setReviewApp(app)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review Dossier
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. APPLICATION DOSSIER REVIEW MODAL */}
      {reviewApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none animate-fadeIn">
          <div className="bg-[#0D1226] border border-purple-500/40 rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-xl">
                  {getTypeIcon(reviewApp.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-purple-300">{reviewApp.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getStatusBadge(reviewApp.status)}`}>
                      {reviewApp.status}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-0.5">
                    {reviewApp.type} Partner Official Review
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setReviewApp(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant Profile Bar */}
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={reviewApp.avatarUrl}
                  alt={reviewApp.applicantName}
                  className="w-12 h-12 rounded-2xl object-cover border border-purple-500/40"
                />
                <div>
                  <h4 className="font-extrabold text-white text-sm">{reviewApp.applicantName}</h4>
                  <p className="text-xs text-purple-300 font-mono">UID: {reviewApp.userId} • {reviewApp.city}, {reviewApp.country}</p>
                  <p className="text-[11px] text-slate-400">{reviewApp.email} | {reviewApp.phone}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono font-bold">
                      Source: {reviewApp.invitationSource || 'Direct Public Application'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-slate-400 text-[10px]">Submitted At</span>
                <p className="font-bold text-white font-mono">{reviewApp.submittedAt}</p>
                {reviewApp.reviewerAdminId && (
                  <span className="text-[10px] text-purple-400 font-mono">Assigned: {reviewApp.reviewerAdminId}</span>
                )}
              </div>
            </div>

            {/* Submitted Form Details Grid */}
            <div className="p-4 rounded-2xl bg-black/30 border border-purple-900/30 space-y-3">
              <h4 className="text-xs font-black text-purple-300 uppercase tracking-wider">
                Submitted Strategy & Business Answers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {Object.entries(reviewApp.formData).map(([k, v]) => (
                  <div key={k} className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-900/20">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                      {k.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <p className="font-medium text-white mt-0.5 break-words">{String(v)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Attached Verification Documents */}
            <div className="p-4 rounded-2xl bg-black/30 border border-purple-900/30 space-y-3">
              <h4 className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center justify-between">
                <span>Verified Uploaded Documents ({reviewApp.documents.length})</span>
                <span className="text-[10px] text-emerald-400 font-bold">SHA-256 Validated</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {reviewApp.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-purple-950/40 border border-purple-900/30 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="font-bold text-white truncate max-w-[180px]">{doc.name}</p>
                        <span className="text-[10px] text-slate-400">{doc.size} • {doc.uploadedAt}</span>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-purple-800 hover:bg-purple-700 text-white transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit History Timeline */}
            <div className="p-4 rounded-2xl bg-black/30 border border-purple-900/30 space-y-2.5">
              <h4 className="text-xs font-black text-purple-300 uppercase tracking-wider">
                Review History & Audit Trail
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {reviewApp.statusHistory.map((h, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-black/40 border border-white/5 text-[11px] flex items-start justify-between">
                    <div>
                      <span className="font-bold text-white">{h.status}</span>
                      <p className="text-slate-300 mt-0.5">{h.note}</p>
                      <span className="text-[9px] text-purple-400 font-mono">By: {h.actor} ({h.actorRole})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{h.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Notes & Action Bar */}
            <div className="space-y-3 border-t border-purple-900/30 pt-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Administrator Reviewer Note</label>
                <input
                  type="text"
                  placeholder="Optional review notes to attach to audit record..."
                  value={adminNoteInput}
                  onChange={e => setAdminNoteInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-black/40 border border-purple-900/40 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => adminDb.setUnderReview(reviewApp.id, 'ADMIN_SUPER')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  Mark Under Review
                </button>
                <button
                  onClick={() => {
                    const res = adminDb.rejectApplication(reviewApp.id, 'ADMIN_SUPER', 'Application cancelled by Administrator.');
                    if (res.success) {
                      toast.info(`Application ${reviewApp.id} cancelled.`);
                      setReviewApp(null);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-purple-800/40"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel Application
                </button>
                <button
                  onClick={() => setShowInfoReqModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-yellow-600/80 hover:bg-yellow-500 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Request More Info
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject Application
                </button>
                <button
                  onClick={() => handleApprove(reviewApp)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-950/60 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve & Activate Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. REJECTION REASON MODAL */}
      {showRejectModal && reviewApp && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="bg-[#140D18] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <XCircle className="w-6 h-6" />
              <h3 className="font-extrabold text-white text-base">Reject Application ({reviewApp.id})</h3>
            </div>
            <p className="text-xs text-rose-200">
              Please provide a clear rejection reason. This feedback will be sent directly to the applicant's mobile application.
            </p>
            <textarea
              required
              rows={4}
              placeholder="E.g., Incomplete national identity documents or experience criteria not met..."
              value={rejectionReasonText}
              onChange={e => setRejectionReasonText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl bg-black/60 border border-rose-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
            />
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. REQUEST MORE INFORMATION MODAL */}
      {showInfoReqModal && reviewApp && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="bg-[#14120D] border border-yellow-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-yellow-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-extrabold text-white text-base">Request Additional Information</h3>
            </div>
            <p className="text-xs text-yellow-100">
              Specify what missing information or supplemental documents the applicant must provide.
            </p>
            <textarea
              required
              rows={4}
              placeholder="E.g., Please upload corporate registration certificate or clear scan of government ID..."
              value={infoReqNoteText}
              onChange={e => setInfoReqNoteText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl bg-black/60 border border-yellow-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400"
            />
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowInfoReqModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmInfoRequest}
                className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black shadow-md"
              >
                Send Request to User
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
