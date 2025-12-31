
// app/dashboard/page.tsx
import { requireUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from './dashboardclient';

export default async function DashboardPage() {
  try {
    const user = await requireUser();
    return <DashboardClient user={user} />;
  } catch (error) {
    redirect('/sign-in');
  }
}