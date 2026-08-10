import { useState } from 'react'

interface Props {
  onBack?: () => void
  onSignOut?: () => void
}

export default function SettingsScreen({ onBack, onSignOut }: Props) {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8f5] to-[#fbf2ed] text-[#1e1b18] font-sans pb-28 relative">
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 h-14 bg-[#fff8f5]/80 backdrop-blur-md border-b border-[#d0c5af]/20">
        <button
          onClick={onBack}
          className="text-[#4d4635] p-2 -ml-2 rounded-full hover:bg-black/5 active:scale-95 transition-all text-xl"
        >
          ‹
        </button>
        <h1 className="text-xl font-bold text-[#735c00] tracking-tight" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
          Settings
        </h1>
        <div className="w-8"></div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-6 px-5 max-w-md mx-auto space-y-4">
        {/* Settings Group 1 */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(212,175,55,0.08)] border border-white/50 overflow-hidden divide-y divide-[#e9e1dc]/50">
          <button
            onClick={() => setActiveModal('Account Security')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#fbf2ed] transition-colors group active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#735c00] text-xl group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <span className="text-base font-medium text-[#1e1b18]">Account Security</span>
            </div>
            <span className="text-[#735c00]/60 text-sm font-bold group-hover:text-[#735c00] transition-colors">➔</span>
          </button>

          <button
            onClick={() => setActiveModal('Privacy')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#fbf2ed] transition-colors group active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#735c00] text-xl group-hover:scale-110 transition-transform">
                🔒
              </div>
              <span className="text-base font-medium text-[#1e1b18]">Privacy</span>
            </div>
            <span className="text-[#735c00]/60 text-sm font-bold group-hover:text-[#735c00] transition-colors">➔</span>
          </button>
        </div>

        {/* Settings Group 2 */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(212,175,55,0.08)] border border-white/50 overflow-hidden divide-y divide-[#e9e1dc]/50">
          <button
            onClick={() => setActiveModal('Notifications')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#fbf2ed] transition-colors group active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#735c00] text-xl group-hover:scale-110 transition-transform">
                🔔
              </div>
              <span className="text-base font-medium text-[#1e1b18]">Notifications</span>
            </div>
            <span className="text-[#735c00]/60 text-sm font-bold group-hover:text-[#735c00] transition-colors">➔</span>
          </button>

          <button
            onClick={() => setActiveModal('Language')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#fbf2ed] transition-colors group active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#735c00] text-xl group-hover:scale-110 transition-transform">
                🌐
              </div>
              <span className="text-base font-medium text-[#1e1b18]">Language</span>
            </div>
            <span className="text-[#735c00]/60 text-sm font-bold group-hover:text-[#735c00] transition-colors">➔</span>
          </button>
        </div>

        {/* Settings Group 3 */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(212,175,55,0.08)] border border-white/50 overflow-hidden">
          <button
            onClick={() => setActiveModal('Help & Support')}
            className="w-full flex items-center justify-between p-4 hover:bg-[#fbf2ed] transition-colors group active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#735c00] text-xl group-hover:scale-110 transition-transform">
                ❓
              </div>
              <span className="text-base font-medium text-[#1e1b18]">Help & Support</span>
            </div>
            <span className="text-[#735c00]/60 text-sm font-bold group-hover:text-[#735c00] transition-colors">➔</span>
          </button>
        </div>

        {/* Log Out Button */}
        <div className="pt-6 flex justify-center">
          <button
            onClick={onSignOut || onBack}
            className="px-8 py-3 rounded-full bg-[#f5ece7] border border-[#d0c5af] text-[#ba1a1a] font-bold text-xs hover:bg-[#ffdad6] hover:text-[#93000a] transition-colors shadow-sm active:scale-95"
          >
            Log Out
          </button>
        </div>

        <div className="text-center pt-2">
          <span className="text-[11px] font-medium text-[#4d4635]/60">Version 2.4.1 (Premium)</span>
        </div>
      </main>

      {/* Active Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 border border-[#d0c5af]/30">
            <h3 className="text-xl font-bold text-[#735c00]">{activeModal}</h3>
            <p className="text-xs text-[#4d4635]">
              {activeModal === 'Account Security' && 'Manage password, two-factor authentication, and login sessions.'}
              {activeModal === 'Privacy' && 'Control profile visibility, blocked users, and message permissions.'}
              {activeModal === 'Notifications' && 'Customize push alerts for live streams, gifts, and chat messages.'}
              {activeModal === 'Language' && 'App language is set to English / Urdu. System auto-detect enabled.'}
              {activeModal === 'Help & Support' && 'Contact 24/7 VIP support or read official user documentation.'}
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-2xl bg-[#735c00] text-white font-bold text-sm hover:bg-[#574500] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
