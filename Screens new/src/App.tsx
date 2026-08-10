import { useState, useCallback } from 'react'
import SplashScreen from './components/SplashScreen'
import BottomNav, { type Tab } from './components/BottomNav'
import OnboardingScreen from './screens/OnboardingScreen'
import HomeScreen from './screens/HomeScreen'
import LiveFeedScreen from './screens/LiveFeedScreen'
import LiveRoomScreen from './screens/LiveRoomScreen'
import WalletScreen from './screens/WalletScreen'
import ProfileScreen from './screens/ProfileScreen'
import FamilyScreen from './screens/FamilyScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import AIDiscoverScreen from './screens/AIDiscoverScreen'

type AppPhase = 'splash' | 'onboarding' | 'main'
type SubScreen = 'family' | 'leaderboard' | null
type ActiveRoom = { title: string; host: string; listeners: number; bg: string; isPK: boolean } | null

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('splash')
  const [tab, setTab] = useState<Tab>('home')
  const [activeRoom, setActiveRoom] = useState<ActiveRoom>(null)
  const [subScreen, setSubScreen] = useState<SubScreen>(null)
  const [prevTab, setPrevTab] = useState<Tab>('home')

  const handleSplashDone = useCallback(() => setPhase('onboarding'), [])
  const handleOnboardingDone = useCallback(() => setPhase('main'), [])

  const enterRoom = useCallback((room: any) => {
    setActiveRoom({ title: room.title, host: room.host, listeners: room.listeners, bg: room.bg, isPK: !!room.isPK })
  }, [])

  const exitRoom = useCallback(() => setActiveRoom(null), [])

  const handleTabChange = useCallback((t: Tab) => {
    setPrevTab(tab)
    setTab(t)
    setSubScreen(null)
  }, [tab])

  if (phase === 'splash') return <SplashScreen onDone={handleSplashDone} />
  if (phase === 'onboarding') return <OnboardingScreen onDone={handleOnboardingDone} />

  const isSlideLeft = ['discover', 'live', 'rank', 'profile'].indexOf(tab) > ['discover', 'live', 'rank', 'profile'].indexOf(prevTab)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#08040f', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div className="absolute pointer-events-none" style={{ top: -80, left: '50%', transform: 'translateX(-50%)', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(20px)' }} />

      {/* Main screens */}
      {!activeRoom && !subScreen && (
        <div
          key={tab}
          style={{
            position: 'absolute', inset: 0,
            animation: `${isSlideLeft ? 'slideInRight' : 'slideInLeft'} 0.35s cubic-bezier(0.16,1,0.3,1) both`,
          }}
        >
          {tab === 'home' && <HomeScreen onEnterRoom={enterRoom} />}
          {tab === 'discover' && <AIDiscoverScreen />}
          {tab === 'live' && <LiveFeedScreen onEnterRoom={enterRoom} />}
          {tab === 'rank' && <LeaderboardScreen />}
          {tab === 'profile' && <ProfileScreen onNavigate={setSubScreen} />}
        </div>
      )}

      {/* Sub-screens (slide in from right) */}
      {!activeRoom && subScreen === 'family' && (
        <div key="family" style={{ position: 'absolute', inset: 0, animation: 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
          <FamilyScreen onBack={() => setSubScreen(null)} />
        </div>
      )}

      {/* Live room fullscreen */}
      {activeRoom && <LiveRoomScreen room={activeRoom} onBack={exitRoom} />}

      {/* Bottom nav */}
      {!activeRoom && !subScreen && <BottomNav active={tab} onChange={handleTabChange} />}

      {/* Back button for sub-screens */}
      {subScreen && !activeRoom && (
        <button
          onClick={() => setSubScreen(null)}
          className="absolute top-12 left-4 z-50 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      )}
    </div>
  )
}
