import { useState, useRef } from 'react'

interface Props {
  onVerifySuccess?: () => void
  onBack?: () => void
}

export default function VerificationScreen({ onVerifySuccess, onBack }: Props) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(45)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) text = text[text.length - 1]
    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)

    // Auto-focus next input
    if (text !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onVerifySuccess) onVerifySuccess()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-[#0F0B1E] text-[#e8dfee] overflow-hidden font-sans">
      {/* Atmospheric Background Layers */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-24 w-[600px] h-[600px] bg-[#7c3aed]/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 -right-24 w-[500px] h-[500px] bg-[#6f00be]/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '-5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#c61f47]/10 rounded-full blur-[80px]"></div>
      </div>

      {/* Main Content Canvas */}
      <main className="relative z-10 w-full max-w-[420px]">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 hover:bg-white/10 transition-colors"
        >
          ‹
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative group cursor-default mb-4">
            <div className="absolute inset-0 bg-[#d2bbff] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="w-20 h-20 bg-white/[0.03] backdrop-blur-2xl border border-[#d2bbff]/30 rounded-3xl flex items-center justify-center relative z-10 shadow-xl">
              <span className="text-4xl text-[#d2bbff] animate-pulse">📩</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-[#d2bbff] tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Verification Code
          </h1>
          <p className="text-xs text-[#ccc3d8]/80 mt-1.5 font-medium px-4">
            We sent a 6-digit code to your contact details. Please enter it below.
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-[#1b1633]/40 backdrop-blur-2xl rounded-[32px] p-7 border border-white/15 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d2bbff]/50 to-transparent"></div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 6-Digit OTP Boxes */}
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(e.target.value, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className="w-12 h-14 rounded-2xl bg-white/[0.05] border border-white/15 text-center text-xl font-bold text-[#d2bbff] focus:outline-none focus:border-[#d2bbff] focus:bg-white/10 focus:shadow-[0_0_15px_rgba(210,187,255,0.3)] transition-all"
                />
              ))}
            </div>

            {/* Resend Code Timer */}
            <div className="text-center">
              {timer > 0 ? (
                <p className="text-xs text-[#ccc3d8]">
                  Resend code in <span className="text-[#d2bbff] font-bold">0:{timer < 10 ? `0${timer}` : timer}</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(45)}
                  className="text-xs text-[#d2bbff] font-bold hover:underline"
                >
                  Resend Code Now
                </button>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#6f00be] text-white font-bold text-sm shadow-[0_0_15px_rgba(210,187,255,0.3)] hover:shadow-[0_0_25px_rgba(210,187,255,0.5)] transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>Verify & Proceed</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
