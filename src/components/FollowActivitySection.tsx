import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

interface FollowActivity {
  type: string;
  details: string;
  timestamp: string;
}

interface FollowStats {
  totalFollows: number;
  totalVisits: number;
  totalNotifications: number;
}

export function FollowActivitySection() {
  const [activities, setActivities] = useState<FollowActivity[]>([]);
  const [stats, setStats] = useState<FollowStats>({ totalFollows: 0, totalVisits: 0, totalNotifications: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      // In production, this would query the admin API
      // For now, stats are populated from Socket.IO admin.activity events
      setStats({ totalFollows: 0, totalVisits: 0, totalNotifications: 0 });
    } catch (err) {
      console.error('Failed to fetch follow stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Listen for real-time admin.activity events from Socket.IO
    const handleActivity = (data: FollowActivity) => {
      setActivities(prev => [data, ...prev].slice(0, 100));
      setStats(prev => ({
        ...prev,
        totalFollows: prev.totalFollows + (data.type === 'USER_FOLLOW' ? 1 : 0),
        totalVisits: prev.totalVisits + (data.type === 'PROFILE_VISIT' ? 1 : 0),
      }));
    };

    // If socket is available globally
    if ((window as any).__auraAdminSocket) {
      (window as any).__auraAdminSocket.on('admin.activity', handleActivity);
    }

    return () => {
      if ((window as any).__auraAdminSocket) {
        (window as any).__auraAdminSocket.off('admin.activity', handleActivity);
      }
    };
  }, [fetchStats]);

  const filteredActivities = activities.filter(a =>
    searchQuery === '' || a.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'USER_FOLLOW': return '👥';
      case 'USER_UNFOLLOW': return '💔';
      case 'PROFILE_VISIT': return '👁️';
      default: return '📌';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'USER_FOLLOW': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'USER_UNFOLLOW': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'PROFILE_VISIT': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            👥 Follow, Fans & Visitors Activity
          </h2>
          <p className="text-slate-400 mt-1">
            Real-time monitoring of follow relationships, profile visits, and notifications
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/10 border border-emerald-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl">👥</div>
            <div>
              <p className="text-emerald-400 text-sm font-medium">Total Follows (Session)</p>
              <p className="text-white text-2xl font-bold">{stats.totalFollows}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/10 border border-blue-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">👁️</div>
            <div>
              <p className="text-blue-400 text-sm font-medium">Profile Visits (Session)</p>
              <p className="text-white text-2xl font-bold">{stats.totalVisits}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/10 border border-purple-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">🔔</div>
            <div>
              <p className="text-purple-400 text-sm font-medium">Notifications Sent</p>
              <p className="text-white text-2xl font-bold">{stats.totalNotifications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search activity by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800/60 border border-slate-600/50 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
        />
        <span className="absolute left-3 top-3.5 text-slate-400">🔍</span>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live Activity Feed
          </h3>
          <span className="text-slate-400 text-sm">{filteredActivities.length} events</span>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 text-lg">No activity yet</p>
            <p className="text-slate-600 text-sm mt-1">Follow and visit events will appear here in real-time</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30 max-h-[500px] overflow-y-auto">
            {filteredActivities.map((activity, idx) => (
              <div key={idx} className="px-5 py-3 hover:bg-slate-700/20 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.details}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getActivityColor(activity.type)}`}>
                    {activity.type.replace('USER_', '').replace('PROFILE_', '')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
