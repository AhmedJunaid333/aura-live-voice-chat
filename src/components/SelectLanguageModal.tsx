import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Check, Globe, RefreshCw, Sparkles, CheckCircle2 
} from 'lucide-react';
import { 
  languageEngine, SupportedLanguage, t 
} from '../services/languageService';
import { toast } from '../services/toastAndErrorService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SelectLanguageModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [currentCode, setCurrentCode] = useState<string>(() => languageEngine.getCurrentLanguageCode());
  const [languages, setLanguages] = useState<SupportedLanguage[]>(() => languageEngine.getSupportedLanguages());

  useEffect(() => {
    const sync = () => {
      setCurrentCode(languageEngine.getCurrentLanguageCode());
      setLanguages(languageEngine.getSupportedLanguages());
    };
    sync();
    const unsub = languageEngine.subscribe(sync);
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    if (!lang.isEnabled) {
      toast.info(`${lang.name} is temporarily undergoing maintenance.`);
      return;
    }
    languageEngine.setLanguage(lang.code);
    toast.success(t('language.changed_success', { language: lang.nativeName }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08040F] text-white flex flex-col animate-fadeIn select-none overflow-y-auto custom-scrollbar">
      
      {/* ── 1. TOP APP BAR ── */}
      <header className="sticky top-0 z-40 px-4 py-3.5 bg-[#120A24]/95 backdrop-blur-xl border-b border-purple-900/30 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-purple-950/60 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-white tracking-wide">
            {t('language.select_title')}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => toast.success('Language preferences synchronized.')}
            className="p-2 rounded-full hover:bg-purple-950/60 text-purple-300 hover:text-white transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── 2. APP LANGUAGES LIST (MATCHING SCREENSHOT) ── */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4 pb-20">
        
        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t('language.app_languages')}
          </span>
          <span className="text-[10px] text-purple-300 font-mono">
            {languages.filter(l => l.isEnabled).length} Available
          </span>
        </div>

        {/* Language Cards */}
        <div className="space-y-2.5">
          {languages.map(lang => {
            const isSelected = currentCode === lang.code;

            return (
              <div
                key={lang.code}
                onClick={() => handleSelectLanguage(lang)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer shadow-lg active:scale-[0.99] ${
                  isSelected
                    ? 'bg-[#1C1631] border-[#D4AF37]/80 ring-1 ring-[#D4AF37]/50 shadow-purple-950/50'
                    : 'bg-[#140D24]/80 hover:bg-[#1C1631]/60 border-purple-900/30'
                }`}
              >
                {/* Language Info */}
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl flex-shrink-0">{lang.flag}</span>
                  <div>
                    <h3 className={`text-sm font-bold ${isSelected ? 'text-white font-extrabold' : 'text-slate-200'}`}>
                      {lang.nativeName}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {lang.name}
                    </p>
                  </div>
                </div>

                {/* Golden Selection Checkmark Icon */}
                <div className="flex items-center gap-2">
                  {lang.direction === 'rtl' && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 text-[9px] font-bold border border-purple-700/30">
                      RTL
                    </span>
                  )}
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-md animate-scaleUp">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Informative Card */}
        <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-900/30 text-slate-300 text-[11px] space-y-1">
          <p className="font-bold text-purple-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            Real-Time Layout Synchronization
          </p>
          <p className="text-[10px] text-slate-400">
            {t('language.restart_notice')}
          </p>
        </div>

      </main>

    </div>
  );
};
