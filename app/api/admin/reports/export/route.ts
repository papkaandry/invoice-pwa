import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export async function GET() {
  if (!(await requireAdmin())) return new NextResponse('Forbidden', { status: 403 });
  const reports = await prisma.report.findMany({ include: { user: true, city: true }, orderBy: { createdAt: 'desc' } });
  const lines = ['id,date,city,tech,orderNumber,contractor,paidByCustomer,computedTotal'];
  for (const r of reports) {
    lines.push([r.id, r.date.toISOString(), r.city.name, r.user.name, r.orderNumber, r.contractorName, r.paidByCustomer.toString(), r.computedTotal.toString()].map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','));
  }
  return new NextResponse(lines.join('\n'), { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="reports.csv"' } });
}
