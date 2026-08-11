import { useState, useEffect } from 'react'

interface Props {
  room?: {
    title: string
    host: string
    listeners: number
    bg?: string
    isPK?: boolean
  } | null
  roomId?: string
  onBack?: () => void
}

const mockSeats = [
  { id: 1, name: 'Sara_Vip7', role: 'HOST', vip: 'VIP 7', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format', speaking: true, coinsSpent: 145000 },
  { id: 2, name: 'King_Rana', role: 'CO-HOST', vip: 'VIP 9', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format', speaking: false, coinsSpent: 890000 },
  { id: 3, name: 'Luna_Sky', role: 'SPEAKER', vip: 'VIP 3', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&auto=format', speaking: false, coinsSpent: 22000 },
  { id: 4, name: 'Ali_Pro', role: 'MOD', vip: 'VIP 1', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format', speaking: true, coinsSpent: 5000 },
  { id: 5, name: 'Aria_Singer', role: 'SPEAKER', vip: 'VIP 5', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format', speaking: false, coinsSpent: 75000 },
  { id: 6, name: 'Cyber_Knight', role: 'SPEAKER', vip: 'VIP 2', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&auto=format', speaking: false, coinsSpent: 12000 },
  { id: 7, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
  { id: 8, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
  { id: 9, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
  { id: 10, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
  { id: 11, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
  { id: 12, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
  { id: 13, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
  { id: 14, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
  { id: 15, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
  { id: 16, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
  { id: 17, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
  { id: 18, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
  { id: 19, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
  { id: 20, name: 'Empty Seat', role: '', vip: '', avatar: '', speaking: false, coinsSpent: 0 },
]

const catalogGifts = [
  { id: 'g1', name: 'Supercar Phantom', price: 50000, emoji: '🏎️', vipReq: 'VIP 5', category: 'Luxury' },
  { id: 'g2', name: 'Golden Dragon Sovereign', price: 150000, emoji: '🐉', vipReq: 'VIP 7', category: 'Super Rare' },
  { id: 'g3', name: 'Romantic Rose Rain', price: 5000, emoji: '🌹', vipReq: 'VIP 1', category: 'Romantic' },
  { id: 'g4', name: 'Crown of Galaxy', price: 25000, emoji: '👑', vipReq: 'VIP 3', category: 'Event' },
]

export default function LiveRoomScreen({ room, roomId = 'RM-8821', onBack }: Props) {
  const [micOn, setMicOn] = useState(false)
  const [cameraOn, setCameraOn] = useState(true)
  const [seatCount, setSeatCount] = useState<10 | 15 | 20>(15)
  const [showGiftDrawer, setShowGiftDrawer] = useState(false)
  const [selectedSeat, setSelectedSeat] = useState<any | null>(null)
  const [userCoins, setUserCoins] = useState(1450000)
  const [floatingGifts, setFloatingGifts] = useState<{ id: number; name: string; emoji: string; x: number }[]>([])
  
  // PK Battle State
  const isPkMode = room?.isPK ?? true
  const [pkScore1, setPkScore1] = useState(84200)
  const [pkScore2, setPkScore2] = useState(72900)
  const [pkTimeLeft, setPkTimeLeft] = useState(180) // 3 mins

  // Live Chat Stream State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Cyber_Knight', text: 'Welcome to Urdu Romantic Songs broadcast! 💖', vip: 'VIP 2', badge: 'VIP' },
    { id: 2, user: 'Luna_Sky', text: 'King_Rana sent Supercar Phantom! 🔥', vip: 'VIP 3', badge: 'VIP' },
    { id: 3, user: 'System', text: '🔒 Profanity filter active. AGY AI moderation enabled.', vip: '', badge: 'SYS' },
  ])
  const [chatInput, setChatInput] = useState('')

  // VIP Entrance Notification Banner
  const [vipEntrance, setVipEntrance] = useState<string | null>('👑 King_Rana_VIP (VIP 9) entered in Golden Dragon Vehicle!')

  useEffect(() => {
    const timer = setInterval(() => {
      setPkTimeLeft(prev => (prev > 0 ? prev - 1 : 180))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatPkTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleSendGift = (gift: typeof catalogGifts[0]) => {
    if (userCoins < gift.price) {
      alert('Insufficient Coins! Please recharge in Wallet.')
      return
    }

    setUserCoins(prev => prev - gift.price)
    setPkScore1(prev => prev + gift.price)

    const newGift = { id: Date.now(), name: gift.name, emoji: gift.emoji, x: (Math.random() - 0.5) * 160 }
    setFloatingGifts(prev => [...prev, newGift])
    setTimeout(() => {
      setFloatingGifts(prev => prev.filter(g => g.id !== newGift.id))
    }, 1500)

    setChatMessages(prev => [
      ...prev,
      { id: Date.now(), user: 'You', text: `Sent ${gift.name} ${gift.emoji} (${gift.price.toLocaleString()} Coins)!`, vip: 'VIP 7', badge: 'VIP' }
    ])

    setShowGiftDrawer(false)
  }

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setChatMessages(prev => [
      ...prev,
      { id: Date.now(), user: 'Sara_Vip7', text: chatInput, vip: 'VIP 7', badge: 'HOST' }
    ])
    setChatInput('')
  }

  const visibleSeats = mockSeats.slice(0, seatCount)

  return (
    <div className="min-h-screen bg-[#08040F] text-[#E2E8F0] relative overflow-hidden flex flex-col justify-between font-sans select-none">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#4F46E5]/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#06B6D4]/20 rounded-full blur-[120px]"></div>
      </div>

      {/* TOP BAR */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#111827]/70 backdrop-blur-xl border-b border-[#273449]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#06B6D4] overflow-hidden shadow-lg">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
              alt="Host Avatar"
            />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white truncate max-w-[180px]">
              {room?.title || '💖 Urdu Romantic Songs & Chat'}
            </h1>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#06B6D4]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Host: {room?.host || 'Sara_Vip7'}</span>
            </div>
          </div>
        </div>

        {/* Viewers & Seat Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#1E293B] border border-[#273449] rounded-lg p-1">
            {([10, 15, 20] as const).map(count => (
              <button
                key={count}
                onClick={() => setSeatCount(count)}
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition ${
                  seatCount === count ? 'bg-[#4F46E5] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {count} Seats
              </button>
            ))}
          </div>

          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1E293B] border border-[#273449] text-slate-300 hover:text-white">
            ✕
          </button>
        </div>
      </header>

      {/* VIP ENTRANCE BANNER */}
      {vipEntrance && (
        <div className="fixed top-20 left-4 right-4 z-40 animate-bounce">
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 p-2.5 rounded-2xl shadow-xl text-xs font-black text-slate-950 text-center border border-amber-300 flex items-center justify-between">
            <span>✨ {vipEntrance}</span>
            <button onClick={() => setVipEntrance(null)} className="text-slate-950 font-bold px-2">✕</button>
          </div>
        </div>
      )}

      {/* PK BATTLE SCORE HEADER */}
      {isPkMode && (
        <section className="pt-20 px-4 z-10 max-w-lg mx-auto w-full">
          <div className="bg-[#131C2E] border border-[#273449] rounded-2xl p-3 space-y-2 shadow-lg">
            <div className="flex justify-between items-center text-xs font-black">
              <div className="flex items-center gap-2 text-red-400">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <span>Sara_Vip7 ({pkScore1.toLocaleString()})</span>
              </div>
              <div className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[11px]">
                ⚔️ PK TIMER: {formatPkTime(pkTimeLeft)}
              </div>
              <div className="flex items-center gap-2 text-cyan-400">
                <span>King_Rana ({pkScore2.toLocaleString()})</span>
                <span className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></span>
              </div>
            </div>

            {/* Red vs Blue Progress Bar */}
            <div className="h-3 w-full bg-[#1E293B] rounded-full overflow-hidden flex border border-[#273449]">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-pink-500 transition-all duration-500"
                style={{ width: `${(pkScore1 / (pkScore1 + pkScore2)) * 100}%` }}
              ></div>
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                style={{ width: `${(pkScore2 / (pkScore1 + pkScore2)) * 100}%` }}
              ></div>
            </div>
          </div>
        </section>
      )}

      {/* MAIN VIEWPORT CANVAS */}
      <main className={`px-4 max-w-lg mx-auto w-full flex-1 flex flex-col justify-between z-10 ${isPkMode ? 'pt-3' : 'pt-20'} pb-24`}>

        {/* TOP CENTER HOST SEAT FRAME (SEAT 1) & 10 GUEST SEATS GRID (5x2) */}
        <section className="flex flex-col items-center space-y-4 my-2">
          {/* 👑 TOP CENTER HOST SEAT FRAME (SEAT 1) */}
          {visibleSeats.length > 0 && (() => {
            const hostSeat = visibleSeats[0]
            const hasHost = !!hostSeat.avatar
            return (
              <div
                onClick={() => setSelectedSeat(hostSeat)}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center">
                  {/* Speaking Glow Animation */}
                  {hostSeat.speaking && (
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-400 via-purple-500 to-cyan-400 animate-pulse blur-[6px] opacity-80"></div>
                  )}

                  {/* Royal Gold Frame */}
                  <div className={`w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-br from-amber-400 via-amber-500 to-purple-600 shadow-lg shadow-amber-500/30 flex items-center justify-center relative ${
                    hostSeat.speaking ? 'ring-2 ring-cyan-400' : ''
                  }`}>
                    <div className="w-full h-full rounded-full bg-[#0F172A] p-0.5 overflow-hidden flex items-center justify-center">
                      {hasHost ? (
                        <img className="w-full h-full object-cover rounded-full" src={hostSeat.avatar} alt={hostSeat.name} />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-amber-400">
                          <span className="text-xl">👑</span>
                          <span className="text-[8px] font-bold">Host</span>
                        </div>
                      )}
                    </div>

                    {/* Royal Crown Top Badge */}
                    <div className="absolute -top-3 inset-x-0 mx-auto w-fit px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[8px] font-black shadow-md flex items-center gap-0.5">
                      <span>👑</span>
                      <span>HOST</span>
                    </div>

                    {/* Mic Status */}
                    {hostSeat.speaking && (
                      <span className="absolute -bottom-1 px-1.5 py-0.2 rounded-full bg-cyan-500 text-white text-[7px] font-bold shadow animate-bounce">
                        LIVE
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-0.5">
                  <span className="px-1 py-0.2 rounded bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-[7.5px] font-black">
                    Lv.99
                  </span>
                  <span className="text-[10px] font-bold text-white max-w-[90px] truncate">
                    {hasHost ? hostSeat.name : 'Host (Seat 1)'}
                  </span>
                </div>
              </div>
            )
          })()}

          {/* 🎙️ DYNAMIC CIRCULAR GUEST SEATS (5 per row: 10 = 2 rows, 15 = 3 rows, 20 = 4 rows) */}
          <div className="grid grid-cols-5 gap-2.5 w-full max-w-md px-1">
            {visibleSeats.slice(1, seatCount + 1).map((s, idx) => {
              const hasUser = !!s.avatar
              const seatNum = idx + 2
              return (
                <div key={s.id} onClick={() => setSelectedSeat(s)} className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className={`w-12 h-12 rounded-full bg-[#131C2E] flex items-center justify-center relative overflow-hidden active:scale-95 transition-transform border ${
                    hasUser ? 'border-[#06B6D4] shadow-md shadow-[#06B6D4]/20' : 'border-[#273449] hover:border-purple-500'
                  }`}>
                    {hasUser ? (
                      <img className="w-full h-full object-cover" src={s.avatar} alt={s.name} />
                    ) : (
                      <span className="text-purple-400 text-sm font-bold">+</span>
                    )}
                    {s.speaking && (
                      <div className="absolute inset-0 border-2 border-cyan-400 animate-pulse rounded-full"></div>
                    )}
                    {s.role && s.role !== 'Host' && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#4F46E5] text-white text-[6.5px] font-black text-center py-0.2 uppercase">
                        {s.role}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-semibold text-slate-300 truncate w-full text-center">
                    {hasUser ? s.name : `Seat ${seatNum}`}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* LIVE CHAT STREAM */}
        <section className="space-y-2 mt-4 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {chatMessages.map(msg => (
            <div key={msg.id} className="flex items-start gap-2 max-w-[90%] text-xs">
              {msg.badge === 'VIP' && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-extrabold text-[9px]">
                  {msg.vip}
                </span>
              )}
              {msg.badge === 'HOST' && (
                <span className="px-1.5 py-0.5 rounded bg-[#4F46E5]/30 text-[#06B6D4] font-extrabold text-[9px]">
                  HOST
                </span>
              )}
              {msg.badge === 'SYS' && (
                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-extrabold text-[9px]">
                  SYS
                </span>
              )}
              <div className="bg-[#131C2E]/80 backdrop-blur-md border border-[#273449] px-3 py-1.5 rounded-2xl rounded-tl-none text-slate-200">
                <span className="font-bold text-white mr-1.5">{msg.user}:</span>
                <span>{msg.text}</span>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* FLOATING ANIMATED GIFT EMITTERS */}
      {floatingGifts.map(g => (
        <div
          key={g.id}
          className="fixed bottom-28 left-1/2 text-5xl pointer-events-none z-50 animate-bounce"
          style={{ transform: `translateX(${g.x}px) translateY(-140px) scale(1.6)`, transition: 'all 1.2s ease-out' }}
        >
          {g.emoji}
        </div>
      ))}

      {/* BOTTOM CONTROLS TOOLBAR */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 flex items-center gap-2 max-w-lg mx-auto h-16 bg-[#0B132B]/90 backdrop-blur-2xl border border-white/10 rounded-2xl px-3 shadow-2xl">
        <form onSubmit={handleSendChatMessage} className="flex-1 flex items-center bg-[#1E293B] border border-[#334155] rounded-xl px-2.5 py-1">
          <span className="text-slate-400 mr-2 text-sm">💬</span>
          <input
            type="text"
            placeholder="Type a message..."
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white flex items-center justify-center text-xs ml-1 hover:scale-105 active:scale-95 transition"
          >
            ➤
          </button>
        </form>

        {/* 🎁 Gift Button */}
        <button
          onClick={() => setShowGiftDrawer(true)}
          className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-amber-500/20 active:scale-95 transition"
        >
          🎁
        </button>

        {/* ⚔️ PK Battle Button */}
        <button
          onClick={() => alert('⚔️ PK Battle Challenge Initiated!')}
          className="w-9 h-9 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-red-500/20 active:scale-95 transition"
        >
          ⚔️
        </button>

        {/* 🎙️ Mic Button */}
        <button
          onClick={() => setMicOn(!micOn)}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition shadow-lg ${
            micOn ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white' : 'bg-gradient-to-r from-red-500 to-rose-700 text-white'
          }`}
        >
          {micOn ? '🎙️' : '🔇'}
        </button>

        {/* ☰ Menu Button */}
        <button
          onClick={() => alert('☰ Room Settings & Tools Menu')}
          className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm flex items-center justify-center shadow-lg shadow-purple-500/20 active:scale-95 transition"
        >
          ☰
        </button>
      </nav>

      {/* GIFT SELECTION DRAWER */}
      {showGiftDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center">
          <div className="w-full max-w-lg p-6 rounded-t-[28px] bg-[#131C2E] border-t border-[#273449] space-y-6 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-white">Luxury Gift Store</h3>
                <p className="text-xs text-[#F59E0B]">Wallet Balance: <strong>{userCoins.toLocaleString()} Coins</strong></p>
              </div>
              <button onClick={() => setShowGiftDrawer(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {catalogGifts.map(gift => (
                <div
                  key={gift.id}
                  onClick={() => handleSendGift(gift)}
                  className="bg-[#1E293B] border border-[#273449] hover:border-[#4F46E5] p-4 rounded-2xl flex flex-col items-center justify-between cursor-pointer active:scale-95 transition"
                >
                  <div className="text-4xl mb-2">{gift.emoji}</div>
                  <div className="text-center">
                    <div className="font-bold text-white text-xs">{gift.name}</div>
                    <div className="text-[#F59E0B] font-mono text-[11px] font-bold">{gift.price.toLocaleString()} Coins</div>
                  </div>
                  <span className="mt-2 text-[9px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                    {gift.vipReq}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEAT CONTROLS MODAL (10, 15, 20 SEATS) */}
      {selectedSeat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#131C2E] border border-[#273449] rounded-3xl p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-[#273449] pb-3">
              <div>
                <h4 className="font-extrabold text-white text-sm">
                  🪑 Seat #{selectedSeat.id} Controls {selectedSeat.name && `(${selectedSeat.name})`}
                </h4>
                <p className="text-[10px] text-slate-400">Host & Guest Seat Governance Engine</p>
              </div>
              <button onClick={() => setSelectedSeat(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  alert(`Seat #${selectedSeat.id} LOCKED by Host.`);
                  setSelectedSeat(null);
                }}
                className="p-3 rounded-2xl bg-[#1E293B] border border-[#273449] hover:bg-purple-600 hover:text-white text-slate-200 font-bold flex items-center justify-center gap-2"
              >
                <span>🔒</span>
                <span>Seat Lock</span>
              </button>

              <button
                onClick={() => {
                  alert(`Guest Invitation link dispatched for Seat #${selectedSeat.id}.`);
                  setSelectedSeat(null);
                }}
                className="p-3 rounded-2xl bg-[#1E293B] border border-[#273449] hover:bg-cyan-600 hover:text-white text-slate-200 font-bold flex items-center justify-center gap-2"
              >
                <span>✉️</span>
                <span>Invite Guest</span>
              </button>

              <button
                onClick={() => {
                  alert(`Mic status toggled for Seat #${selectedSeat.id}.`);
                  setSelectedSeat(null);
                }}
                className="p-3 rounded-2xl bg-[#1E293B] border border-[#273449] hover:bg-emerald-600 hover:text-white text-slate-200 font-bold flex items-center justify-center gap-2"
              >
                <span>🎙️</span>
                <span>Mute / Unmute</span>
              </button>

              <button
                onClick={() => {
                  alert(`Camera status toggled for Seat #${selectedSeat.id}.`);
                  setSelectedSeat(null);
                }}
                className="p-3 rounded-2xl bg-[#1E293B] border border-[#273449] hover:bg-indigo-600 hover:text-white text-slate-200 font-bold flex items-center justify-center gap-2"
              >
                <span>📷</span>
                <span>Camera On/Off</span>
              </button>
            </div>

            {selectedSeat.name && (
              <button
                onClick={() => {
                  alert(`Guest ${selectedSeat.name} REMOVED from Seat #${selectedSeat.id}.`);
                  setSelectedSeat(null);
                }}
                className="w-full py-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold text-xs hover:bg-red-500 hover:text-white transition"
              >
                🚫 Remove Guest from Seat
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
