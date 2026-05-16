import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    // Update last active status
    const { updateLastActive } = await import('@/lib/db');
    await updateLastActive(user.id as string);

    return NextResponse.json({ authenticated: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
