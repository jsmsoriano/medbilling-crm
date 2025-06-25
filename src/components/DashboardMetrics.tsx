
import { Card } from '@/components/ui/card';
import MetricCard from '@/components/MetricCard';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Target,
  Clock
} from 'lucide-react';

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

interface DashboardMetricsProps {
  customTiles: DashboardTile[];
}

const DashboardMetrics = ({ customTiles }: DashboardMetricsProps) => {
  const iconMap = {
    DollarSign,
    Users,
    TrendingUp,
    CheckCircle,
    Target,
    Clock
  };

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

  return (
    <>
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
    </>
  );
};

export default DashboardMetrics;
