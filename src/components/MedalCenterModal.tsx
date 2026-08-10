import React, { useState } from 'react';
import { 
  Award, Shield, Crown, Sparkles, Star, Gift, CheckCircle2, Lock, Flame, 
  Coins, Gem, Zap, Check, X, Filter, ChevronRight, RefreshCw, Trophy, Heart
} from 'lucide-react';
import { toast } from '../services/toastAndErrorService';

export type MedalRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface MedalItem {
  id: string;
  name: string;
  category: string;
  rarity: MedalRarity;
  icon: string;
  description: string;
  condition: string;
  unlocked: boolean;
  equipped: boolean;
  progress: number; // 0 to 100
  currentProgressText: string;
  rewardText: string;
  earnedDate?: string;
  colorGradient: string;
}

export const MEDALS_CATALOG: MedalItem[] = [
  { id: 'm1', name: '7-Day Check-in Legend', category: 'Login', rarity: 'Rare', icon: '📅', description: 'Log in to Aura Live for 7 consecutive days', condition: 'Login 7 Days', unlocked: true, equipped: false, progress: 100, currentProgressText: '7/7 Days', rewardText: '+500 Coins, Daily Badge', earnedDate: '2026-08-01', colorGradient: 'from-blue-500 to-indigo-600' },
  { id: 'm2', name: 'VIP 10 Imperial Crown', category: 'VIP', rarity: 'Mythic', icon: '👑', description: 'Reach VIP 10 Membership status in Aura Mall', condition: 'VIP 10 Purchase', unlocked: true, equipped: true, progress: 100, currentProgressText: 'VIP 10 Active', rewardText: 'Golden Entrance Car, 2x XP Boost', earnedDate: '2026-08-02', colorGradient: 'from-amber-400 via-yellow-500 to-amber-600' },
  { id: 'm3', name: 'PK Arena Undefeated Champion', category: 'PK Champion', rarity: 'Legendary', icon: '🔥', description: 'Win 50 1v1 PK Arena battles in a single week', condition: '50 PK Victories', unlocked: true, equipped: false, progress: 100, currentProgressText: '50/50 Wins', rewardText: 'PK Champion Frame, +5,000 Diamonds', earnedDate: '2026-08-03', colorGradient: 'from-red-500 via-rose-600 to-orange-500' },
  { id: 'm4', name: 'Millionaire Gifter', category: 'Top Gifter', rarity: 'Legendary', icon: '💎', description: 'Send 1,000,000+ total coins in luxury live gifts', condition: '1M Coins Gifted', unlocked: true, equipped: false, progress: 100, currentProgressText: '1.45M Coins', rewardText: 'Diamond Chat Bubble & Name Color', earnedDate: '2026-08-04', colorGradient: 'from-cyan-400 via-blue-500 to-indigo-600' },
  { id: 'm5', name: '100-Hour Star Host', category: 'Host', rarity: 'Epic', icon: '🎙️', description: 'Stream live audio broadcast for 100+ total hours', condition: '100 Stream Hours', unlocked: false, equipped: false, progress: 68, currentProgressText: '68/100 Hours', rewardText: 'Host Star Badge, +10,000 Diamonds', colorGradient: 'from-purple-500 to-fuchsia-600' },
  { id: 'm6', name: 'Royal Lions Family Founder', category: 'Family', rarity: 'Epic', icon: '🦁', description: 'Found or lead a Level 20+ Family Guild', condition: 'Family Level 20', unlocked: true, equipped: false, progress: 100, currentProgressText: 'Level 25 Clan', rewardText: 'Family Treasury Bonus', earnedDate: '2026-07-28', colorGradient: 'from-yellow-500 to-amber-600' },
  { id: 'm7', name: 'Agency Top Talent', category: 'Agency', rarity: 'Epic', icon: '🏢', description: 'Earn top streamer ranking in official agency roster', condition: 'Agency Top 3', unlocked: true, equipped: false, progress: 100, currentProgressText: 'Rank #1 in Agency', rewardText: 'Monthly Commission Boost', earnedDate: '2026-08-01', colorGradient: 'from-emerald-400 to-teal-600' },
  { id: 'm8', name: 'PK Tournament MVP 2026', category: 'Event', rarity: 'Mythic', icon: '🏆', description: 'Crown champion of the Aura Global Live Stream Festival', condition: 'Event Winner', unlocked: false, equipped: false, progress: 40, currentProgressText: '4,000 / 10,000 Event Pts', rewardText: 'Godlike Realm Entrance & Phantom Car', colorGradient: 'from-yellow-300 via-amber-500 to-rose-600' },
  { id: 'm9', name: '1-Year Anniversary Pioneer', category: 'Anniversary', rarity: 'Mythic', icon: '🎂', description: 'Registered user on Aura Live for over 365 days', condition: '1 Year Account', unlocked: false, equipped: false, progress: 85, currentProgressText: '310 / 365 Days', rewardText: 'Pioneer Badge & Exclusive Frame', colorGradient: 'from-violet-500 to-purple-800' },
  { id: 'm10', name: 'Top Earner Elite', category: 'Top Earner', rarity: 'Legendary', icon: '💵', description: 'Earn $10,000+ USD in monthly host diamond cashouts', condition: '$10k Cashout', unlocked: false, equipped: false, progress: 82, currentProgressText: '$8,200 / $10,000', rewardText: 'Elite Banker Badge & Cashout Priority', colorGradient: 'from-emerald-500 to-green-700' },
  { id: 'm11', name: 'Summer Festival Special 2026', category: 'Seasonal', rarity: 'Rare', icon: '☀️', description: 'Participate in Summer Live Festival events', condition: 'Summer Quest', unlocked: true, equipped: false, progress: 100, currentProgressText: 'Completed', rewardText: 'Summer Sunglasses Bubble', earnedDate: '2026-07-15', colorGradient: 'from-orange-400 to-amber-500' },
  { id: 'm12', name: 'Admin Honors Badge', category: 'Admin Exclusive', rarity: 'Mythic', icon: '🛡️', description: 'Granted exclusively by Aura Platform Executive Team', condition: 'Admin Grant', unlocked: false, equipped: false, progress: 0, currentProgressText: 'Admin Invitation Only', rewardText: 'Platform Official Verification Badge', colorGradient: 'from-[#FF007F] via-[#7928CA] to-[#00DFD8]' },
];

export interface MedalCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedalCenterModal: React.FC<MedalCenterModalProps> = ({
  isOpen,
  onClose
}) => {
  const [medals, setMedals] = useState<MedalItem[]>(MEDALS_CATALOG);
  const [filterTab, setFilterTab] = useState<'all' | 'unlocked' | 'equipped' | 'locked'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMedal, setSelectedMedal] = useState<MedalItem | null>(null);

  const categories = ['ALL', 'Login', 'VIP', 'PK Champion', 'Top Gifter', 'Host', 'Family', 'Agency', 'Event', 'Anniversary', 'Top Earner', 'Seasonal'];

  const filteredMedals = medals.filter((m) => {
    if (filterTab === 'unlocked' && !m.unlocked) return false;
    if (filterTab === 'equipped' && !m.equipped) return false;
    if (filterTab === 'locked' && m.unlocked) return false;
    if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
    return true;
  });

  const unlockedCount = medals.filter((m) => m.unlocked).length;
  const completionPercentage = Math.round((unlockedCount / medals.length) * 100);

  const handleEquipToggle = (medalId: string) => {
    setMedals((prev) =>
      prev.map((m) => {
        if (m.id === medalId) {
          const nextState = !m.equipped;
          if (nextState) {
            toast.success(`Equipped "${m.name}"! Badge now displays on Profile, Live Rooms & Chat.`);
          } else {
            toast.info(`Unequipped "${m.name}".`);
          }
          return { ...m, equipped: nextState };
        }
        return m;
      })
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#12141D] border border-[#2D3142] rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3142] bg-[#181B26]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-black font-extrabold shadow-lg shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                Medal & Achievement Center
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {completionPercentage}% Complete
                </span>
              </h3>
              <p className="text-xs text-gray-400">Unlock Medals, Equip Badges & Claim Exclusive Rewards</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completion Progress Bar Header */}
        <div className="bg-[#181B26] px-6 py-3 border-b border-[#2D3142] flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs text-gray-300 font-medium">
              <span>Collection Progress: <strong>{unlockedCount} / {medals.length} Medals Unlocked</strong></span>
              <span className="text-amber-400 font-bold font-mono">{completionPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#252A3B] rounded-full overflow-hidden border border-[#3A415A]">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-cyan-400 rounded-full transition-all duration-500" 
                style={{ width: `${completionPercentage}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 pt-3 pb-2 bg-[#141722] border-b border-[#2D3142]">
          
          {/* Main Filter Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                filterTab === 'all' ? 'bg-amber-500 text-black font-extrabold shadow-md' : 'text-gray-400 hover:text-white bg-[#1D2232]'
              }`}
            >
              All Medals ({medals.length})
            </button>
            <button
              onClick={() => setFilterTab('unlocked')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                filterTab === 'unlocked' ? 'bg-amber-500 text-black font-extrabold shadow-md' : 'text-gray-400 hover:text-white bg-[#1D2232]'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setFilterTab('equipped')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                filterTab === 'equipped' ? 'bg-amber-500 text-black font-extrabold shadow-md' : 'text-gray-400 hover:text-white bg-[#1D2232]'
              }`}
            >
              Equipped ({medals.filter(m => m.equipped).length})
            </button>
            <button
              onClick={() => setFilterTab('locked')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                filterTab === 'locked' ? 'bg-amber-500 text-black font-extrabold shadow-md' : 'text-gray-400 hover:text-white bg-[#1D2232]'
              }`}
            >
              Locked ({medals.length - unlockedCount})
            </button>
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#1D2232] border border-[#3A415A] text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Medals Showcase Grid */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedals.map((medal) => (
              <div
                key={medal.id}
                onClick={() => setSelectedMedal(medal)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-3 hover:scale-[1.02] ${
                  medal.unlocked
                    ? 'bg-[#181B26] border-[#2D3142] hover:border-amber-400/50 shadow-lg'
                    : 'bg-[#141620]/60 border-[#232736] opacity-75 grayscale-30'
                }`}
              >
                {/* Rarity & Equipped Badge Header */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    medal.rarity === 'Mythic' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' :
                    medal.rarity === 'Legendary' ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md' :
                    medal.rarity === 'Epic' ? 'bg-purple-600 text-white' :
                    medal.rarity === 'Rare' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {medal.rarity}
                  </span>

                  {medal.equipped && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Equipped
                    </span>
                  )}
                </div>

                {/* Icon & Details */}
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg bg-gradient-to-br ${medal.colorGradient}`}>
                    {medal.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs">{medal.name}</h4>
                    <span className="text-[10px] text-gray-400">{medal.category}</span>
                    <p className="text-[11px] text-gray-300 line-clamp-1 mt-0.5">{medal.description}</p>
                  </div>
                </div>

                {/* Progress / Earned Info */}
                {medal.unlocked ? (
                  <div className="flex items-center justify-between pt-2 border-t border-[#2D3142] text-[11px]">
                    <span className="text-gray-400">Earned: <strong className="text-white">{medal.earnedDate || 'Recent'}</strong></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEquipToggle(medal.id);
                      }}
                      className={`px-3 py-1 text-xs rounded-xl font-bold transition-transform active:scale-95 ${
                        medal.equipped
                          ? 'bg-[#252A3B] text-gray-300 hover:text-white border border-[#3A415A]'
                          : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold shadow-md'
                      }`}
                    >
                      {medal.equipped ? 'Unequip' : 'Equip Medal'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-2 border-t border-[#2D3142]">
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-amber-400" /> Progress:</span>
                      <span className="font-mono text-amber-400 font-bold">{medal.currentProgressText}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#252A3B] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: `${medal.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Medal Detail Modal Popup */}
        {selectedMedal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-[#181B26] border border-[#2D3142] rounded-3xl p-6 max-w-md w-full space-y-5 text-center relative shadow-2xl">
              <button 
                onClick={() => setSelectedMedal(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-5xl shadow-2xl bg-gradient-to-br ${selectedMedal.colorGradient} animate-bounce-slow`}>
                {selectedMedal.icon}
              </div>

              <div>
                <span className="text-xs bg-amber-500/20 text-amber-300 font-extrabold px-3 py-1 rounded-full border border-amber-500/30">
                  {selectedMedal.rarity} Medal
                </span>
                <h3 className="font-extrabold text-white text-lg mt-2">{selectedMedal.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{selectedMedal.description}</p>
              </div>

              <div className="bg-[#12141D] p-3.5 rounded-2xl border border-[#2D3142] text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Unlock Condition:</span>
                  <strong className="text-white">{selectedMedal.condition}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reward Grant:</span>
                  <strong className="text-amber-400 font-semibold">{selectedMedal.rewardText}</strong>
                </div>
                {selectedMedal.unlocked && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date Earned:</span>
                    <strong className="text-emerald-400">{selectedMedal.earnedDate}</strong>
                  </div>
                )}
              </div>

              {selectedMedal.unlocked ? (
                <button
                  onClick={() => {
                    handleEquipToggle(selectedMedal.id);
                    setSelectedMedal(null);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold text-sm rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  {selectedMedal.equipped ? 'Unequip Badge' : 'Equip Medal on Profile & Live Room'}
                </button>
              ) : (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs">
                  Complete condition to unlock this Medal & claim reward!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2D3142] bg-[#181B26]">
          <span className="text-xs text-gray-400">Equipped medals display on Profile, Audio/Video Room seats & Live Chat</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold bg-[#252A3B] hover:bg-[#32384D] text-white rounded-xl border border-[#3A415A] transition-colors"
          >
            Close Medal Center
          </button>
        </div>

      </div>
    </div>
  );
};
