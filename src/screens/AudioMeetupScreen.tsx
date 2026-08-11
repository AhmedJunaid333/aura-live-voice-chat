import { useState } from 'react'

interface Props {
  onBack?: () => void
}

export default function AudioMeetupScreen({ onBack }: Props) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Moderator', role: 'Mod', text: 'Welcome to the Grand Ballroom. Please maintain elegance at all times.', color: 'text-[#735c00]' },
    { id: 2, sender: 'Julian', role: 'User', text: 'The audio quality here is truly premium. Simply stunning.', color: 'text-[#785b00]' },
    { id: 3, sender: 'Evelyn', role: 'User', text: 'Has the auction started yet? ✨', color: 'text-[#785b00]' },
  ])
  const [inputMsg, setInputMsg] = useState('')
  const [isMicOn, setIsMicOn] = useState(false)

  const handleSend = () => {
    if (!inputMsg.trim()) return
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'MR √Lucky☆࿐', role: 'Me', text: inputMsg.trim(), color: 'text-[#735c00]' }
    ])
    setInputMsg('')
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18] font-sans relative flex flex-col overflow-hidden">
      {/* Header (TopAppBar) */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-5 h-16 bg-[#fff8f5]/70 backdrop-blur-md shadow-[0_4px_20px_rgba(212,175,55,0.12)]">
        <button onClick={onBack} className="text-[#735c00] active:scale-95 transition-transform text-xl p-1">
          ‹
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg text-[#735c00] tracking-tight" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            Grand Ballroom
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-[#4d4635] font-bold">AURA PREMIUM LIVE</p>
        </div>
        <button className="text-[#735c00] active:scale-95 transition-transform text-xl p-1">
          ⋮
        </button>
      </header>

      {/* Main Live Room Canvas */}
      <main className="flex-1 pb-32 relative overflow-y-auto px-5 pt-4">
        {/* Background Atmospheric Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-[#ffd571]/15 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="relative z-10">
          {/* Host Seat Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#735c00] to-[#ffd571] shadow-xl">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                  <img
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format"
                    alt="Alexander Noble"
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#d4af37] via-[#ffe088] to-[#d4af37] text-[#574500] px-3 py-0.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1 border border-white">
                ⭐ HOST
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-xl font-bold text-[#735c00]">Alexander Noble</span>
              <p className="text-xs text-[#4d4635]/70 font-semibold mt-0.5">ID: 888888</p>
            </div>
          </div>

          {/* 👑 TOP CENTER HOST SEAT FRAME (SEAT 1) */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative flex items-center justify-center">
              {/* Gold Host Frame */}
              <div className="w-18 h-18 rounded-full p-[3px] bg-gradient-to-br from-amber-400 via-amber-500 to-purple-600 shadow-xl shadow-amber-500/25 flex items-center justify-center relative">
                <div className="w-full h-full rounded-full bg-[#0F172A] p-0.5 overflow-hidden flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format"
                    alt="Evelyn"
                  />
                </div>

                {/* 👑 Royal Crown Badge */}
                <div className="absolute -top-3 inset-x-0 mx-auto w-fit px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[8px] font-black shadow-md flex items-center gap-0.5">
                  <span>👑</span>
                  <span>HOST</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-1.5">
              <span className="px-1.5 py-0.2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-[8px] font-black">
                Lv.99
              </span>
              <p className="text-xs font-bold text-[#1e1b18]">Evelyn (Host)</p>
            </div>
          </div>

          {/* 🎙️ 10 CIRCULAR GUEST SEATS (Row 1: 5 seats, Row 2: 5 seats) */}
          <div className="grid grid-cols-5 gap-y-4 gap-x-2.5 mb-8">
            {/* Seat 2 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#d0c5af] flex items-center justify-center bg-[#fbf2ed] text-slate-400 hover:bg-[#d4af37]/10 cursor-pointer">
                +
              </div>
              <p className="text-[8.5px] text-[#4d4635] font-semibold">Seat 2</p>
            </div>

            {/* Julian (Seat 3) */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#06B6D4] shadow-md relative">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format"
                  alt="Julian"
                />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold text-[#1e1b18] truncate max-w-[50px]">Julian</p>
              </div>
            </div>

            {/* Seat 4 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#d0c5af] flex items-center justify-center bg-[#fbf2ed] text-slate-400">
                +
              </div>
              <p className="text-[8.5px] text-[#4d4635] font-semibold">Seat 4</p>
            </div>

            {/* Seraphina (Seat 5) */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#8B5CF6] shadow-md">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&auto=format"
                  alt="Seraphina"
                />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-bold text-[#1e1b18] truncate max-w-[50px]">Seraphina</p>
              </div>
            </div>

            {/* Seat 6 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#d0c5af] flex items-center justify-center bg-[#fbf2ed] text-slate-400">
                +
              </div>
              <p className="text-[8.5px] text-[#4d4635] font-semibold">Seat 6</p>
            </div>

            {/* Seat 7 (Locked) */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#d0c5af] flex items-center justify-center bg-[#fbf2ed] text-slate-400">
                🔒
              </div>
              <p className="text-[8.5px] text-[#4d4635] font-semibold">Locked</p>
            </div>

            {/* Seat 8 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#d0c5af] flex items-center justify-center bg-[#fbf2ed] text-slate-400">
                +
              </div>
              <p className="text-[8.5px] text-[#4d4635] font-semibold">Seat 8</p>
            </div>

            {/* Seat 9 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#d0c5af] flex items-center justify-center bg-[#fbf2ed] text-slate-400">
                +
              </div>
              <p className="text-[8.5px] text-[#4d4635] font-semibold">Seat 9</p>
            </div>

            {/* Seat 10 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#d0c5af] flex items-center justify-center bg-[#fbf2ed] text-slate-400">
                +
              </div>
              <p className="text-[8.5px] text-[#4d4635] font-semibold">Seat 10</p>
            </div>

            {/* Seat 11 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#d0c5af] flex items-center justify-center bg-[#fbf2ed] text-slate-400">
                +
              </div>
              <p className="text-[8.5px] text-[#4d4635] font-semibold">Seat 11</p>
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {messages.map(m => (
              <div key={m.id} className="flex gap-2 items-start">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl rounded-tl-none p-3 max-w-[85%] border border-[#d0c5af]/30 shadow-sm">
                  <p className={`text-[10px] font-bold ${m.color} mb-0.5`}>{m.sender}</p>
                  <p className="text-xs text-[#1e1b18]">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Live Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#fff8f5]/90 backdrop-blur-xl border-t border-[#d0c5af]/30 flex items-center gap-3">
        <div className="flex-1 bg-white/80 backdrop-blur-md rounded-full h-12 flex items-center px-4 border border-[#d4af37]/30 shadow-sm">
          <input
            type="text"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Send an elegant message..."
            className="w-full bg-transparent border-none outline-none text-xs text-[#1e1b18] placeholder:text-[#4d4635]/60"
          />
          <button onClick={handleSend} className="ml-2 text-[#735c00] font-bold text-sm">
            ➔
          </button>
        </div>

        {/* Gift Button */}
        <button className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#735c00] to-[#d4af37] text-white flex items-center justify-center text-xl shadow-lg shadow-[#735c00]/20 active:scale-95 transition-transform">
          🎁
        </button>

        {/* Mic Toggle */}
        <button
          onClick={() => setIsMicOn(!isMicOn)}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md border border-[#735c00]/20 active:scale-95 transition-transform ${isMicOn ? 'bg-emerald-500 text-white' : 'bg-[#e9e1dc] text-[#735c00]'}`}
        >
          {isMicOn ? '🎙️' : '🔇'}
        </button>
      </div>
    </div>
  )
}
