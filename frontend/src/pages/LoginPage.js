import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const [form, setForm]     = useState({ email: 'user@acme.com', password: 'User@123' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={`${styles.iconWrap} ${styles.userIcon}`}>🔐</div>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.sub}>Sign in to your SLA Monitor account</p>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <label className={styles.label}>Email Address</label>
        <input className="form-input" type="email" value={form.email} required
          onChange={e => setForm({ ...form, email: e.target.value })} style={{ marginBottom: 14 }} />

        <label className={styles.label}>Password</label>
        <input className="form-input" type="password" value={form.password} required
          onChange={e => setForm({ ...form, password: e.target.value })} style={{ marginBottom: 14 }} />

        <div className={styles.row}>
          <label className={styles.checkLabel}><input type="checkbox" defaultChecked /> Remember me</label>
          <a href="#!" className={styles.forgot}>Forgot Password?</a>
        </div>

        <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginBottom: 10 }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className={styles.switch}>
          Admin? <Link to="/admin-login">Admin Login →</Link>
        </div>
      </form>
    </div>
  );
}
