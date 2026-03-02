import { requireUser } from '@/lib/auth';

export async function requireAdmin() {
  const user = await requireUser();
  return user?.role === 'admin' ? user : null;
}
