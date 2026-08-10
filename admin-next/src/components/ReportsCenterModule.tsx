'use client';

import React, { useState } from 'react';

export default function ReportsCenterModule() {
  const [reports, setReports] = useState([
    { id: 'RPT-301', reporter: 'Dimple (UID: 100003)', reportedUser: 'User_100099', reason: 'Harassment in Audio Lounge', evidence: 'Audio Recording Snippet', date: '2026-08-10 23:00', status: 'UNDER_REVIEW' },
    { id: 'RPT-302', reporter: 'Ahmed Khokhar (UID: 100001)', reportedUser: 'User_100045', reason: 'Unauthorized Diamond Offer Scam', evidence: 'Chat Screenshot', date: '2026-08-10 20:15', status: 'RESOLVED' },
  ]);

  const handleResolve = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'RESOLVED' } : r));
    alert(`Report ${id} marked as resolved!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900/40 via-purple-900/30 to-slate-900/40 border border-rose-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🚩 User & Room Abuse Reports Center
        </h2>
        <p className="text-xs text-slate-300 mt-1">Review user-submitted misconduct reports, audio evidence recordings, chat screenshots & take moderator action</p>
      </div>

      {/* Reports Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-rose-400">📋 User Misconduct Complaints ({reports.length} Reports)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Report ID</th>
                <th className="pb-3">Reporting User</th>
                <th className="pb-3">Reported Offender</th>
                <th className="pb-3">Complaint Reason</th>
                <th className="pb-3">Attached Evidence</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-rose-400">{r.id}</td>
                  <td className="font-bold text-white">{r.reporter}</td>
                  <td className="text-amber-300 font-bold">{r.reportedUser}</td>
                  <td className="text-slate-300 max-w-xs">{r.reason}</td>
                  <td className="text-cyan-300">{r.evidence}</td>
                  <td className="text-slate-400">{r.date}</td>
                  <td>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.status === 'UNDER_REVIEW' ? (
                      <button
                        onClick={() => handleResolve(r.id)}
                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[10px] transition cursor-pointer"
                      >
                        ✓ Mark Resolved
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[10px]">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
