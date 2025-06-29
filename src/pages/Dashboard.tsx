
import { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardMetrics from '@/components/DashboardMetrics';
import DashboardCharts from '@/components/DashboardCharts';
import DashboardBottomSection from '@/components/DashboardBottomSection';

const Dashboard = () => {
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Mock custom tiles data
  const customTiles = [
    {
      id: '1',
      title: 'Monthly Revenue',
      value: '$124,500',
      change: '+12.5%',
      trend: 'up' as const,
      icon: 'DollarSign',
      color: 'blue',
      description: 'Total revenue for this month',
      size: 'medium' as const
    },
    {
      id: '2',
      title: 'Active Clients',
      value: '247',
      change: '+8.2%',
      trend: 'up' as const,
      icon: 'Users',
      color: 'green',
      description: 'Currently active client accounts',
      size: 'medium' as const
    },
    {
      id: '3',
      title: 'Claims Processed',
      value: '1,834',
      change: '+15.3%',
      trend: 'up' as const,
      icon: 'CheckCircle',
      color: 'purple',
      description: 'Claims processed this month',
      size: 'medium' as const
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center w-full">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your billing operations and key metrics</p>
      </div>
      
      <DashboardHeader 
        showCustomizer={showCustomizer}
        onToggleCustomizer={() => setShowCustomizer(!showCustomizer)}
      />
      <DashboardMetrics customTiles={customTiles} />
      <DashboardCharts />
      <DashboardBottomSection />
    </div>
  );
};

export default Dashboard;
