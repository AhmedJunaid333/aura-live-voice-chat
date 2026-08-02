import React from 'react';

export default function DashboardPage() {
  const stats = [
    { title: 'Total Users', value: '124,580', change: '+12.4% this week' },
    { title: 'Active Live Rooms', value: '342', change: 'Live Right Now' },
    { title: 'Daily Coin Volume', value: '4,850,000', change: '$48,500 USD' },
    { title: 'Pending Withdrawals', value: '18', change: 'Requires Approval' },
  ];

  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: '28px', marginBottom: '8px' }}>Dashboard Overview</h1>
      <p style={{ color: '#8892b0', marginBottom: '32px' }}>Real-time telemetry and metrics for Aura Live Voice Room.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ backgroundColor: '#1f2833', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
            <div style={{ color: '#8892b0', fontSize: '14px', marginBottom: '8px' }}>{stat.title}</div>
            <div style={{ color: '#66fcf1', fontSize: '26px', fontWeight: 'bold', marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ color: '#45a29e', fontSize: '12px' }}>{stat.change}</div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#1f2833', padding: '24px', borderRadius: '12px', border: '1px solid #333' }}>
        <h3 style={{ color: '#fff', marginTop: 0 }}>System Health & Telemetry</h3>
        <p style={{ color: '#8892b0' }}>
          RTC Voice Engine Gateway: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>HEALTHY (Agora & LiveKit Active)</span>
        </p>
        <p style={{ color: '#8892b0' }}>
          Redis Cluster Latency: <span style={{ color: '#00ff88', fontWeight: 'bold' }}>1.2 ms</span>
        </p>
      </div>
    </div>
  );
}
