import { DashboardLayout } from '@/components/DashboardLayout';
import { DashboardHome } from '@/components/DashboardHome';

export const metadata = {
  title: 'Dashboard - Legal Intelligence Platform',
  description: 'Case dashboard for FDI-21-794666: Mathieu Wauters v. Rosanna Alvero',
};

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  );
}
