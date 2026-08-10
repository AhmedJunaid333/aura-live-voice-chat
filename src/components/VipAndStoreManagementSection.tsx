import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

interface VipTier {
  id: string;
  level: number;
  tierName: string;
  shortBadge: string;
  colorHex: string;
  expRequired: number;
  priceUsd: number;
  perksJson: string;
  active: boolean;
}

interface StoreItem {
  id: string;
  name: string;
  category: string;
  priceCoins: number;
  priceDiamonds: number;
  durationDays: number;
  description: string;
  icon: string;
  colorHex: string;
  active: boolean;
  sortOrder: number;
}

export function VipAndStoreManagementSection() {
  const [activeTab, setActiveTab] = useState<'vip' | 'store' | 'analytics'>('vip');
  const [vipTiers, setVipTiers] = useState<VipTier[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingTier, setEditingTier] = useState<VipTier | null>(null);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // New Item Form State
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Entry Effects',
    priceCoins: 50000,
    priceDiamonds: 500,
    durationDays: 30,
    description: '',
    icon: 'car',
    colorHex: '#00E5FF',
  });

  const categories = [
    'ALL',
    'Entry Effects',
    'Mic Waves',
    'Profile Cards',
    'Vehicles',
    'Room Frames',
    'Chat Bubbles',
    'Special IDs',
  ];

  const fetchVipTiers = async () => {
    try {
      const res = await apiClient.get('/v1/store/vip-tiers');
      if (res && res.success) {
        setVipTiers(res.data);
      }
    } catch (e) {
      console.error('Error fetching VIP tiers:', e);
    }
  };

  const fetchStoreItems = async () => {
    try {
      const res = await apiClient.get(`/v1/store/items${selectedCategory !== 'ALL' ? `?category=${encodeURIComponent(selectedCategory)}` : ''}`);
      if (res && res.success) {
        setStoreItems(res.data);
      }
    } catch (e) {
      console.error('Error fetching store items:', e);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchVipTiers(), fetchStoreItems()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStoreItems();
  }, [selectedCategory]);

  const handleUpdateVipTier = async (level: number, updated: Partial<VipTier>) => {
    try {
      const res = await apiClient.put(`/v1/store/vip-tiers/${level}`, updated);
      if (res && res.success) {
        setVipTiers(prev => prev.map(t => t.level === level ? { ...t, ...res.data } : t));
        setEditingTier(null);
      }
    } catch (e) {
      console.error('Error updating VIP tier:', e);
    }
  };

  const handleCreateStoreItem = async () => {
    try {
      const res = await apiClient.post('/v1/store/items', newItem);
      if (res && res.success) {
        setStoreItems(prev => [...prev, res.data]);
        setShowAddItemModal(false);
        setNewItem({
          name: '',
          category: 'Entry Effects',
          priceCoins: 50000,
          priceDiamonds: 500,
          durationDays: 30,
          description: '',
          icon: 'car',
          colorHex: '#00E5FF',
        });
      }
    } catch (e) {
      console.error('Error creating store item:', e);
    }
  };

  const handleUpdateStoreItem = async (id: string, updated: Partial<StoreItem>) => {
    try {
      const res = await apiClient.put(`/v1/store/items/${id}`, updated);
      if (res && res.success) {
        setStoreItems(prev => prev.map(i => i.id === id ? { ...i, ...res.data } : i));
        setEditingItem(null);
      }
    } catch (e) {
      console.error('Error updating store item:', e);
    }
  };

  const handleDeleteStoreItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this store item?')) return;
    try {
      const res = await apiClient.delete(`/v1/store/items/${id}`);
      if (res && res.success) {
        setStoreItems(prev => prev.filter(i => i.id !== id));
      }
    } catch (e) {
      console.error('Error deleting store item:', e);
    }
  };

  const filteredItems = storeItems.filter(item =>
    searchQuery === '' ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            👑 VIP Mall & Virtual Store Management
          </h2>
          <p className="text-slate-400 mt-1">
            Configure VIP Tiers, pricing, perks, entrance effects, mic waves & store items for the Mobile App
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchVipTiers(); fetchStoreItems(); }}
            className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 rounded-xl transition-colors text-sm font-medium flex items-center gap-2"
          >
            🔄 Sync App Store
          </button>
          {activeTab === 'store' && (
            <button
              onClick={() => setShowAddItemModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl shadow-lg transition-all text-sm font-bold flex items-center gap-2"
            >
              ➕ Add Store Item
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-700/60">
        <button
          onClick={() => setActiveTab('vip')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'vip'
              ? 'border-amber-400 text-amber-400 bg-amber-400/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          👑 VIP Mall Tiers Config ({vipTiers.length})
        </button>
        <button
          onClick={() => setActiveTab('store')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'store'
              ? 'border-purple-400 text-purple-400 bg-purple-400/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          🛍️ Store Virtual Catalog ({storeItems.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === 'analytics'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          📊 Revenue & Analytics
        </button>
      </div>

      {/* TAB 1: VIP MALL CONFIG */}
      {activeTab === 'vip' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vipTiers.map((tier) => {
            const perks: string[] = (() => {
              try { return JSON.parse(tier.perksJson); } catch { return []; }
            })();
            return (
              <div
                key={tier.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 relative hover:border-amber-500/50 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md"
                      style={{ backgroundColor: tier.colorHex }}
                    >
                      V{tier.level}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base">{tier.tierName}</h3>
                      <span className="text-slate-400 text-xs">{tier.shortBadge} • Level {tier.level}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpdateVipTier(tier.level, { active: !tier.active })}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      tier.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {tier.active ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>

                <div className="my-4 p-3 bg-slate-900/60 rounded-xl space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">EXP Required:</span>
                    <span className="font-semibold text-amber-300">{tier.expRequired.toLocaleString()} EXP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recharge Value:</span>
                    <span className="font-semibold text-emerald-400">${tier.priceUsd} USD</span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perks & Privileges:</p>
                  {perks.map((perk, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="text-amber-400">✦</span>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setEditingTier(tier)}
                  className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all"
                >
                  ✏️ Edit Tier Specs
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: STORE VIRTUAL CATALOG */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          {/* Category Filter & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search store items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Store Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 hover:border-purple-500/50 transition-all shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold">
                      {item.category}
                    </span>
                    <button
                      onClick={() => handleUpdateStoreItem(item.id, { active: !item.active })}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {item.active ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-slate-400 text-xs mb-4 line-clamp-2">{item.description}</p>

                  <div className="p-3 bg-slate-900/60 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Price Coins:</span>
                      <span className="font-bold text-amber-400">🟡 {item.priceCoins.toLocaleString()} Coins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Price Diamonds:</span>
                      <span className="font-bold text-cyan-400">💎 {item.priceDiamonds.toLocaleString()} Diamonds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="font-bold text-purple-300">⏱️ {item.durationDays} Days</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-700/60">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex-1 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    ✏️ Edit Item
                  </button>
                  <button
                    onClick={() => handleDeleteStoreItem(item.id)}
                    className="px-3 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REVENUE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-amber-600/20 to-amber-900/10 border border-amber-500/30 rounded-2xl p-6">
            <h3 className="text-amber-400 text-sm font-semibold">Total VIP Subscriptions</h3>
            <p className="text-white text-3xl font-bold mt-2">1,248 Active Users</p>
            <p className="text-slate-400 text-xs mt-1">+14% growth this month</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/10 border border-purple-500/30 rounded-2xl p-6">
            <h3 className="text-purple-400 text-sm font-semibold">Store Sales Revenue</h3>
            <p className="text-white text-3xl font-bold mt-2">48.5M Coins</p>
            <p className="text-slate-400 text-xs mt-1">Supercars & Mic Waves top sellers</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/10 border border-emerald-500/30 rounded-2xl p-6">
            <h3 className="text-emerald-400 text-sm font-semibold">VIP Mall Monthly USD Value</h3>
            <p className="text-white text-3xl font-bold mt-2">$24,500 USD</p>
            <p className="text-slate-400 text-xs mt-1">Direct in-app recharges</p>
          </div>
        </div>
      )}

      {/* ADD ITEM MODAL */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white">➕ Add New Virtual Store Item</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cyber Dragon Jet ✈️"
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Category</label>
                <select
                  value={newItem.category}
                  onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 mt-1"
                >
                  {categories.filter(c => c !== 'ALL').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Price in Coins</label>
                  <input
                    type="number"
                    value={newItem.priceCoins}
                    onChange={e => setNewItem({ ...newItem, priceCoins: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Duration (Days)</label>
                  <input
                    type="number"
                    value={newItem.durationDays}
                    onChange={e => setNewItem({ ...newItem, durationDays: parseInt(e.target.value, 10) || 30 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Description</label>
                <textarea
                  rows={2}
                  placeholder="Item effects description..."
                  value={newItem.description}
                  onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateStoreItem}
                className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold text-sm"
              >
                Save Store Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT VIP TIER MODAL */}
      {editingTier && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">✏️ Edit {editingTier.tierName}</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400">Tier Name</label>
                <input
                  type="text"
                  value={editingTier.tierName}
                  onChange={e => setEditingTier({ ...editingTier, tierName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400">EXP Required</label>
                  <input
                    type="number"
                    value={editingTier.expRequired}
                    onChange={e => setEditingTier({ ...editingTier, expRequired: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400">Price USD ($)</label>
                  <input
                    type="number"
                    value={editingTier.priceUsd}
                    onChange={e => setEditingTier({ ...editingTier, priceUsd: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setEditingTier(null)}
                className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateVipTier(editingTier.level, editingTier)}
                className="px-6 py-2 bg-amber-500 text-black font-bold rounded-xl text-sm"
              >
                Update Tier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
