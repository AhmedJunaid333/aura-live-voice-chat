import React, { useState } from 'react';
import { 
  Heart, Users, Shield, Award, Sparkles, Star, Gift, MessageCircle, Video, Phone,
  Flame, Crown, Check, X, Send, UserCheck, Plus, ChevronRight, Lock
} from 'lucide-react';
import { toast } from '../services/toastAndErrorService';

export interface RelationshipCardType {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  badge: string;
  description: string;
}

export const RELATIONSHIP_TYPES: RelationshipCardType[] = [
  { id: 'cp', name: 'Couple (CP) Card', category: 'Romantic', icon: '❤️', color: 'from-pink-500 to-rose-600', badge: 'Royal Crown', description: 'Intimate CP bond with anniversary counter & couple vehicle' },
  { id: 'best_friend', name: 'Best Friend Card', category: 'Friendship', icon: '⭐', color: 'from-amber-400 to-yellow-600', badge: 'Golden Stars', description: 'Shared chat shortcut, friendship anniversary & rewards' },
  { id: 'brother', name: 'Brother Card', category: 'Family', icon: '🛡️', color: 'from-blue-500 to-cyan-600', badge: 'Shield Partner', description: 'Brother tasks, mutual protection & joint rewards' },
  { id: 'sister', name: 'Sister Card', category: 'Family', icon: '🌸', color: 'from-fuchsia-400 to-pink-500', badge: 'Blossom Bond', description: 'Sister exclusive badge & daily interaction points' },
  { id: 'brother_sister', name: 'Brother & Sister Card', category: 'Family', icon: '👫', color: 'from-purple-500 to-indigo-600', badge: 'Sibling Harmony', description: 'Joint missions, shared rewards & anniversary counter' },
  { id: 'siblings', name: 'Siblings Card', category: 'Family', icon: '👨‍👩‍👧‍👦', color: 'from-emerald-400 to-teal-600', badge: 'Family Clan', description: 'Group ranking, shared family badge & group rewards' },
  { id: 'soulmate', name: 'Soulmate Card', category: 'Special', icon: '✨', color: 'from-violet-500 to-purple-700', badge: 'Cosmic Soul', description: 'Deep emotional connection & cosmic profile aura' },
  { id: 'mentor', name: 'Mentor Card', category: 'Guide', icon: '🎓', color: 'from-amber-500 to-orange-600', badge: 'Master Guide', description: 'Host coaching, XP boost & mentor commission' },
  { id: 'student', name: 'Student Card', category: 'Guide', icon: '📚', color: 'from-sky-400 to-blue-600', badge: 'Apprentice', description: 'Learning path, daily guidance & student milestone rewards' },
  { id: 'family_partner', name: 'Family Partner Card', category: 'Guild', icon: '🏰', color: 'from-indigo-500 to-blue-700', badge: 'Guild Officer', description: 'Family treasury bonus & co-leader privileges' },
  { id: 'gaming_partner', name: 'Gaming Partner Card', category: 'Gaming', icon: '🎮', color: 'from-[#00F5D4] to-[#00BBF9]', badge: 'Ludo Ace', description: 'PK battle team multiplier & gaming room perks' },
  { id: 'vip_partner', name: 'VIP Partner Card', category: 'Luxury', icon: '👑', color: 'from-yellow-400 to-amber-500', badge: 'Noble VIP', description: 'Dual VIP vehicle entrance & golden chat bubble' },
  { id: 'best_supporter', name: 'Best Supporter Card', category: 'Revenue', icon: '💎', color: 'from-cyan-400 to-blue-500', badge: 'Diamond Sponsor', description: 'Top gift contributor badge & host room priority seat' },
  { id: 'top_fan', name: 'Top Fan Card', category: 'Fan', icon: '🔥', color: 'from-red-500 to-orange-500', badge: 'Super Fan', description: 'Fan club priority, exclusive emoji & fan leaderboard' },
  { id: 'team_mate', name: 'Team Mate Card', category: 'PK', icon: '⚔️', color: 'from-rose-500 to-purple-600', badge: 'PK Vanguard', description: '3v3 Team PK arena bonus & battle stats' },
  { id: 'custom', name: 'Custom Relationship Card', category: 'Custom', icon: '🎨', color: 'from-[#FF007F] to-[#7928CA]', badge: 'Unique Bond', description: 'Create custom relationship title & personalized frame' },
];

export interface RelationshipCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RelationshipCenterModal: React.FC<RelationshipCenterModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'my_bonds' | 'requests'>('cards');
  const [selectedCard, setSelectedCard] = useState<RelationshipCardType>(RELATIONSHIP_TYPES[0]);
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // Mock Active Bonds State
  const [activeBonds, setActiveBonds] = useState([
    { id: 'bond_1', type: 'cp', partnerName: 'Aura Princess', partnerId: 'AU100088', level: 5, xp: 4250, badge: 'Royal Crown', days: 120 },
    { id: 'bond_2', type: 'best_friend', partnerName: 'Gamer Pro', partnerId: 'AU100042', level: 3, xp: 1800, badge: 'Golden Stars', days: 45 },
  ]);

  // Mock Pending Requests
  const [pendingRequests, setPendingRequests] = useState([
    { id: 'req_1', type: 'brother', senderName: 'Captain PK', senderId: 'AU100099', time: '2 hours ago' }
  ]);

  const handleSendRequest = () => {
    if (!targetUserId.trim()) {
      toast.error('Please enter partner User ID (e.g. AU100088)');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success(`${selectedCard.name} request sent to ${targetUserId}!`);
      setTargetUserId('');
    }, 400);
  };

  const handleAcceptRequest = (id: string, senderName: string, type: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    setActiveBonds((prev) => [
      ...prev,
      { id: `bond_${Date.now()}`, type, partnerName: senderName, partnerId: 'AU100099', level: 1, xp: 100, badge: 'Bronze', days: 1 }
    ]);
    toast.success(`Accepted ${senderName}'s relationship request! Bond created.`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#12141D] border border-[#2D3142] rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3142] bg-[#181B26]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Heart className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                Relationship Center (16 Cards Ecosystem)
                <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/30">
                  Levels 1-10
                </span>
              </h3>
              <p className="text-xs text-gray-400">Social Bonds, Shared Timeline, Badges & Relationship Rewards</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#2D3142] bg-[#141722]">
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 ${
              activeTab === 'cards' 
                ? 'border-pink-500 text-pink-400 bg-pink-500/10' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            16 Relationship Cards
          </button>
          <button
            onClick={() => setActiveTab('my_bonds')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'my_bonds' 
                ? 'border-pink-500 text-pink-400 bg-pink-500/10' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Active Relationships
            <span className="text-[10px] bg-pink-500 text-black px-1.5 py-0.2 rounded-full font-bold">
              {activeBonds.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'requests' 
                ? 'border-pink-500 text-pink-400 bg-pink-500/10' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Pending Requests
            {pendingRequests.length > 0 && (
              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {activeTab === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Cards List */}
              <div className="md:col-span-1 space-y-2 max-h-[500px] overflow-y-auto pr-1">
                <span className="text-xs font-bold text-gray-400">Select Card Type:</span>
                {RELATIONSHIP_TYPES.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      selectedCard.id === card.id
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500 text-white shadow-lg shadow-pink-500/10'
                        : 'bg-[#181B26] border-[#2D3142] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{card.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{card.name}</h4>
                        <span className="text-[10px] text-gray-400">{card.category}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                ))}
              </div>

              {/* Right Column: Selected Card Detail & Send Request */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Card Feature Banner */}
                <div className={`p-6 rounded-3xl bg-gradient-to-br ${selectedCard.color} text-white shadow-xl relative overflow-hidden`}>
                  <div className="absolute top-3 right-3 text-4xl opacity-20">{selectedCard.icon}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedCard.icon}</span>
                    <div>
                      <h3 className="font-extrabold text-xl">{selectedCard.name}</h3>
                      <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-medium">
                        {selectedCard.badge}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-white/90 mt-3">{selectedCard.description}</p>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-center">
                    <div>
                      <span className="text-[10px] text-white/80">Max Level</span>
                      <p className="font-bold text-sm">Level 10</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/80">Badge Rank</span>
                      <p className="font-bold text-sm">Royal Crown</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/80">Rewards</span>
                      <p className="font-bold text-sm">Coins & Frames</p>
                    </div>
                  </div>
                </div>

                {/* Shared Features Grid */}
                <div className="bg-[#181B26] p-4 rounded-2xl border border-[#2D3142] space-y-3">
                  <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    Unlocked Shared Features & Perks:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                    <div className="p-2 rounded-xl bg-[#252A3B] flex items-center gap-2 border border-[#353C54]">
                      <MessageCircle className="w-4 h-4 text-pink-400" /> Private Chat & Emojis
                    </div>
                    <div className="p-2 rounded-xl bg-[#252A3B] flex items-center gap-2 border border-[#353C54]">
                      <Phone className="w-4 h-4 text-emerald-400" /> Voice & Video Call
                    </div>
                    <div className="p-2 rounded-xl bg-[#252A3B] flex items-center gap-2 border border-[#353C54]">
                      <Crown className="w-4 h-4 text-amber-400" /> Shared Profile Frame
                    </div>
                    <div className="p-2 rounded-xl bg-[#252A3B] flex items-center gap-2 border border-[#353C54]">
                      <Gift className="w-4 h-4 text-purple-400" /> Anniversary Rewards
                    </div>
                  </div>
                </div>

                {/* Send Request Form */}
                <div className="bg-[#181B26] p-4 rounded-2xl border border-[#2D3142] space-y-3">
                  <span className="text-xs font-bold text-white">Send Relationship Request:</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Enter Partner User ID (e.g. AU100088)"
                      value={targetUserId}
                      onChange={(e) => setTargetUserId(e.target.value)}
                      className="flex-1 bg-[#252A3B] border border-[#3A415A] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                    />
                    <button
                      onClick={handleSendRequest}
                      disabled={isSending}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      Send Request
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'my_bonds' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-gray-300">My Active Relationship Bonds:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBonds.map((bond) => (
                  <div key={bond.id} className="bg-[#181B26] p-4 rounded-2xl border border-[#2D3142] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center font-bold">
                          ❤️
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{bond.partnerName}</h4>
                          <span className="text-xs text-gray-400 font-mono">{bond.partnerId}</span>
                        </div>
                      </div>
                      <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
                        Level {bond.level}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>XP Progress</span>
                        <span className="font-mono text-pink-400 font-bold">{bond.xp} / 5000 XP</span>
                      </div>
                      <div className="w-full h-2 bg-[#252A3B] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: `${(bond.xp / 5000) * 100}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#2D3142] text-xs text-gray-400">
                      <span>Anniversary: <strong className="text-white">{bond.days} days</strong></span>
                      <span className="text-pink-400 font-medium">{bond.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-gray-300">Pending Relationship Invites:</span>
              {pendingRequests.length === 0 ? (
                <div className="p-8 text-center bg-[#181B26] rounded-2xl border border-[#2D3142] text-gray-500 text-xs">
                  No pending relationship requests.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="bg-[#181B26] p-4 rounded-2xl border border-[#2D3142] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                          🛡️
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{req.senderName}</h4>
                          <p className="text-xs text-gray-400">Wants to create <strong>Brother Card</strong> with you ({req.time})</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptRequest(req.id, req.senderName, req.type)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1"
                        >
                          <UserCheck className="w-4 h-4" /> Accept
                        </button>
                        <button
                          onClick={() => setPendingRequests((prev) => prev.filter((r) => r.id !== req.id))}
                          className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs rounded-xl transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2D3142] bg-[#181B26]">
          <span className="text-xs text-gray-400">Relationship XP increases via Daily Chat, Gifts & PK Battles</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold bg-[#252A3B] hover:bg-[#32384D] text-white rounded-xl border border-[#3A415A] transition-colors"
          >
            Close Center
          </button>
        </div>

      </div>
    </div>
  );
};
