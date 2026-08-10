import { useState, useEffect, useRef } from 'react'

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return val
}

const transactions = [
  { id: 1, type: 'earn', label: 'Gift received from StarGazer', amount: '+199', icon: '💎', time: '2m ago', color: '#34d399' },
  { id: 2, type: 'spend', label: 'Sent Galaxy to Luna', amount: '-999', icon: '🌌', time: '15m ago', color: '#f87171' },
  { id: 3, type: 'earn', label: 'Weekly bonus reward', amount: '+500', icon: '🎁', time: '1h ago', color: '#34d399' },
  { id: 4, type: 'earn', label: 'Gift received from VIP_King', amount: '+99', icon: '👑', time: '2h ago', color: '#34d399' },
  { id: 5, type: 'spend', label: 'Purchased 1000 coins', amount: '-4.99', icon: '🪙', time: 'Yesterday', color: '#f59e0b' },
]

const packs = [
  { coins: 100, price: '$0.99', bonus: '' },
  { coins: 500, price: '$3.99', bonus: '+50 bonus' },
  { coins: 1200, price: '$7.99', bonus: '+200 bonus', popular: true },
  { coins: 2500, price: '$14.99', bonus: '+500 bonus' },
  { coins: 6000, price: '$29.99', bonus: '+1500 bonus' },
  { coins: 15000, price: '$69.99', bonus: '+5000 bonus' },
]

export default function WalletScreen() {
  const coins = useCountUp(12480)
  const diamonds = useCountUp(3240)
  const [showRecharge, setShowRecharge] = useState(false)
  const [recharged, setRecharged] = useState<number | null>(null)

  const handleRecharge = (pack: typeof packs[0]) => {
    setRecharged(pack.coins)
    setTimeout(() => setRecharged(null), 2000)
    setShowRecharge(false)
  }

  return (
    <div className="screen overflow-y-auto" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div className="px-4 pt-10 pb-3">
        <h2 className="text-xl font-extrabold" style={{ fontFamily: 'Plus Jakarta Sans', animation: 'fadeInUp 0.4s ease both' }}>Wallet</h2>
      </div>

      {/* Balance card */}
      <div className="mx-4 rounded-3xl overflow-hidden" style={{ animation: 'fadeInScale 0.5s 0.1s ease both', background: 'linear-gradient(135deg, #3b0764, #1e1b4b, #0f172a)', border: '1px solid rgba(139,92,246,0.3)' }}>
        <div className="px-5 pt-5 pb-4">
          <p className="text-violet-300/60 text-xs font-medium tracking-widest uppercase mb-3">Your Balance</p>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🪙</span>
                <span className="text-4xl font-extrabold text-white" style={{ fontFamily: 'Plus Jakarta Sans', fontVariantNumeric: 'tabular-nums' }}>
                  {coins.toLocaleString()}
                </span>
              </div>
              <p className="text-white/50 text-xs ml-10">Coins</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">💎</span>
                <span className="text-2xl font-extrabold" style={{ fontFamily: 'Plus Jakarta Sans', fontVariantNumeric: 'tabular-nums', color: '#60a5fa' }}>
                  {diamonds.toLocaleString()}
                </span>
              </div>
              <p className="text-white/50 text-xs mr-1">Diamonds</p>
            </div>
          </div>
        </div>
        <div className="flex border-t border-white/10">
          <button
            onClick={() => setShowRecharge(true)}
            className="flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2"
            style={{ color: '#a78bfa' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" /></svg>
            Recharge
          </button>
          <div className="w-px bg-white/10" />
          <button className="flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2" style={{ color: '#60a5fa' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 13V3M3 8l5 5 5-5" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Withdraw
          </button>
        </div>
      </div>

      {/* Recharge success animation */}
      {recharged && (
        <div className="mx-4 mt-3 rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', animation: 'fadeInScale 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-green-400 font-bold text-sm">Recharge successful!</p>
            <p className="text-white/60 text-xs">+{recharged.toLocaleString()} coins added</p>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-2" style={{ animation: 'fadeInUp 0.4s 0.2s ease both' }}>
        {[
          { label: 'Gifts Sent', value: '284', icon: '🎁' },
          { label: 'Gifts Recv', value: '1,042', icon: '💝' },
          { label: 'Top Up', value: '$49.90', icon: '💳' },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl p-3 text-center" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>{stat.value}</div>
            <div className="text-white/40 text-[10px]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="mx-4 mt-5" style={{ animation: 'fadeInUp 0.4s 0.3s ease both' }}>
        <h3 className="font-bold text-sm mb-3" style={{ fontFamily: 'Plus Jakarta Sans' }}>Recent Activity</h3>
        <div className="space-y-2">
          {transactions.map((tx, i) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 rounded-2xl px-3 py-3"
              style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.1)', animation: `fadeInUp 0.3s ${0.35 + i * 0.05}s ease both` }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-none" style={{ background: 'rgba(139,92,246,0.15)' }}>
                {tx.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{tx.label}</p>
                <p className="text-white/40 text-[11px] mt-0.5">{tx.time}</p>
              </div>
              <span className="font-bold text-sm flex-none" style={{ color: tx.color, fontVariantNumeric: 'tabular-nums' }}>{tx.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recharge sheet */}
      {showRecharge && (
        <div className="absolute inset-0 z-40" onClick={() => setShowRecharge(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl px-4 pt-4 pb-8"
            style={{
              background: 'linear-gradient(180deg, #1a0f2e, #13092a)',
              border: '1px solid rgba(139,92,246,0.3)',
              animation: 'slideInBottom 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />
            <h4 className="text-white font-bold text-base mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>🪙 Recharge Coins</h4>
            <div className="grid grid-cols-2 gap-2">
              {packs.map((pack, i) => (
                <button
                  key={pack.coins}
                  onClick={() => handleRecharge(pack)}
                  className="relative rounded-2xl p-3 text-left transition-all active:scale-95"
                  style={{
                    background: pack.popular ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(168,85,247,0.2))' : 'rgba(139,92,246,0.08)',
                    border: pack.popular ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(139,92,246,0.15)',
                    animation: `fadeInScale 0.3s ${i * 0.04}s ease both`,
                  }}
                >
                  {pack.popular && (
                    <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'linear-gradient(135deg, #f59e0b, #fcd34d)', color: '#0a0612' }}>HOT</span>
                  )}
                  <div className="text-2xl mb-1">🪙</div>
                  <div className="text-white font-bold text-sm">{pack.coins.toLocaleString()}</div>
                  {pack.bonus && <div className="text-green-400 text-[10px] font-medium">{pack.bonus}</div>}
                  <div className="text-amber-400 font-bold text-sm mt-1">{pack.price}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
