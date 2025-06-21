
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';
import MetricCard from '@/components/MetricCard';
import RevenueChart from '@/components/RevenueChart';
import ClaimStatusChart from '@/components/ClaimStatusChart';
import RecentActivity from '@/components/RecentActivity';
import FileImport from '@/components/FileImport';
import { DollarSign, Users, TrendingUp, FileText } from 'lucide-react';

const Dashboard = () => {
  const { clients, claims, loading, importFromFile, exportToCSV, loadData } = useSpreadsheetData();

  // Calculate metrics from spreadsheet data
  const totalRevenue = clients.reduce((sum, client) => sum + client.value, 0);
  const totalClients = clients.length;
  const activeClaims = claims.filter(claim => claim.status === 'processing' || claim.status === 'pending').length;
  const approvedClaims = claims.filter(claim => claim.status === 'approved').length;

  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
    },
    {
      title: 'Active Clients',
      value: totalClients.toString(),
      change: '+3.2%',
      icon: Users,
    },
    {
      title: 'Claims Processed',
      value: approvedClaims.toString(),
      change: '+8.1%',
      icon: TrendingUp,
    },
    {
      title: 'Pending Claims',
      value: activeClaims.toString(),
      change: '-2.4%',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Data from spreadsheet imports
        </div>
      </div>

      <FileImport
        onFileImport={importFromFile}
        onExport={exportToCSV}
        onRefresh={loadData}
        loading={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ClaimStatusChart />
      </div>

      <RecentActivity />
    </div>
  );
};

export default Dashboard;
