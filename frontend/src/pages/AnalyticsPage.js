import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { getSummary, getTierBreakdown, getBreachTrend } from '../api';
import PageHeader from '../components/common/PageHeader';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(12,22,48,0.96)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#C3DAFE' }}>
      <div style={{ marginBottom: 4, color: '#F0F6FF' }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></div>)}
    </div>
  );
};

const StatPill = ({ label, value, color }) => (
  <div style={{ background: `rgba(${color},0.08)`, border: `1px solid rgba(${color},0.2)`, borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
    <div style={{ fontSize: 22, fontWeight: 600, color: `rgb(${color})`, marginBottom: 2 }}>{value}</div>
    <div style={{ fontSize: 11, color: `rgba(${color},0.7)`, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</div>
  </div>
);

export default function AnalyticsPage() {
  const [summary, setSummary]   = useState(null);
  const [tierData, setTierData] = useState([]);
  const [trend, setTrend]       = useState([]);

  useEffect(() => {
    getSummary().then(r => setSummary(r.data)).catch(() => {});
    getTierBreakdown().then(r => {
      setTierData(r.data.map(d => ({ name: d._id, total: d.total, approved: d.approved, rejected: d.rejected, pending: d.pending })));
    }).catch(() => {});
    getBreachTrend().then(r => {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      setTrend(r.data.map(d => ({ name: months[d._id.month - 1], breaches: d.count, penalty: d.penalty })));
    }).catch(() => {});
  }, []);

  const fallbackTier = [{ name:'Gold',total:42,approved:38,rejected:2,pending:2 }, { name:'Silver',total:67,approved:52,rejected:9,pending:6 }, { name:'Bronze',total:39,approved:14,rejected:7,pending:18 }];
  const fallbackTrend = [{name:'Jan',breaches:3,penalty:3000},{name:'Feb',breaches:7,penalty:7000},{name:'Mar',breaches:4,penalty:4000},{name:'Apr',breaches:9,penalty:9000},{name:'May',breaches:5,penalty:5000},{name:'Jun',breaches:6,penalty:6000}];

  return (
    <div>
      <PageHeader title="Analytics & Reports" sub="Track SLA performance and compliance metrics" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        <StatPill label="Total Contracts" value={summary?.totalContracts ?? 148} color="59,130,246" />
        <StatPill label="Approved"        value={summary?.approved ?? 104}       color="16,185,129" />
        <StatPill label="Rejected"        value={summary?.rejected ?? 18}        color="239,68,68" />
        <StatPill label="Total Breaches"  value={summary?.totalBreaches ?? 23}   color="245,158,11" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, marginBottom: 22 }}>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F6FF', marginBottom: 16 }}>📊 Breaches & Penalty Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={trend.length ? trend : fallbackTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(160,185,220,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: 'rgba(160,185,220,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(160,185,220,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(160,185,220,0.7)' }} />
              <Bar yAxisId="left" dataKey="breaches" name="Breaches" fill="#2563EB" radius={[4,4,0,0]} />
              <Bar yAxisId="right" dataKey="penalty" name="Penalty ($)" fill="#F59E0B" radius={[4,4,0,0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F6FF', marginBottom: 16 }}>🏆 Tier Distribution</div>
          {(tierData.length ? tierData : fallbackTier).map(t => {
            const pct = t.total ? Math.round(t.approved / t.total * 100) : 0;
            const color = t.name === 'Gold' ? '#F59E0B' : t.name === 'Silver' ? '#94A3B8' : '#B45309';
            return (
              <div key={t.name} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: 'rgba(200,215,240,.75)' }}>{t.name === 'Gold' ? '🥇' : t.name === 'Silver' ? '🥈' : '🥉'} {t.name} — {t.total} contracts</span>
                  <span style={{ fontWeight: 600, color }}>{pct}% approved</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,.06)' }}>
                  <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: color, transition: 'width .5s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F6FF', marginBottom: 16 }}>📋 Detailed Tier Breakdown</div>
        <table className="data-table">
          <thead><tr><th>Tier</th><th>Total</th><th>Approved</th><th>Rejected</th><th>Pending</th><th>Approval Rate</th></tr></thead>
          <tbody>
            {(tierData.length ? tierData : fallbackTier).map(t => (
              <tr key={t.name}>
                <td><span className={`badge badge-${t.name.toLowerCase()}`}>{t.name}</span></td>
                <td>{t.total}</td>
                <td style={{ color: 'var(--green)' }}>{t.approved}</td>
                <td style={{ color: 'var(--red)' }}>{t.rejected}</td>
                <td style={{ color: 'var(--amber)' }}>{t.pending}</td>
                <td style={{ fontWeight: 600, color: t.total && t.approved / t.total > 0.85 ? 'var(--green)' : 'var(--amber)' }}>
                  {t.total ? Math.round(t.approved / t.total * 100) : 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
