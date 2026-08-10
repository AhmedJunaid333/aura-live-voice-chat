'use client';

import React, { useState } from 'react';

export default function AudioRoomsModule() {
  const [rooms, setRooms] = useState([
    { id: 'RM-101', title: '🎙️ Official Aura VIP Lounge #1', host: 'Dimple (UID: 100003)', activeMics: '8 / 8 Seats', onlineAudience: '142 Users', agorachannel: 'channel_room_101', status: 'LIVE' },
    { id: 'RM-102', title: '🎵 Music & Singing Club', host: 'Ayesha_Singer (UID: 100002)', activeMics: '5 / 8 Seats', onlineAudience: '89 Users', agorachannel: 'channel_room_102', status: 'LIVE' },
    { id: 'RM-103', title: '💎 Reseller VIP Meeting Room', host: 'Ahmed Khokhar (UID: 100001)', activeMics: '4 / 8 Seats', onlineAudience: '45 Users', agorachannel: 'channel_room_103', status: 'LIVE' },
  ]);

  const handleCloseRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
    alert(`Audio Room ${id} terminated remotely by Admin!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🎙️ Audio Rooms & Active Lounge Monitor
        </h2>
        <p className="text-xs text-slate-300 mt-1">Real-time Agora RTC audio channel monitoring, active speaker mic seats, room moderation & remote channel termination</p>
      </div>

      {/* Active Rooms Grid */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-purple-400">🔴 Live Audio Lounges ({rooms.length} Active Rooms)</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rooms.map(r => (
            <div key={r.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white text-sm">{r.title}</h4>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/30 animate-pulse">
                  ● LIVE
                </span>
              </div>

              <div className="space-y-1 font-mono text-xs text-slate-300">
                <p><span className="text-slate-500">Host:</span> <strong className="text-purple-300">{r.host}</strong></p>
                <p><span className="text-slate-500">Mics Occupied:</span> <strong className="text-amber-400">{r.activeMics}</strong></p>
                <p><span className="text-slate-500">Live Listeners:</span> <strong className="text-cyan-400">{r.onlineAudience}</strong></p>
                <p className="text-[10px] text-slate-500 truncate">RTC Channel: {r.agorachannel}</p>
              </div>

              <button
                onClick={() => handleCloseRoom(r.id)}
                className="w-full py-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs border border-rose-500/40 transition cursor-pointer"
              >
                🚫 Remote Terminate Room
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
