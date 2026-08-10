import { useState, useEffect } from 'react'
import LuxuryThemeModal from '../components/LuxuryThemeModal'
import { EditProfileModal } from '../components/EditProfileModal'
import { userProfileEngine, UserProfileData } from '../services/userProfileService'

interface Props {
  onNavigate?: (screen: string) => void
}

export default function ProfileScreen({ onNavigate }: Props) {
  const [profile, setProfile] = useState<UserProfileData>(() => userProfileEngine.getProfile());
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [kycStatus, setKycStatus] = useState<'unverified' | 'pending' | 'verified'>('verified');
  const [showKycModal, setShowKycModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('royal-gold');
  const [cnicNumber, setCnicNumber] = useState('35202-9918201-3');
  const [referralCode] = useState('AURA-LUCKY106172');

  useEffect(() => {
    const sync = () => setProfile(userProfileEngine.getProfile());
    sync();
    const unsub = userProfileEngine.subscribe(sync);
    return () => unsub();
  }, []);


  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKycStatus('pending');
    setShowKycModal(false);
    alert('CNIC / Passport Verification submitted to Admin Review Queue!');
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b18] font-sans pb-28 relative select-none">
      {/* Top App Bar Header */}
      <header className="sticky top-0 z-50 px-5 py-4 flex justify-between items-center bg-[#fff8f5]/80 backdrop-blur-lg border-b border-[#d0c5af]/30 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="text-[#735c00] text-2xl active:scale-95 transition-transform">☰</button>
          <h1 className="text-2xl font-extrabold text-[#735c00]" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            Me & Identity
          </h1>
        </div>
        <div className="flex items-center gap-4 text-[#4d4635] text-xl">
          <button onClick={() => setShowThemeModal(true)} title="Luxury Visual Color Theme" className="hover:text-[#735c00] active:scale-95 transition-all">
            🎨
          </button>
          <button onClick={() => onNavigate?.('settings')} className="hover:text-[#735c00] active:scale-95 transition-all">
            ⚙️
          </button>
          <button onClick={() => alert('Dispatched Push Notifications Check')} className="hover:text-[#735c00] active:scale-95 transition-all relative">
            🔔
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>
        </div>
      </header>

      <main className="pb-24">
        {/* Profile Header Section */}
        <section className="relative overflow-hidden pt-6 px-5 pb-6">
          <div className="absolute inset-0 -z-10 opacity-30">
            <img
              src="https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=800&h=400&fit=crop&auto=format"
              alt="Palace Background"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fff8f5]/80 to-[#fff8f5]"></div>
          </div>

          <div className="flex flex-col items-center gap-4 mt-6">
            {/* Avatar Container */}
            <div className="relative cursor-pointer" onClick={() => setShowEditProfile(true)}>
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-[0_4px_20px_rgba(212,175,55,0.15)] overflow-hidden bg-white">
                <img
                  className="w-full h-full object-cover"
                  src={profile.avatar}
                  alt={profile.username}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#735c00] text-white rounded-full p-1 border-2 border-white text-xs">
                🛡️
              </div>
            </div>

            {/* User Info */}
            <div 
              onClick={() => setShowEditProfile(true)}
              className="text-center space-y-1 cursor-pointer group p-2 rounded-2xl hover:bg-black/5 transition-colors"
              title="Click to edit profile & details"
            >
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl font-bold text-[#1e1b18] group-hover:text-[#735c00] transition-colors">{profile.username}</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#735c00] font-extrabold text-[10px] border border-amber-300">
                  {profile.vipBadge || 'VIP 7'}
                </span>
                <span className="text-xs text-[#735c00] font-bold underline ml-1">Edit Details ✏️</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-[#4d4635] font-semibold">
                <span>UID: {profile.userId}</span>
                <span>•</span>
                <span className="text-emerald-600 font-bold">{profile.countryFlag} {profile.country}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[9px]">Aura Host 🎙️</span>
              </div>
              <p className="text-xs text-slate-600 max-w-sm italic">"{profile.bio}"</p>
            </div>


            {/* Level Progress Bar */}
            <div className="w-full bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#735c00]">Level 12 Progression (78%)</span>
                <span className="text-purple-700">Lv.12 ➔ Lv.13</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-purple-600 w-[78%] rounded-full shadow-md" />
              </div>
              <p className="text-[10px] text-slate-500 font-mono">12,400 / 15,000 XP (Daily login & gifting bonus active)</p>
            </div>

            {/* Stats Row */}
            <div className="flex justify-around w-full bg-white/70 backdrop-blur-md py-3.5 rounded-2xl border border-white/60 shadow-sm">
              <div className="text-center flex flex-col items-center">
                <span className="text-xl font-bold text-[#735c00]">128</span>
                <span className="text-[11px] text-[#4d4635] font-medium">Visitors</span>
              </div>
              <div className="w-px h-7 bg-[#d0c5af]/40 self-center"></div>
              <div className="text-center flex flex-col items-center">
                <span className="text-xl font-bold text-[#735c00]">42</span>
                <span className="text-[11px] text-[#4d4635] font-medium">Following</span>
              </div>
              <div className="w-px h-7 bg-[#d0c5af]/40 self-center"></div>
              <div className="text-center flex flex-col items-center">
                <span className="text-xl font-bold text-[#735c00]">1,840</span>
                <span className="text-[11px] text-[#4d4635] font-medium">Followers</span>
              </div>
            </div>
          </div>
        </section>

        {/* KYC Verification Card */}
        <section className="px-5">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 rounded-2xl shadow-lg border border-purple-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/40 border border-purple-400/50 flex items-center justify-center text-xl">
                🪪
              </div>
              <div>
                <h4 className="font-bold text-xs">Host & User Identity KYC Verification</h4>
                <p className="text-[10px] text-purple-200/80">CNIC / Passport Verification Status</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowKycModal(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-md ${
                kycStatus === 'verified' ? 'bg-emerald-500 text-white' : kycStatus === 'pending' ? 'bg-amber-500 text-black' : 'bg-purple-600 text-white'
              }`}
            >
              {kycStatus === 'verified' ? '✓ Verified' : kycStatus === 'pending' ? '⌛ Under Review' : '+ Verify KYC'}
            </button>
          </div>
        </section>

        {/* Referral System Card */}
        <section className="px-5 mt-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔗</span>
                <h4 className="font-bold text-xs text-[#1e1b18]">Invitation & Referral System</h4>
              </div>
              <span className="text-xs font-mono font-bold text-[#735c00] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{referralCode}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-1">
              <span>Friends Invited: <strong className="text-purple-700">14 Active</strong></span>
              <span>Earned Bonus: <strong className="text-emerald-600">28,000 Coins</strong></span>
            </div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="px-5 mt-4">
          <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgba(212,175,55,0.08)] border border-slate-100">
            <div onClick={() => onNavigate?.('wallet')} className="flex flex-col items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-orange-50 text-orange-500 text-2xl">
                👛
              </div>
              <span className="text-[11px] font-semibold text-[#1e1b18]">Wallet</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-purple-50 text-purple-500 text-2xl">
                🏪
              </div>
              <span className="text-[11px] font-semibold text-[#1e1b18]">Store</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-500 text-2xl">
                🛍️
              </div>
              <span className="text-[11px] font-semibold text-[#1e1b18]">Bag</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-transform">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 text-2xl">
                🎁
              </div>
              <span className="text-[11px] font-semibold text-[#1e1b18]">Reward</span>
            </div>
          </div>
        </section>

        {/* Menu List */}
        <section className="px-5 mt-4">
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(212,175,55,0.08)] border border-slate-100 divide-y divide-slate-100 overflow-hidden">
            {/* Family */}
            <div onClick={() => onNavigate?.('family')} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#735c00]/10 text-xl">
                  👨‍👩‍👧‍👦
                </div>
                <span className="text-sm font-semibold text-[#1e1b18]">Family Guild Hub</span>
              </div>
              <span className="text-slate-400 group-hover:translate-x-1 transition-transform">➔</span>
            </div>

            {/* Wallet Extra */}
            <div onClick={() => onNavigate?.('wallet')} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 text-xl">
                  🏦
                </div>
                <span className="text-sm font-semibold text-[#1e1b18]">Wallet & Transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#735c00]">1,450,000 Coins</span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">➔</span>
              </div>
            </div>
            {/* Help & Support Center */}
            <div onClick={() => onNavigate?.('helpsupport')} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-100 text-xl">
                  🛡️
                </div>
                <span className="text-sm font-semibold text-[#1e1b18]">Help & Support Center</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600">24/7 Support</span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">➔</span>
              </div>
            </div>

            {/* Help & Learning Center (CMS Guides) */}
            <div onClick={() => onNavigate?.('helpcenter')} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 text-xl">
                  📖
                </div>
                <span className="text-sm font-semibold text-[#1e1b18]">Help & Learning Center</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-600">Guides & FAQs</span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">➔</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* KYC VERIFICATION MODAL */}
      {showKycModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <form onSubmit={handleKycSubmit} className="w-full max-w-md bg-white rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#1e1b18]">🪪 Identity KYC Verification</h3>
              <button type="button" onClick={() => setShowKycModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">CNIC / Passport Number</label>
                <input type="text" required value={cnicNumber} onChange={e => setCnicNumber(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono" />
              </div>
              <div>
                <label className="text-slate-700 font-bold block mb-1">Upload Document Image</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center text-slate-500 cursor-pointer bg-slate-50">
                  📸 Tap to Capture Front CNIC Photo
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowKycModal(false)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs">Cancel</button>
              <button type="submit" className="flex-1 py-3 rounded-xl bg-[#735c00] text-white font-bold text-xs shadow-lg">Submit KYC</button>
            </div>
          </form>
        </div>
      )}

      {/* Luxury Visual Color Theme Modal */}
      <LuxuryThemeModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        currentTheme={selectedTheme}
        onSelectTheme={(t) => {
          setSelectedTheme(t);
          alert(`Visual Color Theme changed to ${t.toUpperCase()}!`);
        }}
      />

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </div>
  )
}

