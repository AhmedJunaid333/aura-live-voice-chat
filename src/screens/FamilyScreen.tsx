import { useState } from 'react'

/* ────────── MOCK ENTERPRISE MOBILE DATA ────────── */
const allFamiliesList = [
  { id: 'FAM8821', name: 'Aura Warriors Guild', icon: '⚔️', leader: 'Sara_Vip7', level: 8, members: 284, rank: '#1', country: 'Pakistan', category: 'Music & Entertainment', desc: 'Urdu Singing & Music Community Guild', treasury: 284500 },
  { id: 'FAM1002', name: 'Rana Clan Alliance', icon: '👑', leader: 'King_Rana_VIP', level: 12, members: 192, rank: '#2', country: 'Pakistan', category: 'Gaming & PK Arena', desc: 'Competitive PK Tournament Team', treasury: 890000 },
  { id: 'FAM1005', name: 'Phoenix Knights', icon: '🔥', leader: 'Ali_Choudhary', level: 5, members: 110, rank: '#5', country: 'United States', category: 'Chat & Social Guild', desc: 'Global English Talk & Late Night Chill', treasury: 45000 },
  { id: 'FAM1009', name: 'Desert Falcons', icon: '🦅', leader: 'Zain_Dubai', level: 15, members: 420, rank: '#3', country: 'United Arab Emirates', category: 'VIP Families', desc: 'Luxury VIP 9+ Streamers Guild', treasury: 1250000 },
];

const membersList = [
  { rank: 1, id: '100821', name: 'Sara_Vip7', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop', role: 'Founder 👑', contribution: 48200, badge: '👑', status: 'ONLINE', micSeat: 1 },
  { rank: 2, id: '100998', name: 'King_Rana_VIP', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', role: 'Co-Leader ⚡', contribution: 31500, badge: '⚡', status: 'ONLINE', micSeat: 2 },
  { rank: 3, id: '100344', name: 'Ali_Choudhary', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', role: 'Moderator 🌙', contribution: 22800, badge: '🌙', status: 'ONLINE', micSeat: 3 },
  { rank: 4, id: '100774', name: 'Ayesha_Voice', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop', role: 'Elder 🎵', contribution: 18400, badge: '🎵', status: 'OFFLINE', micSeat: null },
  { rank: 5, id: '100452', name: 'Dark_Phantom', avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=80&h=80&fit=crop', role: 'Member 💎', contribution: 14200, badge: '💎', status: 'ONLINE', micSeat: null },
];

const familyMissionsList = [
  { id: 'FM-1', title: 'Send 100 Family Gifts', progress: 84, target: 100, reward: '+500 Family XP, 2,000 Coins', type: 'Daily' },
  { id: 'FM-2', title: 'Broadcast 50 Live Hours', progress: 38, target: 50, reward: '+1,200 Family XP, Treasury Boost', type: 'Weekly' },
  { id: 'FM-3', title: 'Send 1,000 Room Comments', progress: 920, target: 1000, reward: '+300 Family XP', type: 'Daily' },
  { id: 'FM-4', title: 'Recruit 10 New Members', progress: 7, target: 10, reward: 'Level-Up Badge Unlock', type: 'Monthly' },
];

const auditLogsList = [
  { id: 'AL-1', text: 'Sara_Vip7 (Leader) distributed 1,000 Coins to King_Rana_VIP from Treasury', time: '10m ago' },
  { id: 'AL-2', text: 'Ali_Choudhary (Moderator) approved join request of Ayesha_Voice', time: '1h ago' },
  { id: 'AL-3', text: 'Family Mission #FM-3 completed (+300 Family XP added)', time: '3h ago' },
];

interface Props { onBack?: () => void }

export default function FamilyScreen({ onBack }: Props) {
  // Current user role simulator
  const [userRole, setUserRole] = useState<'leader' | 'moderator' | 'member'>('member');
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'explore' | 'my-family' | 'rankings' | 'missions' | 'events' | 'chat' | 'voiceroom' | 'treasury' | 'requests' | 'members' | 'reports' | 'audit'>('my-family');

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Voice Room state
  const [inVoiceRoom, setInVoiceRoom] = useState(false);
  const [micMuted, setMicMuted] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Sara_Vip7 👑', text: 'Welcome to Aura Warriors family chat! Let us win tonight’s PK tournament! 🔥', time: '20:15' },
    { id: 2, sender: 'King_Rana_VIP ⚡', text: 'Count me in! Treasury is ready for reward distribution.', time: '20:18' },
  ]);
  const [newMsgText, setNewMsgText] = useState('');

  // Modals state
  const [showCreateFamilyModal, setShowCreateFamilyModal] = useState(false);
  const [showRewardMemberModal, setShowRewardMemberModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  
  const [rewardAmount, setRewardAmount] = useState('1000');
  const [selectedMemberToReward, setSelectedMemberToReward] = useState('King_Rana_VIP');

  // Requests queue
  const [joinRequests, setJoinRequests] = useState([
    { id: 'REQ-1', name: 'Usman_Singer', uid: '100491', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', level: 14, date: '10m ago' },
    { id: 'REQ-2', name: 'Zara_Queen', uid: '100882', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop', level: 22, date: '1h ago' },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: `You (${userRole.toUpperCase()})`, text: newMsgText, time: 'Just now' }]);
    setNewMsgText('');
  };

  const handleApproveJoinRequest = (reqId: string) => {
    setJoinRequests(prev => prev.filter(r => r.id !== reqId));
    alert(`Approved request ${reqId}. User added to Family Members!`);
  };

  const handleDistributeReward = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRewardMemberModal(false);
    alert(`Successfully transferred ${rewardAmount} Treasury Coins to ${selectedMemberToReward}!`);
  };

  return (
    <div className="screen overflow-y-auto bg-[#08040f] text-white select-none pb-24 font-sans">

      {/* TOP HEADER */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#0e071c]/95 backdrop-blur-md border-b border-purple-900/40">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-white font-bold">
              ‹
            </button>
          )}
          <div>
            <h1 className="font-black text-sm text-white tracking-tight flex items-center gap-1.5">
              <span>⚔️ Family Management</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/30 text-amber-400 font-bold text-[9px] border border-purple-400/40">
                {userRole.toUpperCase()} MODE
              </span>
            </h1>
            <p className="text-[10px] text-purple-300 font-mono">TikTok & BIGO Class Ecosystem</p>
          </div>
        </div>

        {/* ROLE SIMULATOR TOGGLE & CREATE FAMILY */}
        <div className="flex items-center gap-2">
          <select
            value={userRole}
            onChange={e => setUserRole(e.target.value as any)}
            className="bg-purple-950/80 border border-purple-700/50 rounded-xl px-2 py-1 text-[10px] font-bold text-amber-400 focus:outline-none"
          >
            <option value="member">👤 Normal Member</option>
            <option value="moderator">🌙 Moderator</option>
            <option value="leader">👑 Leader</option>
          </select>

          <button onClick={() => setShowCreateFamilyModal(true)} className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[11px] shadow-md">
            + Create
          </button>
        </div>
      </div>

      {/* QUICK ROLE PERMISSION BANNER */}
      <div className="px-4 py-2 bg-purple-950/40 border-b border-purple-900/30 text-[10px] flex justify-between items-center text-purple-300">
        <span>Permissions: <strong className="text-white">
          {userRole === 'leader' ? 'Full Treasury, Settings, Kick/Promote, Events' : userRole === 'moderator' ? 'Accept Requests, Moderate Chat, Events' : 'View, Join, Missions, Chat, Voice Space'}
        </strong></span>
        {userRole === 'leader' && (
          <button onClick={() => setShowRewardMemberModal(true)} className="px-2 py-0.5 rounded bg-amber-500 text-black font-bold text-[9px]">
            🏛️ Reward Member
          </button>
        )}
      </div>

      {/* HORIZONTAL CATEGORY TABS (ROLE ACCESS MATRIX) */}
      <div className="flex items-center gap-1.5 px-4 mt-3 overflow-x-auto hide-scrollbar">
        {[
          { key: 'my-family', label: '🛡️ My Family', roles: ['member', 'moderator', 'leader'] },
          { key: 'explore', label: '🔍 Explore Families', roles: ['member', 'moderator', 'leader'] },
          { key: 'rankings', label: '🏆 Rankings', roles: ['member', 'moderator', 'leader'] },
          { key: 'missions', label: '🎯 Missions & Rewards', roles: ['member', 'moderator', 'leader'] },
          { key: 'events', label: '🎪 Events & PK', roles: ['member', 'moderator', 'leader'] },
          { key: 'chat', label: '💬 Guild Chat', roles: ['member', 'moderator', 'leader'] },
          { key: 'voiceroom', label: '🎙️ Voice Space', roles: ['member', 'moderator', 'leader'] },
          { key: 'members', label: '👥 Members (284)', roles: ['member', 'moderator', 'leader'] },
          { key: 'treasury', label: '🏛️ Shared Treasury', roles: ['member', 'moderator', 'leader'] },
          { key: 'requests', label: `📥 Requests (${joinRequests.length})`, roles: ['moderator', 'leader'] },
          { key: 'reports', label: '⚠️ Safety Reports', roles: ['member', 'moderator', 'leader'] },
          { key: 'audit', label: '📜 Audit Logs', roles: ['moderator', 'leader'] },
        ].filter(t => t.roles.includes(userRole)).map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTab === t.key ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : 'bg-purple-950/40 text-purple-300/70 border border-purple-900/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      <div className="px-4 mt-4 space-y-4">

        {/* 1. MY FAMILY DASHBOARD */}
        {activeTab === 'my-family' && (
          <div className="space-y-4">
            {/* Hero Card */}
            <div className="relative rounded-3xl overflow-hidden p-5 bg-gradient-to-br from-purple-950 via-indigo-950 to-[#08040f] border border-purple-500/40 shadow-xl space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-3xl shadow-lg border border-purple-400/50 flex-shrink-0">
                    ⚔️
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-amber-400 font-mono">ID: FAM8821</span>
                    <h2 className="text-xl font-black text-white truncate">Aura Warriors</h2>
                    <p className="text-xs text-purple-300/80 font-medium truncate">"Victory through Unity & Live Harmony"</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/40 flex-shrink-0 whitespace-nowrap">
                  Global Rank #12
                </span>
              </div>


              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-purple-900/30 p-3 rounded-2xl border border-purple-800/40">
                <div>
                  <div className="text-purple-300/60 text-[10px]">Level</div>
                  <div className="font-extrabold text-amber-400">Lv.8 Guild</div>
                </div>
                <div>
                  <div className="text-purple-300/60 text-[10px]">Members</div>
                  <div className="font-extrabold text-white">284 / 300</div>
                </div>
                <div>
                  <div className="text-purple-300/60 text-[10px]">Treasury</div>
                  <div className="font-extrabold text-emerald-400">284,500 🪙</div>
                </div>
              </div>
            </div>

            {/* Privileges List */}
            <div className="bg-purple-950/30 border border-purple-900/40 p-4 rounded-2xl space-y-2 text-xs">
              <h3 className="font-bold text-white text-sm">Unlocked Guild Perks</h3>
              <div className="flex justify-between p-2 rounded-xl bg-purple-900/20">
                <span>🎙️ 8-Seat Private Voice Space</span>
                <span className="text-emerald-400 font-bold">✓ Active</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-purple-900/20">
                <span>🎨 Exclusive Avatar Frames & Badge</span>
                <span className="text-emerald-400 font-bold">✓ Active</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. EXPLORE FAMILIES */}
        {activeTab === 'explore' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search Family ID, Name or Country..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-purple-950/60 border border-purple-900/50 rounded-xl px-3 py-2.5 text-xs text-white placeholder-purple-300/50 focus:outline-none"
              />
            </div>

            <div className="space-y-3">
              {allFamiliesList.map(fam => (
                <div key={fam.id} className="bg-purple-950/30 border border-purple-900/40 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{fam.icon}</span>
                      <div>
                        <span className="text-[10px] font-bold text-purple-400 font-mono">{fam.id} | {fam.country}</span>
                        <h4 className="font-bold text-white text-sm">{fam.name}</h4>
                        <p className="text-xs text-slate-300">Leader: <strong className="text-amber-400">{fam.leader}</strong></p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 font-bold text-[10px]">{fam.rank}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono bg-purple-900/20 p-2.5 rounded-xl">
                    <span>Level: <strong className="text-purple-400">Lv.{fam.level}</strong></span>
                    <span>Members: <strong className="text-white">{fam.members}</strong></span>
                    <span>Treasury: <strong className="text-amber-400">{fam.treasury.toLocaleString()} 🪙</strong></span>
                  </div>

                  <button onClick={() => alert(`Sent join request to ${fam.name}`)} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md">
                    + Send Join Request
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. RANKINGS */}
        {activeTab === 'rankings' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white">🏆 Global Top Family Leaderboard</h3>
            {allFamiliesList.map((f, i) => (
              <div key={f.id} className="bg-purple-950/30 border border-purple-900/40 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs ${i === 0 ? 'bg-amber-500 text-black' : 'bg-purple-900/60 text-white'}`}>
                    #{i + 1}
                  </span>
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <h4 className="font-bold text-white text-xs">{f.name}</h4>
                    <p className="text-[10px] text-purple-300/60">Leader: {f.leader}</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-amber-400 font-bold">{f.treasury.toLocaleString()} 🪙</div>
                  <span className="text-[9px] text-purple-400 font-bold">Lv.{f.level}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. MISSIONS */}
        {activeTab === 'missions' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white">🎯 Family Missions & Task Rewards</h3>
            {familyMissionsList.map(m => (
              <div key={m.id} className="bg-purple-950/30 border border-purple-900/40 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-900/40 px-2 py-0.5 rounded">{m.type}</span>
                    <h4 className="font-bold text-white text-sm mt-1">{m.title}</h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{m.progress} / {m.target}</span>
                </div>
                <div className="h-2 rounded-full bg-purple-950 overflow-hidden">
                  <div style={{ width: `${(m.progress/m.target)*100}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-400 font-mono">Reward: {m.reward}</span>
                  <button onClick={() => alert(`Claimed reward for ${m.title}`)} className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md">
                    Claim Reward
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">🎪 Family Tournaments & PK Battles</h3>
              {(userRole === 'leader' || userRole === 'moderator') && (
                <button onClick={() => setShowCreateEventModal(true)} className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs">
                  + Create Event
                </button>
              )}
            </div>

            <div className="bg-purple-950/30 border border-purple-900/40 p-4 rounded-2xl space-y-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 text-[10px] font-bold">Singing</span>
              <h4 className="font-bold text-white text-sm">👑 Grand Family Singing Contest</h4>
              <div className="flex justify-between text-purple-300/80 font-mono">
                <span>⏱️ Tonight 9:00 PM</span>
                <span className="text-amber-400 font-bold">50,000 Coins Pool</span>
              </div>
              <button onClick={() => alert('Registered for Grand Singing Contest')} className="w-full py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md">
                Register / Participate
              </button>
            </div>
          </div>
        )}

        {/* 6. CHAT */}
        {activeTab === 'chat' && (
          <div className="space-y-3">
            <div className="h-64 overflow-y-auto bg-purple-950/40 border border-purple-900/40 rounded-2xl p-3 space-y-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className="bg-purple-900/30 border border-purple-800/40 p-2.5 rounded-xl space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="font-bold text-amber-400">{msg.sender}</span>
                    <span className="text-purple-300/60">{msg.time}</span>
                  </div>
                  <p className="text-xs text-white">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Type message to family..."
                value={newMsgText}
                onChange={e => setNewMsgText(e.target.value)}
                className="flex-1 bg-purple-950/60 border border-purple-900/50 rounded-xl px-3 py-2.5 text-xs text-white placeholder-purple-300/50 focus:outline-none"
              />
              <button type="submit" className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs">
                Send
              </button>
            </form>
          </div>
        )}

        {/* 7. VOICE SPACE */}
        {activeTab === 'voiceroom' && (
          <div className="space-y-4">
            <div className="bg-purple-950/40 border border-purple-900/40 rounded-3xl p-5 text-center space-y-3">
              <div className="text-4xl">🎙️</div>
              <h3 className="font-extrabold text-base text-white">Family Private Audio Space</h3>
              <p className="text-xs text-purple-300/70">8-Seat Guest Mic Room for Family Members</p>

              <div className="grid grid-cols-4 gap-3 py-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(seatNum => {
                  const occupied = membersList.find(m => m.micSeat === seatNum);
                  return (
                    <div key={seatNum} className="flex flex-col items-center gap-1">
                      {occupied ? (
                        <img src={occupied.avatar} alt={occupied.name} className="w-12 h-12 rounded-full border-2 border-purple-400 object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-purple-900/30 border border-purple-700/40 flex items-center justify-center text-purple-400 text-xs">
                          Seat {seatNum}
                        </div>
                      )}
                      <span className="text-[10px] text-purple-300 truncate w-16 text-center">{occupied ? occupied.name : 'Empty'}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setInVoiceRoom(!inVoiceRoom)}
                  className={`flex-1 py-3 rounded-2xl font-bold text-xs ${inVoiceRoom ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'}`}
                >
                  {inVoiceRoom ? 'Leave Voice Room' : 'Join Voice Seat'}
                </button>
                {inVoiceRoom && (
                  <button onClick={() => setMicMuted(!micMuted)} className="p-3 rounded-2xl bg-purple-900/50 border border-purple-700/40 text-white">
                    {micMuted ? '🔇 Muted' : '🎙️ Mic On'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 8. MEMBERS */}
        {activeTab === 'members' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white">👥 Enrolled Guild Members</h3>
            <div className="space-y-2">
              {membersList.map(m => (
                <div key={m.id} className="bg-purple-950/30 border border-purple-900/40 p-3 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-purple-500/40" />
                    <div>
                      <div className="font-bold text-white flex items-center gap-1">
                        <span>{m.name}</span>
                        <span className="text-amber-400">{m.badge}</span>
                      </div>
                      <span className="text-[10px] text-purple-300/70">{m.role}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-amber-400 font-bold">🪙 {m.contribution.toLocaleString()}</div>
                    {userRole === 'leader' && m.id !== '100821' && (
                      <button onClick={() => alert(`Kicked member ${m.name}`)} className="text-red-400 text-[9px] font-bold hover:underline">
                        Kick
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. TREASURY */}
        {activeTab === 'treasury' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-950 to-indigo-950 border border-amber-500/40 rounded-3xl p-5 text-center space-y-2 shadow-xl">
              <p className="text-amber-400/80 font-mono text-xs uppercase tracking-widest">Shared Family Treasury</p>
              <div className="text-3xl font-black text-amber-400">🏛️ 284,500 Coins</div>
              <p className="text-[10px] text-purple-300/70">Leader Distribution Pool for Prizes & Events</p>
              {userRole === 'leader' && (
                <button onClick={() => setShowRewardMemberModal(true)} className="mt-2 px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-md">
                  + Distribute Reward to Member
                </button>
              )}
            </div>
          </div>
        )}

        {/* 10. REQUESTS (LEADER / MOD) */}
        {activeTab === 'requests' && (userRole === 'leader' || userRole === 'moderator') && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white">📥 Pending Join Requests Queue</h3>
            {joinRequests.length === 0 ? (
              <div className="p-6 text-center bg-purple-950/30 border border-purple-900/40 rounded-2xl text-purple-300/60 text-xs">
                ✅ No pending join requests!
              </div>
            ) : (
              <div className="space-y-2">
                {joinRequests.map(req => (
                  <div key={req.id} className="bg-purple-950/30 border border-purple-900/40 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-full object-cover border border-purple-500/40" />
                      <div>
                        <h4 className="font-bold text-white">{req.name} (UID: {req.uid})</h4>
                        <p className="text-[10px] text-purple-300/70">User Level: Lv.{req.level}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => handleApproveJoinRequest(req.id)} className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md">
                        ✓ Accept
                      </button>
                      <button onClick={() => setJoinRequests(prev => prev.filter(r => r.id !== req.id))} className="px-2.5 py-1.5 rounded-xl bg-purple-900/50 text-purple-300 text-xs">
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 11. REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-3 bg-purple-950/30 border border-purple-900/40 p-4 rounded-2xl text-xs space-y-3">
            <h3 className="font-bold text-sm text-white">⚠️ Submit Abuse / Violation Report</h3>
            <textarea rows={3} placeholder="Describe violation, spam or harassment issue..." className="w-full bg-purple-950/60 border border-purple-900/50 rounded-xl p-3 text-white text-xs placeholder-purple-300/50 focus:outline-none" />
            <button onClick={() => alert('Report submitted to Admin Portal Safety Queue')} className="w-full py-2.5 rounded-xl bg-red-500/80 text-white font-bold text-xs shadow-md">
              Dispatch Safety Complaint
            </button>
          </div>
        )}

        {/* 12. AUDIT LOGS */}
        {activeTab === 'audit' && (userRole === 'leader' || userRole === 'moderator') && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white">📜 Family Action Audit Trail</h3>
            <div className="space-y-2">
              {auditLogsList.map(log => (
                <div key={log.id} className="bg-purple-950/30 border border-purple-900/40 p-3 rounded-2xl text-xs space-y-1 font-mono">
                  <div className="text-purple-300/60 text-[10px]">{log.time}</div>
                  <p className="text-white">{log.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* REWARD MEMBER MODAL (LEADER ONLY) */}
      {showRewardMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <form onSubmit={handleDistributeReward} className="w-full max-w-md bg-[#130b24] border border-amber-500/40 rounded-3xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">🏛️ Distribute Treasury Reward</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-purple-300 font-bold block mb-1">Select Member</label>
                <select value={selectedMemberToReward} onChange={e => setSelectedMemberToReward(e.target.value)} className="w-full bg-purple-950/60 border border-purple-900/50 rounded-xl p-3 text-white">
                  {membersList.map(m => <option key={m.id} value={m.name}>{m.name} ({m.role})</option>)}
                </select>
              </div>
              <div>
                <label className="text-purple-300 font-bold block mb-1">Coin Amount</label>
                <input type="number" required value={rewardAmount} onChange={e => setRewardAmount(e.target.value)} className="w-full bg-purple-950/60 border border-purple-900/50 rounded-xl p-3 text-white" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowRewardMemberModal(false)} className="flex-1 py-3 rounded-xl bg-purple-950 text-purple-300 font-bold text-xs">Cancel</button>
              <button type="submit" className="flex-1 py-3 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-lg">Distribute Coins</button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE FAMILY MODAL */}
      {showCreateFamilyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#130b24] border border-purple-500/40 rounded-3xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Create New Family Guild</h3>
            <input type="text" placeholder="Family Name..." className="w-full bg-purple-950/60 border border-purple-900/50 rounded-xl p-3 text-xs text-white" />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowCreateFamilyModal(false)} className="flex-1 py-3 rounded-xl bg-purple-950 text-purple-300 font-bold text-xs">Cancel</button>
              <button onClick={() => { setShowCreateFamilyModal(false); alert('Family created!'); }} className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold text-xs">Create</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
