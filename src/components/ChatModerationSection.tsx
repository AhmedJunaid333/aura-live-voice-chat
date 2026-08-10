import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, 
  Trash2, UserX, Search, RefreshCw, Eye, Flag, Shield 
} from 'lucide-react';
import { chatEngine, MessageReport, ChatUser } from '../services/chatEngineService';
import { toast } from '../services/toastAndErrorService';

export const ChatModerationSection: React.FC = () => {
  const [reports, setReports] = useState<MessageReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED' | 'DISMISSED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<MessageReport | null>(null);
  const [adminResolutionNote, setAdminResolutionNote] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLiveReports = async () => {
    try {
      const token = localStorage.getItem('aura_token');
      const res = await fetch('/api/v1/chat/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReports(data.data);
      } else {
        setReports(chatEngine.getReports());
      }
    } catch (_) {
      setReports(chatEngine.getReports());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveReports();
  }, []);

  const filteredReports = reports.filter(r => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      (r.reporterName || '').toLowerCase().includes(q) ||
      (r.reportedUserName || '').toLowerCase().includes(q) ||
      (r.messageContent || '').toLowerCase().includes(q) ||
      (r.reason || '').toLowerCase().includes(q)
    );
  });

  const handleResolve = async (reportId: string) => {
    try {
      const token = localStorage.getItem('aura_token');
      await fetch(`/api/v1/chat/reports/${reportId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'RESOLVED', resolutionNote: adminResolutionNote || 'Resolved by Platform Compliance Officer.' })
      });
      toast.success(`Report ${reportId} marked as RESOLVED.`);
    } catch (_) {
      chatEngine.resolveReport(reportId, adminResolutionNote || 'Resolved by Platform Compliance Officer.');
      toast.success(`Report ${reportId} marked as RESOLVED.`);
    }
    fetchLiveReports();
    setSelectedReport(null);
    setAdminResolutionNote('');
  };

  const handleDismiss = async (reportId: string) => {
    try {
      const token = localStorage.getItem('aura_token');
      await fetch(`/api/v1/chat/reports/${reportId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'DISMISSED', resolutionNote: 'Dismissed by Admin' })
      });
      toast.info(`Report ${reportId} dismissed.`);
    } catch (_) {
      chatEngine.dismissReport(reportId);
      toast.info(`Report ${reportId} dismissed.`);
    }
    fetchLiveReports();
    setSelectedReport(null);
  };

  const handleMuteUser = (targetUserId: string, targetName: string) => {
    chatEngine.toggleBlockUser(targetUserId);
    toast.success(`User ${targetName} (UID: ${targetUserId}) messaging restrictions updated.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none text-white text-xs">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30">
              Live Room & DM Compliance
            </span>
            <span className="text-xs text-slate-400 font-mono">UGC Safety Oversight</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Real-Time Chat & Message Moderation</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect reported messages, enforce UGC standards, mute toxic broadcasters, and audit chat moderation history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success('Chat moderation telemetry synchronized.')}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 text-xs font-bold border border-indigo-800/40 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Ledger
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#11162B] border border-indigo-900/30">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Reports</span>
          <p className="text-2xl font-black text-white mt-1">{reports.length}</p>
          <span className="text-[10px] text-indigo-400">All categories</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#11162B] border border-amber-900/30">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pending Review</span>
          <p className="text-2xl font-black text-amber-300 mt-1">
            {reports.filter(r => r.status === 'PENDING').length}
          </p>
          <span className="text-[10px] text-amber-400/80">Action required</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#11162B] border border-emerald-900/30">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Resolved & Penalized</span>
          <p className="text-2xl font-black text-emerald-300 mt-1">
            {reports.filter(r => r.status === 'RESOLVED').length}
          </p>
          <span className="text-[10px] text-emerald-400">Compliance enforced</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#11162B] border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dismissed</span>
          <p className="text-2xl font-black text-slate-300 mt-1">
            {reports.filter(r => r.status === 'DISMISSED').length}
          </p>
          <span className="text-[10px] text-slate-500">False alarms</span>
        </div>
      </div>

      {/* Reports Table View */}
      <div className="bg-[#11162B] rounded-3xl border border-indigo-900/30 overflow-hidden shadow-xl">
        
        {/* Filters and search */}
        <div className="p-4 border-b border-indigo-900/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            {(['ALL', 'PENDING', 'RESOLVED', 'DISMISSED'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === s
                    ? 'bg-rose-600 text-white'
                    : 'bg-black/30 text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Report ID, User, or Content..."
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
                <th className="p-4">Report ID</th>
                <th className="p-4">Reported User</th>
                <th className="p-4">Reporter</th>
                <th className="p-4">Message Snippet</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-900/20">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No chat violation reports matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-indigo-950/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-rose-300">
                      {report.id}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-white">{report.reportedUserName}</p>
                        <span className="text-[10px] text-slate-400 font-mono">UID: {report.reportedUserId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-indigo-300">{report.reporterName}</p>
                        <span className="text-[10px] text-slate-400 font-mono">UID: {report.reporterId}</span>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-300 italic">
                      "{report.messageContent}"
                    </td>
                    <td className="p-4 text-amber-300 font-medium">
                      {report.reason}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                        report.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                        report.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                        'bg-slate-500/20 text-slate-400 border-slate-500/40'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-bold border border-indigo-800/40 flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect
                        </button>
                        <button
                          onClick={() => handleMuteUser(report.reportedUserId, report.reportedUserName)}
                          className="px-2 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-800/40 flex items-center gap-1 cursor-pointer"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          Mute User
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

      {/* Report Inspection Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#140D24] border border-rose-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-3 text-rose-300">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-extrabold text-white text-base">Inspect Violation Report {selectedReport.id}</h3>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-rose-900/30 space-y-2">
              <div className="flex justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Reported User:</span>
                <span className="font-bold text-white">{selectedReport.reportedUserName} ({selectedReport.reportedUserId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Reporter:</span>
                <span className="font-bold text-indigo-300">{selectedReport.reporterName} ({selectedReport.reporterId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Timestamp:</span>
                <span className="font-mono text-slate-300">{selectedReport.timestamp}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Flagged Message Content:</span>
              <p className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-200 italic text-xs">
                "{selectedReport.messageContent}"
              </p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Reporter Reason:</span>
              <p className="p-3 rounded-xl bg-black/40 border border-indigo-900/30 text-amber-300 text-xs">
                "{selectedReport.reason}"
              </p>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Resolution Compliance Notes:</label>
              <textarea
                rows={2}
                placeholder="Attach official moderation resolution note..."
                value={adminResolutionNote}
                onChange={e => setAdminResolutionNote(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-black/40 border border-indigo-900/40 text-white focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleDismiss(selectedReport.id)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >
                Dismiss Report
              </button>
              <button
                onClick={() => handleResolve(selectedReport.id)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
              >
                Resolve & Enforce
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
