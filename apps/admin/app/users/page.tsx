import React from 'react';

export default function UserManagementPage() {
  const users = [
    { id: 'u-101', name: 'Alex Star', role: 'SUPER_ADMIN', country: 'US', status: 'ACTIVE', coins: '150,000' },
    { id: 'u-102', name: 'Zaid Khan', role: 'COUNTRY_MANAGER', country: 'PK', status: 'ACTIVE', coins: '85,000' },
    { id: 'u-103', name: 'Sara Voicemaster', role: 'OPERATIONS_MANAGER', country: 'AE', status: 'ACTIVE', coins: '42,000' },
    { id: 'u-104', name: 'ToxicUser99', role: 'USER', country: 'UK', status: 'BANNED', coins: '0' },
  ];

  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: '28px', marginBottom: '8px' }}>User & RBAC Management</h1>
      <p style={{ color: '#8892b0', marginBottom: '24px' }}>Manage user permissions, admin role matrix, and account status.</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1f2833', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#0b0c10', color: '#66fcf1', textAlign: 'left' }}>
            <th style={{ padding: '16px' }}>User ID</th>
            <th style={{ padding: '16px' }}>Name</th>
            <th style={{ padding: '16px' }}>Role</th>
            <th style={{ padding: '16px' }}>Country</th>
            <th style={{ padding: '16px' }}>Coin Balance</th>
            <th style={{ padding: '16px' }}>Status</th>
            <th style={{ padding: '16px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #333', color: '#c5c6c7' }}>
              <td style={{ padding: '16px' }}>{u.id}</td>
              <td style={{ padding: '16px', fontWeight: 600 }}>{u.name}</td>
              <td style={{ padding: '16px', color: '#66fcf1' }}>{u.role}</td>
              <td style={{ padding: '16px' }}>{u.country}</td>
              <td style={{ padding: '16px' }}>{u.coins}</td>
              <td style={{ padding: '16px', color: u.status === 'ACTIVE' ? '#00ff88' : '#ff4d4d' }}>{u.status}</td>
              <td style={{ padding: '16px' }}>
                <button style={{ backgroundColor: '#45a29e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Edit Role</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
