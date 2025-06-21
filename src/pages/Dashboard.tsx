
import { Card } from '@/components/ui/card';
import { 
  DollarSign, 
  FileText, 
  Clock, 
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import RevenueChart from '@/components/RevenueChart';
import ClaimStatusChart from '@/components/ClaimStatusChart';
import RecentActivity from '@/components/RecentActivity';
import ClientOverview from '@/components/ClientOverview';

const Dashboard = () => {
  const metrics = [
    {
      title: 'Monthly Revenue',
      value: '$87,430',
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Claims Processed',
      value: '1,247',
      change: '+8.2%',
      trend: 'up' as const,
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Avg. Processing Time',
      value: '2.3 days',
      change: '-15.3%',
      trend: 'down' as const,
      icon: Clock,
      color: 'purple'
    },
    {
      title: 'Collection Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      title: 'Active Clients',
      value: '48',
      change: '+6',
      trend: 'up' as const,
      icon: Users,
      color: 'orange'
    },
    {
      title: 'Claims Approved',
      value: '1,156',
      change: '+9.1%',
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Claims Denied',
      value: '73',
      change: '-12.5%',
      trend: 'down' as const,
      icon: AlertCircle,
      color: 'red'
    },
    {
      title: 'AR Days',
      value: '28.5',
      change: '-5.2%',
      trend: 'down' as const,
      icon: Activity,
      color: 'indigo'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your medical billing performance and key metrics</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ClaimStatusChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <ClientOverview />
      </div>
    </div>
  );
};

export default Dashboard;
