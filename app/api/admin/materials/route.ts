import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export async function POST(req: Request) {
  if (!(await requireAdmin())) return new NextResponse('Forbidden', { status: 403 });
  const { name } = await req.json();
  const material = await prisma.material.create({ data: { name } });
  return NextResponse.json(material);
}
