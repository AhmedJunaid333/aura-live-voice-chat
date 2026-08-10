import { useState } from 'react'

interface Props {
  onNavigate?: (screen: string) => void
}

const conversations = [
  {
    id: 1,
    name: 'MR √Lucky☆࿐',
    gender: 'male',
    badge: 'Noble',
    badgeColor: 'bg-[#D4AF37] text-white',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format',
    time: '10:45 AM',
    message: 'See you in the room later! 🚀',
    unread: 2,
    goldBorder: true,
  },
  {
    id: 2,
    name: 'Aura Princess 👑',
    gender: 'female',
    badge: 'Noble',
    badgeColor: 'bg-[#D4AF37] text-white',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format',
    time: '09:12 AM',
    message: 'Did you check the new rewards section?',
    unread: 0,
    goldBorder: true,
  },
  {
    id: 3,
    name: 'Captain Alpha',
    gender: 'male',
    badge: 'SVIP',
    badgeColor: 'bg-slate-700 text-white',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
    time: 'Yesterday',
    message: 'The family battle starts in 10 mins.',
    unread: 0,
    goldBorder: false,
  },
  {
    id: 4,
    name: 'Brother Mike',
    gender: 'male',
    badge: null,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format',
    time: 'Yesterday',
    message: 'Shared a Moment with you.',
    unread: 0,
    goldBorder: false,
  },
  {
    id: 5,
    name: 'Serene Soul',
    gender: 'female',
    badge: null,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&auto=format',
    time: 'Tuesday',
    message: 'Thanks for the support!',
    unread: 0,
    goldBorder: false,
  },
]

export default function ChatScreen({ onNavigate }: Props) {
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = conversations.filter(
    c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 font-sans pb-28 relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between bg-[#121212] border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-[#D4AF37]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Messages
        </h1>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-slate-800 transition-colors text-[#D4AF37] text-xl">
            👤⁺
          </button>
          <button className="p-2 rounded-full hover:bg-slate-800 transition-colors text-[#D4AF37] text-xl">
            ⚙️
          </button>
        </div>
      </header>

      {/* Search Input Bar */}
      <div className="px-6 py-4">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border-none rounded-2xl ring-1 ring-slate-800 focus:ring-2 focus:ring-[#D4AF37] outline-none text-sm text-white placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>

      {/* Main Conversation List */}
      <main className="px-3 space-y-1">
        {filtered.map(c => (
          <div
            key={c.id}
            className="flex items-center p-4 hover:bg-slate-800/50 rounded-2xl transition-all group cursor-pointer"
          >
            <div className="relative flex-shrink-0">
              <div className={`w-14 h-14 rounded-full overflow-hidden shadow-md ${c.goldBorder ? 'border-2 border-[#D4AF37] p-[1px]' : 'border-2 border-slate-700'}`}>
                <img className="w-full h-full object-cover rounded-full" src={c.avatar} alt={c.name} />
              </div>
              {c.badge && (
                <div className={`absolute -bottom-1 -right-1 ${c.badgeColor} text-[10px] px-1.5 rounded-full font-bold border-2 border-[#121212]`}>
                  {c.badge}
                </div>
              )}
            </div>

            <div className="ml-4 flex-1 border-b border-slate-800 pb-4 group-last:border-none">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-white flex items-center gap-1.5 text-base">
                  <span>{c.name}</span>
                  <span className={`text-xs ${c.gender === 'male' ? 'text-blue-400' : 'text-pink-400'}`}>
                    {c.gender === 'male' ? '♂' : '♀'}
                  </span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">{c.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-400 line-clamp-1">{c.message}</p>
                {c.unread > 0 && (
                  <span className="bg-[#D4AF37] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full ml-2">
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Floating Action Button */}
      <button className="fixed right-6 bottom-24 bg-[#D4AF37] text-white w-14 h-14 rounded-full shadow-lg shadow-[#D4AF37]/30 flex items-center justify-center hover:scale-105 transition-transform active:scale-95 text-xl font-bold z-50">
        ✏️
      </button>
    </div>
  )
}
