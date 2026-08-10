import { useEffect, useState } from 'react'

interface Props { onDone: () => void }

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 800)
    const t2 = setTimeout(() => setPhase('exit'), 2200)
    const t3 = setTimeout(onDone, 2700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div
      className="screen flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #2d0a5e 0%, #130a22 50%, #08040f 100%)',
        transition: phase === 'exit' ? 'opacity 0.5s ease, transform 0.5s ease' : undefined,
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'scale(1.06)' : 'scale(1)',
      }}
    >
      {/* Ambient rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute rounded-full border border-violet-500/20"
            style={{
              width: 120 + i * 90,
              height: 120 + i * 90,
              animation: `pulse-ring ${1.6 + i * 0.3}s ease-out infinite ${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div
        className="relative flex flex-col items-center gap-4"
        style={{ animation: phase === 'enter' ? 'logo-appear 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards' : undefined }}
      >
        <div
          className="relative w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)',
            boxShadow: '0 0 40px rgba(139,92,246,0.6), 0 0 80px rgba(139,92,246,0.3)',
          }}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="22" r="10" fill="white" opacity="0.95" />
            <path d="M10 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            <circle cx="38" cy="16" r="5" fill="white" opacity="0.6" />
            <circle cx="14" cy="16" r="5" fill="white" opacity="0.6" />
            <path d="M38 28c3 2 5 5.5 5 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
            <path d="M14 28c-3 2-5 5.5-5 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          </svg>
          {/* Mic wave indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-400 border-2 border-[#08040f] flex items-center justify-center">
            <div className="flex gap-0.5 items-end h-3">
              {[1,2,3].map(b => (
                <div key={b} className="w-0.5 bg-white rounded-full speaking-bar" style={{ height: '100%', animationDelay: `${b*0.15}s` }} />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans', letterSpacing: '-0.02em' }}>
            <span style={{ background: 'linear-gradient(135deg, #c4b5fd, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Aura
            </span>
            <span className="text-white"> Live</span>
          </h1>
          <p className="text-sm text-violet-300/70 mt-1 tracking-widest uppercase font-medium">Voice Rooms</p>
        </div>
      </div>

      {/* Loading bar */}
      <div className="absolute bottom-16 w-40 h-0.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
            width: phase === 'hold' || phase === 'exit' ? '100%' : '15%',
            transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
    </div>
  )
}
