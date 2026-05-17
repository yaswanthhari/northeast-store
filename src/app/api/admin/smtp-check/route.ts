import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const checkVar = (name: string) => {
    const val = process.env[name];
    if (!val) return 'MISSING (undefined)';
    const trimmed = val.trim();
    if (trimmed.length === 0) return 'EMPTY (whitespace)';
    
    // Mask value for security
    if (name === 'SMTP_PASS' || name === 'DATABASE_URL' || name === 'DIRECT_URL') {
      return `PRESENT (Length: ${trimmed.length}, Starts with: "${trimmed.substring(0, Math.min(4, trimmed.length))}...")`;
    }
    return `PRESENT ("${trimmed}")`;
  };

  return NextResponse.json({
    environment: process.env.NODE_ENV || 'unknown',
    variables: {
      SMTP_HOST: checkVar('SMTP_HOST'),
      SMTP_PORT: checkVar('SMTP_PORT'),
      SMTP_SECURE: checkVar('SMTP_SECURE'),
      SMTP_USER: checkVar('SMTP_USER'),
      SMTP_PASS: checkVar('SMTP_PASS'),
      SMTP_FROM: checkVar('SMTP_FROM'),
      DATABASE_URL: checkVar('DATABASE_URL'),
    }
  });
}
