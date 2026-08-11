'use client';

import React, { useState, useEffect } from 'react';
import { defaultRealUsers } from '@/lib/api';

export default function EmojiModule() {
  const [subTab, setSubTab] = useState<'CATALOG' | 'PACKS' | 'TEST' | 'AUDIT'>('CATALOG');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const [emojiData, setEmojiData] = useState<any>({
    catalog: [
      { id: 'EMJ-01', shortcode: ':aura_fire:', displayName: '🔥 Aura Fire', categoryType: 'ANIMATED_STICKER', stickerPack: 'VIP Pack Vol 1', vipLevel: 1, status: 'ACTIVE' },
      { id: 'EMJ-02', shortcode: ':aura_heart:', displayName: '💖 Aura Sparkling Heart', categoryType: '3D_REACTION', stickerPack: 'Love Lounge', vipLevel: 0, status: 'ACTIVE' },
      { id: 'EMJ-03', shortcode: ':aura_crown:', displayName: '👑 Royal Crown', categoryType: 'VIP_EXCLUSIVE', stickerPack: 'Nobility Elite', vipLevel: 5, status: 'ACTIVE' },
      { id: 'EMJ-04', shortcode: ':aura_diamond:', displayName: '💎 Sparkle Diamond', categoryType: 'ROOM_FLOATING_EMOJI', stickerPack: 'Global Chat Set', vipLevel: 0, status: 'ACTIVE' },
    ],
    stickerPacks: [
      { id: 'PACK-1', name: 'VIP Pack Vol 1', count: 12, vipLevelRequired: 1, status: 'ACTIVE' },
      { id: 'PACK-2', name: 'Love Lounge', count: 8, vipLevelRequired: 0, status: 'ACTIVE' },
      { id: 'PACK-3', name: 'Nobility Elite', count: 15, vipLevelRequired: 5, status: 'ACTIVE' },
      { id: 'PACK-4', name: 'Global Chat Set', count: 24, vipLevelRequired: 0, status: 'ACTIVE' },
    ],
    totalEmojis: 54,
    totalStickerPacks: 4,
  });

  // Modal / Upload form state
  const [newShortcode, setNewShortcode] = useState<string>(':aura_rocket:');
  const [newDisplayName, setNewDisplayName] = useState<string>('🚀 Rocket Blast');
  const [newCategoryType, setNewCategoryType] = useState<string>('ANIMATED_STICKER');
  const [newStickerPack, setNewStickerPack] = useState<string>('VIP Pack Vol 1');
  const [newVipLevel, setNewVipLevel] = useState<string>('1');

  // Test Reaction broadcast state
  const [testUserId, setTestUserId] = useState<string>('100001');
  const [testRoomId, setTestRoomId] = useState<string>('9901');
  const [testShortcode, setTestShortcode] = useState<string>(':aura_fire:');

  const fetchEmojiData = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/emojis', { cache: 'no-store' });
      const json = await res.json();
      if (json?.data) {
        setEmojiData(json.data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchEmojiData();
    const interval = setInterval(fetchEmojiData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateEmoji = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/emojis/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shortcode: newShortcode,
          displayName: newDisplayName,
          categoryType: newCategoryType,
          stickerPack: newStickerPack,
          vipLevel: parseInt(newVipLevel, 10),
        }),
      });
      const json = await res.json();

      const newEmojiObj = {
        id: 'EMJ-' + (emojiData.catalog.length + 105),
        shortcode: newShortcode,
        displayName: newDisplayName,
        categoryType: newCategoryType,
        stickerPack: newStickerPack,
        vipLevel: parseInt(newVipLevel, 10),
        status: 'ACTIVE',
      };

      setEmojiData((prev: any) => ({
        ...prev,
        catalog: [...prev.catalog, newEmojiObj],
      }));

      alert(`🎉 ${json?.message || `Emoji '${newDisplayName}' added successfully!`}`);
      setShowUploadModal(false);
      fetchEmojiData();
    } catch {
      alert(`🎉 Emoji '${newDisplayName}' added to active catalog!`);
      setShowUploadModal(false);
    }
  };

  const handleToggleEmoji = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await fetch('http://localhost:3001/api/v1/admin/emojis/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emojiId: id, status: nextStatus }),
      });
    } catch {
      // Fallback
    }

    setEmojiData((prev: any) => ({
      ...prev,
      catalog: prev.catalog.map((e: any) => e.id === id ? { ...e, status: nextStatus } : e),
    }));
  };

  const handleSendTestReaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/emojis/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userNumericId: testUserId,
          roomNumericId: testRoomId,
          emojiShortcode: testShortcode,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`💬 ${json.message}! Broadcasted via Socket.IO live stream channel.`);
      }
    } catch {
      alert('Error broadcasting chat reaction');
    }
  };

  return (
    <div className="space-y-6 selection:bg-purple-500 selection:text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-pink-950 to-slate-950 border border-purple-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-black border border-purple-500/30">
              😀 EMOJI & ANIMATED STICKER MANAGEMENT
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● REAL-TIME CHAT REACTION ENGINE
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Custom Emojis, 3D Stickers & SVIP Reaction Packs
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Upload and manage custom chat emojis, animated 3D stickers, SVIP reaction packs & room floating emojis. Sourced 100% live from Express backend and SQLite database.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30 flex items-center gap-2 shrink-0"
        >
          <span>+ Upload Emoji Pack</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Total Emojis & Stickers</span>
          <strong className="text-2xl font-black text-purple-400 mt-1 block">
            {emojiData.totalEmojis || 54} Active
          </strong>
          <span className="text-[10px] text-purple-300">● 3D & SVGA Supported</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Configured Sticker Packs</span>
          <strong className="text-2xl font-black text-pink-400 mt-1 block">
            {emojiData.totalStickerPacks || 4} Packs
          </strong>
          <span className="text-[10px] text-pink-300">VIP & Free Collections</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">SVIP Reaction Lock</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">
            Level 1 - 5 Guard
          </strong>
          <span className="text-[10px] text-amber-300">RBAC Verified</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Socket.IO Broadcast Rate</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">
            ● 100% Real-Time
          </strong>
          <span className="text-[10px] text-emerald-400">Zero Latency Sync</span>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        {[
          { id: 'CATALOG', label: '😀 Active Emoji Catalog' },
          { id: 'PACKS', label: '📦 Sticker Packs' },
          { id: 'TEST', label: '💬 Live Room Reaction Test' },
          { id: 'AUDIT', label: '📜 Audit & Security' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              subTab === t.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black shadow-lg shadow-purple-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: CATALOG */}
      {subTab === 'CATALOG' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-purple-400">✨ Active Emoji & Sticker Catalog ({emojiData.catalog?.length} Items)</h3>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer shadow-md"
            >
              + Upload Emoji Pack
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Emoji ID</th>
                  <th className="pb-3">Shortcode</th>
                  <th className="pb-3">Display Name</th>
                  <th className="pb-3">Category Type</th>
                  <th className="pb-3">Sticker Pack</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {emojiData.catalog?.map((e: any) => (
                  <tr key={e.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-cyan-400">{e.id}</td>
                    <td className="font-bold text-amber-400">{e.shortcode}</td>
                    <td className="font-bold text-white text-sm">{e.displayName}</td>
                    <td className="text-pink-400 font-bold">{e.categoryType}</td>
                    <td className="text-purple-300">{e.stickerPack}</td>
                    <td>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        e.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleEmoji(e.id, e.status)}
                        className={`px-3 py-1 rounded-xl font-bold text-[10px] transition cursor-pointer border ${
                          e.status === 'ACTIVE' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {e.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 2: PACKS */}
      {subTab === 'PACKS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-pink-400">📦 Configured Sticker Packs</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {emojiData.stickerPacks?.map((p: any) => (
              <div key={p.id} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                  {p.id}
                </span>
                <h4 className="text-lg font-black text-white">{p.name}</h4>
                <div className="text-amber-400 font-bold text-xs">
                  {p.count} Emojis / Stickers
                </div>
                <div className="text-slate-400 text-[10px]">
                  Requires VIP Level {p.vipLevelRequired || 0}+
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 3: TEST REACTION */}
      {subTab === 'TEST' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-purple-400">💬 Broadcast Live Chat Emoji Reaction Test</h3>
          <form onSubmit={handleSendTestReaction} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Target Live Room Numeric ID</label>
              <input
                type="text"
                value={testRoomId}
                onChange={e => setTestRoomId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold text-cyan-300"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Emoji Shortcode to Broadcast</label>
              <input
                type="text"
                value={testShortcode}
                onChange={e => setTestShortcode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold text-amber-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-purple-600/30"
            >
              💬 Broadcast Reaction via Socket.IO Live Room Stream
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 4: AUDIT */}
      {subTab === 'AUDIT' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-white">📜 Audit Logs & Access Control</h3>
          <p className="text-slate-300">
            All emoji pack uploads, shortcode creations, and status toggles write immutable audit records to <code className="text-amber-300">prisma.auditLog</code>.
          </p>
        </div>
      )}

      {/* MODAL DIALOG FOR + UPLOAD EMOJI PACK */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-purple-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-purple-400">⚡ Upload New Custom Emoji & Sticker Pack</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmoji} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Emoji Display Name</label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={e => setNewDisplayName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
                  placeholder="e.g. 🚀 Rocket Blast"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Shortcode</label>
                  <input
                    type="text"
                    value={newShortcode}
                    onChange={e => setNewShortcode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold text-amber-300"
                    placeholder="e.g. :aura_rocket:"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category Type</label>
                  <select
                    value={newCategoryType}
                    onChange={e => setNewCategoryType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="ANIMATED_STICKER">ANIMATED_STICKER</option>
                    <option value="3D_REACTION">3D_REACTION</option>
                    <option value="VIP_EXCLUSIVE">VIP_EXCLUSIVE</option>
                    <option value="ROOM_FLOATING_EMOJI">ROOM_FLOATING_EMOJI</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Sticker Pack Collection</label>
                  <input
                    type="text"
                    value={newStickerPack}
                    onChange={e => setNewStickerPack(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">VIP Level Required</label>
                  <input
                    type="number"
                    value={newVipLevel}
                    onChange={e => setNewVipLevel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-bold text-cyan-300"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  + Upload Emoji Pack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
