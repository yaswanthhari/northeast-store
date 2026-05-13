import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Welcome, {session.name as string}</h1>
            <p className={styles.subtitle}>Manage your account and view orders.</p>
          </div>
          
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="btn btn-outline">
              Sign Out
            </button>
          </form>
        </header>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Profile Information</h3>
            <div className={styles.infoGroup}>
              <label>Name</label>
              <p>{session.name as string}</p>
            </div>
            <div className={styles.infoGroup}>
              <label>Email</label>
              <p>{session.email as string}</p>
            </div>
            <div className={styles.infoGroup}>
              <label>Account Type</label>
              <p className={styles.badge}>{session.role as string}</p>
            </div>
          </div>

          <div className={styles.card}>
            <h3>Recent Orders</h3>
            <div className={styles.emptyState}>
              <p>You haven&apos;t placed any orders yet.</p>
              <a href="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Start Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
