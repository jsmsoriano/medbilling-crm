
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface KPIItem {
  title: string;
  value: string;
  target: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
  redirectTo?: string;
}

interface KPIMetricsProps {
  kpis: KPIItem[];
}

const KPIMetrics = ({ kpis }: KPIMetricsProps) => {
  const navigate = useNavigate();

  const handleKPIClick = (kpi: KPIItem) => {
    if (kpi.redirectTo) {
      navigate(kpi.redirectTo);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {kpis.map((kpi) => (
        <Card 
          key={kpi.title} 
          className={`p-4 md:p-6 transition-all duration-200 ${
            kpi.redirectTo 
              ? 'cursor-pointer hover:shadow-lg hover:scale-105 hover:bg-gray-50' 
              : ''
          }`}
          onClick={() => handleKPIClick(kpi)}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600 leading-tight">{kpi.title}</h3>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{kpi.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl md:text-2xl font-bold text-gray-900">{kpi.value}</span>
              <span className="text-xs md:text-sm text-gray-500">/ {kpi.target}</span>
            </div>
            <div className="flex items-center">
              <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default KPIMetrics;
