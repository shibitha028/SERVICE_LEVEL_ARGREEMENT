import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getSummary, getTierBreakdown, getBreachTrend } from '../api';
import PageHeader from '../components/common/PageHeader';

const KPICard = ({ label, value, delta, icon, color = '#2563EB' }) => (
  <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', right: 16, top: 16, fontSize: 22, opacity: 0.3 }}>{icon}</div>
    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(160,185,220,0.5)', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 10 }}>{label}</div>
    <div style={{ fontSize: 30, fontWeight: 600, color: '#F0F6FF', marginBottom: 4 }}>{value ?? '—'}</div>
    <div style={{ fontSize: 12, color }}>{delta}</div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(12,22,48,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#C3DAFE' }}>
      <div style={{ marginBottom: 4, color: '#F0F6FF' }}>{label}</div>
      {payload.map((p, i) => <div key={i}>{p.name}: <strong>{p.value}</strong></div>)}
    </div>
  );
};

export default function DashboardPage() {
  const [summary, setSummary]   = useState(null);
  const [tierData, setTierData] = useState([]);
  const [trend, setTrend]       = useState([]);

  useEffect(() => {
    getSummary().then(r => setSummary(r.data)).catch(() => {});
    getTierBreakdown().then(r => setTierData(r.data)).catch(() => {});
    getBreachTrend().then(r => {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      setTrend(r.data.map(d => ({ name: months[d._id.month - 1], breaches: d.count, penalty: d.penalty })));
    }).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard Overview" sub="Welcome back — here's what's happening today" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <KPICard label="Total Contracts" value={summary?.totalContracts} delta="↑ 12 this month" icon="📋" color="var(--green)" />
        <KPICard label="Approved"        value={summary?.approved}       delta={`${summary ? Math.round(summary.approved / summary.totalContracts * 100) : 0}% rate`} icon="✅" color="var(--green)" />
        <KPICard label="Rejected"        value={summary?.rejected}       delta="↑ 2 this month" icon="❌" color="var(--red)" />
        <KPICard label="Breach Alerts"   value={summary?.totalBreaches}  delta="Needs attention" icon="🚨" color="var(--amber)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginBottom: 22 }}>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F6FF', marginBottom: 16 }}>📊 Monthly Breach Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={trend.length ? trend : [{ name:'Jan',breaches:3 },{ name:'Feb',breaches:7 },{ name:'Mar',breaches:4 },{ name:'Apr',breaches:9 },{ name:'May',breaches:5 },{ name:'Jun',breaches:6 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(160,185,220,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(160,185,220,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="breaches" fill="#2563EB" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F6FF', marginBottom: 16 }}>🏆 Service Tier Summary</div>
          {(tierData.length ? tierData : [
            { _id: 'Gold', total: 42, approved: 38 },
            { _id: 'Silver', total: 67, approved: 52 },
            { _id: 'Bronze', total: 39, approved: 14 },
          ]).map(t => (
            <div key={t._id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                <span style={{ color: 'rgba(200,215,240,0.75)' }}>{t._id === 'Gold' ? '🥇' : t._id === 'Silver' ? '🥈' : '🥉'} {t._id}</span>
                <span style={{ fontWeight: 600, color: t._id === 'Gold' ? '#FCD34D' : t._id === 'Silver' ? '#CBD5E1' : '#FEA862' }}>
                  {t.total} contracts
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ height: '100%', width: `${t.total ? Math.round(t.approved / t.total * 100) : 0}%`, borderRadius: 3, background: t._id === 'Gold' ? '#F59E0B' : t._id === 'Silver' ? '#94A3B8' : '#B45309' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F6FF', marginBottom: 16 }}>📈 SLA Response Time Trend</div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={[{n:'Jan',ms:420},{n:'Feb',ms:380},{n:'Mar',ms:460},{n:'Apr',ms:310},{n:'May',ms:340},{n:'Jun',ms:280},{n:'Jul',ms:300}]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="n" tick={{ fill: 'rgba(160,185,220,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(160,185,220,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="ms" name="Response (ms)" stroke="#4A90D9" strokeWidth={2} dot={{ fill: '#60A5FA', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
