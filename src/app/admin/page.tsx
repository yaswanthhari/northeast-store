'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';
import type { User } from '@/types/store';

type AdminUser = User & {
  lastActive: string;
  createdAt: string;
};

interface SmtpStatus {
  environment: string;
  variables: Record<string, string>;
}

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [emailLogs, setEmailLogs] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, online: 0 });
  const [smtpStatus, setSmtpStatus] = useState<SmtpStatus | null>(null);

  const fetchEmailLogs = async () => {
    try {
      const res = await fetch('/api/admin/email-logs');
      if (res.ok) {
        const data = (await res.json()) as { logs: string };
        setEmailLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch email logs:', error);
    }
  };

  const fetchSmtpStatus = async () => {
    try {
      const res = await fetch('/api/admin/smtp-check');
      if (res.ok) {
        const data = (await res.json()) as SmtpStatus;
        setSmtpStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch SMTP status:', error);
    }
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        if (res.status === 401) {
          setErrorMsg('Unauthorized: You must be logged in as an ADMIN to access this dashboard.');
        } else {
          setErrorMsg('Failed to load user list from server.');
        }
        return;
      }
      const data = (await res.json()) as AdminUser[];
      setUsers(data);
      setErrorMsg(null);
      
      // Calculate stats
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
      const onlineCount = data.filter((u: AdminUser) => new Date(u.lastActive) > fifteenMinsAgo).length;
      setStats({ total: data.length, online: onlineCount });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchEmailLogs();
    fetchSmtpStatus();
    const interval = setInterval(() => {
      fetchUsers();
      fetchEmailLogs();
      fetchSmtpStatus();
    }, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Are you sure you want to change this user to ${newRole}?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      alert('Failed to update role');
    }
  };

  const isOnline = (lastActive: string) => {
    const activeDate = new Date(lastActive);
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    return activeDate > fifteenMinsAgo;
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.dashboardHeader}>
        <h1>Collaboration Dashboard</h1>
        <button onClick={fetchUsers} className={styles.actionButton}>Refresh Data</button>
      </div>

      {errorMsg && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 2rem',
          padding: '1.5rem',
          borderRadius: '16px',
          background: 'rgba(231, 76, 60, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(231, 76, 60, 0.2)',
          color: '#c0392b',
          fontWeight: 500,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(231, 76, 60, 0.05)'
        }}>
          <span>{errorMsg}</span>
          <button 
            onClick={fetchUsers} 
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '8px',
              border: '1px solid #c0392b',
              background: 'transparent',
              color: '#c0392b',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Retry
          </button>
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Team Members</h3>
          <div className={styles.value}>{stats.total}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Currently Online</h3>
          <div className={styles.value}>{stats.online}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Active Sessions</h3>
          <div className={styles.value}>{stats.online}</div>
        </div>
      </div>

      <div className={styles.userTableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>User</th>
              <th>Status</th>
              <th>Role</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Loading users...</td></tr>
            ) : users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{user.name || 'Anonymous'}</div>
                  <div style={{ fontSize: '0.8rem', color: '#636e72' }}>{user.email}</div>
                </td>
                <td>
                  <span className={`${styles.statusIndicator} ${isOnline(user.lastActive) ? styles.online : styles.offline}`}></span>
                  {isOnline(user.lastActive) ? 'Online' : 'Away'}
                </td>
                <td>
                  <span className={`${styles.roleBadge} ${user.role === 'ADMIN' ? styles.roleAdmin : styles.roleUser}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {new Date(user.lastActive).toLocaleString()}
                </td>
                <td>
                  <button 
                    onClick={() => toggleRole(user.id, user.role)}
                    className={`${styles.actionButton} ${user.role === 'ADMIN' ? styles.demoteBtn : styles.promoteBtn}`}
                  >
                    {user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.emailLogsSection} style={{ marginTop: '3rem' }}>
        <div className={styles.dashboardHeader}>
          <h2>SMTP Environment Variables Diagnostics</h2>
          <button onClick={fetchSmtpStatus} className={styles.actionButton}>Refresh Status</button>
        </div>
        <div className={styles.userTableContainer} style={{ padding: '1.5rem' }}>
          {smtpStatus ? (
            <div>
              <p style={{ marginBottom: '1.5rem', color: '#636e72', fontSize: '0.95rem' }}>
                Below is the real-time configuration of SMTP environment variables on the server. 
                If any say <strong style={{ color: '#e74c3c' }}>MISSING</strong>, they must be added to your Vercel Project Settings for <strong>Production</strong>.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {Object.entries(smtpStatus.variables || {}).map(([key, val]: [string, string]) => {
                  const isMissing = val.includes('MISSING') || val.includes('EMPTY');
                  return (
                    <div key={key} style={{
                      background: 'rgba(255, 255, 255, 0.5)',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.95rem' }}>{key}</span>
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '50px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: isMissing ? '#fde8e8' : '#e1fbf1',
                          color: isMissing ? '#9b1c1c' : '#03543f'
                        }}>
                          {isMissing ? 'Missing' : 'Loaded'}
                        </span>
                      </div>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        color: isMissing ? '#e74c3c' : '#2f3640',
                        wordBreak: 'break-all'
                      }}>{val}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '8px',
                background: '#fff8db',
                border: '1px solid #ffe0b2',
                color: '#856404',
                fontSize: '0.9rem'
              }}>
                <strong>⚠️ Vercel Production Note:</strong> Please make sure that under Vercel Settings &rarr; Environment Variables, these SMTP variables are enabled for <strong>Production</strong> (not just Preview/Development). If you checked them, trigger a <strong>Redeploy</strong> in Vercel to activate them.
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#636e72' }}>Loading SMTP Diagnostics...</p>
          )}
        </div>
      </div>

      <div className={styles.emailLogsSection} style={{ marginTop: '3rem' }}>
        <div className={styles.dashboardHeader}>
          <h2>Outgoing Order Emails (Simulation)</h2>
          <button onClick={fetchEmailLogs} className={styles.actionButton}>Refresh Logs</button>
        </div>
        <div className={styles.logsContainer}>
          <pre className={styles.logsPre}>
            {emailLogs || 'No order emails sent yet. Place an order to see logs here.'}
          </pre>
        </div>
      </div>
    </div>
  );
}
