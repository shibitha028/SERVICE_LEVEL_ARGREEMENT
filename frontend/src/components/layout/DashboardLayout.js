import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import styles from './DashboardLayout.module.css';

const navItems = [
  { to: '/dashboard',  label: 'Dashboard',     icon: '🏠' },
  { to: '/tickets',    label: 'Tickets',        icon: '🎫' },
  { to: '/sla-config', label: 'SLA Config',     icon: '⚙️',  adminOnly: true },
  { to: '/analytics',  label: 'Analytics',      icon: '📈' },
  { to: '/alerts',     label: 'Breach Alerts',  icon: '🚨' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('alert:new', () => setAlertCount(c => c + 1));
    return () => socket.disconnect();
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <nav className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>📊</div>
          <div>
            <div className={styles.brandName}>SLA Monitor</div>
            <div className={styles.brandSub}>Enterprise Suite</div>
          </div>
        </div>

        <div className={styles.navSection}>Main</div>
        {navItems.filter(n => !n.adminOnly || user?.role === 'admin').map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
            {item.label === 'Breach Alerts' && alertCount > 0 && (
              <span className={styles.alertBadge}>{alertCount}</span>
            )}
          </NavLink>
        ))}

        <div className={styles.sidebarFooter}>
          <div className={styles.userPill}>
            <div className={styles.avatar} style={{ background: user?.role === 'admin' ? 'linear-gradient(135deg,#7C3AED,#4C1D95)' : undefined }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userRole}>{user?.role === 'admin' ? 'Administrator' : 'Standard User'}</div>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">⏻</button>
          </div>
        </div>
      </nav>

      {/* Main area */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
