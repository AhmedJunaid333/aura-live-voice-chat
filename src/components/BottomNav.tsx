import { useEffect, useState } from 'react';
import { chatEngine } from '../services/chatEngineService';

export type Tab = 'home' | 'discover' | 'live' | 'chat' | 'rank' | 'profile' | 'admin';

const getTabs = (unreadCount: number): { id: Tab; label: string; icon: (active: boolean) => JSX.Element }[] => [
  {
    id: 'home', label: 'EXPLORE',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={a ? '#a78bfa' : '#4b5563'} strokeWidth="1.8" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={a ? '#a78bfa' : 'none'} stroke={a ? '#a78bfa' : '#4b5563'} strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'discover', label: 'MOMENTS',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={a ? '#60a5fa' : '#4b5563'} strokeWidth="1.8" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={a ? '#60a5fa' : '#4b5563'} strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'live', label: 'LIVE',
    icon: (a) => (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="8" fill={a ? 'url(#goldenGlow)' : '#D4AF37'} />
        <path d="M13 8v10M8 13h10" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="goldenGlow" x1="0" y1="0" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    id: 'chat', label: 'CHAT',
    icon: (a) => (
      <div className="relative">
        <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? '#ec4899' : 'none'} stroke={a ? '#ec4899' : '#4b5563'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-2.5 bg-[#EF4444] text-white text-[9px] font-black h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full border border-[#121212] shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </div>
    ),
  },
  {
    id: 'profile', label: 'PROFILE',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="4" stroke={a ? '#a78bfa' : '#4b5563'} strokeWidth="1.8" fill={a ? 'rgba(167,139,250,0.15)' : 'none'} />
        <path d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke={a ? '#a78bfa' : '#4b5563'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

interface Props { active: Tab; onChange: (t: Tab) => void }

export default function BottomNav({ active, onChange }: Props) {
  const [unreadCount, setUnreadCount] = useState(() => chatEngine.getUnreadCount());

  useEffect(() => {
    const unsub = chatEngine.subscribe(() => {
      setUnreadCount(chatEngine.getUnreadCount());
    });
    return () => unsub();
  }, []);

  const tabs = getTabs(unreadCount);

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 flex items-center justify-around z-40"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(8,4,15,0.97) 25%, #08040f 100%)',
        backdropFilter: 'blur(20px)',
        paddingTop: 10,
        paddingBottom: 20,
        borderTop: '1px solid rgba(139,92,246,0.08)',
      }}
    >
      {tabs.map(tab => {
        const isLive = tab.id === 'live';
        const isChat = tab.id === 'chat';
        const activeColor = tab.id === 'discover' ? '#60a5fa' : tab.id === 'chat' ? '#ec4899' : '#a78bfa';

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
