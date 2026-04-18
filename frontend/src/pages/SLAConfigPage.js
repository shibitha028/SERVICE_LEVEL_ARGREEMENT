import React, { useEffect, useState } from 'react';
import { getContracts, createContract, updateContract } from '../api';
import PageHeader from '../components/common/PageHeader';

const TIERS      = ['Gold', 'Silver', 'Bronze'];
const STATUSES   = ['Pending', 'Approved', 'Rejected'];
const RESP_TIMES = [{ label: '15 minutes', value: 15 }, { label: '30 minutes', value: 30 }, { label: '1 hour', value: 60 }, { label: '4 hours', value: 240 }, { label: '24 hours', value: 1440 }];
const RES_TIMES  = [{ label: '2 hours', value: 2 }, { label: '4 hours', value: 4 }, { label: '8 hours', value: 8 }, { label: '24 hours', value: 24 }, { label: '72 hours', value: 72 }];

const tierStyle = { Gold: 'badge-gold', Silver: 'badge-silver', Bronze: 'badge-bronze' };
const statusStyle = { Approved: 'badge-approved', Rejected: 'badge-rejected', Pending: 'badge-pending' };

export default function SLAConfigPage() {
  const [contracts, setContracts] = useState([]);
  const [form, setForm]  = useState({ clientName: '', serviceTier: 'Gold', responseTimeMin: 15, resolutionTimeHr: 2, penaltyPerBreach: 500, status: 'Pending' });
  const [saving, setSaving] = useState(false);

  const load = () => getContracts().then(r => setContracts(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await createContract(form); load(); setForm({ clientName: '', serviceTier: 'Gold', responseTimeMin: 15, resolutionTimeHr: 2, penaltyPerBreach: 500, status: 'Pending' }); }
    catch (err) { alert(err.response?.data?.message || 'Failed to save contract'); }
    finally { setSaving(false); }
  };

  const changeStatus = async (id, status) => {
    await updateContract(id, { status }); load();
  };

  const fieldLabel = (text) => (
    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(160,185,220,0.6)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>{text}</label>
  );

  return (
    <div>
      <PageHeader title="SLA Configuration" sub="Create and manage SLA contracts for clients" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>

        {/* Form */}
        <form className="card" onSubmit={handleSave}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F6FF', marginBottom: 18 }}>📝 New SLA Contract</div>

          <div style={{ marginBottom: 14 }}>
            {fieldLabel('Client Name')}
            <input className="form-input-sm" placeholder="Enter client name" value={form.clientName} required onChange={e => setForm({ ...form, clientName: e.target.value })} />
          </div>

          <div style={{ marginBottom: 14 }}>
            {fieldLabel('Service Tier')}
            <div style={{ display: 'flex', gap: 8 }}>
              {TIERS.map(t => (
                <button key={t} type="button" onClick={() => setForm({ ...form, serviceTier: t })}
                  style={{ flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, transition: 'all .15s',
                    background: form.serviceTier === t ? (t === 'Gold' ? 'rgba(245,158,11,.2)' : t === 'Silver' ? 'rgba(148,163,184,.15)' : 'rgba(180,83,9,.15)') : 'rgba(255,255,255,.04)',
                    border: form.serviceTier === t ? (t === 'Gold' ? '1px solid rgba(245,158,11,.4)' : t === 'Silver' ? '1px solid rgba(148,163,184,.4)' : '1px solid rgba(180,83,9,.4)') : '1px solid rgba(255,255,255,.1)',
                    color: form.serviceTier === t ? (t === 'Gold' ? '#FCD34D' : t === 'Silver' ? '#CBD5E1' : '#FEA862') : 'rgba(200,215,240,.75)',
                  }}>
                  {t === 'Gold' ? '🥇' : t === 'Silver' ? '🥈' : '🥉'} {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              {fieldLabel('Response Time')}
              <select className="form-input-sm" value={form.responseTimeMin} onChange={e => setForm({ ...form, responseTimeMin: +e.target.value })}>
                {RESP_TIMES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              {fieldLabel('Resolution Time')}
              <select className="form-input-sm" value={form.resolutionTimeHr} onChange={e => setForm({ ...form, resolutionTimeHr: +e.target.value })}>
                {RES_TIMES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            {fieldLabel('Penalty per Breach ($)')}
            <input className="form-input-sm" type="number" min={0} placeholder="500" value={form.penaltyPerBreach} onChange={e => setForm({ ...form, penaltyPerBreach: +e.target.value })} />
          </div>

          <div style={{ marginBottom: 18 }}>
            {fieldLabel('Initial Status')}
            <div style={{ display: 'flex', gap: 8 }}>
              {STATUSES.map(s => (
                <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                  style={{ flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, transition: 'all .15s',
                    background: form.status === s ? (s === 'Approved' ? 'rgba(16,185,129,.2)' : s === 'Rejected' ? 'rgba(239,68,68,.2)' : 'rgba(139,92,246,.2)') : 'rgba(255,255,255,.04)',
                    border: form.status === s ? (s === 'Approved' ? '1px solid rgba(16,185,129,.4)' : s === 'Rejected' ? '1px solid rgba(239,68,68,.4)' : '1px solid rgba(139,92,246,.4)') : '1px solid rgba(255,255,255,.1)',
                    color: form.status === s ? (s === 'Approved' ? '#6EE7B7' : s === 'Rejected' ? '#FCA5A5' : '#C4B5FD') : 'rgba(200,215,240,.75)',
                  }}>
                  {s === 'Approved' ? '✅' : s === 'Rejected' ? '❌' : '⏳'} {s}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Contract'}
          </button>
        </form>

        {/* Existing contracts table */}
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F6FF', marginBottom: 16 }}>📋 Existing Contracts</div>
          <table className="data-table">
            <thead><tr><th>Client</th><th>Tier</th><th>Response</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {contracts.map(c => (
                <tr key={c._id}>
                  <td style={{ color: '#F0F6FF', fontWeight: 500 }}>{c.clientName}</td>
                  <td><span className={`badge ${tierStyle[c.serviceTier]}`}>{c.serviceTier}</span></td>
                  <td>{c.responseTimeMin < 60 ? `${c.responseTimeMin}m` : `${c.responseTimeMin / 60}h`}</td>
                  <td><span className={`badge ${statusStyle[c.status]}`}>{c.status}</span></td>
                  <td style={{ display: 'flex', gap: 4 }}>
                    {c.status !== 'Approved' && <button className="btn-edit" onClick={() => changeStatus(c._id, 'Approved')}>Approve</button>}
                    {c.status !== 'Rejected' && <button className="btn-edit" style={{ color: '#FCA5A5' }} onClick={() => changeStatus(c._id, 'Rejected')}>Reject</button>}
                  </td>
                </tr>
              ))}
              {!contracts.length && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'rgba(160,185,220,0.4)' }}>No contracts yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
