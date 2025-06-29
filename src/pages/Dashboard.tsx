
import DashboardHeader from '@/components/DashboardHeader';
import DashboardMetrics from '@/components/DashboardMetrics';
import DashboardCharts from '@/components/DashboardCharts';
import DashboardBottomSection from '@/components/DashboardBottomSection';

const Dashboard = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center w-full">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your billing operations and key metrics</p>
      </div>
      
      <DashboardHeader />
      <DashboardMetrics />
      <DashboardCharts />
      <DashboardBottomSection />
    </div>
  );
};

export default Dashboard;
