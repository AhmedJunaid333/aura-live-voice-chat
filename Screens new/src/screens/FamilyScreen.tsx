import { useState, useEffect } from 'react'

const members = [
  { rank: 1, name: 'Aria Moon', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format', role: 'Owner', contribution: 48200, badge: '👑' },
  { rank: 2, name: 'DJ Vortex', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format', role: 'Admin', contribution: 31500, badge: '⚡' },
  { rank: 3, name: 'Luna Ray', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&auto=format', role: 'Elder', contribution: 22800, badge: '🌙' },
  { rank: 4, name: 'Marcus K', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format', role: 'Member', contribution: 18400, badge: '🎵' },
  { rank: 5, name: 'Queen Zara', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format', role: 'Member', contribution: 14200, badge: '💎' },
  { rank: 6, name: 'NightOwl', avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=80&h=80&fit=crop&auto=format', role: 'Member', contribution: 9800, badge: '🦉' },
]

function useCountUp(target: number, duration = 1000, delay = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * target))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(t)
  }, [target, duration, delay])
  return val
}

interface Props { onBack?: () => void }

export default function FamilyScreen({ onBack }: Props) {
  const [tab, setTab] = useState<'overview' | 'members' | 'treasury'>('overview')
  const [levelUp, setLevelUp] = useState(false)
  const treasury = useCountUp(284500, 1400, 300)
  const members7d = useCountUp(47, 800, 500)

  useEffect(() => {
    const t = setTimeout(() => setLevelUp(true), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="screen overflow-y-auto" style={{ paddingBottom: 80 }}>
      {/* Hero banner */}
      <div className="relative h-44 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=176&fit=crop&auto=format"
          alt="Family banner"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.4) saturate(1.2)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 10%, rgba(8,4,15,0.95) 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-2"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              boxShadow: '0 0 30px rgba(139,92,246,0.6)',
              animation: 'logo-appear 0.6s ease both',
            }}
          >
            ⚔️
          </div>
          <h2 className="text-white font-extrabold text-xl" style={{ fontFamily: 'Plus Jakarta Sans', animation: 'fadeInUp 0.4s 0.15s ease both' }}>Aura Warriors</h2>
          <div className="flex items-center gap-2 mt-1" style={{ animation: 'fadeInUp 0.4s 0.2s ease both' }}>
            <span className="text-violet-300 text-sm">Level 8</span>
            <span className="text-white/30">·</span>
            <span className="text-white/60 text-sm">284 members</span>
          </div>
        </div>
      </div>

      {/* Level-up bar */}
      <div className="mx-4 mt-3 rounded-2xl px-4 py-3" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', animation: 'fadeIn 0.5s 0.3s ease both' }}>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-violet-300 font-semibold">Family Level 8</span>
          <span className="text-white/50">→ Level 9</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.2)' }}>
          <div
            className="h-full rounded-full transition-all duration-1200 ease-out"
            style={{
              width: levelUp ? '68%' : '0%',
              background: 'linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)',
              boxShadow: '0 0 8px rgba(139,92,246,0.7)',
              transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </div>
        <p className="text-white/30 text-[10px] mt-1">68% — Need 96K more contribution to level up</p>
      </div>

      {/* Tabs */}
      <div className="mx-4 mt-4 flex rounded-xl overflow-hidden p-0.5" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }}>
        {(['overview', 'members', 'treasury'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
            style={{
              background: tab === t ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent',
              color: tab === t ? 'white' : 'rgba(255,255,255,0.4)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 mt-4">
        {tab === 'overview' && (
          <div className="space-y-4" style={{ animation: 'fadeIn 0.35s ease both' }}>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Treasury', value: treasury.toLocaleString(), icon: '🏛️', sub: 'coins total', color: '#f59e0b' },
                { label: 'New Members', value: `+${members7d}`, icon: '👥', sub: 'this week', color: '#34d399' },
                { label: 'Family Rank', value: '#12', icon: '🏆', sub: 'global ranking', color: '#a78bfa' },
                { label: 'Active Rooms', value: '18', icon: '🎙️', sub: 'live right now', color: '#60a5fa' },
              ].map((s, i) => (
                <div key={s.label} className="rounded-2xl p-4" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)', animation: `fadeInUp 0.3s ${i * 0.06}s ease both` }}>
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-extrabold text-xl" style={{ fontFamily: 'Plus Jakarta Sans', color: s.color }}>{s.value}</div>
                  <div className="text-[11px] text-white/50 mt-0.5">{s.label}</div>
                  <div className="text-[10px]" style={{ color: s.color + '80' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Family perks */}
            <div>
              <h3 className="font-bold text-sm mb-3" style={{ fontFamily: 'Plus Jakarta Sans' }}>Family Perks</h3>
              <div className="space-y-2">
                {[
                  { icon: '🎙️', perk: 'Priority mic access in family rooms', unlocked: true },
                  { icon: '🎨', perk: 'Exclusive family badge & frame', unlocked: true },
                  { icon: '💰', perk: '5% gift bonus for all members', unlocked: true },
                  { icon: '🌟', perk: 'Custom family anthem', unlocked: false },
                  { icon: '🚀', perk: 'Family-only PK tournaments', unlocked: false },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: p.unlocked ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${p.unlocked ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                    <span className={p.unlocked ? '' : 'opacity-40'}>{p.icon}</span>
                    <span className="text-xs flex-1" style={{ color: p.unlocked ? '#d1fae5' : 'rgba(255,255,255,0.3)' }}>{p.perk}</span>
                    {p.unlocked
                      ? <span className="text-green-400 text-[10px] font-bold">✓ Active</span>
                      : <span className="text-white/20 text-[10px]">Locked</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'members' && (
          <div className="space-y-2" style={{ animation: 'fadeIn 0.35s ease both' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/50 text-xs">284 members total</p>
              <span className="text-violet-400 text-xs font-medium">+ Invite</span>
            </div>
            {members.map((m, i) => (
              <div
                key={m.rank}
                className="flex items-center gap-3 rounded-2xl px-3 py-3"
                style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.12)', animation: `fadeInUp 0.3s ${i * 0.06}s ease both` }}
              >
                {/* Rank */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-none"
                  style={{
                    background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #fcd34d)' : i === 1 ? 'rgba(192,192,192,0.3)' : i === 2 ? 'rgba(205,127,50,0.3)' : 'rgba(255,255,255,0.08)',
                    color: i < 3 ? (i === 0 ? '#0a0612' : 'white') : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {m.rank}
                </div>
                <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover flex-none" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white text-sm font-semibold truncate">{m.name}</span>
                    <span>{m.badge}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: m.role === 'Owner' ? '#f59e0b' : m.role === 'Admin' ? '#a78bfa' : 'rgba(255,255,255,0.4)' }}>{m.role}</span>
                </div>
                <div className="text-right flex-none">
                  <div className="text-amber-400 text-xs font-bold">🪙 {m.contribution.toLocaleString()}</div>
                  <div className="text-white/30 text-[10px]">contributed</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'treasury' && (
          <div className="space-y-4" style={{ animation: 'fadeIn 0.35s ease both' }}>
            <div className="rounded-3xl p-5 text-center" style={{ background: 'linear-gradient(135deg, #1c1430, #2d1a4a)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <p className="text-amber-400/70 text-xs font-medium tracking-widest uppercase mb-2">Family Treasury</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl">🏛️</span>
                <span className="text-4xl font-extrabold text-amber-400" style={{ fontFamily: 'Plus Jakarta Sans' }}>{treasury.toLocaleString()}</span>
              </div>
              <p className="text-white/40 text-xs mt-1">coins available</p>
            </div>
            <h3 className="font-bold text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>Reward Tiers</h3>
            {[
              { tier: 'Bronze', min: 0, max: 10000, reward: '500 coins weekly', color: '#cd7f32' },
              { tier: 'Silver', min: 10000, max: 50000, reward: '2000 coins weekly + badge', color: '#c0c0c0' },
              { tier: 'Gold', min: 50000, max: 150000, reward: '5000 coins + exclusive frame', color: '#f59e0b' },
              { tier: 'Diamond', min: 150000, max: Infinity, reward: 'VIP perks + custom effects', color: '#60a5fa' },
            ].map((tier, i) => (
              <div key={tier.tier} className="rounded-2xl px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(139,92,246,0.07)', border: `1px solid ${tier.color}30`, animation: `fadeInUp 0.3s ${i * 0.07}s ease both` }}>
                <div>
                  <p className="font-bold text-sm" style={{ color: tier.color }}>{tier.tier}</p>
                  <p className="text-white/50 text-xs">{tier.min.toLocaleString()}+ coins</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/70">{tier.reward}</p>
                </div>
                {treasury >= tier.min && treasury < (tier.max === Infinity ? Infinity : tier.max) && (
                  <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: tier.color, color: '#0a0612' }}>CURRENT</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
