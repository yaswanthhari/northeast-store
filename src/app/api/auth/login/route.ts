import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findMockUserByEmail } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await findMockUserByEmail(normalizedEmail);
    
    const isPasswordValid = await bcrypt.compare(password, user?.password || '');
    if (!user || !isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
