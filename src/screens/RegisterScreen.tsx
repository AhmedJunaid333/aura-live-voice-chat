import { useState } from 'react'

interface Props {
  onRegisterSuccess?: () => void
  onNavigateLogin?: () => void
}

export default function RegisterScreen({ onRegisterSuccess, onNavigateLogin }: Props) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (onRegisterSuccess) onRegisterSuccess()
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#0F0B1E] text-[#e8dfee] relative flex flex-col items-center font-sans overflow-x-hidden">
      {/* Background Atmospheric Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#7c3aed]/15 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-[#d2bbff]/10 blur-[80px] rounded-full"></div>
      </div>

      {/* Fixed TopAppBar */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 flex items-center px-4 h-16 bg-[#15121b]/80">
        <button
          onClick={onNavigateLogin}
          className="text-[#d2bbff] p-2 hover:opacity-80 transition-opacity active:scale-95 text-xl"
        >
          ‹
        </button>
        <h1 className="ml-2 font-semibold text-lg text-[#d2bbff]">Create Account</h1>
      </header>

      <main className="w-full max-w-md px-6 pt-24 pb-12 flex flex-col items-center relative z-10">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#7c3aed]/20 border border-[#d2bbff]/20 backdrop-blur-lg shadow-[0_0_20px_rgba(210,187,255,0.4)]">
            <span className="text-4xl text-[#d2bbff]">✨</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#d2bbff] tracking-tight mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Aura Live
          </h2>
          <p className="text-xs text-[#ccc3d8]/80 font-medium">Step into the digital spotlight.</p>
        </div>

        {/* Registration Form */}
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#ccc3d8] ml-1">Full Name</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#ccc3d8]/60">👤</span>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 text-white placeholder:text-[#ccc3d8]/40 text-sm focus:outline-none focus:border-[#d2bbff]/50 focus:bg-white/[0.07] focus:shadow-[0_0_15px_rgba(210,187,255,0.2)] transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#ccc3d8] ml-1">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#ccc3d8]/60">📧</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@aurora.live"
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 text-white placeholder:text-[#ccc3d8]/40 text-sm focus:outline-none focus:border-[#d2bbff]/50 focus:bg-white/[0.07] focus:shadow-[0_0_15px_rgba(210,187,255,0.2)] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#ccc3d8] ml-1">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#ccc3d8]/60">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 text-white placeholder:text-[#ccc3d8]/40 text-sm focus:outline-none focus:border-[#d2bbff]/50 focus:bg-white/[0.07] focus:shadow-[0_0_15px_rgba(210,187,255,0.2)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ccc3d8]/60 hover:text-[#d2bbff] transition-colors text-sm"
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#ccc3d8] ml-1">Phone Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#ccc3d8]/60">📱</span>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 text-white placeholder:text-[#ccc3d8]/40 text-sm focus:outline-none focus:border-[#d2bbff]/50 focus:bg-white/[0.07] focus:shadow-[0_0_15px_rgba(210,187,255,0.2)] transition-all"
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl mt-4 bg-gradient-to-r from-[#7c3aed] to-[#d2bbff] text-[#3f008e] font-extrabold text-sm shadow-[0_4px_20px_rgba(124,58,237,0.4)] hover:shadow-[0_8px_30px_rgba(124,58,237,0.6)] hover:-translate-y-0.5 active:scale-96 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <span className="animate-spin text-xl">🔄</span>
            ) : (
              <>
                <span>Sign Up</span>
                <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </>
            )}
          </button>
        </form>

        {/* Social Signup Section */}
        <div className="w-full mt-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
            <span className="text-[10px] font-bold text-[#ccc3d8]/70 uppercase tracking-widest">Or continue with</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onRegisterSuccess}
              className="h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all text-white font-semibold text-sm"
            >
              <span className="text-xl">🌐</span>
              <span>Google</span>
            </button>
            <button
              onClick={onRegisterSuccess}
              className="h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all text-white font-semibold text-sm"
            >
              <span className="text-xl">🍏</span>
              <span>Apple</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#ccc3d8]">
            Already have an account?{' '}
            <button onClick={onNavigateLogin} className="text-[#d2bbff] font-bold hover:underline ml-1">
              Log In
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}
