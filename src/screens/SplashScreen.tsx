import { useState, useEffect } from 'react'

interface Props {
  onDone?: () => void
}

export default function SplashScreen({ onDone }: Props) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          if (onDone) setTimeout(onDone, 600)
          return 100
        }
        return prev + Math.floor(Math.random() * 4) + 2
      })
    }, 50)
    return () => clearInterval(timer)
  }, [onDone])

  return (
    <div className="min-h-screen bg-[#15121b] text-[#e8dfee] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Ambient Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] bg-[#7c3aed]/15 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[70vw] h-[70vw] bg-[#6f00be]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Splash Content */}
      <main className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
        {/* Glass-morphism Logo Container */}
        <div className="relative group cursor-default">
          <div className="absolute -inset-8 bg-[#7c3aed]/20 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex items-center justify-center relative overflow-hidden">
            {/* Inner Glossy Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            
            {/* Central Logo Icon */}
            <div className="flex flex-col items-center gap-2 drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">
              <span className="text-7xl md:text-8xl text-[#d2bbff] animate-pulse">✨</span>
            </div>

            {/* Animated highlight sweep */}
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] transition-all duration-[2000ms] group-hover:left-full"></div>
          </div>
        </div>

        {/* Brand Typography */}
        <div className="mt-12 text-center">
          <h1 className="text-3xl md:text-4xl text-white font-bold uppercase tracking-[0.5em] ml-[0.5em]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Aura Live
          </h1>
          <p className="text-xs text-[#ccc3d8]/60 mt-4 tracking-widest font-light uppercase">
            ELEVATING DIGITAL EXPERIENCES
          </p>
        </div>
      </main>

      {/* Progress Section */}
      <div className="absolute bottom-20 w-full max-w-xs md:max-w-md px-6 z-10">
        <div className="flex justify-between items-end mb-3 text-[10px] uppercase tracking-widest">
          <span className="text-[#ccc3d8]/50">System Initializing</span>
          <span className="font-mono text-[#d2bbff] font-bold">{progress}%</span>
        </div>
        <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#d2bbff] transition-all duration-100 shadow-[0_0_8px_rgba(210,187,255,0.8)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Branding Footer */}
      <div className="absolute bottom-8 text-[10px] text-[#ccc3d8]/40 tracking-[0.3em] uppercase z-10">
        Designed for Excellence © 2026
      </div>
    </div>
  )
}
