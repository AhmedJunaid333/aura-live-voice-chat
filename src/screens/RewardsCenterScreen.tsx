import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Gift, Coins, Award, Sparkles, CheckCircle2, 
  ArrowRight, Flame, Trophy, Crown, RefreshCw, Radio, MessageSquare, 
  Users, Heart 
} from 'lucide-react';
import { 
  rewardsEngine, DailyStreakDay, DailyMissionTask, LevelMilestoneReward 
} from '../services/rewardsEngineService';
import { toast } from '../services/toastAndErrorService';

interface Props {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
  onEnterRoom?: (room: any) => void;
}

export default function RewardsCenterScreen({ onBack, onNavigate, onEnterRoom }: Props) {
  const [streakDays, setStreakDays] = useState<DailyStreakDay[]>(() => rewardsEngine.getStreakDays());
  const [missions, setMissions] = useState<DailyMissionTask[]>(() => rewardsEngine.getMissions());
  const [milestones, setMilestones] = useState<LevelMilestoneReward[]>(() => rewardsEngine.getMilestones());
  const [activeTab, setActiveTab] = useState<'STREAK' | 'MISSIONS' | 'MILESTONES'>('STREAK');

  useEffect(() => {
    const sync = () => {
      setStreakDays(rewardsEngine.getStreakDays());
      setMissions(rewardsEngine.getMissions());
      setMilestones(rewardsEngine.getMilestones());
    };
    sync();
    const unsub = rewardsEngine.subscribe(sync);
    return () => unsub();
  }, []);

  const handleClaimStreak = () => {
    const res = rewardsEngine.claimTodayStreak();
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.info(res.message);
    }
  };

  const handleClaimMission = (taskId: string) => {
    const res = rewardsEngine.claimMission(taskId);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.info(res.message);
    }
  };

  const handleClaimMilestone = (level: number) => {
    const res = rewardsEngine.claimMilestone(level);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.info(res.message);
    }
  };

  const todayStreak = streakDays.find(d => d.isToday);
  const totalClaimableMissions = missions.filter(m => !m.claimed && m.currentProgress >= m.targetCount).length;

  return (
    <div className="min-h-screen bg-[#08040F] text-white flex flex-col animate-fadeIn select-none pb-28 relative">
      
      {/* ── 1. TOP APP BAR ── */}
      <header className="sticky top-0 z-50 px-4 py-3.5 bg-[#120A24]/95 backdrop-blur-xl border-b border-purple-900/30 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-purple-950/60 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-white tracking-wide">
            Rewards & Daily Missions
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => toast.success('Rewards ledger synchronized.')}
            className="p-2 rounded-full hover:bg-purple-950/60 text-purple-300 hover:text-white transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── 2. HERO REWARDS BANNER ── */}
      <div className="p-4 max-w-lg mx-auto w-full space-y-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/80 via-[#1B1038] to-[#0A0614] border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                Daily Sign-In Streak
              </span>
              <h2 className="text-xl font-black text-white mt-1">Day 3 Active Streak 🔥</h2>
              <p className="text-[11px] text-slate-300">
                Claim free Coins, Diamonds, and VIP Experience every day.
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-2xl flex-shrink-0 animate-bounce">
              🎁
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-purple-900/40">
            <span className="text-[11px] text-purple-300 font-bold">
              Today's Reward: +1,500 🪙 & +25 💎
            </span>
            <button
              onClick={handleClaimStreak}
              disabled={todayStreak?.claimed}
              className={`px-4 py-2 rounded-xl font-black text-xs shadow-lg transition cursor-pointer ${
                todayStreak?.claimed
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-[#D4AF37] hover:brightness-110 text-black shadow-[#D4AF37]/20 animate-pulse'
              }`}
            >
              {todayStreak?.claimed ? '✓ Claimed Today' : 'Claim Reward ➔'}
            </button>
          </div>
        </div>

        {/* ── 3. SUB NAVIGATION TABS ── */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#140D24] border border-purple-900/30">
          <button
            onClick={() => setActiveTab('STREAK')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'STREAK' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔥 7-Day Streak
          </button>
          <button
            onClick={() => setActiveTab('MISSIONS')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer relative ${
              activeTab === 'MISSIONS' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Daily Tasks
            {totalClaimableMissions > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {totalClaimableMissions}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('MILESTONES')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'MILESTONES' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            👑 VIP Milestones
          </button>
        </div>

        {/* ── TAB 1: 7-DAY STREAK MATRIX ── */}
        {activeTab === 'STREAK' && (
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
              7-Day Continuous Check-In
            </span>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {streakDays.map(day => (
                <div
                  key={day.day}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-between text-center transition-all ${
                    day.isToday
                      ? 'bg-[#1C1631] border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-lg'
                      : day.claimed
                      ? 'bg-purple-950/40 border-purple-900/30 opacity-70'
                      : 'bg-[#140D24] border-purple-900/30'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400">{day.title}</span>
                  <span className="text-xl my-1">{day.icon}</span>
                  <span className="text-[9px] font-black text-amber-300">+{day.coins}</span>

                  <div className="mt-1">
                    {day.claimed ? (
                      <span className="text-[8px] font-bold text-emerald-400">✓ Done</span>
                    ) : day.isToday ? (
                      <span className="text-[8px] font-bold text-[#D4AF37] animate-pulse">Today</span>
                    ) : (
                      <span className="text-[8px] font-bold text-slate-500">Locked</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: DAILY MISSIONS LIST ── */}
        {activeTab === 'MISSIONS' && (
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
              Daily Missions (Resets in 18h)
            </span>

            {missions.map(task => {
              const isComplete = task.currentProgress >= task.targetCount;

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-3xl bg-[#140D24] border border-purple-900/30 flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-xl flex-shrink-0">
                      {task.icon}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-extrabold text-white text-xs leading-snug">
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {task.description}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] font-bold text-amber-300">+{task.rewardCoins} 🪙</span>
                        <span className="text-[9px] font-bold text-cyan-300">+{task.rewardDiamonds} 💎</span>
                        <span className="text-[9px] font-bold text-purple-300">+{task.rewardXp} XP</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {task.claimed ? (
                      <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        ✓ Claimed
                      </span>
                    ) : isComplete ? (
                      <button
                        onClick={() => handleClaimMission(task.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#D4AF37] text-black font-black text-[10px] shadow-md cursor-pointer hover:brightness-110 animate-bounce"
                      >
                        Claim Reward
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (task.deepLink && onNavigate) {
                            onNavigate(task.deepLink);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 font-bold text-[10px] border border-purple-800/40 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{task.currentProgress}/{task.targetCount}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB 3: LEVEL MILESTONES ── */}
        {activeTab === 'MILESTONES' && (
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">
              Account Level & Royalty Milestones
            </span>

            {milestones.map(mile => (
              <div
                key={mile.level}
                className="p-4 rounded-3xl bg-[#140D24] border border-purple-900/30 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-[#D4AF37]/40 flex items-center justify-center text-xl flex-shrink-0">
                    👑
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.2 rounded-full bg-[#D4AF37] text-black text-[9px] font-black">
                        Level {mile.level}
                      </span>
                      <h4 className="font-bold text-white text-xs truncate">
                        {mile.title}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      Reward: +{mile.diamonds.toLocaleString()} Diamonds {mile.avatarFrame && `• ${mile.avatarFrame}`}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {mile.claimed ? (
                    <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 text-emerald-400 text-[10px] font-bold">
                      ✓ Claimed
                    </span>
                  ) : mile.unlocked ? (
                    <button
                      onClick={() => handleClaimMilestone(mile.level)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#D4AF37] text-black font-black text-[10px] shadow-md cursor-pointer hover:brightness-110"
                    >
                      Claim Milestone
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-black/40 text-slate-500 text-[10px] font-bold border border-slate-800">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
