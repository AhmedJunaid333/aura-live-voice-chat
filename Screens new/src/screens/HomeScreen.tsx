import { useState } from 'react'

interface Props {
  onNavigate?: (screen: string) => void
}

const popularRooms = [
  {
    id: 1,
    title: 'Midnight Jazz & Talk',
    host: 'Elara Grace',
    listeners: '1.2k',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
    bg: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop&auto=format',
  },
  {
    id: 2,
    title: 'Philosophy After Hours',
    host: 'Prof. Julian',
    listeners: '842',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
    bg: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=400&fit=crop&auto=format',
  },
  {
    id: 3,
    title: 'Global Beat Drop',
    host: 'DJ Koda',
    listeners: '2.5k',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
    bg: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop&auto=format',
  },
  {
    id: 4,
    title: 'Morning Mindfulness',
    host: 'Sarah Zen',
    listeners: '315',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format',
    bg: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop&auto=format',
  },
]

const newsBadges = [
  { id: 1, title: 'Billionaire', icon: '👑', color: 'border-[#d4af37]' },
  { id: 2, title: 'Wealth', icon: '🏛️', color: 'border-[#7f7663]' },
  { id: 3, title: 'Charm', icon: '✨', color: 'border-[#8ebda6]' },
  { id: 4, title: 'LiveRoom', icon: '🎙️', color: 'border-[#ffe088]' },
  { id: 5, title: 'PartyRoom', icon: '🎉', color: 'border-[#e1e3e4]' },
]

export default function HomeScreen({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState('Party')

  return (
    <div className="min-h-screen bg-[#f9f9fa] text-[#1a1c1d] font-sans pb-28 relative">
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-5 py-3.5 bg-[#f9f9fa]/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer" onClick={() => onNavigate?.('profile')}>
            <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] p-0.5 overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-full"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format"
                alt="Avatar"
              />
            </div>
            <span className="absolute -top-1 -right-1 bg-[#735c00] text-white text-[8px] px-1 rounded-full border border-white font-bold">
              PRO
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-[#735c00]" style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>
            Auralive
          </h1>
        </div>
        <div className="flex items-center gap-2 text-[#735c00] text-xl">
          <button className="p-2 hover:bg-[#d4af37]/20 rounded-full transition-colors">🔍</button>
          <button className="p-2 hover:bg-[#d4af37]/20 rounded-full transition-colors">🔔</button>
        </div>
      </header>

      <main className="pb-24">
        {/* Navigation Tab Bar */}
        <nav className="flex px-5 py-2 space-x-8 overflow-x-auto no-scrollbar items-center bg-[#f9f9fa] sticky top-[57px] z-40 border-b border-slate-100">
          {['Mine', 'Party', 'Live'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'text-[#735c00] border-b-2 border-[#735c00]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Hero Banner */}
        <section className="px-5 mt-4">
          <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=400&fit=crop&auto=format"
              alt="Extra EXP Bonus Event"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
              <div className="inline-flex items-center bg-[#d4af37] text-[#554300] text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1 w-fit">
                SPECIAL EVENT
              </div>
              <h2 className="text-white font-extrabold text-xl leading-tight">EXTRA EXP BONUS</h2>
              <p className="text-white/80 text-xs font-mono mt-1">27/7/2026 00:00 - 2/8/2026 23:59</p>
            </div>
          </div>
        </section>

        {/* Voice Rooms Grid */}
        <section className="px-5 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-[#1a1c1d]">Popular Rooms</h3>
            <button onClick={() => onNavigate?.('audio-meetup')} className="text-[#735c00] text-sm font-bold flex items-center hover:underline">
              See all ➔
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {popularRooms.map(room => (
              <div
                key={room.id}
                onClick={() => onNavigate?.('audio-meetup')}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-md group cursor-pointer hover:shadow-xl transition-all"
              >
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={room.bg} alt={room.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <span className="bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold border border-white/20">
                      📊 {room.listeners}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm line-clamp-1 mb-1.5">{room.title}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border border-white/40 overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover" src={room.avatar} alt={room.host} />
                      </div>
                      <span className="text-white/90 text-[10px] font-medium truncate">Host: {room.host}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Auralive News / Badges Section */}
        <section className="mt-6">
          <div className="px-5 flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">🔥</span>
              <h3 className="font-bold text-lg text-[#1a1c1d]">Auralive News</h3>
            </div>
            <button className="text-slate-500 text-sm font-medium hover:text-slate-800">More ➔</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-2">
            {newsBadges.map(badge => (
              <div key={badge.id} className="flex flex-col items-center min-w-[72px] gap-1.5 cursor-pointer hover:scale-105 transition-transform">
                <div className={`w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 ${badge.color} shadow-sm text-2xl`}>
                  {badge.icon}
                </div>
                <span className="text-[10px] font-bold text-[#4d4635] text-center">{badge.title}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
