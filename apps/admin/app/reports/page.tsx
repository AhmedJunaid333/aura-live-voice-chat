import React from 'react';

export default function ModerationReportsPage() {
  const alerts = [
    { id: 'alt-901', user: 'User99', type: 'VOICE_TOXICITY', text: 'Profanity detected in room #302', riskScore: '88/100', action: 'AUTO_MUTE' },
    { id: 'alt-902', user: 'Scammer12', type: 'FRAUD_RISK', text: 'Multiple chargebacks attempted via EasyPaisa', riskScore: '94/100', action: 'ACCOUNT_SUSPENDED' },
  ];

  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: '28px', marginBottom: '8px' }}>Moderation & AI Safety Center</h1>
      <p style={{ color: '#8892b0', marginBottom: '24px' }}>Real-time voice toxicity alerts, speech-to-text transcript logs, and fraud risk monitoring.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {alerts.map((a, i) => (
          <div key={i} style={{ backgroundColor: '#1f2833', padding: '20px', borderRadius: '12px', border: '1px solid #ff4d4d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{a.type} (Risk: {a.riskScore})</div>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{a.user} - {a.text}</div>
              <div style={{ color: '#8892b0', fontSize: '13px' }}>Automated Action Triggered: <strong style={{ color: '#66fcf1' }}>{a.action}</strong></div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ backgroundColor: '#45a29e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Review Transcript</button>
              <button style={{ backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Permanent Ban</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
