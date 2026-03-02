import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const user = await requireUser();
  if (!user) redirect('/login');

  const reports = await prisma.report.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <main className="space-y-4">
      <div className="card">
        <h1 className="text-xl font-bold">Hi, {user.name}</h1>
        <p className="text-sm">City: {user.city?.name ?? 'Not assigned'}</p>
      </div>
      {!user.cityId && <p className="card text-amber-700">Contact admin. You cannot create reports without city assignment.</p>}
      <Link href="/app/new" className="block text-center bg-blue-600 text-white py-3 rounded-lg">New Report</Link>
      <section className="card">
        <h2 className="font-semibold mb-2">Recent Reports</h2>
        <ul className="text-sm space-y-1">
          {reports.map((r) => <li key={r.id}>#{r.id} • {r.orderNumber} • ${r.computedTotal.toString()}</li>)}
        </ul>
      </section>
      {user.role === 'admin' && <Link href="/admin" className="text-blue-700 underline">Go to Admin</Link>}
    </main>
  );
}
