import React, { useState } from 'react';

interface HelpSupportProps {
  onBack: () => void;
}

export default function HelpSupportScreen({ onBack }: HelpSupportProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'reports' | 'feedback' | 'tickets' | 'bug' | 'appeal'>('home');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col font-sans pb-12">
      {/* Top Header */}
      <header className="p-4 border-b border-[#1E293B] bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-xl bg-[#1E293B] text-slate-300 font-bold text-xs">
          ← Back
        </button>
        <h1 className="text-base font-black bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent">
          🛡️ Help & Support Center
        </h1>
        <button onClick={() => triggerToast('Support Agent Available 24/7')} className="text-xs text-rose-400 font-bold">
          24/7 Live
        </button>
      </header>

      {/* Main Container */}
      <div className="p-4 space-y-4 max-w-md mx-auto w-full flex-1">
        {/* Toast Alert */}
        {showToast && (
          <div className="bg-rose-600 text-white text-xs font-bold p-3 rounded-2xl shadow-xl text-center animate-bounce">
            ✅ {toastMessage}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {[
            { id: 'home', label: '🏠 Support Hub' },
            { id: 'tickets', label: '🎫 My Tickets' },
            { id: 'reports', label: '📋 My Reports' },
            { id: 'feedback', label: '💬 Feedback' },
            { id: 'bug', label: '🛠 Report Bug' },
            { id: 'appeal', label: '⚠ Appeal Ban' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === t.id ? 'bg-rose-600 text-white shadow-lg' : 'bg-[#1E293B] text-slate-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-rose-900/40 to-slate-900 border border-rose-500/30 p-4 rounded-2xl space-y-2">
              <h3 className="font-black text-sm text-rose-400">Welcome to Auralive Help Center</h3>
              <p className="text-xs text-slate-300">Submit reports, track tickets, report bugs, or appeal suspensions directly to our Trust & Safety team.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { title: '🎫 Open Ticket', desc: 'Create support request', action: () => setActiveTab('tickets'), icon: '💬' },
                { title: '📋 My Reports', desc: 'View submitted violations', action: () => setActiveTab('reports'), icon: '🛡️' },
                { title: '🛠 Report Bug', desc: 'Found an issue?', action: () => setActiveTab('bug'), icon: '🐛' },
                { title: '⚠ Appeal Ban', desc: 'Wrongly suspended?', action: () => setActiveTab('appeal'), icon: '⚖️' },
                { title: '💡 Suggest Feature', desc: 'Share your ideas', action: () => setActiveTab('feedback'), icon: '✨' },
                { title: '⭐ Rate App', desc: 'Review on Store', action: () => triggerToast('Thank you for rating 5 Stars! ⭐⭐⭐⭐⭐'), icon: '⭐' },
              ].map(item => (
                <button
                  key={item.title}
                  onClick={item.action}
                  className="bg-[#131C2E] border border-[#273449] p-3.5 rounded-2xl text-left hover:border-rose-500 transition space-y-1"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="font-bold text-xs text-white">{item.title}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TICKETS */}
        {activeTab === 'tickets' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">🎫 Support Tickets & History</h3>
              <button
                onClick={() => triggerToast('New Ticket #TKT-909 Submitted')}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                + New Ticket
              </button>
            </div>

            {[
              { id: '#TKT-8012', subject: 'Recharge Coins Delay', category: 'Wallet', status: 'IN PROGRESS', date: 'Today' },
              { id: '#TKT-7819', subject: 'Family Guild Badge Unlock', category: 'Family', status: 'SOLVED', date: 'Yesterday' },
            ].map(tkt => (
              <div key={tkt.id} className="bg-[#131C2E] border border-[#273449] p-3.5 rounded-2xl space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-rose-400 font-bold">{tkt.id}</span>
                  <span className="text-emerald-400 font-bold">{tkt.status}</span>
                </div>
                <div className="font-bold text-xs text-white">{tkt.subject}</div>
                <div className="text-[10px] text-slate-400">Category: {tkt.category} • {tkt.date}</div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white">📋 My Submitted Reports</h3>
            {[
              { id: '#REP-401', target: 'Spam_Bot_12 (Live Room #801)', category: 'Harassment', status: 'ACTION TAKEN', date: 'Aug 4, 2026' },
              { id: '#REP-392', target: 'Fake_Seller_09', category: 'Fraud Scam Link', status: 'BANNED', date: 'Aug 2, 2026' },
            ].map(rep => (
              <div key={rep.id} className="bg-[#131C2E] border border-[#273449] p-3.5 rounded-2xl space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-amber-400 font-bold">{rep.id}</span>
                  <span className="text-rose-400 font-bold">{rep.status}</span>
                </div>
                <div className="font-bold text-xs text-white">Target: {rep.target}</div>
                <div className="text-[10px] text-slate-400">Category: {rep.category} • {rep.date}</div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: BUG REPORT / APPEAL / FEEDBACK FORMS */}
        {(activeTab === 'bug' || activeTab === 'appeal' || activeTab === 'feedback') && (
          <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl space-y-3">
            <h3 className="font-bold text-sm text-white">
              {activeTab === 'bug' ? '🛠 Report a Bug' : activeTab === 'appeal' ? '⚠ Appeal Ban / Suspension' : '💡 Submit Feedback'}
            </h3>
            <textarea
              rows={4}
              placeholder={
                activeTab === 'bug'
                  ? 'Describe the issue, device model & steps to reproduce...'
                  : activeTab === 'appeal'
                  ? 'Explain why your account suspension should be reviewed...'
                  : 'Share your suggestions or feature ideas with us...'
              }
              className="w-full p-3 rounded-xl bg-[#0B1220] border border-[#273449] text-xs text-white focus:outline-none focus:border-rose-500"
            />
            <button
              onClick={() => {
                triggerToast('Request Submitted Successfully! Ticket Created.');
                setActiveTab('tickets');
              }}
              className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-lg"
            >
              Submit Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
