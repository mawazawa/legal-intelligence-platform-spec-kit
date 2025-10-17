import { DashboardLayout } from '@/components/DashboardLayout';
import HousingCostCalculator from '@/components/HousingCostCalculator';

export default function HousingCostsPage() {
  return (
    <DashboardLayout>
      <HousingCostCalculator />
    </DashboardLayout>
  );
}
