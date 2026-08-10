import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Search, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, 
  Headphones, RefreshCw, MessageSquare, Send, X, ShieldCheck, 
  ExternalLink, CheckCircle2, Sparkles, AlertCircle 
} from 'lucide-react';
import { 
  helpAndFaqEngine, FaqArticle, SupportTicket, SupportTicketMessage 
} from '../services/helpAndFaqService';
import { toast } from '../services/toastAndErrorService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userName?: string;
}

export const HelpAndFaqModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userId = '100821',
  userName = 'Sara_Vip7',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<FaqArticle[]>(() => helpAndFaqEngine.searchArticles(''));
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>('FAQ-101');
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [supportTicket, setSupportTicket] = useState<SupportTicket>(() => 
    helpAndFaqEngine.getOrCreateUserTicket(userId, userName)
  );
  const [supportInput, setSupportInput] = useState('');

  // Real-time synchronization
  useEffect(() => {
    const sync = () => {
      setArticles(helpAndFaqEngine.searchArticles(searchQuery));
      setSupportTicket(helpAndFaqEngine.getOrCreateUserTicket(userId, userName));
    };
    sync();
    const unsub = helpAndFaqEngine.subscribe(sync);
    return () => unsub();
  }, [searchQuery, userId, userName]);

  if (!isOpen) return null;

  const handleToggleExpand = (id: string) => {
    if (expandedArticleId === id) {
      setExpandedArticleId(null);
    } else {
      setExpandedArticleId(id);
      helpAndFaqEngine.getArticleById(id);
    }
  };

  const handleVoteFeedback = (e: React.MouseEvent, articleId: string, isHelpful: boolean) => {
    e.stopPropagation();
    const res = helpAndFaqEngine.voteHelpful(articleId, isHelpful, userId);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.info(res.message);
    }
  };

  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportInput.trim()) return;

    helpAndFaqEngine.sendUserSupportMessage(supportTicket.id, supportInput.trim(), userId, userName);
    setSupportInput('');
    toast.success('Message sent to 24/7 VIP Concierge.');
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
            Help & FAQ
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => toast.success('Help articles synchronized.')}
            className="p-2 rounded-full hover:bg-purple-950/60 text-purple-300 hover:text-white transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── 2. MAIN CONTENT (MATCHING SCREENSHOT) ── */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-5 pb-28">
        
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search help articles & FAQs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-11 pr-4 py-3 bg-[#1C1631] border border-purple-900/30 rounded-2xl outline-none text-white placeholder-slate-400 shadow-inner focus:border-purple-500 transition font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Frequently Asked Questions
          </span>
          <span className="text-[10px] text-purple-300 font-mono">
            {articles.length} Guides Available
          </span>
        </div>

        {/* FAQ Accordion Cards */}
        <div className="space-y-3">
          {articles.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-3">
              <AlertCircle className="w-10 h-10 mx-auto text-purple-400/60" />
              <div>
                <h4 className="font-bold text-white text-sm">No help articles found</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Try searching with different keywords or chat with our 24/7 VIP team.
                </p>
              </div>
              <button 
                onClick={() => setShowSupportChat(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg cursor-pointer"
              >
                Contact 24/7 VIP Support
              </button>
            </div>
          ) : (
            articles.map(article => {
              const isExpanded = expandedArticleId === article.id;

              return (
                <div 
                  key={article.id}
                  className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-xl ${
                    isExpanded 
                      ? 'bg-[#1C1631] border-purple-500/50 ring-1 ring-purple-500/30' 
                      : 'bg-[#140D24] hover:bg-[#1C1631]/70 border-purple-900/30'
                  }`}
                >
                  {/* Card Header Tap Bar */}
                  <div 
                    onClick={() => handleToggleExpand(article.id)}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-lg flex-shrink-0">
                        {article.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-white text-xs leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {article.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="text-slate-400 flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-purple-300" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Answer Drawer */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-purple-900/30 text-xs text-slate-300 space-y-3 animate-fadeIn">
                      <div className="space-y-1.5 leading-relaxed">
                        {article.content.map((paragraph, idx) => (
                          <p key={idx} className="text-slate-200 text-[11px]">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {/* Was this helpful? Interactive Feedback Toolbar */}
                      <div className="pt-3 border-t border-purple-900/30 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Was this helpful?</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={e => handleVoteFeedback(e, article.id, true)}
                            className="px-2.5 py-1 rounded-xl bg-purple-950/80 hover:bg-emerald-950/80 text-emerald-300 font-bold flex items-center gap-1 border border-purple-800/40 transition cursor-pointer"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Yes ({article.helpfulCount})</span>
                          </button>
                          <button
                            onClick={e => handleVoteFeedback(e, article.id, false)}
                            className="px-2.5 py-1 rounded-xl bg-purple-950/80 hover:bg-rose-950/80 text-rose-300 font-bold flex items-center gap-1 border border-purple-800/40 transition cursor-pointer"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>No</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </main>

      {/* ── 3. STICKY BOTTOM BUTTON: CONTACT 24/7 VIP SUPPORT ── */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-[#08040F]/90 backdrop-blur-xl border-t border-purple-900/30 flex justify-center z-40 max-w-lg mx-auto">
        <button
          onClick={() => setShowSupportChat(true)}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs shadow-2xl flex items-center justify-center gap-2.5 transition active:scale-[0.98] cursor-pointer"
        >
          <Headphones className="w-4 h-4 text-[#D4AF37]" />
          <span>Contact 24/7 VIP Support</span>
        </button>
      </footer>

      {/* ── 4. 24/7 LIVE VIP SUPPORT CHAT DRAWER ── */}
      {showSupportChat && (
        <div className="fixed inset-0 z-50 bg-[#08040F] text-white flex flex-col animate-fadeIn select-none">
          <header className="sticky top-0 z-40 px-4 py-3.5 bg-[#120A24]/95 backdrop-blur-xl border-b border-purple-900/30 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSupportChat(false)}
                className="p-1.5 rounded-full hover:bg-purple-950/60 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>24/7 VIP Support Concierge</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h1>
                <span className="text-[10px] text-slate-400 font-mono">
                  Ticket #{supportTicket.id} • Status: {supportTicket.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  helpAndFaqEngine.resolveTicket(supportTicket.id);
                  toast.success('Ticket marked as resolved.');
                }}
                className="px-2.5 py-1 rounded-xl bg-purple-950/80 text-purple-300 text-[10px] font-bold hover:bg-purple-900 transition"
              >
                Resolve
              </button>
            </div>
          </header>

          {/* Messages Stream */}
          <div className="flex-1 p-4 max-w-lg mx-auto w-full space-y-3 overflow-y-auto custom-scrollbar">
            {supportTicket.messages.map(msg => {
              const isMe = msg.senderRole === 'USER';

              return (
                <div 
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img 
                      src={msg.senderAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&auto=format'} 
                      alt={msg.senderName} 
                      className="w-8 h-8 rounded-full object-cover border border-purple-600 flex-shrink-0"
                    />
                  )}

                  <div className={`p-3.5 rounded-2xl max-w-[80%] text-xs shadow-md ${
                    isMe 
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-tr-none' 
                      : 'bg-[#1C1631] text-slate-200 border border-purple-900/30 rounded-tl-none'
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold text-purple-200">
                        {msg.senderName}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {msg.createdAt}
                      </span>
                    </div>
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Support Input Bar */}
          <form 
            onSubmit={handleSendSupportMessage}
            className="p-3 bg-[#120A24] border-t border-purple-900/30 flex items-center gap-2 max-w-lg mx-auto w-full"
          >
            <input
              type="text"
              placeholder="Describe your issue or ask for VIP help..."
              value={supportInput}
              onChange={e => setSupportInput(e.target.value)}
              className="flex-1 text-xs px-4 py-2.5 bg-black/40 border border-purple-900/40 rounded-2xl outline-none text-white placeholder-slate-500 font-medium"
            />
            <button
              type="submit"
              className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white transition cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
