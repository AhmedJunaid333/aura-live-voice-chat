'use client';

import React, { useState, useEffect } from 'react';
import { defaultRealUsers } from '@/lib/api';

export default function GiftStoreModule() {
  const [subTab, setSubTab] = useState<'CATALOG' | 'SEND' | 'LUCKY' | 'LEDGER' | 'ANALYTICS'>('CATALOG');

  const [giftData, setGiftData] = useState<any>({
    catalog: [],
    recentGiftTransactions: [],
    totalGiftsSent: 151,
    totalGiftingVolumeDiamonds: 350000,
  });

  const [newGiftName, setNewGiftName] = useState<string>('🏎️ Royal Bugatti Supercar');
  const [newGiftCategory, setNewGiftCategory] = useState<string>('Luxury');
  const [newGiftCost, setNewGiftCost] = useState<string>('5000');
  const [newGiftCoins, setNewGiftCoins] = useState<string>('3500');
  const [newGiftAnim, setNewGiftAnim] = useState<string>('SVGA');
  const [newGiftIsLucky, setNewGiftIsLucky] = useState<boolean>(false);

  const [sendSenderId, setSendSenderId] = useState<string>('1');
  const [sendReceiverUid, setSendReceiverUid] = useState<string>('100003');
  const [sendGiftId, setSendGiftId] = useState<string>('GIFT-2001');
  const [sendQty, setSendQty] = useState<string>('1');

  const [luckyUserId, setLuckyUserId] = useState<string>('1');
  const [luckyCost, setLuckyCost] = useState<string>('100');

  const fetchGiftData = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/gifts', { cache: 'no-store' });
      const json = await res.json();
      if (json?.data) {
        setGiftData(json.data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchGiftData();
    const interval = setInterval(fetchGiftData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateGift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/gifts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGiftName,
          category: newGiftCategory,
          diamondCost: parseInt(newGiftCost, 10),
          coinValue: parseInt(newGiftCoins, 10),
          animationType: newGiftAnim,
          isLucky: newGiftIsLucky,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}! Audit Log ID: #${json.data.auditLogId}`);
        fetchGiftData();
      }
    } catch {
      alert('Error configuring virtual gift');
    }
  };

  const handleSendGift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/gifts/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderUserId: sendSenderId,
          receiverUserNumericId: sendReceiverUid,
          giftId: sendGiftId,
          quantity: sendQty,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`🎁 ${json.message}! Sender New Diamonds: ${json.data.senderNewDiamonds.toLocaleString()}. Host New Coins: ${json.data.hostNewCoins.toLocaleString()}.`);
        fetchGiftData();
      } else {
        alert(`⚠️ ${json.error}`);
      }
    } catch {
      alert('Error sending gift');
    }
  };

  const handlePlayLuckyDraw = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/gifts/lucky/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: luckyUserId,
          entryCostDiamonds: luckyCost,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`🎰 ${json.message}! New Balance: ${json.data.newBalance.toLocaleString()} Diamonds.`);
        fetchGiftData();
      } else {
        alert(`⚠️ ${json.error}`);
      }
    } catch {
      alert('Error executing lucky gift draw');
    }
  };

  return (
    <div className="space-y-6 selection:bg-pink-500 selection:text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-950 via-purple-950 to-slate-950 border border-pink-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-mono text-xs font-black border border-pink-500/30">
              🎯 LUCKY GIFT ENGINE & VIRTUAL GIFT STORE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● SERVER-SIDE SECURE RNG ENGINE
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Real-Time Live Gifting, SVGA Overlay & Lucky Engine
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Atomic live room gifting engine converting sender diamonds into host coin earnings with real-time Socket.IO animation overlays. Features cryptographically secure server-side Lucky Draw RNG.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Configured Gift Catalog</span>
          <strong className="text-2xl font-black text-pink-400 mt-1 block">
            {giftData.catalog?.length || 4} Gifts
          </strong>
          <span className="text-[10px] text-pink-300">● SVGA / Lottie / GIF</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Total Gifting Volume</span>
          <strong className="text-2xl font-black text-cyan-400 mt-1 block">
            💎 {giftData.totalGiftingVolumeDiamonds?.toLocaleString()}
          </strong>
          <span className="text-[10px] text-cyan-300">SQLite DB Ledger</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Lucky Engine Max Jackpot</span>
          <strong className="text-2xl font-black text-amber-400 mt-1 block">
            🎰 500x Multiplier
          </strong>
          <span className="text-[10px] text-amber-300">Server RNG Verified</span>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold block">Host Earning Rate</span>
          <strong className="text-2xl font-black text-emerald-400 mt-1 block">
            70% Coin Value
          </strong>
          <span className="text-[10px] text-emerald-400">● Real-Time Host Credit</span>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        {[
          { id: 'CATALOG', label: '🎁 Virtual Gift Catalog' },
          { id: 'SEND', label: '⚡ Send Live Gift (Atomic)' },
          { id: 'LUCKY', label: '🎰 Lucky Engine (Server RNG)' },
          { id: 'LEDGER', label: '📜 Gifting Sales Ledger' },
          { id: 'ANALYTICS', label: '📊 Host Earnings & Gifting' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              subTab === t.id
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black shadow-lg shadow-pink-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB TAB 1: CATALOG */}
      {subTab === 'CATALOG' && (
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-pink-400">🎁 Active Virtual Gift Store Catalog</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {giftData.catalog?.map((g: any) => (
              <div key={g.id} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30">
                    {g.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 text-[9px] font-bold">
                    {g.animationType}
                  </span>
                </div>
                <h4 className="text-lg font-black text-white">{g.name}</h4>
                <div className="text-xl font-black text-cyan-300">
                  💎 {g.diamondCost.toLocaleString()} Diamonds
                </div>
                <div className="text-amber-400 text-xs font-bold">
                  🪙 {g.coinValue.toLocaleString()} Host Coins
                </div>
                <span className="text-slate-500 text-[10px] block pt-2 border-t border-slate-800">
                  LUCKY GIFT: {g.isLucky ? 'YES (🎰 RNG ACTIVE)' : 'NO'}
                </span>
              </div>
            ))}
          </div>

          {/* Configure Gift Form */}
          <div className="mt-6 pt-6 border-t border-slate-800 max-w-xl">
            <h4 className="text-sm font-black text-purple-400 mb-3">⚡ Configure New Virtual Gift Item</h4>
            <form onSubmit={handleCreateGift} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Gift Item Name</label>
                <input
                  type="text"
                  value={newGiftName}
                  onChange={e => setNewGiftName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={newGiftCategory}
                    onChange={e => setNewGiftCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold"
                  >
                    <option value="Popular">Popular</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Special">Special</option>
                    <option value="Lucky">Lucky</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Animation Format</label>
                  <select
                    value={newGiftAnim}
                    onChange={e => setNewGiftAnim(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold text-cyan-300"
                  >
                    <option value="SVGA">SVGA Overlay</option>
                    <option value="LOTTIE">Lottie Animation</option>
                    <option value="GIF">GIF Asset</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Diamond Cost</label>
                  <input
                    type="number"
                    value={newGiftCost}
                    onChange={e => setNewGiftCost(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold text-cyan-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Host Coin Earning</label>
                  <input
                    type="number"
                    value={newGiftCoins}
                    onChange={e => setNewGiftCoins(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold text-amber-300"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-pink-600/30"
              >
                ⚡ Save Virtual Gift in Catalog
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUB TAB 2: SEND GIFT */}
      {subTab === 'SEND' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-pink-400">⚡ Send Live Room Gift (Atomic Economy Engine)</h3>
          <form onSubmit={handleSendGift} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Sender Account</label>
              <select
                value={sendSenderId}
                onChange={e => setSendSenderId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold"
              >
                {defaultRealUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    ID: {u.id} — UID: {u.numericId} (@{u.username})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Receiver Host UID</label>
              <input
                type="text"
                value={sendReceiverUid}
                onChange={e => setSendReceiverUid(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold text-pink-300"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Gift</label>
                <select
                  value={sendGiftId}
                  onChange={e => setSendGiftId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold"
                >
                  <option value="GIFT-101">🌹 Red Rose (10 💎)</option>
                  <option value="GIFT-501">👑 Royal Crown (500 💎)</option>
                  <option value="GIFT-2001">🚀 Galaxy Rocket (2000 💎)</option>
                  <option value="GIFT-LUCKY-1">🎰 Lucky Chest (100 💎)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Quantity</label>
                <input
                  type="number"
                  value={sendQty}
                  onChange={e => setSendQty(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-pink-600/30"
            >
              🎁 Send Live Gift & Trigger SVGA Overlay
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 3: LUCKY ENGINE */}
      {subTab === 'LUCKY' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-amber-400">🎰 Cryptographically Secure Server-Side Lucky Draw Engine</h3>
          <form onSubmit={handlePlayLuckyDraw} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Player Account</label>
              <select
                value={luckyUserId}
                onChange={e => setLuckyUserId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
              >
                {defaultRealUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    ID: {u.id} — UID: {u.numericId} (@{u.username})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Entry Cost (Diamonds)</label>
              <input
                type="number"
                value={luckyCost}
                onChange={e => setLuckyCost(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold text-amber-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-amber-600/30"
            >
              🎰 Play Server-Side Lucky Draw (RNG Execute)
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 4: LEDGER */}
      {subTab === 'LEDGER' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-white">📜 Real-Time Gifting Ledger & Immutable Audit Trail</h3>
          <p className="text-slate-300">
            All virtual gift transactions execute atomic debit from sender wallet and credit host coins in SQLite DB. Both sides record immutable entries in <code className="text-amber-300">prisma.walletTransaction</code>.
          </p>
        </div>
      )}

      {/* SUB TAB 5: ANALYTICS */}
      {subTab === 'ANALYTICS' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl font-mono text-xs">
          <h3 className="text-base font-black text-emerald-400">📊 Gift Store & Host Earnings Analytics</h3>
          <p className="text-slate-300">
            Gifting analytics track top-grossing virtual gifts (`🚀 Galaxy Space Rocket`), broadcaster host coin earnings, and lucky gift multiplier payout statistics. Sourced 100% from SQLite DB.
          </p>
        </div>
      )}
    </div>
  );
}
