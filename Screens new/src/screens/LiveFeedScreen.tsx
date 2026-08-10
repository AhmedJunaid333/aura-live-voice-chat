import { useState } from 'react'

const liveRooms = [
  { id: 1, title: 'Galaxy Night 🌌', host: 'Queen Zara', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format', listeners: 8842, bg: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=500&fit=crop&auto=format', tag: 'VIP', isHot: true },
  { id: 2, title: 'Hip Hop Battle 🎤', host: 'Cyph3r', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format', listeners: 5021, bg: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=500&fit=crop&auto=format', tag: 'PK', isHot: true },
  { id: 3, title: 'Chill & Talk ☁️', host: 'Mia Sky', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&auto=format', listeners: 2104, bg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop&auto=format', tag: 'Chill', isHot: false },
  { id: 4, title: 'RnB Vibes 🎶', host: 'Marcus K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format', listeners: 3780, bg: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=500&fit=crop&auto=format', tag: 'Music', isHot: false },
]

interface Props { onEnterRoom: (room: any) => void }

export default function LiveFeedScreen({ onEnterRoom }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  const enter = (room: typeof liveRooms[0]) => {
    setSelected(room.id)
    setTimeout(() => onEnterRoom({ ...room, isPK: room.tag === 'PK' }), 150)
  }

  return (
    <div className="screen overflow-y-auto" style={{ paddingBottom: 80 }}>
      <div className="px-4 pt-10 pb-3 flex items-center justify-between">
        <h2 className="text-xl font-extrabold" style={{ fontFamily: 'Plus Jakarta Sans', animation: 'fadeInUp 0.4s ease both' }}>🔴 Live Now</h2>
        <span className="text-xs text-violet-400 font-medium animate-live-dot">● {liveRooms.length} rooms</span>
      </div>

      {/* Full-width vertical scroll cards */}
      <div className="px-4 space-y-4">
        {liveRooms.map((room, i) => (
          <div
            key={room.id}
            className="relative rounded-3xl overflow-hidden cursor-pointer"
            style={{
              height: 260,
              animation: `fadeInUp 0.4s ${i * 0.08}s ease both`,
              transform: selected === room.id ? 'scale(0.97)' : 'scale(1)',
              transition: 'transform 0.15s ease',
              border: '1px solid rgba(139,92,246,0.2)',
            }}
            onClick={() => enter(room)}
          >
            <img src={room.bg} alt={room.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(8,4,15,0.88) 100%)' }} />

            {/* Tags */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 text-white bg-red-500">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-live-dot" />
                LIVE
              </span>
              {room.isHot && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>🔥 HOT</span>
              )}
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: room.tag === 'VIP' ? 'linear-gradient(135deg, #f59e0b, #fcd34d)' : room.tag === 'PK' ? 'rgba(239,68,68,0.7)' : 'rgba(139,92,246,0.6)', color: room.tag === 'VIP' ? '#0a0612' : 'white' }}>
                {room.tag}
              </span>
            </div>

            {/* Listeners count */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1.5C3.515 1.5 1.5 3.015 1.5 4.875c0 .99.566 1.882 1.474 2.502L2.25 9l1.942-1.058A6.22 6.22 0 006 8.25c2.485 0 4.5-1.515 4.5-3.375S8.485 1.5 6 1.5z" fill="#a78bfa" /></svg>
              <span className="text-[11px] text-white font-semibold">{room.listeners.toLocaleString()}</span>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg leading-tight mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>{room.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={room.avatar} alt={room.host} className="w-7 h-7 rounded-full object-cover border border-violet-400/40" />
                  <span className="text-white/80 text-sm font-medium">{room.host}</span>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
                >
                  Join Now
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
