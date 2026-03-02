import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdminPanel } from '@/components/admin-panel';

export default async function AdminPage() {
  const user = await requireUser();
  if (!user) redirect('/login');
  if (user.role !== 'admin') redirect('/app');

  const [cities, materials, users, reports] = await Promise.all([
    prisma.city.findMany({ orderBy: { name: 'asc' } }),
    prisma.material.findMany({ orderBy: { name: 'asc' } }),
    prisma.user.findMany({ include: { city: true }, orderBy: { createdAt: 'desc' } }),
    prisma.report.findMany({ include: { user: true, city: true }, orderBy: { createdAt: 'desc' }, take: 50 })
  ]);

  return <AdminPanel cities={cities} materials={materials} users={users} reports={reports} />;
}
