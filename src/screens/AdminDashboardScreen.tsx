import React, { useState, useMemo } from 'react';
import { useAdminErrorLogs, handleEnterpriseError, showToast } from '../services/toastAndErrorService';
import { FollowActivitySection } from '../components/FollowActivitySection';
import { VipAndStoreManagementSection } from '../components/VipAndStoreManagementSection';
import { RelationshipManagementSection } from '../components/RelationshipManagementSection';
import { MedalManagementSection } from '../components/MedalManagementSection';
import { LiveStreamMonitorSection } from '../components/LiveStreamMonitorSection';
import { WithdrawalAndLedgerSection } from '../components/WithdrawalAndLedgerSection';
import { UnifiedCharmAndLevelSection } from '../components/UnifiedCharmAndLevelSection';
import { UserManagementAndKYCSection } from '../components/UserManagementAndKYCSection';
import { ApplicationManagementSection } from '../components/ApplicationManagementSection';
import { InvitationManagementSection } from '../components/InvitationManagementSection';
import { ChatModerationSection } from '../components/ChatModerationSection';
import { AccountSecuritySection } from '../components/AccountSecuritySection';
import { PrivacyModerationSection } from '../components/PrivacyModerationSection';
import { NotificationCampaignSection } from '../components/NotificationCampaignSection';
import { LanguageManagementSection } from '../components/LanguageManagementSection';
import { HelpAndFaqCMSSection } from '../components/HelpAndFaqCMSSection';
import { ProfileModerationSection } from '../components/ProfileModerationSection';
import { DiscoveryShuffleSection } from '../components/DiscoveryShuffleSection';
import { ResellerManagementSection } from '../components/ResellerManagementSection';
import { RechargeManagementSection } from '../components/RechargeManagementSection';
import { UserProfileDossierSection } from '../components/UserProfileDossierSection';
import { apiClient } from '../services/apiClient';



/* ────────── SVG ICON SET ────────── */
const Icon = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Family: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Live: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" /></svg>,
  Fund: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Agent: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Feedback: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Article: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
  Sms: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  Plugin: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 4a2 2 0 00-2 2v2H7a2 2 0 00-2 2v3a2 2 0 002 2h2v2a2 2 0 002 2h3a2 2 0 002-2v-2h2a2 2 0 002-2v-3a2 2 0 00-2-2h-2V6a2 2 0 00-2-2h-3z" /></svg>,
  Version: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Search: () => <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Bell: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  ChevronDown: () => <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  ChevronRight: () => <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
};

/* ────────── MODULE QUICK TAB BAR ────────── */
const MODULE_TABS = [
  { key: 'dashboard', label: '📊 Dashboard' },
  { key: 'reseller-management', label: '💼 Reseller & Diamond Ledger' },
  { key: 'user-management', label: '👥 User Management' },

  { key: 'relationship-management', label: '❤️ Relationship Management (16 Cards)' },
  { key: 'vip-store-management', label: '👑 VIP Mall & Virtual Store' },
  { key: 'follow-activity', label: '👥 Follow, Fans & Visitors' },
  { key: 'medal-management', label: '🏅 Medal & Achievement Management' },
  { key: 'charm-management', label: '💖 Charm & Unified Level Management' },
  { key: 'task-management', label: '✅ Task Management' },
  { key: 'grade-management', label: '🎖️ Grade Management' },
  { key: 'certification-management', label: '🪪 Host Certification' },
  { key: 'system-message-management', label: '📣 System Messages' },
  { key: 'invitation-management', label: '🔗 Invitation Management' },
  { key: 'chat-history', label: '💬 Chat History Audit' },
  { key: 'family-management', label: '👨‍👩‍👧‍👦 Family Guilds' },
  { key: 'live-management', label: '🎙️ Live Management' },
  { key: 'pk-time-rule-setting', label: '🔥 PK Time Rules' },
  { key: 'live-room-sound-effects', label: '🎵 Sound Effects' },
  { key: 'payment-interface', label: '💳 Payment Gateways' },
  { key: 'recharge-management', label: '📊 Recharge Management' },
  { key: 'withdrawal-management', label: '🏦 Cashout Withdrawals' },
  { key: 'salary-management', label: '💵 Salary Management' },
  { key: 'agent-account-management', label: '🏢 Agent Accounts' },
  { key: 'report-management', label: '⚠️ Safety Reports' },
  { key: 'plugin-configuration', label: '🎰 Mini-Games Plugin' },
  { key: 'system-audit-logs', label: '🛡️ Audit & Error Logs' },
  { key: 'tulasigame', label: '🐉 TulasiGame Config' },
  { key: 'version-list', label: '📱 App Version Release' },
] as const;

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState('dashboard'); // Default to Enterprise Overview & KPIs!
  const [adminTheme, setAdminTheme] = useState<'navy' | 'cyberpunk' | 'royal'>('navy');
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'reseller-management': true,
    userMgmt: true,

    familyMgmt: true,
    liveMgmt: true,
    fundMgmt: true,
    agentMgmt: true,
    feedbackMgmt: true,
    articleMgmt: false,
    smsMgmt: false,
    pluginMgmt: false,
    versionMgmt: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('ALL');
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarMenuSearch, setSidebarMenuSearch] = useState('');

  // Modals state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showSendCoinsModal, setShowSendCoinsModal] = useState(false);
  const [sendCoinAmount, setSendCoinAmount] = useState('10000');
  const [sendCoinType, setSendCoinType] = useState<'COINS' | 'DIAMONDS'>('COINS');
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('7');

  // Host Verification Drawer state
  const [selectedHostApp, setSelectedHostApp] = useState<any>(null);
  const [showHostReviewModal, setShowHostReviewModal] = useState(false);

  // Withdrawal Cashout Modal state
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  // System Message push state
  const [sysMsgTitle, setSysMsgTitle] = useState('');
  const [sysMsgBody, setSysMsgBody] = useState('');

  // Real-Time System Audit & Exception Log Stream
  const { logs: liveAdminLogs } = useAdminErrorLogs();

  /* ────────── DYNAMIC DATA ARRAYS (Zero Dummy Users) ────────── */
  const [usersList, setUsersList] = useState<any[]>([]);

  // TASK MANAGEMENT MISSIONS STATE
  const [tasksList, setTasksList] = useState([
    { id: 'TASK-101', name: 'Daily App Check-In', desc: 'Log in to Aura Live daily', category: 'Daily Mission', reward: '+50 Coins, +100 XP', limit: '1 / Day', target: 'All Users', active: true },
    { id: 'TASK-102', name: 'Watch 15-Min Live Broadcast', desc: 'Watch any audio/video stream for 15 mins', category: 'Daily Mission', reward: '+100 Coins, +200 XP', limit: '4 / Day', target: 'All Users', active: true },
    { id: 'TASK-103', name: 'Send Gift to Creator Host', desc: 'Spend 500+ Coins on any live gift', category: 'Broadcasting Mission', reward: '+500 XP, VIP Badge Glow', limit: '10 / Day', target: 'VIP Users', active: true },
    { id: 'TASK-104', name: 'Host 1-Hour Broadcast', desc: 'Broadcast live audio room for 60 minutes', category: 'Host Creator Mission', reward: '+1,000 Diamonds, Host Star', limit: '1 / Day', target: 'Verified Hosts', active: true },
    { id: 'TASK-105', name: 'Invite 3 New Friends', desc: 'Share referral link and sign up 3 users', category: 'Invitation Mission', reward: '+2,000 Coins', limit: '5 / Day', target: 'All Users', active: true },
  ]);

  // GRADE LEVELS STATE
  const [gradeLevelsList, setGradeLevelsList] = useState([
    { level: 1, gradeName: 'Novice Streamer', reqXp: 0, perk: 'Basic Avatar Frame', color: 'text-slate-400' },
    { level: 10, gradeName: 'Bronze Rising Star', reqXp: 10000, perk: 'Bronze Entrance Effect + Chat Bubble', color: 'text-amber-600' },
    { level: 25, gradeName: 'Silver Vanguard', reqXp: 50000, perk: 'Silver Wings Frame + Speedster Coupe Car', color: 'text-slate-300' },
    { level: 50, gradeName: 'Gold Champion', reqXp: 250000, perk: 'Gold Aureola + Ferrari F8 Vehicle', color: 'text-amber-400' },
    { level: 75, gradeName: 'Diamond Sovereign', reqXp: 1000000, perk: 'Diamond Prism + Bugatti Chiron + Priority Seat', color: 'text-cyan-400' },
    { level: 100, gradeName: 'Aura Pantheon Deity', reqXp: 5000000, perk: 'Godlike Realm Entrance + Starship Cruiser', color: 'text-[#4F46E5]' },
  ]);

  // SYSTEM MESSAGES STATE
  const [systemMessagesList, setSystemMessagesList] = useState<any[]>([]);

  // INVITATIONS STATE
  const [invitationsList, setInvitationsList] = useState<any[]>([]);

  // CHAT HISTORY AUDIT STATE
  const [chatHistoryList, setChatHistoryList] = useState<any[]>([]);

  // CERTIFICATIONS STATE
  const [certificationsList, setCertificationsList] = useState<any[]>([]);

  // ROOMS LIST STATE
  const [roomsList] = useState<any[]>([]);

  const [pkRules] = useState([
    { id: 'PK-1', name: '5-Minute Classic PK', duration: 300, multiplier: '2x Bonus', minWin: 10000, status: 'ACTIVE' },
    { id: 'PK-2', name: '10-Minute Mega Championship', duration: 600, multiplier: '3x Gold Multiplier', minWin: 50000, status: 'ACTIVE' },
  ]);

  // PK TIME RULES STATE
  const [pkTimeRules, setPkTimeRules] = useState([
    { ruleId: 'PK-RULE-1', durationMinutes: 5, bonusMultiplier: '2x', minCoinsToWin: 10000, active: true },
    { ruleId: 'PK-RULE-2', durationMinutes: 10, bonusMultiplier: '3x Mega', minCoinsToWin: 50000, active: true },
  ]);

  // AGENT ACCOUNTS STATE
  const [agentAccounts, setAgentAccounts] = useState<any[]>([]);

  // RECHARGES & CASH OUTS STATE
  const [rechargesList] = useState<any[]>([]);
  const [withdrawalsList, setWithdrawalsList] = useState<any[]>([]);


  // SYSTEM AUDIT LOGS
  const [auditLogs, setAuditLogs] = useState([
    { id: 'log-1', type: 'TASK_CREATE', desc: 'Admin added new Task Mission #TASK-105', time: '5m ago', status: 'ACTIVE' },
  ]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = userStatusFilter === 'ALL' || u.status === userStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [usersList, searchQuery, userStatusFilter]);

  /* ────────── HANDLERS ────────── */
  const handleToggleTaskStatus = (taskId: string) => {
    setTasksList(prev => prev.map(t => t.id === taskId ? { ...t, active: !t.active } : t));
  };

  const handleSendSystemMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sysMsgTitle || !sysMsgBody) return;
    const newMsg = {
      id: `SYS-${Date.now()}`,
      title: sysMsgTitle,
      body: sysMsgBody,
      target: 'All Active Users',
      sentAt: 'Just now',
      status: 'SENT',
    };
    setSystemMessagesList(prev => [newMsg, ...prev]);
    setSysMsgTitle('');
    setSysMsgBody('');
    alert('System Broadcast Message dispatched to all active users!');
  };

  const handleDeleteChatMessage = (msgId: string) => {
    setChatHistoryList(prev => prev.filter(c => c.id !== msgId));
    alert(`Chat message ${msgId} deleted & removed from stream.`);
  };

  const handleConfirmBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !banReason.trim()) return;
    setUsersList(prev => prev.map(u => u.id === selectedUser.id ? { ...u, status: 'BANNED' } : u));
    setShowBanModal(false);
    setShowUserDetailModal(false);
    alert(`User ${selectedUser.name} banned.`);
  };

  const handleToggleFreezeWallet = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, walletFrozen: !u.walletFrozen } : u));
  };

  const handleSendCoinsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const amount = parseInt(sendCoinAmount) || 0;
    setUsersList(prev => prev.map(u => u.id === selectedUser.id ? { ...u, coins: u.coins + amount } : u));
    setShowSendCoinsModal(false);
    alert(`Sent ${amount} coins.`);
  };

  const handleHostAction = (appId: string, action: 'APPROVE' | 'REJECT') => {
    setCertificationsList(prev => prev.map(h => h.id === appId ? { ...h, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : h));
    setShowHostReviewModal(false);
  };

  const handleTabSelect = (key: string) => {
    setActiveTab(key);
    setMobileDrawerOpen(false);
  };


  /* ────────── EXACT BOGOLIVE ENTERPRISE SIDEBAR NAVIGATION ────────── */
  const sidebarMenu = [
    { id: 'dashboard', title: 'Dashboard Overview', icon: <Icon.Dashboard /> },
    {
      id: 'reseller-management',
      title: '💼 Reseller & Diamond Ledger',
      icon: <Icon.Fund />,
      items: [
        'Reseller Overview',
        'Send Official Invitation',
        'Reseller Applications',
        'Active Resellers',
        'Company Diamond Allocations',
        'Atomic Diamond Ledger',
      ],
    },
    {
      id: 'vip-store-management',
      title: '👑 VIP Mall & Virtual Store Catalog',
      icon: <Icon.Plugin />,
      items: [
        'VIP Mall Config',
        'VIP Tiers (VIP 1 - 6)',
        'Virtual Store Catalog',
        'Live Entry Effects',
        'Mic Waves',
        'Profile Cards & Vehicles',
        'Store Item Pricing',
        'VIP Revenue Analytics',
      ],
    },
    {
      id: 'userMgmt', title: 'User Management', icon: <Icon.Users />,

      items: [
        'User Dashboard',
        'All Users',
        'User Profile',
        'Relationship Management (16 Cards)',
        'CP Cards',
        'Best Friend Cards',
        'Brother Cards',
        'Sister Cards',
        'Siblings Cards',
        'Pending Requests',
        'Active Relationships',
        'Relationship Levels (1-10)',
        'Relationship Rewards',
        'Relationship Missions',
        'Relationship Analytics',
        'Relationship Audit Logs',
        'Medal Management (14 Categories)',
        'All Medals',
        'Medal Categories',
        'Create Medal',
        'Medal Rewards',
        'Medal Conditions',
        'User Medals',
        'Event Medals',
        'Seasonal Medals',
        'Hidden Medals',
        'Medal Analytics',
        'Medal Reports',
        'Medal Audit Logs',
        'Charm Management (Unified Levels)',
        'Charm Levels (1-100)',
        'XP Rules & Formula',
        'Charm Rewards',
        'Charm Privileges',
        'Charm Rankings',
        'Host Charm',
        'User Charm',
        'Charm Analytics',
        'Charm Audit Logs',
        'Charm Settings',
        'User Verification (KYC)',
        'Certification Management',
        'Grade / Level Management',
        'XP & Progress Management',
        'VIP Management',
        'Host Management',
        'Agency Assignment',
        'Family Assignment',
        'Wallet Management',
        'Task Management',
        'Invitation Management',
        'Referral System',
        'Friends & Followers',
        'Chat History',
        'User Reports',
        'User Violations',
        'Device Management',
        'Login History',
        'Session Management',
        'Notification Center',
        'System Messages',
        'User Analytics',
        'Audit Logs',
        'User Settings'
      ]
    },
    {
      id: 'familyMgmt', title: 'Family Management', icon: <Icon.Family />,
      items: [
        'All Families',
        'Family Applications',
        'Family Categories',
        'Family Levels',
        'Family Rankings',
        'Family Events',
        'Family Missions',
        'Family Rewards',
        'Family Wallet',
        'Family Treasury',
        'Family Chat',
        'Family Voice Room',
        'Family Invitations',
        'Family Requests',
        'Family Members',
        'Family Leaders',
        'Family Moderators',
        'Family Analytics',
        'Family Reports',
        'Family Settings',
        'Family Audit Logs'
      ]
    },
    {
      id: 'liveMgmt', title: 'Live Management', icon: <Icon.Live />,
      items: [
        'Live Dashboard',
        'Live Rooms',
        'Live Room Details',
        'Live Categories',
        'Live Hosts',
        'Live Guests / Seats',
        'PK Management',
        'PK Time Rule Settings',
        'Live Room Sound Effects',
        'Live Gifts',
        'Lucky Gifts',
        'Treasure Box',
        'Live Entry Effects',
        'Live Exit Effects',
        'Live Announcements',
        'Live Chat Moderation',
        'Live Comments',
        'Live Reactions & Emojis',
        'Live Voice Rooms',
        'Live Video Rooms',
        'Live Games',
        'Live Events',
        'Live Recording',
        'Live Replay',
        'Live Reports',
        'Live Violations',
        'Live Analytics',
        'Live Revenue',
        'Live Notifications',
        'Live Settings',
        'Live Permissions',
        'Live Audit Logs'
      ]
    },
    {
      id: 'fundMgmt', title: 'Fund Management', icon: <Icon.Fund />,
      items: [
        'Fund Dashboard',
        'Payment Interface',
        'Payment Gateways',
        'Recharge Management',
        'Recharge Packages',
        'Recharge Orders',
        'Manual Recharge',
        'Promo Codes & Coupons',
        'Bank List',
        'Bank Accounts',
        'Withdrawal Management',
        'Withdrawal Requests',
        'Withdrawal Approval Queue',
        'Settlement Management',
        'Salary Management',
        'Host Salary',
        'Agency Commission',
        'Family Rewards',
        'Revenue Sharing',
        'Wallet Management',
        'Coin Management',
        'Diamond Management',
        'Transaction Management',
        'Refund Management',
        'Tax Management',
        'Financial Reports',
        'Statistical Management',
        'Fraud Detection',
        'Risk Control',
        'Fund Audit Logs',
        'Fund Settings'
      ]
    },
    {
      id: 'agentMgmt', title: 'Agent Recharge Management', icon: <Icon.Agent />,
      items: [
        'Agent Dashboard',
        'Agent Account Management',
        'Master Agents',
        'Sub Agents',
        'Agent Levels',
        'Agent Verification',
        'Agent Wallet',
        'Agent Recharge',
        'Recharge Records',
        'Sales Records',
        'Commission Management',
        'Commission Rules',
        'Invitation Management',
        'Invitation Records',
        'Referral Network',
        'Agency Payment Methods',
        'Settlement Management',
        'Agent Withdrawals',
        'Performance Management',
        'Leaderboards',
        'Agent Statistics',
        'Agent Reports',
        'Agent Audit Logs',
        'Agent Notifications',
        'Agent Settings'
      ]
    },
    {
      id: 'feedbackMgmt', title: 'Feedback & Trust & Safety', icon: <Icon.Feedback />,
      items: [
        'Feedback Dashboard',
        'Report Management',
        'Feedback Management',
        'Complaint Management',
        'Suggestions Management',
        'Bug Reports',
        'Feature Requests',
        'Abuse Reports',
        'Content Moderation Reports',
        'User Appeals',
        'Customer Support Tickets',
        'Live Room Reports',
        'Host Reports',
        'Gift & Payment Complaints',
        'Chat Moderation Reports',
        'Review & Rating Management',
        'Resolution Center',
        'Feedback Analytics',
        'Support Notification Center',
        'Feedback Audit Logs',
        'Feedback Settings'
      ]
    },
    {
      id: 'articleMgmt', title: 'Article Management (CMS Hub)', icon: <Icon.Article />,
      items: [
        'CMS Dashboard',
        'Article Management',
        'Categories',
        'Sub Categories',
        'Tags Management',
        'Frequently Asked Questions (FAQ)',
        'Help Center',
        'Tutorials & Guides',
        'News & Announcements',
        'Policy & Legal Documents',
        'Terms & Conditions',
        'Privacy Policy',
        'Community Guidelines',
        'Safety Center',
        'Featured Articles',
        'Article Comments',
        'Ratings & Feedback',
        'Search Management',
        'Article Analytics',
        'Content Approval Workflow',
        'Drafts',
        'Media Library',
        'Localization (Multi-Language)',
        'SEO Management',
        'Publish Push Notifications',
        'Version History',
        'Article Audit Logs',
        'CMS Settings'
      ]
    },
    {
      id: 'smsMgmt', title: 'SMS & Messaging Infrastructure', icon: <Icon.Sms />,
      items: [
        'SMS Dashboard',
        'SMS Interface List',
        'SMS Providers',
        'SMS Templates',
        'OTP Management',
        'System Message List',
        'Business Queue List',
        'Marketing SMS Campaigns',
        'Bulk SMS',
        'Scheduled SMS',
        'SMS Delivery Reports',
        'Failed SMS Queue',
        'Retry Queue',
        'Blacklist Management',
        'Country & Region Rules',
        'SMS Analytics',
        'Cost Management',
        'Notifications Integration',
        'SMS Audit Logs',
        'SMS Settings'
      ]
    },
    {
      id: 'pluginMgmt', title: 'Plugin Management (Extension Framework)', icon: <Icon.Plugin />,
      items: [
        'Plugin Dashboard',
        'Plugin Configuration',
        'Plugin Marketplace',
        'Installed Plugins',
        'Plugin Categories',
        'Game Plugins (TulasiGame)',
        'Payment Plugins',
        'Social Login Plugins',
        'Notification Plugins',
        'AI Plugins',
        'Analytics Plugins',
        'Storage Plugins',
        'Streaming Plugins',
        'Security Plugins',
        'Third-Party API Plugins',
        'Plugin Dependencies',
        'Plugin Permissions',
        'Plugin Scheduler',
        'Plugin Logs',
        'Plugin Health Monitor',
        'Plugin Version Manager',
        'Plugin Backup & Restore',
        'Plugin Audit Logs',
        'Plugin Settings'
      ]
    },
    {
      id: 'versionMgmt', title: 'Version Management', icon: <Icon.Version />,
      items: ['Version List']
    },
  ];

  const themeStyles = {
    navy: {
      bg: 'bg-[#070B14]',
      card: 'bg-[#0E1626]',
      cardHover: 'hover:bg-[#131E33]',
      sidebar: 'bg-[#0A101D]',
      header: 'bg-[#0A101D]',
      border: 'border-[#1B273F]',
      subtleBorder: 'border-[#1B273F]/70',
      activeItem: 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30',
      accentText: 'text-cyan-400',
      accentBadge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    },
    cyberpunk: {
      bg: 'bg-[#07040E]',
      card: 'bg-[#120A24]',
      cardHover: 'hover:bg-[#1A0E33]',
      sidebar: 'bg-[#0C0618]',
      header: 'bg-[#0C0618]',
      border: 'border-[#29184D]',
      subtleBorder: 'border-[#29184D]/70',
      activeItem: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30',
      accentText: 'text-purple-400',
      accentBadge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
    royal: {
      bg: 'bg-[#0A0A0C]',
      card: 'bg-[#16161A]',
      cardHover: 'hover:bg-[#1F1F24]',
      sidebar: 'bg-[#0F0F12]',
      header: 'bg-[#0F0F12]',
      border: 'border-[#2D2A20]',
      subtleBorder: 'border-[#2D2A20]/70',
      activeItem: 'bg-gradient-to-r from-amber-600 to-emerald-600 text-white shadow-lg shadow-amber-600/30',
      accentText: 'text-amber-400',
      accentBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
  }[adminTheme];

  const filteredSidebarMenu = sidebarMenu.map(sec => {
    if (!sidebarMenuSearch.trim() || !sec.items) return sec;
    const matching = sec.items.filter(it => it.toLowerCase().includes(sidebarMenuSearch.toLowerCase()));
    return { ...sec, items: matching };
  }).filter(sec => !sidebarMenuSearch.trim() || (sec.items && sec.items.length > 0) || sec.title.toLowerCase().includes(sidebarMenuSearch.toLowerCase()));

  return (
    <div className={`flex flex-col h-screen w-full ${themeStyles.bg} text-slate-100 font-sans overflow-hidden select-none transition-colors duration-300`}>

      {/* 🌟 1. ENTERPRISE TOP EXECUTIVE HEADER BAR */}
      <header className={`flex items-center justify-between px-3 md:px-6 py-2.5 ${themeStyles.header} border-b ${themeStyles.border} z-30 shrink-0 shadow-lg`}>
        {/* Left branding & toggles */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Drawer Button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/60 transition"
            title="Open Admin Navigation"
          >
            <Icon.Menu />
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
            className="hidden lg:flex p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/60 transition"
            title="Toggle Sidebar Width"
          >
            {desktopSidebarOpen ? <Icon.Close /> : <Icon.Menu />}
          </button>

          {/* Brand Logo & Version Pill */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center font-black text-base text-white shadow-md shadow-indigo-500/20">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold tracking-tight text-white text-sm md:text-base leading-tight">
                  AURA LIVE
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  Admin Console v2.6
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 leading-tight hidden sm:block">
                sole.auralive.net • Enterprise Governance & Operations
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Streaming Telemetry Pill */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs shadow-inner">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium">Engine: <b className="text-emerald-400">99.99% Live</b></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[11px]">Latency: <b className="text-cyan-400">18ms</b></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[11px]">Rooms: <b className="text-purple-400">{roomsList.length} Active</b></span>
        </div>

        {/* Right Controls: Theme Customizer, Search & Root Admin Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Switcher Pills */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800/80">
            <button
              onClick={() => setAdminTheme('navy')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${adminTheme === 'navy' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              title="Deep Space Navy Theme"
            >
              🌌 Navy
            </button>
            <button
              onClick={() => setAdminTheme('cyberpunk')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${adminTheme === 'cyberpunk' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              title="Cyberpunk Neon Theme"
            >
              🟣 Cyber
            </button>
            <button
              onClick={() => setAdminTheme('royal')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${adminTheme === 'royal' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              title="Royal Gold & Onyx Theme"
            >
              👑 Gold
            </button>
          </div>

          {/* Quick Push System Message */}
          <button
            onClick={() => setActiveTab('system-message-management')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition hover:scale-105"
          >
            <span>📢</span>
            <span>Broadcast</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white transition"
          >
            <Icon.Bell />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {/* Root Admin User Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-black text-xs text-white shadow">
              1
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight">Root Admin</p>
              <p className="text-[10px] font-mono text-emerald-400 leading-tight">ID: 100001</p>
            </div>
          </div>
        </div>
      </header>

      {/* 🌟 2. HORIZONTAL MODULE TABS QUICK BAR */}
      <div className={`flex items-center gap-1.5 px-3 py-2 ${themeStyles.header}/90 border-b ${themeStyles.border} overflow-x-auto shrink-0 hide-scrollbar`} style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        {MODULE_TABS.map(t => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => handleTabSelect(t.key)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? themeStyles.activeItem
                  : `bg-slate-800/60 text-slate-300 hover:text-white border ${themeStyles.subtleBorder} hover:bg-slate-800`
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 🌟 3. MAIN WORKSPACE WITH DESKTOP SIDEBAR + CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ── DESKTOP PERSISTENT LEFT SIDEBAR ── */}
        {desktopSidebarOpen && (
          <aside className={`hidden lg:flex flex-col w-72 ${themeStyles.sidebar} border-r ${themeStyles.border} shrink-0 shadow-xl transition-all duration-300`}>
            {/* Sidebar Search within Menu */}
            <div className="p-3 border-b border-slate-800/80">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon.Search />
                </span>
                <input
                  type="text"
                  placeholder="Filter 65+ modules..."
                  value={sidebarMenuSearch}
                  onChange={e => setSidebarMenuSearch(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Sidebar Navigation Menu */}
            <nav className="p-3 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
              {filteredSidebarMenu.map(sec => {
                const isAccordion = !!sec.items;
                const isOpen = openSections[sec.id] || sidebarMenuSearch.length > 0;

                return (
                  <div key={sec.id} className="space-y-0.5">
                    <button
                      onClick={() => isAccordion ? toggleSection(sec.id) : handleTabSelect(sec.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
                        isOpen ? 'bg-slate-800/80 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={themeStyles.accentText}>{sec.icon}</span>
                        <span className="text-xs font-semibold tracking-wide">{sec.title}</span>
                      </div>
                      {isAccordion && (
                        <span className="text-slate-400">{isOpen ? <Icon.ChevronDown /> : <Icon.ChevronRight />}</span>
                      )}
                    </button>

                    {isAccordion && isOpen && (
                      <div className={`pl-6 pr-1 py-1 space-y-0.5 border-l-2 ${themeStyles.border} ml-4`}>
                        {sec.items!.map(sub => {
                          const targetKey = sub.toLowerCase().replace(/\s+/g, '-');
                          const isSubActive = activeTab === targetKey;
                          return (
                            <button
                              key={sub}
                              onClick={() => handleTabSelect(targetKey)}
                              className={`w-full text-left py-1.5 px-2.5 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                                isSubActive
                                  ? `${themeStyles.activeItem} font-bold`
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                              }`}
                            >
                              {sub}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Sidebar Footer Info */}
            <div className={`p-3 border-t ${themeStyles.border} bg-slate-950/40 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-semibold text-slate-300">Live Secure Gateway</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">SSL 256-bit</span>
            </div>
          </aside>
        )}

        {/* ── MOBILE OVERLAY DRAWER ── */}
        {mobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop Blur */}
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileDrawerOpen(false)}
            />

            {/* Sliding Drawer */}
            <aside className={`relative w-80 max-w-[85vw] ${themeStyles.sidebar} border-r ${themeStyles.border} flex flex-col z-50 shadow-2xl h-full`} style={{ animation: 'slideInLeft 0.25s ease-out' }}>
              <div className={`h-14 flex items-center justify-between px-4 border-b ${themeStyles.border}`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-sm text-white">A</div>
                  <h2 className="font-extrabold text-white text-sm">Navigation Menu</h2>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
                >
                  <Icon.Close />
                </button>
              </div>

              {/* Mobile Drawer Navigation List */}
              <nav className="p-3 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
                {sidebarMenu.map(sec => {
                  const isAccordion = !!sec.items;
                  const isOpen = openSections[sec.id];

                  return (
                    <div key={sec.id} className="space-y-0.5">
                      <button
                        onClick={() => isAccordion ? toggleSection(sec.id) : (handleTabSelect(sec.id), setMobileDrawerOpen(false))}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className={themeStyles.accentText}>{sec.icon}</span>
                          <span className="text-xs font-semibold">{sec.title}</span>
                        </div>
                        {isAccordion && (
                          <span className="text-slate-400">{isOpen ? <Icon.ChevronDown /> : <Icon.ChevronRight />}</span>
                        )}
                      </button>

                      {isAccordion && isOpen && (
                        <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-slate-700 ml-4">
                          {sec.items!.map(sub => {
                            const targetKey = sub.toLowerCase().replace(/\s+/g, '-');
                            const isSubActive = activeTab === targetKey;
                            return (
                              <button
                                key={sub}
                                onClick={() => {
                                  handleTabSelect(targetKey);
                                  setMobileDrawerOpen(false);
                                }}
                                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-medium transition ${
                                  isSubActive ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                              >
                                {sub}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Mobile Drawer Footer */}
              <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
                <span>Root ID: 100001</span>
                <span className="text-emerald-400 font-bold">Online</span>
              </div>
            </aside>
          </div>
        )}

        {/* ── 🌟 4. MAIN CONTENT WORKSPACE VIEW ── */}
        <main className={`flex-1 overflow-y-auto p-3 md:p-6 space-y-6 ${themeStyles.bg} custom-scrollbar`} style={{ WebkitOverflowScrolling: 'touch' }}>

          {/* Breadcrumbs & Global Search Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span>Aura Admin</span>
                <span>/</span>
                <span className="text-indigo-400 font-semibold uppercase">{activeTab.replace(/-/g, ' ')}</span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-white tracking-tight mt-0.5">
                {MODULE_TABS.find(m => m.key === activeTab)?.label || activeTab.replace(/-/g, ' ').toUpperCase()}
              </h2>
            </div>

            {/* Quick Content Search */}
            <div className="relative w-full sm:w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon.Search />
              </span>
              <input
                type="text"
                placeholder="Search user UID, room, certificate..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
              />
            </div>
          </div>

        {/* 0. DASHBOARD */}
        {activeTab === 'dashboard' && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">System Telemetry & Enterprise Overview</h2>
              <p className="text-xs text-[#94A3B8]">sole.auralive.net enterprise operational dashboard</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Registered Database Users', value: `${usersList.length} Users`, change: 'Live DB Stream', accent: 'bg-[#3B82F6]' },
                { label: 'Active Missions', value: `${tasksList.length} Tasks`, change: '100% Active', accent: 'bg-[#4F46E5]' },
                { label: 'Host Certifications', value: `${certificationsList.length} Requests`, change: 'Pending Queue', accent: 'bg-[#F59E0B]' },
                { label: 'Agent Accounts', value: `${agentAccounts.length} Agents`, change: 'Active Accounts', accent: 'bg-[#06B6D4]' },
              ].map((k, i) => (

                <div key={i} className="bg-[#131C2E] border border-[#273449] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-[#CBD5E1]">{k.label}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981]">{k.change}</span>
                    </div>
                    <div className="text-xl font-black text-white mt-1">{k.value}</div>
                  </div>
                  <div className={`h-1 w-full rounded-full ${k.accent} mt-3`} />
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'relationship-management' ||
          activeTab.startsWith('relationship-') ||
          activeTab.includes('cards') ||
          activeTab.includes('cp') ||
          activeTab.includes('friend') ||
          activeTab.includes('brother') ||
          activeTab.includes('sister') ||
          activeTab.includes('sibling') ||
          activeTab.includes('requests') ||
          activeTab.includes('active-relationships')) && (
          <RelationshipManagementSection activeSubKey={activeTab} />
        )}

        {/* FOLLOW, FANS & VISITORS ACTIVITY */}
        {activeTab === 'follow-activity' && (
          <FollowActivitySection />
        )}

        {/* VIP MALL & STORE MANAGEMENT */}
        {(activeTab === 'vip-store-management' ||
          activeTab.startsWith('vip-') ||
          activeTab.startsWith('virtual-store') ||
          activeTab.includes('vip') ||
          activeTab.includes('store') ||
          activeTab.includes('entry-effects') ||
          activeTab.includes('mic-waves')) && (
          <VipAndStoreManagementSection />
        )}

        {/* 2. MEDAL & ACHIEVEMENT MANAGEMENT */}
        {(activeTab === 'medal-management' || activeTab.includes('medal') || activeTab.includes('badge')) && (
          <MedalManagementSection />
        )}

        {/* 3. LIVE STREAM & 10/15/20 SEATS MONITOR */}
        {(activeTab === 'live-management' || activeTab.startsWith('live-') || activeTab === 'pk-time-rule-setting') && (
          <LiveStreamMonitorSection />
        )}

        {/* 4. FINANCIAL LEDGER & CASHOUTS */}
        {(activeTab === 'withdrawal-management' || activeTab === 'recharge-management' || activeTab === 'salary-management') && (
          <WithdrawalAndLedgerSection />
        )}

        {/* 5. CHARM & UNIFIED LEVEL 1-100 */}
        {(activeTab === 'charm-management' || activeTab.startsWith('charm-') || activeTab === 'grade-management') && (
          <UnifiedCharmAndLevelSection />
        )}

        {/* 6. USER MANAGEMENT & KYC */}
        {(activeTab === 'user-management' ||
          activeTab === 'user-dashboard' ||
          activeTab === 'all-users' ||
          activeTab === 'user-profile' ||
          activeTab === 'certification-management' ||
          activeTab.includes('kyc')) && (
          <UserManagementAndKYCSection activeSubKey={activeTab} />
        )}

        {/* 6.5 INVITATION MANAGEMENT (ADMIN INVITES USER) */}
        {(activeTab === 'invitation-management' ||
          activeTab.startsWith('invitation-') ||
          activeTab === 'create-invitation' ||
          activeTab === 'sent-invitations' ||
          activeTab === 'pending-invitations' ||
          activeTab === 'accepted-invitations' ||
          activeTab === 'declined-invitations' ||
          activeTab === 'expired-invitations' ||
          activeTab === 'cancelled-invitations' ||
          activeTab === 'invitation-templates' ||
          activeTab === 'invitation-rules' ||
          activeTab === 'invitation-analytics' ||
          activeTab === 'invitation-audit-logs') && (
          <InvitationManagementSection currentSubTab={activeTab} />
        )}

        {/* 6.55 OFFICIAL RESELLER MANAGEMENT & DIAMOND LEDGER */}
        {(activeTab === 'reseller-management' ||
          activeTab.startsWith('reseller-') ||
          activeTab.includes('reseller') ||
          activeTab === 'send-official-invitation' ||
          activeTab === 'company-diamond-allocations' ||
          activeTab === 'atomic-diamond-ledger') && (
          <ResellerManagementSection />
        )}


        {/* 6.6 APPLICATION MANAGEMENT (USER APPLIES, ADMIN APPROVES) */}
        {(activeTab === 'application-management' ||
          activeTab.startsWith('application-') ||
          activeTab.startsWith('hosting-') ||
          activeTab.startsWith('agency-') ||
          activeTab.startsWith('bd-') ||
          activeTab.includes('applications')) && (
          <ApplicationManagementSection currentSubTab={activeTab} />
        )}


        {/* 6.7 CHAT & MESSAGE MODERATION (UGC SAFETY & REPORTS) */}
        {(activeTab === 'chat-moderation' ||
          activeTab.includes('chat-report') ||
          activeTab.includes('message-report')) && (
          <ChatModerationSection />
        )}

        {/* 6.8 ACCOUNT SECURITY & SESSION GOVERNANCE */}
        {(activeTab === 'account-security' ||
          activeTab.includes('security-') ||
          activeTab.includes('session-governance')) && (
          <AccountSecuritySection />
        )}

        {/* 6.9 PRIVACY & BLOCKED USERS GOVERNANCE */}
        {(activeTab === 'privacy-controls' ||
          activeTab.includes('privacy-') ||
          activeTab.includes('blocked-users')) && (
          <PrivacyModerationSection />
        )}

        {/* 6.10 PUSH NOTIFICATIONS & CAMPAIGNS GOVERNANCE */}
        {(activeTab === 'notification-campaigns' ||
          activeTab.includes('push-campaigns') ||
          activeTab.includes('notification-')) && (
          <NotificationCampaignSection />
        )}

        {/* 6.11 MULTI-LANGUAGE & LOCALIZATION GOVERNANCE */}
        {(activeTab === 'language-management' ||
          activeTab.includes('localization-') ||
          activeTab.includes('language-')) && (
          <LanguageManagementSection />
        )}

        {/* 6.12 HELP, FAQ & 24/7 VIP SUPPORT DESK */}
        {(activeTab === 'help-faq' ||
          activeTab.includes('support-') ||
          activeTab.includes('faq-')) && (
          <HelpAndFaqCMSSection />
        )}

        {/* 6.13 USER PROFILE & MEDIA MODERATION */}
        {(activeTab === 'profile-moderation' ||
          activeTab === 'profile-media' ||
          activeTab.includes('profile-')) && (
          <ProfileModerationSection />
        )}

        {/* 6.14 DISCOVERY MANAGEMENT & PROFILE SHUFFLE */}
        {(activeTab === 'discovery-shuffle' ||
          activeTab === 'discovery-management' ||
          activeTab.includes('shuffle-')) && (
          <DiscoveryShuffleSection />
        )}

        {/* 7. TASK MANAGEMENT (DEDICATED EXCLUSIVE VIEW) */}
        {activeTab === 'task-management' && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>✅ Task Management & Daily Missions Engine</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#4F46E5]/20 text-[#4F46E5] font-bold text-xs">
                    {tasksList.filter(t=>t.active).length} Active Missions
                  </span>
                </h3>
                <p className="text-xs text-[#94A3B8]">Configure daily login tasks, streaming duration missions, and gift rewards</p>
              </div>
              <button onClick={() => alert('New Task Mission Creator Modal Opened')} className="px-3 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-bold shadow-lg">
                + Add New Task Rule
              </button>
            </div>

            {/* Task Controls & Cards */}
            <div className="space-y-3">
              {tasksList.map(task => (
                <div key={task.id} className="bg-[#131C2E] border border-[#273449] rounded-2xl p-4 space-y-3 shadow-lg hover:border-[#4F46E5] transition">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/20 border border-[#4F46E5]/40 flex items-center justify-center font-bold text-sm text-[#4F46E5]">
                        🎯
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#06B6D4]">{task.id}</span>
                          <span className="px-2 py-0.5 rounded bg-[#1E293B] text-slate-300 text-[10px] font-bold border border-[#273449]">{task.category}</span>
                        </div>
                        <h4 className="font-extrabold text-white text-base mt-0.5">{task.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{task.desc}</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      task.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-700/50 text-slate-400'
                    }`}>
                      {task.active ? '● ACTIVE' : '○ INACTIVE'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono bg-[#0B1220]/60 p-3 rounded-xl">
                    <div>
                      <div className="text-slate-400">Reward</div>
                      <div className="font-bold text-emerald-400 text-xs">{task.reward}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Daily Limit</div>
                      <div className="font-bold text-amber-400 text-xs">{task.limit}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Target</div>
                      <div className="font-bold text-cyan-400 text-xs">{task.target}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        task.active ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      {task.active ? '⏸️ Deactivate Task' : '▶️ Activate Task'}
                    </button>
                    <button onClick={() => alert(`Editing configuration for ${task.name}`)} className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#273449] border border-[#273449] text-white text-xs font-bold">
                      Edit Rule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. USER MANAGEMENT (ENTERPRISE MASTER IDENTITY DASHBOARD) */}
        {(activeTab === 'user-management' || activeTab.startsWith('user-') || activeTab === 'all-users' || activeTab.includes('certification') || activeTab.includes('grade') || activeTab.includes('xp') || activeTab.includes('vip') || activeTab.includes('host') || activeTab.includes('agency') || activeTab.includes('family') || activeTab.includes('wallet') || activeTab.includes('referral') || activeTab.includes('friends') || activeTab.includes('chat') || activeTab.includes('device') || activeTab.includes('session') || activeTab.includes('notification') || activeTab.includes('analytics') || activeTab.includes('audit')) && (
          <UserEnterprisePortal activeKey={activeTab} />
        )}

        {/* 3. SYSTEM MESSAGE MANAGEMENT (DEDICATED) */}
        {activeTab === 'system-message-management' && (
          <section className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-white">📣 System Message & Broadcast Push</h3>
              <p className="text-xs text-[#94A3B8]">Dispatch global push notices and transactional system messages</p>
            </div>

            <form onSubmit={handleSendSystemMessage} className="bg-[#131C2E] border border-[#273449] rounded-2xl p-4 space-y-3 shadow-lg">
              <h4 className="font-bold text-white text-sm">Send Broadcast Announcement</h4>
              <input
                type="text"
                required
                placeholder="Message Title (e.g., Weekend Double XP Event)"
                value={sysMsgTitle}
                onChange={e => setSysMsgTitle(e.target.value)}
                className="w-full bg-[#1E293B] border border-[#273449] rounded-xl p-3 text-xs text-white placeholder-slate-400"
              />
              <textarea
                required
                rows={3}
                placeholder="Message body content to broadcast to all app users..."
                value={sysMsgBody}
                onChange={e => setSysMsgBody(e.target.value)}
                className="w-full bg-[#1E293B] border border-[#273449] rounded-xl p-3 text-xs text-white placeholder-slate-400"
              />
              <button type="submit" className="w-full py-2.5 rounded-xl bg-[#4F46E5] text-white font-bold text-xs shadow-md">
                📢 Dispatch Global System Notice
              </button>
            </form>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm">Past Broadcast Logs</h4>
              {systemMessagesList.map(msg => (
                <div key={msg.id} className="bg-[#131C2E] border border-[#273449] rounded-2xl p-4 space-y-1 text-xs shadow-md">
                  <div className="flex justify-between font-mono">
                    <span className="text-[#06B6D4] font-bold">{msg.id}</span>
                    <span className="text-emerald-400 font-bold">{msg.sentAt}</span>
                  </div>
                  <h5 className="font-bold text-white text-sm">{msg.title}</h5>
                  <p className="text-slate-300 text-xs">{msg.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. GRADE MANAGEMENT (DEDICATED) */}
        {activeTab === 'grade-management' && (
          <section className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-white">🎖️ Grade & Level XP Thresholds</h3>
              <p className="text-xs text-[#94A3B8]">Configure level progression perks, badges, and vehicles</p>
            </div>

            <div className="space-y-3">
              {gradeLevelsList.map(g => (
                <div key={g.level} className="bg-[#131C2E] border border-[#273449] rounded-2xl p-4 flex items-center justify-between text-xs shadow-lg">
                  <div>
                    <span className="font-mono text-[#06B6D4] font-bold text-xs">Level {g.level}</span>
                    <h4 className={`font-black text-sm ${g.color}`}>{g.gradeName}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Perk: {g.perk}</p>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-amber-400 font-bold">{g.reqXp.toLocaleString()} XP</div>
                    <button onClick={() => alert(`Edit Grade ${g.gradeName}`)} className="mt-1 px-3 py-1 rounded bg-[#1E293B] text-white text-[10px] font-bold border border-[#273449]">
                      Edit Perks
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. INVITATION MANAGEMENT (DEDICATED) */}
        {activeTab === 'invitation-management' && (
          <section className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-white">🔗 Invitation & Referral Tracking</h3>
              <p className="text-xs text-[#94A3B8]">User referral codes, invite counts, and coin rewards logs</p>
            </div>

            <div className="space-y-3">
              {invitationsList.map(inv => (
                <div key={inv.id} className="bg-[#131C2E] border border-[#273449] rounded-2xl p-4 flex items-center justify-between text-xs shadow-lg">
                  <div>
                    <span className="font-mono text-cyan-400 font-bold">{inv.id} | Code: {inv.code}</span>
                    <div className="font-bold text-white mt-0.5">Referrer: {inv.referrer}</div>
                    <div className="text-[10px] text-slate-400">Invited: {inv.invitee} on {inv.date}</div>
                  </div>
                  <div className="font-mono font-bold text-emerald-400 text-sm">+{inv.bonusEarned}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. CHAT HISTORY AUDIT (DEDICATED) */}
        {activeTab === 'chat-history' && (
          <section className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-white">💬 Live Chat History Audit</h3>
              <p className="text-xs text-[#94A3B8]">Audit live room chat messages and delete flagged toxicity</p>
            </div>

            <div className="space-y-3">
              {chatHistoryList.map(chat => (
                <div key={chat.id} className={`bg-[#131C2E] border rounded-2xl p-4 space-y-2 text-xs shadow-lg ${chat.flagged ? 'border-red-500/40 bg-red-950/10' : 'border-[#273449]'}`}>
                  <div className="flex justify-between font-mono">
                    <span className="text-cyan-400 font-bold">Room #{chat.room} | Sender: {chat.sender}</span>
                    <span className="text-slate-400">{chat.time}</span>
                  </div>
                  <p className="text-white font-medium">"{chat.message}"</p>
                  <div className="flex justify-between items-center pt-1">
                    {chat.flagged ? <span className="text-red-400 font-bold text-[10px]">⚠️ FLAGGED SPAM</span> : <span className="text-emerald-400 text-[10px]">● SAFE</span>}
                    <button onClick={() => handleDeleteChatMessage(chat.id)} className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-bold">
                      Delete Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATION MANAGEMENT */}
        {activeTab === 'certification-management' && (
          <section className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-white">🪪 Certification & Host Review Management</h3>
              <p className="text-xs text-[#94A3B8]">CNIC Verification & Host Certification Queue</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certificationsList.map(cert => (
                <div key={cert.id} className="bg-[#131C2E] border border-[#273449] rounded-2xl p-4 space-y-3 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white text-sm">{cert.username} (UID: {cert.userId})</div>
                      <div className="text-[10px] text-[#06B6D4] font-mono">CNIC: {cert.cnicNumber}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[9px]">{cert.status}</span>
                  </div>
                  <button onClick={() => { setSelectedHostApp(cert); setShowHostReviewModal(true); }} className="w-full py-2 rounded-xl bg-[#4F46E5] text-white font-bold text-xs">Review Documents</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAMILY MANAGEMENT (ULTRA ENTERPRISE TIKTOK/BIGO CLASS MODULE) */}
        {(activeTab === 'family-management' || activeTab.startsWith('family-') || activeTab === 'all-families') && (
          <FamilyEnterprisePortal activeKey={activeTab} />
        )}

        {/* LIVE MANAGEMENT (ENTERPRISE 32 SUB-MODULES HUB) */}
        {(activeTab === 'live-management' || activeTab.startsWith('live-') || activeTab.includes('pk') || activeTab.includes('sound') || activeTab.includes('gift') || activeTab.includes('treasure') || activeTab.includes('replay')) && (
          <LiveEnterprisePortal activeKey={activeTab} />
        )}

        {/* DEDICATED RECHARGE & DIAMOND RATES MANAGER */}
        {activeTab === 'recharge-management' && (
          <RechargeManagementSection />
        )}

        {/* FUND MANAGEMENT (ENTERPRISE 31 SUB-MODULES FINANCIAL CORE) */}
        {(activeTab !== 'recharge-management' && (activeTab === 'fund-management' || activeTab.startsWith('fund-') || activeTab.includes('recharge') || activeTab.includes('payment') || activeTab.includes('withdrawal') || activeTab.includes('bank') || activeTab.includes('settlement') || activeTab.includes('salary') || activeTab.includes('revenue') || activeTab.includes('wallet') || activeTab.includes('coin') || activeTab.includes('diamond') || activeTab.includes('tax') || activeTab.includes('fraud') || activeTab.includes('risk') || activeTab.includes('promo'))) && (
          <FundEnterprisePortal activeKey={activeTab} />
        )}

        {/* AGENT RECHARGE MANAGEMENT (ENTERPRISE 25 SUB-MODULES RESELLER NETWORK) */}
        {(activeTab === 'agent-recharge-management' || activeTab.startsWith('agent-') || activeTab.includes('master-agent') || activeTab.includes('sub-agent') || activeTab.includes('agency') || activeTab.includes('commission') || activeTab.includes('referral') || activeTab.includes('invitation') || activeTab.includes('recharge-record') || activeTab.includes('sales-records') || activeTab.includes('level-list')) && (
          <AgentEnterprisePortal activeKey={activeTab} />
        )}

        {/* FEEDBACK MANAGEMENT & TRUST & SAFETY (ENTERPRISE 21 SUB-MODULES) */}
        {(activeTab === 'feedback-management' || activeTab.startsWith('feedback-') || activeTab.includes('report') || activeTab.includes('complaint') || activeTab.includes('suggestion') || activeTab.includes('bug') || activeTab.includes('feature') || activeTab.includes('abuse') || activeTab.includes('moderation') || activeTab.includes('appeal') || activeTab.includes('ticket') || activeTab.includes('resolution') || activeTab.includes('rating') || activeTab.includes('csat')) && (
          <FeedbackEnterprisePortal activeKey={activeTab} />
        )}

        {/* ARTICLE MANAGEMENT & KNOWLEDGE BASE (ENTERPRISE 28 SUB-MODULES CMS HUB) */}
        {(activeTab === 'article-management' || activeTab.startsWith('article-') || activeTab.includes('faq') || activeTab.includes('help-center') || activeTab.includes('tutorial') || activeTab.includes('news') || activeTab.includes('policy') || activeTab.includes('terms') || activeTab.includes('privacy') || activeTab.includes('guidelines') || activeTab.includes('safety-center') || activeTab.includes('media-library') || activeTab.includes('seo') || activeTab.includes('cms')) && (
          <ArticleEnterprisePortal activeKey={activeTab} />
        )}

        {/* SMS MANAGEMENT & MESSAGING INFRASTRUCTURE (ENTERPRISE 20 SUB-MODULES) */}
        {(activeTab === 'sms-management' || activeTab.startsWith('sms-') || activeTab.includes('sms') || activeTab.includes('otp') || activeTab.includes('system-message') || activeTab.includes('business-queue') || activeTab.includes('marketing-sms') || activeTab.includes('bulk-sms') || activeTab.includes('scheduled-sms') || activeTab.includes('delivery-reports') || activeTab.includes('failed-sms') || activeTab.includes('retry-queue') || activeTab.includes('blacklist') || activeTab.includes('country-rules')) && (
          <SmsEnterprisePortal activeKey={activeTab} />
        )}

        {/* PLUGIN MANAGEMENT & EXTENSION FRAMEWORK (ENTERPRISE 24 SUB-MODULES) */}
        {(activeTab === 'plugin-configuration' || activeTab.startsWith('plugin-') || activeTab.includes('tulasigame') || activeTab.includes('marketplace') || activeTab.includes('installed-plugin') || activeTab.includes('game-plugin') || activeTab.includes('payment-plugin') || activeTab.includes('social-plugin') || activeTab.includes('notification-plugin') || activeTab.includes('ai-plugin') || activeTab.includes('analytics-plugin') || activeTab.includes('storage-plugin') || activeTab.includes('streaming-plugin') || activeTab.includes('security-plugin')) && (
          <PluginEnterprisePortal activeKey={activeTab} />
        )}

        {/* VERSION MANAGEMENT */}
        {activeTab === 'version-list' && (
          <section className="space-y-4">
            <div>
              <h3 className="text-xl font-black text-white">📱 Version Management</h3>
              <p className="text-xs text-[#94A3B8]">App Build Version Release Control & Force Update</p>
            </div>
          </section>
        )}

        {/* 🛡️ REAL-TIME SYSTEM AUDIT & ERROR LOG CENTER */}
        {activeTab === 'system-audit-logs' && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#273449] pb-3">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>🛡️ System Audit & Enterprise Exception Log Center</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs">
                    Level-3 Diagnostics Engine
                  </span>
                </h3>
                <p className="text-xs text-[#94A3B8]">Real-time record of API errors, network timeouts, device info, stack traces & user toasts</p>
              </div>

              <button
                onClick={() => {
                  handleEnterpriseError('Simulated Test Exception for Verification', { code: 500, detail: 'Manual trigger test' }, 'Audit Dashboard', '/api/v1/test');
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
              >
                🧪 Trigger Test Error Toast
              </button>
            </div>

            <div className="space-y-3">
              {liveAdminLogs.length === 0 ? (
                <div className="bg-[#131C2E] border border-[#273449] p-8 rounded-2xl text-center space-y-2">
                  <div className="text-3xl text-emerald-400">✨</div>
                  <h4 className="font-bold text-white text-sm">System Running Cleanly</h4>
                  <p className="text-xs text-slate-400">No runtime exceptions or failed API calls logged yet in this session.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {liveAdminLogs.map(log => (
                    <div key={log.id} className="bg-[#131C2E] border border-rose-900/40 p-4 rounded-2xl space-y-2 font-mono text-xs shadow-xl hover:border-rose-500/50 transition">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <span className="text-rose-400 font-bold">{log.id} • [{log.module}]</span>
                        <span className="text-slate-400 text-[10px]">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-white font-bold text-sm leading-snug">{log.error}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] text-slate-300 bg-[#0B1220] p-2.5 rounded-xl border border-[#273449]">
                        <div>Endpoint: <strong className="text-cyan-400">{log.endpoint}</strong></div>
                        <div>User ID: <strong>{log.userId}</strong></div>
                        <div>Network: <strong className={log.networkStatus === 'ONLINE' ? 'text-emerald-400' : 'text-rose-400'}>{log.networkStatus}</strong></div>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">Device: {log.deviceInfo}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      </div>

      {/* MODALS */}
      {showUserDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center">
          <div className="w-full max-w-lg p-5 rounded-t-[24px] sm:rounded-[24px] bg-[#131C2E] border border-[#273449] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#273449] pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full border-2 border-[#4F46E5]" />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-[10px] text-[#06B6D4] font-mono">UID: {selectedUser.id}</p>
                </div>
              </div>
              <button onClick={() => setShowUserDetailModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleToggleFreezeWallet(selectedUser.id)} className="flex-1 py-2.5 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/40">
                {selectedUser.walletFrozen ? 'Unfreeze Wallet' : 'Freeze Wallet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSendCoinsModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <form onSubmit={handleSendCoinsSubmit} className="w-full max-w-md p-5 rounded-t-[24px] sm:rounded-[24px] bg-[#131C2E] border border-[#273449] space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Manual Credit Virtual Currency</h3>
            <input type="number" required value={sendCoinAmount} onChange={e => setSendCoinAmount(e.target.value)} className="w-full bg-[#1E293B] border border-[#273449] rounded-xl p-3 text-xs text-white" />
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setShowSendCoinsModal(false)} className="flex-1 h-[44px] rounded-xl bg-[#1E293B] text-xs font-bold text-slate-300">Cancel</button>
              <button type="submit" className="flex-1 h-[44px] rounded-xl bg-emerald-500 text-xs font-bold text-white">Credit Account</button>
            </div>
          </form>
        </div>
      )}

      {showHostReviewModal && selectedHostApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center">
          <div className="w-full max-w-lg p-5 rounded-t-[24px] sm:rounded-[24px] bg-[#131C2E] border border-[#273449] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#273449] pb-3">
              <h3 className="text-base font-bold text-white">Host Certification Review</h3>
              <button onClick={() => setShowHostReviewModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => handleHostAction(selectedHostApp.id, 'APPROVE')} className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md">Approve Certification</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/* ══ ENTERPRISE FAMILY MANAGEMENT PORTAL (TIKTOK / BIGO CLASS MODULE) ══ */
/* ════════════════════════════════════════════════════════════════════════ */
function FamilyEnterprisePortal({ activeKey }: { activeKey?: string }) {
  const [subTab, setSubTab] = useState<'dashboard' | 'rank' | 'list' | 'review' | 'levels' | 'activity' | 'treasury' | 'reports'>('dashboard');

  React.useEffect(() => {
    if (!activeKey) return;
    if (activeKey.includes('applications') || activeKey.includes('review') || activeKey.includes('requests')) setSubTab('review');
    else if (activeKey.includes('rank')) setSubTab('rank');
    else if (activeKey.includes('list') || activeKey.includes('all-families') || activeKey.includes('members') || activeKey.includes('roles') || activeKey.includes('leaders') || activeKey.includes('moderators')) setSubTab('list');
    else if (activeKey.includes('level')) setSubTab('levels');
    else if (activeKey.includes('activity') || activeKey.includes('events') || activeKey.includes('missions') || activeKey.includes('rewards')) setSubTab('activity');
    else if (activeKey.includes('wallet') || activeKey.includes('treasury') || activeKey.includes('income') || activeKey.includes('expenses')) setSubTab('treasury');
    else if (activeKey.includes('report') || activeKey.includes('violation') || activeKey.includes('banned') || activeKey.includes('blacklist')) setSubTab('reports');
    else setSubTab('dashboard');
  }, [activeKey]);

  // Applications Queue state
  const [pendingApps, setPendingApps] = useState([
    { id: 'APP-901', name: 'Thunder Eagles', founder: 'Usman_Singer (100491)', logo: '🦅', cnic: '35202-9918231-1', country: 'Pakistan', category: 'Music & Entertainment', desc: 'Urdu Singing & Music Community Guild', requestedAt: '2026-08-04 16:30' },
    { id: 'APP-902', name: 'Cyber Cyberpunks', founder: 'Zain_Gaming (100882)', logo: '⚡', cnic: '35201-1128391-9', country: 'United Arab Emirates', category: 'Gaming & PK Arena', desc: 'Competitive PK Tournament Team', requestedAt: '2026-08-04 18:10' },
  ]);

  // Level Rules state
  const [levelRules] = useState([
    { level: 1, reqXp: 0, maxMembers: 50, badge: '🛡️ Novice Crest', perks: 'Basic Chat, Shared Treasury' },
    { level: 5, reqXp: 50000, maxMembers: 150, badge: '⚔️ Vanguard Crest', perks: '8-Seat Private Voice Space, Level Badge' },
    { level: 10, reqXp: 250000, maxMembers: 300, badge: '👑 Royal Crown', perks: 'Speedster Coupe Car, 5% Gift Coin Bonus' },
    { level: 25, reqXp: 1000000, maxMembers: 600, badge: '💎 Diamond Sovereign', perks: 'Bugatti Entrance Vehicle, Custom Room Theme' },
    { level: 50, reqXp: 5000000, maxMembers: 1000, badge: '🌌 Cosmic Deity', perks: 'Starship Entrance, Max Treasury Limit, PK Multipliers' },
  ]);

  const handleApproveApp = (appId: string) => {
    setPendingApps(prev => prev.filter(a => a.id !== appId));
    alert(`Family Application ${appId} APPROVED! ID: FAM${Math.floor(1000 + Math.random()*9000)} generated.`);
  };

  const handleRejectApp = (appId: string) => {
    setPendingApps(prev => prev.filter(a => a.id !== appId));
    alert(`Family Application ${appId} REJECTED.`);
  };

  return (
    <section className="space-y-4">
      {/* Enterprise Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#273449] pb-3">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>👨‍👩‍👧‍👦 Enterprise Family Management Hub</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#4F46E5]/20 text-[#4F46E5] font-bold text-xs">
              TikTok / BIGO Architecture
            </span>
          </h3>
          <p className="text-xs text-[#94A3B8]">Comprehensive Community, Ranking, Review Queue, Treasury & Roles Governance</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => alert('Exporting Family Telemetry Data')} className="px-3 py-2 rounded-xl bg-[#1E293B] border border-[#273449] text-white font-bold text-xs hover:bg-[#273449]">
            📊 Export CSV
          </button>
          <button onClick={() => alert('Broadcast Announcement to All Families')} className="px-3 py-2 rounded-xl bg-[#4F46E5] text-white font-bold text-xs shadow-md">
            📢 Broadcast Notice
          </button>
        </div>
      </div>

      {/* Sub-module Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
        {[
          { key: 'dashboard', label: '📊 Dashboard Overview' },
          { key: 'rank', label: '🏆 Family Rankings' },
          { key: 'list', label: '📂 All Families List (3)' },
          { key: 'review', label: `🪪 Family Review (${pendingApps.length})` },
          { key: 'levels', label: '🎖️ Family Level Config' },
          { key: 'activity', label: '🔥 Activity & Rewards' },
          { key: 'treasury', label: '🏛️ Shared Treasury' },
          { key: 'reports', label: '⚠️ Moderation & Reports' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key as any)}
            className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              subTab === t.key ? 'bg-[#4F46E5] text-white shadow-lg' : 'bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#273449]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. DASHBOARD */}
      {subTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Families', value: '3 Active', change: '100% Operational', accent: 'bg-[#4F46E5]' },
              { label: 'Pending Approval', value: `${pendingApps.length} Requests`, change: 'Action Required', accent: 'bg-[#F59E0B]' },
              { label: 'Online Members', value: '184 Online', change: 'Live Right Now', accent: 'bg-[#10B981]' },
              { label: 'Combined Revenue', value: '$18,400.00', change: '+22.4% / wk', accent: 'bg-[#06B6D4]' },
            ].map((k, i) => (
              <div key={i} className="bg-[#131C2E] border border-[#273449] rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-slate-300">{k.label}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#4F46E5]/20 text-[#4F46E5]">{k.change}</span>
                </div>
                <div className="text-xl font-black text-white">{k.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#131C2E] border border-[#273449] rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-white text-sm">🔥 Top Performing Family Guilds</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1E293B]/60 border border-[#273449]">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-black font-extrabold flex items-center justify-center text-xs">1</span>
                  <span className="text-2xl">⚔️</span>
                  <div>
                    <div className="font-bold text-white text-sm">Aura Warriors Guild (FAM8821)</div>
                    <div className="text-[10px] text-slate-400">Leader: Sara_Vip7 | 284 Members | Lv.8</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-amber-400 font-bold">284,500 Treasury</div>
                  <div className="text-emerald-400 text-[10px]">$12,400 Weekly Gifts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RANKINGS */}
      {subTab === 'rank' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-white text-sm">🏆 Global & Country Family Leaderboards</h4>
            <button onClick={() => alert('Family Rankings Reset for New Season')} className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold">
              🔄 Reset Season Rank
            </button>
          </div>

          <div className="space-y-2">
            {[
              { rank: 1, name: 'Aura Warriors Guild', leader: 'Sara_Vip7', xp: '145,000 XP', coins: '1,420,000 Coins', country: 'Pakistan' },
              { rank: 2, name: 'Rana Clan Alliance', leader: 'King_Rana_VIP', xp: '420,000 XP', coins: '890,000 Coins', country: 'Pakistan' },
              { rank: 3, name: 'Phoenix Knights', leader: 'Ali_Choudhary', xp: '48,000 XP', coins: '45,000 Coins', country: 'United States' },
            ].map(r => (
              <div key={r.rank} className="bg-[#131C2E] border border-[#273449] rounded-2xl p-4 flex items-center justify-between text-xs shadow-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm ${r.rank === 1 ? 'bg-amber-500 text-black' : r.rank === 2 ? 'bg-slate-300 text-black' : 'bg-amber-700 text-white'}`}>
                    #{r.rank}
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-sm">{r.name}</h5>
                    <div className="text-[10px] text-slate-400">Leader: {r.leader} | Country: {r.country}</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-amber-400 font-bold">{r.coins}</div>
                  <div className="text-cyan-400 text-[10px]">{r.xp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ALL FAMILIES LIST */}
      {subTab === 'list' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-white text-sm">📂 Master Family Directory</h4>
            <input type="text" placeholder="Search Family ID or Leader..." className="bg-[#1E293B] border border-[#273449] rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none" />
          </div>

          <div className="space-y-3">
            {[
              { id: 'FAM8821', name: 'Aura Warriors Guild', icon: '⚔️', leader: 'Sara_Vip7 (100821)', members: 284, level: 8, xp: '145,000 XP', treasury: '284,500 Coins', status: 'ACTIVE' },
              { id: 'FAM1002', name: 'Rana Clan Alliance', icon: '👑', leader: 'King_Rana_VIP (100998)', members: 192, level: 12, xp: '420,000 XP', treasury: '890,000 Coins', status: 'ACTIVE' },
              { id: 'FAM1005', name: 'Phoenix Knights', icon: '🔥', leader: 'Ali_Choudhary (100344)', members: 110, level: 5, xp: '48,000 XP', treasury: '45,000 Coins', status: 'ACTIVE' },
            ].map(f => (
              <div key={f.id} className="bg-[#131C2E] border border-[#273449] rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{f.icon}</span>
                    <div>
                      <span className="text-xs font-mono font-bold text-[#06B6D4]">{f.id}</span>
                      <h4 className="font-bold text-white text-base">{f.name}</h4>
                      <p className="text-xs text-slate-400">Leader: <strong className="text-amber-400">{f.leader}</strong></p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[9px]">{f.status}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono bg-[#0B1220]/60 p-2 rounded-xl">
                  <div>Members: <strong className="text-white">{f.members}</strong></div>
                  <div>Level: <strong className="text-purple-400">Lv.{f.level}</strong></div>
                  <div>Treasury: <strong className="text-amber-400">{f.treasury}</strong></div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => alert(`Freeze Treasury for ${f.name}`)} className="flex-1 py-2 rounded-xl bg-[#1E293B] border border-[#273449] text-white text-xs font-bold">
                    🏛️ Freeze Treasury
                  </button>
                  <button onClick={() => alert(`Transferring Ownership for ${f.name}`)} className="flex-1 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-bold">
                    👑 Transfer Leader
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FAMILY REVIEW QUEUE */}
      {subTab === 'review' && (
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm">🪪 Pending Family Creation Review Queue</h4>

          {pendingApps.length === 0 ? (
            <div className="p-8 text-center bg-[#131C2E] border border-[#273449] rounded-2xl text-slate-400 text-xs">
              ✅ No pending family creation applications in queue!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApps.map(app => (
                <div key={app.id} className="bg-[#131C2E] border border-[#273449] rounded-2xl p-4 space-y-3 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{app.logo}</span>
                      <div>
                        <span className="text-xs font-mono font-bold text-[#06B6D4]">{app.id}</span>
                        <h4 className="font-bold text-white text-base">{app.name}</h4>
                        <p className="text-xs text-slate-400">Applicant: <strong className="text-amber-400">{app.founder}</strong></p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{app.requestedAt}</span>
                  </div>

                  <div className="bg-[#0B1220]/60 p-3 rounded-xl text-xs space-y-1">
                    <div className="text-slate-300">Category: <strong className="text-white">{app.category}</strong> | Country: <strong className="text-white">{app.country}</strong></div>
                    <div className="text-slate-400">CNIC Verification: <strong className="text-cyan-400 font-mono">{app.cnic}</strong></div>
                    <p className="text-slate-300 italic">"{app.desc}"</p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleApproveApp(app.id)} className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md">
                      ✓ Approve & Generate Family ID
                    </button>
                    <button onClick={() => handleRejectApp(app.id)} className="px-4 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 font-bold text-xs">
                      ✕ Reject Application
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. LEVEL CONFIG */}
      {subTab === 'levels' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-white text-sm">🎖️ Family Level Thresholds & Privilege Configuration</h4>
            <button onClick={() => alert('+ Create New Level Tier')} className="px-3 py-1.5 rounded-xl bg-[#4F46E5] text-white text-xs font-bold">
              + Add Level Tier
            </button>
          </div>

          <div className="space-y-3">
            {levelRules.map(l => (
              <div key={l.level} className="bg-[#131C2E] border border-[#273449] rounded-2xl p-4 flex items-center justify-between text-xs shadow-lg">
                <div>
                  <span className="font-mono text-[#06B6D4] font-bold text-xs">Level {l.level}</span>
                  <h4 className="font-bold text-white text-sm">{l.badge}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Perks: {l.perks}</p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-amber-400 font-bold">{l.reqXp.toLocaleString()} XP</div>
                  <div className="text-slate-400 text-[10px]">Max {l.maxMembers} Members</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. ACTIVITY & REWARDS */}
      {subTab === 'activity' && (
        <div className="space-y-3 bg-[#131C2E] border border-[#273449] rounded-2xl p-4 text-xs space-y-3">
          <h4 className="font-bold text-white text-sm">🔥 Family Activity Rank Rewards Schedule</h4>
          <p className="text-slate-300">Automated weekly payout rewards for Top 3 ranked Family Guilds:</p>
          <div className="space-y-2 font-mono">
            <div className="p-3 rounded-xl bg-[#0B1220]/60 border border-[#273449] flex justify-between">
              <span>🥇 Rank 1 Guild Reward:</span>
              <strong className="text-amber-400">100,000 Coins + Gold Frame + Dragon Animation</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1220]/60 border border-[#273449] flex justify-between">
              <span>🥈 Rank 2 Guild Reward:</span>
              <strong className="text-slate-300">50,000 Coins + Silver Crest Frame</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1220]/60 border border-[#273449] flex justify-between">
              <span>🥉 Rank 3 Guild Reward:</span>
              <strong className="text-amber-600">30,000 Coins + Bronze Badge</strong>
            </div>
          </div>
        </div>
      )}

      {/* 7. SHARED TREASURY */}
      {subTab === 'treasury' && (
        <div className="space-y-3 bg-[#131C2E] border border-[#273449] rounded-2xl p-4 text-xs space-y-2 font-mono">
          <h4 className="font-bold text-white text-sm">🏛️ Shared Treasury & Financial Ledger</h4>
          <div>Combined Treasury Coins: <strong className="text-amber-400">284,500 Coins</strong></div>
          <div>Weekly Rewards Paid Out: <strong className="text-emerald-400">120,000 Coins</strong></div>
          <div>Balance Status: <strong className="text-cyan-400">100% Solvent & Audited</strong></div>
        </div>
      )}

      {/* 8. REPORTS & MODERATION */}
      {subTab === 'reports' && (
        <div className="space-y-3 bg-[#131C2E] border border-[#273449] rounded-2xl p-4 text-xs space-y-3">
          <h4 className="font-bold text-white text-sm">⚠️ Family Violation Reports & Safety Complaints</h4>
          <div className="p-3 rounded-xl bg-[#0B1220]/60 border border-[#273449] flex justify-between items-center">
            <div>
              <span className="text-red-400 font-bold">Spam Complaint #REP-102</span>
              <p className="text-slate-300">"User SpamBot_3912 flooded Family Chatroom with link"</p>
            </div>
            <button onClick={() => alert('Resolved Complaint')} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-xs">Mark Resolved</button>
          </div>
        </div>
      )}

    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/* ══ ENTERPRISE USER MANAGEMENT PORTAL (27 SUB-MODULES CONTROL SYSTEM) ══ */
/* ════════════════════════════════════════════════════════════════════════ */
function UserEnterprisePortal({ activeKey }: { activeKey?: string }) {
  const [subTab, setSubTab] = useState<string>('1-dashboard');

  // Master Users State (Zero Dummy Users — Real Database Only)
  const [users, setUsers] = useState<any[]>([]);

  // KYC Queue State
  const [kycQueue, setKycQueue] = useState<any[]>([]);

  // User Action Modals
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState('10000');
  const [creditType, setCreditType] = useState<'coins' | 'diamonds'>('coins');

  // Fetch Real Users from Database API
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get<any[]>('/admin/users');
        if (res.success && Array.isArray(res.data)) {
          setUsers(res.data.map(u => ({
            id: u.numericId.toString(),
            name: u.username,
            email: u.email || 'N/A',
            phone: u.phone || 'N/A',
            country: u.country || 'Pakistan',
            level: u.level || 1,
            vip: `VIP ${u.vipTier || 0}`,
            walletCoins: u.coins || 0,
            walletDiamonds: u.diamonds || 0,
            status: u.status || 'ACTIVE',
            kycStatus: 'APPROVED',
            walletFrozen: false,
            registeredAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent',
          })));
        }
      } catch (err) {
        console.error('Error fetching admin users:', err);
      }
    };
    fetchUsers();
  }, []);


  React.useEffect(() => {
    if (!activeKey) return;
    const k = activeKey.toLowerCase();
    if (k.includes('dashboard')) setSubTab('1-dashboard');
    else if (k.includes('all-users')) setSubTab('2-all-users');
    else if (k.includes('profile')) setSubTab('3-profile');
    else if (k.includes('verification') || k.includes('kyc')) setSubTab('4-kyc');
    else if (k.includes('certification')) setSubTab('5-certifications');
    else if (k.includes('grade') || k.includes('level')) setSubTab('6-grades');
    else if (k.includes('xp') || k.includes('progress')) setSubTab('7-xp');
    else if (k.includes('vip')) setSubTab('8-vip');
    else if (k.includes('host')) setSubTab('9-hosts');
    else if (k.includes('agency')) setSubTab('10-agencies');
    else if (k.includes('family')) setSubTab('11-families');
    else if (k.includes('wallet')) setSubTab('12-wallet');
    else if (k.includes('task')) setSubTab('13-tasks');
    else if (k.includes('invitation')) setSubTab('14-invitations');
    else if (k.includes('referral')) setSubTab('15-referrals');
    else if (k.includes('friends') || k.includes('followers')) setSubTab('16-friends');
    else if (k.includes('chat')) setSubTab('17-chats');
    else if (k.includes('report')) setSubTab('18-reports');
    else if (k.includes('violation')) setSubTab('19-violations');
    else if (k.includes('device')) setSubTab('20-devices');
    else if (k.includes('login')) setSubTab('21-login-history');
    else if (k.includes('session')) setSubTab('22-sessions');
    else if (k.includes('notification')) setSubTab('23-notifications');
    else if (k.includes('system') || k.includes('messages')) setSubTab('24-system-messages');
    else if (k.includes('analytics')) setSubTab('25-analytics');
    else if (k.includes('audit')) setSubTab('26-audit');
    else if (k.includes('settings')) setSubTab('27-settings');
  }, [activeKey]);

  const handleApproveKyc = (kycId: string, userId: string) => {
    setKycQueue(prev => prev.filter(k => k.id !== kycId));
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, kycStatus: 'APPROVED' } : u));
    alert(`KYC ${kycId} APPROVED! User ${userId} granted Verification Badge.`);
  };

  const handleToggleFreezeWallet = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, walletFrozen: !u.walletFrozen } : u));
  };

  const handleBanUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'BANNED' } : u));
    alert(`User ${userId} BANNED and forced logged out from all devices.`);
  };

  const handleCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const amount = parseInt(creditAmount) || 0;
    setUsers(prev => prev.map(u => {
      if (u.id !== selectedUser.id) return u;
      return creditType === 'coins' ? { ...u, walletCoins: (u.walletCoins || 0) + amount } : { ...u, walletDiamonds: (u.walletDiamonds || 0) + amount };
    }));
    setShowCreditModal(false);
    alert(`Successfully credited ${amount.toLocaleString()} ${creditType.toUpperCase()} to ${selectedUser.name}!`);
  };

  return (
    <section className="space-y-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#273449] pb-3">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>👤 Enterprise User Management Core</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs">
              27 Functional Sub-Modules
            </span>
          </h3>
          <p className="text-xs text-[#94A3B8]">Master User Lifecycle, KYC Queue, Level XP, VIP Tiers, Wallets & Security Controls</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => alert('Exported Master Users CSV')} className="px-3 py-2 rounded-xl bg-[#1E293B] border border-[#273449] text-white font-bold text-xs hover:bg-[#273449]">
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* SUB-MODULE TABS SCROLLER */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { key: '1-dashboard', label: '1. Dashboard' },
          { key: '2-all-users', label: '2. All Users' },
          { key: '3-profile', label: '3. User Profile' },
          { key: '4-kyc', label: '4. KYC Verification' },
          { key: '5-certifications', label: '5. Certifications' },
          { key: '6-grades', label: '6. Grade/Levels' },
          { key: '7-xp', label: '7. XP Rules' },
          { key: '8-vip', label: '8. VIP System' },
          { key: '9-hosts', label: '9. Host Mgmt' },
          { key: '10-agencies', label: '10. Agency Links' },
          { key: '11-families', label: '11. Family Links' },
          { key: '12-wallet', label: '12. Wallet Ledger' },
          { key: '13-tasks', label: '13. Task Engine' },
          { key: '14-invitations', label: '14. Invitations' },
          { key: '15-referrals', label: '15. Referral Tree' },
          { key: '16-friends', label: '16. Friends/Followers' },
          { key: '17-chats', label: '17. Chat History' },
          { key: '18-reports', label: '18. Safety Reports' },
          { key: '19-violations', label: '19. Violations' },
          { key: '20-devices', label: '20. Device Mgmt' },
          { key: '21-login-history', label: '21. Login History' },
          { key: '22-sessions', label: '22. Sessions' },
          { key: '23-notifications', label: '23. Notifications' },
          { key: '24-system-messages', label: '24. System Messages' },
          { key: '25-analytics', label: '25. Analytics' },
          { key: '26-audit', label: '26. Audit Logs' },
          { key: '27-settings', label: '27. User Settings' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              subTab === t.key ? 'bg-[#4F46E5] text-white shadow-lg' : 'bg-[#1E293B] text-[#94A3B8] border border-[#273449]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB CONTENTS */}

      {/* 1. USER DASHBOARD */}
      {subTab === '1-dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Registered Users', val: '0', color: 'text-indigo-400' },
              { label: 'Online Users Right Now', val: '0', color: 'text-emerald-400' },
              { label: 'Verified KYC Accounts', val: '0', color: 'text-cyan-400' },
              { label: 'VIP 1 - 10 Members', val: '0', color: 'text-amber-400' },
              { label: 'Active Live Stream Hosts', val: '0', color: 'text-purple-400' },
              { label: 'Registered Hardware Devices', val: '0', color: 'text-[#94A3B8]' },
              { label: 'Daily Ecosystem Revenue', val: '$0.00', color: 'text-emerald-400' },
              { label: '30-Day User Retention', val: '0%', color: 'text-blue-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold">{s.label}</span>
                <div className={`text-xl font-black ${s.color} mt-1`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ALL USERS */}
      {subTab === '2-all-users' && (
        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="bg-[#131C2E] border border-[#273449] p-8 rounded-2xl text-center space-y-2">
              <span className="text-3xl">👥</span>
              <h4 className="text-white font-bold text-sm">No Registered Users Found</h4>
              <p className="text-xs text-slate-400">The database is currently clean and ready. Real registered accounts from the mobile app or backend will appear here automatically.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {users.map(u => (
                <div key={u.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl space-y-3 shadow-lg hover:border-[#4F46E5] transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">UID: {u.id} | {u.country}</span>
                      <h4 className="font-bold text-white text-sm">{u.name}</h4>
                      <p className="text-[10px] text-slate-400">{u.email} • {u.phone}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {u.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono bg-[#0B1220]/60 p-2.5 rounded-xl">
                    <div>Level: <strong className="text-indigo-400">Lv.{u.level}</strong></div>
                    <div>VIP: <strong className="text-amber-400">{u.vip}</strong></div>
                    <div>Coins: <strong className="text-emerald-400">{u.walletCoins?.toLocaleString() || 0}</strong></div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedUser(u); setShowCreditModal(true); }} className="flex-1 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
                      + Credit Currency
                    </button>
                    <button onClick={() => handleToggleFreezeWallet(u.id)} className={`px-3 py-2 rounded-xl text-xs font-bold border ${u.walletFrozen ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-[#1E293B] text-slate-300 border-[#273449]'}`}>
                      {u.walletFrozen ? 'Unfreeze Wallet' : 'Freeze Wallet'}
                    </button>
                    <button onClick={() => handleBanUser(u.id)} className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/40">
                      Ban User
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* 3. USER PROFILE */}
      {subTab === '3-profile' && (
        <UserProfileDossierSection />
      )}

      {/* 4. KYC VERIFICATION */}
      {subTab === '4-kyc' && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">🪪 Identity KYC Verification Queue</h4>
          {kycQueue.length === 0 ? (
            <div className="p-6 text-center bg-[#131C2E] border border-[#273449] rounded-2xl text-slate-400 text-xs">
              ✅ All pending KYC submissions reviewed!
            </div>
          ) : (
            <div className="space-y-3">
              {kycQueue.map(kyc => (
                <div key={kyc.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold">{kyc.id} • {kyc.date}</span>
                    <h5 className="font-bold text-white text-sm">{kyc.name} (UID: {kyc.userId})</h5>
                    <p className="text-slate-400 text-[10px]">CNIC: {kyc.cnic}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApproveKyc(kyc.id, kyc.userId)} className="px-3 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md">
                      ✓ Approve KYC
                    </button>
                    <button onClick={() => setKycQueue(prev => prev.filter(k => k.id !== kyc.id))} className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/40">
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. CERTIFICATIONS */}
      {subTab === '5-certifications' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">📜 Host & VIP Certification Approval Workflow</h4>
          <p className="text-slate-400">Manage streamer background check, target hours & badge issuance</p>
        </div>
      )}

      {/* 6. GRADES & LEVEL XP */}
      {subTab === '6-grades' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">🎖️ Grade Level 1 to 100 Progression Thresholds</h4>
          <div>XP thresholds configured for Level 1 (0 XP) up to Level 100 (50,000,000 XP). Perks: Frames, Badges, Vehicle Entrances.</div>
        </div>
      )}

      {/* 7. XP RULES */}
      {subTab === '7-xp' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🔥 XP Earning Rules Engine</h4>
          <p className="text-slate-400">Daily Login (+100 XP), Watch Stream 30m (+300 XP), Send 100 Coins Gift (+500 XP)</p>
        </div>
      )}

      {/* 8. VIP SYSTEM */}
      {subTab === '8-vip' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">👑 VIP 1 to VIP 10 Privileges & Noble Packages</h4>
          <p className="text-slate-400">VIP Noble Badges, Phantom Jet & Dragon Entrance Vehicles, Exclusive Gift Animations</p>
        </div>
      )}

      {/* 9. HOST MANAGEMENT */}
      {subTab === '9-hosts' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">🎙️ Streamer Host Roster & Target Hours</h4>
          <div>840 Active Streamers • Target: 60 Hours/Month • Monthly Base Salary: $1,500.00 USD</div>
        </div>
      )}

      {/* 10. AGENCY LINKS */}
      {subTab === '10-agencies' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🏢 Agency Reseller Assignment & Commission Splits</h4>
          <p className="text-slate-400">Commission Rate: 12.5% • Total Agency Sales: $42,500.00</p>
        </div>
      )}

      {/* 11. FAMILY LINKS */}
      {subTab === '11-families' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">⚔️ Family Guild Link & Shared Treasury Shares</h4>
          <p className="text-slate-400">Members linked to Aura Warriors, Rana Clan, Phoenix Knights</p>
        </div>
      )}

      {/* 12. WALLET LEDGER */}
      {subTab === '12-wallet' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">👛 Virtual Currency Ledger & Audit</h4>
          <div>Total Coins Issued: <strong className="text-amber-400">142,500,000 Coins</strong></div>
          <div>Total Diamonds Pending Cashout: <strong className="text-purple-400">12,840,000 Diamonds</strong></div>
        </div>
      )}

      {/* 13. TASK ENGINE */}
      {subTab === '13-tasks' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🎯 Daily Task Engine & Claim Rewards</h4>
          <p className="text-slate-400">Active Missions: Daily Check-in, Watch Stream 15m, Send 1 Gift, Complete Voice Room</p>
        </div>
      )}

      {/* 14. INVITATIONS */}
      {subTab === '14-invitations' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📩 Invitation & Referral Statistics</h4>
          <div>14,200 Successful Friend Invitations Tracked • Total Referral Rewards Paid: 28,400,000 Coins</div>
        </div>
      )}

      {/* 15. REFERRAL TREE */}
      {subTab === '15-referrals' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🌳 Referral Tree & Anti-Fraud Detection</h4>
          <p className="text-slate-400">Automatic MAC address & IP duplicate invite fraud detection system active</p>
        </div>
      )}

      {/* 16. FRIENDS & FOLLOWERS */}
      {subTab === '16-friends' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">👥 Social Graph & Blacklist Management</h4>
          <p className="text-slate-400">Followers, Following, Profile Visitors & User Blacklists</p>
        </div>
      )}

      {/* 17. CHAT HISTORY */}
      {subTab === '17-chats' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">💬 Real-Time Chat History & Message Audit</h4>
          <div>Searchable index for Private Messages, Family Guild Chats & Live Broadcast Room comments.</div>
        </div>
      )}

      {/* 18. SAFETY REPORTS */}
      {subTab === '18-reports' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">⚠️ User Safety Complaint Resolution Queue</h4>
          <p className="text-slate-400">Abuse, Harassment, Fraud & Fake Streamer complaint resolution dashboard</p>
        </div>
      )}

      {/* 19. VIOLATIONS */}
      {subTab === '19-violations' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">🚫 Penalty Warnings & Mute Log</h4>
          <div>14 Users Muted for 24 Hours • 3 Users Issued Official Safety Warnings</div>
        </div>
      )}

      {/* 20. DEVICE MANAGEMENT */}
      {subTab === '20-devices' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📱 Hardware Device Registry & MAC Locks</h4>
          <div>24,100 Registered Device IDs • 12 Emulator Hardware IDs Banned</div>
        </div>
      )}

      {/* 21. LOGIN HISTORY */}
      {subTab === '21-login-history' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">🌐 IP Address & Country Login History</h4>
          <div>Telemetry logging IP, Country, ISP, Device Model & Timestamp for every authentication.</div>
        </div>
      )}

      {/* 22. SESSIONS */}
      {subTab === '22-sessions' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🔐 Active JWT Sessions & Force Logout</h4>
          <button onClick={() => alert('Force logged out all sessions across active devices')} className="px-3 py-2 rounded-xl bg-red-500 text-white font-bold text-xs">
            🚪 Force Logout All Sessions
          </button>
        </div>
      )}

      {/* 23. NOTIFICATIONS */}
      {subTab === '23-notifications' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🔔 In-App Notification Inbox & Push Alerts</h4>
          <p className="text-slate-400">Gift alerts, follow notifications, system rewards & event reminders</p>
        </div>
      )}

      {/* 24. SYSTEM MESSAGES */}
      {subTab === '24-system-messages' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">📣 Global Announcement & Maintenance Popups</h4>
          <p className="text-slate-400">Dispatch system broadcast announcements directly to all active app users</p>
        </div>
      )}

      {/* 25. ANALYTICS */}
      {subTab === '25-analytics' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📈 DAU / MAU Retention & Revenue Analytics</h4>
          <div>DAU: 18,400 • MAU: 42,850 • 30-Day Retention: 68.4% • ARPU: $0.99</div>
        </div>
      )}

      {/* 26. AUDIT LOGS */}
      {subTab === '26-audit' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📜 Admin Action Audit Logs</h4>
          <div>Log entry #LOG-901: Admin approved KYC for Usman_Singer (UID: 100491)</div>
        </div>
      )}

      {/* 27. USER SETTINGS */}
      {subTab === '27-settings' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">⚙️ Forced Privacy, Security PIN & Feature Locks</h4>
          <p className="text-slate-400">Admin forced account security parameters and multi-factor enforcement</p>
        </div>
      )}

      {/* CREDIT CURRENCY MODAL */}
      {showCreditModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreditSubmit} className="w-full max-w-md bg-[#131C2E] border border-[#273449] rounded-3xl p-5 space-y-4 shadow-2xl">
            <h4 className="font-bold text-base text-white">💰 Manual Currency Credit: {selectedUser.name}</h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Currency Type</label>
                <select value={creditType} onChange={e => setCreditType(e.target.value as any)} className="w-full bg-[#0B1220] border border-[#273449] rounded-xl p-3 text-white">
                  <option value="coins">🪙 Coins (Purchasing Currency)</option>
                  <option value="diamonds">💎 Diamonds (Cashout Earnings)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Amount to Credit</label>
                <input type="number" required value={creditAmount} onChange={e => setCreditAmount(e.target.value)} className="w-full bg-[#0B1220] border border-[#273449] rounded-xl p-3 text-white font-mono" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowCreditModal(false)} className="flex-1 py-3 rounded-xl bg-[#1E293B] text-slate-300 font-bold text-xs">Cancel</button>
              <button type="submit" className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-lg">Credit Currency</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}



/* ════════════════════════════════════════════════════════════════════════ */
/* ══ ENTERPRISE LIVE MANAGEMENT PORTAL (32 SUB-MODULES CONTROL SYSTEM) ══ */
/* ════════════════════════════════════════════════════════════════════════ */
function LiveEnterprisePortal({ activeKey }: { activeKey?: string }) {
  const [subTab, setSubTab] = useState<string>('1-dashboard');

  // Active Live Rooms State (Zero Dummy Rooms — Real Database Only)
  const [liveRooms, setLiveRooms] = useState<any[]>([]);

  // PK Rules State
  const [pkRules, setPkRules] = useState([
    { id: 'PK-60', name: '60 Seconds Blitz', duration: 60, multiplier: '1.5x', minWin: 5000, status: 'ACTIVE' },
    { id: 'PK-120', name: '120 Seconds Standard', duration: 120, multiplier: '2.0x', minWin: 15000, status: 'ACTIVE' },
    { id: 'PK-180', name: '180 Seconds Guild War', duration: 180, multiplier: '3.0x Mega', minWin: 50000, status: 'ACTIVE' },
  ]);


  React.useEffect(() => {
    if (!activeKey) return;
    const k = activeKey.toLowerCase();
    if (k.includes('dashboard')) setSubTab('1-dashboard');
    else if (k.includes('room-details')) setSubTab('3-details');
    else if (k.includes('rooms') && !k.includes('voice') && !k.includes('video')) setSubTab('2-rooms');
    else if (k.includes('categories')) setSubTab('4-categories');
    else if (k.includes('hosts')) setSubTab('5-hosts');
    else if (k.includes('guests') || k.includes('seats')) setSubTab('6-seats');
    else if (k.includes('pk-time') || k.includes('rule')) setSubTab('8-pk-rules');
    else if (k.includes('pk')) setSubTab('7-pk');
    else if (k.includes('sound')) setSubTab('9-sounds');
    else if (k.includes('lucky')) setSubTab('11-lucky-gifts');
    else if (k.includes('gifts')) setSubTab('10-gifts');
    else if (k.includes('treasure')) setSubTab('12-treasure');
    else if (k.includes('entry')) setSubTab('13-entry');
    else if (k.includes('exit')) setSubTab('14-exit');
    else if (k.includes('announcements')) setSubTab('15-announcements');
    else if (k.includes('moderation')) setSubTab('16-moderation');
    else if (k.includes('comments')) setSubTab('17-comments');
    else if (k.includes('reactions') || k.includes('emojis')) setSubTab('18-reactions');
    else if (k.includes('voice')) setSubTab('19-voice');
    else if (k.includes('video')) setSubTab('20-video');
    else if (k.includes('games')) setSubTab('21-games');
    else if (k.includes('events')) setSubTab('22-events');
    else if (k.includes('recording')) setSubTab('23-recording');
    else if (k.includes('replay')) setSubTab('24-replay');
    else if (k.includes('reports')) setSubTab('25-reports');
    else if (k.includes('violations')) setSubTab('26-violations');
    else if (k.includes('analytics')) setSubTab('27-analytics');
    else if (k.includes('revenue')) setSubTab('28-revenue');
    else if (k.includes('notifications')) setSubTab('29-notifications');
    else if (k.includes('settings')) setSubTab('30-settings');
    else if (k.includes('permissions')) setSubTab('31-permissions');
    else if (k.includes('audit')) setSubTab('32-audit');
    else setSubTab('1-dashboard');
  }, [activeKey]);

  const handleEndRoom = (roomId: string) => {
    setLiveRooms(prev => prev.filter(r => r.id !== roomId));
    alert(`Live Room ${roomId} ENDED by Admin. Stream disconnected.`);
  };

  return (
    <section className="space-y-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#273449] pb-3">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>🎙️ Enterprise Live Streaming Control Hub</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs">
              32 Sub-Modules Engine
            </span>
          </h3>
          <p className="text-xs text-[#94A3B8]">Live Rooms, PK Arena Battles, Audio/Video Guest Seats, Gifts, Sound FX & Moderation</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => alert('Broadcast Message Sent to All Live Rooms')} className="px-3 py-2 rounded-xl bg-[#4F46E5] text-white font-bold text-xs shadow-md">
            📢 Broadcast to All Rooms
          </button>
        </div>
      </div>

      {/* 32 SUB-MODULE TABS SCROLLER */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { key: '1-dashboard', label: '1. Dashboard' },
          { key: '2-rooms', label: '2. Live Rooms' },
          { key: '3-details', label: '3. Room Details' },
          { key: '4-categories', label: '4. Categories' },
          { key: '5-hosts', label: '5. Live Hosts' },
          { key: '6-seats', label: '6. Guest Seats' },
          { key: '7-pk', label: '7. PK Battles' },
          { key: '8-pk-rules', label: '8. PK Time Rules' },
          { key: '9-sounds', label: '9. Sound Effects' },
          { key: '10-gifts', label: '10. Live Gifts' },
          { key: '11-lucky-gifts', label: '11. Lucky Gifts' },
          { key: '12-treasure', label: '12. Treasure Box' },
          { key: '13-entry', label: '13. Entry Effects' },
          { key: '14-exit', label: '14. Exit Effects' },
          { key: '15-announcements', label: '15. Pinned Notices' },
          { key: '16-moderation', label: '16. Moderation' },
          { key: '17-comments', label: '17. Comments' },
          { key: '18-reactions', label: '18. Reactions' },
          { key: '19-voice', label: '19. Voice Rooms' },
          { key: '20-video', label: '20. Video Rooms' },
          { key: '21-games', label: '21. Live Games' },
          { key: '22-events', label: '22. Tournaments' },
          { key: '23-recording', label: '23. Cloud Recording' },
          { key: '24-replay', label: '24. Replay Stream' },
          { key: '25-reports', label: '25. Room Reports' },
          { key: '26-violations', label: '26. Violations' },
          { key: '27-analytics', label: '27. Analytics' },
          { key: '28-revenue', label: '28. Revenue' },
          { key: '29-notifications', label: '29. Push Alerts' },
          { key: '30-settings', label: '30. Room Settings' },
          { key: '31-permissions', label: '31. Live RBAC' },
          { key: '32-audit', label: '32. Audit Logs' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              subTab === t.key ? 'bg-purple-600 text-white shadow-lg' : 'bg-[#1E293B] text-[#94A3B8] border border-[#273449]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB VIEWS */}

      {/* 1. LIVE DASHBOARD */}
      {subTab === '1-dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Active Live Rooms', val: `${liveRooms.length} Streaming`, color: 'text-emerald-400' },
              { label: 'Live Audio Rooms', val: '2 Rooms', color: 'text-indigo-400' },
              { label: 'Live Video Rooms', val: '1 Room', color: 'text-purple-400' },
              { label: 'Active PK Battles', val: '2 Battles', color: 'text-amber-400' },
              { label: 'Active Concurrent Viewers', val: '6,170 Viewers', color: 'text-cyan-400' },
              { label: 'Gifts Sent Today', val: '18,450 Gifts', color: 'text-pink-400' },
              { label: 'Live Coins Revenue', val: '1,877,000 🪙', color: 'text-amber-400' },
              { label: 'Avg Watch Duration', val: '42.8 Mins', color: 'text-blue-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold">{s.label}</span>
                <div className={`text-xl font-black ${s.color} mt-1`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. LIVE ROOMS */}
      {subTab === '2-rooms' && (
        <div className="space-y-3">
          {liveRooms.length === 0 ? (
            <div className="bg-[#131C2E] border border-[#273449] p-8 rounded-2xl text-center space-y-2">
              <span className="text-3xl">🎙️</span>
              <h4 className="text-white font-bold text-sm">No Active Live Rooms</h4>
              <p className="text-xs text-slate-400">There are currently no active live audio or video rooms. When creators go live from the app, their streams will appear here in real-time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {liveRooms.map(r => (
                <div key={r.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl space-y-3 shadow-lg hover:border-purple-500 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">{r.id} • {r.type}</span>
                      <h4 className="font-bold text-white text-sm">{r.title}</h4>
                      <p className="text-[10px] text-slate-400">Host: <strong className="text-amber-400">{r.host}</strong> | Category: {r.category}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold text-[9px] border border-red-500/40">
                      🔴 {r.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono bg-[#0B1220]/60 p-2.5 rounded-xl">
                    <div>Viewers: <strong className="text-emerald-400">{r.viewers?.toLocaleString() || 0}</strong></div>
                    <div>Coins: <strong className="text-amber-400">{r.coins?.toLocaleString() || 0}</strong></div>
                    <div>Quality: <strong className="text-cyan-400">{r.quality}</strong></div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleEndRoom(r.id)} className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/40">
                      🔴 End Live Room
                    </button>
                    <button onClick={() => alert(`Featured room ${r.id} on Home Trending!`)} className="px-3 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md">
                      ⭐ Feature Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* 3. ROOM DETAILS */}
      {subTab === '3-details' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm text-cyan-400">📊 Real-Time Stream Room Details & Telemetry</h4>
          <div>Bitrate: 4500 kbps • Frame Rate: 60 FPS • Latency: 120ms • Audio Sample Rate: 48kHz Stereo</div>
        </div>
      )}

      {/* 4. CATEGORIES */}
      {subTab === '4-categories' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🏷️ Live Stream Categories Manager</h4>
          <p className="text-slate-400">Gaming, Music, Entertainment, Podcast, Education, Sports, Business, Talk Show</p>
        </div>
      )}

      {/* 5. LIVE HOSTS */}
      {subTab === '5-hosts' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">🎙️ Active Streamer Hosts Roster</h4>
          <div>840 Registered Hosts • 42 Hosts Live Right Now</div>
        </div>
      )}

      {/* 6. GUEST SEATS */}
      {subTab === '6-seats' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm text-cyan-400">🪑 Enterprise Multi-Guest Seats (10 Seats, 15 Seats, 20 Seats)</h4>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold text-[10px]">ACTIVE</span>
          </div>
          <p className="text-slate-400">Governance controls: 🔒 Seat Lock, ✉️ Invite Guest, 🚫 Remove Guest, 🎙️ Mute/Unmute, 📷 Camera On/Off.</p>
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px] bg-[#0B1220] p-3 rounded-xl border border-[#273449]">
            <div>10-Seat Arena: <strong className="text-emerald-400">Active</strong></div>
            <div>15-Seat Space: <strong className="text-cyan-400">Active</strong></div>
            <div>20-Seat Grand Hall: <strong className="text-amber-400">Active</strong></div>
          </div>
        </div>
      )}

      {/* 7. PK BATTLES */}
      {subTab === '7-pk' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">🔥 1v1 & 3v3 Team PK Arena Battles</h4>
          <div>Active Battle: Sara_Vip7 VS King_Rana_VIP (Score: 184,000 VS 210,000 Coins)</div>
        </div>
      )}

      {/* 8. PK TIME RULES */}
      {subTab === '8-pk-rules' && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">⏱️ PK Time Rule Settings & Multipliers</h4>
          <div className="space-y-2">
            {pkRules.map(p => (
              <div key={p.id} className="bg-[#131C2E] border border-[#273449] p-3 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <h5 className="font-bold text-white">{p.name} ({p.duration} Seconds)</h5>
                  <span className="text-[10px] text-amber-400 font-mono">Multiplier: {p.multiplier} • Min Coins to Win: {p.minWin.toLocaleString()}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[9px]">{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. SOUND EFFECTS */}
      {subTab === '9-sounds' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🎵 Live Room Sound Effects & Audio Triggers</h4>
          <p className="text-slate-400">Join room sound, gift applause, victory fanfare, defeat sound, treasure box chime</p>
        </div>
      )}

      {/* 10. LIVE GIFTS */}
      {subTab === '10-gifts' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🎁 SVGA & Lottie 3D Animated Gift Library</h4>
          <p className="text-slate-400">Dragon Entry (50,000 Coins), Speedster Coupe (10,000 Coins), Castle (5,000 Coins)</p>
        </div>
      )}

      {/* 11. LUCKY GIFTS */}
      {subTab === '11-lucky-gifts' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">🎰 Lucky Random Reward Gifts Engine</h4>
          <div>100x Coin Multiplier Jackpot Chance configured.</div>
        </div>
      )}

      {/* 12. TREASURE BOX */}
      {subTab === '12-treasure' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">📦 Treasure Box Giveaway System</h4>
          <button onClick={() => alert('Dispatched Treasure Box Giveaway to Room #RM-8821!')} className="px-3 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs">
            + Dispatch 10,000 Coins Treasure Box
          </button>
        </div>
      )}

      {/* 13. ENTRY EFFECTS */}
      {subTab === '13-entry' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🛩️ VIP & Noble Entrance Vehicle Animations</h4>
          <p className="text-slate-400">Phantom Jet, Starship, Bugatti entrance animations</p>
        </div>
      )}

      {/* 14. EXIT EFFECTS */}
      {subTab === '14-exit' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🚪 Custom Exit Animations</h4>
          <p className="text-slate-400">Noble exit particle fade & badge exit banner</p>
        </div>
      )}

      {/* 15. PINNED NOTICES */}
      {subTab === '15-announcements' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">📌 Live Stream Pinned Notices & Room Rules</h4>
          <p className="text-slate-400">Host pinned messages and room rules banner</p>
        </div>
      )}

      {/* 16. MODERATION */}
      {subTab === '16-moderation' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🛡️ AI Live Chat Moderation & Profanity Filter</h4>
          <p className="text-slate-400">Auto spam link blocking, flood control & mute triggers</p>
        </div>
      )}

      {/* 17. COMMENTS */}
      {subTab === '17-comments' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">💬 Real-Time Live Comments & Translations</h4>
          <div>Auto-translation between Urdu, English & Arabic active.</div>
        </div>
      )}

      {/* 18. REACTIONS */}
      {subTab === '18-reactions' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">❤️ Floating Reactions & Animated Emojis</h4>
          <p className="text-slate-400">Floating hearts, fire, clap & celebratory reactions</p>
        </div>
      )}

      {/* 19. VOICE ROOMS */}
      {subTab === '19-voice' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">🎙️ Audio-Only Private Voice Spaces</h4>
          <div>2 Active Audio Rooms • 8 Guest Seats Each</div>
        </div>
      )}

      {/* 20. VIDEO ROOMS */}
      {subTab === '20-video' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📹 HD Multi-Guest Video Broadcast Rooms</h4>
          <div>1 Active Video Stream • 1080p 60fps Beauty Filter Enabled</div>
        </div>
      )}

      {/* 21. LIVE GAMES */}
      {subTab === '21-games' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🎲 In-Stream Mini Games (Ludo, Lucky Wheel, Dice, Spin)</h4>
          <p className="text-slate-400">Mini-game overlay for live room viewers</p>
        </div>
      )}

      {/* 22. TOURNAMENTS */}
      {subTab === '22-events' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🎪 Live Stream Events & Gift Marathons</h4>
          <p className="text-slate-400">Weekly PK Tournament & Grand Singing Contest</p>
        </div>
      )}

      {/* 23. CLOUD RECORDING */}
      {subTab === '23-recording' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📹 Cloud HLS Live Recording Engine</h4>
          <div>Cloud storage recording active for room #RM-8821</div>
        </div>
      )}

      {/* 24. REPLAY STREAM */}
      {subTab === '24-replay' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">📼 Live Stream Replay & VOD Generation</h4>
          <p className="text-slate-400">Watch past stream replays & download permissions</p>
        </div>
      )}

      {/* 25. ROOM REPORTS */}
      {subTab === '25-reports' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">⚠️ Live Room Safety Complaints Queue</h4>
          <p className="text-slate-400">View user reports for nudity, abuse, or spam in rooms</p>
        </div>
      )}

      {/* 26. VIOLATIONS */}
      {subTab === '26-violations' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">🚫 NSFW & Copyright Auto-Violation Detection</h4>
          <div>AI Vision Moderation Active • 0 NSFW Violations Detected Today</div>
        </div>
      )}

      {/* 27. ANALYTICS */}
      {subTab === '27-analytics' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📈 Live Concurrent Viewers & Bitrate Analytics</h4>
          <div>Peak Viewers Today: 6,170 • Avg Bitrate: 4500 kbps • Zero Packet Loss</div>
        </div>
      )}

      {/* 28. REVENUE */}
      {subTab === '28-revenue' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">💰 Live Gift Revenue & Commission Splits</h4>
          <div>Platform Revenue: $42,500 • Host Income: $28,400 • Agency Cut: $5,312</div>
        </div>
      )}

      {/* 29. PUSH ALERTS */}
      {subTab === '29-notifications' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">🔔 Live Started Push Notifications</h4>
          <p className="text-slate-400">Automatic push notifications sent to followers when host goes live</p>
        </div>
      )}

      {/* 30. ROOM SETTINGS */}
      {subTab === '30-settings' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2">
          <h4 className="font-bold text-sm">⚙️ Room Password, Gifts & Seat Count Settings</h4>
          <p className="text-slate-400">Configure global live room parameters and gift toggles</p>
        </div>
      )}

      {/* 31. LIVE RBAC */}
      {subTab === '31-permissions' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">🔐 Room Role Permissions (Host, Co-Host, Moderator, VIP, Viewer)</h4>
          <div>Granular mic, seat, kick & gift controls per role.</div>
        </div>
      )}

      {/* 32. AUDIT LOGS */}
      {subTab === '32-audit' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📜 Live Room Event Audit Logs</h4>
          <div>Event #LIVE-901: Sara_Vip7 started PK Battle with King_Rana_VIP</div>
        </div>
      )}
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/* ══ ENTERPRISE FUND MANAGEMENT PORTAL (31 SUB-MODULES FINANCIAL CORE) ═══ */
/* ════════════════════════════════════════════════════════════════════════ */
function FundEnterprisePortal({ activeKey }: { activeKey?: string }) {
  const [subTab, setSubTab] = useState<string>('1-dashboard');

  // Financial State
  const [withdrawRequests, setWithdrawRequests] = useState([
    { id: 'W-901', user: 'Usman_Singer', uid: '100491', amountUsd: 1450, diamonds: 145000, bank: 'Meezan Bank Ltd', iban: 'PK36MEZN0001009182390', status: 'PENDING', priority: 'HOST' },
    { id: 'W-902', user: 'King_Rana_Agency', uid: '100812', amountUsd: 5800, diamonds: 580000, bank: 'Standard Chartered', iban: 'PK92SCBL0004918274910', status: 'PENDING', priority: 'AGENCY' },
    { id: 'W-903', user: 'Sara_Vip7', uid: '106172', amountUsd: 890, diamonds: 8900, bank: 'JazzCash Wallet', iban: '03009182749', status: 'APPROVED', priority: 'VIP' },
  ]);

  const [paymentInterfaces, setPaymentInterfaces] = useState([
    { id: 'p1', name: 'Stripe Credit/Debit Card', fee: '2.9% + $0.30', min: '$1.00', max: '$5,000', status: 'ACTIVE' },
    { id: 'p2', name: 'JazzCash Direct Wallet', fee: '1.5%', min: 'PKR 100', max: 'PKR 200,000', status: 'ACTIVE' },
    { id: 'p3', name: 'EasyPaisa Mobile Pay', fee: '1.5%', min: 'PKR 100', max: 'PKR 200,000', status: 'ACTIVE' },
    { id: 'p4', name: 'Apple Pay & Google Pay', fee: '2.0%', min: '$0.99', max: '$1,000', status: 'ACTIVE' },
    { id: 'p5', name: 'Binance Pay / USDT Crypto', fee: '0.5%', min: '$10.00', max: '$50,000', status: 'ACTIVE' },
  ]);

  const [rechargePackages, setRechargePackages] = useState([
    { id: 'pkg-1', name: 'Starter Pack', coins: 500, bonus: 50, priceUsd: 0.99 },
    { id: 'pkg-2', name: 'Silver Pack', coins: 5000, bonus: 750, priceUsd: 9.99 },
    { id: 'pkg-3', name: 'Gold Pack', coins: 28000, bonus: 5000, priceUsd: 49.99 },
    { id: 'pkg-4', name: 'Platinum Sovereign', coins: 65000, bonus: 15000, priceUsd: 99.99 },
  ]);

  React.useEffect(() => {
    if (!activeKey) return;
    const k = activeKey.toLowerCase();
    if (k.includes('dashboard')) setSubTab('1-dashboard');
    else if (k.includes('payment-interface') || k === 'payment-interface') setSubTab('2-interface');
    else if (k.includes('gateways')) setSubTab('3-gateways');
    else if (k.includes('recharge-packages') || k.includes('packages')) setSubTab('5-packages');
    else if (k.includes('recharge-orders') || k.includes('orders')) setSubTab('6-orders');
    else if (k.includes('manual-recharge')) setSubTab('7-manual-recharge');
    else if (k.includes('promo') || k.includes('coupons')) setSubTab('8-promos');
    else if (k.includes('bank-list')) setSubTab('9-banks');
    else if (k.includes('bank-accounts')) setSubTab('10-bank-accounts');
    else if (k.includes('withdrawal-requests') || k.includes('requests')) setSubTab('12-requests');
    else if (k.includes('approval-queue')) setSubTab('13-approval-queue');
    else if (k.includes('withdrawal')) setSubTab('11-withdrawals');
    else if (k.includes('settlement')) setSubTab('14-settlements');
    else if (k.includes('host-salary')) setSubTab('16-host-salary');
    else if (k.includes('salary')) setSubTab('15-salaries');
    else if (k.includes('commission')) setSubTab('17-agency-commission');
    else if (k.includes('family-rewards')) setSubTab('18-family-rewards');
    else if (k.includes('revenue-sharing')) setSubTab('19-revenue-split');
    else if (k.includes('wallet')) setSubTab('20-wallets');
    else if (k.includes('coin')) setSubTab('21-coins');
    else if (k.includes('diamond')) setSubTab('22-diamonds');
    else if (k.includes('transaction')) setSubTab('23-transactions');
    else if (k.includes('refund')) setSubTab('24-refunds');
    else if (k.includes('tax')) setSubTab('25-taxes');
    else if (k.includes('reports')) setSubTab('26-reports');
    else if (k.includes('statistical') || k.includes('stats')) setSubTab('27-stats');
    else if (k.includes('fraud')) setSubTab('28-fraud');
    else if (k.includes('risk')) setSubTab('29-risk');
    else if (k.includes('audit')) setSubTab('30-audit');
    else if (k.includes('settings')) setSubTab('31-settings');
    else setSubTab('1-dashboard');
  }, [activeKey]);

  const handleApproveWithdrawal = (id: string) => {
    setWithdrawRequests(prev => prev.map(w => w.id === id ? { ...w, status: 'APPROVED' } : w));
    alert(`Withdrawal Payout ${id} APPROVED and dispatched to Bank IBAN!`);
  };

  return (
    <section className="space-y-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#273449] pb-3">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>💰 Enterprise Fund Management & Financial Core</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
              31 Sub-Modules Accounting Engine
            </span>
          </h3>
          <p className="text-xs text-[#94A3B8]">Wallets, Payment Gateways, Recharge, Withdrawals, Salaries & Revenue Split</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => alert('Daily Financial Ledger Reconciliation Completed!')} className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md">
            ⚖️ Run Settlement Ledger
          </button>
        </div>
      </div>

      {/* 31 SUB-MODULE TABS SCROLLER */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { key: '1-dashboard', label: '1. Dashboard' },
          { key: '2-interface', label: '2. Payment Interface' },
          { key: '3-gateways', label: '3. Gateways' },
          { key: '4-recharge-mgmt', label: '4. Recharge Mgmt' },
          { key: '5-packages', label: '5. Packages' },
          { key: '6-orders', label: '6. Recharge Orders' },
          { key: '7-manual-recharge', label: '7. Manual Credit' },
          { key: '8-promos', label: '8. Promo Coupons' },
          { key: '9-banks', label: '9. Bank List' },
          { key: '10-bank-accounts', label: '10. Bank Accounts' },
          { key: '11-withdrawals', label: '11. Withdrawals' },
          { key: '12-requests', label: '12. Cashout Requests' },
          { key: '13-approval-queue', label: '13. Approval Queue' },
          { key: '14-settlements', label: '14. Settlements' },
          { key: '15-salaries', label: '15. Payroll' },
          { key: '16-host-salary', label: '16. Host Salary' },
          { key: '17-agency-commission', label: '17. Agency Cut' },
          { key: '18-family-rewards', label: '18. Family Rewards' },
          { key: '19-revenue-split', label: '19. Revenue Split' },
          { key: '20-wallets', label: '20. Wallet Mgmt' },
          { key: '21-coins', label: '21. Coin Engine' },
          { key: '22-diamonds', label: '22. Diamond Cashout' },
          { key: '23-transactions', label: '23. Ledger Log' },
          { key: '24-refunds', label: '24. Refunds' },
          { key: '25-taxes', label: '25. Tax & VAT' },
          { key: '26-reports', label: '26. Financial Reports' },
          { key: '27-stats', label: '27. Analytics' },
          { key: '28-fraud', label: '28. Fraud Detection' },
          { key: '29-risk', label: '29. Risk Control' },
          { key: '30-audit', label: '30. Financial Audit' },
          { key: '31-settings', label: '31. Fund Settings' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              subTab === t.key ? 'bg-emerald-600 text-white shadow-lg' : 'bg-[#1E293B] text-[#94A3B8] border border-[#273449]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB VIEWS */}

      {/* 1. DASHBOARD */}
      {subTab === '1-dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Platform Revenue', val: '$4,280,000', color: 'text-emerald-400' },
              { label: 'Today Revenue', val: '$42,500', color: 'text-cyan-400' },
              { label: 'Monthly Revenue', val: '$1,280,000', color: 'text-purple-400' },
              { label: 'Total Recharges', val: '$3,800,000', color: 'text-indigo-400' },
              { label: 'Total Withdrawals Paid', val: '$1,420,000', color: 'text-amber-400' },
              { label: 'Pending Withdrawals', val: '14 Requests', color: 'text-pink-400' },
              { label: 'Platform Net Profit', val: '$1,250,000 (30%)', color: 'text-emerald-400' },
              { label: 'Active User Wallets', val: '42,850 Wallets', color: 'text-blue-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold">{s.label}</span>
                <div className={`text-xl font-black ${s.color} mt-1`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PAYMENT INTERFACE */}
      {subTab === '2-interface' && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">💳 Payment Interfaces & Gateway Rules</h4>
          <div className="space-y-2">
            {paymentInterfaces.map(p => (
              <div key={p.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <h5 className="font-bold text-white text-sm">{p.name}</h5>
                  <span className="text-[10px] text-cyan-400 font-mono">Fee: {p.fee} | Min: {p.min} | Max: {p.max}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. GATEWAYS */}
      {subTab === '3-gateways' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm text-amber-400">🔑 Gateway API Keys & Webhook Signing Secret</h4>
          <div>Stripe PK: pk_live_9012*** | JazzCash Merchant ID: MC-88192 | Webhook Secret: whsec_9081***</div>
        </div>
      )}

      {/* 5. RECHARGE PACKAGES */}
      {subTab === '5-packages' && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">📦 Recharge Coin Packages Catalog</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {rechargePackages.map(pkg => (
              <div key={pkg.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-center space-y-2">
                <span className="text-2xl">🪙</span>
                <h5 className="font-bold text-white text-sm">{pkg.name}</h5>
                <div className="text-amber-400 font-extrabold text-base">{pkg.coins.toLocaleString()} Coins</div>
                <div className="text-[10px] text-emerald-400 font-bold">+{pkg.bonus} Bonus Coins</div>
                <button className="w-full py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md">${pkg.priceUsd}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. WITHDRAWALS */}
      {(subTab === '11-withdrawals' || subTab === '12-requests' || subTab === '13-approval-queue') && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">🏦 Host & Agency Withdrawal Approval Queue</h4>
          <div className="space-y-2">
            {withdrawRequests.map(w => (
              <div key={w.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl space-y-2 shadow-lg">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{w.id} • {w.priority} PRIORITY</span>
                    <h5 className="font-bold text-white text-sm">{w.user} (UID: {w.uid})</h5>
                    <p className="text-[10px] text-slate-400">Bank: <strong>{w.bank}</strong> | IBAN: <span className="font-mono text-amber-400">{w.iban}</span></p>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-emerald-400">${w.amountUsd.toLocaleString()} USD</div>
                    <span className="text-[10px] text-purple-400 font-mono">{w.diamonds.toLocaleString()} 💎</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  {w.status === 'PENDING' ? (
                    <button onClick={() => handleApproveWithdrawal(w.id)} className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md">
                      ✅ Approve & Transfer Payout
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs">PAID & SETTLED</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 16. HOST SALARY */}
      {subTab === '16-host-salary' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm text-emerald-400">📊 Host Monthly Salary Calculation Formula</h4>
          <div>Salary = Live Hours Base + (Gift Coins × 50%) + Monthly Target Bonus + Tournament Prizes</div>
        </div>
      )}

      {/* 19. REVENUE SHARING */}
      {subTab === '19-revenue-split' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-3">
          <h4 className="font-bold text-sm text-white">⚙️ Configurable Revenue Split Matrix</h4>
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449]">Platform: <strong className="text-emerald-400">30%</strong></div>
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449]">Host Share: <strong className="text-purple-400">50%</strong></div>
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449]">Agency Cut: <strong className="text-cyan-400">15%</strong></div>
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449]">Family Pool: <strong className="text-amber-400">5%</strong></div>
          </div>
        </div>
      )}

      {/* 28. FRAUD DETECTION */}
      {subTab === '28-fraud' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm text-red-400">🛡️ AI Anti-Fraud & Chargeback Prevention Engine</h4>
          <div>Zero Fraudulent Recharges Detected. All payment tokens signed via HMAC-SHA256.</div>
        </div>
      )}

      {/* 30. AUDIT LOGS */}
      {subTab === '30-audit' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📜 Financial Audit Trail Logs</h4>
          <div>Tx #TX-90182: Admin credited 50,000 Coins to user Usman_Singer for Event Reward</div>
        </div>
      )}
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/* ══ ENTERPRISE AGENT RECHARGE MANAGEMENT PORTAL (25 SUB-MODULES NETWORK) ═ */
/* ════════════════════════════════════════════════════════════════════════ */
function AgentEnterprisePortal({ activeKey }: { activeKey?: string }) {
  const [subTab, setSubTab] = useState<string>('1-dashboard');

  // Agent Network State
  const [agentsList, setAgentsList] = useState([
    { id: 'AG-901', name: 'King_Rana_Agency', type: 'GLOBAL PARTNER', level: 'Global Partner', salesUsd: 485000, commission: '18%', walletBalance: 128500, status: 'ACTIVE', subAgentsCount: 42 },
    { id: 'AG-902', name: 'Gulf_Reseller_Co', type: 'REGIONAL AGENT', level: 'Royal', salesUsd: 225000, commission: '15%', walletBalance: 64000, status: 'ACTIVE', subAgentsCount: 18 },
    { id: 'AG-903', name: 'Pak_Master_Distributor', type: 'COUNTRY AGENT', level: 'Elite', salesUsd: 142000, commission: '12%', walletBalance: 38000, status: 'ACTIVE', subAgentsCount: 12 },
    { id: 'AG-904', name: 'Lahore_City_Dealer', type: 'CITY AGENT', level: 'Diamond', salesUsd: 89000, commission: '10%', walletBalance: 21000, status: 'ACTIVE', subAgentsCount: 5 },
    { id: 'AG-905', name: 'Sara_Sub_Distributor', type: 'SUB AGENT', level: 'Gold', salesUsd: 42000, commission: '7%', walletBalance: 9800, status: 'ACTIVE', subAgentsCount: 0 },
  ]);

  const [agentLevels] = useState([
    { name: 'Starter', commission: '2%', limit: '$500/day', bonus: '0.5%' },
    { name: 'Bronze', commission: '3%', limit: '$1,000/day', bonus: '1.0%' },
    { name: 'Silver', commission: '5%', limit: '$5,000/day', bonus: '2.0%' },
    { name: 'Gold', commission: '7%', limit: '$20,000/day', bonus: '3.0%' },
    { name: 'Diamond', commission: '10%', limit: '$50,000/day', bonus: '5.0%' },
    { name: 'Elite', commission: '12%', limit: '$100,000/day', bonus: '7.0%' },
    { name: 'Royal', commission: '15%', limit: '$250,000/day', bonus: '9.0%' },
    { name: 'Global Partner', commission: '18%', limit: 'Unlimited', bonus: '12.0%' },
  ]);

  React.useEffect(() => {
    if (!activeKey) return;
    const k = activeKey.toLowerCase();
    if (k.includes('dashboard')) setSubTab('1-dashboard');
    else if (k.includes('master-agent') || k.includes('master')) setSubTab('3-master-agents');
    else if (k.includes('sub-agent') || k.includes('sub')) setSubTab('4-sub-agents');
    else if (k.includes('level-list') || k.includes('levels')) setSubTab('5-levels');
    else if (k.includes('verification') || k.includes('kyc')) setSubTab('6-verification');
    else if (k.includes('wallet')) setSubTab('7-wallet');
    else if (k.includes('recharge-record') || k.includes('recharge-records')) setSubTab('9-recharge-records');
    else if (k.includes('recharge')) setSubTab('8-recharge');
    else if (k.includes('sales-records') || k.includes('sales')) setSubTab('10-sales-records');
    else if (k.includes('commission-rules') || k.includes('rules')) setSubTab('12-commission-rules');
    else if (k.includes('commission')) setSubTab('11-commission-mgmt');
    else if (k.includes('invitation-record') || k.includes('invitations')) setSubTab('14-invitation-records');
    else if (k.includes('invitation')) setSubTab('13-invitation');
    else if (k.includes('referral')) setSubTab('15-referral-network');
    else if (k.includes('agency-payment-name') || k.includes('payment')) setSubTab('16-payment-methods');
    else if (k.includes('settlement')) setSubTab('17-settlement');
    else if (k.includes('withdrawals') || k.includes('withdraw')) setSubTab('18-withdrawals');
    else if (k.includes('performance')) setSubTab('19-performance');
    else if (k.includes('leaderboard')) setSubTab('20-leaderboards');
    else if (k.includes('stats') || k.includes('statistics')) setSubTab('21-stats');
    else if (k.includes('reports')) setSubTab('22-reports');
    else if (k.includes('audit')) setSubTab('23-audit');
    else if (k.includes('notifications')) setSubTab('24-notifications');
    else if (k.includes('settings')) setSubTab('25-settings');
    else setSubTab('1-dashboard');
  }, [activeKey]);

  return (
    <section className="space-y-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#273449] pb-3">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>🏢 Agent Recharge & Reseller Distribution Network</span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs">
              25 Sub-Modules Finance System
            </span>
          </h3>
          <p className="text-xs text-[#94A3B8]">Master Agents, Sub-Agents, Commission Engine, Multi-Tier Levels & Withdrawals</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => alert('New Agent Registration Form Opened')} className="px-3 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-md">
            + Onboard Master Agent
          </button>
        </div>
      </div>

      {/* 25 SUB-MODULE TABS SCROLLER */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { key: '1-dashboard', label: '1. Dashboard' },
          { key: '2-accounts', label: '2. Agent Accounts' },
          { key: '3-master-agents', label: '3. Master Agents' },
          { key: '4-sub-agents', label: '4. Sub Agents' },
          { key: '5-levels', label: '5. Agent Levels' },
          { key: '6-verification', label: '6. Agent KYC' },
          { key: '7-wallet', label: '7. Agent Wallet' },
          { key: '8-recharge', label: '8. Agent Recharge' },
          { key: '9-recharge-records', label: '9. Recharge Log' },
          { key: '10-sales-records', label: '10. Sales Log' },
          { key: '11-commission-mgmt', label: '11. Commission' },
          { key: '12-commission-rules', label: '12. Rules Matrix' },
          { key: '13-invitation', label: '13. Invitations' },
          { key: '14-invitation-records', label: '14. Invite Logs' },
          { key: '15-referral-network', label: '15. Tree View' },
          { key: '16-payment-methods', label: '16. Payment Methods' },
          { key: '17-settlement', label: '17. Settlements' },
          { key: '18-withdrawals', label: '18. Agent Cashouts' },
          { key: '19-performance', label: '19. Performance' },
          { key: '20-leaderboards', label: '20. Leaderboards' },
          { key: '21-stats', label: '21. Statistics' },
          { key: '22-reports', label: '22. Reports' },
          { key: '23-audit', label: '23. Audit Trail' },
          { key: '24-notifications', label: '24. Notifications' },
          { key: '25-settings', label: '25. Agent Settings' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              subTab === t.key ? 'bg-cyan-600 text-white shadow-lg' : 'bg-[#1E293B] text-[#94A3B8] border border-[#273449]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB VIEWS */}

      {/* 1. DASHBOARD */}
      {subTab === '1-dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Registered Agents', val: '320 Agents', color: 'text-cyan-400' },
              { label: 'Active Master Agents', val: '42 Master', color: 'text-indigo-400' },
              { label: 'Active Sub-Agents', val: '278 Sub-Agents', color: 'text-purple-400' },
              { label: 'Total Agent Recharge', val: '$3,800,000', color: 'text-emerald-400' },
              { label: 'Today Agent Sales', val: '$42,500', color: 'text-amber-400' },
              { label: 'Pending Cashout Requests', val: '8 Requests', color: 'text-pink-400' },
              { label: 'Total Commission Paid', val: '$320,000', color: 'text-cyan-400' },
              { label: 'Monthly Reseller Growth', val: '+24.5%', color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold">{s.label}</span>
                <div className={`text-xl font-black ${s.color} mt-1`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. AGENT ACCOUNTS */}
      {(subTab === '2-accounts' || subTab === '3-master-agents' || subTab === '4-sub-agents') && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">🏢 Agent Reseller Master Directory</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agentsList.map(ag => (
              <div key={ag.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl space-y-3 shadow-lg hover:border-cyan-500 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{ag.id} • {ag.type}</span>
                    <h5 className="font-bold text-white text-sm">{ag.name}</h5>
                    <p className="text-[10px] text-slate-400">Level: <strong className="text-amber-400">{ag.level}</strong> | Sub-Agents: <strong>{ag.subAgentsCount}</strong></p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[9px]">{ag.status}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono bg-[#0B1220] p-2.5 rounded-xl border border-[#273449]">
                  <div>Sales: <strong className="text-emerald-400">${ag.salesUsd.toLocaleString()}</strong></div>
                  <div>Rate: <strong className="text-purple-400">{ag.commission}</strong></div>
                  <div>Balance: <strong className="text-amber-400">${ag.walletBalance.toLocaleString()}</strong></div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => alert(`Recharged User via Agent ${ag.name}`)} className="flex-1 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-md">
                    🪙 Credit User Wallet
                  </button>
                  <button onClick={() => alert(`Agent ${ag.name} Wallet Frozen`)} className="px-3 py-2 rounded-xl bg-[#1E293B] text-slate-300 font-bold text-xs">
                    🔒 Freeze
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AGENT LEVELS */}
      {subTab === '5-levels' && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">⭐ Agent Levels & Commission Tiers Matrix</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {agentLevels.map(lvl => (
              <div key={lvl.name} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-center space-y-2">
                <span className="text-2xl">🏆</span>
                <h5 className="font-bold text-white text-sm">{lvl.name} Tier</h5>
                <div className="text-cyan-400 font-extrabold text-base">{lvl.commission} Commission</div>
                <div className="text-[10px] text-slate-400">Limit: {lvl.limit}</div>
                <div className="text-[10px] text-emerald-400 font-bold">+{lvl.bonus} Bonus</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 15. REFERRAL NETWORK TREE */}
      {subTab === '15-referral-network' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-3 font-mono">
          <h4 className="font-bold text-sm text-cyan-400">🌲 Hierarchical Agent Network Tree View</h4>
          <div className="space-y-1">
            <div>👑 King_Rana_Agency (Master Agent - 12% Platinum)</div>
            <div className="pl-4">├── 🏢 Sara_Sub_Distributor (Sub Agent - 7% Gold)</div>
            <div className="pl-8">│   ├── 👤 User_100491 (Usman_Singer)</div>
            <div className="pl-8">│   └── 👤 User_100812 (Ali_Pro)</div>
            <div className="pl-4">└── 🏢 Gulf_Reseller_Co (Sub Agent - 10% Diamond)</div>
          </div>
        </div>
      )}

      {/* 18. AGENT WITHDRAWALS */}
      {subTab === '18-withdrawals' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm text-emerald-400">🏦 Agent Commission Cashout Payout Queue</h4>
          <div>Pending Payout: King_Rana_Agency ($48,500 USD) • Bank: Meezan Bank Ltd</div>
        </div>
      )}

      {/* 23. AUDIT TRAIL */}
      {subTab === '23-audit' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📜 Agent Action & Wallet Transaction Audit Trail</h4>
          <div>Log #AG-9012: King_Rana_Agency credited 100,000 Coins to UID 100491 (Earned $120 Commission)</div>
        </div>
      )}
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/* ══ ENTERPRISE FEEDBACK & TRUST & SAFETY PORTAL (21 SUB-MODULES HUB) ════ */
/* ════════════════════════════════════════════════════════════════════════ */
function FeedbackEnterprisePortal({ activeKey }: { activeKey?: string }) {
  const [subTab, setSubTab] = useState<string>('1-dashboard');

  // Reports Queue State
  const [reportsList, setReportsList] = useState([
    { id: 'REP-901', reporter: 'User_88102 (Zain)', entityType: 'Host Live Room', entity: 'Host_Sarah (Room #1008)', category: 'Abuse & Harassment', priority: 'HIGH', status: 'PENDING', time: '5m ago', evidence: 'Screenshot_1004.png' },
    { id: 'REP-902', reporter: 'User_44019 (Amina)', entityType: 'User Chat', entity: 'Spam_Bot_99', category: 'Spam & Scam Links', priority: 'CRITICAL', status: 'UNDER INVESTIGATION', time: '12m ago', evidence: 'Chat_Log_402.txt' },
    { id: 'REP-903', reporter: 'User_10049 (Ali)', entityType: 'Gift Payout', entity: 'Tx #TX-90182', category: 'Missing Gift Coins', priority: 'MEDIUM', status: 'RESOLVED', time: '1h ago', evidence: 'Ledger_491.json' },
  ]);

  const [supportTickets] = useState([
    { id: 'TKT-401', user: 'Host_Kiran', category: 'Wallet & Payout', subject: 'Withdrawal Delayed by 24h', status: 'OPEN', assignedTo: 'Moderator_Fahad', csat: '5/5' },
    { id: 'TKT-402', user: 'Agency_Global', category: 'Agency Commission', subject: 'Commission Rate Audit Question', status: 'SOLVED', assignedTo: 'Admin_Lead', csat: '5/5' },
  ]);

  React.useEffect(() => {
    if (!activeKey) return;
    const k = activeKey.toLowerCase();
    if (k.includes('dashboard')) setSubTab('1-dashboard');
    else if (k.includes('complaint')) setSubTab('4-complaints');
    else if (k.includes('suggestion')) setSubTab('5-suggestions');
    else if (k.includes('bug')) setSubTab('6-bugs');
    else if (k.includes('feature')) setSubTab('7-feature-requests');
    else if (k.includes('abuse')) setSubTab('8-abuse');
    else if (k.includes('moderation')) setSubTab('9-moderation');
    else if (k.includes('appeal')) setSubTab('10-appeals');
    else if (k.includes('ticket')) setSubTab('11-tickets');
    else if (k.includes('live') && k.includes('report')) setSubTab('12-live-reports');
    else if (k.includes('host') && k.includes('report')) setSubTab('13-host-reports');
    else if (k.includes('gift') || k.includes('payment')) setSubTab('14-gift-complaints');
    else if (k.includes('chat')) setSubTab('15-chat-reports');
    else if (k.includes('rating') || k.includes('review')) setSubTab('16-ratings');
    else if (k.includes('resolution')) setSubTab('17-resolution');
    else if (k.includes('analytics') || k.includes('stats')) setSubTab('18-analytics');
    else if (k.includes('notification')) setSubTab('19-notifications');
    else if (k.includes('audit')) setSubTab('20-audit');
    else if (k.includes('settings')) setSubTab('21-settings');
    else if (k.includes('feedback')) setSubTab('3-feedback');
    else setSubTab('2-reports');
  }, [activeKey]);

  return (
    <section className="space-y-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#273449] pb-3">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>🛡️ Trust & Safety + Customer Support Enterprise Portal</span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs">
              21 Sub-Modules Support Engine
            </span>
          </h3>
          <p className="text-xs text-[#94A3B8]">Content Moderation, User Appeals, Bug Tracking, Support Tickets & SLA Management</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => alert('New Support Ticket Created')} className="px-3 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md">
            + Create Support Ticket
          </button>
        </div>
      </div>

      {/* 21 SUB-MODULE TABS SCROLLER */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { key: '1-dashboard', label: '1. Dashboard' },
          { key: '2-reports', label: '2. All Reports' },
          { key: '3-feedback', label: '3. User Feedback' },
          { key: '4-complaints', label: '4. Complaints Queue' },
          { key: '5-suggestions', label: '5. Suggestions' },
          { key: '6-bugs', label: '6. Bug Reports' },
          { key: '7-feature-requests', label: '7. Feature Requests' },
          { key: '8-abuse', label: '8. Abuse Reports' },
          { key: '9-moderation', label: '9. AI Moderation' },
          { key: '10-appeals', label: '10. User Appeals' },
          { key: '11-tickets', label: '11. Support Tickets' },
          { key: '12-live-reports', label: '12. Live Room Reports' },
          { key: '13-host-reports', label: '13. Host Reports' },
          { key: '14-gift-complaints', label: '14. Gift Complaints' },
          { key: '15-chat-reports', label: '15. Chat Reports' },
          { key: '16-ratings', label: '16. CSAT & Ratings' },
          { key: '17-resolution', label: '17. SLA Center' },
          { key: '18-analytics', label: '18. Analytics' },
          { key: '19-notifications', label: '19. Notifications' },
          { key: '20-audit', label: '20. Moderation Audit' },
          { key: '21-settings', label: '21. Support Settings' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              subTab === t.key ? 'bg-rose-600 text-white shadow-lg' : 'bg-[#1E293B] text-[#94A3B8] border border-[#273449]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB VIEWS */}

      {/* 1. DASHBOARD */}
      {subTab === '1-dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Submitted Reports', val: '1,480 Reports', color: 'text-rose-400' },
              { label: 'Open Pending Investigations', val: '42 Pending', color: 'text-amber-400' },
              { label: 'Critical Violation Cases', val: '3 Critical', color: 'text-red-500' },
              { label: 'Open Support Tickets', val: '14 Open', color: 'text-cyan-400' },
              { label: 'Resolved Tickets', val: '1,410 Solved', color: 'text-emerald-400' },
              { label: 'Average Response SLA', val: '4.2 Minutes', color: 'text-purple-400' },
              { label: 'CSAT Customer Score', val: '4.85 / 5.0 ⭐', color: 'text-amber-300' },
              { label: 'Ban Appeal Approvals', val: '88% Verified', color: 'text-indigo-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold">{s.label}</span>
                <div className={`text-xl font-black ${s.color} mt-1`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ALL REPORTS */}
      {(subTab === '2-reports' || subTab === '8-abuse' || subTab === '12-live-reports' || subTab === '13-host-reports' || subTab === '15-chat-reports') && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">⚠️ Master Violation Reports & Abuse Directory</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reportsList.map(rep => (
              <div key={rep.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl space-y-3 shadow-lg hover:border-rose-500 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 font-bold">{rep.id} • {rep.priority} PRIORITY</span>
                    <h5 className="font-bold text-white text-sm">{rep.category}</h5>
                    <p className="text-[10px] text-slate-400">Reporter: <strong>{rep.reporter}</strong> | Target: <strong className="text-amber-400">{rep.entity}</strong></p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[9px]">{rep.status}</span>
                </div>

                <div className="text-[10px] font-mono bg-[#0B1220] p-2.5 rounded-xl border border-[#273449] flex justify-between items-center text-slate-300">
                  <span>Evidence: {rep.evidence}</span>
                  <span className="text-slate-500">{rep.time}</span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => alert(`Warning Sent to ${rep.entity}`)} className="flex-1 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md">
                    ⚠️ Issue Warning
                  </button>
                  <button onClick={() => alert(`User/Host ${rep.entity} Banned`)} className="flex-1 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md">
                    🚫 Ban Entity
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. USER APPEALS */}
      {subTab === '10-appeals' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-3">
          <h4 className="font-bold text-sm text-cyan-400">⚖️ User Ban & Suspension Appeals Queue</h4>
          <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449] space-y-2">
            <div className="flex justify-between font-bold">
              <span>Appeal #APP-901 (User_Kashif)</span>
              <span className="text-amber-400">UNDER REVIEW</span>
            </div>
            <p className="text-[11px] text-slate-300">Reason: "My account was wrongly banned during live stream PK due to false spam flag."</p>
            <div className="flex gap-2 pt-1">
              <button onClick={() => alert('Appeal Approved & Account Restored')} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                ✅ Approve & Unban
              </button>
              <button onClick={() => alert('Appeal Rejected')} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs">
                ❌ Reject Appeal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. SUPPORT TICKETS */}
      {subTab === '11-tickets' && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">🎫 Customer Support Helpdesk Tickets</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {supportTickets.map(tkt => (
              <div key={tkt.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl space-y-2 shadow-lg">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-cyan-400 font-bold">{tkt.id} • {tkt.category}</span>
                  <span className="text-emerald-400 font-bold">{tkt.status}</span>
                </div>
                <h5 className="font-bold text-white text-sm">{tkt.subject}</h5>
                <div className="text-[10px] text-slate-400">User: {tkt.user} | Agent: {tkt.assignedTo} | CSAT: {tkt.csat}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 20. MODERATION AUDIT LOGS */}
      {subTab === '20-audit' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📜 Moderator Action & Resolution Audit Trail</h4>
          <div>Log #MOD-4019: Moderator_Fahad resolved Ticket TKT-401 and issued refund of 500 Coins.</div>
        </div>
      )}
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/* ══ ENTERPRISE ARTICLE MANAGEMENT & CMS PORTAL (28 SUB-MODULES HUB) ═════ */
/* ════════════════════════════════════════════════════════════════════════ */
function ArticleEnterprisePortal({ activeKey }: { activeKey?: string }) {
  const [subTab, setSubTab] = useState<string>('1-dashboard');

  // Articles Roster State
  const [articlesList, setArticlesList] = useState([
    { id: 'ART-101', title: 'Complete Host Onboarding & Cashout Guide 2026', category: 'Hosts & Earnings', views: 482000, status: 'PUBLISHED', lang: 'EN, UR, AR', rating: '4.9 ⭐', author: 'Content Lead' },
    { id: 'ART-102', title: 'How to Recharge Wallet via JazzCash, EasyPaisa & Crypto', category: 'Wallet & Recharge', views: 320000, status: 'PUBLISHED', lang: 'EN, UR', rating: '4.8 ⭐', author: 'Finance Team' },
    { id: 'ART-103', title: 'Auralive Global PK Tournament Rules & Multipliers', category: 'Events & PK', views: 195000, status: 'PENDING REVIEW', lang: 'EN', rating: '5.0 ⭐', author: 'Event Lead' },
  ]);

  const [faqsList] = useState([
    { id: 'FAQ-01', q: 'How long does host withdrawal processing take?', cat: 'Withdrawal', a: 'Host withdrawals are processed within 24 hours via bank IBAN.' },
    { id: 'FAQ-02', q: 'How to join or create a Family Guild?', cat: 'Family', a: 'Go to Family Hub in Mobile App and click Create Family.' },
  ]);

  React.useEffect(() => {
    if (!activeKey) return;
    const k = activeKey.toLowerCase();
    if (k.includes('dashboard')) setSubTab('1-dashboard');
    else if (k.includes('category') || k.includes('categories')) setSubTab('3-categories');
    else if (k.includes('sub-category')) setSubTab('4-subcategories');
    else if (k.includes('tags')) setSubTab('5-tags');
    else if (k.includes('faq')) setSubTab('6-faq');
    else if (k.includes('help-center')) setSubTab('7-help-center');
    else if (k.includes('tutorial')) setSubTab('8-tutorials');
    else if (k.includes('news')) setSubTab('9-news');
    else if (k.includes('policy') && !k.includes('privacy')) setSubTab('10-policies');
    else if (k.includes('terms')) setSubTab('11-terms');
    else if (k.includes('privacy')) setSubTab('12-privacy');
    else if (k.includes('guidelines')) setSubTab('13-guidelines');
    else if (k.includes('safety-center')) setSubTab('14-safety-center');
    else if (k.includes('featured')) setSubTab('15-featured');
    else if (k.includes('comments')) setSubTab('16-comments');
    else if (k.includes('ratings')) setSubTab('17-ratings');
    else if (k.includes('search')) setSubTab('18-search-mgmt');
    else if (k.includes('analytics')) setSubTab('19-analytics');
    else if (k.includes('approval') || k.includes('workflow')) setSubTab('20-approval-workflow');
    else if (k.includes('drafts')) setSubTab('21-drafts');
    else if (k.includes('media-library') || k.includes('media')) setSubTab('22-media-library');
    else if (k.includes('localization') || k.includes('language')) setSubTab('23-localization');
    else if (k.includes('seo')) setSubTab('24-seo');
    else if (k.includes('push')) setSubTab('25-push-notifications');
    else if (k.includes('version')) setSubTab('26-version-history');
    else if (k.includes('audit')) setSubTab('27-audit');
    else if (k.includes('settings')) setSubTab('28-settings');
    else setSubTab('2-articles');
  }, [activeKey]);

  return (
    <section className="space-y-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#273449] pb-3">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>📚 Content Management System (CMS) & Knowledge Base</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs">
              28 Sub-Modules Hub
            </span>
          </h3>
          <p className="text-xs text-[#94A3B8]">Articles, FAQs, Help Center, Guides, Legal Policies, SEO & Multi-Language Translations</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => alert('New Article Editor Opened')} className="px-3 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md">
            + Create New Article
          </button>
        </div>
      </div>

      {/* 28 SUB-MODULE TABS SCROLLER */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { key: '1-dashboard', label: '1. Dashboard' },
          { key: '2-articles', label: '2. All Articles' },
          { key: '3-categories', label: '3. Categories' },
          { key: '4-subcategories', label: '4. Sub-Categories' },
          { key: '5-tags', label: '5. Tags' },
          { key: '6-faq', label: '6. FAQs' },
          { key: '7-help-center', label: '7. Help Center' },
          { key: '8-tutorials', label: '8. Guides' },
          { key: '9-news', label: '9. Announcements' },
          { key: '10-policies', label: '10. Policies' },
          { key: '11-terms', label: '11. Terms' },
          { key: '12-privacy', label: '12. Privacy' },
          { key: '13-guidelines', label: '13. Guidelines' },
          { key: '14-safety-center', label: '14. Safety Center' },
          { key: '15-featured', label: '15. Featured' },
          { key: '16-comments', label: '16. Comments' },
          { key: '17-ratings', label: '17. Ratings' },
          { key: '18-search-mgmt', label: '18. Search Keywords' },
          { key: '19-analytics', label: '19. Analytics' },
          { key: '20-approval-workflow', label: '20. Approval Workflow' },
          { key: '21-drafts', label: '21. Drafts' },
          { key: '22-media-library', label: '22. Media CDN' },
          { key: '23-localization', label: '23. Localization' },
          { key: '24-seo', label: '24. SEO' },
          { key: '25-push-notifications', label: '25. Push Alerts' },
          { key: '26-version-history', label: '26. Version History' },
          { key: '27-audit', label: '27. Audit Log' },
          { key: '28-settings', label: '28. CMS Settings' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              subTab === t.key ? 'bg-amber-600 text-white shadow-lg' : 'bg-[#1E293B] text-[#94A3B8] border border-[#273449]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB VIEWS */}

      {/* 1. DASHBOARD */}
      {subTab === '1-dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Knowledge Articles', val: '480 Articles', color: 'text-amber-400' },
              { label: 'Published Articles', val: '420 Published', color: 'text-emerald-400' },
              { label: 'Pending Review Workflow', val: '12 Articles', color: 'text-rose-400' },
              { label: 'Total Published FAQs', val: '180 FAQs', color: 'text-cyan-400' },
              { label: 'Total Knowledge Base Views', val: '1.84M Views', color: 'text-purple-400' },
              { label: 'Average Reader CSAT', val: '4.9 / 5.0 ⭐', color: 'text-amber-300' },
              { label: 'Media CDN Uploads', val: '2,450 Files', color: 'text-indigo-400' },
              { label: 'Active Languages', val: '6 Languages', color: 'text-cyan-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold">{s.label}</span>
                <div className={`text-xl font-black ${s.color} mt-1`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ARTICLES DIRECTORY */}
      {(subTab === '2-articles' || subTab === '15-featured' || subTab === '21-drafts') && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">📚 Master Article & Content Directory</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {articlesList.map(art => (
              <div key={art.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl space-y-3 shadow-lg hover:border-amber-500 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">{art.id} • {art.category}</span>
                    <h5 className="font-bold text-white text-sm">{art.title}</h5>
                    <p className="text-[10px] text-slate-400">Author: {art.author} | Languages: <strong>{art.lang}</strong></p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[9px]">{art.status}</span>
                </div>

                <div className="text-[10px] font-mono bg-[#0B1220] p-2.5 rounded-xl border border-[#273449] flex justify-between items-center text-slate-300">
                  <span>Views: {art.views.toLocaleString()}</span>
                  <span className="text-amber-400 font-bold">{art.rating}</span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => alert(`Editing Article ${art.title}`)} className="flex-1 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md">
                    ✏️ Edit Content
                  </button>
                  <button onClick={() => alert(`Published Push Alert for ${art.title}`)} className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">
                    🔔 Push Alert
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. FAQS */}
      {subTab === '6-faq' && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">❓ Frequently Asked Questions (FAQs) Master Directory</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {faqsList.map(faq => (
              <div key={faq.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl space-y-2 shadow-lg">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-amber-400 font-bold">{faq.id} • {faq.cat}</span>
                </div>
                <h5 className="font-bold text-white text-sm">{faq.q}</h5>
                <p className="text-xs text-slate-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 20. APPROVAL WORKFLOW */}
      {subTab === '20-approval-workflow' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-3 font-mono">
          <h4 className="font-bold text-sm text-cyan-400">📝 Content Approval & Publishing Workflow Pipeline</h4>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449]">1. Writer Draft</div>
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449] text-amber-400">2. Editor Review</div>
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449] text-purple-400">3. Legal Review</div>
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449] text-emerald-400 font-bold">4. Admin Published</div>
          </div>
        </div>
      )}

      {/* 27. AUDIT LOGS */}
      {subTab === '27-audit' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📜 CMS Content & Article Audit Trail</h4>
          <div>Log #CMS-9018: Editor_Amina updated Terms & Conditions (Version 2.4 Published).</div>
        </div>
      )}
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/* ══ ENTERPRISE SMS & MESSAGING INFRASTRUCTURE PORTAL (20 SUB-MODULES) ═══ */
/* ════════════════════════════════════════════════════════════════════════ */
function SmsEnterprisePortal({ activeKey }: { activeKey?: string }) {
  const [subTab, setSubTab] = useState<string>('1-dashboard');

  // SMS Providers State
  const [providersList, setProvidersList] = useState([
    { id: 'PRV-101', name: 'Twilio SMS API', senderId: 'AURALIVE', cost: '$0.012 / SMS', status: 'PRIMARY ACTIVE', successRate: '99.4%', health: 'HEALTHY' },
    { id: 'PRV-102', name: 'Vonage (Nexmo)', senderId: 'AURA_OTP', cost: '$0.010 / SMS', status: 'FAILOVER READY', successRate: '98.8%', health: 'HEALTHY' },
    { id: 'PRV-103', name: 'AWS SNS Gateway', senderId: 'AURA_ALERT', cost: '$0.008 / SMS', status: 'SECONDARY', successRate: '99.1%', health: 'HEALTHY' },
    { id: 'PRV-104', name: 'Infobip Global', senderId: 'AURA_NEWS', cost: '$0.015 / SMS', status: 'ACTIVE', successRate: '99.6%', health: 'HEALTHY' },
  ]);

  const [queueList] = useState([
    { id: 'QUE-901', type: 'LOGIN OTP', phone: '+92300****182', provider: 'Twilio', priority: 'CRITICAL', status: 'DELIVERED', time: '1s ago' },
    { id: 'QUE-902', type: 'RECHARGE ALERT', phone: '+92312****904', provider: 'Twilio', priority: 'HIGH', status: 'DELIVERED', time: '5s ago' },
    { id: 'QUE-903', type: 'MARKETING PROMO', phone: '+97150****881', provider: 'Infobip', priority: 'MEDIUM', status: 'PROCESSING', time: '12s ago' },
  ]);

  React.useEffect(() => {
    if (!activeKey) return;
    const k = activeKey.toLowerCase();
    if (k.includes('dashboard')) setSubTab('1-dashboard');
    else if (k.includes('providers') || k.includes('provider')) setSubTab('3-providers');
    else if (k.includes('templates') || k.includes('template')) setSubTab('4-templates');
    else if (k.includes('otp')) setSubTab('5-otp');
    else if (k.includes('system-message')) setSubTab('6-system-messages');
    else if (k.includes('business-queue')) setSubTab('7-business-queue');
    else if (k.includes('marketing-sms') || k.includes('campaign')) setSubTab('8-marketing');
    else if (k.includes('bulk-sms')) setSubTab('9-bulk-sms');
    else if (k.includes('scheduled-sms')) setSubTab('10-scheduled-sms');
    else if (k.includes('delivery-reports')) setSubTab('11-delivery-reports');
    else if (k.includes('failed-sms')) setSubTab('12-failed-queue');
    else if (k.includes('retry-queue')) setSubTab('13-retry-queue');
    else if (k.includes('blacklist')) setSubTab('14-blacklist');
    else if (k.includes('country-rules')) setSubTab('15-country-rules');
    else if (k.includes('analytics')) setSubTab('16-analytics');
    else if (k.includes('cost')) setSubTab('17-cost');
    else if (k.includes('notification')) setSubTab('18-notifications');
    else if (k.includes('audit')) setSubTab('19-audit');
    else if (k.includes('settings')) setSubTab('20-settings');
    else setSubTab('2-interface-list');
  }, [activeKey]);

  return (
    <section className="space-y-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#273449] pb-3">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>📱 SMS & Messaging Infrastructure Engine</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
              20 Sub-Modules Telecom Hub
            </span>
          </h3>
          <p className="text-xs text-[#94A3B8]">Multi-Provider Gateways (Twilio/AWS/Vonage), OTP Engine, Failover Routing & Cost Telemetry</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => alert('Broadcast Bulk SMS Modal Opened')} className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md">
            + Send Bulk SMS
          </button>
        </div>
      </div>

      {/* 20 SUB-MODULE TABS SCROLLER */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { key: '1-dashboard', label: '1. Dashboard' },
          { key: '2-interface-list', label: '2. Interface List' },
          { key: '3-providers', label: '3. SMS Gateways' },
          { key: '4-templates', label: '4. SMS Templates' },
          { key: '5-otp', label: '5. OTP Engine' },
          { key: '6-system-messages', label: '6. System Messages' },
          { key: '7-business-queue', label: '7. Priority Queue' },
          { key: '8-marketing', label: '8. Marketing Campaigns' },
          { key: '9-bulk-sms', label: '9. Bulk SMS' },
          { key: '10-scheduled-sms', label: '10. Scheduled SMS' },
          { key: '11-delivery-reports', label: '11. Delivery Reports' },
          { key: '12-failed-queue', label: '12. Failed Queue' },
          { key: '13-retry-queue', label: '13. Failover Retry' },
          { key: '14-blacklist', label: '14. Blacklist DND' },
          { key: '15-country-rules', label: '15. Country Rules' },
          { key: '16-analytics', label: '16. Analytics' },
          { key: '17-cost', label: '17. Cost Management' },
          { key: '18-notifications', label: '18. Multi-Channel' },
          { key: '19-audit', label: '19. Audit Logs' },
          { key: '20-settings', label: '20. Gateway Settings' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              subTab === t.key ? 'bg-emerald-600 text-white shadow-lg' : 'bg-[#1E293B] text-[#94A3B8] border border-[#273449]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB VIEWS */}

      {/* 1. DASHBOARD */}
      {subTab === '1-dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total SMS Dispatched', val: '1,280,000 SMS', color: 'text-emerald-400' },
              { label: 'Today Dispatched SMS', val: '42,500 SMS', color: 'text-cyan-400' },
              { label: 'OTP Verification Share', val: '65% (832K)', color: 'text-amber-400' },
              { label: 'Delivery Success Rate', val: '99.2% Delivered', color: 'text-emerald-400' },
              { label: 'Failed SMS Queue', val: '0.8% (340 Failed)', color: 'text-rose-400' },
              { label: 'Active SMS Providers', val: '4 Gateways', color: 'text-purple-400' },
              { label: 'Monthly Telecom Spend', val: '$14,200 USD', color: 'text-indigo-400' },
              { label: 'Failover Switch Status', val: 'AUTOMATIC READY', color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold">{s.label}</span>
                <div className={`text-xl font-black ${s.color} mt-1`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SMS GATEWAYS */}
      {(subTab === '2-interface-list' || subTab === '3-providers') && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">📡 Supported SMS Telecom Providers & Gateways</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {providersList.map(prv => (
              <div key={prv.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl space-y-3 shadow-lg hover:border-emerald-500 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{prv.id} • {prv.senderId}</span>
                    <h5 className="font-bold text-white text-sm">{prv.name}</h5>
                    <p className="text-[10px] text-slate-400">Cost: <strong className="text-amber-400">{prv.cost}</strong> | Success: <strong>{prv.successRate}</strong></p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[9px]">{prv.status}</span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => alert(`API Connection Tested for ${prv.name}`)} className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md">
                    ⚡ Test API Connection
                  </button>
                  <button onClick={() => alert(`Switched to Provider ${prv.name}`)} className="px-3 py-2 rounded-xl bg-[#1E293B] text-slate-300 font-bold text-xs">
                    🔄 Set Primary
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. OTP ENGINE */}
      {subTab === '5-otp' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-3">
          <h4 className="font-bold text-sm text-cyan-400">🔐 OTP Generation & Verification Engine Settings</h4>
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449]">OTP Length: <strong className="text-emerald-400">6 Digits</strong></div>
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449]">Expiry Time: <strong className="text-amber-400">5 Mins</strong></div>
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449]">Resend Limit: <strong className="text-purple-400">60 Seconds</strong></div>
          </div>
        </div>
      )}

      {/* 7. BUSINESS QUEUE */}
      {subTab === '7-business-queue' && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">📥 Real-Time SMS Priority Queue Stream</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {queueList.map(que => (
              <div key={que.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl space-y-2 shadow-lg">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-emerald-400 font-bold">{que.id} • {que.type}</span>
                  <span className="text-cyan-400 font-bold">{que.status}</span>
                </div>
                <div className="font-bold text-white text-sm">Recipient: {que.phone}</div>
                <div className="text-[10px] text-slate-400">Gateway: {que.provider} | Priority: {que.priority} • {que.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 19. AUDIT LOGS */}
      {subTab === '19-audit' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📜 Telecom SMS & Provider Audit Trail</h4>
          <div>Log #SMS-9081: System executed automatic failover retry from Twilio to AWS SNS for +92300****182.</div>
        </div>
      )}
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/* ══ ENTERPRISE PLUGIN MANAGEMENT PORTAL (24 SUB-MODULES FRAMEWORK) ══════ */
/* ════════════════════════════════════════════════════════════════════════ */
function PluginEnterprisePortal({ activeKey }: { activeKey?: string }) {
  const [subTab, setSubTab] = useState<string>('1-dashboard');

  // Installed Plugins Roster State
  const [pluginsList, setPluginsList] = useState([
    { id: 'PLG-101', name: 'Agora RTC Streaming Engine', category: 'Streaming', version: 'v4.8.2', status: 'ACTIVE', cpu: '0.4%', memory: '42MB', author: 'Agora Inc' },
    { id: 'PLG-102', name: 'TulasiGame Mini-Games Engine (RTP 96.5%)', category: 'Games', version: 'v2.1.0', status: 'ACTIVE', cpu: '0.8%', memory: '68MB', author: 'Auralive Games' },
    { id: 'PLG-103', name: 'Firebase FCM Push Notifications', category: 'Notification', version: 'v12.4.0', status: 'ACTIVE', cpu: '0.1%', memory: '14MB', author: 'Google LLC' },
    { id: 'PLG-104', name: 'AI Translation & Live Speech Subtitles', category: 'AI', version: 'v1.9.4', status: 'ACTIVE', cpu: '0.6%', memory: '52MB', author: 'DeepMind AI' },
  ]);

  React.useEffect(() => {
    if (!activeKey) return;
    const k = activeKey.toLowerCase();
    if (k.includes('dashboard')) setSubTab('1-dashboard');
    else if (k.includes('configuration') || k.includes('config')) setSubTab('2-configuration');
    else if (k.includes('marketplace')) setSubTab('3-marketplace');
    else if (k.includes('categories') || k.includes('category')) setSubTab('5-categories');
    else if (k.includes('tulasigame') || k.includes('game')) setSubTab('6-games');
    else if (k.includes('payment')) setSubTab('7-payment');
    else if (k.includes('social')) setSubTab('8-social');
    else if (k.includes('notification')) setSubTab('9-notification');
    else if (k.includes('ai-plugin') || k.includes('ai')) setSubTab('10-ai');
    else if (k.includes('analytics')) setSubTab('11-analytics');
    else if (k.includes('storage')) setSubTab('12-storage');
    else if (k.includes('streaming')) setSubTab('13-streaming');
    else if (k.includes('security')) setSubTab('14-security');
    else if (k.includes('third-party') || k.includes('api')) setSubTab('15-third-party-api');
    else if (k.includes('dependencies')) setSubTab('16-dependencies');
    else if (k.includes('permissions')) setSubTab('17-permissions');
    else if (k.includes('scheduler')) setSubTab('18-scheduler');
    else if (k.includes('logs')) setSubTab('19-logs');
    else if (k.includes('health') || k.includes('monitor')) setSubTab('20-health-monitor');
    else if (k.includes('version')) setSubTab('21-version-manager');
    else if (k.includes('backup') || k.includes('restore')) setSubTab('22-backup-restore');
    else if (k.includes('audit')) setSubTab('23-audit');
    else if (k.includes('settings')) setSubTab('24-settings');
    else setSubTab('4-installed');
  }, [activeKey]);

  return (
    <section className="space-y-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#273449] pb-3">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>🧩 Enterprise Plugin Management & Modular Extension Framework</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs">
              24 Sub-Modules Architecture
            </span>
          </h3>
          <p className="text-xs text-[#94A3B8]">Independent Extension Services, TulasiGame Engine, Agora RTC, AI Moderation & Dependency Monitor</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => alert('Plugin Marketplace Opened')} className="px-3 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md">
            + Install from Marketplace
          </button>
        </div>
      </div>

      {/* 24 SUB-MODULE TABS SCROLLER */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { key: '1-dashboard', label: '1. Dashboard' },
          { key: '2-configuration', label: '2. Config' },
          { key: '3-marketplace', label: '3. Marketplace' },
          { key: '4-installed', label: '4. Installed Plugins' },
          { key: '5-categories', label: '5. Categories' },
          { key: '6-games', label: '6. TulasiGame' },
          { key: '7-payment', label: '7. Payments' },
          { key: '8-social', label: '8. Social Auth' },
          { key: '9-notification', label: '9. Notifications' },
          { key: '10-ai', label: '10. AI Services' },
          { key: '11-analytics', label: '11. Analytics' },
          { key: '12-storage', label: '12. Storage' },
          { key: '13-streaming', label: '13. Streaming RTC' },
          { key: '14-security', label: '14. Security' },
          { key: '15-third-party-api', label: '15. 3rd-Party APIs' },
          { key: '16-dependencies', label: '16. Dependencies' },
          { key: '17-permissions', label: '17. Permissions' },
          { key: '18-scheduler', label: '18. Scheduler' },
          { key: '19-logs', label: '19. Logs' },
          { key: '20-health-monitor', label: '20. Health Monitor' },
          { key: '21-version-manager', label: '21. Version Manager' },
          { key: '22-backup-restore', label: '22. Backup/Restore' },
          { key: '23-audit', label: '23. Audit Trail' },
          { key: '24-settings', label: '24. Settings' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              subTab === t.key ? 'bg-purple-600 text-white shadow-lg' : 'bg-[#1E293B] text-[#94A3B8] border border-[#273449]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB VIEWS */}

      {/* 1. DASHBOARD */}
      {subTab === '1-dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Framework Plugins', val: '48 Plugins', color: 'text-purple-400' },
              { label: 'Active Running Plugins', val: '38 Active', color: 'text-emerald-400' },
              { label: 'Disabled Extensions', val: '4 Disabled', color: 'text-[#94A3B8]' },
              { label: 'Updates Available', val: '3 Updates', color: 'text-amber-400' },
              { label: 'Total CPU Resource Usage', val: '1.4% (Healthy)', color: 'text-cyan-400' },
              { label: 'RAM Memory Allocation', val: '124 MB', color: 'text-indigo-400' },
              { label: 'API Throughput Rate', val: '142.5K / min', color: 'text-purple-400' },
              { label: 'Plugin Error Rate', val: '0.01% (Normal)', color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-semibold">{s.label}</span>
                <div className={`text-xl font-black ${s.color} mt-1`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INSTALLED PLUGINS */}
      {(subTab === '4-installed' || subTab === '3-marketplace') && (
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">🧩 Installed Modular Extension Framework Roster</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pluginsList.map(plg => (
              <div key={plg.id} className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl space-y-3 shadow-lg hover:border-purple-500 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold">{plg.id} • {plg.category}</span>
                    <h5 className="font-bold text-white text-sm">{plg.name}</h5>
                    <p className="text-[10px] text-slate-400">Author: {plg.author} | Version: <strong>{plg.version}</strong></p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[9px]">{plg.status}</span>
                </div>

                <div className="text-[10px] font-mono bg-[#0B1220] p-2.5 rounded-xl border border-[#273449] flex justify-between items-center text-slate-300">
                  <span>CPU: {plg.cpu}</span>
                  <span>RAM: {plg.memory}</span>
                  <span className="text-emerald-400 font-bold">HEALTHY</span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => alert(`Configured ${plg.name}`)} className="flex-1 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md">
                    ⚙️ Configure Plugin
                  </button>
                  <button onClick={() => alert(`Restarted ${plg.name}`)} className="px-3 py-2 rounded-xl bg-[#1E293B] text-slate-300 font-bold text-xs">
                    🔄 Restart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TULASIGAME & MINI-GAMES */}
      {subTab === '6-games' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-3">
          <h4 className="font-bold text-sm text-amber-400">🎰 TulasiGame & In-Room Mini-Games Plugin Engine</h4>
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449]">Game RTP: <strong className="text-emerald-400">96.5%</strong></div>
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449]">Anti-Cheat: <strong className="text-purple-400">ENABLED</strong></div>
            <div className="bg-[#0B1220] p-3 rounded-xl border border-[#273449]">Matchmaking: <strong className="text-cyan-400">AUTO 60s</strong></div>
          </div>
        </div>
      )}

      {/* 16. DEPENDENCIES */}
      {subTab === '16-dependencies' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm text-cyan-400">🔗 Extension Dependency & Conflict Visualizer</h4>
          <div>Agora RTC Engine ➔ Depends On Redis ➔ Media Relay Server ➔ AWS S3 Storage</div>
        </div>
      )}

      {/* 23. AUDIT LOGS */}
      {subTab === '23-audit' && (
        <div className="bg-[#131C2E] border border-[#273449] p-4 rounded-2xl text-xs text-white space-y-2 font-mono">
          <h4 className="font-bold text-sm">📜 Plugin Installation & Configuration Audit Trail</h4>
          <div>Log #PLG-9041: Admin enabled TulasiGame Plugin v2.1.0 with 96.5% RTP settings.</div>
        </div>
      )}
    </section>
  );
}





