import React from 'react';

export default function ActiveRoomsPage() {
  const rooms = [
    { id: 'room-301', title: '🎵 Middle East Singing Lounge', host: 'Sara Voicemaster', listeners: 142, seats: '8/8', pkStatus: 'LIVE PK vs Room #102' },
    { id: 'room-302', title: '🔥 Urdu Shayari & Late Night Chat', host: 'Zaid Khan', listeners: 98, seats: '6/8', pkStatus: 'NORMAL' },
    { id: 'room-303', title: '💎 VIP Givers Club', host: 'Alex Star', listeners: 215, seats: '8/8', pkStatus: 'NORMAL' },
  ];

  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: '28px', marginBottom: '8px' }}>Active Live Voice Rooms</h1>
      <p style={{ color: '#8892b0', marginBottom: '24px' }}>Monitor live audio streams, seat assignments, and ongoing PK Battles.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {rooms.map((r, i) => (
          <div key={i} style={{ backgroundColor: '#1f2833', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#66fcf1', marginTop: 0, fontSize: '18px' }}>{r.title}</h3>
            <p style={{ color: '#8892b0', fontSize: '14px', marginBottom: '6px' }}>Host: <strong style={{ color: '#fff' }}>{r.host}</strong></p>
            <p style={{ color: '#8892b0', fontSize: '14px', marginBottom: '6px' }}>Listeners: <strong style={{ color: '#00ff88' }}>{r.listeners}</strong></p>
            <p style={{ color: '#8892b0', fontSize: '14px', marginBottom: '12px' }}>Seats Occupied: <strong style={{ color: '#fff' }}>{r.seats}</strong></p>
            <div style={{ padding: '8px 12px', backgroundColor: '#0b0c10', borderRadius: '6px', color: '#ffbd59', fontSize: '13px', marginBottom: '16px' }}>{r.pkStatus}</div>
            <button style={{ width: '100%', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Close Room</button>
          </div>
        ))}
      </div>
    </div>
  );
}
