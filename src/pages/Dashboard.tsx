
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';
import MetricCard from '@/components/MetricCard';
import RevenueChart from '@/components/RevenueChart';
import ClaimStatusChart from '@/components/ClaimStatusChart';
import RecentActivity from '@/components/RecentActivity';
import FileImport from '@/components/FileImport';
import ClientOverview from '@/components/ClientOverview';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Target
} from 'lucide-react';

const Dashboard = () => {
  const { clients, claims, loading, importFromFile, exportToCSV, loadData } = useSpreadsheetData();

  // Calculate comprehensive metrics
  const totalRevenue = clients.reduce((sum, client) => sum + client.value, 0);
  const totalClients = clients.length;
  const totalClaims = claims.length;
  const approvedClaims = claims.filter(claim => claim.status === 'approved').length;
  const pendingClaims = claims.filter(claim => claim.status === 'pending').length;
  const processingClaims = claims.filter(claim => claim.status === 'processing').length;
  const deniedClaims = claims.filter(claim => claim.status === 'denied').length;

  // Calculate rates and percentages
  const approvalRate = totalClaims > 0 ? ((approvedClaims / totalClaims) * 100).toFixed(1) : '0';
  const collectionRate = totalRevenue > 0 ? '94.2' : '0'; // Mock calculation
  const avgRevenuePerClient = totalClients > 0 ? (totalRevenue / totalClients) : 0;

  const primaryMetrics = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'green',
      description: 'Monthly revenue generated'
    },
    {
      title: 'Active Clients',
      value: totalClients.toString(),
      change: '+8.3%',
      trend: 'up' as const,
      icon: Users,
      color: 'blue',
      description: 'Currently active clients'
    },
    {
      title: 'Claims Processed',
      value: approvedClaims.toString(),
      change: '+15.2%',
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'emerald',
      description: 'Successfully processed claims'
    },
    {
      title: 'Approval Rate',
      value: `${approvalRate}%`,
      change: '+2.1%',
      trend: 'up' as const,
      icon: Target,
      color: 'purple',
      description: 'Claims approval percentage'
    },
  ];

  const secondaryMetrics = [
    {
      title: 'Pending Claims',
      value: pendingClaims.toString(),
      change: '-5.4%',
      trend: 'down' as const,
      icon: Clock,
      color: 'orange',
      description: 'Claims awaiting processing'
    },
    {
      title: 'Collection Rate',
      value: `${collectionRate}%`,
      change: '+1.8%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'indigo',
      description: 'Successful collection percentage'
    },
    {
      title: 'Avg Revenue/Client',
      value: `$${avgRevenuePerClient.toLocaleString()}`,
      change: '+4.2%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'green',
      description: 'Average revenue per client'
    },
    {
      title: 'Total Claims',
      value: totalClaims.toString(),
      change: '+11.7%',
      trend: 'up' as const,
      icon: FileText,
      color: 'blue',
      description: 'All claims submitted'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Billing Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Comprehensive overview of your practice's billing performance
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* File Import Section */}
        <div className="mb-8">
          <FileImport
            onFileImport={importFromFile}
            onExport={exportToCSV}
            onRefresh={loadData}
            loading={loading}
          />
        </div>

        {/* Primary KPIs */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {primaryMetrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondaryMetrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RevenueChart />
          <ClaimStatusChart />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ClientOverview />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
