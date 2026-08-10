'use client';

import React, { useState } from 'react';

export default function MomentsExploreModule() {
  const [posts, setPosts] = useState([
    { id: 'POST-401', user: 'Dimple (UID: 100003)', content: 'Live streaming right now in Audio Lounge 🎤 Come say hi! ✨', likes: 142, comments: 28, date: '2026-08-10 21:00', status: 'APPROVED' },
    { id: 'POST-402', user: 'Ahmed Khokhar (UID: 100001)', content: 'Aura Live Reseller Official Announcement 💎 Instant transfer active!', likes: 350, comments: 45, date: '2026-08-10 18:30', status: 'APPROVED' },
    { id: 'POST-403', user: 'Ayesha_Singer (UID: 100002)', content: 'New acoustic song cover releasing tonight! 🎵', likes: 89, comments: 12, date: '2026-08-10 16:15', status: 'APPROVED' },
  ]);

  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    alert(`Post ${id} removed from public feed!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-cyan-900/30 to-blue-900/40 border border-emerald-500/30 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-black text-white">📸 Moments Feed & Explore Discovery Feed Moderation</h2>
        <p className="text-xs text-slate-300 mt-1">Inspect user-published moments, posts, images, likes telemetry and moderate public feed content</p>
      </div>

      {/* Posts Table */}
      <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-base font-black text-emerald-400 flex items-center gap-2">
          🖼️ User-Published Moments Stream Feed
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3">Post ID</th>
                <th className="pb-3">Author User</th>
                <th className="pb-3">Post Text / Content</th>
                <th className="pb-3">Engagement (Likes / Comments)</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {posts.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-emerald-400">{p.id}</td>
                  <td className="font-bold text-white">{p.user}</td>
                  <td className="text-slate-300 max-w-xs truncate">{p.content}</td>
                  <td className="text-purple-300">❤️ {p.likes} • 💬 {p.comments}</td>
                  <td className="text-slate-400">{p.date}</td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeletePost(p.id)}
                      className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[10px] border border-rose-500/40 transition cursor-pointer"
                    >
                      🗑️ Delete Post
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
