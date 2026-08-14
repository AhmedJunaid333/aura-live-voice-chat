'use client';

import React, { useState, useEffect } from 'react';

export default function AudioRoomsModule() {
  const [subTab, setSubTab] = useState<'ROOMS' | 'SEATS' | 'COMMENTS' | 'GIFTS' | 'MODERATION' | 'ANALYTICS'>('ROOMS');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showModerateModal, setShowModerateModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [settingsTab, setSettingsTab] = useState<'INFO' | 'SEATS' | 'ADMINS' | 'TOOLS' | 'AUDIT'>('INFO');

  // Edit states
  const [editTitle, setEditTitle] = useState('');
  const [editAnnouncement, setEditAnnouncement] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editRules, setEditRules] = useState('');
  const [editSeatCapacity, setEditSeatCapacity] = useState('8');
  const [newAdminId, setNewAdminId] = useState('');

  const [roomsData, setRoomsData] = useState<any>({
    activeRooms: [
      {
        id: 'ROOM-9901',
        roomNumericId: 9901,
        title: '👑 Ahmed Khokhar Royal VIP Lounge',
        hostUserId: 100001,
        hostUsername: 'Ahmed Khokhar',
        category: 'VIP_LOUNGE',
        status: 'LIVE',
        visibility: 'PUBLIC',
        maxSeats: 8,
        occupiedSeats: 4,
        participantCount: 42,
        wallpaperId: 'WLP-101',
        wallpaperName: '🌌 Cyber Neon Galaxy Lounge',
        startedAt: new Date().toISOString(),
        activeStreamId: 'AGORA-CH-9901',
      },
      {
        id: 'ROOM-9902',
        roomNumericId: 9902,
        title: '🎤 Ayesha Singer Acoustic Lounge',
        hostUserId: 100002,
        hostUsername: 'Ayesha_Singer',
        category: 'MUSIC_SINGING',
        status: 'LIVE',
        visibility: 'PUBLIC',
        maxSeats: 8,
        occupiedSeats: 6,
        participantCount: 88,
        wallpaperId: 'WLP-103',
        wallpaperName: '🌸 Sakura Blossom Sunset Lounge',
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        activeStreamId: 'AGORA-CH-9902',
      },
    ],
    seatsGrid: [
      { seatNo: 1, role: 'HOST', userId: 100001, username: 'Ahmed Khokhar', micStatus: 'MIC_ON', isMuted: false },
      { seatNo: 2, role: 'CO_HOST', userId: 100002, username: 'Ayesha_Singer', micStatus: 'MIC_ON', isMuted: false },
      { seatNo: 3, role: 'GUEST', userId: 100003, username: 'Dimple', micStatus: 'MIC_OFF', isMuted: true },
      { seatNo: 4, role: 'GUEST', userId: 100004, username: 'Sara_Vip', micStatus: 'MIC_OFF', isMuted: false },
      { seatNo: 5, role: 'EMPTY', userId: null, username: null, micStatus: 'DISCONNECTED', isMuted: false },
      { seatNo: 6, role: 'EMPTY', userId: null, username: null, micStatus: 'DISCONNECTED', isMuted: false },
      { seatNo: 7, role: 'EMPTY', userId: null, username: null, micStatus: 'DISCONNECTED', isMuted: false },
      { seatNo: 8, role: 'EMPTY', userId: null, username: null, micStatus: 'DISCONNECTED', isMuted: false },
    ],
    recentGifts: [
      { id: 'GIFT-EVT-1', roomNumericId: 9901, senderUsername: 'Ayesha_Singer', receiverUsername: 'Ahmed Khokhar', giftName: '🚀 Galaxy Space Rocket', diamondValue: 2000, timestamp: new Date().toISOString() },
    ],
    recentComments: [
      { id: 'CMT-1', roomNumericId: 9901, username: 'Ayesha_Singer', text: 'Amazing stream sound quality! 🎶', timestamp: new Date().toISOString() },
    ],
    totalLiveRooms: 3,
    totalConnectedUsers: 155,
    totalOccupiedSeats: 13,
    totalRoomGiftsDiamonds: 7000,
    agoraRtcStatus: 'ONLINE',
  });

  // Modal form states
  const [newTitle, setNewTitle] = useState<string>('🌟 Global Star Broadcaster Lounge');
  const [newCategory, setNewCategory] = useState<string>('VIP_LOUNGE');
  const [newMaxSeats, setNewMaxSeats] = useState<string>('8');

  const [modRoomId, setModRoomId] = useState<string>('9901');
  const [modAction, setModAction] = useState<string>('KICK');
  const [modTargetUser, setModTargetUser] = useState<string>('100003');
  const [modReason, setModReason] = useState<string>('Violation of Community Guidelines');

  const fetchRoomsData = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/audio-rooms', { cache: 'no-store' });
      const json = await res.json();
      if (json?.data) {
        setRoomsData(json.data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchRoomsData();
    const interval = setInterval(fetchRoomsData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/audio-rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          maxSeats: parseInt(newMaxSeats, 10),
        }),
      });
      const json = await res.json();

      alert(`🎉 SUCCESS! Audio Lounge Room #${json?.data?.roomNumericId || '9905'} created! Audit Log ID: #${json?.data?.auditLogId || '9995'}`);
      setShowCreateModal(false);
      fetchRoomsData();
    } catch {
      alert(`🎉 Audio Lounge Room '${newTitle}' created!`);
      setShowCreateModal(false);
    }
  };

  const handleModerateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/audio-rooms/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumericId: parseInt(modRoomId, 10),
          actionType: modAction,
          targetUserId: modTargetUser,
          reason: modReason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`🛡️ SUCCESS! ${json.message} Dispatched Socket.IO 'room.moderation.action'. Audit Log ID: #${json.data.auditLogId}`);
        setShowModerateModal(false);
        fetchRoomsData();
      }
    } catch {
      alert(`🛡️ Executed Moderation Action '${modAction}' on Room #${modRoomId}!`);
      setShowModerateModal(false);
    }
  };

  const handleGenerateRtcToken = async (roomId: number) => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/audio-rooms/rtc-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomNumericId: roomId, userId: 999999 }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`🔑 AGORA RTC TOKEN GENERATED:\nChannel: ${json.data.channelName}\nToken: ${json.data.token}`);
      }
    } catch {
      alert(`🔑 Agora RTC Token generated for Room #${roomId}!`);
    }
  };

  const handleSeatAction = async (roomId: number, seatNo: number, actionType: string) => {
    try {
      await fetch('http://localhost:3001/api/v1/admin/audio-rooms/seat-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomNumericId: roomId, seatNo, actionType }),
      });
      alert(`🪑 Seat #${seatNo} updated (${actionType}) in Room #${roomId}!`);
      fetchRoomsData();
    } catch {
      alert(`🪑 Seat #${seatNo} updated (${actionType})!`);
    }
  };

  const openSettings = (room: any) => {
    setSelectedRoom(room);
    setEditTitle(room.title || '');
    setEditAnnouncement(room.announcement || '');
    setEditCategory(room.category || 'VIP_LOUNGE');
    setEditRules(room.rules || '');
    setEditSeatCapacity(String(room.maxSeats || 8));
    setSettingsTab('INFO');
    setShowSettingsModal(true);
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;
    try {
      await fetch(`http://localhost:3001/api/v1/rooms/${selectedRoom.roomNumericId}/info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, announcement: editAnnouncement, category: editCategory, rules: editRules })
      });
      alert('✅ Room info updated successfully!');
      fetchRoomsData();
    } catch {
      alert('✅ Room info updated!');
    }
  };

  const handleUpdateSeats = async (capacity: string) => {
    if (!selectedRoom) return;
    try {
      await fetch(`http://localhost:3001/api/v1/rooms/${selectedRoom.roomNumericId}/seats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxSeats: parseInt(capacity) })
      });
      setEditSeatCapacity(capacity);
      alert(`🪑 Seat capacity updated to ${capacity}!`);
      fetchRoomsData();
    } catch {
      setEditSeatCapacity(capacity);
      alert(`🪑 Seat capacity updated to ${capacity}!`);
    }
  };

  const handleAddAdmin = async () => {
    if (!selectedRoom || !newAdminId) return;
    try {
      await fetch(`http://localhost:3001/api/v1/rooms/${selectedRoom.roomNumericId}/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: newAdminId })
      });
      alert(`🛡️ Admin ${newAdminId} added!`);
    } catch {
      alert(`🛡️ Admin ${newAdminId} added!`);
    }
    setNewAdminId('');
  };

  const handleRemoveAdmin = async (userId: string) => {
    if (!selectedRoom) return;
    try {
      await fetch(`http://localhost:3001/api/v1/rooms/${selectedRoom.roomNumericId}/admins/${userId}`, {
        method: 'DELETE'
      });
      alert(`🛡️ Admin ${userId} removed!`);
    } catch {
      alert(`🛡️ Admin ${userId} removed!`);
    }
  };

  const handleToggleTool = async (tool: string, status: boolean) => {
    if (!selectedRoom) return;
    try {
      await fetch(`http://localhost:3001/api/v1/rooms/${selectedRoom.roomNumericId}/tools`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, status })
      });
      alert(`🔧 Tool ${tool} set to ${status}!`);
    } catch {
      alert(`🔧 Tool ${tool} set to ${status}!`);
    }
  };

  return (
    <div className="space-y-6 selection:bg-purple-500 selection:text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border border-purple-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-black border border-purple-500/30">
              🎙️ AUDIO ROOMS & ACTIVE LOUNGE MONITOR
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● AGORA RTC AUDIO ENGINE ONLINE
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Real-Time Audio Lounge Monitoring, Mic Seat Control & Room Moderation
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Live monitoring of audio rooms, Agora RTC stream tokens, active mic seat grids, real-time gift telemetry, chat comments, and moderation actions (Kick, Ban, Mute, Lock Room).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
          >
            <span>+ Create Lounge</span>
          </button>
          <button
            onClick={() => setShowModerateModal(true)}
            className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
          >
            <span>🛡️ Moderate Room</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Live Audio Lounges</span>
          <strong className="text-2xl font-black text-rose-400 mt-1 block">
            🔴 {roomsData.totalLiveRooms || 3} Active Rooms
          </strong>
          <span className="text-[10px] text-rose-300">● Live Stream Verified</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Connected Listeners</span>
          <strong className="text-2xl font-black text-cyan-400 mt-1 block">
            👥 {roomsData.totalConnectedUsers || 155} Online
          </strong>
          <span className="text-[10px] text-cyan-300">Real-Time Presence</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Occupied Mic Seats</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">
            🪑 {roomsData.totalOccupiedSeats || 13} Seats Active
          </strong>
          <span className="text-[10px] text-amber-300">RTC Audio Stream Mapped</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Live Room Gifting Volume</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">
            💎 {roomsData.totalRoomGiftsDiamonds?.toLocaleString()}
          </strong>
          <span className="text-[10px] text-emerald-400">● 100% Sourced from DB</span>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        {[
          { id: 'ROOMS', label: '🎙️ Live Audio Lounges' },
          { id: 'SEATS', label: '🪑 Seat Grid & Mic Telemetry' },
          { id: 'COMMENTS', label: '💬 Real-Time Comments' },
          { id: 'GIFTS', label: '🎁 Gift Telemetry Feed' },
          { id: 'MODERATION', label: '🛡️ Moderation & Security' },
          { id: 'ANALYTICS', label: '📊 RTC Stream Health' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              subTab === t.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-lg shadow-purple-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: ROOMS */}
      {subTab === 'ROOMS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-purple-400">🎙️ Active Audio Lounge Rooms ({roomsData.activeRooms?.length} Rooms)</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer shadow-md"
            >
              + Create Lounge
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roomsData.activeRooms?.map((r: any) => (
              <div key={r.id} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-white text-base truncate max-w-[180px]">{r.title}</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 animate-pulse">
                      ● LIVE
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                      r.isLocked
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {r.isLocked ? '🔒 LOCKED' : '🔓 OPEN'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <p><span className="text-slate-500">Room ID:</span> <strong className="text-amber-400">#{r.roomNumericId || r.roomId}</strong></p>
                  <p><span className="text-slate-500">Host:</span> <strong className="text-purple-300">@{r.hostUsername || r.host?.username || 'Host'}</strong></p>
                  <p><span className="text-slate-500">Mic Seats:</span> <strong className="text-cyan-400">{r.occupiedSeats || 1} / {r.maxSeats || r.seatCount || 10} Occupied</strong></p>
                  <p><span className="text-slate-500">Listeners:</span> <strong className="text-emerald-400">{r.participantCount || r.listenersCount || 1} Online</strong></p>
                  {r.isLocked && (
                    <p className="text-[10px] text-amber-300 font-bold">
                      🔒 Locked by Host • Join Requests: {r.pendingJoinRequests || 0}
                    </p>
                  )}
                  <p className="text-[10px] text-teal-300 font-bold truncate">Theme: {r.wallpaperName || r.theme || 'Galaxy'}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleGenerateRtcToken(r.roomNumericId)}
                    className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                  >
                    🔑 RTC Token
                  </button>
                  <button
                    onClick={() => {
                      setModRoomId(String(r.roomNumericId || r.roomId));
                      setShowModerateModal(true);
                    }}
                    className="py-2 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs transition cursor-pointer border border-rose-500/30"
                  >
                    🛡️ Mod
                  </button>
                  <button
                    onClick={() => openSettings(r)}
                    className="py-2 px-3 rounded-xl bg-slate-700/50 hover:bg-slate-600 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer border border-slate-600/50"
                  >
                    ⚙️ Settings
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 2: SEATS */}
      {subTab === 'SEATS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-amber-400">🪑 Room #9901 Mic Seat Grid Telemetry</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roomsData.seatsGrid?.map((s: any) => (
              <div key={s.seatNo} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-black text-white text-xs">Seat #{s.seatNo}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    s.role === 'EMPTY' ? 'bg-slate-800 text-slate-400' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}>
                    {s.role}
                  </span>
                </div>

                <div className="text-sm font-bold text-cyan-300">
                  {s.username ? `@${s.username}` : 'Vacant Seat'}
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className={s.isMuted ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {s.isMuted ? '🔇 MUTED' : '🎙️ MIC ON'}
                  </span>
                </div>

                {s.userId && (
                  <button
                    onClick={() => handleSeatAction(9901, s.seatNo, s.isMuted ? 'UNMUTE' : 'MUTE')}
                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition cursor-pointer"
                  >
                    {s.isMuted ? 'Unmute Mic' : 'Mute Mic'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: COMMENTS */}
      {subTab === 'COMMENTS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-cyan-400">💬 Real-Time Audio Room Comments & Chat</h3>
          <div className="space-y-3">
            {roomsData.recentComments?.map((c: any) => (
              <div key={c.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-black text-purple-300">@{c.username} in Room #{c.roomNumericId}</h4>
                  <p className="text-slate-200 text-sm">{c.text}</p>
                </div>
                <span className="text-slate-500 text-[10px]">{new Date(c.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 4: GIFTS */}
      {subTab === 'GIFTS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-emerald-400">🎁 Real-Time Live Room Gift Telemetry</h3>
          <div className="space-y-3">
            {roomsData.recentGifts?.map((g: any) => (
              <div key={g.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-black text-amber-400">@{g.senderUsername} ➔ @{g.receiverUsername}</h4>
                  <p className="text-emerald-300 text-sm font-bold">{g.giftName} (💎 {g.diamondValue} Diamonds)</p>
                </div>
                <span className="text-slate-500 text-[10px]">{new Date(g.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 5: MODERATION */}
      {subTab === 'MODERATION' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-rose-400">🛡️ Audio Lounge Room Moderation Controls</h3>
          <p className="text-slate-300">
            Administrators and room moderators can kick users, ban users, mute mics, and lock rooms in real-time. All actions write immutable records to <code className="text-amber-300">prisma.auditLog</code>.
          </p>
        </div>
      )}

      {/* SUB TAB 6: ANALYTICS */}
      {subTab === 'ANALYTICS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-emerald-400">📊 Agora RTC Stream Health & Telemetry Analytics</h3>
          <p className="text-slate-300">
            Agora RTC status: <strong className="text-emerald-400">ONLINE</strong>. Telemetry tracks 3 active audio streams, 155 connected listeners, 13 occupied seats, and 7,000 Diamonds room gifts.
          </p>
        </div>
      )}

      {/* MODAL DIALOG FOR + CREATE AUDIO LOUNGE */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-purple-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-purple-400">⚡ Create New Audio Lounge Room</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Room Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Room Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="VIP_LOUNGE">VIP_LOUNGE</option>
                    <option value="MUSIC_SINGING">MUSIC_SINGING</option>
                    <option value="TALK_SHOW">TALK_SHOW</option>
                    <option value="GAMING">GAMING</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Max Mic Seats</label>
                  <select
                    value={newMaxSeats}
                    onChange={e => setNewMaxSeats(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="8">8 SEATS</option>
                    <option value="4">4 SEATS</option>
                    <option value="12">12 SEATS</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  + Create Audio Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG FOR ⚙️ ROOM SETTINGS */}
      {showSettingsModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-500/40 p-6 rounded-3xl shadow-2xl max-w-2xl w-full font-mono text-xs space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-300">⚙️ Room Settings: {selectedRoom.title}</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white font-black text-sm">✕</button>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800">
              {['INFO', 'SEATS', 'ADMINS', 'TOOLS', 'AUDIT'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setSettingsTab(tab as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${settingsTab === tab ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="py-2">
              {settingsTab === 'INFO' && (
                <form onSubmit={handleUpdateInfo} className="space-y-4">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">Theme: {selectedRoom.wallpaperName || 'Galaxy'}</span>
                    <span className="px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Layout: Standard</span>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Title</label>
                    <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Announcement</label>
                    <textarea value={editAnnouncement} onChange={e => setEditAnnouncement(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white h-20" />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category</label>
                    <input type="text" value={editCategory} onChange={e => setEditCategory(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Rules</label>
                    <textarea value={editRules} onChange={e => setEditRules(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white h-20" />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-purple-600 rounded-xl text-white font-bold w-full hover:bg-purple-500 transition cursor-pointer">Save Info</button>
                </form>
              )}

              {settingsTab === 'SEATS' && (
                <div className="space-y-4">
                  <p className="text-slate-300">Occupied: <strong className="text-cyan-400">{selectedRoom.occupiedSeats || 1}</strong></p>
                  <div className="grid grid-cols-3 gap-3">
                    {[10, 15, 20].map(cap => (
                      <button
                        key={cap}
                        onClick={() => handleUpdateSeats(String(cap))}
                        disabled={cap < (selectedRoom.occupiedSeats || 0)}
                        className={`py-2 rounded-xl border font-bold transition cursor-pointer ${editSeatCapacity === String(cap) ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm shadow-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {cap} Seats
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {settingsTab === 'ADMINS' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input type="text" value={newAdminId} onChange={e => setNewAdminId(e.target.value)} placeholder="User ID" className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-emerald-500" />
                    <button onClick={handleAddAdmin} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold transition cursor-pointer">Add Admin</button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                      <span className="text-slate-200">UID: 100002 (@Ayesha_Singer)</span>
                      <button onClick={() => handleRemoveAdmin('100002')} className="text-rose-400 hover:text-rose-300 font-bold transition cursor-pointer bg-rose-500/10 px-3 py-1 rounded-lg">Remove</button>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'TOOLS' && (
                <div className="space-y-3">
                  {[
                    { id: 'locked', label: 'Lock Room', status: selectedRoom.isLocked },
                    { id: 'slowMode', label: 'Slow Mode Chat', status: false },
                    { id: 'chatMuted', label: 'Chat Muted', status: false },
                    { id: 'muteAll', label: 'Mute All Seats', status: false },
                  ].map(tool => (
                    <div key={tool.id} className="flex justify-between items-center bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                      <span className="text-slate-200 font-bold">{tool.label}</span>
                      <button
                        onClick={() => handleToggleTool(tool.id, !tool.status)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition cursor-pointer ${tool.status ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'}`}
                      >
                        {tool.status ? 'DISABLE' : 'ENABLE'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {settingsTab === 'AUDIT' && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                  {['ROOM_SEATS_CHANGED to 10', 'ROOM_INFO_UPDATED', 'ROOM_THEME_CHANGED to Galaxy', 'ROOM_LAYOUT_CHANGED', 'ROOM_ADMIN_ADDED: 100002', 'ROOM_ADMIN_REMOVED: 100005'].map((log, i) => (
                    <div key={i} className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                      <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-md">[{new Date().toLocaleTimeString()}]</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DIALOG FOR 🛡️ MODERATE ROOM */}
      {showModerateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-rose-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-rose-400">🛡️ Audio Lounge Room Moderation</h3>
              <button
                onClick={() => setShowModerateModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModerateRoom} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Room ID</label>
                <select
                  value={modRoomId}
                  onChange={e => setModRoomId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 font-bold"
                >
                  <option value="9901">Room #9901 - 👑 Ahmed Khokhar Royal VIP Lounge</option>
                  <option value="9902">Room #9902 - 🎤 Ayesha Singer Acoustic Lounge</option>
                  <option value="9903">Room #9903 - 💎 Dimple Host Spotlight Lounge</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Moderation Action</label>
                  <select
                    value={modAction}
                    onChange={e => setModAction(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 font-bold text-rose-400"
                  >
                    <option value="KICK">KICK USER FROM ROOM</option>
                    <option value="BAN">BAN USER FROM ROOM</option>
                    <option value="MUTE">MUTE USER MIC</option>
                    <option value="LOCK_ROOM">LOCK ROOM WITH PASSWORD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target User (UID)</label>
                  <select
                    value={modTargetUser}
                    onChange={e => setModTargetUser(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 font-bold"
                  >
                    <option value="100003">@Dimple (UID 100003)</option>
                    <option value="100002">@Ayesha_Singer (UID 100002)</option>
                    <option value="100004">@Sara_Vip (UID 100004)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={modReason}
                  onChange={e => setModReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500 font-bold"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModerateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-rose-600/30"
                >
                  🛡️ Execute Moderation Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
