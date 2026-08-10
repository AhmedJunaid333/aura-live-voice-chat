import { useState, useEffect } from 'react'

interface Props {
  roomId?: string
  onBack?: () => void
}

const seats = [
  { id: 1, name: 'Luna', active: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format', speaking: false },
  { id: 2, name: 'Cyber', active: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format', speaking: true },
  { id: 3, name: 'Nova', active: false, avatar: '', speaking: false },
  { id: 4, name: 'Void', active: true, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&auto=format', speaking: false },
  { id: 5, name: 'Zen', active: false, avatar: '', speaking: false },
  { id: 6, name: 'Pixel', active: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format', speaking: false },
  { id: 7, name: 'Mars', active: false, avatar: '', speaking: false },
  { id: 8, name: 'Aria', active: true, avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format', speaking: false },
  { id: 9, name: 'Odin', active: false, avatar: '', speaking: false },
  { id: 10, name: 'Volt', active: false, avatar: '', speaking: false },
  { id: 11, name: 'Echo', active: false, avatar: '', speaking: false },
  { id: 12, name: 'Jade', active: false, avatar: '', speaking: false },
  { id: 13, name: 'Link', active: false, avatar: '', speaking: false },
  { id: 14, name: 'Meta', active: false, avatar: '', speaking: false },
  { id: 15, name: 'Neon', active: false, avatar: '', speaking: false },
]

export default function LiveRoomScreen({ roomId = '1', onBack }: Props) {
  const [micOn, setMicOn] = useState(false)
  const [floatingGifts, setFloatingGifts] = useState<{ id: number; emoji: string; x: number }[]>([])

  const triggerGift = () => {
    const emojis = ['💎', '🚀', '🔥', '💖', '👑']
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
    const newGift = { id: Date.now(), emoji: randomEmoji, x: (Math.random() - 0.5) * 160 }
    setFloatingGifts(prev => [...prev, newGift])
    setTimeout(() => {
      setFloatingGifts(prev => prev.filter(g => g.id !== newGift.id))
    }, 1100)
  }

  return (
    <div className="min-h-screen bg-[#0F0B1E] text-[#e8dfee] relative overflow-hidden flex flex-col justify-between font-sans">
      {/* Aurora Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#d2bbff]/15 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#6f00be]/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#1d1a24]/60 backdrop-blur-xl border-b border-white/15 shadow-md shadow-[#d2bbff]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#d2bbff] overflow-hidden shadow-lg shadow-[#d2bbff]/30">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format"
              alt="Live Host"
            />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#d2bbff] leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Live Broadcast
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ccc3d8]">Tech & Future</span>
            </div>
          </div>
        </div>
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all active:scale-95 text-[#ccc3d8]">
          ✕
        </button>
      </header>

      {/* Floating Info Badges (Top Right) */}
      <div className="fixed top-20 right-4 flex flex-col gap-2 z-20">
        <div className="bg-white/5 backdrop-blur-xl px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-sm">
          <span className="text-xs text-[#d2bbff]">👥</span>
          <span className="text-xs font-bold text-white">1.2k</span>
        </div>
        <div className="bg-white/5 backdrop-blur-xl px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 shadow-sm">
          <span className="text-xs text-yellow-400">⭐</span>
          <span className="text-xs font-bold text-white">4.8</span>
        </div>
      </div>

      {/* Main Content Canvas */}
      <main className="pt-20 pb-28 px-4 flex-1 flex flex-col justify-between max-w-lg mx-auto w-full relative z-10">
        {/* Host Section */}
        <section className="flex flex-col items-center justify-center py-2">
          <div className="relative">
            <div className="absolute -inset-4 border-2 border-[#d2bbff]/30 rounded-full animate-ping opacity-50"></div>
            <div className="absolute -inset-2 border-2 border-[#d2bbff]/50 rounded-full animate-pulse"></div>
            <div className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-2xl p-1 shadow-2xl shadow-[#7c3aed]/40 relative z-10 border border-white/15">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/20">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format"
                  alt="Alex Rivera"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#d2bbff] text-[#3f008e] rounded-full text-[10px] font-extrabold uppercase shadow-lg">
              HOST
            </div>
          </div>
          <p className="mt-3 font-bold text-base text-white">Alex Rivera</p>
        </section>

        {/* 3x5 Speaker Grid (15 Seats) */}
        <section className="grid grid-cols-5 gap-3 py-2">
          {seats.map(s => (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <div className={`w-13 h-13 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center relative overflow-hidden active:scale-95 transition-transform border ${
                s.active ? 'border-[#d2bbff]/40 shadow-[0_0_15px_rgba(210,187,255,0.3)]' : 'border-white/5'
              }`}>
                {s.active ? (
                  <img className="w-full h-full object-cover" src={s.avatar} alt={s.name} />
                ) : (
                  <span className="text-white/20 text-lg">🎤</span>
                )}
                {s.speaking && (
                  <div className="absolute inset-0 border-2 border-[#d2bbff] animate-pulse rounded-full"></div>
                )}
              </div>
              <span className="text-[10px] font-medium text-[#ccc3d8] truncate w-full text-center">{s.name || s.id}</span>
            </div>
          ))}
        </section>

        {/* Live Chat Stream */}
        <section className="flex-1 flex flex-col justify-end gap-2 overflow-hidden max-h-40">
          <div className="space-y-2 overflow-y-auto pr-1">
            <div className="flex items-start gap-2 max-w-[85%]">
              <span className="px-2 py-0.5 rounded bg-gradient-to-r from-yellow-400 to-amber-600 text-[9px] font-black text-[#40000f] uppercase">VIP</span>
              <p className="text-xs bg-white/5 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl rounded-tl-none text-white">
                <span className="text-[#d2bbff] font-bold mr-1">Cyber:</span> This future tech is insane!
              </p>
            </div>
            <div className="flex items-start gap-2 max-w-[85%]">
              <p className="text-xs bg-white/5 border border-white/5 px-3 py-1.5 rounded-2xl rounded-tl-none text-white">
                <span className="text-[#ddb7ff] font-bold mr-1">Luna:</span> Can anyone see my gift? 🎁
              </p>
            </div>
            <div className="flex items-start gap-2">
              <p className="text-[10px] font-medium text-[#d2bbff]/70 bg-[#7c3aed]/10 px-3 py-1 rounded-full border border-[#7c3aed]/20">
                System: Welcome to Tech & Future. Please follow room rules.
              </p>
            </div>
            <div className="flex items-start gap-2 max-w-[85%]">
              <span className="px-2 py-0.5 rounded bg-[#7c3aed] text-[9px] font-black text-white uppercase">MOD</span>
              <p className="text-xs bg-white/5 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl rounded-tl-none text-white">
                <span className="text-white font-bold mr-1">Jade:</span> Let's stay on topic guys.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Gift Emitters */}
      {floatingGifts.map(g => (
        <div
          key={g.id}
          className="fixed bottom-24 left-1/2 text-4xl pointer-events-none z-50 animate-bounce"
          style={{ transform: `translateX(${g.x}px) translateY(-120px) scale(1.5)`, transition: 'all 1s ease-out' }}
        >
          {g.emoji}
        </div>
      ))}

      {/* Bottom Nav Bar Shell */}
      <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-around items-center px-4 max-w-md mx-auto h-16 bg-[#2c2833]/40 backdrop-blur-2xl border border-white/15 rounded-full shadow-[0_0_20px_rgba(210,187,255,0.3)]">
        <button
          onClick={() => setMicOn(!micOn)}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-transform active:scale-90 ${
            micOn ? 'text-[#d2bbff] bg-white/10' : 'text-[#ccc3d8]'
          }`}
        >
          {micOn ? '🎙️' : '🔇'}
        </button>
        <button
          onClick={triggerGift}
          className="flex items-center justify-center bg-[#d2bbff] text-[#3f008e] rounded-full w-12 h-12 shadow-[0_0_15px_rgba(210,187,255,0.5)] transition-transform active:scale-90 text-xl font-bold"
        >
          🎁
        </button>
        <button className="flex items-center justify-center text-[#ccc3d8] w-12 h-12 hover:bg-white/10 rounded-full transition-transform active:scale-90 text-xl">
          👥
        </button>
        <button className="flex items-center justify-center text-[#ccc3d8] w-12 h-12 hover:bg-white/10 rounded-full transition-transform active:scale-90 text-xl">
          💬
        </button>
        <button onClick={onBack} className="flex items-center justify-center text-red-400 w-12 h-12 hover:bg-red-500/10 rounded-full transition-transform active:scale-90 text-xl">
          ⚙️
        </button>
      </nav>
    </div>
  )
}
