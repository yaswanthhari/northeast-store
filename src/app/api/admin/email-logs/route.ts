import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const logPath = path.join(process.cwd(), 'order-emails.log');
    if (!fs.existsSync(logPath)) {
      return NextResponse.json({ logs: '' });
    }

    const logs = fs.readFileSync(logPath, 'utf8');
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
  }
}
