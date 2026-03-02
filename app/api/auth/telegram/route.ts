import { NextResponse } from 'next/server';
import { createSession, verifyTelegramHash } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const data = await req.json();
  if (!verifyTelegramHash(data)) {
    return new NextResponse('Invalid telegram hash', { status: 401 });
  }

  const telegramId = String(data.id);
  const name = [data.first_name, data.last_name].filter(Boolean).join(' ').trim();
  const isAdmin = process.env.ADMIN_TELEGRAM_ID === telegramId;

  const user = await prisma.user.upsert({
    where: { telegramId },
    update: {
      name,
      username: data.username,
      photoUrl: data.photo_url,
      role: isAdmin ? 'admin' : 'master',
      isActive: true
    },
    create: {
      telegramId,
      name,
      username: data.username,
      photoUrl: data.photo_url,
      role: isAdmin ? 'admin' : 'master'
    }
  });

  await createSession({ userId: user.id, role: user.role });
  return NextResponse.json({ ok: true });
}
