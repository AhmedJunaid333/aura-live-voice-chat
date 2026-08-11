import { useState } from 'react'

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

interface SeatUser {
  number: number
  name: string
  avatar: string
  micOn: boolean
  speaking?: boolean
  coHost?: boolean
}

export default function LiveRoomScreen({ room, onBack }: Props) {
  const [mic, setMic] = useState(true)
  const [speaker, setSpeaker] = useState(true)
  const [hand, setHand] = useState(false)
  const [reactionsCount, setReactionsCount] = useState(3)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [selectedSeat, setSelectedSeat] = useState<SeatUser | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  // 10 Seats Configuration (Row 1: 5 seats, Row 2: 5 seats)
  const seats: (SeatUser | null)[] = [
    { number: 1, name: 'Ayesha', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop', micOn: true },
    { number: 2, name: 'Usman', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop', micOn: false },
    { number: 3, name: 'Ali Raza', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop', micOn: true, speaking: true },
    { number: 4, name: 'Sana', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop', micOn: false },
    { number: 5, name: 'Zara Malik', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop', micOn: true, coHost: true },
    { number: 6, name: 'Bilal', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop', micOn: false },
    { number: 7, name: 'Hina', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop', micOn: true },
    null,
    null,
    null,
  ]

  const handleSeatClick = (index: number) => {
    const seat = seats[index]
    if (seat) {
      setSelectedSeat(seat)
      showToast(`${seat.name} selected`)
    } else {
      showToast(`Open seat ${index + 1} selected`)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    showToast(`Sent: "${chatInput}"`)
    setChatInput('')
  }

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden font-sans select-none pb-44"
      style={{
        background: 'radial-gradient(circle at 20% 15%, #281956 0%, #080812 55%, #030307 100%)',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#1E1438]/95 border border-[#8B5CF6]/50 px-5 py-2.5 rounded-full text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="flex items-center justify-between px-3 pt-3 pb-2">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white transition"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="flex-1 px-2">
          <h1 className="text-lg font-black tracking-tight text-[#9959FF] flex items-center gap-1.5">
            {room?.title || 'Grand Royal Voice Suite ✨'}
          </h1>
          <div className="flex items-center gap-2 text-[11px] text-white/60 tracking-wider font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>MUSIC • 10 SEATS</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => showToast('Room link copied!')}
            className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button
            onClick={() => showToast('Room options')}
            className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-md mx-auto px-4 space-y-5">
        {/* ── HOST STAGE ── */}
        <div className="flex flex-col items-center pt-1 pb-2">
          <div className="relative">
            {/* Crown */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]">
              <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V17H19V19Z" />
              </svg>
            </div>

            {/* Glowing sweep avatar ring */}
            <div
              className="w-28 h-28 rounded-full p-[3px] shadow-[0_0_30px_rgba(139,92,246,0.6)] flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #813EFF 0%, #32D8FF 50%, #B24CFF 100%)',
              }}
            >
              <img
                src={room?.bg || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop'}
                alt="Host"
                className="w-full h-full object-cover rounded-full border-2 border-[#090814]"
              />
            </div>

            {/* HOST Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-black tracking-wider px-3.5 py-0.5 rounded-full shadow-lg border border-amber-300">
              HOST
            </div>
          </div>

          <h2 className="mt-3 text-base font-bold text-white tracking-wide">
            {room?.host || 'Ahmed Khan'}
          </h2>

          <div className="mt-1 w-6 h-6 rounded-lg bg-[#13B9C5] flex items-center justify-center text-white shadow-md">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        </div>

        {/* ── 10 CIRCULAR SEATS (5x2 GRID) ── */}
        <div className="grid grid-cols-5 gap-x-2 gap-y-4 pt-1">
          {seats.map((seat, index) => {
            const seatNum = index + 1
            const isOccupied = !!seat
            const isSpeaking = seat?.speaking

            return (
              <div
                key={seatNum}
                onClick={() => handleSeatClick(index)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="relative">
                  {/* Seat Number Tag */}
                  <div className="absolute -top-1 -left-1 z-20 w-5 h-5 rounded-full bg-[#17102F] border border-[#914EFF] text-[10px] font-bold text-white flex items-center justify-center shadow">
                    {seatNum}
                  </div>

                  {/* Circular Seat Body */}
                  {isOccupied ? (
                    <div
                      className={`w-14 h-14 rounded-full p-[2px] transition-transform duration-300 relative ${
                        isSpeaking
                          ? 'ring-4 ring-[#61FF9A] shadow-[0_0_20px_rgba(97,255,154,0.6)] scale-105 animate-pulse'
                          : 'border-2 border-[#914EFF] shadow-[0_0_12px_rgba(145,78,255,0.35)]'
                      }`}
                      style={{
                        background: isSpeaking ? '#61FF9A' : '#914EFF',
                      }}
                    >
                      <img
                        src={seat.avatar}
                        alt={seat.name}
                        className="w-full h-full object-cover rounded-full"
                      />

                      {/* Mic Status Indicator */}
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#05050D] ${
                          seat.micOn ? 'bg-[#35C978]' : 'bg-black/90'
                        }`}
                      >
                        {seat.micOn ? (
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                          </svg>
                        ) : (
                          <svg className="w-2.5 h-2.5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9l4.19 4.18L21 19.73 4.27 3z" />
                          </svg>
                        )}
                      </div>

                      {/* Co-Host Pill */}
                      {seat.coHost && (
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[7px] font-black px-1.5 py-0.2 rounded shadow">
                          CO-HOST
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#10172A] border-2 border-[#293752] flex items-center justify-center group-hover:border-[#9959FF] transition">
                      <svg className="w-6 h-6 text-[#9959FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Name Label */}
                <span className="mt-1.5 text-[11px] text-white/80 font-medium truncate max-w-[60px] text-center">
                  {seat?.name || 'Open Seat'}
                </span>

                {/* Speaking Wave Bars */}
                {isSpeaking && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <span className="w-0.5 h-2 bg-[#61FF9A] rounded-full animate-bounce"></span>
                    <span className="w-0.5 h-3 bg-[#61FF9A] rounded-full animate-bounce [animation-delay:0.1s]"></span>
                    <span className="w-0.5 h-1.5 bg-[#61FF9A] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── GUIDELINES CARD ── */}
        <div
          onClick={() => showToast('Community guidelines')}
          className="w-full p-3.5 rounded-2xl bg-[#131321]/80 border border-white/10 flex items-center gap-3 cursor-pointer hover:border-white/20 transition"
        >
          <div className="text-[#9959FF]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1 text-xs">
            <p className="text-white/70">Be respectful and follow the community guidelines.</p>
            <p className="text-[#9959FF] font-semibold mt-0.5">Enjoy the conversation!</p>
          </div>
          <div className="text-white/40">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* ── ACTIVITY & AUDIENCE ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Activity Logs */}
          <div className="p-3.5 rounded-2xl bg-[#131321]/80 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-white/90">
                <span>👋</span>
                <span className="truncate">Hamza joined the room</span>
              </div>
              <span className="text-[10px] text-white/40 font-mono">01:58 AM</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-white/90">
                <span>🎁</span>
                <span className="truncate">Ayesha sent Rose 🌹 x 3</span>
              </div>
              <span className="text-[10px] text-white/40 font-mono">02:00 AM</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-white/90">
                <span>⭐</span>
                <span className="truncate">Sana became a Co-host</span>
              </div>
              <span className="text-[10px] text-white/40 font-mono">02:02 AM</span>
            </div>
          </div>

          {/* Audience Card */}
          <div
            onClick={() => showToast('Audience list')}
            className="p-3.5 rounded-2xl bg-[#131321]/80 border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/20 transition"
          >
            <div className="flex items-center gap-3">
              <div className="text-[#9959FF]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-white/60">Audience</p>
                <p className="text-base font-bold text-white">128</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#131321]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop" alt="" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#131321]" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop" alt="" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-[#131321]" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop" alt="" />
              </div>
              <span className="text-[10px] text-white/50">+123</span>
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* ── FLOATING BOTTOM CONTROL BAR ── */}
      <div className="fixed bottom-3 left-3 right-3 max-w-md mx-auto z-40 bg-[#151521]/95 border border-white/10 rounded-3xl p-3 shadow-2xl backdrop-blur-xl">
        {/* Row 1: Main Audio & Stage Actions */}
        <div className="flex items-center justify-around pb-2.5">
          {/* Mic */}
          <button
            onClick={() => {
              setMic(!mic)
              showToast(mic ? 'Microphone muted 🔇' : 'Microphone unmuted 🎙️')
            }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition border ${
                mic
                  ? 'bg-[#2B1556] border-[#9959FF] text-white'
                  : 'bg-[#171A29] border-white/10 text-white/60'
              }`}
            >
              {mic ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9l4.19 4.18L21 19.73 4.27 3z" />
                </svg>
              )}
            </div>
            <span className="text-[9px] text-white/70">Mic</span>
          </button>

          {/* Speaker */}
          <button
            onClick={() => {
              setSpeaker(!speaker)
              showToast(speaker ? 'Speaker OFF 🔈' : 'Speaker ON 🔊')
            }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition border ${
                speaker ? 'bg-[#171A29] border-white/10 text-white' : 'bg-red-500/20 border-red-500/40 text-red-400'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>
            <span className="text-[9px] text-white/70">Speaker</span>
          </button>

          {/* Reactions */}
          <button
            onClick={() => {
              setReactionsCount(prev => prev + 1)
              showToast('Heart reaction sent! ❤️')
            }}
            className="flex flex-col items-center gap-1 relative"
          >
            <div className="w-11 h-11 rounded-full bg-[#171A29] border border-white/10 flex items-center justify-center text-white relative">
              <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {reactionsCount}
              </span>
            </div>
            <span className="text-[9px] text-white/70">Reactions</span>
          </button>

          {/* Spatial Audio */}
          <button
            onClick={() => showToast('3D Spatial Audio Mode Active')}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-11 h-11 rounded-full bg-[#171A29] border border-white/10 flex items-center justify-center text-white">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-[9px] text-white/70">Spatial Audio</span>
          </button>

          {/* Raise Hand */}
          <button
            onClick={() => {
              setHand(!hand)
              showToast(hand ? 'Hand lowered' : 'Hand raised to speak ✋')
            }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition border ${
                hand ? 'bg-amber-500/20 border-amber-400 text-amber-400' : 'bg-[#171A29] border-white/10 text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
            </div>
            <span className="text-[9px] text-white/70">Raise Hand</span>
          </button>

          {/* Leave Room */}
          <button
            onClick={onBack}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-11 h-11 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="text-[9px] text-white/70">Leave Room</span>
          </button>
        </div>

        {/* Row 2: Chat Input & Action Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          <form onSubmit={handleSendMessage} className="flex-1 relative">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Say something..."
              className="w-full h-11 bg-black/40 border border-white/10 rounded-full pl-4 pr-10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#9959FF]"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>

          {/* Gift Button */}
          <button
            onClick={() => showToast('Gift catalog opened 🎁')}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8140FF] to-[#24CFC8] flex flex-col items-center justify-center text-white shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V4a2 2 0 112 2h-2zm0 0V4a2 2 0 10-2 2h2zm-7 4h14a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7a1 1 0 011-1z" />
            </svg>
            <span className="text-[7px] font-bold">Gift</span>
          </button>

          {/* Room Button */}
          <button
            onClick={() => showToast('Room settings')}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex flex-col items-center justify-center text-white shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-[7px] font-bold">Room</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => showToast('Share link generated!')}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex flex-col items-center justify-center text-white shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-[7px] font-bold">Share</span>
          </button>

          {/* More Button */}
          <button
            onClick={() => showToast('More features')}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex flex-col items-center justify-center text-white shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            <span className="text-[7px] font-bold">More</span>
          </button>
        </div>
      </div>

      {/* Seat Details Modal */}
      {selectedSeat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#131C2E] border border-[#273449] rounded-3xl p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-[#273449] pb-3">
              <div>
                <h4 className="font-extrabold text-white text-sm">
                  🪑 Seat #{selectedSeat.number} Controls ({selectedSeat.name})
                </h4>
                <p className="text-[10px] text-slate-400">Seat Governance Engine</p>
              </div>
              <button onClick={() => setSelectedSeat(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  showToast(`Seat #${selectedSeat.number} LOCKED.`);
                  setSelectedSeat(null);
                }}
                className="p-3 rounded-2xl bg-[#1E293B] border border-[#273449] hover:bg-purple-600 hover:text-white text-slate-200 font-bold flex items-center justify-center gap-2"
              >
                <span>🔒</span>
                <span>Seat Lock</span>
              </button>

              <button
                onClick={() => {
                  showToast(`Invitation sent for Seat #${selectedSeat.number}.`);
                  setSelectedSeat(null);
                }}
                className="p-3 rounded-2xl bg-[#1E293B] border border-[#273449] hover:bg-cyan-600 hover:text-white text-slate-200 font-bold flex items-center justify-center gap-2"
              >
                <span>✉️</span>
                <span>Invite Guest</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
