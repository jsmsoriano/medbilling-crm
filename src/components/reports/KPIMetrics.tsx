
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

interface KPIItem {
  title: string;
  value: string;
  target: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
}

interface KPIMetricsProps {
  kpis: KPIItem[];
}

const KPIMetrics = ({ kpis }: KPIMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
            <Target className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
            <span className="text-sm text-gray-500">/ {kpi.target}</span>
          </div>
          <div className="flex items-center mb-2">
            {kpi.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
            )}
            <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-green-600'}`}>
              {kpi.change}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
          <p className="text-xs text-gray-500">{kpi.description}</p>
        </Card>
      ))}
    </div>
  );
};

export default KPIMetrics;
