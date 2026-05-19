import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    // ✅ Fix 3: only update lastActive if it's been more than 1 hour
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id as string },
      select: { lastActive: true },
    });

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (dbUser && dbUser.lastActive < oneHourAgo) {
      const { updateLastActive } = await import('@/lib/db');
      await updateLastActive(user.id as string);
    }

    return NextResponse.json({ authenticated: true, user }, { status: 200 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}