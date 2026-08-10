import { useState, useEffect } from 'react'

interface Props {
  onLoginSuccess?: () => void
  onNavigateRegister?: () => void
}

export default function LoginScreen({ onLoginSuccess, onNavigateRegister }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [barHeights, setBarHeights] = useState<number[]>(Array(40).fill(6))

  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights(Array.from({ length: 40 }, () => Math.random() * 36 + 4))
    }, 150)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (onLoginSuccess) onLoginSuccess()
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#131314] text-[#e5e2e3] font-sans flex flex-col items-center justify-between relative overflow-hidden selection:bg-[#f2ca50] selection:text-[#3c2f00]">
      {/* TopAppBar */}
      <header className="w-full flex items-center justify-center h-16 fixed top-0 z-50 bg-transparent px-4">
        <div className="flex items-center gap-2">
          <span className="text-[#f2ca50] text-3xl">🌊</span>
          <h1 className="text-2xl font-bold text-[#f2ca50] tracking-tighter" style={{ fontFamily: 'Sora, sans-serif' }}>
            AURALIVE
          </h1>
        </div>
      </header>

      {/* Ambient Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-25 z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#f2ca50] blur-[120px]"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#1b4332] blur-[120px]"></div>
      </div>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12 w-full max-w-[480px] relative z-10">
        {/* Login Card */}
        <section className="w-full bg-[#1a1a1b]/60 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.15)]">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-[#353436] px-3.5 py-1 rounded-full mb-4 border border-[#4d4635] flex items-center gap-2">
              <span className="text-xs text-[#f2ca50]">🛡️</span>
              <span className="text-[10px] font-mono font-medium text-[#d0c5af] tracking-widest uppercase">SECURE LOGIN</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#e5e2e3] mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
              Welcome Back
            </h2>
            <p className="text-xs text-[#d0c5af]/80">Access your professional audio suite.</p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="group">
              <label className="text-[10px] font-mono font-bold text-[#d0c5af] block mb-1 tracking-wider uppercase group-focus-within:text-[#f2ca50] transition-colors">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <span className="absolute left-0 bottom-3 text-lg text-[#d0c5af]/50 group-focus-within:text-[#f2ca50] transition-colors">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-black/20 border-0 border-b-2 border-[#353436] pl-8 pr-3 py-2.5 text-sm text-[#e5e2e3] placeholder:text-[#d0c5af]/30 focus:outline-none focus:border-[#d4af37] transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-mono font-bold text-[#d0c5af] tracking-wider uppercase group-focus-within:text-[#f2ca50] transition-colors">
                  PASSWORD
                </label>
                <a href="#" className="text-[10px] font-mono text-[#f2ca50] hover:underline">FORGOT?</a>
              </div>
              <div className="relative">
                <span className="absolute left-0 bottom-3 text-lg text-[#d0c5af]/50 group-focus-within:text-[#f2ca50] transition-colors">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/20 border-0 border-b-2 border-[#353436] pl-8 pr-10 py-2.5 text-sm text-[#e5e2e3] placeholder:text-[#d0c5af]/30 focus:outline-none focus:border-[#d4af37] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-3 text-sm text-[#d0c5af]/60 hover:text-white transition-colors"
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1b4332] hover:bg-[#2a6d51] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all transform active:scale-95 shadow-lg shadow-[#1b4332]/30 text-sm"
            >
              {loading ? (
                <span className="animate-spin text-lg">🔄</span>
              ) : (
                <>
                  <span>Enter Suite</span>
                  <span>➔</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-1">
              <div className="h-[1px] flex-1 bg-[#353436]"></div>
              <span className="text-[10px] font-mono text-[#d0c5af]/70 tracking-widest">OR CONTINUE WITH</span>
              <div className="h-[1px] flex-1 bg-[#353436]"></div>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onLoginSuccess}
                className="flex items-center justify-center gap-2 border border-[#4d4635] py-2.5 rounded-xl hover:bg-[#2a2a2b] transition-colors text-xs font-mono font-bold text-[#e5e2e3]"
              >
                <span>🌐</span>
                <span>GOOGLE</span>
              </button>
              <button
                type="button"
                onClick={onLoginSuccess}
                className="flex items-center justify-center gap-2 border border-[#4d4635] py-2.5 rounded-xl hover:bg-[#2a2a2b] transition-colors text-xs font-mono font-bold text-[#e5e2e3]"
              >
                <span>🔑</span>
                <span>SSO</span>
              </button>
            </div>
          </form>

          {/* Footer Navigation */}
          <p className="text-center mt-8 text-xs text-[#d0c5af]">
            Don't have an account?{' '}
            <button onClick={onNavigateRegister} className="text-[#f2ca50] font-bold hover:underline ml-1">
              Request Access
            </button>
          </p>
        </section>

        {/* Dynamic Visualizer Bar Animation */}
        <div className="mt-10 w-full max-w-[480px] h-10 flex items-end justify-center gap-[3px] overflow-hidden pointer-events-none opacity-40">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="w-[2.5px] bg-[#f2ca50] rounded-t-full transition-all duration-150 ease-in-out"
              style={{ height: `${h}px`, opacity: h / 40 + 0.2 }}
            ></div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-col items-center gap-2 py-6 px-4 relative z-10 border-t border-white/5">
        <div className="flex gap-6 text-[10px] font-mono text-[#d0c5af]">
          <a href="#" className="hover:text-[#f2ca50] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#f2ca50] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#f2ca50] transition-colors">Help Center</a>
        </div>
        <p className="text-[10px] font-mono text-[#f2ca50]/60">© 2026 AURALIVE. PREMIUM AUDIO SUITE.</p>
      </footer>
    </div>
  )
}
