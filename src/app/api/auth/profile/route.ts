import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // ✅ Fix — never return password to the client
const updatedUser = await prisma.user.update({
  where: { id: session.id as string },
  data: { name },
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
  },
});
return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
