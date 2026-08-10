'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import UserManagementModule from '@/components/UserManagementModule';
import WalletModule from '@/components/WalletModule';
import VipSvipModule from '@/components/VipSvipModule';
import CpModule from '@/components/CpModule';
import FamilyModule from '@/components/FamilyModule';
import HostBdModule from '@/components/HostBdModule';
import MomentsExploreModule from '@/components/MomentsExploreModule';
import SettingsModule from '@/components/SettingsModule';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'wallet' | 'vip' | 'cp' | 'family' | 'hostbd' | 'moments' | 'settings'>('users');
  const [telemetry, setTelemetry] = useState<any>({ totalUsers: 4, activeRooms: 1, totalResellers: 1, totalCoins: 10520000, totalDiamonds: 5535000 });

  const loadTelemetry = async () => {
    const data = await adminApi.getDashboard();
    if (data) setTelemetry(data);
  };

  useEffect(() => {
    loadTelemetry();
    const interval = setInterval(loadTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'users', label: '👥 User Management & Real Profiles', badge: telemetry.totalUsers || 4 },
    { id: 'wallet', label: '💰 Wallet & Currency Engine' },
    { id: 'vip', label: '👑 VIP & SVIP Nobility Center' },
    { id: 'cp', label: '💕 CP (Couple Pair) Center' },
    { id: 'family', label: '👨‍👩‍👧‍👦 Family Center & Guilds' },
    { id: 'hostbd', label: '🎙️ Host Center & BD Agency' },
    { id: 'moments', label: '📸 Moments & Explore Feed' },
    { id: 'settings', label: '⚙️ Settings & System Health' },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col md:flex-row selection:bg-purple-500 selection:text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#0B0F19] border-r border-[#1E2638] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-[#1E2638] flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/20">
              ⚡
            </div>
            <div>
              <h1 className="font-black text-base tracking-tight text-white">AURA LIVE NEXT.JS</h1>
              <p className="text-[10px] text-purple-400 font-mono font-bold">ENTERPRISE ADMIN PANEL</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="truncate">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer User Badge */}
        <div className="p-4 border-t border-[#1E2638] bg-[#07090E]/60 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300 font-bold">Admin_Master (UID: 999999)</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">SQLite DB Connected • Port 3001</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Header Telemetry Bar */}
        <header className="bg-[#0B0F19]/80 backdrop-blur-xl border-b border-[#1E2638] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-slate-400 font-mono">Next.js Web-Based Real-Time Control & Telemetry</p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-[#131A2B] border border-[#232D42] px-3 py-1.5 rounded-xl">
              <span className="text-slate-400">Coins:</span> <strong className="text-amber-400 font-bold">🪙 {(telemetry.totalCoins || 0).toLocaleString()}</strong>
            </div>
            <div className="bg-[#131A2B] border border-[#232D42] px-3 py-1.5 rounded-xl">
              <span className="text-slate-400">Diamonds:</span> <strong className="text-pink-400 font-bold">💎 {(telemetry.totalDiamonds || 0).toLocaleString()}</strong>
            </div>
          </div>
        </header>

        {/* Dynamic Module Panel View */}
        <div className="p-6">
          {activeTab === 'users' && <UserManagementModule />}
          {activeTab === 'wallet' && <WalletModule />}
          {activeTab === 'vip' && <VipSvipModule />}
          {activeTab === 'cp' && <CpModule />}
          {activeTab === 'family' && <FamilyModule />}
          {activeTab === 'hostbd' && <HostBdModule />}
          {activeTab === 'moments' && <MomentsExploreModule />}
          {activeTab === 'settings' && <SettingsModule />}
        </div>
      </main>
    </div>
  );
}
