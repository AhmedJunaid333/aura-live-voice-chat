import { useState } from 'react'

interface Props {
  onBack?: () => void
}

const performers = [
  {
    id: 1,
    name: 'Aria Bloom',
    tag: 'Top Earner',
    todayCoins: '45.2k',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
    isLive: true,
  },
  {
    id: 2,
    name: 'Zenith_Live',
    tag: 'Rising Star',
    todayCoins: '28.1k',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    isLive: false,
  },
  {
    id: 3,
    name: 'Melody_Vibe',
    tag: 'Consistent',
    todayCoins: '19.5k',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&auto=format',
    isLive: false,
  },
]

const tools = [
  { title: 'Recruit Hosts', icon: '👤+', color: 'text-[#d2bbff]', bg: 'bg-[#7c3aed]/20' },
  { title: 'Payout Records', icon: '💳', color: 'text-[#ddb7ff]', bg: 'bg-[#6f00be]/20' },
  { title: 'Agency Rules', icon: '📜', color: 'text-[#ffb2b8]', bg: 'bg-[#c61f47]/20' },
  { title: 'Support', icon: '🎧', color: 'text-white', bg: 'bg-white/10' },
]

export default function AgencyPanelScreen({ onBack }: Props) {
  return (
    <div className="min-h-screen pb-32 text-[#e8dfee] bg-[#0F0B1E] relative overflow-hidden">
      {/* Background Atmospheric Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-50 blur-[100px]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7c3aed] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#ddb7ff] rounded-full mix-blend-screen"></div>
      </div>

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 py-3 backdrop-blur-xl bg-[#15121b]/40 border-b border-white/15 shadow-[0_0_20px_rgba(210,187,255,0.2)]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1 text-[#d2bbff] hover:opacity-80">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          )}
          <div className="w-10 h-10 rounded-full border-2 border-[#d2bbff] overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format"
              alt="Manager Avatar"
            />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#d2bbff] to-[#ddb7ff] bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Aura Live
          </h1>
        </div>
        <div className="flex items-center bg-[#2c2833]/60 px-4 py-1.5 rounded-full border border-white/10">
          <span className="text-[#d2bbff] font-bold text-sm">💎 1,250</span>
        </div>
      </header>

      <main className="pt-24 pb-32 px-4 space-y-6 max-w-md mx-auto relative z-10">
        {/* Agency Header Card */}
        <section className="bg-[#1b1633]/60 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_15px_rgba(210,187,255,0.2)]">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl font-bold text-white">Galaxy Talent Agency</h2>
                <span className="text-[#d2bbff] text-sm">✓</span>
              </div>
              <p className="text-[10px] font-bold text-[#ccc3d8]/80 uppercase tracking-widest">Master Agency Account</p>
            </div>
            <div className="bg-[#7c3aed]/20 text-[#d2bbff] text-xs font-bold px-3 py-1 rounded-lg border border-[#7c3aed]/30 shadow-sm animate-pulse">
              LVL 12
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#ccc3d8]">Exp Progress</span>
              <span className="text-[#d2bbff] font-bold">8,450 / 10,000</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#7c3aed] to-[#ddb7ff] w-[84%] shadow-[0_0_10px_rgba(210,187,255,0.6)]"></div>
            </div>
          </div>
        </section>

        {/* Performance Overview (3 Cards) */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-[#1b1633]/60 backdrop-blur-2xl border border-white/15 p-3 rounded-2xl flex flex-col items-center text-center">
            <span className="text-2xl mb-1">👥</span>
            <span className="text-xl font-bold text-white">142</span>
            <span className="text-[10px] text-[#ccc3d8] leading-tight mt-0.5">Total Hosts</span>
          </div>
          <div className="bg-[#1b1633]/60 backdrop-blur-2xl border border-[#d2bbff]/30 p-3 rounded-2xl flex flex-col items-center text-center">
            <span className="text-2xl mb-1">💎</span>
            <span className="text-xl font-bold text-[#d2bbff]">2.4M</span>
            <span className="text-[10px] text-[#ccc3d8] leading-tight mt-0.5">Mthly Rev</span>
          </div>
          <div className="bg-[#1b1633]/60 backdrop-blur-2xl border border-white/15 p-3 rounded-2xl flex flex-col items-center text-center">
            <span className="text-2xl mb-1">⚡</span>
            <span className="text-xl font-bold text-[#ffb2b8]">58</span>
            <span className="text-[10px] text-[#ccc3d8] leading-tight mt-0.5">Daily Act.</span>
          </div>
        </section>

        {/* Top Performers List */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-lg font-bold text-white">Top Performers</h3>
            <button className="text-[#d2bbff] text-xs font-semibold hover:underline">View All</button>
          </div>

          <div className="space-y-3">
            {performers.map(p => (
              <div
                key={p.id}
                className="bg-[#1b1633]/60 backdrop-blur-2xl border border-white/15 p-4 rounded-2xl flex items-center justify-between hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-[#ddb7ff] overflow-hidden">
                      <img className="w-full h-full object-cover" src={p.avatar} alt={p.name} />
                    </div>
                    {p.isLive && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#15121b] animate-ping"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{p.name}</p>
                    <p className="text-xs text-[#ddb7ff] font-medium">{p.tag}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-[#d2bbff]">💎 {p.todayCoins}</p>
                  <p className="text-[10px] text-[#ccc3d8]">Today</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Management Tools */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white">Agency Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            {tools.map(t => (
              <button
                key={t.title}
                className="bg-[#1b1633]/60 backdrop-blur-2xl border border-white/15 p-5 rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-transform hover:bg-white/[0.08]"
              >
                <div className={`w-12 h-12 rounded-full ${t.bg} flex items-center justify-center text-xl`}>
                  {t.icon}
                </div>
                <span className="text-xs font-semibold text-white">{t.title}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
