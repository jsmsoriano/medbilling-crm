
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: string;
  description?: string;
}

const MetricCard = ({ title, value, change, trend, icon: Icon, color, description }: MetricCardProps) => {
  const colorClasses = {
    green: 'text-green-600 bg-green-50 border-green-200',
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    orange: 'text-orange-600 bg-orange-50 border-orange-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-current">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center border",
              colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
            )}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={cn(
                "text-sm font-medium",
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              )}>
                {change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
