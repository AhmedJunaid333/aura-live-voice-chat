import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, MessageSquare, Send, CheckCircle2, Edit3, Plus, 
  Trash2, Search, RefreshCw, Eye, ThumbsUp, Sparkles, UserCheck 
} from 'lucide-react';
import { 
  helpAndFaqEngine, FaqArticle, SupportTicket, FaqCategory 
} from '../services/helpAndFaqService';
import { toast } from '../services/toastAndErrorService';

export const HelpAndFaqCMSSection: React.FC = () => {
  const [articles, setArticles] = useState<FaqArticle[]>(() => helpAndFaqEngine.getAllAdminArticles());
  const [tickets, setTickets] = useState<SupportTicket[]>(() => helpAndFaqEngine.getAllAdminTickets());
  const [categories, setCategories] = useState<FaqCategory[]>(() => helpAndFaqEngine.getCategories());
  const [activeTab, setActiveTab] = useState<'ARTICLES' | 'SUPPORT_DESK' | 'ANALYTICS'>('ARTICLES');
  const [selectedTicketId, setSelectedTicketId] = useState<string>(() => tickets[0]?.id || '');
  const [adminReplyText, setAdminReplyText] = useState('');

  // New Article Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('cat-wallet');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [newContent, setNewContent] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const sync = () => {
      setArticles(helpAndFaqEngine.getAllAdminArticles());
      setTickets(helpAndFaqEngine.getAllAdminTickets());
      setCategories(helpAndFaqEngine.getCategories());
    };
    sync();
    const unsub = helpAndFaqEngine.subscribe(sync);
    return () => unsub();
  }, []);

  const handleTogglePublish = (id: string) => {
    const isNowPub = helpAndFaqEngine.togglePublish(id);
    toast.success(`FAQ Article is now ${isNowPub ? 'Published' : 'Drafted'}.`);
  };

  const handleDeleteArticle = (id: string) => {
    helpAndFaqEngine.deleteArticle(id);
    toast.info('FAQ article removed.');
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error('Please provide a valid question and answer content.');
      return;
    }

    const paragraphs = newContent.split('\n').filter(p => p.trim().length > 0);

    helpAndFaqEngine.createArticle({
      categoryId: newCategory,
      title: newTitle.trim(),
      shortDescription: newShortDesc.trim() || newTitle.trim(),
      content: paragraphs,
      icon: '💡',
      sortOrder: articles.length + 1,
      isPublished: true,
      isFeatured: false,
      keywords: newTitle.toLowerCase().split(' '),
    });

    toast.success(`Published new FAQ: "${newTitle}"`);
    setNewTitle('');
    setNewShortDesc('');
    setNewContent('');
    setShowCreateModal(false);
  };

  const handleAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedTicketId) return;

    helpAndFaqEngine.sendAgentSupportReply(selectedTicketId, adminReplyText.trim());
    setAdminReplyText('');
    toast.success('Reply dispatched to VIP user support chat.');
  };

  const currentTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];
  const totalViews = articles.reduce((acc, a) => acc + a.viewCount, 0);
  const totalHelpful = articles.reduce((acc, a) => acc + a.helpfulCount, 0);

  return (
    <div className="space-y-6 animate-fadeIn select-none text-white text-xs">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
              Knowledge Base & 24/7 VIP Concierge
            </span>
            <span className="text-xs text-slate-400 font-mono">CMS & Ticket Ops</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Help & FAQ CMS & VIP Support Desk</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Publish knowledge base articles, handle live support inquiries, and analyze user search patterns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs shadow-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create FAQ Article
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#11162B] border border-indigo-900/30">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Published Articles</span>
          <p className="text-2xl font-black text-white mt-1">{articles.filter(a => a.isPublished).length}</p>
          <span className="text-[10px] text-emerald-400 font-bold">100% Mobile Synced</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-cyan-900/30">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Total Article Views</span>
          <p className="text-2xl font-black text-cyan-300 mt-1">{totalViews.toLocaleString()}</p>
          <span className="text-[10px] text-cyan-400/80">Organic resolution</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-amber-900/30">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Helpfulness Rating</span>
          <p className="text-2xl font-black text-amber-300 mt-1">97.8%</p>
          <span className="text-[10px] text-amber-400/80">{totalHelpful.toLocaleString()} positive votes</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-rose-900/30">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">VIP Support Tickets</span>
          <p className="text-2xl font-black text-rose-300 mt-1">{tickets.length}</p>
          <span className="text-[10px] text-rose-400/80">Active concierge queue</span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-2 border-b border-indigo-900/30 pb-2">
        <button
          onClick={() => setActiveTab('ARTICLES')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            activeTab === 'ARTICLES' ? 'bg-purple-600 text-white' : 'bg-black/40 text-slate-400 hover:text-white'
          }`}
        >
          📚 FAQ Articles CMS ({articles.length})
        </button>
        <button
          onClick={() => setActiveTab('SUPPORT_DESK')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            activeTab === 'SUPPORT_DESK' ? 'bg-purple-600 text-white' : 'bg-black/40 text-slate-400 hover:text-white'
          }`}
        >
          🎧 24/7 VIP Support Desk ({tickets.length})
        </button>
      </div>

      {/* TAB 1: FAQ ARTICLES TABLE */}
      {activeTab === 'ARTICLES' && (
        <div className="bg-[#11162B] rounded-3xl border border-indigo-900/30 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-indigo-900/30 flex items-center justify-between">
            <span className="font-bold text-white text-sm">Knowledge Base Articles Ledger</span>
            <span className="text-[10px] text-slate-400 font-mono">Mobile App Synchronized</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/40 text-slate-400 font-bold border-b border-indigo-900/30">
                <tr>
                  <th className="p-4">ID & Icon</th>
                  <th className="p-4">Title & Short Description</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Views & Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-900/20">
                {articles.map(art => (
                  <tr key={art.id} className="hover:bg-indigo-950/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-300">
                      <span className="text-base mr-2">{art.icon}</span>
                      {art.id}
                    </td>
                    <td className="p-4 max-w-sm">
                      <p className="font-bold text-white">{art.title}</p>
                      <p className="text-[11px] text-slate-300 truncate">{art.shortDescription}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                        {categories.find(c => c.id === art.categoryId)?.name || art.categoryId}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white">{art.viewCount.toLocaleString()} views</p>
                      <span className="text-[10px] text-emerald-400">👍 {art.helpfulCount} | 👎 {art.notHelpfulCount}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        art.isPublished ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {art.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleTogglePublish(art.id)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 font-bold text-xs border border-indigo-800/40 transition cursor-pointer"
                      >
                        {art.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: 24/7 VIP SUPPORT TICKETS DESK */}
      {activeTab === 'SUPPORT_DESK' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tickets List */}
          <div className="bg-[#11162B] p-4 rounded-3xl border border-indigo-900/30 shadow-xl space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Live Support Queue ({tickets.length})
            </span>
            {tickets.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`p-3 rounded-2xl border transition cursor-pointer ${
                  selectedTicketId === t.id ? 'bg-purple-950/80 border-purple-500' : 'bg-black/40 border-indigo-900/30 hover:bg-indigo-950/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-indigo-300 text-[10px]">{t.id}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500/20 text-rose-300">
                    {t.priority}
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs mt-1 truncate">{t.userName} ({t.userVipBadge})</h4>
                <p className="text-[11px] text-slate-400 truncate">{t.subject}</p>
              </div>
            ))}
          </div>

          {/* Ticket Messages Stream & Reply */}
          {currentTicket && (
            <div className="md:col-span-2 bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl flex flex-col h-[460px]">
              <div className="border-b border-indigo-900/30 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-sm">
                    {currentTicket.userName} — {currentTicket.subject}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    UID: {currentTicket.userId} • Status: {currentTicket.status}
                  </span>
                </div>

                <button
                  onClick={() => {
                    helpAndFaqEngine.resolveTicket(currentTicket.id);
                    toast.success('Ticket marked as resolved.');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Resolved
                </button>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar my-2">
                {currentTicket.messages.map(msg => (
                  <div key={msg.id} className={`flex items-start gap-2 ${msg.senderRole === 'SUPPORT_AGENT' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[85%] text-xs ${
                      msg.senderRole === 'SUPPORT_AGENT' ? 'bg-indigo-600 text-white' : 'bg-black/60 text-slate-200 border border-indigo-900/40'
                    }`}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-[10px] text-purple-200">{msg.senderName}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{msg.createdAt}</span>
                      </div>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin Reply Form */}
              <form onSubmit={handleAdminReply} className="pt-2 border-t border-indigo-900/30 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type official concierge response..."
                  value={adminReplyText}
                  onChange={e => setAdminReplyText(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-black/40 border border-indigo-900/40 text-white outline-none focus:border-indigo-400 font-medium"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Create Article Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#120A24] border border-purple-900/50 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <h3 className="font-extrabold text-white text-base">Create Knowledge Base FAQ</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-black/40 border border-purple-900/40 text-white focus:outline-none focus:border-purple-400"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Question Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to transfer Family Leader permissions?"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-black/40 border border-purple-900/40 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Steps and cooldown period for guild leadership handovers."
                  value={newShortDesc}
                  onChange={e => setNewShortDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-black/40 border border-purple-900/40 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Answer Content (Paragraphs/Steps)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter numbered steps or explanation paragraphs..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-black/40 border border-purple-900/40 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg"
                >
                  Publish FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
