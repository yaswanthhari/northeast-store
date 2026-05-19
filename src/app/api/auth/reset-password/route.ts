import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { sendResetPasswordEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, token, newPassword } = body;

    // ─── STEP 1: Request OTP (email only sent) ───────────────────────
    if (!token && !newPassword) {
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

      // Always return success to prevent email enumeration attacks
      if (!user) {
        return NextResponse.json({ message: 'If this email exists, a reset code has been sent.' });
      }

      // Generate a 6-digit OTP and store its hash + expiry
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
      const expiry = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: hashedOtp,
          resetTokenExpiry: expiry,
        },
      });

      await sendResetPasswordEmail(normalizedEmail, user.name || 'User', otp);

      return NextResponse.json({ message: 'If this email exists, a reset code has been sent.' });
    }

    // ─── STEP 2: Verify OTP + Set New Password ───────────────────────
    if (!token || !newPassword || !email) {
      return NextResponse.json({ error: 'Email, OTP, and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        resetToken: hashedToken,
        resetTokenExpiry: { gt: new Date() }, // not expired
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired OTP. Please request a new one.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,        // ✅ clear token after use
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: 'Password has been reset successfully.' });

  // ✅ Fix
} catch (error) {
    console.error('Password reset API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}