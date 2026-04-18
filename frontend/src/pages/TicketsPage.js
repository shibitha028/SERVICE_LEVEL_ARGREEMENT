import React, { useEffect, useState } from 'react';
import { getTickets, createTicket, updateTicket } from '../api';
import PageHeader from '../components/common/PageHeader';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const CATEGORIES = ['Infrastructure', 'Performance', 'Security', 'Bug', 'Alerts', 'Other'];

const priorityColor = { Low: 'var(--green)', Medium: 'var(--amber)', High: 'var(--red)', Critical: 'var(--red)' };

export default function TicketsPage() {
  const [tickets, setTickets]   = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState({ subject: '', description: '', priority: 'Medium', category: 'Infrastructure' });
  const [saving, setSaving]     = useState(false);

  const load = () => getTickets().then(r => setTickets(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await createTicket(form); setShowModal(false); setForm({ subject:'', description:'', priority:'Medium', category:'Infrastructure' }); load(); }
    catch (err) { alert(err.response?.data?.message || 'Failed to create ticket'); }
    finally { setSaving(false); }
  };

  const handleStatus = async (id, status) => {
    await updateTicket(id, { status }); load();
  };

  const statusBadge = (s) => {
    if (s === 'Open')       return <span className="badge badge-open">Open</span>;
    if (s === 'In Progress') return <span className="badge badge-progress">In Progress</span>;
    return <span className="badge badge-closed">{s}</span>;
  };

  return (
    <div>
      <PageHeader title="Ticket Management" sub="View and manage all support tickets">
        <button className="btn-primary" onClick={() => setShowModal(true)}>＋ Create Ticket</button>
      </PageHeader>

      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F6FF', marginBottom: 16 }}>🎫 All Tickets</div>
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Subject</th><th>Category</th><th>Priority</th><th>Status</th><th>Created</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t._id}>
                <td style={{ color: 'rgba(160,185,220,0.5)', fontFamily: 'DM Mono, monospace', fontSize: 11 }}>#{t._id.slice(-6).toUpperCase()}</td>
                <td style={{ color: '#F0F6FF', fontWeight: 500, maxWidth: 200 }}>{t.subject}</td>
                <td>{t.category}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: priorityColor[t.priority], display: 'inline-block' }} />
                    {t.priority}
                  </span>
                </td>
                <td>{statusBadge(t.status)}</td>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td style={{ display: 'flex', gap: 6 }}>
                  {t.status !== 'Closed' && (
                    <button className="btn-edit" onClick={() => handleStatus(t._id, t.status === 'Open' ? 'In Progress' : 'Resolved')}>
                      {t.status === 'Open' ? 'Start' : 'Resolve'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!tickets.length && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'rgba(160,185,220,0.4)' }}>No tickets yet — create your first one above</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <form className="modal" onSubmit={handleCreate}>
            <div className="modal-header">
              <div className="modal-title">🎫 Create New Ticket</div>
              <button type="button" className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(160,185,220,0.6)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>Subject</label>
              <input className="form-input-sm" placeholder="Brief issue description" value={form.subject} required onChange={e => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(160,185,220,0.6)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>Description</label>
              <textarea className="form-input-sm" rows={3} placeholder="Detailed description..." value={form.description} required
                style={{ resize: 'vertical' }} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(160,185,220,0.6)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>Priority</label>
                <select className="form-input-sm" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'rgba(160,185,220,0.6)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>Category</label>
                <select className="form-input-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create Ticket'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
