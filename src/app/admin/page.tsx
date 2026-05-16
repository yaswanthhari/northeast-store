'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  lastActive: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, online: 0 });

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setUsers(data);
      
      // Calculate stats
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
      const onlineCount = data.filter((u: User) => new Date(u.lastActive) > fifteenMinsAgo).length;
      setStats({ total: data.length, online: onlineCount });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 30000); // Refresh every 30s
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
    </div>
  );
}
