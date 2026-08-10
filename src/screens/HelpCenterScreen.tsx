import React, { useState } from 'react';

interface HelpCenterProps {
  onBack: () => void;
}

export default function HelpCenterScreen({ onBack }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: '🔥 All Topics' },
    { id: 'getting-started', label: '🚀 Getting Started' },
    { id: 'live-stream', label: '📹 Live Stream' },
    { id: 'recharge', label: '🪙 Recharge & Wallet' },
    { id: 'withdrawal', label: '🏦 Cashout & Salary' },
    { id: 'family', label: '👨‍👩‍👧‍👦 Family Guild' },
    { id: 'vip', label: '👑 VIP Nobles' },
    { id: 'safety', label: '🛡️ Security & Rules' },
  ];

  const articles = [
    { title: 'How to Go Live & Earn Coins 2026', cat: 'live-stream', reads: '1.2M Reads', time: '3 min read' },
    { title: 'Host Withdrawal Guide: Local Banks & Crypto', cat: 'withdrawal', reads: '840K Reads', time: '4 min read' },
    { title: 'How to Join or Level Up Your Family Guild', cat: 'family', reads: '620K Reads', time: '2 min read' },
    { title: 'VIP Noble Tiers, Entrance Vehicles & Chat Bubbles', cat: 'vip', reads: '450K Reads', time: '5 min read' },
    { title: 'Safety Tips: Protecting Your Account & Payments', cat: 'safety', reads: '910K Reads', time: '3 min read' },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col font-sans pb-12">
      {/* Top Bar */}
      <header className="p-4 border-b border-[#1E293B] bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <button onClick={onBack} className="p-2 rounded-xl bg-[#1E293B] text-slate-300 font-bold text-xs">
          ← Back
        </button>
        <h1 className="text-base font-black bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">
          📖 Help & Learning Center
        </h1>
        <span className="text-xs text-amber-400 font-bold">CMS V2.4</span>
      </header>

      {/* Main Container */}
      <div className="p-4 space-y-4 max-w-md mx-auto w-full flex-1">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search guides, FAQs, recharge, hosts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full p-3.5 pl-10 rounded-2xl bg-[#131C2E] border border-[#273449] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
          />
          <span className="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1" style={{ scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCategory === cat.id ? 'bg-amber-600 text-white shadow-lg' : 'bg-[#1E293B] text-slate-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Guide Banner */}
        <div className="bg-gradient-to-r from-amber-900/40 via-purple-900/30 to-slate-900 border border-amber-500/30 p-4 rounded-2xl space-y-2 relative overflow-hidden">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase">
            🔥 Featured Tutorial
          </span>
          <h3 className="font-black text-sm text-white">Official Host Onboarding & Revenue Target Guide</h3>
          <p className="text-xs text-slate-300">Learn how streaming target hours, gift bonuses, and agency commissions work in 2026.</p>
          <div className="text-[10px] text-amber-400 font-mono pt-1">1.84M Views • 4 min step-by-step</div>
        </div>

        {/* Article Roster */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-white">Popular Articles & Guides</h3>
          {articles
            .filter(a => activeCategory === 'all' || a.cat === activeCategory)
            .map(art => (
              <div
                key={art.title}
                onClick={() => alert(`Opening Guide: ${art.title}`)}
                className="bg-[#131C2E] border border-[#273449] p-3.5 rounded-2xl flex justify-between items-center hover:border-amber-500 transition cursor-pointer"
              >
                <div>
                  <h4 className="font-bold text-xs text-white">{art.title}</h4>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{art.reads} • {art.time}</div>
                </div>
                <span className="text-slate-400 text-sm">➔</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
