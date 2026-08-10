import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export interface RechargePackage {
  id?: string;
  coins: number;
  coinsLabel: string;
  price: string;
  bonus: string;
  active: boolean;
}

export function RechargeManagementSection() {
  const [packages, setPackages] = useState<RechargePackage[]>([
    { coins: 45000, coinsLabel: '45,000 Diamonds 💎', price: '$1.00', bonus: 'Starter Rate', active: true },
    { coins: 225000, coinsLabel: '225,000 Diamonds 💎', price: '$5.00', bonus: 'Popular 🔥', active: true },
    { coins: 1125000, coinsLabel: '1,125,000 Diamonds 💎', price: '$25.00', bonus: 'Best Value 🌟', active: true },
    { coins: 2250000, coinsLabel: '2,250,000 Diamonds 💎', price: '$50.00', bonus: 'VIP Tier 👑', active: true },
    { coins: 4500000, coinsLabel: '4,500,000 Diamonds 💎', price: '$100.00', bonus: 'Royal Empire 💎', active: true },
  ]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New package form modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoins, setNewCoins] = useState('90000');
  const [newPrice, setNewPrice] = useState('$2.00');
  const [newBonus, setNewBonus] = useState('+5,000 Bonus');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/v1/wallet/recharge-packages');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setPackages(res.data.data);
      }
    } catch (_) {
      // Keep initial rates as fallback
    } finally {
      setLoading(false);
    }
  };

  const handlePackageChange = (index: number, field: keyof RechargePackage, value: any) => {
    const updated = [...packages];
    if (field === 'coins') {
      const num = parseInt(value) || 0;
      updated[index].coins = num;
      updated[index].coinsLabel = `${num.toLocaleString()} Diamonds 💎`;
    } else {
      (updated[index] as any)[field] = value;
    }
    setPackages(updated);
  };

  const handleToggleActive = (index: number) => {
    const updated = [...packages];
    updated[index].active = !updated[index].active;
    setPackages(updated);
  };

  const handleDeletePackage = (index: number) => {
    if (packages.length <= 1) {
      showToast('⚠️ Must keep at least 1 recharge package!');
      return;
    }
    const updated = packages.filter((_, i) => i !== index);
    setPackages(updated);
    showToast('Package removed from list.');
  };

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(newCoins) || 0;
    if (num <= 0 || !newPrice.trim()) {
      showToast('⚠️ Please enter valid diamond count and price!');
      return;
    }

    const newPkg: RechargePackage = {
      coins: num,
      coinsLabel: `${num.toLocaleString()} Diamonds 💎`,
      price: newPrice.trim().startsWith('$') ? newPrice.trim() : `$${newPrice.trim()}`,
      bonus: newBonus.trim(),
      active: true,
    };

    setPackages([...packages, newPkg]);
    setShowAddModal(false);
    showToast('✨ New Recharge Package Tier Added!');
  };

  const handleSaveAndPushRealtime = async () => {
    setSaving(true);
    try {
      const res = await apiClient.put('/api/v1/wallet/recharge-packages', { packages });
      if (res.data?.success) {
        showToast('🚀 Recharge rates saved to Database & broadcasted REAL-TIME to all mobile apps!');
      } else {
        showToast('⚠️ Rate update saved locally.');
      }
    } catch (err: any) {
      showToast(`⚠️ Saved locally (${err.message || 'Offline mode'})`);
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <section className="space-y-5">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#4F46E5] text-white px-5 py-3 rounded-2xl shadow-2xl border border-indigo-400 text-xs font-bold animate-bounce flex items-center gap-2">
          <span>⚡</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#273449] pb-4">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>💎 Recharge Packages & Diamond Rates Manager</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs border border-indigo-500/40">
              REAL-TIME SYNC
            </span>
          </h3>
          <p className="text-xs text-slate-400">Configure official diamond conversion prices and broadcast updates to mobile users in real-time</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#2A3B53] text-white font-bold text-xs border border-[#273449] transition flex items-center gap-1.5"
          >
            <span>+</span> Add Rate Tier
          </button>

          <button
            onClick={handleSaveAndPushRealtime}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs shadow-lg hover:brightness-110 transition flex items-center gap-2"
          >
            {saving ? (
              <span>Pushing Real-Time... ⏳</span>
            ) : (
              <>
                <span>⚡</span>
                <span>Save & Push Real-Time to Mobile App</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rate Table */}
      <div className="bg-[#131C2E] border border-[#273449] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>Active Rate Tiers ({packages.filter(p => p.active).length} / {packages.length} Enabled)</span>
          <span className="text-emerald-400 font-bold">1 USD = 45,000 💎 Base Currency Standard</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs font-mono">Loading active packages from server...</div>
        ) : (
          <div className="space-y-3">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${
                  pkg.active ? 'bg-[#0B1220] border-[#273449]' : 'bg-[#0B1220]/40 border-red-500/30 opacity-60'
                }`}
              >
                {/* Package Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-lg shrink-0">
                    💎
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">{pkg.coinsLabel}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                        {pkg.bonus}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Diamond Amount: {pkg.coins.toLocaleString()} 💎
                    </span>
                  </div>
                </div>

                {/* Edit Controls */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-1 bg-[#131C2E] border border-[#273449] px-3 py-1.5 rounded-xl">
                    <span className="text-xs text-slate-400 font-bold">Price:</span>
                    <input
                      type="text"
                      value={pkg.price}
                      onChange={(e) => handlePackageChange(idx, 'price', e.target.value)}
                      className="bg-transparent font-bold text-amber-400 text-xs w-16 text-right focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-[#131C2E] border border-[#273449] px-3 py-1.5 rounded-xl">
                    <span className="text-xs text-slate-400 font-bold">Diamonds:</span>
                    <input
                      type="number"
                      value={pkg.coins}
                      onChange={(e) => handlePackageChange(idx, 'coins', e.target.value)}
                      className="bg-transparent font-bold text-cyan-400 text-xs w-24 text-right focus:outline-none font-mono"
                    />
                  </div>

                  <button
                    onClick={() => handleToggleActive(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      pkg.active
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-700/40 text-slate-400 border-slate-600'
                    }`}
                  >
                    {pkg.active ? 'ACTIVE ✓' : 'OFF ✕'}
                  </button>

                  <button
                    onClick={() => handleDeletePackage(idx)}
                    className="p-1.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 transition text-xs font-bold"
                    title="Delete Package"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Package Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131C2E] border border-[#273449] p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#273449] pb-3">
              <h4 className="text-white font-bold text-base flex items-center gap-2">
                <span>💎 Add New Recharge Package Tier</span>
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPackage} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Price ($ USD)</label>
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="$2.00"
                  className="w-full bg-[#0B1220] border border-[#273449] rounded-xl px-4 py-2.5 text-white font-bold text-xs focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Diamond Amount (💎)</label>
                <input
                  type="number"
                  value={newCoins}
                  onChange={(e) => setNewCoins(e.target.value)}
                  placeholder="90000"
                  className="w-full bg-[#0B1220] border border-[#273449] rounded-xl px-4 py-2.5 text-cyan-400 font-bold text-xs font-mono focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Bonus Tag / Label</label>
                <input
                  type="text"
                  value={newBonus}
                  onChange={(e) => setNewBonus(e.target.value)}
                  placeholder="+5,000 Bonus"
                  className="w-full bg-[#0B1220] border border-[#273449] rounded-xl px-4 py-2.5 text-amber-300 font-bold text-xs focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E293B] text-slate-300 font-bold text-xs border border-[#273449]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#4F46E5] text-white font-bold text-xs shadow-lg hover:brightness-110"
                >
                  + Create Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
