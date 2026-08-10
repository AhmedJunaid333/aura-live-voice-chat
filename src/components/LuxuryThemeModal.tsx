import { useState } from 'react'

export interface ThemeOption {
  id: string
  name: string
  gradient: string
  borderColor: string
  textColor: string
}

export const themeOptions: ThemeOption[] = [
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    gradient: 'bg-gradient-to-r from-[#d97706] via-[#ca8a04] to-[#b45309]',
    borderColor: 'border-2 border-white',
    textColor: 'text-white',
  },
  {
    id: 'neon',
    name: 'Neon',
    gradient: 'bg-gradient-to-r from-[#00c6ff] via-[#0072ff] to-[#8b5cf6]',
    borderColor: 'border border-white/20',
    textColor: 'text-white',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    gradient: 'bg-gradient-to-r from-[#3b0764] via-[#581c87] to-[#7e22ce]',
    borderColor: 'border border-white/20',
    textColor: 'text-white',
  },
  {
    id: 'cyber',
    name: 'Cyber',
    gradient: 'bg-gradient-to-r from-[#c026d3] via-[#d946ef] to-[#7c3aed]',
    borderColor: 'border border-white/20',
    textColor: 'text-white',
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    gradient: 'bg-gradient-to-r from-[#00f2fe] via-[#06b6d4] to-[#0284c7]',
    borderColor: 'border border-white/20',
    textColor: 'text-white',
  },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  currentTheme?: string
  onSelectTheme?: (themeId: string) => void
}

export default function LuxuryThemeModal({ isOpen, onClose, currentTheme = 'royal-gold', onSelectTheme }: Props) {
  const [selected, setSelected] = useState(currentTheme)

  if (!isOpen) return null

  const handleSelect = (id: string) => {
    setSelected(id)
    if (onSelectTheme) onSelectTheme(id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-[#08040f] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl relative">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-300 font-medium">Select your luxury visual color theme</span>
          <button onClick={onClose} className="text-slate-400 font-bold hover:text-white text-sm p-1">✕</button>
        </div>

        <div className="space-y-3 pt-1">
          {themeOptions.map(t => {
            const isSelected = selected === t.id
            return (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className={`w-full py-4 px-6 rounded-2xl flex items-center justify-between transition-all duration-200 active:scale-[0.98] shadow-lg ${t.gradient} ${
                  isSelected ? 'border-2 border-white ring-2 ring-amber-400/50 scale-[1.02]' : 'border border-white/20 opacity-90 hover:opacity-100'
                }`}
              >
                <span className="font-bold text-base text-white tracking-wide">{t.name}</span>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-amber-600 font-bold text-xs shadow-md">
                    ✓
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
