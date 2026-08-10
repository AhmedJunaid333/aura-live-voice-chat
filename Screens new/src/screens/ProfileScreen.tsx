import { useState } from 'react'

interface Props {
  onNavigate?: (screen: string) => void
}

export default function ProfileScreen({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18] font-sans pb-28 relative">
      {/* Top App Bar Header */}
      <header className="sticky top-0 z-50 px-5 py-4 flex justify-between items-center bg-[#fff8f5]/80 backdrop-blur-lg border-b border-[#d0c5af]/30 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="text-[#735c00] text-2xl active:scale-95 transition-transform">☰</button>
          <h1 className="text-2xl font-extrabold text-[#735c00]" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            Me
          </h1>
        </div>
        <div className="flex items-center gap-4 text-[#4d4635] text-xl">
          <button onClick={() => onNavigate?.('settings')} className="hover:text-[#735c00] active:scale-95 transition-all">
            ⚙️
          </button>
          <button className="hover:text-[#735c00] active:scale-95 transition-all">
            ↗️
          </button>
        </div>
      </header>

      <main className="pb-24">
        {/* Profile Header Section */}
        <section className="relative overflow-hidden pt-6 px-5 pb-6">
          {/* Luxury Background Texture */}
          <div className="absolute inset-0 -z-10 opacity-30">
            <img
              src="https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=800&h=400&fit=crop&auto=format"
              alt="Palace Background"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fff8f5]/80 to-[#fff8f5]"></div>
          </div>

          <div className="flex flex-col items-center gap-4 mt-6">
            {/* Avatar Container */}
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-[0_4px_20px_rgba(212,175,55,0.15)] overflow-hidden bg-white">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format"
                  alt="MR √Lucky☆࿐"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#735c00] text-white rounded-full p-1 border-2 border-white text-xs">
                🛡️
              </div>
            </div>

            {/* User Info */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl font-bold text-[#1e1b18]">MR √Lucky☆࿐</h2>
                <span className="text-blue-500 font-bold text-sm">♂</span>
              </div>
              <p className="text-xs text-[#4d4635] font-semibold mt-1">ID: 106172</p>
            </div>

            {/* Stats Row */}
            <div className="flex justify-around w-full mt-2 bg-white/70 backdrop-blur-md py-3.5 rounded-2xl border border-white/60 shadow-sm">
              <div className="text-center flex flex-col items-center">
                <span className="text-xl font-bold text-[#735c00]">9</span>
                <span className="text-[11px] text-[#4d4635] font-medium">Visitors</span>
              </div>
              <div className="w-px h-7 bg-[#d0c5af]/40 self-center"></div>
              <div className="text-center flex flex-col items-center">
                <span className="text-xl font-bold text-[#735c00]">4</span>
                <span className="text-[11px] text-[#4d4635] font-medium">Following</span>
              </div>
              <div className="w-px h-7 bg-[#d0c5af]/40 self-center"></div>
              <div className="text-center flex flex-col items-center">
                <span className="text-xl font-bold text-[#735c00]">2</span>
                <span className="text-[11px] text-[#4d4635] font-medium">Followers</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="px-5">
          <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgba(212,175,55,0.08)] border border-slate-100">
            <div onClick={() => onNavigate?.('wallet')} className="flex flex-col items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-orange-50 text-orange-500 text-2xl">
                👛
              </div>
              <span className="text-[11px] font-semibold text-[#1e1b18]">Wallet</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-purple-50 text-purple-500 text-2xl">
                🏪
              </div>
              <span className="text-[11px] font-semibold text-[#1e1b18]">Store</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-500 text-2xl">
                🛍️
              </div>
              <span className="text-[11px] font-semibold text-[#1e1b18]">Bag</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 text-2xl">
                🎁
              </div>
              <span className="text-[11px] font-semibold text-[#1e1b18]">Reward</span>
            </div>
          </div>
        </section>

        {/* Membership Badges */}
        <section className="px-5 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Noble Card */}
            <div onClick={() => onNavigate?.('vip')} className="relative h-28 rounded-2xl overflow-hidden shadow-md cursor-pointer hover:scale-[0.98] active:scale-95 transition-transform bg-neutral-900">
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
              <div className="relative z-20 h-full flex items-center px-4 gap-3">
                <div className="w-12 h-12 flex items-center justify-center text-3xl">
                  🎖️
                </div>
                <div className="flex flex-col">
                  <span className="text-amber-400 font-extrabold italic text-lg tracking-wider">Noble</span>
                </div>
              </div>
            </div>

            {/* SVIP Card */}
            <div onClick={() => onNavigate?.('vip')} className="relative h-28 rounded-2xl overflow-hidden shadow-md cursor-pointer hover:scale-[0.98] active:scale-95 transition-transform bg-gradient-to-br from-yellow-600 via-amber-400 to-yellow-600">
              <div className="relative z-20 h-full flex items-center px-4 gap-3">
                <div className="w-12 h-12 flex items-center justify-center text-3xl">
                  👑
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-extrabold italic text-lg tracking-wider">SVIP</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu List */}
        <section className="px-5 mt-4">
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(212,175,55,0.08)] border border-slate-100 divide-y divide-slate-100 overflow-hidden">
            {/* Family */}
            <div onClick={() => onNavigate?.('family')} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#735c00]/10 text-xl">
                  👨‍👩‍👧‍👦
                </div>
                <span className="text-sm font-semibold text-[#1e1b18]">Family</span>
              </div>
              <span className="text-slate-400 group-hover:translate-x-1 transition-transform">➔</span>
            </div>

            {/* CP */}
            <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-xl">
                  💖
                </div>
                <span className="text-sm font-semibold text-[#1e1b18]">CP</span>
              </div>
              <span className="text-slate-400 group-hover:translate-x-1 transition-transform">➔</span>
            </div>

            {/* Brother and Sister */}
            <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-xl">
                  👫
                </div>
                <span className="text-sm font-semibold text-[#1e1b18]">Brother and Sister</span>
              </div>
              <span className="text-slate-400 group-hover:translate-x-1 transition-transform">➔</span>
            </div>

            {/* Wallet Extra */}
            <div onClick={() => onNavigate?.('wallet')} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 text-xl">
                  🏦
                </div>
                <span className="text-sm font-semibold text-[#1e1b18]">Wallet Details</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#735c00]">1,240 Coins</span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">➔</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
