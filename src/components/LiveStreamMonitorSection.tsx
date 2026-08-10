import { useState, useEffect } from 'react';
import { adminDb, type LiveRoomRecord } from '../services/adminEnterpriseDataService';

export function LiveStreamMonitorSection() {
  const [rooms, setRooms] = useState<LiveRoomRecord[]>(adminDb.getRooms());
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activePKSim, setActivePKSim] = useState<{ [roomId: string]: { hostScore: number; oppScore: number } }>({});

  useEffect(() => {
    return adminDb.subscribe(() => {
      setRooms(adminDb.getRooms());
    });
  }, []);

  const handleSimulateGift = (roomId: string, amount: number) => {
    setActivePKSim(prev => {
      const current = prev[roomId] || { hostScore: 210000, oppScore: 184000 };
      return {
        ...prev,
        [roomId]: {
          hostScore: current.hostScore + amount,
          oppScore: current.oppScore + Math.floor(amount * 0.8),
        },
      };
    });
  };

  const filteredRooms = rooms.filter(r => selectedCategory === 'ALL' || r.category === selectedCategory);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-cyan-900/40 border border-indigo-500/30 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/30">
              🟢 Live Stream Governance
            </span>
            <span className="text-xs text-slate-400 font-mono">10, 15 & 20 Seat Audio Lounges</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            🎙️ Live Room Stream Monitor & PK Battle Arena
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Real-time multi-seat mic management, live audio telemetry, seat locking/muting, 1v1 PK tournament score controller, and emergency broadcast killswitch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'Music', 'Gaming PK', 'Talk Show'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Active Streams Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {filteredRooms.map(room => {
          const pkScores = activePKSim[room.id] || {
            hostScore: room.pkMyScore || 210000,
            oppScore: room.pkOpponent?.score || 184000,
          };
          const totalPk = pkScores.hostScore + pkScores.oppScore;
          const hostPercent = Math.round((pkScores.hostScore / totalPk) * 100);

          return (
            <div
              key={room.id}
              className="bg-[#111927] border border-[#1E293B] hover:border-indigo-500/50 rounded-3xl p-5 shadow-2xl transition space-y-4"
            >
              {/* Top Room Banner */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={room.host.avatar} alt={room.host.name} className="w-12 h-12 rounded-2xl border-2 border-indigo-500 object-cover" />
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-[8px] font-black text-white">
                      LIVE
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">{room.id}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[9px] font-bold text-slate-300">{room.category}</span>
                    </div>
                    <h3 className="font-extrabold text-white text-base leading-tight mt-0.5">{room.title}</h3>
                    <p className="text-[10px] text-slate-400">Host: <b>{room.host.name}</b> (UID: {room.host.id})</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold">
                    👥 {room.listeners.toLocaleString()} Listeners
                  </span>
                  <div className="text-[10px] text-emerald-400 font-bold">🪙 {room.giftRevenueCoins.toLocaleString()} Coins</div>
                </div>
              </div>

              {/* PK Battle Bar (If active) */}
              {room.isPK && (
                <div className="bg-slate-900/90 border border-red-500/40 rounded-2xl p-3 space-y-2">
                  <div className="flex justify-between items-center text-xs font-black">
                    <span className="text-cyan-400 flex items-center gap-1">
                      <span>🔵 {room.host.name}</span>
                      <span className="text-white font-mono">({pkScores.hostScore.toLocaleString()})</span>
                    </span>
                    <span className="text-amber-400 text-sm">⚔️ PK CLASH ⚔️</span>
                    <span className="text-rose-400 flex items-center gap-1">
                      <span className="text-white font-mono">({pkScores.oppScore.toLocaleString()})</span>
                      <span>{room.pkOpponent?.name} 🔴</span>
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-rose-600 overflow-hidden flex">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{ width: `${hostPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[9px] text-slate-400">PK Match Multiplier: <b>3x Gold Surge</b></span>
                    <button
                      onClick={() => handleSimulateGift(room.id, 50000)}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black cursor-pointer hover:scale-105 transition"
                    >
                      🚀 Boost PK (+50k Coins)
                    </button>
                  </div>
                </div>
              )}

              {/* Seats Matrix (10, 15 or 20 Seats) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-300">
                    🎙️ Multi-Seat Mic Matrix ({room.seatCount} Total Seats)
                  </span>
                  <span className="text-[10px] text-slate-500">Click Seat to Lock / Mute</span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {Array.from({ length: room.seatCount }).map((_, idx) => {
                    const seatNum = idx + 1;
                    const isLocked = room.lockedSeats.includes(seatNum);
                    const isMuted = room.mutedSeats.includes(seatNum);

                    return (
                      <div
                        key={seatNum}
                        onClick={() => adminDb.toggleSeatLock(room.id, seatNum)}
                        className={`h-12 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition select-none ${
                          isLocked
                            ? 'bg-rose-950/40 border-rose-600/60 text-rose-400'
                            : isMuted
                            ? 'bg-amber-950/40 border-amber-600/60 text-amber-400'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-indigo-500'
                        }`}
                        title={`Seat #${seatNum} • ${isLocked ? 'LOCKED' : isMuted ? 'MUTED' : 'OPEN'}`}
                      >
                        <span className="text-[10px] font-bold">{isLocked ? '🔒' : isMuted ? '🔇' : `#${seatNum}`}</span>
                        <span className="text-[8px] text-slate-500 mt-0.5">{isLocked ? 'Lock' : 'Mic'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Controls */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => alert(`Broadcasting system treasure chest to ${room.title}!`)}
                  className="py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold border border-amber-500/40 transition cursor-pointer"
                >
                  🎁 Treasure Box
                </button>
                <button
                  onClick={() => adminDb.toggleSeatMute(room.id, 1)}
                  className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition cursor-pointer"
                >
                  🔇 Mute Host
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to trigger killswitch on ${room.title}?`)) {
                      adminDb.closeRoom(room.id);
                    }
                  }}
                  className="py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold border border-rose-600/40 transition cursor-pointer"
                >
                  ⛔ Killswitch End
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
