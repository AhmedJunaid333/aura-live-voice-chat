import { useState, useEffect } from 'react'

const slides = [
  {
    id: 0,
    emoji: '🎙️',
    title: 'Live Voice\nRooms',
    sub: 'Join thousands of live audio rooms every night. Talk, sing, vibe.',
    bg: 'radial-gradient(ellipse at 40% 30%, #3b0764 0%, #1e1b4b 50%, #08040f 100%)',
    accent: '#a855f7',
    particles: ['🎵', '🎶', '🎤', '🎧', '✨'],
  },
  {
    id: 1,
    emoji: '🎁',
    title: 'Send Gifts\n& Shine',
    sub: 'Express yourself with animated gifts. Crowns, diamonds, galaxies — stand out.',
    bg: 'radial-gradient(ellipse at 60% 35%, #78350f 0%, #1c1917 50%, #08040f 100%)',
    accent: '#f59e0b',
    particles: ['👑', '💎', '🌌', '🚀', '💫'],
  },
  {
    id: 2,
    emoji: '⚔️',
    title: 'PK Battles\n& Fame',
    sub: 'Challenge rooms to epic PK battles. Earn fans, climb the ranks, claim glory.',
    bg: 'radial-gradient(ellipse at 50% 30%, #7f1d1d 0%, #1e1b4b 50%, #08040f 100%)',
    accent: '#ef4444',
    particles: ['🔥', '⚡', '🏆', '🌟', '💥'],
  },
]

interface Props { onDone: () => void }

export default function OnboardingScreen({ onDone }: Props) {
  const [current, setCurrent] = useState(0)
  const [animDir, setAnimDir] = useState<'next' | 'prev'>('next')
  const [transitioning, setTransitioning] = useState(false)
  const [floats, setFloats] = useState<{ id: number; emoji: string; x: number; delay: number }[]>([])

  useEffect(() => {
    const slide = slides[current]
    setFloats(
      slide.particles.map((emoji, i) => ({ id: i, emoji, x: 10 + i * 18, delay: i * 0.3 }))
    )
  }, [current])

  const go = (dir: 'next' | 'prev') => {
    if (transitioning) return
    setAnimDir(dir)
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(p => dir === 'next' ? p + 1 : p - 1)
      setTransitioning(false)
    }, 320)
  }

  const slide = slides[current]

  return (
    <div
      className="screen flex flex-col"
      style={{
        background: slide.bg,
        transition: 'background 0.8s ease',
      }}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floats.map(f => (
          <div
            key={`${current}-${f.id}`}
            className="absolute text-3xl opacity-20"
            style={{
              left: `${f.x}%`,
              top: '15%',
              animation: `float-up 3s ${f.delay}s ease-out infinite`,
            }}
          >
            {f.emoji}
          </div>
        ))}
      </div>

      {/* Skip */}
      <div className="absolute top-12 right-5 z-10">
        <button onClick={onDone} className="text-white/40 text-sm font-medium">Skip</button>
      </div>

      {/* Main content */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 text-center"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? (animDir === 'next' ? 'translateX(-24px)' : 'translateX(24px)') : 'translateX(0)',
          transition: 'opacity 0.28s ease, transform 0.28s ease',
        }}
      >
        {/* Big emoji */}
        <div
          className="mb-8 relative"
          style={{ animation: 'logo-appear 0.7s cubic-bezier(0.34,1.56,0.64,1) both' }}
        >
          <div
            className="w-36 h-36 rounded-[40px] flex items-center justify-center text-7xl"
            style={{
              background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.15), rgba(0,0,0,0.3))`,
              border: `1px solid ${slide.accent}40`,
              boxShadow: `0 0 60px ${slide.accent}40, 0 0 120px ${slide.accent}20`,
            }}
          >
            {slide.emoji}
          </div>
          {/* Corner glow rings */}
          {[1, 2].map(r => (
            <div
              key={r}
              className="absolute inset-0 rounded-[40px]"
              style={{
                border: `1px solid ${slide.accent}30`,
                transform: `scale(${1 + r * 0.15})`,
                animation: `pulse-ring ${1.5 + r * 0.3}s ease-out infinite ${r * 0.2}s`,
              }}
            />
          ))}
        </div>

        <h1
          className="text-4xl font-extrabold text-white mb-4 leading-tight"
          style={{ fontFamily: 'Plus Jakarta Sans', whiteSpace: 'pre-line', animation: 'fadeInUp 0.4s 0.1s ease both' }}
        >
          {slide.title}
        </h1>
        <p
          className="text-white/60 text-base leading-relaxed max-w-xs"
          style={{ animation: 'fadeInUp 0.4s 0.18s ease both' }}
        >
          {slide.sub}
        </p>
      </div>

      {/* Dots + CTA */}
      <div className="px-8 pb-14 flex flex-col items-center gap-6" style={{ animation: 'fadeIn 0.5s 0.25s ease both' }}>
        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-400"
              style={{
                width: current === i ? 24 : 8,
                height: 8,
                background: current === i ? slide.accent : 'rgba(255,255,255,0.2)',
              }}
              onClick={() => {
                if (i > current) go('next')
                else if (i < current) go('prev')
              }}
            />
          ))}
        </div>

        {current < slides.length - 1 ? (
          <button
            onClick={() => go('next')}
            className="w-full h-14 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{
              background: `linear-gradient(135deg, ${slide.accent}cc, ${slide.accent})`,
              boxShadow: `0 8px 32px ${slide.accent}50`,
            }}
          >
            Continue
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5 9h8M9 5l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        ) : (
          <button
            onClick={onDone}
            className="w-full h-14 rounded-2xl text-white font-bold text-base active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)',
              boxShadow: '0 8px 32px rgba(139,92,246,0.5)',
            }}
          >
            🚀 Enter Aura Live
          </button>
        )}

        {current > 0 && (
          <button onClick={() => go('prev')} className="text-white/30 text-sm">← Back</button>
        )}
      </div>
    </div>
  )
}
