import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export async function POST(req: Request) {
  if (!(await requireAdmin())) return new NextResponse('Forbidden', { status: 403 });
  const { userId, cityId, deactivate } = await req.json();
  const user = await prisma.user.update({ where: { id: userId }, data: { cityId, isActive: deactivate ? false : undefined } });
  return NextResponse.json(user);
}
