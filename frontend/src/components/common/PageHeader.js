import React from 'react';

export default function PageHeader({ title, sub, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#F0F6FF', margin: 0 }}>{title}</h1>
        {sub && <p style={{ fontSize: 13, color: 'rgba(200,215,240,.7)', marginTop: 3 }}>{sub}</p>}
      </div>
      {children && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{children}</div>}
    </div>
  );
}
