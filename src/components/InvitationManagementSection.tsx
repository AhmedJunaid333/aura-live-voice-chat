import React, { useState, useEffect } from 'react';
import { 
  Send, Users, CheckCircle2, XCircle, AlertCircle, Clock, Search, 
  Filter, Eye, Check, X, Shield, Mic, Building2, Crown, Briefcase, 
  RefreshCw, Plus, FileText, Settings, BarChart3, History, Copy, Trash2
} from 'lucide-react';
import { 
  adminDb, InvitationRecord, InvitationType, InvitationStatus, 
  InvitationTemplate, InvitationAuditLog, UserRecord 
} from '../services/adminEnterpriseDataService';
import { toast } from '../services/toastAndErrorService';

interface Props {
  currentSubTab?: string;
}

export const InvitationManagementSection: React.FC<Props> = ({ currentSubTab = '1-dashboard' }) => {
  const [invitations, setInvitations] = useState<InvitationRecord[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<string>('1-dashboard');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Invitation for Details Drawer
  const [selectedInvite, setSelectedInvite] = useState<InvitationRecord | null>(null);

  // Create Invitation Form State
  const [createType, setCreateType] = useState<InvitationType>('HOSTING');
  const [targetUserId, setTargetUserId] = useState('100821');
  const [targetUserName, setTargetUserName] = useState('Sara_Vip7');
  const [targetUserAvatar, setTargetUserAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop');
  const [targetUserCountry, setTargetUserCountry] = useState('Pakistan');
  const [inviteMessage, setInviteMessage] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);
  const [requirementsList, setRequirementsList] = useState<string[]>([
    'Minimum 15 live audio hours per week',
    'Host 10-seat or 20-seat interactive voice lounges',
    'Maintain positive community and UGC standards',
  ]);
  const [benefitsList, setBenefitsList] = useState<string[]>([
    'Guaranteed 1,500 Coins/hour base compensation',
    'Exclusive 🎙️ Official Host verified badge',
    'Featured room recommendation on Aura Live homepage',
  ]);

  // Cancel Modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Synchronize from database
  useEffect(() => {
    const unsub = adminDb.subscribeToInvitations(invs => {
      setInvitations(invs);
      if (selectedInvite) {
        const updated = invs.find(i => i.id === selectedInvite.id);
        if (updated) setSelectedInvite(updated);
      }
    });
    return () => unsub();
  }, [selectedInvite]);

  // SubTab router sync
  useEffect(() => {
    if (currentSubTab.includes('create')) setActiveSubTab('2-create');
    else if (currentSubTab.includes('pending')) setActiveSubTab('4-pending');
    else if (currentSubTab.includes('accepted')) setActiveSubTab('5-accepted');
    else if (currentSubTab.includes('declined')) setActiveSubTab('6-declined');
    else if (currentSubTab.includes('expired')) setActiveSubTab('7-expired');
    else if (currentSubTab.includes('cancelled')) setActiveSubTab('8-cancelled');
    else if (currentSubTab.includes('hosting')) { setActiveSubTab('9-hosting'); setSelectedTypeFilter('HOSTING'); }
    else if (currentSubTab.includes('agency')) { setActiveSubTab('10-agency'); setSelectedTypeFilter('AGENCY'); }
    else if (currentSubTab.includes('bd')) { setActiveSubTab('11-bd'); setSelectedTypeFilter('BD'); }
    else if (currentSubTab.includes('reseller')) { setActiveSubTab('12-reseller'); setSelectedTypeFilter('RESELLER'); }
    else if (currentSubTab.includes('templates')) setActiveSubTab('13-templates');
    else if (currentSubTab.includes('rules')) setActiveSubTab('14-rules');
    else if (currentSubTab.includes('analytics')) setActiveSubTab('15-analytics');
    else if (currentSubTab.includes('audit')) setActiveSubTab('16-audit');
    else setActiveSubTab('1-dashboard');
  }, [currentSubTab]);

  // Pre-fill form from template
  const applyTemplate = (tpl: InvitationTemplate) => {
    setCreateType(tpl.type);
    setInviteMessage(tpl.defaultMessage);
    setRequirementsList([...tpl.defaultRequirements]);
    setBenefitsList([...tpl.defaultBenefits]);
    setExpiryDays(tpl.defaultExpiryDays);
    setActiveSubTab('2-create');
    toast.info(`Applied "${tpl.title}" template.`);
  };

  // User search helper
  const handleUserSearchSelect = (uid: string) => {
    const user = adminDb.getUsers().find(u => u.id === uid);
    if (user) {
      setTargetUserId(user.id);
      setTargetUserName(user.name);
      setTargetUserAvatar(user.avatar);
      setTargetUserCountry(user.country);
      toast.success(`Selected user: ${user.name} (UID: ${user.id})`);
    } else {
      setTargetUserId(uid);
    }
  };

  // Submit Create Invitation
  const handleCreateInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId || !inviteMessage.trim()) {
      toast.error('Please specify target user and invitation message.');
      return;
    }

    const res = adminDb.createInvitation({
      type: createType,
      targetUserId,
      targetUserName,
      targetUserAvatar,
      targetUserCountry,
      invitedByAdminId: 'SUPER_ADMIN_100001',
      invitedByAdminName: 'Root Admin',
      message: inviteMessage,
      requirements: requirementsList.filter(r => r.trim().length > 0),
      benefits: benefitsList.filter(b => b.trim().length > 0),
      expiryDays,
    });

    if (res.success) {
      toast.success(`Invitation ${res.invitation?.id} dispatched in real-time to ${targetUserName}!`);
      setInviteMessage('');
      setActiveSubTab('3-sent');
    } else {
      toast.error(res.error || 'Failed to dispatch invitation.');
    }
  };

  // Cancel Action
  const handleConfirmCancel = () => {
    if (!selectedInvite) return;
    const res = adminDb.cancelInvitation(selectedInvite.id, 'Root Admin', cancelReason || 'Administrative cancellation.');
    if (res.success) {
      toast.info(`Invitation ${selectedInvite.id} has been cancelled.`);
      setShowCancelModal(false);
      setCancelReason('');
    } else {
      toast.error(res.error || 'Cancellation failed.');
    }
  };

  // Filtered invitations list
  const filteredInvites = invitations.filter(inv => {
    if (selectedTypeFilter !== 'ALL' && inv.type !== selectedTypeFilter) return false;
    if (selectedStatusFilter !== 'ALL' && inv.status !== selectedStatusFilter) return false;
    if (activeSubTab === '4-pending' && inv.status !== 'PENDING') return false;
    if (activeSubTab === '5-accepted' && inv.status !== 'ACCEPTED') return false;
    if (activeSubTab === '6-declined' && inv.status !== 'DECLINED') return false;
    if (activeSubTab === '7-expired' && inv.status !== 'EXPIRED') return false;
    if (activeSubTab === '8-cancelled' && inv.status !== 'CANCELLED') return false;
    if (activeSubTab === '9-hosting' && inv.type !== 'HOSTING') return false;
    if (activeSubTab === '10-agency' && inv.type !== 'AGENCY') return false;
    if (activeSubTab === '11-bd' && inv.type !== 'BD') return false;
    if (activeSubTab === '12-reseller' && inv.type !== 'RESELLER') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inv.id.toLowerCase().includes(q) ||
        inv.targetUserName.toLowerCase().includes(q) ||
        inv.targetUserId.toLowerCase().includes(q) ||
        inv.targetUserCountry.toLowerCase().includes(q) ||
        inv.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const analytics = adminDb.getInvitationAnalytics();
  const templates = adminDb.getInvitationTemplates();
  const auditLogs = adminDb.getInvitationAuditLogs();

  const getTypeIcon = (type: InvitationType) => {
    switch (type) {
      case 'HOSTING': return <Mic className="w-4 h-4 text-pink-400" />;
      case 'AGENCY': return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'BD': return <Crown className="w-4 h-4 text-amber-400" />;
      case 'RESELLER': return <Briefcase className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getStatusBadge = (status: InvitationStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'PENDING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'DECLINED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'EXPIRED':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
      case 'CANCELLED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none">
      
      {/* 1. HEADER WITH SYNC & CREATE ACTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              Official Partner Recruitment
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-Time Dispatch Engine</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Invitation Management & Partner Onboarding</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dispatch official invitations to verified vocalists, top talent agencies, regional BDs, and authorized coin resellers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveSubTab('2-create')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-indigo-950/60 flex items-center gap-1.5 transition cursor-pointer hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            + Create New Invitation
          </button>
          <button
            onClick={() => {
              const count = adminDb.expireOverdueInvitations();
              if (count > 0) toast.info(`Expired ${count} overdue invitations.`);
              else toast.success('All invitations are synchronized and active.');
            }}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 text-xs font-bold border border-indigo-800/40 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Check TTL & Sync
          </button>
        </div>
      </div>

      {/* 2. SUB-TAB BAR (16 COMPREHENSIVE SUB-TABS) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { key: '1-dashboard', label: '📊 Dashboard' },
          { key: '2-create', label: '✉️ Create Invitation' },
          { key: '3-sent', label: '📤 Sent Invitations' },
          { key: '4-pending', label: '⏳ Pending' },
          { key: '5-accepted', label: '✅ Accepted' },
          { key: '6-declined', label: '❌ Declined' },
          { key: '7-expired', label: '⏰ Expired' },
          { key: '8-cancelled', label: '🚫 Cancelled' },
          { key: '9-hosting', label: '🎤 Hosting' },
          { key: '10-agency', label: '🏢 Agency' },
          { key: '11-bd', label: '👑 BD' },
          { key: '12-reseller', label: '💼 Reseller' },
          { key: '13-templates', label: '📑 Templates' },
          { key: '14-rules', label: '⚙️ Rules' },
          { key: '15-analytics', label: '📈 Analytics' },
          { key: '16-audit', label: '📜 Audit Logs' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => {
              setActiveSubTab(t.key);
              if (t.key === '9-hosting') setSelectedTypeFilter('HOSTING');
              else if (t.key === '10-agency') setSelectedTypeFilter('AGENCY');
              else if (t.key === '11-bd') setSelectedTypeFilter('BD');
              else if (t.key === '12-reseller') setSelectedTypeFilter('RESELLER');
              else setSelectedTypeFilter('ALL');
            }}
            className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeSubTab === t.key
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
                : 'bg-[#11162B] text-slate-400 hover:text-white border border-indigo-900/30'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 3. KPI TELEMETRY (SHOWN ON DASHBOARD) */}
      {activeSubTab === '1-dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#11162B] border border-indigo-900/30">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sent</span>
              <p className="text-2xl font-black text-white mt-1">{analytics.totalSent}</p>
              <span className="text-[10px] text-indigo-400">All categories</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#11162B] border border-amber-900/30">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pending</span>
              <p className="text-2xl font-black text-amber-300 mt-1">{analytics.pending}</p>
              <span className="text-[10px] text-amber-400/80">Awaiting user action</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#11162B] border border-emerald-900/30">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Accepted</span>
              <p className="text-2xl font-black text-emerald-300 mt-1">{analytics.accepted}</p>
              <span className="text-[10px] text-emerald-400">Applied & active</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#11162B] border border-rose-900/30">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Declined</span>
              <p className="text-2xl font-black text-rose-300 mt-1">{analytics.declined}</p>
              <span className="text-[10px] text-rose-400/80">With reason notes</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#11162B] border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expired TTL</span>
              <p className="text-2xl font-black text-slate-300 mt-1">{analytics.expired}</p>
              <span className="text-[10px] text-slate-500">Overdue invites</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#11162B] border border-purple-900/30">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Conversion</span>
              <p className="text-2xl font-black text-purple-300 mt-1">{analytics.conversionRate}</p>
              <span className="text-[10px] text-emerald-400 font-bold">High Success</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. CREATE INVITATION FORM VIEW */}
      {activeSubTab === '2-create' && (
        <div className="p-6 rounded-3xl bg-[#11162B] border border-indigo-900/30 shadow-xl space-y-6 max-w-2xl mx-auto">
          <div className="border-b border-indigo-900/40 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Admin Dispatcher</span>
              <h3 className="text-lg font-black text-white">Create & Send Official Partner Invitation</h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">SSL 256-Bit Encrypted</span>
          </div>

          <form onSubmit={handleCreateInvitation} className="space-y-4 text-xs">
            
            {/* Invitation Type Selector */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-bold">Invitation Type *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { type: 'HOSTING', label: '🎤 Hosting', desc: 'Vocal salary' },
                  { type: 'AGENCY', label: '🏢 Agency', desc: '15% revenue share' },
                  { type: 'BD', label: '👑 BD', desc: 'Regional growth' },
                  { type: 'RESELLER', label: '💼 Reseller', desc: '18% wholesale margin' },
                ].map(item => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      setCreateType(item.type as InvitationType);
                      const tpl = templates.find(t => t.type === item.type);
                      if (tpl) {
                        setInviteMessage(tpl.defaultMessage);
                        setRequirementsList([...tpl.defaultRequirements]);
                        setBenefitsList([...tpl.defaultBenefits]);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      createType === item.type
                        ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                        : 'bg-black/30 border-indigo-900/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    <p className="font-extrabold text-white text-xs">{item.label}</p>
                    <span className="text-[9px] text-indigo-300">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target User Finder */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-bold">Search & Target User *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter User ID (e.g. 100821, 100998, 100344)"
                  value={targetUserId}
                  onChange={e => handleUserSearchSelect(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-black/40 border border-indigo-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
                <select
                  onChange={e => handleUserSearchSelect(e.target.value)}
                  className="p-2.5 rounded-xl bg-black/40 border border-indigo-900/50 text-white text-xs"
                >
                  <option value="">Select Existing VIP...</option>
                  {adminDb.getUsers().map(u => (
                    <option key={u.id} value={u.id}>{u.name} (UID: {u.id})</option>
                  ))}
                </select>
              </div>

              {/* Selected User Preview Card */}
              <div className="mt-2.5 p-3 rounded-2xl bg-black/40 border border-indigo-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={targetUserAvatar} alt={targetUserName} className="w-10 h-10 rounded-full object-cover border border-indigo-500/40" />
                  <div>
                    <h4 className="font-extrabold text-white text-xs">{targetUserName}</h4>
                    <p className="text-[10px] text-indigo-300 font-mono">UID: {targetUserId} • {targetUserCountry}</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  Verified Candidate
                </span>
              </div>
            </div>

            {/* Invitation Message */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-bold">Personalized Invitation Message *</label>
              <textarea
                required
                rows={3}
                value={inviteMessage}
                onChange={e => setInviteMessage(e.target.value)}
                placeholder="Type the formal invitation message detailing the partnership offer..."
                className="w-full p-2.5 rounded-xl bg-black/40 border border-indigo-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
            </div>

            {/* Expiry TTL */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-bold">Invitation Expiry Period *</label>
              <select
                value={expiryDays}
                onChange={e => setExpiryDays(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-black/40 border border-indigo-900/50 text-white focus:outline-none focus:border-indigo-400"
              >
                <option value={3}>3 Days (Urgent VIP Offer)</option>
                <option value={7}>7 Days (Standard Recruitment)</option>
                <option value={14}>14 Days (Agency / Corporate)</option>
                <option value={30}>30 Days (Regional BD Director)</option>
              </select>
            </div>

            {/* Requirements & Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-black/30 border border-indigo-900/30 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Candidate Requirements</span>
                {requirementsList.map((r, i) => (
                  <p key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {r}
                  </p>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-black/30 border border-indigo-900/30 space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Role Benefits</span>
                {benefitsList.map((b, i) => (
                  <p key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {b}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex gap-2.5 pt-4">
              <button
                type="button"
                onClick={() => setActiveSubTab('1-dashboard')}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-xs shadow-xl shadow-indigo-950/60 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Dispatch Real-Time Invitation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. INVITATIONS TABLE (DASHBOARD, SENT, PENDING, ETC.) */}
      {activeSubTab !== '2-create' && activeSubTab !== '13-templates' && activeSubTab !== '14-rules' && activeSubTab !== '15-analytics' && activeSubTab !== '16-audit' && (
        <div className="bg-[#11162B] rounded-3xl border border-indigo-900/30 overflow-hidden shadow-xl">
          
          {/* Filter and Search Bar */}
          <div className="p-4 border-b border-indigo-900/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Status Filter:</span>
              <div className="flex items-center gap-1">
                {['ALL', 'PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatusFilter(s)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      selectedStatusFilter === s
                        ? 'bg-indigo-600 text-white'
                        : 'bg-black/30 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate UID, name, country..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-indigo-900/40 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/40 text-slate-400 font-bold border-b border-indigo-900/30">
                <tr>
                  <th className="p-4">Invitation ID</th>
                  <th className="p-4">Role Type</th>
                  <th className="p-4">Target Candidate</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Expires At</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-900/20">
                {filteredInvites.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No invitations found for the selected sub-tab and filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInvites.map(inv => (
                    <tr key={inv.id} className="hover:bg-indigo-950/20 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-300">
                        {inv.id}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {getTypeIcon(inv.type)}
                          <span className="font-bold text-white">{inv.type}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={inv.targetUserAvatar}
                            alt={inv.targetUserName}
                            className="w-7 h-7 rounded-full object-cover border border-indigo-500/30"
                          />
                          <div>
                            <p className="font-bold text-white">{inv.targetUserName}</p>
                            <span className="text-[10px] text-slate-400 font-mono">UID: {inv.targetUserId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300 font-medium">
                        {inv.targetUserCountry}
                      </td>
                      <td className="p-4 font-mono text-slate-300">
                        {inv.expiresAt}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusBadge(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInvite(inv)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-bold border border-indigo-800/40 flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Inspect
                          </button>
                          {inv.status === 'PENDING' && (
                            <button
                              onClick={() => {
                                setSelectedInvite(inv);
                                setShowCancelModal(true);
                              }}
                              className="px-2 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-800/40 flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. INVITATION TEMPLATES VIEW */}
      {activeSubTab === '13-templates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(tpl => (
              <div key={tpl.id} className="p-5 rounded-3xl bg-[#11162B] border border-indigo-900/30 space-y-4 shadow-xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(tpl.type)}
                    <h3 className="font-extrabold text-white text-sm">{tpl.title}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded-full">
                    {tpl.defaultExpiryDays} Days TTL
                  </span>
                </div>

                <p className="text-xs text-slate-300 italic bg-black/30 p-3 rounded-2xl border border-indigo-900/20">
                  "{tpl.defaultMessage}"
                </p>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-amber-300 uppercase">Requirements:</span>
                    <ul className="list-disc list-inside text-slate-400 text-[11px] mt-0.5">
                      {tpl.defaultRequirements.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-300 uppercase">Benefits:</span>
                    <ul className="list-disc list-inside text-slate-400 text-[11px] mt-0.5">
                      {tpl.defaultBenefits.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => applyTemplate(tpl)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Use Template & Dispatch
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. INVITATION RULES & SETTINGS */}
      {activeSubTab === '14-rules' && (
        <div className="p-6 rounded-3xl bg-[#11162B] border border-indigo-900/30 space-y-6 max-w-xl mx-auto shadow-xl text-xs text-white">
          <div className="border-b border-indigo-900/40 pb-3">
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Governance</span>
            <h3 className="text-base font-black">Invitation Dispatch Rules & TTL Policies</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-indigo-900/30">
              <div>
                <h4 className="font-bold">Max Active Invites Per Candidate</h4>
                <p className="text-[10px] text-slate-400">Prevent spamming duplicate invites to the same user</p>
              </div>
              <span className="font-mono font-black text-indigo-300 text-sm">1 Active / Type</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-indigo-900/30">
              <div>
                <h4 className="font-bold">Cooldown Period After Decline</h4>
                <p className="text-[10px] text-slate-400">Time to wait before candidate can be re-invited</p>
              </div>
              <span className="font-mono font-black text-amber-300 text-sm">72 Hours</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-indigo-900/30">
              <div>
                <h4 className="font-bold">Real-time Push Notification Trigger</h4>
                <p className="text-[10px] text-slate-400">Broadcast immediate sound & modal alert in candidate app</p>
              </div>
              <span className="font-mono font-black text-emerald-400 text-sm">ENABLED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-indigo-900/30">
              <div>
                <h4 className="font-bold">Automated TTL Expiry Daemon</h4>
                <p className="text-[10px] text-slate-400">Expire overdue invitations without manual intervention</p>
              </div>
              <span className="font-mono font-black text-emerald-400 text-sm">ACTIVE (CRON)</span>
            </div>
          </div>
        </div>
      )}

      {/* 8. INVITATION AUDIT LOGS */}
      {activeSubTab === '16-audit' && (
        <div className="bg-[#11162B] rounded-3xl border border-indigo-900/30 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3">
            <h3 className="text-sm font-black text-white">Chronological Invitation Audit Trail ({auditLogs.length})</h3>
            <span className="text-[10px] text-indigo-400 font-mono">Immutable Ledger</span>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map(log => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-2xl bg-black/40 border border-indigo-900/30 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">{log.note}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-indigo-400">Inv: {log.invitationId}</span>
                    <span className="text-[9px] font-mono text-purple-400">Actor: {log.actor} ({log.actorRole})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 9. INVITATION DETAILS INSPECT MODAL ── */}
      {selectedInvite && !showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F142D] border border-indigo-500/40 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3">
              <div className="flex items-center gap-2">
                {getTypeIcon(selectedInvite.type)}
                <h3 className="font-extrabold text-white text-sm">{selectedInvite.type} Invitation Details</h3>
              </div>
              <button onClick={() => setSelectedInvite(null)} className="text-slate-400 hover:text-white text-base cursor-pointer">✕</button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-indigo-900/30">
              <div className="flex items-center gap-3">
                <img src={selectedInvite.targetUserAvatar} alt={selectedInvite.targetUserName} className="w-12 h-12 rounded-full object-cover border border-indigo-500" />
                <div>
                  <h4 className="font-black text-white text-sm">{selectedInvite.targetUserName}</h4>
                  <p className="text-[10px] text-indigo-300 font-mono">UID: {selectedInvite.targetUserId} • {selectedInvite.targetUserCountry}</p>
                  <p className="text-[10px] text-slate-400">Invited by: {selectedInvite.invitedByAdminName}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${getStatusBadge(selectedInvite.status)}`}>
                {selectedInvite.status}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Personalized Offer Message</span>
              <p className="text-xs text-indigo-200 bg-black/40 p-3 rounded-xl border border-indigo-900/30 italic">
                "{selectedInvite.message}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-black/30 border border-indigo-900/30 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Requirements</span>
                {selectedInvite.requirements.map((r, i) => (
                  <p key={i} className="text-[10px] text-slate-300">• {r}</p>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-black/30 border border-indigo-900/30 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Benefits</span>
                {selectedInvite.benefits.map((b, i) => (
                  <p key={i} className="text-[10px] text-slate-300">• {b}</p>
                ))}
              </div>
            </div>

            {selectedInvite.resultingApplicationId && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] block font-bold uppercase">Resulting Verified Application</span>
                  <p className="font-mono font-black">{selectedInvite.resultingApplicationId}</p>
                </div>
                <span className="text-xs font-bold text-emerald-400">In Review Queue ➔</span>
              </div>
            )}

            {selectedInvite.declineReason && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300">
                <span className="text-[10px] block font-bold uppercase">Candidate Decline Reason</span>
                <p className="italic mt-0.5">"{selectedInvite.declineReason}"</p>
              </div>
            )}

            <button
              onClick={() => setSelectedInvite(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}

      {/* ── 10. CANCEL INVITATION MODAL ── */}
      {showCancelModal && selectedInvite && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F142D] border border-rose-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fadeIn text-xs">
            <div className="flex items-center gap-2 text-rose-400 border-b border-rose-900/40 pb-3">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-black text-white text-sm">Cancel Invitation {selectedInvite.id}</h3>
            </div>

            <p className="text-slate-300">
              Are you sure you want to cancel the {selectedInvite.type} invitation sent to <strong className="text-white">{selectedInvite.targetUserName}</strong>?
            </p>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-bold">Cancellation Reason</label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Reason for administrative recall..."
                className="w-full p-2.5 rounded-xl bg-black/40 border border-rose-900/50 text-white focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white font-bold cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
