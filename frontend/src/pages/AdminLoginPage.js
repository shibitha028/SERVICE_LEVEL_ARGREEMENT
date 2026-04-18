import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api';
import styles from './AuthPage.module.css';

export default function AdminLoginPage() {
  const [form, setForm]       = useState({ email: 'admin@acme.com', password: 'Admin@123' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await loginUser(form);
      if (data.role !== 'admin') { setError('Not an admin account'); setLoading(false); return; }
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.screen} style={{ background: 'linear-gradient(135deg,#0A0A20 0%,#1A0830 40%,#0A0A20 100%)' }}>
      <div className={styles.orb1} style={{ background: 'rgba(139,92,246,0.2)' }} />
      <div className={styles.orb2} style={{ background: 'rgba(37,99,235,0.12)' }} />
      <form className={styles.card} style={{ borderColor: 'rgba(139,92,246,0.2)' }} onSubmit={handleSubmit}>
        <div className={`${styles.iconWrap} ${styles.adminIcon}`}>🛡️</div>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.sub}>Restricted access — authorized personnel only</p>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <label className={styles.label}>Admin Email</label>
        <input className="form-input" type="email" value={form.email} required
          onChange={e => setForm({ ...form, email: e.target.value })} style={{ marginBottom: 14 }} />

        <label className={styles.label}>Admin Password</label>
        <input className="form-input" type="password" value={form.password} required
          onChange={e => setForm({ ...form, password: e.target.value })} style={{ marginBottom: 20 }} />

        <button className="btn-primary" type="submit" disabled={loading}
          style={{ width: '100%', marginBottom: 10, background: 'linear-gradient(135deg,#7C3AED,#4C1D95)' }}>
          {loading ? 'Authenticating...' : 'Authenticate'}
        </button>

        <div className={styles.switch}>
          Back to <Link to="/login">User Login</Link>
        </div>
      </form>
    </div>
  );
}
