'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout, checkSession } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (user) {
      setNewName(user.name);
    }
  }, [isAuthenticated, isLoading, router, user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (res.ok) {
        await checkSession();
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className={styles.dashboard}>
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Welcome, {user.name}</h1>
            <p className={styles.subtitle}>Manage your account and view orders.</p>
          </div>
          
          <button onClick={logout} className="btn btn-outline">
            Sign Out
          </button>
        </header>

        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Profile Information</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
                  Edit Profile
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className={styles.editForm}>
                <div className={styles.infoGroup}>
                  <label htmlFor="newName">Full Name</label>
                  <input
                    type="text"
                    id="newName"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit" disabled={isSaving} className="btn btn-primary">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      setNewName(user.name);
                    }} 
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className={styles.infoGroup}>
                  <label>Name</label>
                  <p>{user.name}</p>
                </div>
                <div className={styles.infoGroup}>
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className={styles.infoGroup}>
                  <label>Account Type</label>
                  <p className={styles.badge}>{user.role}</p>
                </div>
              </>
            )}
          </div>

          <div className={styles.card}>
            <h3>Recent Orders</h3>
            <div className={styles.emptyState}>
              <p>You haven&apos;t placed any orders yet.</p>
              <button onClick={() => router.push('/products')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
