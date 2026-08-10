import { useState } from 'react'

interface Props {
  onBack?: () => void
}

const privileges = [
  {
    title: 'Unique Entry Effect',
    description: 'Dazzle everyone with a custom aurora animation when you join any room.',
    icon: '✨',
    color: 'text-[#d2bbff]',
    bgColor: 'bg-[#7c3aed]/10',
  },
  {
    title: 'Golden Name',
    description: 'Stand out in every chat with a shimmering gold username and VIP badge.',
    icon: '✒️',
    color: 'text-[#ffb2b8]',
    bgColor: 'bg-[#ffb2b8]/10',
  },
  {
    title: 'Exclusive Gifts',
    description: 'Access VIP-only animated 3D gifts that give 2x support points.',
    icon: '🎁',
    color: 'text-[#ddb7ff]',
    bgColor: 'bg-[#ddb7ff]/10',
  },
  {
    title: 'Hidden Profile',
    description: 'Browse streams invisibly and hide your online status from followers.',
    icon: '👁️‍🗨️',
    color: 'text-[#7c3aed]',
    bgColor: 'bg-[#7c3aed]/20',
  },
]

const plans = [
  { id: '12m', title: '12 Months', price: '9,999', unit: 'Diamonds/Year', popular: true },
  { id: '3m', title: '3 Months', price: '2,999', unit: 'Diamonds/Quarter', popular: false },
  { id: '1m', title: '1 Month', price: '1,199', unit: 'Diamonds/Month', popular: false },
]

export default function VipScreen({ onBack }: Props) {
  const [selectedPlan, setSelectedPlan] = useState('12m')
  const [isJoined, setIsJoined] = useState(false)

  return (
    <div className="min-h-screen pb-32 text-[#e8dfee] bg-[#0F0B1E] relative overflow-hidden">
      {/* Aurora Background Emitters */}
      <div className="fixed inset-0 pointer-events-none z-0 blur-[100px] opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7c3aed] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#6f00be] rounded-full mix-blend-screen"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c61f47] rounded-full mix-blend-screen opacity-20"></div>
      </div>

      {/* Top App Bar */}
      <header className="flex justify-between items-center w-full px-4 py-3 fixed top-0 z-50 backdrop-blur-xl" style={{ background: 'linear-gradient(180deg, #0F0B1E 70%, transparent)' }}>
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 hover:opacity-80 transition-opacity active:scale-95 text-[#d2bbff]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-2xl font-bold text-[#d2bbff] tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Aura VIP
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-[#2c2833] px-4 py-2 rounded-full border border-white/5">
          <span className="text-[#ffb2b8] text-sm">💎</span>
          <span className="font-semibold text-xs text-[#d2bbff]">1.2k Diamonds</span>
        </div>
      </header>

      <main className="px-4 pt-20 pb-32 max-w-2xl mx-auto relative z-10 space-y-8">
        {/* VIP Hero Holographic Card */}
        <section className="animate-bounce-subtle">
          <div
            className="rounded-[32px] p-8 min-h-[220px] flex flex-col justify-between relative border border-white/30 shadow-[0_0_30px_rgba(210,187,255,0.2)] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(210, 187, 255, 0.2) 0%, rgba(111, 0, 190, 0.2) 50%, rgba(255, 218, 219, 0.2) 100%)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-300 text-sm">👑</span>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">Premium Member</span>
                </div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">Aura Elite</h2>
              </div>
              <div className="w-16 h-16 rounded-full border-2 border-[#ffb2b8] p-1 overflow-hidden">
                <img
                  className="w-full h-full object-cover rounded-full"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format"
                  alt="Aura Elite Avatar"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between items-end">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#0F0B1E] bg-white/10 backdrop-blur-md flex items-center justify-center text-xs text-white">⭐</div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0F0B1E] bg-white/10 backdrop-blur-md flex items-center justify-center text-xs text-white">⚡</div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0F0B1E] bg-white/10 backdrop-blur-md flex items-center justify-center text-xs text-white">🛡️</div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0F0B1E] bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-white">+5</div>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs mb-0.5">Membership Status</p>
                <p className="text-white font-bold text-sm">{isJoined ? 'Active (VIP Level 5)' : '24 Dec 2026'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-[#e8dfee] px-1">Elite Privileges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {privileges.map(p => (
              <div
                key={p.title}
                className="bg-white/[0.03] backdrop-blur-2xl border border-white/15 rounded-2xl p-5 flex gap-4 items-center hover:bg-white/[0.08] transition-all cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-2xl ${p.bgColor} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0`}>
                  {p.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">{p.title}</h4>
                  <p className="text-xs text-[#ccc3d8] leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subscription Options */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-[#e8dfee] px-1">Choose Your Plan</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {plans.map(plan => {
              const isSelected = selectedPlan === plan.id
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`min-w-[160px] flex-1 bg-white/[0.03] backdrop-blur-2xl rounded-2xl p-5 flex flex-col items-center text-center cursor-pointer transition-all border ${
                    isSelected ? 'border-2 border-[#d2bbff] shadow-[0_0_15px_rgba(210,187,255,0.4)]' : 'border-white/15 opacity-70'
                  }`}
                >
                  <span className={`text-[10px] font-bold mb-2 ${plan.popular ? 'text-[#d2bbff]' : 'opacity-0'}`}>
                    MOST POPULAR
                  </span>
                  <p className="text-sm font-semibold text-white">{plan.title}</p>
                  <p className="text-2xl font-extrabold text-[#d2bbff] my-2">{plan.price}</p>
                  <p className="text-[10px] text-[#958da1]">{plan.unit}</p>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* Fixed Bottom Action CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0F0B1E] via-[#0F0B1E]/90 to-transparent z-50">
        <button
          onClick={() => setIsJoined(true)}
          className="w-full max-w-md mx-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] text-purple-950 font-bold text-base py-4 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
        >
          <span>⭐</span>
          <span>{isJoined ? 'VIP Active — Enjoy Privileges!' : 'Join VIP Now'}</span>
          <span>›</span>
        </button>
      </div>
    </div>
  )
}
