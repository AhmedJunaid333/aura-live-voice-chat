export type Tab = 'home' | 'discover' | 'live' | 'rank' | 'profile'

const tabs: { id: Tab; label: string; icon: (active: boolean) => JSX.Element }[] = [
  {
    id: 'home', label: 'Home',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H14v-5H8v5H4a1 1 0 01-1-1V9.5z"
          stroke={a ? '#a78bfa' : '#4b5563'} strokeWidth="1.8" fill={a ? 'rgba(167,139,250,0.15)' : 'none'} strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'discover', label: 'AI',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="7" stroke={a ? '#60a5fa' : '#4b5563'} strokeWidth="1.8" fill={a ? 'rgba(96,165,250,0.1)' : 'none'} />
        <path d="M8 11l2 2 4-4" stroke={a ? '#60a5fa' : '#4b5563'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'live', label: 'Live',
    icon: (a) => (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="7" fill={a ? '#ec4899' : '#374151'} />
        <circle cx="13" cy="13" r="10" stroke={a ? '#ec4899' : '#374151'} strokeWidth="1.5" opacity="0.4" />
        <circle cx="13" cy="13" r="12.5" stroke={a ? '#ec4899' : '#374151'} strokeWidth="1" opacity="0.15" />
      </svg>
    ),
  },
  {
    id: 'rank', label: 'Rank',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="10" width="4" height="10" rx="1" fill={a ? '#f59e0b' : '#4b5563'} opacity={a ? 0.7 : 0.5} />
        <rect x="9" y="6" width="4" height="14" rx="1" fill={a ? '#f59e0b' : '#4b5563'} />
        <rect x="16" y="13" width="4" height="7" rx="1" fill={a ? '#f59e0b' : '#4b5563'} opacity={a ? 0.7 : 0.5} />
        {a && <path d="M11 2l.5 1.5H13l-1.25.9.5 1.6L11 5.1l-1.25.9.5-1.6L9 3.5h1.5z" fill="#f59e0b" />}
      </svg>
    ),
  },
  {
    id: 'profile', label: 'Me',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="4" stroke={a ? '#a78bfa' : '#4b5563'} strokeWidth="1.8" fill={a ? 'rgba(167,139,250,0.15)' : 'none'} />
        <path d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke={a ? '#a78bfa' : '#4b5563'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
]

interface Props { active: Tab; onChange: (t: Tab) => void }

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="absolute bottom-0 left-0 right-0 flex items-center justify-around"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(8,4,15,0.97) 25%, #08040f 100%)',
        backdropFilter: 'blur(20px)',
        paddingTop: 10,
        paddingBottom: 20,
        borderTop: '1px solid rgba(139,92,246,0.08)',
      }}
    >
      {tabs.map(tab => {
        const isLive = tab.id === 'live'
        const activeColor = tab.id === 'discover' ? '#60a5fa' : tab.id === 'rank' ? '#f59e0b' : '#a78bfa'

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex flex-col items-center relative"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: isLive ? '0 12px' : '4px 12px 2px' }}
          >
            {isLive && active !== 'live' && (
              <span className="absolute top-0 right-2.5 w-2 h-2 rounded-full animate-live-dot" style={{ background: '#ef4444' }} />
            )}

            {isLive ? (
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center -mt-5 mb-1"
                style={{
                  background: active === 'live' ? 'linear-gradient(135deg, #be185d, #ec4899)' : 'linear-gradient(135deg, #1f1035, #2d1a4a)',
                  border: active === 'live' ? '2px solid #ec4899' : '2px solid rgba(236,72,153,0.3)',
                  boxShadow: active === 'live' ? '0 0 24px rgba(236,72,153,0.6), 0 -4px 12px rgba(236,72,153,0.2)' : '0 0 12px rgba(236,72,153,0.2)',
                  transform: active === 'live' ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              >
                {tab.icon(active === tab.id)}
              </div>
            ) : (
              <div style={{ transform: active === tab.id ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
                {tab.icon(active === tab.id)}
              </div>
            )}

            <span
              className="text-[10px] font-semibold tracking-wide"
              style={{ color: active === tab.id ? (isLive ? '#ec4899' : activeColor) : '#374151', transition: 'color 0.2s' }}
            >
              {tab.label}
            </span>

            {active === tab.id && !isLive && (
              <div className="absolute -bottom-1 w-1 h-1 rounded-full" style={{ background: activeColor, animation: 'fadeInScale 0.3s ease forwards' }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}
