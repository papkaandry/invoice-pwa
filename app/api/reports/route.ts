import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reportSchema } from '@/lib/validation';

const d = (n: number) => new Prisma.Decimal(n.toFixed(2));

export async function POST(req: Request) {
  const user = await requireUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });
  if (!user.cityId) return new NextResponse('Contact admin', { status: 403 });

  const parsed = reportSchema.safeParse(await req.json());
  if (!parsed.success) return new NextResponse(parsed.error.message, { status: 400 });
  const data = parsed.data;

  const computedTotal = data.paidByCustomer + data.extraWork + data.tips - data.tolls;

  const report = await prisma.report.create({
    data: {
      userId: user.id,
      cityId: user.cityId,
      contractorName: data.contractorName,
      date: new Date(data.date),
      orderNumber: data.orderNumber,
      paidByCustomer: d(data.paidByCustomer),
      paymentReceiver: data.paymentReceiver,
      distanceMiles: data.distanceMiles,
      ...data.services,
      extraWork: d(data.extraWork),
      extraMaterial: d(data.extraMaterial),
      tolls: d(data.tolls),
      tips: d(data.tips),
      comments: data.comments,
      messageFlag: data.messageFlag,
      addons: data.addons,
      techsQuantity: data.techsQuantity,
      computedTotal: d(computedTotal),
      computedCompanyTake: d(0),
      computedTechTake: d(0),
      materials: {
        create: data.materials.filter((m) => m.qty > 0).map((m) => ({ materialId: m.materialId, qty: m.qty }))
      },
      media: {
        create: data.media.map((m) => ({ ...m, storageStatus: 'pending' }))
      }
    }
  });

  return NextResponse.json({ id: report.id, computedTotal: report.computedTotal.toString() });
}
