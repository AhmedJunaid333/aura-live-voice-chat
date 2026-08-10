import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, Sliders, BarChart3, Users, CheckCircle2, 
  TrendingUp, Activity, ShieldCheck 
} from 'lucide-react';
import { 
  profileDiscoveryEngine, DiscoveryShuffleConfig, ShuffleAnalytics, DiscoverableProfile 
} from '../services/profileDiscoveryService';
import { toast } from '../services/toastAndErrorService';

export const DiscoveryShuffleSection: React.FC = () => {
  const [config, setConfig] = useState<DiscoveryShuffleConfig>(() => profileDiscoveryEngine.getConfig());
  const [analytics, setAnalytics] = useState<ShuffleAnalytics>(() => profileDiscoveryEngine.getAnalytics());
  const [profiles, setProfiles] = useState<DiscoverableProfile[]>(() => profileDiscoveryEngine.getAllProfiles());

  useEffect(() => {
    const sync = () => {
      setConfig(profileDiscoveryEngine.getConfig());
      setAnalytics(profileDiscoveryEngine.getAnalytics());
      setProfiles(profileDiscoveryEngine.getAllProfiles());
    };
    sync();
    const unsub = profileDiscoveryEngine.subscribe(sync);
    return () => unsub();
  }, []);

  const handleToggle = (key: keyof DiscoveryShuffleConfig) => {
    const updated = { ...config, [key]: !config[key] };
    profileDiscoveryEngine.updateConfig(updated);
    toast.success(`Shuffle parameter "${key}" updated.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none text-white text-xs">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
              Recommendation Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Discovery & Anti-Repetition</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Profile Shuffle & Discovery Governance</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure weighted discovery algorithms, anti-repetition memory, and monitor user conversion analytics.
          </p>
        </div>

        <button
          onClick={() => {
            profileDiscoveryEngine.shuffleProfiles('DISCOVER', 4);
            toast.info('Global profile pool re-indexed.');
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs shadow-lg flex items-center gap-1.5 transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Re-Index Pool
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#11162B] border border-indigo-900/30">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Shuffles</span>
          <p className="text-2xl font-black text-white mt-1">{analytics.totalShuffleRequests.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-400 font-bold">100% Real-time</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-cyan-900/30">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Follow Conversions</span>
          <p className="text-2xl font-black text-cyan-300 mt-1">{analytics.followConversions}</p>
          <span className="text-[10px] text-cyan-400/80">Organic friendship</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-amber-900/30">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Skip Rate</span>
          <p className="text-2xl font-black text-amber-300 mt-1">{analytics.skipRate}%</p>
          <span className="text-[10px] text-amber-400/80">Low skip fatigue</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11162B] border border-purple-900/30">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Active Pool</span>
          <p className="text-2xl font-black text-purple-300 mt-1">{profiles.length}</p>
          <span className="text-[10px] text-purple-400/80">Verified accounts</span>
        </div>
      </div>

      {/* Configuration & Analytics Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Rules Card */}
        <div className="bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl space-y-4">
          <span className="font-bold text-white text-sm block border-b border-indigo-900/30 pb-3">
            Recommendation Weighting Rules
          </span>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-indigo-900/30">
              <div>
                <h4 className="font-bold text-white">Online Priority Boost</h4>
                <p className="text-[11px] text-slate-400">Prioritize currently active and online users (+40 weight)</p>
              </div>
              <input
                type="checkbox"
                checked={config.onlinePriority}
                onChange={() => handleToggle('onlinePriority')}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-indigo-900/30">
              <div>
                <h4 className="font-bold text-white">Live Host Priority</h4>
                <p className="text-[11px] text-slate-400">Promote broadcasting audio room hosts (+30 weight)</p>
              </div>
              <input
                type="checkbox"
                checked={config.hostPriority}
                onChange={() => handleToggle('hostPriority')}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-indigo-900/30">
              <div>
                <h4 className="font-bold text-white">VIP Royalty Priority</h4>
                <p className="text-[11px] text-slate-400">Give discoverability exposure to VIP 1-10 supporters</p>
              </div>
              <input
                type="checkbox"
                checked={config.vipPriority}
                onChange={() => handleToggle('vipPriority')}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Top Discovered Profiles Table */}
        <div className="bg-[#11162B] p-5 rounded-3xl border border-indigo-900/30 shadow-xl space-y-4">
          <span className="font-bold text-white text-sm block border-b border-indigo-900/30 pb-3">
            Top Discovered Profiles Ranking
          </span>

          <div className="space-y-2">
            {analytics.topDiscoveredProfiles.map((top, idx) => (
              <div key={top.profileId} className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-indigo-900/30">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-amber-400 text-xs">#{idx + 1}</span>
                  <div>
                    <h4 className="font-bold text-white">{top.username}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">UID: {top.profileId}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-purple-950/80 border border-purple-800/40 text-purple-300 font-black text-xs">
                  {top.count} impressions
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
