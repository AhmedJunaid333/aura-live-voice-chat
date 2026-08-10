import React, { useState, useEffect } from 'react';
import { 
  Camera, Image as ImageIcon, Heart, Sparkles, Award, ShieldCheck, Crown, Flame, 
  Coins, Gem, Wallet, ArrowUpRight, ArrowDownLeft, Share2, QrCode, Settings, Shield, 
  HelpCircle, ChevronRight, Play, Video, Users, UserPlus, Eye, MessageCircle, 
  RotateCw, Plus, CheckCircle2, Star, Edit3, Palette, Sliders, ExternalLink, Info
} from 'lucide-react';
import { ProfilePhotoCropperModal } from '../components/ProfilePhotoCropperModal';
import { ProfileCoverEditorModal } from '../components/ProfileCoverEditorModal';
import { RelationshipCenterModal } from '../components/RelationshipCenterModal';
import { MedalCenterModal } from '../components/MedalCenterModal';
import { LevelCenterModal } from '../components/LevelCenterModal';
import { InvitationApplicationCenterModal } from '../components/InvitationApplicationCenterModal';
import { AccountSecurityModal } from '../components/AccountSecurityModal';
import { PrivacyControlsModal } from '../components/PrivacyControlsModal';
import { RewardsCenterModal } from '../components/RewardsCenterModal';
import { EditProfileModal } from '../components/EditProfileModal';
import { toast } from '../services/toastAndErrorService';
import { userProfileEngine, UserProfileData } from '../services/userProfileService';

export default function PremiumProfileScreen() {
  // Modal Triggers State
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showDpCropper, setShowDpCropper] = useState(false);
  const [showCoverEditor, setShowCoverEditor] = useState(false);
  const [showRelationshipCenter, setShowRelationshipCenter] = useState(false);
  const [showMedalCenter, setShowMedalCenter] = useState(false);
  const [showLevelCenter, setShowLevelCenter] = useState(false);
  const [showInvitationCenter, setShowInvitationCenter] = useState(false);
  const [showAccountSecurity, setShowAccountSecurity] = useState(false);
  const [showPrivacyControls, setShowPrivacyControls] = useState(false);
  const [showRewardsCenter, setShowRewardsCenter] = useState(false);
  const [selectedLevelCategory, setSelectedLevelCategory] = useState('charm');

  // Live Profile Engine Binding
  const [profile, setProfile] = useState<UserProfileData>(() => userProfileEngine.getProfile());
  const [userCoverUrl, setUserCoverUrl] = useState<string>(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'album' | 'live' | 'bonds'>('overview');

  useEffect(() => {
    const sync = () => setProfile(userProfileEngine.getProfile());
    sync();
    const unsub = userProfileEngine.subscribe(sync);
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white pb-24 overflow-x-hidden select-none">
      
      {/* 1. PROFILE HEADER WITH FULL-WIDTH GRADIENT & FLOATING PARTICLES */}
      <div className="relative w-full h-80 md:h-96 overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900">
        
        {/* Cover Photo Overlay */}
        <img
          src={userCoverUrl}
          alt="Album Cover"
          className="w-full h-full object-cover opacity-60 mix-blend-overlay scale-105 transition-transform duration-700 hover:scale-100"
        />

        {/* Ambient Glows & Floating Particles */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-5 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent pointer-events-none" />

        {/* Top Header Actions Bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setShowCoverEditor(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all hover:scale-105 cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-purple-300" />
            Edit Cover
          </button>
          <button 
            onClick={() => toast.info('QR Code generated!')}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-cyan-300" />
          </button>
          <button 
            onClick={() => toast.info('Share Profile link copied to clipboard!')}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>

      {/* 2. MAIN GLASSMORPHISM PROFILE CARD & AVATAR */}
      <div className="max-w-5xl mx-auto px-4 -mt-28 md:-mt-36 relative z-10 space-y-6">
        
        <div className="bg-[#141722]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-purple-900/20 relative overflow-hidden">
          
          {/* Shine Effect */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            
            {/* Avatar & Badges Info */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
              
              {/* Circular DP with Animated Gradient Border */}
              <div className="relative group cursor-pointer" onClick={() => setShowEditProfile(true)}>
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-purple-500 to-cyan-400 animate-spin-slow shadow-xl shadow-amber-500/20">
                  <div className="w-full h-full rounded-full overflow-hidden bg-black relative">
                    <img src={profile.avatar} alt="DP" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Online Indicator */}
                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#141722] flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                </div>

                {/* Change DP Camera Trigger */}
                <button
                  onClick={(e) => { e.stopPropagation(); setShowEditProfile(true); }}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity backdrop-blur-xs cursor-pointer"
                >
                  <Camera className="w-7 h-7 text-amber-300" />
                </button>
              </div>

              {/* User Identity Details (Clicking opens Edit Profile) */}
              <div 
                onClick={() => setShowEditProfile(true)}
                className="space-y-1.5 cursor-pointer group/identity p-1 rounded-2xl transition-colors hover:bg-white/5"
                title="Click to edit profile details"
              >
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl font-extrabold text-white tracking-wide group-hover/identity:text-purple-300 transition-colors">
                    {profile.username}
                  </h1>
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                  <span className="text-sm font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    {profile.countryFlag} {profile.country}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono">ID: AU{profile.userId} • Level {profile.level} Streamer</p>
                <p className="text-xs text-gray-300 max-w-md italic">"{profile.bio}"</p>

                {/* Badges Bar */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md shadow-amber-500/20">
                    👑 {profile.vipBadge || 'VIP 10'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-400/30">
                    Lv.{profile.level} XP
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                    🦁 {profile.familyName || 'Royal Lions'} Family
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    🏢 {profile.agencyName || 'Aura Agency #1'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRelationshipCenter(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-pink-500/20 transition-transform active:scale-95 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                Relationship Hub
              </button>
              <button
                onClick={() => setShowEditProfile(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#252A3B] hover:bg-[#32384D] text-white font-semibold text-xs rounded-2xl border border-[#3A415A] transition-colors cursor-pointer shadow-md hover:border-purple-500/50"
              >
                <Edit3 className="w-4 h-4 text-purple-400" />
                Edit Profile & Details
              </button>
            </div>

          </div>
        </div>


        {/* 3. COLORFUL QUICK STATS CARDS WITH GRADIENTS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          
          <div className="bg-gradient-to-br from-blue-600/20 to-indigo-900/40 p-3.5 rounded-2xl border border-blue-500/30 text-center space-y-1 backdrop-blur-md">
            <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Following</span>
            <p className="text-lg font-extrabold text-white">342</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-fuchsia-900/40 p-3.5 rounded-2xl border border-purple-500/30 text-center space-y-1 backdrop-blur-md">
            <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Followers</span>
            <p className="text-lg font-extrabold text-white">14.8K</p>
          </div>

          <div className="bg-gradient-to-br from-pink-600/20 to-rose-900/40 p-3.5 rounded-2xl border border-pink-500/30 text-center space-y-1 backdrop-blur-md">
            <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">Friends</span>
            <p className="text-lg font-extrabold text-white">128</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-600/20 to-teal-900/40 p-3.5 rounded-2xl border border-cyan-500/30 text-center space-y-1 backdrop-blur-md">
            <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">Visitors</span>
            <p className="text-lg font-extrabold text-white">8.4K</p>
          </div>

          <div className="bg-gradient-to-br from-amber-600/20 to-yellow-900/40 p-3.5 rounded-2xl border border-amber-500/30 text-center space-y-1 backdrop-blur-md">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Level</span>
            <p className="text-lg font-extrabold text-amber-400">Lv.45</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-900/40 p-3.5 rounded-2xl border border-yellow-500/30 text-center space-y-1 backdrop-blur-md">
            <span className="text-[10px] text-yellow-300 font-bold uppercase tracking-wider">Coins</span>
            <p className="text-lg font-extrabold text-yellow-400">1.45M</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-600/20 to-teal-900/40 p-3.5 rounded-2xl border border-emerald-500/30 text-center space-y-1 backdrop-blur-md">
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Diamonds</span>
            <p className="text-lg font-extrabold text-emerald-400">820K</p>
          </div>

          <div className="bg-gradient-to-br from-rose-600/20 to-red-900/40 p-3.5 rounded-2xl border border-rose-500/30 text-center space-y-1 backdrop-blur-md">
            <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider">Income</span>
            <p className="text-lg font-extrabold text-rose-400">$8.2K</p>
          </div>

        </div>

        {/* 3.5 UNIFIED LEVEL CENTER 6 INTERACTIVE LEVEL ROWS */}
        <div className="bg-[#141722]/80 p-5 rounded-3xl border border-white/10 backdrop-blur-xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              User & Host Level Ranks (Charm & Wealth Engine)
            </h3>
            <button
              onClick={() => {
                setSelectedLevelCategory('charm');
                setShowLevelCenter(true);
              }}
              className="text-xs text-amber-400 hover:underline font-bold"
            >
              Open Level Center (11 Levels) →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
            
            {/* Wealth Level */}
            <div 
              onClick={() => {
                setSelectedLevelCategory('wealth');
                setShowLevelCenter(true);
              }}
              className="p-3 bg-[#181B26] rounded-2xl border border-amber-500/30 hover:border-amber-400 flex items-center justify-between cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🏆</span>
                <div>
                  <h4 className="font-extrabold text-white">Wealth Level</h4>
                  <span className="text-[10px] text-gray-400">Coins & Diamonds Spent</span>
                </div>
              </div>
              <span className="font-extrabold text-amber-400 text-sm flex items-center gap-1">
                LV.15 <ChevronRight className="w-4 h-4 text-gray-500" />
              </span>
            </div>

            {/* Charm Level */}
            <div 
              onClick={() => {
                setSelectedLevelCategory('charm');
                setShowLevelCenter(true);
              }}
              className="p-3 bg-[#181B26] rounded-2xl border border-pink-500/30 hover:border-pink-400 flex items-center justify-between cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">💖</span>
                <div>
                  <h4 className="font-extrabold text-white">Charm Level</h4>
                  <span className="text-[10px] text-gray-400">Gifts & Diamonds Received</span>
                </div>
              </div>
              <span className="font-extrabold text-pink-400 text-sm flex items-center gap-1">
                LV.12 <ChevronRight className="w-4 h-4 text-gray-500" />
              </span>
            </div>

            {/* Host Level */}
            <div 
              onClick={() => {
                setSelectedLevelCategory('host');
                setShowLevelCenter(true);
              }}
              className="p-3 bg-[#181B26] rounded-2xl border border-purple-500/30 hover:border-purple-400 flex items-center justify-between cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">⭐</span>
                <div>
                  <h4 className="font-extrabold text-white">Host Level</h4>
                  <span className="text-[10px] text-gray-400">Live Broadcast Hours</span>
                </div>
              </div>
              <span className="font-extrabold text-purple-400 text-sm flex items-center gap-1">
                LV.08 <ChevronRight className="w-4 h-4 text-gray-500" />
              </span>
            </div>

            {/* VIP Level */}
            <div 
              onClick={() => {
                setSelectedLevelCategory('vip');
                setShowLevelCenter(true);
              }}
              className="p-3 bg-[#181B26] rounded-2xl border border-yellow-500/30 hover:border-yellow-400 flex items-center justify-between cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">👑</span>
                <div>
                  <h4 className="font-extrabold text-white">VIP Level</h4>
                  <span className="text-[10px] text-gray-400">Royalty Mall Tier</span>
                </div>
              </div>
              <span className="font-extrabold text-yellow-400 text-sm flex items-center gap-1">
                VIP 10 <ChevronRight className="w-4 h-4 text-gray-500" />
              </span>
            </div>

            {/* Family Level */}
            <div 
              onClick={() => {
                setSelectedLevelCategory('family');
                setShowLevelCenter(true);
              }}
              className="p-3 bg-[#181B26] rounded-2xl border border-rose-500/30 hover:border-rose-400 flex items-center justify-between cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">👨‍👩‍👧‍👦</span>
                <div>
                  <h4 className="font-extrabold text-white">Family Level</h4>
                  <span className="text-[10px] text-gray-400">Royal Lions Guild</span>
                </div>
              </div>
              <span className="font-extrabold text-rose-400 text-sm flex items-center gap-1">
                LV.25 <ChevronRight className="w-4 h-4 text-gray-500" />
              </span>
            </div>

            {/* Agency Level */}
            <div 
              onClick={() => {
                setSelectedLevelCategory('agency');
                setShowLevelCenter(true);
              }}
              className="p-3 bg-[#181B26] rounded-2xl border border-blue-500/30 hover:border-blue-400 flex items-center justify-between cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🏢</span>
                <div>
                  <h4 className="font-extrabold text-white">Agency Level</h4>
                  <span className="text-[10px] text-gray-400">Aura Agency #1</span>
                </div>
              </div>
              <span className="font-extrabold text-blue-400 text-sm flex items-center gap-1">
                LV.03 <ChevronRight className="w-4 h-4 text-gray-500" />
              </span>
            </div>

          </div>
        </div>

        {/* 4. GOLD VIP MALL SECTION */}

        <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20 p-5 rounded-3xl border border-amber-500/40 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-amber-500/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/30 font-black text-xl">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-amber-300 text-base">VIP 10 Royalty Membership</h3>
                <span className="text-[10px] bg-amber-400 text-black font-extrabold px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">Phantom Jet Entrance • Gold Aureola • Priority Seat • 2x Exp Boost</p>
              
              {/* Progress */}
              <div className="w-64 h-1.5 bg-black/40 rounded-full mt-2 overflow-hidden border border-amber-500/30">
                <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>

          <button
            onClick={() => toast.info('Redirecting to VIP Mall Store...')}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-extrabold text-xs rounded-xl shadow-lg transition-transform active:scale-95 whitespace-nowrap"
          >
            Upgrade VIP Perks
          </button>
        </div>

        {/* 5. RELATIONSHIP CARDS CAROUSEL */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              Relationship Bonds Showcase
            </h3>
            <button 
              onClick={() => setShowRelationshipCenter(true)}
              className="text-xs text-pink-400 hover:underline font-semibold"
            >
              View All 16 Cards →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 p-4 rounded-2xl border border-pink-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg">❤️</span>
                <span className="text-[10px] bg-pink-500 text-black font-bold px-2 py-0.5 rounded-full">CP Level 5</span>
              </div>
              <h4 className="font-bold text-white text-xs">Couple (CP) Card</h4>
              <p className="text-[11px] text-gray-400">Partner: Aura Princess (120 Days)</p>
            </div>

            <div className="bg-gradient-to-br from-amber-500/20 to-yellow-600/20 p-4 rounded-2xl border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg">⭐</span>
                <span className="text-[10px] bg-amber-400 text-black font-bold px-2 py-0.5 rounded-full">Best Friend Lv 3</span>
              </div>
              <h4 className="font-bold text-white text-xs">Best Friend Card</h4>
              <p className="text-[11px] text-gray-400">Partner: Gamer Pro (45 Days)</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 p-4 rounded-2xl border border-blue-500/30 space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-lg">🛡️</span>
                <span className="text-[10px] bg-blue-400 text-black font-bold px-2 py-0.5 rounded-full">New Bond</span>
              </div>
              <h4 className="font-bold text-white text-xs">Brother / Sister Card</h4>
              <button
                onClick={() => setShowRelationshipCenter(true)}
                className="w-full py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold text-[11px] rounded-lg border border-blue-500/30"
              >
                + Create Relationship
              </button>
            </div>

          </div>
        </div>

        {/* 6. WALLET & RECHARGE GLASS CARD */}
        <div className="bg-[#141722]/80 p-5 rounded-3xl border border-white/10 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              Aura Economy Wallet
            </h3>
            <span className="text-xs text-gray-400">Double-Entry Financial Ledger Verified</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-[#1D2232] p-4 rounded-2xl border border-[#2E354C] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 font-medium">Coin Balance</span>
                <p className="text-lg font-bold text-yellow-400 flex items-center gap-1">
                  <Coins className="w-4 h-4 text-yellow-400" /> 1,450,000
                </p>
              </div>
              <button 
                onClick={() => toast.info('Redirecting to Coin Recharge Store...')}
                className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs rounded-xl shadow-md"
              >
                Recharge
              </button>
            </div>

            <div className="bg-[#1D2232] p-4 rounded-2xl border border-[#2E354C] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 font-medium">Diamond Earnings</span>
                <p className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                  <Gem className="w-4 h-4 text-emerald-400" /> 820,000
                </p>
              </div>
              <button 
                onClick={() => toast.info('Redirecting to Diamond Cashout Request...')}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Cashout
              </button>
            </div>

            <div className="bg-[#1D2232] p-4 rounded-2xl border border-[#2E354C] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 font-medium">Monthly Host Salary</span>
                <p className="text-lg font-bold text-rose-400 flex items-center gap-1">
                  $1,500.00 USD
                </p>
              </div>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-1 rounded-lg border border-rose-500/30">
                Agency Verified
              </span>
            </div>

          </div>
        </div>

      </div>

        {/* 7. MEDAL & ACHIEVEMENT CENTER SHOWCASE */}
        <div className="bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-blue-900/30 p-5 rounded-3xl border border-amber-500/30 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Medal & Achievement Center (68% Unlocked)
            </h3>
            <button 
              onClick={() => setShowMedalCenter(true)}
              className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
            >
              Open Medal Center →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div 
              onClick={() => setShowMedalCenter(true)}
              className="bg-[#181B26] p-3 rounded-2xl border border-amber-500/30 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-2xl">👑</span>
              <div>
                <h4 className="font-extrabold text-white text-xs">VIP 10 Crown</h4>
                <span className="text-[10px] text-amber-400 font-bold">Equipped</span>
              </div>
            </div>

            <div 
              onClick={() => setShowMedalCenter(true)}
              className="bg-[#181B26] p-3 rounded-2xl border border-red-500/30 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-2xl">🔥</span>
              <div>
                <h4 className="font-extrabold text-white text-xs">PK Champion</h4>
                <span className="text-[10px] text-rose-400 font-bold">Legendary</span>
              </div>
            </div>

            <div 
              onClick={() => setShowMedalCenter(true)}
              className="bg-[#181B26] p-3 rounded-2xl border border-cyan-500/30 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-2xl">💎</span>
              <div>
                <h4 className="font-extrabold text-white text-xs">Top Gifter</h4>
                <span className="text-[10px] text-cyan-400 font-bold">1M Coins</span>
              </div>
            </div>

            <div 
              onClick={() => setShowMedalCenter(true)}
              className="bg-[#181B26] p-3 rounded-2xl border border-purple-500/30 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-2xl">🦁</span>
              <div>
                <h4 className="font-extrabold text-white text-xs">Family Leader</h4>
                <span className="text-[10px] text-purple-400 font-bold">Royal Lions</span>
              </div>
            </div>

            {/* Official Invitation / Partner Card */}
            <div 
              onClick={() => setShowInvitationCenter(true)}
              className="bg-gradient-to-br from-purple-900/60 to-pink-950/60 p-3 rounded-2xl border border-pink-500/40 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-2xl">👑</span>
              <div>
                <h4 className="font-extrabold text-white text-xs">Partner Program</h4>
                <span className="text-[10px] text-pink-300 font-bold">Host / Agency / BD</span>
              </div>
            </div>

            {/* Account Security & 2FA Card */}
            <div 
              onClick={() => setShowAccountSecurity(true)}
              className="bg-gradient-to-br from-emerald-950/60 to-purple-950/60 p-3 rounded-2xl border border-emerald-500/40 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-2xl">🛡️</span>
              <div>
                <h4 className="font-extrabold text-white text-xs">Account Security</h4>
                <span className="text-[10px] text-emerald-300 font-bold">2FA & Password Protection</span>
              </div>
            </div>

            {/* Privacy Controls Card */}
            <div 
              onClick={() => setShowPrivacyControls(true)}
              className="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 p-3 rounded-2xl border border-indigo-500/40 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="font-extrabold text-white text-xs">Privacy Controls</h4>
                <span className="text-[10px] text-indigo-300 font-bold">Online, Distance & Blocked</span>
              </div>
            </div>

            {/* Daily Rewards & Missions Card */}
            <div 
              onClick={() => setShowRewardsCenter(true)}
              className="bg-gradient-to-br from-amber-950/60 to-purple-950/60 p-3 rounded-2xl border border-amber-500/40 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="text-2xl">🎁</span>
              <div>
                <h4 className="font-extrabold text-white text-xs">Daily Rewards & Missions</h4>
                <span className="text-[10px] text-amber-300 font-bold">7-Day Streak & Free Diamonds</span>
              </div>
            </div>
          </div>
        </div>

      {/* MODALS INTEGRATION */}
      <ProfilePhotoCropperModal
        isOpen={showDpCropper}
        onClose={() => setShowDpCropper(false)}
        currentDpUrl={userDpUrl}
        onSaveDp={(newDp) => setUserDpUrl(newDp)}
      />

      <ProfileCoverEditorModal
        isOpen={showCoverEditor}
        onClose={() => setShowCoverEditor(false)}
        currentCoverUrl={userCoverUrl}
        onSaveCover={(newCover) => setUserCoverUrl(newCover)}
      />

      <RelationshipCenterModal
        isOpen={showRelationshipCenter}
        onClose={() => setShowRelationshipCenter(false)}
      />

      <MedalCenterModal
        isOpen={showMedalCenter}
        onClose={() => setShowMedalCenter(false)}
      />

      <LevelCenterModal
        isOpen={showLevelCenter}
        onClose={() => setShowLevelCenter(false)}
        defaultCategory={selectedLevelCategory === 'charm' ? 'Charm' : selectedLevelCategory === 'host' ? 'Host' : 'Wealth'}
      />

      <InvitationApplicationCenterModal
        isOpen={showInvitationCenter}
        onClose={() => setShowInvitationCenter(false)}
      />

      <AccountSecurityModal
        isOpen={showAccountSecurity}
        onClose={() => setShowAccountSecurity(false)}
      />

      <PrivacyControlsModal
        isOpen={showPrivacyControls}
        onClose={() => setShowPrivacyControls(false)}
      />

      <RewardsCenterModal
        isOpen={showRewardsCenter}
        onClose={() => setShowRewardsCenter(false)}
      />

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </div>
  );
}


