import { jwtVerify, SignJWT } from 'jose';
import { cookies, headers } from 'next/headers';

// ✅ Crash loudly at startup if JWT_SECRET is missing — never use a fallback
if (!process.env.JWT_SECRET) {
  throw new Error(
    'FATAL: JWT_SECRET environment variable is not set. ' +
    'Add it to your .env.local file before starting the server.'
  );
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signToken(payload: Record<string, unknown>) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  // 1. Try Authorization: Bearer <token> header first (used by mobile app)
  try {
    const headerStore = await headers();
    const authHeader = headerStore.get('authorization') || headerStore.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const bearerToken = authHeader.slice(7).trim();
      if (bearerToken) {
        const payload = await verifyToken(bearerToken);
        if (payload) return payload;
      }
    }
  } catch {
    // headers() may fail in some contexts — fall through to cookie
  }

  // 2. Fall back to HTTP-only session cookie (used by web app)
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  return await verifyToken(token);
}