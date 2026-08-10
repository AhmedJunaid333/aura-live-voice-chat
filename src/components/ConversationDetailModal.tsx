import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, Send, Image as ImageIcon, Mic, Gift, Smile, Phone, 
  MoreVertical, Check, CheckCheck, AlertCircle, Copy, CornerUpLeft, 
  Trash2, Flag, X, Play, Pause, ExternalLink, ShieldAlert, Sparkles, User
} from 'lucide-react';
import { 
  chatEngine, ChatConversation, ChatMessage, ChatUser, MessageType, ChatAttachment 
} from '../services/chatEngineService';
import { privacyEngine } from '../services/privacyEngineService';
import { toast } from '../services/toastAndErrorService';

interface Props {
  conversationId: string;
  onClose: () => void;
  onNavigateToRoom?: (roomId: string) => void;
}

export const ConversationDetailModal: React.FC<Props> = ({
  conversationId,
  onClose,
  onNavigateToRoom,
}) => {
  const [conversation, setConversation] = useState<ChatConversation | undefined>(() => 
    chatEngine.getConversationById(conversationId)
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() => 
    chatEngine.getMessages(conversationId)
  );
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState<ChatUser>(() => chatEngine.getCurrentUser());
  const [partnerUser, setPartnerUser] = useState<ChatUser | undefined>();
  
  // Interactive Drawers
  const [showAttachmentDrawer, setShowAttachmentDrawer] = useState(false);
  const [showEmojiDrawer, setShowEmojiDrawer] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [selectedMessageAction, setSelectedMessageAction] = useState<ChatMessage | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  
  // Voice Note Recording Simulation
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync state and mark conversation as read
  useEffect(() => {
    chatEngine.markConversationAsRead(conversationId, currentUser.id);

    const sync = () => {
      const conv = chatEngine.getConversationById(conversationId);
      const curr = chatEngine.getCurrentUser();
      setCurrentUser(curr);
      setConversation(conv);
      setMessages(chatEngine.getMessages(conversationId, curr.id));

      if (conv) {
        const partnerId = conv.memberIds.find(id => id !== curr.id) || conv.memberIds[0];
        setPartnerUser(chatEngine.getUserById(partnerId));
      }
    };

    sync();
    const unsub = chatEngine.subscribe(sync);
    return () => unsub();
  }, [conversationId, currentUser.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecordingVoice]);

  // Voice recording timer
  useEffect(() => {
    let interval: any;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Typing event handler
  const handleInputChange = (text: string) => {
    setInputText(text);
    chatEngine.setTyping(conversationId, currentUser.id, text.trim().length > 0);
  };

  // Send Message Handler
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !partnerUser) return;

    // Privacy & Block check
    const permission = privacyEngine.canMessage(currentUser.id, partnerUser.id);
    if (!permission.allowed) {
      toast.error(permission.reason || 'Message blocked by privacy policy.');
      return;
    }

    chatEngine.sendMessage({
      conversationId,
      senderId: currentUser.id,
      receiverId: partnerUser.id,
      content: inputText.trim(),
      type: 'TEXT',
      replyToMessageId: replyingTo?.id,
    });

    setInputText('');
    setReplyingTo(null);
    setShowEmojiDrawer(false);
    chatEngine.setTyping(conversationId, currentUser.id, false);
  };

  // Send Quick Gift
  const handleSendGift = (gift: { id: string; name: string; icon: string; coins: number }) => {
    if (!partnerUser) return;
    chatEngine.sendMessage({
      conversationId,
      senderId: currentUser.id,
      receiverId: partnerUser.id,
      content: `Sent you a ${gift.name}! ${gift.icon}`,
      type: 'GIFT',
      attachment: {
        id: `ATT-${Date.now()}`,
        type: 'GIFT',
        giftId: gift.id,
        giftName: gift.name,
        giftIcon: gift.icon,
        giftCoins: gift.coins,
      },
    });
    setShowAttachmentDrawer(false);
    toast.success(`Sent ${gift.name} (${gift.coins} Coins) to ${partnerUser.name}!`);
  };

  // Send Voice Note
  const handleStopAndSendVoice = () => {
    if (!partnerUser) return;
    const dur = Math.max(1, recordingSeconds);
    chatEngine.sendMessage({
      conversationId,
      senderId: currentUser.id,
      receiverId: partnerUser.id,
      content: `Voice Message (${dur}s)`,
      type: 'VOICE',
      attachment: {
        id: `ATT-VOICE-${Date.now()}`,
        type: 'VOICE',
        durationSeconds: dur,
      },
    });
    setIsRecordingVoice(false);
    toast.info(`Sent voice note (${dur}s)`);
  };

  // Send Shared Room
  const handleShareRoom = () => {
    if (!partnerUser) return;
    chatEngine.sendMessage({
      conversationId,
      senderId: currentUser.id,
      receiverId: partnerUser.id,
      content: '🎙️ Join my VIP Voice Lounge!',
      type: 'SHARED_ROOM',
      attachment: {
        id: `ATT-ROOM-${Date.now()}`,
        type: 'ROOM',
        roomId: 'ROOM-108',
        roomTitle: 'Midnight Acoustic Sessions & PK Lounge',
      },
    });
    setShowAttachmentDrawer(false);
    toast.success('Shared live audio room invite in chat!');
  };

  // Quick Emoji reactions
  const handleReaction = (msg: ChatMessage, emoji: string) => {
    chatEngine.toggleReaction(msg.id, emoji, currentUser.id);
    setSelectedMessageAction(null);
  };

  const isPartnerTyping = partnerUser && conversation?.isTyping?.[partnerUser.id];

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0B1A] text-white flex flex-col animate-fadeIn select-none">
      
      {/* ── 1. HEADER (EXACT SLEEK DESIGN) ── */}
      <header className="px-4 py-3 bg-[#161129]/95 backdrop-blur-xl border-b border-purple-900/30 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-purple-950/60 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative">
            <div className={`w-10 h-10 rounded-full overflow-hidden ${partnerUser?.goldBorder ? 'border-2 border-[#D4AF37] p-[1px]' : 'border-2 border-purple-800'}`}>
              <img 
                src={partnerUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop'} 
                alt={partnerUser?.name} 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {partnerUser?.status === 'ONLINE' && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#161129]" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-white text-sm tracking-wide">{partnerUser?.name}</h2>
              <span className={`text-xs ${partnerUser?.gender === 'male' ? 'text-blue-400' : 'text-pink-400'}`}>
                {partnerUser?.gender === 'male' ? '♂' : '♀'}
              </span>
              {partnerUser?.badge && privacyEngine.canViewVipBadge(currentUser.id, partnerUser.id) && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${partnerUser.badgeColor || 'bg-[#D4AF37] text-white'}`}>
                  {partnerUser.badge}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              {isPartnerTyping ? (
                <span className="text-pink-400 font-bold animate-pulse">typing...</span>
              ) : partnerUser?.status === 'ONLINE' && privacyEngine.canViewOnlineStatus(currentUser.id, partnerUser.id) ? (
                <span className="text-emerald-400 font-semibold">Online</span>
              ) : (
                `Last seen ${partnerUser?.lastSeen || 'recently'}`
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <button 
            onClick={() => toast.info(`Starting high-definition audio call with ${partnerUser?.name}...`)}
            className="p-2 rounded-full hover:bg-purple-950/60 hover:text-white transition cursor-pointer"
          >
            <Phone className="w-5 h-5 text-[#D4AF37]" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(v => !v)}
              className="p-2 rounded-full hover:bg-purple-950/60 hover:text-white transition cursor-pointer"
            >
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-10 w-44 rounded-2xl bg-[#1C1631] border border-purple-900/40 p-2 shadow-2xl space-y-1 z-50 text-xs font-bold animate-fadeIn">
                <button 
                  onClick={() => {
                    if (partnerUser) {
                      const isNowBlocked = privacyEngine.isBlocked(currentUser.id, partnerUser.id);
                      if (isNowBlocked) {
                        privacyEngine.unblockUser(currentUser.id, partnerUser.id);
                        toast.success(`Unblocked ${partnerUser.name}.`);
                      } else {
                        privacyEngine.blockUser(currentUser.id, partnerUser, 'Blocked via Chat Menu');
                        toast.error(`Blocked ${partnerUser.name}. Messages restricted.`);
                      }
                    }
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-purple-900/40 text-slate-200 transition cursor-pointer"
                >
                  🚫 {partnerUser && privacyEngine.isBlocked(currentUser.id, partnerUser.id) ? 'Unblock User' : 'Block User'}
                </button>
                <button 
                  onClick={() => {
                    toast.info('Chat history cleared for your view.');
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-purple-900/40 text-slate-200 transition"
                >
                  🧹 Clear Chat
                </button>
                <button 
                  onClick={() => {
                    if (partnerUser) {
                      chatEngine.reportMessage({
                        messageId: messages[messages.length - 1]?.id || 'N/A',
                        conversationId,
                        reporterId: currentUser.id,
                        reason: 'User reported profile / conversation violation.',
                      });
                      toast.success(`Report submitted to Admin Board for ${partnerUser.name}.`);
                    }
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-rose-950/60 text-rose-300 transition"
                >
                  🚩 Report to Admin
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. MESSAGE STREAM BODY ── */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        
        {/* Date separator */}
        <div className="flex justify-center my-2">
          <span className="px-3 py-1 rounded-full bg-[#1C1631] text-[10px] text-slate-400 font-mono border border-purple-900/20">
            Today
          </span>
        </div>

        {messages.map(msg => {
          const isMine = msg.senderId === currentUser.id;

          return (
            <div 
              key={msg.id}
              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} group relative`}
            >
              {/* Quoted reply snippet */}
              {msg.replySnippet && (
                <div className={`text-[10px] max-w-xs mb-1 px-2.5 py-1 rounded-lg border-l-2 ${isMine ? 'bg-purple-950/60 border-pink-400 text-purple-200' : 'bg-slate-900/80 border-[#D4AF37] text-slate-300'}`}>
                  <span className="font-bold block">{msg.replySnippet.senderName}</span>
                  <p className="truncate italic">"{msg.replySnippet.content}"</p>
                </div>
              )}

              <div className="flex items-end gap-2 max-w-[85%]">
                {!isMine && (
                  <img 
                    src={msg.senderAvatar} 
                    alt={msg.senderName} 
                    className="w-7 h-7 rounded-full object-cover border border-purple-900/40 mb-1"
                  />
                )}

                {/* Bubble Container */}
                <div
                  onClick={() => setSelectedMessageAction(msg)}
                  className={`p-3 rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-[1.01] ${
                    isMine 
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-br-none border border-purple-500/30' 
                      : 'bg-[#1C1631] text-slate-100 rounded-bl-none border border-purple-900/30'
                  }`}
                >
                  {/* TEXT MESSAGE */}
                  {msg.type === 'TEXT' && (
                    <p className="text-xs leading-relaxed break-words whitespace-pre-wrap">{msg.content}</p>
                  )}

                  {/* GIFT MESSAGE */}
                  {msg.type === 'GIFT' && (
                    <div className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/40 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-pink-600 flex items-center justify-center text-2xl shadow-lg animate-bounce">
                        {msg.attachment?.giftIcon || '🎁'}
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Luxury Gift Sent</span>
                        <h4 className="font-extrabold text-white text-xs">{msg.attachment?.giftName}</h4>
                        <span className="text-[10px] text-amber-400 font-mono font-black">+{msg.attachment?.giftCoins} Coins</span>
                      </div>
                    </div>
                  )}

                  {/* VOICE NOTE MESSAGE */}
                  {msg.type === 'VOICE' && (
                    <div className="flex items-center gap-3 min-w-[180px]">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id);
                        }}
                        className="w-8 h-8 rounded-full bg-pink-600 hover:bg-pink-500 flex items-center justify-center text-white shadow-md transition cursor-pointer"
                      >
                        {playingVoiceId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-0.5 h-4">
                          {[40, 70, 90, 60, 30, 80, 100, 60, 40, 90, 70, 50].map((h, i) => (
                            <span 
                              key={i} 
                              className={`w-1 rounded-full ${playingVoiceId === msg.id ? 'bg-pink-400 animate-pulse' : 'bg-slate-500'}`} 
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] text-slate-300 font-mono mt-0.5 block">
                          0:0{msg.attachment?.durationSeconds || 3}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* SHARED ROOM MESSAGE */}
                  {msg.type === 'SHARED_ROOM' && (
                    <div className="p-3 rounded-xl bg-black/40 border border-purple-500/40 space-y-2">
                      <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
                        <Sparkles className="w-4 h-4" />
                        <span>Live Voice Room Invite</span>
                      </div>
                      <p className="font-extrabold text-white text-xs">{msg.attachment?.roomTitle}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigateToRoom) onNavigateToRoom(msg.attachment?.roomId || 'ROOM-108');
                          else toast.info('Joining live room...');
                        }}
                        className="w-full py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-md transition hover:scale-[1.02] flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Join Voice Room 🎙️</span>
                      </button>
                    </div>
                  )}

                  {/* SHARED MOMENT / IMAGE */}
                  {msg.type === 'SHARED_MOMENT' && msg.attachment?.url && (
                    <div className="space-y-1.5">
                      <img 
                        src={msg.attachment.url} 
                        alt="Moment" 
                        className="rounded-xl w-full max-h-48 object-cover border border-purple-900/30"
                      />
                      <p className="text-[11px] text-slate-300 italic">{msg.content}</p>
                    </div>
                  )}

                  {/* Timestamp & Status checkmarks */}
                  <div className={`flex items-center gap-1 justify-end mt-1 text-[9px] ${isMine ? 'text-purple-200' : 'text-slate-400'}`}>
                    <span>{msg.createdAt.slice(-5)}</span>
                    {isMine && (
                      <span>
                        {msg.status === 'SENDING' && <span className="animate-spin text-slate-300">⏳</span>}
                        {msg.status === 'SENT' && <Check className="w-3 h-3 text-slate-300" />}
                        {msg.status === 'DELIVERED' && <CheckCheck className="w-3.5 h-3.5 text-slate-300" />}
                        {msg.status === 'READ' && <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />}
                        {msg.status === 'FAILED' && (
                          <button 
                            onClick={() => chatEngine.retryMessage(msg.id)}
                            className="text-rose-400 font-bold flex items-center gap-0.5"
                          >
                            <AlertCircle className="w-3 h-3" /> Retry
                          </button>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Reaction Badges */}
              {Object.keys(msg.reactions).length > 0 && (
                <div className={`flex items-center gap-1 -mt-2.5 z-10 ${isMine ? 'mr-3' : 'ml-10'}`}>
                  {Object.entries(msg.reactions).map(([emoji, uids]) => (
                    <span key={emoji} className="px-1.5 py-0.5 rounded-full bg-[#1C1631] border border-purple-800 text-[10px] shadow-sm flex items-center gap-0.5">
                      <span>{emoji}</span>
                      <span className="text-[9px] text-slate-300 font-mono">{uids.length}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Real-time Typing Bubble */}
        {isPartnerTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs animate-fadeIn">
            <img src={partnerUser?.avatar} alt="Typing" className="w-6 h-6 rounded-full object-cover border border-purple-900" />
            <div className="px-3 py-2 rounded-2xl bg-[#1C1631] border border-purple-900/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce delay-200" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* ── 3. INTERACTIVE MESSAGE ACTION SHEET ── */}
      {selectedMessageAction && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="bg-[#1C1631] border border-purple-900/50 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-fadeIn">
            
            {/* Quick Reactions Bar */}
            <div className="flex items-center justify-around bg-black/40 p-2 rounded-2xl border border-purple-900/30">
              {['❤️', '🔥', '😂', '👍', '🎉', '⚔️'].map(emoji => (
                <button 
                  key={emoji}
                  onClick={() => handleReaction(selectedMessageAction, emoji)}
                  className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button 
                onClick={() => {
                  setReplyingTo(selectedMessageAction);
                  setSelectedMessageAction(null);
                }}
                className="p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-slate-200 flex items-center gap-2 transition"
              >
                <CornerUpLeft className="w-4 h-4 text-pink-400" /> Reply
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(selectedMessageAction.content);
                  toast.success('Copied to clipboard');
                  setSelectedMessageAction(null);
                }}
                className="p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-slate-200 flex items-center gap-2 transition"
              >
                <Copy className="w-4 h-4 text-indigo-400" /> Copy Text
              </button>
              <button 
                onClick={() => {
                  chatEngine.deleteMessageForMe(selectedMessageAction.id, currentUser.id);
                  toast.info('Deleted for you.');
                  setSelectedMessageAction(null);
                }}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center gap-2 transition"
              >
                <Trash2 className="w-4 h-4 text-slate-400" /> Delete for Me
              </button>
              {selectedMessageAction.senderId === currentUser.id && (
                <button 
                  onClick={() => {
                    chatEngine.deleteMessageForEveryone(selectedMessageAction.id);
                    toast.info('Deleted for everyone.');
                    setSelectedMessageAction(null);
                  }}
                  className="p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 flex items-center gap-2 transition"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" /> Delete Everyone
                </button>
              )}
              <button 
                onClick={() => {
                  chatEngine.reportMessage({
                    messageId: selectedMessageAction.id,
                    conversationId,
                    reporterId: currentUser.id,
                    reason: 'Inappropriate or abusive chat content.',
                  });
                  toast.success('Report forwarded to Admin Board.');
                  setSelectedMessageAction(null);
                }}
                className="col-span-2 p-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900 text-amber-300 flex items-center justify-center gap-2 transition"
              >
                <Flag className="w-4 h-4 text-amber-400" /> Report Message to Admin
              </button>
            </div>

            <button 
              onClick={() => setSelectedMessageAction(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── 4. ATTACHMENT DRAWER (VIP GIFTS, ROOM SHARE, VOICE) ── */}
      {showAttachmentDrawer && (
        <div className="p-4 bg-[#161129] border-t border-purple-900/40 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Attachments</span>
            <button onClick={() => setShowAttachmentDrawer(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <button 
              onClick={handleShareRoom}
              className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/40 hover:scale-105 transition flex flex-col items-center gap-1 cursor-pointer"
            >
              <span className="text-2xl">🎙️</span>
              <span className="text-[10px] font-bold text-purple-200">Share Room</span>
            </button>

            <button 
              onClick={() => handleSendGift({ id: 'SUPERCAR', name: 'Golden Supercar', icon: '🏎️', coins: 5000 })}
              className="p-3 rounded-2xl bg-amber-950/60 border border-amber-800/40 hover:scale-105 transition flex flex-col items-center gap-1 cursor-pointer"
            >
              <span className="text-2xl">🏎️</span>
              <span className="text-[10px] font-bold text-amber-200">Supercar</span>
            </button>

            <button 
              onClick={() => handleSendGift({ id: 'CASTLE', name: 'Royal Palace', icon: '🏰', coins: 20000 })}
              className="p-3 rounded-2xl bg-pink-950/60 border border-pink-800/40 hover:scale-105 transition flex flex-col items-center gap-1 cursor-pointer"
            >
              <span className="text-2xl">🏰</span>
              <span className="text-[10px] font-bold text-pink-200">Palace</span>
            </button>

            <button 
              onClick={() => handleSendGift({ id: 'CROWN', name: 'Diamond Crown', icon: '👑', coins: 10000 })}
              className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-800/40 hover:scale-105 transition flex flex-col items-center gap-1 cursor-pointer"
            >
              <span className="text-2xl">👑</span>
              <span className="text-[10px] font-bold text-cyan-200">Crown</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 5. EMOJI DRAWER ── */}
      {showEmojiDrawer && (
        <div className="p-3 bg-[#161129] border-t border-purple-900/40 grid grid-cols-8 gap-2 text-2xl text-center max-h-36 overflow-y-auto custom-scrollbar animate-fadeIn">
          {['❤️', '🔥', '😂', '🚀', '👑', '🎉', '🎙️', '✨', '😍', '👏', '🙏', '💯', '🌟', '🌹', '💎', '🥳'].map(emoji => (
            <button 
              key={emoji}
              onClick={() => {
                setInputText(prev => prev + emoji);
              }}
              className="hover:scale-125 transition-transform cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* ── 6. INPUT BAR (REAL-TIME ACTION) ── */}
      <footer className="p-3 bg-[#161129]/95 backdrop-blur-xl border-t border-purple-900/40 space-y-2">
        {replyingTo && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/80 border border-purple-800/40 text-xs">
            <div className="flex items-center gap-2 truncate">
              <CornerUpLeft className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <div className="truncate">
                <span className="font-bold text-purple-300">Replying to {replyingTo.senderName}:</span>
                <p className="text-[11px] text-slate-300 truncate">"{replyingTo.content}"</p>
              </div>
            </div>
            <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-white ml-2">✕</button>
          </div>
        )}

        {isRecordingVoice ? (
          <div className="flex items-center justify-between p-2 rounded-2xl bg-pink-950/80 border border-pink-500/40 animate-pulse">
            <div className="flex items-center gap-3 text-pink-300">
              <span className="w-3 h-3 rounded-full bg-pink-500 animate-ping" />
              <span className="font-bold text-xs">Recording Audio... 0:0{recordingSeconds}</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsRecordingVoice(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleStopAndSendVoice}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-black shadow-lg"
              >
                Send Voice 🎙️
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => {
                setShowAttachmentDrawer(v => !v);
                setShowEmojiDrawer(false);
              }}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-purple-950/60 transition cursor-pointer"
            >
              <Gift className="w-5 h-5 text-[#D4AF37]" />
            </button>

            <button 
              type="button"
              onClick={() => {
                setShowEmojiDrawer(v => !v);
                setShowAttachmentDrawer(false);
              }}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-purple-950/60 transition cursor-pointer"
            >
              <Smile className="w-5 h-5 text-purple-400" />
            </button>

            <input 
              type="text"
              placeholder="Type message..."
              value={inputText}
              onChange={e => handleInputChange(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[#1C1631] border border-purple-900/40 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-400 shadow-inner"
            />

            {inputText.trim() ? (
              <button 
                type="submit"
                className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-950/80 hover:scale-105 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => setIsRecordingVoice(true)}
                className="p-2.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-pink-300 shadow-md transition cursor-pointer"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </form>
        )}
      </footer>

    </div>
  );
};
