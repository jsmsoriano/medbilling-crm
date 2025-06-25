
import { useState, useEffect } from 'react';
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';
import MetricCard from '@/components/MetricCard';
import RevenueChart from '@/components/RevenueChart';
import ClaimStatusChart from '@/components/ClaimStatusChart';
import RecentActivity from '@/components/RecentActivity';
import FileImport from '@/components/FileImport';
import ClientOverview from '@/components/ClientOverview';
import DashboardCustomizer from '@/components/DashboardCustomizer';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  BarChart3,
  Settings
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardTile {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
  description?: string;
  size: 'small' | 'medium' | 'large';
}

const Dashboard = () => {
  const { clients, claims, loading, importFromFile, exportToCSV, loadData } = useSpreadsheetData();
  const [customTiles, setCustomTiles] = useState<DashboardTile[]>([]);
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Calculate comprehensive metrics
  const totalRevenue = clients.reduce((sum, client) => sum + client.value, 0);
  const totalClients = clients.length;
  const totalClaims = claims.length;
  const approvedClaims = claims.filter(claim => claim.status === 'approved').length;
  const pendingClaims = claims.filter(claim => claim.status === 'pending').length;
  const deniedClaims = claims.filter(claim => claim.status === 'denied').length;

  // Calculate rates and percentages
  const approvalRate = totalClaims > 0 ? ((approvedClaims / totalClaims) * 100).toFixed(1) : '0';
  const collectionRate = totalRevenue > 0 ? '94.2' : '0'; // Mock calculation
  const avgRevenuePerClient = totalClients > 0 ? (totalRevenue / totalClients) : 0;

  // Performance data from the original Performance page
  const monthlyData = [
    { month: 'Jan', revenue: 65000, claims: 234, denialRate: 8.2, arDays: 32 },
    { month: 'Feb', revenue: 71000, claims: 267, denialRate: 7.8, arDays: 30 },
    { month: 'Mar', revenue: 68000, claims: 245, denialRate: 9.1, arDays: 34 },
    { month: 'Apr', revenue: 75000, claims: 289, denialRate: 6.5, arDays: 28 },
    { month: 'May', revenue: 82000, claims: 312, denialRate: 5.9, arDays: 26 },
    { month: 'Jun', revenue: 87430, claims: 347, denialRate: 5.8, arDays: 28.5 },
  ];

  const kpiMetrics = [
    {
      title: 'Net Collection Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      description: 'Percentage of collectible revenue actually collected'
    },
    {
      title: 'First Pass Resolution',
      value: '87.3%',
      change: '+5.2%',
      trend: 'up',
      description: 'Claims approved on first submission'
    },
    {
      title: 'Days in AR',
      value: '28.5',
      change: '-5.2%',
      trend: 'down',
      description: 'Average days to collect payment'
    },
    {
      title: 'Denial Rate',
      value: '5.8%',
      change: '-0.1%',
      trend: 'down',
      description: 'Percentage of claims initially denied'
    }
  ];

  const defaultTiles: DashboardTile[] = [
    {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'green',
      description: 'Monthly revenue generated',
      size: 'medium'
    },
    {
      id: 'active-clients',
      title: 'Active Clients',
      value: totalClients.toString(),
      change: '+8.3%',
      trend: 'up',
      icon: 'Users',
      color: 'blue',
      description: 'Currently active clients',
      size: 'medium'
    },
    {
      id: 'claims-processed',
      title: 'Claims Processed',
      value: approvedClaims.toString(),
      change: '+15.2%',
      trend: 'up',
      icon: 'CheckCircle',
      color: 'emerald',
      description: 'Successfully processed claims',
      size: 'medium'
    },
    {
      id: 'approval-rate',
      title: 'Approval Rate',
      value: `${approvalRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: 'Target',
      color: 'purple',
      description: 'Claims approval percentage',
      size: 'medium'
    },
    {
      id: 'collection-rate',
      title: 'Collection Rate',
      value: `${collectionRate}%`,
      change: '+1.8%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'indigo',
      description: 'Successful collection percentage',
      size: 'medium'
    },
    {
      id: 'pending-claims',
      title: 'Pending Claims',
      value: pendingClaims.toString(),
      change: '-5.4%',
      trend: 'down',
      icon: 'Clock',
      color: 'orange',
      description: 'Claims awaiting processing',
      size: 'medium'
    }
  ];

  // Load custom tiles from localStorage on mount
  useEffect(() => {
    const savedTiles = localStorage.getItem('dashboard-tiles');
    if (savedTiles) {
      try {
        setCustomTiles(JSON.parse(savedTiles));
      } catch (error) {
        console.error('Error loading custom tiles:', error);
        setCustomTiles(defaultTiles);
      }
    } else {
      setCustomTiles(defaultTiles);
    }
  }, [totalRevenue, totalClients, approvedClaims, approvalRate, collectionRate, pendingClaims]);

  const iconMap = {
    DollarSign,
    Users,
    TrendingUp,
    FileText,
    Clock,
    CheckCircle,
    AlertTriangle,
    Target
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Billing Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Comprehensive overview of your practice's billing performance and analytics
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCustomizer(!showCustomizer)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Customizer */}
        {showCustomizer && (
          <div className="mb-8">
            <DashboardCustomizer
              tiles={customTiles}
              onTilesChange={setCustomTiles}
            />
          </div>
        )}

        {/* File Import Section */}
        <div className="mb-8">
          <FileImport
            onFileImport={importFromFile}
            onExport={exportToCSV}
            onRefresh={loadData}
            loading={loading}
          />
        </div>

        {/* Custom Dashboard Tiles */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {customTiles.map((tile) => {
              const IconComponent = iconMap[tile.icon as keyof typeof iconMap] || DollarSign;
              return (
                <MetricCard
                  key={tile.id}
                  title={tile.title}
                  value={tile.value}
                  change={tile.change}
                  trend={tile.trend}
                  icon={IconComponent}
                  color={tile.color}
                  description={tile.description}
                />
              );
            })}
          </div>
        </div>

        {/* Performance KPIs */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Advanced Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiMetrics.map((kpi, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                  <Target className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
                </div>
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">{kpi.change}</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
                <p className="text-xs text-gray-500">{kpi.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Charts Section - Combined Revenue and Claims */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563eb" 
                    fill="#2563eb"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [value, 'Claims']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="claims" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Legacy Charts Section */}
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
