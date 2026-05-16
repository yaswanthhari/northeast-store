import { NextResponse } from 'next/server';
import { findMockUserByEmail, saveMockUser } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await findMockUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // In a real app, hash the password using bcrypt!
    const newUser = { name, email, password };
    const savedUser = await saveMockUser(newUser);

    const token = await signToken({ id: savedUser.id, email: savedUser.email, role: savedUser.role, name: savedUser.name });
    
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

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
