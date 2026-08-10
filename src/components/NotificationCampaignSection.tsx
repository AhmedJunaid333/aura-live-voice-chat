import React, { useState, useEffect } from 'react';
import { 
  Bell, Send, Radio, MessageSquare, Gift, Volume2, 
  Search, RefreshCw, Eye, CheckCircle2, AlertTriangle, Users, Globe, ExternalLink 
} from 'lucide-react';
import { 
  notificationEngine, AdminPushCampaign, NotificationType 
} from '../services/notificationEngineService';
import { toast } from '../services/toastAndErrorService';

export const NotificationCampaignSection: React.FC = () => {
  const [campaigns, setCampaigns] = useState<AdminPushCampaign[]>(() => 
    notificationEngine.getAdminCampaigns()
  );
  
  // New Campaign Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState<NotificationType>('SYSTEM_NOTIFICATION');
  const [targetAudience, setTargetAudience] = useState<'ALL_USERS' | 'VIP_USERS' | 'HOSTS' | 'AGENCIES' | 'FAMILIES' | 'COUNTRY_PK'>('ALL_USERS');
  const [deepLink, setDeepLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const sync = () => {
      setCampaigns(notificationEngine.getAdminCampaigns());
    };
    sync();
    const unsub = notificationEngine.subscribe(sync);
    return () => unsub();
  }, []);

  const handleBroadcastCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error('Please specify both campaign title and message body.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const camp = notificationEngine.createAdminCampaign({
        title: title.trim(),
        body: body.trim(),
        type,
        targetAudience,
        deepLink: deepLink.trim() || undefined,
        status: 'COMPLETED',
      });

      toast.success(`Push Campaign "${camp.title}" broadcasted to ${camp.sentCount.toLocaleString()} devices!`);
      setTitle('');
      setBody('');
      setDeepLink('');
      setIsSubmitting(false);
    }, 400);
  };

  const totalDelivered = campaigns.reduce((acc, c) => acc + c.deliveredCount, 0);
  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);

  return (
    <div className="space-y-6 animate-fadeIn select-none text-white text-xs">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
              Omnichannel Messaging & Push Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">FCM & APNs Integration</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Push Notification Campaigns & Delivery Governance</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Broadcast platform-wide system alerts, targeted host notifications, VIP promotions, and monitor delivery analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success('Push notification delivery metrics synchronized.')}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 text-xs font-bold border border-indigo-800/40 flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Metrics
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#11162B] border border-indigo-900/30">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Delivered</span>
          <p className="text-2xl font-black text-white mt-1">{totalDelivered.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-400 font-bold">98.6% Success Rate</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-cyan-900/30">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Active Campaigns</span>
          <p className="text-2xl font-black text-cyan-300 mt-1">{campaigns.length}</p>
          <span className="text-[10px] text-cyan-400/80">Scheduled & Broadcast</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-amber-900/30">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Sound & Vibrate</span>
          <p className="text-2xl font-black text-amber-300 mt-1">Enabled</p>
          <span className="text-[10px] text-amber-400/80">Web Audio synthesis active</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-rose-900/30">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Failed / Undelivered</span>
          <p className="text-2xl font-black text-rose-300 mt-1">{(totalSent - totalDelivered).toLocaleString()}</p>
          <span className="text-[10px] text-slate-400">Tokens expired/cleaned</span>
        </div>
      </div>

      {/* Campaign Creator Card */}
      <div className="p-6 rounded-3xl bg-[#11162B] border border-indigo-900/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-indigo-900/30 pb-3 text-indigo-300">
          <Send className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-extrabold text-white text-base">Broadcast Real-Time Push Campaign</h3>
        </div>

        <form onSubmit={handleBroadcastCampaign} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl bg-black/40 border border-indigo-900/40 text-white focus:outline-none focus:border-indigo-400"
              >
                <option value="ALL_USERS">All Platform Users (15,420 Devices)</option>
                <option value="VIP_USERS">VIP Royalty Members (Tier 5 - 10)</option>
                <option value="HOSTS">Verified Live Stream Hosts</option>
                <option value="AGENCIES">Guild & Agency Owners</option>
                <option value="FAMILIES">Family Guild Members</option>
                <option value="COUNTRY_PK">Pakistan Cohort (PK)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Notification Category</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl bg-black/40 border border-indigo-900/40 text-white focus:outline-none focus:border-indigo-400"
              >
                <option value="SYSTEM_NOTIFICATION">System Announcement 📣</option>
                <option value="FOLLOWING_USER_STARTED_LIVE">Live Stream Broadcast Alert 🔴</option>
                <option value="GIFT_RECEIVED">Gift Reward & Bonus 🎁</option>
                <option value="AGENCY_NOTIFICATION">Agency Operations Notice 🏢</option>
                <option value="FAMILY_NOTIFICATION">Family Battle Rally 🦁</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Deep Link / Navigation Route</label>
              <input
                type="text"
                placeholder="e.g. live/room-100888, wallet/gifts"
                value={deepLink}
                onChange={e => setDeepLink(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-black/40 border border-indigo-900/40 text-white focus:outline-none focus:border-indigo-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">Campaign Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Weekend Double Diamonds Fiesta! 💎"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-black/40 border border-indigo-900/40 text-white focus:outline-none focus:border-indigo-400 font-bold"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">Notification Body Content</label>
            <textarea
              rows={2}
              required
              placeholder="Enter push alert message description..."
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-black/40 border border-indigo-900/40 text-white focus:outline-none focus:border-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white font-black text-xs shadow-xl transition hover:scale-[1.01] cursor-pointer"
          >
            {isSubmitting ? 'Broadcasting via Push Engine...' : '⚡ Dispatch Live Push Campaign ➔'}
          </button>
        </form>
      </div>

      {/* Campaigns History Table */}
      <div className="bg-[#11162B] rounded-3xl border border-indigo-900/30 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-indigo-900/30 flex items-center justify-between">
          <span className="font-bold text-white text-sm">Campaigns Dispatch & Delivery Ledger</span>
          <span className="text-[10px] text-slate-400 font-mono">FCM / APNs Multi-Cast</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-slate-400 font-bold border-b border-indigo-900/30">
              <tr>
                <th className="p-4">Campaign ID</th>
                <th className="p-4">Title & Content</th>
                <th className="p-4">Target Audience</th>
                <th className="p-4">Delivered</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-900/20">
              {campaigns.map(camp => (
                <tr key={camp.id} className="hover:bg-indigo-950/20 transition-colors">
                  <td className="p-4 font-mono font-bold text-indigo-300">
                    {camp.id}
                  </td>
                  <td className="p-4 max-w-sm">
                    <p className="font-bold text-white">{camp.title}</p>
                    <p className="text-[11px] text-slate-300 truncate">{camp.body}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800/40">
                      {camp.targetAudience}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-emerald-400">
                      {camp.deliveredCount.toLocaleString()} / {camp.sentCount.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {camp.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono text-slate-400 text-[10px]">
                    {camp.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
