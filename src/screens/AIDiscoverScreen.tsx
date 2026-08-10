import { useState } from 'react'
import { ProfileShuffleBar } from '../components/ProfileShuffleBar'

const hashtags = ['Music', 'Gaming', 'Love', 'ASMR', 'Dance']

const globalStars = [
  {
    rank: 1,
    name: 'AuraQueen',
    xp: '1.5M XP',
    borderColor: '#FFD700',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
    isTop: true,
  },
  {
    rank: 2,
    name: 'X-Ray',
    xp: '892k XP',
    borderColor: '#C0C0C0',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    isTop: false,
  },
  {
    rank: 3,
    name: 'NeonZen',
    xp: '745k XP',
    borderColor: '#CD7F32',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format',
    isTop: false,
  },
]

const activeStreams = [
  {
    id: 1,
    title: 'Midnight Vibes w/ Sarah',
    category: 'Music & Chill',
    icon: '🎵',
    viewers: '1.4k',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=500&fit=crop&auto=format',
    isPulse: true,
  },
  {
    id: 2,
    title: 'Global Tournament Semi-Finals',
    category: 'Competitive Gaming',
    icon: '🎮',
    viewers: '842',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=500&fit=crop&auto=format',
    isPulse: false,
  },
  {
    id: 3,
    title: 'Painting Neon Galaxies',
    category: 'Creative Art',
    icon: '🎨',
    viewers: '2.1k',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=500&fit=crop&auto=format',
    isPulse: false,
  },
  {
    id: 4,
    title: 'Night Chats & Q&A',
    category: 'Talk Show',
    icon: '💬',
    viewers: '3.5k',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&auto=format',
    isPulse: false,
    highlight: true,
  },
]

export default function AIDiscoverScreen() {
  const [selectedTags, setSelectedTags] = useState<string[]>(['Music'])
  const [searchQuery, setSearchQuery] = useState('')

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  return (
    <div className="min-h-screen pb-32 text-[#e8dfee]" style={{ background: 'radial-gradient(circle at 20% 30%, #2c0051 0%, transparent 40%), radial-gradient(circle at 80% 70%, #490080 0%, transparent 40%), #15121b' }}>
      {/* Top AppBar */}
      <header className="flex justify-between items-center w-full px-4 py-3 fixed top-0 z-50 backdrop-blur-xl" style={{ background: 'linear-gradient(180deg, #15121b 70%, transparent)' }}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-[#FFD700] p-0.5 overflow-hidden">
            <img
              className="w-full h-full object-cover rounded-full"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format"
              alt="Profile Avatar"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#d2bbff] tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Aura
          </h1>
        </div>
        <div className="bg-[#2c2833] px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/5">
          <span className="text-[#ffb2b8] text-sm">💎</span>
          <span className="font-semibold text-xs text-[#e8dfee]">1.2k Diamonds</span>
        </div>
      </header>

      <main className="pt-20 px-4 space-y-8">
        {/* Search Bar */}
        <section className="mt-4">
          <div className="flex items-center px-4 py-3 rounded-2xl w-full border border-white/15 backdrop-blur-xl" style={{ background: 'rgba(27, 22, 51, 0.4)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#958da1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-[#e8dfee] placeholder-[#958da1] flex-1 px-3 text-sm"
              placeholder="Search streamers, hashtags, or IDs"
              type="text"
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d2bbff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
          </div>
        </section>

        {/* Universal Real-Time Profile Shuffle */}
        <ProfileShuffleBar context="DISCOVER" title="Discover Rising Talents" subtitle="Live audio room hosts & VIP royalty" />

        {/* Trending Hashtags */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-semibold text-[#e8dfee]">Trending Topics</h2>
            <span className="text-[#d2bbff] text-xs font-semibold uppercase tracking-wider cursor-pointer">See All</span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {hashtags.map(tag => {
              const active = selectedTags.includes(tag)
              return (
                <div
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full border flex items-center gap-2 cursor-pointer transition-all ${
                    active
                      ? 'bg-[#7c3aed] text-white border-[#7c3aed] shadow-[0_0_12px_rgba(124,58,237,0.5)]'
                      : 'bg-[#1b1633]/40 text-[#e8dfee] border-[#d2bbff]/20 hover:bg-[#d2bbff]/10'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-[#d2bbff]'}>#</span>
                  <span className="text-xs font-semibold">{tag}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Global Star Ranking */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#e8dfee] text-center">Global Star Ranking</h2>
          <div className="grid grid-cols-3 items-end gap-2 px-1">
            {/* Rank 2 */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-[#C0C0C0] p-1 overflow-hidden">
                  <img className="w-full h-full object-cover rounded-full" src={globalStars[1].avatar} alt={globalStars[1].name} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#C0C0C0] text-[#15121b] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  2
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[#e8dfee] truncate w-24">{globalStars[1].name}</p>
                <p className="text-[10px] text-[#958da1]">{globalStars[1].xp}</p>
              </div>
            </div>

            {/* Rank 1 */}
            <div className="flex flex-col items-center gap-4 transform -translate-y-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-[#FFD700] p-1 overflow-hidden shadow-[0_0_25px_rgba(255,215,0,0.4)]">
                  <img className="w-full h-full object-cover rounded-full" src={globalStars[0].avatar} alt={globalStars[0].name} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FFD700] text-[#15121b] text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  1
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl">
                  👑
                </div>
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-[#e8dfee] truncate w-28">{globalStars[0].name}</p>
                <p className="text-xs text-[#d2bbff] font-bold">{globalStars[0].xp}</p>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-[#CD7F32] p-1 overflow-hidden">
                  <img className="w-full h-full object-cover rounded-full" src={globalStars[2].avatar} alt={globalStars[2].name} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#CD7F32] text-[#15121b] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  3
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-[#e8dfee] truncate w-24">{globalStars[2].name}</p>
                <p className="text-[10px] text-[#958da1]">{globalStars[2].xp}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Active Streamers */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-bold text-[#e8dfee]">Active Now</h2>
            <div className="flex gap-2 text-[#d2bbff]">
              <span className="cursor-pointer">⊞</span>
              <span className="cursor-pointer text-[#958da1]">☰</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {activeStreams.map(stream => (
              <div
                key={stream.id}
                className={`relative rounded-3xl overflow-hidden aspect-[3/4] border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                  stream.highlight ? 'border-[#d2bbff]/60' : 'border-white/15'
                }`}
                style={{ background: 'rgba(27, 22, 51, 0.4)', backdropFilter: 'blur(24px)' }}
              >
                <img className="w-full h-full object-cover" src={stream.image} alt={stream.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="bg-red-600 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                    <span className="text-[10px] font-bold text-white tracking-widest">LIVE</span>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-white">
                    {stream.viewers}
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-xs font-semibold truncate">{stream.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs">{stream.icon}</span>
                    <span className="text-[10px] text-[#ccc3d8]">{stream.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
