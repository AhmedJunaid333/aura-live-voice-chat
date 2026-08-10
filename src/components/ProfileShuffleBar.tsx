import React, { useState } from 'react';
import { RefreshCw, Sparkles, UserPlus, Radio, Shield, Heart } from 'lucide-react';
import { profileDiscoveryEngine, DiscoverableProfile } from '../services/profileDiscoveryService';
import { toast } from '../services/toastAndErrorService';

interface Props {
  context?: 'HOME' | 'LIVE' | 'DISCOVER' | 'NEARBY' | 'ROOMS' | 'EXPLORE';
  title?: string;
  subtitle?: string;
  onEnterRoom?: (room: any) => void;
  onSelectProfile?: (profile: DiscoverableProfile) => void;
}

export const ProfileShuffleBar: React.FC<Props> = ({
  context = 'DISCOVER',
  title = 'Discover & Meet Members',
  subtitle = 'Real-time active hosts & VIPs',
  onEnterRoom,
  onSelectProfile,
}) => {
  const [profiles, setProfiles] = useState<DiscoverableProfile[]>(() => 
    profileDiscoveryEngine.shuffleProfiles(context, 4)
  );
  const [isRotating, setIsRotating] = useState(false);

  const handleShuffle = () => {
    if (isRotating) return;
    setIsRotating(true);
    try {
      const fresh = profileDiscoveryEngine.shuffleProfiles(context, 4);
      setProfiles(fresh);
      toast.info('New profiles discovered!');
    } catch (e) {
      toast.error('Unable to refresh profiles. Please try again.');
    } finally {
      setTimeout(() => setIsRotating(false), 400);
    }
  };

  return (
    <section className="px-5 mt-4 space-y-3">
      {/* Header with Shuffle Action */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {title}
          </h3>
          <p className="text-[10px] text-slate-400">{subtitle}</p>
        </div>

        <button
          onClick={handleShuffle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-white text-xs font-black border border-purple-800/40 shadow-md transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin text-amber-300' : ''}`} />
          <span>Shuffle</span>
        </button>
      </div>

      {/* 4 Shuffled Profile Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {profiles.map(p => (
          <div
            key={p.id}
            onClick={() => {
              if (p.isLive && onEnterRoom) {
                onEnterRoom({
                  title: p.liveRoomTitle || `${p.username}'s Audio Stage`,
                  host: p.username,
                  listeners: p.liveListeners || 850,
                  bg: p.avatar,
                  isPK: false,
                });
              } else if (onSelectProfile) {
                onSelectProfile(p);
              } else {
                toast.info(`Viewing ${p.username}'s Profile (${p.countryFlag} ${p.country})`);
              }
            }}
            className="p-3 rounded-2xl bg-[#140D24] border border-purple-900/30 hover:border-purple-500/60 shadow-lg flex flex-col items-center text-center transition cursor-pointer hover:scale-[1.02] group relative overflow-hidden"
          >
            {/* Live Indicator */}
            {p.isLive && (
              <div className="absolute top-2 left-2 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[8px] font-black flex items-center gap-1 shadow-md animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                LIVE
              </div>
            )}

            {/* Profile Avatar */}
            <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-purple-500 to-cyan-400 mb-2 shadow-md">
              <img src={p.avatar} alt={p.username} className="w-full h-full rounded-full object-cover" />
              {p.isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-[#140D24]" />
              )}
            </div>

            {/* Identity Info */}
            <h4 className="font-extrabold text-white text-xs truncate max-w-full">
              {p.username}
            </h4>
            <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-0.5">
              <span>{p.countryFlag}</span>
              <span>Lv.{p.level}</span>
              {p.vipBadge && (
                <span className="px-1 rounded bg-[#D4AF37] text-black font-black text-[8px]">
                  {p.vipBadge}
                </span>
              )}
            </div>

            <p className="text-[10px] text-purple-300/80 truncate w-full mt-1">
              {p.bio}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
