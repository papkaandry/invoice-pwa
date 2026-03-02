import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const COOKIE_NAME = 'invoice_session';

export type SessionPayload = { userId: number; role: 'admin' | 'master' };

export function verifyTelegramHash(data: Record<string, string>) {
  const botToken = process.env.TELEGRAM_LOGIN_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return false;
  const { hash, ...rest } = data;
  const checkString = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join('\n');
  const secret = crypto.createHash('sha256').update(botToken).digest();
  const computed = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
  return computed === hash;
}

export async function createSession(payload: SessionPayload) {
  const token = jwt.sign(payload, process.env.SESSION_SECRET!, { expiresIn: '14d' });
  cookies().set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' });
}

export function clearSession() {
  cookies().delete(COOKIE_NAME);
}

export function getSession(): SessionPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.SESSION_SECRET!) as SessionPayload;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const session = getSession();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId }, include: { city: true } });
}
