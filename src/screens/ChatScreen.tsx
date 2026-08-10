import { 
  chatEngine, ChatConversation, ChatUser 
} from '../services/chatEngineService';
import { privacyEngine } from '../services/privacyEngineService';
import { ConversationDetailModal } from '../components/ConversationDetailModal';
import { NewChatComposeModal } from '../components/NewChatComposeModal';
import { toast } from '../services/toastAndErrorService';

interface Props {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
  onEnterRoom?: (roomId: string) => void;
}

export default function ChatScreen({ onNavigate, onBack, onEnterRoom }: Props) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentUser, setCurrentUser] = useState<ChatUser>(() => chatEngine.getCurrentUser());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected conversation modal
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);

  // Subscribe to real-time chat updates
  useEffect(() => {
    const sync = () => {
      const curr = chatEngine.getCurrentUser();
      setCurrentUser(curr);
      setConversations(chatEngine.getConversations(curr.id));
    };

    sync();
    const unsub = chatEngine.subscribe(sync);
    return () => unsub();
  }, [currentUser.id]);

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    const partner = c.members.find(m => m.id !== currentUser.id) || c.members[0];
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      partner?.name.toLowerCase().includes(q) ||
      partner?.id.toLowerCase().includes(q) ||
      c.lastMessageText.toLowerCase().includes(q)
    );
  });

  const allUsers = chatEngine.getUsers();

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 font-sans pb-28 relative select-none">
      
      {/* ── 1. STICKY HEADER (MATCHING SCREENSHOT) ── */}
      <header className="sticky top-0 z-40 px-4 py-3.5 flex items-center justify-between bg-[#121212]/95 backdrop-blur-md border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onBack ? onBack() : onNavigate?.('home')}
            className="p-1 rounded-full text-slate-200 hover:text-white transition cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1 className="text-xl font-extrabold text-white tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
            Messages
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Account Switcher for 2-Way Real-Time Testing */}
          <button 
            onClick={() => setShowUserSwitcher(v => !v)}
            title="Switch User Account for Testing"
            className="px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-800/50 text-[10px] font-bold text-purple-300 flex items-center gap-1 hover:bg-purple-900 transition cursor-pointer"
          >
            <span>👤</span>
            <span className="truncate max-w-[70px]">{currentUser.name}</span>
          </button>

          <button 
            onClick={() => setShowComposeModal(true)}
            className="p-2 rounded-full hover:bg-slate-800 transition-colors text-[#a78bfa] text-lg cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </button>
          <button 
            onClick={() => toast.info('Chat & notification preferences opened.')}
            className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white text-lg cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── 2. QUICK USER SWITCHER DROPDOWN (FOR TESTING 2-WAY CHAT) ── */}
      {showUserSwitcher && (
        <div className="mx-4 my-2 p-3 rounded-2xl bg-[#1C1631] border border-purple-800/60 shadow-2xl space-y-2 animate-fadeIn z-50 text-xs">
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
            <span className="font-extrabold text-purple-300">Switch Logged-in Chat Account</span>
            <button onClick={() => setShowUserSwitcher(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <p className="text-[11px] text-slate-300">
            Switch accounts instantly to test 2-way real-time messaging, unread counts, and typing indicators:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {allUsers.map(u => (
              <button
                key={u.id}
                onClick={() => {
                  chatEngine.setCurrentUser(u.id);
                  toast.success(`Switched active user to ${u.name}!`);
                  setShowUserSwitcher(false);
                }}
                className={`p-2 rounded-xl border flex items-center gap-2 text-left transition cursor-pointer ${
                  currentUser.id === u.id
                    ? 'bg-purple-600/40 border-purple-400 text-white'
                    : 'bg-black/40 border-purple-900/30 text-slate-300 hover:text-white'
                }`}
              >
                <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                <div className="truncate">
                  <p className="font-bold truncate text-[11px]">{u.name}</p>
                  <span className="text-[9px] text-slate-400 font-mono">UID: {u.id}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 3. SEARCH INPUT BAR (MATCHING SCREENSHOT) ── */}
      <div className="px-4 py-3">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#1C1631] border border-purple-900/30 rounded-2xl outline-none text-xs text-white placeholder:text-slate-400 shadow-inner focus:border-purple-500 transition"
          />
        </div>
      </div>

      {/* ── 4. REAL-TIME CONVERSATION LIST (MATCHING SCREENSHOT) ── */}
      <main className="px-2 space-y-0.5">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-16 text-slate-500 space-y-2">
            <p className="text-xs">No conversations found.</p>
            <button 
              onClick={() => setShowComposeModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-lg"
            >
              Start New Chat
            </button>
          </div>
        ) : (
          filteredConversations.map(c => {
            const partner = c.members.find(m => m.id !== currentUser.id) || c.members[0];
            const unreadCount = c.unreadCounts[currentUser.id] || 0;
            const isTyping = partner && c.isTyping?.[partner.id];

            return (
              <div
                key={c.id}
                onClick={() => setActiveConversationId(c.id)}
                className="flex items-center p-3.5 hover:bg-[#1C1631]/60 active:bg-purple-950/40 rounded-2xl transition-all group cursor-pointer border-b border-slate-900/40 last:border-none"
              >
                {/* Avatar with glowing aura and badge */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full p-[2px] relative">
                    {/* Glowing purple aura ring */}
                    {partner?.goldBorder && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-[3px] opacity-70 animate-pulse" />
                    )}
                    <img 
                      className="w-full h-full object-cover rounded-full relative z-10 border border-purple-500/40" 
                      src={partner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&auto=format'} 
                      alt={partner?.name} 
                    />
                  </div>

                  {/* Noble / SVIP Pill Badge */}
                  {partner?.badge && privacyEngine.canViewVipBadge(currentUser.id, partner.id) && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 bg-[#D4AF37] text-slate-950 text-[9px] px-2 py-0.2 rounded-full font-black tracking-tight border border-[#121212] shadow-sm">
                      {partner.badge}
                    </div>
                  )}

                  {/* Online Presence indicator */}
                  {partner?.status === 'ONLINE' && privacyEngine.canViewOnlineStatus(currentUser.id, partner.id) && (
                    <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#121212] z-20" />
                  )}
                </div>

                {/* Conversation Details */}
                <div className="ml-3.5 flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-bold text-white flex items-center gap-1.5 text-sm truncate">
                      <span className="truncate">{partner?.name}</span>
                      <span className={`text-xs ${partner?.gender === 'male' ? 'text-blue-400' : 'text-pink-400'}`}>
                        {partner?.gender === 'male' ? '♂' : '♀'}
                      </span>
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono flex-shrink-0 ml-2">
                      {c.lastMessageTime}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate ${unreadCount > 0 ? 'text-slate-200 font-semibold' : 'text-slate-400'}`}>
                      {isTyping ? (
                        <span className="text-pink-400 font-bold animate-pulse">typing...</span>
                      ) : (
                        c.lastMessageText
                      )}
                    </p>
                    
                    {/* Unread Red Circle Badge (Matching Screenshot) */}
                    {unreadCount > 0 && (
                      <span className="bg-[#EF4444] text-white text-[10px] font-black h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full ml-2 shadow-md shadow-red-950/80">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* ── 5. FLOATING COMPOSE BUTTON (MATCHING SCREENSHOT) ── */}
      <button 
        onClick={() => setShowComposeModal(true)}
        aria-label="New Message"
        className="fixed right-6 bottom-24 bg-[#a78bfa] hover:bg-[#906ef7] text-slate-950 w-14 h-14 rounded-2xl shadow-xl shadow-purple-950/80 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-xl font-bold z-40 cursor-pointer"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </button>

      {/* ── 6. 1-ON-1 CONVERSATION DETAIL MODAL ── */}
      {activeConversationId && (
        <ConversationDetailModal 
          conversationId={activeConversationId}
          onClose={() => setActiveConversationId(null)}
          onNavigateToRoom={onEnterRoom}
        />
      )}

      {/* ── 7. NEW CHAT & SEARCH USER MODAL ── */}
      <NewChatComposeModal 
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onSelectConversation={(convId) => {
          setActiveConversationId(convId);
        }}
      />

    </div>
  );
}
