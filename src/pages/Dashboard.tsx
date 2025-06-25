
import { useState, useEffect } from 'react';
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';
import DashboardCustomizer from '@/components/DashboardCustomizer';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardMetrics from '@/components/DashboardMetrics';
import DashboardCharts from '@/components/DashboardCharts';
import DashboardBottomSection from '@/components/DashboardBottomSection';

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
  const { clients, claims, loading } = useSpreadsheetData();
  const [customTiles, setCustomTiles] = useState<DashboardTile[]>([]);
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Calculate comprehensive metrics
  const totalRevenue = clients.reduce((sum, client) => sum + client.value, 0);
  const totalClients = clients.length;
  const totalClaims = claims.length;
  const approvedClaims = claims.filter(claim => claim.status === 'approved').length;
  const pendingClaims = claims.filter(claim => claim.status === 'pending').length;

  // Calculate rates and percentages
  const approvalRate = totalClaims > 0 ? ((approvedClaims / totalClaims) * 100).toFixed(1) : '0';
  const collectionRate = totalRevenue > 0 ? '94.2' : '0'; // Mock calculation

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader 
          showCustomizer={showCustomizer}
          onToggleCustomizer={() => setShowCustomizer(!showCustomizer)}
        />

        {/* Dashboard Customizer */}
        {showCustomizer && (
          <div className="mb-8">
            <DashboardCustomizer
              tiles={customTiles}
              onTilesChange={setCustomTiles}
            />
          </div>
        )}

        <DashboardMetrics customTiles={customTiles} />
        <DashboardCharts />
        <DashboardBottomSection />
      </div>
    </div>
  );
};

export default Dashboard;
