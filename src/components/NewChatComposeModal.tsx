import React, { useState } from 'react';
import { Search, X, MessageSquare, Sparkles, User, CheckCircle2 } from 'lucide-react';
import { chatEngine, ChatUser } from '../services/chatEngineService';
import { toast } from '../services/toastAndErrorService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (conversationId: string) => void;
}

export const NewChatComposeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = chatEngine.getCurrentUser();
  const allUsers = chatEngine.getUsers().filter(u => u.id !== currentUser.id);

  if (!isOpen) return null;

  const filteredUsers = allUsers.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q) || u.country.toLowerCase().includes(q);
  });

  const handleStartChat = (targetUser: ChatUser) => {
    const conv = chatEngine.getOrCreateDirectConversation(currentUser.id, targetUser.id);
    toast.success(`Connected with ${targetUser.name}!`);
    onSelectConversation(conv.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn text-white">
      <div className="bg-[#140D24] border border-purple-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-extrabold text-white text-base">Start New Conversation</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by Username, UID, or Country..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl bg-[#1C1631] border border-purple-900/40 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* User list */}
        <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-6">No users found matching "{searchQuery}".</p>
          ) : (
            filteredUsers.map(user => (
              <div 
                key={user.id}
                onClick={() => handleStartChat(user)}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#1C1631]/60 hover:bg-purple-950/60 border border-purple-900/30 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className={`w-11 h-11 rounded-full object-cover ${user.goldBorder ? 'border-2 border-[#D4AF37] p-0.5' : 'border border-purple-800'}`}
                    />
                    {user.status === 'ONLINE' && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#140D24]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-white text-xs">{user.name}</h4>
                      <span className={`text-[10px] ${user.gender === 'male' ? 'text-blue-400' : 'text-pink-400'}`}>
                        {user.gender === 'male' ? '♂' : '♀'}
                      </span>
                      {user.badge && (
                        <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-bold ${user.badgeColor || 'bg-[#D4AF37] text-white'}`}>
                          {user.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">UID: {user.id} • {user.country}</p>
                  </div>
                </div>

                <button 
                  className="p-2 rounded-xl bg-purple-600/80 group-hover:bg-purple-600 text-white transition shadow-md flex items-center gap-1 text-xs font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
