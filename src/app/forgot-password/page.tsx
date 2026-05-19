'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import styles from '../login/login.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ─── STEP 1: Send OTP to email ───────────────────────────────────
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2); // Move to OTP entry
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── STEP 2: Verify OTP + reset password ─────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: otp, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(3); // Success screen
      } else {
        setError(data.error || 'Invalid or expired OTP. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>

        {/* ── STEP 1: Enter Email ─────────────────────────── */}
        {step === 1 && (
          <>
            <div className={styles.authHeader}>
              <h1 className={styles.title}>Account Recovery</h1>
              <p className={styles.subtitle}>
                Enter your registered email and we will send you a one-time password.
              </p>
            </div>

            {error && (
              <div className={styles.errorMessage} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRequestOtp} className={styles.authForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Registered Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 2: Enter OTP + New Password ───────────── */}
        {step === 2 && (
          <>
            <div className={styles.authHeader}>
              <h1 className={styles.title}>Enter OTP</h1>
              <p className={styles.subtitle}>
                We sent a 6-digit code to <strong>{email}</strong>. It expires in 15 minutes.
              </p>
            </div>

            {error && (
              <div className={styles.errorMessage} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className={styles.authForm}>
              <div className={styles.formGroup}>
                <label htmlFor="otp">6-Digit OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className={styles.input}
                  placeholder="e.g. 482910"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className={styles.input}
                  placeholder="At least 6 characters"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Reset Password'}
              </button>

              <button
                type="button"
                onClick={() => { setStep(1); setError(''); setOtp(''); }}
                style={{ width: '100%', marginTop: '0.5rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                ← Use a different email
              </button>
            </form>
          </>
        )}

        {/* ── STEP 3: Success ─────────────────────────────── */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ display: 'inline-flex', background: '#e6fffa', color: '#319795', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <CheckCircle2 size={48} />
            </div>
            <h1 className={styles.title} style={{ color: '#2d6a4f', fontSize: '1.8rem', marginBottom: '0.75rem' }}>
              Password Reset Complete!
            </h1>
            <p className={styles.subtitle} style={{ marginBottom: '2rem' }}>
              Your password has been updated. You can now sign in with your new password.
            </p>
            <Link
              href="/login"
              className="btn btn-primary"
              style={{ display: 'block', width: '100%', padding: '1rem', textAlign: 'center', textDecoration: 'none' }}
            >
              Back to Sign In
            </Link>
          </div>
        )}

        <div className={styles.authFooter}>
          <p>
            Remembered your credentials?{' '}
            <Link href="/login" className={styles.link}>Sign In</Link>
          </p>
        </div>

      </div>
    </div>
  );
}