import React from 'react';

export const metadata = {
  title: 'Aura Live Admin Dashboard',
  description: 'Management & Moderation Panel for Aura Live Voice Room',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: '#0b0c10', color: '#c5c6c7', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <aside style={{ width: '260px', backgroundColor: '#1f2833', padding: '24px', borderRight: '1px solid #45a29e' }}>
            <h2 style={{ color: '#66fcf1', fontSize: '20px', marginBottom: '32px' }}>🎙️ Aura Admin</h2>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>📊 Dashboard</a>
              <a href="/users" style={{ color: '#c5c6c7', textDecoration: 'none' }}>👥 User Management</a>
              <a href="/live" style={{ color: '#c5c6c7', textDecoration: 'none' }}>📻 Active Voice Rooms</a>
              <a href="/economy" style={{ color: '#c5c6c7', textDecoration: 'none' }}>💰 Economy & Gifts</a>
              <a href="/agency" style={{ color: '#c5c6c7', textDecoration: 'none' }}>🏢 Agency System</a>
              <a href="/reports" style={{ color: '#c5c6c7', textDecoration: 'none' }}>🚨 Moderation & Reports</a>
            </nav>
          </aside>

          {/* Main Content */}
          <main style={{ flex: 1, padding: '32px' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
