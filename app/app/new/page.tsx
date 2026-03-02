import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NewReportForm } from '@/components/new-report-form';

export default async function NewReportPage() {
  const user = await requireUser();
  if (!user) redirect('/login');

  const materials = await prisma.material.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  return <main className="space-y-4"><h1 className="text-2xl font-bold">New Report</h1><NewReportForm materials={materials} blocked={!user.cityId} /></main>;
}
