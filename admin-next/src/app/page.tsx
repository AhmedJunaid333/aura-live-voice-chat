'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import UserManagementModule from '@/components/UserManagementModule';
import WalletModule from '@/components/WalletModule';
import VipSvipModule from '@/components/VipSvipModule';
import LuckyGiftModule from '@/components/LuckyGiftModule';
import GiftHubModule from '@/components/GiftHubModule';
import AgencyModule from '@/components/AgencyModule';
import ResellerPortalModule from '@/components/ResellerPortalModule';
import CpModule from '@/components/CpModule';
import FamilyModule from '@/components/FamilyModule';
import HostBdModule from '@/components/HostBdModule';
import MomentsExploreModule from '@/components/MomentsExploreModule';
import EmojiModule from '@/components/EmojiModule';
import GamesEventsModule from '@/components/GamesEventsModule';
import CmsBroadcastModule from '@/components/CmsBroadcastModule';
import BannersModule from '@/components/BannersModule';
import AvatarFramesModule from '@/components/AvatarFramesModule';
import WallpapersModule from '@/components/WallpapersModule';
import FeatureFlagsModule from '@/components/FeatureFlagsModule';
import SettingsModule from '@/components/SettingsModule';
import AntiFraudModule from '@/components/AntiFraudModule';
import AudioRoomsModule from '@/components/AudioRoomsModule';
import TrustSafetyModule from '@/components/TrustSafetyModule';
import ReportsCenterModule from '@/components/ReportsCenterModule';
import MasterPortalModule from '@/components/MasterPortalModule';
import CountryHeadModule from '@/components/CountryHeadModule';
import RechargeHubModule from '@/components/RechargeHubModule';
import FinanceHubModule from '@/components/FinanceHubModule';
import DirectDiamondCreditModule from '@/components/DirectDiamondCreditModule';
import CeoGlobalPortalModule from '@/components/CeoGlobalPortalModule';
import AllPortalsAccessModule from '@/components/AllPortalsAccessModule';
import PerformanceHubModule from '@/components/PerformanceHubModule';
import IntelligenceHubModule from '@/components/IntelligenceHubModule';
import SecurityRolesModule from '@/components/SecurityRolesModule';
import ComplianceLogsModule from '@/components/ComplianceLogsModule';
import HostCenterModule from '@/components/HostCenterModule';
import VipUserLevelsModule from '@/components/VipUserLevelsModule';
import ApplicationsModule from '@/components/ApplicationsModule';

type TabKey =
  | 'ceo_portal'
  | 'all_portals_access'
  | 'performance_hub'
  | 'intelligence_hub'
  | 'security_roles'
  | 'compliance_logs'
  | 'users'
  | 'applications'
  | 'host_center'
  | 'vip_user_levels'
  | 'wallet'
  | 'vip'
  | 'lucky_gift'
  | 'agency'
  | 'sell_diamonds'
  | 'master_portal'
  | 'country_head'
  | 'recharge_hub'
  | 'finance_hub'
  | 'wallet_payouts'
  | 'direct_credit'
  | 'gifts_hub'
  | 'audio_rooms'
  | 'trust_safety'
  | 'reports_center'
  | 'cp'
  | 'family'
  | 'hostbd'
  | 'moments'
  | 'emoji'
  | 'games'
  | 'cms'
  | 'banners'
  | 'avatar_frames'
  | 'wallpapers'
  | 'feature_flags'
  | 'settings'
  | 'antifraud';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('performance_hub');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
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

  const navCategories = [
    {
      title: 'GOVERNANCE & ACCESS',
      items: [
        { id: 'ceo_portal', label: '🛡️ CEO Global Portal' },
        { id: 'all_portals_access', label: '🛡️ All Portals Access' },
        { id: 'performance_hub', label: '⏲️ Performance Hub' },
        { id: 'intelligence_hub', label: '📊 Intelligence Hub' },
        { id: 'security_roles', label: '🛡️ Security & Roles' },
        { id: 'compliance_logs', label: '📜 Compliance Logs' },
      ],
    },
    {
      title: 'USER ECOSYSTEM',
      items: [
        { id: 'users', label: '👥 User Directory & Credentials', badge: telemetry.totalUsers || 4 },
        { id: 'applications', label: '📋 Applications (Agency & Host)' },
        { id: 'host_center', label: '🏛️ Host Center' },
        { id: 'vip_user_levels', label: '📊 VIP & User Levels' },
        { id: 'cp', label: '💕 CP (Couple Pair) Center' },
        { id: 'family', label: '👨‍👩‍👧‍👦 Family Center & Guilds' },
        { id: 'moments', label: '📸 Moments & Explore Feed' },
      ],
    },
    {
      title: 'FINANCE & ECONOMY',
      items: [
        { id: 'master_portal', label: '👤 Master Portal' },
        { id: 'country_head', label: '🏛️ Country Head Portal' },
        { id: 'recharge_hub', label: '💳 Recharge Hub' },
        { id: 'finance_hub', label: '💳 Finance Hub' },
        { id: 'wallet_payouts', label: '💳 Wallet & Payouts' },
        { id: 'direct_credit', label: '💳 Direct Diamond Credit' },
        { id: 'sell_diamonds', label: '💳 Aura Sell Diamonds' },
      ],
    },
    {
      title: 'ENGAGEMENT & CMS',
      items: [
        { id: 'lucky_gift', label: '🎯 Lucky Gift Engine' },
        { id: 'gifts_hub', label: '🎁 Gifts Hub' },
        { id: 'emoji', label: '🎯 Emoji Management' },
        { id: 'games', label: '🎯 Games & Events' },
        { id: 'cms', label: '📢 CMS & Broadcast' },
        { id: 'banners', label: '🖼️ Banners' },
        { id: 'avatar_frames', label: '🔲 Avatar Frames Hub' },
        { id: 'wallpapers', label: '🖼️ Wallpapers' },
      ],
    },
    {
      title: 'PLATFORM & SAFETY',
      items: [
        { id: 'audio_rooms', label: '🎙️ Audio Rooms' },
        { id: 'trust_safety', label: '🛡️ Trust & Safety System' },
        { id: 'reports_center', label: '🚩 Reports Center' },
        { id: 'feature_flags', label: '🚩 Feature Flags' },
        { id: 'settings', label: '⚙️ System Config' },
        { id: 'antifraud', label: '🛡️ Anti-Fraud Center' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col md:flex-row selection:bg-purple-500 selection:text-white">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-[#0B0F19] border-b border-[#1E2638] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-black text-sm">
            ⚡
          </div>
          <div>
            <h1 className="font-black text-xs text-white">AURA LIVE ADMIN</h1>
            <span className="text-[9px] text-purple-400 font-mono font-bold block">ENTERPRISE PORTAL</span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <span>{mobileMenuOpen ? '✕ Close' : '☰ Menu'}</span>
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#0B0F19] border-r border-[#1E2638] flex flex-col justify-between shrink-0 transition-transform duration-300 md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="max-h-screen overflow-y-auto scrollbar-thin flex-1">
          {/* Logo Header */}
          <div className="p-5 border-b border-[#1E2638] flex items-center justify-between sticky top-0 bg-[#0B0F19] z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/20">
                ⚡
              </div>
              <div>
                <h1 className="font-black text-base tracking-tight text-white">AURA LIVE NEXT.JS</h1>
                <p className="text-[10px] text-purple-400 font-mono font-bold">ENTERPRISE ADMIN PANEL</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white font-bold text-sm"
            >
              ✕
            </button>
          </div>

          {/* Categorized Navigation Links */}
          <div className="p-3 space-y-5">
            {navCategories.map(cat => (
              <div key={cat.title} className="space-y-1">
                <h3 className="px-3 text-[10px] font-mono font-bold text-slate-500 tracking-wider uppercase">
                  {cat.title}
                </h3>
                {cat.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as TabKey);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
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
              </div>
            ))}
          </div>
        </div>

        {/* Footer User Badge */}
        <div className="p-4 border-t border-[#1E2638] bg-[#07090E]/60 text-xs font-mono sticky bottom-0 bg-[#0B0F19]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300 font-bold">Admin_Master (UID: 999999)</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">SQLite DB Connected • Port 3001</span>
        </div>
      </aside>

      {/* Backdrop Overlay for Mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Header Telemetry Bar */}
        <header className="bg-[#0B0F19]/80 backdrop-blur-xl border-b border-[#1E2638] px-4 md:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sticky top-0 z-30">
          <div>
            <h2 className="text-base md:text-lg font-black text-white">
              {navCategories.flatMap(c => c.items).find(n => n.id === activeTab)?.label}
            </h2>
            <p className="text-[10px] md:text-xs text-slate-400 font-mono">Next.js Web-Based Real-Time Control & Telemetry</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono w-full md:w-auto overflow-x-auto">
            <div className="bg-[#131A2B] border border-[#232D42] px-3 py-1.5 rounded-xl shrink-0">
              <span className="text-slate-400">Coins:</span> <strong className="text-amber-400 font-bold">🪙 {(telemetry.totalCoins || 0).toLocaleString()}</strong>
            </div>
            <div className="bg-[#131A2B] border border-[#232D42] px-3 py-1.5 rounded-xl shrink-0">
              <span className="text-slate-400">Diamonds:</span> <strong className="text-pink-400 font-bold">💎 {(telemetry.totalDiamonds || 0).toLocaleString()}</strong>
            </div>
          </div>
        </header>

        {/* Dynamic Module Panel View */}
        <div className="p-6">
          {activeTab === 'ceo_portal' && <CeoGlobalPortalModule />}
          {activeTab === 'all_portals_access' && <AllPortalsAccessModule />}
          {activeTab === 'performance_hub' && <PerformanceHubModule />}
          {activeTab === 'intelligence_hub' && <IntelligenceHubModule />}
          {activeTab === 'security_roles' && <SecurityRolesModule />}
          {activeTab === 'compliance_logs' && <ComplianceLogsModule />}
          {activeTab === 'users' && <UserManagementModule />}
          {activeTab === 'applications' && <ApplicationsModule />}
          {activeTab === 'host_center' && <HostCenterModule />}
          {activeTab === 'vip_user_levels' && <VipUserLevelsModule />}
          {activeTab === 'wallet' && <WalletModule />}
          {activeTab === 'vip' && <VipSvipModule />}
          {activeTab === 'agency' && <AgencyModule />}
          {activeTab === 'sell_diamonds' && <ResellerPortalModule />}
          {activeTab === 'master_portal' && <MasterPortalModule />}
          {activeTab === 'country_head' && <CountryHeadModule />}
          {activeTab === 'recharge_hub' && <RechargeHubModule />}
          {activeTab === 'finance_hub' && <FinanceHubModule />}
          {activeTab === 'wallet_payouts' && <WalletModule />}
          {activeTab === 'direct_credit' && <DirectDiamondCreditModule />}
          {activeTab === 'gifts_hub' && <GiftHubModule />}
          {activeTab === 'audio_rooms' && <AudioRoomsModule />}
          {activeTab === 'trust_safety' && <TrustSafetyModule />}
          {activeTab === 'reports_center' && <ReportsCenterModule />}
          {activeTab === 'cp' && <CpModule />}
          {activeTab === 'family' && <FamilyModule />}
          {activeTab === 'hostbd' && <HostBdModule />}
          {activeTab === 'moments' && <MomentsExploreModule />}
          {activeTab === 'lucky_gift' && <LuckyGiftModule />}
          {activeTab === 'emoji' && <EmojiModule />}
          {activeTab === 'games' && <GamesEventsModule />}
          {activeTab === 'cms' && <CmsBroadcastModule />}
          {activeTab === 'banners' && <BannersModule />}
          {activeTab === 'avatar_frames' && <AvatarFramesModule />}
          {activeTab === 'wallpapers' && <WallpapersModule />}
          {activeTab === 'feature_flags' && <FeatureFlagsModule />}
          {activeTab === 'settings' && <SettingsModule />}
          {activeTab === 'antifraud' && <AntiFraudModule />}
        </div>
      </main>
    </div>
  );
}
