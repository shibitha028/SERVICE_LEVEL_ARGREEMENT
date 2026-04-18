import React, { useEffect, useState } from 'react';
import { getAlerts, acknowledgeAlert, escalateAlert } from '../api';
import PageHeader from '../components/common/PageHeader';

const severityColor = { Critical: 'var(--red)', High: 'var(--red)', Medium: 'var(--amber)', Low: 'var(--green)' };
const statusStyle   = { Open: 'badge-open', Acknowledged: 'badge-progress', Escalated: 'badge-rejected', Resolved: 'badge-closed' };

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  const load = () => getAlerts().then(r => setAlerts(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleAck = async (id) => { await acknowledgeAlert(id); load(); };
  const handleEsc = async (id) => { await escalateAlert(id);    load(); };

  const openAlerts   = alerts.filter(a => a.status === 'Open' || a.status === 'Escalated');
  const recentAlerts = alerts.slice(0, 8);

  return (
    <div>
      <PageHeader title="Breach Alerts" sub="Monitor and respond to active SLA breaches" />

      {/* Active breach cards */}
      {openAlerts.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40, marginBottom: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#6EE7B7', marginBottom: 6 }}>All clear — no active breaches</div>
          <div style={{ fontSize: 13, color: 'rgba(200,215,240,.6)' }}>All SLA contracts are within their defined thresholds</div>
        </div>
      )}

      {openAlerts.map(alert => (
        <div key={alert._id} style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 14, padding: 22, marginBottom: 16, position: 'relative', overflow: 'hidden',
        }}>
          {/* top accent line */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--red),rgba(239,68,68,0))' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11,
              background: 'rgba(239,68,68,.2)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20, flexShrink: 0,
              animation: 'pulse 2s infinite',
            }}>🚨</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#FCA5A5' }}>
                SLA Breach — {alert.breachType} Time Exceeded
              </div>
              <div style={{ fontSize: 12, color: 'rgba(252,165,165,.7)', marginTop: 2 }}>
                {alert.contract?.clientName} · {alert.ticket?.subject} · {new Date(alert.createdAt).toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 8, padding: '6px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#FCA5A5' }}>{alert.status.toUpperCase()}</div>
              <div style={{ fontSize: 10, color: 'rgba(252,165,165,.6)', textTransform: 'uppercase', letterSpacing: '.5px' }}>Status</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
            {[
              { label: 'Client',         value: alert.contract?.clientName },
              { label: 'Breach Type',    value: alert.breachType },
              { label: 'Elapsed Time',   value: `${alert.elapsedTimeMin}m`, warn: true },
              { label: 'SLA Limit',      value: `${alert.slaLimitMin}m` },
            ].map(d => (
              <div key={d.label} style={{ background: 'rgba(0,0,0,.2)', borderRadius: 9, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'rgba(252,165,165,.6)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 5, fontWeight: 600 }}>{d.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: d.warn ? '#FCA5A5' : '#F0F6FF' }}>{d.value ?? '—'}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {alert.status === 'Open' && (
              <button onClick={() => handleAck(alert._id)} style={{ padding: '9px 18px', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, background: 'rgba(16,185,129,.2)', color: '#6EE7B7', border: '1px solid rgba(16,185,129,.35)' }}>
                ✔ Acknowledge
              </button>
            )}
            {alert.status !== 'Escalated' && (
              <button onClick={() => handleEsc(alert._id)} style={{ padding: '9px 18px', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, background: 'rgba(245,158,11,.15)', color: '#FCD34D', border: '1px solid rgba(245,158,11,.3)' }}>
                📋 Escalate
              </button>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(252,165,165,.6)' }}>Penalty:</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#FCA5A5' }}>${(alert.penaltyApplied ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Recent alerts list */}
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F6FF', marginBottom: 16 }}>🔔 All Alerts</div>
        {recentAlerts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 24, color: 'rgba(160,185,220,.4)' }}>No alerts recorded yet</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recentAlerts.map(alert => (
            <div key={alert._id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.05)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: severityColor[alert.severity] ?? 'var(--amber)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#F0F6FF' }}>{alert.contract?.clientName ?? 'Unknown Client'}</div>
                <div style={{ fontSize: 12, color: 'rgba(200,215,240,.6)', marginTop: 1 }}>
                  {alert.ticket?.subject ?? 'Unknown Ticket'} · {alert.breachType} breach
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: 'rgba(160,185,220,.5)', marginBottom: 4 }}>{new Date(alert.createdAt).toLocaleDateString()}</div>
                <span className={`badge ${statusStyle[alert.status] ?? 'badge-pending'}`}>{alert.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4)} 50%{box-shadow:0 0 0 8px rgba(239,68,68,0)} }`}</style>
    </div>
  );
}
