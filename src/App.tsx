import { useState, useCallback, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import BottomNav, { type Tab } from './components/BottomNav'
import OnboardingScreen from './screens/OnboardingScreen'
import HomeScreen from './screens/HomeScreen'
import LiveFeedScreen from './screens/LiveFeedScreen'
import LiveRoomScreen from './screens/LiveRoomScreen'
import WalletScreen from './screens/WalletScreen'
import PremiumProfileScreen from './screens/PremiumProfileScreen'
import FamilyScreen from './screens/FamilyScreen'
import LeaderboardScreen from './screens/LeaderboardScreen'
import AIDiscoverScreen from './screens/AIDiscoverScreen'
import HelpSupportScreen from './screens/HelpSupportScreen'
import HelpCenterScreen from './screens/HelpCenterScreen'
import ChatScreen from './screens/ChatScreen'

import { authSessionService } from './services/authSessionService'

import { LevelCenterModal } from './components/LevelCenterModal'
import { InvitationApplicationCenterModal } from './components/InvitationApplicationCenterModal'
import RewardsCenterScreen from './screens/RewardsCenterScreen'

type AppPhase = 'splash' | 'onboarding' | 'main'
type SubScreen = 'family' | 'leaderboard' | 'helpsupport' | 'helpcenter' | 'level' | 'invitation' | 'chat' | 'rewards' | null
type ActiveRoom = { title: string; host: string; listeners: number; bg: string; isPK: boolean } | null

/* ── Redirect legacy /#admin route to official Enterprise Admin Portal ── */
const handleLegacyAdminRedirect = () => {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  if (hash.includes('admin') || search.includes('admin') || path.includes('admin')) {
    window.location.href = 'https://aura-live-voice-chat-app.web.app';
  }
};

/* ── Detect /rewards route via URL ── */
const isRewardsRoute = () => {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  return hash.includes('reward') || search.includes('reward') || path.includes('reward');
};

export default function App() {
  const [isRewardsView, setIsRewardsView] = useState<boolean>(() => isRewardsRoute());
  const [phase, setPhase] = useState<AppPhase>('main');
  const [tab, setTab] = useState<Tab>('home');
  const [activeRoom, setActiveRoom] = useState<ActiveRoom>(null);
  const [subScreen, setSubScreen] = useState<SubScreen>(null);
  const [prevTab, setPrevTab] = useState<Tab>('home');

  useEffect(() => {
    handleLegacyAdminRedirect();
    const handleUrlChange = () => {
      handleLegacyAdminRedirect();
      setIsRewardsView(isRewardsRoute());
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleSplashDone = useCallback(async () => {
    const sessionResult = await authSessionService.initializeAppSession();
    if (sessionResult.authenticated) {
      setPhase('main');
    } else {
      setPhase('onboarding');
    }
  }, []);

  const handleOnboardingDone = useCallback(() => setPhase('main'), []);

  const enterRoom = useCallback((room: any) => {
    setActiveRoom({ title: room.title, host: room.host, listeners: room.listeners, bg: room.bg, isPK: !!room.isPK });
  }, []);

  const exitRoom = useCallback(() => setActiveRoom(null), []);

  const handleTabChange = useCallback((t: Tab) => {
    setPrevTab(tab);
    setTab(t);
    setSubScreen(null);
  }, [tab]);

  /* ══════════════════════════════════════════════════════════ */
  /* ══ MOBILE APP FLOW (Splash → Onboarding → Main) ════════ */
  /* ══════════════════════════════════════════════════════════ */
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
          {tab === 'home' && <HomeScreen onEnterRoom={enterRoom} onNavigate={setSubScreen} />}
          {tab === 'discover' && <AIDiscoverScreen />}
          {tab === 'live' && <LiveFeedScreen onEnterRoom={enterRoom} />}
          {tab === 'chat' && <ChatScreen onNavigate={setSubScreen} onBack={() => handleTabChange('home')} onEnterRoom={enterRoom} />}
          {tab === 'rank' && <LeaderboardScreen />}
          {tab === 'profile' && <PremiumProfileScreen />}
        </div>
      )}

      {/* Sub-screens (slide in from right) */}
      {!activeRoom && subScreen === 'chat' && (
        <div key="chat" style={{ position: 'absolute', inset: 0, zIndex: 40, animation: 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
          <ChatScreen onNavigate={setSubScreen} onBack={() => setSubScreen(null)} onEnterRoom={enterRoom} />
        </div>
      )}

      {!activeRoom && subScreen === 'family' && (
        <div key="family" style={{ position: 'absolute', inset: 0, animation: 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
          <FamilyScreen onBack={() => setSubScreen(null)} />
        </div>
      )}

      {!activeRoom && subScreen === 'helpsupport' && (
        <div key="helpsupport" style={{ position: 'absolute', inset: 0, zIndex: 40, animation: 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
          <HelpSupportScreen onBack={() => setSubScreen(null)} />
        </div>
      )}

      {!activeRoom && subScreen === 'helpcenter' && (
        <div key="helpcenter" style={{ position: 'absolute', inset: 0, zIndex: 40, animation: 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
          <HelpCenterScreen onBack={() => setSubScreen(null)} />
        </div>
      )}

      {!activeRoom && subScreen === 'level' && (
        <div key="level" style={{ position: 'absolute', inset: 0, zIndex: 40, animation: 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
          <LevelCenterModal isOpen={true} onClose={() => setSubScreen(null)} />
        </div>
      )}

      {!activeRoom && subScreen === 'invitation' && (
        <div key="invitation" style={{ position: 'absolute', inset: 0, zIndex: 40, animation: 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
          <InvitationApplicationCenterModal isOpen={true} onClose={() => setSubScreen(null)} />
        </div>
      )}

      {!activeRoom && (subScreen === 'rewards' || isRewardsView) && (
        <div key="rewards" style={{ position: 'absolute', inset: 0, zIndex: 40, animation: 'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
          <RewardsCenterScreen 
            onBack={() => {
              setSubScreen(null);
              setIsRewardsView(false);
              if (window.location.hash.includes('reward')) {
                window.location.hash = '';
              }
            }} 
            onNavigate={setSubScreen} 
            onEnterRoom={enterRoom} 
          />
        </div>
      )}

      {/* Live room fullscreen */}
      {activeRoom && <LiveRoomScreen room={activeRoom} onBack={exitRoom} />}

      {/* Bottom nav */}
      {!activeRoom && !subScreen && !isRewardsView && <BottomNav active={tab} onChange={handleTabChange} />}

      {/* Quick Switch to Web Admin Portal Button */}
      {!activeRoom && (
        <button
          onClick={() => setIsAdminView(true)}
          className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-xl bg-purple-600/90 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/50 backdrop-blur-md border border-purple-400/40 flex items-center gap-1.5 transition-transform hover:scale-105"
        >
          <span>🛡️</span>
          <span>Admin Portal</span>
        </button>
      )}
    </div>
  );
}

