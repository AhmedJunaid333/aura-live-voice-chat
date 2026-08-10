import React, { useState, useEffect } from 'react';
import { 
  Globe, Languages, RefreshCw, CheckCircle2, Edit3, Save, 
  Search, ShieldAlert, Sparkles, Check 
} from 'lucide-react';
import { 
  languageEngine, SupportedLanguage, TRANSLATION_DICTIONARIES 
} from '../services/languageService';
import { toast } from '../services/toastAndErrorService';

export const LanguageManagementSection: React.FC = () => {
  const [languages, setLanguages] = useState<SupportedLanguage[]>(() => 
    languageEngine.getSupportedLanguages()
  );
  const [selectedLangCode, setSelectedLangCode] = useState('ur');
  const [searchKey, setSearchKey] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const sync = () => {
      setLanguages(languageEngine.getSupportedLanguages());
    };
    sync();
    const unsub = languageEngine.subscribe(sync);
    return () => unsub();
  }, []);

  const handleToggleStatus = (code: string) => {
    const isNowEnabled = languageEngine.toggleLanguageEnabled(code);
    toast.success(`Language ${code.toUpperCase()} is now ${isNowEnabled ? 'Enabled' : 'Disabled'}.`);
  };

  const handleSaveTranslation = (key: string) => {
    if (!editValue.trim()) return;
    languageEngine.updateTranslation(selectedLangCode, key, editValue.trim());
    toast.success(`Updated [${key}] translation for ${selectedLangCode.toUpperCase()}.`);
    setEditingKey(null);
    setEditValue('');
  };

  const currentDict = TRANSLATION_DICTIONARIES[selectedLangCode] || {};
  const enDict = TRANSLATION_DICTIONARIES['en'] || {};

  const filteredKeys = Object.keys(enDict).filter(k => {
    if (!searchKey.trim()) return true;
    const q = searchKey.toLowerCase();
    return k.toLowerCase().includes(q) || (enDict[k] || '').toLowerCase().includes(q) || (currentDict[k] || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fadeIn select-none text-white text-xs">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
              Global Localization & RTL Governance
            </span>
            <span className="text-xs text-slate-400 font-mono">Multi-Language Engine</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Localization, Languages & Translation Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage supported app languages, configure RTL text directions, publish dynamic translations, and review coverage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success('Translation dictionaries synchronized.')}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 text-xs font-bold border border-indigo-800/40 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Dictionaries
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#11162B] border border-indigo-900/30">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supported Languages</span>
          <p className="text-2xl font-black text-white mt-1">{languages.length}</p>
          <span className="text-[10px] text-emerald-400 font-bold">8 Live Locales</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-cyan-900/30">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">RTL Locales</span>
          <p className="text-2xl font-black text-cyan-300 mt-1">2 (Urdu, Arabic)</p>
          <span className="text-[10px] text-cyan-400/80">Bi-directional layout active</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-amber-900/30">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Translation Keys</span>
          <p className="text-2xl font-black text-amber-300 mt-1">{Object.keys(enDict).length}</p>
          <span className="text-[10px] text-amber-400/80">Covering all screens</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-emerald-900/30">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Default Locale</span>
          <p className="text-2xl font-black text-emerald-300 mt-1">en_US</p>
          <span className="text-[10px] text-slate-400">English fallback enabled</span>
        </div>
      </div>

      {/* Languages Status Table */}
      <div className="bg-[#11162B] rounded-3xl border border-indigo-900/30 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-indigo-900/30 flex items-center justify-between">
          <span className="font-bold text-white text-sm">Supported Languages & Layout Direction</span>
          <span className="text-[10px] text-slate-400 font-mono">Platform Locales</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-slate-400 font-bold border-b border-indigo-900/30">
              <tr>
                <th className="p-4">Flag & Code</th>
                <th className="p-4">Language Name</th>
                <th className="p-4">Native Label</th>
                <th className="p-4">Direction</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-900/20">
              {languages.map(lang => (
                <tr key={lang.code} className="hover:bg-indigo-950/20 transition-colors">
                  <td className="p-4 font-mono font-bold text-indigo-300">
                    <span className="text-base mr-2">{lang.flag}</span>
                    {lang.code.toUpperCase()} ({lang.locale})
                  </td>
                  <td className="p-4 font-bold text-white">
                    {lang.name}
                  </td>
                  <td className="p-4 text-purple-300 font-bold">
                    {lang.nativeName}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lang.direction === 'rtl' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40' : 'bg-indigo-950 text-indigo-300'
                    }`}>
                      {lang.direction.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lang.isEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {lang.isEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(lang.code)}
                      disabled={lang.code === 'en'}
                      className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 font-bold text-xs border border-indigo-800/40 transition cursor-pointer disabled:opacity-40"
                    >
                      {lang.isEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Translation Dictionary Editor */}
      <div className="bg-[#11162B] rounded-3xl border border-indigo-900/30 overflow-hidden shadow-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-indigo-900/30 pb-3">
          <div>
            <h3 className="font-extrabold text-white text-base">Translation Keys & String Management</h3>
            <p className="text-[11px] text-slate-400">Edit and publish string translations in real-time.</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedLangCode}
              onChange={e => setSelectedLangCode(e.target.value)}
              className="text-xs p-2 rounded-xl bg-black/40 border border-indigo-900/40 text-white font-bold"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.nativeName})
                </option>
              ))}
            </select>

            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search keys..."
                value={searchKey}
                onChange={e => setSearchKey(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-indigo-900/40 text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
          {filteredKeys.map(k => {
            const enVal = enDict[k];
            const currentVal = currentDict[k] || enVal;
            const isEditing = editingKey === k;

            return (
              <div key={k} className="p-3 rounded-2xl bg-black/40 border border-indigo-900/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] font-bold text-indigo-400">{k}</span>
                  <p className="text-slate-400 text-[11px]">EN: "{enVal}"</p>
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="mt-1 w-full text-xs p-1.5 rounded-lg bg-[#140D24] border border-purple-500 text-white font-bold"
                    />
                  ) : (
                    <p className="text-purple-300 font-bold text-xs mt-0.5">
                      {selectedLangCode.toUpperCase()}: "{currentVal}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isEditing ? (
                    <button
                      onClick={() => handleSaveTranslation(k)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingKey(k);
                        setEditValue(currentVal);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 font-bold text-xs border border-purple-800/40 flex items-center gap-1 transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
