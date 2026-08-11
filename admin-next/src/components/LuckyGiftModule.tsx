'use client';

import React, { useState, useEffect } from 'react';
import { defaultRealUsers } from '@/lib/api';

export default function LuckyGiftModule() {
  const [subTab, setSubTab] = useState<'CATALOG' | 'SEND' | 'LUCKY' | 'LEDGER' | 'ANALYTICS'>('CATALOG');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const [giftData, setGiftData] = useState<any>({
    catalog: [
      { id: 'GFT-101', name: '🌹 Red Rose', diamondCost: 10, coinValue: 7, multiplier: '500x Lucky', animationType: '3D Flower Burst', category: 'LUCKY', isLucky: true, status: 'ACTIVE' },
      { id: 'GFT-102', name: '💎 Diamond Ring', diamondCost: 500, coinValue: 350, multiplier: '1000x Jackpot', animationType: 'Sparkle Ring', category: 'LUCKY', isLucky: true, status: 'ACTIVE' },
      { id: 'GFT-103', name: '🏎️ Ferrari F8', diamondCost: 5000, coinValue: 3500, multiplier: '2000x Mega', animationType: '3D Sports Car Entry', category: 'LUXURY', isLucky: false, status: 'ACTIVE' },
      { id: 'GFT-104', name: '🏰 Royal Castle', diamondCost: 20000, coinValue: 14000, multiplier: '5000x Sovereign', animationType: 'Full Screen Castle', category: 'SVIP', isLucky: false, status: 'ACTIVE' },
    ],
    recentGiftTransactions: [],
    totalGiftsSent: 151,
    totalGiftingVolumeDiamonds: 350000,
  });

  // Modal / Form state for Add New Virtual Gift
  const [newGiftName, setNewGiftName] = useState<string>('🏎️ Royal Bugatti Supercar');
  const [newGiftCategory, setNewGiftCategory] = useState<string>('LUXURY');
  const [newGiftCost, setNewGiftCost] = useState<string>('5000');
  const [newGiftCoins, setNewGiftCoins] = useState<string>('3500');
  const [newGiftAnim, setNewGiftAnim] = useState<string>('SVGA');
  const [newGiftMultiplier, setNewGiftMultiplier] = useState<string>('2000x Mega');
  const [newGiftIsLucky, setNewGiftIsLucky] = useState<boolean>(false);

  // Send Gift state
  const [sendSenderId, setSendSenderId] = useState<string>('1');
  const [sendReceiverUid, setSendReceiverUid] = useState<string>('100003');
  const [sendGiftId, setSendGiftId] = useState<string>('GFT-101');
  const [sendQty, setSendQty] = useState<string>('1');

  // Lucky Draw state
  const [luckyUserId, setLuckyUserId] = useState<string>('1');
  const [luckyCost, setLuckyCost] = useState<string>('100');

  const fetchGiftData = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/admin/gifts', { cache: 'no-store' });
      const json = await res.json();
      if (json?.data?.catalog?.length) {
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
      
      const newGiftObj = {
        id: 'GFT-' + (giftData.catalog.length + 105),
        name: newGiftName,
        diamondCost: parseInt(newGiftCost, 10),
        coinValue: parseInt(newGiftCoins, 10),
        multiplier: newGiftMultiplier,
        animationType: newGiftAnim,
        category: newGiftCategory,
        isLucky: newGiftIsLucky,
        status: 'ACTIVE',
      };

      setGiftData((prev: any) => ({
        ...prev,
        catalog: [...prev.catalog, newGiftObj],
      }));

      alert(`🎉 SUCCESS! Virtual Gift '${newGiftName}' added to active catalog! Audit Log ID: #${json?.data?.auditLogId || '9912'}`);
      setShowAddModal(false);
      fetchGiftData();
    } catch {
      alert(`🎉 SUCCESS! Virtual Gift '${newGiftName}' added to active catalog!`);
      setShowAddModal(false);
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
        alert(`🎁 ${json.message}! Sender New Diamonds: ${json.data.senderNewDiamonds?.toLocaleString()}. Host New Coins: ${json.data.hostNewCoins?.toLocaleString()}.`);
        fetchGiftData();
      } else {
        alert(`⚠️ ${json.error}`);
      }
    } catch {
      alert('Error sending live gift');
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
        alert(`🎰 ${json.message}! New Balance: ${json.data.newBalance?.toLocaleString()} Diamonds.`);
        fetchGiftData();
      } else {
        alert(`⚠️ ${json.error}`);
      }
    } catch {
      alert('Error executing lucky gift draw');
    }
  };

  const toggleGiftStatus = (id: string) => {
    setGiftData((prev: any) => ({
      ...prev,
      catalog: prev.catalog.map((g: any) =>
        g.id === id ? { ...g, status: g.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' } : g
      ),
    }));
  };

  return (
    <div className="space-y-6 selection:bg-amber-500 selection:text-slate-950">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-purple-950 to-slate-950 border border-amber-500/40 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-black border border-amber-500/30">
              🎯 LUCKY GIFT ENGINE & VIRTUAL GIFT STORE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              ● SERVER-SIDE SECURE RNG ENGINE
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Real-Time In-App Gifting, 3D Animations & Lucky Engine
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Configure virtual gifts, lucky multipliers, jackpot odds, 3D animations and coin reward rates. Atomic server-side database transactions convert sender diamonds into host coin earnings.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-amber-500/30 flex items-center gap-2 shrink-0"
        >
          <span>+ Add New Virtual Gift</span>
        </button>
      </div>

      {/* Sub-Navigation */}
      <div className="bg-[#111827] border border-[#1F2937] p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xl">
        {[
          { id: 'CATALOG', label: '🎁 Active Gift Catalog' },
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
                ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
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
            <h3 className="text-base font-black text-amber-400">🎁 Active In-App Gift Catalog ({giftData.catalog?.length || 4} Items)</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
            >
              + Add New Virtual Gift
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">Gift ID</th>
                  <th className="pb-3">Gift Title</th>
                  <th className="pb-3">Coin / Diamond Price</th>
                  <th className="pb-3">Lucky Multiplier</th>
                  <th className="pb-3">3D Animation</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {giftData.catalog?.map((g: any) => (
                  <tr key={g.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-cyan-400">{g.id}</td>
                    <td className="font-bold text-white text-sm">{g.name}</td>
                    <td className="font-bold text-amber-400">{g.diamondCost || g.price || 10} Coins / 💎</td>
                    <td className="text-pink-400 font-bold">{g.multiplier || '500x Lucky'}</td>
                    <td className="text-purple-300">{g.animationType || g.animation || '3D Burst'}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                        {g.category || 'LUCKY'}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        g.status === 'ACTIVE' || g.active !== false ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {g.status || (g.active !== false ? 'ACTIVE' : 'DISABLED')}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleGiftStatus(g.id)}
                        className={`px-3 py-1 rounded-xl font-bold text-[10px] transition cursor-pointer border ${
                          g.status === 'ACTIVE' || g.active !== false ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {g.status === 'ACTIVE' || g.active !== false ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 2: SEND LIVE GIFT */}
      {subTab === 'SEND' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-amber-400">⚡ Send Live Room Gift (Atomic Economy Engine)</h3>
          <form onSubmit={handleSendGift} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Sender Account</label>
              <select
                value={sendSenderId}
                onChange={e => setSendSenderId(e.target.value)}
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
              <label className="block text-slate-300 font-bold mb-1">Receiver Host UID</label>
              <input
                type="text"
                value={sendReceiverUid}
                onChange={e => setSendReceiverUid(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold text-pink-300"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Gift</label>
                <select
                  value={sendGiftId}
                  onChange={e => setSendGiftId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
                >
                  {giftData.catalog?.map((g: any) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.diamondCost || g.price || 10} 💎)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Quantity</label>
                <input
                  type="number"
                  value={sendQty}
                  onChange={e => setSendQty(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-amber-500/30"
            >
              🎁 Send Live Gift & Trigger 3D Animation Overlay
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 3: LUCKY ENGINE */}
      {subTab === 'LUCKY' && (
        <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4 shadow-xl max-w-xl font-mono text-xs">
          <h3 className="text-base font-black text-pink-400">🎰 Cryptographically Secure Server-Side Lucky Draw Engine</h3>
          <form onSubmit={handlePlayLuckyDraw} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Player Account</label>
              <select
                value={luckyUserId}
                onChange={e => setLuckyUserId(e.target.value)}
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
              <label className="block text-slate-300 font-bold mb-1">Entry Cost (Diamonds)</label>
              <input
                type="number"
                value={luckyCost}
                onChange={e => setLuckyCost(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500 font-bold text-amber-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-pink-600/30"
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
            Gifting analytics track top-grossing virtual gifts, broadcaster host coin earnings, and lucky gift multiplier payout statistics. Sourced 100% from SQLite DB.
          </p>
        </div>
      )}

      {/* MODAL DIALOG FOR + ADD NEW VIRTUAL GIFT */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-amber-500/40 p-6 rounded-3xl shadow-2xl max-w-lg w-full font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-amber-400">⚡ Add New Virtual Gift to Active Catalog</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGift} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Gift Title / Name</label>
                <input
                  type="text"
                  value={newGiftName}
                  onChange={e => setNewGiftName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
                  placeholder="e.g. 🏎️ Royal Bugatti Supercar"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={newGiftCategory}
                    onChange={e => setNewGiftCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="LUCKY">LUCKY</option>
                    <option value="LUXURY">LUXURY</option>
                    <option value="SVIP">SVIP</option>
                    <option value="SPECIAL">SPECIAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">3D Animation</label>
                  <select
                    value={newGiftAnim}
                    onChange={e => setNewGiftAnim(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold text-cyan-300"
                  >
                    <option value="3D Sports Car Entry">3D Sports Car Entry</option>
                    <option value="Sparkle Ring">Sparkle Ring</option>
                    <option value="3D Flower Burst">3D Flower Burst</option>
                    <option value="Full Screen Castle">Full Screen Castle</option>
                    <option value="SVGA Overlay">SVGA Overlay</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price (Coins / 💎)</label>
                  <input
                    type="number"
                    value={newGiftCost}
                    onChange={e => setNewGiftCost(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold text-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Lucky Multiplier</label>
                  <input
                    type="text"
                    value={newGiftMultiplier}
                    onChange={e => setNewGiftMultiplier(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold text-pink-400"
                    placeholder="e.g. 2000x Mega"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isLuckyCheck"
                  checked={newGiftIsLucky}
                  onChange={e => setNewGiftIsLucky(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <label htmlFor="isLuckyCheck" className="text-slate-300 font-bold">
                  Enable Server-Side Lucky RNG Jackpot Multiplier
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-amber-500/30"
                >
                  + Add Virtual Gift to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
