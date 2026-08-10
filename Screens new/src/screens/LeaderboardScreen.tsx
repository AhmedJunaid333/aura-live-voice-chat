import { useState } from 'react'

interface Props {
  onBack?: () => void
}

const listPerformers = [
  {
    rank: 4,
    name: 'NeonShadow',
    level: 'Lv.32',
    progress: 85,
    points: '420.5k',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format',
  },
  {
    rank: 5,
    name: 'PixelDream',
    level: 'Lv.28',
    progress: 72,
    points: '398.2k',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
  },
  {
    rank: 6,
    name: 'Aura_Vibe',
    level: 'Lv.31',
    progress: 65,
    points: '312.1k',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&auto=format',
  },
  {
    rank: 7,
    name: 'MidnightZen',
    level: 'Lv.25',
    progress: 48,
    points: '285.9k',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format',
  },
]

export default function LeaderboardScreen({ onBack }: Props) {
  const [role, setRole] = useState<'host' | 'gifter'>('host')
  const [timeframe, setTimeframe] = useState<'hourly' | 'daily' | 'weekly'>('hourly')

  return (
    <div className="min-h-screen pb-32 text-[#e8dfee] bg-[#0F0B1E] relative overflow-hidden">
      {/* Background Atmospheric Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 blur-[120px]">
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#d2bbff] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#7c3aed] rounded-full mix-blend-screen"></div>
      </div>

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 py-3 backdrop-blur-xl bg-[#15121b]/80 border-b border-white/15 shadow-[0_0_15px_rgba(210,187,255,0.15)]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1 text-[#d2bbff] hover:opacity-80">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-[#221e28] overflow-hidden border border-white/10">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format" alt="Profile" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#d2bbff] to-[#ddb7ff] bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Aura Live
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm text-[#d2bbff]">1.2k 💎</span>
          <button className="text-[#ccc3d8] hover:opacity-80 p-1 text-xl">🔔</button>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-md mx-auto relative z-10 space-y-4">
        {/* Role & Timeframe Toggles */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-center p-1 bg-[#1d1a24] rounded-full border border-white/5">
            <button
              onClick={() => setRole('host')}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                role === 'host' ? 'bg-[#7c3aed] text-white shadow-lg' : 'text-[#ccc3d8] hover:text-white'
              }`}
            >
              Host
            </button>
            <button
              onClick={() => setRole('gifter')}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                role === 'gifter' ? 'bg-[#7c3aed] text-white shadow-lg' : 'text-[#ccc3d8] hover:text-white'
              }`}
            >
              Gifter
            </button>
          </div>

          <div className="flex justify-between items-center px-1 py-2">
            <div className="flex gap-4">
              {(['hourly', 'daily', 'weekly'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`text-xs font-bold capitalize pb-1 transition-all ${
                    timeframe === tf ? 'text-[#d2bbff] border-b-2 border-[#d2bbff]' : 'text-[#ccc3d8]/60'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 text-[#ddb7ff] text-xs font-medium">
              <span>⏱️</span>
              <span>Ends in 42:15</span>
            </div>
          </div>
        </div>

        {/* Podium Section */}
        <div className="relative pt-6 pb-4 my-2">
          <div className="flex items-end justify-center gap-4">
            {/* Rank 2 - MysticLuna */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full border-[3px] border-gray-400/50 overflow-hidden shadow-[0_0_15px_rgba(192,192,192,0.3)]">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format" alt="MysticLuna" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#2c2833] px-2 py-0.5 rounded-full border border-white/10">
                  <span className="text-[10px] font-bold text-white">Lv.45</span>
                </div>
                <div className="absolute -top-2 -right-1 bg-gradient-to-br from-gray-300 to-gray-500 w-6 h-6 rounded-full flex items-center justify-center border border-white/20 shadow-md">
                  <span className="text-white font-bold text-xs">2</span>
                </div>
              </div>
              <div className="text-center mt-2">
                <p className="text-xs font-bold text-white truncate w-20">MysticLuna</p>
                <p className="text-[10px] font-bold text-[#ddb7ff]">825k pts</p>
              </div>
            </div>

            {/* Rank 1 - SolarQueen */}
            <div className="flex flex-col items-center gap-2 -mt-6">
              <span className="text-2xl animate-bounce">👑</span>
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-[4px] border-yellow-400 overflow-hidden shadow-[0_0_25px_rgba(255,215,0,0.5)]">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format" alt="SolarQueen" />
                </div>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-yellow-300 px-2.5 py-0.5 rounded-full border border-white/40">
                  <span className="text-[11px] font-bold text-[#25005a]">Lv.68</span>
                </div>
                <div className="absolute -top-3 -right-1 bg-gradient-to-br from-yellow-400 to-amber-600 w-8 h-8 rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                  <span className="text-white font-black text-sm">1</span>
                </div>
              </div>
              <div className="text-center mt-2">
                <p className="text-sm font-bold text-white">SolarQueen</p>
                <p className="text-xs font-bold text-[#d2bbff]">1.2M pts</p>
              </div>
            </div>

            {/* Rank 3 - VortexX */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full border-[3px] border-orange-700/50 overflow-hidden shadow-[0_0_15px_rgba(205,127,50,0.3)]">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format" alt="VortexX" />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#2c2833] px-2 py-0.5 rounded-full border border-white/10">
                  <span className="text-[10px] font-bold text-white">Lv.39</span>
                </div>
                <div className="absolute -top-2 -right-1 bg-gradient-to-br from-orange-600 to-orange-900 w-6 h-6 rounded-full flex items-center justify-center border border-white/20 shadow-md">
                  <span className="text-white font-bold text-xs">3</span>
                </div>
              </div>
              <div className="text-center mt-2">
                <p className="text-xs font-bold text-white truncate w-20">VortexX</p>
                <p className="text-[10px] font-bold text-[#ddb7ff]">540k pts</p>
              </div>
            </div>
          </div>
        </div>

        {/* List Section (Ranks 4-7+) */}
        <div className="space-y-3 pb-8">
          {listPerformers.map(p => (
            <div
              key={p.rank}
              className="bg-[#1b1633]/50 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 hover:bg-white/5 transition-all cursor-pointer"
            >
              <span className="w-5 text-center font-bold text-sm text-[#ccc3d8]">{p.rank}</span>
              <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10">
                <img className="w-full h-full object-cover" src={p.avatar} alt={p.name} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">{p.name}</h3>
                  <span className="text-[11px] text-[#ccc3d8]">{p.level}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#7c3aed] to-[#ddb7ff] rounded-full shadow-[0_0_8px_rgba(210,187,255,0.4)]"
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#d2bbff]">{p.points}</p>
                <p className="text-[9px] text-[#ccc3d8]/60">Revenue</p>
              </div>
            </div>
          ))}

          <div className="py-4 text-center">
            <button className="text-xs font-semibold text-[#ccc3d8] hover:text-[#d2bbff] transition-colors">
              Show more (43 remaining)
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
